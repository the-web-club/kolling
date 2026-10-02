const MAXIMALE_TITELLENGTE = 60;

export const isPreviewOmgeving = import.meta.env.VERCEL_ENV === 'preview';

export function bepaalRobots(indexeerbaar: boolean): string {
  if (isPreviewOmgeving) {
    return 'noindex, nofollow';
  }
  return indexeerbaar ? 'index, follow' : 'noindex, follow';
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
