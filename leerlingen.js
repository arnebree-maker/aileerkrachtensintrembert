// ===== STATE =====
const K = 'sr_leerlingen_v1';
let localStorageAvailable = false;
let S = { name:'', modules_done:[], quiz_scores:{}, starttest_taken:false, starttest_score:0 };

function ld(){
  try{ S = JSON.parse(localStorage.getItem(K)) || S; localStorageAvailable=true; }
  catch(e){ localStorageAvailable=false; S={name:'', modules_done:[], quiz_scores:{}, starttest_taken:false}; }
}
ld();

function ss(){
  if(!localStorageAvailable) return;
  try{ localStorage.setItem(K, JSON.stringify(S)); }catch(e){}
}

// ===== UI HELPERS =====
function sv(id){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  if(id==='cert'){ document.getElementById('cert-view').style.display='block'; document.getElementById('nav-cert').classList.add('active'); updateCert(); return; }
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
    { q:'Wat is AI vooral?', o:['Robots die alles kunnen','Software die patronen herkent uit data','Computers die altijd gelijk hebben','Hollywood-hype'], a:1 },
    { q:'ChatGPT is...?', o:['Een zoekmachine','Een chatbot die text genereert','Een soort Google','Een hacker-tool'], a:1 },
    { q:'Een "hallucination" bij AI betekent...?', o:['AI die het eens is met jou','AI die verzonnen informatie geeft','AI die je helpt dromen','AI die bang is'], a:1 },
    { q:'Mag je AI gebruiken voor je huiswerk?', o:['Nooit, dat is vals spelen','Soms, hangt af van de opdracht','Altijd, het is super slim','Alleen als je het zegt'], a:1 },
    { q:'Bias in AI betekent...?', o:['Ongelijkheid in hoe AI verschillende mensen behandelt','Voorkeur voor jou','Iets wat Microsoft bedacht','Niks belangrijks'], a:0 },
  ];

  let html = `<div class="module-card">
    <h2>Welkomtest — Wat weet je al?</h2>
    <p style="font-size:13px; color:#666; margin-bottom:20px;">5 vragen. Geen stress — dit is om te zien waar je staat. Geen cijfer, geen fouten! 😊</p>
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
  const a = +btn.dataset.a;
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
  {
    id:1, title:'Wat is AI echt?', icon:'🤔', duration:'30 min',
    intro:'Voorbij de hype. Wat is AI echt, en wat niet?'
  },
  {
    id:2, title:'ChatGPT & Copilot', icon:'💬', duration:'45 min',
    intro:'Hands-on: leer deze tools echt gebruiken'
  },
  {
    id:3, title:'Goeie prompts', icon:'✍️', duration:'40 min',
    intro:'De kunst van vragen stellen aan AI'
  },
  {
    id:4, title:'Hallucineringen & Bias', icon:'⚠️', duration:'35 min',
    intro:'Wat gaat er mis en waarom?'
  },
  {
    id:5, title:'AI in jouw werk', icon:'📝', duration:'50 min',
    intro:'Essays, projecten, huiswerk — hoe werk je verantwoord?'
  },
  {
    id:6, title:'Ethische vragen', icon:'🤝', duration:'40 min',
    intro:'Wat mag wel, en wat niet? Waarom?'
  }
];

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

  // Module content
  if(n===1){
    html += `
      <h3>🎯 AI is niet wat je denkt</h3>
      <p>Hollywood toont AI als robots die denken. De realiteit is anders:</p>
      
      <div class="info-box">
        <strong>❌ AI is NIET:</strong>
        <ul><li>Een brein dat denkt</li><li>Bewust of intelligent</li><li>Beter dan mensen</li><li>Creepy sci-fi</li></ul>
      </div>

      <div class="info-box">
        <strong>✅ AI IS:</strong>
        <ul><li>Software die patronen in data herkent</li><li>Voorspellend (volgende woord raden)</li><li>Snel & handig</li><li>Soms fout, soms geweldig</li></ul>
      </div>

      <h3>🧠 Hoe werkt het?</h3>
      <p><strong>Stap 1:</strong> Miljarden woorden in internet lezen<br>
      <strong>Stap 2:</strong> "Leren" welk woord waarschijnlijk volgt<br>
      <strong>Stap 3:</strong> Jij vult vraag in → AI raadt volgende woorden<br>
      <strong>Stap 4:</strong> Voilà: een antwoord!</p>

      <div class="tip-box">
        💡 ChatGPT is als je slimste klasgenoot die alles van internet weet — maar soms liegt.
      </div>

      <div id="m1quiz"></div>
    `;
  } else if(n===2){
    html += `
      <h3>🎬 Hoe ChatGPT/Copilot gebruiken?</h3>
      <p>Ga naar <strong>chat.openai.com</strong> (ChatGPT) of gebruik Copilot in je school-Microsoft account.</p>

      <div class="step-box">
        <strong>Stap 1: Inloggen</strong><br>
        ChatGPT is gratis. Copilot ook. Je hebt een account nodig (email volstaat).
      </div>

      <div class="step-box">
        <strong>Stap 2: Vragen stellen</strong><br>
        "Wat is fotosynthese?" → AI geeft antwoord. Simpel!
      </div>

      <div class="step-box">
        <strong>Stap 3: Vervolgvragen</strong><br>
        "Leg uit als ik 10 ben" → AI aanpassen aan jouw niveau.
      </div>

      <div class="warning-box">
        ⚠️ <strong>Waarschuwing:</strong> AI liegt soms! Controleer altijd met je leerboek.
      </div>

      <h3>💪 Praktijk</h3>
      <p>Probeer nu:</p>
      <ul>
        <li>Log in op ChatGPT of Copilot</li>
        <li>Vraag: "Wat is de hoofdstad van Polen?"</li>
        <li>Vervolgvraag: "Leg uit waarom het zo belangrijk was in WO2?"</li>
      </ul>

      <div id="m2quiz"></div>
    `;
  } else if(n===3){
    html += `
      <h3>✍️ Goeie prompts schrijven</h3>
      <p>Een prompt is je vraag aan AI. Hoe beter je vraag, hoe beter het antwoord!</p>

      <div class="compare-box">
        <div style="background:#fee; padding:12px; border-radius:8px; margin-bottom:12px;">
          <strong style="color:#c00;">❌ Slechte prompt:</strong><br>
          "Schrijf een essay over klimaatverandering"
        </div>
        <div style="background:#efe; padding:12px; border-radius:8px;">
          <strong style="color:#0a0;">✅ Goeie prompt:</strong><br>
          "Schrijf een essay van 500 woorden voor 2de graad Nederlands over klimaatverandering. Focus op de gevolgen voor België. Include: oorzaken, gevolgen, mogelijke oplossingen. Schrijfstijl: formeel maar begrijpelijk."
        </div>
      </div>

      <h3>🎯 De TRICK-formule</h3>
      <p>TRICK helpt je betere prompts schrijven:</p>
      <ul>
        <li><strong>T</strong>aak: Wat wil je dat AI doet?</li>
        <li><strong>R</strong>ol: Speel AI een rol? (leraar, coach, etc)</li>
        <li><strong>I</strong>nhoud: Waarover precies?</li>
        <li><strong>C</strong>ontext: Voor wie? Voor welke klas?</li>
        <li><strong>K</strong>waliteit: Hoe lang? Welke toon?</li>
      </ul>

      <div class="example-box">
        <strong>Voorbeeld TRICK-prompt:</strong><br><br>
        "Je bent een aardrijkskunde-leraar. Ik ben leerling 2de graad. Ik moet een presentatie van 5 minuten geven over de Nijl. Leg uit: waar is het, waarom belangrijk, waarom droog. Toon: interessant maar niet te moeilijk. Nederlands."
      </div>

      <div id="m3quiz"></div>
    `;
  } else if(n===4){
    html += `
      <h3>⚠️ Hallucineringen: AI verzint dingen</h3>
      <p>AI kan overtuigend liegen. Het "weet" niet wat waar is.</p>

      <div class="alert-box" style="background:#ffebee; border-left:4px solid #c00; padding:12px; margin:12px 0; border-radius:4px;">
        <strong style="color:#c00;">Voorbeeld hallucination:</strong><br>
        Jij: "Welke film won de Gouden Palm in 2023?"<br>
        AI: "De film 'Stardust Journey' van regisseur Maria Volkov."<br>
        <strong>FOUT!</strong> (Het was 'Anatomy of a Fall')
      </div>

      <h3>🧠 Hoe herken je hallucineringen?</h3>
      <ul>
        <li>✅ <strong>Controleer altijd:</strong> Google het antwoord</li>
        <li>✅ <strong>Stel dezelfde vraag 2x:</strong> Geeft AI hetzelfde antwoord?</li>
        <li>✅ <strong>Wees voorzichtig met:</strong> Getallen, data, namen, specifieke feiten</li>
        <li>✅ <strong>Vertrouw AI meer bij:</strong> Uitleg/concepten dan bij feiten</li>
      </ul>

      <h3>⚖️ Bias: AI herhaalt vooroordelen</h3>
      <p>AI leert van internet. Internet zit vol met stereotypes. Dus AI ook.</p>

      <div class="alert-box" style="background:#fff3cd; border-left:4px solid #ff9; padding:12px; margin:12px 0; border-radius:4px;">
        <strong>Voorbeeld bias:</strong><br>
        Jij: "Beschrijf een CEO"<br>
        AI geeft veel vaker mannelijke voornamen → <strong>genderbiasâ€</strong>
      </div>

      <h3>Checklist: Herken bias</h3>
      <ul>
        <li>Vraag dezelfde vraag met andere geslacht/afkomst → Verandert het antwoord?</li>
        <li>Kijk naar stereotypes in het antwoord</li>
        <li>Meld het aan je leraar!</li>
      </ul>

      <div id="m4quiz"></div>
    `;
  } else if(n===5){
    html += `
      <h3>📝 AI in jouw schoolwerk</h3>
      <p>Mag je AI gebruiken? Hangt af van de opdracht en wat je leraar zegt!</p>

      <h3>📋 Sint-Rembert AI-labels</h3>
      <p>Je leraar zet labels op opdrachten:</p>

      <div class="label-card" style="background:#e8f5e9; padding:12px; margin:8px 0; border-left:4px solid #4caf50;">
        <strong style="color:#2e7d32;">Label 1: ❌ Geen AI</strong><br>
        Echt helemaal zelf. Pen & papier.
      </div>

      <div class="label-card" style="background:#e3f2fd; padding:12px; margin:8px 0; border-left:4px solid #2196f3;">
        <strong style="color:#1565c0;">Label 2: 💡 Ideeën</strong><br>
        AI voor brainstorm. Maar je schrijft zelf.
      </div>

      <div class="label-card" style="background:#f3e5f5; padding:12px; margin:8px 0; border-left:4px solid #9c27b0;">
        <strong style="color:#6a1b9a;">Label 3: ✏️ Bewerking</strong><br>
        AI helpt met spelling/grammatica. Inhoud jij.
      </div>

      <div class="label-card" style="background:#fff3e0; padding:12px; margin:8px 0; border-left:4px solid #ff9800;">
        <strong style="color:#e65100;">Label 4: 🆗 Aanvulling</strong><br>
        AI vult delen aan. Jij checkt en integreert.
      </div>

      <div class="label-card" style="background:#fce4ec; padding:12px; margin:8px 0; border-left:4px solid #e91e63;">
        <strong style="color:#ad1457;">Label 5: 🚀 Vrij</strong><br>
        AI helemaal vrij. Jij doet onderzoek & reflectie.
      </div>

      <h3>🎯 Praktische voorbeelden</h3>
      <ul>
        <li><strong>Essay:</strong> AI voor structuur (label 2-3), jij schrijft inhoud</li>
        <li><strong>Wiskunde:</strong> AI kan voorbereiding geven, maar CHECK je antwoord!</li>
        <li><strong>Onderzoekswerk:</strong> AI voor inspiratie, jij zoekt echte bronnen</li>
        <li><strong>Toelichting:</strong> AI kan concept uitleggen, jij begrijpt het</li>
      </ul>

      <div class="tip-box">
        💡 Gouden regel: Als je voelt dat je vals zou spelen, dan waarschijnlijk wel. Zeg het aan je leraar!
      </div>

      <div id="m5quiz"></div>
    `;
  } else if(n===6){
    html += `
      <h3>🤝 Ethische vragen</h3>
      <p>AI is cool, maar ook ingewikkelder dan je denkt.</p>

      <h3>❓ Vragen om over na te denken</h3>

      <div class="question-box">
        <strong>Mag je AI gebruiken als je niet weet dat het AI is?</strong><br>
        (bijv. een afbeelding die AI maakte, maar ziet er echt uit)
        <div style="font-size:12px; color:#666; margin-top:8px;">
          → Nee. Transparantie is belangrijk. Zeg tegen anderen wat AI is gemaakt!
        </div>
      </div>

      <div class="question-box">
        <strong>Als AI iets doet met veel bias, is dat de schuld van AI of de maker?</strong><br>
        <div style="font-size:12px; color:#666; margin-top:8px;">
          → Maker/bedrijf. AI doet wat het trainingsdata zegt. Dus: trainingsdata checken!
        </div>
      </div>

      <div class="question-box">
        <strong>Mag je AI gebruiken voor je huiswerk als je alles zelf moet leren?</strong><br>
        <div style="font-size:12px; color:#666; margin-top:8px;">
          → Hangt af. Is het leren, of vals spelen? Vraag jezelf: Begrijp ik dit echt?
        </div>
      </div>

      <div class="question-box">
        <strong>Wat als iedereen AI gebruikt? Dan moet ik toch ook?</strong><br>
        <div style="font-size:12px; color:#666; margin-top:8px;">
          → Nope. Net als bij afkijken: "anderen doen het" is geen excuus. Sint-Rembert heeft regels. Volg die.
        </div>
      </div>

      <h3>🌍 Breder: AI en samenleving</h3>
      <ul>
        <li><strong>Privacy:</strong> Wie houdt je data van je chats?</li>
        <li><strong>Werk:</strong> Vervangt AI banen?</li>
        <li><strong>Disinformatie:</strong> Kan AI used voor nepnieuws?</li>
        <li><strong>Creativiteit:</strong> Is AI-kunst echt kunst?</li>
      </ul>

      <div class="reflection-box">
        <strong>Reflectie:</strong> Wat vind jij de grootste voordeel of risico van AI in jouw leven?
        <textarea id="m6-reflect" placeholder="Schrijf hier..." style="width:100%; height:80px; padding:8px; border:1px solid #ddd; border-radius:4px; margin-top:8px; font-family: inherit;"></textarea>
      </div>

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
  else { alert('🎉 Goed gedaan! Je hebt alles afgerond. Download je certificaat!'); sv('cert'); }
}

// ===== QUIZZES =====
const quizzes = {
  1: [
    { q:'AI werkt vooral door:', o:['Magie','Patronen in data herkennen','Internet afkijken','Denken'], a:1 },
    { q:'Waarom liegt AI soms?', o:['Om lastig te zijn','Het "weet" niet wat waar is','Het is stuk','Hackers stoppen onjuiste info erin'], a:1 },
  ],
  2: [
    { q:'ChatGPT is gratis toegankelijk via:', o:['Alleen op school','chat.openai.com en Copilot','Alleen betaald','Alleen in VS'], a:1 },
    { q:'Je moet ALTIJD checken of:', o:['Je verbonden bent met internet','AI-antwoord klopt','Niemand meekijkt','Je naam juist gespeld is'], a:1 },
  ],
  3: [
    { q:'Een goeie prompt is:', o:['Kort en vaag','Duidelijk, met context en kwaliteit','Heel lang','Alleen vragen stellen'], a:1 },
    { q:'TRICK staat voor:', o:['Taak, Rol, Inhoud, Context, Kwaliteit','Taak, Risico, Inhoud, Code, Keuze','Truc, Regel, Idee, Check, Kunst','Tekst, Respect, Info, Citaat, Kijk'], a:0 },
  ],
  4: [
    { q:'Hallucineringen bij AI betekenen:', o:['Dromen hebben','Verzonnen informatie geven','Draken zien','Slecht luisteren'], a:1 },
    { q:'Hoe herken je bias in AI?', o:['Je voelt het','Vraag dezelfde vraag met andere groepen','AI zegt sorry','Bias bestaat niet'], a:1 },
  ],
  5: [
    { q:'Label 1 ("Geen AI") betekent:', o:['Je mag een beetje AI gebruiken','Echt helemaal zelf, nul AI','AI is verboden in heel de wereld','Je mag zeggen dat je AI gebruikte'], a:1 },
    { q:'Wat is het belangrijkste bij AI in schoolwerk?', o:['Het moet snel gaan','Je moet begrijpen wat je aflevert','Niemand mag het weten','AI is altijd beter'], a:1 },
  ],
  6: [
    { q:'Transparantie bij AI betekent:', o:['Het is transparant zichtbaar','Zeggen dat het AI is','AI in glas zetten','Niets'], a:1 },
    { q:'Wat zou jij willen veranderen aan AI?', o:['Helemaal verbieten','Het beter controleren op bias/hallucineringen','Het nog sneller maken','Geen idee'], a:1 },
  ]
};

function renderQuiz(n){
  const quiz = quizzes[n] || [];
  let html = `<div style="margin-top:20px; padding:16px; background:#f5f5f5; border-radius:8px;">
    <strong style="color:#333;">📊 Controlecheck (optioneel)</strong><br>
    <p style="font-size:12px; color:#666; margin:8px 0;">Beantwoord 2 vragen om je inzicht te checken.</p>`;

  quiz.forEach((q,i)=>{
    const opts = q.o.map((o,j)=>`<button class="q-btn" data-m="${n}" data-q="${i}" data-a="${j}" onclick="answerQ(this)">${o}</button>`).join('<br>');
    html += `<div style="margin-top:12px;">
      <strong style="font-size:12px;">${i+1}. ${q.q}</strong><br>
      ${opts}
      <div class="q-fb" id="qfb${n}_${i}" style="font-size:11px; margin-top:6px; color:#666;"></div>
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
  fb.textContent = correct ? '✅ Juist!' : '❌ Niet helemaal — let beter op!';
  fb.style.color = correct ? '#2e7d32' : '#c62828';
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
      <p>Je hebt ${S.modules_done.length} van 6 modules afgerond.</p>
      <p><button class="sr-btn g" onclick="sm(${(S.modules_done.length || 0)+1})">Verder gaan →</button></p>
    </div>`;
    return;
  }

  document.getElementById('cert-name-display').textContent = S.name || 'Leerling';
  document.getElementById('cert-date').textContent = new Date().toLocaleDateString('nl-BE');
}

function doCertPrint(){
  if(!S.name) S.name = prompt('Wat is je naam voor op het certificaat?') || 'Leerling';
  ss();
  document.getElementById('cert-name-display').textContent = S.name;
  window.print();
}

function downloadSummary(){
  const txt = `========================================
AI-SKILLS VOOR LEERLINGEN — REFLECTIEVERSLAG
========================================

Leerling: ${S.name || 'Anoniem'}
Datum: ${new Date().toLocaleDateString('nl-BE')}

MODULE VOORTGANG:
${modules.map((m,i)=>S.modules_done.includes(i+1) ? '✅ '+m.title : '⭕ '+m.title).join('\n')}

REFLECTIE MODULE 6:
${document.getElementById('m6-reflect')?.value || '(Niet ingevuld)'}

OPMERKINGEN:
- Je hebt alle 6 modules doorlopen
- Je bent nu een AI-skills expert!
- Deel je certificaat trots met anderen

========================================
Gegenereerd via AI-Skills voor Leerlingen
Platform: Sint-Rembert
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
