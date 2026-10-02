# 02 Content en pagina's

## Wat

Vijf content collections plus `instellingen/site.json`, en alle routes: home, werk met projectdetail, maatwerk met vier dienstpagina's, edities, werkplaats, werkgebied met Ommen, contact, bedankt, privacy, design-system en 404.

## Waarom zo

De schema's in `src/content.config.ts` valideren aan de grens. Daar zitten ook de inhoudelijke eisen: een dienstpagina vraagt minstens vier vragen en drie processtappen, een locatiepagina minstens drie eigen secties en drie plaatsgebonden vragen. Dat is de anti-doorwaymaatregel, in code in plaats van in een afspraak. Wie die velden niet kan vullen, krijgt geen pagina maar een buildfout.

Een beeld is een union van `bron` of `plaatshouder`, niet een object met twee optionele velden. Daardoor weet TypeScript in `Beeld.astro` precies welke kant het op gaat en is er geen `!` of `as` nodig.

Geen categoriepagina's onder `/werk`. De startprompt noemde `/werk/[categorie]` naast `/werk/[slug]`; die botsen in de routing. Belangrijker: met zes voorbeeldprojecten zou zo'n pagina twee items tonen en dus dunne inhoud zijn. De vier `/maatwerk`-pagina's zijn nu de ingang per soort werk, met een crawlbare link vanaf `/werk`. Dit staat als besluit 12 in `docs/BESLUITEN.md`.

Nul edities gepubliceerd. De collectie en de detailroute staan er, maar leeg, dus `/edities` toont de aankondiging. Dat is een ontworpen lege toestand, geen "geen items gevonden".

Alle zes projecten zijn voorbeeldprojecten met `plaatshouder: true`. Ze dragen realistische materialen, afwerkingen en maten, maar geen opdrachtgever, plaats of jaar: anders suggereert een voorbeeld een opdracht die niet bestaat. Elke pagina toont zichtbaar dat het een voorbeeld is.

## Open punten

35 open beweringen staan in `docs/FEITENCHECK.md`, gegenereerd bij elke build. Dat zijn claims over houtsoorten, levertijden, montage en samenwerking die Thomas moet bevestigen. Die lijst moet leeg zijn of bewust geaccepteerd voor lancering.

`docs/FEITENCHECK.md` wordt geschreven door het endpoint `src/pages/feitencheck.md.ts` tijdens de build, omdat alleen daar de content collections beschikbaar zijn. Het bestand staat in `.gitignore` en `/feitencheck.md` is uitgesloten in `robots.txt`. Dit is de zwakste plek van de oplossing: de route is technisch publiek. Alternatief voor later is een Astro-integratie die de content zelf inleest.

## Hoe te testen

```bash
pnpm check
```

Controleer op `/werk` dat de aanduiding over impressies staat, op `/werk/<slug>` het label "Voorbeeldproject", op `/edities` de aankondiging, en op `/werkgebied/ommen` dat de pagina geen homepage met een plaatsnaam is.
