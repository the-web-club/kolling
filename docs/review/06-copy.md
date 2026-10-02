# 06 Copy

## Wat

`.cursor/rules/80-copy.mdc` toegevoegd en de publieke teksten daarop nagelopen: koppen, intro's, CTA's, de bevestigingsmail en de bedanktpagina.

## Wat de regel oploste

Twaalf plekken beloofden een reactie binnen twee werkdagen: acht CTA-stroken, de contactpagina, de bedanktpagina, de meta description daarvan en de bevestigingsmail. Die termijn is nergens bevestigd. Alles is nu geformuleerd zonder termijn, en de vraag staat als bewering in `site.json` zodat de site het later wel mag beloven.

Vijf pagina's hadden woord voor woord dezelfde CTA-tekst. Dat is precies het patroon dat de regel "steeds dezelfde vorm" noemt. Elke CTA is nu specifiek voor de pagina waar hij staat, van "Zoiets, maar voor jouw ruimte" op `/werk` tot "Waar je ook zit" op `/werkgebied`.

De kop "Wat we maken" op de homepage las als een bedrijf met personeel. Thomas werkt alleen, dus dat is nu "Wat Thomas maakt". De `we`-vorm staat alleen nog in de processtappen, waar het om jou en Thomas samen gaat.

De secundaire CTA heette "Bezoek de werkplaats" maar linkte naar een informatiepagina. Dat is nu "Langskomen in Ommen", wat wel bij de bestemming past.

## Toon

De regel vraagt speels, toegankelijk en verzorgd. Dat zit nu in een paar gerichte plekken in plaats van overal: "Ook Thomas heeft zo zijn ideeën" boven de Edities, "Wat heb je in gedachten?" als kop op `/contact` en als afsluitende CTA, en "Je idee mag nog een beetje scheef zijn" als contactintro. Dienstpagina's, formulierlabels, foutmeldingen en de privacytekst blijven direct, want daar vertraagt een knipoog het begrip.

De eerdere copyregel in `20-content-seo.mdc` sprak dit tegen op twee punten: korte zinnen als doel, en geen gedachtestreepjes. Die sectie verwijst nu naar `80-copy.mdc` en houdt alleen de structurele eisen over, zodat er één bron voor de stem is.

## Open punten

Vijf site-brede beweringen staan nu in `src/content/instellingen/site.json` en komen bovenaan in `docs/FEITENCHECK.md`: de reactietermijn, of er altijd een bevestigingsmail hoort, WhatsApp, bezoektijden, en hoe Thomas zelf aangeduid wil worden. Dat laatste raakt elke pagina, dus het is het waard om vroeg te beslissen.

Totaal staan er nu 40 open beweringen.

## Hoe te testen

```bash
pnpm check
pnpm build
```

Scan de gegenereerde pagina's op `werkdagen`, `gratis advies` en `vrijblijvend`: die mogen nergens voorkomen. Controleer dat de acht CTA-stroken verschillende teksten hebben en dat de secundaire knop "Langskomen in Ommen" heet.
