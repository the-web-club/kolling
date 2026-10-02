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

// Na de eerste client-side navigatie komt de pagina lichter binnen: de
// paginaovergang heeft de aandacht dan al, dus de choreografie halveert.
export function zetLichteBinnenkomst(): void {
  document.addEventListener('astro:after-swap', () => {
    document.documentElement.setAttribute('data-overgang', 'licht');
  });
}
