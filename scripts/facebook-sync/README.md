# Facebook → Recent Work sync (Shutter Envy)

Daily (or on-demand) check of the [Shutter Envy Facebook Page](https://www.facebook.com/Shutter.Envy.Ltd/). Install-style posts become **draft** folders + a draft GitHub PR + a Telegram ping. Nothing goes live until you review and finish the case study in Cursor.

## Content model (do not invent `recentWork.ts`)

On this site the human publish path is:

1. New Markdown blog post: `src/content/blog/{{slug}}.md` (frontmatter like existing project posts)
2. Register slug in `src/data/blog-categories.ts` under `projects`
3. Prepend a gallery tile on `src/content/pages/recent-work.md` (`src`, `alt`, `href`)
4. Live routes: `/{{slug}}/` and tile on https://shutter-envy.co.uk/recent-work/

Images for new installs go under `public/wp-content/uploads/YYYY/MM/` (same convention as current Recent Work). Never rewrite existing SEO image URLs.

Draft automation never writes those publish files itself — only:

- `drafts/facebook-sync/<post-id>/BRIEF.md`
- `drafts/facebook-sync/<post-id>/manifest.json`
- `drafts/facebook-sync/<post-id>/images/`

## Local vs cloud

| Where | How | Needs your laptop on? |
|---|---|---|
| **Cloud (recommended)** | GitHub Actions (`.github/workflows/facebook-recent-work-sync.yml`) | No — 08:00 UTC daily |
| **Local** | `npm run sync:facebook-rw` | Yes |

Hosting is **Netlify static** (`public/_redirects`). There is **no** Telegram reply webhook on this site yet (would need Netlify Functions). Outbound Telegram from Actions still works.

## Setup (cloud)

1. Commit and push `scripts/facebook-sync/` **including** `state.json`, plus `drafts/facebook-sync/README.md`.
2. GitHub repo → **Settings → Secrets and variables → Actions**:

| Secret | Value |
|---|---|
| `META_PAGE_ID` | Numeric Page ID |
| `META_PAGE_ACCESS_TOKEN` | **Page** access token (not User token); prefer long-lived |
| `TELEGRAM_BOT_TOKEN` | BotFather token |
| `TELEGRAM_CHAT_ID` | Group chat ID (preferred) |
| `FACEBOOK_SYNC_GITHUB_TOKEN` | Optional PAT (repo + pull requests) if Actions cannot open PRs |

Also enable **Settings → Actions → General → Allow GitHub Actions to create and approve pull requests**, or use the PAT above.

3. **Actions** tab → enable workflows if prompted.
4. Seed first (local or one-off), then **Actions → Facebook Recent Work sync → Run workflow**.

In `--ci` mode the job **fails** if a draft was created but the PR was not opened.

## Local `.env` (gitignored)

```bash
META_PAGE_ID=...
META_PAGE_ACCESS_TOKEN=...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

```bash
# First time: remember current posts — no drafts
npm run sync:facebook-rw -- --seed --no-telegram

# Classify only
npm run sync:facebook-rw -- --dry-run

# Manual run
npm run sync:facebook-rw

# Local draft only
npm run sync:facebook-rw -- --no-pr

# Pull remote draft branches into drafts/facebook-sync/ (stay on main)
npm run sync:pull-drafts
```

## Avoiding duplicate drafts

1. **`seenPostIds`** — already processed
2. **`watchFrom`** — set by `--seed`; older posts never drafted (unless `--force`)

After seed, commit and push `scripts/facebook-sync/state.json` so Actions uses it.

## Review path

1. Open Telegram → PR (or `npm run sync:pull-drafts`)
2. In Cursor: `Finish the Facebook Recent Work draft for {{town}}`
3. Agent creates blog MD + categories + Recent Work tile from BRIEF/images
4. Human reviews → merge → Netlify deploy

## Finding Page ID + token (quick)

1. [Meta Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. App with Page access → **Get Page Access Token** for Shutter Envy Ltd
3. Call `GET /me/accounts` → note the Page `id` and `access_token`
4. Prefer exchanging for a long-lived Page token (tokens from Explorer expire quickly)

Never commit tokens. Never echo them in logs or Telegram.
