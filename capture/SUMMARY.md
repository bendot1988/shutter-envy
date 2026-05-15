# Shutter Envy — Live Site Inventory Summary

Crawled 119 URLs on shutter-envy.co.uk. Source files: `inventory.json` (full), `inventory.csv` (flat), `images.csv`, `sitemap-urls.txt`, `crawled-urls.txt`, `crawl-failures.txt`.

## Totals

- **blog_post**: 78
- **page**: 13
- **location**: 12
- **unknown**: 7
- **blog_index**: 5
- **legal**: 3
- **home**: 1

## Sitemap vs Crawl Diff

- Sitemap URLs: 104
- Crawled URLs: 119
- In sitemap but not crawled: **0**
- Crawled but not in sitemap: **15**
  - https://shutter-envy.co.uk/bay-window-shutters-installed/
  - https://shutter-envy.co.uk/bespoke-arched-window-shutters-shutter-envy-leicestershire/791727622-492205289_1034800048712267_5309738397671176552_n-large/
  - https://shutter-envy.co.uk/bespoke-arched-window-shutters-shutter-envy-leicestershire/791727630-492001443_1034799728712299_4398194868688013789_n-large/
  - https://shutter-envy.co.uk/bespoke-arched-window-shutters-shutter-envy-leicestershire/791727643-492994671_1034799932045612_924744254860245336_n-large/
  - https://shutter-envy.co.uk/bespoke-arched-window-shutters-shutter-envy-leicestershire/791727650-492010221_1034800252045580_6588738170356077864_n-large/
  - https://shutter-envy.co.uk/bi-folding-door-shutters-installation-in-leicestershire/791726782-499411522_1054557353403203_8239367360171782071_n/
  - https://shutter-envy.co.uk/bi-folding-door-shutters-installation-in-leicestershire/791726789-499997187_1054557206736551_311205241375909186_n/
  - https://shutter-envy.co.uk/bi-folding-door-shutters-installation-in-leicestershire/791726814-499549747_1054557146736557_3501241845264051156_n-1/
  - https://shutter-envy.co.uk/elegant-bay-window-shutter-installation-in-stamford/
  - https://shutter-envy.co.uk/locations/shutters-in-charnwood/
  - https://shutter-envy.co.uk/news/page/2/
  - https://shutter-envy.co.uk/news/page/3/
  - https://shutter-envy.co.uk/news/page/4/
  - https://shutter-envy.co.uk/news/page/5/
  - https://shutter-envy.co.uk/stylish-bay-window-shutter-in-burbage/

## Top Issues

### Site-wide: `og:locale` is `en_US` on every page
All **119** crawled pages emit `<meta property="og:locale" content="en_US" />`. 
Brand is UK-based, copy is in British English. Should be `en_GB`. 
This is set by Rank Math globally — fix in the Astro `<SEO>` component.

### Missing meta description
None.

### Missing canonical
8 pages:
  - https://shutter-envy.co.uk/bay-window-shutters-installed/
  - https://shutter-envy.co.uk/news/page/2/
  - https://shutter-envy.co.uk/news/page/3/
  - https://shutter-envy.co.uk/news/page/4/
  - https://shutter-envy.co.uk/news/page/5/
  - https://shutter-envy.co.uk/locations/shutters-in-charnwood/
  - https://shutter-envy.co.uk/stylish-bay-window-shutter-in-burbage/
  - https://shutter-envy.co.uk/elegant-bay-window-shutter-installation-in-stamford/

### Missing H1 (no_h1)
  - https://shutter-envy.co.uk/terms/
  - https://shutter-envy.co.uk/privacy-2/
  - https://shutter-envy.co.uk/privacy/

### Multiple H1s
  - https://shutter-envy.co.uk/site-map/ (h1 count = 2)

### Duplicate titles across distinct URLs
- (5×) `News – Latest on Blinds and Wooden Shutters UK`
    - https://shutter-envy.co.uk/news/
    - https://shutter-envy.co.uk/news/page/2/
    - https://shutter-envy.co.uk/news/page/3/
    - https://shutter-envy.co.uk/news/page/4/
    - https://shutter-envy.co.uk/news/page/5/
- (5×) `Arched Window Shutters in Leicestershire | Shutter Envy`
    - https://shutter-envy.co.uk/bespoke-arched-window-shutters-shutter-envy-leicestershire/
    - https://shutter-envy.co.uk/bespoke-arched-window-shutters-shutter-envy-leicestershire/791727622-492205289_1034800048712267_5309738397671176552_n-large/
    - https://shutter-envy.co.uk/bespoke-arched-window-shutters-shutter-envy-leicestershire/791727630-492001443_1034799728712299_4398194868688013789_n-large/
    - https://shutter-envy.co.uk/bespoke-arched-window-shutters-shutter-envy-leicestershire/791727643-492994671_1034799932045612_924744254860245336_n-large/
    - https://shutter-envy.co.uk/bespoke-arched-window-shutters-shutter-envy-leicestershire/791727650-492010221_1034800252045580_6588738170356077864_n-large/
- (4×) `Bi-fold Door Shutters in Leicestershire | Shutter Envy`
    - https://shutter-envy.co.uk/bi-folding-door-shutters-installation-in-leicestershire/
    - https://shutter-envy.co.uk/bi-folding-door-shutters-installation-in-leicestershire/791726782-499411522_1054557353403203_8239367360171782071_n/
    - https://shutter-envy.co.uk/bi-folding-door-shutters-installation-in-leicestershire/791726789-499997187_1054557206736551_311205241375909186_n/
    - https://shutter-envy.co.uk/bi-folding-door-shutters-installation-in-leicestershire/791726814-499549747_1054557146736557_3501241845264051156_n-1/
- (3×) `Plantation Shutters in Leicester, Loughborough & Leicestershire | Shutter Envy`
    - https://shutter-envy.co.uk/our-shutters/
    - https://shutter-envy.co.uk/window-shutters-leicestershire/
    - https://shutter-envy.co.uk/custom-window-shutters-installation-shutter-envy-leicestershire/
- (2×) `Privacy - Shutter Envy`
    - https://shutter-envy.co.uk/privacy-2/
    - https://shutter-envy.co.uk/privacy/
- (2×) `Bespoke Shutters & Blinds for Leicester & North Leicestershire`
    - https://shutter-envy.co.uk/shutters-blinds-north-leicestershire/
    - https://shutter-envy.co.uk/from-mdf-to-hardwood-choosing-the-right-shutter-material/

### Duplicate H1s across distinct URLs
- (5×) Shutter Envy News
    - https://shutter-envy.co.uk/news/
    - https://shutter-envy.co.uk/news/page/2/
    - https://shutter-envy.co.uk/news/page/3/
    - https://shutter-envy.co.uk/news/page/4/
    - https://shutter-envy.co.uk/news/page/5/
- (5×) Arched Window Shutters in Leicestershire
    - https://shutter-envy.co.uk/bespoke-arched-window-shutters-shutter-envy-leicestershire/
    - https://shutter-envy.co.uk/bespoke-arched-window-shutters-shutter-envy-leicestershire/791727622-492205289_1034800048712267_5309738397671176552_n-large/
    - https://shutter-envy.co.uk/bespoke-arched-window-shutters-shutter-envy-leicestershire/791727630-492001443_1034799728712299_4398194868688013789_n-large/
    - https://shutter-envy.co.uk/bespoke-arched-window-shutters-shutter-envy-leicestershire/791727643-492994671_1034799932045612_924744254860245336_n-large/
    - https://shutter-envy.co.uk/bespoke-arched-window-shutters-shutter-envy-leicestershire/791727650-492010221_1034800252045580_6588738170356077864_n-large/
- (4×) Bi-folding Door Shutters Installation in Leicestershire
    - https://shutter-envy.co.uk/bi-folding-door-shutters-installation-in-leicestershire/
    - https://shutter-envy.co.uk/bi-folding-door-shutters-installation-in-leicestershire/791726782-499411522_1054557353403203_8239367360171782071_n/
    - https://shutter-envy.co.uk/bi-folding-door-shutters-installation-in-leicestershire/791726789-499997187_1054557206736551_311205241375909186_n/
    - https://shutter-envy.co.uk/bi-folding-door-shutters-installation-in-leicestershire/791726814-499549747_1054557146736557_3501241845264051156_n-1/
- (3×) Plantation Shutters in Leicester, Loughborough and Leicestershire
    - https://shutter-envy.co.uk/our-shutters/
    - https://shutter-envy.co.uk/window-shutters-leicestershire/
    - https://shutter-envy.co.uk/custom-window-shutters-installation-shutter-envy-leicestershire/

### Redirects from sitemap URLs
Sitemap-listed URLs that 301/302 elsewhere (these are legacy slugs still in the index; need 301s preserved in Astro):
  - https://shutter-envy.co.uk/window-shutters-leicestershire/ → https://shutter-envy.co.uk/our-shutters/
  - https://shutter-envy.co.uk/custom-window-shutters-installation-shutter-envy-leicestershire/ → https://shutter-envy.co.uk/our-shutters/
  - https://shutter-envy.co.uk/bespoke-arched-window-shutters-shutter-envy-leicestershire/791727622-492205289_1034800048712267_5309738397671176552_n-large/ → https://shutter-envy.co.uk/bespoke-arched-window-shutters-shutter-envy-leicestershire/
  - https://shutter-envy.co.uk/bespoke-arched-window-shutters-shutter-envy-leicestershire/791727630-492001443_1034799728712299_4398194868688013789_n-large/ → https://shutter-envy.co.uk/bespoke-arched-window-shutters-shutter-envy-leicestershire/
  - https://shutter-envy.co.uk/bespoke-arched-window-shutters-shutter-envy-leicestershire/791727643-492994671_1034799932045612_924744254860245336_n-large/ → https://shutter-envy.co.uk/bespoke-arched-window-shutters-shutter-envy-leicestershire/
  - https://shutter-envy.co.uk/bespoke-arched-window-shutters-shutter-envy-leicestershire/791727650-492010221_1034800252045580_6588738170356077864_n-large/ → https://shutter-envy.co.uk/bespoke-arched-window-shutters-shutter-envy-leicestershire/
  - https://shutter-envy.co.uk/bi-folding-door-shutters-installation-in-leicestershire/791726782-499411522_1054557353403203_8239367360171782071_n/ → https://shutter-envy.co.uk/bi-folding-door-shutters-installation-in-leicestershire/
  - https://shutter-envy.co.uk/bi-folding-door-shutters-installation-in-leicestershire/791726789-499997187_1054557206736551_311205241375909186_n/ → https://shutter-envy.co.uk/bi-folding-door-shutters-installation-in-leicestershire/
  - https://shutter-envy.co.uk/bi-folding-door-shutters-installation-in-leicestershire/791726814-499549747_1054557146736557_3501241845264051156_n-1/ → https://shutter-envy.co.uk/bi-folding-door-shutters-installation-in-leicestershire/

### Canonical mismatch
None detected (modulo trailing-slash normalisation).

### WordPress image-attachment pages found in internal links
These are auto-generated `/<post-slug>/<image-name>/` pages — WordPress media attachments. 
They mostly 301 back to the parent post but **a few render as full pages**. They are NOT in the sitemap, have no SEO equity, 
and **should not be rebuilt**. The Recent Work / blog post galleries link to them — clean the link sources during migration.

  - https://shutter-envy.co.uk/bespoke-arched-window-shutters-shutter-envy-leicestershire/791727622-492205289_1034800048712267_5309738397671176552_n-large/
  - https://shutter-envy.co.uk/bespoke-arched-window-shutters-shutter-envy-leicestershire/791727630-492001443_1034799728712299_4398194868688013789_n-large/
  - https://shutter-envy.co.uk/bespoke-arched-window-shutters-shutter-envy-leicestershire/791727643-492994671_1034799932045612_924744254860245336_n-large/
  - https://shutter-envy.co.uk/bespoke-arched-window-shutters-shutter-envy-leicestershire/791727650-492010221_1034800252045580_6588738170356077864_n-large/
  - https://shutter-envy.co.uk/bi-folding-door-shutters-installation-in-leicestershire/791726782-499411522_1054557353403203_8239367360171782071_n/
  - https://shutter-envy.co.uk/bi-folding-door-shutters-installation-in-leicestershire/791726789-499997187_1054557206736551_311205241375909186_n/
  - https://shutter-envy.co.uk/bi-folding-door-shutters-installation-in-leicestershire/791726814-499549747_1054557146736557_3501241845264051156_n-1/

### Elementor template placeholder leaking into HTML
A handful of pages emit literal `{{{data.link}}}` strings inside `<a href>` attributes — this is an unrendered Elementor/Loop-Grid Handlebars template token. 
It produces broken internal links like `/contact/{{{data.link}}}/`. We discovered 22 of these during the crawl (logged in `crawl-failures.txt`). They are not real URLs. 
**Action:** flag for the client; do not replicate in the rebuild.

  - on page https://shutter-envy.co.uk/ → `https://shutter-envy.co.uk/{{{data.link}}}/`
  - on page https://shutter-envy.co.uk/our-shutters/ → `https://shutter-envy.co.uk/our-shutters/{{{data.link}}}/`
  - on page https://shutter-envy.co.uk/recent-work/ → `https://shutter-envy.co.uk/recent-work/{{{data.link}}}/`
  - on page https://shutter-envy.co.uk/portchester-aluminium-shutters-leicester/ → `https://shutter-envy.co.uk/portchester-aluminium-shutters-leicester/{{{data.link}}}/`
  - on page https://shutter-envy.co.uk/awnings/ → `https://shutter-envy.co.uk/awnings/{{{data.link}}}/`
  - on page https://shutter-envy.co.uk/blind-motorisation/ → `https://shutter-envy.co.uk/blind-motorisation/{{{data.link}}}/`
  - on page https://shutter-envy.co.uk/our-blinds/ → `https://shutter-envy.co.uk/our-blinds/{{{data.link}}}/`
  - on page https://shutter-envy.co.uk/contact/ → `https://shutter-envy.co.uk/contact/{{{data.link}}}/`
  - on page https://shutter-envy.co.uk/terms/ → `https://shutter-envy.co.uk/terms/{{{data.link}}}/`
  - on page https://shutter-envy.co.uk/british-made-shutters/ → `https://shutter-envy.co.uk/british-made-shutters/{{{data.link}}}/`

## /locations/ slugs (verbatim — preserve exactly)

Per CLAUDE.md §3 these are deliberately inconsistent. Do not normalise.

- `/locations/shutters-in-loughborough/`
- `/locations/shutters-in-quorn/`
- `/locations/shutters-in-rothley/`
- `/locations/shutters-in-barrow-upon-soar/`
- `/locations/shutters-birstall/`
- `/locations/shutters-in-syston/`
- `/locations/shutters-groby/`
- `/locations/shutters-sileby/`
- `/locations/shutters-in-leicester/`
- `/locations/shutters-melton-mowbray/`
- `/locations/shutters-market-harborough/`
- `/locations/shutters-in-charnwood/`

Notes:
- `shutters-in-charnwood` is **live on the site (200 OK) and linked from /portchester-aluminium-shutters-leicester/, but is NOT in `locations-sitemap.xml`**. Either add to sitemap or 301 it.
- The 'in-' prefix is inconsistent: `shutters-in-X` (Loughborough, Quorn, Rothley, Barrow-upon-Soar, Syston, Leicester, Charnwood) vs. `shutters-X` (Birstall, Groby, Sileby, Melton Mowbray, Market Harborough). Preserve as-is.

## JSON-LD types observed (aggregate count)

- ImageObject × 618
- Person × 416
- WebSite × 214
- Organization × 202
- WebPage × 202
- BlogPosting × 166
- Question × 59
- Answer × 59
- Article × 36
- CollectionPage × 12
- FAQPage × 5
- SearchAction × 2

Templates used by Rank Math: every page emits a `WebPage` + `WebSite` + `Organization` graph. Blog posts add `BlogPosting`. Some legacy posts use `Article` (mixed schema — pick one for the rebuild). FAQPage shows up 5× (location pages with FAQ sections). No `LocalBusiness` schema detected — **gap vs CLAUDE.md §4 which requires LocalBusiness on home, contact, and location pages**.

## News / blog index pagination

- `/news/` is the canonical listing. Paginated URLs `/news/page/2/`, `/page/3/`, `/page/4/` return real content.
- `/news/page/5/` and beyond return a **soft-404** (HTTP 200 with empty results template). Do not generate stub pages past 4. With ~76 posts and 6 per page, page 4 is the last meaningful one.
- `/news/page/1/` returns 0 bytes (degenerate).

## Surprises worth a human eye

1. **`og:locale` is `en_US` site-wide.** Fix in the rebuild.
2. **`shutters-in-charnwood` location exists but is missing from the sitemap.** It's linked from the Portchester page. Either add it to the sitemap or 301 it. Worth asking the client whether this is intentional.
3. **3 blog posts live but missing from sitemap**: `/bay-window-shutters-installed/`, `/stylish-bay-window-shutter-in-burbage/`, `/elegant-bay-window-shutter-installation-in-stamford/`. Linked from `/recent-work/`. Add to sitemap or 301.
4. **2 sitemap-listed posts redirect to `/our-shutters/`**: `/window-shutters-leicestershire/` and `/custom-window-shutters-installation-shutter-envy-leicestershire/`. They have 301s in place today — preserve those 301s in Astro (`REDIRECTS.md`).
5. **Duplicate titles + H1s on 4 location pages** (Arched x5, Bi-fold x4, Plantation x3, etc.) — Rank Math is reusing the same templated meta. SEO risk, but matches the live site; flag as 'should-fix-later' rather than block launch.
6. **Two privacy pages**: `/privacy/` and `/privacy-2/` (both in sitemap). One is likely abandoned. Likely candidate for consolidation post-launch with a 301.
7. **WordPress media attachment pages** render as full pages on some posts (see list above). 7 distinct ones surfaced. They have alt-only content. Don't carry over.
8. **`{{{data.link}}}` template tokens in rendered HTML** — an Elementor Loop Grid is mis-configured somewhere. Affects ~22 distinct broken-link patterns. Worth fixing in WP before migration to avoid bad-link signals.
9. **No `LocalBusiness` JSON-LD anywhere on the live site** — including `/contact/`. CLAUDE.md §4 requires this; opportunity to *improve* SEO during the rebuild (this is an addition, not a URL change, so safe).
