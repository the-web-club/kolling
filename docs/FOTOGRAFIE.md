# Fotografie

De site is gebouwd op een witte galerie: veel ruimte, rustige typografie en het hout dat de kleur brengt. Dat werkt alleen met eigen fotografie. Elk beeldslot staat nu op een plaatshouder met het label "Beeld volgt". Witruimte maakt een matig beeld niet beter, alleen groter.

## Wat er technisch nodig is

- Minimaal 3000 px op de lange zijde, zodat de responsive varianten scherp blijven.
- Daglicht, geen flits. Neutraal wit in balans, zodat eiken niet geel en noten niet rood wordt.
- Rustige achtergrond. Een witte of licht gepleisterde wand is genoeg.
- Geen filters, geen zware nabewerking, geen kunstmatige vignettering.
- Lever onbewerkte bestanden mee, zodat de uitsnede later nog kan veranderen.

## Verhoudingen

De site gebruikt vier verhoudingen. Fotografeer ruim, zodat elke uitsnede nog kan.

| Verhouding | Waarvoor |
| --- | --- |
| 3:2 liggend | totaalbeeld van een meubel in een ruimte |
| 4:5 staand | hoge kasten, detail van een verbinding, Thomas aan het werk |
| 1:1 vierkant | materiaal en close-ups |
| 16:9 breed | een wand of keuken over de volle breedte |

## Per project

Vier beelden per project zijn genoeg, in deze volgorde:

1. Totaalbeeld. Het hele meubel, recht of licht uit de hoek, met genoeg ruimte eromheen.
2. Detail van een verbinding. Waar het vakmanschap zichtbaar is: een verstek, een lade, een naad.
3. Materiaalclose-up. De tekening en de afwerking, zo dichtbij dat je de structuur ziet.
4. In situ. Het meubel in gebruik in de ruimte, met de omgeving erbij.

Lever ze aan als `src/assets/projecten/<slug>/01-totaal.jpg` enzovoort. De bestandsnamen bepalen niets, maar een vaste volgorde maakt vervangen eenvoudig.

## Werkplaats

Voor `/werkplaats` en `/werkgebied/ommen`:

1. De werkbank met gereedschap binnen handbereik, zoals het er op een werkdag uitziet.
2. Thomas aan het werk, staand 4:5. Geen poseren, wel in actie.
3. Het hout op voorraad, zodat de pagina over langskomen klopt.
4. De buitenkant van de werkplaats aan de Strangeweg, zodat bezoekers de plek herkennen.

Een opgeruimde werkplaats fotografeert beter dan een lege. Laat het werk zichtbaar.

## Homepage

Het eerste beeld op de homepage staat naast de kop en is staand (4:5). Dit is het beeld dat bepaalt of iemand verder kijkt, dus kies hier het sterkste meubel in het beste licht.

## Een plaatshouder vervangen

1. Zet het bestand in `src/assets/projecten/<slug>/`.
2. Vervang in het contentbestand `plaatshouder: { tint, label }` door `bron: ./<bestandsnaam>`.
3. Pas `alt` aan: beschrijf wat er te zien is, niet wat er komt.
4. Staan alle beelden van een project op echte foto's, zet dan `plaatshouder: false`. De pagina wordt dan indexeerbaar en komt in de sitemap.

Meer hoeft er niet te gebeuren. Astro maakt de responsive varianten tijdens de build.
