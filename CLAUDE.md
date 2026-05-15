# Shutter Envy — Astro Rebuild

Like-for-like rebuild of the live WordPress/Elementor site at **https://shutter-envy.co.uk** into Astro. The live site has 18 months of SEO equity and is the business's primary enquiry channel. **Protecting SEO is the top priority of this project** — it outranks code elegance, performance micro-wins, and "tidying up."

If a decision is ever ambiguous, the tiebreaker is: *does this risk an existing ranking URL?* If yes, don't do it without an explicit, logged exception.

---

## 1. URLs are sacred

- Every page on the new site **must live at the exact same path as the live site**. No exceptions without explicit approval.
- **Never** "tidy", shorten, normalise, lowercase-fix, or restructure a slug. Copy slugs **verbatim** from the live site, including any inconsistencies (see §3).
- If a URL genuinely must change, it must be:
  1. Logged in `REDIRECTS.md` (old → new, reason, date),
  2. Given a permanent **301** redirect to the new URL,
  3. Approved before the change ships.
- **Trailing slashes are mandatory.** The live site serves URLs with a trailing slash (e.g. `/locations/shutters-in-leicester/`). Astro must be configured to match:
  ```js
  // astro.config.mjs
  export default defineConfig({
    site: 'https://shutter-envy.co.uk',
    trailingSlash: 'always',
    build: { format: 'directory' },
  });
  ```
- The canonical URL inventory is the live site's **sitemap.xml** (`https://shutter-envy.co.uk/sitemap.xml` or `sitemap_index.xml`). Before launch, every URL in that sitemap must either (a) exist at the same path on the new site, or (b) have a logged 301.

## 2. Page templates

There are exactly **three** real page templates. Don't invent more.

1. **Page** — standard top-level marketing pages (e.g. `/about/`, `/contact/`).
2. **Location** — WordPress custom post type, currently under `/locations/<slug>/`. Treat as a content collection in Astro.
3. **Blog post (Article)** — lives at the **root level** (`/<post-slug>/`, **not** `/blog/<slug>/`). The listing page is `/news/`. Do not move posts under `/blog/` or `/news/<slug>/` — that would break every existing post URL.

## 3. Location slug inconsistency — preserve it

Location slugs on the live site are **not** consistent. Examples:
- `/locations/shutters-in-leicester/`
- `/locations/shutters-market-harborough/` *(no "in-")*

**Do not normalise these.** Copy each slug exactly as it appears in the WordPress export / live sitemap. If you're tempted to "fix" one for consistency, stop — that's a ranking URL.

## 4. Per-page SEO requirements

Every rendered page must include:

- `<title>` — unique per page, copied from the live site unless explicitly rewritten.
- `<meta name="description">` — unique per page.
- **Exactly one `<h1>`** per page. No more, no fewer.
- Self-referencing **canonical**: `<link rel="canonical" href="https://shutter-envy.co.uk/<path>/">` with trailing slash.
- **Open Graph** tags: `og:title`, `og:description`, `og:url`, `og:image`, `og:type`.
- **Schema.org JSON-LD**, appropriate to the template:
  - **Page** (home / contact / about): `LocalBusiness` (on home + contact at minimum), `BreadcrumbList`.
  - **Location**: `LocalBusiness` scoped to the area, `BreadcrumbList`, and `FAQPage` if the page has an FAQ section.
  - **Blog post**: `Article` (or `BlogPosting`), `BreadcrumbList`.

A shared `<BaseLayout>` / `<SEO>` component should make it impossible to render a page without these. Treat a missing canonical or duplicate H1 as a build-blocking bug.

## 5. Enquiry form — do not modify

- The enquiry form is a **third-party embed from ClearLine Connect** (`link.clearlineconnect.io`).
- It is **the** conversion path for the business. Preserve the embed exactly as it appears on the live site — same script, same container, same placement on each page that currently has it.
- Do **not** swap it for a custom Astro form, a Netlify form, or any other "improvement." If the embed needs to change, that's a separate, explicit decision.

## 6. Tracking — preserve exactly

Both of these run on the live site and must be carried over **verbatim**, on every page:

- **GA4** — keep the existing measurement ID (confirm before launch).
- **Facebook Pixel** via PixelYourSite — Pixel ID **`1214905783001306`**.

Load them in the `<head>` (or per their official snippet's recommended placement). Do not "modernise" the snippets — copy them as-is from the live site so events/conversions keep firing identically.

A simple cookie/consent banner can be added later, but tracking parity comes first.

## 7. Images & media

- Live images are served from `/wp-content/uploads/YYYY/MM/<file>`.
- **Preserve these paths verbatim.** Copy the migrated media library into `public/wp-content/uploads/...` so every existing `<img src>`, hotlink, and Google Image result continues to resolve.
- Do **not** route images through Astro's image pipeline if doing so changes the URL. (We can revisit perf optimisations *after* launch, with redirects.)
- New images added post-launch can go under `/images/` or use the Astro pipeline — that's fine because they have no existing equity.

## 8. Working agreements for Claude

- Before changing any URL, slug, image path, embed, or tracking snippet: **stop and ask**. These are the high-risk surfaces.
- Maintain `REDIRECTS.md` as the single source of truth for any URL change.
- Before launch, run a parity check: every URL from `sitemap.xml` on the live site resolves on the new site (or has a 301 logged).
- Don't add features, pages, or routes that don't exist on the live site without asking. This is a rebuild, not a redesign.
- Keep the three templates (Page, Location, Article) as the only templates. Resist abstraction creep.

## 9. Stack

- **Astro** (static, `output: 'static'`), `trailingSlash: 'always'`, `build.format: 'directory'`.
- Content via Astro content collections (one collection per template type).
- No CMS in v1 — content authored in `.md`/`.mdx` files migrated from the WordPress export.
