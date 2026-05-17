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
    // Optional homepage-only structured sections. They render when present
    // and are silently ignored on non-home pages.
    announcement: z.string().optional(),
    heroBackgroundImage: z.string().optional(),
    heroEyebrow: z.string().optional(),
    heroPrimaryCta: z.object({ label: z.string(), href: z.string() }).optional(),
    heroLocation: z.string().optional(),
    stats: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
          emoji: z.string().optional(),
        }),
      )
      .default([]),
    processSteps: z
      .array(
        z.object({
          title: z.string(),
          body: z.string(),
          image: z.string().optional(),
        }),
      )
      .default([]),
    heroAwardImages: z.array(z.string()).default([]),
    featureChecklist: z
      .object({
        heading: z.string(),
        body: z.string().optional(),
        items: z.array(z.object({ heading: z.string(), body: z.string() })),
        cta: z.object({ label: z.string(), href: z.string() }).optional(),
      })
      .optional(),
    productShowcase: z
      .object({
        heading: z.string(),
        body: z.string().optional(),
        cta: z.object({ label: z.string(), href: z.string() }).optional(),
        cta_note: z.string().optional(),
        products: z.array(
          z.object({
            title: z.string(),
            body: z.string(),
            image: z.string(),
            href: z.string(),
          }),
        ),
      })
      .optional(),
    awardsCTA: z
      .object({
        backgroundImage: z.string().optional(),
        iconImage: z.string().optional(),
        eyebrow: z.string().optional(),
        heading: z.string(),
        body: z.string().optional(),
        awardImages: z.array(z.string()).default([]),
        awardsCaption: z.string().optional(),
        ctaNote: z.string().optional(),
        cta: z.object({ label: z.string(), href: z.string() }),
      })
      .optional(),
    team: z
      .object({
        heading: z.string(),
        body: z.string().optional(),
        members: z.array(
          z.object({ name: z.string(), role: z.string(), image: z.string() }),
        ),
      })
      .optional(),
    transformCTA: z
      .object({
        image: z.string(),
        heading: z.string(),
        body: z.string(),
        cta: z.object({ label: z.string(), href: z.string() }),
      })
      .optional(),
    faqsIntro: z.string().optional(),
    trustStrip: z
      .array(
        z.object({
          icon: z.enum(['star', 'award', 'home', 'check']).optional(),
          label: z.string(),
        }),
      )
      .default([]),
    reviewsRow: z
      .object({
        rating: z.string(),
        totalReviews: z.string(),
        source: z.enum(['Google', 'Trustpilot']),
        link: z.string().optional(),
        reviews: z.array(
          z.object({
            name: z.string(),
            rating: z.number(),
            body: z.string(),
            date: z.string().optional(),
          }),
        ),
      })
      .optional(),
    bayWindows: z
      .object({
        heading: z.string(),
        body: z.array(z.string()),
        cta: z.object({ label: z.string(), href: z.string() }),
        ctaNote: z.string().optional(),
        cardTitle: z.string(),
        cardBody: z.string(),
        cardImage: z.string(),
        cardLink: z.object({ label: z.string(), href: z.string() }).optional(),
        faqs: z
          .array(z.object({ question: z.string(), answer: z.string().optional() }))
          .default([]),
      })
      .optional(),
    midPageCta: z
      .object({
        eyebrow: z.string().optional(),
        heading: z.string(),
        body: z.string().optional(),
        cta: z.object({ label: z.string(), href: z.string() }),
        secondaryCta: z.object({ label: z.string(), href: z.string() }).optional(),
        tone: z.enum(['cream', 'gold', 'dark']).optional(),
      })
      .optional(),
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
    heroImageAlt: z.string().optional(),
    excerpt: z.string().optional(),
    author: z.string().default('Shutter Envy'),
  }),
});

export const collections = { pages, locations, blog };
