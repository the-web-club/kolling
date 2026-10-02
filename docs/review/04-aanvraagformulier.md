# 04 Aanvraagformulier

## Wat

Het formulier op `/contact`, het endpoint `src/pages/api/aanvraag.ts`, de verwerking in `src/lib/aanvraag.ts` en twaalf tests.

## Waarom zo

De verwerking zit in `src/lib/aanvraag.ts` en krijgt de configuratie als parameter mee. Het endpoint is een dunne laag die `astro:env` uitleest en de uitkomst naar een response omzet. Daardoor zijn de tests gewone unit tests zonder Astro-runtime, en is er geen `astro:env`-mock nodig.

Resend wordt via de REST API aangeroepen in plaats van met de npm-client. Eén afhankelijkheid minder en de test is een fetch-mock.

Secrets lopen via `astro:env` met `access: 'secret'`, dus ze worden op de server bij runtime gelezen en komen niet in de client terecht.

De uitkomst is een union (`gelukt`, `stil`, `veldfouten`, `onbeschikbaar`, `mislukt`), niet een boolean met een los foutobject. Daardoor dwingt het type af dat elke uitkomst een eigen response krijgt.

Spamverdenking levert `stil`: het endpoint antwoordt als bij succes maar verstuurt niets. Dat is wat de opdracht vraagt en voorkomt dat een bot de filter leert kennen.

Het tijdstempel voor de minimale invultijd wordt client-side gezet. Ontbreekt het, dan slaat de controle over in plaats van te weigeren, zodat bezoekers zonder JavaScript niet worden geblokkeerd. Een bot die direct post heeft meestal wel een tijdstempel, namelijk de waarde uit de HTML.

Zonder JavaScript werkt het formulier via een gewone POST met een 303 terug. De foutmeldingen op `/contact` worden zichtbaar via `:target`, dus zonder JavaScript.

## Open punten

Zonder JavaScript gaan de ingevulde waarden verloren bij een validatiefout en zie je alleen een algemene melding, geen fout per veld. Met JavaScript gebeurt alles zonder paginawissel en per veld. Dit is een bewuste afweging: het alternatief was `/contact` dynamisch maken, en de opdracht vraagt dat alleen het endpoint op aanvraag rendert.

Turnstile is optioneel en nog niet ingeschakeld. Zet `TURNSTILE_SECRET_KEY` niet aan zonder `PUBLIC_TURNSTILE_SITE_KEY`, want dan heeft het formulier geen token en wordt elke aanvraag stil geweigerd.

Verzending is niet tegen een echte Resend-sleutel getest. Wel getest: met een ongeldige sleutel meldt de site eerlijk dat het versturen niet lukte en verwijst naar telefoon en Instagram, zonder redirect naar `/bedankt`. De vijf stappen om aflevering echt te verifiëren staan in `docs/DEPLOY.md`.

## Hoe te testen

```bash
pnpm test
```

Handmatig, met de drie Resend-variabelen leeg: `/contact` hoort te melden dat het formulier uitstaat. Met de variabelen gevuld hoort het formulier te verschijnen. Verstuur het leeg: zes foutmeldingen, focus op het eerste foute veld. Open `/contact?aanvraag=editie`: het soort aanvraag staat voorgeselecteerd op Editie.
