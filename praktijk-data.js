/* Gedeelde inhoud voor Promptbibliotheek, Toolchecker, AI-bestendige taken en Vragenbox.
   Pas hier de teksten aan: alle pagina's gebruiken dit ene bestand. */
const PROMPTS = [
  // ---- Algemeen
  {vak:"Alle vakken",doel:"Lesvoorbereiding",titel:"Lesplan op maat",
   tekst:"Je bent een ervaren leerkracht secundair onderwijs in Vlaanderen. Maak een lesplan van [50] minuten over [onderwerp] voor [graad/jaar/studierichting]. Lesdoel: [wat leerlingen na de les kunnen]. Geef: een activerende start, de opbouw in fasen met timing, één coöperatieve werkvorm, een korte check of het lesdoel bereikt is, en de benodigde materialen."},
  {vak:"Alle vakken",doel:"Lesvoorbereiding",titel:"Misconcepties voorspellen",
   tekst:"Welke 5 misconcepties hebben leerlingen van [graad/jaar] vaak over [onderwerp]? Geef per misconceptie: waarom leerlingen dat denken, een vraag waarmee ik ze opspoor, en een korte uitleg of voorbeeld om ze recht te zetten."},
  {vak:"Alle vakken",doel:"Differentiatie",titel:"Tekst op drie niveaus",
   tekst:"Herschrijf de onderstaande tekst op drie niveaus: (1) eenvoudig, korte zinnen, moeilijke woorden uitgelegd, (2) gemiddeld, (3) uitdagend, met een extra verdiepingsvraag. Behoud de inhoud en vaktermen. Tekst: [plak hier je tekst]"},
  {vak:"Alle vakken",doel:"Differentiatie",titel:"Ondersteuning bij dyslexie of NT2",
   tekst:"Maak een ondersteunende versie van deze opdracht voor leerlingen met dyslexie of die Nederlands als tweede taal leren: korte zinnen, één opdracht per regel, een woordenlijstje met de 8 moeilijkste woorden en een uitleg in eenvoudige taal. Opdracht: [plak hier]"},
  {vak:"Alle vakken",doel:"Differentiatie",titel:"Verrijking voor snelle leerlingen",
   tekst:"Bedenk 4 verrijkingsopdrachten over [onderwerp] voor leerlingen van [jaar] die de basisleerstof al beheersen. Geen extra werk van hetzelfde, maar verdieping: toepassen in een nieuwe situatie, onderzoeken, vergelijken of creëren. Geef per opdracht de geschatte tijd."},
  {vak:"Alle vakken",doel:"Feedback",titel:"Rubric maken",
   tekst:"Maak een rubric voor [soort opdracht] in [jaar]. Gebruik 4 criteria en 4 niveaus (onvoldoende, bijna, goed, uitstekend). Beschrijf elk niveau concreet en observeerbaar, in leerlingentaal. Leerdoelen: [plak hier]"},
  {vak:"Alle vakken",doel:"Feedback",titel:"Feedback op een anoniem leerlingenproduct",
   tekst:"Geef feedback op deze anonieme leerlingentekst volgens de rubric hieronder. Gebruik de structuur: wat is goed (2 punten), wat kan beter (2 punten, concreet), en één volgende stap. Schrijf bemoedigend en in de jij-vorm. Rubric: [plak] Tekst: [plak, zonder naam of herkenbare gegevens]"},
  {vak:"Alle vakken",doel:"Toetsvragen",titel:"Meerkeuzevragen met sterke afleiders",
   tekst:"Maak 8 meerkeuzevragen over [onderwerp] voor [jaar]. Elke vraag heeft 4 opties, waarvan de foute opties gebaseerd zijn op veelvoorkomende fouten. Varieer tussen kennis, inzicht en toepassing. Geef de sleutel met per vraag een korte uitleg waarom de afleiders fout zijn."},
  {vak:"Alle vakken",doel:"Toetsvragen",titel:"Toets controleren op kwaliteit",
   tekst:"Beoordeel deze toets kritisch: zijn de vragen eenduidig, sluiten ze aan bij de leerdoelen, is er een goede spreiding over kennis, inzicht en toepassing, en is de puntenverdeling logisch? Geef concrete verbetervoorstellen. Leerdoelen: [plak] Toets: [plak]"},
  // ---- Nederlands
  {vak:"Nederlands",doel:"Lesvoorbereiding",titel:"Leesteksten rond een thema",
   tekst:"Schrijf een informatieve tekst van [300] woorden over [thema] voor leerlingen van [jaar], met een duidelijke structuur (inleiding, kern met tussentitels, slot) en 3 signaalwoorden die ik kan laten aanduiden. Voeg 5 leesvragen toe op verschillende leesniveaus."},
  {vak:"Nederlands",doel:"Feedback",titel:"Taalfouten laten verklaren",
   tekst:"Hieronder staat een anonieme leerlingentekst. Verbeter de fouten NIET, maar maak een lijst van de 5 belangrijkste soorten fouten (bv. dt-fouten, zinsbouw) met per soort een eenvoudige regel en een oefenzin, zodat de leerling zelf kan verbeteren. Tekst: [plak]"},
  // ---- Moderne vreemde talen
  {vak:"Frans / Engels",doel:"Lesvoorbereiding",titel:"Dialoog voor spreekoefening",
   tekst:"Write a realistic dialogue in [French/English] at CEFR level [A2/B1] between two teenagers about [situation]. Use the vocabulary list below and 3 examples of [grammar point]. Add a Dutch translation of difficult expressions and 3 role-play variations. Vocabulary: [plak]"},
  {vak:"Frans / Engels",doel:"Differentiatie",titel:"Woordenschat oefenen op niveau",
   tekst:"Maak voor deze woordenlijst drie oefeningen van oplopende moeilijkheid: (1) koppelen woord–betekenis, (2) invuloefening in zinnen, (3) zelf een korte tekst schrijven met 6 woorden. Taal: [Frans/Engels], niveau: [A2]. Woorden: [plak]"},
  // ---- Wiskunde
  {vak:"Wiskunde",doel:"Differentiatie",titel:"Oefenreeks met opbouw",
   tekst:"Maak een oefenreeks over [onderwerp, bv. vergelijkingen van de eerste graad] voor [jaar]: 4 basisoefeningen, 4 oefeningen van gemiddeld niveau en 2 uitdagende contextvragen. Geef de oplossingen apart, met de tussenstappen. Controleer elke oplossing zorgvuldig."},
  {vak:"Wiskunde",doel:"Lesvoorbereiding",titel:"Wiskunde in het echte leven",
   tekst:"Geef 5 herkenbare, realistische contexten uit het leven van Vlaamse tieners waarin [wiskundig begrip] voorkomt. Werk de beste context uit tot een openingsprobleem voor de les, met een onderzoeksvraag die leerlingen zelf laat ontdekken."},
  // ---- Wetenschappen
  {vak:"Wetenschappen",doel:"Lesvoorbereiding",titel:"Proef voorbereiden",
   tekst:"Ontwerp een eenvoudige, veilige proef over [onderwerp] voor [jaar] met materiaal dat een school heeft. Geef: onderzoeksvraag, hypothese, materiaal, werkwijze in stappen, veiligheidsafspraken, en 3 verwerkingsvragen. Vermeld wat vaak misloopt."},
  {vak:"Wetenschappen",doel:"Toetsvragen",titel:"Toepassingsvragen met grafiek",
   tekst:"Maak 4 toetsvragen over [onderwerp] waarbij leerlingen een grafiek of tabel moeten interpreteren. Beschrijf de gegevens van de grafiek of tabel (verzonnen maar realistisch), stel de vragen en geef het correctiemodel."},
  // ---- Geschiedenis / Aardrijkskunde
  {vak:"Geschiedenis",doel:"Lesvoorbereiding",titel:"Bronnen laten vergelijken",
   tekst:"Stel een bronnenopdracht op over [gebeurtenis] voor [jaar]. Beschrijf twee bronnen met een verschillend perspectief (vermeld duidelijk dat ik echte bronnen moet zoeken en de beschrijvingen enkel als kader dienen). Geef vragen over herkomst, perspectief, betrouwbaarheid en vergelijking."},
  {vak:"Aardrijkskunde",doel:"Lesvoorbereiding",titel:"Casus uit de eigen streek",
   tekst:"Werk een lesactiviteit uit rond [thema, bv. overstromingen, mobiliteit] met een casus uit West-Vlaanderen of de omgeving van Torhout. Geef de leerdoelen, een kaart- of data-opdracht en 4 onderzoeksvragen. Markeer welke feiten ik zelf moet controleren."},
  // ---- Economie
  {vak:"Economie",doel:"Toetsvragen",titel:"Casusvraag voor economie",
   tekst:"Schrijf een korte, realistische casus (150 woorden) over een Vlaams bedrijf of gezin waarin [begrip, bv. vraag en aanbod] centraal staat. Voeg 4 vragen toe van kennis tot toepassing, met een correctiemodel en puntenverdeling."},
  // ---- Klaspraktijk
  {vak:"Alle vakken",doel:"Lesvoorbereiding",titel:"E-mail aan ouders (anoniem)",
   tekst:"Schrijf een korte, vriendelijke e-mail aan de ouders van [klas] over [onderwerp, bv. een uitstap, een project]. Duidelijk, warm en zonder vakjargon. Vermeld: wat, wanneer, wat ouders moeten doen. Gebruik [NAAM] en [DATUM] als plaatshouders."},
];

const TOOLS = [
  {naam:"Copilot M365 (schoolaccount)",status:"ok",wat:"Chat en hulp in Word, PowerPoint, Outlook en Teams.",uitleg:"Aangemeld met je schoolaccount blijven je gegevens binnen de beveiligde schoolomgeving. Dit is de standaardtool voor lesvoorbereiding, feedback en het werken met schooldocumenten."},
  {naam:"NotebookLM (Google)",status:"ok",wat:"Verwerkt je eigen documenten en lesnotities tot samenvattingen en antwoorden met bronvermelding.",uitleg:"Goedgekeurd voor eigen documenten en notities. Controleer de privacy-instellingen en upload geen documenten met persoonsgegevens van leerlingen."},
  {naam:"BookWidgets AI",status:"ok",wat:"AI-hulp binnen de BookWidgets-leeromgeving.",uitleg:"Goedgekeurd: pedagogisch omkaderd en geïntegreerd in onze leeromgeving, bv. voor oefeningen en feedback."},
  {naam:"Gamma.app",status:"ok",wat:"AI-gestuurde presentatietool.",uitleg:"Goedgekeurd voor presentaties en visuele inhoud. Voer geen persoonsgegevens in."},
  {naam:"ChatGPT (gratis versie)",status:"anoniem",wat:"Algemene AI-chatbot.",uitleg:"Enkel anonieme tekst die je zelf typt. Geen persoonsgegevens en geen schooldocumenten uploaden."},
  {naam:"Gemini (gratis versie)",status:"anoniem",wat:"Algemene AI-chatbot van Google.",uitleg:"Enkel anonieme tekst die je zelf typt. Geen persoonsgegevens en geen schooldocumenten uploaden."},
  {naam:"Claude (gratis versie)",status:"anoniem",wat:"Algemene AI-chatbot.",uitleg:"Enkel anonieme tekst die je zelf typt. Geen persoonsgegevens en geen schooldocumenten uploaden."},
  {naam:"Canva (Magic Studio)",status:"anoniem",wat:"AI-functies om beelden en ontwerpen te maken.",uitleg:"Handig voor affiches en lesmateriaal. Upload geen foto's van leerlingen en geen documenten met persoonsgegevens."},
  {naam:"Apps die gezichten bewerken of 'deepfakes' maken",status:"niet",wat:"Face swap, avatars op basis van foto's, stemklonen.",uitleg:"Niet toegelaten met beelden of stemmen van leerlingen of collega's. Foto's van leerlingen upload je nooit naar AI-tools."},
  {naam:"AI-detectietools",status:"niet",wat:"Tools die beweren te herkennen of een tekst door AI geschreven is.",uitleg:"Niet gebruiken om leerlingen te beoordelen: de uitslag is onbetrouwbaar en je zou leerlingenteksten naar een externe dienst sturen. Spreek liever met de leerling over het proces."},
];

const TIPS = [
  {titel:"Beoordeel het proces, niet enkel het product",tekst:"Laat leerlingen tussenversies, een logboek of een mindmap indienen. Zo zie je hoe het werk groeit, en is een volledig AI-product meteen zichtbaar.",vb:"Een betoog in drie stappen: standpunt en argumenten (les 1), eerste versie (les 2), eindversie met een korte reflectie op wat je veranderde (les 3)."},
  {titel:"Voeg een mondelinge toelichting toe",tekst:"Een kort gesprek van twee minuten over het werk toont snel of een leerling de inhoud begrijpt.",vb:"Na het indienen van een onderzoeksverslag kiest de leerkracht één grafiek en vraagt: 'Wat betekent deze daling, en waarom koos je deze bron?'"},
  {titel:"Gebruik een eigen, lokale context",tekst:"AI weet weinig over jouw klas, je les van gisteren of de eigen streek. Opdrachten die daarop steunen zijn moeilijk uit te besteden.",vb:"'Vergelijk de mobiliteitsproblemen rond de schoolpoort met de oplossing die we in de les bestudeerden. Gebruik je eigen telling van dinsdag.'"},
  {titel:"Laat leerlingen AI-output kritisch beoordelen",tekst:"Maak van AI het studieobject: leerlingen zoeken fouten, vullen aan of verbeteren een AI-tekst. Zo oefenen ze kritisch denken en leren ze de grenzen van AI kennen.",vb:"Geef een door AI geschreven samenvatting van de leerstof met drie verborgen fouten. Leerlingen zoeken ze en verklaren waarom het fout is."},
  {titel:"Vraag persoonlijke reflectie en keuzes",tekst:"Vraag naar eigen ervaringen, meningen met argumenten uit de les, of de keuzes die de leerling maakte tijdens het werk.",vb:"'Welke bron vond je het minst betrouwbaar, en waarom heb je ze toch (niet) gebruikt?'"},
  {titel:"Laat een deel in de klas gebeuren",tekst:"Het denkwerk (plannen, eerste versie, kernredenering) gebeurt in de klas; thuis wordt afgewerkt.",vb:"De inleiding en het schema van een verslag worden in de les op papier gemaakt en afgegeven; thuis wordt het verslag uitgewerkt."},
  {titel:"Kies andere vormen dan een tekst",tekst:"Schema's op papier, een model, een presentatie met vragen uit de klas of een podcast met eigen stem zijn moeilijker volledig met AI te maken.",vb:"In plaats van een tekst over de waterkringloop maken leerlingen een schema op A3 en leggen ze het aan een medeleerling uit."},
  {titel:"Vraag een AI-vermelding",tekst:"Laat leerlingen onder hun werk vermelden of en hoe ze AI gebruikten. Dat maakt AI-gebruik bespreekbaar in plaats van verborgen.",vb:"'Ik gebruikte Copilot om ideeën te zoeken voor mijn titel. De tekst schreef ik zelf.'"},
];

const FAQ = [
  {cat:"Tools",v:"Welke AI-tool gebruik ik best?",a:"Copilot M365 met je schoolaccount: je gegevens blijven binnen de beveiligde schoolomgeving en worden niet gebruikt om modellen te trainen."},
  {cat:"Privacy",v:"Mag ik een schooldocument uploaden naar ChatGPT, Gemini of Claude?",a:"Niet in de gratis versies. Daar typ je enkel anonieme tekst. Schooldocumenten werk je uit in Copilot M365 met je schoolaccount."},
  {cat:"Privacy",v:"Mag ik foto's van leerlingen of een rapport met namen in een AI-tool steken?",a:"Nee, nooit. Foto's van leerlingen en documenten met persoonsgegevens horen niet thuis in AI-tools."},
  {cat:"Lesgeven & evaluatie",v:"Mag ik een AI-detectietool gebruiken om leerlingenwerk te controleren?",a:"Nee. De school gebruikt bewust geen AI-detectietools: de uitslag is onbetrouwbaar. Spreek liever met de leerling over het proces."},
  {cat:"Lesgeven & evaluatie",v:"Hoeveel AI mag een leerling bij een opdracht gebruiken?",a:"Dat bepaal jij vooraf met een van de vier AI-labels: Verboden, Als inspiratie, Als ondersteuning of Toegestaan. Zie 'AI-bestendige taken'."},
];
