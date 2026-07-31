/**
 * News archive categories — one primary bucket per post (85 total).
 * Assigned from slug + title; overrides regex auto-detection on /news/.
 */
export const BLOG_CATEGORY_LABELS = {
  portchester: 'Portchester / Security',
  awnings: 'Awnings',
  blinds: 'Blinds',
  'bay-windows': 'Bay Windows',
  guides: 'Buying Guides',
  projects: 'Recent Projects',
  news: 'News & Awards',
  shutters: 'Shutters & Advice',
} as const;

export type BlogCategoryId = keyof typeof BLOG_CATEGORY_LABELS;

/** Slug → category. Every blog post in src/content/blog/ must appear here. */
export const BLOG_CATEGORY_BY_SLUG: Record<string, BlogCategoryId> = {
  // ─── Awnings ─────────────────────────────────────────────
  'outdoor-living-add-style-and-shade-with-our-awnings': 'awnings',

  // ─── Portchester / security ──────────────────────────────
  'portchester-aluminium-shutters-the-ultimate-security-style-solution-for-your-home': 'portchester',
  'security-meets-style-in-market-harborough-portchester-aluminium-shutters': 'portchester',

  // ─── Blinds (motorised & blind-focused) ──────────────────
  'automated-blinds-for-bifold-doors-stylish-smart-practical': 'blinds',
  'automated-blinds-the-smart-way-to-add-comfort-to-your-home': 'blinds',
  'best-blackout-blind-for-bifold-doors-leicestershire': 'blinds',
  'how-much-do-made-to-measure-blinds-cost-uk-2026': 'blinds',
  'motorised-blinds-a-smarter-way-to-control-your-home': 'blinds',
  'the-benefits-of-motorised-blinds-convenience-style-and-smart-home-integration': 'blinds',

  // ─── Bay windows (styles & specialty installs) ───────────
  'bi-folding-door-shutters-installation-in-leicestershire': 'bay-windows',
  'choosing-the-perfect-style-full-height-vs-tier-on-tier-shutters': 'bay-windows',
  'versatile-tier-on-tier-shutters-shutter-envy-leicestershire': 'bay-windows',
  'what-are-cafe-style-shutters-and-what-is-the-point-of-them': 'bay-windows',
  'bay-window-shutters-cost-uk-2026-guide': 'bay-windows',

  // ─── Buying guides (how-to, cost, comparisons, process) ────
  '7-signs-its-time-to-replace-your-old-blinds-with-shutters': 'guides',
  'are-faux-wood-shutters-any-good-durability-cost-honest-verdict': 'guides',
  'are-plantation-shutters-blackout-bedroom-shutter-guide': 'guides',
  'are-window-shutters-worth-it-your-complete-guide-to-cost-value-and-style': 'guides',
  'are-window-shutters-still-in-style-timeless-elegance-in-loughborough-leicester': 'guides',
  'choosing-timeless-shutters-as-a-christmas-gift-to-your-home': 'guides',
  'diy-vs-professional-shutter-installation-making-the-right-choice-for-your-home': 'guides',
  'diy-vs-professional-shutter-installation-whats-right-for-you': 'guides',
  'dont-get-shutter-struck-your-essential-guide-to-buying-shutters': 'guides',
  'from-mdf-to-hardwood-choosing-the-right-shutter-material': 'guides',
  'how-much-do-plantation-shutters-cost-a-complete-uk-price-guide': 'guides',
  'shutter-blinds-explained-uk-guide': 'guides',
  'are-mdf-shutters-any-good-honest-uk-verdict': 'guides',
  'are-aluminium-shutters-worth-it-uk-buyers-guide': 'guides',
  'do-shutters-reduce-noise-uk-honest-guide': 'guides',
  'shutters-vs-blinds-honest-uk-comparison-2026': 'guides',
  'can-you-fit-shutters-on-upvc-windows-uk-guide': 'guides',
  'plantation-shutters-for-french-doors-uk-buyers-guide': 'guides',
  'how-to-choose-a-shutter-specialist-in-leicester-what-to-look-for': 'guides',
  'how-to-choose-the-right-colour-shutter-for-your-room': 'guides',
  'just-moved-in-lets-talk-shutters-for-your-new-build': 'guides',
  'leicester-shutters-and-blinds-transform-your-home-with-style-and-innovation': 'guides',
  'overcoming-common-shutter-challenges-in-new-build-homes': 'guides',
  'plantation-shutters-in-loughborough-why-local-homeowners-are-choosing-shutter-envy': 'guides',
  'shutters-blinds-north-leicestershire': 'guides',
  'shutters-in-leicester-prices-timelines-quote-checklist': 'guides',
  'shutters-vs-blackout-blinds-for-noise-which-is-best-for-your-sleep': 'guides',
  'shutters-vs-curtains-which-is-right-for-your-home': 'guides',
  'the-complete-uk-guide-to-plantation-shutters': 'guides',
  'the-shutter-envy-process-from-survey-to-installation': 'guides',
  'what-happens-during-a-shutter-installation-a-look-behind-the-scenes': 'guides',
  'why-measuring-yourself-can-be-a-costly-mistake': 'guides',
  'window-blinds-vs-shutters-which-is-right-for-your-home': 'guides',
  'wood-vs-pvc-shutters-which-is-best-for-winter-warmth-in-loughborough-and-leicester-homes': 'guides',

  // ─── Recent projects (install stories & local showcases) ───
  'bay-window-shutters-installed': 'projects',
  'bespoke-arched-window-shutters-shutter-envy-leicestershire': 'projects',
  'bypass-track-shutter-in-mountsorrel': 'projects',
  'awning-installation-in-mountsorrel': 'projects',
  'shutter-installation-in-lowdham': 'projects',
  'custom-shutters-for-new-build-home-in-loughborough': 'projects',
  'elegant-bay-window-shutter-installation-in-stamford': 'projects',
  'kitchen-shutter-install-in-woodhouse-leicestershire': 'projects',
  'modern-shutter-installations-in-charnwood-what-to-expect': 'projects',
  'one-of-our-customers-showed-us-his-new-shutters': 'projects',
  'shutter-installation-queniborough': 'projects',
  'stylish-bay-window-shutter-in-burbage': 'projects',
  'transformative-elegance-british-made-faux-wood-shutters-in-silk-white-market-harborough': 'projects',
  'transforming-your-homes-curb-appeal-with-custom-shutters': 'projects',
  'why-loughborough-homeowners-love-our-bespoke-shutters': 'projects',

  // ─── News & awards (company updates, seasons, reviews) ───
  'bonfire-night-bliss-behind-our-shutters': 'news',
  'celebrating-40-glowing-five-star-reviews': 'news',
  'happy-halloween-from-shutter-envy': 'news',
  'meet-kerry-our-new-shutter-envy-surveyor': 'news',
  'merry-christmas-from-shutter-envy-2025-26': 'news',
  'new-website-for-shutter-envy': 'news',
  'new-year-fresh-home-why-2026-is-the-perfect-time-for-new-shutters': 'news',
  'shutter-envy-named-blind-shutter-specialists-of-the-year-for-third-year-running': 'news',
  'shutter-envy-wins-2026-award-of-excellence': 'news',
  'shutter-envy-wins-prestigious-award-of-excellence-2025': 'news',
  'bbsa-accredited-specialist-shutter-envy': 'news',
  'transform-your-home-with-shutter-envy-real-reviews-real-results': 'news',
  'what-a-review-from-amie': 'news',
  'what-our-customers-say-recent-success-across-leicestershire': 'news',

  // ─── Shutters & advice (benefits, materials, trends) ─────
  'are-shutters-better-than-curtains-for-privacy': 'shutters',
  'are-window-shutters-still-on-trend': 'shutters',
  'beyond-beauty-how-shutters-become-your-homes-winter-fortress': 'shutters',
  'can-your-shutters-survive-the-bathroom': 'shutters',
  'eco-friendly-window-treatments-are-shutters-the-greener-choice': 'shutters',
  'how-shutters-can-help-reduce-street-noise': 'shutters',
  'minimalist-traditional-coastal-shutters-for-every-vibe': 'shutters',
  'my-windows-arent-standard-size-can-i-still-get-shutters': 'shutters',
  'pairing-bespoke-shutters-with-your-homes-architecture-in-the-east-midlands': 'shutters',
  'summer-shade-stay-cool-with-smart-window-coverings': 'shutters',
  'the-difference-between-wooden-and-faux-wood-shutters': 'shutters',
  'why-made-to-measure-shutters-make-all-the-difference': 'shutters',
  'why-plantation-shutters-are-perfect-for-winter-in-leicestershire-homes': 'shutters',
};

export const BLOG_CATEGORY_ORDER: BlogCategoryId[] = [
  'portchester',
  'awnings',
  'blinds',
  'bay-windows',
  'guides',
  'projects',
  'news',
  'shutters',
];
