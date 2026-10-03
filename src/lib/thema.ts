const SLEUTEL = 'kolling-thema';

type Thema = 'licht' | 'donker';

function leesKeuze(): Thema | null {
  try {
    const waarde = localStorage.getItem(SLEUTEL);
    return waarde === 'licht' || waarde === 'donker' ? waarde : null;
  } catch {
    return null;
  }
}

function isDonker(): boolean {
  const gezet = document.documentElement.getAttribute('data-thema');
  if (gezet === 'donker') return true;
  if (gezet === 'licht') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function werkSchakelaarsBij(): void {
  const donker = isDonker();
  const kleur = getComputedStyle(document.body).backgroundColor;
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    if (meta instanceof HTMLMetaElement) meta.content = kleur;
  });
  document.querySelectorAll('[data-thema-schakelaar]').forEach((knop) => {
    knop.setAttribute('aria-pressed', String(donker));
  });
}

function bewaar(thema: Thema): void {
  try {
    localStorage.setItem(SLEUTEL, thema);
  } catch {
    return;
  }
}

function wissel(): void {
  const thema: Thema = isDonker() ? 'licht' : 'donker';
  document.documentElement.setAttribute('data-thema', thema);
  bewaar(thema);
  werkSchakelaarsBij();
}

function metOvergang(actie: () => void): void {
  const wortel = document.documentElement;
  const stil = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (document.startViewTransition === undefined || stil) {
    actie();
    return;
  }

  wortel.setAttribute('data-thema-wissel', '');
  const overgang = document.startViewTransition(actie);
  void overgang.finished.finally(() => {
    wortel.removeAttribute('data-thema-wissel');
  });
}

function koppelSchakelaar(knop: Element): void {
  if (!(knop instanceof HTMLButtonElement) || knop.hasAttribute('data-gekoppeld')) return;
  knop.setAttribute('data-gekoppeld', '');
  knop.addEventListener('click', () => metOvergang(wissel));
}

export function koppelThema(): void {
  document.addEventListener('astro:after-swap', werkSchakelaarsBij);
  document.addEventListener('astro:page-load', () => {
    document.querySelectorAll('[data-thema-schakelaar]').forEach(koppelSchakelaar);
    werkSchakelaarsBij();
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (leesKeuze()) return;
    werkSchakelaarsBij();
  });
}
