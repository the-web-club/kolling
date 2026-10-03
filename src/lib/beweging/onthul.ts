const DREMPEL = 0.15;

let kijker: IntersectionObserver | undefined;

function overlaptVenster(element: HTMLElement): boolean {
  const vak = element.getBoundingClientRect();
  return vak.bottom > 0 && vak.top < window.innerHeight;
}

function vrijgeven(element: Element): void {
  element.setAttribute('data-in-beeld', '');
}

export function startOnthullen(): void {
  kijker?.disconnect();
  kijker = new IntersectionObserver(
    (inzendingen) => {
      for (const inzending of inzendingen) {
        if (!inzending.isIntersecting) continue;
        vrijgeven(inzending.target);
        kijker?.unobserve(inzending.target);
      }
    },
    { threshold: DREMPEL },
  );

  const elementen = document.querySelectorAll<HTMLElement>('[data-onthul], [data-onthul-regel]');
  for (const element of elementen) {
    if (element.hasAttribute('data-in-beeld')) continue;
    if (overlaptVenster(element)) {
      element.setAttribute('data-in-beeld', '');
      continue;
    }
    element.setAttribute('data-wacht', '');
    kijker.observe(element);
  }
}
