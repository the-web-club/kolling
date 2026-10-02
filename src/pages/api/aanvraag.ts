import type { APIRoute } from 'astro';
import {
  AANVRAAG_AFZENDER,
  AANVRAAG_BCC,
  AANVRAAG_ONTVANGER,
  CRM_WEBHOOK_GEHEIM,
  CRM_WEBHOOK_URL,
  RESEND_API_KEY,
  TURNSTILE_SECRET_KEY,
} from 'astro:env/server';
import { haalInstellingen } from '@/lib/content';
import { verwerkAanvraag, type Uitkomst } from '@/lib/aanvraag';

export const prerender = false;

const MELDINGEN = {
  onbeschikbaar:
    'Verzenden is nu niet beschikbaar. Bel 06 13 62 22 76 of stuur een bericht via Instagram.',
  mislukt: 'Het versturen lukte niet. Bel 06 13 62 22 76 of stuur een bericht via Instagram.',
  veldfouten: 'Er ontbreekt nog iets. Loop de gemarkeerde velden na.',
  oorsprong: 'Deze aanvraag is niet verwerkt.',
} as const;

function wilJson(request: Request): boolean {
  return request.headers.get('accept')?.includes('application/json') === true;
}

function json(status: number, melding: string, fouten?: Record<string, string>): Response {
  return new Response(JSON.stringify({ melding, fouten }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function omleiding(pad: string): Response {
  return new Response(null, { status: 303, headers: { Location: pad } });
}

function isEigenOorsprong(request: Request): boolean {
  const oorsprong = request.headers.get('origin');
  if (!oorsprong) return true;
  return oorsprong === new URL(request.url).origin;
}

function naarReactie(uitkomst: Uitkomst, request: Request): Response {
  if (uitkomst.soort === 'gelukt' || uitkomst.soort === 'stil') {
    return wilJson(request)
      ? json(200, 'Je aanvraag is verstuurd.')
      : omleiding('/bedankt');
  }

  if (uitkomst.soort === 'veldfouten') {
    return wilJson(request)
      ? json(400, MELDINGEN.veldfouten, uitkomst.fouten)
      : omleiding('/contact#aanvraag-fout');
  }

  if (uitkomst.soort === 'onbeschikbaar') {
    return wilJson(request)
      ? json(503, MELDINGEN.onbeschikbaar)
      : omleiding('/contact#aanvraag-onbeschikbaar');
  }

  return wilJson(request) ? json(502, MELDINGEN.mislukt) : omleiding('/contact#aanvraag-mislukt');
}

export const POST: APIRoute = async ({ request }) => {
  if (!isEigenOorsprong(request)) {
    return wilJson(request)
      ? json(403, MELDINGEN.oorsprong)
      : omleiding('/contact#aanvraag-mislukt');
  }

  const instellingen = await haalInstellingen();
  const velden = Object.fromEntries(await request.formData());

  const uitkomst = await verwerkAanvraag(
    velden,
    {
      apiKey: RESEND_API_KEY,
      ontvanger: AANVRAAG_ONTVANGER,
      afzender: AANVRAAG_AFZENDER,
      bcc: AANVRAAG_BCC,
      turnstileGeheim: TURNSTILE_SECRET_KEY,
      crmUrl: CRM_WEBHOOK_URL,
      crmGeheim: CRM_WEBHOOK_GEHEIM,
    },
    instellingen.telefoon.weergave,
  );

  return naarReactie(uitkomst, request);
};
