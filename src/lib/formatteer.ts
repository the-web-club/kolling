import type { Afmetingen } from '@/lib/content';

export function formatteerAfmetingen({ lengte, breedte, hoogte }: Afmetingen): string {
  return `${lengte} × ${breedte} × ${hoogte} cm`;
}

export function formatteerLijst(items: readonly string[]): string {
  if (items.length < 2) {
    return items.join('');
  }
  return `${items.slice(0, -1).join(', ')} en ${items.at(-1)}`;
}

export function formatteerEuro(bedrag: number): string {
  return `€ ${bedrag.toLocaleString('nl-NL')}`;
}
