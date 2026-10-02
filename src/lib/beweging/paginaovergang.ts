import type { TransitionDirectionalAnimations } from 'astro';

const vertrek = {
  name: 'pagina-uit',
  duration: 'var(--k-beweging-duur-kort)',
  easing: 'var(--k-beweging-curve-in-uit-quart)',
  fillMode: 'both',
};

const binnenkomst = {
  name: 'pagina-in',
  duration: 'var(--k-beweging-duur-overgang)',
  easing: 'var(--k-beweging-curve-uit-quint)',
  fillMode: 'both',
};

export const paginaovergang: TransitionDirectionalAnimations = {
  forwards: { old: vertrek, new: binnenkomst },
  backwards: { old: vertrek, new: binnenkomst },
};

function lichtAnimaties(): Animation[] {
  const licht = document.querySelector('.licht');
  return licht ? licht.getAnimations({ subtree: true }) : [];
}

export function koppelPaginaovergang(): void {
  let standen: number[] = [];

  // De lichtachtergrond blijft staan, maar Astro verplaatst het element bij een
  // wissel en daarmee begint de trage animatie opnieuw. De stand gaat daarom
  // mee over de wissel heen, zodat het licht doorloopt.
  document.addEventListener('astro:before-swap', () => {
    standen = lichtAnimaties().map((animatie) => Number(animatie.currentTime));
  });

  // Na de eerste wissel komt de pagina lichter binnen: de paginaovergang heeft
  // de aandacht dan al, dus de choreografie halveert.
  document.addEventListener('astro:after-swap', () => {
    document.documentElement.setAttribute('data-overgang', 'licht');

    lichtAnimaties().forEach((animatie, plek) => {
      const stand = standen[plek];
      if (stand !== undefined) {
        animatie.currentTime = stand;
      }
    });
  });
}
