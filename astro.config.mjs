import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import customHeaderId from 'remark-custom-header-id';

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
    }),
  ],
});
