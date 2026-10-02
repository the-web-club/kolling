import { startOnthullen } from '@/lib/beweging/onthul';
import { splitsRegels } from '@/lib/beweging/splits-regels';

function start(): void {
  for (const kop of document.querySelectorAll<HTMLElement>('[data-onthul="regels"]')) {
    splitsRegels(kop);
  }
  startOnthullen();
}

document.addEventListener('astro:page-load', start);
