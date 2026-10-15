import type { APIRoute } from 'astro';

// Single switch for indexing: set PUBLIC_NOINDEX=true in the environment
// (e.g. on the Netlify staging/preview deploy) and the entire site goes
// behind Disallow: / and every page emits <meta name="robots" content="noindex">.
// Unset (or "false") on production to allow indexing.
//
// Rules otherwise mirror the live site's robots.txt: protect /wp-admin/
// (defensive; the rebuild has no wp-admin) and the WPO plugin list file.
// Critically: we do NOT block CSS, JS or /wp-content/uploads/ — Google
// rendering needs assets, and uploads is where our migrated images live.

export const GET: APIRoute = ({ site }) => {
  const noindex = import.meta.env.PUBLIC_NOINDEX === 'true';
  const origin = (site ?? new URL('https://shutter-envy.co.uk')).toString().replace(/\/$/, '');

  const body = noindex
    ? `User-agent: *\nDisallow: /\n`
    : [
        'User-agent: *',
        'Disallow: /wp-admin/',
        'Allow: /wp-admin/admin-ajax.php',
        'Disallow: /wp-content/uploads/wpo/wpo-plugins-tables-list.json',
        '',
        `Sitemap: ${origin}/sitemap-index.xml`,
        '',
      ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
