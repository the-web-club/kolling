import type { APIRoute } from 'astro';
import { isPreviewOmgeving, maakCanonical } from '@/lib/seo';

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error(
      'astro.config.mjs mist de site-URL, dus robots.txt kan de sitemap niet noemen.',
    );
  }

  const regels = isPreviewOmgeving
    ? ['User-agent: *', 'Disallow: /']
    : [
        'User-agent: *',
        'Allow: /',
        'Disallow: /api/',
        '',
        `Sitemap: ${maakCanonical('/sitemap.xml', site)}`,
      ];

  return new Response(`${regels.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
