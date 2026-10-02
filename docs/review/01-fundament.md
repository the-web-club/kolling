# 01 Fundament

## Wat

Astro 7 met TypeScript strict en pnpm. Designtokens in drie lagen met Style Dictionary, Tailwind v4 alleen voor raster en spacing, twee lokaal gehoste fonts, de basiscomponenten en de referentiepagina `/design-system`. De negen Cursor-rules staan in `.cursor/rules/`.

## Waarom zo

De tokenbron staat in W3C DTCG-formaat, verdeeld over `tokens/primitief`, `tokens/semantisch` en `tokens/componenten`. Primitieve bestanden nesten onder `primitief`, want anders botsen `ruimte.sektie` in twee lagen op hetzelfde tokenpad en overschrijft de laatste de eerste. De prefix `k-` komt uit een naamtransform, niet uit de bestandsnaam.

`pnpm tokens:check` bouwt naar een tijdelijke map en vergelijkt met wat er in de repo staat. Zo kan de gegenereerde CSS niet stil verouderen. Dat is het verschil met een losse JSON en een losse CSS die elkaar niet kennen.

`/design-system` leest `src/design/tokens.gegenereerd.ts` in plaats van een met de hand bijgehouden lijst. Een nieuwe token verschijnt daarmee automatisch op de referentiepagina.

Het raster zit op het `section`-element in `basis.css`. Daardoor staat elke sectie op dezelfde twaalf kolommen zonder dat er een `.container`-class nodig is, wat ook niet mag van de CSS-regels.

## Open punten

De metrische correcties op de terugvalfonts (`Kop terugval`, `Tekst terugval`) zijn benaderingen. Komen Mint Grotesk en Apercu er, dan horen ze opnieuw bepaald te worden.

Breakpoints komen uit Tailwind in plaats van uit tokens, omdat een media-querygrens geen CSS-variabele kan zijn. De waarden zijn gelijk aan `primitief.schermbreedte`. Dit staat als uitzondering in `docs/DESIGN-SYSTEM.md`.

## Hoe te testen

```bash
pnpm tokens:check
pnpm check
pnpm lint
```

Open `/design-system` en controleer of kleur, typeschaal, ruimte, knoppen, beeldslots en componenttokens kloppen met de tokenbron.
