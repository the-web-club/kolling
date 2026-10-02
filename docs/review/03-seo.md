# 03 SEO

## Wat

`Seo`- en `JsonLd`-componenten, een sitemap uit de content, een `robots.txt` die op de omgeving reageert, een standaard OG-beeld en kruimelpaden op onderliggende pagina's.

## Waarom zo

De sitemap is een eigen endpoint in plaats van `@astrojs/sitemap`. Die integratie filtert op padpatronen en kan niet weten dat een project `plaatshouder: true` heeft. Het endpoint gebruikt dezelfde `isIndexeerbaar`-controle als de pagina zelf, dus sitemap en `noindex` kunnen niet uiteenlopen.

`maakTitel` gooit een fout boven 60 tekens. Een te lange titel laat de build falen in plaats van afgekapt in de zoekresultaten te verschijnen. Hetzelfde geldt voor descriptions: die zitten in het contentschema met een lengte van 140 tot 160 tekens.

In de structured data staat alleen wat bekend is. `geo`, reviews, `Product`, `Offer` en openingstijden zitten er niet in. `email` en `kvk` worden weggelaten zolang ze `[VUL IN]` zijn, in plaats van met een lege string gevuld.

Het OG-beeld is gerenderd uit het luminantiemasker in het aangeleverde SVG: de exacte lettervormen in inkt op warm wit. Er is geen woordmerk nagetekend in een ander font.

## Open punten

De coördinaten ontbreken, dus `LocalBusiness` heeft geen `geo`. Dat is bewust; ze komen uit het Google Business Profile zodra dat er is.

De checklist buiten de code staat in `docs/SEO.md`: Business Profile, Search Console, Bing, eerste vermeldingen en de Rich Results Test na de eerste productiedeploy.

## Hoe te testen

Na een build:

```bash
pnpm build
```

Controleer `.vercel/output/static/sitemap.xml`: daar horen dertien URL's in te staan, zonder `/werk/*`, zonder `/design-system` en zonder `/bedankt`. Controleer in de gegenereerde HTML dat `/` en `/maatwerk/tafels` `index, follow` hebben en dat `/design-system`, `/bedankt` en elk voorbeeldproject `noindex, nofollow` hebben.

Voor de preview-variant: zet `VERCEL_ENV=preview` en bouw opnieuw. Dan hoort `robots.txt` alleen `Disallow: /` te geven.
