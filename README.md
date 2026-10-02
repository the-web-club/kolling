# Kolling.nl

Statische marketingsite voor Kolling, het merk van Thomas Kolling: meubels en houtwerk op maat uit de werkplaats in Ommen. Astro met TypeScript strict, zonder database. Alleen het aanvraagendpoint rendert op aanvraag.

## Starten

```bash
pnpm install
pnpm dev
```

De site staat op `http://localhost:4321`. `pnpm dev` genereert eerst de designtokens.

## Scripts

| Script | Wat het doet |
| --- | --- |
| `pnpm dev` | Tokens bouwen en de ontwikkelserver starten |
| `pnpm build` | Tokens bouwen en een productiebuild maken |
| `pnpm check` | Astro typechecking |
| `pnpm lint` | ESLint over TypeScript en Astro |
| `pnpm test` | Vitest over het aanvraagendpoint |
| `pnpm tokens:build` | `src/styles/tokens.css` en `src/design/tokens.gegenereerd.ts` genereren |
| `pnpm tokens:check` | Faalt als de gegenereerde bestanden afwijken van de tokenbron |

## Designtokens

De bron staat in `tokens/primitief`, `tokens/semantisch` en `tokens/componenten`, in W3C DTCG-formaat. Style Dictionary genereert daaruit CSS custom properties en een typed export. Beide gegenereerde bestanden worden gecommit en nooit met de hand aangepast.

Een token toevoegen: naam in `.cursor/rules/41-woordenlijst.mdc` zetten, waarde in de juiste laag toevoegen, `pnpm tokens:build` draaien en de token op `/design-system` laten zien. Zie `docs/DESIGN-SYSTEM.md`.

## Fonts

Mint Grotesk en Apercu zijn de bedoelde fonts, maar er is nog geen licentie. Tot die er is wijzen de fonttokens naar lokaal gehoste Instrument Sans en Work Sans. Wisselen is een tokenwijziging plus de woff2-bestanden in `src/assets/fonts/licensed/`. Zie `docs/DESIGN-SYSTEM.md`.

## Beelden

Er zijn nog geen projectfoto's. Elk beeldslot gebruikt een plaatshouder in een houttint met het label "Beeld volgt". Er staan geen stockfoto's in de repo.

Een plaatshouder vervangen door een echte foto:

1. Zet het bestand in `src/assets/projecten/<slug>/`.
2. Vervang in het contentbestand `plaatshouder: { tint, label }` door `bron: ./pad/naar/foto.jpg`.
3. Pas de `alt` aan zodat die beschrijft wat er te zien is.
4. Staat het project niet meer op plaatshouders, zet dan `plaatshouder: false` zodat het in de sitemap komt.

De briefing voor de fotografie staat in `docs/FOTOGRAFIE.md`.

## Content

Alles wat op de site staat komt uit `src/content`:

- `projecten/` een project per bestand
- `diensten/` de vier soorten maatwerk
- `edities/` nog leeg, tot de eerste editie bevestigd is
- `locaties/` het werkgebied, nu alleen Ommen
- `faq/algemeen.json` vragen die op meerdere pagina's staan
- `instellingen/site.json` naam, adres, telefoon, Instagram en SEO-fallbacks

De schema's staan in `src/content.config.ts` en valideren tijdens de build. Een nieuw project toevoegen vraagt geen componentwijziging. Zie `docs/CONTENTMODEL.md`.

Velden met `[VUL IN]` in `site.json` zijn nog onbekend en staan zichtbaar gemarkeerd op `/privacy`.

## Feitencheck

Contentbestanden hebben een lijst `beweringen[]`: uitspraken die Thomas moet bevestigen. Elke build schrijft `docs/FEITENCHECK.md` met alle open beweringen per pagina. Dat bestand is gegenereerd en staat in `.gitignore`.

## Aanvraagformulier

Het formulier op `/contact` post naar `src/pages/api/aanvraag.ts` en werkt ook zonder JavaScript. Verzending loopt via de Resend API.

Zonder `RESEND_API_KEY`, `AANVRAAG_ONTVANGER` en `AANVRAAG_AFZENDER` toont `/contact` dat verzenden niet beschikbaar is en verwijst naar telefoon en Instagram. Het formulier doet dan niet alsof. Zie `.env.example` en `docs/DEPLOY.md`.

## Deployment

Vercel, met de officiële Astro-adapter. Alle pagina's zijn statisch; alleen het aanvraagendpoint is een serverless functie. Preview-deployments zijn volledig `noindex`. DNS en de bestaande mailinrichting op het hoofddomein blijven onaangeroerd. Zie `docs/DEPLOY.md`.

## Documentatie

- `docs/STARTPROMPT.md` de volledige opdracht
- `docs/BESLUITEN.md` gemaakte keuzes en afwijkingen
- `docs/DESIGN-SYSTEM.md` tokens, fonts en componenten
- `docs/CONTENTMODEL.md` collecties en velden
- `docs/SEO.md` SEO-afspraken en de checklist buiten de code
- `docs/FOTOGRAFIE.md` briefing voor het beeldmateriaal
- `docs/DEPLOY.md` Vercel, environment variables en DNS voor Resend
- `docs/review/` een notitie per bouwstap
