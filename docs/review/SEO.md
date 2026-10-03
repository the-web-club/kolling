# SEO en GEO, audit

De sitemap bevat `https://kolling.nl/` en `https://kolling.nl/contact`. `lastmod` is `git log -1 --format=%cI` van het bronbestand, met de buildtijd als git geen datum geeft. Vercel kloont met diepte 10: `git log` werkt, maar een bestand buiten die tien commits krijgt de datum van de oudste opgehaalde commit. De drie curl-controles na de deploy van deze sitemap worden in deze alinea aangevuld.

Status: de sitemap is gebouwd. De rest van deze audit wacht nog. `.cursor/rules/20-content-seo.mdc` is al vervangen door de meegeleverde versie; die is leidend zodra de bouw start.

Gemeten op 3 oktober 2026 tegen `https://www.kolling.nl` (de host die nu 200 geeft) en tegen de code op `main`. De werkboom heeft losse, niet-gestage wijzigingen (viewports, thema, beweging). Die blijven buiten de SEO-commits.

## Host staat omgekeerd

De rule wil `https://kolling.nl` als enige adres. Live is het andersom.

| Verzoek | Status | Location |
| --- | --- | --- |
| `https://www.kolling.nl/` | 200 | |
| `https://kolling.nl/` | 308 | `https://www.kolling.nl/` |
| `https://kolling.nl/contact` | 308 | `https://www.kolling.nl/contact` |
| `https://www.kolling.nl/over` | 200 | |
| `https://www.kolling.nl/over/` | 200 | zelfde etag als zonder slash |

De HTML op `www` noemt wel de apex als canonical:

```html
<link rel="canonical" href="https://kolling.nl/">
<meta property="og:url" content="https://kolling.nl/">
```

Bron: `src/components/Seo.astro` regel 16, `new URL(Astro.url.pathname, Astro.site)`, en `site: 'https://kolling.nl'` in `astro.config.mjs`. Google ziet dus een indexeerbare `www`-URL waarvan de canonical terugwijst naar een adres dat 308 naar `www` stuurt.

Buiten de code, door Rik, en anders dan de checklist het nu formuleert: `www` staat er al en is het productiedomein. Zet `kolling.nl` als primair domein en `www.kolling.nl` op "Redirect to kolling.nl" met status 308. Controle daarna: `curl -I https://www.kolling.nl/` geeft 308 met `Location: https://kolling.nl/`.

In de code: canonical, `og:url`, sitemap en structured data blijven op de apex, via één functie `maakCanonical`. `pnpm test:seo` vraagt `https://www.kolling.nl/` en `https://kolling.nl/contact/` alleen wanneer `PUBLIC_SITE_URL` gelijk is aan `https://kolling.nl`, en verwacht dan een 308 naar de canonieke URL. Lokaal en in CI slaat die controle over.

## Eén adres per pagina

`trailingSlash: 'never'` staat in `astro.config.mjs`. Er is geen Vercel-adapter (`docs/BESLUITEN.md` punt 0, `docs/DEPLOY.md`). De adapter is dus niet degene die `/pad/` naar `/pad` stuurt. Bewijs: `/over` en `/over/` geven allebei 200.

Plan: `vercel.json` met één redirect, `/:path+/` naar `/:path+`, permanent (308). Die regel raakt `/` niet, dus de homepage houdt zijn slash. `/contact` bestaat niet; `/contact/` moet toch 308 naar `/contact` geven, ook als dat pad daarna 404 is.

`maakCanonical` laat de query weg, haalt de slash weg behalve op `/`, en gebruikt altijd `Astro.site`. Dezelfde functie voedt sitemap en `url` in de structured data.

## Metadata

Huidige `Seo.astro`: title, description, canonical, `robots`, `og:type`, `og:locale`, `og:title`, `og:description`, `og:url`, `og:image`, `twitter:card`. Ontbreekt: `og:site_name`, `og:image:alt`, `max-snippet` en `max-image-preview`.

`bepaalRobots` in `src/lib/seo.ts`: preview `noindex, nofollow`; indexeerbaar `index, follow`; de rest `noindex, follow`. Live homepage: `index, follow`. Live `/over` en de 404: `noindex, follow`. De oudere review (`docs/review/COMING-SOON.md`) noemt de 404 nog `nofollow`; de code en de live HTML doen dat niet.

Plan:

- Indexeerbaar: `index, follow, max-snippet:-1, max-image-preview:large`.
- De rest op productie: `noindex, follow`. Preview houdt `noindex, nofollow`.
- `og:site_name` "Kolling". Optionele props `ogBeeld` en `ogBeeldAlt`. Standaard `https://kolling.nl/og.jpg` (live 200,  JPEG) met alt "Dressoir met geprofileerde houten schuifdeuren uit de werkplaats van Kolling in Ommen".
- Homepage-title. "Meubelmaker in Ommen, houtwerken en meubels op maat | Kolling" is 61 tekens. De title wordt daarom "Meubelmaker in Ommen | Kolling" (30). Description, 144 tekens: "Thomas Kolling maakt houtwerken en meubels op maat in de werkplaats aan de Strangeweg in Ommen. Een idee bespreken kan nu al via 06 13 62 22 76."
- Huidige homepage-title is "Kolling, houtwerken en meubels uit Ommen" (40), description 135 tekens, onder de nieuwe ondergrens van 140.

`/contact` en `/privacy` bestaan niet op `main`. Live: `https://www.kolling.nl/contact` en `/privacy` geven 404. Ik maak die pagina's niet in deze ronde. Een indexeerbare contact- of privacypagina zonder de inhoud van de volledige site hoort daar niet. De titels komen in `docs/SEO.md` onder "Komt met de volledige site": contact "Bespreek je idee met Thomas Kolling | Kolling" (45) met de dressoirfoto, privacy indexeerbaar met een feitelijke title.

`/bedankt` bestaat niet. De 404 en de zes "Binnenkort"-pagina's zijn al `noindex, follow` en blijven dat. Hun descriptions zijn te kort voor de nieuwe controle (binnenkort 114, 404 99) en de zes secties delen één description. Die teksten worden uniek en 140 tot 160 tekens, zonder nieuwe claims.

Favicon nu: alleen `<link rel="icon" href="/favicon.png" sizes="64x64">` in `Basis.astro`. `scripts/maak-og.mjs` zet het woordmerk gecentreerd in een vierkant van 64 px. Er is geen `favicon.svg`, geen ico, geen 96 px, geen apple-touch-icon.

Het woordmerk is een bitmap in `src/assets/merk/d-logo.svg`. Besluit 17 verbiedt hertekenen. Een nieuw monogram teken ik daarom niet. De favicon wordt het bestaande woordmerk, vierkant gecentreerd, als `favicon.svg` met een `prefers-color-scheme`-wissel alleen voor de vulkleur, plus `favicon.ico` (48), `favicon-96.png` en `apple-touch-icon.png` (180), gegenereerd in `scripts/maak-favicons.mjs`. Alle `link rel`-regels in `Basis.astro`.

## Indexeren

`src/pages/sitemap.xml.ts` ontbreekt. Live: `https://www.kolling.nl/sitemap.xml` is 404 (de HTML-404, `Content-Disposition: inline; filename="404.html"`).

`src/pages/robots.txt.ts` geeft op productie `User-agent: *` en `Allow: /`. Live body is precies dat, 23 bytes. Geen `Disallow: /api/`, geen lege regel, geen `Sitemap:`-regel. Geen regels voor AI-crawlers. Preview blijft `Disallow: /`.

Plan: sitemap uit de routes, alleen waar `isIndexeerbaar` hetzelfde antwoord geeft als de `robots`-meta. Op `main` is dat alleen `https://kolling.nl/`. `lastmod` uit `git log -1 --format=%cI -- <bronbestand>`, terugval de buildtijd. CI-checkout staat op de standaarddiepte van één commit; die wordt `fetch-depth: 0`, anders is `lastmod` in CI bijna altijd de terugval.

Preview en een statische build: Astro zonder adapter schrijft endpoints als bestanden en negeert een status 404. Bij `VERCEL_ENV=preview` verwijdert de build `sitemap.xml` en `llms.txt` uit de output, zodat het pad niet bestaat en Vercel de bestaande 404 met status 404 geeft. Lokaal en op productie blijven de bestanden staan.

`robots.txt` op productie:

```
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://kolling.nl/sitemap.xml
```

Geen blokkade van `GPTBot`, `OAI-SearchBot`, `ClaudeBot`, `Claude-SearchBot`, `PerplexityBot`, `Google-Extended` of `Applebot-Extended`. Dat besluit komt in `docs/BESLUITEN.md`.

De 404-status klopt al. `curl -I https://www.kolling.nl/bestaat-niet` geeft 404, `filename="404.html"`. De canonical in die HTML is `https://kolling.nl/404`, omdat de statische 404 het opgevraagde pad niet kent. Met `noindex` blijft dat zo. `src/pages/api/aanvraag.ts` ontbreekt. De header `X-Robots-Tag: noindex` wordt vastgelegd voor het moment dat het endpoint terugkomt, en nu niet als leeg bestand toegevoegd.

## Structured data

Alleen de homepage zet JSON-LD aan (`jsonLd` op `Basis`). Live grafiek: `LocalBusiness` (`#werkplaats`) en `WebSite` (`#website`). Aanwezig: naam, url, logo, image, telefoon, e-mail `thomas@kolling.nl`, founder, adres, areaServed, sameAs Instagram. Afwezig: description, knowsAbout, priceRange, publisher, WebPage, Person als eigen node, BreadcrumbList.

`email` staat in `site.json` en op de pagina. `kvk`, `juridischeNaam` en `geo` zijn `[VUL IN]` en blijven uit de grafiek. Geen geo, geen openingstijden, geen reviews, geen Product.

Plan, in `src/lib/jsonld.ts`:

- `LocalBusiness` krijgt de kernalinea als `description`, `knowsAbout` zoals hieronder, `priceRange` "€€€", `sameAs` met Instagram. Google Business Profile komt erbij zodra de URL bekend is.
- `WebSite` krijgt `publisher` naar `#werkplaats`.
- `maakWebPage(soort, url, titel, beschrijving, dateModified)` met `WebPage`, `ContactPage`, `AboutPage` of `CollectionPage`, `isPartOf` naar `#website`, `about` naar `#werkplaats`, `inLanguage` `nl-NL`, `dateModified` uit dezelfde bron als de sitemap. Elke pagina geeft zijn soort door via `Basis`. Homepage en de binnenkort-pagina's zijn `WebPage`. De 404 ook, zonder kruimels.
- `maakPerson()` voor Thomas Kolling, `jobTitle` "Meubelmaker", `worksFor` naar `#werkplaats`, `sameAs` Instagram. Op de homepage. `/over` bestaat alleen als "Binnenkort" en krijgt de Person nog niet.
- `BreadcrumbList` in de JSON-LD op elke echte pagina onder de homepage, ook de "Binnenkort"-pagina's. Geen zichtbaar kruimelpad: de coming-soon compositie blijft één scherm.

`knowsAbout` wordt `["Meubels op maat", "Interieurbouw", "Massief houten tafels", "Kasten op maat", "Bijzonder houtwerk"]`, met een bewering in `site.json` omdat "massief" en de precieze lijst nog niet door Thomas bevestigd zijn. `priceRange` "€€€" is een schema-signaal voor het hogere segment, geen prijs. Dat besluit komt in `docs/BESLUITEN.md`.

Rich Results Test en Schema Markup Validator draaien na de bouw op de lokale preview en nog eens na de productiedeploy. De uitkomsten komen onderaan dit bestand.

## GEO

Homepage-intro, hardcoded in `src/pages/index.astro`, 18 woorden: "Op maat gemaakt in eigen werkplaats aan de Strangeweg. De website volgt. Een idee bespreken kan nu al." Geen kernalinea op andere pagina's. Geen `llms.txt` (live 404). Geen IndexNow. `dateModified` staat nergens leesbaar; op deze site zijn er geen nieuws- of projectpagina's.

Voorstel voor `site.json` → `kernalinea`, 53 woorden. Dit is de tekst die live gaat als je GO zegt:

> Kolling maakt meubels en houtwerk op maat. Thomas Kolling, meubelmaker in Ommen, werkt in de werkplaats aan de Strangeweg in Ommen voor particulieren, interieurarchitecten en zakelijke opdrachtgevers, en is landelijk actief. Bezoek aan de werkplaats gaat op afspraak. De website volgt. Een idee bespreken kan nu al via 06 13 62 22 76.

De alinea vervangt de intro op de homepage en komt in de HTML, niet achter JavaScript. Eerste zin zonder voornaamwoord. `/contact` en `/privacy` krijgen hun kernalinea pas als die pagina's bestaan.

Als de langere alinea het scherm laat scrollen, gaat `tekst.intro` in de bestaande hoogtequeries van de homepage één stap omlaag. Het token zelf blijft `lg`. Dat wordt in de browser gecontroleerd op 390, 768 en 1440.

`src/pages/llms.txt.ts` wordt Markdown uit `site.json` en dezelfde indexeerbare routelijst als de sitemap. Op deze site is dat de homepage plus naam, de ene regel wat Kolling is, en de contactgegevens. Preview: het bestand wordt niet uitgeleverd, zie hierboven.

IndexNow: sleutelbestand `public/<sleutel>.txt`. De sleutel is publiek. `astro:env` komt terug met alleen `INDEXNOW_SLEUTEL` als publieke variabele, zonder Vercel-adapter en zonder Zod. `scripts/meld-indexnow.mjs` leest de sleutel, haalt de URL's uit de sitemap en meldt ze bij `api.indexnow.org`. `vercel.json` heeft geen post-deploy-stap voor een statische site. Keuze: handmatig `pnpm indexnow`, plus een GitHub Action op een geslaagde productiedeploy die hetzelfde script draait. De sleutel hoort in Vercel en in de Actions-secret, gelijk aan het bestand. Die twee velden zet Rik.

`dateModified` zichtbaar op nieuws en projecten: de plek komt in `docs/CONTENTMODEL.md`, bij de velden van die collecties, voor het moment dat ze terugkomen.

## Beveiligingsheaders

Geen `vercel.json`. Live stuurt Vercel zelf `Strict-Transport-Security: max-age=63072000`, zonder `includeSubDomains` en zonder `preload`. Geen `X-Content-Type-Options`, geen `Referrer-Policy`, geen `Permissions-Policy`, geen CSP.

Plan: `headers` op `/(.*)`  met

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Content-Security-Policy-Report-Only` voor eigen origin. Scripts en stijl hebben `'unsafe-inline'` nodig door de inline thema-script en de `<style>`-blokken van Astro. Resend en Turnstile blijven uit de policy tot ze live zijn.

De adapter ontbreekt, dus `vercel.json` is de enige plek waar Vercel deze headers vandaan haalt. Na deploy controleren of Vercel zijn kortere HSTS ervoor zet. Staat die ervoor, dan geldt de kortste en zetten we `includeSubDomains` in het Vercel-project in plaats van in het bestand. Dat alternatief komt dan in `docs/DEPLOY.md`.

## Documentatie

`docs/SEO.md` beschrijft de volledige site: dertien sitemap-URL's, `noindex, nofollow` op plaatshouders, `public/og.png`. Live is een coming-soon pagina, `og.jpg`, en geen sitemap. Het bestand wordt herschreven naar wat op `main` staat, met een sectie "Komt met de volledige site" voor werk, maatwerk, edities en werkgebied.

Checklist buiten de code, aanvulling op wat Rik al doet:

1. `www` van primair domein naar 308 naar de apex.
2. Search Console, domeinproperty `kolling.nl`.
3. Bing Webmaster Tools, site toevoegen en importeren uit Search Console.
4. IndexNow-sleutel in Vercel en in de Actions-secret.
5. Google Business Profile, categorie Meubelmaker, website naar `https://kolling.nl/` zolang `/werkgebied/ommen` niet bestaat. NAP gelijk aan `site.json`.
6. Instagram laten linken naar `https://kolling.nl`.
7. Rich Results Test op de homepage na de productiedeploy.

`docs/BESLUITEN.md`: AI-crawlers toestaan, `www` naar apex, `priceRange` "€€€".

## Wat de controles worden

`scripts/controleer-seo.mjs` als `pnpm test:seo`, tegen `dist/`. Faalt bij elke afwijking: één H1, title tot 60, description 140 tot 160, canonical gelijk aan `og:url`, `robots` volgens de pagina, parsebare JSON-LD met `@type`, kernalinea op indexeerbare pagina's, sitemap alleen met indexeerbare URL's en volledig, `robots.txt` met de sitemap-regel. De live 308-controle alleen als `PUBLIC_SITE_URL` de productie-URL is.

`pnpm test` bestaat niet. Vitest is met de volledige site weggehaald en komt niet terug voor deze ronde. CI krijgt `test:seo` na de build, naast de bestaande viewports.

Lighthouse op `/` en `/contact` na de bouw. `/contact` is een 404, dus de tweede meting gaat naar een indexeerbare pagina die wel bestaat. Als alleen `/` indexeerbaar is, meet ik `/` en een "Binnenkort"-pagina, en noteer ik waarom `/contact` niet meedoet. Drempels: SEO 0.98, de andere drie 0.95.

Na de productiedeploy, handmatig, in dit bestand: de vier `curl`-controles uit de opdracht, plus `llms.txt` 200. "Indexering op orde" pas als die curls kloppen en Search Console de sitemap heeft geaccepteerd.

## Bouwvolgorde na GO

1. Canonical, metadata, favicons, sitemap, robots.
2. Structured data, kernalinea, llms.txt, IndexNow.
3. `vercel.json` (redirect en headers).
4. `docs/SEO.md`, `docs/BESLUITEN.md`, `docs/CONTENTMODEL.md`, woordenlijst.
5. `pnpm test:seo` in CI, dan check, lint, tokens, build, viewports, Lighthouse.
6. Commits op `main`, daarna `git push origin main`.
