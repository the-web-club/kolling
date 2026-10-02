import type { APIRoute } from 'astro';
import {
  haalDiensten,
  haalEdities,
  haalLocaties,
  haalProjecten,
  isIndexeerbaar,
} from '@/lib/content';
import { isPreviewOmgeving } from '@/lib/seo';

const VASTE_PADEN = [
  '/',
  '/werk',
  '/maatwerk',
  '/edities',
  '/werkplaats',
  '/werkgebied',
  '/contact',
  '/privacy',
];

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error('astro.config.mjs mist de site-URL, dus de sitemap kan niet absoluut zijn.');
  }

  if (isPreviewOmgeving) {
    return new Response('Deze preview wordt niet geïndexeerd.', { status: 404 });
  }

  const [projecten, diensten, locaties, edities] = await Promise.all([
    haalProjecten(),
    haalDiensten(),
    haalLocaties(),
    haalEdities(),
  ]);

  const paden = [
    ...VASTE_PADEN,
    ...diensten.map((dienst) => `/maatwerk/${dienst.id}`),
    ...locaties.map((locatie) => `/werkgebied/${locatie.id}`),
    ...projecten.filter(isIndexeerbaar).map((project) => `/werk/${project.id}`),
    ...edities.map((editie) => `/edities/${editie.id}`),
  ];

  const regels = paden.map((pad) => `  <url><loc>${new URL(pad, site).href}</loc></url>`);

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...regels,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
