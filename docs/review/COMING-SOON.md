# Coming-soon pagina

Gebouwd op branch `feature/coming-soon`. De volledige site staat veilig op `feature/volledige-site`.

## Wat er staat

Eén scherm op `/` dat niet scrollt: woordmerk en de lokale tijd in Ommen bovenaan, een statement in twee regels in het midden, en onderaan een haarlijn met drie contactblokken en een microregel. Daarnaast een 404 in dezelfde compositie, een `robots.txt` die alles toelaat en bij een preview alles afschermt, en een OG-beeld.

`LichtAchtergrond` zet twee zachte lichtvlakken achter de pagina die tegengesteld en heel traag over het wit trekken, met een statische korrel erover. Negentig seconden voor het warme vlak, honderdveertig voor het koelere. Op een stilstaand moment lijkt de pagina gewoon wit.

Het enige script is de klok: vijftien regels inline, 422 bytes, die de tijd in `Europe/Amsterdam` elke minuut verzet. Zonder JavaScript staat er alleen "Ommen" en is de hele pagina direct zichtbaar, omdat alle entreeanimaties achter `[data-js]` staan.

## Wat er uit de repository is gehaald

De volledige site stond al op `main` en zou naast een pagina die zegt "de website volgt" een doorklikbare site met plaatshouderfoto's hebben opgeleverd. Die staat nu op `feature/volledige-site`: 17 paginabestanden, 24 componenten, vijf content collections, het aanvraagendpoint en de tests. Niets is verloren; het is één merge terug.

Wat bleef, is het fundament dat de volledige site straks weer gebruikt: de tokens in drie lagen, `basis.css`, `beweging.css`, `Basis.astro`, `Seo.astro`, `JsonLd.astro`, `site.json`, ESLint en de CI-workflow.

Ook weg op deze branch: de `@astrojs/vercel`-adapter, het `astro:env`-schema, zod en Vitest. Zonder server-route is er geen adapter nodig en worden er geen functies gebouwd. Ze komen met de volledige site terug.

## Tokens die zijn toegevoegd

Primitief: `beweging.duur.ambient` (90000ms) en `beweging.curve.ambient` (`cubic-bezier(0.37, 0, 0.63, 1)`). De 140 seconden van de schaduwlaag is `calc(var(--k-beweging-duur-ambient) * 1.55)`.

Semantisch: `kleur.licht.warm` en `kleur.licht.koel`, die naar `hout.es.200` en `lijn.200` verwijzen. De opdracht noemde die primitieven rechtstreeks, maar `10-design-system.mdc` staat geen primitieve tokens in een component toe; via deze laag blijft de regel intact en blijven de waarden gelijk. Verder `tekst.display-kort.*` voor de compacte stap op korte schermen.

Componenten: `binnenkomst.*` met de vertraging per element in de choreografie, en `merk.hoogte` plus `merk.hoogte-breed`. Die staan als token omdat de timing anders negen losse getallen in de CSS zou zijn, en rule 17 geen magische waarden toestaat.

## Afwijkingen van de opdracht

1. **Padding van `.pagina`** is `ruimte.goot`, niet `maat.container.inline`. Die laatste is 76rem en bedoeld als tekstbreedte; als padding zou ze het scherm vullen.
2. **Fontgewichten** zijn 400 en 500, niet 300 en 400. Instrument Sans heeft geen 300 en de bestaande componenttokens gebruiken 500 voor kapitaallabels. Wel zoals gevraagd: twee bestanden, Latin-subset, zelf gehost, beide met `preload`.
3. **`robots.txt` blijft een endpoint** in plaats van een statisch bestand in `public`. Een statisch bestand zou de preview-afscherming overschrijven en previews indexeerbaar maken.
4. **Het favicon is geen monogram.** `00-project.mdc` verbiedt het logo te hertekenen. Het is nu het woordmerk, gerenderd op 64 bij 64 met transparante ruimte, 1,5 kB. Het oude `favicon.svg` was het volledige logo met ingesloten bitmap en woog 54 kB, meer dan een derde van het gewichtsbudget.
5. **Twee hoogtestappen** in plaats van één. De opdracht noemde `max-height: 560px`, maar bij 320 bij 568 viel de microregel buiten het scherm. Nu verkleint de typografie onder 44rem en nog een stap onder 30rem.
6. **Lighthouse is niet gemeten.** Dat kan ik lokaal niet. Wat ik wel heb gemeten staat hieronder.

## Gemeten

Gewicht van het kritieke pad in de productiebuild, ongecomprimeerd: HTML 9,1 kB, CSS 27,4 kB, twee fonts 78,5 kB, woordmerk als AVIF 2,6 kB. Samen 117,7 kB, onder de 150 kB. Over de lijn met compressie blijft daar ongeveer 90 kB van over, want de fonts zijn al gecomprimeerd. Eigen JavaScript: 487 bytes.

Alle acht viewports uit de opdracht passen zonder verticale of horizontale overflow, met de microregel binnen het scherm:

| Formaat     | Past | Breedte H1 |
| ----------- | ---- | ---------- |
| 320 × 568   | ja   | 280 px     |
| 360 × 640   | ja   | 320 px     |
| 390 × 844   | ja   | 350 px     |
| 768 × 1024  | ja   | 468 px     |
| 1280 × 720  | ja   | 794 px     |
| 1440 × 900  | ja   | 895 px     |
| 1920 × 1080 | ja   | 893 px     |
| 844 × 390   | ja   | 516 px     |

Bij `prefers-reduced-motion: reduce` staan beide lichtvlakken stil (`animation-name: none`) en verschijnt alles met één fade van 200ms. Zonder JavaScript staat er geen enkel element op opacity 0.

De klok toont de tijd in Amsterdam, ook als de machine in een andere zone staat; bij de controle gaf het systeem 20:48 en de pagina 19:48.

`pnpm tokens:check`, `pnpm check` (13 bestanden), `pnpm lint`, `pnpm format:check` en `pnpm build` zijn schoon.

## Hoe te testen

```bash
pnpm build
pnpm preview
```

Per viewport uit de tabel: geen scrollbar, de microregel binnen beeld, de twee kopregels op hun eigen regel. Verder: de choreografie loopt binnen 1600 ms af, de achtergrond beweegt merkbaar traag als je een halve minuut wacht, de drie links krijgen een intekenende onderstreping bij hover en een zichtbare focusring met het toetsenbord.

Reduced motion zet je in de systeeminstellingen aan, of in DevTools onder Rendering. Zonder JavaScript test je door scripts te blokkeren; de pagina hoort dan volledig zichtbaar te zijn met alleen "Ommen" in plaats van "Ommen, 19:48".

## Wat open staat

1. **Woordmerk als SVG.** Het huidige `d-logo.svg` is een export met een ingesloten bitmap van 1065 px breed en een luminantiemasker. `pnpm og` rendert daaruit `woordmerk.png` op 480 px, het OG-beeld en het favicon. Een echte outline-SVG maakt die stap onnodig en is scherper op elk formaat.
2. **E-mailadres.** Nog `[VUL IN]` in `site.json`. De pagina laat de mailto-link dan weg; zodra het veld gevuld is verschijnt die automatisch onder "Bespreek je idee".
3. **KvK-nummer.** Ook nog `[VUL IN]`. De microregel voegt het er zelf bij zodra het bekend is.
4. **Licentiefonts.** Mint Grotesk en Apercu vervangen Instrument Sans en Work Sans met één tokenwijziging plus twee bestanden in `public/fonts`. De metrische correcties op de terugvalstack horen dan opnieuw bepaald te worden.
5. **Lighthouse.** Meten op de productie-URL, volgens `docs/DEPLOY.md`.
