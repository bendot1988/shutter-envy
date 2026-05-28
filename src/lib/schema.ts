// Schema.org JSON-LD builders. Each returns a plain object that the SEO
// component serialises into a <script type="application/ld+json"> block.
//
// Decision (Prompt 6): drop Yoast's Article-on-every-page quirk. Standard
// pages emit WebPage (semantically correct, no lost rich result). Blog posts
// emit BlogPosting (most specific type for the Article rich result).
// LocalBusiness is added site-wide — Yoast missed it entirely.

import { business, social } from '../data/site';

const SITE = 'https://shutter-envy.co.uk';

// Stable @id refs used to stitch the graph across separate <script> blocks.
const ID = {
  localBusiness: `${SITE}/#localbusiness`,
  website: `${SITE}/#website`,
  webPage: (url: string) => `${url}#webpage`,
};

export function localBusiness(opts?: {
  url?: string;
  areaServed?: string;
  name?: string;
  id?: string;
}) {
  const url = opts?.url ?? `${SITE}/`;
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': opts?.id ?? ID.localBusiness,
    name: opts?.name ?? business.legalName,
    image: `${SITE}/wp-content/uploads/logo.png`,
    url,
    telephone: business.phoneTel,
    email: business.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.streetAddress,
      addressLocality: business.address.addressLocality,
      addressRegion: business.address.addressRegion,
      postalCode: business.address.postalCode,
      addressCountry: business.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    ...(business.openingHours.length
      ? { openingHours: business.openingHours }
      : {}),
    ...(opts?.areaServed ? { areaServed: opts.areaServed } : {}),
    sameAs: [
      social.facebook,
      social.instagram,
      social.googleMaps,
      social.trustpilot,
    ],
  };
}

export function webSite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': ID.website,
    url: `${SITE}/`,
    name: business.brandName,
    publisher: { '@id': ID.localBusiness },
    inLanguage: 'en-GB',
  };
}

export function webPage(opts: {
  url: string;
  name: string;
  description?: string;
  isHome?: boolean;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': opts.isHome ? ['WebPage', 'CollectionPage'] : 'WebPage',
    '@id': ID.webPage(opts.url),
    url: opts.url,
    name: opts.name,
    ...(opts.description ? { description: opts.description } : {}),
    isPartOf: { '@id': ID.website },
    about: { '@id': ID.localBusiness },
    inLanguage: 'en-GB',
  };
}

export function faqPage(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

// Blog-post schema. Emits @type BlogPosting (more specific than Article;
// qualifies for the same Article rich result in Google search).
export function blogPosting(opts: {
  url: string;
  headline: string;
  description: string;
  datePublished: Date;
  dateModified?: Date;
  image?: string;
  author?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@id': ID.webPage(opts.url) },
    headline: opts.headline,
    description: opts.description,
    datePublished: opts.datePublished.toISOString(),
    dateModified: (opts.dateModified ?? opts.datePublished).toISOString(),
    ...(opts.image
      ? {
          image: opts.image.startsWith('http')
            ? opts.image
            : `${SITE}${opts.image}`,
        }
      : {}),
    author: {
      '@type': 'Organization',
      name: opts.author ?? business.brandName,
      '@id': ID.localBusiness,
    },
    publisher: { '@id': ID.localBusiness },
  };
}

// Service schema for product/category pages. Used on /our-shutters/,
// /our-blinds/, /awnings/, /blind-motorisation/, /blindscreen/,
// /portchester-aluminium-shutters-leicester/, /british-made-shutters/.
//
// Anchored to the LocalBusiness via `provider`. `areaServed` defaults to the
// Leicestershire service region; pass an explicit value to scope to a single
// town if you ever wire this into a location route.
export function service(opts: {
  url: string;
  name: string;
  description: string;
  serviceType?: string;
  areaServed?: string | string[];
  image?: string;
}) {
  const area = opts.areaServed ?? [
    'Leicester',
    'Loughborough',
    'Leicestershire',
    'Charnwood',
    'Melton Mowbray',
    'Market Harborough',
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${opts.url}#service`,
    name: opts.name,
    description: opts.description,
    ...(opts.serviceType ? { serviceType: opts.serviceType } : {}),
    provider: { '@id': ID.localBusiness },
    areaServed: Array.isArray(area)
      ? area.map((a) => ({ '@type': 'AdministrativeArea', name: a }))
      : { '@type': 'AdministrativeArea', name: area },
    url: opts.url,
    ...(opts.image
      ? {
          image: opts.image.startsWith('http')
            ? opts.image
            : `${SITE}${opts.image}`,
        }
      : {}),
  };
}

// AggregateRating schema. Used on /reviews/ and the homepage to expose
// the visible Trustindex / Google review average to crawlers.
// Numbers must reflect a real review count (Google flags fabricated ratings).
export function aggregateRating(opts: {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
  itemReviewed?: { '@id': string };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue: opts.ratingValue,
    reviewCount: opts.reviewCount,
    bestRating: opts.bestRating ?? 5,
    worstRating: opts.worstRating ?? 1,
    itemReviewed: opts.itemReviewed ?? { '@id': ID.localBusiness },
  };
}

export function breadcrumbList(crumbs: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url.startsWith('http') ? c.url : `${SITE}${c.url}`,
    })),
  };
}
