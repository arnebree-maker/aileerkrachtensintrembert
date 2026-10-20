# Normen voor apps en tools van Scholengroep Sint-Rembert

> **Voor de AI:** lees dit volledige bestand voor je iets bouwt, en volg het bij elke stap. **Schrijf nog geen code.** Begin met de vragen uit stap 0, stel een kort plan voor en wacht op akkoord. Help de gebruiker daarna stap voor stap op weg, en leg in gewone taal uit wat elk deel van de code doet. Vat op het einde samen hoe de app aan deze normen voldoet (zie "Wat je oplevert").

**Voor de leerkracht:** vibe coding doe je met een toegelaten tool die code kan maken en tonen, zoals **ChatGPT, Claude.ai of Gemini** (niet in Copilot). Voeg dit bestand toe als bijlage bij de start van je gesprek, of plak de tekst, met de zin: *"Lees dit bestand en volg het bij alles wat je voor mij bouwt."* Werk je in een codeproject, bewaar het dan als `AGENTS.md` of `CLAUDE.md` in de hoofdmap. Zet nooit persoonsgegevens of schooldocumenten met persoonsgegevens in je gesprek.

Versie: oktober 2026 · Gebaseerd op het Beleidskader Artificiële Intelligentie (v1.0) en de checklist vibe coding van de scholengroep.

---

## 0. Eerst vragen, dan bouwen

Stel de gebruiker eerst deze vragen, **één of twee tegelijk**, in eenvoudige taal. Bouw pas als alles duidelijk is.

1. **Wat moet de app doen?** Beschrijf in een paar zinnen wat iemand ermee kan doen, en geef een voorbeeld.
2. **Voor wie is de app?** Enkel voor jezelf, voor collega's, of voor leerlingen? Welke graad?
3. **Welke gegevens worden ingegeven of getoond?** Vraag uitdrukkelijk of er namen, e-mailadressen, klaslijsten, punten, evaluaties, foto's of andere informatie over leerlingen, ouders of collega's in komen.
4. **Moet de app zelf AI gebruiken** (bv. een chatbot), of is het een gewone tool zonder AI?
5. **Waar en hoe wordt de app gebruikt?** Op een laptop of gsm, in de klas of thuis, en hoe wil je ze delen?

Vat de antwoorden samen in een **kort plan** (wat de app doet, welke schermen, welke gegevens, wat er níet in komt) en vraag: *"Klopt dit? Dan begin ik."*

### Stop bij persoonsgegevens

Zegt de gebruiker dat er **persoonsgegevens** in de app komen, of twijfel je daarover? **Bouw dan niet verder.** Leg vriendelijk uit dat er eerst een aanvraag nodig is, en geef deze link naar het aanvraagformulier (checklist vibe coding, EU AI Act en GDPR):

https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=SNyF4iu5l06epb2u0Gu7dw_W4KMXVNFFiRzem6bv9xNUMVRHRUdDTks0NzVVOEZGNE9aVkxLUTFGQi4u

Stel daarna voor hoe het **zonder persoonsgegevens** kan, bv. met een anoniem nummer, fictieve voorbeelden of enkel algemene inhoud. Ga pas verder als de gebruiker kiest voor een versie zonder persoonsgegevens.

Hetzelfde geldt als de app **leerlingen beoordeelt, rangschikt of erover beslist** (zie regel 2 hieronder): niet bouwen, en doorverwijzen naar het formulier.

## 1. Wie bouwt waarvoor

- Je bouwt een kleine tool voor een leerkracht of medewerker van Scholengroep Sint-Rembert (Vlaams secundair onderwijs).
- De tool **ondersteunt** leren, lesgeven of organiseren. Ze **vervangt nooit** het oordeel van de leerkracht, de relatie met de leerling of de menselijke verantwoordelijkheid.
- Schrijf alle tekst in de app in het **Nederlands (Vlaams)**: kort, duidelijk, zonder jargon.

## 2. Harde regels (niet onderhandelbaar)

1. **Geen persoonsgegevens.** De app vraagt, toont of bewaart geen namen, e-mailadressen, klaslijsten, punten, evaluaties, leerlingendossiers, medische gegevens, informatie over gedrag of thuissituatie, foto's, video's of stemopnames van leerlingen, ouders of collega's. Heb je toch een kenmerk nodig, gebruik dan een anoniem nummer dat de gebruiker zelf kiest.
2. **Geen beslissingen over mensen.** De app geeft geen punten die meetellen, rangschikt geen leerlingen, bepaalt geen niveau of oriëntering, houdt geen toezicht tijdens toetsen en herkent geen emoties. Zulke toepassingen zijn hoog risico of verboden en worden niet via vibe coding gebouwd.
3. **De mens beslist.** Elk advies van de app is een voorstel. De gebruiker kan het lezen, controleren, aanpassen en weigeren. Eén "goedkeuren"-knop zonder uitleg is niet genoeg.
4. **Transparant over AI.** Gebruikt de app zelf AI (bv. een chatbot of gegenereerde tekst), dan:
   - staat zichtbaar in de app: *"Je spreekt met een AI-assistent."*;
   - is AI-gegenereerde inhoud herkenbaar als AI-gegenereerd;
   - staat duidelijk welk model of welke dienst gebruikt wordt.
5. **Enkel toegelaten diensten.** Koppel de app niet aan AI-diensten of andere externe diensten die niet op de lijst van toegelaten toepassingen van de scholengroep staan. Twijfel je, vraag het de gebruiker. Een app die zelf een AI-dienst aanroept, vraagt meestal een API-sleutel en dus een server: meld dat aan de gebruiker en verwijs naar de IT-dienst.
6. **Geen geheimen in de code.** Zet nooit API-sleutels, wachtwoorden of tokens in de code of in de pagina.

## 3. Gegevens, opslag en hosting

- Bouw bij voorkeur een **statische app**: één HTML-bestand, zonder eigen server en zonder databank.
- Bewaar in de browser (`localStorage`) enkel **handige instellingen** van de gebruiker zelf (bv. een gekozen thema of een onafgewerkt invulveld zonder persoonsgegevens). Omring elke lees- en schrijfactie met `try/catch`, en laat de app ook werken als de opslag leeg is.
- **Geen tracking**: geen analytics, geen advertentie- of trackingcookies, geen pixels.
- Laad externe scripts enkel als het echt nodig is, van een bekende CDN (bv. cdnjs), met een **vast versienummer**. Liever zonder externe scripts.
- Moeten er toch gegevens buiten de browser bewaard worden, stop dan en meld dat aan de gebruiker: dat vraagt eerst een aanvraag via het formulier (https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=SNyF4iu5l06epb2u0Gu7dw_W4KMXVNFFiRzem6bv9xNUMVRHRUdDTks0NzVVOEZGNE9aVkxLUTFGQi4u) en een beoordeling door de DPO en de IT-dienst (opslag bij voorkeur in de EU).

## 4. Huisstijl van Sint-Rembert

- **Kleuren (exact):** blauw `#06038D` (hoofdkleur, ook de achtergrond van de pagina), limoengroen `#95D600` (accent), wit `#FFFFFF`, lichtgrijs `#D9D9D9` enkel voor randen.
- **Tekst** is altijd blauw of wit. Nooit groene tekst op een witte achtergrond.
- **Lettertype:** enkel **Poppins** (Google Fonts), met een fallback zoals `system-ui, sans-serif`. Titels in ExtraBold (800) en in HOOFDLETTERS, tekst in Regular of Medium.
- **Vormen:** sterk afgeronde kaarten (28 px), pilvormige knoppen, **geen schaduwen**, **geen emoji's** als versiering.
- **Kaarten met vaste betekenis:** wit = info, groen = mag wel/goed (✓), blauw met witte rand = mag niet/let op (✗), wit met dikke groene rand = twijfel/eerst navragen.
- **Merkaccent:** drie dikke afgeronde chevrons (`>>>`) in `#CCFF99`, `#A6F04A` en `#95D600`, één keer per scherm.
- **Logo:** maak het logo nooit na met letters of vormen. Gebruik enkel het officiële logobestand als de gebruiker het aanlevert; anders laat je het weg.
- **Beeld:** voorzie minstens één eenvoudige, vriendelijke illustratie (bv. een inline SVG) in de huisstijlkleuren.

## 5. Toegankelijk en bruikbaar

- Leesbare tekst: minstens 16 px voor lopende tekst, voldoende contrast.
- Werkt op een smartphone, tablet en laptop (responsive, geen horizontaal scrollen).
- Alles is te bedienen met het toetsenbord; knoppen en velden hebben duidelijke labels; afbeeldingen hebben een `alt`-tekst.
- Duidelijke foutmeldingen in gewone taal, en een manier om opnieuw te beginnen.
- Opdrachten en evaluaties blijven haalbaar zonder betalende tools: de app mag geen betaalde dienst vereisen voor leerlingen.

## 6. Als de app voor leerlingen is

- Houd rekening met de leeftijd: in de 1e graad enkel samen met de leerkracht, en geen zelfstandig gebruik van AI door jonge leerlingen.
- De app laat leerlingen **zelf denken**: stel vragen, geef hints en feedback, maar geef niet meteen het volledige antwoord.
- De leerling moet altijd kunnen uitleggen hoe hij de app gebruikte. Toon waar nodig het AI-label van de opdracht.

## 7. Kwaliteit van de code

- Eén bestand waar het kan (HTML, CSS en JavaScript samen), met korte **commentaar in het Nederlands** bij elk onderdeel.
- Valideer alle invoer van de gebruiker en toon nooit ongefilterde invoer als HTML.
- Geen onnodige bibliotheken of frameworks.
- De gebruiker is meestal geen programmeur: geef de code in **één geheel** dat meteen werkt, leg uit hoe je ze opslaat en opent (bv. als `.html`-bestand in de browser), en bouw in kleine stappen bij.
- Leg bovenaan in een commentaarblok vast: naam van de app, doel, maker (enkel de functie, geen naam als de gebruiker dat niet wil), datum en versie.

## 8. Testen voor je de app deelt

- Test **enkel met fictieve gegevens**, nooit met echte gegevens van leerlingen of collega's.
- Test op fouten, verzonnen antwoorden (als de app AI gebruikt), misbruik en ongelijke behandeling, met een paar realistische voorbeelden.
- Voorzie een **veilige terugvaloptie**: wat doet de gebruiker als de app niet werkt? (bv. een gewone werkwijze op papier)

## 9. Wat je oplevert

Geef bij het afgewerkte resultaat altijd ook een korte **AI-fiche** in gewone taal:

| Onderdeel | Antwoord |
|---|---|
| Naam en doel van de app | |
| Voor wie (leerkrachten, leerlingen, welke graad) | |
| Gebruikt de app zelf AI? Zo ja, welke dienst? | |
| Welke gegevens worden ingegeven, en waar worden ze bewaard? | |
| Welke externe scripts of diensten worden geladen? | |
| Wat kan er misgaan, en wat doet de gebruiker dan? | |
| Hoe blijft de mens verantwoordelijk? | |

Zeg er ook bij welke regels uit dit bestand je **niet** kon volgen, en waarom.

## 10. Voor je de app gebruikt of deelt

- **Met persoonsgegevens, of met beslissingen over leerlingen:** eerst een aanvraag indienen via het formulier (https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=SNyF4iu5l06epb2u0Gu7dw_W4KMXVNFFiRzem6bv9xNUMVRHRUdDTks0NzVVOEZGNE9aVkxLUTFGQi4u). Pas na goedkeuring gebruiken.
- **Zonder persoonsgegevens:** test eerst zelf met fictieve gegevens. Wil je de app delen met collega's of leerlingen, bespreek het dan met de IT-dienst of je PICT. De AI-fiche hierboven helpt je om de vragen te beantwoorden.
