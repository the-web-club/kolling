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

### De drie antwoorden

Beide foto's zijn eigen beeld van Kolling en mogen op kolling.nl staan. Er komt geen ruimer origineel. Het dressoir staat daarom in 3:2 in de rechterkolom in plaats van 4:5: het hele meubel in beeld, de hand met de schaal erbij, en het bestand precies groot genoeg voor de grootste variant.

### Gebouwd

`Beeld.astro` is het enige beeldcomponent van de site. Het maakt per beeld een `<picture>` met AVIF en WebP en een JPEG in de `<img>`, met `width`, `height` en `aspect-ratio` uit de tokens, zodat er geen layout shift is. De uitsnede gebeurt bij de build met `fit: 'cover'` en een `positie`; die zijde staat ook als `object-position` op de afbeelding, zodat de browser verder snijdt aan dezelfde kant als de build. Is `verhoudingMobiel` gezet, dan staan de desktopbronnen vooraan achter `media="(min-width: 64rem)"` en downloadt de browser nooit twee uitsnedes. Dat pad is apart gecontroleerd in de build: vier `<source>`-elementen, de eerste twee met media, plus de JPEG-terugval.

`src/lib/beeld.ts` levert de bronnen. De verhouding komt uit `beeld.verhouding-*`, zodat de uitsnede bij de build en de `aspect-ratio` in de CSS niet uit elkaar kunnen lopen.

De uitsnede van het dressoir is `bottom`: dat houdt het hele meubel met poten en vloer in beeld. `attention` en `centre` sneden de poten eraf. De planken staan op `attention`, wat het gelaagde schorsprofiel centraal in het vierkant legt.

### Layout per viewport

Het één-scherm-principe blijft de bovengrens. `basis.css` zet `overflow: hidden` op `html` en `body`, dus een scrollbar kan niet verschijnen; het risico is afgesneden content. Gemeten in de preview, met de ruimte tussen de microregel en de onderrand:

| Formaat     | Dressoir        | Planken   | Onder de microregel |
| ----------- | --------------- | --------- | ------------------- |
| 320 × 568   | niet aanwezig   | nee       | 16 px               |
| 360 × 640   | niet aanwezig   | nee       | 16 px               |
| 390 × 844   | band 358 × 219  | nee       | 16 px               |
| 768 × 1024  | band 715 × 328  | nee       | 27 px               |
| 844 × 390   | niet aanwezig   | nee       | 16 px               |
| 1024 × 768  | kolom 300 × 200 | nee       | 31 px               |
| 1280 × 720  | kolom 379 × 245 | nee       | 36 px               |
| 1440 × 900  | kolom 428 × 286 | 208 × 208 | 39 px               |
| 1920 × 1080 | kolom 427 × 284 | 207 × 207 | 40 px               |

Vanaf 64 rem is de middelste rij een genest raster van twaalf kolommen met rijen `auto 1fr auto`. De kop staat op kolom 2 t/m 7 met een cap van 4,4 cqi, de intro eronder op 36 tekens breed, het dressoir op kolom 9 t/m 12 over alle drie de rijen en onderaan uitgelijnd. De planken staan op kolom 2 en 3 met hun bijschrift op 4 en 5; die figuur is een subgrid, zodat beide randen op een rasterlijn vallen. De bijschriften van de twee beelden eindigen daarmee op dezelfde regel, 32 px boven de haarlijn. Het lichtvlak zit in `LichtAchtergrond` op `z-index: -1` en kan niet over een beeld heen vallen.

Tot 64 rem is het dressoir een band over de volle breedte tussen de koprij en het statement. Die band krijgt de hoogte die na kop en intro overblijft, met `beeld.band-hoogte` als bovengrens; de kleinste van de drie grenzen wint. Daarmee kan de band de pagina niet langer maken dan het scherm, hoe vaak de tekst ook afbreekt.

De contactrij staat van 360 tot 768 px in twee kolommen, zonder extra `div`: de drie bestaande blokken zijn geplaatst met `grid-column` en `grid-row`, waarbij "Bespreek je idee" rechts over twee rijen staat. De DOM-volgorde blijft de leesvolgorde, dus de tabvolgorde verandert niet.

### Drie dingen bleken anders dan gepland

1. **De drempel van 740 px uit de opdracht klopt niet meer.** Met de koprij, de menuknop en vier contactlinks liep de pagina bij 360 × 740 nog 96 px over. In plaats van die drempel op te schroeven krijgt de band nu de hoogte die overblijft. Hij verdwijnt onder 780 px hoogte, waar er te weinig overblijft voor een band die nog een meubel laat zien; bij 360 × 780 is hij 120 px hoog en past de pagina met 16 px over.
2. **Een kader dat krimpt vraagt drie correcties.** `aspect-ratio` met een begrensde hoogte laat een rasteritem ook in de breedte krimpen, dus staat de breedte van het kader expliciet op 100%. En de automatische minimumhoogte van een rasteritem houdt zo'n kader op zijn volle maat; zowel het statement als de figuur en het kader hebben daarom `min-block-size: 0`.
3. **De planken halen de 1600 ms net niet met 450 ms vertraging.** Hun gordijn zou dan op 1650 ms eindigen. De vertraging is 400 ms geworden, waarmee de hele choreografie op 1600 ms sluit, gelijk met de haarlijn en met `beweging.duur.hero`.

De vertragingen, gemeten op de computed styles: dressoir 300 ms, zijn bijschrift 450 ms, planken 400 ms, hun bijschrift 550 ms, en daarna onveranderd intro 500 ms, haarlijn 700 ms en microregel 1000 ms. Bij `prefers-reduced-motion: reduce` blijven de beelden en bijschriften over met één fade van 200 ms, zonder clip, zonder schaal en zonder vertraging.

### Gemeten gewicht

Per viewport downloadt de pagina precies één variant van elk beeld, in AVIF. Op een telefoon wordt de planken-afbeelding niet opgehaald: het beeld staat op `display: none` en `loading="lazy"`, en dat samen houdt het verzoek tegen.

| Variant       | 320   | 480   | 768   | 1024  |
| ------------- | ----- | ----- | ----- | ----- |
| dressoir AVIF |       | 10 kB | 18 kB | 27 kB |
| planken AVIF  | 24 kB | 44 kB |       |       |

Het hele kritieke pad, ongecomprimeerd: HTML 15,9 kB, twee stylesheets 47,6 kB, de router 16 kB, twee fonts 78,5 kB, woordmerk 2,7 kB, dressoir 26,8 kB en op desktop de planken 44,4 kB. Samen 231,8 kB op desktop en 187,3 kB op een telefoon, onder de 500 kB. Het dressoir is het LCP-element, met een preload in de `<head>` en `fetchpriority="high"`.

### Afwijkingen van de opdracht

1. **Het gordijn volgt `70-motion.mdc`, niet de prompt.** De regel beschrijft `clip-path` van `inset(0 0 var(--k-beweging-afstand-masker) 0)` naar `inset(0)`, de prompt noemt `inset(100% 0 0 0)`. De regel is aangehouden, want die waarde staat als token vast. Het beeld onthult van boven naar onder.
2. **Geen `.contact-kolom`.** De twee kolommen lukken met rasterplaatsing op de bestaande blokken. Een wikkelende `div` zou alleen bestaan om een kolom te maken, en `40-clean-code.mdc` regel 27 verbiedt dat.
3. **De preload staat in `Basis.astro`.** Een component in de `body` kan niets aan `<head>` toevoegen. `Beeld.astro` zet zelf `loading="eager"`, `fetchpriority="high"` en `decoding="async"`; de pagina geeft de AVIF-srcset van het dressoir aan de layout mee.
4. **De planken staan op `loading="lazy"`.** De opdracht verbood dat omdat het beeld boven de vouw staat, maar het bestaat alleen vanaf 1024 bij 820 px. Met lazy slaat een telefoon het verzoek over; op een scherm waar het beeld wél staat, laadt de browser het direct mee.
5. **Geen `overgangsnaam`-prop.** Paginaovergangen lopen nu via de middelste rij; een tweede naam op een beeld zou niets doen. De prop komt erbij zodra er een pagina is waar een beeld naar een andere pagina meeverhuist.
6. **Geen kwaliteit in tokens.** AVIF 55, WebP 72 en JPEG 78 staan als constante in `src/lib/beeld.ts`. Een compressiegetal is geen ontwerpwaarde en is in CSS nooit nodig.
7. **`public/og.png` wordt `public/og.jpg`.** Het OG-beeld is nu een foto; als PNG was het 1,1 MB, als JPEG 80 kB.
8. **Geen `beweringen[]` op deze branch.** Er bestaat alleen de collectie `instellingen`. Met de neutrale fallbacks staat er ook geen bewering in de bijschriften.
9. **De uitsnede is 3:2 in plaats van 4:5, en de contactrij in twee kolommen geldt ook op de sectiepagina's**, omdat `Contactrij.astro` door alle pagina's wordt gedeeld.

### Wat Rik of Thomas nog kan aanleveren

1. **Bijschriften.** Nu staan de neutrale fallbacks "Dressoir, uit de werkplaats" en "Boomstamplanken". Een titel, materiaal en jaar mogen erin zodra ze bevestigd zijn; het bijschrift splitst op de eerste komma, dus "Dressoir, es, 2026" wordt een kapitaaltitel met een gedempte toelichting.
2. **Een ruimer origineel.** Op 1024 px aan de lange zijde haalt het dressoir in de rechterkolom ongeveer 1,8 keer de pixeldichtheid in plaats van 2, en het OG-beeld wordt 1,17 keer opgeschaald. Met een bestand van 2400 px of meer vervalt dat allebei, zonder dat er iets aan de code verandert.

## Licht en donker: audit voor de bouw

Vooronderzoek voor het donkere thema en de schakelaar in de kop. Er is nog geen regel code gewijzigd. Het werk staat klaar op `feature/thema`: er is geen pull request open en `main` bevat de diptiek al, dus de vorige branch is geen plek om op verder te bouwen.

Hieronder de tokenaanpak, de gemeten contrasten, de plek van de schakelaar en wat de bouw aan bestaande bestanden raakt. Daarna drie vragen die eerst een antwoord nodig hebben.

### Tokenaanpak

`tokens.css` krijgt drie blokken in deze volgorde:

```css
:root {
  /* primitieven, lichte semantiek, componenten */
}
:root[data-thema='donker'] {
  /* donkere semantiek */
}
@media (prefers-color-scheme: dark) {
  :root:not([data-thema='licht']) {
    /* dezelfde donkere semantiek */
  }
}
```

De `selector`-optie van `css/variables` accepteert een array en nest die van buiten naar binnen, dus het mediablok komt uit de formatter zelf en niet uit een string met een handgeschreven accolade. Wat de formatter niet kan, is drie blokken in één bestand: dat is één bestand per `destination`. Een eigen format roept `css/variables` daarom drie keer aan met dezelfde dictionary, een andere tokenselectie en een andere selector, en zet de uitvoer achter elkaar. De verwijzingen blijven daarmee staan, dus in de browser lees je `--kleur-achtergrond: var(--k-kleur-nacht-900)`.

De donkere waarden staan één keer in de bron, in `tokens/semantisch/donker.json`.

Eén afwijking van de opdracht is onvermijdelijk: dat bestand kan niet dezelfde tokenpaden gebruiken als `tokens/semantisch/kleur.json`. Twee bestanden die beide `kleur.achtergrond` definiëren, zijn voor Style Dictionary een botsing en de laatste wint. Alles in `donker.json` nest daarom onder één sleutel `donker`, en het CSS-format laat die sleutel bij het schrijven weg. De variabelenamen in de drie blokken zijn daarmee exact gelijk, zoals de opdracht vraagt. In `tokens.gegenereerd.ts` blijft het pad wel `donker.kleur.achtergrond`, zodat de namen uniek blijven en `src/lib/beeld.ts` zijn verhoudingstoken nog ondubbelzinnig kan vinden.

Drie dingen die per thema wisselen zijn geen kleur:

| Token            | Licht    | Donker | Waarvoor                               |
| ---------------- | -------- | ------ | -------------------------------------- |
| `dekking.beeld`  | 1        | 0,94   | `beeld.dimmen`, het kader van een foto |
| `dekking.korrel` | 0,035    | 0,05   | de korrel in `LichtAchtergrond`        |
| `menging.korrel` | multiply | screen | dezelfde korrel, `mix-blend-mode`      |

Ze horen in de semantische laag, want alleen die laag wisselt per thema; een componenttoken kan dat niet. Ze staan in `tokens/semantisch/dekking.json` en `beeld.dimmen` verwijst ernaar.

`color-scheme` wordt ook een token: `kleur.schema` met de waarden `light` en `dark`, en `basis.css` zet `color-scheme: var(--kleur-schema)`. Zo staat er geen handgeschreven declaratie in een gegenereerd bestand.

`kleur.licht.warm` en `kleur.licht.koel` worden `kleur.licht.vlak` en `kleur.licht.schaduw`. De lichte waarden blijven `hout.es.200` en `lijn.200`, dus het lichte thema verschuift geen tint; alleen de naam zegt nu wat de laag doet in plaats van welke kant hij op kleurt.

Tot slot twee tokens die niemand verwacht in een kleurensysteem: `zicht.licht` en `zicht.donker`, met als waarde het `display`-sleutelwoord van de variant die bij het thema hoort. Twee plekken hebben een variant per thema die geen kleur is maar een element: het woordmerk, dat als PNG uit twee bestanden bestaat, en het woord op de schakelaar. Zonder deze tokens zou elk van die twee componenten de hele drieblokkenlogica met de hand nabouwen, inclusief de media query. Met deze tokens blijft het bij `display: var(--zicht-donker)` en weet het component nog steeds niet welk thema actief is.

### Contrast gemeten

Berekend op de tokenwaarden met de relatieve luminantie uit WCAG 2.1, niet geschat uit een schermafbeelding.

| Paar                                  | Licht | Donker | Eis         |
| ------------------------------------- | ----- | ------ | ----------- |
| voorgrond op achtergrond              | 16,53 | 14,45  | 12:1        |
| voorgrond op achtergrond-tint         | 15,41 | 13,58  | 12:1        |
| voorgrond op achtergrond-verhoogd     | 17,39 | 12,70  | 12:1        |
| voorgrond-gedempt op achtergrond      | 8,67  | 7,62   | 7:1         |
| voorgrond-subtiel op achtergrond      | 2,79  | 3,82   | zie vraag 2 |
| fout op achtergrond                   | 6,29  | 5,73   | 4,5:1       |
| lijn op achtergrond                   | 1,25  | 1,41   | stil        |
| lijn-sterk op achtergrond (focusring) | 16,53 | 14,45  | 3:1         |

De haarlijn komt in beide thema's op dezelfde sterkte uit: zichtbaar als scheiding, nooit als streep die aandacht vraagt. De focusring en de rand van de schijf op de schakelaar gebruiken daarom niet `kleur.lijn` maar `kleur.lijn-sterk` respectievelijk `kleur.voorgrond`, want 1,25:1 haalt de 3:1 voor interactieve randen niet.

De drie houttinten blijven hout: `es.300` komt op 9,36 tegen de nachtachtergrond, `eik.400` op 7,12 en `noten.600` op 2,61. Dat laatste is prima voor een vlak en onbruikbaar voor tekst; plaatshouders met een label komen pas terug met de volledige site. Om dezelfde reden is `kleur.accent` in het donker `papier.100` en niet een houttint: noten op nacht leest niet. `accent` wordt op deze branch nergens gebruikt.

### Plek van de schakelaar

| Breedte        | Links     | Midden                 | Rechts                    |
| -------------- | --------- | ---------------------- | ------------------------- |
| 1024 en breder | woordmerk | navigatie, gecentreerd | klok, dan schakelaar      |
| 360 tot 1024   | woordmerk | klok                   | schakelaar, dan knop Menu |
| onder 360      | woordmerk | leeg                   | schakelaar, dan knop Menu |

De koprij gaat van drie naar vier cellen. De navigatie staat nu exact in het midden omdat de twee buitenste kolommen beide `1fr` zijn; met twee elementen rechts klopt die symmetrie niet meer. De navigatie krijgt daarom `grid-column: 1 / -1` met `justify-self: center`, wat haar op het midden van het raster houdt los van wat er links en rechts staat. De volgorde in de HTML blijft gelijk aan de volgorde op het scherm: woordmerk, navigatie, klok, schakelaar, knop. Het toetsenbord hoeft nergens terug te springen.

De klok verdwijnt onder 360 px zoals nu; de schakelaar blijft. In het geopende menu staat een tweede schakelaar als laatste item in `.menu-voet`, naast het telefoonnummer en Instagram, in tekstvorm zonder schijf.

De vorm: een `<button type="button">` met een schijf van 10 px en vanaf 48 rem het woord van het thema waar je naartoe schakelt. De maat van de schijf staat als `schakelaar.schijf-maat` op `0.625rem`, een rauwe waarde in de componentlaag zoals `merk.hoogte` en `navigatie.aanraakdoel` dat al zijn: de ruimteschaal heeft een stap van 8 en van 12 px, geen 10. Het aanraakdoel van 44 px komt uit verticale padding met een even grote negatieve marge, dezelfde truc als bij de knop Menu, zodat de koprij niet hoger wordt. Bij hover gaat de schijf naar `voorgrond-gedempt` en tekent de onderstreping onder het woord in, beide over 150 ms. De toegankelijke naam is vast: `aria-label="Donker thema"`, met `aria-pressed` op het donkere thema. Zonder JavaScript staat de schakelaar op `display: none` en regelt de media query het thema.

### Scripts

Het inline script in de `<head>` wordt er één, van vijf regels: `data-js` zetten, de opgeslagen keuze lezen, en alleen bij `licht` of `donker` het attribuut zetten. Het staat in een blok, want een `const` op het hoogste niveau van een script dat opnieuw draait, is een `SyntaxError`. Het krijgt `data-astro-rerun`, waarmee de router het bij elke wissel opnieuw uitvoert. Dat moet, want `swapRootAttributes` verwijdert eerst alle attributen van `<html>` en zet daarna die van het nieuwe document terug.

Dat laatste bracht een bestaande fout boven. `data-js` overleeft een client-side navigatie nu niet. Gemeten in de preview: na een klik op "Over" houdt `<html>` alleen `lang` en `data-overgang` over, en `[data-onthul="omhoog"]` komt op `animation-name: none`. De choreografie draait dus alleen op de eerste pagina die je laadt, en de halvering via `data-overgang` heeft sinds de header nooit iets kunnen doen. Niets is kapot voor een bezoeker, want zonder `data-js` staat alles op zijn plek en op opacity 1. Het samenvoegen van de twee scripts repareert het en bewijst zichzelf: na de bouw hoort de binnenkomst ook op een sectiepagina te lopen, in de halve maat.

`src/lib/thema.ts` koppelt beide schakelaars op `astro:page-load` en werkt de stand ook bij op `astro:after-swap`, zodat er geen frame met het verkeerde woord tussendoor komt. Klikken gaat via `document.startViewTransition` als die API bestaat en reduced motion uit staat, met de crossfade van 400 ms achter een attribuut op `<html>`; zonder dat attribuut raakt de duur de paginaovergang niet. De achtergrondkleur voor `meta[name="theme-color"]` komt uit `getComputedStyle` van `--kleur-achtergrond`, zodat er geen hexwaarde in TypeScript staat. Er blijven twee metatags met `media` voor het geval zonder keuze; bij een handmatige keuze krijgen ze beide de kleur van het gekozen thema, want anders zou de browser bij een tegengestelde systeemvoorkeur de verkeerde pakken.

### Wat de bouw aan bestaande bestanden raakt

1. **`Beeld.astro`** krijgt `opacity: var(--beeld-dimmen)` op het kader en 1 bij hover. Dat is de enige component die iets nieuws doet voor het donker, en hij doet het via een token: in het licht is de waarde 1, dus er verandert niets.
2. **`LichtAchtergrond.astro`** wisselt naar `kleur.licht.vlak` en `kleur.licht.schaduw` en haalt de dekking en de menging van de korrel uit tokens. De animaties blijven ongemoeid, dus een themawissel kan ze niet herstarten; er verandert alleen een kleurwaarde.
3. **`basis.css`**: `color-scheme` uit een token, `::selection` uit `kleur.selectie.*`. `@theme inline` blijft zoals het is, want dat mapt al op de semantische laag.
4. **`PaginaKop.astro`** en **`Menu.astro`**: de schakelaar en het tweede woordmerk.
5. **`Basis.astro`**: het samengevoegde script, twee themakleurtags en een tweede icoonlink.
6. **`scripts/maak-og.mjs`**: het lichte woordmerk en een licht favicon. `og.jpg` blijft de lichte versie.
7. **`menu.achtergrond`** blijft naar `kleur.achtergrond-verhoogd` wijzen en niet naar `kleur.achtergrond` zoals de opdracht zegt. De popover volgt het thema via die token net zo goed, en de opdracht vraagt ook dat het lichte thema niet verschuift; omzetten zou het witte vlak van de popover naar het warme wit van de pagina trekken.
8. **Het favicon** kan niet worden wat de opdracht vraagt. Er is geen `favicon.svg` meer: die is er bewust uit gegaan omdat het logo een ingesloten bitmap van 54 kB is en `00-project.mdc` hertekenen verbiedt. Het voorstel is `public/favicon-licht.png` erbij en twee icoonlinks met `media`. Chrome kiest daarmee het juiste beeld; Firefox negeert `media` op een icoonlink, dus daar blijft het donkere monogram op een donkere balk staan, net als nu.
9. **De selectiekleur in het licht** gaat van `papier.0` naar `papier.50` omdat de opdracht `kleur.selectie.voorgrond` daar op zet. Dat is het verschil tussen `#ffffff` en `#faf9f7` in een selectie; ik volg de opdracht en noem het hier omdat het strikt gezien een wijziging in het lichte thema is.

### Drie vragen

1. **Het witte woordmerk botst met de merkregel.** `00-project.mdc` en `docs/DESIGN-SYSTEM.md` zeggen: één logo, zwart op transparant, uitsluitend op lichte achtergronden, niet inverteren of herkleuren, en daarom heeft de site geen donkere logoplaatsingen. Een donker thema kan niet zonder die plaatsing. Het beloofde bestand `woordmerk-licht.png` staat niet in de repository. Ik kan het zelf maken: `pnpm og` haalt het woordmerk uit het luminantiemasker in `d-logo.svg` en zet er inkt achter, dus een tweede render in `papier.100` levert hetzelfde beeld in de lichte tint. Technisch is dat het witte origineel; formeel is het een herkleuring. Mijn voorstel is die render te gebruiken en de merkregel uit te breiden met een benoemde variant voor donkere vlakken, tot het officiële bestand er is. Akkoord, of lever je het witte bestand aan? De invert-truc uit de opdracht wil ik niet: op een transparante PNG keert die ook de alpharand om en geeft hij een grijze zoom.
2. **`voorgrond-subtiel` haalt 4,5:1 in geen van beide thema's.** De opdracht noemt die token decoratief, maar hij kleurt nu drie koppen in de contactrij (`<h2>` Werkplaats, Bespreek je idee, Volg het werk), de titels van de bijschriften en de microregel. Dat is gewone tekst, en 2,79 in het licht is te weinig. Drie uitwegen: zo laten en het hier vastleggen als bewuste uitzondering; de koppen en bijschrifttitels naar `voorgrond-gedempt` tillen, wat 8,67 en 7,62 geeft maar het lichte ontwerp donkerder maakt; of in het donker `steen.400` gebruiken in plaats van `steen.500`, wat daar 5,54 oplevert en het lichte thema ongemoeid laat. Mijn voorstel is de tweede, omdat een kop die je niet leest geen kop is. De opdracht zegt echter dat het lichte thema exact blijft, dus dit is jouw keuze.
3. **Waar landt dit en wie opent de pull request?** Er staat geen pull request open, dus ik werk op `feature/thema`. De `gh`-CLI is hier niet ingelogd, dus ik kan de pull request en de schermafbeeldingen niet zelf plaatsen. Ik kan de branch pushen en de tekst voor de pull request klaarzetten, of het werk net als de vorige drie keer rechtstreeks op `main` zetten. Wat wil je?

### De antwoorden

De bouw wacht op de sticky koprij die nu onder handen is. Die vervangt het raster, `merk.hoogte` en de tokens waar de schakelaar in gaat staan, dus de headerindeling hierboven wordt opnieuw opgemeten zodra dat werk staat. Het thema landt daarna rechtstreeks op `main`.

Het woordmerk krijgt voorlopig `filter: invert(1)` op het zwarte PNG, uitsluitend op het woordmerk zelf. Mijn waarschuwing bij vraag 1 was te zwaar: `invert()` keert de kleurkanalen om en laat alpha staan, dus zwarte inkt met een maskerrand wordt lichte inkt met dezelfde rand, zonder zoom. Wat blijft staan als open punt is dat de lichte tint daarmee `#ffffff` is en niet `papier.100`; zuiver wit is precies wat principe 4 niet wil. Een officieel wit bestand of een outline-SVG met `currentColor` haalt dat eruit.

`voorgrond-subtiel` gaat van de koppen af: de drie `<h2>` in de contactrij en de titels van de bijschriften krijgen `voorgrond-gedempt` (8,67 in het licht, 7,62 in het donker). De microregel houdt `voorgrond-subtiel`, want dat is de enige plek waar de token echt decoratief is. Het lichte thema wordt daarmee op twee plekken donkerder dan nu; dat is een bewuste wijziging en geen gevolg van het donkere thema.

## Sticky paginakop met gecentreerd woordmerk

De kop is nu `position: sticky` op elke breedte, draagt zelf zijn padding van `ruimte.5` boven en onder, en krijgt na acht pixels scrollen een dekkende band met haarlijn over de volle vensterbreedte. Gemeten kophoogte: 62 px onder 48 rem en 68 px daarboven, met het woordmerk op 22 respectievelijk 28 px en overal exact 20 px ruimte boven en onder. Gecontroleerd op 320 × 568, 390 × 844, 768 × 1024, 844 × 390, 1440 × 900 en 1920 × 1080: geen overloop, de linkerrand van het woordmerk op de containerrand en de klok op dezelfde rechterrand als de microregel. Het geopende menu zet het woordmerk op exact dezelfde plek, tot op de pixel.

`woordmerk.png` was 480 × 240 met de inkt op 449 × 212, negentien pixels van links en vijfentwintig van boven. Dat zette het woordmerk scheef in elk kader waarin het verticaal gecentreerd stond. `scripts/maak-og.mjs` snijdt de zwarte randen nu van het masker; het bestand is 480 × 225 en de inkt vult het geheel. Het OG-beeld en het favicon komen uit datzelfde masker en zijn mee opnieuw gegenereerd.

Afwijkingen van de opdracht:

1. **De token heet `kop.hoogte`, niet `maat.kop.hoogte`.** De `maat.*`-groep is semantisch en mag alleen naar primitieven verwijzen, terwijl de kophoogte uit `merk.hoogte` volgt. Als componenttoken blijft de hoogte vanzelf kloppen: `calc(var(--merk-hoogte) + var(--k-ruimte-5) * 2)`. Er zijn twee waarden nodig, want het woordmerk verspringt op 48 rem.
2. **De padding links en rechts blijft `pagina.padding`.** `maat.container-inline` is 76 rem, de tekstbreedte; als padding zou die het scherm vullen. Dezelfde afwijking als punt 1 hierboven, uit de eerste review.
3. **De rij is zo hoog als het woordmerk.** Het aanraakdoel van 44 px van de knop naar het menu zou de kop anders 84 px hoog maken. Het overschot valt nu gelijk verdeeld in de padding, waarmee het doel 44 px blijft en de kop zijn hoogte houdt.
4. **Het woordmerk is kleiner dan het was.** De inkt was 31 px op mobiel en 35 px op desktop; nu is dat 22 en 28 px, de maten uit de opdracht. Terug is één waarde in `merk.hoogte`.
5. **Geen `data-gescrold`-terugval.** Die vraagt een scroll-listener, en op deze branch kan geen enkele pagina scrollen. De terugval hoort bij de eerste pagina die dat wel doet. `animation-timeline: scroll(root)` zelf werkt in Chrome, Safari en Firefox.
6. **De animatie staat in longhands.** Als `animation`-shorthand plus `animation-timeline` voegt de minifier beide samen tot `animation: linear both kop-dekt scroll(root)`, en die regel kent de browser niet, waarna de band nooit verschijnt.
7. **De schakelaar staat in de voet, niet in de kop.** De sticky koprij blijft vier cellen. De knop zit op de regel van de microregel, links, met het woord van het thema waar je naartoe schakelt.
8. **Twee tokens vervallen.** `pagina.kopruimte-breed` gaf de kop op brede schermen extra ruimte eronder en gaat niet samen met gelijke padding boven en onder. `navigatie.laag` was ongebruikt en is opgevolgd door `kop.laag`.

## Thema gebouwd

De schakelaar staat in de voet. Zonder opgeslagen keuze volgt de pagina `prefers-color-scheme`; een klik bewaart `licht` of `donker` in `kolling-thema` en die keuze wint. Het inline script in de `<head>` zet het attribuut vóór de stylesheet en opnieuw op `astro:after-swap`. Daarmee is ook de bestaande fout weg waarbij `data-js` een client-side navigatie niet overleefde: na een klik op Over draait de binnenkomst weer, in de halve maat.

Gemeten in de preview: achtergrond `#20201f` en voorgrond `#f3f1ec` in het donker, `#faf9f7` en `#1b1a18` in het licht. De schijf is hol in het licht en gevuld in het donker. Het woordmerk krijgt `invert(1)` alleen in het donker. Foto's staan op 0,94, de korrel op `screen` met 0,05. De lichtanimatie liep door over de wissel (currentTime steeg, hij sprong niet terug naar nul). Bij reduced motion wordt `startViewTransition` niet aangeroepen; zonder reduced motion wel, 400 ms. `aria-pressed` is `true` in het donker. Het menu volgt via `kleur.achtergrond-verhoogd` (`#2b2a28`).

De pagina blijft één scherm. Onder de microregel bleef 18 px over op 320 × 568, 16 px op 390 × 844, 27 px op 768 × 1024, en de knop viel binnen het venster op 844 × 390, 1440 × 900 en 1920 × 1080.

## Telefoonweergave

`display: block` op de twee regelspans stond in de query voor `prefers-reduced-motion: no-preference`. Met verminderde beweging bleven de spans inline. Astro haalt de witruimte ertussen weg, dus de kop werd "meubelsuit Ommen." `text-wrap: nowrap` maakte daar één onbreekbare regel van, breder dan de telefoon. iOS Safari en Samsung Internet rekken de layoutviewport dan op, ook met `overflow: clip`, en Menu, de microregel en de haarlijn vallen buiten beeld.

`display: block` staat nu buiten die query, zonder `data-js`. De kop mag afbreken (`min-inline-size: 0`, `overflow-wrap: anywhere`). `html` en `body` blijven binnen `100%`. De haarlijn gebruikt de paginapadding in plaats van `100vw` en stopt bij de rand van de pagina. In de linkerkolom van de contactrij, van 360 tot 768 px, staat `ruimte.stapel.md` tussen "Bezoek op afspraak" en "Volg het werk".

`pnpm test:viewports` is schoon. `/` en `/collectie`, acht viewports (320×568, 360×800, 375×667, 393×852, 412×915, 430×932, 768×1024, 844×390), elk met `reduce` en `no-preference`: geen `scrollWidth` of `scrollHeight` voorbij het venster, de twee kopregels niet op dezelfde regel, en kop, intro, contactrij en microregel binnen de rechterrand.

## Bespreek je idee bereikbaar

"Bespreek je idee" gaat naar `/contact` vanaf drie plekken. In de contactrij is het kapitaallabel zelf de link. In het menu staat hij als omlijnde knop over de volle breedte, boven telefoon en Instagram. Vanaf 1024 px staat hij ook in de koprij, rechts van de klok; daaronder is de koprij vol en opent het menu hem. Op `/contact` krijgt de link in de kop `aria-current="page"` en de haarlijn.

`/contact` is voorlopig één scherm: label, kop en een zin die naar de gegevens in de contactrij wijst. Het formulier staat er nog niet.

Gecontroleerd in `astro dev`: de koprijlink, de footerlink en de menuknop komen alle drie op `/contact`. Op 320 × 568 past de homepage en het menu (de knop is 288 px breed, gelijk aan de menuvoet, en de onderkant van het menu valt op 568). Op 390 × 844 past `/contact` zonder scroll. Op 1024 en 1440 overlapt de koprijlink de navigatie of de klok niet.

## Wat open staat

1. **Woordmerk als SVG.** Het huidige `d-logo.svg` is een export met een ingesloten bitmap van 1065 px breed en een luminantiemasker. `pnpm og` rendert daaruit `woordmerk.png` op 480 px, het OG-beeld en het favicon. Een echte outline-SVG maakt die stap onnodig en is scherper op elk formaat.
2. **KvK-nummer.** Nog `[VUL IN]` in `site.json`. De microregel voegt het er zelf bij zodra het bekend is.
3. **Licentiefonts.** Mint Grotesk en Apercu vervangen Instrument Sans en Work Sans met één tokenwijziging plus twee bestanden in `public/fonts`. De metrische correcties op de terugvalstack horen dan opnieuw bepaald te worden.
4. **Lighthouse.** Meten op de productie-URL, volgens `docs/DEPLOY.md`.

De één-scherm-eis is vervallen; pagina's scrollen.
