# SEO Roadmap — Shutter Envy

- **Owner:** _TBD (Ben / Mark / Laura — set on first PR)_
- **Last updated:** 2026-06-09 (post 2 A8)
- **90-day window:** 2026-05-28 → 2026-08-26
- **Canonical site:** https://shutter-envy.co.uk/
- **GSC property in use:** URL-prefix `https://shutter-envy.co.uk/` (apex). See §4 for the recommended addition.

---

## 1. Mission

Grow non-brand organic visibility for Shutter Envy across Leicestershire and the East Midlands without breaking a single ranking URL. The brand already shows for ~145K impressions per 90 days; most of those are wasted at positions 10–30 with sub-1% CTR. This roadmap turns existing impressions into clicks first, then expands topical and local coverage, then invests in authority and conversion.

## 2. How to use this file

- This file is the single source of truth for SEO work between launch and Day 90.
- Every action item has a stable ID (`F#`, `C#`, `A#`). IDs survive reordering and are quoted in branch names, commit messages, PR titles, and the todo list in §9.
- Status values for each item: `pending`, `in-progress`, `done`, `dropped` (with note explaining why).
- **No-silent-drops rule:** an item is `dropped` only with a one-line note. Never delete a row.
- **Off-repo work is tracked here too** (Google Business Profile, Search Console, Bing Webmaster, link outreach, citations). The note field records where the actual change was made.
- When an item ships, update its status + done date + note in the same PR that closes it.
- The KPI Metrics log in §7 is appended to monthly. Earlier rows are never edited.

## 3. Current state snapshot

### 3.1 Stack & config (verified)

- Astro **5.18.1**, `trailingSlash: 'always'`, `build.format: 'directory'` — `astro.config.mjs:11-15`.
- Sitemap via `@astrojs/sitemap` 3.2, excludes paginated news + `/brand/` — `astro.config.mjs:25-36`. **`lastmod` not configured** (gap: `F10`).
- SEO contract emits title/description/canonical/OG/Twitter/JSON-LD — `src/components/SEO.astro:17-46`.
- Per-request graph (`LocalBusiness + WebSite + WebPage`) wired in `src/layouts/BaseLayout.astro:53-62`. `PUBLIC_NOINDEX` env switch at `:43-45`.
- Schema builders in `src/lib/schema.ts`: `localBusiness`, `webSite`, `webPage`, `faqPage`, `blogPosting`, `breadcrumbList`. **No `Service`, `Review`, `AggregateRating`, or `ItemList` builders yet** (gaps: `F2`, `F4`, `A4`).
- Analytics live: GA4 `G-CDBPY9EJBB`, Meta Pixel `1214905783001306`, Dotwall Stats cookieless — `src/components/Analytics.astro`.
- Robots emitter at `src/pages/robots.txt.ts:14-27`; advertises `/sitemap-index.xml`.
- Redirects in `public/_redirects` and documented in `REDIRECTS.md`.

### 3.2 Indexable page inventory (97 ranking URLs, all routes)

- **Marketing & service (16 routes):** `/`, `/about/`, `/awnings/`, `/blind-motorisation/`, `/blindscreen/`, `/british-made-shutters/`, `/contact/`, `/news/`, `/our-blinds/`, `/our-shutters/`, `/our-shutters/colour-swatches/`, `/portchester-aluminium-shutters-leicester/`, `/privacy/`, `/recent-work/`, `/reviews/`, `/site-map/`, `/terms/`.
- **Locations (12 + index = 13 routes):** `/locations/` and the 12 location slugs under `src/content/locations/` (slug inconsistency preserved per `CLAUDE.md` §3).
- **Blog (77 posts, root-level):** every file in `src/content/blog/` rendered by `src/pages/[slug]/index.astro`.
- **Noindexed:** `/brand/` (`src/pages/brand/index.astro:75`), `/404/`.
- Full route → source-file mapping is in Appendix B.

### 3.3 What is already strong — do not regress

- URL parity with the live WordPress site is at 104/104 (`LAUNCH.md:49`, `PARITY-REPORT.md:17`).
- Trailing-slash enforcement, www→apex 301, HTTP→HTTPS 301 all verified live (see §4 evidence).
- Per-page SEO contract is centralised — `src/components/SEO.astro` makes it impossible to render without title, description, canonical, and OG.
- Exactly one `<h1>` per page (`PARITY-REPORT.md:17, 113`).
- Brand search is healthy: 75 clicks / 334 impressions / 22.46% CTR / pos 2.57 over 90 days.

### 3.4 Known gaps with file references

- Per-location `og:image` falls back to a generic logo — `src/pages/locations/[slug]/index.astro:73` (gap: `F3`).
- `Service` schema not emitted on product pages — see `src/pages/our-shutters/index.astro:16-22`, `src/pages/our-blinds/index.astro:14-20`, `src/pages/awnings/index.astro:13-19` (gap: `F2`).
- `AggregateRating` not emitted on `/reviews/` or `/` despite visible review widget — `src/pages/reviews/index.astro:10-15` (gap: `F4`).
- Location pages render no cross-links to service pages — `src/pages/locations/[slug]/index.astro:165-169` (gap: `F7`).
- Related-posts logic is purely chronological — `src/layouts/ArticleLayout.astro:37-43` (gap: `A9`).
- Charnwood h1 typo carried from live: `Made-to-Measure Shutters in Shutters in Charnwood` — `src/content/locations/shutters-in-charnwood.md` (gap: `F5`).
- 21 dead `/locations/shutters-in-X/` links in blog bodies — listed at `PARITY-REPORT.md:71-85` (gap: `F11`).
- Dead code: `src/layouts/LocationLayout.astro` is not imported anywhere (gap: `F8`).
- Sitemap omits `lastmod` — `astro.config.mjs:25-36` (gap: `F10`).
- Bing Webmaster Tools not set up; only URL-prefix GSC property exists (gap: `F9`).

### 3.5 GSC baseline — 90 days ending 2026-05-26

Source: `~/Downloads/https___shutter-envy.co.uk_-Performance-on-Search-2026-05-28.xlsx` (sheets: Chart, Queries, Pages, Countries, Devices, Search appearance, Filters). Do not commit this file.

- **Clicks:** 674
- **Impressions:** 145,189
- **CTR:** 0.46%
- **Devices:** Mobile 430 / 62,805 / 0.68% / pos 16.68 · Desktop 213 / 80,560 / 0.26% / pos 22.15 · Tablet 31 / 1,824 / 1.70% / pos 11.20
- **Countries:** UK 602 / 123,313 (the only market that matters). US 16, AU 8, IE 6.
- **Brand (`shutter envy`):** 75 / 334 / 22.46% / pos 2.57.

Headline finding: the site shows for 145K impressions but desktop CTR is **0.26%**. That is the single largest lever and the entire reason Phase 1 is CTR-led rather than content-led.

## 4. Domain & GSC property

### 4.1 Verified live behaviour (2026-05-28, `curl -sIL`)

- `https://shutter-envy.co.uk/` → **200** (Netlify).
- `https://www.shutter-envy.co.uk/` → **301 → apex** → 200.
- `http://shutter-envy.co.uk/` → **301 → HTTPS apex** → 200.
- `https://shutter-envy.co.uk/our-shutters` (no slash) → **301 → `/our-shutters/`** → 200.
- `/sitemap_index.xml` (Rank Math legacy) → **301 → `/sitemap-index.xml`** → 200.
- `/window-shutters-leicestershire/` (inherited 301 from WordPress) → **301 → `/our-shutters/`** → 200.
- `/privacy-2/` (approved exception) → **301 → `/privacy/`** → 200.
- `/robots.txt` is dynamic, advertises `https://shutter-envy.co.uk/sitemap-index.xml`.

No host plumbing issues. No multi-hop chains. No fix required at this layer.

### 4.2 Property recommendation

- The GSC export filename `https___shutter-envy.co.uk_…` confirms a **URL-prefix property** on the bare apex. Because all variants 301 to apex, this URL-prefix sees the canonical traffic. Day-to-day reporting is correct.
- **Recommended addition (tracked as `F9`):** verify a **Domain property** for `shutter-envy.co.uk` via DNS TXT. A Domain property catches every subdomain and protocol — useful for detecting host drift, accidental staging exposure, or a future `blog.shutter-envy.co.uk`. Keep the URL-prefix as the day-to-day daily driver.
- Bing Webmaster Tools: not yet verified. Same DNS TXT verification path; tracked as part of `F9`.

## 5. Strategic priorities

### 5.1 P1 — Reclaim clicks from existing rankings (CTR work)

**Why:** 145K impressions over 90 days at 0.46% CTR means the pages are seen but not chosen. The top-5 pages by impressions alone (Plantation Cost Guide, Worth-It Guide, Wood vs Faux Wood, Plantation Guide, Cafe-Style explainer) account for ~60K impressions and 200 clicks — a 1pp CTR lift on these five pages is +600 clicks/90 days. No new content. No new links. Just title-tag, description, intro, schema, and structured snippet work. This is the cheapest meaningful win on the site and it is the entire spine of Phase 1.

### 5.2 P2 — Fix local commercial intent

**Why:** Leicester is the brand's strongest local market and the closest queries to ranking. `shutters leicester` 836/pos21, `blinds leicester` 807/pos13, `shutters in leicester` 292/pos15, `made to measure blinds in leicester` 520/pos17 — combined ~2.5K impressions / 90 days hovering between pos 13 and 21. Today the Leicester location page itself ranks pos 31 with 1,189 impressions and 2 clicks. The location template provides zero topical reinforcement to service pages. Loughborough sub-queries already rank top 10 — they win automatically once the template is stronger. Derby ranks pos 57–70 with 1,316 impressions and no page — covered by Phase 2.

### 5.3 P3 — Plant pillars and close topical gaps

**Why:** Cafe-style shutters (3K+ impr / pos 18–32), faux wood shutters (1,760 impr / pos 15), aluminium / plantation aluminium (760 impr / pos 17–20), arched window shutters (558 / pos 13), and `shutters vs blinds` (991 / pos 18–24) all share one symptom: no dedicated commercial hub. They are scattered across 77 blog posts. New commercial hubs (`/cafe-style-shutters/`, `/faux-wood-shutters/`, `/aluminium-plantation-shutters/`, `/arched-window-shutters/`) consolidate intent — approved 2026-05-28. Each must be a real, locally-grounded page, not a doorway.

---

## 6. The 90-day roadmap

Phase boundaries are guides, not gates. An item can ship earlier if a PR opens earlier.

### 6.1 Phase 1 — Days 1–30 — Foundation and quick wins

- **F1 — Snippet polish on the top-5 impression pages.** Rewrite `title` and `description` frontmatter on `src/content/blog/how-much-do-plantation-shutters-cost-a-complete-uk-price-guide.md`, `src/content/blog/are-window-shutters-worth-it-your-complete-guide-to-cost-value-and-style.md`, `src/content/blog/the-difference-between-wooden-and-faux-wood-shutters.md`, `src/content/blog/the-complete-uk-guide-to-plantation-shutters.md`, `src/content/blog/what-are-cafe-style-shutters-and-what-is-the-point-of-them.md`. Outcome: +0.5–1pp CTR on combined ~60K impressions.
- **F2 — Add `Service` JSON-LD to product pages.** New `service()` builder in `src/lib/schema.ts`; wired into `src/pages/our-shutters/index.astro`, `our-blinds`, `awnings`, `blind-motorisation`, `blindscreen`, `british-made-shutters`, `portchester-aluminium-shutters-leicester`. Outcome: richer SERP eligibility on commercial pages.
- **F3 — Per-location `og:image` fallback.** Add a generated/manual fallback image per area; wire in `src/pages/locations/[slug]/index.astro:73` and update each `src/content/locations/*.md` frontmatter. Outcome: stronger social and link previews.
- **F4 — `AggregateRating` schema on `/reviews/` and homepage.** Use the visible Trustindex numbers as source; new builder in `src/lib/schema.ts`; wired into `src/pages/reviews/index.astro:10-15` and `src/pages/index.astro:23-37`. Outcome: stars eligibility on key SERPs.
- **F5 — Charnwood h1 fix.** Update `h1` field in `src/content/locations/shutters-in-charnwood.md` to remove the duplicated `Shutters in` segment. Outcome: clean h1 parity.
- **F6 — Per-tile click-through on `/recent-work/`.** Add per-tile target in `src/pages/recent-work/index.astro` linking each project tile to its blog post when one exists. Outcome: link equity flowing back to project posts.
- **F7 — Location → services internal links in the template.** Add a sidebar block in `src/pages/locations/[slug]/index.astro` listing `/our-shutters/`, `/our-blinds/`, `/awnings/`, `/portchester-aluminium-shutters-leicester/` with natural anchors. Outcome: topical reinforcement on 12+1 pages.
- **F8 — Remove `src/layouts/LocationLayout.astro` (dead code).** One file delete. Outcome: cleaner repo, no behavioural change.
- **F9 — Verify a GSC Domain property and Bing Webmaster Tools.** Off-repo. DNS TXT verification on `shutter-envy.co.uk`. Submit sitemap on both. Outcome: diagnostic coverage across all variants and a second search engine.
- **F10 — Add `lastmod` to the sitemap.** Update `@astrojs/sitemap` config in `astro.config.mjs:25-36` with a `serialize` callback reading frontmatter `updatedDate ?? pubDate`. Outcome: clearer freshness signal to crawlers.
- **F11 — Sweep 21 dead `/locations/shutters-in-X/` body links in blog posts.** List of broken anchors lives at `PARITY-REPORT.md:71-85`. Either point to a real location, point to `/locations/`, or strip the link. Files: enumerated in the PARITY report. Outcome: zero internal 404s from body content.
- **F12 — Submit sitemap to Domain property and request indexing on the top product pages.** Off-repo. Pages: `/our-shutters/`, `/our-blinds/`, `/awnings/`, `/blind-motorisation/`, `/portchester-aluminium-shutters-leicester/`. Outcome: faster crawl pickup.

### 6.2 Phase 2 — Days 31–60 — Content and coverage

- **C1 — New commercial hub `/cafe-style-shutters/`.** New file `src/content/pages/cafe-style-shutters.md` + new route `src/pages/cafe-style-shutters/index.astro`. Wire into `Products` mega in `src/data/site.ts:79-113` and footer `src/data/site.ts:140-153`. Consolidate intent for `cafe style shutters` 1,446/pos32 + `cafe shutters` 1,245/pos31 + `cafe style window shutters` 381/pos18. Outcome: a hub that can rank where the blog can't, plus a destination for internal links from existing posts.
- **C2 — New commercial hub `/faux-wood-shutters/`.** New file `src/content/pages/faux-wood-shutters.md` + new route `src/pages/faux-wood-shutters/index.astro`. Wire into nav. Outcome: capture `faux wood shutters` 1,760/pos15 cluster; relieve the blog from carrying commercial intent.
- **C3 — New commercial hub `/aluminium-plantation-shutters/`.** New file `src/content/pages/aluminium-plantation-shutters.md` + new route. Consolidates `aluminium shutters` 471/pos19, `aluminium plantation shutters` 289/pos17, and works alongside the existing `/portchester-aluminium-shutters-leicester/` (which is product-brand specific). Outcome: a category page above the product page.
- **C4 — New commercial hub `/arched-window-shutters/`.** New file `src/content/pages/arched-window-shutters.md` + new route. Captures `arched window shutters` 558/pos13. The existing blog post `bespoke-arched-window-shutters-shutter-envy-leicestershire` keeps its URL and links into the new hub. Outcome: hub takes commercial intent, blog keeps long-tail.
- **C5 — Strengthen `/locations/shutters-in-leicester/`.** Edit `src/content/locations/shutters-in-leicester.md` to add postcode coverage (LE1–LE7 etc.), project gallery with locally-named alt text, "Where we work in Leicester" block linking to neighbouring areas, refreshed FAQs. Outcome: lift Leicester pages from pos 21–31 toward top 10.
- **C6 — Strengthen `/locations/shutters-market-harborough/`.** Edit `src/content/locations/shutters-market-harborough.md` to add a bay-window section (`market harborough bay windows` 336/pos25). Outcome: capture a bay-windows micro-intent on a location page.
- **C7 — New blog `shutters-vs-blinds-honest-2026-comparison.md`.** New file in `src/content/blog/`. Replaces or merges with the existing `/window-blinds-vs-shutters-which-is-right-for-your-home/`. If the existing slug is kept, a 301 from the old slug to the new one is logged in `REDIRECTS.md` per `CLAUDE.md` §1. Targets `shutters vs blinds` 689 + `blinds vs shutters` 302 impressions. Outcome: a single canonical comparison page.
- **C8 — Refresh `/the-complete-uk-guide-to-plantation-shutters/`.** Edit `src/content/blog/the-complete-uk-guide-to-plantation-shutters.md`: deeper TL;DR, costs sub-section, current UK price ranges, refreshed FAQs, internal links to `C1`/`C2`/`C3`/`C4`. Outcome: lift 12,196 impr / pos 22 toward pos 10.
- **C9 — Refresh `/how-much-do-plantation-shutters-cost-a-complete-uk-price-guide/`.** Edit the corresponding file in `src/content/blog/`: price table block, 2026 stamp, FAQs aligned with the cost-related queries in Appendix A. Outcome: lift 14,824 impr / pos 12 toward pos 5–8.
- **C10 — Refresh `/the-difference-between-wooden-and-faux-wood-shutters/`.** Edit the file: a clear comparison block, FAQs targeting the four faux-wood top-3 queries (any good / better than wood / how long last / expensive). Outcome: convert near-#1 rankings into clicks.
- **C11 — New blog `motorised-blinds-bifold-doors-buyers-guide-uk.md`.** New file in `src/content/blog/`. Consolidates `motorised blinds for bifold doors` 503/pos24 and city-suffix variants. Outcome: more relevant landing than the broader `/automated-blinds-for-bifold-doors-…/` post.
- **C12 — New `/locations/shutters-derby/` and `/locations/shutters-derbyshire/`.** New files in `src/content/locations/`. Approved 2026-05-28. Real local detail only — no spun content. Add to nav `Locations` mega in `src/data/site.ts:114-127`. Outcome: capture ~1,316 impr / 90 days currently leaking at pos 57–70.

### 6.3 Phase 3 — Days 61–90 — Authority, conversion, cadence

- **A1 — GBP optimisation pass.** Off-repo. Service categories, products, weekly posts, photo uploads from `/recent-work/`, Q&A seeded with the FAQs from `/our-shutters/`. Outcome: stronger local pack and brand presence.
- **A2 — Citation parity audit.** Off-repo. Yell, Bark, Houzz, Checkatrade, Trustpilot, FreeIndex, Cylex. Ensure NAP matches `src/data/site.ts:5-31` exactly. Outcome: clean local signals.
- **A3 — Acquire 3–5 contextual local backlinks.** Off-repo. Sponsorships, supplier listings, local press, county-level builder/architect directories. Outcome: domain authority lift.
- **A4 — `ItemList` carousel schema on `/news/`.** New builder in `src/lib/schema.ts`; wired in `src/pages/news/[...page].astro:70-75`. Outcome: richer news SERP eligibility.
- **A5 — `HowTo` / `VideoObject` schema where genuinely applicable.** Candidate posts only — e.g. `what-happens-during-a-shutter-installation-…`. No schema unless content matches. Outcome: rich result coverage on educational pages.
- **A6 — Inline phone-tap CTA after first H2 on blog posts.** Edit `src/layouts/ArticleLayout.astro` (likely after the article hero/intro). Mobile-only or always-visible; CTR-tested via Dotwall Stats. Outcome: shorter path to call.
- **A7 — Per-location quote-form deep-link with prefilled area.** Edit `src/pages/locations/[slug]/index.astro` enquiry block to deep-link the ClearLine widget with an `?area=` parameter (verify ClearLine supports URL params before assuming). Outcome: better attribution + UX.
- **A8 — Editorial cadence: 1 strategic blog post per fortnight.** Six topics seeded from Appendix A's longest-tail items (`shutter blinds`, `aluminium shutters in Leicestershire`, `noise-reducing shutters guide`, `bay window shutters cost 2026`, `electric blinds for bifold doors`, `cottage window shutters guide`). New files in `src/content/blog/` on cadence. Outcome: sustained topical growth into Q3.
- **A9 — Topical "see also" block on blog posts.** Replace the chronological logic in `src/layouts/ArticleLayout.astro:37-43` with a category-aware sibling-post query using `src/data/blog-categories.ts`. Outcome: stronger internal link relevance signals.
- **A10 — Lighthouse and Core Web Vitals pass on top-10 commercial pages.** Off-repo measurement; any fixes that emerge become their own IDs at Day 60–90. Outcome: ranking insurance.
- **A11 — Set up rank tracking for the top-25 opportunity queries.** Off-repo. Tool TBC (Sistrix UK, AccuRanker, or similar). Outcome: weekly visibility on the Appendix A list.
- **A12 — Q3 review.** Archive this file as `SEO-ROADMAP-Q2.md` (frozen) and open `SEO-ROADMAP.md` for Days 90–180 with carried-over IDs marked `rolled-over`. Outcome: continuity into the next quarter.

---

## 7. KPIs and measurement

Four metrics. Add new ones cautiously.

- **K1 Primary search — Non-brand clicks per 28 days (GSC, URL-prefix property).** Brand = any query containing `shutter envy` / `shutterenvy`. Baseline below.
- **K2 Tracked positions — Number of Appendix A queries with average position ≤10 in the trailing 28 days.** Tooling: GSC API + spot check.
- **K3 Site hygiene — Build-time SEO checks (0 H1 violations, 0 missing canonicals, 0 multi-hop redirects in production).** Today: 0 / 0 / 0. Keep it there.
- **K4 Business — ClearLine form submissions per calendar month.** Source: ClearLine dashboard + sales inbox. Baseline TBC on first refresh.

### Metrics log

- **2026-05-28 (baseline) — 90-day window 2026-02-27 → 2026-05-26.**
  - K1: 90-day total clicks = 674; brand = 75; **non-brand 90-day = 599**; **non-brand 28-day equivalent ≈ 186**.
  - K1 supporting numbers: impressions 145,189 · CTR 0.46% · avg pos site-wide ≈ 18–22.
  - K2: TBC at first reading after `A11` ships.
  - K3: 0 H1 violations · 0 missing canonicals · 0 multi-hop redirects (verified live 2026-05-28 via curl).
  - K4: TBC — request from Mark/Laura.

---

## 8. Conventions

- **Branch naming:** `seo/<ID>-<short-kebab>` — e.g. `seo/F1-top5-snippet-polish`, `seo/C1-cafe-style-shutters-hub`.
- **PR titles:** start with the ID in square brackets — `[F1] Snippet polish on top-5 impression pages`.
- **Commit body:** reference the ID on the first line; reference `SEO-ROADMAP.md` in the description.
- **JSON-LD validation:** every PR that touches schema must include a screenshot from the Rich Results Test or note "no schema change" in the PR body.
- **URL changes:** forbidden unless logged in `REDIRECTS.md` with a 301 in `public/_redirects` (`CLAUDE.md` §1).
- **Locale:** UK English everywhere — copy, alt text, schema strings, og:locale (`en_GB`, already set in `src/components/SEO.astro:36`).
- **Tone:** plain, homeowner-facing, never SEO-jargon. Follow the `seo-local-service-pages` skill brief.
- **No spun town-swap content.** Every location and service page has unique local detail or it doesn't ship.

## 9. Trackable todo list

Update `status` / `owner` / `done` / `note` on the same PR that closes the item. Never delete a row.

### Phase 1 — Foundation and quick wins

- [x] **F1 — Snippet polish on top-5 impression pages.** status: done · owner: Claude · done: 2026-05-28 · note: titles + descriptions rewritten on the 5 highest-impression blog posts (cost guide, worth-it guide, wood vs faux wood, complete UK guide, café-style explainer)
- [x] **F2 — Add Service JSON-LD to product pages.** status: done · owner: Claude · done: 2026-05-28 · note: new `service()` builder in `src/lib/schema.ts`; wired on /our-shutters/, /our-blinds/, /awnings/, /blind-motorisation/, /blindscreen/, /british-made-shutters/, /portchester-aluminium-shutters-leicester/
- [x] **F3 — Per-location og:image fallback.** status: done · owner: Claude · done: 2026-05-28 · note: removed generic `ogImage` from all 12 location frontmatters; route now falls back to the per-location `heroImage` already mapped in `src/pages/locations/[slug]/index.astro:39-52`
- [x] **F4 — AggregateRating schema on /reviews/ and homepage.** status: done · owner: Claude · done: 2026-05-28 · note: new `aggregateRating()` builder; emits 5.0 / 34 reviews on both pages — refresh both numbers when the highlighted-reviews list on `/reviews/` changes
- [x] **F5 — Charnwood h1 fix.** status: done · owner: Claude · done: 2026-05-28 · note: also cleaned up two H2s in the same file ("Shutter fitting in Shutters in Charnwood…", "Why homeowners in Shutters in Charnwood…")
- [x] **F6 — Per-tile click-through on /recent-work/.** status: done · owner: Claude · done: 2026-05-28 · note: extended Gallery schema with optional `href`; 12 of 13 tiles linkified to matching blog posts (one tile, "Window Shutters Leicestershire", left as lightbox-only because no unique destination existed)
- [x] **F7 — Location → services internal links in template.** status: done · owner: Claude · done: 2026-05-28 · note: new "Services in {area}" sidebar card on every location page linking to /our-shutters/, /our-blinds/, /awnings/, /blind-motorisation/, /portchester-aluminium-shutters-leicester/, /british-made-shutters/
- [x] **F8 — Delete dead src/layouts/LocationLayout.astro.** status: done · owner: Claude · done: 2026-05-28 · note: confirmed 0 imports before deleting
- [ ] **F9 — Verify GSC Domain property + Bing Webmaster.** status: pending · owner: _TBD_ · done: — · note: off-repo — see §F9-steps below
- [x] **F10 — Add lastmod to sitemap.** status: done · owner: Claude · done: 2026-05-28 · note: built-time map in `astro.config.mjs` reads `updatedDate` (fallback `pubDate`, then file mtime) and passes per-URL `lastmod` to @astrojs/sitemap's `serialize` callback
- [x] **F11 — Sweep 21 dead /locations/shutters-in-X/ links in blog bodies.** status: done · owner: Claude · done: 2026-05-28 · note: 4 typos repointed to real slugs (Melton Mowbray, Birstall, Groby, Sileby); 7 references to uncovered towns unlinked; 2 absolute /shutter-installation/cafe-style-shutters/ links temporarily repointed to /our-shutters/ until C1 ships
- [ ] **F12 — Submit sitemap + request indexing on top product pages.** status: pending · owner: _TBD_ · done: — · note: off-repo, after F9 — see §F12-steps below

### Phase 2 — Content and coverage

- [ ] **C1 — New /cafe-style-shutters/ hub.** status: pending · owner: _TBD_ · done: — · note: route approved 2026-05-28
- [ ] **C2 — New /faux-wood-shutters/ hub.** status: pending · owner: _TBD_ · done: — · note: route approved 2026-05-28
- [ ] **C3 — New /aluminium-plantation-shutters/ hub.** status: pending · owner: _TBD_ · done: — · note: route approved 2026-05-28
- [ ] **C4 — New /arched-window-shutters/ hub.** status: pending · owner: _TBD_ · done: — · note: route approved 2026-05-28
- [ ] **C5 — Strengthen /locations/shutters-in-leicester/.** status: pending · owner: _TBD_ · done: — · note: —
- [ ] **C6 — Strengthen /locations/shutters-market-harborough/ (bay windows).** status: pending · owner: _TBD_ · done: — · note: —
- [ ] **C7 — New /shutters-vs-blinds-…/ blog (or merge existing).** status: pending · owner: _TBD_ · done: — · note: if merging, log 301 in REDIRECTS.md
- [ ] **C8 — Refresh /the-complete-uk-guide-to-plantation-shutters/.** status: pending · owner: _TBD_ · done: — · note: —
- [x] **C9 — Refresh /how-much-do-plantation-shutters-cost-…/.** status: done · owner: Claude · done: 2026-06-02 · note: added "Plantation Shutters Cost — 2026 At a Glance" TL;DR block, new "Bay Window Shutter Costs" subsection (targets `bay window shutters cost 2026` query), 8 FAQs mapped to GSC cost queries (FAQPage JSON-LD now emits), "Last reviewed June 2026" body stamp, and bumped `updatedDate` so sitemap `lastmod` reflects the refresh
- [ ] **C10 — Refresh /the-difference-between-wooden-and-faux-wood-shutters/.** status: pending · owner: _TBD_ · done: — · note: —
- [ ] **C11 — New /motorised-blinds-bifold-doors-…/ blog.** status: pending · owner: _TBD_ · done: — · note: —
- [ ] **C12 — New /locations/shutters-derby/ and /locations/shutters-derbyshire/.** status: pending · owner: _TBD_ · done: — · note: coverage approved 2026-05-28

### Phase 3 — Authority, conversion, cadence

- [ ] **A1 — Google Business Profile optimisation pass.** status: pending · owner: _TBD_ · done: — · note: off-repo
- [ ] **A2 — Citation parity audit (Yell, Bark, Houzz, Checkatrade, Trustpilot).** status: pending · owner: _TBD_ · done: — · note: off-repo
- [ ] **A3 — Acquire 3–5 contextual local backlinks.** status: pending · owner: _TBD_ · done: — · note: off-repo
- [ ] **A4 — ItemList schema on /news/.** status: pending · owner: _TBD_ · done: — · note: —
- [ ] **A5 — HowTo / VideoObject schema where genuinely applicable.** status: pending · owner: _TBD_ · done: — · note: candidate-only, no blanket rollout
- [ ] **A6 — Inline phone-tap CTA after first H2 on blog posts.** status: pending · owner: _TBD_ · done: — · note: —
- [ ] **A7 — Per-location quote-form deep-link.** status: pending · owner: _TBD_ · done: — · note: verify ClearLine URL-param support first
- [ ] **A8 — Editorial cadence: 1 post per fortnight (6 topics seeded).** status: in-progress · owner: Claude · done: — · note: 2 of 6 shipped. Post 1 (2026-06-04): `/shutter-blinds-explained-uk-guide/` targets A.23 `shutter blinds` (481 impr / pos 29 / 0% CTR). Post 2 (2026-06-09): `/are-mdf-shutters-any-good-honest-uk-verdict/` targets A.7 `mdf shutters` (968 impr / pos 48.49 / 0% CTR) — highest-headroom unaddressed query in Appendix A; honest-broker positioning qualifies cheap shoppers and upsells the rest to faux wood. (Earlier draft on sash windows withdrawn — client flagged as too specialist a promise.) 4 seeded topics still pending.
- [ ] **A9 — Topical "see also" block in ArticleLayout.** status: pending · owner: _TBD_ · done: — · note: use src/data/blog-categories.ts
- [ ] **A10 — Lighthouse + CWV pass on top-10 commercial pages.** status: pending · owner: _TBD_ · done: — · note: file follow-ups as new IDs if needed
- [ ] **A11 — Set up rank tracking for Appendix A queries.** status: pending · owner: _TBD_ · done: — · note: tool TBC
- [ ] **A12 — Q3 review (archive this file, open Days 90–180).** status: pending · owner: _TBD_ · done: — · note: do not delete this file, rename to `SEO-ROADMAP-Q2.md`

## 10. Changelog

- **2026-06-09** — **Second A8 editorial post shipped:** `/are-mdf-shutters-any-good-honest-uk-verdict/` directly targets Appendix A.7 `mdf shutters` (968 impr / pos 48.49 / 0% CTR — the highest-headroom unaddressed query in Appendix A). Honest-broker editorial stance: MDF is fine in dry low-traffic rooms, wrong in moisture-heavy ones, price gap to faux wood smaller than buyers expect, lifespan gap bigger than buyers expect. Strategic outcome: qualifies cheap shoppers out, upsells the rest to faux wood (better margin), positions Shutter Envy as honest at the same time. Registered in `src/data/blog-categories.ts` as `guides`. Includes 7 FAQs (FAQPage rich-result eligibility), TL;DR, MDF construction explainer, room-by-room verdict, price-gap reality check, lifespan field data, "what to ask the surveyor" checklist. Three new images in `public/images/blog/`: hero (MDF in a mid-market UK living room), louvre cross-section comparison (visualises the construction difference between MDF and faux wood without needing a label), and a low-humidity bedroom (the room MDF was made for). Internal links to /our-shutters/, /the-difference-between-wooden-and-faux-wood-shutters/, /how-much-do-plantation-shutters-cost-a-complete-uk-price-guide/, /can-your-shutters-survive-the-bathroom/, /locations/shutters-in-leicester/. **Note:** an earlier draft for 2026-06-09 (sash windows) was scrapped pre-publish — client flagged the topic as too specialist a promise.
- **2026-06-04** — **First A8 editorial post shipped early:** `/shutter-blinds-explained-uk-guide/` targets the `shutter blinds` cluster (Appendix A.23, 481 impr / pos 29 / 0% CTR). Registered in `src/data/blog-categories.ts` as a `guides` post. Includes 7 FAQs (FAQPage rich-result eligibility), TL;DR block, by-room decision guide, internal links to /our-shutters/, /our-blinds/, the cost guide, and two location pages.
- **2026-06-02** — Phase 2 begins: **C9 shipped early** (cost-guide refresh). Added at-a-glance pricing block, dedicated bay-window section, 8 cost-focused FAQs (FAQPage rich-result eligibility), and refresh stamp. F9/F12 still blocked on DNS access — moved on to on-repo content work in the meantime.
- **2026-05-28** — Phase 1 execution pass: F1, F2, F3, F4, F5, F6, F7, F8, F10, F11 shipped (10 of 12). F9 and F12 are off-repo — step-by-step instructions added below. Also: fixed live horizontal scroll on desktop (`body { overflow-x: clip }` in `src/styles/global.css`; removed redundant `width: 100vw` from `.bs-difference` and `.bs-form` in `src/pages/blindscreen/index.astro`).
- **2026-05-28** — Roadmap created. Baseline metrics seeded from `~/Downloads/https___shutter-envy.co.uk_-Performance-on-Search-2026-05-28.xlsx`. Two policy decisions captured: (a) new commercial hubs approved (Cafe-style, Faux Wood, Aluminium Plantation, Arched Window), (b) Derby/Derbyshire location coverage approved. No source files modified in this pass.

---

## F9 — Step-by-step: GSC Domain property + Bing Webmaster Tools

This is the one piece of Phase 1 plumbing that has to happen outside the repo. Until it's done, half your Google data is hidden in the URL-prefix property and you have no visibility into Bing/DuckDuckGo at all. Allow ~30 minutes total.

### F9.1 — Verify a Google Search Console **Domain property** for `shutter-envy.co.uk`

A Domain property covers every protocol and subdomain (`http://`, `https://`, `www.`, bare). The current property is URL-prefix only, which silently drops some impressions/clicks.

1. Sign in to [Google Search Console](https://search.google.com/search-console) with the same Google account that already owns the current property.
2. Click the property dropdown (top-left) → **Add property**.
3. In the left panel choose **Domain**, type `shutter-envy.co.uk` (no `https://`, no `www.`), then **Continue**.
4. Search Console will display a single **TXT record** (looks like `google-site-verification=...`). Copy it.
5. Go to your DNS provider (where the domain is registered — likely the same place that handles email/MX). Open the DNS records for `shutter-envy.co.uk`.
6. Add a new record:
   - **Type:** TXT
   - **Host / Name:** `@` (the root domain — *not* `www`)
   - **Value:** the full `google-site-verification=...` string from step 4
   - **TTL:** default (3600s / 1 hr is fine)
7. Save. Wait 5–10 minutes for DNS to propagate (sometimes faster).
8. Back in Search Console, click **Verify**. If it fails, wait another 10 minutes and click again — DNS propagation can take up to an hour but usually doesn't.
9. Once verified, **do not delete the old URL-prefix property** for at least 90 days — keep both so historical comparison still works. Set the new Domain property as the default in your bookmarks.

**Expected outcome:** new property starts collecting data immediately (no backfill — you'll see Day 1 today, Day 30 in a month). Numbers will be slightly higher than URL-prefix because it now captures `http://` and `www.` impressions too.

### F9.2 — Verify the site on **Bing Webmaster Tools**

Bing also powers DuckDuckGo and Yahoo. Free traffic you currently can't see.

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters) and sign in with any Microsoft account (create one if needed — use a business email, not a personal Hotmail).
2. Click **Add a site**.
3. Choose **Import from Google Search Console** (the easiest path now that F9.1 is done). Sign in with the same Google account that owns the GSC property. Bing will list verified GSC properties and import them in one click.
4. *(Fallback if the import flow ever breaks)*: choose **Add manually**, enter `https://shutter-envy.co.uk`, pick **DNS TXT** verification, and add a Bing-supplied TXT record the same way you did in F9.1.
5. Once verified, go to **Sitemaps** (left nav) → **Submit sitemap** → enter `https://shutter-envy.co.uk/sitemap-index.xml` → **Submit**.

**Expected outcome:** Bing starts crawling within 24–48 hours. You'll see Bing/DuckDuckGo traffic for the first time. Tick `F9` as done and log a screenshot/note of both verifications in this file's changelog.

---

## F12 — Step-by-step: Submit sitemap + request indexing on top product pages

Do this **after F9.1** is verified, because you want to be working in the new Domain property where all the data is.

### F12.1 — Submit the sitemap in Google Search Console

1. Open Search Console → **shutter-envy.co.uk** (Domain property).
2. Left nav → **Indexing → Sitemaps**.
3. In the "Add a new sitemap" field, paste exactly: `sitemap-index.xml` (the prefix `https://shutter-envy.co.uk/` is added automatically).
4. Click **Submit**.
5. Confirm status reads **Success** within a few seconds. The **Discovered URLs** count should match (or be slightly higher than) the page count in this repo. If it reads 0 or **Couldn't fetch**, open the sitemap URL in the browser first to confirm it returns XML — then re-submit.

### F12.2 — Request indexing on the top product/commercial pages

This nudges Google to re-crawl pages where you've just shipped schema or snippet changes. Do these one at a time — Google rate-limits the **URL inspection** tool to ~10 manual requests per day.

For **each** of the URLs below:

1. Search Console → **URL inspection** (the search bar at the top).
2. Paste the URL.
3. If it says "URL is on Google" but flags an old version, click **Request indexing** (top-right of the inspection panel).
4. If it says "URL is not on Google", still click **Request indexing**. Wait for the "Testing live URL" check to complete (~30 seconds).
5. You'll see "Indexing requested" — that's it. Don't refresh; don't repeat the same URL the same day.

Submit in this order — the highest-impact pages first:

1. `https://shutter-envy.co.uk/` (homepage — picks up the new `AggregateRating`)
2. `https://shutter-envy.co.uk/reviews/` (also picks up `AggregateRating`)
3. `https://shutter-envy.co.uk/our-shutters/` (new `Service` schema + better internal links from locations)
4. `https://shutter-envy.co.uk/our-blinds/` (new `Service` schema)
5. `https://shutter-envy.co.uk/awnings/` (new `Service` schema)
6. `https://shutter-envy.co.uk/blind-motorisation/` (new `Service` schema)
7. `https://shutter-envy.co.uk/blindscreen/` (new `Service` schema)
8. `https://shutter-envy.co.uk/portchester-aluminium-shutters-leicester/` (new `Service` schema)
9. `https://shutter-envy.co.uk/british-made-shutters/` (new `Service` schema)
10. `https://shutter-envy.co.uk/locations/shutters-in-charnwood/` (H1 fix + new services sidebar)

You'll hit the daily cap after ~10. If you want to push more, the remaining can wait 24h — submit the top-5 F1 snippet-polish blog posts on day 2:

11. `https://shutter-envy.co.uk/how-much-do-plantation-shutters-cost-a-complete-uk-price-guide/`
12. `https://shutter-envy.co.uk/are-window-shutters-worth-it-your-complete-guide-to-cost-value-and-style/`
13. `https://shutter-envy.co.uk/the-difference-between-wooden-and-faux-wood-shutters/`
14. `https://shutter-envy.co.uk/the-complete-uk-guide-to-plantation-shutters/`
15. `https://shutter-envy.co.uk/what-are-cafe-style-shutters-and-what-is-the-point-of-them/`

### F12.3 — Validate the new schema

While you're in Search Console, do one sanity check with Google's Rich Results Test:

1. Open [https://search.google.com/test/rich-results](https://search.google.com/test/rich-results).
2. Test each of these URLs once (these have new structured data):
   - `https://shutter-envy.co.uk/our-shutters/` → should detect `Service`, `BreadcrumbList`, `LocalBusiness`, `WebSite`, `WebPage`.
   - `https://shutter-envy.co.uk/reviews/` → should detect `AggregateRating` plus the breadcrumb.
   - `https://shutter-envy.co.uk/` → should detect `AggregateRating` on the LocalBusiness.
   - `https://shutter-envy.co.uk/locations/shutters-in-leicester/` → confirms the per-location og:image fallback hasn't broken anything; you should see `LocalBusiness`, `BreadcrumbList`, `FAQPage`.
3. If any test surfaces a warning (not error), screenshot it and add a note under that ID in this file. Errors mean roll back — but everything here is additive, so this is unlikely.

**Expected outcome:** within 7–14 days, the homepage and `/reviews/` should start showing a star rating in the SERP, and the product pages should be eligible for an enhanced Service-type snippet. Tick `F12` as done in the todo list above and add a one-line note under the appropriate KPI bucket in §K3.

---

## Appendix A — Top 25 opportunity queries

Source: GSC, 90 days ending 2026-05-26. "Current landing" is the page receiving the most impressions for that query today (or `—` if none). Numbers are real, not estimates.

- **A.1 plantation shutters** — 2,696 impr · 0.07% · pos 21.10 → `/the-complete-uk-guide-to-plantation-shutters/`. **Gap:** title and intro do not lead with commercial intent.
- **A.2 faux wood shutters** — 1,760 impr · 0.28% · pos 15.20 → `/the-difference-between-wooden-and-faux-wood-shutters/`. **Gap:** no dedicated commercial hub (`C2`).
- **A.3 plantation shutters cost** — 1,609 impr · 0.00% · pos 18.05 → `/how-much-do-plantation-shutters-cost-a-complete-uk-price-guide/`. **Gap:** cost table buried; meta description does not reassure on price (`C9`).
- **A.4 cafe style shutters** — 1,446 impr · 0.07% · pos 32.06 → none. **Gap:** no commercial hub (`C1`).
- **A.5 cafe shutters** — 1,245 impr · 0.00% · pos 30.59 → none. **Gap:** same as A.4 (`C1`).
- **A.6 plantation shutters uk** — 1,001 impr · 0.10% · pos 16.33 → `/the-complete-uk-guide-to-plantation-shutters/`. **Gap:** UK-specific signals missing (`C8`).
- **A.7 mdf shutters** — 968 impr · 0.00% · pos 48.49 → `/from-mdf-to-hardwood-choosing-the-right-shutter-material/`. **Gap:** title and content under-targeted for MDF.
- **A.8 shutters near me** — 907 impr · 0.33% · pos 15.86 → `/our-shutters/`. **Gap:** insufficient location reinforcement; depends on `F7`/`C5`.
- **A.9 shutters leicester** — 836 impr · 0.60% · pos 20.93 → `/locations/shutters-in-leicester/`. **Gap:** page itself ranks pos 31 (`C5`).
- **A.10 blinds leicester** — 807 impr · 0.37% · pos 13.26 → `/locations/shutters-in-leicester/`. **Gap:** location page is shutter-centric; needs blinds section (`C5`).
- **A.11 shutters vs blinds** — 689 impr · 0.00% · pos 24.79 → `/window-blinds-vs-shutters-which-is-right-for-your-home/`. **Gap:** weak title (`C7`).
- **A.12 what are plantation shutters** — 615 impr · 0.00% · pos 12.24 → `/the-complete-uk-guide-to-plantation-shutters/`. **Gap:** intro doesn't earn the click (`C8`).
- **A.13 are wood shutters better than faux wood** — 562 impr · 0.00% · pos 3.07 → `/the-difference-between-wooden-and-faux-wood-shutters/`. **Gap:** pure snippet rewrite (`C10`).
- **A.14 arched window shutters** — 558 impr · 0.00% · pos 13.33 → `/bespoke-arched-window-shutters-shutter-envy-leicestershire/`. **Gap:** no commercial hub (`C4`).
- **A.15 how much do shutters cost** — 556 impr · 0.18% · pos 14.69 → `/how-much-do-plantation-shutters-cost-a-complete-uk-price-guide/`. **Gap:** target term is "shutters" not "plantation shutters" (`C9`).
- **A.16 how long do faux wood shutters last** — 548 impr · 0.00% · pos 4.55 → `/the-difference-between-wooden-and-faux-wood-shutters/`. **Gap:** snippet rewrite (`C10`).
- **A.17 are faux wood shutters any good** — 540 impr · 0.19% · pos 1.54 → `/are-faux-wood-shutters-any-good-durability-cost-honest-verdict/`. **Gap:** ranks #1 but ~0% CTR — title competes with image carousels (`F1`).
- **A.18 shutters derby** — 522 impr · 0.19% · pos 57.72 → none. **Gap:** no Derby page (`C12`).
- **A.19 made to measure blinds in leicester** — 520 impr · 0.00% · pos 16.84 → `/locations/shutters-in-leicester/`. **Gap:** location page lacks blinds detail (`C5`).
- **A.20 are faux wood shutters expensive** — 510 impr · 0.00% · pos 4.27 → `/are-faux-wood-shutters-any-good-durability-cost-honest-verdict/`. **Gap:** add a "price honesty" section (`C10` + `F1`).
- **A.21 motorised blinds for bifold doors** — 503 impr · 0.20% · pos 24.03 → `/automated-blinds-for-bifold-doors-stylish-smart-practical/`. **Gap:** title is off-target; new post planned (`C11`).
- **A.22 automated blinds** — 489 impr · 0.00% · pos 38.80 → `/automated-blinds-the-smart-way-to-add-comfort-to-your-home/`. **Gap:** consider redirect into `/blind-motorisation/` if the post is thin.
- **A.23 shutter blinds** — 481 impr · 0.00% · pos 28.58 → `/our-shutters/`. **Gap:** no hybrid product page; consider an FAQ-style section.
- **A.24 are shutters blackout** — 480 impr · 0.00% · pos 16.81 → `/are-plantation-shutters-blackout-bedroom-shutter-guide/`. **Gap:** newly published, monitor.
- **A.25 aluminium shutters** — 471 impr · 0.00% · pos 19.74 → `/portchester-aluminium-shutters-leicester/`. **Gap:** product-brand page captures generic intent (`C3`).

## Appendix B — Page inventory (route → source file)

Locations slugs are intentionally inconsistent (`CLAUDE.md` §3). Do not normalise.

### Marketing & service routes

- `/` → `src/pages/index.astro` + `src/content/pages/home.md`
- `/about/` → `src/pages/about/index.astro` + `src/content/pages/about.md`
- `/awnings/` → `src/pages/awnings/index.astro` + `src/content/pages/awnings.md`
- `/blind-motorisation/` → `src/pages/blind-motorisation/index.astro` + `src/content/pages/blind-motorisation.md`
- `/blindscreen/` → `src/pages/blindscreen/index.astro` + `src/content/pages/blindscreen.md`
- `/brand/` → `src/pages/brand/index.astro` (noindex)
- `/british-made-shutters/` → `src/pages/british-made-shutters/index.astro` + `src/content/pages/british-made-shutters.md`
- `/contact/` → `src/pages/contact/index.astro` + `src/content/pages/contact.md`
- `/news/` → `src/pages/news/[...page].astro`
- `/our-blinds/` → `src/pages/our-blinds/index.astro` + `src/content/pages/our-blinds.md`
- `/our-shutters/` → `src/pages/our-shutters/index.astro` + `src/content/pages/our-shutters.md`
- `/our-shutters/colour-swatches/` → `src/pages/our-shutters/colour-swatches.astro` + `src/content/pages/colour-swatches.md`
- `/portchester-aluminium-shutters-leicester/` → `src/pages/portchester-aluminium-shutters-leicester/index.astro` + `src/content/pages/portchester-aluminium-shutters-leicester.md`
- `/privacy/` → `src/pages/privacy/index.astro` + `src/content/pages/privacy.md`
- `/recent-work/` → `src/pages/recent-work/index.astro` + `src/content/pages/recent-work.md`
- `/reviews/` → `src/pages/reviews/index.astro` + `src/content/pages/reviews.md`
- `/site-map/` → `src/pages/site-map/index.astro` + `src/content/pages/site-map.md`
- `/terms/` → `src/pages/terms/index.astro` + `src/content/pages/terms.md`

### Location routes (all via `src/pages/locations/[slug]/index.astro`)

- `/locations/` → `src/pages/locations/index.astro`
- `/locations/shutters-birstall/` → `src/content/locations/shutters-birstall.md`
- `/locations/shutters-groby/` → `src/content/locations/shutters-groby.md`
- `/locations/shutters-in-barrow-upon-soar/` → `src/content/locations/shutters-in-barrow-upon-soar.md`
- `/locations/shutters-in-charnwood/` → `src/content/locations/shutters-in-charnwood.md`
- `/locations/shutters-in-leicester/` → `src/content/locations/shutters-in-leicester.md`
- `/locations/shutters-in-loughborough/` → `src/content/locations/shutters-in-loughborough.md`
- `/locations/shutters-in-quorn/` → `src/content/locations/shutters-in-quorn.md`
- `/locations/shutters-in-rothley/` → `src/content/locations/shutters-in-rothley.md`
- `/locations/shutters-in-syston/` → `src/content/locations/shutters-in-syston.md`
- `/locations/shutters-market-harborough/` → `src/content/locations/shutters-market-harborough.md`
- `/locations/shutters-melton-mowbray/` → `src/content/locations/shutters-melton-mowbray.md`
- `/locations/shutters-sileby/` → `src/content/locations/shutters-sileby.md`

### Blog routes (77 posts, all via `src/pages/[slug]/index.astro`)

Every file in `src/content/blog/*.md` renders at root level (`/<slug>/`) per `CLAUDE.md` §2. Top-10 by impressions (90d):

- `/how-much-do-plantation-shutters-cost-a-complete-uk-price-guide/` (14,824 impr, pos 12)
- `/are-window-shutters-worth-it-your-complete-guide-to-cost-value-and-style/` (13,225 impr, pos 16)
- `/the-difference-between-wooden-and-faux-wood-shutters/` (12,314 impr, pos 13)
- `/the-complete-uk-guide-to-plantation-shutters/` (12,196 impr, pos 23)
- `/what-are-cafe-style-shutters-and-what-is-the-point-of-them/` (7,090 impr, pos 21)
- `/shutters-vs-blackout-blinds-for-noise-which-is-best-for-your-sleep/` (5,547 impr, pos 16)
- `/how-shutters-can-help-reduce-street-noise/` (4,634 impr, pos 12)
- `/how-to-choose-the-right-colour-shutter-for-your-room/` (4,290 impr, pos 11)
- `/portchester-aluminium-shutters-leicester/` (3,688 impr, pos 31)
- `/choosing-the-perfect-style-full-height-vs-tier-on-tier-shutters/` (3,687 impr, pos 11)

Remaining 67 posts are listed at `src/content/blog/` (filenames are slugs verbatim).

## Appendix C — GSC export storage

GSC exports live in `~/Downloads/` on the maintainer's machine and are **never committed** to the repository.

- 2026-05-28 export (used to seed §3.5 and Appendix A): `~/Downloads/https___shutter-envy.co.uk_-Performance-on-Search-2026-05-28.xlsx`. Sheets present: Chart, Queries, Pages, Countries, Devices, Search appearance, Filters.
- 2026-05-19 export (earlier reference): `~/Downloads/https___shutter-envy.co.uk_-Performance-on-Search-2026-05-19.xlsx`.

Future monthly exports follow the same naming pattern. When refreshing K1 in the Metrics log, drop the new file into `~/Downloads/`, run the analysis, and append a new dated row.
