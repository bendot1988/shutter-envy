#!/usr/bin/env node
/**
 * Pull all remote draft/facebook-rw-* branches into local drafts/facebook-sync/
 * without switching off your current branch.
 *
 * Usage:
 *   npm run sync:pull-drafts
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const DRAFTS_ROOT = join(ROOT, 'drafts/facebook-sync');

function git(args) {
	return spawnSync('git', args, { cwd: ROOT, encoding: 'utf8' });
}

function main() {
	const fetch = git(['fetch', 'origin', '--prune']);
	if (fetch.status !== 0) {
		console.error(fetch.stderr || 'git fetch failed');
		process.exit(1);
	}

	const branches = git(['branch', '-r', '--list', 'origin/draft/facebook-rw-*']);
	const remotes = (branches.stdout || '')
		.split('\n')
		.map((l) => l.trim())
		.filter((l) => l && !l.includes('->'));

	if (remotes.length === 0) {
		console.log('No remote draft/facebook-rw-* branches found.');
		console.log('Drafts only appear after a sync creates one.');
		return;
	}

	mkdirSync(DRAFTS_ROOT, { recursive: true });
	writeFileSync(
		join(DRAFTS_ROOT, 'README.md'),
		[
			`# Facebook sync drafts`,
			``,
			`Pulled from remote draft branches. Each folder has \`BRIEF.md\` + \`images/\`.`,
			``,
			`Publish path for this site:`,
			`1. \`src/content/blog/<slug>.md\``,
			`2. \`src/data/blog-categories.ts\` → projects`,
			`3. Gallery tile on \`src/content/pages/recent-work.md\``,
			``,
			`Refresh with: \`npm run sync:pull-drafts\``,
			``,
			`In Cursor: Finish the Facebook Recent Work draft for <town>`,
			``,
		].join('\n'),
		'utf8',
	);

	let pulled = 0;
	for (const remote of remotes) {
		const co = git(['checkout', remote, '--', 'drafts/facebook-sync/']);
		if (co.status !== 0) {
			console.warn(`Skip ${remote}: ${co.stderr || co.stdout || 'checkout failed'}`);
			continue;
		}
		git(['restore', '--staged', 'drafts/facebook-sync/']);
		pulled += 1;
		console.log(`Pulled ${remote}`);
	}

	const folders = existsSync(DRAFTS_ROOT)
		? readdirSync(DRAFTS_ROOT, { withFileTypes: true })
				.filter((d) => d.isDirectory())
				.map((d) => d.name)
		: [];

	console.log(
		`\nDone. ${pulled} branch(es) → ${folders.length} draft folder(s) in drafts/facebook-sync/`,
	);
	for (const name of folders) console.log(`  - ${name}`);
	console.log(
		`\nThese files are uncommitted working-tree copies for review. Do not commit them to main.`,
	);
}

main();
