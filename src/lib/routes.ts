import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';

export interface IndexeerbareRoute {
  readonly pad: string;
  readonly bronbestand: string;
}

const NOOIT = new Set(['/404', '/bedankt', '/design-system']);

const STATISCH: readonly IndexeerbareRoute[] = [
  { pad: '/', bronbestand: 'src/pages/index.astro' },
  { pad: '/contact', bronbestand: 'src/pages/contact.astro' },
  { pad: '/privacy', bronbestand: 'src/pages/privacy.astro' },
  { pad: '/over', bronbestand: 'src/pages/over.astro' },
  { pad: '/voorbeelden', bronbestand: 'src/pages/voorbeelden.astro' },
  { pad: '/collectie', bronbestand: 'src/pages/collectie.astro' },
  { pad: '/werk', bronbestand: 'src/pages/werk.astro' },
  { pad: '/nieuws', bronbestand: 'src/pages/nieuws.astro' },
  { pad: '/downloads', bronbestand: 'src/pages/downloads.astro' },
  { pad: '/werkgebied', bronbestand: 'src/pages/werkgebied.astro' },
  { pad: '/werkgebied/ommen', bronbestand: 'src/pages/werkgebied/ommen.astro' },
];

interface Contentbron {
  readonly map: string;
  readonly pagina: string;
  readonly pad: (slug: string) => string;
  readonly meenemen: (tekst: string) => boolean;
}

const CONTENT: readonly Contentbron[] = [
  {
    map: 'src/content/projecten',
    pagina: 'src/pages/werk/[slug].astro',
    pad: (slug) => `/werk/${slug}`,
    meenemen: (tekst) => leesVlag(tekst, 'plaatshouder') !== true,
  },
  {
    map: 'src/content/diensten',
    pagina: 'src/pages/maatwerk/[slug].astro',
    pad: (slug) => `/maatwerk/${slug}`,
    meenemen: () => true,
  },
  {
    map: 'src/content/edities',
    pagina: 'src/pages/edities/[slug].astro',
    pad: (slug) => `/edities/${slug}`,
    meenemen: (tekst) => leesVlag(tekst, 'publiceren') !== false,
  },
  {
    map: 'src/content/locaties',
    pagina: 'src/pages/werkgebied/[plaats].astro',
    pad: (slug) => `/werkgebied/${slug}`,
    meenemen: (tekst) => leesVlag(tekst, 'publiceren') === true,
  },
  {
    map: 'src/content/nieuws',
    pagina: 'src/pages/nieuws/[slug].astro',
    pad: (slug) => `/nieuws/${slug}`,
    meenemen: (tekst) => leesVlag(tekst, 'publiceren') !== false,
  },
  {
    map: 'src/content/downloads',
    pagina: 'src/pages/downloads/[slug].astro',
    pad: (slug) => `/downloads/${slug}`,
    meenemen: (tekst) => leesVlag(tekst, 'publiceren') !== false,
  },
];

interface Markdownbestand {
  readonly slug: string;
  readonly tekst: string;
  readonly bestand: string;
}

const ISO_DATUM = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

let routes: IndexeerbareRoute[] | undefined;
const bouwtijd = new Date().toISOString();

export function haalIndexeerbareRoutes(): IndexeerbareRoute[] {
  routes ??= leesRoutes();
  return routes;
}

export function haalLaatsteWijziging(bronbestand: string): string {
  return leesCommitDatum(bronbestand) ?? bouwtijd;
}

function leesRoutes(): IndexeerbareRoute[] {
  const gezien = new Map<string, IndexeerbareRoute>();

  for (const route of STATISCH) {
    if (!existsSync(route.bronbestand) || NOOIT.has(route.pad)) continue;
    gezien.set(route.pad, route);
  }

  for (const route of leesContentRoutes()) {
    if (NOOIT.has(route.pad) || gezien.has(route.pad)) continue;
    gezien.set(route.pad, route);
  }

  return [...gezien.values()].sort(vergelijkPad);
}

function leesContentRoutes(): IndexeerbareRoute[] {
  return CONTENT.flatMap((bron) => {
    if (!existsSync(bron.pagina)) return [];

    return leesMarkdown(bron.map).flatMap((bestand) => {
      if (!bron.meenemen(bestand.tekst)) return [];
      return [{ pad: bron.pad(bestand.slug), bronbestand: bestand.bestand }];
    });
  });
}

function leesMarkdown(map: string): Markdownbestand[] {
  if (!existsSync(map)) return [];

  return readdirSync(map, { recursive: true, encoding: 'utf8' }).flatMap((naam) => {
    const relatief = naam.replaceAll('\\', '/');
    if (!relatief.endsWith('.md') && !relatief.endsWith('.mdx')) return [];

    const bestand = `${map}/${relatief}`;
    const slug = relatief.replace(/\.mdx?$/, '');
    return [{ slug, tekst: readFileSync(bestand, 'utf8'), bestand }];
  });
}

function leesVlag(tekst: string, sleutel: string): boolean | undefined {
  const blok = tekst.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  if (!blok) return undefined;

  for (const regel of blok.split('\n')) {
    if (regel.startsWith(' ') || regel.startsWith('\t')) continue;
    if (!regel.startsWith(`${sleutel}:`)) continue;

    const waarde = regel.slice(sleutel.length + 1).trim();
    if (waarde === 'true') return true;
    if (waarde === 'false') return false;
    return undefined;
  }

  return undefined;
}

function vergelijkPad(eerste: IndexeerbareRoute, tweede: IndexeerbareRoute): number {
  if (eerste.pad === '/') return -1;
  if (tweede.pad === '/') return 1;
  return eerste.pad.localeCompare(tweede.pad, 'nl');
}

function leesCommitDatum(bronbestand: string): string | undefined {
  try {
    const datum = execFileSync('git', ['log', '-1', '--format=%cI', '--', bronbestand], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      windowsHide: true,
    }).trim();
    if (ISO_DATUM.test(datum)) return datum;
  } catch {
    return undefined;
  }

  return undefined;
}
