import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import customHeaderId from 'remark-custom-header-id';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

// ─── lastmod map for the sitemap ──────────────────────────────────
// Walks content collections at build time and extracts the latest
// `updatedDate` (fallback `pubDate`) from each markdown frontmatter,
// keyed by the URL the file produces.
//
// Why: @astrojs/sitemap defaults to the build timestamp on every URL,
// which is a worthless freshness signal to Google. A real `lastmod`
// helps crawlers prioritise pages that have actually changed.
function buildLastmodMap() {
  const map = new Map();
  const root = new URL('./src/content/', import.meta.url).pathname;

  const dateRegex = (key) =>
    new RegExp('^' + key + '\\s*:\\s*"?([^"\\n]+)"?\\s*$', 'm');

  const readDate = (filepath) => {
    try {
      const raw = readFileSync(filepath, 'utf8');
      const fm = raw.split('---', 3)[1] ?? '';
      const updated = fm.match(dateRegex('updatedDate'))?.[1]?.trim();
      const pub = fm.match(dateRegex('pubDate'))?.[1]?.trim();
      const candidate = updated || pub;
      if (candidate) return new Date(candidate);
      return new Date(statSync(filepath).mtime);
    } catch {
      return undefined;
    }
  };

  const collect = (subdir, urlFor) => {
    const dir = join(root, subdir);
    let files;
    try { files = readdirSync(dir); } catch { return; }
    for (const f of files) {
      if (!f.endsWith('.md') && !f.endsWith('.mdx')) continue;
      const slug = f.replace(/\.(md|mdx)$/, '');
      const d = readDate(join(dir, f));
      if (d && !Number.isNaN(d.getTime())) map.set(urlFor(slug), d);
    }
  };

  collect('blog', (slug) => `https://shutter-envy.co.uk/${slug}/`);
  collect('locations', (slug) => `https://shutter-envy.co.uk/locations/${slug}/`);
  collect('pages', (slug) => {
    // home.md drives `/`; all other pages drive `/<slug>/`
    if (slug === 'home') return 'https://shutter-envy.co.uk/';
    return `https://shutter-envy.co.uk/${slug}/`;
  });

  return map;
}

const LASTMOD = buildLastmodMap();

// Site config notes:
// - trailingSlash 'always' + build.format 'directory' = URLs end with /
//   Matches the live WordPress site exactly (CLAUDE.md §1).
// - `site` is required by @astrojs/sitemap and for canonicals.
export default defineConfig({
  site: 'https://shutter-envy.co.uk',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    // Lets content authors write `## Puma Shutters {#Puma}` in markdown to
    // preserve the live site's existing anchor URLs verbatim (CLAUDE.md §1).
    // Astro still auto-slugifies any heading without an explicit id.
    remarkPlugins: [customHeaderId],
  },
  integrations: [
    sitemap({
      // Mirror what WordPress serves: include every page, every location,
      // every blog post. Excluded:
      // - /news/page/N/ — paginated crawl entry points, not destinations
      //   (kept off live in case we resurrect pagination)
      // - /brand/ — internal design-system reference, also carries a
      //   `noindex` meta on the page itself
      filter: (page) =>
        !/\/news\/page\/\d+\/?$/.test(page) && !/\/brand\/?$/.test(page),
      serialize(item) {
        const hit = LASTMOD.get(item.url);
        if (hit) item.lastmod = hit.toISOString();
        return item;
      },
    }),
  ],
});
