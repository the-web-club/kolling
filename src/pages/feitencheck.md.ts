import { mkdir, writeFile } from 'node:fs/promises';
import type { APIRoute } from 'astro';
import { haalDiensten, haalEdities, haalLocaties, haalProjecten } from '@/lib/content';

const DOELBESTAND = 'docs/FEITENCHECK.md';

interface Blok {
  readonly pagina: string;
  readonly beweringen: readonly string[];
}

function maakMarkdown(blokken: readonly Blok[]): string {
  const open = blokken.filter((blok) => blok.beweringen.length > 0);

  const kop = [
    '# Feitencheck',
    '',
    'Gegenereerd bij elke build. Niet met de hand aanpassen.',
    '',
    'Hieronder staan de uitspraken die Thomas moet bevestigen voordat de site live gaat.',
    'Een bevestigde uitspraak haal je uit `beweringen[]` in het bijbehorende contentbestand.',
    '',
  ];

  if (open.length === 0) {
    return [...kop, 'Er staan geen open beweringen meer open.', ''].join('\n');
  }

  const secties = open.flatMap((blok) => [
    `## ${blok.pagina}`,
    '',
    ...blok.beweringen.map((bewering) => `- [ ] ${bewering}`),
    '',
  ]);

  return [...kop, `Open beweringen: ${open.reduce((totaal, blok) => totaal + blok.beweringen.length, 0)}.`, '', ...secties].join('\n');
}

export const GET: APIRoute = async () => {
  const [projecten, diensten, locaties, edities] = await Promise.all([
    haalProjecten(),
    haalDiensten(),
    haalLocaties(),
    haalEdities(),
  ]);

  const blokken: Blok[] = [
    ...projecten.map((item) => ({ pagina: `/werk/${item.id}`, beweringen: item.data.beweringen })),
    ...diensten.map((item) => ({ pagina: `/maatwerk/${item.id}`, beweringen: item.data.beweringen })),
    ...locaties.map((item) => ({
      pagina: `/werkgebied/${item.id}`,
      beweringen: item.data.beweringen,
    })),
    ...edities.map((item) => ({ pagina: `/edities/${item.id}`, beweringen: item.data.beweringen })),
  ];

  const markdown = maakMarkdown(blokken);

  await mkdir('docs', { recursive: true });
  await writeFile(DOELBESTAND, markdown, 'utf8');

  return new Response(markdown, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
