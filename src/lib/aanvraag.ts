import {
  LABEL_BUDGET,
  LABEL_PERIODE,
  LABEL_SOORT,
  MINIMALE_INVULTIJD_MS,
  aanvraagSchema,
  beveiligingSchema,
  foutenPerVeld,
  type Aanvraag,
} from '@/lib/aanvraag-schema';
import { verstuurBericht } from '@/lib/resend';

const TURNSTILE_EINDPUNT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const EXTERNE_TIJDSLIMIET_MS = 5000;

export interface Afleverconfiguratie {
  readonly apiKey?: string;
  readonly ontvanger?: string;
  readonly afzender?: string;
  readonly bcc?: string;
  readonly turnstileGeheim?: string;
  readonly crmUrl?: string;
  readonly crmGeheim?: string;
}

export type Uitkomst =
  | { soort: 'gelukt' }
  | { soort: 'stil' }
  | { soort: 'veldfouten'; fouten: Record<string, string> }
  | { soort: 'onbeschikbaar' }
  | { soort: 'mislukt' };

function isTeSnelIngevuld(tijdstempel: unknown): boolean {
  const gelezen = beveiligingSchema.shape.tijdstempel.safeParse(tijdstempel);
  if (!gelezen.success) return false;
  return Date.now() - gelezen.data < MINIMALE_INVULTIJD_MS;
}

async function isMensVolgensTurnstile(token: unknown, geheim: string): Promise<boolean> {
  if (typeof token !== 'string' || token === '') return false;

  const reactie = await fetch(TURNSTILE_EINDPUNT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: geheim, response: token }),
    signal: AbortSignal.timeout(EXTERNE_TIJDSLIMIET_MS),
  });

  if (!reactie.ok) return false;
  const uitslag: unknown = await reactie.json();
  if (typeof uitslag !== 'object' || uitslag === null || !('success' in uitslag)) return false;
  return uitslag.success === true;
}

function maakNotificatie(aanvraag: Aanvraag): string {
  return [
    `Naam: ${aanvraag.naam}`,
    `E-mail: ${aanvraag.email}`,
    `Telefoon: ${aanvraag.telefoon || 'niet opgegeven'}`,
    `Plaats: ${aanvraag.plaats || 'niet opgegeven'}`,
    `Soort aanvraag: ${LABEL_SOORT[aanvraag.soortAanvraag]}`,
    `Budget: ${LABEL_BUDGET[aanvraag.budget]}`,
    `Periode: ${LABEL_PERIODE[aanvraag.periode]}`,
    '',
    'Idee:',
    aanvraag.idee,
  ].join('\n');
}

function maakBevestiging(naam: string, telefoon: string): string {
  return [
    `Hallo ${naam},`,
    '',
    'Je bericht is bij me binnengekomen en ik lees het zelf.',
    'Ik kom er bij je op terug met een eerste reactie op je idee en een',
    'voorstel voor de volgende stap.',
    '',
    'Heb je in de tussentijd een vraag, bel me dan gewoon.',
    '',
    'Met vriendelijke groet,',
    'Thomas Kolling',
    telefoon,
  ].join('\n');
}

async function meldAanCrm(aanvraag: Aanvraag, configuratie: Afleverconfiguratie): Promise<void> {
  if (!configuratie.crmUrl) return;

  try {
    await fetch(configuratie.crmUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(configuratie.crmGeheim ? { Authorization: `Bearer ${configuratie.crmGeheim}` } : {}),
      },
      body: JSON.stringify(aanvraag),
      signal: AbortSignal.timeout(EXTERNE_TIJDSLIMIET_MS),
    });
  } catch {
    // Een CRM dat niet antwoordt mag de aanvrager nooit raken: de e-mail is al afgeleverd.
  }
}

export async function verwerkAanvraag(
  velden: Record<string, unknown>,
  configuratie: Afleverconfiguratie,
  telefoon: string,
): Promise<Uitkomst> {
  if (velden.honingpot !== '' && velden.honingpot !== undefined) {
    return { soort: 'stil' };
  }
  if (isTeSnelIngevuld(velden.tijdstempel)) {
    return { soort: 'stil' };
  }
  if (
    configuratie.turnstileGeheim &&
    !(await isMensVolgensTurnstile(velden['cf-turnstile-response'], configuratie.turnstileGeheim))
  ) {
    return { soort: 'stil' };
  }

  const gelezen = aanvraagSchema.safeParse(velden);
  if (!gelezen.success) {
    return { soort: 'veldfouten', fouten: foutenPerVeld(gelezen.error) };
  }

  const { apiKey, ontvanger, afzender } = configuratie;
  if (!apiKey || !ontvanger || !afzender) {
    return { soort: 'onbeschikbaar' };
  }

  const aanvraag = gelezen.data;

  try {
    await verstuurBericht(
      {
        aan: ontvanger,
        van: afzender,
        onderwerp: `Aanvraag van ${aanvraag.naam} over ${LABEL_SOORT[aanvraag.soortAanvraag]}`,
        tekst: maakNotificatie(aanvraag),
        antwoordNaar: aanvraag.email,
        ...(configuratie.bcc ? { bcc: configuratie.bcc } : {}),
      },
      apiKey,
    );
  } catch (fout) {
    const reden = fout instanceof Error ? fout.message : 'onbekende reden';
    console.error(`Aanvraag niet afgeleverd: ${reden}`);
    return { soort: 'mislukt' };
  }

  try {
    await verstuurBericht(
      {
        aan: aanvraag.email,
        van: afzender,
        onderwerp: 'Je aanvraag bij Kolling',
        tekst: maakBevestiging(aanvraag.naam, telefoon),
      },
      apiKey,
    );
  } catch (fout) {
    const reden = fout instanceof Error ? fout.message : 'onbekende reden';
    console.error(`Bevestiging aan de aanvrager niet afgeleverd: ${reden}`);
  }

  await meldAanCrm(aanvraag, configuratie);

  return { soort: 'gelukt' };
}
