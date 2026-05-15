import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Three real templates per CLAUDE.md §2: page, location, blog post.
// SEO fields are shared and required. Optional structured sections (hero,
// galleries, FAQs, CTAs) let pages render Elementor-style flexible layouts
// without dropping into raw HTML.

const seo = z.object({
  title: z.string(),
  description: z.string(),
  ogImage: z.string().optional(),
});

const hero = z
  .object({
    eyebrow: z.string().optional(),
    heading: z.string(),
    subheading: z.string().optional(),
    image: z.string().optional(),
    cta: z
      .object({ label: z.string(), href: z.string() })
      .optional(),
  })
  .optional();

const cta = z
  .object({
    heading: z.string(),
    body: z.string().optional(),
    button: z.object({ label: z.string(), href: z.string() }),
  })
  .optional();

const faqs = z
  .array(z.object({ question: z.string(), answer: z.string() }))
  .default([]);

const gallery = z
  .array(z.object({ src: z.string(), alt: z.string() }))
  .default([]);

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: seo.extend({
    h1: z.string(),
    hero,
    gallery,
    faqs,
    cta,
  }),
});

const locations = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/locations' }),
  // The file's id (filename without extension) is the URL slug.
  // Slugs MUST be copied verbatim from the live site (CLAUDE.md §3) —
  // do not normalise "shutters-market-harborough".
  schema: seo.extend({
    h1: z.string(),
    area: z.string(),
    postcodePrefixes: z.array(z.string()).default([]),
    hero,
    gallery,
    serviceBlurbs: z
      .array(
        z.object({
          icon: z.string().optional(),
          heading: z.string(),
          body: z.string(),
        }),
      )
      .default([]),
    mapEmbedUrl: z.string().optional(),
    faqs,
    cta,
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  // Blog posts live at root level (/<slug>/), NOT under /blog/ or /news/<slug>/.
  schema: seo.extend({
    h1: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    excerpt: z.string().optional(),
    author: z.string().default('Shutter Envy'),
  }),
});

export const collections = { pages, locations, blog };
