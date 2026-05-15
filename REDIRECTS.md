# Redirects

The default for this rebuild is **zero URL changes** (CLAUDE.md §1). Every entry below is either (a) a redirect already in place on the live WordPress site that we need to carry over, or (b) an explicit, approved exception.

Format: `old_path → new_path  (status, reason, date)`

---

## Inherited from the live site (must be preserved)

These 301s already exist on shutter-envy.co.uk and were detected during the crawl. They've been live for months and have accumulated link equity — preserve them exactly.

- `/window-shutters-leicestershire/` → `/our-shutters/`  (301, inherited from live WP, 2026-05-15)
- `/custom-window-shutters-installation-shutter-envy-leicestershire/` → `/our-shutters/`  (301, inherited from live WP, 2026-05-15)

## Approved exceptions for the rebuild

- `/privacy-2/` → `/privacy/`  (301, orphan duplicate stub — `/privacy/` is the canonical privacy page with full nav and 18 internal links; `/privacy-2/` has only 1 internal link and was effectively unreachable. Approved by Ben, 2026-05-15)

## Sitemap URL preservation

- `/sitemap_index.xml` → `/sitemap-index.xml`  (301, Astro's @astrojs/sitemap emits with a hyphen rather than the underscore Rank Math used. Preserves Search Console submissions. 2026-05-15)

## Host canonicalisation

- `https://www.shutter-envy.co.uk/*` → `https://shutter-envy.co.uk/:splat`  (301, www → apex)

## WP image-attachment pages (to be 301'd to parent post)

WordPress renders an attachment page at `/<post-slug>/<image-slug>/` for some media. These have no SEO value and shouldn't exist in the rebuild. The crawl found 7. The redirect target is the parent post.

(Full list to be enumerated from `capture/inventory.json` where `page_type` = `unknown` or has the attachment URL pattern. Approved by Ben, 2026-05-15.)

---

## Sitemap additions (NOT redirects — clarifying note)

The following URLs are live on the site but missing from the current `sitemap.xml`. They will be **included** in the new sitemap (no redirect):

- `/locations/shutters-in-charnwood/` — live location page, internally linked, no reason to lose it.
- `/bay-window-shutters-installed/` — live blog post, missing from WP sitemap.
- `/stylish-bay-window-shutter-in-burbage/` — live blog post, missing from WP sitemap.
- `/elegant-bay-window-shutter-installation-in-stamford/` — live blog post, missing from WP sitemap.

Decision (Ben, 2026-05-15): blog posts should always be in the sitemap. The new Astro sitemap generator must include every blog post automatically — not rely on a manual list.
