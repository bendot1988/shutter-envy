# Facebook sync drafts

Auto-generated install drafts from the Facebook Page live on `draft/facebook-rw-*` branches / draft PRs.

Local copies (from `npm run sync:pull-drafts`) appear as sibling folders here. Do **not** commit those folders to `main` — only this README stays tracked.

## Publish path (Shutter Envy)

1. Review `BRIEF.md` + `images/`
2. Create `src/content/blog/<slug>.md`
3. Register `'<slug>': 'projects'` in `src/data/blog-categories.ts`
4. Prepend gallery tile on `src/content/pages/recent-work.md`
5. Delete the draft folder once live

Cursor: `Finish the Facebook Recent Work draft for <town>`
