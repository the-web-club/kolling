# Deployment

De coming-soon pagina is een statische Astro-build. Geen adapter, geen serverless functie, geen database.

## Vercel-project

1. Maak het project aan onder team **tapro** en koppel het aan de repository `the-web-club/kolling`.
2. Framework preset: **Astro**. Build command `pnpm build`, install command `pnpm install --frozen-lockfile`. De output directory laat je op de standaardwaarde staan.
3. Productie-branch: **main**. Elke andere branch levert een preview-deployment op.
4. Node 22. Dat staat in `.nvmrc` en in `engines`.

## Environment variables

Alleen `PUBLIC_SITE_URL` met de waarde `https://kolling.nl`, voor Production en Preview. Verder heeft deze pagina geen variabelen nodig; er is geen formulier en geen e-mailverzending.

De canonical en de structured data komen uit `site` in `astro.config.mjs`, niet uit een variabele, zodat een ontbrekende variabele de URL's nooit stil verkeerd zet.

## Domein

1. Voeg in Vercel zowel `kolling.nl` als `www.kolling.nl` toe.
2. Zet in de DNS van `kolling.nl` de records die Vercel laat zien: een A-record op de apex naar het IP-adres dat Vercel noemt, en een CNAME op `www` naar het Vercel-adres.
3. Stel in Vercel in dat `www.kolling.nl` doorverwijst naar de apex, zodat er één adres overblijft.
4. Wacht tot Vercel het certificaat heeft uitgegeven.

**Laat MX-, SPF-, DKIM- en DMARC-records ongemoeid.** Alleen het A-record op de apex en het CNAME op `www` veranderen. De mailinrichting op ProtonMail blijft werken; deze pagina verstuurt zelf geen e-mail.

## Na de eerste productiedeploy controleren

1. `https://kolling.nl` toont de pagina op één scherm, zonder scrollbar.
2. `https://kolling.nl/robots.txt` geeft `User-agent: *` met `Allow: /`. Staat er `Disallow: /`, dan is de productiebuild per ongeluk als preview gebouwd.
3. De HTML bevat `<meta name="robots" content="index, follow">`.
4. Een willekeurige onbekende URL geeft de eigen 404 in dezelfde stijl.
5. `https://kolling.nl/og.png` bestaat, zodat een gedeelde link een afbeelding heeft.
6. Haal de pagina door de Rich Results Test en controleer dat `LocalBusiness` wordt herkend, zonder `geo` en zonder openingstijden.
7. Meet Lighthouse mobiel op de productie-URL. Lokaal is dat niet gemeten.

## Preview-deployments

Vercel zet `VERCEL_ENV=preview`. De pagina krijgt dan `noindex, nofollow` en `robots.txt` geeft `Disallow: /`. Controleer na de eerste productiedeploy dat productie die instelling niet heeft geërfd (punt 2 hierboven).

## Later: de volledige site

De volledige site staat op branch `feature/volledige-site`. Die brengt een `@astrojs/vercel`-adapter en één serverless functie voor het aanvraagformulier mee, plus de environment variables uit die branch. Op het moment dat die branch naar `main` gaat, horen die variabelen in Vercel te staan voordat je deployt. De stappen daarvoor staan in `docs/DEPLOY.md` op die branch.
