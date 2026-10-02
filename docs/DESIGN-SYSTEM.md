# Design system Galerie

Eén bron, drie lagen, gegenereerde output. De visuele referentie staat op `/design-system`; die pagina leest de gegenereerde tokens en kan dus niet verouderen.

## Lagen

| Laag | Map | CSS-variabele | Verwijst naar |
| --- | --- | --- | --- |
| Primitief | `tokens/primitief` | `--k-kleur-inkt-900` | niets, dit zijn de ruwe waarden |
| Semantisch | `tokens/semantisch` | `--kleur-voorgrond` | primitief |
| Componenten | `tokens/componenten` | `--knop-hoogte` | semantisch, of primitief voor maten zonder semantische tegenhanger |

Componenten gebruiken componenttokens of semantische tokens. Nooit een primitieve token in een component en nooit een losse waarde.

Elk primitief bestand nest onder `primitief`, zodat `ruimte.sectie` in de primitieve laag en `ruimte.sectie` in de semantische laag niet op hetzelfde tokenpad uitkomen. De prefix `k-` wordt tijdens de generatie aan de primitieve laag toegevoegd.

## Genereren

`pnpm tokens:build` schrijft:

- `src/styles/tokens.css` met alle custom properties in `:root`
- `src/design/tokens.gegenereerd.ts` met een typed lijst van alle tokens

Verwijzingen blijven staan, dus `--kleur-voorgrond: var(--k-kleur-inkt-900)`. In de browser zie je daardoor welke semantische token op welke merkwaarde uitkomt.

`pnpm tokens:check` bouwt naar een tijdelijke map en vergelijkt. Wijkt de output af van de bron, dan faalt de check. CI draait die check, dus gegenereerde bestanden kunnen niet verouderen in de repo.

## Een token toevoegen

1. Zet de naam in `.cursor/rules/41-woordenlijst.mdc`.
2. Voeg de primitieve waarde toe, daarna de semantische verwijzing, daarna eventueel de componenttoken.
3. Draai `pnpm tokens:build` en commit `src/styles/tokens.css` en `src/design/tokens.gegenereerd.ts`.
4. Controleer de token op `/design-system`.

## Waarden

Kleur: warm wit `papier`, bijna zwart `inkt`, één grijs voor metadata `steen`, haarlijnen `lijn`, drie houttinten (`eik`, `noten`, `es`) uitsluitend voor plaatshouders, en één functionele foutkleur. Er is geen tweede merkkleur; het hout brengt de kleur.

Typografie: twee families. `kop` voor display en koppen, `tekst` voor lopende tekst en interface. Gewicht maximaal 500. Fluide schaal van `xs` tot `display` met `clamp()`, zodat er geen losse breakpoint-overrides nodig zijn.

Ruimte: 4px-basis. `ruimte.sectie` tussen secties, `ruimte.blok` tussen blokken binnen een sectie, `ruimte.stapel.*` binnen een blok en `ruimte.goot` als enige gootmaat.

Vorm: radius 0, invoervelden 2px. Haarlijn 1px. Geen schaduwen.

Beweging: duur, curve, trap, afstand en schaal als tokens. Het gedrag staat in `.cursor/rules/70-motion.mdc` en de CSS in `src/styles/beweging.css`.

## Raster

Twaalf kolommen met één goot. Het raster zit op het `section`-element in `src/styles/basis.css`, zodat elke sectie op dezelfde lijnen staat. Componenten kiezen hun kolommen met `grid-column`. Tekst start doorgaans op kolom 2, beeld op kolom 7 of later.

## Tailwind

`@theme inline` in `src/styles/basis.css` mapt semantische tokens naar Tailwind-namespaces met een Nederlandse naam, bijvoorbeeld `--spacing-sectie` en `--color-voorgrond`. Utilities zijn alleen toegestaan voor raster, spacing, responsive zichtbaarheid en `sr-only`.

Breakpoints komen uit Tailwind zelf. Die waarden zijn gelijk aan `primitief.schermbreedte` en worden niet opnieuw gemapt, omdat een media-querygrens geen CSS-variabele kan zijn. Dat is de enige uitzondering op "alle waarden uit tokens".

## Fonts

Mint Grotesk (Lift Type) en Apercu (Colophon Foundry) zijn de bedoelde fonts. Er is nog geen licentie, dus de fonttokens wijzen nu naar:

- `letter.familie.kop`: Instrument Sans, lokaal gehost als variabele woff2
- `letter.familie.tekst`: Work Sans, lokaal gehost als variabele woff2

Beide zijn OFL en komen uit `@fontsource-variable`, dus ze worden met de site gebundeld en niet van een extern domein geladen. `font-display: swap` staat aan.

Voor de terugvalstack staan er metrische correcties in `basis.css` op `Kop terugval` en `Tekst terugval`. Die zijn benaderd en bedoeld om zichtbaar verspringen bij het laden te beperken. Komen de licentiefonts er, dan horen ze opnieuw bepaald te worden.

Wisselen naar de licentiefonts:

1. Zet de woff2-bestanden in `src/assets/fonts/licensed/` (die map staat in `.gitignore`).
2. Voeg de `@font-face`-regels toe in `basis.css`.
3. Pas `letter.familie.kop` en `letter.familie.tekst` aan in `tokens/primitief/letter.json`.
4. Draai `pnpm tokens:build`. Verder verandert er niets, want componenten verwijzen alleen naar de tokens.
5. Zet de repository op privé zodra er licentiebestanden in staan.

## Logo

Eén variant: `src/assets/merk/d-logo.svg`, zwart op transparant, uitsluitend op lichte achtergronden. Niet inverteren, herkleuren of hertekenen, en niet op een donker vlak zetten.

Het bestand is een export met een ingesloten bitmap en een luminantiemasker, geen uitgewerkte paden. Het wordt daarom op zijn eigen formaat of kleiner getoond en nooit opgeschaald. Een outline-SVG mag het later vervangen; alleen dat ene bestand hoeft dan te wisselen.

## Componenten

`PaginaKop`, `PaginaVoet`, `Hero`, `Beeld`, `Plaatshouder`, `MuseumLabel`, `WerkRaster`, `WerkKaart`, `EditieKaart`, `SectieIntro`, `ProcesStappen`, `MateriaalLijst`, `OplageLabel`, `CtaStrook`, `AanvraagFormulier`, `FormulierVeld`, `FormulierKeuze`, `Faq`, `Kruimelpad`, `Seo`, `JsonLd`, `LopendeTekst`, `Knop`, `TekstLink` en `iconen/Chevron`.

`Beeld` is het enige beeldcomponent. Het kiest zelf tussen een echte afbeelding en een plaatshouder, zet de verhouding vast en verzorgt de hover- en onthulbeweging. Daardoor hoeft een pagina niets over beeldgedrag te weten.
