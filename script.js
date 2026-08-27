/* ════════════════════════════════════════════
   AI-CURSUS SINT-REMBERT — VOLLEDIGE VERSIE
   Met: Rolkeuze, Casus, Prompt-vergelijker, FAQ
   ════════════════════════════════════════════ */

// ── INSCHRIJFLINK PROFESSIONALISERING ──
const INSCHRIJF = 'https://apps.powerapps.com/play/e/a6565af8-ceef-e6fa-abee-2fc82d974843/a/05835e22-d992-431c-b608-0f9b6756afe6?tenantId=e285dc48-b92b-4e97-9ea5-bdaed06bbb77&hint=67663972-1038-4a71-9d66-1bdbb7f7e205&source=sharebutton&sourcetime=1787594697783#';

// ── STATE ──
const K = 'sr_ai_v9';
let localStorageAvailable = false;

// Test of localStorage werkt (incognito check)
function testLocalStorage(){
  try {
    const test = '__sr_test__';
    localStorage.setItem(test, 'test');
    localStorage.removeItem(test);
    localStorageAvailable = true;
    console.log('✓ localStorage beschikbaar');
    return true;
  } catch(e) {
    localStorageAvailable = false;
    console.warn('⚠️ localStorage niet beschikbaar (incognito mode?) — gebruik RAM fallback');
    return false;
  }
}

let S = { 
  name:'', 
  userRole: null,
  starttest:{taken:false, score:0, passed:false}, 
  mod1:{step:0,done:false,skipped:false}, 
  mod2:{step:0,done:false}, 
  mod3:{step:0,done:false}, 
  certPrinted:false 
};

function ld(){
  testLocalStorage();
  
  if(!localStorageAvailable){
    console.log('📦 Incognito/private mode — using ephemeral state (RAM only)');
    return;
  }
  
  try{
    const s = localStorage.getItem(K);
    console.log('📦 Load state:', s ? 'Gevonden' : 'Nieuw');
    if(s){ 
      S = Object.assign(S, JSON.parse(s)); 
      console.log('✓ State geladen:', S);
      return; 
    }
    const oud = localStorage.getItem('sr_ai_v8') || localStorage.getItem('sr_ai_v7') || localStorage.getItem('sr_ai_v6');
    if(oud){
      const o = JSON.parse(oud);
      S.name = o.name || '';
      S.certPrinted = !!o.certPrinted;
      ['mod1','mod2','mod3'].forEach(m=>{ if(o[m] && o[m].done) S[m].done = true; });
      ss();
      console.log('✓ Oude state gemigreerd');
    }
  }catch(e){
    console.error('❌ Error bij laden state:', e);
  }
}

// Cache-clear functie (typ in console: clearCache())
function clearCache(){
  console.log('🗑️ Cache wissen...');
  localStorage.clear();
  S = { 
    name:'', 
    userRole: null,
    starttest:{taken:false, score:0, passed:false}, 
    mod1:{step:0,done:false,skipped:false}, 
    mod2:{step:0,done:false}, 
    mod3:{step:0,done:false}, 
    certPrinted:false 
  };
  console.log('✓ Cache gewist, refresh pagina: location.reload()');
}

function ss(){ 
  if(!localStorageAvailable) return; // Stilzwijgend overslaan in incognito
  try{ 
    localStorage.setItem(K, JSON.stringify(S)); 
  }catch(e){} 
}

ld();

document.getElementById('un').value = S.name || '';
function ua(){ const n = (document.getElementById('un').value||'').trim(); document.getElementById('av').textContent = n ? n.charAt(0).toUpperCase() : '?'; }
function sn(){ S.name = document.getElementById('un').value.trim(); ss(); ua(); }
// ua(); up(); rmc(); — Worden aangeroepen in DOMContentLoaded

/* ════════════════════════════════════════════
   ROLKEUZE — Welkomscherm (NIEUW)
   ════════════════════════════════════════════ */

let userRole = null;

function showRoleSelector() {
  const roleView = document.createElement('div');
  roleView.id = 'role-selector-view';
  roleView.className = 'role-view';
  roleView.innerHTML = `
<div class="role-wrap">
  <div class="role-hero">
    <div class="role-badge">🚀 Welkom bij de AI-Cursus</div>
    <h1 class="role-h1">Wat is <em>jouw rol</em> bij Sint-Rembert?</h1>
    <p class="role-sub">We stemmen ALLE content af op jouw functie — inclusief een eigen Copilot-verdieping op jouw maat.</p>
  </div>

  <div class="role-grid">
    <div class="role-card" onclick="setUserRole('teacher')">
      <div class="role-icon">👨‍🏫</div>
      <div class="role-title">Leerkracht</div>
      <div class="role-desc">Je werkt rechtstreeks met leerlingen en gebruikt AI in je lespraktijk.</div>
      <div class="role-includes">
        <div class="role-inc-title">Je krijgt:</div>
        ✓ Module 1: Volledige AI-basis<br>
        ✓ Module 2: Alle spelregels + AI-labels<br>
        ✓ Leerlingbegeleiding & evaluatie<br>
        ✓ Praktijkscenario's<br>
        ✓ <strong>Module 3: Copilot in de klas</strong><br>
        &nbsp;&nbsp;&nbsp;Hands-on prompting, lesmateriaal,<br>
        &nbsp;&nbsp;&nbsp;differentiatie & agents
      </div>
    </div>

    <div class="role-card" onclick="setUserRole('admin')">
      <div class="role-icon">📋</div>
      <div class="role-title">Admin / Ondersteunend</div>
      <div class="role-desc">Je ondersteunt processen of bent betrokken bij schoolorganisatie.</div>
      <div class="role-includes">
        <div class="role-inc-title">Je krijgt:</div>
        ✓ Module 1: Wat is AI? (basis)<br>
        ✓ Module 2: Kernpunten + Privacy<br>
        ✓ Geen leerling-specifieke content<br>
        ✓ Geen AI-labels<br>
        ✓ <strong>Module 3: Copilot voor administratie</strong><br>
        &nbsp;&nbsp;&nbsp;Mailsjablonen, planning,<br>
        &nbsp;&nbsp;&nbsp;rapportages & efficiëntie
      </div>
    </div>

    <div class="role-card" onclick="setUserRole('management')">
      <div class="role-icon">🎯</div>
      <div class="role-title">Schoolleiding / Beleid</div>
      <div class="role-desc">Je bent betrokken bij strategische keuzes rond AI & regelwerk.</div>
      <div class="role-includes">
        <div class="role-inc-title">Je krijgt:</div>
        ✓ Module 1: Volledige AI-concepten<br>
        ✓ Module 2: Volledig beleidskader<br>
        ✓ Juridische context (EU AI Act)<br>
        ✓ Risicomanagement & governance<br>
        ✓ <strong>Module 3: Copilot voor beleid</strong><br>
        &nbsp;&nbsp;&nbsp;Strategische documenten,<br>
        &nbsp;&nbsp;&nbsp;risicoanalyse & compliance
      </div>
    </div>
  </div>

  <div class="role-note">
    <div class="role-note-icon">💡</div>
    <div class="role-note-text">Alle rollen krijgen Copilot-verdieping op maat. Je kan je rol altijd aanpassen — je voortgang blijft behouden!</div>
  </div>
</div>
  `;
  
  const appDiv = document.getElementById('app');
  appDiv.parentNode.insertBefore(roleView, appDiv);
  appDiv.style.display = 'none';
}

function setUserRole(role) {
  console.log('🎭 Rol gekozen:', role);
  userRole = role;
  S.userRole = role;
  ss();
  
  const roleView = document.getElementById('role-selector-view');
  if(roleView) {
    roleView.style.display = 'none';
    console.log('✓ Rolkeuze verborgen');
  }
  
  const appDiv = document.getElementById('app');
  if(appDiv) {
    appDiv.style.display = 'grid';
    console.log('✓ App zichtbaar gemaakt');
  }
  
  // Module 3 is nu beschikbaar voor ALLE rollen
  const navMod3 = document.getElementById('nav-mod3');
  const cm3 = document.getElementById('cm3');
  if(navMod3) navMod3.style.display = 'block';
  if(cm3) cm3.style.display = 'block';
  console.log('✓ Module 3 zichtbaar (rol: ' + role + ')');
  
  up();
  rmc();
}

/* ════════════════════════════════════════════
   PROGRESS / NAVIGATION
   ════════════════════════════════════════════ */

function up(){
  const d = [S.mod1.done, S.mod2.done].filter(Boolean).length;
  const p = Math.round(d/2*100);
  document.getElementById('pb').style.width = p+'%';
  document.getElementById('pct').textContent = p+'%';

  const stEl = document.getElementById('st-status');
  if(stEl){
    if(!S.starttest.taken){ stEl.textContent = 'Nog te starten'; stEl.className = ''; }
    else if(S.starttest.passed){ stEl.textContent = '✓ '+S.starttest.score+'% — M1 overgeslagen'; stEl.className = 'st-pass'; }
    else { stEl.textContent = S.starttest.score+'% — M1 vereist'; stEl.className = 'st-fail'; }
  }

  if(!S.starttest.taken){
    document.getElementById('nav-mod1').className = 'ni locked';
    document.getElementById('nav-mod2').className = 'ni locked';
    document.getElementById('l1').textContent = '🔒';
    document.getElementById('l2').textContent = '🔒';
    return;
  }

  document.getElementById('nav-mod1').className = S.mod1.done ? 'ni done' : 'ni available';
  document.getElementById('nav-mod2').className = S.mod2.done ? 'ni done' : (S.mod1.done ? 'ni available' : 'ni locked');
  if(S.mod1.done && S.mod2.done){ document.getElementById('nav-cert').className='ni available'; document.getElementById('lc').textContent='›'; }
  if(S.mod1.done) document.getElementById('l1').innerHTML = S.mod1.skipped ? '<span style="color:var(--green)" title="Overgeslagen via startest">⏩</span>' : '<span style="color:var(--green)">✓</span>';
  else document.getElementById('l1').textContent = '›';
  if(S.mod2.done) document.getElementById('l2').innerHTML = '<span style="color:var(--green)">✓</span>';
  else if(S.mod1.done) document.getElementById('l2').textContent = '›';
  else document.getElementById('l2').textContent = '🔒';
  if(S.mod3.done) document.getElementById('l3').innerHTML = '<span style="color:var(--green)">✓</span>';
  
  // Update Module 3 label op basis van rol
  const mod3NavEl = document.getElementById('nav-mod3');
  if(mod3NavEl) {
    const mod3NameEl = mod3NavEl.querySelector('.ni-title');
    const mod3SubEl = mod3NavEl.querySelector('.ni-sub');
    if(mod3NameEl) {
      if(S.userRole === 'teacher') {
        mod3NameEl.textContent = '📚 Module 3: Copilot klas';
        if(mod3SubEl) mod3SubEl.textContent = 'Optioneel · 8 stappen';
      } else if(S.userRole === 'admin') {
        mod3NameEl.textContent = '📚 Module 3: Copilot admin';
        if(mod3SubEl) mod3SubEl.textContent = 'Optioneel · 4 stappen';
      } else if(S.userRole === 'management') {
        mod3NameEl.textContent = '📚 Module 3: Copilot beleid';
        if(mod3SubEl) mod3SubEl.textContent = 'Optioneel · 4 stappen';
      }
    }
  }
}

function rmc(){
  if(S.mod1.done){ document.getElementById('cm1').classList.add('done'); document.getElementById('bm1').textContent='↺ Herhalen'; document.getElementById('ps1').className='mc-stat ok'; document.getElementById('ps1').textContent='✓ Voltooid'; }
  if(S.mod1.done){ document.getElementById('cm2').classList.remove('locked'); document.getElementById('bm2').disabled=false; document.getElementById('bm2').textContent='▶ Start'; if(!S.mod2.done){ document.getElementById('ps2').className='mc-stat'; document.getElementById('ps2').textContent='Beschikbaar'; } }
  if(S.mod2.done){ document.getElementById('cm2').classList.add('done'); document.getElementById('bm2').textContent='↺ Herhalen'; document.getElementById('ps2').className='mc-stat ok'; document.getElementById('ps2').textContent='✓ Voltooid'; }
  if(S.mod3.done){ document.getElementById('cm3').classList.add('done'); document.getElementById('bm3').textContent='↺ Herhalen'; document.getElementById('ps3').className='mc-stat ok'; document.getElementById('ps3').textContent='✓ Voltooid'; }
}

function sv(id){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById('cert-view').style.display='none';
  document.querySelectorAll('.ni').forEach(n=>n.classList.remove('active'));
  if(id==='cert'){ document.getElementById('cert-view').style.display='block'; document.getElementById('nav-cert').classList.add('active'); rc(); document.getElementById('main').scrollTo({top:0}); return; }
  document.getElementById('view-'+id).classList.add('active');
  const ni = document.getElementById('nav-'+id); if(ni) ni.classList.add('active');
  document.getElementById('main').scrollTo({top:0});
}

function sm(n){
  console.log('📚 Klik op module:', n, '- Role:', S.userRole, '- State:', {starttest: S.starttest.taken, mod1done: S.mod1.done, mod1skipped: S.mod1.skipped});
  
  if(!S.starttest.taken){ 
    console.log('⚠️ Startest nog niet gedaan');
    goStartTest(); 
    return; 
  }
  
  if(n===1){ 
    console.log('✓ Start Module 1');
    rm1(); 
    sv('mod1'); 
  }
  else if(n===2 && (S.mod1.done || S.mod1.skipped)){ 
    console.log('✓ Start Module 2, rol:', S.userRole);
    rm2(); 
    sv('mod2'); 
  }
  else if(n===2){ 
    console.log('❌ Module 1 niet voltooid');
    alert('Voltooi eerst module 1.'); 
  }
  else if(n===3){ 
    console.log('✓ Start Module 3, rol:', S.userRole);
    rm3(); 
    sv('mod3'); 
  }
}

function tm(n){
  if(!S.starttest.taken){ goStartTest(); return; }
  if(n===2 && S.mod1.done) sm(2); else alert('Voltooi eerst module 1.');
}

function goHome(){ 
  if(!S.starttest.taken){ goStartTest(); return; } 
  sv('home');
  // Voeg FAQ toe na kort moment
  setTimeout(()=>{
    const existing = document.getElementById('faq-section');
    if(existing) existing.remove();
  }, 50);
}

function goStartTest(){ showNameEntry(); renderStartTest(); sv('starttest'); }
function tryC(){ (S.mod1.done && S.mod2.done) ? sv('cert') : alert('Voltooi eerst de 2 verplichte modules (1 en 2).'); }
function rDots(m,tot,cur){
  const c = document.getElementById('sd'+m); if(!c) return; c.innerHTML='';
  for(let i=0;i<tot;i++){ const d=document.createElement('div'); d.className='dot '+(i<cur?'done':i===cur?'active':''); c.appendChild(d); }
}

/* ════════════════════════════════════════════
   LEESTIJD PER PAGINA
   ════════════════════════════════════════════ */

let lastNavDirection = 'forward';

function decideSeconds(container){
  // Timer verborgen: retourneer altijd 0 zodat geen seconden teller zichtbaar
  return 0;
}

function lockNextButtons(container){
  const btns = container.querySelectorAll('.nw .sr-btn.g, .nw .sr-btn.o');
  if(lastNavDirection === 'back'){
    btns.forEach(b=>{
      if(b.dataset.timerId){ clearInterval(+b.dataset.timerId); delete b.dataset.timerId; }
      if(b.dataset.origText){ b.textContent = b.dataset.origText; }
      b.disabled = false;
    });
    lastNavDirection = 'forward';
    return;
  }
  const seconds = decideSeconds(container);
  btns.forEach(b=>{
    if(b.dataset.timerId){ clearInterval(+b.dataset.timerId); }
    const original = b.dataset.origText || b.textContent;
    b.dataset.origText = original;
    if(seconds <= 0){ b.disabled = false; b.textContent = original; return; }
    let remaining = seconds;
    b.disabled = true;
    b.textContent = original + ' (' + remaining + 's)';
    const id = setInterval(()=>{
      remaining--;
      if(remaining <= 0){
        clearInterval(id);
        b.disabled = false;
        b.textContent = original;
        delete b.dataset.timerId;
      } else {
        b.textContent = original + ' (' + remaining + 's)';
      }
    }, 1000);
    b.dataset.timerId = String(id);
  });
}

/* ════════════════════════════════════════════
   PROMO MINI
   ════════════════════════════════════════════ */

function promoMini(tekst){
  return '<div class="promo-mini"><div class="promo-mini-icon">🚀</div><div style="flex:1"><div class="promo-mini-title">Professionaliseringsplan Sint-Rembert</div><div class="promo-mini-desc">'+tekst+'</div></div><a class="promo-mini-btn" href="'+INSCHRIJF+'" target="_blank">Schrijf in</a></div>';
}

/* ════════════════════════════════════════════
   CERTIFICAAT
   ════════════════════════════════════════════ */

function rc(){
  document.getElementById('cert-name').textContent = S.name || 'Leerkracht';
  document.getElementById('cert-date').textContent = new Date().toLocaleDateString('nl-BE',{day:'numeric',month:'long',year:'numeric'});
  const btn = document.getElementById('print-cert-btn');
  const info = document.getElementById('cert-dl-info');
  btn.disabled=false;
  btn.textContent='🖨️ Download certificaat (PDF)';
  info.textContent = '';
  // Certificaat kan altijd opnieuw gedownload worden
}

function doCertPrint(){
  if(!S.name || !S.name.trim()){
    if(!confirm('Je naam is nog niet ingevuld (links onderaan in de zijbalk). Het certificaat vermeldt dan "Leerkracht".\n\nToch doorgaan?')) return;
  } else {
    if(!confirm('Certificaat downloaden?\n\nNaam op certificaat: ' + S.name + '\n\nKies in het afdrukvenster "Opslaan als PDF" en bewaar het bestand. Je kan dit altijd opnieuw doen.')) return;
  }
  rc();
  window.print();
}

function fmtStellingen(groupKey, stellingenTekst){
  let saved = {};
  try{ saved = JSON.parse(localStorage.getItem('sr_stellingen_'+groupKey)||'{}'); }catch(e){}
  if(Object.keys(saved).length===0) return 'Nog geen stellingen beantwoord.\n';
  let out = '';
  stellingenTekst.forEach((s,i)=>{
    out += `  ${i+1}. ${s}\n     → ${saved[i] || 'Niet beantwoord'}\n`;
  });
  return out;
}

function downloadSummary() {
  const r1 = localStorage.getItem('sr_r1') || 'Geen reflectie ingevuld.';
  const r3 = localStorage.getItem('sr_r3') || 'Geen reflectie ingevuld.';
  const r2 = localStorage.getItem('sr_r2') || 'Geen reflectie ingevuld.';
  const name = S.name || 'Anonieme Leerkracht';

  const stl_m1 = ['AI zal er binnen 10 jaar voor zorgen dat leerlingen minder goed zelfstandig kunnen schrijven.','Als leerkracht moet ik AI-output altijd controleren, ook als die er overtuigend uitziet.'];
  const stl_m2 = ['Een adaptieve toets gebruiken om leerlingen te oriënteren naar een studierichting zou toegelaten moeten zijn, zolang een leerkracht de uiteindelijke beslissing neemt.','Onze school heeft nood aan een duidelijker, korter overzicht van wat wel/niet mag volgens de AI Act dan wat er vandaag bestaat.'];
  const stl_m3 = ['Few-shot prompting (voorbeelden meegeven in je prompt) gaat mij echt tijd besparen bij het opstellen van toetsvragen.','Leerlingen hun prompts laten toevoegen aan hun werk is een haalbare manier van bronvermelding voor mijn vak.'];

  let txt = `==================================================\n`;
  txt += `AI-PROFESSIONALISERING SCHOLENGROEP SINT-REMBERT\n`;
  txt += `PERSOONLIJK REFLECTIE- EN LOGVERSLAG\n`;
  txt += `==================================================\n\n`;
  txt += `Deelnemer: ${name}\n`;
  txt += `Datum van export: ${new Date().toLocaleDateString('nl-BE')}\n\n`;

  txt += `--------------------------------------------------\n`;
  txt += `STARTTEST\n`;
  txt += `--------------------------------------------------\n`;
  txt += S.starttest.taken
    ? `Resultaat: ${S.starttest.score}% — ${S.starttest.passed ? 'Geslaagd: Module 1 overgeslagen' : 'Niet geslaagd: Module 1 gevolgd'}\n\n`
    : `Nog niet afgelegd.\n\n`;

  txt += `--------------------------------------------------\n`;
  txt += `MODULE 1: WAT IS AI? — KENNIS EN REFLECTIE\n`;
  txt += `--------------------------------------------------\n`;
  txt += `Resultaat Kennischeck: ${S.mod1.quizScore || 'Nog niet behaald'}%\n\n`;
  txt += `Stellingen — jouw mening:\n`;
  txt += fmtStellingen('m1', stl_m1) + '\n';
  txt += `Jouw inzicht / Vakspecifieke vertaalslag:\n`;
  txt += `${r1}\n\n`;

  txt += `--------------------------------------------------\n`;
  txt += `MODULE 2: BELEID & LEERLINGEN BEGELEIDEN\n`;
  txt += `--------------------------------------------------\n`;
  txt += `Resultaat Kennischeck: ${S.mod2.quizScore || 'Nog niet behaald'}%\n\n`;
  txt += `Stellingen — jouw mening:\n`;
  txt += fmtStellingen('m2', stl_m2) + '\n';
  txt += `Jouw concrete actiestap voor de komende maand:\n`;
  txt += `${r3}\n\n`;

  txt += `--------------------------------------------------\n`;
  txt += `MODULE 3: COPILOT IN DE PRAKTIJK (OPTIONEEL)\n`;
  txt += `--------------------------------------------------\n`;
  txt += `Resultaat Kennischeck: ${S.mod3.quizScore || 'Nog niet behaald'}%\n\n`;
  txt += `Stellingen — jouw mening:\n`;
  txt += fmtStellingen('m3', stl_m3) + '\n';
  txt += `Jouw evaluatie & bibliotheekreflex:\n`;
  txt += `${r2}\n\n`;

  txt += `==================================================\n`;
  txt += `Gegenereerd via ReLearn Sint-Rembert platform — Bewaar als bewijslast.\n`;
  txt += `==================================================`;

  const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name.replace(/[^a-zA-Z0-9]/g, '_')}_AI_Cursus_Verslag.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* ════════════════════════════════════════════
   STELLINGEN
   ════════════════════════════════════════════ */

function renderStellingen(containerId, groupKey, stellingen){
  const g = document.getElementById(containerId);
  if(!g) return;
  let saved = {};
  try{ saved = JSON.parse(localStorage.getItem('sr_stellingen_'+groupKey)||'{}'); }catch(e){}
  let html = '';
  stellingen.forEach((s,i)=>{
    const cur = saved[i] || null;
    html += '<div class="stl-card">';
    html += '<div class="stl-q">'+(i+1)+'. '+s+'</div>';
    html += '<div class="stl-opts">';
    ['Eens','Twijfel','Oneens'].forEach(opt=>{
      const active = cur===opt ? ' active' : '';
      html += '<button class="stl-btn'+active+'" data-i="'+i+'" data-v="'+opt+'">'+opt+'</button>';
    });
    html += '</div></div>';
  });
  g.innerHTML = html;
  g.querySelectorAll('.stl-btn').forEach(b=>{
    b.onclick = ()=>{
      const i = b.dataset.i, v = b.dataset.v;
      saved[i] = v;
      localStorage.setItem('sr_stellingen_'+groupKey, JSON.stringify(saved));
      g.querySelectorAll('.stl-btn[data-i="'+i+'"]').forEach(bb=>bb.classList.remove('active'));
      b.classList.add('active');
    };
  });
}

/* ════════════════════════════════════════════
   STARTTEST
   ════════════════════════════════════════════ */

const ST_Q = [
  { q:'Wat is het kernverschil tussen vroegere AI en generatieve AI (GenAI)?',
    o:['Vroegere AI classificeerde of voorspelde; GenAI creëert volledig nieuwe content zoals tekst, beeld of code.',
       'GenAI is simpelweg een snellere versie van dezelfde technologie als vroegere AI-systemen.',
       'Vroegere AI kon enkel beelden verwerken, GenAI uitsluitend tekst.',
       'Er is geen wezenlijk verschil — beide termen verwijzen naar dezelfde technologie.'],
    a:0, f:'Vroegere AI (zoals een spamfilter) classificeerde of voorspelde. GenAI gaat een stap verder en creëert nieuwe content.' },
  { q:'Wat is een hallucinatie bij generatieve AI?',
    o:['Wanneer een AI-model weigert te antwoorden op een onveilige vraag.',
       'Wanneer een AI-model met grote stelligheid feitelijk onjuiste of verzonnen informatie genereert.',
       'Wanneer een AI-model trager werkt door serveroverbelasting.',
       'Wanneer een AI-model letterlijke tekst overneemt uit beschermde trainingsdata.'],
    a:1, f:'Hallucinaties zijn plausibel klinkende maar foutieve output — een gevolg van voorspellen op basis van kansberekening.' },
  { q:'Waarom klinkt foutieve AI-output toch vaak overtuigend?',
    o:['Omdat AI-bedrijven bewust overtuigende taal inprogrammeren.',
       'Omdat GenAI op basis van kansberekening telkens het meest waarschijnlijke volgende woord voorspelt, los van of het feitelijk klopt.',
       'Omdat foutieve informatie altijd een andere schrijfstijl heeft.',
       'Omdat AI elke uitspraak vooraf dubbel checkt met het internet.'],
    a:1, f:'GenAI voorspelt het meest waarschijnlijke volgende woord — dat klinkt zelfverzekerd, ook wanneer het fout is.' },
  { q:'Welke AI-tool is binnen Sint-Rembert volledig ondersteund en dataproof voor schoolgebruik?',
    o:['De gratis consumentenversie van ChatGPT via een persoonlijk account.',
       'Google Gemini Advanced met een geverifieerd privé-account.',
       'Copilot M365, aangemeld met je officiële schoolaccount van de scholengroep.',
       'Midjourney Commercial Edition, apart aangekocht door een vakgroep.'],
    a:2, f:'Copilot via je schoolaccount valt onder de overeenkomst met de scholengroep met gegarandeerde gegevensbescherming.' },
  { q:'Wat is bias in een AI-systeem?',
    o:['Een technische storing die de output vertraagt.',
       'Vooroordelen of stereotypen uit de trainingsdata die terugkomen in de gegenereerde output.',
       'Een instelling die je zelf kan aan- of uitzetten in de tool.',
       'De term voor wanneer AI weigert te antwoorden op een vraag.'],
    a:1, f:'AI leert van data vol menselijke vooroordelen — die vertekening sijpelt door in de output.' },
  { q:'Een AI-tool noemt een wetenschappelijke studie met auteur en jaartal. Wat is de juiste reflex?',
    o:['De bron blindelings overnemen, want een jaartal en auteur klinken betrouwbaar.',
       'Zelf controleren via een betrouwbare bron of de studie echt bestaat.',
       'Enkel checken of het jaartal logisch is binnen de context.',
       'In dezelfde chat aan de AI vragen of de bron wel echt klopt.'],
    a:1, f:'Verzonnen bronvermeldingen zijn een klassieke hallucinatie. Zelf controleren is noodzakelijk.' },
  { q:'Welke van deze toepassingen is NIET aan te raden?',
    o:['Sneller differentiatiemateriaal opstellen met AI.',
       'Feedback formuleren op geanonimiseerde leerlingteksten.',
       'Een volledige toetsbeoordeling overlaten aan AI zonder eigen controle.',
       'Administratieve lasten verlagen met AI-ondersteuning.'],
    a:2, f:'De leerkracht blijft altijd eindverantwoordelijk. AI-output ongecontroleerd laten beslissen over een beoordeling is niet toegestaan.' },
  { q:'Wat is het grootste privacyrisico bij AI-gebruik op school?',
    o:['Een test maken via Copilot M365 met je schoolaccount.',
       'Persoonsgegevens van leerlingen invoeren in een niet-goedgekeurde of gratis AI-tool.',
       'Een anonieme oefentekst intypen in een toegelaten tool.',
       'Een afbeelding genereren voor een les zonder personen erop.'],
    a:1, f:'Persoonsgegevens horen nooit in een niet-goedgekeurde of gratis tool — dat is het kernrisico.' },
  { q:'Wat verwacht artikel 4 van de EU AI Act van scholen zoals Sint-Rembert?',
    o:['Dat scholen een aparte AI-ambtenaar in dienst nemen.',
       'Dat personeelsleden die met AI werken over voldoende AI-geletterdheid beschikken.',
       'Dat elk AI-gebruik vooraf wordt goedgekeurd door de Vlaamse overheid.',
       'Dat scholen verplicht minstens één betaalde AI-licentie aankopen.'],
    a:1, f:'Artikel 4 verplicht organisaties — ook scholen — om voldoende AI-geletterdheid te garanderen bij wie met AI werkt.' },
  { q:'Wat kan generatieve AI, in tegenstelling tot een traditionele zoekmachine?',
    o:['Sneller laden op een trage internetverbinding.',
       'Volledig nieuwe tekst, beelden, audio of code genereren op basis van een prompt.',
       'Automatisch alle bronnen dubbel controleren op juistheid.',
       'Werken zonder enige vorm van trainingsdata.'],
    a:1, f:'Een zoekmachine vindt bestaande informatie. GenAI creëert nieuwe content op basis van een prompt.' },
];

function renderStartTest(){
  const c = document.getElementById('st-content');
  if(!c) return;
  S.starttest.taken ? renderStartTestLocked(c) : renderStartTestQuiz(c);
}

function renderStartTestLocked(c){
  const pass = S.starttest.passed;
  c.innerHTML = `
<div class="s-badge">🧪 Startest</div>
<h2 class="ch2">Je hebt de startest al <em>afgelegd</em></h2>
<div class="tr-box ${pass?'pass':'fail'}">
  <div class="tr-score ${pass?'pass':'fail'}">${S.starttest.score}%</div>
  <div class="tr-msg">${pass ? '✅ Geslaagd — Module 1 overgeslagen' : 'Onder de 80% — Module 1 is vereist'}</div>
  <div class="tr-sub">Deze test kan maar één keer worden afgelegd. ${pass ? 'Je kan meteen verder naar Module 2: Beleid &amp; Leerlingen.' : 'Doorloop Module 1 om de basis op te frissen — daarna ontgrendelt Module 2 automatisch.'}</div>
  <button class="sr-btn g" onclick="${pass?'sm(2)':'sm(1)'}">${pass?'Naar Module 2 →':'Start Module 1 →'}</button>
</div>`;
}

function renderStartTestQuiz(c){
  const id = 'stq';
  const stt = { ans: new Array(ST_Q.length).fill(null), correct: new Array(ST_Q.length).fill(false) };
  let inner = `
<div class="s-badge">🧪 Startest · Verplicht · 1 kans</div>
<h2 class="ch2">Test je <em>basiskennis</em> over AI</h2>
<p class="cp">10 vragen over wat AI is, hoe generatieve AI werkt en welke risico's je moet kennen. Haal je <strong>80% (8/10)</strong>, dan sla je Module 1 over en start je meteen bij Module 2: Beleid &amp; Leerlingen. Let op: je kan deze test maar <strong>één keer</strong> afleggen — kies dus bewust.</p>
<div class="qc">
  <div class="qh"><div class="qi">🧪</div><div><div class="qt">Startest — Wat is AI?</div><div class="qs">10 vragen · slaagdrempel 80%</div></div></div>`;
  ST_Q.forEach((q,qi)=>{
    inner += `<div class="qb"><div class="qq">${qi+1}. ${q.q}</div><div class="opts">`;
    q.o.forEach((opt,oi)=>{
      inner += `<button class="opt" data-qi="${qi}" data-oi="${oi}" id="${id}-o${qi}-${oi}"><span class="ol">${String.fromCharCode(65+oi)}</span>${opt}</button>`;
    });
    inner += `</div><div class="fb" id="${id}-f${qi}"></div></div>`;
  });
  inner += `<div class="q-res" id="${id}-r"></div>
    <div style="display:flex;align-items:center;width:100%;justify-content:flex-end;margin-top:12px;">
      <button class="q-next" id="${id}-n" disabled>Resultaat berekenen →</button>
    </div>
  </div>`;
  c.innerHTML = inner;

  c.querySelectorAll('.opt').forEach(b=>{
    b.onclick = ()=>{
      const qi=+b.dataset.qi, oi=+b.dataset.oi, q=ST_Q[qi];
      if(stt.ans[qi]!==null) return;
      stt.ans[qi]=oi;
      const ok = oi===q.a;
      stt.correct[qi]=ok;
      q.o.forEach((_,i)=>{
        const el=document.getElementById(id+'-o'+qi+'-'+i);
        el.disabled=true;
        if(i===oi) el.classList.add(ok?'cor':'wr');
        else if(i===q.a && !ok) el.classList.add('cor');
      });
      const f=document.getElementById(id+'-f'+qi);
      f.className='fb show '+(ok?'ok':'nok');
      f.textContent=(ok?'✅ ':'❌ ')+q.f;
      if(stt.ans.every(a=>a!==null)) document.getElementById(id+'-n').disabled=false;
    };
  });

  document.getElementById(id+'-n').onclick = ()=>{
    const sc = Math.round(stt.correct.filter(Boolean).length / ST_Q.length * 100);
    const passed = sc >= 80;
    S.starttest = { taken:true, score:sc, passed:passed };
    // GEWIJZIGD: Niet meer automatisch overslaan! Gebruiker MOET Module 1 doen, maar kan skippen
    ss(); up(); rmc();
    const r=document.getElementById(id+'-r');
    r.className='q-res show';
    let msg = passed 
      ? '✅ Geslaagd ('+sc+'%)! Je kan Module 1 overslaan, maar we raden aan dit eerst te doen.'
      : '❌ Nog niet voldoende ('+sc+'%) — Module 1 is vereist.';
    r.innerHTML = '<div class="q-score '+(passed?'pass':'fail')+'">'+sc+'%</div><div class="q-msg">'+msg+'</div>';
    
    const nb=document.getElementById(id+'-n');
    nb.textContent = 'Start Module 1 →';
    nb.disabled = false;
    nb.onclick = ()=> sm(1);
    
    // Voeg skip-knop toe als 80%+
    if(passed){
      const skipBtn = document.createElement('button');
      skipBtn.className = 'q-next';
      skipBtn.textContent = 'Skip → Module 2';
      skipBtn.style.marginLeft = '8px';
      skipBtn.onclick = ()=> { S.mod1.skipped = true; ss(); sm(2); };
      nb.parentElement.appendChild(skipBtn);
    }
  };
}

/* ════════════════════════════════════════════
   MODULE 1 — WAT IS AI? (13 stappen)
   ════════════════════════════════════════════ */

const m1 = [m1s0, m1s1, m1s2, m1s3, m1s4, m1s5, m1s6, m1s7, m1s8, m1s9, m1s10, m1s11, m1s12];

function rm1(){ const c=document.getElementById('m1c'); c.innerHTML=''; rDots(1,m1.length,S.mod1.step); m1[S.mod1.step](c); lockNextButtons(c); }
function n1(){ S.mod1.step++; ss(); S.mod1.step>=m1.length ? d1() : rm1(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); }
function p1(){ if(S.mod1.step > 0){ lastNavDirection='back'; S.mod1.step--; ss(); rm1(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); } }
function d1(){ S.mod1.done=true; S.mod1.step=0; ss(); up(); rmc(); sv('home'); setTimeout(()=>alert('🎉 Module 1 voltooid! Module 2 is nu beschikbaar.'),300); }

function m1s0(c){
  c.innerHTML = `
<div class="s-badge">🤖 Stap 1 van 13 · AI overal</div>
<h2 class="ch2">AI is <em>overal</em> — ook al zie je het niet</h2>
<p class="cp">Gezichtsherkenning op je telefoon, de spamfilter in je mailbox, aanbevelingen op YouTube, de routeplanner die files voorspelt — <strong>AI zit al jaren in onze dagelijkse tools</strong>. En sinds de doorbraak van ChatGPT eind 2022 ook steeds nadrukkelijker in het onderwijs: leerlingen gebruiken chatbots voor taken, uitgeverijen bouwen AI in leerplatformen in, en collega's experimenteren met AI voor lesvoorbereiding.</p>
<p class="cp">Maar wat is AI eigenlijk? In de kern is het software die patronen leert herkennen uit grote hoeveelheden data, en op basis daarvan voorspellingen of beslissingen maakt — zonder dat een mens voor elke situatie apart een regel heeft geprogrammeerd. Dat onderscheidt AI van klassieke software, die enkel doet wat letterlijk in de code staat.</p>
<p class="cp">Als leerkracht hoef je geen ingenieur te zijn, maar je moet AI wel kunnen <strong>herkennen, benoemen en er verantwoord mee omgaan</strong>. Dat is ook wat artikel 4 van de EU AI Act van organisaties — en dus van ons als school — verwacht: voldoende AI-geletterdheid bij iedereen die met AI werkt.</p>

<div class="ib warn">
  <div class="ib-t">💡 Wist je dat?</div>
  <div class="ib-b">Veel digitale schooltools die je al jarenlang gebruikt — spellingcontrole, automatische ondertiteling, een planningstool die voorstelt wanneer je best een toets plant — draaien al langer op AI dan ChatGPT bestaat. Het nieuwe is niet "AI in het onderwijs" op zich, maar specifiek <strong>generatieve AI</strong>, die zelf nieuwe content kan maken. Daarover gaat de volgende stap.</div>
</div>

<div class="nw">
  <button class="sr-btn g" onclick="n1()">Volgende: bekijk de video →</button>
  <span class="nh">Stap 1/13</span>
</div>`;
}

function m1s1(c){
  c.innerHTML = `
<div class="s-badge">🎬 Stap 2 van 13 · Introvideo</div>
<h2 class="ch2">Bekijk: <em>intro artificiële intelligentie</em></h2>
<p class="cp">EDUbox (VRT NWS) introduceert wat AI is en hoe het werkt.</p>
<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/sosmC2h4LLE" allowfullscreen loading="lazy" title="EDUbox Artificiële Intelligentie — Introductie"></iframe></div>
<div class="ib warn">
  <div class="ib-t">📝 Samenvatting</div>
  <div class="ib-b">AI is overal om ons heen, vaak zonder dat we het beseffen: van persoonlijke aanbevelingen op Spotify en Netflix tot zelfrijdende auto's. De video plaatst dit dagelijkse AI-gebruik in perspectief en bereidt voor op de vraag die de rest van deze module beantwoordt: wat is AI nu precies, en welke principes zitten erachter?</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: doe-opdracht →</button>
  <span class="nh">Stap 2/13</span>
</div>`;
}

function m1s2(c){
  c.innerHTML = `
<div class="s-badge">🧩 Stap 3 van 13 · Doe-opdracht</div>
<h2 class="ch2">AI of <em>geen AI</em>?</h2>
<p class="cp">Klik op elke kaart en denk eerst zelf na: gebruikt deze toepassing AI, of werkt ze met vaste, vooraf geprogrammeerde regels?</p>
<div id="aig"></div>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: van regels naar GenAI →</button>
  <span class="nh">Stap 3/13</span>
</div>`;
  renderAiCards();
}

function m1s3(c){
  c.innerHTML = `
<div class="s-badge">📚 Stap 4 van 13 · Geschiedenis & GenAI</div>
<h2 class="ch2">Van vaste regels naar <em>Generatieve AI</em></h2>
<p class="cp">AI bestaat al sinds de jaren 50, en kende eerder al grote doorbraken — denk aan schaakcomputer Deep Blue die in 1997 wereldkampioen Kasparov verslaat. Maar die vroege AI kon vooral één ding: <strong>classificeren of voorspellen</strong>. Is dit e-mailbericht spam? Welke film zou jij waarderen? Het systeem koos tussen vooraf gedefinieerde opties.</p>
<p class="cp">De sprong naar <strong>generatieve AI</strong> (GenAI) verandert dat fundamenteel: deze systemen kunnen tekst, beeld, audio en code <em>maken die nog niet bestond</em>. ChatGPT haalde na zijn lancering eind 2022 razendsnel honderd miljoen gebruikers — geen enkele consumententoepassing groeide ooit zo snel.</p>
<p class="cp">Technisch gezien werkt een taalmodel als GenAI met <strong>kansberekening</strong>: op basis van enorme hoeveelheden tekst leert het systeem welk woord statistisch het meest waarschijnlijk volgt op de woorden die er al staan. Het "begrijpt" dus niet in de menselijke zin van het woord — het voorspelt, woord na woord, wat een plausibel vervolg zou zijn.</p>

<h3 class="ch3">🎬 EDUbox: generatieve AI in de praktijk</h3>
<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/UD0a-i2EBdE" allowfullscreen loading="lazy" title="EDUbox Artificiële Intelligentie — MNM DJ ImAIne"></iframe></div>
<div class="ib warn">
  <div class="ib-t">📝 Samenvatting</div>
  <div class="ib-b">Aan de hand van "DJ ImAIne" — een AI-gegenereerde dj-act — toont deze video heel concreet wat generatieve AI vandaag al kan in de muziekwereld. Het illustreert hoe ver GenAI ondertussen staat: niet langer enkel tekst, maar ook audio en complete creatieve content die overtuigend "echt" klinkt.</div>
</div>

<div style="background: rgba(10,31,168,0.08); border-radius: 12px; padding: 20px; border-left: 4px solid var(--blue); margin: 20px 0;">
  <strong style="color: var(--blue); font-size: 12px; text-transform: uppercase;">⚙️ Hoe werkt een taalmodel technisch?</strong>
  <p style="font-size: 13px; color: #3d4f8a; margin: 12px 0 0 0; line-height: 1.6;">
    <strong>1. Trainingsfase:</strong> Het systeem krijgt miljarden woorden voorgezet (artikelen, boeken, websites). Het ontdekt patronen: welke woorden volgen elkaar op?<br>
    <strong>2. Gewichten:</strong> Gebaseerd op die patronen krijgen verbindingen tussen woorden sterker of zwakker. Dit heet "leren".<br>
    <strong>3. Generatie:</strong> Als je een prompt ingeeft, "rolt" het systeem af — woord na woord — wat statistisch volgen moet. Het begrijpt niet echt; het voorspelt wat waarschijnlijk is.<br>
    <strong>4. Beperkingen:</strong> Daarom maakt AI soms fouten (hallucineert), is bias mogelijk, en kan het zich geen recente info herinneren als die niet in trainingsdata zat.
  </p>
</div>

<h3 class="ch3">🎬 EDUbox: hoe werken neurale netwerken?</h3>
<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/-zmnRz81CNQ" allowfullscreen loading="lazy" title="EDUbox Artificiële Intelligentie — Hoe werken neurale netwerken?"></iframe></div>
<div class="ib warn">
  <div class="ib-t">📝 Samenvatting</div>
  <div class="ib-b">Deze video gaat dieper in op de technische motor achter moderne AI: het neurale netwerk, losjes geïnspireerd op hoe hersenen werken. Lagen van kunstmatige "neuronen" leren patronen herkennen uit grote hoeveelheden voorbeelden — de basis van zowel machine learning als de generatieve AI die je hierboven net zag.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: hallucinaties →</button>
  <span class="nh">Stap 4/13</span>
</div>`;
}

function m1s4(c){
  c.innerHTML = `
<div class="s-badge">⚠️ Stap 5 van 13 · Hallucinaties</div>
<h2 class="ch2">Het belangrijkste begrip van <em>deze module</em></h2>
<div class="ib warn">
  <div class="ib-t">⚠️ Hallucinaties</div>
  <div class="ib-b">Omdat GenAI altijd het meest waarschijnlijke volgende woord voorspelt, klinkt de output <strong>altijd zelfverzekerd</strong> — ook wanneer ze feitelijk fout is. Dat noemen we een <strong>hallucinatie</strong>: verzonnen informatie die er volkomen betrouwbaar uitziet. Een AI-tool kan bijvoorbeeld een wetenschappelijke studie "citeren" met auteur, titel en jaartal — die er gewoonweg niet bestaat. Het systeem "verzint" niet bewust; het stelt enkel een plausibel vervolg samen, zonder enige garantie dat het ook waar is.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: doe-opdracht →</button>
  <span class="nh">Stap 5/13</span>
</div>`;
}

function m1s5(c){
  c.innerHTML = `
<div class="s-badge">🧩 Stap 6 van 13 · Doe-opdracht</div>
<h2 class="ch2">Spot de <em>hallucinatie</em></h2>
<p class="cp">Hieronder staan 4 uitspraken zoals een AI-chatbot ze zou kunnen formuleren — stuk voor stuk even zelfverzekerd. Klik op elke kaart: welke bevat een hallucinatie (verzonnen feit, bron of cijfer), en welke klopt gewoon?</p>
<div id="hallu"></div>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: kansen & gevaren →</button>
  <span class="nh">Stap 6/13</span>
</div>`;
  renderHalluCards();
}

function m1s6(c){
  c.innerHTML = `
<div class="s-badge">⚖️ Stap 7 van 13 · Kansen & gevaren</div>
<h2 class="ch2">Mogelijkheden én <em>gevaren</em> van GenAI</h2>
<p class="cp">GenAI biedt enorme kansen voor je lespraktijk — maar ook concrete risico's die je moet kennen om zelf verantwoord te werken én om leerlingen goed te begeleiden. Geen van beide kanten weegt zwaarder: het gaat om een afgewogen, kritische blik.</p>

<div class="grid2">
  <div class="pane-ok lijst-ok">
    <div class="lijst-h-ok">✅ Kansen voor leerkrachten</div>
    <div>→ Snellere lesvoorbereiding en differentiatiemateriaal</div>
    <div>→ Feedback formuleren op geanonimiseerde leerlingteksten</div>
    <div>→ Administratieve last verlagen (verslagen, e-mails)</div>
    <div>→ Creatieve ideeën en oefeningen genereren</div>
    <div>→ Eindtermen helpen vertalen naar concreet lesmateriaal</div>
    <div>→ Rubrics en toetsvragen sneller opstellen (altijd zelf controleren)</div>
  </div>
  <div class="pane-nok lijst-nok">
    <div class="lijst-h-nok">⚠️ Gevaren om te kennen</div>
    <div>→ Hallucinaties: overtuigende maar foute informatie</div>
    <div>→ Bias: stereotypen uit trainingsdata in de output</div>
    <div>→ Deepfakes: nagemaakte beelden, video's of stemmen van echte mensen</div>
    <div>→ Privacyrisico bij invoer van persoonsgegevens</div>
    <div>→ Auteursrecht- en plagiaatvragen bij gegenereerde content</div>
    <div>→ Overmatig vertrouwen, waardoor kritisch denken verslapt</div>
  </div>
</div>

<h3 class="ch3">🎬 EDUbox: AI-toepassingen in de samenleving</h3>
<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/fZ_r7LXsMHs" allowfullscreen loading="lazy" title="EDUbox Artificiële Intelligentie — Toepassingen van AI"></iframe></div>
<div class="ib warn">
  <div class="ib-t">📝 Samenvatting</div>
  <div class="ib-b">Deze video toont indrukwekkende, concrete toepassingen van AI in sectoren zoals gezondheidszorg, mobiliteit en veiligheid — een goed tegengewicht tegen louter doemdenken. Tegelijk maakt ze duidelijk dat elke toepassing zorgvuldig afgewogen moet worden: dezelfde technologie die levens kan redden, brengt ook verantwoordelijkheid met zich mee.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: bias-voorbeeld →</button>
  <span class="nh">Stap 7/13</span>
</div>`;
}

function m1s7(c){
  c.innerHTML = `
<div class="s-badge">🎲 Stap 8 van 13 · Bias</div>
<h2 class="ch2">Een concreet voorbeeld voor <em>in de klas</em></h2>
<p class="cp">Vraag een beeldgenerator: <em>"Teken een CEO."</em> De kans is groot dat je een witte man van middelbare leeftijd krijgt. Vraag <em>"Teken een verpleegkundige"</em> en je krijgt hoogstwaarschijnlijk een vrouw. De AI verzint dit niet uit het niets — ze reproduceert maatschappelijke stereotypen die in haar trainingsdata oversterk vertegenwoordigd zijn. Dit soort voorbeeld is een krachtig en heel concreet aanknopingspunt om bias met leerlingen te bespreken: het is meteen zichtbaar, het is herkenbaar, en het opent een gesprek over hoe data onze blik kan vertekenen.</p>

<h3 class="ch3">🎬 EDUbox: Ethiek & Bias — An Jacobs (VUB)</h3>
<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/Yft4D4TdPxQ" allowfullscreen loading="lazy" title="EDUbox Artificiële Intelligentie — Ethiek en Bias met An Jacobs"></iframe></div>
<div class="ib warn">
  <div class="ib-t">📝 Samenvatting</div>
  <div class="ib-b">Professor An Jacobs (VUB) legt uit hoe bias in AI-systemen precies ontstaat en hoe we ervoor kunnen zorgen dat AI geen vooroordelen reproduceert. Ze koppelt dit aan de kwaliteit van trainingsdata: als een dataset onevenwichtig is samengesteld, leert het systeem die onbalans als "normaal" aan — exact het mechanisme achter het CEO/verpleegkundige-voorbeeld hierboven.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: deepfakes →</button>
  <span class="nh">Stap 8/13</span>
</div>`;
}

function m1s8(c){
  c.innerHTML = `
<div class="s-badge">🎭 Stap 9 van 13 · Deepfakes</div>
<h2 class="ch2">Wanneer "zien is geloven" <em>niet meer geldt</em></h2>
<p class="cp">Een deepfake is beeld, video of audio waarin AI het gezicht, de stem of de bewegingen van een bestaand persoon overtuigend nadoet. Voor leerlingen is dit relevant op twee niveaus: enerzijds als bewustmaking ("niet alles wat je ziet is automatisch echt"), anderzijds als concreet risico — gezichten manipuleren of onschuldig lijkende filters toepassen op foto's van klasgenoten valt onder de privacywetgeving (AVG/GDPR) en kan leiden tot pesterijen. Maak dit als leerkracht expliciet duidelijk, en handel kordaat als het toch gebeurt.</p>

<h3 class="ch3">🎬 EDUbox: ethische dilemma's bij AI</h3>
<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/YvbibGLIJzo" allowfullscreen loading="lazy" title="EDUbox Artificiële Intelligentie — Ethische dilemma's"></iframe></div>
<div class="ib warn">
  <div class="ib-t">📝 Samenvatting</div>
  <div class="ib-b">Deze video gaat dieper in op concrete ethische dilemma's rond AI-gebruik: wie is verantwoordelijk wanneer een AI-systeem een fout maakt, en hoe wegen we de voordelen van AI af tegen de risico's? Een goede aansluiting bij het deepfake-thema hierboven: ook daar botsen technologische mogelijkheden met ethische grenzen.</div>
</div>

<h3 class="ch3">🎬 EDUbox: moeten we ons zorgen maken?</h3>
<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/Rswv6FuAZug" allowfullscreen loading="lazy" title="EDUbox Artificiële Intelligentie — Moeten we ons zorgen maken over AI?"></iframe></div>
<div class="ib warn">
  <div class="ib-t">📝 Samenvatting</div>
  <div class="ib-b">Een AI-expert beantwoordt de vraag of de snelle evolutie van AI reden tot bezorgdheid is. De kernboodschap: niet blind paniekeren, maar ook niet naïef zijn — een genuanceerde, kritische houding is precies wat deze hele module probeert mee te geven.</div>
</div>

${promoMini('Wil je dieper graven in de ethische kant van AI? Op 18 november verwelkomen we prof. Orhan Agirdag (KU Leuven).')}

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: hype of realiteit? →</button>
  <span class="nh">Stap 9/13</span>
</div>`;
}

function m1s9(c){
  c.innerHTML = `
<div class="s-badge">🎬 Stap 10 van 13 · Hype of realiteit?</div>
<h2 class="ch2">De impact van AI op ons onderwijs: <em>hype of realiteit?</em></h2>
<svg viewBox="0 0 700 110" style="width:100%;height:auto;display:block;margin-bottom:18px;border-radius:var(--rsm);background:var(--blue)" xmlns="http://www.w3.org/2000/svg">
  <circle cx="80" cy="55" r="34" fill="rgba(127,224,0,.18)"/>
  <text x="80" y="65" font-size="32" text-anchor="middle">📣</text>
  <text x="160" y="48" font-family="Archivo Black, sans-serif" font-size="15" fill="#ffffff">HYPE</text>
  <text x="160" y="68" font-family="Nunito, sans-serif" font-size="11" fill="rgba(255,255,255,.55)" font-weight="700">Doemscenario's, clickbait, AGI-fantasie</text>
  <line x1="320" y1="25" x2="320" y2="85" stroke="rgba(255,255,255,.2)" stroke-width="2"/>
  <text x="380" y="48" font-family="Archivo Black, sans-serif" font-size="15" fill="#7FE000">REALITEIT</text>
  <text x="380" y="68" font-family="Nunito, sans-serif" font-size="11" fill="rgba(255,255,255,.55)" font-weight="700">Patroonherkenning, concrete klaspraktijk</text>
  <circle cx="600" cy="55" r="34" fill="rgba(127,224,0,.18)"/>
  <text x="600" y="65" font-size="32" text-anchor="middle">🔍</text>
</svg>
<p class="cp">Leerlingen zien op sociale media de wildste doemscenario's over AI — en evengoed de wildste belofes. Om het gesprek hierover goed te starten (met collega's, of in je eigen klas), bekijk dit videofragment.</p>

<h3 class="ch3">🎬 NOS op 3: "Roeit AI ons uit… of is het hype?"</h3>
<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/-WDdSiVjBhg" allowfullscreen loading="lazy" title="NOS op 3 — Roeit AI ons uit of is het hype"></iframe></div>
<p class="cp">Deze video plaatst de extreme doemscenario's rondom AI in perspectief en verlegt de focus naar de échte, actuele uitdagingen zoals misinformatie en tech-hypes.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: reflectievragen →</button>
  <span class="nh">Stap 10/13</span>
</div>`;
}

function m1s10(c){
  c.innerHTML = `
<div class="s-badge">💬 Stap 11 van 13 · Reflectievragen</div>
<h2 class="ch2">Vijf vragen om over <em>na te denken</em></h2>
<div class="disc-card">
  <div class="disc-q">1. Leerlingen zien op TikTok en YouTube de wildste doemscenario's over AI. Hoe kunnen wij in de klas helpen om die 'hype' te doorprikken?</div>
  <div class="disc-a">Ga in gesprek zonder de zorgen van leerlingen direct weg te lachen. Ontleed samen waar die verhalen vandaan komen (vaak films of clickbait) en leer ze het verschil tussen de huidige AI (patroonherkenning) en toekomstmuziek zoals 'algemene intelligentie' (AGI).</div>
</div>
<div class="disc-card">
  <div class="disc-q">2. De video noemt deepfakes en misinformatie als reële problemen. Hoe wapenen we leerlingen tegen een wereld waarin ze niet alles kunnen geloven wat ze op een scherm zien?</div>
  <div class="disc-a">Digitale geletterdheid moet verschuiven naar scherpe bronkritiek. Leer leerlingen zijdelings lezen (lateral reading): check wie de afzender is, wat het doel van het bericht is, en vergelijk met betrouwbare bronnen in plaats van enkel de video zelf te analyseren.</div>
</div>
<div class="disc-card">
  <div class="disc-q">3. Techbedrijven beloven gouden bergen. Hoe waken we er als school voor dat we AI inzetten vanuit een doordachte visie, in plaats van zomaar mee te rennen met een commerciële trend?</div>
  <div class="disc-a">De didactiek moet altijd leidend zijn, niet de tool. Draagt een AI-toepassing niet direct bij aan beter of actiever leren? Durf het dan als school te negeren.</div>
</div>
<div class="disc-card">
  <div class="disc-q">4. AI kan razendsnel theorie uitleggen. Biedt dit ons als leraren niet juist de kans om de theorie vaker thuis te laten ontdekken?</div>
  <div class="disc-a">Ja — dit is het perfecte moment voor flipping the classroom. Door de puur theoretische uitleg naar huis te verplaatsen, krijg je in de les de handen vrij voor het allerbelangrijkste: de 'waarom'-vraag en de actieve toepassing van die theorie.</div>
</div>
<div class="disc-card">
  <div class="disc-q">5. Als AI straks veel routinewerk overneemt op de arbeidsmarkt, op welke menselijke vaardigheden moeten wij dan nu de nadruk leggen?</div>
  <div class="disc-a">Verschuif de focus naar vaardigheden waar AI moeite mee heeft: empathie, kritisch oordeelsvermogen, complexe fysieke handelingen, out-of-the-box denken en probleemoplossend vermogen.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: kennischeck →</button>
  <span class="nh">Stap 11/13</span>
</div>`;
}

function m1s11(c){
  const quiz = [
    {q: 'Wat is een hallucinatie bij generatieve AI?', o: ['Wanneer een AI-model weigert antwoord te geven op een ongepaste of onveilige vraag van een gebruiker.','Wanneer een AI-model met grote stelligheid feitelijk onjuiste of verzonnen informatie genereert.','Wanneer een AI-model tijdelijk trager werkt door een overbelasting van de servers of slechte internetverbinding.','Wanneer een AI-model letterlijke tekstblokken overneemt uit de auteursrechtelijk beschermde trainingsdata.'], a: 1, f: 'Hallucinaties zijn plausibel klinkende maar foutieve output — een direct gevolg van voorspellen op kansberekening.' },
    {q: 'Welke AI-tool is binnen Sint-Rembert volledig ondersteund en dataproof?', o: ['De gratis consumentenversie van ChatGPT via een persoonlijk Google- of e-mailaccount.','Google Gemini Advanced mits er ingelogd wordt met een geverifieerd privé-account.','Copilot M365 wanneer je bent aangemeld met je officiële schoolaccount van de scholengroep.','Midjourney Commercial Edition die door de vakgroep esthetica apart wordt aangekocht.'], a: 2, f: 'Copilot via je schoolaccount valt onder de schoolovereenkomst met gegarandeerde gegevensbescherming.' },
    {q: 'Wat is de grote sprong van generatieve AI t.o.v. eerdere AI-vormen?', o: ['Generatieve AI kan volledig nieuwe content creëren zoals vloeiende teksten, afbeeldingen, audio en programmeercode.','Generatieve AI werkt aanzienlijk sneller en vereist veel minder rekenkracht en servercapaciteit om te draaien.','Generatieve AI maakt dankzij de nieuwste taalmodellen nooit meer inhoudelijke fouten of logische misvattingen.','Generatieve AI is uitsluitend geprogrammeerd op basis van door mensen handmatig ingevoerde als-dan-regels.'], a: 0, f: 'Vroegere AI classificeerde en voorspelde; GenAI creëert nieuwe content.' },
    {q: 'Waarom is bias in AI relevant voor jouw dagelijkse lespraktijk?', o: ['Omdat AI-modellen hiermee trager worden in het verwerken van complexe opdrachten van leerlingen.','Omdat AI hiermee stereotypen uit trainingsdata reproduceert, wat een belangrijk mediawijsheidsthema is.','Omdat bias er onbedoeld voor zorgt dat gratis tools minder functies hebben dan betaalde licenties.','Omdat AI hierdoor automatisch een voorkeur ontwikkelt voor Engelstalige bronnen boven Nederlandstalige.'], a: 1, f: 'AI leert van data vol menselijke vooroordelen. Dit bespreken met leerlingen trainen hun mediawijsheid.' },
    {q: 'Een AI-tekst vermeldt een wetenschappelijke studie met auteur en jaartal. Wat is de juiste reflex?', o: ['De bron blindelings overnemen in je lesmateriaal, want een vermelding met jaartal en auteur is betrouwbaar.','De genoemde bron zelfstandig opzoeken via betrouwbare kanalen om te controleren of deze daadwerkelijk bestaat.','Enkel controleren of het jaartal logisch is binnen de historische context van de rest van de tekst.','In dezelfde chat aan de AI-tool vragen of de zojuist gegenereerde bronvermelding wel echt helemaal klopt.'], a: 1, f: 'Verzonnen bronvermeldingen zijn een klassieke hallucinatie. Zelf controleren is noodzakelijk.' }
  ];
  rQuiz(c, quiz, 1, 'mod1', n1, 60);
}

function m1s12(c){
  c.innerHTML = `
<div class="s-badge">✍️ Stap 13 van 13 · Vertaalslag naar jouw vak</div>
<h2 class="ch2">Vertaal naar <em>jouw lespraktijk</em></h2>
<p class="cp">Je kent nu de basis: hoe AI werkt, wat generatieve AI bijzonder maakt, en welke kansen én gevaren erbij horen (hallucinaties, bias, deepfakes, privacy). Tijd om dit concreet te maken voor jouw eigen vak en klaspraktijk.</p>

<h3 class="ch3">🎓 Wat zegt de wetenschap?</h3>
<p class="cp">Rani Van Schoors, postdoctoraal onderzoeker AI in onderwijs aan KU Leuven, nuanceert de vraag of leerlingen door AI nog wel zelf leren schrijven of denken. Volgens haar blijft <strong>jij als leerkracht onmisbaar</strong>: leerlingen kijken vaak te weinig kritisch naar online bronnen, en datzelfde geldt voor AI-output, die altijd nog een check verdient, want taalmodellen kunnen hallucineren. Ze illustreert dit met een treffend voorbeeld: Google Bard (nu Gemini) vertelde ooit onterecht dat de James Webb-ruimtetelescoop als eerste beelden van buiten ons zonnestelsel had kunnen maken.</p>
<p class="cp">Van Schoors wijst er ook op dat de kwaliteit van een AI-systeem volledig afhangt van de data waarmee het getraind werd: als je een dataset met enkel honden in een mand en katten in het gras gebruikt, zal het systeem een hond in het gras verkeerd als kat herkennen. Dat is precies hoe bias ontstaat — een mooie brug naar wat je eerder in deze module al zag.</p>

<div class="ib warn">
  <div class="ib-t">📚 Bron</div>
  <div class="ib-b">Klasse, "AI in het onderwijs: nuttige helper of vervangleraar?" — interview met Rani Van Schoors (KU Leuven). <a href="https://www.klasse.be/722771/ai-in-het-onderwijs-expert-rani-schoors/" target="_blank">klasse.be/722771</a></div>
</div>

<h3 class="ch3">💭 Wat denk jij?</h3>
<div id="stl-m1"></div>

<p class="cp">Noteer hieronder je reflectie (minstens een paar zinnen): bij welke les of taak zou AI écht meerwaarde bieden? En waar zou je het net bewust <strong>niet</strong> inzetten, en waarom niet?</p>
<textarea class="sr-ta" id="r1" placeholder="Ik denk aan mijn les... AI zou meerwaarde hebben bij... AI zou ik uitsluiten bij... omdat..."></textarea>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" id="r1btn" onclick="sR1()">✅ Module 1 afronden →</button>
  <span class="nh">Stap 13/13</span>
</div>`;
  const ta = document.getElementById('r1');
  ta.value = localStorage.getItem('sr_r1') || '';
  ta.oninput = ()=>localStorage.setItem('sr_r1', ta.value);
  renderStellingen('stl-m1', 'm1', ['AI zal er binnen 10 jaar voor zorgen dat leerlingen minder goed zelfstandig kunnen schrijven.','Als leerkracht moet ik AI-output altijd controleren, ook als die er overtuigend uitziet.']);
}

function sR1(){
  const v = (document.getElementById('r1').value||'').trim();
  if(v.length < 30){ alert('Vul eerst je reflectie in (minstens een paar zinnen).'); return; }
  n1();
}

/* ════════════════════════════════════════════
   MODULE 2 — BELEID & LEERLINGEN (met Casus!)
   Nu 10 stappen (was 9) — Casus tussenvoegd
   ════════════════════════════════════════════ */

const m2 = [m2s0, m2s1, m2s2, m2s_casus, m2s4, m2s_leeftijd, m2s5, m2s6, m2s7, m2s8, m2s9];

function rm2(){ const c=document.getElementById('m2c'); c.innerHTML=''; console.log('🔄 rm2: stap', S.mod2.step, 'van', m2.length); rDots(2,m2.length,S.mod2.step); m2[S.mod2.step](c); lockNextButtons(c); }
function n2(){ S.mod2.step++; ss(); S.mod2.step>=m2.length ? d2() : rm2(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); }
function p2(){ if(S.mod2.step > 0){ lastNavDirection='back'; S.mod2.step--; ss(); rm2(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); } }
function d2(){ S.mod2.done=true; S.mod2.step=0; ss(); up(); rmc(); sv('cert'); }

function m2s0(c){
  c.innerHTML = `
<div class="s-badge">📜 Stap 1 van 11 · Het Beleidskader AI</div>
<h2 class="ch2">Het officiële <em>AI-beleidskader</em> van Sint-Rembert</h2>
<p class="cp">Wat je in deze module leert, is geen losse verzameling tips — het is de concrete vertaling van het <strong>Beleidskader Artificiële Intelligentie</strong> van Scholengroep Sint-Rembert (versie 1.0, goedgekeurd door het Bestuursorgaan op 23/06/2026). Dit is het overkoepelend referentiedocument voor AI-gebruik binnen de hele scholengroep, voor zowel leerlingen als medewerkers — en de inhoudelijke basis voor het schoolreglement en het arbeidsreglement.</p>
<p class="cp">De scholengroep staat positief tegenover AI in onderwijs en ondersteunende processen, op voorwaarde dat het gebruik <strong>zorgvuldig, veilig en transparant</strong> verloopt, met respect voor de wet en aandacht voor ethische aspecten zoals bias en de ecologische impact van AI.</p>

<div class="ib warn">
  <div class="ib-t">🎯 De kern van het beleid</div>
  <div class="ib-b">AI wordt ingezet ter ondersteuning van leren, onderwijzen en organiseren — <strong>nooit</strong> als vervanging van professionele oordeelsvorming, de pedagogische relatie of de menselijke verantwoordelijkheid.</div>
</div>

<div class="nw">
  <button class="sr-btn g" onclick="n2()">Volgende: de 4 principes →</button>
  <span class="nh">Stap 1/11</span>
</div>`;
}

function m2s1(c){
  c.innerHTML = `
<div class="s-badge">🧭 Stap 2 van 11 · 4 niet-onderhandelbare principes</div>
<h2 class="ch2">De <em>4 principes</em> achter elke AI-toepassing</h2>
<p class="cp">AI komt zowel gevraagd als ongevraagd de scholen binnen. Daarom gelden voor élke AI-toepassing binnen Sint-Rembert vier niet-onderhandelbare principes.</p>

<h3 class="ch3">1️⃣ De mens blijft centraal</h3>
<p class="cp">We hanteren het <strong>mens-machine-mens-principe</strong>: AI kan input leveren of suggesties formuleren, maar de inzet vertrekt altijd vanuit een menselijke vraag en eindigt steeds met menselijke controle, beoordeling en verantwoordelijkheid. Beslissingen over didactiek, evaluatie, begeleiding, zorg en klasmanagement blijven altijd in handen van mensen.</p>

<h3 class="ch3">2️⃣ Meerwaarde is vereist</h3>
<p class="cp">AI wordt enkel ingezet bij een duidelijke en aantoonbare pedagogische meerwaarde. Levert AI geen verbetering op, of kan hetzelfde doel even goed zonder AI bereikt worden? Dan verdient het de voorkeur om AI <strong>niet</strong> in te zetten.</p>

<h3 class="ch3">3️⃣ Transparantie en eigenaarschap</h3>
<p class="cp">Wie AI gebruikt, blijft altijd verantwoordelijk voor het proces én de uiteindelijke output. AI-output wordt steeds zorgvuldig beoordeeld voordat ze gebruikt of gedeeld wordt — en het gebruik van AI wordt zichtbaar gemaakt wanneer dat relevant is.</p>

<h3 class="ch3">4️⃣ Leeftijds- en ontwikkelingsgeschikt</h3>
<p class="cp">AI-gebruik moet steeds afgestemd zijn op de leeftijd, maturiteit en ontwikkelingsfase van leerlingen. AI-toepassingen mogen geen afbreuk doen aan basisvaardigheden zoals lezen, schrijven, rekenen en zelfstandig formuleren.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="n2()">Volgende: goedgekeurde tools →</button>
  <span class="nh">Stap 2/11</span>
</div>`;
}

function m2s2(c){
  c.innerHTML = `
<div class="s-badge">🛠️ Stap 3 van 11 · Goedgekeurde AI-tools</div>
<h2 class="ch2">Welke tools mag je <em>gebruiken</em>?</h2>
<p class="cp">Sint-Rembert kiest bewust voor <strong>Microsoft Copilot</strong> als primaire generatieve AI-tool. Copilot is geïntegreerd in de bestaande Microsoft 365-omgeving en wordt gebruikt met je persoonlijke Sint-Rembert-account, waardoor het gebruik volledig binnen de beveiligde schoolomgeving blijft. Ingevoerde gegevens, prompts en gegenereerde output worden <strong>niet</strong> gebruikt om de onderliggende AI-modellen te trainen.</p>
<p class="cp">Daarnaast staat de scholengroep ook deze toepassingen toe, mits je je houdt aan de principes en schoolafspraken:</p>

<div class="grid2">
  <div class="pane-ok lijst-ok">
    <div class="lijst-h-ok">✅ Toegestane AI-toepassingen</div>
    <div>→ Microsoft Copilot for M365 (eerste keuze)</div>
    <div>→ Microsoft Copilot Chat</div>
    <div>→ Bookwidgets AI</div>
    <div>→ ChatGPT</div>
    <div>→ Claude.ai</div>
    <div>→ Gamma.app</div>
    <div>→ Google Gemini</div>
    <div>→ NotebookLM</div>
  </div>
  <div class="pane-nok lijst-nok">
    <div class="lijst-h-nok">⚠️ Niet-goedgekeurde tools</div>
    <div>→ Elke AI-toepassing die niet op de goedgekeurde lijst staat, wordt beschouwd als <strong>"shadow AI"</strong> en is niet toegelaten zonder voorafgaande goedkeuring</div>
    <div>→ Ook tools gemaakt via "vibecoding" of low-code/no-code AI-platformen moeten eerst aan de IT-dienst worden voorgelegd</div>
  </div>
</div>

<p class="cp">Waarom geen vrije keuze? Bij externe, gratis platformen is vaak onduidelijk wat er met de data gebeurt en of die gebruikt wordt om AI-modellen te trainen. Door te kiezen voor Copilot vermijdt de scholengroep dat school- of persoonsgegevens ongecontroleerd bij dergelijke platformen terechtkomen.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="n2()">Volgende: AI-labels →</button>
  <span class="nh">Stap 3/11</span>
</div>`;
}

/* ════════════════════════════════════════════
   NIEUW: m2s_casus — Kies-je-eigen-avontuur
   Tussenvoegd als stap 4 van 10
   ════════════════════════════════════════════ */

function m2s_casus(c){
  c.innerHTML = `
<div class="s-badge">🎯 Stap 4 van 11 · Praktijkscenario's</div>
<h2 class="ch2">Praktijkscenario's: <em>wat doe jij?</em></h2>
<p class="cp">Hier volgen drie herkenbare situaties uit de klas. Voor elke situatie kies je hoe je zou reageren — en krijg je direct feedback waarom die aanpak wel of niet werkt.</p>
<div id="casus-container"></div>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="n2()">Volgende: mag het wel/niet? →</button>
  <span class="nh">Stap 4/11</span>
</div>`;
  renderCasusScenario('casus-container');
}

/* ════════════════════════════════════════════
   ORIGINEEL m2s3 → NU m2s4 (Labels + Doe-opdracht)
   ════════════════════════════════════════════ */

function m2s4(c){
  c.innerHTML = `
<div class="s-badge">🛡️ Stap 5 van 11 · Spelregels & AI-labels</div>
<h2 class="ch2">Het AI-beleid van <em>Sint-Rembert</em></h2>
<p class="cp">Niet elke opdracht leent zich tot AI-gebruik, en niet elke leerling zal vanzelf aanvoelen waar de grens ligt. Daarom werkt Sint-Rembert met <strong>5 duidelijke AI-labels</strong> die je aan een taak of opdracht koppelt, zodat voor leerlingen meteen helder is wat wel en niet mag.</p>
<div class="labels-grid">
  <div class="label-card l1"><div class="lc-num">1</div><div class="lc-name">Geen AI</div></div>
  <div class="label-card l2"><div class="lc-num">2</div><div class="lc-name">Ideeën</div></div>
  <div class="label-card l3"><div class="lc-num">3</div><div class="lc-name">Bewerking</div></div>
  <div class="label-card l4"><div class="lc-num">4</div><div class="lc-name">Aanvulling</div></div>
  <div class="label-card l5"><div class="lc-num">5</div><div class="lc-name">Vrij</div></div>
</div>
<p class="cp">De labels lopen op van strikt verbod (label 1) tot volledig vrij AI-gebruik (label 5), met daartussen geleidelijk meer ruimte. Deze schaal is gebaseerd op de AI-gebruiksschaal die Schoolmakers ontwikkelde naar het model van onderzoeker Leon Furze (Universiteit van Melbourne), en sluit aan bij het beleidskader: <em>"als uitgangspunt geldt dat AI-gebruik niet is toegestaan, tenzij de leerkracht expliciet aangeeft dat AI geheel of gedeeltelijk gebruikt mag worden."</em></p>

<h3 class="ch3">📋 De labels uitgelegd</h3>
<div class="grid2">
  <div class="pane-ok lijst-ok">
    <div class="lijst-h-ok">Label 1: Geen AI</div>
    <div style="font-size:13px; margin-top:8px;">AI is niet toegestaan. Handschrift, eigen denken, geen digitale hulp.</div>
  </div>
  <div class="pane-ok lijst-ok">
    <div class="lijst-h-ok">Label 2: Ideeën</div>
    <div style="font-size:13px; margin-top:8px;">AI mag voor brainstorm en ideeëngeneratie. Het werk zelf is van de leerling.</div>
  </div>
</div>

<div class="grid2">
  <div class="pane-ok lijst-ok">
    <div class="lijst-h-ok">Label 3: Bewerking</div>
    <div style="font-size:13px; margin-top:8px;">AI mag helpen met schrijfstijl en grammatica. Inhoud blijft van de leerling.</div>
  </div>
  <div class="pane-ok lijst-ok">
    <div class="lijst-h-ok">Label 4: Aanvulling</div>
    <div style="font-size:13px; margin-top:8px;">AI mag delen van het werk aanvullen/genereren. Leerling integreert en werkt kritisch.</div>
  </div>
</div>

<div class="grid2">
  <div class="pane-ok lijst-ok" style="grid-column: span 2;">
    <div class="lijst-h-ok">Label 5: Vrij</div>
    <div style="font-size:13px; margin-top:8px;">AI mag volledig vrij ingezet. Leerling kan kiezen hoe en hoeveel. Leerling reflecteert op eigenaarschap en keuzes.</div>
  </div>
</div>

<h3 class="ch3">🧩 Doe-opdracht: Welk label hoort hier?</h3>
<p class="cp">Bekijk elke opdrachtomschrijving en klik op het label (1 t.e.m. 5) dat er volgens jou het best bij past.</p>
<div id="lblmatch"></div>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="n2()">Volgende: leerlingen begeleiden →</button>
  <span class="nh">Stap 5/11</span>
</div>`;
  renderLabelMatch();
}

function m2s_leeftijd(c){
  c.innerHTML = `
<div class="s-badge">📚 Stap 6 van 11 · AI per leeftijdsfase</div>
<h2 class="ch2">AI-gebruik per <em>leeftijdsgroep</em></h2>
<p class="cp">AI-gebruik door leerlingen hangt sterk af van hun leeftijd en rijpheid. Sint-Rembert volgt daarom duidelijke richtlijnen per leeftijdsfase. Dit beschermt jongere leerlingen én geeft grotere leerlingen de ruimte om verantwoord te experimenteren.</p>

<div style="background: white; border-left: 4px solid var(--blue); border-radius: 12px; padding: 20px; margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 14px; color: var(--blue); text-transform: uppercase; margin-bottom: 12px;">👶 2,5 tot 6 jaar (kleuteronderwijs)</div>
  <p style="font-size: 13px; color: #3d4f8a; line-height: 1.8; font-weight: 600; margin-bottom: 12px;">
    <strong>Geen zelfstandig AI-gebruik door leerlingen.</strong> AI kan uitsluitend indirect en ondersteunend door de <strong>leerkracht</strong> worden ingezet. Voorbeelden:
  </p>
  <ul style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.8; margin-left: 20px;">
    <li>✓ AI helpt bij verhaaltjes uitwerken (fantasie & taal)</li>
    <li>✓ AI genereert afbeeldingen ter ondersteuning (verwondering)</li>
    <li>✓ AI helpt liedjes of versjes schrijven (creativiteit)</li>
  </ul>
  <div style="background: rgba(224,32,32,0.1); border-left: 3px solid var(--red); padding: 12px; border-radius: 8px; margin-top: 12px;">
    <strong style="color: var(--red); font-size: 12px; text-transform: uppercase;">❌ NIET:</strong>
    <p style="font-size: 12px; color: #3d4f8a; font-weight: 600; margin-top: 6px;">Leerlingen zelf aan de slag met AI-tools. Focus: taalontwikkeling, verwondering, fantasie — NIET technologie.</p>
  </div>
</div>

<div style="background: white; border-left: 4px solid #3a2b9e; border-radius: 12px; padding: 20px; margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 14px; color: #3a2b9e; text-transform: uppercase; margin-bottom: 12px;">📖 6 tot 13 jaar (lager onderwijs)</div>
  <p style="font-size: 13px; color: #3d4f8a; line-height: 1.8; font-weight: 600; margin-bottom: 12px;">
    <strong>AI-gebruik enkel onder begeleiding van de leerkracht.</strong> Leerlingen maken op een <strong>verkennende manier</strong> kennis met wat AI is en wat NIET.
  </p>
  <ul style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.8; margin-left: 20px;">
    <li>✓ Onderscheiden van feiten en fictie</li>
    <li>✓ Onderscheiden van echt van AI-gegenereerd</li>
    <li>✓ Stimuleren van eigen denkprocessen</li>
    <li>✓ Creativiteit blijft centraal</li>
    <li>❌ AI NIET toegestaan tijdens evaluaties/toetsen</li>
  </ul>
  <div style="background: rgba(224,32,32,0.1); border-left: 3px solid var(--red); padding: 12px; border-radius: 8px; margin-top: 12px;">
    <strong style="color: var(--red); font-size: 12px; text-transform: uppercase;">⚠️ GDPR – BELANGRIJK:</strong>
    <p style="font-size: 12px; color: var(--red); font-weight: 700; margin-top: 6px;">
      Foto's van kinderen mogen NIET met AI worden bewerkt of als trainingsmateriaal gebruikt. Foto's uploaden naar AI-tools is niet toegestaan wegens privacyrisico.
    </p>
  </div>
</div>

<div style="background: white; border-left: 4px solid var(--green); border-radius: 12px; padding: 20px; margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 14px; color: var(--green); text-transform: uppercase; margin-bottom: 12px;">🎓 13 tot 18 jaar (secundair onderwijs)</div>
  <p style="font-size: 13px; color: #3d4f8a; line-height: 1.8; font-weight: 600; margin-bottom: 12px;">
    <strong>Kritisch en verantwoord AI-gebruik onder expliciete afspraken.</strong> Leerlingen maken bij het begin van het secundair onderwijs voor het eerst gebruik van <strong>begeleide toepassingen</strong>.
  </p>
  <ul style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.8; margin-left: 20px;">
    <li>✓ Kritisch reflecteren op betrouwbaarheid AI-output</li>
    <li>✓ Inzicht in mogelijke bias & vervalsingen</li>
    <li>✓ AI als leerobject EN ondersteunend hulpmiddel</li>
    <li>✓ Per vak/opdracht expliciete afspraken</li>
    <li>✓ Altijd kunnen uitleggen hoe AI werd gebruikt</li>
    <li>✓ Correct brongebruik & verantwoording</li>
    <li>✓ Begrip en eigenaarschap van leerproces centraal</li>
  </ul>
  <div style="background: rgba(224,32,32,0.1); border-left: 3px solid var(--red); padding: 12px; border-radius: 8px; margin-top: 12px;">
    <strong style="color: var(--red); font-size: 12px; text-transform: uppercase;">❌ Geldende regels:</strong>
    <p style="font-size: 12px; color: #3d4f8a; font-weight: 600; margin-top: 6px;">Gebruik van AI buiten de gemaakte afspraken wordt behandeld volgens regels rond evaluatie, eerlijk werken en verantwoordelijkheid. <strong>Foto's bewerken: VERBODEN. Foto's uploaden: VERBODEN (GDPR).</strong></p>
  </div>
</div>

<div class="ib warn" style="margin-top: 28px;">
  <div class="ib-t">🔒 GDPR-Principes bij alle leeftijden</div>
  <div class="ib-b">
    • <strong>Geen foto's van kinderen bewerken met AI</strong> (retinascanning, gezichtsherkenning, etc.)<br>
    • <strong>Geen foto's van kinderen uploaden naar AI-tools</strong> (privacyrisico, datalekkage)<br>
    • <strong>Gepseudonimiseerde gegevens</strong> (werken met nummers i.p.v. namen waar mogelijk)<br>
    • <strong>Toestemming ouders</strong> als leerlingen in AI-piloten/projecten deelnemen
  </div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="n2()">Volgende: leerlingen begeleiden →</button>
  <span class="nh">Stap 6/11</span>
</div>`;
}

function m2s5(c){
  c.innerHTML = `
<div class="s-badge">🧑‍🏫 Stap 7 van 11 · Leerlingen begeleiden & evalueren</div>
<h2 class="ch2">Zo begeleid je <em>leerlingen</em> bij AI</h2>
<p class="cp">Leerlingen experimenteren sowieso met AI — met of zonder jouw toestemming. De meest effectieve aanpak is daarom niet verbieden en hopen dat het niet gebeurt, maar <strong>transparant zijn en kritisch denken trainen</strong>.</p>
<p class="cp">Het beleidskader is hier expliciet: <em>"We kiezen er bewust voor om geen AI-detectietools te gebruiken om het werk van leerlingen te analyseren of te beoordelen."</em> De werking en betrouwbaarheid van zulke tools zijn onvoldoende onderbouwd en leiden tot een grote kans op fout-positieve resultaten. Evaluatie vertrekt bij ons vanuit vertrouwen, professionele oordeelsvorming en het gesprek tussen leerkracht en leerling — niet vanuit een technisch opsporingsprobleem.</p>

<div class="ib warn">
  <div class="ib-t">⚠️ Over AI-detectietools: wees voorzichtig</div>
  <div class="ib-b">Tools die beweren AI-tekst te herkennen zijn <strong>onbetrouwbaar</strong>. Ze leveren regelmatig valse beschuldigingen op — vooral bij leerlingen die formeel schrijven, of niet-moedertaalsprekers. Bovendien schend je de privacy van leerlingen als je hun volledige naam samen met hun tekst in zo'n online tool plaatst.</div>
</div>

<p class="cp">In de plaats daarvan ontwerp je opdrachten die inzicht geven in het <strong>denken, redeneren en handelen</strong> van leerlingen, ook wanneer AI is toegestaan. Mondelinge toelichting en procesgesprekken zijn het instrument om eigenaarschap van het leerproces te toetsen.</p>

<h3 class="ch3">🎬 Arjen Lubach: "Valt het onderwijs nog te redden van AI?"</h3>
<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/xpedFIZFmhc" allowfullscreen loading="lazy" title="Arjen Lubach — Valt het onderwijs nog te redden van AI"></iframe></div>
<p class="cp">Deze video toont op scherpe (en humoristische) wijze hoe AI de dagelijkse lespraktijk en het traditionele huiswerk volledig op zijn kop zet — en raakt rechtstreeks aan de detectie- en evaluatievraag hierboven.</p>

<div class="disc-card">
  <div class="disc-q">1. Lubach laat zien dat traditioneel huiswerk steeds vaker door een chatbot wordt gedaan. Is dit niet het uitgelezen moment om onze manier van lesgeven om te gooien?</div>
  <div class="disc-a">Absoluut. Het reproduceren van theorie als thuiswerk heeft zijn langste tijd gehad. Dit dwingt de overstap naar flipping the classroom: basiskennis thuis, verwerking en toetsing in de klas waar jij direct kan bijsturen.</div>
</div>
<div class="disc-card">
  <div class="disc-q">2. Leraren zoeken wanhopig naar AI-detectiesoftware. Is het spelen van politieagent de juiste weg, of moeten we onze evaluatie anders inrichten?</div>
  <div class="disc-a">Spelen voor politieagent is een wapenwedloop die we als onderwijs gaan verliezen. De duurzame oplossing is procesgericht evalueren: toetsen op wat leerlingen ter plekke in de klas, mondeling of op papier kunnen demonstreren — exact zoals het beleidskader voorschrijft.</div>
</div>
<div class="disc-card">
  <div class="disc-q">3. Hoe zorgen we ervoor dat leerlingen minder snel de neiging hebben om denkwerk blind uit te besteden aan AI?</div>
  <div class="disc-a">Leg de volledige nadruk op het waarom. Begrijpen leerlingen waarom een vaardigheid cruciaal is voor hun ontwikkeling, dan groeit de intrinsieke motivatie en zien ze in dat ze zichzelf tekortdoen door denkwerk over te slaan.</div>
</div>

<h3 class="ch3">💬 Een eerlijk gesprek voeren</h3>
<p class="cp">Een leerling vraagt je weleens: "Hebt u dit met AI gemaakt?" De beste reflex is eerlijkheid: leg uit hoe je de tool als hulpmiddel hebt ingezet, en hoe je zelf de output hebt gecontroleerd en aangepast.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="n2()">Volgende: AI-bestendig ontwerpen →</button>
  <span class="nh">Stap 7/11</span>
</div>`;
}

function m2s6(c){
  c.innerHTML = `
<div class="s-badge">🔧 Stap 8 van 11 · AI-bestendig ontwerpen</div>
<h3 class="ch3">🔧 3 manieren om je opdracht AI-bestendig te maken</h3>
<p class="cp">Achteraf controleren of een leerling AI gebruikte, is lastig. Veel effectiever: ontwerp je opdracht zo dat ze het leerproces zichtbaar maakt:</p>

<div class="grid2">
  <div class="pane-ok lijst-ok">
    <div class="lijst-h-ok">✅ Ontwerp wint van controle</div>
    <div>→ Koppel de opdracht aan een persoonlijke of lokale context (eigen ervaring, eigen klas, actuele lokale gebeurtenis)</div>
    <div>→ Vraag tussenstappen mee in te leveren: kladversie, brainstorm, bronnenlijst</div>
    <div>→ Laat leerlingen hun werk mondeling kort komen toelichten of verdedigen</div>
  </div>
  <div class="pane-nok lijst-nok">
    <div class="lijst-h-nok">⚠️ Minder effectief</div>
    <div>→ Enkel een eindproduct beoordelen zonder zicht op het proces</div>
    <div>→ Vertrouwen op AI-detectietools achteraf</div>
    <div>→ Een algemene, generieke vraag stellen die AI perfect kan beantwoorden</div>
  </div>
</div>

<p class="cp">Voor elk AI-label kan je het ontwerp aanpassen: bij <strong>label 1 (geen AI)</strong> werk je het best met een klasmoment of een handgeschreven kladversie. Bij <strong>labels 2-3 (ideeën/bewerking)</strong> vraag je de brainstorm of de eerste versie mee in te leveren. Bij <strong>labels 4-5 (aanvulling/vrij)</strong> ligt de focus op kritische reflectie: wat heeft de leerling zelf bijgedragen, en wat heeft hij gecontroleerd of aangepast aan de AI-output?</p>

<div class="ib warn" style="margin: 20px 0;">
  <div class="ib-t">🔒 GDPR – Foto's zijn gevoelig</div>
  <div class="ib-b">
    <strong>Laat leerlingen NOOIT foto's van klasgenoten uploaden naar AI-tools.</strong> Privacyrisico's:<br>
    • Gezichtsherkenning & retinascanning<br>
    • Datalekkage bij opslag<br>
    • Misbruik voor deepfakes<br><br>
    <strong>Ook niet toegestaan:</strong> Foto's van kinderen bewerken met AI-beeldgeneratoren (bv. voor posters of kunstprojecten). Dit valt onder portretrecht en GDPR.
  </div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="n2()">Volgende: mag het wel/niet? →</button>
  <span class="nh">Stap 8/11</span>
</div>`;
}

function m2s7(c){
  c.innerHTML = `
<div class="s-badge">📋 Stap 9 van 11 · Mag het wel of niet?</div>
<h2 class="ch2">Concrete <em>voorbeelden</em> uit het beleidskader</h2>
<p class="cp">Het beleidskader geeft een aantal heldere voorbeeldsituaties. Test jezelf: klik op elke situatie en kijk of jouw inschatting klopt.</p>
<div id="magwel"></div>

<div class="ib warn">
  <div class="ib-t">💡 De drie voorwaarden voor schooldocumenten in een betaalde tool</div>
  <div class="ib-b">Schooldocumenten mogen enkel naar een AI-tool als <strong>alle drie</strong> deze voorwaarden gelden: (1) de tool gebruikt je data niet voor modeltraining, (2) gegevens worden niet opgeslagen buiten de EU, en (3) het gaat om een betalende, contractuele relatie met een verwerkersovereenkomst.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="n2()">Volgende: kennischeck →</button>
  <span class="nh">Stap 9/11</span>
</div>`;
  renderMagWel();
}

function m2s8(c){
  const quiz = [
    {q: 'Een leerling gebruikt AI bij een taak met label 1 ("Geen AI"). Wat doe je?', o: ['De situatie negeren noch de taak gewoon normaal verbeteren, aangezien bijna alle leerlingen AI gebruiken.','Dit behandelen als een onregelmatigheid conform het schoolreglement, net zoals bij klassiek afkijken of fraude.','Stilzwijgend en zonder communicatie een aantal punten aftrekken van het eindresultaat voor deze opdracht.','De leerling verplichten om vanaf nu alle toekomstige taken voor jouw vak verplicht met pen en papier in te dienen.'], a: 1, f: 'Label 1 = verbod. AI-gebruik is dan een onregelmatigheid conform het schoolreglement.' },
    {q: 'Welke AI-tool kiest Sint-Rembert als primaire generatieve AI-tool?', o: ['ChatGPT, omdat dit de meest bekende en gebruikte tool wereldwijd is.','Microsoft Copilot, omdat het binnen de beveiligde Microsoft 365-schoolomgeving werkt.','Google Gemini, omdat dit gratis is voor alle leerlingen en personeelsleden.','Geen enkele tool specifiek; elke leerkracht kiest volledig vrij zijn eigen voorkeurstool.'], a: 1, f: 'Copilot is de bewuste eerste keuze omdat het binnen het bestaande identiteits- en toegangsbeheer van de scholengroep blijft.' },
    {q: 'Waarom gebruikt Sint-Rembert bewust GEEN AI-detectietools om leerlingenwerk te controleren?', o: ['Omdat detectietools te duur zijn in licentiekosten voor de volledige scholengroep.','Omdat de betrouwbaarheid onvoldoende onderbouwd is, met een grote kans op fout-positieve resultaten.','Omdat het schoolreglement het gebruik van enige vorm van software tijdens verbeteren verbiedt.','Omdat leerlingen wettelijk recht hebben op een volledig AI-vrije onderwijsomgeving binnen Europa.'], a: 1, f: 'Detectietools zijn onvoldoende betrouwbaar; dit staat haaks op zorgvuldig en rechtvaardig evalueren.' },
    {q: 'Wat is het "mens-machine-mens-principe" uit het beleidskader?', o: ['AI-output wordt automatisch goedgekeurd zodra een mens de oorspronkelijke prompt heeft ingetypt.','De inzet van AI vertrekt altijd vanuit een menselijke vraag en eindigt steeds met menselijke controle.','Twee personeelsleden moeten elke AI-output afzonderlijk goedkeuren voor ze gebruikt mag worden.','Machines nemen voortaan de eerste beoordeling op zich, waarna een mens enkel nog de eindscore zet.'], a: 1, f: 'AI kan input leveren of suggereren, maar het traject start en eindigt altijd bij menselijke verantwoordelijkheid.' },
    {q: 'Een schooldocument mag enkel naar een betalende AI-tool als aan welke voorwaarden voldaan is?', o: ['Enkel dat de tool een mooie gebruiksvriendelijke interface heeft voor leerkrachten en leerlingen.','Geen modeltraining met de data, opslag binnen de EU, én een betalende contractuele relatie met verwerkersovereenkomst.','Enkel dat de tool gratis beschikbaar is voor alle leerlingen, ongeacht waar de servers staan.','Enkel dat de IT-dienst de tool ooit al een keer heeft gebruikt voor een ander, niet-gerelateerd doel.'], a: 1, f: 'Alle drie voorwaarden moeten gelden: geen modeltraining, opslag binnen de EU, en een betalende relatie met verwerkersovereenkomst.' },
    {q: 'Wat gebeurt er met een AI-toepassing die niet op de goedgekeurde lijst staat?', o: ['Die mag gewoon gebruikt worden zolang de leerkracht dat zelf verantwoord vindt voor zijn vak.','Die wordt beschouwd als "shadow AI" en is niet toegestaan zonder voorafgaande goedkeuring.','Die mag enkel gebruikt worden bij leerlingen vanaf het vierde middelbaar, niet bij jongere leerlingen.','Die moet eerst minstens 100 keer succesvol getest zijn door andere Vlaamse scholengroepen.'], a: 1, f: 'Niet-goedgekeurde tools zijn "shadow AI" en vereisen voorafgaande goedkeuring via de IT-dienst.' },
    {q: 'Waar staat het beleidskader m.b.t. evalueren en toetsen met AI?', o: ['AI-gebruik is bij evaluaties altijd toegestaan, tenzij de leerkracht dit uitdrukkelijk verbiedt.','AI-gebruik is bij evaluaties niet toegestaan, tenzij de leerkracht dit uitdrukkelijk toelaat.','AI-gebruik bij evaluaties is een individuele keuze van elke leerling, zonder tussenkomst van de leerkracht.','Evaluaties met AI zijn überhaupt verboden binnen de volledige scholengroep, in elke vorm of context.'], a: 1, f: 'Het uitgangspunt is een verbod, tenzij de leerkracht expliciet en met duidelijke voorwaarden AI toelaat.' }
  ];
  rQuiz(c, quiz, 2, 'mod2', n2, 70);
}

function m2s9(c){
  c.innerHTML = `
<div class="s-badge">🏁 Stap 11 van 11 · Praktijkscenario's & afronding</div>
<h2 class="ch2">Jouw sluitende <em>actiestap</em></h2>
<p class="cp">Je kent nu het beleidskader, de 5 AI-labels, weet hoe je leerlingen op een transparante manier begeleidt, en hoe je een opdracht AI-bestendig ontwerpt.</p>

<h3 class="ch3">⚖️ Wat mag (niet) volgens de wet?</h3>
<p class="cp">Vincent Vanrusselt, onderzoekshoofd PXL Centrum Digitaal Leren, legt uit dat de EU AI Act sinds 1 augustus 2024 ook voor onderwijs geldt, en werkt met <strong>4 risiconiveaus</strong>: onaanvaardbaar risico (verboden, bv. emotieherkenning bij leerlingen — ook expliciet verboden in het Sint-Rembert beleidskader), hoog risico (strenge eisen, bv. systemen die leerresultaten evalueren of leerlingen toelaten/uitsluiten van een studierichting), beperkt risico (transparantieplicht) en minimaal risico. Generatieve AI zoals Copilot of ChatGPT valt voorlopig onder <strong>laag risico</strong>.</p>

<div class="ib warn">
  <div class="ib-t">📚 Bron</div>
  <div class="ib-b">Klasse, "Wat mag (niet) met AI op school?" — interview met Vincent Vanrusselt (PXL). <a href="https://www.klasse.be/742009/wetgeving-ai-in-onderwijs-wat-mag-niet-volgens-ai-act/" target="_blank">klasse.be/742009</a></div>
</div>

<div style="background: rgba(10,31,168,0.08); border-radius: 12px; padding: 20px; border-left: 4px solid var(--green); margin: 20px 0;">
  <strong style="color: var(--green); font-size: 12px; text-transform: uppercase;">✅ 3 Praktische actiestappen voor jouw school</strong>
  <ol style="font-size: 12px; color: #3d4f8a; margin: 12px 0 0 0; padding-left: 20px; line-height: 1.8;">
    <li><strong>Inventariseer:</strong> Welke AI-tools gebruikt jouw school/klasteam al? Maak een lijst — dat helpt bij compliancebeheer</li>
    <li><strong>Communiceer:</strong> Informeer leerlingen & ouders welke AI-tools je inzet en waarom. Transparantie is wettelijk vereist (artikel 4)</li>
    <li><strong>Bijstellen:</strong> Controleer of je beleid aansluit bij de 4 risiconiveaus — hoog risico-systemen (bv. leerlingvolging) vragen extra voorzorg</li>
  </ol>
</div>

<h3 class="ch3">💭 Wat denk jij?</h3>
<div id="stl-m2"></div>

<p class="cp">Maak het concreet: kies één actiestap die je de komende maand effectief uitvoert.</p>
<textarea class="sr-ta" id="r3" placeholder="Ik ga bij mijn lessen het AI-label communiceren door... Of herwerk taak..."></textarea>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="sR3()">🏆 Afronden & certificaat ontvangen →</button>
  <span class="nh">Stap 11/11</span>
</div>`;
  const ta = document.getElementById('r3');
  ta.value = localStorage.getItem('sr_r3') || '';
  ta.oninput = ()=>localStorage.setItem('sr_r3', ta.value);
  renderStellingen('stl-m2', 'm2', [
    'Een adaptieve toets gebruiken om leerlingen te oriënteren naar een studierichting zou toegelaten moeten zijn, zolang een leerkracht de uiteindelijke beslissing neemt.',
    'Onze school heeft nood aan een duidelijker, korter overzicht van wat wel/niet mag volgens de AI Act dan wat er vandaag bestaat.'
  ]);
}

function sR3(){
  const v = (document.getElementById('r3').value||'').trim();
  if(v.length < 20){ alert('Formuleer eerst je concrete actiestap.'); return; }
  n2();
}

/* ════════════════════════════════════════════
   MODULE 3 — COPILOT VERDIEPING (ROLE-SPECIFIC)
   Elke rol krijgt eigen Module 3 op maat
   ════════════════════════════════════════════ */

// TEACHER VERSION (huidige)
// TEACHER VERSION — 10 stappen (incl praktische prompts + nascholingsideeën)
const m3_teacher = [m3s0, m3s1, m3s2, m3s_praktijkprompts_teacher, m3s3, m3s4, m3s5, m3s6, m3s_nascholingsideen_teacher, m3s7];

// ADMIN VERSION (5 stappen: intro + 3 use cases + prompts + reflectie)
const m3_admin = [m3a0, m3a1, m3a_prompts_admin, m3a2, m3a3];

// MANAGEMENT VERSION (5 stappen: intro + strategie + prompts + risico + reflectie)
const m3_mgmt = [m3m0, m3m1, m3m_prompts_mgmt, m3m2, m3m3];

let m3 = []; // Zal worden ingesteld op basis van rol

function rm3(){
  // Set m3 op basis van huidige rol
  if(S.userRole === 'teacher') m3 = m3_teacher;
  else if(S.userRole === 'admin') m3 = m3_admin;
  else if(S.userRole === 'management') m3 = m3_mgmt;
  
  const c=document.getElementById('m3c');
  c.innerHTML='';
  console.log('🔄 rm3: rol=' + S.userRole + ', stap ' + S.mod3.step + ' van ' + m3.length);
  
  // Update title
  const titleEl = document.getElementById('mod3-title');
  if(titleEl) {
    if(S.userRole === 'teacher') titleEl.textContent = 'Copilot in de klas';
    else if(S.userRole === 'admin') titleEl.textContent = 'Copilot voor administratie';
    else if(S.userRole === 'management') titleEl.textContent = 'Copilot voor strategisch beleid';
  }
  
  rDots(3, m3.length, S.mod3.step);
  m3[S.mod3.step](c);
  lockNextButtons(c);
}

function n3(){ S.mod3.step++; ss(); S.mod3.step >= m3.length ? d3() : rm3(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); }
function p3(){ if(S.mod3.step > 0){ lastNavDirection='back'; S.mod3.step--; ss(); rm3(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); } }
function d3(){ S.mod3.done=true; S.mod3.step=0; ss(); up(); rmc(); sv('home'); setTimeout(()=>alert('🎉 Copilot-verdieping voltooid!'),300); }

/* ════════════════════════════════════════════
   TEACHER MODULE 3 (Huidige versie)
   Copilot in de klas — hands-on
   ════════════════════════════════════════════ */

function m3s0(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">✨ Stap 1 van 8 · Aan de slag</span></div>
<h2 class="ch2">Copilot M365 — <em>jouw assistent</em></h2>
<svg viewBox="0 0 700 100" style="width:100%;height:auto;display:block;margin-bottom:16px;border-radius:var(--rsm);background:var(--blue)" xmlns="http://www.w3.org/2000/svg">
  <circle cx="80" cy="55" r="34" fill="rgba(127,224,0,.18)"/>
  <text x="80" y="65" font-size="36" text-anchor="middle">🛡️</text>
  <text x="140" y="42" font-family="Archivo Black, sans-serif" font-size="14" fill="#7FE000">PROTECTED</text>
  <text x="140" y="60" font-family="Nunito, sans-serif" font-size="11" fill="rgba(255,255,255,.7)" font-weight="700">Schild-icoon zichtbaar = data blijft binnen</text>
  <text x="140" y="75" font-family="Nunito, sans-serif" font-size="11" fill="rgba(255,255,255,.7)" font-weight="700">de beveiligde schoolomgeving.</text>
  <line x1="380" y1="20" x2="380" y2="80" stroke="rgba(255,255,255,.2)" stroke-width="2"/>
  <text x="600" y="42" font-family="Archivo Black, sans-serif" font-size="14" fill="#fca5a5">GEEN SCHILD?</text>
  <text x="600" y="60" font-family="Nunito, sans-serif" font-size="11" fill="rgba(255,255,255,.7)" font-weight="700">Opnieuw aanmelden met je</text>
  <text x="600" y="75" font-family="Nunito, sans-serif" font-size="11" fill="rgba(255,255,255,.7)" font-weight="700">officiële schoolaccount.</text>
</svg>
<p class="cp">Copilot M365 is de AI-assistent die geïntegreerd is in je Microsoft-omgeving (Word, Outlook, Teams, en een eigen chatvenster). Je vindt hem via de Microsoft 365-portal (office.com) of als icoon in de werkbalk van je Office-apps. Meld je altijd aan met je <strong>officiële schoolaccount</strong> van de scholengroep — niet met een privéaccount.</p>
<p class="cp">Bovenaan het Copilot-venster zie je een klein <strong>schild-icoon (Protected)</strong>, zoals in de illustratie hierboven. Dat schild is je belangrijkste controlepunt: het betekent dat je gesprekken binnen de beveiligde schoolomgeving blijven en niet gebruikt worden om het onderliggende AI-model te trainen. Zonder dat schild ben je niet zeker dat je gegevens beschermd zijn.</p>

<div class="ib warn">
  <div class="ib-t">🛡️ Check dit telkens voor je start</div>
  <div class="ib-b">Geen schild-icoon zichtbaar? Meld je opnieuw aan met je schoolaccount via office.com. Gebruik nooit een privé- of gratis account voor schoolgerelateerd werk, ook niet "voor eens snel iets proberen" — dat ene snelle gebruik is precies hoe persoonsgegevens per ongeluk in een niet-goedgekeurde tool terechtkomen.</div>
</div>

<h3 class="ch3">🎛️ Copilot op jouw maat</h3>
<p class="cp">Via <strong>Instellingen → Personalisation → Custom instructions</strong> kan je Copilot vragen om voortaan rekening te houden met jouw stijl of voorkeuren — bijvoorbeeld: "Schrijf aangepaste instructies voor Copilot zodat die helder mijn manier van communiceren omschrijft, gebaseerd op onze eerdere gesprekken" of gebaseerd op een bijgevoegd document met teksten die je zelf schreef. Eén keer instellen, en elk volgend gesprek sluit daar automatisch op aan.</p>

<div class="nw">
  <button class="sr-btn g" onclick="n3()">Volgende: prompts schrijven →</button>
</div>`;
}

function m3s1(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">✍️ Stap 2 van 8 · Prompting</span></div>
<h2 class="ch2">Een goede <em>prompt</em> schrijven</h2>
<p class="cp">De kwaliteit van wat Copilot teruggeeft, hangt sterk af van hoe specifiek je vraag (prompt) is. Een vaag verzoek als "maak een les over de Eerste Wereldoorlog" levert generieke, oppervlakkige output op — net zoals een vage vraag aan een collega ook een vaag antwoord oplevert. Gebruik daarom een vaste structuur, zodat je niets vergeet: <strong>Rol — Doel — Context — Bron — Verwachting (R-D-C-B-V)</strong>.</p>

${renderPromptComparison()}

<p class="cp">Krijg je niet meteen wat je zoekt? Verfijn dan in een vervolgvraag binnen hetzelfde gesprek ("maak de vragen iets korter", "voeg een vraag toe over perspectief") in plaats van helemaal opnieuw te beginnen — Copilot houdt rekening met de eerdere context van het gesprek. Controleer steeds de output zelf: ook een goede prompt garandeert geen foutloos resultaat, enkel een veel betere uitgangspositie.</p>

<h3 class="ch3">🧩 Doe-opdracht: Schrijf je eigen prompt</h3>
<p class="cp">Vul de 5 velden hieronder in voor een prompt die je écht zou gebruiken in jouw vak. Onderaan zie je de volledige prompt samengevoegd — die kan je meteen kopiëren naar Copilot.</p>
<div id="promptbuilder"></div>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: Maakmodule →</button>
</div>`;
  renderPromptBuilder();
}

function m3s2(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">🎨 Stap 3 van 8 · Maakmodule</span></div>
<h2 class="ch2">Een poster of beeld <em>ontwerpen</em></h2>
<p class="cp">Via de Maak- of Designer-module van Copilot kan je snel een visueel ontwerp genereren: een poster voor een klasproject, een infographic bij een les, of een uitnodiging voor een ouderavond. Klik op <strong>Create</strong> en kies wat je wil maken — een afbeelding, infographic, poster, verhaal of formulier.</p>
<p class="cp">Beschrijf gewoon wat je nodig hebt ("een poster over recyclage, vriendelijke kleuren, voor leerlingen van het 1ste jaar") en kies daarna een stijl uit de galerij — van fotorealistisch tot doodle of vlakke illustratie.</p>

<div class="ib warn">
  <div class="ib-t">✏️ Let op: tekst in beelden klopt vaak niet</div>
  <div class="ib-b">AI-beeldgeneratoren maken regelmatig spelfouten in tekst die op een afbeelding staat. Controleer dit altijd, en gebruik de optie <strong>Edit Text</strong> om de tekst handmatig te corrigeren vóór je het beeld effectief gebruikt in de klas — zoals hieronder, waar een infographic over generatieve AI achteraf wordt bewerkt.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: differentiëren →</button>
</div>`;
}

function m3s_praktijkprompts_teacher(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">💡 Stap 4 van 9 · Praktische Prompts</span></div>
<h2 class="ch2">5 <em>Prompts</em> voor lesvoorbereiding</h2>
<p class="cp">Hier zijn 5 gouden prompts die je direct kan copy-pasten naar Copilot. Ze helpen bij lesvoorbereiding, evaluatie en leerlingbegeleiding. Kies hetgeen wat je nodig hebt en vul de [vierkante haakjes] in met jouw gegevens.</p>

<div style="background: rgba(127,224,0,0.12); border-radius: 8px; padding: 16px; border-left: 4px solid var(--green); margin: 20px 0;">
  <strong style="color: var(--green); font-size: 12px; text-transform: uppercase;">💡 PRO TIP: Doel-TRICK</strong>
  <p style="font-size: 13px; color: #3d4f8a; margin: 8px 0 0 0; line-height: 1.6;">
    Wil je nog betere prompts? Voeg telkens <strong>Rol</strong> (je bent een…), <strong>Doel</strong> (ik wil…), <strong>Taak</strong> (geef… stappen), <strong>Context</strong> (voor leerlingen van…) en <strong>Kwaliteit</strong> (output moet…) toe. Voorbeeld: "Rol: vakdidacticus aardrijkskunde. Doel: lesmateriaal. Taak: 3 kaartjes over klimaatzones. Context: 2de graad. Kwaliteit: interactief, niet meer dan 1 bladzijde."
  </p>
</div>

<div style="background: linear-gradient(135deg, rgba(10,31,168,0.08), rgba(127,224,0,0.08)); border-radius: 12px; padding: 20px; border-left: 4px solid var(--blue); margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 13px; color: var(--blue); text-transform: uppercase; margin-bottom: 12px;">💡 Prompt 1: Interactieve werkvormen</div>
  <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7; margin-bottom: 12px; font-style: italic;">
    "Bedenk 5 verschillende, interactieve werkvormen voor een les van 50 minuten over [onderwerp, bv. de industriële revolutie] voor leerlingen in [leerjaar/onderwijsvorm]. Zorg voor een afwisseling tussen individueel werk en groepswerk. Geef bij elke werkvorm een korte omschrijving en een inschatting van de benodigde tijd."
  </p>
  <div style="background: white; border-radius: 8px; padding: 12px; border-left: 2px solid var(--green);">
    <strong style="color: var(--green); font-size: 11px;">✓ Wat je krijgt:</strong> 5 uitgewerkte werkvormen met timing
  </div>
</div>

<div style="background: linear-gradient(135deg, rgba(10,31,168,0.08), rgba(127,224,0,0.08)); border-radius: 12px; padding: 20px; border-left: 4px solid var(--blue); margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 13px; color: var(--blue); text-transform: uppercase; margin-bottom: 12px;">💡 Prompt 2: Teksten differentiëren</div>
  <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7; margin-bottom: 12px; font-style: italic;">
    "Herschrijf de onderstaande tekst over [onderwerp] in drie verschillende versies: 1) Het originele niveau, 2) Een vereenvoudigde versie voor leerlingen met taalachterstand (korte zinnen, alledaagse woorden, heldere structuur), en 3) Een uitdagende versie met rijkere woordenschat voor snelle lezers. [Plak hier de tekst]"
  </p>
  <div style="background: white; border-radius: 8px; padding: 12px; border-left: 2px solid var(--green);">
    <strong style="color: var(--green); font-size: 11px;">✓ Wat je krijgt:</strong> 3 versies van dezelfde tekst op maat van elk niveau
  </div>
</div>

<div style="background: linear-gradient(135deg, rgba(10,31,168,0.08), rgba(127,224,0,0.08)); border-radius: 12px; padding: 20px; border-left: 4px solid var(--blue); margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 13px; color: var(--blue); text-transform: uppercase; margin-bottom: 12px;">💡 Prompt 3: Toetsvragen genereren</div>
  <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7; margin-bottom: 12px; font-style: italic;">
    "Maak 10 meerkeuzevragen en 3 open inzichtvragen over [onderwerp/hoofdstuk] voor leerlingen van [leeftijd/niveau]. Voorzie bij de meerkeuzevragen 4 opties, waarvan telkens één de juiste is. Voeg helemaal onderaan een duidelijke correctiesleutel toe met de juiste antwoorden en een korte verklaring."
  </p>
  <div style="background: white; border-radius: 8px; padding: 12px; border-left: 2px solid var(--green);">
    <strong style="color: var(--green); font-size: 11px;">✓ Wat je krijgt:</strong> 13 toetsvragen + correctiesleutel
  </div>
</div>

<div style="background: linear-gradient(135deg, rgba(10,31,168,0.08), rgba(127,224,0,0.08)); border-radius: 12px; padding: 20px; border-left: 4px solid var(--blue); margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 13px; color: var(--blue); text-transform: uppercase; margin-bottom: 12px;">💡 Prompt 4: Constructieve feedback</div>
  <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7; margin-bottom: 12px; font-style: italic;">
    "Schrijf een kort stukje constructieve feedback (maximaal 4 zinnen) voor op het rapport van een leerling. De leerling is erg sterk in [positief punt, bv. mondelinge participatie], maar moet nog werken aan [werkpunt, bv. opdrachten tijdig inleveren]. De toon moet aanmoedigend zijn en eindigen met een concrete tip voor de volgende periode."
  </p>
  <div style="background: white; border-radius: 8px; padding: 12px; border-left: 2px solid var(--green);">
    <strong style="color: var(--green); font-size: 11px;">✓ Wat je krijgt:</strong> Persoonlijke, constructieve rapport-opmerking
  </div>
</div>

<div style="background: linear-gradient(135deg, rgba(10,31,168,0.08), rgba(127,224,0,0.08)); border-radius: 12px; padding: 20px; border-left: 4px solid var(--blue); margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 13px; color: var(--blue); text-transform: uppercase; margin-bottom: 12px;">💡 Prompt 5: Communicatie met ouders</div>
  <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7; margin-bottom: 12px; font-style: italic;">
    "Schrijf een professionele en vriendelijke e-mail naar de ouders van [naam leerling]. Geef aan dat hun kind de laatste tijd [probleem, bv. de focus verliest tijdens de les], maar benadruk direct ook iets positiefs, zoals [positief aspect]. Vraag om een kort overlegmoment om samen te kijken hoe we [naam] het beste kunnen ondersteunen."
  </p>
  <div style="background: white; border-radius: 8px; padding: 12px; border-left: 2px solid var(--green);">
    <strong style="color: var(--green); font-size: 11px;">✓ Wat je krijgt:</strong> Empathische mail naar ouders
  </div>
</div>

<div style="background: linear-gradient(135deg, rgba(127,224,0,0.08), rgba(10,31,168,0.08)); border-radius: 12px; padding: 20px; border-left: 4px solid var(--green); margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 13px; color: var(--green); text-transform: uppercase; margin-bottom: 12px;">💡 Klaar gemaakte Copilot-templates</div>
  <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7; margin-bottom: 16px;">
    Je hoeft niet altijd zelf prompts in te typen! Microsoft heeft klaar gemaakte templates (agents) voor onderwijs. Start daar, pas aan naar je behoefte:
  </p>
  
  <div style="display: flex; flex-direction: column; gap: 10px;">
    <a href="https://m365.cloud.microsoft/chat/?titleId=T_ee4b5de7-8666-7829-d4d1-d0c7a4bbaa8a&source=embedded-builder" target="_blank" style="background: white; border: 2px solid var(--green); border-radius: 8px; padding: 12px 16px; text-decoration: none; color: var(--green); font-weight: 700; transition: all 0.2s;">
      📚 Onderwijsassistent — Directe tool voor lesvoorbereiding & leerlingbegeleiding
    </a>
    
    <a href="https://m365.cloud.microsoft/chat/?titleId=T_395da538-6255-88c4-8096-7fafa8d0fed9&source=embedded-builder" target="_blank" style="background: white; border: 2px solid var(--blue); border-radius: 8px; padding: 12px 16px; text-decoration: none; color: var(--blue); font-weight: 700; transition: all 0.2s;">
      🎯 AI-bestendige opdrachten maken — Template voor leerlingen-proof assignments
    </a>
    
    <a href="https://m365.cloud.microsoft/chat/?titleId=P_f0ff38f1-4d81-a9b7-dbf1-b161328daa1f" target="_blank" style="background: white; border: 2px solid var(--orange); border-radius: 8px; padding: 12px 16px; text-decoration: none; color: var(--orange); font-weight: 700; transition: all 0.2s;">
      💬 Prompt Coach — Leer beter prompten schrijven door conversatie
    </a>
  </div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: Maakmodule →</button>
</div>`;
}

function m3s3(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">📚 Stap 4 van 8 · Differentiëren</span></div>
<h2 class="ch2">Lesmateriaal <em>differentiëren</em> op leesniveau</h2>
<p class="cp">Heb je een goede basistekst, maar leerlingen met heel uiteenlopende leesvaardigheden? Gebruik de <strong>Teach-module</strong> binnen Copilot: kies "Modify existing content" en daarna "Modify reading level". Copilot herschrijft je tekst dan automatisch op een eenvoudiger of net uitdagender taalniveau, terwijl de inhoud hetzelfde blijft.</p>
<p class="cp">Dit is bijzonder nuttig bij gemengde klasgroepen of taalheterogene klassen (bv. een grote instroom van anderstalige nieuwkomers). Werk wel altijd met dezelfde leerdoelen: enkel het taalniveau verandert, niet de kern van wat een leerling moet kennen of kunnen.</p>
<div class="ib warn">
  <div class="ib-t">🔍 Controleer altijd de feitelijke inhoud</div>
  <div class="ib-b">Bij het versimpelen van taal kan een AI-tool soms ook feitelijke nuances verliezen of net iets te kort door de bocht formuleren. Lees de vereenvoudigde versie altijd zelf grondig na voordat je hem aan leerlingen geeft.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: quizzen en rubrics →</button>
</div>`;
}

function m3s4(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">📝 Stap 5 van 8 · Quizzen & rubrics</span></div>
<h2 class="ch2">Quizzen en <em>rubrics</em> opstellen</h2>
<p class="cp">Ook binnen de Teach-module kan Copilot een eerste versie van een quiz of een beoordelingsrubriek genereren op basis van een tekst of leerdoel die je aanlevert. Vraag bijvoorbeeld: "Maak 8 meerkeuzevragen over dit hoofdstuk, met telkens 4 antwoordopties en een korte uitleg bij het juiste antwoord."</p>
<p class="cp">Behandel dit altijd als een <strong>eerste ontwerp, niet als eindproduct</strong>. Lees elke vraag, elk antwoord én elke uitleg zelf grondig na: AI-tools maken bij quizvragen soms subtiele fouten (bijvoorbeeld twee antwoorden die beide kloppen, of een uitleg die net niet aansluit bij de vraag). Dezelfde voorzichtigheid geldt voor rubrics: controleer of de criteria écht meten wat je wil evalueren, en pas de formulering aan naar jouw eigen vak en niveau.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: je eigen agent →</button>
</div>`;
}

function m3s5(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">🤖 Stap 6 van 8 · Agents</span></div>
<h2 class="ch2">Bouw je eigen <em>agent</em></h2>
<p class="cp">Een <strong>agent</strong> in Copilot M365 is een aangepaste, afgebakende assistent: je geeft hem specifieke instructies en eventueel eigen documenten of bronnen, en hij gedraagt zich vervolgens enkel binnen die afgesproken grenzen. Denk aan een "studiebuddy" die leerlingen enkel binnen jouw lesmateriaal helpt oefenen, zonder af te dwalen naar andere onderwerpen of het antwoord meteen weg te geven.</p>
<p class="cp">Je maakt een agent aan via "Agents → New agent": beschrijf in gewone taal wat je nodig hebt, en Copilot bouwt de basis voor je op. Je geeft hem een naam, een duidelijke taakomschrijving ("Help leerlingen oefenen op onregelmatige werkwoorden, geef hints, geen volledige antwoorden"), en eventueel relevante documenten als kennisbasis.</p>
<div class="ib warn">
  <div class="ib-t">⚠️ Voorzichtig met agents die leerlingen zelf gebruiken</div>
  <div class="ib-b">Test een agent altijd grondig zelf vóór je hem aan leerlingen voorstelt: probeer hem "uit te lokken" buiten zijn bedoeld gebruik, en controleer of hij binnen de schoolomgeving (met het schild-icoon) blijft werken. Bij twijfel overleg je met je pedagogisch ICT-coördinator vóór je een agent klasbreed inzet.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: kennischeck →</button>
</div>`;
}

function m3s6(c){
  const quiz = [
    {q: 'Je opent Copilot maar ziet het schild-icoon (Protected) niet. Wat doe je?', o: ['Gewoon onbezorgd verdergaan, aangezien het enkel een visueel icoontje betreft zonder functionele impact.','Direct uitloggen en opnieuw aanmelden met je schoolaccount, want zonder schild is er geen dataveiligheid.','Overstappen naar een compleet ander openbaar AI-platform om je werkzaamheden direct te continueren.','De webpagina herhaaldelijk vernieuwen en afwachten tot de server het icoon automatisch toont.'], a: 1, f: 'Het schild garandeert gegevensbescherming binnen de schoolomgeving.' },
    {q: 'Je genereert een poster en de tekst erop bevat een spelfout. Wat is de juiste reflex?', o: ['De fout negeren, aangezien leerlingen in een visuele poster voornamelijk letten op de grafische elementen.','De tekst handmatig corrigeren via de Edit Text optie, omdat AI-beeldgeneratoren geregeld taalfouten maken.','De poster herhaaldelijk volledig opnieuw genereren tot er bij toeval een foutloze versie ontstaat.','Beeldgeneratie in het algemeen direct uitsluiten voor het ontwikkelen van betrouwbaar klasmateriaal.'], a: 1, f: 'AI-beeldgeneratoren maken vaak spelfouten in afbeeldingen. Altijd handmatig even corrigeren via Edit Text.' },
    {q: 'Je hebt een sterke basistekst maar leerlingen met uiteenlopende leesniveaus. Welke tool zet je in?', o: ['De functionaliteit Create waarmee je direct een grafische poster of infographic ontwerpt voor de klas.','De functionaliteit Teach -> Modify existing content -> Modify reading level om de tekst snel aan te passen.','De optie Agents -> New agent om een volledig op maat gemaakte virtuele coach op te zetten voor studenten.','De ingebouwde algemene Library om te zoeken naar reeds bestaande alternatieve teksten over dit thema.'], a: 1, f: 'Modify reading level herschrijft je tekst op maat voor verschillende leesvaardigheden.' }
  ];
  rQuiz(c, quiz, 3, 'mod3', n3, 70);
}

function m3s_nascholingsideen_teacher(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">🎓 Stap 10 van 11 · Wat volgt?</span></div>
<h2 class="ch2">Volgende stappen: <em>Verdieping</em></h2>
<p class="cp">Je hebt nu een sterke basis in Copilot. Wat wil je vervolgens dieper uitdiepen? Sint-Rembert en partners bieden nascholingsopties aan.</p>

<div style="background: rgba(10,31,168,0.08); border-radius: 12px; padding: 20px; border-left: 4px solid var(--blue); margin: 20px 0;">
  <strong style="color: var(--blue); font-size: 12px; text-transform: uppercase;">🎯 UNESCO AI-competentieframework voor leerkrachten</strong>
  <p style="font-size: 13px; color: #3d4f8a; margin: 12px 0 0 0; line-height: 1.6;">
    UNESCO heeft een internationaal kader opgesteld met <strong>6 kerncompetenties</strong> voor leerkrachten. Terwijl je met Copilot werkt, bouw je deze op:
  </p>
  <ul style="font-size: 12px; color: #3d4f8a; margin: 12px 0 0 0; padding-left: 20px; line-height: 1.8;">
    <li><strong>AI begrijpen:</strong> Hoe werkt AI en wat kan het (niet)? ✓ Dit heb je in Module 1 gedaan</li>
    <li><strong>Kritisch denken:</strong> Bias, privacy, ethiek herkennen ✓ Module 2 dekt dit af</li>
    <li><strong>Technisch:</strong> Tools als Copilot praktisch gebruiken ✓ Copilot-stappen hier</li>
    <li><strong>Pedagogisch:</strong> AI inzetten voor betere lessen (niet vervangen) — wat je nu doet</li>
    <li><strong>Samenwerking:</strong> Met collega's & leerlingen erover communiceren — communities of practice helpen</li>
    <li><strong>Voortdurend leren:</strong> AI evolueert snel; je blijft bijleren ✓ Nascholing hier</li>
  </ul>
</div>

<h3 class="ch3">🎯 Mogelijke vervolgstappen</h3>

<div style="background: white; border: 2px solid var(--green); border-radius: 12px; padding: 20px; margin: 16px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 14px; color: var(--green); text-transform: uppercase; margin-bottom: 8px;">📚 1. Agents bouwen: leerlingen hun eigen AI-assistent laten maken</div>
  <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7;">Leerlingen begrijpen veel beter hoe AI werkt als ze zelf een agent (een aanpasbare chatbot) bouwen. Geschikt voor informatica, maar ook voor taallessen (vertalingsagent), wiskunde (wiskundige coach), etc.</p>
  <div style="font-size: 12px; color: var(--muted); margin-top: 8px; font-weight: 600;">💡 Tipje: Howest en Digisprong bieden agents-workshops aan</div>
</div>

<div style="background: white; border: 2px solid var(--orange); border-radius: 12px; padding: 20px; margin: 16px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 14px; color: var(--orange); text-transform: uppercase; margin-bottom: 8px;">🔬 2. Kritisch denken over AI: bias, deepfakes, machtsverhoudingen</div>
  <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7;">Tools als ChatGPT zijn handig, maar ook voorzichtig! Wat gebeurt er als AI een antwoord met vooroordeel geeft? Hoe herken je AI-gegenereerde afbeeldingen? Wat doen grote techbedrijven met onze data? Deze kritische lens is essentieel voor leerlingen.</p>
  <div style="font-size: 12px; color: var(--muted); margin-top: 8px; font-weight: 600;">💡 Tipje: Prof. Orhan Agirdag (KU Leuven) verzorgt een keynote over de ethische kant van AI op 18 november</div>
</div>

<div style="background: white; border: 2px solid rgba(10,31,168,0.3); border-radius: 12px; padding: 20px; margin: 16px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 14px; color: var(--blue); text-transform: uppercase; margin-bottom: 8px;">🏫 3. AI in jouw vak: vak-specifieke workshops</div>
  <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7;">Engels-leerkracht? Hoe geef je kritisch schrijven nog meerwaarde als ChatGPT teksten kan genereren? Wiskundelaar? Hoe zorg je dat oefenen nog zin heeft? Kunstvak? Hoe beperk je misbruik van beeld-AI? Vak-specifieke trainingen helpen veel!</p>
  <div style="font-size: 12px; color: var(--muted); margin-top: 8px; font-weight: 600;">💡 Tipje: Binnenkort starten we sporenaanboden per vakdomein (Howest)</div>
</div>

<div style="background: white; border: 2px solid rgba(156,39,176,0.6); border-radius: 12px; padding: 20px; margin: 16px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 14px; color: #9C27B0; text-transform: uppercase; margin-bottom: 8px;">🎯 4. Scenario-gebaseerd leren: leerlingen dieper inzicht</div>
  <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7;">In plaats van AI als "antwoordmachine" te gebruiken, zet je AI in voor <em>scenario-opdrachten</em>: leerlingen onderzoeken AI-gegenereerde teksten kritisch ("Welke bias zit hierin?"), verbeteren ze AI-output ("Maak dit geschikter voor jonge kinderen"), of gebruiken ze AI als gesprekspartner voor diepe vragen. Dit bouwt critisch denken op en maakt leerlingen echte AI-experts — niet alleen consumenten.</p>
  <div style="font-size: 12px; color: var(--muted); margin-top: 8px; font-weight: 600;">💡 Tipje: Combineer dit met leerdoelen uit je vakdidactiek; scenario's werken best als ze gebonden zijn aan echte inhoud</div>
</div>

<div style="background: white; border: 2px solid #9333EA; border-radius: 12px; padding: 20px; margin: 16px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 14px; color: #9333EA; text-transform: uppercase; margin-bottom: 8px;">🤝 5. Leren van collega's: communities of practice</div>
  <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7;">Velen van je collega's experimenteren nu ook met AI in de klas. Wat doe jij? Wat lukt hen? Regelmatige uitwisselingssessies helpen om van elkaar te leren. Sint-Rembert organiseert dit doorheen het schooljaar.</p>
  <div style="font-size: 12px; color: var(--muted); margin-top: 8px; font-weight: 600;">💡 Tipje: Volgende bijeenkomst: TBA. Meld je interesse!</div>
</div>

<div style="background: linear-gradient(135deg, rgba(10,31,168,0.08), rgba(127,224,0,0.08)); border-radius: 12px; padding: 20px; border-left: 4px solid var(--blue); margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 13px; color: var(--blue); text-transform: uppercase; margin-bottom: 8px;">📅 Kalender 2025-2026</div>
  <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.8;">
    • <strong>18 november:</strong> Keynote Prof. Orhan Agirdag (ethiek & AI)<br>
    • <strong>Januari-juni:</strong> Sporenaanbod Howest (agents, vak-specifieke sessies)<br>
    • <strong>Maandelijks:</strong> Leerkrachten-uitwisselingen op Sint-Rembert
  </p>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: Slotreflectie →</button>
</div>`;
}

function m3s7(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">🎯 Stap 11 van 11 · Slotreflectie</span></div>
<h2 class="ch2">Slotreflectie</h2>
<p class="cp">Je hebt nu kennisgemaakt met Copilot M365: het schild-icoon en dataveiligheid, gestructureerd prompten (R-D-C-B-V), de Maakmodule voor visueel materiaal, differentiëren op leesniveau, quizzen/rubrics genereren, en het opzetten van een eigen agent.</p>

<h3 class="ch3">⏱️ 3x tijd besparen met AI in de klas</h3>
<p class="cp">Leraar Frans en pedagogisch ICT-coördinator Line Vanhauwere (RHIZO Zorgkrachtschool) deelt drie concrete tijdsbespaarders. Voor differentiatie: maak meerdere versies van eenzelfde leesoefening op maat van elk niveau, en geef in je prompt de gekende niveaus mee zoals de ERK-niveaus (A2, B1...) of AVI-leesniveaus. Voor toetsvragen: gebruik <strong>few-shot prompting</strong> — geef minstens 2 voorbeelden van een goede vraag mee in je prompt, samen met de gewenste criteria of schrijfstijl. Weet je niet zeker hoe je moet prompten? Vraag het AI-model zelf wat een goede prompt zou zijn (reverse prompting), of geef expliciet aan wat het juist <strong>niet</strong> mag doen (negative prompt). Voor rubrics: laad je document met leerdoelen mee in je prompt, zodat de gegenereerde beoordelingscriteria daar automatisch op aansluiten.</p>

<div class="ib warn">
  <div class="ib-t">📚 Bron</div>
  <div class="ib-b">Klasse, "3x tijd besparen met AI in de klas" — tips van Line Vanhauwere. <a href="https://www.klasse.be/733723/3x-tijd-besparen-met-ai-in-de-klas/" target="_blank">klasse.be/733723</a></div>
</div>

<h3 class="ch3">🧭 Nog 2 navigatietips</h3>
<p class="cp">Directeur Rein Bogaert (Stella Matutina College, Lede) deelt in een reeks van 10 navigatietips er twee die goed aansluiten bij Copilot. Werk met een transparante bronvermelding in plaats van te proberen AI-gebruik op te sporen: laat leerlingen vermelden welke AI-tool ze gebruikten en eventueel hun prompts toevoegen aan hun werk — veel haalbaarder dan zelf als "Sherlock Holmes" plagiaat proberen op te sporen. En verschuif waar mogelijk de focus van het eindproduct naar het leerproces: laat leerlingen de AI-prestatie zelf beoordelen op basis van duidelijke criteria, met argumenten die ze staven met voorbeelden uit de gegenereerde tekst.</p>

<div class="ib warn">
  <div class="ib-t">📚 Bron</div>
  <div class="ib-b">Klasse, "Wegwijs met AI op school: 10 navigatietips" — tips van directeur Rein Bogaert. <a href="https://www.klasse.be/722719/ai-op-school-10-navigatietips/" target="_blank">klasse.be/722719</a></div>
</div>

<h3 class="ch3">💭 Wat denk jij?</h3>
<div id="stl-m3"></div>

<p class="cp">Noteer hieronder wat voor jou het meest waardevol was, en welke stap je als eerste effectief gaat toepassen in je eigen lespraktijk.</p>
<textarea class="sr-ta" id="r2" placeholder="Meest opgeleverd... Wat ik als eerste ga uitproberen..."></textarea>
<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn o" onclick="sR2()">✅ Optionele module afronden →</button>
</div>`;
  const ta = document.getElementById('r2');
  ta.value = localStorage.getItem('sr_r2') || '';
  ta.oninput = ()=>localStorage.setItem('sr_r2', ta.value);
  renderStellingen('stl-m3', 'm3', [
    'Few-shot prompting (voorbeelden meegeven in je prompt) gaat mij echt tijd besparen bij het opstellen van toetsvragen.',
    'Leerlingen hun prompts laten toevoegen aan hun werk is een haalbare manier van bronvermelding voor mijn vak.'
  ]);
}

function sR2(){ n3(); }

/* ════════════════════════════════════════════
   ADMIN MODULE 3 — Copilot voor administratie
   ════════════════════════════════════════════ */

function m3a0(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">⚡ Stap 1 van 4 · Aan de slag</span></div>
<h2 class="ch2">Copilot voor <em>Administratie</em></h2>
<p class="cp">Als administratief medewerker ben je de kracht achter de schermen. Copilot M365 kan je helpen om het dagelijkse papierkraam sneller, slimmer en minder foutgevoelig in te pakken. Geen complexe prompts nodig — gewone Nederlands is genoeg.</p>

<h3 class="ch3">🎯 Top 5 use cases voor administratie</h3>
<div class="sr-row">
  <div class="sr-box wel">
    <div class="sr-box-title">1. 📧 Mailsjablonen</div>
    <p style="font-size: 13px; color: #3d4f8a; font-weight: 600;">Automatisch professionele e-mails genereren met correct Nederlands</p>
  </div>
  <div class="sr-box wel">
    <div class="sr-box-title">2. 📋 Verslag samenvattingen</div>
    <p style="font-size: 13px; color: #3d4f8a; font-weight: 600;">Een lang document samenvatten in kernpunten</p>
  </div>
</div>

<div class="sr-row">
  <div class="sr-box wel">
    <div class="sr-box-title">3. 📅 Agenda-planning</div>
    <p style="font-size: 13px; color: #3d4f8a; font-weight: 600;">Vergaderingen plannen: datum + deelnemers → kalender</p>
  </div>
  <div class="sr-box wel">
    <div class="sr-box-title">4. ✏️ Spellingcheck</div>
    <p style="font-size: 13px; color: #3d4f8a; font-weight: 600;">Documenten automatisch controleren op taal</p>
  </div>
</div>

<div class="sr-row">
  <div class="sr-box wel" style="grid-column: span 2;">
    <div class="sr-box-title">5. 📝 Formulieren invullen</div>
    <p style="font-size: 13px; color: #3d4f8a; font-weight: 600;">Repetitieve velden automatisch aanvullen uit templates</p>
  </div>
</div>

<div class="nw">
  <button class="sr-btn g" onclick="n3()">Volgende: mailsjablonen →</button>
</div>`;
}

function m3a1(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">📧 Stap 2 van 5 · Mails & Rapportages</span></div>
<h2 class="ch2">Emailsjablonen & <em>Rapportages samenvatten</em></h2>
<p class="cp">Twee snelle wins: professionele mails in seconden, en lange documenten in kernpunten samenvatten.</p>

<h3 class="ch3">📧 Use case 1: Emailsjablonen genereren</h3>
<p class="cp">Hoeveel keer schrijf je dezelfde e-mail? Copilot helpt je een sjabloon te maken die je daarna aanpast.</p>

<div class="ai-card" style="border: 2px solid var(--blue); background: white; padding: 20px; border-radius: var(--rsm); margin: 16px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 12px; color: var(--blue); text-transform: uppercase; margin-bottom: 8px;">Voorbeeld: Mail naar ouders</div>
  <div style="font-size: 12px; font-weight: 700; color: #3d4f8a; margin: 12px 0;"><strong>Jij aan Copilot:</strong><br>"Schrijf een professionele e-mail naar ouders dat hun kind morgen afwezig is wegens tandarts. Kort, vriendelijk, Nederlands."</div>
  <div style="background: var(--off); padding: 12px; border-radius: 6px; font-size: 12px; color: #3d4f8a; font-weight: 600; line-height: 1.6;">
    <strong>Copilot geeft:</strong><br><br>
    <strong>Onderwerp:</strong> Afwezigheid — [naam leerling]<br><br>
    Beste [voornaam ouder],<br><br>
    We willen u informeren dat [naam leerling] morgen afwezig zal zijn van school wegens een afspraak bij de tandarts. We zorgen dat [hij/zij] geen belangrijke lessen mist.<br><br>
    Met vriendelijke groet,<br>[jouw naam]
  </div>
  <div style="font-size: 12px; font-weight: 700; color: var(--green); margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--gray);">💾 Kopieëren → opslaan als template in Outlook!</div>
</div>

<h3 class="ch3">📋 Use case 2: Lange documenten samenvatten</h3>
<p class="cp">Een inspectieverslag, evaluatierapport of lange notitie doorspitten? Copilot haalt de kernpunten eruit — je leest niet meer 20 bladzijden.</p>

<div class="ai-card" style="border: 2px solid var(--orange); background: white; padding: 20px; border-radius: var(--rsm); margin: 16px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 12px; color: var(--orange); text-transform: uppercase; margin-bottom: 8px;">Voorbeeld: Samenvatten inspectierapport</div>
  <div style="font-size: 12px; font-weight: 700; color: #3d4f8a; margin: 12px 0;"><strong>Jij aan Copilot:</strong><br>"Vat dit inspectierapport samen in maximaal 5 kernpunten. Zet er ook actie-items bij en vermeld kritieke punten in het rood."</div>
  <div style="background: var(--off); padding: 12px; border-radius: 6px; font-size: 12px; color: #3d4f8a; font-weight: 600; line-height: 1.6;">
    <strong>Copilot geeft:</strong><br><br>
    <strong>Kernpunten:</strong><br>
    1. Veiligheid — zeer goed<br>
    2. <span style="color: var(--red);">⚠️ Inclusie — aandachtspunt</span><br>
    3. Digitale vaardigheden — in uitvoering<br><br>
    <strong>Acties:</strong> Volg inclusie-trainingen, plan check in januari
  </div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: Praktische prompts →</button>
  <span class="nh">Stap 2/5</span>
</div>`;
}

function m3a_prompts_admin(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">💡 Stap 3 van 5 · Praktische Prompts</span></div>
<h2 class="ch2">5 <em>Prompts</em> voor administratieve taken</h2>
<p class="cp">Hier zijn 5 praktische prompts die je dagelijkse werk versnellen. Copy-paste naar Copilot en vul de [vierkante haakjes] in.</p>

<div style="background: linear-gradient(135deg, rgba(10,31,168,0.08), rgba(127,224,0,0.08)); border-radius: 12px; padding: 20px; border-left: 4px solid var(--blue); margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 13px; color: var(--blue); text-transform: uppercase; margin-bottom: 12px;">💡 Prompt 1: Actiepunten uit vergaderverslagen</div>
  <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7; font-style: italic;">
    "Lees het onderstaande verslag van de [directieraad/personeelsvergadering]. Geef bovenaan een ultrakorte samenvatting van 3 zinnen. Maak daaronder een tabel met drie kolommen ('Actiepunt', 'Verantwoordelijke', 'Deadline') en vul deze aan met alle afspraken. [Plak hier de notulen]"
  </p>
  <div style="background: white; border-radius: 8px; padding: 12px; border-left: 2px solid var(--green);">
    <strong style="color: var(--green); font-size: 11px;">✓ Wat je krijgt:</strong> Gestructureerde tabel met actiepunten + deadlines
  </div>
</div>

<div style="background: linear-gradient(135deg, rgba(10,31,168,0.08), rgba(127,224,0,0.08)); border-radius: 12px; padding: 20px; border-left: 4px solid var(--blue); margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 13px; color: var(--blue); text-transform: uppercase; margin-bottom: 12px;">💡 Prompt 2: Schoolnieuwsbrief schrijven</div>
  <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7; font-style: italic;">
    "Schrijf een enthousiast en vlot leesbaar artikel van maximaal 200 woorden voor de schoolnieuwsbrief over [onderwerp, bv. de nieuwe parkeerregeling]. De doelgroep is de ouders. Vermijd formeel jargon, gebruik vlotte tussenkopjes en som de belangrijkste praktische details op in bulletpoints."
  </p>
  <div style="background: white; border-radius: 8px; padding: 12px; border-left: 2px solid var(--green);">
    <strong style="color: var(--green); font-size: 11px;">✓ Wat je krijgt:</strong> Toegankelijk persberichtje klaar voor publicatie
  </div>
</div>

<div style="background: linear-gradient(135deg, rgba(10,31,168,0.08), rgba(127,224,0,0.08)); border-radius: 12px; padding: 20px; border-left: 4px solid var(--blue); margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 13px; color: var(--blue); text-transform: uppercase; margin-bottom: 12px;">💡 Prompt 3: Vriendelijke herinneringsmails</div>
  <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7; font-style: italic;">
    "Stel een e-mail op naar ouders om hen te herinneren aan [ontbrekend document / openstaande factuur]. De oorspronkelijke deadline was [datum]. Houd de toon beleefd en begripvol, maar wees duidelijk over het belang. Vermeld onderaan bij wie ze terechtkunnen met vragen."
  </p>
  <div style="background: white; border-radius: 8px; padding: 12px; border-left: 2px solid var(--green);">
    <strong style="color: var(--green); font-size: 11px;">✓ Wat je krijgt:</strong> Welwillende maar duidelijke follow-up mail
  </div>
</div>

<div style="background: linear-gradient(135deg, rgba(10,31,168,0.08), rgba(127,224,0,0.08)); border-radius: 12px; padding: 20px; border-left: 4px solid var(--blue); margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 13px; color: var(--blue); text-transform: uppercase; margin-bottom: 12px;">💡 Prompt 4: Draaiboeken en checklist</div>
  <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7; font-style: italic;">
    "Maak een uitgebreid, chronologisch draaiboek in tabelvorm voor de organisatie van [evenement, bv. opendeurdag]. Verdeel de acties in vier fases: '2 maanden vooraf', '2 weken vooraf', 'De dag zelf', 'Afbouw achteraf'. Houd rekening met communicatie, catering en facilitair beheer."
  </p>
  <div style="background: white; border-radius: 8px; padding: 12px; border-left: 2px solid var(--green);">
    <strong style="color: var(--green); font-size: 11px;">✓ Wat je krijgt:</strong> Compleet projectplan voor groot evenement
  </div>
</div>

<div style="background: linear-gradient(135deg, rgba(10,31,168,0.08), rgba(127,224,0,0.08)); border-radius: 12px; padding: 20px; border-left: 4px solid var(--blue); margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 13px; color: var(--blue); text-transform: uppercase; margin-bottom: 12px;">💡 Prompt 5: Stap-voor-stap handleidingen</div>
  <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7; font-style: italic;">
    "Schrijf een duidelijke, stapsgewijze handleiding voor het lerarenteam over hoe zij [nieuwe procedure] moeten uitvoeren. Gebruik een genummerde lijst. Leg de nadruk op de stappen waar vaak fouten worden gemaakt en hou de zinnen zo kort en direct mogelijk."
  </p>
  <div style="background: white; border-radius: 8px; padding: 12px; border-left: 2px solid var(--green);">
    <strong style="color: var(--green); font-size: 11px;">✓ Wat je krijgt:</strong> Heldere handleiding voor collega's
  </div>
</div>

<div style="background: linear-gradient(135deg, rgba(127,224,0,0.08), rgba(10,31,168,0.08)); border-radius: 12px; padding: 20px; border-left: 4px solid var(--green); margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 13px; color: var(--green); text-transform: uppercase; margin-bottom: 12px;">💡 Klaar gemaakte Copilot-templates</div>
  <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7; margin-bottom: 16px;">
    Microsoft biedt templates aan speciaal voor onderwijs. Handige startpunten voor adminwerk:
  </p>
  
  <div style="display: flex; flex-direction: column; gap: 10px;">
    <a href="https://m365.cloud.microsoft/chat/?titleId=T_ee4b5de7-8666-7829-d4d1-d0c7a4bbaa8a&source=embedded-builder" target="_blank" style="background: white; border: 2px solid var(--green); border-radius: 8px; padding: 12px 16px; text-decoration: none; color: var(--green); font-weight: 700; transition: all 0.2s;">
      📚 Onderwijsassistent — Voor communicatie, planning & organisatie
    </a>
  </div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: Rapportages →</button>
</div>`;
}

function m3a2(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">⚡ Stap 4 van 5 · Efficiëncy & Automatisering</span></div>
<h2 class="ch2">Administratie <em>sneller & slimmer</em></h2>
<p class="cp">De beste AI-use case voor administratie is niet "dit kunnen machines voor me doen", maar "hoe besteed ik mijn tijd slimmer in?" Hier zijn 3 concrete efficiency-wins:</p>

<div style="background: white; border-left: 4px solid var(--blue); border-radius: 12px; padding: 20px; margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 14px; color: var(--blue); text-transform: uppercase; margin-bottom: 12px;">⚡ Win 1: Automatische formulierinvulling</div>
  <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.8;">
    Veel administratie is repetitief: contactgegevens, data, standaardteksten. Geef Copilot je "template" één keer, dan vult hij dezelfde informatie automatisch in de volgende 10 formulieren in. <strong>Besparing: 2-3 uur per week.</strong>
  </p>
</div>

<div style="background: white; border-left: 4px solid var(--orange); border-radius: 12px; padding: 20px; margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 14px; color: var(--orange); text-transform: uppercase; margin-bottom: 12px;">⚡ Win 2: Snel data schoonmaken</div>
  <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.8;">
    Je hebt een Excel met misgemaakte gegevens: inconsistente naamnotatie ("Jan de Vries" vs "J. de Vries"), foute datumformaten, ontbrekende nummers. Copilot kan dit automatisch herkennen en correct zetten. <strong>Besparing: 3-5 uur per batch.</strong>
  </p>
</div>

<div style="background: white; border-left: 4px solid var(--green); border-radius: 12px; padding: 20px; margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 14px; color: var(--green); text-transform: uppercase; margin-bottom: 12px;">⚡ Win 3: Vergaderverslagen in 2 minuten samenvatten</div>
  <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.8;">
    Je krijgt een 45-minuten-verslag van de schoolraad. Plak het in Copilot, zeg "Geef actiepunten + verantwoordelijken + deadlines in een tabel." Klaar in 2 minuten. <strong>Besparing: 20-30 minuten per vergadering.</strong>
  </p>
</div>

<div class="ib info" style="margin-top: 20px;">
  <div class="ib-t">💡 Slim gebruiken: kwaliteit checken</div>
  <div class="ib-b">
    Copilot werkt snel, maar zeg altijd: "Dit is niet perfect, ik zal het nog controleren." Zaken die Copilot overloopt: nummerlogica, lastige contexten, inconsistenties. Jij blijft de "final check".
  </div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: GDPR & Afronding →</button>
  <span class="nh">Stap 4/5</span>
</div>`;
}

function m3a3(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">🔒 Stap 5 van 5 · GDPR & Afronding</span></div>
<h2 class="ch2"><em>GDPR-check:</em> Wat mag niet</h2>
<p class="cp">Het meest kritieke voor administratie: weet wat je wél en niet mag doen met AI.</p>

<div style="background: rgba(224,32,32,0.1); border-left: 4px solid var(--red); border-radius: 12px; padding: 20px; margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 14px; color: var(--red); text-transform: uppercase; margin-bottom: 16px;">❌ Dit mag ABSOLUUT niet</div>
  
  <div style="margin-bottom: 16px;">
    <div style="font-weight: 700; color: var(--red); font-size: 13px; text-transform: uppercase; margin-bottom: 8px;">1. Foto's van kinderen bewerken met AI</div>
    <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7;">
      Zelfs "onschuldige" aanpassingen (background verwijderen, gezicht blurren) zijn gevoelig. GDPR en portretrecht beschermen kinderen. <strong>Risico: zware boetes.</strong>
    </p>
  </div>

  <div style="margin-bottom: 16px;">
    <div style="font-weight: 700; color: var(--red); font-size: 13px; text-transform: uppercase; margin-bottom: 8px;">2. Bestanden of documenten met leerlinggegevens online zetten</div>
    <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7;">
      Een Excel met leerlingnamen/scores/adressen uploaden naar ChatGPT of een gratis AI-tool = GDPR-schending. Alle leerlinggegevens blijven in M365 (met schild-icoon).
    </p>
  </div>

  <div style="margin-bottom: 16px;">
    <div style="font-weight: 700; color: var(--red); font-size: 13px; text-transform: uppercase; margin-bottom: 8px;">3. Persoonsgegevens in openbare prompts</div>
    <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7;">
      Nooit: "Schrijf een mail naar Jan de Vries (leerling 3A) omdat hij...". Altijd anonimiseren: "Schrijf een mail naar een leerling omdat hij afwezig was."
    </p>
  </div>

  <div>
    <div style="font-weight: 700; color: var(--red); font-size: 13px; text-transform: uppercase; margin-bottom: 8px;">4. Gevoelige schoolgegevens zonder beveiligde tool</div>
    <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7;">
      Leerlinggegevens, beleidsteksten, evaluatierapporten → alleen in Copilot M365 (het schild-icoon zichtbaar). Nooit gratis tools.
    </p>
  </div>
</div>

<div style="background: rgba(10,31,168,0.08); border-left: 4px solid var(--blue); border-radius: 12px; padding: 20px; margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 14px; color: var(--blue); text-transform: uppercase; margin-bottom: 12px;">✅ Dit mag wel</div>
  <ul style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.8; margin: 0; padding-left: 20px;">
    <li>Emailsjablonen genereren (zonder echte namen)</li>
    <li>Rapporten samenvatten (in M365)</li>
    <li>Efficiëncytips zoeken (proces-verbeteringen)</li>
    <li>Standaarddocumenten schrijven (beleid, info)</li>
    <li>Formulieren optimaliseren (structuur, workflow)</li>
  </ul>
</div>

<h3 class="ch3">💭 Reflectie</h3>
<p class="cp">Je hebt nu gezien hoe Copilot je administratie sneller kan maken: mails, samenvatten, automatisering. Wat ga je deze week als eerste uitproberen?</p>

<textarea class="sr-ta" id="r2" placeholder="Ik ga als eerst uitproberen... omdat ik dit veel tijd bespaar bij..." style="height: 100px;"></textarea>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn o" onclick="sR2()">✅ Verdieping voltooid →</button>
  <span class="nh">Stap 5/5</span>
</div>`;
  const ta = document.getElementById('r2');
  ta.value = localStorage.getItem('sr_r2_admin') || '';
  ta.oninput = ()=>localStorage.setItem('sr_r2_admin', ta.value);
}

/* ════════════════════════════════════════════
   MANAGEMENT MODULE 3 — Copilot voor beleid
   ════════════════════════════════════════════ */

function m3m0(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">🎯 Stap 1 van 5 · Strategisch</span></div>
<h2 class="ch2">Copilot voor <em>Strategisch Beleid</em></h2>
<p class="cp">Als schoolleiding zet je in op lange termijn: beleidsdocumenten, risicobeheer, regelingteksten, stakeholderberichten. Copilot helpt je die snel en deugdelijk op papier te krijgen.</p>

<h3 class="ch3">🎯 Top 4 strategische use cases</h3>
<div class="sr-row">
  <div class="sr-box wel">
    <div class="sr-box-title">1. 📋 Beleidsdocumenten</div>
    <p style="font-size: 13px; color: #3d4f8a; font-weight: 600;">Eerste versie van een beleidskader (AI, duurzaamheid, inclusie) in een uur opgesteld</p>
  </div>
  <div class="sr-box wel">
    <div class="sr-box-title">2. 🔍 Risicoanalyse</div>
    <p style="font-size: 13px; color: #3d4f8a; font-weight: 600;">Identificeer risico's en voorstel mitigatie op basis van je schoolcontext</p>
  </div>
</div>

<div class="sr-row">
  <div class="sr-box wel">
    <div class="sr-box-title">3. 💬 Stakeholder-communicatie</div>
    <p style="font-size: 13px; color: #3d4f8a; font-weight: 600;">Brieven aan raad van bestuur, ouders en overheid goed formuleren</p>
  </div>
  <div class="sr-box wel">
    <div class="sr-box-title">4. ⚖️ Regelingcompliance</div>
    <p style="font-size: 13px; color: #3d4f8a; font-weight: 600;">Check of je beleid aansluit bij EU AI Act, GDPR, schoolwetgeving</p>
  </div>
</div>

<div class="nw">
  <button class="sr-btn g" onclick="n3()">Volgende: Beleidsdocumenten →</button>
</div>`;
}

function m3m1(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">📋 Stap 2 van 5 · Beleidsdocumenten</span></div>
<h2 class="ch2">Beleidsdocumenten <em>opstellen</em></h2>
<p class="cp">Een nieuw AI-beleidskader? Een DG-plan? Een code of conduct? Copilot levert je eerste versie in minuten — jij refineert naar schoolse context.</p>

<div class="ai-card" style="border: 2px solid var(--blue); background: white; padding: 20px; border-radius: var(--rsm); margin: 16px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 12px; color: var(--blue); text-transform: uppercase; margin-bottom: 8px;">Voorbeeld: AI-Beleidskader (5 minuten)</div>
  <div style="font-size: 12px; font-weight: 700; color: #3d4f8a; margin: 12px 0;"><strong>Jij aan Copilot:</strong><br>"Maak een beleidskader voor AI-gebruik in een Nederlandse scholengroep (3 basisscholen + 1 voortgezet). Include: visie, risico's, goedgekeurde tools, ondersteuning, monitoren. Format: kort + puntsgewijs."</div>
  <div style="background: var(--off); padding: 12px; border-radius: 6px; font-size: 12px; color: #3d4f8a; font-weight: 600; line-height: 1.6;">
    <strong>Copilot geeft:</strong> Volledige structuur van beleidskader waarmee jij direct kan starten en aanpassen naar schoolcontext.
  </div>
</div>

<div class="ib warn">
  <div class="ib-t">⚠️ Controleer juridisch</div>
  <div class="ib-b">Laat gegenereerde beleidsteksten altijd controleren door juridisch adviseur of schoolcoach vóór publicatie. AI helpt met vorm, niet met juridische verantwoordelijkheid.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: Prompts voor beleid →</button>
</div>`;
}

function m3m_prompts_mgmt(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">💡 Stap 3 van 5 · Praktische Prompts</span></div>
<h2 class="ch2">5 <em>Prompts</em> voor strategisch beleid</h2>
<p class="cp">5 prompts die je helpen bij beleidsontwikkeling, risicomanagement en communicatie. Veel van deze taken nemen weken — deze prompts kunnen je eerst in uren zetten.</p>

<div style="background: linear-gradient(135deg, rgba(10,31,168,0.08), rgba(127,224,0,0.08)); border-radius: 12px; padding: 20px; border-left: 4px solid var(--blue); margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 13px; color: var(--blue); text-transform: uppercase; margin-bottom: 12px;">💡 Prompt 1: AI-Beleidskader in 2 uur</div>
  <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7; font-style: italic;">
    "Maak een beleidskader voor AI-gebruik in een Nederlandse scholengroep (bv. 3 basisscholen + 1 voortgezet). Include: visie, risico's, goedgekeurde tools, ondersteuning voor personeel, monitoren. Format: kort + puntsgewijs, geschikt voor raad van bestuur."
  </p>
  <div style="background: white; border-radius: 8px; padding: 12px; border-left: 2px solid var(--green);">
    <strong style="color: var(--green); font-size: 11px;">✓ Wat je krijgt:</strong> Compleet beleidskader als basis
  </div>
</div>

<div style="background: linear-gradient(135deg, rgba(10,31,168,0.08), rgba(127,224,0,0.08)); border-radius: 12px; padding: 20px; border-left: 4px solid var(--blue); margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 13px; color: var(--blue); text-transform: uppercase; margin-bottom: 12px;">💡 Prompt 2: Risicoanalyse voor AI-implementatie</div>
  <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7; font-style: italic;">
    "Maak een risicoanalyse voor AI-implementatie in onze scholen. Include: risico, waarschijnlijkheid (hoog/midden/laag), impact op onderwijs, mitigatie, verantwoordelijke. Categorieën: technisch, juridisch, pedagogisch, organisatorisch."
  </p>
  <div style="background: white; border-radius: 8px; padding: 12px; border-left: 2px solid var(--green);">
    <strong style="color: var(--green); font-size: 11px;">✓ Wat je krijgt:</strong> Gestructureerd risicoregister
  </div>
</div>

<div style="background: linear-gradient(135deg, rgba(10,31,168,0.08), rgba(127,224,0,0.08)); border-radius: 12px; padding: 20px; border-left: 4px solid var(--blue); margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 13px; color: var(--blue); text-transform: uppercase; margin-bottom: 12px;">💡 Prompt 3: Compliance-check EU AI Act</div>
  <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7; font-style: italic;">
    "Check of ons [huisige schoolbeleid/handboek] aansluit bij artikel 4 van de EU AI Act (geldig sinds 2 februari 2025). Wat ontbreekt? Wat moeten we toevoegen of aanpassen? Geef suggesties op basis van deze wettekst: [copy-paste artikel 4]."
  </p>
  <div style="background: white; border-radius: 8px; padding: 12px; border-left: 2px solid var(--green);">
    <strong style="color: var(--green); font-size: 11px;">✓ Wat je krijgt:</strong> Juridische gapanalyse
  </div>
</div>

<div style="background: linear-gradient(135deg, rgba(10,31,168,0.08), rgba(127,224,0,0.08)); border-radius: 12px; padding: 20px; border-left: 4px solid var(--blue); margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 13px; color: var(--blue); text-transform: uppercase; margin-bottom: 12px;">💡 Prompt 4: Stakeholder-brief naar ouders/bestuur</div>
  <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7; font-style: italic;">
    "Schrijf een brief aan [ouders/raad van bestuur] over onze AI-strategie. Include: waarom AI belangrijk is, hoe we het verantwoord gebruiken, beschermmaatregelen voor leerlingen, wat zij kunnen verwachten. Toon: transparantie + zekerheid. Lengte: 1 A4."
  </p>
  <div style="background: white; border-radius: 8px; padding: 12px; border-left: 2px solid var(--green);">
    <strong style="color: var(--green); font-size: 11px;">✓ Wat je krijgt:</strong> Professionele stakeholder-communicatie
  </div>
</div>

<div style="background: linear-gradient(135deg, rgba(10,31,168,0.08), rgba(127,224,0,0.08)); border-radius: 12px; padding: 20px; border-left: 4px solid var(--blue); margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 13px; color: var(--blue); text-transform: uppercase; margin-bottom: 12px;">💡 Prompt 5: Trainingsagenda voor leerkrachten</div>
  <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7; font-style: italic;">
    "Maak een trainingsagenda voor AI-geletterdheid bij onze leerkrachten. Include: Module 1 (concepten), Module 2 (beleid), optionele verdieping (Copilot praktijk). Voeg deadlines in en wijs welke afdelingen/vakken prioriteit krijgen. Format: kalender-view."
  </p>
  <div style="background: white; border-radius: 8px; padding: 12px; border-left: 2px solid var(--green);">
    <strong style="color: var(--green); font-size: 11px;">✓ Wat je krijgt:</strong> Gestructureerde implementatieplan
  </div>
</div>

<div style="background: linear-gradient(135deg, rgba(127,224,0,0.08), rgba(10,31,168,0.08)); border-radius: 12px; padding: 20px; border-left: 4px solid var(--green); margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 13px; color: var(--green); text-transform: uppercase; margin-bottom: 12px;">💡 Klaar gemaakte Copilot-templates</div>
  <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7; margin-bottom: 16px;">
    Microsoft biedt templates aan speciaal voor onderwijs. Templates voor strategisch werken:
  </p>
  
  <div style="display: flex; flex-direction: column; gap: 10px;">
    <a href="https://m365.cloud.microsoft/chat/?titleId=T_ee4b5de7-8666-7829-d4d1-d0c7a4bbaa8a&source=embedded-builder" target="_blank" style="background: white; border: 2px solid var(--green); border-radius: 8px; padding: 12px 16px; text-decoration: none; color: var(--green); font-weight: 700; transition: all 0.2s;">
      📚 Onderwijsassistent — Voor stakeholder-communicatie & planning
    </a>
    
    <a href="https://m365.cloud.microsoft/chat/?titleId=T_395da538-6255-88c4-8096-7fafa8d0fed9&source=embedded-builder" target="_blank" style="background: white; border: 2px solid var(--blue); border-radius: 8px; padding: 12px 16px; text-decoration: none; color: var(--blue); font-weight: 700; transition: all 0.2s;">
      🎯 AI-bestendige opdrachten maken — Voor beleidsvorming rond AI-gebruik
    </a>
  </div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: Risicoanalyse →</button>
</div>`;
}

function m3m2(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">⚖️ Stap 4 van 5 · Compliance & Implementatie</span></div>
<h2 class="ch2">EU AI Act & GDPR <em>compliance-check</em></h2>
<p class="cp">Je beleid moet voldoen aan regelgeving. Copilot helpt je snel een gap-analyse te maken: wat hebben we al, wat mist nog?</p>

<div style="background: white; border-left: 4px solid var(--blue); border-radius: 12px; padding: 20px; margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 14px; color: var(--blue); text-transform: uppercase; margin-bottom: 12px;">🔍 Use case: Regelgeving checken</div>
  <div style="font-size: 12px; font-weight: 700; color: #3d4f8a; margin: 12px 0; font-style: italic;">
    "Gegeven zijn artikel 4 van de EU AI Act en ons huisig AI-beleid [copy-paste beleid]. Maak een gapanalyse: welke elementen ontbreken? Wat moet aangepast? Voeg actiepunten toe."
  </div>
  <div style="background: var(--off); padding: 12px; border-radius: 6px; font-size: 12px; color: #3d4f8a; font-weight: 600; line-height: 1.6; margin-top: 12px;">
    <strong>Copilot geeft:</strong> Tabel met "Vereiste" / "Huisig beleid" / "Ontbreekt?" / "Actiepunt"
  </div>
</div>

<div style="background: white; border-left: 4px solid var(--orange); border-radius: 12px; padding: 20px; margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 14px; color: var(--orange); text-transform: uppercase; margin-bottom: 12px;">🚀 Use case: Implementatie-roadmap</div>
  <div style="font-size: 12px; font-weight: 700; color: #3d4f8a; margin: 12px 0; font-style: italic;">
    "Maak een implementatie-roadmap voor AI-geletterdheid op onze scholengroep. Include: fase 1 (korte termijn), fase 2 (middellang), fase 3 (lang). Voeg per fase: doelen, acties, teams, deadlines, budget."
  </div>
  <div style="background: var(--off); padding: 12px; border-radius: 6px; font-size: 12px; color: #3d4f8a; font-weight: 600; line-height: 1.6; margin-top: 12px;">
    <strong>Copilot geeft:</strong> Gestructureerde roadmap die je direct met team kan bespreken
  </div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: GDPR & Afronding →</button>
  <span class="nh">Stap 4/5</span>
</div>`;
}

function m3m3(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">🔒 Stap 5 van 5 · GDPR & Afronding</span></div>
<h2 class="ch2"><em>GDPR-check:</em> Wat mag niet</h2>
<p class="cp">Kritisch voor beleid: weet wat je wél en niet mag bij AI-implementatie.</p>

<div style="background: rgba(224,32,32,0.1); border-left: 4px solid var(--red); border-radius: 12px; padding: 20px; margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 14px; color: var(--red); text-transform: uppercase; margin-bottom: 16px;">❌ Dit mag ABSOLUUT niet</div>
  
  <div style="margin-bottom: 16px;">
    <div style="font-weight: 700; color: var(--red); font-size: 13px; text-transform: uppercase; margin-bottom: 8px;">1. Foto's van kinderen bewerken met AI</div>
    <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7;">
      Verboden door portretrecht en GDPR. Zelfs "onschuldige" bewerking. Dit geldt ook voor leerlingenfoto's voor schoolpost of jaarboek. <strong>Risico: boetes tot €20.000.</strong>
    </p>
  </div>

  <div style="margin-bottom: 16px;">
    <div style="font-weight: 700; color: var(--red); font-size: 13px; text-transform: uppercase; margin-bottom: 8px;">2. Leerling- of personeelsgegevens naar gratis tools</div>
    <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7;">
      Excel met namen, evaluaties, adressen → ChatGPT/Gemini = GDPR-schending. Data blijft in M365 (met schild-icoon). Geen uitzonderingen.
    </p>
  </div>

  <div style="margin-bottom: 16px;">
    <div style="font-weight: 700; color: var(--red); font-size: 13px; text-transform: uppercase; margin-bottom: 8px;">3. Gevoelige bestanden online plaatsen</div>
    <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7;">
      Beleidsteksten met schoolinterne info, evaluatierapporten, personeelsgegevens → nooit naar publieke platforms. Enkel M365 of beveiligde tools met verwerkersovereenkomst.
    </p>
  </div>

  <div>
    <div style="font-weight: 700; color: var(--red); font-size: 13px; text-transform: uppercase; margin-bottom: 8px;">4. Automatische screeningssystemen voor leerlingen</div>
    <p style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.7;">
      AI-systemen die emoties, talent of geschiktheid van leerlingen herkennen/beoordelen zonder menselijke tussenkomst zijn voor Sint-Rembert verboden. Altijd mens blijft beslisser.
    </p>
  </div>
</div>

<div style="background: rgba(10,31,168,0.08); border-left: 4px solid var(--blue); border-radius: 12px; padding: 20px; margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 14px; color: var(--blue); text-transform: uppercase; margin-bottom: 12px;">✅ Dit mag wel (verantwoord)</div>
  <ul style="font-size: 13px; color: #3d4f8a; font-weight: 600; line-height: 1.8; margin: 0; padding-left: 20px;">
    <li>Beleidsteksten helpen genereren (aanpassen naar school)</li>
    <li>Risicoanalyse uitvoeren (conceptueel)</li>
    <li>Stakeholder-brieven formuleren (voorzichtig generiek)</li>
    <li>Compliance-checks tegen regelgeving</li>
    <li>Trainingsmaterialen ontwikkelen (algemeen)</li>
  </ul>
</div>

<h3 class="ch3">💭 Jouw strategische afweging</h3>
<p class="cp">Je hebt nu gezien hoe Copilot kan helpen bij beleidsontwikkeling, compliance-checks en implementatieplannen. Wat ga je als eerste met je team doorvoeren?</p>

<textarea class="sr-ta" id="r2" placeholder="We gaan als eerst... omdat dit onze strategie ondersteunt bij..." style="height: 100px;"></textarea>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn o" onclick="sR2()">✅ Verdieping voltooid →</button>
  <span class="nh">Stap 5/5</span>
</div>`;
  const ta = document.getElementById('r2');
  ta.value = localStorage.getItem('sr_r2_mgmt') || '';
  ta.oninput = ()=>localStorage.setItem('sr_r2_mgmt', ta.value);
}

function rQuiz(con, qs, modN, sk, onComplete, pass){
  const id = 'q'+modN+'_'+Date.now();
  const st = { ans: new Array(qs.length).fill(null), correct: new Array(qs.length).fill(false) };
  const wrap = document.createElement('div');

  // Shuffle functie
  const shuffle = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // Randomiseer antwoorden per vraag
  qs.forEach(q => {
    const origCorrectIndex = q.a;
    const origCorrectAnswer = q.o[origCorrectIndex];
    const shuffledOptions = shuffle(q.o);
    const newCorrectIndex = shuffledOptions.indexOf(origCorrectAnswer);
    q.o = shuffledOptions;
    q.a = newCorrectIndex;
  });

  let prevBtnHtml = '';
  if(modN === 1) prevBtnHtml = `<button class="sr-btn b" style="background:#cbd5e1; color:var(--blue); margin-right:auto;" onclick="p1()">← Vorige stap</button>`;
  if(modN === 2) prevBtnHtml = `<button class="sr-btn b" style="background:#cbd5e1; color:var(--blue); margin-right:auto;" onclick="p2()">← Vorige stap</button>`;
  if(modN === 3) prevBtnHtml = `<button class="sr-btn b" style="background:#cbd5e1; color:var(--blue); margin-right:auto;" onclick="p3()">← Vorige stap</button>`;

  wrap.innerHTML = '<div class="s-badge">📝 Kennischeck</div><h2 class="ch2">Test je <em>kennis</em></h2>';
  const d = document.createElement('div'); d.className='qc';
  let inner = '<div class="qh"><div class="qi">📝</div><div><div class="qt">Kennischeck</div><div class="qs">'+qs.length+' vragen · slaagdrempel '+pass+'%</div></div></div>';
  qs.forEach((q,qi)=>{
    inner += '<div class="qb"><div class="qq">'+(qi+1)+'. '+q.q+'</div><div class="opts">';
    q.o.forEach((opt,oi)=>{
      inner += '<button class="opt" data-qi="'+qi+'" data-oi="'+oi+'" id="'+id+'-o'+qi+'-'+oi+'"><span class="ol">'+String.fromCharCode(65+oi)+'</span>'+opt+'</button>';
    });
    inner += '</div><div class="fb" id="'+id+'-f'+qi+'"></div></div>';
  });
  inner += `<div class="q-res" id="${id}-r"></div>
            <div style="display:flex; align-items:center; width:100%; justify-content:space-between; margin-top:12px;">
              ${prevBtnHtml}
              <button class="q-next" id="${id}-n" disabled>Controleer & ga verder →</button>
            </div>`;
  d.innerHTML = inner;
  wrap.appendChild(d);
  con.appendChild(wrap);

  d.querySelectorAll('.opt').forEach(b=>{
    b.onclick = ()=>{
      const qi = +b.dataset.qi, oi = +b.dataset.oi, q = qs[qi];
      if(st.ans[qi] !== null) return;
      st.ans[qi] = oi;
      const ok = oi === q.a;
      st.correct[qi] = ok;
      q.o.forEach((_,i)=>{
        const el = document.getElementById(id+'-o'+qi+'-'+i);
        el.disabled = true;
        if(i===oi) el.classList.add(ok?'cor':'wr');
        else if(i===q.a && !ok) el.classList.add('cor');
      });
      const f = document.getElementById(id+'-f'+qi);
      f.className = 'fb show '+(ok?'ok':'nok');
      f.textContent = (ok?'✅ ':'❌ ')+q.f;
      if(st.ans.every(a=>a!==null)) document.getElementById(id+'-n').disabled = false;
    };
  });

  document.getElementById(id+'-n').onclick = ()=>{
    const sc = Math.round(st.correct.filter(Boolean).length / qs.length * 100);
    const ok = sc >= pass;
    const r = document.getElementById(id+'-r');
    r.className = 'q-res show';
    r.innerHTML = '<div class="q-score '+(ok?'pass':'fail')+'">'+sc+'%</div><div class="q-msg">'+(ok?'✅ Geslaagd!':'❌ Nog niet geslaagd.')+'</div>';
    S[sk].quizScore = sc; ss();
    const nb = document.getElementById(id+'-n');
    if(ok){ nb.textContent = 'Volgende stap →'; nb.onclick = ()=>onComplete(); }
    else { nb.textContent = '↺ Probeer opnieuw'; nb.onclick = ()=>{ if(sk==='mod1') rm1(); else if(sk==='mod2') rm2(); else rm3(); document.getElementById('main').scrollTo({top:0}); }; }
  };
}

/* ════════════════════════════════════════════
   DOE-OPDRACHTEN & HELPERS
   ════════════════════════════════════════════ */

function renderAiCards(){
  const items = [
    {n:'Spamfilter e-mail', ai:true, w:'Machine learning'},
    {n:'Rekenmachine', ai:false, w:'Vaste regels'},
    {n:'TikTok-feed', ai:true, w:'Algoritme leert'},
    {n:'Copilot M365', ai:true, w:'LLM taalmodel'}
  ];
  const g = document.getElementById('aig');
  if(!g) return;
  items.forEach(it=>{
    const el = document.createElement('div'); el.className = 'ai-card';
    el.innerHTML = '❓ '+it.n;
    el.onclick = ()=>{
      el.style.background = it.ai ? '#dcfce7' : '#fee2e2';
      el.innerHTML = (it.ai?'🤖 ':'⬜ ')+it.n+' ('+it.w+')';
    };
    g.appendChild(el);
  });
}

function renderHalluCards(){
  const items = [
    { t:'"Een team van MIT-onderzoekers ontdekte in 2023 dat het brein van leerkrachten gemiddeld 12% sneller informatie verwerkt na een training in AI-tools."', h:true, e:'Hallucinatie: een vage, niet-bestaande studie met een erg specifiek percentage — een klassiek hallucinatiepatroon.' },
    { t:'"De Eerste Wereldoorlog duurde van 1914 tot 1918."', h:false, e:'Klopt — dit is een algemeen geverifieerd historisch feit.' },
    { t:'"Albert Einstein ontving in 1921 de Nobelprijs voor de Natuurkunde voor zijn verklaring van het foto-elektrisch effect."', h:false, e:'Klopt — niet elke specifieke uitspraak is een hallucinatie. Kritisch blijven werkt in twee richtingen.' },
    { t:'"Volgens artikel 12 van het schoolreglement van Sint-Rembert mag je nooit AI gebruiken voor lesvoorbereiding."', h:true, e:'Hallucinatie: een verzonnen artikelnummer dat bovendien niet overeenkomt met het echte AI-beleid van de school (zie Module 2).' }
  ];
  const g = document.getElementById('hallu');
  if(!g) return;
  items.forEach(it=>{
    const el = document.createElement('div'); el.className = 'ai-card'; el.style.textAlign='left';
    el.innerHTML = '🤖 '+it.t;
    el.onclick = ()=>{
      el.style.background = it.h ? '#fee2e2' : '#dcfce7';
      el.innerHTML = (it.h?'🚩 <strong>Hallucinatie</strong> — ':'✅ <strong>Klopt</strong> — ')+it.e;
    };
    g.appendChild(el);
  });
}

function renderLabelMatch(){
  const items = [
    { d:'Leerlingen schrijven een opstel over hun zomervakantie, volledig met de hand, zonder enige digitale hulp.', a:1 },
    { d:'Leerlingen mogen AI gebruiken om op ideeën te komen voor een werkstuk, maar moeten zelf de volledige tekst schrijven.', a:2 },
    { d:'Leerlingen schrijven zelf een eerste versie en mogen AI enkel gebruiken om hun tekst grammaticaal te verbeteren.', a:3 },
    { d:'Leerlingen maken een infographic en mogen AI gebruiken om een deel van de illustraties of tekstblokken aan te vullen, naast hun eigen werk.', a:4 },
    { d:'Leerlingen mogen volledig vrij AI gebruiken om een marketingplan te schrijven, zolang ze achteraf kunnen uitleggen welke keuzes ze maakten.', a:5 }
  ];
  
  // Shuffle functie
  const shuffle = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };
  
  const g = document.getElementById('lblmatch');
  if(!g) return;
  items.forEach((it,idx)=>{
    const card = document.createElement('div'); card.className='lm-card';
    
    // Randomiseer label-knoppen
    const labels = shuffle([1,2,3,4,5]);
    let opts = '';
    labels.forEach(i => opts += '<button class="lm-btn" data-v="'+i+'">'+i+'</button>');
    
    card.innerHTML = '<div class="lm-q">'+(idx+1)+'. '+it.d+'</div><div class="lm-opts">'+opts+'</div><div class="lm-fb" id="lmfb'+idx+'"></div>';
    g.appendChild(card);
    card.querySelectorAll('.lm-btn').forEach(b=>{
      b.onclick = ()=>{
        if(card.dataset.done) return;
        card.dataset.done='1';
        const v = +b.dataset.v, ok = v===it.a;
        card.querySelectorAll('.lm-btn').forEach(bb=>{
          bb.disabled = true;
          if(+bb.dataset.v === it.a) bb.classList.add('correct');
          else if(bb===b && !ok) bb.classList.add('wrong');
        });
        const fb = document.getElementById('lmfb'+idx);
        fb.className = 'lm-fb show';
        fb.textContent = ok ? '✅ Juist — label '+it.a+'.' : '❌ Niet helemaal — het juiste label is '+it.a+'.';
      };
    });
  });
}

function renderMagWel(){
  const items = [
    { 
      t:'Casus 1: De snelle rapportcommentaren — Excel met namen/scores uploaden naar ChatGPT voor gepersonaliseerde rapportteksten.', 
      ok:false, 
      e:'Mag NIET — GDPR-inbreuk. Je deelt persoonsgegevens (namen gekoppeld aan evaluaties) met extern commercieel platform dat data mogelijk voor modeltraining gebruikt. Enkel met anonimisering óf afgeschermde bedrijfsomgeving (Copilot M365).' 
    },
    { 
      t:'Casus 2: De gedifferentieerde leestekst — Complex krantenartikel in Copilot kopiëren, herschrijven naar B1 en uitdagend niveau, beide versies in de les gebruiken.', 
      ok:true, 
      e:'Mag — Perfect voorbeeld van AI als didactische assistent. Geen persoonsgegevens, leerkracht voert inhoudelijke controle uit en leert differentiatievaardigheden.' 
    },
    { 
      t:'Casus 3: De vlekkeloze code — Leerling geeft exact opdrachtomschrijving aan AI-chatbot, kopieert gegenereerde code, levert in zonder bronvermelding als eigen werk.', 
      ok:false, 
      e:'Mag NIET — Plagiaat en leerbedrog. Doel van opdracht is de vaardigheid van leerling evalueren, niet toolbediening. Ondermijnt evaluatieintegriteit zonder bronvermelding.' 
    },
    { 
      t:'Casus 4: De virtuele sparringpartner — Leerling gebruikt AI voor brainstorm knelpunten logistieke keten, zoekt zelf betrouwbare bronnen, schrijft presentatie zelf, vermeldt AI in bronnenlijst.', 
      ok:true, 
      e:'Mag — Sterke informatievaardigheden. AI als startpunt & inspiratie, niet als eindproduct. Kritische verwerking, betrouwbare bronnen & transparante vermelding = integriteit.' 
    },
    { 
      t:'Casus 5: De blinde corrector — Leerkracht scant handgeschreven toetsantwoorden, laat AI die corrigeren op basis van sleutel en geven van scores, neemt scores blindelings over.', 
      ok:false, 
      e:'Mag NIET — Verantwoordelijkheid blijft bij leerkracht. AI hallucineert soms of interpreteert creatieve (maar juiste) antwoorden als fout. Eindcontrole door leerkracht is verplicht voor eerlijke evaluatie.' 
    }
  ];
  const g = document.getElementById('magwel');
  if(!g) return;
  items.forEach((it,idx)=>{
    const card = document.createElement('div'); card.className='lm-card';
    card.innerHTML = '<div class="lm-q">'+(idx+1)+'. '+it.t+'</div><div class="lm-opts"><button class="lm-btn" data-v="ja" style="width:auto;padding:0 16px">✅ Mag wel</button><button class="lm-btn" data-v="nee" style="width:auto;padding:0 16px">❌ Mag niet</button></div><div class="lm-fb" id="mwfb'+idx+'"></div>';
    g.appendChild(card);
    card.querySelectorAll('.lm-btn').forEach(b=>{
      b.onclick = ()=>{
        if(card.dataset.done) return;
        card.dataset.done='1';
        const v = b.dataset.v, picked_ok = v==='ja';
        const correct = picked_ok === it.ok;
        card.querySelectorAll('.lm-btn').forEach(bb=>{
          bb.disabled = true;
          const bbOk = bb.dataset.v==='ja';
          if(bbOk === it.ok) bb.classList.add('correct');
          else if(bb===b && !correct) bb.classList.add('wrong');
        });
        const fb = document.getElementById('mwfb'+idx);
        fb.className = 'lm-fb show';
        fb.textContent = (correct?'✅ Juist — ':'❌ Niet helemaal — ')+it.e;
      };
    });
  });
}

function renderPromptBuilder(){
  const g = document.getElementById('promptbuilder');
  if(!g) return;
  const fields = [
    {k:'rol', l:'🎭 Rol', ph:'Je bent een ervaren leerkracht...'},
    {k:'doel', l:'🎯 Doel', ph:'Maak/herschrijf/vat samen...'},
    {k:'context', l:'🏫 Context', ph:'Voor leerlingen van...'},
    {k:'bron', l:'📄 Bron', ph:'Baseer je enkel op...'},
    {k:'verwachting', l:'✅ Verwachting', ph:'Vorm, lengte, toon...'}
  ];
  let saved = {};
  try{ saved = JSON.parse(localStorage.getItem('sr_promptbuilder')||'{}'); }catch(e){}
  let html = '';
  fields.forEach(f=>{
    html += '<div class="pb-row"><label class="pb-label">'+f.l+'</label><input class="pb-input" id="pb-'+f.k+'" placeholder="'+f.ph+'" value="'+(saved[f.k]||'').replace(/"/g,'&quot;')+'"></div>';
  });
  html += '<div class="pb-preview" id="pb-preview"></div>';
  g.innerHTML = html;
  function update(){
    const v = {};
    fields.forEach(f=>{ v[f.k] = document.getElementById('pb-'+f.k).value.trim(); });
    localStorage.setItem('sr_promptbuilder', JSON.stringify(v));
    const parts = [];
    if(v.rol) parts.push('Rol: '+v.rol);
    if(v.doel) parts.push('Doel: '+v.doel);
    if(v.context) parts.push('Context: '+v.context);
    if(v.bron) parts.push('Bron: '+v.bron);
    if(v.verwachting) parts.push('Verwachting: '+v.verwachting);
    const pv = document.getElementById('pb-preview');
    pv.textContent = parts.length ? parts.join('\n') : 'Vul de velden hierboven in om je prompt samengesteld te zien...';
  }
  fields.forEach(f=>{ document.getElementById('pb-'+f.k).oninput = update; });
  update();
}

/* ════════════════════════════════════════════
   NIEUW: Casus Scenario rendering
   ════════════════════════════════════════════ */

function renderCasusScenario(containerId){
  const scenarios = [
    {
      title: 'Situatie 1: De verdachte sprongen maken',
      desc: 'Een leerling levert een uitgebreide analyse in over supply chain management. De theorie klopt, maar het vakjargon en zinsbouw liggen onnatuurlijk hoog en ver boven het normale niveau van deze leerling.',
      choices: [
        {
          text: '"Heb je Copilot of ChatGPT gebruikt voor deze taak?"',
          label: 'A: De agent',
          feedback: '❌ Defensief. Dit werkt weerstand in de hand. Je verzandt in een welles-nietes spelletje waarbij jij het AI-gebruik moet bewijzen.',
          type: 'wrong'
        },
        {
          text: '"Ik zie dat je een enorme sprong hebt gemaakt in je academische schrijfstijl en het gebruik van complexe logistieke termen. Leg eens uit hoe je dit hebt aangepakt?"',
          label: 'B: De coach',
          feedback: '✅ Perfect! Je opent het gesprek op procesniveau. Je toont interesse en dwingt de leerling om mondeling eigenaarschap te tonen. Ruimte voor eerlijkheid over AI als hulp.',
          type: 'correct'
        }
      ]
    },
    {
      title: 'Situatie 2: De leerling met het "vreemde" kladblok',
      desc: 'Je ziet dat een leerling in de klas de hele toets in Copilot aan het uitwerken is (niet discreet, gewoon open scherm). Label is "2 — Ideeën", dus mag AI voor brainstorm. Maar dit voelt als meer dan ideeën.',
      choices: [
        {
          text: '"Zet die laptop onmiddellijk uit, dit mag niet!"',
          label: 'A: Zero tolerance',
          feedback: '❌ Escalatief en onrechtvaardig. Label 2 staat AI toe. Nu maak je de leerling boos en ondergraa je je eigen regels.',
          type: 'wrong'
        },
        {
          text: '"Even checken: Label 2 is voor ideeën. Wat voor ideeën haul je eruit, en hoe bouw je daarop voort in je eigen werk?"',
          label: 'B: Clarify & steer',
          feedback: '✅ Juist! Je hebt de leerling op het label teruggepakt. Je zorgt dat ze zich bewust zijn van de grens, zonder te verschullen achter "maar je mag het niet".',
          type: 'correct'
        }
      ]
    },
    {
      title: 'Situatie 3: De opdrachtherformulering',
      desc: 'Je realiseren je na drie jaar dat je standaard huiswerkopdracht "Schrijf een betoog van 500 woorden over [onderwerp]" voor AI-tools praktisch een open uitnodiging is. Wat doe je?',
      choices: [
        {
          text: '"Voortaan alle huiswerk met pen en papier, inleveren in foto-vorm. Hacker-proof!"',
          label: 'A: Totale lockdown',
          feedback: '❌ Negatief en onwerkbaar. Je erkent niet dat het probleem in de opdrachtformulering zit, niet in AI op zich.',
          type: 'wrong'
        },
        {
          text: '"Herformuleer: Leerlingen reflecteren eerst mondeling op 2 minuten, schrijven hun eigen stelling, geven deze daarna aan AI voor taalcorrectie (Label 3), en zetten hun prompt erbij als bijlage."',
          label: 'B: Redesign the task',
          feedback: '✅ Excellent! Je: 1) Maakt het proces zichtbaar (mondeling), 2) Beperkt AI tot waar het zinvol is (taal, niet inhoud), 3) Vraagt transparantie (prompt erbij). Dit is AI-bestendig ontwerp.',
          type: 'correct'
        }
      ]
    }
  ];

  const c = document.getElementById(containerId);
  if(!c) return;
  
  let html = '<div class="casus-wrap">';
  scenarios.forEach((s, si) => {
    html += `<div class="casus-scenario">
      <div class="casus-title">${s.title}</div>
      <div class="casus-desc">${s.desc}</div>
      <div class="casus-choices">`;
    
    s.choices.forEach((ch, ci) => {
      const id = `casus-${si}-${ci}`;
      html += `<div class="casus-choice">
        <div class="casus-choice-label">${ch.label}</div>
        <button class="casus-btn" id="${id}" data-feedback="${ch.feedback}" data-type="${ch.type}">
          ${ch.text}
        </button>
        <div class="casus-fb" id="${id}-fb"></div>
      </div>`;
    });
    
    html += `</div></div>`;
  });
  html += '</div>';
  c.innerHTML = html;

  // Event listeners
  c.querySelectorAll('.casus-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.id;
      const feedback = this.dataset.feedback;
      const type = this.dataset.type;
      const fbEl = document.getElementById(id + '-fb');
      
      fbEl.className = 'casus-fb show ' + type;
      fbEl.textContent = feedback;
      this.disabled = true;
    });
  });
}

/* ════════════════════════════════════════════
   NIEUW: Prompt Comparison rendering
   ════════════════════════════════════════════ */

function renderPromptComparison(){
  const example = {
    bad: "Maak een oefening over boekhouden en de btw.",
    good: "Rol: Je bent een leerkracht economie. Doel: Maak een realistische, praktische casus waarin een startende ondernemer de btw-aangifte moet berekenen. Context: Voor leerlingen van de 3de graad, die de basisprincipes al kennen. Bron: Baseer je uitsluitend op standaard Belgische btw-tarieven (21%, 12%, 6%). Verwachting: Een korte introductietekst van het fictieve bedrijf, gevolgd door 3 concrete berekeningsvragen. Voorzie de antwoordsleutel apart.",
    badResult: "Generieke, sterke theoretische lap tekst of oppervlakkige meerkeuzevraag over wat 'btw' betekent.",
    goodResult: "Bruikbare, actieve klasoefening: realistische scenario, direct inzetbaar, juiste toon, Belgische context, antwoordsleutel erbij."
  };

  return `
<div class="prompt-comp-wrap">
  <div class="prompt-comp-intro">
    <div class="prompt-comp-icon">⚡</div>
    <div>
      <div class="prompt-comp-title">De kracht van R-D-C-B-V</div>
      <div class="prompt-comp-sub">Hieronder zie je dezelfde vraag aan Copilot — eerst vaag, daarna gestructureerd. Let op het verschil!</div>
    </div>
  </div>

  <div class="prompt-comp-grid">
    <!-- MATIG -->
    <div class="prompt-comp-col bad">
      <div class="prompt-comp-col-header">❌ Zonder structuur</div>
      <div class="prompt-comp-label">JE PROMPT</div>
      <div class="prompt-comp-content">${example.bad}</div>
      <div class="prompt-comp-divider">↓ COPILOT GEEFT</div>
      <div class="prompt-comp-result">${example.badResult}</div>
      <div class="prompt-comp-verdict">Niet bruikbaar direct in je les.</div>
    </div>

    <!-- STERK -->
    <div class="prompt-comp-col good">
      <div class="prompt-comp-col-header">✅ Met R-D-C-B-V structuur</div>
      <div class="prompt-comp-label">JE PROMPT</div>
      <svg class="rdcbv-badge" viewBox="0 0 220 60" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="40" height="60" rx="6" fill="#0A1FA8"/><text x="20" y="35" text-anchor="middle" font-size="12" fill="#7FE000" font-weight="bold">Rol</text>
        <rect x="45" y="0" width="40" height="60" rx="6" fill="#0A1FA8"/><text x="65" y="35" text-anchor="middle" font-size="12" fill="#7FE000" font-weight="bold">Doel</text>
        <rect x="90" y="0" width="40" height="60" rx="6" fill="#0A1FA8"/><text x="110" y="35" text-anchor="middle" font-size="12" fill="#7FE000" font-weight="bold">Context</text>
        <rect x="135" y="0" width="40" height="60" rx="6" fill="#0A1FA8"/><text x="155" y="35" text-anchor="middle" font-size="12" fill="#7FE000" font-weight="bold">Bron</text>
        <rect x="180" y="0" width="40" height="60" rx="6" fill="#0A1FA8"/><text x="200" y="35" text-anchor="middle" font-size="12" fill="#7FE000" font-weight="bold">Verwachting</text>
      </svg>
      <div class="prompt-comp-content small">${example.good}</div>
      <div class="prompt-comp-divider">↓ COPILOT GEEFT</div>
      <div class="prompt-comp-result good">${example.goodResult}</div>
      <div class="prompt-comp-verdict ok">✨ Direct inzetbaar in je klas!</div>
    </div>
  </div>

  <div class="prompt-comp-tip">
    <div class="prompt-comp-tip-icon">💡</div>
    <div class="prompt-comp-tip-text"><strong>Pro tip:</strong> Hoe specifieke je prompt, hoe beter Copilot snapt wat je wil. Die paar extra zinnen besparen je later 20 minuten herschrijven!</div>
  </div>
</div>
  `;
}

/* ════════════════════════════════════════════
   NIEUW: FAQ rendering
   ════════════════════════════════════════════ */

function renderFAQ(){
  const faqs = [
    {
      q: '❓ Ik kan Copilot niet vinden in mijn Microsoft 365',
      a: 'Copilot zit in office.com, rechtsboven onder "Apps". Niet zichtbaar? Zorg dat je bent aangemeld met je officiële schoolaccount (@sint-rembert.be). Aanmelden via https://office.com > Inloggen > Zoeken naar "Copilot" in de app-galerij.'
    },
    {
      q: '🛡️ Ik zie het schild-icoon niet in Copilot',
      a: 'Het schild (Protected) zou standaard zichtbaar moeten zijn. Als je het niet ziet: Log uit, wis je browsercache (Ctrl+Shift+Del), en log terug in met je schoolaccount. Nog steeds weg? Mail naar Arne Breemeersch (arne.breemeersch@sint-rembert.be) — je bent mogelijk ingelogd met het verkeerde account.'
    },
    {
      q: '💾 Ik heb mijn reflectieverslag per ongeluk gewist / ben mijn voortgang kwijt',
      a: 'De cursus slaat alles lokaal op in je browser (localStorage). Cookies gewist? Helaas is het weg. Zorg altijd dat je je Reflectieverslag download voordat je de browser sluit! Noodgeval: mail de pagina naar jezelf zodat je de HTML kunt opslaan.'
    },
    {
      q: '📱 De cursus werkt niet goed op mijn telefoon / tablet',
      a: 'De cursus is ontworpen voor desktop/laptop (scherm ≥ 980px). Tablets: landscape-modus proberen. Smartphones: vraag om een desktop-apparaat voor de cursus — de videos en teksten zijn te uitgebreid voor klein scherm.'
    },
    {
      q: '🎓 Ik heb mijn certificaat al gedownload, maar ik kan het niet vinden',
      a: 'Je browser heeft het waarschijnlijk opgeslagen in je Downloads-map. Zoek daar naar een PDF met jouw naam. Niet gevonden? Je kan het slechts 1x downloaden, dus helaas niet opnieuw — mail Arne (arne.breemeersch@sint-rembert.be) met je voornaam/achternaam als backup.'
    },
    {
      q: '🚀 Kan ik Module 3 overslaan en rechtstreeks naar het certificaat?',
      a: 'Module 3 is optioneel. Je ontvangt je certificaat zodra je Module 1 & 2 hebt afgerond. Module 3 is voor verdieping enkel als je meer wil weten over Copilot in de praktijk.'
    },
    {
      q: '📧 Ik heb een fout gevonden / wil feedback geven',
      a: 'Dank je! Mail naar Arne Breemeersch (arne.breemeersch@sint-rembert.be) met je bevinding. Include: wat ging fout, op welke stap, en wat verwachtte je?'
    }
  ];

  let html = '<div class="faq-wrap">';
  faqs.forEach((item, i) => {
    const id = `faq-${i}`;
    html += `
<div class="faq-item">
  <button class="faq-q" onclick="toggleFAQ('${id}')">
    <span>${item.q}</span>
    <span class="faq-toggle">+</span>
  </button>
  <div class="faq-a" id="${id}" style="display:none">
    <p>${item.a}</p>
  </div>
</div>`;
  });
  html += '</div>';
  return html;
}

function toggleFAQ(id) {
  const el = document.getElementById(id);
  const isOpen = el.style.display !== 'none';
  el.style.display = isOpen ? 'none' : 'block';
  
  const btn = el.previousElementSibling;
  const toggle = btn.querySelector('.faq-toggle');
  toggle.textContent = isOpen ? '+' : '−';
}

/* ════════════════════════════════════════════
   NAAM MANAGEMENT
   ════════════════════════════════════════════ */

function showNameEntry() {
  if(S.name) return; // Naam al ingevuld
  
  const modal = document.createElement('div');
  modal.id = 'name-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(10,31,168,0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 8888;
  `;
  
  modal.innerHTML = `
    <div style="background: white; border-radius: 16px; padding: 40px; max-width: 500px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
      <div style="font-size: 48px; margin-bottom: 16px;">👤</div>
      <h2 style="font-family: 'Archivo Black', sans-serif; font-size: 24px; color: var(--blue); margin-bottom: 8px; text-transform: uppercase;">Jouw naam invullen</h2>
      <p style="color: var(--muted); font-weight: 600; margin-bottom: 24px;">We gebruiken deze naam op je certificaat. Zorg dat je deze correct invult!</p>
      
      <input type="text" id="name-modal-input" class="un-inp" placeholder="Voornaam Achternaam" style="width: 100%; font-size: 15px; padding: 12px; border: 2px solid var(--gray); border-radius: 8px; margin-bottom: 16px;">
      
      <button class="sr-btn g" onclick="saveName()" style="width: 100%; padding: 14px;">✓ Opslaan en doorgaan</button>
      
      <p style="font-size: 12px; color: var(--muted); margin-top: 16px; font-weight: 600;">Voorbeeld: <em>Lieve Janssen</em></p>
    </div>
  `;
  
  document.body.appendChild(modal);
  document.getElementById('name-modal-input').focus();
  document.getElementById('name-modal-input').addEventListener('keypress', function(e) {
    if(e.key === 'Enter') saveName();
  });
}

function saveName() {
  const input = document.getElementById('name-modal-input');
  const name = input?.value?.trim() || '';
  
  if(!name) {
    alert('Vul alstublieft je naam in.');
    return;
  }
  
  S.name = name;
  ss();
  console.log('✓ Naam opgeslagen:', name);
  
  const modal = document.getElementById('name-modal');
  if(modal) modal.remove();
  
  // Toon welkomstbericht
  const welcomeEl = document.getElementById('welcome-name');
  if(welcomeEl) welcomeEl.textContent = name;
  
  // Ga naar startest
  setTimeout(() => goStartTest(), 500);
}

// Start sequence
window.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded: Script geladen, state:', S);
  
  // Zorg dat naamveld ingevuld is
  document.getElementById('un').value = S.name || '';
  
  // Eerst: update UI met huidige state
  ua();
  up();
  rmc();
  
  // Dan: check rolkeuze
  if(!S.userRole){
    console.log('Geen rol gekozen, toon selector');
    showRoleSelector();
  } else {
    console.log('Rol gekozen:', S.userRole);
    if(!S.starttest.taken){ 
      console.log('Startest niet gedaan, start');
      goStartTest(); 
    } else { 
      console.log('Ga naar home');
      sv('home'); 
    }
  }
});

// Fallback als DOMContentLoaded niet werkt
setTimeout(function() {
  if(!document.querySelector('.role-view') && !S.userRole && !S.starttest.taken) {
    console.log('Fallback: toon rolkeuze');
    showRoleSelector();
  }
}, 500);
