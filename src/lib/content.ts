import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projecten'>;
export type Dienst = CollectionEntry<'diensten'>;
export type Locatie = CollectionEntry<'locaties'>;
export type Editie = CollectionEntry<'edities'>;
export type Vraag = CollectionEntry<'faq'>;

export type Beeld = Project['data']['beelden'][number];
export type Afmetingen = Project['data']['afmetingen'];
export type Categorie = Project['data']['categorie'];
export type Instellingen = CollectionEntry<'instellingen'>['data'];

export const CATEGORIELABELS: Record<Categorie, string> = {
  tafels: 'Tafels',
  kasten: 'Kasten',
  interieur: 'Interieur',
  'bijzonder-houtwerk': 'Bijzonder houtwerk',
};

export async function haalInstellingen(): Promise<Instellingen> {
  const instellingen = await getEntry('instellingen', 'site');
  if (!instellingen) {
    throw new Error('src/content/instellingen/site.json mist het item met id "site".');
  }
  return instellingen.data;
}

export async function haalProjecten(): Promise<Project[]> {
  const projecten = await getCollection('projecten');
  return projecten.sort((eerste, tweede) => eerste.data.volgorde - tweede.data.volgorde);
}

export async function haalUitgelichtWerk(aantal: number): Promise<Project[]> {
  const projecten = await haalProjecten();
  return projecten.filter((project) => project.data.uitgelicht).slice(0, aantal);
}

export async function haalWerkInCategorie(categorie: Categorie): Promise<Project[]> {
  const projecten = await haalProjecten();
  return projecten.filter((project) => project.data.categorie === categorie);
}

export async function haalDiensten(): Promise<Dienst[]> {
  const diensten = await getCollection('diensten');
  return diensten.sort((eerste, tweede) => eerste.data.volgorde - tweede.data.volgorde);
}

export async function haalEdities(): Promise<Editie[]> {
  return getCollection('edities');
}

export async function haalLocaties(): Promise<Locatie[]> {
  const locaties = await getCollection('locaties');
  return locaties.filter((locatie) => locatie.data.publiceren);
}

export async function haalVragenVoor(pad: string): Promise<Vraag[]> {
  const vragen = await getCollection('faq');
  return vragen.filter((vraag) => vraag.data.paginas.includes(pad));
}

export async function haalProjectenOpId(ids: readonly string[]): Promise<Project[]> {
  const projecten = await haalProjecten();
  return projecten.filter((project) => ids.includes(project.id));
}

export function isIndexeerbaar(project: Project): boolean {
  return !project.data.plaatshouder;
}
