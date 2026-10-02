# Deployment

Vercel met de officiële Astro-adapter. Alle pagina's zijn statisch; alleen `/api/aanvraag` is een serverless functie.

## Vercel instellen

1. Importeer de repository in Vercel. Het framework wordt automatisch als Astro herkend.
2. Build command `pnpm build`, output directory laat je leeg (de adapter regelt dat).
3. Node 22. Dat staat in `.nvmrc` en in `engines`.
4. Zet `kolling.nl` en `www.kolling.nl` als domeinen en laat `www` doorverwijzen naar het hoofddomein.

Verander niets aan de bestaande MX-, SPF- of DKIM-records van het hoofddomein. De mailinrichting op ProtonMail blijft zoals ze is.

## Environment variables

Zet deze in Vercel voor Production en Preview. De namen en lege waarden staan in `.env.example`.

| Variabele | Nodig | Wat het doet |
| --- | --- | --- |
| `RESEND_API_KEY` | ja, voor verzenden | API-sleutel van Resend |
| `AANVRAAG_ONTVANGER` | ja, voor verzenden | adres waar een aanvraag binnenkomt |
| `AANVRAAG_AFZENDER` | ja, voor verzenden | afzender, op het geverifieerde subdomein |
| `AANVRAAG_BCC` | nee | tweede adres dat meeleest |
| `PUBLIC_TURNSTILE_SITE_KEY` | nee | zet de Turnstile-widget aan |
| `TURNSTILE_SECRET_KEY` | nee | zet de servercontrole aan |
| `CRM_WEBHOOK_URL` | nee | tweede afnemer van een aanvraag |
| `CRM_WEBHOOK_GEHEIM` | nee | bearer-token voor die webhook |

Ontbreken de eerste drie, dan meldt `/contact` dat verzenden niet beschikbaar is en verwijst naar telefoon en Instagram. Het formulier wordt dan niet getoond. Dat is bewust: liever geen formulier dan een formulier dat stilletjes niets doet.

De Turnstile-controle is pas actief als `TURNSTILE_SECRET_KEY` staat ingevuld. Zet die dus niet aan zonder ook `PUBLIC_TURNSTILE_SITE_KEY`, want dan heeft het formulier geen token om mee te sturen en wordt elke aanvraag stil geweigerd.

## Resend op een subdomein

Verifieer `mail.kolling.nl`, niet het hoofddomein. Zo blijft de bestaande mailinrichting onaangeroerd en raakt een fout in de DNS van het subdomein de gewone mail niet.

1. Voeg in Resend het domein `mail.kolling.nl` toe.
2. Zet de records die Resend geeft bij de DNS van `kolling.nl`:
   - de DKIM-record op `resend._domainkey.mail`
   - de SPF-record op `send.mail` (dat is het return-path van Resend, niet het hoofddomein)
   - een MX-record op `send.mail` voor bounces
3. Laat de SPF-record van `kolling.nl` zelf ongemoeid.
4. Wacht tot Resend het domein als geverifieerd meldt.
5. Zet `AANVRAAG_AFZENDER` op een adres op dat subdomein, bijvoorbeeld `Kolling <site@mail.kolling.nl>`.
6. DMARC: staat er nog geen record op `kolling.nl`, begin dan met `p=none` en lees eerst de rapporten.

Zolang het subdomein niet geverifieerd is, kun je testen met het testafzenderadres van Resend naar het adres van je eigen Resend-account. Verstuur tijdens het testen geen berichten naar Thomas.

## Verzending controleren na de eerste deploy

1. Vul de drie variabelen en deploy opnieuw.
2. Open `/contact` en controleer dat het formulier er staat in plaats van de melding.
3. Verstuur één aanvraag naar je eigen adres.
4. Controleer dat de notificatie aankomt met de aanvrager als reply-to, en dat de aanvrager een bevestiging krijgt.
5. Controleer dat je op `/bedankt` uitkomt. Kom je daar niet, dan is er niets afgeleverd; de site meldt dan ook geen succes.

Meld verzending pas als werkend als deze vijf stappen zijn gelopen.

## Preview-deployments

Vercel zet `VERCEL_ENV=preview`. De site maakt dan elke pagina `noindex`, geeft `robots.txt` een volledige `Disallow: /` en laat `/sitemap.xml` een 404 geven. Controleer na de eerste productiedeploy dat `https://kolling.nl/robots.txt` wel `Allow: /` geeft, zodat productie die instelling niet heeft geërfd.

## Wat niet in deze opzet zit

Geen database, geen analytics, geen cookiemelding, geen edge middleware, geen ISR en geen Vercel-beeldoptimalisatie. Astro maakt de beeldvarianten tijdens de build.
