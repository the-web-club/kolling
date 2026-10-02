import { z } from 'zod';

export const MINIMALE_INVULTIJD_MS = 4000;

export const SOORTEN_AANVRAAG = [
  'tafel',
  'kast',
  'interieur',
  'bijzonder-houtwerk',
  'editie',
  'anders',
] as const;

export const BUDGETTEN = ['1000-2000', '2000-3500', '3500-5000', '5000-plus', 'onbekend'] as const;

export const PERIODES = [
  'zo-snel-mogelijk',
  'binnen-3-maanden',
  'binnen-6-maanden',
  'open',
] as const;

export type SoortAanvraag = (typeof SOORTEN_AANVRAAG)[number];
export type Budget = (typeof BUDGETTEN)[number];
export type Periode = (typeof PERIODES)[number];

export const LABEL_SOORT: Record<SoortAanvraag, string> = {
  tafel: 'Tafel',
  kast: 'Kast',
  interieur: 'Interieur',
  'bijzonder-houtwerk': 'Bijzonder houtwerk',
  editie: 'Editie',
  anders: 'Anders',
};

export const LABEL_BUDGET: Record<Budget, string> = {
  '1000-2000': '€ 1.000 tot € 2.000',
  '2000-3500': '€ 2.000 tot € 3.500',
  '3500-5000': '€ 3.500 tot € 5.000',
  '5000-plus': '€ 5.000 en meer',
  onbekend: 'Nog niet bepaald',
};

export const LABEL_PERIODE: Record<Periode, string> = {
  'zo-snel-mogelijk': 'Zo snel mogelijk',
  'binnen-3-maanden': 'Binnen drie maanden',
  'binnen-6-maanden': 'Binnen zes maanden',
  open: 'Nog open',
};

export const aanvraagSchema = z.object({
  naam: z
    .string()
    .trim()
    .min(2, 'Vul je naam in.')
    .max(80, 'Gebruik maximaal 80 tekens voor je naam.'),
  email: z.email('Vul een e-mailadres in met een @.').max(120, 'Dit e-mailadres is te lang.'),
  telefoon: z
    .string()
    .trim()
    .max(30, 'Gebruik maximaal 30 tekens voor je telefoonnummer.')
    .optional(),
  soortAanvraag: z.enum(SOORTEN_AANVRAAG, 'Kies waar je aanvraag over gaat.'),
  budget: z.enum(BUDGETTEN, 'Kies een budgetindicatie.'),
  plaats: z.string().trim().max(80, 'Gebruik maximaal 80 tekens voor plaats of postcode.').optional(),
  periode: z.enum(PERIODES, 'Kies wanneer je het nodig hebt.'),
  idee: z
    .string()
    .trim()
    .min(20, 'Beschrijf je idee in minstens twintig tekens.')
    .max(4000, 'Beschrijf je idee in maximaal 4000 tekens.'),
  akkoordPrivacy: z.literal('ja', 'Je moet akkoord gaan met de privacyverklaring.'),
});

export const beveiligingSchema = z.object({
  honingpot: z.literal('', 'Deze aanvraag is niet verwerkt.'),
  tijdstempel: z.coerce.number().int().positive('Deze aanvraag is niet verwerkt.'),
  turnstileToken: z.string().optional(),
});

export type Aanvraag = z.infer<typeof aanvraagSchema>;

export function leesAanvraag(velden: Record<string, unknown>) {
  return aanvraagSchema.safeParse(velden);
}

export function foutenPerVeld(fout: z.ZodError<Aanvraag>): Record<string, string> {
  const fouten: Record<string, string> = {};
  for (const probleem of fout.issues) {
    const veld = probleem.path[0];
    if (typeof veld === 'string' && !fouten[veld]) {
      fouten[veld] = probleem.message;
    }
  }
  return fouten;
}
