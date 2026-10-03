import type { APIRoute } from 'astro';
import { haalIndexeerbareRoutes, haalLaatsteWijziging } from '@/lib/routes';
import { isPreviewOmgeving, maakCanonical } from '@/lib/seo';

export const prerender = true;

const GRENS = 1000;

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error('astro.config.mjs mist de site-URL, dus de sitemap kan niet absoluut zijn.');
  }

  // Een lege body schrijft Astro niet weg, zodat een statische preview echt 404 geeft.
  if (isPreviewOmgeving) return new Response(null, { status: 404 });

  const routes = haalIndexeerbareRoutes();
  if (routes.length >= GRENS) {
    throw new Error(`De sitemap heeft ${routes.length} URL's en blijft één bestand tot ${GRENS}.`);
  }

  const urls = routes.map((route) =>
    urlRegel(maakCanonical(route.pad, site), haalLaatsteWijziging(route.bronbestand)),
  );
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};

function urlRegel(loc: string, lastmod: string): string {
  return `  <url><loc>${ontsnapXml(loc)}</loc><lastmod>${ontsnapXml(lastmod)}</lastmod></url>`;
}

function ontsnapXml(waarde: string): string {
  return waarde
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
