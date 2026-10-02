# SEO

## In de code geregeld

Elke pagina geeft een eigen `titel` en `beschrijving` door aan de layout. `src/lib/seo.ts` zet de suffix " | Kolling" erachter en gooit een fout als de titel boven 60 tekens komt, zodat een te lange titel de build laat falen in plaats van afgekapt in Google te belanden.

Descriptions van projecten, diensten en locaties zitten in het contentschema met een lengte tussen 140 en 160 tekens. Ook dat faalt bij de build.

Verder: absolute canonicals, `lang="nl"`, één `og:image` (`public/og.png`), beschrijvende alt-teksten, crawlbare `<a href>`-links zonder JavaScript, en één `<h1>` per pagina.

## noindex

`/design-system`, `/bedankt`, de 404 en elk project met `plaatshouder: true` krijgen `noindex, nofollow` en staan niet in de sitemap. Locaties met `publiceren: false` bestaan niet als route.

`robots.txt` sluit `/design-system`, `/bedankt`, `/feitencheck.md` en `/api/` uit.

## Sitemap

`src/pages/sitemap.xml.ts` bouwt de sitemap uit de content. Daardoor kan er geen pagina in staan die `noindex` is: de sitemap gebruikt dezelfde `isIndexeerbaar`-controle als de pagina zelf.

Nu in de sitemap: `/`, `/werk`, `/maatwerk`, de vier `/maatwerk/*`-pagina's, `/edities`, `/werkplaats`, `/werkgebied`, `/werkgebied/ommen`, `/contact` en `/privacy`. De zes voorbeeldprojecten staan er bewust niet in. Zodra een project echte foto's heeft en `plaatshouder: false` staat, komt het er automatisch bij.

## Preview-deployments

Als `VERCEL_ENV=preview` staat, krijgt elke pagina `noindex, nofollow`, geeft `robots.txt` een volledige `Disallow: /` en antwoordt `/sitemap.xml` met een 404. Een productiebuild heeft die variabele niet en blijft indexeerbaar. Controleer na de eerste productiedeploy of `https://kolling.nl/robots.txt` wel `Allow: /` geeft.

## Structured data

Op elke pagina `LocalBusiness` en `WebSite` uit `site.json`. Op onderliggende pagina's `BreadcrumbList`, en `FAQPage` waar vragen staan.

Wat er bewust niet in zit: `geo` (coördinaten nog niet bevestigd), `aggregateRating` en reviews (die zijn er niet), `Product` en `Offer` (er zijn nog geen edities), en `openingHours` (niet bevestigd). `email` en `kvk` komen er pas in zodra `[VUL IN]` in `site.json` is vervangen; de code laat een onbekend veld weg in plaats van iets te verzinnen.

## Lokale SEO zonder doorway abuse

Ommen is de enige echte vestigingsplaats. `/werkgebied` beschrijft eerlijk hoe landelijke opdrachten verlopen; `/werkgebied/ommen` is een zelfstandige pagina met het werkplaatsadres, wat een bezoek inhoudt, wat er in Ommen gemaakt wordt en vier plaatsgebonden vragen.

Er komt geen reeks vergelijkbare plaatspagina's. Het schema van `locaties` dwingt af dat een locatie drie eigen secties, eigen logistiek en drie eigen vragen heeft voordat ze gepubliceerd kan worden. Wie dat niet kan vullen, heeft geen pagina maar een doorway.

## Checklist buiten de code

Deze stappen staan niet in de repo en moeten door Rik of Thomas gedaan worden.

1. Google Business Profile aanmaken op Strangeweg 5, 7731 GV Ommen. Categorie Meubelmaker. Website-link naar `https://kolling.nl/werkgebied/ommen`. Exact dezelfde NAP als in `site.json`.
2. De coördinaten uit het Business Profile overnemen in `site.json` bij `geo`, zodat `LocalBusiness` ze kan noemen.
3. Search Console en Bing Webmaster Tools instellen en de sitemap aanmelden.
4. Eerste vermeldingen (bijvoorbeeld een branchegids) met exact dezelfde naam, adres en telefoon.
5. Het Instagram-profiel naar `https://kolling.nl` laten linken, zodat `sameAs` beide kanten op klopt.
6. Na de eerste productiedeploy de structured data door de Rich Results Test halen.
7. Zodra er echte projectfoto's zijn: `plaatshouder: false` zetten en controleren dat die pagina's in de sitemap verschijnen.
