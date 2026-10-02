# Besluiten

De opdracht staat in `docs/STARTPROMPT.md`. Hieronder staat waar deze implementatie daarvan afwijkt en waarom.

## Techniek

1. Astro 7 met pnpm, TypeScript strict en Node 22. De startprompt liet de versie open.
2. Tailwind v4 via `@tailwindcss/vite`, uitsluitend voor raster, spacing en responsive zichtbaarheid. Geen `tailwind.config.js`, geen arbitrary values. Kleur, typografie en beweging zijn componentstijl op tokens.
3. Style Dictionary 5 met tokens in W3C DTCG-formaat in plaats van één plat `tokens.json`. Dat maakt de drie lagen expliciet en houdt de gegenereerde output aantoonbaar in sync via `pnpm tokens:check`.
4. Geen `@astrojs/sitemap`. De sitemap wordt in `src/pages/sitemap.xml.ts` uit de content opgebouwd, zodat plaatshouderprojecten en niet-gepubliceerde locaties er met zekerheid buiten blijven. Een filter op padpatronen zou dat niet kunnen weten.
5. Resend wordt via de REST API aangeroepen in plaats van met de npm-client. Dat is één afhankelijkheid minder en maakt de test een gewone fetch-mock.
6. Environment variables lopen via `astro:env`, zodat secrets op de server bij runtime worden gelezen en nooit in de client terechtkomen.

## Naamgeving

7. Alles wat wij zelf benoemen is Nederlands: identifiers, componenten, bestanden, classes, tokens, data-attributen, eigen env-variabelen en contentvelden. Engels blijft alleen waar de techniek het voorschrijft. De regels staan in `.cursor/rules/40-clean-code.mdc`, de namen in `41-woordenlijst.mdc`. Waar de startprompt Engelse namen noemt (`Figure`, `WorkCard`, `color.fg`, `/api/contact`) gelden de Nederlandse namen.

## Inhoud

8. Geen stockbeelden. Elk beeldslot gebruikt het `Plaatshouder`-component in een houttint met het label "Beeld volgt". Reden: beelden van andere makers op de site van een maker zijn misleidend, ook met een label eronder. De compositie is daarmee te beoordelen zonder iets te suggereren wat niet bestaat.
9. Geen enkele editie gepubliceerd. De collectie `edities` en de route `/edities/[slug]` zijn gebouwd, maar leeg. `/edities` is een aankondiging met een route naar `/contact?aanvraag=editie`. Er staan geen verzonnen ontwerpen, oplages, prijzen of data in.
10. Nederlandse paden: `/edities` in plaats van `/signature-pieces`, en `/werkgebied` met `/werkgebied/ommen` in plaats van `/meubelmaker-ommen`. De zoekterm staat in de title en de H1. De hubstructuur schaalt later zonder dat er een reeks losse plaatspagina's ontstaat.
11. Vier dienstpagina's onder `/maatwerk/[slug]` zijn wel gebouwd. Ze hebben eigen inhoud, eigen vragen en geen foto's nodig, en zijn daarmee de landelijke organische ingangen.
12. Geen categoriepagina's onder `/werk`. De startprompt noemde `/werk/[categorie]` naast `/werk/[slug]`; die twee botsen in de routing. Belangrijker: met zes voorbeeldprojecten zou een categoriepagina twee items tonen en dus dunne inhoud zijn. De vier `/maatwerk`-pagina's zijn nu de ingang per soort werk, met een crawlbare link vanaf `/werk`. Komen er genoeg echte projecten, dan kan `/werk/categorie/[categorie]` erbij.
13. Elke pagina met claims over werkwijze, materiaal of levertijd heeft die claims in `beweringen[]` staan. De build schrijft ze naar `docs/FEITENCHECK.md`. Voor lancering moet die lijst leeg zijn of bewust geaccepteerd.

## Formulier

14. Bij spamverdenking (gevulde honingpot, te snel ingevuld, Turnstile zonder token) accepteert het endpoint stil en verstuurt niets. Dat is wat de opdracht vraagt en voorkomt dat een bot leert wat de filter is.
15. Zonder JavaScript werkt het formulier via een gewone POST. Het endpoint antwoordt dan met een 303 naar `/bedankt` of naar `/contact#aanvraag-fout`. Die melding wordt zichtbaar via `:target`, dus zonder JavaScript. Beperking: in dat geval gaan de ingevulde waarden verloren en zie je geen foutmelding per veld. Met JavaScript gebeurt alles zonder paginawissel en per veld.
16. Het tijdstempel voor de minimale invultijd wordt client-side gezet. Ontbreekt het, dan slaat de controle over in plaats van de aanvraag te weigeren, zodat bezoekers zonder JavaScript niet worden geblokkeerd.

## Merk

17. Er is één logo: `src/assets/merk/d-logo.svg`, zwart op transparant, voor lichte achtergronden. Niet inverteren, herkleuren of hertekenen. Er is geen variant voor donkere vlakken, dus de site heeft geen donkere logoplaatsingen.
18. Het aangeleverde SVG is een export met een ingesloten bitmap en een luminantiemasker, geen uitgewerkte paden. Het bestand wordt ongewijzigd gebruikt. Een outline-SVG mag het later vervangen; alleen dat bestand hoeft dan te wisselen.
19. `public/og.png` is uit datzelfde masker gerenderd: de exacte lettervormen in inkt op warm wit, 1200 bij 630. `public/favicon.svg` is een kopie van het logo; het heeft de eigen verhouding en is niet uitgesneden.

## Nog open

20. Analytics: niets bij lancering, dus ook geen cookiemelding.
21. Geen WhatsApp-link. Er is nog niet bevestigd dat dat nummer WhatsApp heeft.
22. Lighthouse CI met assertions is een vervolgstap na de eerste pull request. CI draait nu install, tokencheck, typecheck, lint, test en build.
