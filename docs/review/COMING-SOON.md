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

Componenten: `binnenkomst.*` met de vertraging per element in de choreografie. Die staan als token omdat de timing anders negen losse getallen in de CSS zou zijn, en rule 17 geen magische waarden toestaat. Verder `pagina.*` voor de padding en de afstand tussen de contactblokken, en `merk.hoogte` plus `merk.hoogte-breed`.

## Spacing na de eerste review

Het woordmerk was op mobiel 22 px en de blokken in de voet stonden met 1 rem onder elkaar, net zoals de opdracht vroeg. In de praktijk las dat als één doorlopende lijst, omdat de afstand tussen de blokken nauwelijks groter was dan die tussen een label en zijn tekst.

Aangepast:

|                       | Was                   | Nu                                            |
| --------------------- | --------------------- | --------------------------------------------- |
| Woordmerk mobiel      | 1,375 rem             | 1,75 rem                                      |
| Woordmerk desktop     | 1,75 rem              | 2 rem                                         |
| Padding mobiel        | `ruimte.goot` (20 px) | `ruimte.4` (16 px)                            |
| Padding desktop       | `ruimte.goot`         | `ruimte.goot`                                 |
| Blokken onder elkaar  | `ruimte.4`            | `ruimte.8`, en `ruimte.6` onder 44 rem hoogte |
| Haarlijn naar blokken | `ruimte.4`            | `ruimte.6`                                    |

De stap terug naar `ruimte.6` op korte schermen is nodig omdat bij 320 bij 568 anders maar 5 px overbleef. Nu is de kleinste marge 16 px.

Bij die controle kwam ook een echte fout boven: in de adresregel stond "7731 GVOmmen" aan elkaar. Prettier had de twee expressies over twee regels verdeeld, en een regelafbreking tussen expressies verdwijnt in de uitvoer. De adresregel en de microregel worden nu in de frontmatter samengesteld, zodat opmaak van de template ze niet meer kan breken.

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

| Formaat     | Past | Ruimte onder de microregel |
| ----------- | ---- | -------------------------- |
| 320 × 568   | ja   | 16 px                      |
| 360 × 640   | ja   | 16 px                      |
| 390 × 844   | ja   | 16 px                      |
| 768 × 1024  | ja   | 27 px                      |
| 1280 × 720  | ja   | 36 px                      |
| 1440 × 900  | ja   | 39 px                      |
| 1920 × 1080 | ja   | 40 px                      |
| 844 × 390   | ja   | 28 px                      |

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

## Iconen, e-mail en WhatsApp

Het e-mailadres is `thomas@kolling.nl`. De mailto-link stond al klaar en verschijnt nu automatisch. WhatsApp is toegevoegd als `https://wa.me/31613622276`, hetzelfde nummer als de telefoonlink; de bewering of dat nummer WhatsApp heeft is daarmee beantwoord en uit `site.json` gehaald.

De voet heeft nu een eigen iconenset in `src/components/iconen/`: `Pin`, `Telefoon`, `Whatsapp`, `Envelop` en `Instagram`. Geen library, maar vijf inline SVG's met dezelfde haarlijn als de rest van de site: viewBox 24, lijndikte 1,1, vierkante uiteinden en hoeken in verstek. Dat sluit aan op radius 0 en de haarlijnen in het design system. De maat, de dikte, de kleur en de afstand tot de tekst staan in `tokens/componenten/icoon.json`.

De iconen doen hier echt werk: telefoon, WhatsApp en e-mail zijn drie verschillende acties op dezelfde regel tekst, en zonder icoon zou je ze alleen aan hun label kunnen onderscheiden. Bij hover wordt het icoon van `voorgrond-subtiel` naar `voorgrond` en tekent de onderstreping onder de tekst in. Die lijn zit op een `span` om de tekst, niet op de link, zodat het icoon geen streep meekrijgt.

Let op: de oorspronkelijke opdracht voor deze pagina zei "geen social-iconen". Die zijn er nu wel, op jouw verzoek. Ze zijn eigen werk in de huisstijl, geen merkglyphs uit een pakket.

Door de twee extra regels liep 320 bij 568 vier pixels over. De regelafstand binnen een blok gaat daarom onder 44 rem hoogte naar `ruimte.1` en de blokafstand naar `ruimte.5`. Alle acht formaten passen weer, met minimaal 16 px over.

## Copy van het statement

De kop is "Houtwerken & meubels" / "uit Ommen." De intro zei eerst vrijwel hetzelfde als de kop; die herhaalt nu niet meer en voegt toe waar en hoe het gemaakt wordt: "Op maat gemaakt in eigen werkplaats aan de Strangeweg. De website volgt. Een idee bespreken kan nu al."

In de kop staat een ampersand, in de paginatitel en de description staat "en". Een `&` is een typografische keuze die in display werkt; in een zoekresultaat leest "houtwerken en meubels" beter.

De langere kop paste niet meer. De lettergrootte werd begrensd door de viewport, maar het raster stopt bij 90 rem met groeien, dus op brede schermen liep de regel buiten zijn kolom en brak hij af naar drie regels. De grens is nu de kolombreedte zelf: `.statement` is een container en de kop gebruikt `min(tekstmaat, var(--statement-cap))` in `cqi`. Daarmee staat de kop op elk formaat op precies twee regels, met `text-wrap: nowrap` zodat er niets ongewild afbreekt.

De caps staan op 8,9 cqi mobiel en 7,4 cqi vanaf 48 rem. Dat is krapper dan strikt nodig: bij de exacte waarde bleef op 320 px maar 2 px over, en de terugvalfont is iets breder per teken dan Instrument Sans. Nu is de smalste marge 17 px.

| Formaat     | Kop    | Marge naast de kop |
| ----------- | ------ | ------------------ |
| 320 × 568   | 26 px  | 17 px              |
| 390 × 844   | 32 px  | 28 px              |
| 768 × 1024  | 53 px  | 43 px              |
| 1440 × 900  | 101 px | 84 px              |
| 1920 × 1080 | 101 px | 84 px              |

Dat de kop boven 1440 px niet meer groeit is juist: het raster doet dat ook niet.

## Audit voor de header met menu

Vooronderzoek voor de navigatie en de zes "Binnenkort"-pagina's. Er is nog niets gebouwd. Hieronder staan de indeling, de routes en het JavaScript-budget, daarna drie vragen die eerst een antwoord nodig hebben.

### Headerindeling per viewport

Eén raster van drie cellen op elke breedte. Alleen de bewoner van de middelste cel wisselt, zodat de koprij nergens van structuur verandert.

| Breedte        | Links     | Midden                            | Rechts    |
| -------------- | --------- | --------------------------------- | --------- |
| 1024 en breder | woordmerk | navigatie, zes items, gecentreerd | klok      |
| 768 tot 1024   | woordmerk | klok, rechts uitgelijnd           | knop Menu |
| 360 tot 768    | woordmerk | klok, rechts uitgelijnd           | knop Menu |
| onder 360      | woordmerk | leeg                              | knop Menu |

De volgorde in de HTML is woordmerk, navigatie, klok, knop. Die loopt op elke breedte gelijk met de volgorde op het scherm, dus het toetsenbord hoeft niet terug te springen.

De koprij blijft net zo hoog als nu, `merk.hoogte` op smal en `merk.hoogte-breed` vanaf 48 rem. De knop Menu heeft een aanraakdoel van 44 px nodig en dat is hoger dan het woordmerk. De knop krijgt daarom verticale padding met een even grote negatieve marge: het doel is 44 px, de rij groeit niet mee. Het overschot valt in de rijafstand van `ruimte.rij.md`, waar geen ander element staat.

Onder 1024 px staan de zes items alleen in het menu, niet in de koprij. Twee lijsten met dezelfde zes links dus, beide uit `navigatie[]`; de data staat één keer vast.

### Routestructuur

`src/pages/[sectie].astro` met `getStaticPaths()` over `navigatie[]` levert `/over`, `/voorbeelden`, `/collectie`, `/werk`, `/nieuws` en `/downloads` als statische pagina's. Er komt geen vangroute, dus elk ander pad valt op de 404.

| Pagina      | robots            | JSON-LD | Canonical |
| ----------- | ----------------- | ------- | --------- |
| `/`         | index, follow     | ja      | `/`       |
| zes secties | noindex, follow   | nee     | eigen pad |
| 404         | noindex, nofollow | nee     | eigen pad |

`robots.txt` verandert niet en er is op deze branch geen sitemap, dus er valt ook niets uit te sluiten. In een preview zet `Seo.astro` alles al op `noindex`.

### JavaScript-budget

Vier posten: de router van Astro, `src/lib/menu.ts`, `src/lib/beweging/paginaovergang.ts` en de klok. De klok en het menu zijn samen een paar honderd bytes; de router is de enige echte post. Ik meet het gecomprimeerde gewicht op de productiebuild en zet de uitkomst hieronder, naast de 487 bytes die de pagina nu nodig heeft. Blijft de router boven het budget, dan vervalt `ClientRouter` en worden de paginaovergangen gewone paginaladingen; de rest van de opdracht werkt dan ongewijzigd.

### Drie vragen

1. **`transition:persist` op `PaginaKop` en de meeschuivende haarlijn gaan niet samen.** Een element met `transition:persist` wordt bij navigatie niet vervangen: Astro houdt het oude element en gooit de nieuwe versie weg. De kop van de vorige pagina blijft dus staan met `aria-current` op het vorige item, en een menu dat open stond blijft open. Mijn voorstel: `transition:persist` alleen op de klok, de lichtachtergrond en de contactrij, en de navigatie gewoon mee laten wisselen. Dan loopt de klok door, herstart de achtergrond niet, klopt `aria-current` en kan `transition:name="menu-indicator"` de haarlijn van het oude naar het nieuwe item schuiven. Akkoord?
2. **Gewicht 300 bestaat niet in de huidige fonts.** Instrument Sans is geladen als variabele font met bereik 400 tot 700, dus de menu-items in `tekst.kop2` komen met gewicht 300 alsnog op 400 uit. Dat is dezelfde grens als afwijking 2 hierboven. Ik houd 400 aan tot de licentiefonts er zijn, tenzij je wilt dat ik het bereik van de webfont oprek.
3. **Waar landt dit werk?** De opdracht noemt `feature/coming-soon-menu` met een pull request, de laatste instructie noemt `main`. Er staat geen pull request open en `main` loopt gelijk met `origin/main`, dus beide kan. Mijn voorstel is `main`, omdat de coming-soon pagina daar ook rechtstreeks op is geland.

### Twee opmerkingen, geen vraag

De beeldaanvulling staat niet op `main`: de homepage heeft nu geen diptiek en geen enkel beeld. "Geen beelden op de sectiepagina's" is daarmee vanzelf waar, en ik laat de homepage beeldloos zoals hij is.

Het menu leunt op de Popover API, die zonder JavaScript opent en sluit. Een browser die `popover` niet kent, negeert het attribuut: het menu staat dan als gewone lijst in de pagina in plaats van fullscreen. De links blijven bereikbaar, maar de koprij is op zo'n browser hoger dan één regel. Dat raakt Safari voor 17 en Firefox voor 125.

## Wat open staat

1. **Woordmerk als SVG.** Het huidige `d-logo.svg` is een export met een ingesloten bitmap van 1065 px breed en een luminantiemasker. `pnpm og` rendert daaruit `woordmerk.png` op 480 px, het OG-beeld en het favicon. Een echte outline-SVG maakt die stap onnodig en is scherper op elk formaat.
2. **KvK-nummer.** Nog `[VUL IN]` in `site.json`. De microregel voegt het er zelf bij zodra het bekend is.
3. **Licentiefonts.** Mint Grotesk en Apercu vervangen Instrument Sans en Work Sans met één tokenwijziging plus twee bestanden in `public/fonts`. De metrische correcties op de terugvalstack horen dan opnieuw bepaald te worden.
4. **Lighthouse.** Meten op de productie-URL, volgens `docs/DEPLOY.md`.
