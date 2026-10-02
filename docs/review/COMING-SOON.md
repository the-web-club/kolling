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

### Gebouwd en gemeten

De navigatie staat in `navigatie[]` in `site.json`; `PaginaKop` leest die lijst, `Menu` ook, en `src/pages/[sectie].astro` maakt er met `getStaticPaths()` zes pagina's van. De build levert acht pagina's: de voorpagina, zes secties en de 404.

Antwoorden op de drie vragen: `transition:persist` zit alleen op de klok, de lichtachtergrond en de contactrij; de navigatie wisselt mee, zodat `aria-current` klopt en de haarlijn met `transition:name="menu-indicator"` naar het nieuwe item schuift. De menu-items staan in Work Sans op gewicht 300: de kopfont heeft geen 300, de tekstfont wel, en navigatie is interface. Het werk is op `main` geland.

Drie dingen bleken anders dan gepland:

1. **Persist heeft een eigen naam nodig.** Zonder naam leidt Astro de persist-sleutel af uit de positie in de pagina, en die verschilt per route. De lichtachtergrond kreeg daardoor elke navigatie een nieuw element. Nu staan er vaste namen: `licht`, `klok` en `contactrij`.
2. **Een blijvend element herstart zijn animatie.** Astro verplaatst het persistente element naar het nieuwe document en dat zet CSS-animaties terug op nul; het licht sprong bij elke wissel. `koppelPaginaovergang` bewaart daarom de stand bij `astro:before-swap` en zet die terug bij `astro:after-swap`. Gemeten over een navigatie: 8316 ms voor, 9332 ms na, dus de animatie loopt door.
3. **Zes aanraakdoelen van 44 px passen niet op een liggende telefoon.** Het menu werd 514 px hoog in een scherm van 390 px. Onder 30 rem hoogte staat de lijst daarom in twee kolommen: 334 px hoog, met 72 px over.

De middelste rij heeft een eigen naam per route (`statement`, `binnenkort`, `verdwaald`) in plaats van één gedeelde naam. Met dezelfde naam zou de view transition de twee rijen aan elkaar koppelen en hun verschil in hoogte wegvervormen; met eigen namen loopt de oude rij alleen uit en de nieuwe alleen in, zoals rule 70 vraagt.

Geen verticale of horizontale overloop op de negen formaten uit de testmatrix, voor de voorpagina en voor een sectiepagina:

| Formaat     | Voorpagina, ruimte onder de microregel | Sectiepagina |
| ----------- | -------------------------------------- | ------------ |
| 320 × 568   | 16 px                                  | 16 px        |
| 360 × 640   | 16 px                                  | 16 px        |
| 390 × 844   | 16 px                                  | 16 px        |
| 768 × 1024  | 27 px                                  | 27 px        |
| 1024 × 768  | 31 px                                  | 31 px        |
| 1280 × 720  | 36 px                                  | 36 px        |
| 1440 × 900  | 39 px                                  | 39 px        |
| 1920 × 1080 | 40 px                                  | 40 px        |
| 844 × 390   | 16 px                                  | 21 px        |

Het geopende menu past ook: 514 px bij 320 × 568 met 70 px over, en 334 px in twee kolommen bij 844 × 390 met 72 px over. Niets scrollt.

JavaScript in de productiebuild: één bestand van 16.357 bytes, gecomprimeerd 5591 bytes. Dat is de router van Astro met `menu.ts` en `paginaovergang.ts` erin, ruim onder de 15 kB. Daarnaast twee inline scripts: de `data-js`-vlag en de klok van vijftien regels.

Verder gecontroleerd in de preview: de haarlijn staat onder het juiste item en schuift mee bij navigatie, de klok loopt door over een paginawissel (hetzelfde element, één interval, `data-gekoppeld`), de zes secties geven `noindex, follow` en de voorpagina `index, follow`, JSON-LD staat alleen op de voorpagina, het menu zet `inert` op `main` en `footer` en geeft de focus aan het eerste item en bij sluiten terug aan de knop. Bij `prefers-reduced-motion: reduce` blijven alleen elf opacity-fades van 200 ms over, zonder ambient licht en zonder trap. Zonder `data-js` draait geen enkele animatie en staat alles op opacity 1.

Escape en een klik naast de lijst zijn gedragingen van de popover zelf; die heb ik niet met een synthetische toets kunnen aantonen, omdat een nagebootste toetsaanslag de close watcher van de browser niet opent. Het sluiten via de knop en via `hidePopover()` is wel gecontroleerd, inclusief focus en `inert`.

### Twee opmerkingen, geen vraag

De beeldaanvulling staat niet op `main`: de homepage heeft nu geen diptiek en geen enkel beeld. "Geen beelden op de sectiepagina's" is daarmee vanzelf waar, en ik laat de homepage beeldloos zoals hij is.

Het menu leunt op de Popover API, die zonder JavaScript opent en sluit. Een browser die `popover` niet kent, negeert het attribuut: het menu staat dan als gewone lijst in de pagina in plaats van fullscreen. De links blijven bereikbaar, maar de koprij is op zo'n browser hoger dan één regel. Dat raakt Safari voor 17 en Firefox voor 125.

## Diptiek: audit voor de bouw

Hieronder staat wat de bouw van het beeldpaar wordt: twee foto's op `/`, het dressoir groot en de boomstamplanken klein, met `Beeld.astro` als het beeldcomponent dat de volledige site straks hergebruikt. Er staat nog geen foto in de repository en er is nog geen regel code aangepast; dit is de audit die volgens de opdracht aan de bouw voorafgaat.

### Wat de aangeleverde bestanden toelaten

Beide foto's kwamen binnen op 1024 px aan de lange zijde. De opdracht vraagt minimaal 2400 px, `docs/FOTOGRAFIE.md` vraagt 3000 px.

| Bestand  | Aangeleverd | Grootste uitsnede op maat           | Gevraagde grootste variant |
| -------- | ----------- | ----------------------------------- | -------------------------- |
| Dressoir | 1024 × 768  | 4:5 wordt 614 × 768, 3:2 1024 × 683 | 4:5 op 1280 × 1600         |
| Planken  | 1024 × 683  | 1:1 wordt 683 × 683                 | 1:1 op 480 × 480           |

De planken halen dat ruim: `position: 'attention'` legt het gelaagde schorsprofiel centraal in het vierkant en 683 px dekt een slot van 180 px breed tot ver voorbij twee keer de pixeldichtheid.

Het dressoir niet. Een 4:5-uitsnede uit een liggende foto is 614 px breed, terwijl het dressoir zelf 635 px van de 1024 px inneemt. Alle drie de uitsnedes verliezen daarmee iets wat de opdracht wil behouden:

- `attention` houdt de hand met de schaal vast en snijdt de rechterkant van het dressoir af, inclusief de tweede greep. De man staat er daarna voor driekwart op, zonder hoofd.
- `centre` snijdt het dressoir aan beide kanten af en laat links een losse arm in beeld staan.
- `right` geeft het rustigste beeld, maar zonder de hand en met het linkerdeel van het dressoir buiten het kader.

Een 3:2-uitsnede verliest niets: het hele dressoir, de hand met de schaal en de wand erachter passen, en het bestand is dan precies groot genoeg voor de grootste gevraagde mobiele variant. Ook het OG-beeld van 1200 × 630 vraagt meer dan er is; uit 1024 px wordt dat 1,17 keer opschalen.

### Layout per viewport

Het één-scherm-principe blijft de bovengrens. `basis.css` zet `overflow: hidden` op `html` en `body`, dus een scrollbar kan niet verschijnen; het risico is afgesneden content. Daarom verdwijnt een beeld zodra de hoogte het niet meer draagt.

| Viewport    | Dressoir                      | Planken | Contactrij    |
| ----------- | ----------------------------- | ------- | ------------- |
| 320 × 568   | niet aanwezig                 | nee     | onder elkaar  |
| 360 × 640   | niet aanwezig                 | nee     | twee kolommen |
| 390 × 844   | band volle breedte, 3:2, 28vh | nee     | twee kolommen |
| 768 × 1024  | band volle breedte, 3:2, 32vh | nee     | twee kolommen |
| 844 × 390   | niet aanwezig                 | nee     | twee kolommen |
| 1024 × 768  | rechterkolom, kolom 9 t/m 12  | nee     | drie kolommen |
| 1280 × 720  | rechterkolom                  | nee     | drie kolommen |
| 1440 × 900  | rechterkolom                  | ja      | drie kolommen |
| 1920 × 1080 | rechterkolom                  | ja      | drie kolommen |

De drempels: de beeldband vanaf 740 px hoogte, de rechterkolom vanaf 1024 px breedte, de planken vanaf 1024 bij 820 px. Daaronder is de pagina precies wat hij nu is.

De middelste rij wordt op desktop een genest raster van twaalf kolommen met rijen `auto 1fr auto`. Kop en intro komen op kolom 2 t/m 7, het dressoir op kolom 9 t/m 12 over alle drie de rijen. De kop moet dan op de helft van de breedte nog op twee regels staan: de cap gaat van 7,4 cqi naar ongeveer 4,4 cqi, gemeten per formaat. Het lichtvlak zit in `LichtAchtergrond` op `z-index: -1` en kan dus niet over een beeld heen vallen.

Op mobiel schuift de contactrij naar twee kolommen zonder extra `div`: de drie bestaande blokken worden geplaatst met `grid-column` en `grid-row`, waarbij "Bespreek je idee" rechts over twee rijen staat. De DOM-volgorde blijft gelijk aan de leesvolgorde, dus de tabvolgorde verandert niet.

### Bestanden

Nieuw: `src/components/Beeld.astro`, `src/lib/beeld.ts` (de bronnen van één beeld, zodat de preload en het component dezelfde varianten gebruiken), `src/assets/beelden/coming-soon/dressoir.jpg`, `src/assets/beelden/coming-soon/planken.jpg`, `tokens/componenten/beeld.json`.

Gewijzigd: `src/pages/index.astro`, `src/styles/beweging.css` (gordijn en de twee bijschriftfades), `src/layouts/Basis.astro` (optionele preload in `<head>`), `src/lib/jsonld.ts` (`image` wordt een lijst), `scripts/maak-og.mjs` (OG uit het dressoir), `public/og.png`, `tokens/componenten/binnenkomst.json`, `tokens/componenten/statement.json`, `.cursor/rules/41-woordenlijst.mdc` en de twee gegenereerde tokenbestanden.

### Tokens

Componenten, in een nieuw `beeld.json`: `beeld.marge` (`ruimte.6`, boven en onder het grote beeld in de rechterkolom), `beeld.afstand-haarlijn` (`ruimte.8`, tussen de planken en de haarlijn), `beeld.band-hoogte` (28vh) en `beeld.band-hoogte-breed` (32vh), `beeld.kwaliteit-avif` (55) en `beeld.kwaliteit-webp` (72).

In `binnenkomst.json` komen vier vertragingen bij: `beeld-groot` (300 ms), `bijschrift-groot` (450 ms), `beeld-klein` (450 ms) en `bijschrift-klein` (600 ms). In `statement.json` komt `cap-naast-beeld`. Nieuwe primitieven zijn niet nodig: `verhouding.*`, `beweging.afstand.masker`, `beweging.schaal.onthul`, `beweging.binnenkomst-beeld` en `beweging.hover-beeld` staan er al, en het bijschrift gebruikt de bestaande `bijschrift.*`.

### Afwijkingen die ik wil maken

1. **Het gordijn volgt `70-motion.mdc`, niet de prompt.** De regel beschrijft `clip-path` van `inset(0 0 var(--k-beweging-afstand-masker) 0)` naar `inset(0)`, de prompt noemt `inset(100% 0 0 0)`. Ik houd de regel aan, want die waarde staat als token vast en de rules gelden onverkort. Het beeld onthult daarmee van boven naar onder.
2. **Geen `.contact-kolom`.** De twee kolommen op mobiel lukken met rasterplaatsing op de bestaande blokken. Een wikkelende `div` zou alleen bestaan om een kolom te maken, en `40-clean-code.mdc` regel 27 verbiedt dat. De class komt dus niet in de woordenlijst.
3. **De preload staat in `Basis.astro`.** Een component in de `body` kan niets aan `<head>` toevoegen. `Beeld.astro` zet daarom zelf `loading="eager"`, `fetchpriority="high"` en `decoding="async"`, en de pagina geeft de AVIF-srcset van het dressoir aan de layout mee.
4. **Geen `beweringen[]` op deze branch.** De contentcollecties staan op `feature/volledige-site`; hier bestaat alleen `instellingen`. Met de neutrale fallbacks ("Dressoir, uit de werkplaats" en "Boomstamplanken") staat er ook geen bewering in de bijschriften. Vult Rik of Thomas wel een titel, materiaal of jaar in, dan is dat een bewering en hoort die in `site.json` tot de volledige site terug is.

### Stand van zaken

De drie vragen hieronder zijn beantwoord: beide foto's mogen op kolling.nl, er komt geen ruimer origineel, en het dressoir krijgt daarom 3:2 in de rechterkolom in plaats van 4:5. Daarmee zijn `Beeld.astro`, `src/lib/beeld.ts`, `tokens/componenten/beeld.json`, het gordijn in `beweging.css` en de beeldenlijst in `maakLocalBusiness` gebouwd.

Die bouw is daarna uit deze werkmap gehaald en wacht op de header met navigatie en menu, omdat beide op hetzelfde moment aan `index.astro`, `Basis.astro`, `beweging.css` en de binnenkomsttokens werkten. Zodra de header staat, komt de diptiek er op het nieuwe `index.astro` bij. Wat dan nog moet: de layout per viewport, het OG-beeld uit het dressoir, de woordenlijst en de controle op de negen formaten.

Twee dingen om bij die hervatting mee te nemen. De choreografie rekent nu met `--onthul-weging` als vermenigvuldiger op de vertraging; de vertragingen van de beelden horen dat te volgen. En de contactrij is naar `Contactrij.astro` verhuisd, dus de twee kolommen op mobiel horen daar thuis en niet meer in de pagina.

### Drie vragen, en dan bouw ik af

1. **Zijn beide foto's eigen beeld van Kolling, en mogen ze op kolling.nl staan?** Het dressoirbestand heet `wood_example` en het staat in een gestileerde studio-opstelling met objecten die niet van Kolling lijken. Zonder een expliciet ja gaat geen van de twee de repository in; dat is de reden dat ze er nu nog niet staan.
2. **Komt er een origineel van minimaal 2400 px, en van het dressoir bij voorkeur ruimer gefotografeerd?** Met het huidige bestand is de rechterkolom op een 1440-breed scherm ongeveer 340 px breed en haalt 614 px net geen twee keer de pixeldichtheid. Met een ruimer origineel klopt zowel de uitsnede als de scherpte, en dan kan het OG-beeld zonder opschalen.
3. **Als er geen ruimer origineel komt: 3:2 in de rechterkolom in plaats van 4:5?** Dan staat het hele dressoir in beeld, blijft de hand met de schaal erbij en is het bestand groot genoeg. Het beeld wordt lager dan de kolom hoog is, dus het staat onderaan uitgelijnd met het statement ernaast. Het alternatief is 4:5 met `position: 'right'`: strakker van vorm, maar met een half dressoir en zonder de hand.

## Wat open staat

1. **Woordmerk als SVG.** Het huidige `d-logo.svg` is een export met een ingesloten bitmap van 1065 px breed en een luminantiemasker. `pnpm og` rendert daaruit `woordmerk.png` op 480 px, het OG-beeld en het favicon. Een echte outline-SVG maakt die stap onnodig en is scherper op elk formaat.
2. **KvK-nummer.** Nog `[VUL IN]` in `site.json`. De microregel voegt het er zelf bij zodra het bekend is.
3. **Licentiefonts.** Mint Grotesk en Apercu vervangen Instrument Sans en Work Sans met één tokenwijziging plus twee bestanden in `public/fonts`. De metrische correcties op de terugvalstack horen dan opnieuw bepaald te worden.
4. **Lighthouse.** Meten op de productie-URL, volgens `docs/DEPLOY.md`.
