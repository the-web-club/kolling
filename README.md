# Kolling.nl

Coming-soon pagina voor Kolling, het merk van Thomas Kolling: meubels en houtwerk op maat uit de werkplaats in Ommen. Eén scherm, statisch, zonder database en zonder tracking.

De volledige site staat gebouwd op branch `feature/volledige-site` en komt terug zodra er echte projectfoto's en bevestigde feiten zijn. De opdracht daarvoor staat in `docs/STARTPROMPT.md`.

## Starten

```bash
pnpm install
pnpm dev
```

De pagina staat op `http://localhost:4321`. `pnpm dev` genereert eerst de designtokens.

## Scripts

| Script              | Wat het doet                                                            |
| ------------------- | ----------------------------------------------------------------------- |
| `pnpm dev`          | Tokens bouwen en de ontwikkelserver starten                             |
| `pnpm build`        | Tokens bouwen en een productiebuild maken                               |
| `pnpm preview`      | De productiebuild lokaal bekijken                                       |
| `pnpm check`        | Astro typechecking                                                      |
| `pnpm lint`         | ESLint over TypeScript en Astro                                         |
| `pnpm format`       | Prettier over de hele repository                                        |
| `pnpm og`           | Woordmerk, OG-beeld en favicon opnieuw renderen uit het logo            |
| `pnpm tokens:build` | `src/styles/tokens.css` en `src/design/tokens.gegenereerd.ts` genereren |
| `pnpm tokens:check` | Faalt als de gegenereerde bestanden afwijken van de tokenbron           |

## Wat er op de pagina staat

Eén scherm dat niet scrollt: woordmerk en de lokale tijd in Ommen bovenaan, een statement in twee regels in het midden, en onderaan het werkplaatsadres, het telefoonnummer en Instagram. De tekst komt uit `src/content/instellingen/site.json` en de frontmatter van `src/pages/index.astro`.

Achter de pagina beweegt `LichtAchtergrond`: twee zachte lichtvlakken die tegengesteld en heel traag over het wit trekken, met een statische korrel erover. Dat kost geen JavaScript en staat stil bij `prefers-reduced-motion: reduce`.

Het enige script op de pagina is de klok: vijftien regels inline, die de tijd in `Europe/Amsterdam` elke minuut verzet. Zonder JavaScript staat er alleen "Ommen".

## Designtokens

De bron staat in `tokens/primitief`, `tokens/semantisch` en `tokens/componenten`, in W3C DTCG-formaat. Style Dictionary genereert daaruit CSS custom properties en een typed export. Beide gegenereerde bestanden worden gecommit en nooit met de hand aangepast. Zie `docs/DESIGN-SYSTEM.md`.

## Fonts

Mint Grotesk en Apercu zijn de bedoelde fonts, maar er is nog geen licentie. Tot die er is wijzen de fonttokens naar Instrument Sans (koppen) en Work Sans (tekst), beide als variabele Latin-subset in `public/fonts` en met `preload` in de head. Wisselen is een tokenwijziging plus twee bestanden.

## Beeldmateriaal

`src/assets/merk/woordmerk.png`, `public/og.png` en `public/favicon.png` worden gerenderd uit `src/assets/merk/d-logo.svg` met `pnpm og`. Dat logo is een export met een ingesloten bitmap; het script leest het luminantiemasker eruit en zet het om in inkt op warm wit. Het logo wordt niet hertekend en nooit opgeschaald.

## Deployment

Vercel, statisch, productie-branch `main`. Er is geen serverless functie en geen adapter nodig. Preview-deployments zijn `noindex`. Zie `docs/DEPLOY.md`.

## Documentatie

- `docs/STARTPROMPT.md` de opdracht voor de volledige site
- `docs/BESLUITEN.md` gemaakte keuzes en afwijkingen
- `docs/DESIGN-SYSTEM.md` tokens, fonts en componenten
- `docs/CONTENTMODEL.md` collecties en velden van de volledige site
- `docs/SEO.md` SEO-afspraken en de checklist buiten de code
- `docs/FOTOGRAFIE.md` briefing voor het beeldmateriaal
- `docs/DEPLOY.md` Vercel en DNS
- `docs/review/` een notitie per bouwstap
