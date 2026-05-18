// Single source of truth for site-wide data: business info, social links, nav.
// Extracted verbatim from the live shutter-envy.co.uk (capture/ + live HTML).
// If anything here changes on the live site, update it here — not in components.

export const business = {
  legalName: 'Shutter Envy Ltd',
  brandName: 'Shutter Envy',
  email: 'sales@shutter-envy.co.uk',
  // Primary (mobile, displayed throughout the site)
  phoneDisplay: '07729 572277',
  phoneTel: '+447729572277',
  // Secondary (Leicester landline)
  phoneAltDisplay: '0116 210 6241',
  phoneAltTel: '+441162106241',
  address: {
    streetAddress: 'The Granary, Gaddesby Lane',
    addressLocality: 'Rotherby, Melton Mowbray',
    addressRegion: 'Leicestershire',
    postalCode: 'LE14 2LL',
    addressCountry: 'GB',
  },
  geo: {
    // From Google Maps embed on the live site
    latitude: 52.7208272,
    longitude: -1.1413311,
  },
  // Source: Google Business Profile (confirmed by Ben, 2026-05-15).
  // Mon–Thu 08:30–17:00, Fri 08:30–16:00, Sat & Sun closed.
  // Schema.org format: closed days are omitted, not listed.
  openingHours: ['Mo-Th 08:30-17:00', 'Fr 08:30-16:00'] as string[],
} as const;

export const social = {
  facebook: 'https://www.facebook.com/Shutter.Envy.Ltd/',
  instagram: 'https://www.instagram.com/shutter.envy/',
  googleMaps:
    'https://www.google.com/maps/place/Shutter+Envy+Ltd/@52.7208272,-1.1413311,15z/data=!4m2!3m1!1s0x0:0xc6da05bdf5856b2c',
  trustpilot: 'https://uk.trustpilot.com/review/shutter-envy.co.uk',
} as const;

// Primary navigation. The live WordPress had two overlapping menus ("Shutters"
// submenu + "Our Products" dropdown). We collapse them into one mega-menu
// "Products" with three categorised columns + a featured panel.
export type SimpleLink = { label: string; href: string; description?: string };
export type NavItem =
  | { label: string; href: string; type?: 'link' }
  | {
      label: string;
      href: string;
      type: 'mega';
      columns: { heading: string; href?: string; items: SimpleLink[] }[];
      featured?: { image: string; heading: string; body: string; cta: { label: string; href: string } };
    }
  | {
      label: string;
      href: string;
      type: 'simple';
      items: SimpleLink[];
    }
  | {
      label: string;
      href: string;
      type: 'locations';
      items: { label: string; href: string; image: string; sublabel?: string }[];
      footerCta?: { label: string; href: string };
    };

export const primaryNav: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Products',
    href: '#',
    type: 'mega',
    columns: [
      {
        heading: 'Shutters',
        href: '/our-shutters/',
        items: [
          { label: 'Our Shutters', href: '/our-shutters/', description: 'Made-to-measure plantation shutters' },
          { label: 'Colour Swatches', href: '/our-shutters/colour-swatches/', description: 'Browse our full range' },
          { label: 'Portchester® Aluminium', href: '/portchester-aluminium-shutters-leicester/', description: 'Security shutters' },
          { label: 'British Made Shutters', href: '/british-made-shutters/', description: 'Materials & craftsmanship' },
        ],
      },
      {
        heading: 'Blinds',
        href: '/our-blinds/',
        items: [
          { label: 'Our Blinds', href: '/our-blinds/', description: 'Roller, Venetian, Roman & more' },
          { label: 'Motorised Blinds', href: '/blind-motorisation/', description: 'Smart, automated control' },
        ],
      },
      {
        heading: 'Awnings',
        href: '/awnings/',
        items: [
          { label: 'Awnings', href: '/awnings/', description: 'Bobcat, Puma & Tiger ranges' },
        ],
      },
    ],
    featured: {
      image: '/images/mark-shutter-envy-van.png',
      heading: 'Free home survey',
      body: 'No-obligation quote in your living room, anywhere in Leicestershire.',
      cta: { label: 'Arrange a visit', href: '/contact/' },
    },
  },
  {
    label: 'Locations',
    href: '/locations/',
    type: 'locations',
    footerCta: { label: 'View all locations', href: '/locations/' },
    items: [
      { label: 'Leicester',          sublabel: 'Shutters in Leicester',          href: '/locations/shutters-in-leicester/',          image: '/wp-content/uploads/2026/02/Castile-shutters-in-Leicester.jpg' },
      { label: 'Loughborough',       sublabel: 'Shutters in Loughborough',       href: '/locations/shutters-in-loughborough/',       image: '/wp-content/uploads/2026/04/Bay-window-shutters-in-Loughborough.jpeg' },
      { label: 'Market Harborough',  sublabel: 'Shutters in Market Harborough',  href: '/locations/shutters-market-harborough/',     image: '/wp-content/uploads/2026/04/01-Shutter-Envy-shutters-in-Loughbray-and-Leicester-.jpeg' },
      { label: 'Melton Mowbray',     sublabel: 'Shutters in Melton Mowbray',     href: '/locations/shutters-melton-mowbray/',        image: '/wp-content/uploads/2026/04/02-Shutter-Envy-shutters-in-Loughbray-and-Leicester-.jpeg' },
      { label: 'Charnwood',          sublabel: 'Shutters in Charnwood',          href: '/locations/shutters-in-charnwood/',          image: '/wp-content/uploads/2026/04/03-Shutter-Envy-shutters-in-Loughbray-and-Leicester-.jpeg' },
      { label: 'Quorn',              sublabel: 'Shutters in Quorn',              href: '/locations/shutters-in-quorn/',              image: '/wp-content/uploads/2026/04/04-Shutter-Envy-shutters-in-Loughbray-and-Leicester-.jpeg' },
      { label: 'Rothley',            sublabel: 'Shutters in Rothley',            href: '/locations/shutters-in-rothley/',            image: '/wp-content/uploads/2026/04/05-Shutter-Envy-shutters-in-Loughbray-and-Leicester-.jpeg' },
      { label: 'Syston',             sublabel: 'Shutters in Syston',             href: '/locations/shutters-in-syston/',             image: '/wp-content/uploads/2026/05/01-shutter-envy.jpeg' },
      { label: 'Birstall',           sublabel: 'Shutters in Birstall',           href: '/locations/shutters-birstall/',              image: '/wp-content/uploads/2026/05/02-shutter-envy.jpeg' },
      { label: 'Groby',              sublabel: 'Shutters in Groby',              href: '/locations/shutters-groby/',                 image: '/wp-content/uploads/2026/05/03-shutter-envy.jpeg' },
      { label: 'Sileby',             sublabel: 'Shutters in Sileby',             href: '/locations/shutters-sileby/',                image: '/wp-content/uploads/2026/04/faux-wood-shutters-kitchen-window-uk.jpeg' },
      { label: 'Barrow upon Soar',   sublabel: 'Shutters in Barrow upon Soar',   href: '/locations/shutters-in-barrow-upon-soar/',   image: '/wp-content/uploads/2026/02/cafe-Style-Shutters-Shutter-Envy-in-Loughborough.jpg' },
    ],
  },
  { label: 'News/Work', href: '/news/' },
  // News, About, Contact deliberately removed from primary nav (2026-05-16).
  // The header focuses on money-making pages only. About/News/Contact live
  // in the footer + the persistent "Arrange a Home Visit" CTA pill covers
  // the contact path.
];

// Footer columns. Mirrors the live site's 5-column footer (Menu / Shutters /
// Awnings / Blinds / Get in touch) verbatim.
export const footerNav = {
  menu: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about/' },
    { label: 'Contact', href: '/contact/' },
    { label: 'Locations', href: '/locations/' },
    { label: 'Latest News', href: '/news/' },
    { label: 'Reviews', href: '/reviews/' },
  ],
  shutters: [
    { label: 'Award Winning Window Shutters', href: '/our-shutters/' },
    { label: 'Shutter Materials', href: '/british-made-shutters/' },
    { label: 'Portchester Aluminium Shutters', href: '/portchester-aluminium-shutters-leicester/' },
  ],
  awnings: [
    { label: 'Awnings', href: '/awnings/' },
    { label: 'Puma Awnings', href: '/awnings/' },
    { label: 'Tiger Awnings', href: '/awnings/' },
    { label: 'Bobcat Awnings', href: '/awnings/' },
  ],
  blinds: [
    { label: 'Smart automatic Blinds', href: '/blind-motorisation/' },
    { label: 'Roller Blinds', href: '/our-blinds/' },
    { label: 'Venetian Blinds', href: '/our-blinds/' },
    { label: 'Honeycomb Blinds', href: '/our-blinds/' },
    { label: 'Duo Roller Blinds', href: '/our-blinds/' },
    { label: 'Vertical Blinds', href: '/our-blinds/' },
  ],
} as const;

export const legalNav = [
  { label: 'Privacy', href: '/privacy/' },
  { label: 'Terms', href: '/terms/' },
  { label: 'Site Map', href: '/site-map/' },
];
