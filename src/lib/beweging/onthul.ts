const DREMPEL = 0.15;
const MAX_IN_GROEP = 4;
const VERTRAGING = '--onthul-vertraging';

function zetVertraging(element: HTMLElement, stap: number): void {
  if (stap > 0) {
    element.style.setProperty(VERTRAGING, `calc(var(--k-beweging-trap-basis) * ${stap})`);
  }
}

function staatInBeeld(element: HTMLElement): boolean {
  const vak = element.getBoundingClientRect();
  return vak.top < window.innerHeight && vak.bottom > 0;
}

function onthul(element: Element): void {
  element.setAttribute('data-in-beeld', '');
}

export function startOnthullen(): void {
  for (const groep of document.querySelectorAll<HTMLElement>('[data-onthul-groep]')) {
    const kinderen = groep.querySelectorAll<HTMLElement>(':scope > *');
    kinderen.forEach((kind, index) => {
      if (index < MAX_IN_GROEP) {
        zetVertraging(kind, index);
      }
    });
  }

  for (const element of document.querySelectorAll<HTMLElement>('[data-onthul-vertraging]')) {
    zetVertraging(element, Number(element.dataset.onthulVertraging));
  }

  const kijker = new IntersectionObserver(
    (inzendingen) => {
      for (const inzending of inzendingen) {
        if (!inzending.isIntersecting) continue;
        onthul(inzending.target);
        kijker.unobserve(inzending.target);
      }
    },
    { threshold: DREMPEL },
  );

  for (const element of document.querySelectorAll<HTMLElement>('[data-onthul], [data-onthul-regel]')) {
    if (staatInBeeld(element)) {
      element.style.removeProperty(VERTRAGING);
      requestAnimationFrame(() => onthul(element));
      continue;
    }
    kijker.observe(element);
  }
}
