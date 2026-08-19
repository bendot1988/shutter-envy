/** Clamp titles and meta descriptions to audit-friendly lengths at render time. */

const TITLE_MIN = 50;
const TITLE_MAX = 60;
const DESC_MIN = 150;
const DESC_MAX = 160;

const BRAND_SUFFIX = ' | Shutter Envy';
const DESC_PAD =
  ' Free home survey across Leicester, Loughborough and Leicestershire.';

function truncateAtWord(text: string, max: number): string {
  if (text.length <= max) return text;
  // Hyphen at the end of the class — unescaped mid-class it becomes a range.
  let cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  if (lastSpace > max - 30) cut = cut.slice(0, lastSpace);
  cut = cut.replace(/[\s,.;:!–—-]+$/u, '').trimEnd();
  if (!cut) return text.slice(0, max - 1).trimEnd() + '…';
  return cut + '…';
}

export function normalizeTitle(raw: string): string {
  let title = raw.trim();
  if (!title) return 'Shutters & Blinds Leicester | Shutter Envy';

  if (title.length < TITLE_MIN) {
    if (!title.includes('Shutter Envy') && title.length + BRAND_SUFFIX.length <= TITLE_MAX) {
      title += BRAND_SUFFIX;
    }
    for (const pad of [' Leicestershire', ' Shutters']) {
      if (title.length >= TITLE_MIN) break;
      if (title.length + pad.length <= TITLE_MAX) title += pad;
    }
  }

  if (title.length > TITLE_MAX) title = truncateAtWord(title, TITLE_MAX);
  return title;
}

export function normalizeDescription(raw: string): string {
  let desc = raw.trim();
  if (!desc) {
    desc =
      'Made-to-measure shutters, blinds and awnings from Shutter Envy. Free home survey across Leicester, Loughborough and Leicestershire.';
  }

  if (desc.length < DESC_MIN) {
    const padded = (desc + DESC_PAD).trim();
    desc = padded.length <= DESC_MAX ? padded : desc;
  }

  if (desc.length > DESC_MAX) desc = truncateAtWord(desc, DESC_MAX);

  if (desc.length < DESC_MIN && desc.length + 1 <= DESC_MAX) desc += '.';
  return desc;
}
