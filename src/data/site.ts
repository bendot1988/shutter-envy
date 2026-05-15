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

// Primary navigation, with the two submenus the live site uses.
// "Our Products" is a dropdown only (the parent itself isn't a page — href '#').
export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const primaryNav: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Shutters',
    href: '/our-shutters/',
    children: [
      { label: 'Our Shutters', href: '/our-shutters/' },
      { label: 'Colour Swatches', href: '/our-shutters/colour-swatches/' },
      {
        label: 'Portchester® Aluminium Shutters',
        href: '/portchester-aluminium-shutters-leicester/',
      },
    ],
  },
  {
    label: 'Our Products',
    href: '#',
    children: [
      { label: 'Shutters', href: '/our-shutters/' },
      {
        label: 'Portchester® Aluminium Shutters',
        href: '/portchester-aluminium-shutters-leicester/',
      },
      { label: 'Motorised Blinds', href: '/blind-motorisation/' },
      { label: 'Awnings', href: '/awnings/' },
      { label: 'Blinds', href: '/our-blinds/' },
    ],
  },
  { label: 'Blinds', href: '/our-blinds/' },
  { label: 'Blind Motorisation', href: '/blind-motorisation/' },
  { label: 'Awnings', href: '/awnings/' },
  { label: 'News', href: '/news/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
  { label: 'Reviews', href: '/reviews/' },
];

// Footer columns. Mirrors the live site's footer link sets.
export const footerNav = {
  company: [
    { label: 'About', href: '/about/' },
    { label: 'Recent Work', href: '/recent-work/' },
    { label: 'Reviews', href: '/reviews/' },
    { label: 'News', href: '/news/' },
    { label: 'Contact', href: '/contact/' },
  ],
  products: [
    { label: 'Our Shutters', href: '/our-shutters/' },
    { label: 'Colour Swatches', href: '/our-shutters/colour-swatches/' },
    {
      label: 'Portchester® Aluminium Shutters',
      href: '/portchester-aluminium-shutters-leicester/',
    },
    { label: 'Blinds', href: '/our-blinds/' },
    { label: 'Blind Motorisation', href: '/blind-motorisation/' },
    { label: 'Awnings', href: '/awnings/' },
  ],
  legal: [
    { label: 'Privacy', href: '/privacy/' },
    { label: 'Terms', href: '/terms/' },
    { label: 'Site map', href: '/site-map/' },
  ],
} as const;
