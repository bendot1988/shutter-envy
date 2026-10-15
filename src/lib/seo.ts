/**
 * Normalise titles and meta descriptions at render time.
 * Never clip: over-length values render in full and warn at build so they
 * can be fixed at source (or given a hand-written `seoTitle`).
 */

const TITLE_MAX = 60;
const DESC_MIN = 150;
const DESC_MAX = 160;

const BRAND = 'Shutter Envy';
const BRAND_SUFFIX = ' | Shutter Envy';
const DESC_PAD =
  ' Free home survey across Leicester, Loughborough and Leicestershire.';

function warn(kind: string, path: string | undefined, value: string, max: number) {
  console.warn(`[seo] ${kind} over ${max} chars (${value.length}) on ${path ?? '(unknown path)'}: "${value}"`);
}

export function normalizeTitle(raw: string, path?: string): string {
  let title = raw.trim();
  if (!title) return 'Shutters & Blinds Leicester | Shutter Envy';

  if (!title.includes(BRAND) && title.length + BRAND_SUFFIX.length <= TITLE_MAX) {
    title += BRAND_SUFFIX;
  }

  if (title.length > TITLE_MAX) warn('Title', path, title, TITLE_MAX);
  return title;
}

export function normalizeDescription(raw: string, path?: string): string {
  let desc = raw.trim();
  if (!desc) {
    desc =
      'Made-to-measure shutters, blinds and awnings from Shutter Envy. Free home survey across Leicester, Loughborough and Leicestershire.';
  }

  if (desc.length < DESC_MIN) {
    const padded = (desc + DESC_PAD).trim();
    if (padded.length <= DESC_MAX) desc = padded;
    else if (!/[.!?…]$/u.test(desc)) desc += '.';
  }

  if (desc.length > DESC_MAX) warn('Description', path, desc, DESC_MAX);
  return desc;
}
