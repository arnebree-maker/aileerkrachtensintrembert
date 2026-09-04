// ===== STATE =====
const K = 'sr_leerlingen_v2';
let localStorageAvailable = false;
let S = { 
  name:'', 
  modules_done:[], 
  quiz_scores:{}, 
  starttest_taken:false, 
  starttest_score:0,
  reflections: {},
  casus_answers: {}
};

function ld(){
  try{ S = JSON.parse(localStorage.getItem(K)) || S; localStorageAvailable=true; }
  catch(e){ localStorageAvailable=false; S={name:'', modules_done:[], quiz_scores:{}, starttest_taken:false, reflections:{}, casus_answers:{}}; }
}
ld();

function ss(){
  if(!localStorageAvailable) return;
  try{ localStorage.setItem(K, JSON.stringify(S)); }catch(e){}
}

function saveReflection(key, value){
  S.reflections[key] = value;
  ss();
}

function getReflection(key){
  return S.reflections[key] || '';
}

// ===== UI HELPERS =====
function sv(id){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  if(id==='cert'){ document.getElementById('cert-view').style.display='block'; document.getElementById('nav-cert').classList.add('active'); updateCert(); document.getElementById('main').scrollTo({top:0}); return; }
  document.getElementById('view-'+id).classList.add('active');
  document.getElementById('nav-'+id).classList.add('active');
  document.getElementById('main').scrollTo({top:0});
}

function sm(n){
  if(!S.starttest_taken){ startCourse(); return; }
  renderModule(n);
  sv('mod'+n);
}

function goHome(){ 
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  sv('home');
}

function startCourse(){
  showNameEntry();
  renderStartTest();
  sv('starttest');
}

function showNameEntry(){
  if(S.name) return;
  const name = prompt('Wat is je naam? (voornaam volstaat)');
  if(name){ S.name=name.trim(); ss(); document.getElementById('un').value=S.name; }
}

function sn(){ S.name = document.getElementById('un').value.trim(); ss(); }

// ===== STARTTEST =====
function renderStartTest(){
  const questions = [
    { q:'Wat doet AI vooral?', o:['Denken','Patronen herkennen in data','Alles kunnen','Robots zijn'], a:1 },
    { q:'ChatGPT genereert tekst door...?', o:['Op Google zoeken','Volgende woorden raden op basis van statistieken','Je vragen begrijpen','Magie'], a:1 },
    { q:'Een "hallucination" betekent...?', o:['Dromen hebben','AI geeft verzonnen info','Bang zijn','Slecht luisteren'], a:1 },
    { q:'Sint-Rembert Label 1 betekent...?', o:['Je mag AI gebruiken','Geen AI, helemaal zelf','AI is verboden voor altijd','Jij kiest'], a:1 },
    { q:'Wat is het belangrijkste bij AI in school?', o:['Zo snel mogelijk klaar','Jij begrijpt wat je aflevert','Niemand mag het weten','AI is altijd beter'], a:1 },
  ];

  let html = `<div class="module-card">
    <h2>Welkomtest — Wat weet je al?</h2>
    <p style="font-size:13px; color:#666; margin-bottom:20px;">5 vragen. Geen druk — dit is om te zien waar je staat! 😊</p>
    <div id="st-questions"></div>
    <button class="sr-btn g" onclick="checkStartTest()" style="margin-top:20px; width:100%;">Klaar! → Start module 1</button>
  </div>`;

  let qhtml='';
  questions.forEach((q,i)=>{
    qhtml += `<div class="st-q" style="margin-bottom:20px;">
      <div style="font-weight:600; margin-bottom:8px;">${i+1}. ${q.q}</div>
      <div id="stq${i}"></div>
    </div>`;
  });

  document.getElementById('view-starttest').innerHTML = html;
  document.getElementById('st-questions').innerHTML = qhtml;

  questions.forEach((q,i)=>{
    const opts = q.o.map((o,j)=>`<button class="st-btn" data-q="${i}" data-a="${j}" onclick="clickSTQ(this)">${o}</button>`).join('');
    document.getElementById('stq'+i).innerHTML = opts;
  });

  window.stQuestions = questions;
}

function clickSTQ(btn){
  const q = +btn.dataset.q;
  document.querySelectorAll(`[data-q="${q}"]`).forEach(b=>b.style.opacity='0.4');
  btn.style.opacity='1';
  btn.style.fontWeight='700';
}

function checkStartTest(){
  let score=0, tot=window.stQuestions.length;
  window.stQuestions.forEach((q,i)=>{
    const selected = document.querySelector(`[data-q="${i}"][style*="font-weight"]`);
    if(selected && +selected.dataset.a === q.a) score++;
  });
  S.starttest_taken = true;
  S.starttest_score = Math.round(100*score/tot);
  ss();
  sv('mod1');
  renderModule(1);
}

// ===== MODULES =====
const modules = [
  { id:1, title:'Wat is AI echt?', icon:'🤔', duration:'1 uur', intro:'Voorbij Hollywood' },
  { id:2, title:'ChatGPT & Copilot', icon:'💬', duration:'1.5 uur', intro:'Hands-on leren' },
  { id:3, title:'Goeie prompts', icon:'✍️', duration:'1 uur', intro:'TRICK-formule' },
  { id:4, title:'Hallucineringen & Bias', icon:'⚠️', duration:'50 min', intro:'Valkuilen' },
  { id:5, title:'AI in jouw schoolwerk', icon:'📝', duration:'1.5 uur', intro:'Sint-Rembert labels' },
  { id:6, title:'Ethische vragen', icon:'🤝', duration:'1 uur', intro:'Impact & kritisch denken' }
];

// Sint-Rembert beleidskader
const SR = {
  labels: [
    { num: 1, name: 'Geen AI', emoji: '❌', desc: 'Helemaal zelf, pen & papier' },
    { num: 2, name: 'Ideeën', emoji: '💡', desc: 'AI voor brainstorm, jij schrijft' },
    { num: 3, name: 'Bewerking', emoji: '✏️', desc: 'AI helpt taal/spelling, inhoud jij' },
    { num: 4, name: 'Aanvulling', emoji: '🆗', desc: 'AI vult delen aan, jij controleert' },
    { num: 5, name: 'Vrij', emoji: '🚀', desc: 'AI volledig vrij, jij reflecteert' }
  ],
  principles: [
    'Als je voelt dat je vals speelt, dan waarschijnlijk wel',
    'Controleer AI-antwoorden altijd',
    'Zeg tegen leraren welke AI je gebruikt',
    'Citeer AI als bron',
    'Begrijp wat je aflevert'
  ]
};

function renderModule(n){
  const mod = modules[n-1];
  let html = `<div class="module-card">
    <div class="mod-header">
      <div style="font-size:48px;">${mod.icon}</div>
      <div>
        <h2>${mod.title}</h2>
        <p class="mod-intro">${mod.intro}</p>
        <p style="font-size:11px; color:#999;">⏱️ ${mod.duration}</p>
      </div>
    </div>`;

  if(n===1){
    html += `
      <h3>🎬 VIDEO: Wat is AI?</h3>
      <p>EDUbox legt het uit — simpel & grappig:</p>
      <div class="yt-wrap"><iframe src="https://www.youtube.com/embed/sosmC2h4LLE" allowfullscreen loading="lazy"></iframe></div>

      <h3>🚀 De waarheid over AI</h3>
      <p><strong>❌ HOLLYWOOD ZEGT:</strong> "AI is bewust, intelligent, superkrachtig!"</p>
      <p><strong>✅ WERKELIJKHEID:</strong> AI is eigenlijk vrij dom. Het doet wat het trainingsdata zegt.</p>

      <div class="info-box">
        <strong>Waarom? Voorbeeld:</strong><br>
        Stel: Je leert AI alleen op tweets over voetbal.<br>
        Dan zal AI het meeste goed doen over voetbal, maar compleet fout gaan over medicine. Het "weet" niks, het herkennen gewoon patronen.
      </div>

      <h3>⚙️ Hoe werkt ChatGPT technisch?</h3>
      <p><strong>Stap 1: Gigantische dataset</strong><br>
      ChatGPT las miljarden woorden: internet, boeken, alles.</p>

      <p><strong>Stap 2: Patroon-herkenning</strong><br>
      "Na 'Hallo', volgt meestal 'hoe gaat het' → onthoud dit patroon"<br>
      "Na 'Dear', volgt meestal 'Sir' → onthoud dit"<br>
      Triljoenen van zulke patronen!</p>

      <p><strong>Stap 3: Jij vraagt iets</strong><br>
      "Leg fotosynthese uit"</p>

      <p><strong>Stap 4: AI gokt volgende woorden</strong><br>
      "Fotosynthese" → volgende woord is waarschijnlijk "is"<br>
      "Fotosynthese is" → volgende woord is waarschijnlijk "het"<br>
      "Fotosynthese is het" → volgende woord is waarschijnlijk "proces"<br>
      "Fotosynthese is het proces" → volgende woord is waarschijnlijk "waarbij"<br>
      → Enzovoort!</p>

      <div class="tip-box">
        💡 <strong>KEY INSIGHT:</strong> AI "weet" niks. Het gokt statisch voort wat waarschijnlijk volgt. Dus: AI liegt als het gevraagd wordt iets "te weten" dat niet in zijn training zat!
      </div>

      <h3>🎮 Doe-opdracht: Herken AI</h3>
      <p>Welke van deze gebruiken AI?</p>
      <div id="m1-ai-check"></div>

      <h3>❓ Reflectievraag</h3>
      <p>Waar heb jij AI vandaag al gebruiktkwijt zonder het te weten?</p>
      <textarea id="m1-reflect" placeholder="Schrijf hier..." style="width:100%; height:60px; padding:8px; border:1px solid #ddd; border-radius:4px; font-family:inherit;" onchange="saveReflection('m1', this.value)">${getReflection('m1')}</textarea>

      <div id="m1quiz"></div>
    `;
  } else if(n===2){
    html += `
      <h3>🎯 HANDS-ON: ChatGPT & Copilot gebruiken</h3>
      
      <h3>📍 Waar vind je ze?</h3>
      <div style="display:grid; gap:16px; margin:16px 0;">
        <div class="info-box">
          <strong>ChatGPT (gratis)</strong><br>
          Ga naar: chat.openai.com<br>
          Maak account met je email
        </div>
        <div class="info-box">
          <strong>Copilot (ook gratis)</strong><br>
          Via je school-Microsoft account<br>
          Of: copilot.microsoft.com
        </div>
      </div>

      <h3>⚡ Je eerste 5 minuten</h3>
      <p><strong>STAP 1:</strong> Log in en start chat</p>
      <p><strong>STAP 2:</strong> Vraag: "Wat is fotosynthese?" (simpel)</p>
      <p><strong>STAP 3:</strong> Lees antwoord</p>
      <p><strong>STAP 4:</strong> Vervolgvraag: "Leg het uit voor een 8-jarige"</p>
      <p><strong>STAP 5:</strong> Kijk hoe AI hetzelfde concept ander aanpakt!</p>

      <h3>🎬 VIDEO: AI in praktijk</h3>
      <p>Arjen Lubach over onderwijs & AI:</p>
      <div class="yt-wrap"><iframe src="https://www.youtube.com/embed/xpedFIZFmhc" allowfullscreen loading="lazy"></iframe></div>

      <h3>💼 CASUS 1: Huiswerk Essays</h3>
      <div class="casus-box">
        <strong>Situatie:</strong> Je moet een essay over klimaatverandering schrijven (750 woorden).<br>
        Je hebt ChatGPT al 3 uur aan het proberen.
      </div>

      <p><strong>Vraag:</strong> Mag dit volgens Sint-Rembert?</p>
      <div id="casus1"></div>

      <h3>💭 Reflectie</h3>
      <p>Wat vind je het moeilijkste: het verschil zien tussen "AI gebruiken" en "vals spelen"?</p>
      <textarea id="m2-reflect" placeholder="..." style="width:100%; height:60px; padding:8px; border:1px solid #ddd; border-radius:4px; font-family:inherit;" onchange="saveReflection('m2', this.value)">${getReflection('m2')}</textarea>

      <div id="m2quiz"></div>
    `;
  } else if(n===3){
    html += `
      <h3>✍️ TRICK-Formule: Betere Prompts</h3>
      
      <p>Een slechte prompt → slecht antwoord. Een goeie prompt → briljant antwoord!</p>

      <div class="compare-box">
        <div style="background:#fee; padding:12px; border-radius:8px; margin-bottom:12px;">
          <strong style="color:#c00;">❌ SLECHT:</strong><br>
          "Schrijf een essay"
        </div>
        <div style="background:#efe; padding:12px; border-radius:8px;">
          <strong style="color:#0a0;">✅ GOED:</strong><br>
          "Schrijf essay 500 woorden, Nederlands 2de graad, topic klimaat, inhoud: oorzaken + gevolgen + oplossingen, formeel Nederlands"
        </div>
      </div>

      <h3>🎯 TRICK = Taak, Rol, Inhoud, Context, Kwaliteit</h3>
      
      <p><strong>T = TAAK</strong><br>
      Wat wil je dat AI doet? (schrijven, samenvatten, vertalen, brainstorm)<br>
      ➡️ <em>"Schrijf een essay"</em></p>

      <p><strong>R = ROL</strong><br>
      Speelt AI een rol? (docent, coach, tutor, taalcorrector)<br>
      ➡️ <em>"Je bent een Nederlands-docent"</em></p>

      <p><strong>I = INHOUD</strong><br>
      Waarover precies? (onderwerp, topic, context)<br>
      ➡️ <em>"Over klimaatverandering in België"</em></p>

      <p><strong>C = CONTEXT</strong><br>
      Voor wie, welke klas, welk doel?<br>
      ➡️ <em>"Voor 2de graad Nederlands, 750 woorden"</em></p>

      <p><strong>K = KWALITEIT</strong><br>
      Hoe lang, welke toon, welk niveau?<br>
      ➡️ <em>"Formeel Nederlands, begrijpelijk, 750 woorden"</em></p>

      <h3>VOORBEELD TRICK-PROMPT (COMPLEET)</h3>
      <div class="example-box" style="background:#fff9e6; border-left:4px solid #ff9500; padding:12px; border-radius:4px;">
        <strong>"Je bent een Nederlands-docent voor 2de graad. Schrijf een essay (750 woorden) over klimaatverandering in België. Include: oorzaken, gevolgen voor Nederland, mogelijke oplossingen. Toon: formeel Nederlands, begrijpelijk voor 14-jarigen, met bronvermelding."</strong>
      </div>

      <h3>📝 OEFENING: Jij schrijft TRICK-prompt</h3>
      <p>Onderwerp: Een wiskundehuiswerk samenvatting</p>
      <textarea id="m3-prompt" placeholder="Schrijf je eigen TRICK-prompt hier..." style="width:100%; height:100px; padding:8px; border:1px solid #ddd; border-radius:4px; font-family:inherit;"></textarea>

      <h3>💼 CASUS 2: Vakspecifieke voorbeelden</h3>
      
      <div style="margin:20px 0;">
        <strong style="color:#2196f3;">NEDERLANDS:</strong> "Analyseer 'Een droevig gezin' van Herman de Coninck. Include: toon, thema's, stijlmiddelen. Zelf: geef je eigen interpretatie."
      </div>

      <div style="margin:20px 0;">
        <strong style="color:#e91e63;">WISKUNDE:</strong> "Ik snap stochastiek niet. Leg uit (als ik 13 ben): kans, waarschijnlijkheid, combinatorica. Met voorbeelden uit sport/spelletjes."
      </div>

      <div style="margin:20px 0;">
        <strong style="color:#ff9500;">BIOLOGIE:</strong> "Maak studiekaarten over mitose (stap-voor-stap). Format: [Fase] → [Wat gebeurt] → [Duur]."
      </div>

      <div id="m3quiz"></div>
    `;
  } else if(n===4){
    html += `
      <h3>⚠️ Hallucineringen: AI verzint dingen</h3>
      
      <p>AI klinkt erg overtuigend. Zelfs als het LIEGT.</p>

      <h3>🎬 Voorbeeld Hallucination</h3>
      <div class="alert-box" style="background:#ffebee; border-left:4px solid #c00; padding:12px; margin:12px 0;">
        <strong style="color:#c00;">JIJ:</strong> "Welke film won de Gouden Palm in 2023?"<br>
        <strong style="color:#c00;">AI:</strong> "De film 'Stardust Journey' van regisseur Maria Volkov."<br>
        <strong style="color:#0a0;">REALITEIT:</strong> FOUT! Het was "Anatomy of a Fall" van Justine Triet.
      </div>

      <p><strong>Waarom liegt AI?</strong><br>
      AI "weet" niet wat waar is. Het gokt gewoon volgende woorden. Als de echte antwoord niet in het trainingdata zat (of ambigu), gokt AI: "Nou, logisch volgende woord is waarschijnlijk..."</p>

      <h3>🔍 Hoe herken je hallucineringen?</h3>
      
      <p><strong>✅ CONTROLECHECK 1: Google het</strong><br>
      Als AI zegt "Pikachu is de eerste Pokémon", Google het. (FOUT! Bulbasaur/Charmander/Squirtle zijn eerste!)</p>

      <p><strong>✅ CONTROLECHECK 2: Stel 2x dezelfde vraag</strong><br>
      Vraag 1: "Wie was voorzitter van Frankrijk in 1995?"<br>
      AI: "Jacques Chirac"<br>
      Vraag 2 (in nieuw chat): "Wie leidde Frankrijk in 1995?"<br>
      AI: "François Mitterrand"<br>
      → Verschillende antwoorden? Hallucineringen verdacht!</p>

      <p><strong>✅ CONTROLECHECK 3: Wees voorzichtig met...</strong></p>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:16px 0;">
        <div class="alert-box" style="background:#fff3cd; border-left:4px solid #ff9;">
          <strong>RISKANT:</strong><br>
          • Specifieke getallen<br>
          • Namen van personen<br>
          • Historische data<br>
          • Statistieken
        </div>
        <div class="alert-box" style="background:#e8f5e9; border-left:4px solid #4caf50;">
          <strong>VEILIG:</strong><br>
          • Concepten uitleggen<br>
          • Brainstorm ideeën<br>
          • Strukturen aanbieden<br>
          • Taalcorrectie
        </div>
      </div>

      <h3>⚖️ Bias: AI herhaalt vooroordelen</h3>
      
      <p>AI leert van internet. Internet zit vol stereotypes. Dus AI ook.</p>

      <h3>📋 CASUS 3: Bias Erkennen</h3>
      <div class="casus-box">
        <strong>Situatie 1:</strong> "Beschrijf een CEO"<br>
        AI noemt veel vaker mannelijke namen. → GENDERBIAS
      </div>

      <div class="casus-box">
        <strong>Situatie 2:</strong> "Wat doen immigranten?"<br>
        AI geeft veel negativer beeld dan in werkelijkheid. → CULTURAL BIAS
      </div>

      <h3>🔧 Hoe herken JIJ bias?</h3>
      
      <p><strong>TEST 1:</strong> Stel vraag met male/female variant</p>
      <p>"Beschrijf een succesvol zakenman" vs "Beschrijf een succesvolle zakenvrouw"<br>
      → Zijn antwoorden significant anders?</p>

      <p><strong>TEST 2:</strong> Zoek stereotypes</p>
      <p>Leest het antwoord als "alle X zijn Y"?<br>
      → RED FLAG!</p>

      <p><strong>TEST 3:</strong> Meld het</strong><br>
      Zeg het tegen je leraar: "AI heeft bias tegen X."</p>

      <div id="m4quiz"></div>
    `;
  } else if(n===5){
    html += `
      <h3>📝 AI in JOUW Schoolwerk</h3>
      
      <p><strong>De grote vraag: Mag dit of mag dit niet?</strong></p>
      <p>Antwoord: <strong>Hangt af van de LABEL!</strong></p>

      <h3>🏷️ Sint-Rembert AI-Labels</h3>
      
      <div style="display:grid; gap:12px; margin:20px 0;">
        <div class="label-card" style="background:#fce4ec; border-left:4px solid #e91e63; padding:12px; border-radius:8px;">
          <strong style="color:#ad1457;">Label 1: ❌ GEEN AI</strong><br>
          Helemaal zelf. Pen & papier. GEEN digitale hulp.
        </div>

        <div class="label-card" style="background:#e3f2fd; border-left:4px solid #2196f3; padding:12px; border-radius:8px;">
          <strong style="color:#1565c0;">Label 2: 💡 IDEEËN</strong><br>
          AI mag brainstorm helpen. Jij schrijft alles zelf.
        </div>

        <div class="label-card" style="background:#f3e5f5; border-left:4px solid #9c27b0; padding:12px; border-radius:8px;">
          <strong style="color:#6a1b9a;">Label 3: ✏️ BEWERKING</strong><br>
          AI helpt taal/spelling/grammatica. Jij bepaalt inhoud.
        </div>

        <div class="label-card" style="background:#fff3e0; border-left:4px solid #ff9800; padding:12px; border-radius:8px;">
          <strong style="color:#e65100;">Label 4: 🆗 AANVULLING</strong><br>
          AI vult delen aan. Jij checkt, integreert, en verantwoordt.
        </div>

        <div class="label-card" style="background:#fce4ec; border-left:4px solid #e91e63; padding:12px; border-radius:8px;">
          <strong style="color:#ad1457;">Label 5: 🚀 VRIJ</strong><br>
          AI helemaal vrij! Jij doet onderzoek, controle & reflectie.
        </div>
      </div>

      <h3>💼 CASUS 4-8: Welk Label?</h3>
      
      <div class="casus-box">
        <strong>CASUS 4 (Nederlands):</strong> "Schrijf een essay over een boek, 100% met AI, levert in zonder bronvermelding"<br>
        ➡️ Label? <strong>❌ NIET TOEGESTAAN (vals spelen)</strong>
      </div>

      <div class="casus-box">
        <strong>CASUS 5 (Wiskunde):</strong> "AI helpt me stappen-voor-stappen doorlopen, ik schrijf zelf op en snap het"<br>
        ➡️ Label? <strong>✅ Label 2-3 (OK)</strong>
      </div>

      <div class="casus-box">
        <strong>CASUS 6 (Onderzoek):</strong> "AI geeft ideeën, ik zoek echte bronnen, schrijf zelf, citeer AI"<br>
        ➡️ Label? <strong>✅ Label 4-5 (OK)</strong>
      </div>

      <div class="casus-box">
        <strong>CASUS 7 (Presentatie):</strong> "Leraar zei: gebruik AI voor structuur, jij vult inhoud in"<br>
        ➡️ Label? <strong>✅ Label 2-3 (OK)</strong>
      </div>

      <div class="casus-box">
        <strong>CASUS 8 (Toets):</strong> "Gebruik AI tijdens toets"<br>
        ➡️ Label? <strong>❌ NOOIT (vals spelen per definitie)</strong>
      </div>

      <h3>🎯 Sint-Rembert 5 Gouden Regels</h3>
      
      <div style="background:#e8f5e9; padding:16px; border-radius:8px; margin:20px 0; border-left:4px solid #4caf50;">
        <ol style="color:#2e7d32; font-weight:600;">
          <li>Als je voelt dat je vals speelt → je speelt waarschijnlijk vals</li>
          <li>Controleer AI-antwoorden ALTIJD met je leerboek</li>
          <li>Zeg tegen je leraar welke AI je gebruikte</li>
          <li>Citeer AI als bron in je bronlijst</li>
          <li>Begrijp wat je aflevert — je kunt erover praten!</li>
        </ol>
      </div>

      <h3>📊 Reflectie</h3>
      <p>Vind je het moeilijk om het verschil te zien tussen "AI gebruiken" en "vals spelen"? Waarom?</p>
      <textarea id="m5-reflect" placeholder="..." style="width:100%; height:80px; padding:8px; border:1px solid #ddd; border-radius:4px; font-family:inherit;" onchange="saveReflection('m5', this.value)">${getReflection('m5')}</textarea>

      <div id="m5quiz"></div>
    `;
  } else if(n===6){
    html += `
      <h3>🤝 Ethische vragen & Impact</h3>
      
      <p>AI is cool, maar ook ingewikkelder.</p>

      <h3>❓ Vragen om over na te denken</h3>

      <div class="question-box">
        <strong>Q1: Mag je AI gebruiken zonder te zeggen dat het AI is?</strong><br>
        (bijv. een essay als je eigen werk presenteren, maar AI schreef het)
        <div style="font-size:12px; color:#2e7d32; margin-top:8px; font-weight:600;">
          ➡️ NEE. Transparantie is cruciaal. Zeg tegen je leraar!
        </div>
      </div>

      <div class="question-box">
        <strong>Q2: Bias bij AI — schuld van AI of van de maker?</strong><br>
        (AI geeft seksistische antwoorden)
        <div style="font-size:12px; color:#2e7d32; margin-top:8px; font-weight:600;">
          ➡️ MAKER/BEDRIJF. AI doet wat trainingsdata zegt.
        </div>
      </div>

      <div class="question-box">
        <strong>Q3: Mag je AI gebruiken als je alles zelf moet leren?</strong><br>
        (leraar wil dat je "het zelf leert")
        <div style="font-size:12px; color:#2e7d32; margin-top:8px; font-weight:600;">
          ➡️ HANGT AF. Leer je werkelijk? Test jezelf: kun je het zonder AI?
        </div>
      </div>

      <div class="question-box">
        <strong>Q4: Wat als iedereen AI gebruikt? Dan moet ik toch ook?</strong><br>
        (groepsdruk)
        <div style="font-size:12px; color:#2e7d32; margin-top:8px; font-weight:600;">
          ➡️ NOPE. Net als bij afkijken: "anderen doen het" is geen excuus. Sint-Rembert heeft regels!
        </div>
      </div>

      <h3>🌍 BREDER: AI & Samenleving</h3>

      <p><strong>📱 Privacy:</strong><br>
      Wie houdt je data van je AI-chats? OpenAI? Microsoft?<br>
      ➡️ Antwoord: Ze gebruiken het NIET voor modeltraining, maar ze weten wél wat je vraagt!</p>

      <p><strong>💼 Werk:</strong><br>
      Vervangt AI banen?<br>
      ➡️ Antwoord: Sommige ja, maar nieuwe banen ontstaan ook. Waardoor je goed moet LEREN!</p>

      <p><strong>🗞️ Nepnieuws:</strong><br>
      Kan AI gebruikt voor disinformatie?<br>
      ➡️ Antwoord: JA! Slechte actoren kunnen AI gebruiken voor fake videos/teksten. Daarom: KRITISCH LEZEN!</p>

      <p><strong>🎨 Creativiteit:</strong><br>
      Is AI-kunst echt kunst? Hebben artiesten rechten?<br>
      ➡️ Antwoord: Juridisch ingewikkeld. Ethisch: kunstenaars verdienen respect & vergoeding!</p>

      <h3>📰 CASUS 9: Nepnieuws</h3>
      <div class="casus-box">
        <strong>Situatie:</strong> Je ziet viral artikel: "Minister zegt onderwijsbudget verdubbeld!"<br>
        Met quote + officiële toon. Maar... je voelt iets geks.
      </div>

      <p><strong>Mogelijkheden:</strong></p>
      <div style="display:grid; gap:8px;">
        <div>□ AI-gegenereerd nepbericht (deepfake)</div>
        <div>□ Nep-quote (AI verzin quotes)</div>
        <div>□ Echt artikel (maar slecht begrijpen)</div>
      </div>

      <p><strong>Wat doe jij?</strong></p>
      <div style="display:grid; gap:8px; margin:12px 0;">
        <div>→ Google originele bron</div>
        <div>→ Check officiële website overheid</div>
        <div>→ Lees meerdere nieuwsbronnen</div>
        <div>→ Vertrouw NOOIT 1 artikel blind!</div>
      </div>

      <h3>💭 FINALE Reflectie</h3>
      <p><strong>Wat vind jij de GROOTSTE voordeel EN het GROOTSTE risico van AI in jouw leven?</strong></p>
      <textarea id="m6-reflect" placeholder="Schrijf uitgebreid..." style="width:100%; height:100px; padding:8px; border:1px solid #ddd; border-radius:4px; font-family:inherit;" onchange="saveReflection('m6', this.value)">${getReflection('m6')}</textarea>

      <h3>🎓 Je bent KLAAR!</h3>
      <p>Je hebt alle 6 modules gedaan. Je bent nu een AI-skills expert! 🚀</p>
      <p>Nu: Download je certificaat!</p>

      <div id="m6quiz"></div>
    `;
  }

  html += `<div style="margin-top:30px; display:flex; gap:12px; justify-content: space-between;">
    <button class="sr-btn b" onclick="prevModule(${n})">← Vorige</button>
    <div id="m${n}-progress" style="text-align:center; font-size:12px; color:#999;"></div>
    <button class="sr-btn g" onclick="nextModule(${n})">Volgende →</button>
  </div>`;

  html += `</div>`;
  document.getElementById('view-mod'+n).innerHTML = html;
  renderQuiz(n);
  updateProgress();
}

function prevModule(n){
  if(n>1) sm(n-1);
}

function nextModule(n){
  S.modules_done.push(n);
  ss();
  if(n<6) sm(n+1);
  else { alert('🎉 GEWELDIG! Je hebt alles afgerond!'); sv('cert'); }
}

// ===== QUIZZES (EXTENDED) =====
const quizzes = {
  1: [
    { q:'AI is vooral...?', o:['Een denkend brein','Software die patronen herkent','Een robot','Magie'], a:1 },
    { q:'Waarom liegt AI soms?', o:['Om lastig te zijn','Het "weet" niet wat waar is','Het is stuk','Hackers doen het'], a:1 },
  ],
  2: [
    { q:'Waar log je in ChatGPT?', o:['chat.openai.com','google.com','microsoft.com','alleen op school'], a:0 },
    { q:'Wat CHECK je altijd na AI-antwoord?', o:['Of het mooi klinkt','Met je leerboek/Google','Spelling','Niets, AI is perfect'], a:1 },
  ],
  3: [
    { q:'TRICK-formule voor prompts = ?', o:['Taak, Rol, Inhoud, Context, Kwaliteit','Tekst, Respect, Info, Code, Keuze','Truc, Risico, Inhoud, Check, Kunst','Iets anders'], a:0 },
    { q:'Beste prompt-strategie?', o:['Kort en vaag','Duidelijk, gedetailleerd, met context','Heel lang','Alleen vragen'], a:1 },
  ],
  4: [
    { q:'Hallucination = AI geeft...?', o:['Dromen','Verzonnen info','Slecht antwoord','Slechte taal'], a:1 },
    { q:'Bias bij AI = schuld van...?', o:['AI zelf','Maker/bedrijf','Niemand','Gebruiker'], a:1 },
  ],
  5: [
    { q:'Label 1 = ?', o:['Beetje AI','GEEN AI, helemaal zelf','AI vrij','AI verboden'], a:1 },
    { q:'Sint-Rembert gouden regel #1 = ?', o:['AI is altijd goed','Als je vals voelt, je vals waarsch','Zeg niks tegen leraar','AI is altijd fout'], a:1 },
  ],
  6: [
    { q:'Mag AI zonder bronvermelding?', o:['Ja','Nee, citeer het','Alleen mondeling','Leraar bepaalt'], a:1 },
    { q:'Transparantie = ?', o:['Het is duidelijk','Zeggen dat het AI is','Geheim houden','Vriendelijk zijn'], a:1 },
  ]
};

function renderQuiz(n){
  const quiz = quizzes[n] || [];
  let html = `<div style="margin-top:20px; padding:16px; background:#f5f5f5; border-radius:8px;">
    <strong>📊 Controlecheck</strong><br>
    <p style="font-size:12px; color:#666;">Beantwoord 2 vragen!</p>`;

  quiz.forEach((q,i)=>{
    const opts = q.o.map((o,j)=>`<button class="q-btn" data-m="${n}" data-q="${i}" data-a="${j}" onclick="answerQ(this)">${o}</button>`).join('<br>');
    html += `<div style="margin-top:12px;">
      <strong style="font-size:12px;">${i+1}. ${q.q}</strong><br>
      ${opts}
      <div class="q-fb" id="qfb${n}_${i}"></div>
    </div>`;
  });

  html += `</div>`;
  document.getElementById(`m${n}quiz`).innerHTML = html;
  window.quizzes = quizzes;
}

function answerQ(btn){
  const m = +btn.dataset.m, q = +btn.dataset.q, a = +btn.dataset.a;
  const correct = a === window.quizzes[m][q].a;
  document.querySelectorAll(`[data-m="${m}"][data-q="${q}"]`).forEach(b=>b.disabled=true);
  btn.style.opacity = correct ? '1' : '0.5';
  const fb = document.getElementById(`qfb${m}_${q}`);
  fb.textContent = correct ? '✅ Juist!' : '❌ Niet helemaal!';
  fb.style.color = correct ? '#2e7d32' : '#c62828';
  fb.style.fontSize = '12px';
}

// ===== PROGRESS =====
function updateProgress(){
  const total = 6;
  const done = S.modules_done.length;
  const pct = Math.round(100 * done / total);
  document.getElementById('prog-fill').style.width = pct + '%';
  document.getElementById('prog-text').textContent = pct + '%';
}

// ===== CERTIFICATE =====
function updateCert(){
  if(!S.modules_done || S.modules_done.length < 6){
    document.getElementById('cert-view').innerHTML = `<div class="module-card">
      <h2>Je bent nog niet klaar!</h2>
      <p>Modules gedaan: ${S.modules_done.length}/6</p>
      <p><button class="sr-btn g" onclick="sm(${Math.min(6, (S.modules_done.length || 0)+1)})">Verder →</button></p>
    </div>`;
    return;
  }

  document.getElementById('cert-name-display').textContent = S.name || 'Leerling';
  document.getElementById('cert-date').textContent = new Date().toLocaleDateString('nl-BE');
}

function doCertPrint(){
  if(!S.name) S.name = prompt('Naam op certificaat?') || 'Leerling';
  ss();
  document.getElementById('cert-name-display').textContent = S.name;
  window.print();
}

function downloadSummary(){
  const reflections = [
    ['M1: Wat is AI echt?', S.reflections.m1 || '(niet ingevuld)'],
    ['M2: ChatGPT & Copilot', S.reflections.m2 || '(niet ingevuld)'],
    ['M5: AI in schoolwerk', S.reflections.m5 || '(niet ingevuld)'],
    ['M6: Ethische vragen', S.reflections.m6 || '(niet ingevuld)']
  ];

  const txt = `========================================
AI-SKILLS VOOR LEERLINGEN — REFLECTIEVERSLAG
========================================

Leerling: ${S.name || 'Anoniem'}
Datum: ${new Date().toLocaleDateString('nl-BE')}

MODULES VOLTOOID:
${modules.map((m,i)=>S.modules_done.includes(i+1) ? '✅ '+m.title : '⭕ '+m.title).join('\n')}

REFLECTIES:
${reflections.map(r=>r[0]+'\n'+r[1]).join('\n\n')}

SINT-REMBERT AI-BELEIDSKADER AKKOORD:
${SR.principles.map(p=>'• '+p).join('\n')}

========================================
Je bent nu een AI-SKILLS EXPERT! 🚀
Veel succes met je schoolwerk!
========================================`;

  const blob = new Blob([txt], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'AI-Skills-Reflectie.txt';
  a.click();
  URL.revokeObjectURL(url);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('un').value = S.name || '';
  updateProgress();
});
