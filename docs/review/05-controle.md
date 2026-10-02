# 05 Controle

## Geslaagde checks

```
pnpm tokens:check   tokenbron en gegenereerde bestanden lopen gelijk
pnpm check          62 bestanden, geen fouten
pnpm lint           geen meldingen
pnpm test           12 tests over het aanvraagendpoint
pnpm build          25 routes geprerenderd, één serverless functie
```

## Handmatig gecontroleerd

Breedtes 390, 768 en 1440 px. Geen horizontale overloop op geen van de drie. Het mobiele menu opent fullscreen, de knop wisselt naar "Sluiten", Escape sluit en geeft de focus terug aan de knop, en navigeren sluit het menu.

Tekstvergroting naar 200 procent zonder overloop.

Reduced motion: geen `clip-path`, geen `scale`, alleen opacity-fades. Gecontroleerd met geëmuleerde `prefers-reduced-motion: reduce`.

Formulier met de drie Resend-variabelen leeg: `/contact` meldt dat het formulier uitstaat en verwijst naar telefoon en Instagram. Met de variabelen gevuld verschijnt het formulier. Leeg verzenden geeft zes foutmeldingen en zet de focus op het eerste foute veld. `/contact?aanvraag=editie` selecteert het soort aanvraag voor.

Verzenden met een ongeldige Resend-sleutel: de site meldt eerlijk dat het versturen niet lukte en blijft op `/contact`. Geen redirect naar `/bedankt`, geen succesmelding.

Zonder JavaScript (POST zonder `Accept: application/json`): het endpoint antwoordt met een 303. Gevulde honingpot: stil geaccepteerd met status 200 en zonder verzending.

Canonicals absoluut op elke pagina. `noindex, nofollow` op `/design-system`, `/bedankt`, de 404 en alle zes voorbeeldprojecten; `index, follow` op de overige. De sitemap bevat dertien URL's en geen enkele daarvan is `noindex`.

Preview: met `VERCEL_ENV=preview` is de homepage `noindex, nofollow` en geeft `robots.txt` alleen `Disallow: /`. Een productiebuild daarna is weer `index, follow` met `Allow: /`, dus productie erft die instelling niet.

De Astro-auditbalk meldt geen toegankelijkheids- of performanceproblemen op de homepage, `/contact` en `/werkgebied/ommen`.

## Twee bugs gevonden en opgelost tijdens de controle

De gordijnonthulling op beelden blokkeerde zichzelf. Het masker stond op het element dat ook werd geobserveerd, en een element met een `clip-path` van nul oppervlak kruist de viewport nooit, dus `IntersectionObserver` sloeg nooit aan en het beeld bleef onzichtbaar. Het masker staat nu op het eerste kind, het geobserveerde element blijft ongeclipt. Er staat een comment bij in `src/styles/beweging.css`, want dit is niet vanzelf duidelijk.

De footerkolom "Volgen" was twee van twaalf kolommen breed. Bij 200 procent tekstvergroting paste het woord Instagram daar niet in en liep de pagina horizontaal over. De footer heeft nu een tussenstap bij 48rem en een bredere kolom bij 64rem.

## Niet geverifieerd

Aflevering via Resend met een geldige sleutel. Wel getest is wat er gebeurt als aflevering mislukt. De vijf stappen om verzending echt te verifiëren staan in `docs/DEPLOY.md`.

Deployment op Vercel. De adapter bouwt lokaal en levert één functie op, maar er is nog niet gedeployed.

Lighthouse-scores. CI draait nu install, tokencheck, typecheck, lint, test en build; Lighthouse CI met assertions is een vervolgstap.

## Nodig om live te gaan

1. Echte projectfoto's, volgens `docs/FOTOGRAFIE.md`. Daarna `plaatshouder: false` per project.
2. De 35 open beweringen uit `docs/FEITENCHECK.md` door Thomas laten bevestigen.
3. `juridischeNaam`, `email`, `kvk` en `geo` in `src/content/instellingen/site.json`, nu nog `[VUL IN]` en zichtbaar gemarkeerd op `/privacy`.
4. Resend: `mail.kolling.nl` verifiëren en de drie variabelen in Vercel zetten.
5. Licentie voor Mint Grotesk en Apercu, of de huidige fonts bewust houden.
6. Een outline-SVG van het logo zonder ingesloten bitmap, als die beschikbaar komt.
