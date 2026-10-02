# Startprompt voor Cursor — Kolling.nl

Je bent de lead developer en digital art director voor Kolling.nl. Start direct met de daadwerkelijke implementatie van een hoogwaardige, minimalistische marketingwebsite in deze GitHub-repository:

https://github.com/the-web-club/kolling

Productiedomein: https://kolling.nl/

Inspecteer eerst de repository, eventuele AGENTS.md-instructies, bestaande assets en configuratie. Behoud bestaand werk. Initialiseer een leeg project met Astro, TypeScript strict en een passende lockfile. Werk in een featurebranch. Maak een kort implementatieplan en bouw vervolgens een complete, lokaal werkende eerste versie. Stop niet na een voorstel of wireframe. Maak zelfstandig redelijke keuzes en documenteer ontbrekende gegevens.

## 1. Merk en commerciële opdracht

T. Kolling is het merk van Thomas Kolling: ambachtelijke meubels en algemeen houtwerk in het hogere segment, gemaakt in zijn eigen werkplaats.

Werkplaats: Strangeweg 5, 7731 GV Ommen, Nederland.

Doelgroepen: particulieren met een hoger interieurbudget, interieurarchitecten en zakelijke opdrachtgevers. Thomas werkt vanuit Ommen en is landelijk actief.

Naast maatwerk komen er signature pieces: eigen ontwerpen in beperkte oplages. Deze collectie is nog in ontwikkeling. Presenteer haar als aankomend; verzin geen producten, oplageaantallen, voorraad, prijzen of releasedata.

Primaire conversie en vaste CTA: "Bespreek je idee".

Budgetcategorieën voor aanvragen: €1.000–€2.000, €2.000–€3.500, €3.500–€5.000 en €5.000+. Voeg "Nog niet bepaald" toe. Gebruik deze bedragen als intakecategorieën, niet als vaststaande productprijzen.

## 2. Visuele richting

Ontwerp de website als een witte galerie waarin het houtwerk centraal staat. Het museum is de referentie: witte muren, aandacht voor het object, weinig visuele ruis.

Zuiver wit als hoofdsurface, bijna zwart voor tekst en een kleine neutrale grijsschaal voor lijnen en metadata. Het beeldmateriaal brengt de warmte en kleur.

- Royale witruimte, zorgvuldig uitgelijnde grids, grote typografie en een duidelijk ritme tussen beeld en tekst.
- Art-directed beeldcomposities met afwisseling tussen totaalbeeld, materiaal en detail. Gebruik niet overal dezelfde verhouding of identieke kaarten.
- Rustige, scherpe knoppen en links; subtiele lijnen; zeer terughoudende afgeronde hoeken.
- Typografische richting: Mint Grotesk en Apercu. Gebruik deze alleen als gelicentieerde webfonts beschikbaar zijn. Kies anders een lokaal gehoste open-source grotesk, bijvoorbeeld Instrument Sans. Maak vervanging via fonttokens eenvoudig en documenteer die keuze.
- Behoud de aangeleverde logolettervormen exact. Gebruik passende woordmerk- en volledige logovarianten. Herteken het logo niet. Ontbreken assets, leg hun verwachte locaties vast en gebruik tijdelijk een eenvoudige tekstweergave.
- Kleine, beheerste reveal-animaties en beeldtransities. Respecteer reduced motion. Houd scrollen natuurlijk en de bediening bruikbaar met toetsenbord en touch.

De eerste viewport moet al overtuigen met typografie, één sterk beeld en een duidelijke contactroute. Vermijd een generieke SaaS-compositie, decoratieve gradients, glassmorphism en een stapeling van standaard featurekaarten.

## 3. Tokenized design system

Maak een werkelijk herbruikbaar design system met drie lagen: primitive tokens, semantic tokens en component tokens.

Gebruik één centrale bron, bijvoorbeeld src/design-tokens/tokens.json, en genereer daaruit CSS custom properties. Houd bron en gegenereerde CSS aantoonbaar gesynchroniseerd. Maak geen onafhankelijk onderhouden JSON- en CSS-kopieën.

Definieer minimaal tokens voor:

- kleuren en semantische surfaces, tekst, borders, acties en feedback;
- fontfamilies, gewichten, fluid type scale, line-height en letter-spacing;
- spacing scale, page gutters, content widths, grid gaps en section spacing;
- borders, radii, focus states en eventuele subtiele shadows;
- motion durations, easings en reduced-motion gedrag;
- buttons, links, form controls, navigation en image captions.

Componentstijlen gebruiken semantische of componenttokens. Losse merkwaarden horen niet verspreid door componenten. Technische uitzonderingen zijn toegestaan wanneer CSS-variabelen niet werken, zoals media-querygrenzen; documenteer die.

Bouw /design-system/ als een visuele, responsive referentiepagina met kleuren, typografie, spacing, logo's, knoppen, form states en beeldcomposities. Geef deze route noindex en sluit haar uit van de sitemap. Documenteer het systeem in docs/design-system.md.

## 4. Techniek en content

- Astro is het framework. Gebruik geen Next.js en voeg geen React toe zonder concrete noodzaak.
- Render alle marketingpagina's vooraf als statische HTML. Gebruik kleine vanilla TypeScript-interacties waar nodig.
- Geen eigen database, accounts, dashboard, webshop of databasegedreven CMS.
- Bewaar projecten en teksten in typed contentbestanden of Astro content collections. Zorg dat nieuwe projecten zonder componentwijzigingen kunnen worden toegevoegd.
- Optimaliseer lokale afbeeldingen met Astro; gebruik passende responsive afbeeldingsgroottes. Laad het hoofdbeeld met prioriteit en overige beelden lazy.
- Gebruik weinig afhankelijkheden, lokaal gehoste fonts en goede HTML-semantiek.
- Bereid Vercel-deployment voor. Alleen het contactendpoint mag dynamisch zijn, met een passende Astro-adapter. Voeg geen infrastructuur toe die dit project niet nodig heeft.
- Verander geen DNS- of e-mailinstellingen. ProtonMail moet blijven functioneren.

## 5. Pagina's en inhoud

Bouw deze routes met eigen inhoud en een samenhangende vormgeving:

- `/`: merkintroductie, visuele showcase, maatwerk, werkplaats, aankomende signature pieces en contactroute.
- `/werk/`: een zorgvuldig gecomponeerde galerie en een herbruikbare projectpresentatie.
- `/werk/[slug]/`: detailtemplate met beelden, projectinformatie en relevante CTA. Voorbeeldprojecten zijn noindex en staan niet in de sitemap.
- `/maatwerk/`: meubels en houtwerk, mogelijkheden, samenwerking en een begrijpelijke route van idee naar uitvoering. Splits diensten pas in eigen pagina's wanneer voldoende onderscheidende inhoud bestaat.
- `/signature-pieces/`: uitleg van de toekomstige beperkte oplages, met een CTA naar contact die "Signature pieces" alvast selecteert.
- `/werkplaats/`: Thomas, zijn ambachtelijke werkwijze en de werkplaats in Ommen. Gebruik alleen bevestigde feiten.
- `/meubelmaker-ommen/`: één inhoudelijke lokale landingspagina.
- `/contact/`: het formulier "Bespreek je idee", adres en relevante praktische informatie.
- `/privacy/`: feitelijke uitleg over de gebruikte formuliergegevens en hun verwerking. Markeer ontbrekende bedrijfs- en verwerkingsgegevens voor aanvulling; presenteer een onvolledige tekst niet als juridisch afgerond.
- Een verzorgde 404-pagina en de genoemde design-systempagina.

Schrijf alle publiekscopy in goed Nederlands: persoonlijk, concreet en rustig. Laat materialen, aandacht en de maker het verhaal dragen. Verzin geen klantnamen, reviews, projecten, ervaring in jaren, certificeringen, duurzaamheidsclaims, telefoonnummer, e-mailadres of openingstijden.

## 6. Placeholderbeelden

Er zijn nog geen echte projectfoto's. Gebruik tijdelijke, hoogwaardige meubel- en houtdetailbeelden om de compositie te laten werken. Controleer gebruiksrechten bij stockbeelden en leg de herkomst vast. Zorg dat beelden lokaal beschikbaar zijn.

Leg in de projectdata expliciet vast welke beelden en projecten placeholders zijn. Toon een discrete maar leesbare aanduiding zoals "Beeldimpressie — eigen projectfoto's volgen". Laat placeholders geen gerealiseerd Kolling-werk, echte werkplaatsfoto's of bestaande signature pieces suggereren. Voeg hieraan geen fictieve opdrachtgevers, plaatsen, jaartallen of productgegevens toe.

Maak vervanging eenvoudig: beeldbestand en contentdata aanpassen moet genoeg zijn. Documenteer dit in de README.

## 7. Lokale SEO zonder doorway abuse

Begin met Ommen als echte vestigingsplaats en beschrijf landelijke dienstverlening eerlijk. Genereer geen reeks vergelijkbare stadspagina's en verzin geen vestigingen.

De Ommen-pagina moet zelfstandig nuttig zijn: werkplaatsadres, mogelijkheden voor meubels en houtwerk, aanpak van een aanvraag, relevante vragen en een duidelijke contactroute. Ze mag geen kopie van de homepage zijn met alleen een plaatsnaamwijziging.

Implementeer unieke paginatitels en meta descriptions, canonical URLs, crawlbare interne links, logische headings, beschrijvende alt-teksten, robots.txt en een sitemap met uitsluitend indexeerbare pagina's. Gebruik passende LocalBusiness- en BreadcrumbList-structured data met alleen bekende feiten. Voeg geen verzonnen geo-coördinaten, reviews of Product/Offer-data voor placeholders toe.

Maak preview-deployments noindex. Controleer dat productie die instelling niet erft. Verberg publieke SEO-tekst niet visueel en schrijf geen opvultekst om een woordenaantal te halen.

## 8. Contactformulier zonder database

Velden: naam, e-mail, optioneel telefoonnummer, soort aanvraag, budgetcategorie en beschrijving van het idee. Gebruik zichtbare labels, toegankelijke foutmeldingen en duidelijke submit-, loading-, success- en error-states.

Verwerk inzendingen server-side via een configureerbare webhook naar een bestaand CRM of een e-mailprovider. Kies één eenvoudige initiële integratie en houd secrets uitsluitend server-side in environment variables.

Valideer ook op de server, begrens invoerlengtes, controleer de request-origin, voeg een honeypot toe en behandel time-outs en afleverfouten correct. Documenteer eventuele aanvullende spambeveiliging.

Ontbreekt de afleverconfiguratie, meld dan eerlijk dat verzending nog niet beschikbaar is. Toon nooit een succesmelding zonder geslaagde aflevering. Bewaar geen leads in een lokale JSON-file of tijdelijke serveropslag. Log geen volledige inzendingen of secrets. Test aflevering met een mock; stuur tijdens ontwikkeling geen echte berichten.

## 9. Bouwvolgorde en oplevering

1. Inspecteer de repository, leg de belangrijkste keuzes kort vast en initialiseer Astro wanneer nodig.
2. Bouw de tokens, basiscomponenten en visuele design-systempagina.
3. Bouw een overtuigende homepage en de overige routes met echte Nederlandse copy en herkenbare placeholders.
4. Implementeer contentstructuur, SEO en contactverwerking.
5. Start de lokale preview, controleer desktop en mobiel en los problemen op.

Controleer minstens 390px mobiel, 768px tablet en 1440px desktop, plus toetsenbordbediening, reduced motion en tekstvergroting. Controleer navigatie, contactvoorselectie, formulierfouten, placeholderlabels en ontbrekende afleverconfiguratie.

Voer Astro typechecking en een production build uit. Controleer tevens canonicals, sitemapuitsluitingen, structured data en gebroken interne links. Gebruik betekenisvolle tests voor contactvalidatie en foutafhandeling; voeg geen tests toe die alleen CSS-implementatie kopiëren.

Lever werkende code, lockfile, .env.example zonder secrets, een README met start/build/deployment-instructies en documentatie voor tokens, fonts, beelden en contentbeheer. Maak de wijzigingen reviewbaar in de featurebranch; publiceer niet automatisch op productie.

Rapporteer kort wat is gebouwd, welke controles zijn geslaagd en welke gegevens nog nodig zijn om live te gaan. Maak geen claim dat verzending of deployment werkt als dat niet is geverifieerd.

Begin nu met de repositoryinspectie en voer de implementatie uit.
