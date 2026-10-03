# SEO

## In de code geregeld

Elke pagina geeft een eigen `titel` en `beschrijving` door aan de layout. `src/lib/seo.ts` zet de suffix " | Kolling" erachter en gooit een fout als de titel boven 60 tekens komt, zodat een te lange titel de build laat falen in plaats van afgekapt in Google te belanden.

Descriptions van projecten, diensten en locaties zitten in het contentschema met een lengte tussen 140 en 160 tekens. Ook dat faalt bij de build.

Verder: absolute canonicals, `lang="nl"`, één `og:image` (`public/og.png`), beschrijvende alt-teksten, crawlbare `<a href>`-links zonder JavaScript, en één `<h1>` per pagina.

## noindex

`/design-system`, `/bedankt`, de 404, "Binnenkort"-pagina's zonder inhoud en elk project met `plaatshouder: true` krijgen `noindex, follow` en staan niet in de sitemap. Locaties met `publiceren: false` komen niet in de routes.

`robots.txt` op productie staat `/` toe, sluit `/api/` uit en wijst naar de sitemap. Pagina's die niet geïndexeerd worden, regelt `noindex`, niet `Disallow`.

## Sitemap

`src/pages/sitemap.xml.ts` is een prerendered `GET`-route. De URL's komen uit `haalIndexeerbareRoutes()` in `src/lib/routes.ts`. `Seo.astro` bepaalt de `robots`-meta met `isIndexeerbaar()` op diezelfde lijst, dus een `noindex`-pagina staat niet in de sitemap.

Op main staan twee URL's in de sitemap: `https://kolling.nl/` en `https://kolling.nl/contact`. De zes "Binnenkort"-pagina's en de 404 zijn `noindex` en ontbreken. `/privacy`, `/bedankt` en `/design-system` bestaan hier niet als route. Projecten, diensten, edities, locaties, nieuwsberichten en downloads komen erbij zodra hun pagina en bronbestand bestaan. Een project met `plaatshouder: true` en een locatie zonder `publiceren: true` blijven erbuiten.

Elke URL heeft een `lastmod` in ISO 8601 met tijdzone: `git log -1 --format=%cI` van het bronbestand. Geeft git geen datum, dan is het de buildtijd. Geen `changefreq` en geen `priority`. Onder de 1000 URL's blijft het één bestand.

Vercel kloont met `--depth=10`. `git log -1` werkt daar en geeft een datum terug. Een bestand dat in die tien commits is gewijzigd, krijgt zijn echte committerdatum. Een bestand daarbuiten krijgt de datum van de oudste opgehaalde commit, niet de echte laatste wijziging. CI haalt de volledige geschiedenis (`fetch-depth: 0`). Een volledige kloon op Vercel vraagt `VERCEL_DEEP_CLONE=true` in het project; die variabele staat niet in de repo.

`robots.txt` op productie bevat `Allow: /`, `Disallow: /api/` en één regel `Sitemap: https://kolling.nl/sitemap.xml`. Bij `VERCEL_ENV=preview` blijft het `Disallow: /`, zonder sitemapregel. De build schrijft dan geen `sitemap.xml`, omdat een lege 404-body door Astro niet als bestand wordt weggeschreven. Een statische host geeft daardoor 404 in plaats van de XML met status 200.

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
