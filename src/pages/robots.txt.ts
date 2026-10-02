import type { APIRoute } from 'astro';
import { isPreviewOmgeving } from '@/lib/seo';

const UITGESLOTEN = ['/design-system', '/bedankt', '/feitencheck.md', '/api/'];

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error('astro.config.mjs mist de site-URL, dus robots.txt kan geen sitemap noemen.');
  }

  const regels = isPreviewOmgeving
    ? ['User-agent: *', 'Disallow: /']
    : [
        'User-agent: *',
        'Allow: /',
        ...UITGESLOTEN.map((pad) => `Disallow: ${pad}`),
        '',
        `Sitemap: ${new URL('/sitemap.xml', site).href}`,
      ];

  return new Response(`${regels.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
