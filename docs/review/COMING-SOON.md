# Coming-soon pagina

Plan voor review. Nog niets gebouwd behalve dit document. Branch `feature/coming-soon`.

## Audit: de opdracht gaat uit van een lege repository

De opdracht beschrijft de coming-soon pagina als eerste oplevering en vraagt om het projectfundament. Dat fundament staat er al: de volledige site is gebouwd en op `main` gemerged (`6f2ce9e`). Concreet aanwezig en herbruikbaar zonder aanpassing:

pnpm met vastgezette versie, Astro 7.3.5 met TypeScript strict, Tailwind v4 via `@tailwindcss/vite` met `@theme inline`, Style Dictionary 5 met DTCG-tokens in drie lagen, `src/styles/tokens.css` (gegenereerd), `basis.css`, `beweging.css`, `Basis.astro`, `Seo.astro`, `JsonLd.astro`, `site.json`, ESLint, `.nvmrc`, `.env.example`, README en een groene CI-workflow.

Daarnaast staan er 19 paginabestanden en 26 componenten, waaronder een volledige homepage, `PaginaKop` en `PaginaVoet`. Dat raakt direct aan vraag 1 hieronder.

Wat nog ontbreekt en ik ga toevoegen: `.editorconfig`, Prettier, `scripts/maak-og.mjs`, en de coming-soon pagina zelf met zijn achtergrond.

## Bestanden

Nieuw:

1. `src/pages/index.astro` wordt de coming-soon pagina. De huidige homepage verhuist (zie vraag 1).
2. `src/components/LichtAchtergrond.astro` met `.licht`, `.vlak`, `.korrel` en `data-laag`.
3. `scripts/maak-og.mjs` dat `public/og.png` genereert met sharp, dat al in de boom zit via Astro.
4. `.editorconfig`, `prettier.config.js` en een `format`-script.

Gewijzigd:

5. `src/styles/beweging.css` krijgt de choreografie van deze pagina met `animation-delay`, en de ambient-animaties.
6. `src/pages/404.astro` krijgt dezelfde compositie op één scherm.
7. `tokens/primitief/beweging.json` en `tokens/semantisch/kleur.json` krijgen de tokens hieronder.
8. `.cursor/rules/41-woordenlijst.mdc` krijgt de nieuwe namen.
9. `docs/DEPLOY.md` krijgt de Vercel- en DNS-stappen voor het team tapro.

## Tokens die ik toevoeg

Primitief, in `tokens/primitief/beweging.json`:

- `beweging.duur.ambient` 90000ms
- `beweging.curve.ambient` `cubic-bezier(0.37, 0, 0.63, 1)`

Semantisch, in `tokens/semantisch/kleur.json`:

- `kleur.licht.warm` naar `{primitief.kleur.hout.es.200}`
- `kleur.licht.koel` naar `{primitief.kleur.lijn.200}`

Die twee semantische tokens zijn nodig omdat `10-design-system.mdc` geen primitieve tokens in een component toestaat. De opdracht noemt `kleur.hout.es.200` en `kleur.lijn.200` rechtstreeks; via deze laag blijft de regel intact en blijven de waarden hetzelfde.

De 140 seconden van de schaduwlaag wordt `calc(var(--k-beweging-duur-ambient) * 1.55)`, zoals gevraagd.

## Afwijkingen van de opdracht, met reden

1. **Padding van `.pagina`.** De opdracht noemt `maat.container.inline` als padding rondom. Die token is 76rem en bedoeld als tekstbreedte; als padding zou ze het scherm vullen. Ik gebruik `ruimte.goot`, de enige gootmaat in het systeem, en `maat.container` als maximale breedte.
2. **Fontgewichten.** Gevraagd zijn 300 en 400. Instrument Sans heeft geen 300 (de variabele as loopt van 400 tot 700), en de bestaande componenttokens gebruiken 500 voor labels en kapitalen. Ik houd 400 en 500 en subset naar Latin. De fonts zijn al lokaal gebundeld via `@fontsource-variable`, dus niet van een extern domein.
3. **`public/robots.txt`.** Er staat al een `robots.txt`-endpoint dat bij `VERCEL_ENV=preview` alles afschermt. Een statisch bestand zou dat overschrijven en previews indexeerbaar maken. Ik houd het endpoint en haal de sitemapregel eruit zolang er één pagina is.
4. **Favicon als monogram.** `00-project.mdc` verbiedt het logo te hertekenen, en een monogram bestaat niet. Het huidige favicon is het woordmerk op eigen verhouding; dat blijft.
5. **Lighthouse 0.98.** Ik kan dat lokaal niet meten. Ik lever de controles die ik wel kan doen (gewicht, geen layout shift, één scriptje onder 1 kB) en meld de score als ongemeten tot er een preview-URL is.

## Open vragen

**1. Wat gebeurt er met de volledige site die al op `main` staat?**

Een pagina die zegt "de website volgt" naast een volledig doorklikbare site met plaatshouderbeelden spreekt zichzelf tegen, en de sitemap zou dertien onafgemaakte pagina's aanmelden.

Mijn voorstel: ik zet de huidige staat van `main` veilig op `feature/volledige-site` en push die. Daarna bevat `main` het fundament plus de coming-soon pagina, en komt de volledige site terug zodra er foto's en bevestigde feiten zijn. Niets gaat verloren; de branch is één merge van terugkomen.

Alternatief: alles blijft op `main` en alleen `/` wordt de coming-soon pagina. Dan blijven `/werk`, `/maatwerk` en de rest bereikbaar via een directe link. Dat kan, maar dan is "de website volgt" niet waar.

**2. Welk logobestand gebruik ik?**

De opdracht vraagt `src/assets/merk/woordmerk.png`. In de repository staat `src/assets/merk/d-logo.svg`: hetzelfde woordmerk, maar een export met een ingesloten bitmap van 1065 px breed. Dat werkt en wordt nooit opgeschaald, maar het is 55 kB.

Heb je een schone export, dan gebruik ik die. Zo niet, dan render ik uit het bestaande bestand een PNG op de exacte weergavemaat, zodat de pagina onder de 150 kB blijft. Hertekenen doe ik niet.

**3. E-mailadres en KvK blijven weg?**

Beide staan nog als `[VUL IN]` in `site.json`. Volgens de opdracht laat ik ze dan weg, dus de pagina biedt telefoon en Instagram. Bevestig je dat, of heb je ze inmiddels?

## Hoe ik ga testen

Viewports 320×568, 360×640, 390×844, 768×1024, 1280×720, 1440×900, 1920×1080 en 844×390 liggend. Per formaat: geen scrollbar, `scrollHeight` gelijk aan de viewporthoogte, geen afgesneden tekst.

Verder: de choreografie binnen 1600 ms, reduced motion als enkele fade, de klok die ververst, de pagina zonder JavaScript volledig zichtbaar, zichtbare focus op de drie links, en `pnpm check`, `pnpm lint` en `pnpm build` schoon.

## Wacht op

`GO`, plus een antwoord op vraag 1. Vraag 2 en 3 kan ik met de standaard afdekken als je ze open laat.
