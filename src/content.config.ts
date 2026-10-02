import { file, glob } from 'astro/loaders';
import { defineCollection, reference, z, type SchemaContext } from 'astro:content';

const CATEGORIEEN = ['tafels', 'kasten', 'interieur', 'bijzonder-houtwerk'] as const;
const TINTEN = ['eik', 'noten', 'es'] as const;
const VERHOUDINGEN = ['liggend', 'staand', 'vierkant', 'breed'] as const;
const OPDRACHTGEVERS = ['particulier', 'architect', 'zakelijk'] as const;
const EDITIESTATUS = ['beschikbaar', 'gereserveerd', 'uitverkocht'] as const;

const beweringen = z.array(z.string().min(1)).default([]);

const afmetingen = z.object({
  lengte: z.number().positive(),
  breedte: z.number().positive(),
  hoogte: z.number().positive(),
});

const seo = z.object({
  titel: z.string().min(1).max(60),
  beschrijving: z.string().min(140).max(160),
});

function beeldSchema(image: SchemaContext['image']) {
  const gemeen = {
    alt: z.string().min(1),
    verhouding: z.enum(VERHOUDINGEN).default('liggend'),
    bijschrift: z.string().optional(),
  };

  return z.union([
    z.object({ ...gemeen, bron: image() }),
    z.object({
      ...gemeen,
      plaatshouder: z.object({ tint: z.enum(TINTEN), label: z.string().min(1) }),
    }),
  ]);
}

const projecten = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projecten' }),
  schema: ({ image }) =>
    z.object({
      titel: z.string().min(1),
      intro: z.string().min(1),
      categorie: z.enum(CATEGORIEEN),
      materialen: z.array(z.string().min(1)).min(1),
      afwerking: z.string().min(1),
      afmetingen,
      jaar: z.number().int().optional(),
      plaats: z.string().optional(),
      regio: z.string().optional(),
      opdrachtgever: z.enum(OPDRACHTGEVERS).optional(),
      beelden: z.array(beeldSchema(image)).min(1),
      uitgelicht: z.boolean().default(false),
      volgorde: z.number().int().default(100),
      gerelateerd: z.array(reference('projecten')).default([]),
      plaatshouder: z.boolean(),
      seo,
      beweringen,
    }),
});

const diensten = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/diensten' }),
  schema: z.object({
    titel: z.string().min(1),
    kop: z.string().min(1),
    intro: z.string().min(1),
    categorie: z.enum(CATEGORIEEN),
    voorWie: z.array(z.string().min(1)).min(2),
    proces: z.array(z.object({ kop: z.string().min(1), tekst: z.string().min(1) })).min(3),
    materialen: z.array(z.string().min(1)).min(2),
    faq: z.array(z.object({ vraag: z.string().min(1), antwoord: z.string().min(1) })).min(4),
    gerelateerdeProjecten: z.array(reference('projecten')).default([]),
    volgorde: z.number().int().default(100),
    seo,
    beweringen,
  }),
});

const edities = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/edities' }),
  schema: ({ image }) =>
    z.object({
      titel: z.string().min(1),
      intro: z.string().min(1),
      oplage: z.number().int().positive(),
      beschikbaar: z.number().int().nonnegative(),
      status: z.enum(EDITIESTATUS),
      materialen: z.array(z.string().min(1)).min(1),
      afmetingen,
      prijs: z.number().positive(),
      jaar: z.number().int(),
      beelden: z.array(beeldSchema(image)).min(1),
      seo,
      beweringen,
    }),
});

const locaties = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/locaties' }),
  schema: z.object({
    plaats: z.string().min(1),
    regio: z.string().min(1),
    kop: z.string().min(1),
    intro: z.string().min(1),
    uniekeSecties: z
      .array(z.object({ kop: z.string().min(1), tekst: z.string().min(1) }))
      .min(3, 'Een locatiepagina zonder drie eigen secties is een doorway.'),
    projectenInGebied: z.array(reference('projecten')).default([]),
    logistiek: z.object({
      levering: z.string().min(1),
      montage: z.string().min(1),
      bezoek: z.string().min(1),
    }),
    faq: z
      .array(z.object({ vraag: z.string().min(1), antwoord: z.string().min(1) }))
      .min(3, 'Een locatiepagina zonder drie plaatsgebonden vragen is een doorway.'),
    geo: z.object({ lat: z.number(), lng: z.number() }).optional(),
    publiceren: z.boolean().default(false),
    seo,
    beweringen,
  }),
});

const faq = defineCollection({
  loader: file('./src/content/faq/algemeen.json'),
  schema: z.object({
    id: z.string().min(1),
    vraag: z.string().min(1),
    antwoord: z.string().min(1),
    paginas: z.array(z.string().min(1)).min(1),
  }),
});

const instellingen = defineCollection({
  loader: file('./src/content/instellingen/site.json'),
  schema: z.object({
    id: z.string().min(1),
    naam: z.string().min(1),
    juridischeNaam: z.string().min(1),
    maker: z.string().min(1),
    adres: z.object({
      straat: z.string().min(1),
      postcode: z.string().min(1),
      plaats: z.string().min(1),
      land: z.string().min(1),
    }),
    telefoon: z.object({ weergave: z.string().min(1), e164: z.string().min(1) }),
    email: z.string().min(1),
    kvk: z.string().min(1),
    geo: z.string().min(1),
    instagram: z.string().url(),
    bezoek: z.string().min(1),
    cta: z.object({ primair: z.string().min(1), secundair: z.string().min(1) }),
    seo: z.object({ titelSuffix: z.string().min(1), beschrijving: z.string().min(1) }),
    beweringen,
  }),
});

export const collections = { projecten, diensten, edities, locaties, faq, instellingen };
