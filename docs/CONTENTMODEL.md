# Contentmodel

Alles wat op de site staat komt uit `src/content`. De schema's staan in `src/content.config.ts` en valideren tijdens de build: een contentbestand dat niet klopt laat de build falen in plaats van stil een halve pagina op te leveren.

## Collecties

| Collectie      | Bron                                 | Route                                   |
| -------------- | ------------------------------------ | --------------------------------------- |
| `projecten`    | `src/content/projecten/*.md`         | `/werk` en `/werk/[slug]`               |
| `diensten`     | `src/content/diensten/*.md`          | `/maatwerk` en `/maatwerk/[slug]`       |
| `edities`      | `src/content/edities/*.md`           | `/edities` en `/edities/[slug]`         |
| `locaties`     | `src/content/locaties/*.md`          | `/werkgebied` en `/werkgebied/[plaats]` |
| `faq`          | `src/content/faq/algemeen.json`      | hergebruikt per pagina via `paginas[]`  |
| `instellingen` | `src/content/instellingen/site.json` | overal                                  |

## projecten

Velden: `titel`, `intro`, `categorie`, `materialen[]`, `afwerking`, `afmetingen`, `beelden[]`, `plaatshouder`, `seo`, `beweringen[]`. Optioneel: `jaar`, `plaats`, `regio`, `opdrachtgever`, `uitgelicht`, `volgorde`, `gerelateerd[]`.

`categorie` is `tafels`, `kasten`, `interieur` of `bijzonder-houtwerk`.

`plaatshouder: true` betekent een voorbeeldproject. Die pagina krijgt `noindex`, staat niet in de sitemap en toont het label "Voorbeeldproject, eigen projectfoto's volgen". Zet dit op `false` zodra er echte foto's en echte projectgegevens staan.

Een project zonder `jaar`, `plaats` of `opdrachtgever` laat die regels simpelweg weg in het museumlabel. Vul ze niet met geschatte waarden; dan suggereert een voorbeeldproject een opdracht die niet bestaat.

## beelden

Een beeld heeft een `bron` of een `plaatshouder`, nooit beide. Het schema is een union, dus de build wijst het af als er iets mist.

```yaml
beelden:
  - alt: Eettafel van massief eiken in een lichte ruimte
    plaatshouder:
      tint: eik
      label: Beeld volgt
    verhouding: liggend
    bijschrift: Totaalbeeld
```

`verhouding` is `liggend` (3:2), `staand` (4:5), `vierkant` (1:1) of `breed` (16:9). `tint` is `eik`, `noten` of `es`. Het eerste beeld is de omslag en laadt met prioriteit.

## diensten

Velden: `titel`, `kop`, `intro`, `categorie`, `voorWie[]` (minstens twee), `proces[]` (minstens drie stappen), `materialen[]` (minstens twee), `faq[]` (minstens vier vragen), `seo`, `beweringen[]`. Optioneel: `gerelateerdeProjecten[]`, `volgorde`.

De minima staan er omdat een dienstpagina zonder eigen proces en eigen vragen niets toevoegt boven `/maatwerk`.

## edities

Velden: `titel`, `intro`, `oplage`, `beschikbaar`, `status`, `materialen[]`, `afmetingen`, `prijs`, `jaar`, `beelden[]`, `seo`, `beweringen[]`.

De collectie is nu leeg. `/edities` toont dan de aankondiging. Voeg pas een editie toe als oplage, prijs en beelden echt vaststaan; het schema vraagt ze allemaal, dus een half ingevulde editie laat de build falen.

## locaties

Velden: `plaats`, `regio`, `kop`, `intro`, `uniekeSecties[]` (minstens drie), `logistiek`, `faq[]` (minstens drie), `publiceren`, `seo`, `beweringen[]`. Optioneel: `projectenInGebied[]`, `geo`.

De minima zijn de anti-doorwaymaatregel. Een plaatspagina mag pas bestaan als er drie secties met eigen inhoud en drie plaatsgebonden vragen zijn. Zonder dat kun je de pagina niet publiceren, want `publiceren: false` houdt haar uit de routes en uit de sitemap.

`geo` blijft weg tot de coördinaten bevestigd zijn. Zonder dat veld komt er geen `geo` in de structured data, en dat is beter dan een geschatte locatie.

## faq

Elke vraag noemt in `paginas[]` op welke routes ze hoort. Zo staat een algemeen antwoord op één plek en verschijnt het op `/maatwerk`, `/werkgebied` of `/contact` zonder te worden gedupliceerd.

## instellingen/site.json

NAP, telefoon (weergave en E.164), Instagram, CTA-teksten en SEO-fallbacks. Hier staan ook de velden die nog onbekend zijn, met de waarde `[VUL IN]`: `juridischeNaam`, `email`, `kvk` en `geo`.

`beweringen[]` in dit bestand is voor open vragen die niet bij één pagina horen, zoals de reactietermijn op een aanvraag. Ze komen bovenaan in `docs/FEITENCHECK.md` onder "Site-breed".

Die markering doet twee dingen. Op `/privacy` verschijnt een zichtbaar blok dat de tekst nog niet af is, en in de structured data wordt een onbekend veld gewoon weggelaten. Vervang `[VUL IN]` zodra de gegevens er zijn; verder is er geen code die mee moet veranderen.

## Een project toevoegen

1. Maak `src/content/projecten/<slug>.md`.
2. Vul de frontmatter. De slug wordt de URL.
3. Zet de beelden in `src/assets/projecten/<slug>/` of gebruik plaatshouders.
4. Zet `uitgelicht: true` als het project op de homepage mag.
5. Draai `pnpm check` om het schema te valideren.

Er hoeft geen component te worden aangepast.
