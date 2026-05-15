# Launch checklist — Shutter Envy rebuild

The single most important file before flipping DNS. Work top-to-bottom on launch day.

---

## 🚨 Pre-launch (must be done before DNS cutover)

### Indexing / robots
- [ ] **Production Netlify deploy: confirm `PUBLIC_NOINDEX` is unset or `false`.**
      If it's still `true` from staging, the entire site will deindex.
      Verify after deploy: `curl https://shutter-envy.co.uk/robots.txt` should NOT
      show `Disallow: /`. View-source any page; `<meta name="robots">` should read
      `index,follow`.
- [ ] Confirm `PUBLIC_NOINDEX=true` IS still set on staging/branch-deploy contexts
      (so future previews stay private).

### Pixel / GA4
- [ ] Confirm GA4 ID in `src/components/Analytics.astro` is the production one
      (currently `G-CDBPY9EJBB`).
- [ ] Confirm Facebook Pixel ID `1214905783001306` matches the live one.
- [ ] Get the Meta Pixel events list from the agency and wire any missing
      conversion events (especially Lead on ClearLine form submit).
- [ ] If the agency uses domain verification via meta tag, paste the tag
      into `src/layouts/BaseLayout.astro` <head>.

### Tracking continuity
- [ ] Visit `/contact/` on the deployed site and submit a test enquiry through
      the ClearLine form. Confirm it lands in the inbox/CRM and that the Lead
      event fires in Meta Events Manager (test event tool).

### URL parity
- [ ] Run a final sitemap parity check: every URL from the LIVE
      `https://shutter-envy.co.uk/sitemap_index.xml` either (a) exists on the
      new site at the same path, or (b) has a logged 301 in `REDIRECTS.md`.
- [ ] Spot-check the 6 redirects in `public/_redirects` actually fire on the
      production domain after cutover.

### Schema sanity
- [ ] Paste `/`, `/our-shutters/`, `/contact/`, `/locations/shutters-in-leicester/`,
      and one blog post into Google's Rich Results Test. Confirm 0 errors each.

### Search Console
- [ ] Submit `https://shutter-envy.co.uk/sitemap-index.xml` (new path, with hyphen)
      to Search Console.
- [ ] The old `/sitemap_index.xml` URL 301s to the new one (via _redirects), so
      any existing GSC submission keeps resolving.
- [ ] Verify domain ownership is still valid post-cutover (DNS TXT records).

### Images
- [ ] Confirm the `/wp-content/uploads/` tree has been copied from the WP
      media library into `public/wp-content/uploads/` and deployed. Spot-check
      a few image URLs from the homepage gallery actually resolve.

### Forms
- [ ] Real ClearLine form submission works end-to-end from production domain
      (the form is an iframe — sometimes parent-domain referrer rules matter).
- [ ] Phone numbers in the header and footer are clickable and dial the right
      number on mobile.

### Performance / accessibility (nice-to-haves)
- [ ] Run a Lighthouse pass on home, /our-shutters/, a location, and a blog post.
- [ ] Run axe (or Lighthouse a11y) — minimum: every page has a single H1,
      images have alt text, contrast is reasonable.

---

## DNS cutover

- [ ] Lower the TTL on the existing DNS records to 300s **24 hours before** cutover.
- [ ] At cutover: point the apex `shutter-envy.co.uk` and `www.shutter-envy.co.uk`
      at Netlify per their DNS instructions.
- [ ] Netlify provisions Let's Encrypt automatically (HTTP→HTTPS redirect is built in).
- [ ] Confirm `www` 301s to apex (rule is in `_redirects`).

---

## Post-launch (within 24h)

- [ ] Crawl the live site (Screaming Frog or similar). Look for:
      - 4xx errors (anything broken?)
      - 301 chains (any redirect hopping twice?)
      - Pages noindex'd unintentionally
- [ ] Google Search Console:
      - Submit sitemap
      - Request indexing on the 5–10 highest-value URLs (home, /our-shutters/,
        /contact/, top locations)
      - Watch the Coverage report for de-indexing
- [ ] Confirm GA4 is receiving traffic (real-time view)
- [ ] Confirm Meta Pixel PageView is firing (Events Manager test events)
- [ ] Confirm at least one ClearLine form submission has landed correctly
- [ ] If the old WordPress site is still up somewhere (staging), put it
      behind basic auth or delete it — don't leave a duplicate-content site
      indexable.

---

## Parity QA status

- ✅ **All 10 launch-gate parity categories PASS** as of 2026-05-15 (see `PARITY-REPORT.md`)
- ⚠️ Post-launch cleanup: 21 dead links in blog body content point at non-existent `/locations/shutters-in-X/` slugs (typos/never-authored). Dead on live too — no regression. Worth a content sweep when time permits.

## Items deferred (track here so we don't forget)

- [ ] Charnwood broken H1 fix — live site has `Made-to-Measure Shutters in Shutters in Charnwood`
- [ ] Shared "Why Choose Shutter Envy" + "Transform Your Home Today" block on locations
- [ ] WP admin: fix `{{{data.link}}}` JetSearch leak (cosmetic, not user-visible)
- [ ] WP admin: fix duplicate H2 sections on `/our-blinds/` (Elementor bug)
- [ ] WP admin: fix Trustindex widget `data-pid=""` on `/reviews/`
- [ ] WP admin: replace UUID alt text on homepage gallery + recent-work tiles
- [ ] Per-location og:image (currently all 12 share a generic logo image)
- [ ] Real colour-swatch images on `/our-shutters/colour-swatches/`
- [ ] Per-tile click-through links on `/recent-work/` to the corresponding blog posts
- [ ] Conversions API (server-side Meta Pixel) — pending agency answer
