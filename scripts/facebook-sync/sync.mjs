#!/usr/bin/env node
/**
 * Facebook → Recent Work draft sync for Shutter Envy.
 *
 * Fetches recent Page posts, classifies install albums vs promo content,
 * downloads images into drafts/facebook-sync/<id>/, optionally opens a draft
 * GitHub PR, and pings Telegram.
 *
 * Usage:
 *   node scripts/facebook-sync/sync.mjs --seed
 *   node scripts/facebook-sync/sync.mjs --dry-run
 *   node scripts/facebook-sync/sync.mjs
 *   node scripts/facebook-sync/sync.mjs --limit 10
 *   node scripts/facebook-sync/sync.mjs --force <postId>
 *   node scripts/facebook-sync/sync.mjs --no-pr
 *   node scripts/facebook-sync/sync.mjs --no-telegram
 *   node scripts/facebook-sync/sync.mjs --ci
 */

import { spawnSync } from 'node:child_process';
import {
	mkdirSync,
	writeFileSync,
	readFileSync,
	existsSync,
	createWriteStream,
} from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { classifyPost, guessLocation, suggestSlug } from './classify.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const STATE_PATH = join(__dirname, 'state.json');
const DRAFTS_ROOT = join(ROOT, 'drafts/facebook-sync');
const GRAPH = 'https://graph.facebook.com/v21.0';
const POST_FIELDS = [
	'id',
	'message',
	'created_time',
	'permalink_url',
	'full_picture',
	'attachments{media_type,type,title,url,media,subattachments{media_type,type,media,url}}',
].join(',');

function loadDotEnv() {
	const envPath = join(ROOT, '.env');
	if (!existsSync(envPath)) return;
	for (const line of readFileSync(envPath, 'utf8').split('\n')) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;
		const eq = trimmed.indexOf('=');
		if (eq < 0) continue;
		const key = trimmed.slice(0, eq).trim();
		let val = trimmed.slice(eq + 1).trim();
		if (
			(val.startsWith('"') && val.endsWith('"')) ||
			(val.startsWith("'") && val.endsWith("'"))
		) {
			val = val.slice(1, -1);
		}
		if (!(key in process.env)) process.env[key] = val;
	}
}

function parseArgs(argv) {
	const opts = {
		seed: false,
		dryRun: false,
		noPr: false,
		noTelegram: false,
		ci: false,
		limit: 15,
		force: null,
	};
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a === '--seed') opts.seed = true;
		else if (a === '--dry-run') opts.dryRun = true;
		else if (a === '--no-pr') opts.noPr = true;
		else if (a === '--no-telegram') opts.noTelegram = true;
		else if (a === '--ci') opts.ci = true;
		else if (a === '--limit') opts.limit = Number(argv[++i]) || 15;
		else if (a === '--force') opts.force = argv[++i];
		else if (a === '--help' || a === '-h') opts.help = true;
	}
	if (opts.ci) {
		opts.noPr = false;
	}
	return opts;
}

function requireEnv(keys) {
	const missing = keys.filter((k) => !process.env[k]?.trim());
	if (missing.length) {
		throw new Error(`Missing env: ${missing.join(', ')} (see .env)`);
	}
}

async function graphGet(path, params = {}) {
	const url = new URL(`${GRAPH}/${path.replace(/^\//, '')}`);
	url.searchParams.set('access_token', process.env.META_PAGE_ACCESS_TOKEN);
	for (const [k, v] of Object.entries(params)) {
		if (v != null) url.searchParams.set(k, String(v));
	}

	let lastErr;
	for (let attempt = 1; attempt <= 3; attempt++) {
		const res = await fetch(url, {
			headers: { 'User-Agent': 'shutter-envy-facebook-sync/0.1' },
		});
		const text = await res.text();
		let body;
		try {
			body = JSON.parse(text);
		} catch {
			lastErr = new Error(`Graph API ${res.status}: ${text.slice(0, 200)}`);
			if (res.status >= 500 && attempt < 3) {
				await new Promise((r) => setTimeout(r, attempt * 1000));
				continue;
			}
			throw lastErr;
		}
		if (!res.ok) {
			const msg = body?.error?.message || res.statusText;
			lastErr = new Error(`Graph API ${res.status}: ${msg}`);
			if (res.status >= 500 && attempt < 3) {
				await new Promise((r) => setTimeout(r, attempt * 1000));
				continue;
			}
			throw lastErr;
		}
		return body;
	}
	throw lastErr;
}

function extractImageUrls(post) {
	const urls = [];
	const seen = new Set();
	const push = (src) => {
		if (!src || seen.has(src)) return;
		seen.add(src);
		urls.push(src);
	};

	const attachments = post.attachments?.data || [];
	for (const att of attachments) {
		const subs = att.subattachments?.data || [];
		if (subs.length > 0) {
			for (const sub of subs) {
				push(sub.media?.image?.src);
			}
		} else {
			push(att.media?.image?.src);
		}
	}
	if (urls.length === 0) push(post.full_picture);
	return urls;
}

function attachmentTypes(post) {
	return (post.attachments?.data || []).map(
		(a) => a.type || a.media_type || 'unknown',
	);
}

function loadState() {
	if (!existsSync(STATE_PATH)) {
		return { seenPostIds: [], lastRunAt: null, watchFrom: null };
	}
	return JSON.parse(readFileSync(STATE_PATH, 'utf8'));
}

function saveState(state) {
	writeFileSync(STATE_PATH, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
}

async function fetchPosts({ limit, paginate = false, maxPosts = 100 }) {
	const pageId = process.env.META_PAGE_ID;
	const pageSize = Math.min(limit, 25);
	let feed = await graphGet(`${pageId}/posts`, {
		fields: POST_FIELDS,
		limit: pageSize,
	});
	const posts = [...(feed.data || [])];

	while (paginate && feed.paging?.next && posts.length < maxPosts) {
		const nextUrl = new URL(feed.paging.next);
		const after = nextUrl.searchParams.get('after');
		if (!after) break;
		feed = await graphGet(`${pageId}/posts`, {
			fields: POST_FIELDS,
			limit: pageSize,
			after,
		});
		const batch = feed.data || [];
		if (batch.length === 0) break;
		posts.push(...batch);
	}

	return posts.slice(0, maxPosts);
}

function isBeforeWatchFrom(post, watchFrom) {
	if (!watchFrom) return false;
	const created = Date.parse(post.created_time);
	const from = Date.parse(watchFrom);
	if (Number.isNaN(created) || Number.isNaN(from)) return false;
	return created < from;
}

function safeDirName(postId) {
	return postId.replace(/[^a-zA-Z0-9_-]/g, '_');
}

function extFromUrl(url) {
	try {
		const path = new URL(url).pathname.toLowerCase();
		if (path.endsWith('.png')) return 'png';
		if (path.endsWith('.webp')) return 'webp';
		if (path.endsWith('.gif')) return 'gif';
	} catch {
		/* ignore */
	}
	return 'jpg';
}

async function downloadImage(url, destPath) {
	const res = await fetch(url, {
		headers: { 'User-Agent': 'shutter-envy-facebook-sync/0.1' },
	});
	if (!res.ok) throw new Error(`Download failed ${res.status}: ${url.slice(0, 80)}`);
	await pipeline(Readable.fromWeb(res.body), createWriteStream(destPath));
}

function writeBrief({ post, classification, guess, slug, imageFiles, draftDir }) {
	const relImages = imageFiles.map((f) => relative(ROOT, f));
	const yyyyMm = String(post.created_time).slice(0, 7).replace('-', '/');
	const lines = [
		`# Facebook → Recent Work draft`,
		``,
		`> Auto-generated by \`scripts/facebook-sync/sync.mjs\`. Review before merging.`,
		``,
		`## Source`,
		``,
		`- **Post ID:** \`${post.id}\``,
		`- **Created:** ${post.created_time}`,
		`- **Facebook:** ${post.permalink_url || '(none)'}`,
		`- **Classifier:** ${classification.verdict} (score ${classification.score})`,
		`- **Reasons:** ${classification.reasons.join('; ') || '—'}`,
		``,
		`## Suggested fields`,
		``,
		`- **slug:** \`${slug}\``,
		`- **location:** ${guess.location || '_TBD_'}`,
		`- **locationTag:** ${guess.locationTag || '_TBD_'}`,
		`- **datePublished:** ${String(post.created_time).slice(0, 10)}`,
		`- **suggested image path:** \`public/wp-content/uploads/${yyyyMm}/...\` (match existing project posts)`,
		``,
		`## Caption (raw)`,
		``,
		'```',
		(post.message || '').trim(),
		'```',
		``,
		`## Images`,
		``,
		...relImages.map((p, i) => `${i + 1}. \`${p}\``),
		``,
		`## Checklist (Shutter Envy publish path)`,
		``,
		`- [ ] Confirm this is a Recent Work install (not promo / competition / teaser)`,
		`- [ ] Confirm town, room, product type; crop Instagram/Facebook “New Install” borders if present`,
		`- [ ] Create \`src/content/blog/${slug}.md\` (frontmatter like other project posts)`,
		`- [ ] Copy polished images under \`public/wp-content/uploads/${yyyyMm}/\` (do not change live SEO image URLs for older media)`,
		`- [ ] Register slug in \`src/data/blog-categories.ts\` → \`'${slug}': 'projects'\``,
		`- [ ] Prepend gallery tile on \`src/content/pages/recent-work.md\` (src, alt, href: \`/${slug}/\`)`,
		`- [ ] Delete this draft folder once the case study is live`,
		``,
		`## Cursor prompt`,
		``,
		'```',
		`Finish the Facebook Recent Work draft for ${guess.location || slug}`,
		'```',
		``,
	];
	writeFileSync(join(draftDir, 'BRIEF.md'), lines.join('\n'), 'utf8');

	const manifest = {
		facebookPostId: post.id,
		createdTime: post.created_time,
		permalinkUrl: post.permalink_url || null,
		message: post.message || '',
		classification,
		suggested: {
			slug,
			location: guess.location || null,
			locationTag: guess.locationTag || null,
			datePublished: String(post.created_time).slice(0, 10),
			blogPath: `src/content/blog/${slug}.md`,
			publishChecklist: [
				'blog markdown',
				'blog-categories.ts projects map',
				'recent-work.md gallery tile',
			],
		},
		images: relImages,
	};
	writeFileSync(
		join(draftDir, 'manifest.json'),
		`${JSON.stringify(manifest, null, 2)}\n`,
		'utf8',
	);
}

async function createDraftForPost(post, classification) {
	const imageUrls = extractImageUrls(post);
	const guess = guessLocation(post.message || '');
	const slug = suggestSlug(post.message || '', guess);
	const draftDir = join(DRAFTS_ROOT, safeDirName(post.id));
	const imagesDir = join(draftDir, 'images');
	mkdirSync(imagesDir, { recursive: true });

	const imageFiles = [];
	for (let i = 0; i < imageUrls.length; i++) {
		const ext = extFromUrl(imageUrls[i]);
		const dest = join(imagesDir, `${String(i + 1).padStart(2, '0')}.${ext}`);
		await downloadImage(imageUrls[i], dest);
		imageFiles.push(dest);
	}

	writeBrief({ post, classification, guess, slug, imageFiles, draftDir });
	return { draftDir, slug, guess, imageCount: imageFiles.length };
}

function git(args, opts = {}) {
	return spawnSync('git', args, {
		cwd: ROOT,
		encoding: 'utf8',
		...opts,
	});
}

function resolveGithubToken() {
	return (
		process.env.FACEBOOK_SYNC_GITHUB_TOKEN?.trim() ||
		process.env.GH_TOKEN?.trim() ||
		process.env.GITHUB_TOKEN?.trim() ||
		''
	);
}

function gh(args, opts = {}) {
	const token = resolveGithubToken();
	return spawnSync('gh', args, {
		cwd: ROOT,
		encoding: 'utf8',
		...opts,
		env: {
			...process.env,
			...(token ? { GH_TOKEN: token, GITHUB_TOKEN: token } : {}),
		},
	});
}

function getGithubRepoSlug() {
	const remote = git(['remote', 'get-url', 'origin']);
	const url = (remote.stdout || '').trim();
	const m =
		url.match(/github\.com[:/](.+?)(?:\.git)?$/i) ||
		url.match(/([^/]+\/[^/]+?)(?:\.git)?$/);
	return m ? m[1].replace(/\.git$/, '') : 'bendot1988/shutter-envy';
}

function branchWebUrl(branch) {
	return `https://github.com/${getGithubRepoSlug()}/tree/${encodeURIComponent(branch)}`;
}

function cursorPromptForDraft(locationOrSlug) {
	const label = locationOrSlug || 'this Facebook draft';
	return `Finish the Facebook Recent Work draft for ${label}`;
}

function trackedDirtyOutsideDrafts() {
	const status = git(['status', '--porcelain']);
	if (status.status !== 0) {
		return { dirty: true, error: status.stderr || 'git status failed' };
	}
	const lines = (status.stdout || '')
		.split('\n')
		.map((l) => l.trimEnd())
		.filter(Boolean);
	const blockers = lines.filter((line) => {
		const path = line.slice(3).trim();
		return (
			!path.startsWith('drafts/facebook-sync/') &&
			path !== 'scripts/facebook-sync/state.json'
		);
	});
	return { dirty: blockers.length > 0, blockers, lines };
}

function pushStateToMain() {
	const prevBranch = (
		git(['branch', '--show-current']).stdout || 'main'
	).trim();

	if (prevBranch !== 'main') {
		const co = git(['checkout', 'main']);
		if (co.status !== 0) {
			return { ok: false, error: co.stderr || 'checkout main failed' };
		}
	}

	const add = git(['add', 'scripts/facebook-sync/state.json']);
	if (add.status !== 0) {
		return { ok: false, error: add.stderr || 'git add state failed' };
	}

	const staged = git([
		'diff',
		'--cached',
		'--quiet',
		'--',
		'scripts/facebook-sync/state.json',
	]);
	if (staged.status === 0) {
		return { ok: true, skipped: true };
	}

	const commit = git([
		'commit',
		'-m',
		'chore(facebook-sync): update seen posts',
	]);
	if (commit.status !== 0) {
		const msg = `${commit.stdout || ''}${commit.stderr || ''}`;
		if (!/nothing to commit/i.test(msg)) {
			return { ok: false, error: msg || 'commit state failed' };
		}
		return { ok: true, skipped: true };
	}

	const push = git(['push', 'origin', 'main']);
	if (push.status !== 0) {
		return { ok: false, error: push.stderr || 'push state to main failed' };
	}
	return { ok: true, skipped: false };
}

function createDraftPr({ post, draft, classification }) {
	const branch = `draft/facebook-rw-${safeDirName(post.id).slice(-20)}`;
	const title = `draft: Recent Work from Facebook — ${draft.guess.location || draft.slug}`;
	const body = [
		`## Summary`,
		``,
		`- Auto-drafted from Facebook post \`${post.id}\``,
		`- Suggested slug: \`${draft.slug}\``,
		`- Classifier score: ${classification.score}`,
		`- Images: ${draft.imageCount}`,
		``,
		`Facebook: ${post.permalink_url || '(no permalink)'}`,
		``,
		`## Next steps (Shutter Envy)`,
		``,
		`1. Review \`drafts/facebook-sync/${safeDirName(post.id)}/BRIEF.md\``,
		`2. Create \`src/content/blog/${draft.slug}.md\``,
		`3. Add \`'${draft.slug}': 'projects'\` in \`src/data/blog-categories.ts\``,
		`4. Prepend gallery tile on \`src/content/pages/recent-work.md\``,
		`5. Remove the draft folder once live`,
		``,
		`Cursor: \`Finish the Facebook Recent Work draft for ${draft.guess.location || draft.slug}\``,
		``,
		`## Caption`,
		``,
		'```',
		(post.message || '').trim().slice(0, 800),
		'```',
		``,
	].join('\n');

	const dirtyCheck = trackedDirtyOutsideDrafts();
	if (dirtyCheck.error) {
		return { ok: false, error: dirtyCheck.error };
	}
	if (dirtyCheck.dirty) {
		return {
			ok: false,
			error: `working tree has other changes; use --no-pr or commit/stash first. Blocking: ${dirtyCheck.blockers
				.slice(0, 5)
				.join(' | ')}`,
		};
	}

	const prevBranch = (
		git(['branch', '--show-current']).stdout || 'main'
	).trim();

	const checkout = git(['checkout', '-b', branch]);
	if (checkout.status !== 0) {
		const sw = git(['checkout', branch]);
		if (sw.status !== 0) {
			return {
				ok: false,
				error: checkout.stderr || sw.stderr || 'checkout failed',
			};
		}
	}

	const relDraft = relative(ROOT, draft.draftDir);
	const add = git(['add', '-f', '--', relDraft]);
	if (add.status !== 0) {
		git(['checkout', prevBranch]);
		return { ok: false, error: add.stderr || 'git add failed' };
	}

	const commit = git(['commit', '-m', title]);
	if (commit.status !== 0) {
		const msg = `${commit.stdout || ''}${commit.stderr || ''}`;
		if (!/nothing to commit/i.test(msg)) {
			git(['checkout', prevBranch]);
			return { ok: false, error: msg || 'commit failed' };
		}
	}

	const push = git(['push', '-u', 'origin', branch]);
	if (push.status !== 0) {
		git(['checkout', prevBranch]);
		return {
			ok: false,
			error: push.stderr || 'git push failed (auth?)',
			branch,
			branchUrl: branchWebUrl(branch),
		};
	}

	const branchUrl = branchWebUrl(branch);
	const pr = gh([
		'pr',
		'create',
		'--draft',
		'--title',
		title,
		'--body',
		body,
		'--base',
		'main',
		'--head',
		branch,
	]);
	if (pr.status !== 0) {
		git(['checkout', prevBranch]);
		return {
			ok: false,
			error: pr.stderr || pr.stdout || 'gh pr create failed',
			branch,
			branchUrl,
		};
	}

	git(['checkout', prevBranch]);
	const prUrl = (pr.stdout || '').trim().split('\n').filter(Boolean).pop();
	return { ok: true, branch, branchUrl, prUrl };
}

async function sendTelegram(text) {
	const token = process.env.TELEGRAM_BOT_TOKEN;
	const chatId = process.env.TELEGRAM_CHAT_ID;
	const url = `https://api.telegram.org/bot${token}/sendMessage`;
	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			chat_id: chatId,
			text,
			disable_web_page_preview: false,
		}),
	});
	const body = await res.json();
	if (!res.ok || !body.ok) {
		throw new Error(`Telegram failed: ${JSON.stringify(body)}`);
	}
}

function printHelp() {
	console.log(`Facebook → Recent Work sync (Shutter Envy)

  --seed         Record current posts as seen + set watchFrom cutoff
                 (paginates up to 100 posts; no drafts)
  --dry-run      Classify posts only
  --no-pr        Write local draft + Telegram; skip GitHub PR
  --no-telegram  Skip Telegram notify
  --ci           Cloud/CI mode: push state to main, open draft PRs,
                 Telegram only when a draft is created
  --limit N      How many recent posts to fetch on normal runs (default 15)
  --force ID     Process one post even if already seen / before watchFrom
`);
}

async function maybePushState(opts) {
	if (!opts.ci) return;
	const result = pushStateToMain();
	if (!result.ok) {
		throw new Error(`Failed to push state.json to main: ${result.error}`);
	}
	if (result.skipped) console.log('State unchanged on main.');
	else console.log('Pushed scripts/facebook-sync/state.json to main.');
}

async function main() {
	loadDotEnv();
	const opts = parseArgs(process.argv.slice(2));
	if (opts.help) {
		printHelp();
		return;
	}

	requireEnv(['META_PAGE_ID', 'META_PAGE_ACCESS_TOKEN']);
	if (!opts.noTelegram && !opts.dryRun) {
		requireEnv(['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID']);
	}

	const state = loadState();
	const seen = new Set(state.seenPostIds || []);
	const pageId = process.env.META_PAGE_ID;

	const posts = await fetchPosts({
		limit: opts.seed ? 25 : opts.limit,
		paginate: opts.seed,
		maxPosts: opts.seed ? 100 : opts.limit,
	});

	console.log(`Fetched ${posts.length} posts from Page ${pageId}`);

	if (opts.seed) {
		for (const p of posts) seen.add(p.id);
		state.seenPostIds = [...seen];
		state.lastRunAt = new Date().toISOString();
		state.watchFrom = state.lastRunAt;
		saveState(state);
		await maybePushState(opts);
		const msg = `Shutter Envy Facebook sync seeded.\nRemembered ${posts.length} current posts.\nWatching for posts newer than ${state.watchFrom}.`;
		console.log(msg);
		if (!opts.noTelegram) await sendTelegram(msg);
		return;
	}

	if (!state.watchFrom) {
		state.watchFrom = new Date().toISOString();
		console.log(
			`No watchFrom in state — set cutoff to ${state.watchFrom} (historic posts will be skipped).`,
		);
	}

	const results = [];
	for (const post of posts) {
		const imageUrls = extractImageUrls(post);
		const types = attachmentTypes(post);
		const classification = classifyPost({
			message: post.message,
			imageCount: imageUrls.length,
			attachmentTypes: types,
		});
		const already = seen.has(post.id);
		const historic = isBeforeWatchFrom(post, state.watchFrom);
		results.push({ post, classification, imageUrls, already, historic });

		const flag = already ? 'seen' : historic ? 'old ' : 'new ';
		const preview = (post.message || '').slice(0, 70).replace(/\s+/g, ' ');
		console.log(
			`${classification.verdict.padEnd(9)} score=${String(classification.score).padStart(2)} ${flag} | ${preview}`,
		);
	}

	if (opts.dryRun) {
		console.log('\nDry run only — no drafts, state, or Telegram.');
		return;
	}

	const toProcess = results.filter((r) => {
		if (opts.force) return r.post.id === opts.force;
		return (
			r.classification.verdict === 'candidate' &&
			!r.already &&
			!r.historic
		);
	});

	if (opts.force && toProcess.length === 0) {
		const forced = results.find((r) => r.post.id === opts.force);
		if (!forced) throw new Error(`Post not in latest ${opts.limit}: ${opts.force}`);
		toProcess.push(forced);
	}

	if (toProcess.length === 0) {
		state.lastRunAt = new Date().toISOString();
		for (const r of results) seen.add(r.post.id);
		state.seenPostIds = [...seen];
		saveState(state);
		await maybePushState(opts);
		const msg = `Shutter Envy Facebook sync: no new Recent Work candidates (${posts.length} posts checked).`;
		console.log(msg);
		if (!opts.noTelegram && !opts.ci) await sendTelegram(msg);
		return;
	}

	mkdirSync(DRAFTS_ROOT, { recursive: true });
	writeFileSync(
		join(DRAFTS_ROOT, 'README.md'),
		`# Facebook sync drafts\n\nAuto-generated install drafts awaiting review. See each folder's \`BRIEF.md\`.\n\nPublish path: blog MD + \`blog-categories.ts\` + \`recent-work.md\` gallery tile.\n`,
		'utf8',
	);

	const created = [];
	for (const { post, classification } of toProcess) {
		console.log(`\nDrafting ${post.id}…`);
		const draft = await createDraftForPost(post, classification);
		seen.add(post.id);
		created.push({
			post,
			draft,
			classification,
			prResult: { ok: false, skipped: true },
		});
	}

	for (const r of results) seen.add(r.post.id);
	state.seenPostIds = [...seen];
	state.lastRunAt = new Date().toISOString();
	saveState(state);
	await maybePushState(opts);

	for (const item of created) {
		if (!opts.noPr) {
			item.prResult = createDraftPr({
				post: item.post,
				draft: item.draft,
				classification: item.classification,
			});
			if (!item.prResult.ok) {
				console.warn(`PR not created: ${item.prResult.error}`);
				if (item.prResult.branchUrl) {
					console.warn(`Branch: ${item.prResult.branchUrl}`);
				}
			} else {
				console.log(`Draft PR: ${item.prResult.prUrl}`);
			}
		}
	}

	if (!opts.noTelegram) {
		for (const item of created) {
			const loc =
				item.draft.guess.location || item.draft.slug || 'Unknown town';
			const prompt = cursorPromptForDraft(loc);
			const lines = [
				`New Recent Work draft: ${loc}`,
				``,
				(item.post.message || '').trim().slice(0, 280),
				``,
				`Slug: ${item.draft.slug}`,
				`Images: ${item.draft.imageCount}`,
				item.post.permalink_url ? `Facebook: ${item.post.permalink_url}` : null,
				item.prResult.prUrl ? `PR: ${item.prResult.prUrl}` : null,
				item.prResult.branchUrl
					? `Branch: ${item.prResult.branchUrl}`
					: !item.prResult.prUrl
						? `Local draft: drafts/facebook-sync/${safeDirName(item.post.id)}/`
						: null,
				``,
				`Open in Cursor and say:`,
				prompt,
				``,
				`Or locally: npm run sync:pull-drafts`,
			].filter((line) => line !== null);
			await sendTelegram(lines.join('\n'));
		}
	}

	console.log(`\nDone. Created ${created.length} draft(s).`);

	if (opts.ci && !opts.noPr) {
		const failed = created.filter((c) => !c.prResult?.ok);
		if (failed.length > 0) {
			const details = failed
				.map(
					(c) =>
						`- ${c.post.id}: ${c.prResult.error || 'unknown'}${
							c.prResult.branchUrl ? ` (${c.prResult.branchUrl})` : ''
						}`,
				)
				.join('\n');
			console.error(
				`\nCI failing: ${failed.length}/${created.length} draft PR(s) not created.\n` +
					`Enable Settings → Actions → “Allow GitHub Actions to create and approve pull requests”,\n` +
					`or add secret FACEBOOK_SYNC_GITHUB_TOKEN (PAT with repo + pull_requests).\n` +
					details,
			);
			process.exit(1);
		}
	}
}

main().catch((err) => {
	console.error(err.message || err);
	process.exit(1);
});
