import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.resolve('dist');
const APEX = 'https://kolling.nl';
const SITEMAP_URL = `${APEX}/sitemap.xml`;
const NAMESPACE = 'http://www.sitemaps.org/schemas/sitemap/0.9';
const ISO_DATUM = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

const fouten = [];

function eis(conditie, bericht) {
  if (!conditie) fouten.push(bericht);
}

function decodeerXml(waarde) {
  return waarde
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"');
}

function isWelgevormd(xml) {
  const lichaam = xml.replace(/<\?xml[^?]*\?>/g, '').trim();
  const tokens = lichaam.match(/<\/?[^>]+>/g);
  if (!tokens || !lichaam.startsWith('<urlset') || !lichaam.endsWith('</urlset>')) return false;

  const stapel = [];
  for (const token of tokens) {
    if (token.startsWith('</')) {
      if (stapel.pop() !== token.slice(2, -1).trim()) return false;
      continue;
    }
    if (token.endsWith('/>')) continue;
    stapel.push(token.slice(1).split(/[\s>/]/)[0]);
  }

  return stapel.length === 0;
}

function leesUrls(xml) {
  const blokken = xml.match(/<url>[\s\S]*?<\/url>/g) ?? [];
  return blokken.map((blok) => ({
    loc: decodeerXml(blok.match(/<loc>([^<]*)<\/loc>/)?.[1] ?? ''),
    lastmod: blok.match(/<lastmod>([^<]*)<\/lastmod>/)?.[1] ?? '',
  }));
}

function locReden(loc) {
  if (!loc.startsWith(`${APEX}/`)) return 'begint niet op https://kolling.nl/';
  if (loc.includes('://www.')) return 'bevat www';
  if (loc.includes('?')) return 'bevat een query';
  const pad = loc.slice(APEX.length);
  if (pad !== '/' && pad.endsWith('/')) return 'heeft een trailing slash';
  return '';
}

function leesMeta(html, naam) {
  const tags = html.match(/<meta\s+[^>]*>/gi) ?? [];
  for (const tag of tags) {
    if (tag.match(/\bname="([^"]*)"/)?.[1] !== naam) continue;
    return tag.match(/\bcontent="([^"]*)"/)?.[1];
  }
  return undefined;
}

function leesCanonical(html) {
  const tags = html.match(/<link\s+[^>]*>/gi) ?? [];
  for (const tag of tags) {
    if (tag.match(/\brel="([^"]*)"/)?.[1] !== 'canonical') continue;
    const href = tag.match(/\bhref="([^"]*)"/)?.[1];
    return href ? decodeerXml(href) : undefined;
  }
  return undefined;
}

function richtlijnen(robots) {
  return robots.split(',').map((deel) => deel.trim().toLowerCase());
}

function isIndex(robots) {
  const delen = richtlijnen(robots);
  return delen.includes('index') && !delen.includes('noindex');
}

async function verzamelHtml(map) {
  const entries = await readdir(map, { withFileTypes: true });
  const bestanden = [];

  for (const entry of entries) {
    const volledig = path.join(map, entry.name);
    if (entry.isDirectory()) bestanden.push(...(await verzamelHtml(volledig)));
    else if (entry.name.endsWith('.html')) bestanden.push(volledig);
  }

  return bestanden;
}

async function leesOfFaal(bestand, label) {
  try {
    return await readFile(bestand, 'utf8');
  } catch {
    throw new Error(`${label} ontbreekt. Draai eerst pnpm build.`);
  }
}

const sitemap = await leesOfFaal(path.join(DIST, 'sitemap.xml'), 'dist/sitemap.xml');
const robotsTxt = await leesOfFaal(path.join(DIST, 'robots.txt'), 'dist/robots.txt');

eis(sitemap.startsWith('<?xml'), 'de sitemap mist een XML-declaratie');
eis(isWelgevormd(sitemap), 'de sitemap is geen welgevormde XML');
eis(sitemap.includes(`xmlns="${NAMESPACE}"`), 'de sitemap mist het sitemaps.org-namespace');

const urls = leesUrls(sitemap);
eis(urls.length > 0, 'de sitemap bevat geen URL');

for (const { loc, lastmod } of urls) {
  const reden = locReden(loc);
  if (reden) fouten.push(`${loc || '(lege loc)'} ${reden}`);
  if (!lastmod || !ISO_DATUM.test(lastmod) || !Number.isFinite(Date.parse(lastmod))) {
    fouten.push(`${loc} heeft geen geldige lastmod (${lastmod || 'leeg'})`);
  }
}

const locs = new Set(urls.map((url) => url.loc));
const indexPaden = new Set();

for (const bestand of await verzamelHtml(DIST)) {
  const html = await readFile(bestand, 'utf8');
  const relatief = path.relative(DIST, bestand);
  const robots = leesMeta(html, 'robots');
  const canonical = leesCanonical(html);

  if (!robots) fouten.push(`${relatief} mist een robots-meta`);
  if (!canonical) fouten.push(`${relatief} mist een canonical`);
  if (!robots || !canonical) continue;

  if (isIndex(robots)) indexPaden.add(canonical);
  if (!locs.has(canonical)) continue;

  eis(isIndex(robots), `${canonical} staat in de sitemap maar robots is "${robots}"`);
  eis(!richtlijnen(robots).includes('noindex'), `${canonical} staat in de sitemap en is noindex`);
}

for (const loc of locs) {
  eis(indexPaden.has(loc), `${loc} staat in de sitemap maar niet als indexeerbare pagina in dist`);
}

for (const canonical of indexPaden) {
  eis(locs.has(canonical), `${canonical} is indexeerbaar maar staat niet in de sitemap`);
}

const sitemapRegels = robotsTxt.split(/\r?\n/).filter((regel) => regel.startsWith('Sitemap:'));
eis(sitemapRegels.length === 1, `robots.txt heeft ${sitemapRegels.length} Sitemap-regels`);
eis(sitemapRegels[0] === `Sitemap: ${SITEMAP_URL}`, `robots.txt wijst niet naar ${SITEMAP_URL}`);

if (fouten.length > 0) {
  for (const fout of fouten) console.error(fout);
  process.exit(1);
}
