import { file } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

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
    beweringen: z.array(z.string().min(1)).default([]),
  }),
});

export const collections = { instellingen };
