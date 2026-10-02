import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { MINIMALE_INVULTIJD_MS } from '@/lib/aanvraag-schema';
import { verwerkAanvraag, type Afleverconfiguratie } from '@/lib/aanvraag';

const TELEFOON = '06 13 62 22 76';

const CONFIGURATIE: Afleverconfiguratie = {
  apiKey: 'test-sleutel',
  ontvanger: 'werkplaats@test.invalid',
  afzender: 'site@test.invalid',
};

function geldigeVelden(afwijkingen: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    honingpot: '',
    tijdstempel: String(Date.now() - MINIMALE_INVULTIJD_MS - 1000),
    naam: 'Marieke de Groot',
    email: 'marieke@test.invalid',
    telefoon: '',
    plaats: '7731 GV',
    soortAanvraag: 'tafel',
    budget: '2000-3500',
    periode: 'binnen-3-maanden',
    idee: 'Een eettafel van drie meter in eiken voor acht personen.',
    akkoordPrivacy: 'ja',
    ...afwijkingen,
  };
}

function antwoord(gelukt: boolean): Response {
  return new Response(gelukt ? '{"id":"1"}' : 'fout', { status: gelukt ? 200 : 422 });
}

let verzendingen: string[];

beforeEach(() => {
  verzendingen = [];
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => {
      verzendingen.push(String(url));
      return antwoord(true);
    }),
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('verwerkAanvraag', () => {
  test('levert af en bevestigt bij een geldige aanvraag', async () => {
    const uitkomst = await verwerkAanvraag(geldigeVelden(), CONFIGURATIE, TELEFOON);

    expect(uitkomst).toEqual({ soort: 'gelukt' });
    expect(verzendingen).toHaveLength(2);
  });

  test('meldt veldfouten per veld zonder iets te versturen', async () => {
    const uitkomst = await verwerkAanvraag(
      geldigeVelden({ email: 'geen-adres', idee: 'te kort' }),
      CONFIGURATIE,
      TELEFOON,
    );

    expect(uitkomst.soort).toBe('veldfouten');
    if (uitkomst.soort === 'veldfouten') {
      expect(uitkomst.fouten.email).toContain('@');
      expect(uitkomst.fouten.idee).toContain('twintig');
    }
    expect(verzendingen).toHaveLength(0);
  });

  test('eist akkoord met de privacyverklaring', async () => {
    const velden = geldigeVelden();
    delete velden.akkoordPrivacy;

    const uitkomst = await verwerkAanvraag(velden, CONFIGURATIE, TELEFOON);

    expect(uitkomst.soort).toBe('veldfouten');
    expect(verzendingen).toHaveLength(0);
  });

  test('accepteert een gevulde honingpot stil, zonder te versturen', async () => {
    const uitkomst = await verwerkAanvraag(
      geldigeVelden({ honingpot: 'bot' }),
      CONFIGURATIE,
      TELEFOON,
    );

    expect(uitkomst).toEqual({ soort: 'stil' });
    expect(verzendingen).toHaveLength(0);
  });

  test('accepteert een te snel ingevuld formulier stil', async () => {
    const uitkomst = await verwerkAanvraag(
      geldigeVelden({ tijdstempel: String(Date.now()) }),
      CONFIGURATIE,
      TELEFOON,
    );

    expect(uitkomst).toEqual({ soort: 'stil' });
    expect(verzendingen).toHaveLength(0);
  });

  test('valideert gewoon door als het tijdstempel ontbreekt, zodat het ook zonder JavaScript werkt', async () => {
    const velden = geldigeVelden();
    delete velden.tijdstempel;

    const uitkomst = await verwerkAanvraag(velden, CONFIGURATIE, TELEFOON);

    expect(uitkomst).toEqual({ soort: 'gelukt' });
  });

  test('meldt onbeschikbaar als de afleverconfiguratie ontbreekt', async () => {
    const uitkomst = await verwerkAanvraag(geldigeVelden(), { apiKey: 'alleen-sleutel' }, TELEFOON);

    expect(uitkomst).toEqual({ soort: 'onbeschikbaar' });
    expect(verzendingen).toHaveLength(0);
  });

  test('meldt mislukt als de notificatie wordt geweigerd', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => antwoord(false)));

    const uitkomst = await verwerkAanvraag(geldigeVelden(), CONFIGURATIE, TELEFOON);

    expect(uitkomst).toEqual({ soort: 'mislukt' });
  });

  test('meldt mislukt als de verzending een timeout geeft', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new DOMException('De tijd is verstreken', 'TimeoutError');
      }),
    );

    const uitkomst = await verwerkAanvraag(geldigeVelden(), CONFIGURATIE, TELEFOON);

    expect(uitkomst).toEqual({ soort: 'mislukt' });
  });

  test('blijft gelukt als alleen de bevestiging aan de aanvrager mislukt', async () => {
    let aanroepen = 0;
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        aanroepen += 1;
        return antwoord(aanroepen === 1);
      }),
    );

    const uitkomst = await verwerkAanvraag(geldigeVelden(), CONFIGURATIE, TELEFOON);

    expect(uitkomst).toEqual({ soort: 'gelukt' });
  });

  test('weigert stil als Turnstile geen token meekrijgt', async () => {
    const uitkomst = await verwerkAanvraag(
      geldigeVelden(),
      { ...CONFIGURATIE, turnstileGeheim: 'geheim' },
      TELEFOON,
    );

    expect(uitkomst).toEqual({ soort: 'stil' });
    expect(verzendingen).toHaveLength(0);
  });

  test('laat een CRM-fout de aanvrager niet raken', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (String(url).includes('crm')) throw new Error('CRM onbereikbaar');
        return antwoord(true);
      }),
    );

    const uitkomst = await verwerkAanvraag(
      geldigeVelden(),
      { ...CONFIGURATIE, crmUrl: 'https://crm.test.invalid/aanvraag' },
      TELEFOON,
    );

    expect(uitkomst).toEqual({ soort: 'gelukt' });
  });
});
