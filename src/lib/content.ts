import { getEntry, type CollectionEntry } from 'astro:content';

export type Instellingen = CollectionEntry<'instellingen'>['data'];

const ONBEKEND = '[VUL IN]';

export async function haalInstellingen(): Promise<Instellingen> {
  const instellingen = await getEntry('instellingen', 'site');
  if (!instellingen) {
    throw new Error('src/content/instellingen/site.json mist het item met id "site".');
  }
  return instellingen.data;
}

export function isBekend(waarde: string): boolean {
  return waarde !== ONBEKEND;
}
