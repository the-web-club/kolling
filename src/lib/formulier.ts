type Veld = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

interface Antwoord {
  readonly melding: string;
  readonly fouten?: Record<string, string>;
}

const ALGEMENE_FOUT =
  'Het versturen lukte niet. Bel 06 13 62 22 76 of stuur een bericht via Instagram.';

function meldingVan(formulier: HTMLFormElement): HTMLParagraphElement | null {
  return formulier.querySelector('.melding');
}

function toonVeldfout(formulier: HTMLFormElement, naam: string, melding: string): void {
  const veld = formulier.elements.namedItem(naam);
  const doel = formulier.querySelector<HTMLElement>(`#fout-${naam}`);
  if (!doel) return;

  doel.textContent = melding;
  doel.hidden = melding === '';
  if (veld instanceof HTMLElement) {
    veld.toggleAttribute('data-fout', melding !== '');
  }
}

function controleer(formulier: HTMLFormElement, veld: Veld): boolean {
  const melding = veld.validity.valid
    ? ''
    : (veld.dataset.foutmelding ?? 'Dit veld is nog niet goed ingevuld.');
  toonVeldfout(formulier, veld.name, melding);
  return melding === '';
}

function velden(formulier: HTMLFormElement): Veld[] {
  return [...formulier.querySelectorAll<Veld>('[data-foutmelding]')];
}

function vulVoorselectieIn(formulier: HTMLFormElement): void {
  const gevraagd = new URL(window.location.href).searchParams.get('aanvraag');
  const keuze = formulier.elements.namedItem('soortAanvraag');
  if (!gevraagd || !(keuze instanceof HTMLSelectElement)) return;

  const bestaat = [...keuze.options].some((optie) => optie.value === gevraagd);
  if (bestaat) {
    keuze.value = gevraagd;
  }
}

async function leesAntwoord(reactie: Response): Promise<Antwoord> {
  const inhoud: unknown = await reactie.json();
  if (inhoud && typeof inhoud === 'object' && 'melding' in inhoud) {
    return inhoud as Antwoord;
  }
  return { melding: ALGEMENE_FOUT };
}

async function verstuur(formulier: HTMLFormElement, knop: HTMLButtonElement): Promise<void> {
  const melding = meldingVan(formulier);
  knop.disabled = true;
  const oorspronkelijk = knop.textContent;
  knop.textContent = 'Versturen…';

  try {
    const reactie = await fetch(formulier.action, {
      method: 'POST',
      body: new FormData(formulier),
      headers: { Accept: 'application/json' },
    });

    if (reactie.ok) {
      window.location.assign('/bedankt');
      return;
    }

    const antwoord = await leesAntwoord(reactie);
    for (const [naam, tekst] of Object.entries(antwoord.fouten ?? {})) {
      toonVeldfout(formulier, naam, tekst);
    }
    if (melding) {
      melding.textContent = antwoord.melding;
      melding.dataset.toestand = 'fout';
    }
  } catch {
    if (melding) {
      melding.textContent = ALGEMENE_FOUT;
      melding.dataset.toestand = 'fout';
    }
  } finally {
    knop.disabled = false;
    knop.textContent = oorspronkelijk;
  }
}

export function koppelFormulier(): void {
  const formulier = document.querySelector<HTMLFormElement>('.aanvraag-formulier');
  if (!formulier) return;

  const tijdstempel = formulier.elements.namedItem('tijdstempel');
  if (tijdstempel instanceof HTMLInputElement) {
    tijdstempel.value = String(Date.now());
  }

  vulVoorselectieIn(formulier);

  for (const veld of velden(formulier)) {
    veld.addEventListener('blur', () => controleer(formulier, veld), { once: false });
  }

  formulier.addEventListener('submit', (gebeurtenis) => {
    gebeurtenis.preventDefault();
    const onjuist = velden(formulier).filter((veld) => !controleer(formulier, veld));
    const eerste = onjuist.at(0);
    if (eerste) {
      eerste.focus();
      return;
    }

    const knop = formulier.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (knop) {
      void verstuur(formulier, knop);
    }
  });
}
