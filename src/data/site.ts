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
      image: '/wp-content/uploads/2024/09/dotwall-Web-Design2024-09-02-at-20.46.30-650x492.jpg',
      heading: 'Free home survey',
      body: 'No-obligation quote in your living room, anywhere in Leicestershire.',
      cta: { label: 'Arrange a visit', href: '/contact/' },
    },
  },
  {
    label: 'Locations',
    href: '/locations/',
    type: 'simple',
    items: [
      { label: 'Leicester', href: '/locations/shutters-in-leicester/' },
      { label: 'Loughborough', href: '/locations/shutters-in-loughborough/' },
      { label: 'Market Harborough', href: '/locations/shutters-market-harborough/' },
      { label: 'Melton Mowbray', href: '/locations/shutters-melton-mowbray/' },
      { label: 'Charnwood', href: '/locations/shutters-in-charnwood/' },
      { label: 'Quorn', href: '/locations/shutters-in-quorn/' },
      { label: 'Rothley', href: '/locations/shutters-in-rothley/' },
      { label: 'Syston', href: '/locations/shutters-in-syston/' },
      { label: 'Birstall', href: '/locations/shutters-birstall/' },
      { label: 'Groby', href: '/locations/shutters-groby/' },
      { label: 'Sileby', href: '/locations/shutters-sileby/' },
      { label: 'Barrow upon Soar', href: '/locations/shutters-in-barrow-upon-soar/' },
    ],
  },
  { label: 'Recent Work', href: '/recent-work/' },
  { label: 'News', href: '/news/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
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
