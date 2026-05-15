// Schema.org JSON-LD builders. Each returns a plain object that the SEO
// component serialises into a <script type="application/ld+json"> block.
//
// Why functions, not Astro components: schema is composable — a Location page
// emits LocalBusiness + BreadcrumbList + FAQPage. Functions can be combined
// into a single array and dropped into <SEO jsonLd={...} />.

import { business, social } from '../data/site';

const SITE = 'https://shutter-envy.co.uk';

export function localBusiness(opts?: {
  url?: string;
  areaServed?: string;
  name?: string;
}) {
  const url = opts?.url ?? `${SITE}/`;
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE}/#localbusiness`,
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

export function article(opts: {
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
    '@type': 'Article',
    mainEntityOfPage: opts.url,
    headline: opts.headline,
    description: opts.description,
    datePublished: opts.datePublished.toISOString(),
    dateModified: (opts.dateModified ?? opts.datePublished).toISOString(),
    image: opts.image
      ? opts.image.startsWith('http')
        ? opts.image
        : `${SITE}${opts.image}`
      : undefined,
    author: {
      '@type': 'Organization',
      name: opts.author ?? business.brandName,
    },
    publisher: {
      '@type': 'Organization',
      name: business.legalName,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE}/wp-content/uploads/logo.png`,
      },
    },
  };
}

export function breadcrumbList(
  crumbs: { name: string; url: string }[],
) {
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
