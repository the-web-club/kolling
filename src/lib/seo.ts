import { haalIndexeerbareRoutes } from '@/lib/routes';

const MAXIMALE_TITELLENGTE = 60;
const INDEXEERBAAR = 'index, follow, max-snippet:-1, max-image-preview:large';

export const isPreviewOmgeving = import.meta.env.VERCEL_ENV === 'preview';

export function bepaalRobots(indexeerbaar: boolean): string {
  if (isPreviewOmgeving) return 'noindex, nofollow';
  return indexeerbaar ? INDEXEERBAAR : 'noindex, follow';
}

export function maakCanonical(pad: string, site: URL): string {
  const url = new URL(normaliseerPad(pad), site);
  url.search = '';
  url.hash = '';
  return url.href;
}

export function isIndexeerbaar(pad: string): boolean {
  const gezocht = normaliseerPad(pad);
  return haalIndexeerbareRoutes().some((route) => route.pad === gezocht);
}

function normaliseerPad(pad: string): string {
  const zonderQuery = pad.split(/[?#]/)[0] ?? '/';
  if (zonderQuery === '' || zonderQuery === '/') return '/';
  const metSlash = zonderQuery.startsWith('/') ? zonderQuery : `/${zonderQuery}`;
  return metSlash.replace(/\/+$/, '');
}

export function maakTitel(titel: string, suffix: string): string {
  const volledig = `${titel}${suffix}`;
  if (volledig.length > MAXIMALE_TITELLENGTE) {
    throw new Error(
      `Paginatitel "${volledig}" is ${volledig.length} tekens en past niet binnen ${MAXIMALE_TITELLENGTE}.`,
    );
  }
  return volledig;
}
