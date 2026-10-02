const MAXIMALE_TITELLENGTE = 60;

export const isPreviewOmgeving = import.meta.env.VERCEL_ENV === 'preview';

export interface Kruimel {
  readonly naam: string;
  readonly pad: string;
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

export function maakAbsoluteUrl(pad: string, site: URL): string {
  return new URL(pad, site).href;
}

export function maakKruimels(pad: string, titels: Record<string, string>): Kruimel[] {
  const delen = pad.split('/').filter(Boolean);
  const kruimels: Kruimel[] = [{ naam: 'Home', pad: '/' }];

  let opgebouwd = '';
  for (const deel of delen) {
    opgebouwd += `/${deel}`;
    kruimels.push({ naam: titels[opgebouwd] ?? deel, pad: opgebouwd });
  }

  return kruimels;
}
