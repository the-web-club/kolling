function maakWoord(woord: string, laatste: boolean): HTMLSpanElement {
  const span = document.createElement('span');
  span.textContent = laatste ? woord : `${woord} `;
  return span;
}

function groepeerPerRegel(woorden: readonly HTMLSpanElement[]): string[] {
  const regels: string[] = [];
  let vorigeHoogte: number | undefined;

  for (const woord of woorden) {
    const tekst = woord.textContent ?? '';
    if (woord.offsetTop === vorigeHoogte && regels.length > 0) {
      regels[regels.length - 1] += tekst;
      continue;
    }
    regels.push(tekst);
    vorigeHoogte = woord.offsetTop;
  }

  return regels.map((regel) => regel.trim());
}

function maakRegel(tekst: string): HTMLSpanElement {
  const buiten = document.createElement('span');
  buiten.setAttribute('data-onthul-regel', '');
  const binnen = document.createElement('span');
  binnen.textContent = tekst;
  buiten.append(binnen);
  return buiten;
}

export function splitsRegels(element: HTMLElement): void {
  const tekst = element.textContent?.trim();
  if (!tekst) return;

  const woorden = tekst.split(/\s+/);
  const spans = woorden.map((woord, index) => maakWoord(woord, index === woorden.length - 1));
  element.replaceChildren(...spans);

  const regels = groepeerPerRegel(spans);
  element.replaceChildren(...regels.map(maakRegel));
}
