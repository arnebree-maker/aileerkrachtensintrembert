/* ════════════════════════════════════════════
   AI-SKILLS CURSUS SINT-REMBERT — LEERLINGEN
   Versie 3.0 — Volledig stap-gebaseerd systeem
   ════════════════════════════════════════════ */

// ── STATE ──
const K = 'sr_ai_leerlingen_v3';
let localStorageAvailable = false;

function testLocalStorage(){
  try {
    const test = '__sr_test__';
    localStorage.setItem(test, 'test');
    localStorage.removeItem(test);
    localStorageAvailable = true;
    return true;
  } catch(e) {
    localStorageAvailable = false;
    console.warn('⚠️ localStorage niet beschikbaar — gebruik RAM fallback');
    return false;
  }
}

let S = {
  name: '',
  starttest: {taken:false, score:0, passed:false},
  mod1: {step:0, done:false},
  mod2: {step:0, done:false},
  mod3: {step:0, done:false},
  mod4: {step:0, done:false},
  mod5: {step:0, done:false},
  mod6: {step:0, done:false},
  certPrinted: false
};

function ld(){
  testLocalStorage();
  if(!localStorageAvailable) return;
  try{
    const s = localStorage.getItem(K);
    if(s){ S = Object.assign(S, JSON.parse(s)); return; }
  }catch(e){ console.error('❌ Error bij laden state:', e); }
}

function clearCache(){
  localStorage.clear();
  location.reload();
}

function ss(){
  if(!localStorageAvailable) return;
  try{ localStorage.setItem(K, JSON.stringify(S)); }catch(e){}
}

ld();

document.addEventListener('DOMContentLoaded', () => {
  const unEl = document.getElementById('un');
  if(unEl){ unEl.value = S.name || ''; unEl.disabled = false; unEl.readOnly = false; unEl.addEventListener('change', sn); }
  ua(); up(); rmc();
  renderStartTest();
  // Navigeer meteen naar de juiste plek op basis van bewaarde voortgang
  if(S.starttest.taken){
    sv('home');
  }
});

function ua(){ const n = (document.getElementById('un')?.value||'').trim(); const av=document.getElementById('av'); if(av) av.textContent = n ? n.charAt(0).toUpperCase() : '?'; }
function sn(){ S.name = document.getElementById('un').value.trim(); ss(); ua(); }

/* ════════════════════════════════════════════
   PROGRESS / NAVIGATION
   ════════════════════════════════════════════ */

function up(){
  const mods = ['mod1','mod2','mod3','mod4','mod5','mod6'];
  const d = mods.filter(m=>S[m].done).length;
  const p = Math.round(d/6*100);
  const pb = document.getElementById('pb'); if(pb) pb.style.width = p+'%';
  const pct = document.getElementById('pct'); if(pct) pct.textContent = p+'%';

  const stEl = document.getElementById('st-status');
  if(stEl){
    if(!S.starttest.taken){ stEl.textContent = 'Nog te starten'; stEl.className=''; }
    else if(S.starttest.passed){ stEl.textContent = '✓ '+S.starttest.score+'%'; stEl.className='st-pass'; }
    else { stEl.textContent = S.starttest.score+'%'; stEl.className='st-fail'; }
  }

  if(!S.starttest.taken){
    for(let i=1;i<=6;i++){
      const nav = document.getElementById('nav-mod'+i); if(nav) nav.className='ni locked';
      const l = document.getElementById('l'+i); if(l) l.textContent='🔒';
    }
    return;
  }

  // Module 1 always available after starttest
  setModuleNavState(1, true);
  for(let i=2;i<=6;i++){
    const prevDone = S['mod'+(i-1)].done;
    setModuleNavState(i, prevDone);
  }

  if(S.mod6.done){
    const navCert = document.getElementById('nav-cert'); if(navCert){ navCert.className='ni available'; }
    const lc = document.getElementById('lc'); if(lc) lc.textContent='›';
  }
}

function setModuleNavState(i, unlocked){
  const nav = document.getElementById('nav-mod'+i);
  const l = document.getElementById('l'+i);
  const done = S['mod'+i].done;
  if(nav) nav.className = done ? 'ni done' : (unlocked ? 'ni available' : 'ni locked');
  if(l) l.innerHTML = done ? '<span style="color:var(--green)">✓</span>' : (unlocked ? '›' : '🔒');
}

function rmc(){
  for(let i=1;i<=6;i++){
    const cm = document.getElementById('cm'+i);
    const bm = document.getElementById('bm'+i);
    const ps = document.getElementById('ps'+i);
    if(!cm) continue;
    const prevDone = i===1 ? true : S['mod'+(i-1)].done;
    const done = S['mod'+i].done;
    if(done){
      cm.classList.remove('locked'); cm.classList.add('done');
      bm.disabled=false; bm.textContent='↺ Herhalen'; bm.onclick=()=>{ if(!S.starttest.taken){goStartTest();return;} window['rm'+i](); sv('mod'+i); };
      ps.className='mc-stat ok'; ps.textContent='✓ Voltooid';
    } else if(prevDone){
      cm.classList.remove('locked');
      bm.disabled=false; bm.textContent='▶ Start'; bm.onclick=()=>{ if(!S.starttest.taken){goStartTest();return;} window['rm'+i](); sv('mod'+i); };
      ps.className='mc-stat'; ps.textContent='Beschikbaar';
    } else {
      cm.classList.add('locked');
      bm.disabled=true; bm.textContent='🔒 Vergrendeld';
      ps.textContent='Voltooi Module '+(i-1)+' eerst';
    }
  }
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
  if(!S.starttest.taken){ goStartTest(); return; }
  if(n===1){ rm1(); sv('mod1'); return; }
  const prevDone = S['mod'+(n-1)].done;
  if(prevDone){ window['rm'+n](); sv('mod'+n); }
  else { alert('Voltooi eerst Module '+(n-1)+'.'); }
}

function goHome(){
  if(!S.starttest.taken){ goStartTest(); return; }
  sv('home');
}

function goStartTest(){ showNameEntry(); renderStartTest(); sv('starttest'); }
function tryC(){ S.mod6.done ? sv('cert') : alert('Voltooi eerst alle 6 modules.'); }

function rDots(m,tot,cur){
  const c = document.getElementById('sd'+m); if(!c) return; c.innerHTML='';
  for(let i=0;i<tot;i++){ const d=document.createElement('div'); d.className='dot '+(i<cur?'done':i===cur?'active':''); c.appendChild(d); }
}

let lastNavDirection = 'forward';
function lockNextButtons(container){
  const btns = container.querySelectorAll('.nw .sr-btn.g, .nw .sr-btn.o');
  btns.forEach(b=>{ b.disabled = false; });
  lastNavDirection = 'forward';
}

/* ════════════════════════════════════════════
   NAAM-ENTRY (voor starttest)
   ════════════════════════════════════════════ */

function showNameEntry(){
  // Naam wordt in zijbalk ingevuld — geen aparte stap nodig
}

/* ════════════════════════════════════════════
   CERTIFICAAT
   ════════════════════════════════════════════ */

function rc(){
  document.getElementById('cert-name').textContent = S.name || 'Leerling';
  document.getElementById('cert-date').textContent = new Date().toLocaleDateString('nl-BE',{day:'numeric',month:'long',year:'numeric'});
  const btn = document.getElementById('print-cert-btn');
  const info = document.getElementById('cert-dl-info');
  btn.disabled=false;
  btn.textContent='🖨️ Download certificaat (PDF)';
  info.textContent = '';
}

function doCertPrint(){
  if(!S.name || !S.name.trim()){
    if(!confirm('Je naam is nog niet ingevuld (links onderaan in de zijbalk). Het certificaat vermeldt dan "Leerling".\n\nToch doorgaan?')) return;
  } else {
    if(!confirm('Certificaat downloaden?\n\nNaam op certificaat: ' + S.name + '\n\nKies in het afdrukvenster "Opslaan als PDF" en bewaar het bestand.')) return;
  }
  rc();
  window.print();
}

function downloadSummary(){
  const name = S.name || 'Anonieme Leerling';
  let txt = `==================================================\n`;
  txt += `AI-SKILLS SCHOLENGROEP SINT-REMBERT\n`;
  txt += `PERSOONLIJK ANTWOORDEN- EN REFLECTIEVERSLAG\n`;
  txt += `==================================================\n\n`;
  txt += `Leerling: ${name}\n`;
  txt += `Datum van export: ${new Date().toLocaleDateString('nl-BE')}\n\n`;

  for(let i=1;i<=6;i++){
    const key = 'sr_l_ref'+i;
    const val = localStorage.getItem(key) || 'Geen antwoord ingevuld.';
    txt += `--------------------------------------------------\n`;
    txt += `MODULE ${i}\n`;
    txt += `--------------------------------------------------\n`;
    txt += `${val}\n\n`;
  }

  txt += `==================================================\n`;
  txt += `Gegenereerd via Sint-Rembert AI-Skills platform.\n`;
  txt += `==================================================`;

  const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AI-Skills-Antwoorden-${name.replace(/\s+/g,'_')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ════════════════════════════════════════════
   STARTTEST — 1 kans, 10 vragen
   ════════════════════════════════════════════ */

function renderStartTest(){
  const c = document.getElementById('st-content');
  if(!c) return;
  if(S.starttest.taken){ renderStartTestLocked(c); return; }
  renderStartTestQuiz(c);
}

function renderStartTestLocked(c){
  c.innerHTML = `
<div class="qh"><div class="qi">🧪</div><div><div class="qt">Startest al afgelegd</div><div class="qs">Score: ${S.starttest.score}%</div></div></div>
<div style="text-align:center;padding:24px 0;">
  <p class="cp">Je hebt de startest al één keer afgelegd. ${S.starttest.passed ? 'Je hebt de basisvraag rond "Wat is AI?" goed beantwoord.' : 'Geen zorgen — je doorloopt gewoon alle 6 modules, te beginnen bij Module 1.'}</p>
  <button class="sr-btn g" onclick="goHome()">Naar startpagina →</button>
</div>`;
}

function renderStartTestQuiz(c){
  c.innerHTML = `
<div class="qh"><div class="qi">🧪</div><div><div class="qt">Startest — Wat weet je al over AI?</div><div class="qs">10 vragen · geen slaagdrempel, gewoon om te peilen · vul eerst je naam in</div></div></div>
<div style="background:white;border-radius:12px;padding:20px;margin-bottom:16px;">
  <label style="font-weight:700;font-size:13px;color:var(--blue);display:block;margin-bottom:8px;">👋 Wat is je naam?</label>
  <input type="text" id="st-name-input" placeholder="Voornaam Achternaam" style="width:100%;padding:12px;border:2px solid #e0e4f5;border-radius:8px;font-size:14px;font-family:'Nunito',sans-serif;" value="${S.name||''}">
</div>
<div id="st-quiz-box"></div>`;

  const nameInput = document.getElementById('st-name-input');
  nameInput.oninput = ()=>{ S.name = nameInput.value.trim(); ss(); ua(); };

  const quiz = [
    {q:'Wat is artificiële intelligentie (AI) in de kern?', o:['Software die exact doet wat een programmeur letterlijk heeft voorgeschreven.','Software die patronen leert herkennen uit data en daarop voorspellingen maakt.','Een robot met een eigen bewustzijn en gevoelens.','Een supersnelle rekenmachine die enkel getallen verwerkt.'], a:1},
    {q:'ChatGPT is een voorbeeld van:', o:['Generatieve AI','Een zoekmachine','Een virus','Een besturingssysteem'], a:0},
    {q:'Wat is een "hallucinatie" bij AI?', o:['Wanneer de AI crasht.','Wanneer AI met zekerheid iets verzint dat niet klopt.','Wanneer AI een grappige tekening maakt.','Wanneer de internetverbinding wegvalt.'], a:1},
    {q:'Wat is "bias" bij AI?', o:['Een AI-model dat te traag werkt.','Vooroordelen die AI overneemt uit de data waarop het getraind is.','Een fout in de programmeercode.','Een AI die te veel stroom verbruikt.'], a:1},
    {q:'Mag je zomaar elke AI-tool gebruiken voor elke schooltaak?', o:['Ja, altijd, AI is altijd toegestaan.','Nee, het hangt af van het AI-label dat je leerkracht geeft.','Nee, AI mag nooit op school gebruikt worden.','Ja, maar enkel in de derde graad.'], a:1},
    {q:'Wat is een deepfake?', o:['Een AI-gegenereerde, nagemaakte foto/video/audio die echt lijkt maar het niet is.','Een diepe zeevis herkend door AI.','Een extra veilige wachtwoordmethode.','Een soort computervirus.'], a:0},
    {q:'Waarom verbruikt AI-gebruik (zoals ChatGPT) veel energie?', o:['Omdat de AI constant muziek afspeelt.','Omdat grote rekencentra nodig zijn om de miljarden berekeningen te doen.','Dat klopt niet, AI verbruikt geen energie.','Omdat AI enkel \'s nachts werkt.'], a:1},
    {q:'Wat betekent het als een AI-model "getraind" is?', o:['Het heeft aan sport gedaan.','Het heeft patronen geleerd uit grote hoeveelheden voorbeelddata.','Het is fysiek verplaatst naar een ander land.','Het heeft een examen afgelegd.'], a:1},
    {q:'Mag je een AI-detectietool (die AI-tekst herkent) volledig vertrouwen?', o:['Ja, die zijn 100% betrouwbaar.','Nee, ze zijn onbetrouwbaar en geven soms valse beschuldigingen.','Ja, maar enkel in het Engels.','Dat bestaat niet.'], a:1},
    {q:'Wat is het belangrijkste dat je zelf moet doen met AI-output?', o:['Niets, AI heeft altijd gelijk.','Ze kritisch controleren voor je ze gebruikt.','Ze meteen doorsturen naar vrienden.','Ze printen en inleveren.'], a:1}
  ];

  const box = document.getElementById('st-quiz-box');
  const st = { ans: new Array(quiz.length).fill(null) };
  let inner = '<div class="qc">';
  quiz.forEach((q,qi)=>{
    inner += '<div class="qb"><div class="qq">'+(qi+1)+'. '+q.q+'</div><div class="opts">';
    q.o.forEach((opt,oi)=>{
      inner += '<button class="opt" data-qi="'+qi+'" data-oi="'+oi+'" id="stq-o'+qi+'-'+oi+'"><span class="ol">'+String.fromCharCode(65+oi)+'</span>'+opt+'</button>';
    });
    inner += '</div></div>';
  });
  inner += '<div style="text-align:center;margin-top:20px;"><button class="sr-btn g" id="st-submit" disabled>Bevestig antwoorden →</button></div></div>';
  box.innerHTML = inner;

  box.querySelectorAll('.opt').forEach(b=>{
    b.onclick = ()=>{
      const qi = +b.dataset.qi, oi = +b.dataset.oi;
      st.ans[qi] = oi;
      quiz[qi].o.forEach((_,i)=>{
        document.getElementById('stq-o'+qi+'-'+i).classList.remove('cor');
      });
      b.classList.add('cor');
      if(st.ans.every(a=>a!==null)) document.getElementById('st-submit').disabled = false;
    };
  });

  document.getElementById('st-submit').onclick = ()=>{
    if(!S.name || !S.name.trim()){ alert('Vul eerst je naam in hierboven!'); return; }
    let correct = 0;
    quiz.forEach((q,qi)=>{ if(st.ans[qi]===q.a) correct++; });
    const score = Math.round(correct/quiz.length*100);
    S.starttest = { taken:true, score, passed: score>=70 };
    ss(); up(); rmc();
    // Zorg dat het naamveld in de zijbalk meteen de ingevulde naam toont
    const sidebarUn = document.getElementById('un');
    if(sidebarUn) sidebarUn.value = S.name;
    ua();
    alert('✅ Startest voltooid! Score: '+score+'%.\n\nJe start nu bij Module 1: Wat is AI?');
    rm1();
    sv('mod1');
  };
}

/* ════════════════════════════════════════════
   MODULE 1 — WAT IS AI? (12 stappen)
   ════════════════════════════════════════════ */

const m1 = [m1s0, m1s1, m1s2, m1s3, m1s4, m1s5, m1s6, m1s_hallubias, m1s7, m1s8, m1s9, m1s10];

function rm1(){ const c=document.getElementById('m1c'); c.innerHTML=''; rDots(1,m1.length,S.mod1.step); m1[S.mod1.step](c); lockNextButtons(c); }
function n1(){ S.mod1.step++; ss(); S.mod1.step>=m1.length ? d1() : rm1(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); }
function p1(){ if(S.mod1.step > 0){ S.mod1.step--; ss(); rm1(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); } }
function d1(){ S.mod1.done=true; S.mod1.step=0; ss(); up(); rmc(); sv('home'); setTimeout(()=>alert('🎉 Module 1 voltooid! Module 2 is nu beschikbaar.'),300); }

function m1s0(c){
  c.innerHTML = `
<div class="s-badge">🤔 Stap 1 van 12 · AI overal</div>
<h2 class="ch2">AI is <em>overal</em> — ook al zie je het niet</h2>
<p class="cp">Gezichtsherkenning op je telefoon, de "voor jou aanbevolen" video's op TikTok en YouTube, de spamfilter in je mailbox, Google Maps die files voorspelt — <strong>AI zit al jaren in de apps die je dagelijks gebruikt</strong>. En sinds ChatGPT eind 2022 doorbrak, ook steeds meer in je huiswerk en in de klas.</p>
<p class="cp">Maar wat is AI eigenlijk? In de kern is het software die patronen leert herkennen uit grote hoeveelheden data, en op basis daarvan voorspellingen of beslissingen maakt — zonder dat een mens voor elke situatie apart een regel heeft geprogrammeerd. Dat onderscheidt AI van gewone software, die enkel doet wat letterlijk in de code staat.</p>
<p class="cp">Je hoeft geen programmeur te worden, maar je moet AI wel kunnen <strong>herkennen, begrijpen en er verantwoord mee omgaan</strong>. Dat is precies waar deze zes modules je bij helpen.</p>

<div class="ib warn">
  <div class="ib-t">💡 Wist je dat?</div>
  <div class="ib-b">Veel apps die je al jarenlang gebruikt — spellingcontrole, automatische ondertiteling op YouTube, Spotify die muziek aanbeveelt — draaien al langer op AI dan ChatGPT bestaat. Het nieuwe is niet "AI" op zich, maar specifiek <strong>generatieve AI</strong>, die zelf nieuwe tekst, beelden of muziek kan maken. Daarover gaat de rest van deze module.</div>
</div>

<div class="nw">
  <button class="sr-btn g" onclick="n1()">Volgende: introvideo →</button>
  <span class="nh">Stap 1/12</span>
</div>`;
}

function m1s1(c){
  c.innerHTML = `
<div class="s-badge">🎬 Stap 2 van 12 · Introvideo</div>
<h2 class="ch2">Bekijk: <em>intro artificiële intelligentie</em></h2>
<p class="cp">EDUbox (VRT NWS) legt uit wat AI is en hoe het werkt.</p>
<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/sosmC2h4LLE" allowfullscreen loading="lazy" title="EDUbox Artificiële Intelligentie — Introductie"></iframe></div>
<div class="ib warn">
  <div class="ib-t">📝 Samenvatting</div>
  <div class="ib-b">AI is overal om ons heen, vaak zonder dat we het beseffen: van persoonlijke aanbevelingen op Spotify en Netflix tot zelfrijdende auto's. De video plaatst dit dagelijkse AI-gebruik in perspectief en bereidt voor op de vraag die de rest van deze module beantwoordt: wat is AI nu precies, en welke principes zitten erachter?</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: doe-opdracht →</button>
  <span class="nh">Stap 2/12</span>
</div>`;
}

function m1s2(c){
  c.innerHTML = `
<div class="s-badge">🧩 Stap 3 van 12 · Doe-opdracht</div>
<h2 class="ch2">AI of <em>geen AI</em>?</h2>
<p class="cp">Klik op elke kaart en denk eerst zelf na: gebruikt deze toepassing AI, of werkt ze met vaste, vooraf geprogrammeerde regels?</p>
<div id="aig"></div>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: van regels naar GenAI →</button>
  <span class="nh">Stap 3/12</span>
</div>`;
  renderAiCards();
}

function m1s3(c){
  c.innerHTML = `
<div class="s-badge">📚 Stap 4 van 12 · Van regels naar Generatieve AI</div>
<h2 class="ch2">Van vaste regels naar <em>Generatieve AI</em></h2>
<p class="cp">AI bestaat al sinds de jaren 50, en kende eerder al grote doorbraken — denk aan schaakcomputer Deep Blue die in 1997 wereldkampioen Kasparov versloeg. Maar die vroege AI kon vooral één ding: <strong>classificeren of voorspellen</strong>. Is dit e-mailbericht spam? Welke video zou jij leuk vinden? Het systeem koos tussen vooraf gedefinieerde opties.</p>
<p class="cp">De sprong naar <strong>generatieve AI</strong> (GenAI) verandert dat fundamenteel: deze systemen kunnen tekst, beeld, audio en code <em>maken die nog niet bestond</em>. ChatGPT haalde na zijn lancering eind 2022 razendsnel honderd miljoen gebruikers — geen enkele app groeide ooit zo snel.</p>

<h3 class="ch3">🔀 Drie soorten AI die je al gebruikt</h3>
<div style="background: rgba(10,31,168,0.08); border-radius: 8px; padding: 16px; margin: 16px 0;">
<p style="font-size: 12px; color: #3d4f8a; line-height: 1.8; margin: 0;">
<strong style="display: block; margin-bottom: 8px;">1. Promptgedreven AI (ChatGPT, Copilot)</strong>
Jij stelt vragen, AI antwoordt. Jij bestuurt. Voorbeeld: "Leg fotosynthese uit alsof ik 12 ben"<br><br>
<strong style="display: block; margin-bottom: 8px;">2. Prompt-versterkende AI (Grammarly, spellingcontrole)</strong>
AI integreert in je workflow: jij schrijft, AI helpt verbeteren terwijl je typt<br><br>
<strong>3. Leerproces-gerichte AI (oefenapps, adaptieve toetsen)</strong>
AI past aan jouw tempo aan en geeft extra hulp waar nodig
</p>
</div>

<p class="cp">Technisch gezien werkt een taalmodel als ChatGPT met <strong>kansberekening</strong>: op basis van enorme hoeveelheden tekst leert het systeem welk woord statistisch het meest waarschijnlijk volgt op de woorden die er al staan. Het "begrijpt" dus niet zoals een mens — het voorspelt, woord na woord, wat een plausibel vervolg zou zijn.</p>

<h3 class="ch3">⚙️ Hoe een taalmodel werkelijk werkt</h3>
<div style="background: rgba(127,224,0,0.12); border-radius: 8px; padding: 16px; margin: 16px 0;">
<p style="font-size: 12px; color: #3d4f8a; line-height: 1.8; margin: 0;">
<strong>Stap 1 — Het "brein":</strong> Miljarden zinnen uit boeken, artikelen, websites. Het systeem ziet patronen: na "Goedemorgen" volgt vaak "hoe gaat het?"<br><br>
<strong>Stap 2 — Heel veel data:</strong> Hoe meer voorbeelden, hoe beter de patronen. Daarom zijn OpenAI en Google zo groot — ze hebben meer data.<br><br>
<strong>Stap 3 — Bijsturen (feedback):</strong> Via training krijgt het systeem beloning voor goede antwoorden, correctie voor foute. Dit heet "reinforcement learning".<br><br>
<strong>Gevolg:</strong> Wanneer jij "Leg de Franse Revolutie uit" typt, rolt het systeem af wat statistisch waarschijnlijk volgt — meestal zinvol, maar soms ook hallucinaties (verzonnen feiten) of bias (vooroordelen uit trainingsdata).
</p>
</div>

<h3 class="ch3">🎬 EDUbox: hoe werken neurale netwerken?</h3>
<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/-zmnRz81CNQ" allowfullscreen loading="lazy" title="EDUbox Artificiële Intelligentie — Hoe werken neurale netwerken?"></iframe></div>
<div class="ib warn">
  <div class="ib-t">📝 Samenvatting</div>
  <div class="ib-b">Deze video gaat dieper in op de technische motor achter moderne AI: het neurale netwerk, losjes geïnspireerd op hoe hersenen werken. Lagen van kunstmatige "neuronen" leren patronen herkennen uit grote hoeveelheden voorbeelden — de basis van zowel machine learning als generatieve AI. In Module 2 duiken we hier nog dieper in.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: hallucinaties →</button>
  <span class="nh">Stap 4/12</span>
</div>`;
}

function m1s4(c){
  c.innerHTML = `
<div class="s-badge">⚠️ Stap 5 van 12 · Hallucinaties</div>
<h2 class="ch2">Het belangrijkste begrip van <em>deze module</em></h2>
<div class="ib warn">
  <div class="ib-t">⚠️ Hallucinaties</div>
  <div class="ib-b">Omdat GenAI altijd het meest waarschijnlijke volgende woord voorspelt, klinkt de output <strong>altijd zelfverzekerd</strong> — ook wanneer ze feitelijk fout is. Dat noemen we een <strong>hallucinatie</strong>: verzonnen informatie die er volkomen betrouwbaar uitziet. Een AI-tool kan bijvoorbeeld een historische gebeurtenis "citeren" met jaartal en naam die er gewoonweg niet bestaat. Het systeem "verzint" niet bewust; het stelt enkel een plausibel vervolg samen, zonder enige garantie dat het ook waar is.</div>
</div>
<p class="cp">Dit is cruciaal om te weten voor je huiswerk: als je AI gebruikt voor een werkstuk of onderzoek, kan het gewoon dingen verzinnen — een boektitel die niet bestaat, een jaartal dat fout is, een "feit" dat nergens op gebaseerd is. En het klinkt daarbij altijd even zeker van zichzelf.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: doe-opdracht →</button>
  <span class="nh">Stap 5/12</span>
</div>`;
}

function m1s5(c){
  c.innerHTML = `
<div class="s-badge">🧩 Stap 6 van 12 · Doe-opdracht</div>
<h2 class="ch2">Spot de <em>hallucinatie</em></h2>
<p class="cp">Hieronder staan 4 uitspraken zoals een AI-chatbot ze zou kunnen formuleren — stuk voor stuk even zelfverzekerd. Klik op elke kaart: welke bevat een hallucinatie (verzonnen feit, bron of cijfer), en welke klopt gewoon?</p>
<div id="hallu"></div>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: kansen & gevaren →</button>
  <span class="nh">Stap 6/12</span>
</div>`;
  renderHalluCardsLeerling();
}

function m1s6(c){
  c.innerHTML = `
<div class="s-badge">⚖️ Stap 7 van 12 · Kansen & gevaren</div>
<h2 class="ch2">Mogelijkheden én <em>gevaren</em> van GenAI</h2>
<p class="cp">GenAI biedt kansen voor je schoolwerk — maar ook concrete risico's die je moet kennen om er verantwoord mee om te gaan. Geen van beide kanten weegt zwaarder: het gaat om een kritische, afgewogen blik.</p>

<div class="grid2">
  <div class="pane-ok lijst-ok">
    <div class="lijst-h-ok">✅ Kansen voor jou als leerling</div>
    <div>→ Snellere hulp bij moeilijke uitleg</div>
    <div>→ Feedback op je eigen tekst (grammatica, structuur)</div>
    <div>→ Ideeën en brainstorm voor werkstukken</div>
    <div>→ Overhoren en oefenvragen genereren</div>
    <div>→ Complexe onderwerpen simpel uitgelegd krijgen</div>
    <div>→ 24/7 beschikbaar, geen wachttijd</div>
  </div>
  <div class="pane-nok lijst-nok">
    <div class="lijst-h-nok">⚠️ Gevaren om te kennen</div>
    <div>→ Hallucinaties: overtuigende maar foute informatie</div>
    <div>→ Bias: vooroordelen uit trainingsdata</div>
    <div>→ Plagiaat: AI-tekst als eigen werk inleveren</div>
    <div>→ Minder goed leren zelfstandig te schrijven/denken</div>
    <div>→ Privacy: persoonsgegevens die je invoert</div>
    <div>→ Afhankelijkheid: alles aan AI overlaten</div>
  </div>
</div>

<h3 class="ch3">💡 3x Meerwaarde — Voor wie?</h3>
<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin: 16px 0;">
<div style="background: white; border: 2px solid var(--green); border-radius: 8px; padding: 12px;">
<div style="font-weight: 700; color: var(--green); font-size: 11px; text-transform: uppercase; margin-bottom: 6px;">👨‍🎓 Voor jou</div>
<p style="font-size: 11px; color: #3d4f8a; line-height: 1.6; margin: 0;">Krijg je feedback 24/7, oefen op je eigen tempo, ontdek je eigen manier van leren.</p>
</div>
<div style="background: white; border: 2px solid var(--blue); border-radius: 8px; padding: 12px;">
<div style="font-weight: 700; color: var(--blue); font-size: 11px; text-transform: uppercase; margin-bottom: 6px;">👨‍🏫 Voor je leerkracht</div>
<p style="font-size: 11px; color: #3d4f8a; line-height: 1.6; margin: 0;">Bespaart tijd bij nakijken en lesvoorbereiding — meer tijd voor persoonlijke uitleg aan jou.</p>
</div>
<div style="background: white; border: 2px solid var(--orange); border-radius: 8px; padding: 12px;">
<div style="font-weight: 700; color: var(--orange); font-size: 11px; text-transform: uppercase; margin-bottom: 6px;">🏫 Voor school</div>
<p style="font-size: 11px; color: #3d4f8a; line-height: 1.6; margin: 0;">Kan beter inspelen op verschillen tussen leerlingen (taal, tempo, niveau).</p>
</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: hallucinaties & bias diepgaand →</button>
  <span class="nh">Stap 7/12</span>
</div>`;
}

function m1s_hallubias(c){
  c.innerHTML = `
<div class="s-badge">👻 Stap 8 van 12 · Valkuilen</div>
<h2 class="ch2">Hallucinaties & <em>Bias</em>: twee kritieke grenzen</h2>
<p class="cp">AI is krachtig, maar niet perfect. Twee dingen om goed te begrijpen:</p>

<h3 class="ch3">👻 Hallucinaties: AI verzint feiten</h3>
<div style="background: rgba(255,107,107,0.12); border-radius: 8px; padding: 16px; margin: 16px 0;">
<p style="font-size: 13px; color: #3d4f8a; line-height: 1.8; margin: 0;">
<strong>Wat:</strong> AI beweert dingen die niet waar zijn, heel overtuigend.<br>
<strong>Voorbeeld:</strong> Je vraagt "Welke Vlaamse auteur schreef 'De Ontdekking'?" AI antwoordt met een titel, auteur en jaartal die gewoon verzonnen zijn — klinkt volledig plausibel.<br>
<strong>Waarom:</strong> AI genereert op basis van patronen, niet werkelijkheid. Het "weet" niet wat waar is, het raadt wat waarschijnlijk volgt.<br>
<strong>Gevolg:</strong> Altijd controleren wat AI zegt, zeker voor je het in een werkstuk zet.
</p>
</div>

<h3 class="ch3">⚖️ Bias: AI herhaalt vooroordelen</h3>
<div style="background: rgba(255,193,7,0.12); border-radius: 8px; padding: 16px; margin: 16px 0;">
<p style="font-size: 13px; color: #3d4f8a; line-height: 1.8; margin: 0;">
<strong>Wat:</strong> AI neemt vooroordelen over uit trainingsdata (het internet staat vol stereotypes).<br>
<strong>Voorbeeld:</strong> Vraag AI om een afbeelding van "een dokter" te maken — vaak krijg je vooral mannen te zien. Of vraag "wie is geschikt als klasvertegenwoordiger" en let op welke voornamen vaker terugkomen.<br>
<strong>Waarom:</strong> AI leert van patronen in data. Zoekmachines, Wikipedia, social media bevatten veel bias.<br>
<strong>Gevolg:</strong> Wees kritisch op output. Vraag jezelf af: "Zou dit antwoord anders zijn als ik iets anders had ingevuld?"
</p>
</div>

<h3 class="ch3">✅ Drie controlestappen die jij kan gebruiken</h3>
<ol style="font-size: 12px; color: #3d4f8a; line-height: 1.8; padding-left: 20px;">
<li><strong>Controleer feiten:</strong> Vraag naar bronnen. AI zit geregeld fout.</li>
<li><strong>Herformuleer:</strong> Stel dezelfde vraag op 2-3 manieren. Krijg je hetzelfde antwoord? Dan is het waarschijnlijker correct.</li>
<li><strong>Vraag door:</strong> Vraag "Weet je dit zeker? Wat is je bron?" — vaak geeft AI dan toe onzeker te zijn.</li>
</ol>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: hype of realiteit? →</button>
  <span class="nh">Stap 8/12</span>
</div>`;
}

function m1s7(c){
  c.innerHTML = `
<div class="s-badge">🎬 Stap 9 van 12 · Hype of realiteit?</div>
<h2 class="ch2">AI in het nieuws: <em>hype of realiteit?</em></h2>
<svg viewBox="0 0 700 110" style="width:100%;height:auto;display:block;margin-bottom:18px;border-radius:var(--rsm);background:var(--blue)" xmlns="http://www.w3.org/2000/svg">
  <circle cx="80" cy="55" r="34" fill="rgba(127,224,0,.18)"/>
  <text x="80" y="65" font-size="32" text-anchor="middle">📣</text>
  <text x="160" y="48" font-family="Archivo Black, sans-serif" font-size="15" fill="#ffffff">HYPE</text>
  <text x="160" y="68" font-family="Nunito, sans-serif" font-size="11" fill="rgba(255,255,255,.55)" font-weight="700">Doemscenario's, clickbait, robot-fantasie</text>
  <line x1="320" y1="25" x2="320" y2="85" stroke="rgba(255,255,255,.2)" stroke-width="2"/>
  <text x="380" y="48" font-family="Archivo Black, sans-serif" font-size="15" fill="#7FE000">REALITEIT</text>
  <text x="380" y="68" font-family="Nunito, sans-serif" font-size="11" fill="rgba(255,255,255,.55)" font-weight="700">Patroonherkenning, concrete schoolpraktijk</text>
  <circle cx="600" cy="55" r="34" fill="rgba(127,224,0,.18)"/>
  <text x="600" y="65" font-size="32" text-anchor="middle">🔍</text>
</svg>
<p class="cp">Op TikTok en YouTube zie je de wildste doemscenario's over AI — en evengoed de wildste beloftes ("AI vervangt alle jobs!"). Om dat in perspectief te plaatsen, bekijk dit videofragment.</p>

<h3 class="ch3">🎬 NOS op 3: "Roeit AI ons uit… of is het hype?"</h3>
<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/-WDdSiVjBhg" allowfullscreen loading="lazy" title="NOS op 3 — Roeit AI ons uit of is het hype"></iframe></div>
<p class="cp">Deze video plaatst de extreme doemscenario's rondom AI in perspectief en verlegt de focus naar de échte, actuele uitdagingen zoals misinformatie en tech-hypes.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: reflectievragen →</button>
  <span class="nh">Stap 9/12</span>
</div>`;
}

function m1s8(c){
  c.innerHTML = `
<div class="s-badge">💬 Stap 10 van 12 · Reflectievragen</div>
<h2 class="ch2">Vijf vragen om over <em>na te denken</em></h2>
<div class="disc-card">
  <div class="disc-q">1. Je ziet op TikTok en YouTube de wildste doemscenario's over AI. Hoe kan je zelf die 'hype' doorprikken?</div>
  <div class="disc-a">Ontleed waar zo'n verhaal vandaan komt (vaak films of clickbait) en leer het verschil tussen de AI van vandaag (patroonherkenning) en toekomstmuziek zoals 'algemene intelligentie' die nog niet bestaat.</div>
</div>
<div class="disc-card">
  <div class="disc-q">2. Deepfakes en nepnieuws worden steeds echter. Hoe herken je wat je online ziet niet zomaar te geloven?</div>
  <div class="disc-a">Check wie de afzender is, wat het doel van het bericht is, en vergelijk met betrouwbare bronnen — in plaats van enkel de video of foto zelf te bekijken.</div>
</div>
<div class="disc-card">
  <div class="disc-q">3. Bedrijven beloven gouden bergen over AI. Waarom is het slim om zelf kritisch te blijven?</div>
  <div class="disc-a">Bedrijven willen hun product verkopen. Vraag jezelf altijd af: wie verdient hier geld aan, en klopt de belofte wel met wat je zelf ziet gebeuren?</div>
</div>
<div class="disc-card">
  <div class="disc-q">4. AI kan razendsnel theorie uitleggen. Verandert dat hoe jij zou willen leren op school?</div>
  <div class="disc-a">Misschien wel! Als de basis-uitleg sneller gaat, is er meer tijd in de les voor vragen, oefenen en de 'waarom'-vraag — in plaats van enkel luisteren.</div>
</div>
<div class="disc-card">
  <div class="disc-q">5. Als AI later veel routinewerk overneemt op de arbeidsmarkt, welke vaardigheden worden dan extra belangrijk voor jou?</div>
  <div class="disc-a">Vaardigheden waar AI moeite mee heeft: empathie, kritisch denken, samenwerken, creativiteit en probleemoplossend vermogen.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: kennischeck →</button>
  <span class="nh">Stap 10/12</span>
</div>`;
}

function m1s9(c){
  const quiz = [
    {q: 'Wat is een hallucinatie bij generatieve AI?', o: ['Wanneer een AI-model weigert antwoord te geven op een ongepaste vraag.','Wanneer een AI-model met grote stelligheid feitelijk onjuiste of verzonnen informatie genereert.','Wanneer een AI-model tijdelijk trager werkt door een slechte internetverbinding.','Wanneer een AI-model letterlijke tekstblokken overneemt uit auteursrechtelijk beschermde bronnen.'], a: 1, f: 'Hallucinaties zijn plausibel klinkende maar foutieve output — een direct gevolg van voorspellen op kansberekening.' },
    {q: 'Wat is de grote sprong van generatieve AI t.o.v. eerdere AI-vormen?', o: ['Generatieve AI kan volledig nieuwe content creëren zoals teksten, afbeeldingen, audio en code.','Generatieve AI werkt aanzienlijk sneller en vereist minder rekenkracht.','Generatieve AI maakt dankzij de nieuwste modellen nooit meer fouten.','Generatieve AI is uitsluitend geprogrammeerd met vaste als-dan-regels.'], a: 0, f: 'Vroegere AI classificeerde en voorspelde; GenAI creëert nieuwe content die nog niet bestond.' },
    {q: 'Waarom is bias in AI relevant voor jou?', o: ['Omdat AI-modellen hierdoor trager worden bij complexe vragen.','Omdat AI hiermee stereotypen uit trainingsdata reproduceert — een belangrijk mediawijsheidsthema.','Omdat bias ervoor zorgt dat gratis tools minder functies hebben.','Omdat AI hierdoor een voorkeur ontwikkelt voor Engelstalige bronnen.'], a: 1, f: 'AI leert van data vol menselijke vooroordelen. Dit herkennen traint je mediawijsheid en kritisch denken.' },
    {q: 'Een AI-tekst vermeldt een bron met auteur en jaartal. Wat is de juiste reflex?', o: ['De bron blindelings overnemen, want een vermelding met jaartal is betrouwbaar.','De genoemde bron zelfstandig opzoeken via betrouwbare kanalen om te controleren of die echt bestaat.','Enkel controleren of het jaartal logisch klinkt.','Aan de AI zelf vragen of de bronvermelding wel klopt.'], a: 1, f: 'Verzonnen bronvermeldingen zijn een klassieke hallucinatie. Zelf controleren is noodzakelijk.' },
    {q: 'Wat is technisch gezien de basis van hoe een taalmodel zoals ChatGPT werkt?', o: ['Het zoekt live op internet naar het beste antwoord.','Het voorspelt op basis van kansberekening welk woord waarschijnlijk volgt.','Het kopieert letterlijk teksten uit een database.','Het vraagt een mens om elk antwoord te controleren voor het wordt getoond.'], a: 1, f: 'Een taalmodel "begrijpt" niet zoals een mens — het voorspelt woord voor woord het meest waarschijnlijke vervolg.' }
  ];
  rQuiz(c, quiz, 1, 'mod1', n1, 60);
}

function m1s10(c){
  c.innerHTML = `
<div class="s-badge">✍️ Stap 12 van 12 · Jouw reflectie</div>
<h2 class="ch2">Vertaal naar <em>jouw schoolwerk</em></h2>
<p class="cp">Je kent nu de basis: hoe AI werkt, wat generatieve AI bijzonder maakt, en welke kansen én gevaren erbij horen (hallucinaties, bias). Tijd om dit concreet te maken voor jouw eigen vakken en huiswerk.</p>

<h3 class="ch3">🎓 Wat zegt de wetenschap?</h3>
<p class="cp">Rani Van Schoors, onderzoeker AI in onderwijs aan KU Leuven, nuanceert de vraag of leerlingen door AI nog wel zelf leren schrijven of denken. Ze illustreert hoe fout AI kan zitten met een treffend voorbeeld: Google Bard (nu Gemini) vertelde ooit onterecht dat de James Webb-ruimtetelescoop als eerste beelden van buiten ons zonnestelsel had gemaakt — dat klopte niet.</p>
<p class="cp">Van Schoors wijst er ook op dat de kwaliteit van een AI-systeem volledig afhangt van de data waarmee het getraind werd: als je een dataset met enkel honden in een mand en katten in het gras gebruikt, herkent het systeem een hond in het gras verkeerd als kat. Dat is precies hoe bias ontstaat.</p>

<div class="ib warn">
  <div class="ib-t">📚 Bron</div>
  <div class="ib-b">Klasse, "AI in het onderwijs: nuttige helper of vervangleraar?" — interview met Rani Van Schoors (KU Leuven). <a href="https://www.klasse.be/722771/ai-in-het-onderwijs-expert-rani-schoors/" target="_blank">klasse.be/722771</a></div>
</div>

<h3 class="ch3">💭 Wat denk jij?</h3>
<div id="stl-m1"></div>

<p class="cp">Noteer hieronder je reflectie (minstens een paar zinnen): bij welk vak of welke taak zou AI écht meerwaarde bieden voor jou? En waar zou je het net bewust <strong>niet</strong> gebruiken, en waarom niet?</p>
<textarea class="sr-ta" id="ref1" placeholder="Ik denk dat AI mij zou helpen bij... Ik zou AI niet gebruiken voor... omdat..."></textarea>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" id="ref1btn" onclick="sRef1()">✅ Module 1 afronden →</button>
  <span class="nh">Stap 12/12</span>
</div>`;
  const ta = document.getElementById('ref1');
  ta.value = localStorage.getItem('sr_l_ref1') || '';
  ta.oninput = ()=>localStorage.setItem('sr_l_ref1', ta.value);
  renderStellingenLeerling('stl-m1', 'l_m1', ['AI zal ervoor zorgen dat leerlingen minder goed zelfstandig kunnen schrijven.','Ik moet AI-output altijd controleren, ook als die er overtuigend uitziet.']);
}

function sRef1(){
  const v = (document.getElementById('ref1').value||'').trim();
  if(v.length < 20){ alert('Vul eerst je reflectie in (minstens een paar zinnen).'); return; }
  n1();
}

/* ════════════════════════════════════════════

/* ════════════════════════════════════════════
   MODULE 2 — HOE WERKT AI? (11 stappen)
   Herwerkt: minder neurale netwerken, meer NotebookLM & zelf-prompten
   ════════════════════════════════════════════ */

const m2 = [m2s0, m2s1, m2s2, m2s3, m2s4, m2s5, m2s6, m2s7, m2s8, m2s9, m2s10];

function rm2(){ const c=document.getElementById('m2c'); c.innerHTML=''; rDots(2,m2.length,S.mod2.step); m2[S.mod2.step](c); lockNextButtons(c); }
function n2(){ S.mod2.step++; ss(); S.mod2.step>=m2.length ? d2() : rm2(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); }
function p2(){ if(S.mod2.step > 0){ S.mod2.step--; ss(); rm2(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); } }
function d2(){ S.mod2.done=true; S.mod2.step=0; ss(); up(); rmc(); sv('home'); setTimeout(()=>alert('🎉 Module 2 voltooid! Module 3 is nu beschikbaar.'),300); }

function m2s0(c){
  c.innerHTML = `
<div class="s-badge">⚙️ Stap 1 van 11 · De motor achter AI</div>
<h2 class="ch2">Hoe werkt AI <em>écht</em> onder de motorkap?</h2>
<p class="cp">In Module 1 leerde je dat AI patronen herkent in data. Maar hóé doet het dat precies? In deze module ga je van simpele IF-THEN regels naar machine learning — en ga je vooral zelf aan de slag: met NotebookLM en met je eigen prompts.</p>
<p class="cp">Geen zorgen: je hoeft geen wiskundeknobbel te hebben. We houden het praktisch.</p>

<div class="ib warn">
  <div class="ib-t">🎯 Wat ga je leren?</div>
  <div class="ib-b">Het verschil tussen <strong>procedurele</strong> software (vaste regels) en <strong>machine learning</strong> (AI leert uit voorbeelden) — én hoe je zelf aan de slag gaat met AI-tools zoals NotebookLM en Copilot.</div>
</div>

<div class="nw">
  <button class="sr-btn g" onclick="n2()">Volgende: procedurele AI →</button>
  <span class="nh">Stap 1/11</span>
</div>`;
}

function m2s1(c){
  c.innerHTML = `
<div class="s-badge">🔧 Stap 2 van 11 · Procedurele AI</div>
<h2 class="ch2">Stap 1: <em>Procedurele</em> AI — vaste regels</h2>
<p class="cp">De oudste vorm van "slimme" software werkt met simpele <strong>IF-THEN regels</strong> (ALS...DAN...). Een programmeur schrijft exact op wat het systeem moet doen in elke situatie.</p>

<div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0; font-family: monospace; font-size: 13px; color: #333;">
  ALS temperatuur &lt; 0°C DAN toon "❄️ Kans op ijzel"<br>
  ALS batterij &lt; 20% DAN toon "🔋 Laag batterijniveau"<br>
  ALS e-mail bevat "GRATIS PRIJS WINNEN" DAN verplaats naar spam
</div>

<p class="cp">Dit werkt goed voor simpele, voorspelbare situaties. Maar het probleem: een programmeur moet <strong>elke mogelijke situatie apart voorzien</strong>. Wat als een spam-e-mail "GR4T1S PR1JS" schrijft in plaats van "GRATIS PRIJS"? Het systeem herkent het plots niet meer — het volgt enkel de exacte regel die er staat.</p>

<h3 class="ch3">🎮 Waar zie je dit vandaag nog?</h3>
<ul style="font-size: 13px; color: #3d4f8a; line-height: 1.8; padding-left: 20px;">
<li>Rekenmachine: 2+2 is altijd 4, vaste wiskundige regel</li>
<li>Verkeerslicht dat na X seconden altijd wisselt</li>
<li>Ouderwetse game-tegenstanders die altijd hetzelfde patroon volgen</li>
<li>Een thermostaat die bij een vaste temperatuur aan/uit slaat</li>
</ul>

<p class="cp">Dit is <strong>geen</strong> echte AI in de moderne zin — het "leert" niets, het volgt gewoon vaste code. Om echt te "leren" heb je de volgende stap nodig: machine learning.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="n2()">Volgende: machine learning →</button>
  <span class="nh">Stap 2/11</span>
</div>`;
}

function m2s2(c){
  c.innerHTML = `
<div class="s-badge">🧠 Stap 3 van 11 · Machine Learning</div>
<h2 class="ch2">Stap 2: <em>Machine Learning</em> — AI leert zelf</h2>
<p class="cp">In plaats van dat een programmeur alle regels schrijft, laat je het systeem zelf patronen ontdekken in data. Dit heet <strong>machine learning</strong> (ML) — letterlijk "machine-leren".</p>

<h3 class="ch3">📧 Voorbeeld: spam herkennen met ML</h3>
<div style="background: rgba(10,31,168,0.08); border-radius: 8px; padding: 16px; margin: 16px 0;">
<p style="font-size: 13px; color: #3d4f8a; line-height: 1.8; margin: 0;">
<strong>Stap 1:</strong> Je verzamelt 10.000 e-mails, elk gelabeld als "spam" of "geen spam".<br>
<strong>Stap 2:</strong> Het systeem zoekt zelf patronen: welke woorden komen vaker voor in spam? ("GRATIS", "WINNEN", "KLIK HIER")<br>
<strong>Stap 3:</strong> Het systeem bouwt een "model" — een soort formule die gewicht geeft aan bepaalde woorden of patronen.<br>
<strong>Stap 4:</strong> Bij een NIEUWE e-mail berekent het systeem: hoeveel lijkt dit op de spam-patronen die ik geleerd heb?
</p>
</div>

<p class="cp">Het grote verschil met procedurele AI: <strong>niemand heeft de exacte regel "GR4T1S = spam" ingevoerd</strong>. Het systeem heeft dat zelf afgeleid uit duizenden voorbeelden. Daardoor werkt het ook bij variaties die niemand vooraf bedacht.</p>

<h3 class="ch3">🎯 Drie soorten machine learning</h3>
<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin: 16px 0;">
<div style="background: white; border: 2px solid var(--blue); border-radius: 8px; padding: 12px;">
<div style="font-weight: 700; color: var(--blue); font-size: 11px; text-transform: uppercase; margin-bottom: 6px;">👁️ Supervised (begeleid)</div>
<p style="font-size: 11px; color: #3d4f8a; line-height: 1.6; margin: 0;">Je geeft gelabelde voorbeelden ("dit is een kat", "dit is een hond"). Het systeem leert het verschil.</p>
</div>
<div style="background: white; border: 2px solid var(--green); border-radius: 8px; padding: 12px;">
<div style="font-weight: 700; color: var(--green); font-size: 11px; text-transform: uppercase; margin-bottom: 6px;">🔍 Unsupervised</div>
<p style="font-size: 11px; color: #3d4f8a; line-height: 1.6; margin: 0;">Geen labels — het systeem zoekt zelf groepen/patronen in de data. Bijvoorbeeld: klantgroepen ontdekken.</p>
</div>
<div style="background: white; border: 2px solid var(--orange); border-radius: 8px; padding: 12px;">
<div style="font-weight: 700; color: var(--orange); font-size: 11px; text-transform: uppercase; margin-bottom: 6px;">🎮 Reinforcement</div>
<p style="font-size: 11px; color: #3d4f8a; line-height: 1.6; margin: 0;">Leren door vallen en opstaan, met beloning/straf. Zo leerde AI schaken en Go spelen.</p>
</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="n2()">Volgende: doe-opdracht →</button>
  <span class="nh">Stap 3/11</span>
</div>`;
}

function m2s3(c){
  c.innerHTML = `
<div class="s-badge">🧩 Stap 4 van 11 · Doe-opdracht</div>
<h2 class="ch2">Welke soort <em>machine learning</em> is dit?</h2>
<p class="cp">Klik op elk voorbeeld: is dit supervised, unsupervised, of reinforcement learning?</p>
<div id="mltype"></div>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="n2()">Volgende: van ML naar ChatGPT →</button>
  <span class="nh">Stap 4/11</span>
</div>`;
  renderMLTypeCards();
}

function m2s4(c){
  c.innerHTML = `
<div class="s-badge">🕸️ Stap 5 van 11 · Van machine learning naar ChatGPT</div>
<h2 class="ch2">Hoe raakt dit alles <em>ChatGPT</em>?</h2>
<p class="cp">ChatGPT en gelijkaardige tools zijn een heel geavanceerde vorm van machine learning, met een systeem dat een <strong>neuraal netwerk</strong> heet — losjes geïnspireerd op hoe je hersenen werken. Je hoeft de technische details niet te kennen; het belangrijkste om te onthouden is dit:</p>

<div style="background: rgba(127,224,0,0.12); border-radius: 8px; padding: 16px; margin: 16px 0;">
<p style="font-size: 13px; color: #3d4f8a; line-height: 1.8; margin: 0;">
<strong>ChatGPT heeft géén "begrip" zoals jij.</strong> Het heeft miljarden teksten gelezen tijdens zijn training, en daaruit geleerd welke woorden statistisch vaak na elkaar komen. Als jij een vraag stelt, "raadt" het systeem — heel goed onderbouwd, maar toch een gok — wat het beste volgende woord is. Woord na woord, tot een volledig antwoord ontstaat.
</p>
</div>

<p class="cp">Dat verklaart meteen waarom AI soms fouten maakt (het "raadt" fout) en waarom het altijd zelfverzekerd klinkt, ook als het fout zit (herinner je de hallucinaties uit Module 1!).</p>

<h3 class="ch3">💡 Waarom is dit nuttig om te weten?</h3>
<ul style="font-size: 13px; color: #3d4f8a; line-height: 1.8; padding-left: 20px;">
<li>Je begrijpt nu waarom je AI-antwoorden altijd moet controleren</li>
<li>Je begrijpt waarom een goede, duidelijke vraag (prompt) een beter antwoord oplevert — hoe duidelijker de vraag, hoe beter het systeem kan "raden" wat je bedoelt</li>
<li>Je begrijpt waarom AI soms "vergeet" wat je eerder in het gesprek zei — het kan maar een beperkte hoeveelheid tekst tegelijk "onthouden"</li>
</ul>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="n2()">Volgende: NotebookLM →</button>
  <span class="nh">Stap 5/11</span>
</div>`;
}

function m2s5(c){
  c.innerHTML = `
<div class="s-badge">📓 Stap 6 van 11 · NotebookLM ontdekken</div>
<h2 class="ch2">Google <em>NotebookLM</em>: jouw AI-studiehulp</h2>
<p class="cp">NotebookLM is een gratis AI-tool van Google die speciaal ontworpen is om je te helpen studeren. In tegenstelling tot ChatGPT baseert NotebookLM zich <strong>enkel op documenten die JIJ zelf uploadt</strong> — dus veel minder kans op hallucinaties, omdat het niet "uit het niets" antwoordt.</p>

<h3 class="ch3">📋 Stap voor stap: hoe gebruik je NotebookLM?</h3>
<div style="background: white; border-left: 4px solid var(--blue); border-radius: 8px; padding: 16px; margin: 16px 0;">
<p style="font-size: 13px; color: #3d4f8a; line-height: 2; margin: 0;">
<strong>Stap 1:</strong> Ga naar <strong>notebooklm.google.com</strong> en log in met een Google-account.<br>
<strong>Stap 2:</strong> Klik op "Nieuwe notebook" en geef die een naam (bijv. "Geschiedenis — Hoofdstuk 4").<br>
<strong>Stap 3:</strong> Upload je bronnen: een PDF van je cursus, je eigen nota's, een link naar een artikel, of zelfs een YouTube-video.<br>
<strong>Stap 4:</strong> NotebookLM leest alles en maakt automatisch een samenvatting.<br>
<strong>Stap 5:</strong> Stel vragen in de chat — bijvoorbeeld "Wat waren de 3 belangrijkste oorzaken van dit event volgens mijn cursus?" Het antwoord komt <strong>met bronvermelding</strong> naar de exacte pagina in je document!<br>
<strong>Stap 6:</strong> Gebruik de handige extra's: laat een studiegids, quizvragen, of zelfs een gesproken samenvatting (podcast) genereren van je cursus.
</p>
</div>

<div class="ib warn">
  <div class="ib-t">✅ Waarom is dit veiliger dan gewoon ChatGPT gebruiken?</div>
  <div class="ib-b">Omdat NotebookLM antwoordt op basis van JOUW geüploade bronnen (je cursus, je nota's), in plaats van "uit het geheugen" van het hele internet te antwoorden, is de kans op hallucinaties veel kleiner. Je krijgt bovendien telkens te zien uit welk stuk van je document het antwoord komt — heel handig om te controleren!</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="n2()">Volgende: probeer het zelf →</button>
  <span class="nh">Stap 6/11</span>
</div>`;
}

function m2s6(c){
  c.innerHTML = `
<div class="s-badge">🧪 Stap 7 van 11 · Doe-opdracht: aan de slag!</div>
<h2 class="ch2">Probeer het <em>zelf</em>: jouw eerste prompt</h2>
<p class="cp">Tijd om zelf te experimenteren! Open in een nieuw tabblad <strong>Copilot</strong> (met je schoolaccount), <strong>NotebookLM</strong>, of een andere toegestane AI-tool, en probeer onderstaande opdracht uit.</p>

<div class="ib warn">
  <div class="ib-t">⚠️ Vergeet dit niet!</div>
  <div class="ib-b">Vermeld <strong>altijd</strong> of je toestemming had om AI te gebruiken voor een bepaalde taak (zie het AI-label van je leerkracht, Module 5). Voor deze oefening mag je vrij experimenteren — maar train jezelf om dit elke keer opnieuw af te checken voor je AI gebruikt bij echt schoolwerk!</div>
</div>

<h3 class="ch3">🎯 De opdracht</h3>
<p class="cp">Kies één van deze twee taken en probeer ze uit in een AI-tool naar keuze:</p>
<ul style="font-size: 13px; color: #3d4f8a; line-height: 1.8; padding-left: 20px;">
<li><strong>Optie A:</strong> Laat AI een vak-onderwerp uitleggen dat je momenteel lastig vindt, in maximaal 5 zinnen, met een voorbeeld erbij.</li>
<li><strong>Optie B:</strong> Als je NotebookLM gebruikt: upload een korte tekst of je nota's, en stel er een vraag over.</li>
</ul>

<h3 class="ch3">✍️ Noteer hieronder wat er gebeurde</h3>
<p class="cp"><strong>Welke prompt (vraag/opdracht) heb je precies getypt?</strong></p>
<textarea class="sr-ta" id="promptused" style="min-height:70px;" placeholder="Ik typte precies: ..."></textarea>

<p class="cp" style="margin-top:16px;"><strong>Wat kwam eruit? Vat samen wat de AI antwoordde.</strong></p>
<textarea class="sr-ta" id="promptresult" style="min-height:70px;" placeholder="De AI antwoordde dat..."></textarea>

<p class="cp" style="margin-top:16px;"><strong>Was je tevreden met het antwoord? Waarom wel/niet?</strong></p>
<textarea class="sr-ta" id="promptsatisfied" style="min-height:70px;" placeholder="Ik was wel/niet tevreden omdat..."></textarea>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" id="promptbtn" onclick="sPromptExercise()">Volgende: training →</button>
  <span class="nh">Stap 7/11</span>
</div>`;
  const ta1 = document.getElementById('promptused');
  const ta2 = document.getElementById('promptresult');
  const ta3 = document.getElementById('promptsatisfied');
  ta1.value = localStorage.getItem('sr_l_prompt_used_m2') || '';
  ta2.value = localStorage.getItem('sr_l_prompt_result_m2') || '';
  ta3.value = localStorage.getItem('sr_l_prompt_satisfied_m2') || '';
  ta1.oninput = ()=>localStorage.setItem('sr_l_prompt_used_m2', ta1.value);
  ta2.oninput = ()=>localStorage.setItem('sr_l_prompt_result_m2', ta2.value);
  ta3.oninput = ()=>localStorage.setItem('sr_l_prompt_satisfied_m2', ta3.value);
}

function sPromptExercise(){
  const v1 = (document.getElementById('promptused').value||'').trim();
  const v2 = (document.getElementById('promptresult').value||'').trim();
  const v3 = (document.getElementById('promptsatisfied').value||'').trim();
  if(v1.length < 5 || v2.length < 5 || v3.length < 5){ alert('Vul alle 3 velden in — dit is een echte doe-opdracht, dus probeer het écht zelf uit!'); return; }
  n2();
}

function m2s7(c){
  c.innerHTML = `
<div class="s-badge">🏋️ Stap 8 van 11 · Hoe wordt een taalmodel getraind?</div>
<h2 class="ch2">Van ruw model tot <em>bruikbare chatbot</em></h2>
<p class="cp">Het bouwen van een model zoals ChatGPT gebeurt in een paar fases. Kort samengevat:</p>

<div style="background: white; border-left: 4px solid var(--blue); border-radius: 8px; padding: 16px; margin: 16px 0;">
<strong style="color: var(--blue); font-size: 12px; text-transform: uppercase;">Fase 1: Pre-training</strong>
<p style="font-size: 13px; color: #3d4f8a; margin-top: 8px; line-height: 1.7;">Het model leest een enorme hoeveelheid tekst van het internet en leert welk woord waarschijnlijk volgt op een ander. Dit duurt weken op duizenden supercomputers.</p>
</div>

<div style="background: white; border-left: 4px solid var(--green); border-radius: 8px; padding: 16px; margin: 16px 0;">
<strong style="color: var(--green); font-size: 12px; text-transform: uppercase;">Fase 2: Fine-tuning</strong>
<p style="font-size: 13px; color: #3d4f8a; margin-top: 8px; line-height: 1.7;">Mensen geven voorbeelden van goede vraag-antwoord-paren, zodat het model écht behulpzaam leert antwoorden op vragen.</p>
</div>

<div style="background: white; border-left: 4px solid var(--orange); border-radius: 8px; padding: 16px; margin: 16px 0;">
<strong style="color: var(--orange); font-size: 12px; text-transform: uppercase;">Fase 3: Menselijke feedback</strong>
<p style="font-size: 13px; color: #3d4f8a; margin-top: 8px; line-height: 1.7;">Mensen beoordelen welke van meerdere AI-antwoorden beter is. Het model leert hiervan om nuttige, veilige antwoorden te geven — en schadelijke verzoeken te weigeren.</p>
</div>

<p class="cp">Het trainen van zo'n model kost tientallen tot honderden miljoenen euro's aan rekenkracht. Dat is waarom slechts een handvol grote techbedrijven (OpenAI, Google, Meta, Anthropic) dit kunnen bouwen.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="n2()">Volgende: doe-opdracht →</button>
  <span class="nh">Stap 8/11</span>
</div>`;
}

function m2s8(c){
  c.innerHTML = `
<div class="s-badge">🧩 Stap 9 van 11 · Doe-opdracht</div>
<h2 class="ch2">Zet de <em>trainingsfases</em> in de juiste volgorde</h2>
<p class="cp">Klik de fases aan in de juiste volgorde: welke stap komt eerst bij het bouwen van een taalmodel?</p>
<div id="trainorder"></div>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="n2()">Volgende: kennischeck →</button>
  <span class="nh">Stap 9/11</span>
</div>`;
  renderTrainOrder();
}

function m2s9(c){
  const quiz = [
    {q: 'Wat is het grootste verschil tussen procedurele software en machine learning?', o: ['Procedurele software is altijd sneller.','Bij machine learning ontdekt het systeem zelf patronen uit data, in plaats van vaste regels te volgen.','Machine learning heeft geen computer nodig.','Er is geen verschil, het is hetzelfde.'], a: 1, f: 'Procedurele software volgt exact wat een programmeur schreef; ML-systemen leren patronen uit voorbeelden.' },
    {q: 'Waarom klinkt ChatGPT altijd zelfverzekerd, ook als het een fout antwoord geeft?', o: ['Omdat het speciaal geprogrammeerd is om arrogant te klinken.','Omdat het telkens het meest waarschijnlijke volgende woord "raadt", zonder een besef te hebben van goed of fout.','Omdat het altijd de waarheid checkt voor het antwoordt.','Dat klopt niet, ChatGPT twijfelt altijd zichtbaar.'], a: 1, f: 'Het model voorspelt op basis van kansberekening — het "weet" niet of iets waar is, het genereert enkel een plausibel antwoord.' },
    {q: 'Wat maakt NotebookLM anders (en vaak betrouwbaarder) dan gewoon ChatGPT?', o: ['NotebookLM is sneller.','NotebookLM baseert zijn antwoorden enkel op de documenten die jij zelf uploadt, met bronvermelding.','NotebookLM is gratis en ChatGPT niet.','Er is geen verschil.'], a: 1, f: 'Omdat het antwoordt op basis van jouw eigen bronnen (in plaats van het hele internet "uit het geheugen"), is de kans op hallucinaties veel kleiner.' },
    {q: 'Wat moet je ALTIJD doen voor je AI gebruikt bij een schooltaak?', o: ['Niets, AI mag altijd overal gebruikt worden.','Checken welk AI-label van toepassing is / of je toestemming hebt.','Enkel je ouders om toestemming vragen.','Wachten tot je leerkracht het zelf vraagt.'], a: 1, f: 'Transparantie en het AI-label checken is de basisregel — zie Module 5 voor de details.' },
    {q: 'Wat is RLHF (leren van menselijke feedback) en waarom is het belangrijk?', o: ['Een fout in het systeem die per ongeluk optreedt.','Een trainingsfase waarbij mensen AI-antwoorden beoordelen, zodat het model nuttiger en veiliger wordt.','Een manier om AI-modellen goedkoper te maken.','De allereerste stap van het hele trainingsproces.'], a: 1, f: 'RLHF traint het model op basis van menselijke voorkeuren tussen antwoorden — cruciaal voor bruikbaarheid en veiligheid.' }
  ];
  rQuiz(c, quiz, 2, 'mod2', n2, 60);
}

function m2s10(c){
  c.innerHTML = `
<div class="s-badge">✍️ Stap 11 van 11 · Jouw reflectie</div>
<h2 class="ch2">Wat vind <em>jij</em> hiervan?</h2>
<p class="cp">Je begrijpt nu hoe AI technisch in elkaar zit: van vaste regels, via machine learning, tot hoe ChatGPT antwoorden "raadt" — en je hebt zelf al geëxperimenteerd met een AI-tool!</p>

<h3 class="ch3">💭 Stellingen</h3>
<div id="stl-m2"></div>

<p class="cp">Noteer je reflectie: Wat vond je het meest verrassend aan hoe AI écht werkt? En hoe was het om zelf een prompt uit te proberen — ging het zoals verwacht?</p>
<textarea class="sr-ta" id="ref2" placeholder="Het meest verrassende vond ik... Toen ik zelf een prompt probeerde, merkte ik..."></textarea>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" id="ref2btn" onclick="sRef2()">✅ Module 2 afronden →</button>
  <span class="nh">Stap 11/11</span>
</div>`;
  const ta = document.getElementById('ref2');
  ta.value = localStorage.getItem('sr_l_ref2') || '';
  ta.oninput = ()=>localStorage.setItem('sr_l_ref2', ta.value);
  renderStellingenLeerling('stl-m2', 'l_m2', ['NotebookLM lijkt mij nuttiger om voor te studeren dan gewoon ChatGPT gebruiken.','Ik zou zelf vaker AI willen gebruiken om moeilijke onderwerpen uitgelegd te krijgen.']);
}

function sRef2(){
  const v = (document.getElementById('ref2').value||'').trim();
  if(v.length < 20){ alert('Vul eerst je reflectie in (minstens een paar zinnen).'); return; }
  n2();
}


/* ════════════════════════════════════════════
   MODULE 3 — GENERATIEVE AI (11 stappen)
   ════════════════════════════════════════════ */


const m3 = [m3s0, m3s1, m3s2, m3s3, m3s4, m3s5, m3s6, m3s7, m3s8, m3s9, m3s10, m3s11];

function rm3(){ const c=document.getElementById('m3c'); c.innerHTML=''; rDots(3,m3.length,S.mod3.step); m3[S.mod3.step](c); lockNextButtons(c); }
function n3(){ S.mod3.step++; ss(); S.mod3.step>=m3.length ? d3() : rm3(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); }
function p3(){ if(S.mod3.step > 0){ S.mod3.step--; ss(); rm3(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); } }
function d3(){ S.mod3.done=true; S.mod3.step=0; ss(); up(); rmc(); sv('home'); setTimeout(()=>alert('🎉 Module 3 voltooid! Module 4 is nu beschikbaar.'),300); }

function m3s0(c){
  c.innerHTML = `
<div class="s-badge">✨ Stap 1 van 12 · Welkom bij Generatieve AI</div>
<h2 class="ch2">ChatGPT, DALL-E & co: <em>Generatieve AI</em></h2>
<p class="cp">Je hebt vast al ChatGPT gebruikt, of AI-afbeeldingen gezien op Instagram/TikTok gemaakt met Midjourney of DALL-E. Dit alles heet <strong>generatieve AI</strong> (GenAI): AI die volledig nieuwe content maakt — tekst, beeld, muziek, video, code.</p>
<p class="cp">In deze module duik je dieper in: hoe maakt AI een tekst die nog nooit bestond? Hoe schrijf je een goede prompt? En je gaat er zelf mee aan de slag — twee keer zelfs!</p>

<div class="ib warn">
  <div class="ib-t">🎬 EDUbox: generatieve AI in de praktijk</div>
  <div class="ib-b">Aan de hand van "DJ ImAIne" — een AI-gegenereerde dj-act — toont een video verderop heel concreet wat generatieve AI vandaag al kan, ook buiten tekst.</div>
</div>

<div class="nw">
  <button class="sr-btn g" onclick="n3()">Volgende: hoe ChatGPT schrijft →</button>
  <span class="nh">Stap 1/12</span>
</div>`;
}

function m3s1(c){
  c.innerHTML = `
<div class="s-badge">📝 Stap 2 van 12 · Hoe ChatGPT tekst genereert</div>
<h2 class="ch2">Woord voor woord: hoe ChatGPT <em>schrijft</em></h2>
<p class="cp">Wanneer je ChatGPT een vraag stelt, "denkt" het niet zoals jij. Het genereert het antwoord <strong>één token (woordstukje) tegelijk</strong>, en kiest telkens het meest waarschijnlijke volgende stukje tekst — gebaseerd op alles wat het geleerd heeft uit miljarden teksten.</p>

<div style="background: rgba(10,31,168,0.08); border-radius: 8px; padding: 16px; margin: 16px 0;">
<p style="font-size: 13px; color: #3d4f8a; line-height: 1.8; margin: 0;">
<strong>Jij typt:</strong> "Schrijf een gedicht over de zee"<br>
<strong>AI genereert:</strong> "De" → "De zee" → "De zee is" → "De zee is blauw" → "De zee is blauw en" → ...<br><br>
Bij élke stap berekent het model kansen voor duizenden mogelijke volgende woorden, en kiest (meestal) het meest waarschijnlijke — soms met een beetje willekeur voor variatie.
</p>
</div>

<h3 class="ch3">🖼️ En hoe maakt AI dan afbeeldingen?</h3>
<p class="cp">Beeld-AI zoals DALL-E of Midjourney werkt anders, met een techniek genaamd <strong>diffusion</strong>: het systeem start met willekeurige "ruis" (zoals tv-sneeuw) en "ontruist" dit stap voor stap richting een afbeelding die bij jouw tekst-beschrijving past. Dit gebeurt in tientallen stappen, elke stap iets duidelijker.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: video →</button>
  <span class="nh">Stap 2/12</span>
</div>`;
}

function m3s2(c){
  c.innerHTML = `
<div class="s-badge">🎬 Stap 3 van 12 · GenAI in de praktijk</div>
<h2 class="ch2">Bekijk: <em>DJ ImAIne</em></h2>
<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/UD0a-i2EBdE" allowfullscreen loading="lazy" title="EDUbox Artificiële Intelligentie — MNM DJ ImAIne"></iframe></div>
<div class="ib warn">
  <div class="ib-t">📝 Samenvatting</div>
  <div class="ib-b">Aan de hand van "DJ ImAIne" — een volledig AI-gegenereerde dj-act — toont deze video heel concreet wat generatieve AI vandaag al kan in de muziekwereld. Niet langer enkel tekst, maar ook audio en complete creatieve content die overtuigend "echt" klinkt.</div>
</div>

<h3 class="ch3">🎨 Waar wordt generatieve AI vandaag al voor gebruikt?</h3>
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0;">
<div style="background: white; border-left: 4px solid var(--blue); border-radius: 8px; padding: 12px;">
<strong style="color: var(--blue); font-size: 12px;">📝 Tekst</strong>
<p style="font-size: 12px; color: #3d4f8a; margin-top: 6px;">Verhalen, samenvattingen, code, vertalingen, e-mails</p>
</div>
<div style="background: white; border-left: 4px solid var(--green); border-radius: 8px; padding: 12px;">
<strong style="color: var(--green); font-size: 12px;">🖼️ Beeld</strong>
<p style="font-size: 12px; color: #3d4f8a; margin-top: 6px;">Illustraties, logo's, foto-realistische beelden, kunst</p>
</div>
<div style="background: white; border-left: 4px solid var(--orange); border-radius: 8px; padding: 12px;">
<strong style="color: var(--orange); font-size: 12px;">🎵 Audio</strong>
<p style="font-size: 12px; color: #3d4f8a; margin-top: 6px;">Muziek, stemmen nabootsen, podcasts, geluidseffecten</p>
</div>
<div style="background: white; border-left: 4px solid #9C27B0; border-radius: 8px; padding: 12px;">
<strong style="color: #9C27B0; font-size: 12px;">🎬 Video</strong>
<p style="font-size: 12px; color: #3d4f8a; margin-top: 6px;">Korte clips, animaties, zelfs volledig AI-gegenereerde acteurs</p>
</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: prompting →</button>
  <span class="nh">Stap 3/12</span>
</div>`;
}

function m3s3(c){
  c.innerHTML = `
<div class="s-badge">💬 Stap 4 van 12 · De kunst van prompting</div>
<h2 class="ch2">Prompting: hoe vraag je het <em>goed</em>?</h2>
<p class="cp">Een "prompt" is gewoon je vraag of opdracht aan AI. Maar de kwaliteit van het antwoord hangt sterk af van hoe goed je die prompt schrijft. Dit heet <strong>prompt engineering</strong> — en het is een vaardigheid die je kan trainen.</p>

<div style="background: #fff3e0; padding: 14px; border-radius: 6px; margin: 16px 0;">
  <strong>❌ Zwakke prompt:</strong> "Schrijf iets over de Franse Revolutie"<br><br>
  <strong>✅ Sterke prompt:</strong> "Leg de 3 belangrijkste oorzaken van de Franse Revolutie uit in maximaal 150 woorden, voor een leerling van het 4de middelbaar. Gebruik geen moeilijk vakjargon en geef bij elke oorzaak één concreet voorbeeld."
</div>

<h3 class="ch3">🔑 5 Bouwstenen van een goede prompt</h3>
<div style="background: rgba(10,31,168,0.08); border-radius: 8px; padding: 16px; margin: 16px 0;">
<p style="font-size: 13px; color: #3d4f8a; line-height: 1.9; margin: 0;">
<strong>1. Rol:</strong> "Doe alsof je een geschiedenisleerkracht bent..."<br>
<strong>2. Doel:</strong> "Leg uit / vat samen / maak een schema van..."<br>
<strong>3. Context:</strong> "Voor een leerling van het 3de middelbaar die net begint met dit onderwerp..."<br>
<strong>4. Bron/beperking:</strong> "Baseer je enkel op wat algemeen bekend is, geen speculatie..."<br>
<strong>5. Vorm:</strong> "Maximaal 150 woorden, met 3 bullet points..."
</p>
</div>

<h3 class="ch3">🧩 Andere handige technieken</h3>
<ul style="font-size: 13px; color: #3d4f8a; line-height: 1.8; padding-left: 20px;">
<li><strong>Voorbeelden geven:</strong> "Schrijf in deze stijl: [voorbeeld]" werkt vaak beter dan enkel beschrijven</li>
<li><strong>Stap voor stap laten denken:</strong> "Leg eerst uit wat X is, dan waarom het belangrijk is, dan een voorbeeld" geeft gestructureerdere antwoorden</li>
<li><strong>Doorvragen:</strong> Niet tevreden met het eerste antwoord? Vraag: "Kan dit korter?" of "Geef een ander voorbeeld"</li>
<li><strong>Rol laten aannemen:</strong> "Doe alsof je een 12-jarige uitlegt" geeft simpelere taal</li>
</ul>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: probeer het zelf →</button>
  <span class="nh">Stap 4/12</span>
</div>`;
}

function m3s4(c){
  c.innerHTML = `
<div class="s-badge">🧪 Stap 5 van 12 · Doe-opdracht: schrijf zelf een prompt</div>
<h2 class="ch2">Aan de slag: <em>jouw eigen prompt</em></h2>
<p class="cp">Nu jij! Open een toegestane AI-tool (Copilot, ChatGPT, ...) in een nieuw tabblad en gebruik de 5 bouwstenen van de vorige stap om zelf een goede prompt te schrijven.</p>

<div class="ib warn">
  <div class="ib-t">⚠️ Vergeet dit niet!</div>
  <div class="ib-b">Check altijd eerst of je AI mag gebruiken voor de taak die je uitvoert (het AI-label van je leerkracht, zie Module 5). Voor deze les-oefening mag je vrij oefenen — maar vermeld dit steeds bij echt schoolwerk!</div>
</div>

<h3 class="ch3">🎯 De opdracht</h3>
<p class="cp">Kies een onderwerp (van school of iets dat je interesseert) en schrijf een prompt met minstens <strong>3 van de 5 bouwstenen</strong> (rol, doel, context, bron/beperking, vorm). Probeer hem uit in je AI-tool.</p>

<h3 class="ch3">✍️ Noteer hieronder wat er gebeurde</h3>
<p class="cp"><strong>Welke prompt heb je precies geschreven?</strong></p>
<textarea class="sr-ta" id="promptused3" style="min-height:80px;" placeholder="Mijn prompt was: ..."></textarea>

<p class="cp" style="margin-top:16px;"><strong>Welke bouwstenen gebruikte je? (rol / doel / context / bron / vorm)</strong></p>
<textarea class="sr-ta" id="promptblocks3" style="min-height:50px;" placeholder="Ik gebruikte: doel, context en vorm..."></textarea>

<p class="cp" style="margin-top:16px;"><strong>Wat kwam eruit, en was je tevreden? Zou je de prompt nog aanpassen?</strong></p>
<textarea class="sr-ta" id="promptresult3" style="min-height:80px;" placeholder="De AI antwoordde... Ik was wel/niet tevreden omdat... Volgende keer zou ik..."></textarea>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" id="prompt3btn" onclick="sPromptExercise3()">Volgende: herken de betere prompt →</button>
  <span class="nh">Stap 5/12</span>
</div>`;
  const ta1 = document.getElementById('promptused3');
  const ta2 = document.getElementById('promptblocks3');
  const ta3 = document.getElementById('promptresult3');
  ta1.value = localStorage.getItem('sr_l_prompt_used_m3') || '';
  ta2.value = localStorage.getItem('sr_l_prompt_blocks_m3') || '';
  ta3.value = localStorage.getItem('sr_l_prompt_result_m3') || '';
  ta1.oninput = ()=>localStorage.setItem('sr_l_prompt_used_m3', ta1.value);
  ta2.oninput = ()=>localStorage.setItem('sr_l_prompt_blocks_m3', ta2.value);
  ta3.oninput = ()=>localStorage.setItem('sr_l_prompt_result_m3', ta3.value);
}

function sPromptExercise3(){
  const v1 = (document.getElementById('promptused3').value||'').trim();
  const v2 = (document.getElementById('promptblocks3').value||'').trim();
  const v3 = (document.getElementById('promptresult3').value||'').trim();
  if(v1.length < 5 || v2.length < 3 || v3.length < 5){ alert('Vul alle 3 velden in — probeer het écht zelf uit voor je verdergaat!'); return; }
  n3();
}

function m3s5(c){
  c.innerHTML = `
<div class="s-badge">🧩 Stap 6 van 12 · Doe-opdracht</div>
<h2 class="ch2">Herken de <em>betere prompt</em></h2>
<p class="cp">Bij elk paar prompts: welke zou een beter, bruikbaarder antwoord opleveren? Klik je keuze aan.</p>
<div id="promptcompare"></div>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: risico's →</button>
  <span class="nh">Stap 6/12</span>
</div>`;
  renderPromptCompareLeerling();
}

function m3s6(c){
  c.innerHTML = `
<div class="s-badge">⚠️ Stap 7 van 12 · Risico's van Generatieve AI</div>
<h2 class="ch2">De <em>keerzijde</em> van generatieve AI</h2>
<p class="cp">Generatieve AI is krachtig, maar brengt specifieke risico's met zich mee die je moet kennen — zeker als je het voor schoolwerk gebruikt.</p>

<div style="background: #ffe6e6; padding: 14px; border-radius: 6px; margin: 12px 0;">
  <strong>⚠️ Hallucinaties (herhaling uit Module 1):</strong> AI verzint overtuigend klinkende maar foute feiten, bronnen of citaten.
</div>
<div style="background: #ffe6e6; padding: 14px; border-radius: 6px; margin: 12px 0;">
  <strong>⚠️ Plagiaat:</strong> AI is getraind op miljarden teksten van internet. Soms herhaalt het (delen van) bestaande teksten bijna letterlijk, zonder bronvermelding.
</div>
<div style="background: #ffe6e6; padding: 14px; border-radius: 6px; margin: 12px 0;">
  <strong>⚠️ Bias:</strong> Als trainingsdata vooroordelen bevat, herhaalt en versterkt de AI die (zie Module 1 & 4).
</div>
<div style="background: #ffe6e6; padding: 14px; border-radius: 6px; margin: 12px 0;">
  <strong>⚠️ Auteursrecht:</strong> AI-beelden worden getraind op bestaande kunstwerken en foto's — vaak zonder toestemming van de originele makers. Dit is een groot juridisch debatpunt.
</div>
<div style="background: #ffe6e6; padding: 14px; border-radius: 6px; margin: 12px 0;">
  <strong>⚠️ Verlies aan eigen vaardigheid:</strong> Als je AI altijd voor je laat schrijven, oefen je zelf minder met schrijven, formuleren en structureren.
</div>

<h3 class="ch3">🎨 DALL-E, Midjourney: wie is de "kunstenaar"?</h3>
<div class="disc-card">
  <div class="disc-q">AI-beeldgeneratie roept een interessante vraag op: als AI een afbeelding "nieuw" maakt, maar het geleerd heeft van duizenden bestaande kunstwerken — is dat dan echt kunst? En van wie?</div>
  <div class="disc-a">Er is geen eenduidig antwoord. Sommigen zien de mens die de prompt schrijft als de "kunstenaar" (net zoals een fotograaf de camera niet zelf bouwde). Anderen vinden dat AI-kunst oneerlijk leunt op het werk van echte kunstenaars zonder compensatie. Dit debat is nog volop bezig.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: een echt voorbeeld →</button>
  <span class="nh">Stap 7/12</span>
</div>`;
}

function m3s7(c){
  c.innerHTML = `
<div class="s-badge">🔍 Stap 8 van 12 · Een echt voorbeeld bekijken</div>
<h2 class="ch2">Hoe herken je <em>AI-gegenereerde content</em>?</h2>
<p class="cp">Met de toename van AI-content op sociale media wordt het steeds belangrijker om kritisch te kijken naar wat je online ziet. Bekijk eerst dit <strong>echte voorbeeld</strong> van AI-gegenereerde tekst, zodat je weet waar je op moet letten.</p>

<div style="background: white; border: 2px dashed var(--blue); border-radius: 8px; padding: 18px; margin: 16px 0;">
  <div style="font-size:11px;font-weight:700;color:var(--blue);text-transform:uppercase;margin-bottom:10px;">📄 Voorbeeld — prompt: "Leg uit hoe bijen honing maken, voor een leerling van het 2de middelbaar"</div>
  <p style="font-size:13px;color:#333;line-height:1.8;font-style:italic;margin:0;">
  "Bijen maken honing via een fascinerend proces dat begint bij het verzamelen van nectar. Bovendien speelt de bijenmaag hierbij een cruciale rol: enzymen zetten de suikers in de nectar om. Daarnaast brengen werkbijen de nectar terug naar de korf, waar ze die doorgeven aan andere bijen via mondopening tot mondopening. Vervolgens wordt het vocht in honingraten opgeslagen en door het wapperen met vleugels ingedikt. Kortom, honing is het resultaat van een nauwkeurig samenspel tussen verzamelen, verwerken en indikken."
  </p>
</div>

<h3 class="ch3">🔍 Wat valt op in dit voorbeeld?</h3>
<ul style="font-size: 13px; color: #3d4f8a; line-height: 1.8; padding-left: 20px;">
<li>De overgangswoorden <strong>"Bovendien", "Daarnaast", "Vervolgens", "Kortom"</strong> — typisch AI-patroon om alles netjes te structureren</li>
<li>Elke zin heeft ongeveer dezelfde lengte en opbouw — erg "glad", weinig natuurlijke variatie</li>
<li>Geen persoonlijke stem, geen "ik vond het gek toen ik ontdekte dat..." — puur feitelijk en afstandelijk</li>
<li>Inhoudelijk klopt het wel — AI-tekst is niet per se fout, enkel herkenbaar in <em>stijl</em></li>
</ul>

<h3 class="ch3">🔍 Andere signalen om op te letten</h3>
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0;">
<div style="background: white; border-left: 4px solid var(--blue); border-radius: 8px; padding: 12px;">
<strong style="color: var(--blue); font-size: 12px;">📝 Bij tekst</strong>
<p style="font-size: 12px; color: #3d4f8a; margin-top: 6px;">Veel opsommingen zelfs waar niet nodig, feiten zonder bronvermelding, té perfecte grammatica</p>
</div>
<div style="background: white; border-left: 4px solid var(--orange); border-radius: 8px; padding: 12px;">
<strong style="color: var(--orange); font-size: 12px;">🖼️ Bij afbeeldingen</strong>
<p style="font-size: 12px; color: #3d4f8a; margin-top: 6px;">Handen met verkeerd aantal vingers, onleesbare tekst in beeld, vreemde achtergronddetails</p>
</div>
</div>

<div class="ib warn">
  <div class="ib-t">💡 De beste tip</div>
  <div class="ib-b">Vertrouw niet enkel op deze signalen — AI wordt steeds beter en moeilijker te onderscheiden. De beste aanpak blijft: check de bron. Wie deelde dit? Is het een betrouwbaar account/media? Kan je hetzelfde nieuws op andere, betrouwbare plekken bevestigen?</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: doe-opdracht →</button>
  <span class="nh">Stap 8/12</span>
</div>`;
}

function m3s8(c){
  c.innerHTML = `
<div class="s-badge">🧩 Stap 9 van 12 · Doe-opdracht</div>
<h2 class="ch2">Echt of <em>AI-gegenereerd</em>?</h2>
<p class="cp">Bekijk elke beschrijving en beslis: is dit waarschijnlijk een teken van AI-gegenereerde content, of niet?</p>
<div id="airealcheck"></div>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: discussie →</button>
  <span class="nh">Stap 9/12</span>
</div>`;
  renderAIRealCheck();
}

function m3s9(c){
  c.innerHTML = `
<div class="s-badge">💬 Stap 10 van 12 · Discussie</div>
<h2 class="ch2">Waar ligt <em>de grens</em>?</h2>
<div class="disc-card">
  <div class="disc-q">1. Je gebruikt AI om ideeën te brainstormen voor een opstel, maar schrijft de tekst zelf. Is dat "vals spelen"?</div>
  <div class="disc-a">De meeste scholen (incl. Sint-Rembert, zie Module 5) zien dit als toegestaan zolang het duidelijk is aangegeven welk AI-label van toepassing is. Brainstormen is een hulpmiddel, geen vervanging van je eigen werk.</div>
</div>
<div class="disc-card">
  <div class="disc-q">2. Een muzikant gebruikt AI om een melodie te componeren, maar schrijft zelf de teksten. Is dit nog "zijn" muziek?</div>
  <div class="disc-a">Er is geen eenduidig antwoord — dit is precies het soort vraag waar de muziekindustrie vandaag mee worstelt. Veel artiesten zien AI als een instrument, zoals een synthesizer, terwijl anderen het gevoel hebben dat het creatieve proces wordt uitgehold.</div>
</div>
<div class="disc-card">
  <div class="disc-q">3. Zou jij een AI-gegenereerd kunstwerk kopen voor dezelfde prijs als een door een mens gemaakt kunstwerk?</div>
  <div class="disc-a">Dit is een persoonlijke afweging. Sommigen hechten waarde aan het menselijke verhaal en de tijd erachter; anderen kijken enkel naar het eindresultaat.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: kennischeck →</button>
  <span class="nh">Stap 10/12</span>
</div>`;
}

function m3s10(c){
  const quiz = [
    {q: 'Hoe genereert ChatGPT een antwoord?', o: ['Het zoekt live op internet en kopieert het beste resultaat.','Het genereert token voor token, gebaseerd op wat statistisch waarschijnlijk is.','Een team van mensen typt live de antwoorden.','Het gebruikt altijd exact dezelfde vaste antwoorden.'], a: 1, f: 'Het model voorspelt telkens het volgende token op basis van kansberekening uit zijn training.' },
    {q: 'Wat is "prompt engineering"?', o: ['Het programmeren van een AI-model vanaf nul.','De vaardigheid om goede, doeltreffende vragen/opdrachten aan AI te formuleren.','Het repareren van AI-software.','Een technisch beroep in de bouwsector.'], a: 1, f: 'Een goed geformuleerde prompt (met rol, doel, context, vorm) geeft veel betere resultaten.' },
    {q: 'Waarom is auteursrecht een discussiepunt bij AI-beeldgeneratie?', o: ['Omdat AI-beelden altijd illegaal zijn.','Omdat AI-modellen getraind zijn op bestaand werk van kunstenaars, vaak zonder hun toestemming.','Omdat AI-beelden nooit gebruikt mogen worden.','Omdat er geen discussie is, iedereen is het erover eens.'], a: 1, f: 'De vraag of trainen op auteursrechtelijk beschermd werk toegestaan is (zonder toestemming/betaling), is een actueel juridisch debat.' },
    {q: 'In het voorbeeld-tekstje over bijen dat je bekeek, wat was een herkenbaar AI-signaal?', o: ['De tekst bevatte veel spelfouten.','Het herhaaldelijk gebruik van overgangswoorden zoals "Bovendien", "Daarnaast", "Kortom".','De tekst was te kort.','Er stond een emoji in.'], a: 1, f: 'Dit soort overgangswoorden en een erg "gladde", gestructureerde stijl zijn typische AI-kenmerken.' },
    {q: 'Wat is de beste manier om te controleren of iets online echt is?', o: ['Vertrouwen op je gevoel.','De bron checken en vergelijken met andere betrouwbare bronnen.','Altijd geloven wat veel likes heeft.','Nooit iets controleren, dat kost te veel tijd.'], a: 1, f: 'Bronkritiek — wie deelt dit, waarom, en kan je het elders bevestigen — blijft de meest betrouwbare methode.' }
  ];
  rQuiz(c, quiz, 3, 'mod3', n3, 60);
}

function m3s11(c){
  c.innerHTML = `
<div class="s-badge">✍️ Stap 12 van 12 · Jouw reflectie</div>
<h2 class="ch2">Generatieve AI in <em>jouw leven</em></h2>
<p class="cp">Je begrijpt nu hoe ChatGPT en DALL-E werken, hoe je goede prompts schrijft (en hebt dit 2 keer zelf uitgeprobeerd!), en welke risico's erbij horen.</p>

<h3 class="ch3">💭 Stellingen</h3>
<div id="stl-m3"></div>

<p class="cp">Noteer je reflectie: Voor welke taak zou jij generatieve AI het liefst gebruiken (school of vrije tijd)? En wat vind je van de discussie rond AI-kunst en auteursrecht?</p>
<textarea class="sr-ta" id="ref3" placeholder="Ik zou generatieve AI gebruiken voor... Over AI-kunst en auteursrecht denk ik..."></textarea>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" id="ref3btn" onclick="sRef3()">✅ Module 3 afronden →</button>
  <span class="nh">Stap 12/12</span>
</div>`;
  const ta = document.getElementById('ref3');
  ta.value = localStorage.getItem('sr_l_ref3') || '';
  ta.oninput = ()=>localStorage.setItem('sr_l_ref3', ta.value);
  renderStellingenLeerling('stl-m3', 'l_m3', ['Few-shot prompting (voorbeelden meegeven) gaat mij echt tijd besparen bij schoolwerk.','AI-gegenereerde kunst zou dezelfde waarde moeten hebben als door mensen gemaakte kunst.']);
}

function sRef3(){
  const v = (document.getElementById('ref3').value||'').trim();
  if(v.length < 20){ alert('Vul eerst je reflectie in (minstens een paar zinnen).'); return; }
  n3();
}


/* ════════════════════════════════════════════
   MODULE 4 — ETHIEK & BIAS (10 stappen)
   ════════════════════════════════════════════ */

const m4 = [m4s0, m4s1, m4s2, m4s3, m4s4, m4s5, m4s6, m4s7, m4s8, m4s9];

function rm4(){ const c=document.getElementById('m4c'); c.innerHTML=''; rDots(4,m4.length,S.mod4.step); m4[S.mod4.step](c); lockNextButtons(c); }
function n4(){ S.mod4.step++; ss(); S.mod4.step>=m4.length ? d4() : rm4(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); }
function p4(){ if(S.mod4.step > 0){ S.mod4.step--; ss(); rm4(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); } }
function d4(){ S.mod4.done=true; S.mod4.step=0; ss(); up(); rmc(); sv('home'); setTimeout(()=>alert('🎉 Module 4 voltooid! Module 5 is nu beschikbaar.'),300); }

function m4s0(c){
  c.innerHTML = `
<div class="s-badge">⚠️ Stap 1 van 10 · De donkere kant van AI</div>
<h2 class="ch2">Ethiek, Bias & <em>Problemen</em></h2>
<p class="cp">AI is fantastisch, maar niet alles is rozengeur en maneschijn. In deze module ga je dieper in op de échte problemen: discriminatie, nepvideo's, privacy-schendingen en het milieu. Dit is geen reden om AI te vermijden — wel om het <strong>kritisch en bewust</strong> te gebruiken.</p>

<div class="ib warn">
  <div class="ib-t">🎯 Waarom is dit belangrijk?</div>
  <div class="ib-b">Hoe meer AI een rol speelt in ons leven (sollicitaties, nieuws, sociale media), hoe belangrijker het is dat jij als toekomstige burger weet waar de risico's zitten — en hoe je jezelf en anderen kan beschermen.</div>
</div>

<div class="nw">
  <button class="sr-btn g" onclick="n4()">Volgende: bias →</button>
  <span class="nh">Stap 1/10</span>
</div>`;
}

function m4s1(c){
  c.innerHTML = `
<div class="s-badge">⚖️ Stap 2 van 10 · Bias: AI discrimineert</div>
<h2 class="ch2">Wanneer AI <em>discrimineert</em> zonder het te "willen"</h2>
<p class="cp">AI heeft geen eigen mening of vooroordelen — maar het <strong>leert wél uit data die mensen maakten</strong>, en die data zit vol menselijke vooroordelen. Zo kan AI discriminatie overnemen en zelfs versterken, zonder dat iemand dat bewust bedoelde.</p>

<h3 class="ch3">💼 Beroemd voorbeeld: Amazon's CV-sorteersysteem</h3>
<div style="background: rgba(255,193,7,0.12); border-radius: 8px; padding: 16px; margin: 16px 0;">
<p style="font-size: 13px; color: #3d4f8a; line-height: 1.8; margin: 0;">
Amazon bouwde in 2014-2018 een AI-tool om CV's automatisch te sorteren voor technische functies. Het probleem: het systeem werd getraind op 10 jaar aan CV's van vorige sollicitanten — vooral mannen, omdat de techsector historisch mannelijker was.<br><br>
<strong>Resultaat:</strong> Het systeem leerde dat "man" een positief kenmerk was, en gaf CV's met het woord "vrouwen" (bijvoorbeeld "vrouwenschaakclub") automatisch een lagere score. Amazon ontdekte dit en <strong>schafte het systeem af</strong> voor het op grote schaal gebruikt werd.
</p>
</div>

<h3 class="ch3">🎯 Hoe ontstaat bias precies?</h3>
<ol style="font-size: 13px; color: #3d4f8a; line-height: 1.8; padding-left: 20px;">
<li><strong>Vooringenomen data:</strong> Als de trainingsdata een groep ondervertegenwoordigt of stereotypeert, leert het model dat over</li>
<li><strong>Historische ongelijkheid:</strong> Data uit het verleden bevat vaak de ongelijkheden van dat verleden</li>
<li><strong>Wie bouwt het:</strong> Ontwikkelaarsteams die niet divers zijn, missen soms blinde vlekken in hun testen</li>
</ol>

<div class="nw">
  <button class="sr-btn b" onclick="p4()">← Vorige</button>
  <button class="sr-btn g" onclick="n4()">Volgende: doe-opdracht →</button>
  <span class="nh">Stap 2/10</span>
</div>`;
}

function m4s2(c){
  c.innerHTML = `
<div class="s-badge">🧩 Stap 3 van 10 · Doe-opdracht</div>
<h2 class="ch2">Herken de <em>bias</em></h2>
<p class="cp">Bekijk elk scenario en beslis: is hier sprake van mogelijke bias in het AI-systeem?</p>
<div id="biascheck"></div>

<div class="nw">
  <button class="sr-btn b" onclick="p4()">← Vorige</button>
  <button class="sr-btn g" onclick="n4()">Volgende: deepfakes →</button>
  <span class="nh">Stap 3/10</span>
</div>`;
  renderBiasCheck();
}

function m4s3(c){
  c.innerHTML = `
<div class="s-badge">🎭 Stap 4 van 10 · Deepfakes</div>
<h2 class="ch2">Deepfakes: wanneer <em>zien niet meer geloven is</em></h2>
<p class="cp">Een <strong>deepfake</strong> is een AI-gegenereerde nep-video, -foto of -audio waarin iemands gezicht, lichaam of stem overtuigend wordt nagebootst — vaak om iets te laten zien dat nooit is gebeurd.</p>

<h3 class="ch3">😱 Waarom is dit zo gevaarlijk?</h3>
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0;">
<div style="background: white; border-left: 4px solid var(--red); border-radius: 8px; padding: 12px;">
<strong style="color: var(--red); font-size: 12px; text-transform: uppercase;">📰 Desinformatie</strong>
<p style="font-size: 12px; color: #3d4f8a; margin-top: 6px;">Politici "citeren" in video's die ze nooit hebben opgenomen — kan verkiezingen en publieke opinie beïnvloeden.</p>
</div>
<div style="background: white; border-left: 4px solid var(--red); border-radius: 8px; padding: 12px;">
<strong style="color: var(--red); font-size: 12px; text-transform: uppercase;">😢 Pesten & wraakporno</strong>
<p style="font-size: 12px; color: #3d4f8a; margin-top: 6px;">Deepfakes worden helaas ook gebruikt om medeleerlingen te vernederen — dit is illegaal en schadelijk.</p>
</div>
<div style="background: white; border-left: 4px solid var(--red); border-radius: 8px; padding: 12px;">
<strong style="color: var(--red); font-size: 12px; text-transform: uppercase;">💰 Oplichting</strong>
<p style="font-size: 12px; color: #3d4f8a; margin-top: 6px;">Nagemaakte stemmen van familieleden worden gebruikt om mensen geld te laten overmaken ("Hallo mama, ik zit in de problemen...")</p>
</div>
<div style="background: white; border-left: 4px solid var(--red); border-radius: 8px; padding: 12px;">
<strong style="color: var(--red); font-size: 12px; text-transform: uppercase;">🎭 Identiteitsdiefstal</strong>
<p style="font-size: 12px; color: #3d4f8a; margin-top: 6px;">Iemands gezicht/stem gebruiken zonder toestemming voor reclame, video's of oplichting.</p>
</div>
</div>

<div class="ib warn">
  <div class="ib-t">⚖️ Is dit strafbaar?</div>
  <div class="ib-b">Ja. Het maken en verspreiden van deepfakes zonder toestemming — zeker met seksuele of vernederende inhoud, of om iemand te bedriegen — is in België strafbaar. Als je hiermee te maken krijgt (als slachtoffer of getuige), meld dit bij een vertrouwenspersoon op school of de politie.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p4()">← Vorige</button>
  <button class="sr-btn g" onclick="n4()">Volgende: herkennen →</button>
  <span class="nh">Stap 4/10</span>
</div>`;
}

function m4s4(c){
  c.innerHTML = `
<div class="s-badge">🔍 Stap 5 van 10 · Deepfakes herkennen</div>
<h2 class="ch2">Hoe herken je een <em>deepfake</em>?</h2>
<p class="cp">Deepfakes worden steeds beter en moeilijker te herkennen met het blote oog. Toch zijn er signalen om op te letten:</p>

<h3 class="ch3">👀 Visuele signalen (video/foto)</h3>
<ul style="font-size: 13px; color: #3d4f8a; line-height: 1.8; padding-left: 20px;">
<li>Onnatuurlijk knipperen (te veel of te weinig) met de ogen</li>
<li>Vreemde overgangen bij de rand van het gezicht/haar</li>
<li>Verlichting op het gezicht die niet klopt met de rest van de scène</li>
<li>Lipbewegingen die niet helemaal synchroon lopen met het geluid</li>
<li>Vreemde, onnatuurlijke huidtextuur (té glad of té ruw)</li>
</ul>

<h3 class="ch3">🔊 Audio-signalen</h3>
<ul style="font-size: 13px; color: #3d4f8a; line-height: 1.8; padding-left: 20px;">
<li>Robotachtige of onnatuurlijke intonatie</li>
<li>Vreemde pauzes op ongebruikelijke plekken</li>
<li>Achtergrondgeluid dat ontbreekt of niet past bij de setting</li>
</ul>

<div class="ib warn">
  <div class="ib-t">✅ De gouden regel</div>
  <div class="ib-b">Twijfel je? Check de bron. Komt deze video van een officieel, geverifieerd account? Wordt hetzelfde nieuws ook gemeld door betrouwbare media (VRT, De Standaard, etc.)? Als een schokkend filmpje enkel op één anoniem account staat, wees extra voorzichtig voor je het deelt.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p4()">← Vorige</button>
  <button class="sr-btn g" onclick="n4()">Volgende: privacy →</button>
  <span class="nh">Stap 5/10</span>
</div>`;
}

function m4s5(c){
  c.innerHTML = `
<div class="s-badge">🔐 Stap 6 van 10 · Privacy & jouw data</div>
<h2 class="ch2">Wat gebeurt er met wat <em>jij</em> intypt?</h2>
<p class="cp">Wanneer je iets typt in ChatGPT of een andere AI-tool, verdwijnt dat niet zomaar. Het is belangrijk te weten wat er met je gegevens gebeurt.</p>

<h3 class="ch3">📊 Wat gebeurt er met je gegevens?</h3>
<div style="background: rgba(224,32,32,0.08); border-radius: 8px; padding: 16px; margin: 16px 0;">
<p style="font-size: 13px; color: #3d4f8a; line-height: 1.8; margin: 0;">
Bij <strong>gratis</strong>, publieke AI-tools wordt wat je intypt vaak (afhankelijk van instellingen) gebruikt om het model verder te trainen, of bewaard op servers van het bedrijf. Dat betekent: persoonlijke informatie die je deelt, kan in theorie ergens "blijven hangen".
</p>
</div>

<h3 class="ch3">❌ Wat deel je best NOOIT met AI-chatbots?</h3>
<ul style="font-size: 13px; color: #3d4f8a; line-height: 1.8; padding-left: 20px;">
<li>Je volledige naam samen met adres, telefoonnummer of geboortedatum</li>
<li>Wachtwoorden of inloggegevens</li>
<li>Foto's van paspoort, identiteitskaart of andere officiële documenten</li>
<li>Medische informatie over jezelf of familie</li>
<li>Persoonlijke informatie over vrienden of klasgenoten zonder hun toestemming</li>
<li>Schoolgegevens zoals volledige klaslijsten of examenresultaten van anderen</li>
</ul>

<h3 class="ch3">✅ Wat kan je wel gerust delen?</h3>
<p class="cp">Algemene vragen, huiswerk-onderwerpen (zonder namen), hypothetische scenario's, en creatieve opdrachten zijn doorgaans geen probleem.</p>

<div class="ib warn">
  <div class="ib-t">💡 Sint-Rembert kiest bewust voor Copilot</div>
  <div class="ib-b">Dat is waarom de school kiest voor Microsoft Copilot met je schoolaccount: die gegevens blijven binnen de beveiligde schoolomgeving en worden niet gebruikt om AI-modellen te trainen. Meer hierover in Module 5.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p4()">← Vorige</button>
  <button class="sr-btn g" onclick="n4()">Volgende: energie & milieu →</button>
  <span class="nh">Stap 6/10</span>
</div>`;
}

function m4s6(c){
  c.innerHTML = `
<div class="s-badge">🌍 Stap 7 van 10 · Energie & Milieu</div>
<h2 class="ch2">AI en het <em>milieu</em>: de verborgen kost</h2>
<p class="cp">Elke keer dat je ChatGPT een vraag stelt, gebeurt er ergens in een enorm datacenter een reeks intensieve berekeningen — en dat kost stroom. Veel stroom.</p>

<h3 class="ch3">⚡ De cijfers</h3>
<div style="background: rgba(255,193,7,0.12); border-radius: 8px; padding: 16px; margin: 16px 0;">
<p style="font-size: 13px; color: #3d4f8a; line-height: 1.8; margin: 0;">
Onderzoek toont dat één ChatGPT-vraag ongeveer <strong>10x meer energie</strong> kost dan een gewone Google-zoekopdracht. Het trainen van één groot AI-model kan evenveel CO₂ uitstoten als honderden auto's over hun hele levensduur.<br><br>
Ook waterverbruik speelt mee: datacenters gebruiken enorme hoeveelheden water om hun servers te koelen.
</p>
</div>

<h3 class="ch3">🏭 Waarom kost AI zo veel energie?</h3>
<ul style="font-size: 13px; color: #3d4f8a; line-height: 1.8; padding-left: 20px;">
<li><strong>Training:</strong> Een groot taalmodel trainen duurt weken op duizenden krachtige computerchips die continu draaien</li>
<li><strong>Gebruik (inference):</strong> Elke vraag die je stelt, vereist opnieuw miljarden berekeningen</li>
<li><strong>Koeling:</strong> Al die computerchips worden zeer heet en moeten constant gekoeld worden</li>
</ul>

<h3 class="ch3">🌱 Wat kan jij hiermee doen?</h3>
<p class="cp">Je hoeft AI niet te vermijden, maar bewust gebruik helpt: stel doordachte vragen in plaats van AI 10 keer opnieuw dezelfde vraag te stellen, en gebruik AI voor taken waar het écht waarde toevoegt — niet gewoon "omdat het kan".</p>

<div class="nw">
  <button class="sr-btn b" onclick="p4()">← Vorige</button>
  <button class="sr-btn g" onclick="n4()">Volgende: discussie →</button>
  <span class="nh">Stap 7/10</span>
</div>`;
}

function m4s7(c){
  c.innerHTML = `
<div class="s-badge">💬 Stap 8 van 10 · Discussievragen</div>
<h2 class="ch2">Wat denk <em>jij</em> hiervan?</h2>
<div class="disc-card">
  <div class="disc-q">1. Als een AI-systeem onbedoeld discrimineert, wie is dan verantwoordelijk — de programmeur, het bedrijf, of niemand omdat het "een fout in de data" was?</div>
  <div class="disc-a">De meeste experts vinden dat bedrijven die AI-systemen bouwen en inzetten, verantwoordelijk blijven — ook al was de bias onbedoeld. Ze moeten hun systemen testen op discriminatie voor ze die gebruiken.</div>
</div>
<div class="disc-card">
  <div class="disc-q">2. Zou je een wet steunen die het verplicht maakt om AI-gegenereerde content altijd te labelen als "AI-gemaakt"?</div>
  <div class="disc-a">Dit wordt in verschillende landen (waaronder de EU via de AI Act) al ingevoerd voor bepaalde soorten content, precies om desinformatie tegen te gaan. Er zijn ook nadelen: hoe controleer je dit, en werkt het bij kwaadwillige makers die de regel toch negeren?</div>
</div>
<div class="disc-card">
  <div class="disc-q">3. Zou jij bereid zijn om minder AI te gebruiken als je wist dat het veel energie kost?</div>
  <div class="disc-a">Een persoonlijke afweging — vergelijk het met andere keuzes die je al maakt voor het milieu (fietsen i.p.v. de auto, korter douchen). Bewust gebruik i.p.v. volledig vermijden is voor de meesten haalbaarder.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p4()">← Vorige</button>
  <button class="sr-btn g" onclick="n4()">Volgende: kennischeck →</button>
  <span class="nh">Stap 8/10</span>
</div>`;
}

function m4s8(c){
  const quiz = [
    {q: 'Wat veroorzaakte de bias in Amazon\'s CV-sorteersysteem?', o: ['Het systeem was expres geprogrammeerd om vrouwen te weren.','Het systeem was getraind op historische data waarin vooral mannen voorkwamen.','Er was een technische bug in de software.','Amazon gebruikte het systeem niet correct.'], a: 1, f: 'Het systeem leerde patronen uit CV\'s van vorige (vooral mannelijke) sollicitanten, en nam die scheve verhouding over.' },
    {q: 'Wat is een deepfake?', o: ['Een AI-gegenereerde, nagemaakte foto/video/audio die overtuigend echt lijkt maar het niet is.','Een dieptechniek in de fotografie.','Een soort computervirus.','Een filter op Instagram.'], a: 0, f: 'Deepfakes gebruiken AI om iemands gezicht, lichaam of stem overtuigend na te bootsen in content die niet echt is.' },
    {q: 'Wat is een belangrijk signaal om deepfakes te herkennen?', o: ['De video is te kort.','Onnatuurlijk knipperen, vreemde randen bij het gezicht, of lipbewegingen die niet synchroon lopen.','De video staat op YouTube.','Er is geen enkel signaal, ze zijn altijd perfect.'], a: 1, f: 'Deze signalen helpen, maar zijn niet waterdicht — bronchecken blijft de beste aanpak.' },
    {q: 'Wat deel je best NOOIT met een publieke AI-chatbot?', o: ['Algemene vragen over huiswerk.','Wachtwoorden, identiteitsdocumenten of medische informatie.','Hypothetische scenario\'s.','Creatieve schrijfopdrachten.'], a: 1, f: 'Gevoelige persoonlijke informatie kan door het AI-bedrijf bewaard of gebruikt worden — deel dit nooit met publieke tools.' },
    {q: 'Waarom kost AI-gebruik veel energie?', o: ['AI-servers draaien altijd op zonne-energie, dus het maakt niet uit.','Training en gebruik van AI-modellen vereisen enorme rekenkracht in datacenters, die veel stroom en koeling nodig hebben.','AI gebruikt geen energie, enkel het internet.','Dit is een mythe, AI kost geen extra energie.'], a: 1, f: 'Eén ChatGPT-vraag kost ongeveer 10x meer energie dan een gewone zoekopdracht, door de intensieve berekeningen.' }
  ];
  rQuiz(c, quiz, 4, 'mod4', n4, 60);
}

function m4s9(c){
  c.innerHTML = `
<div class="s-badge">✍️ Stap 10 van 10 · Jouw reflectie</div>
<h2 class="ch2">Welke risico's raken <em>jou</em> het meest?</h2>
<p class="cp">Je kent nu de belangrijkste ethische risico's van AI: bias, deepfakes, privacy en energieverbruik.</p>

<h3 class="ch3">💭 Stellingen</h3>
<div id="stl-m4"></div>

<p class="cp">Noteer je reflectie: Welk risico (bias, deepfakes, privacy, of milieu) vind jij het meest verontrustend, en waarom? Wat zou jij zelf doen om hier voorzichtig mee om te gaan?</p>
<textarea class="sr-ta" id="ref4" placeholder="Het risico dat mij het meest zorgen baart is... Ik zou zelf..."></textarea>

<div class="nw">
  <button class="sr-btn b" onclick="p4()">← Vorige</button>
  <button class="sr-btn g" id="ref4btn" onclick="sRef4()">✅ Module 4 afronden →</button>
  <span class="nh">Stap 10/10</span>
</div>`;
  const ta = document.getElementById('ref4');
  ta.value = localStorage.getItem('sr_l_ref4') || '';
  ta.oninput = ()=>localStorage.setItem('sr_l_ref4', ta.value);
  renderStellingenLeerling('stl-m4', 'l_m4', ['Bedrijven zouden verplicht moeten worden om al hun AI-systemen te testen op bias voor ze die gebruiken.','Ik zou minder AI gebruiken als ik wist hoeveel energie het kost.']);
}

function sRef4(){
  const v = (document.getElementById('ref4').value||'').trim();
  if(v.length < 20){ alert('Vul eerst je reflectie in (minstens een paar zinnen).'); return; }
  n4();
}

/* ════════════════════════════════════════════
   MODULE 5 — AI IN SCHOOL (11 stappen)
   ════════════════════════════════════════════ */

const m5 = [m5s0, m5s1, m5s2, m5s3, m5s4, m5s5, m5s6, m5s7, m5s8, m5s9, m5s10];

function rm5(){ const c=document.getElementById('m5c'); c.innerHTML=''; rDots(5,m5.length,S.mod5.step); m5[S.mod5.step](c); lockNextButtons(c); }
function n5(){ S.mod5.step++; ss(); S.mod5.step>=m5.length ? d5() : rm5(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); }
function p5(){ if(S.mod5.step > 0){ S.mod5.step--; ss(); rm5(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); } }
function d5(){ S.mod5.done=true; S.mod5.step=0; ss(); up(); rmc(); sv('home'); setTimeout(()=>alert('🎉 Module 5 voltooid! Module 6 (laatste!) is nu beschikbaar.'),300); }

function m5s0(c){
  c.innerHTML = `
<div class="s-badge">📚 Stap 1 van 11 · AI-beleid op Sint-Rembert</div>
<h2 class="ch2">De <em>AI-regels</em> van jouw school</h2>
<p class="cp">Je gebruikt AI misschien al voor huiswerk, of je twijfelt soms of iets wel mag. Deze module legt uit hoe Sint-Rembert AI-gebruik regelt: niet met een simpel "ja" of "nee", maar met <strong>5 duidelijke AI-labels</strong> die per opdracht aangeven wat wel en niet mag.</p>
<p class="cp">Als uitgangspunt geldt: <em>AI-gebruik is niet toegestaan, tenzij je leerkracht expliciet aangeeft dat het mag — geheel of gedeeltelijk.</em> De labels maken dat heel concreet.</p>

<div class="ib warn">
  <div class="ib-t">💡 Waarom werkt met labels?</div>
  <div class="ib-b">Niet elke opdracht leent zich tot AI-gebruik. Een opstel om je eigen schrijfvaardigheid te tonen is anders dan een infographic waar creativiteit met tools centraal staat. Labels maken voor jou meteen duidelijk wat de bedoeling is bij elke opdracht.</div>
</div>

<div class="nw">
  <button class="sr-btn g" onclick="n5()">Volgende: de 5 labels →</button>
  <span class="nh">Stap 1/11</span>
</div>`;
}

function m5s1(c){
  c.innerHTML = `
<div class="s-badge">🏷️ Stap 2 van 11 · De 5 AI-labels</div>
<h2 class="ch2">De <em>5 AI-labels</em> uitgelegd</h2>
<p class="cp">Deze schaal loopt op van strikt verbod (label 1) tot volledig vrij AI-gebruik (label 5), gebaseerd op de AI-gebruiksschaal van Schoolmakers (naar het model van onderzoeker Leon Furze, Universiteit van Melbourne).</p>

<div class="labels-grid">
  <div class="label-card l1"><div class="lc-num">1</div><div class="lc-name">Geen AI</div></div>
  <div class="label-card l2"><div class="lc-num">2</div><div class="lc-name">Ideeën</div></div>
  <div class="label-card l3"><div class="lc-num">3</div><div class="lc-name">Bewerking</div></div>
  <div class="label-card l4"><div class="lc-num">4</div><div class="lc-name">Aanvulling</div></div>
  <div class="label-card l5"><div class="lc-num">5</div><div class="lc-name">Vrij</div></div>
</div>

<div class="grid2">
  <div class="pane-ok lijst-ok">
    <div class="lijst-h-ok">Label 1: Geen AI</div>
    <div style="font-size:13px; margin-top:8px;">AI is niet toegestaan. Handschrift, eigen denken, geen digitale hulp. Denk aan toetsen en examens.</div>
  </div>
  <div class="pane-ok lijst-ok">
    <div class="lijst-h-ok">Label 2: Ideeën</div>
    <div style="font-size:13px; margin-top:8px;">AI mag voor brainstorm en ideeëngeneratie. Het werk zelf schrijf jij helemaal zelf.</div>
  </div>
</div>

<div class="grid2">
  <div class="pane-ok lijst-ok">
    <div class="lijst-h-ok">Label 3: Bewerking</div>
    <div style="font-size:13px; margin-top:8px;">AI mag helpen met schrijfstijl en grammatica op jouw eigen tekst. De inhoud blijft van jou.</div>
  </div>
  <div class="pane-ok lijst-ok">
    <div class="lijst-h-ok">Label 4: Aanvulling</div>
    <div style="font-size:13px; margin-top:8px;">AI mag delen van je werk aanvullen of genereren (bijv. illustraties). Jij integreert kritisch.</div>
  </div>
</div>

<div class="grid2">
  <div class="pane-ok lijst-ok" style="grid-column: span 2;">
    <div class="lijst-h-ok">Label 5: Vrij</div>
    <div style="font-size:13px; margin-top:8px;">AI mag volledig vrij ingezet worden. Jij kiest hoe en hoeveel — maar je moet wel kunnen uitleggen welke keuzes je maakte.</div>
  </div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p5()">← Vorige</button>
  <button class="sr-btn g" onclick="n5()">Volgende: doe-opdracht →</button>
  <span class="nh">Stap 2/11</span>
</div>`;
}

function m5s2(c){
  c.innerHTML = `
<div class="s-badge">🧩 Stap 3 van 11 · Doe-opdracht</div>
<h2 class="ch2">Welk label hoort <em>hier</em>?</h2>
<p class="cp">Bekijk elke opdrachtomschrijving en klik op het label (1 t.e.m. 5) dat er volgens jou het best bij past.</p>
<div id="lblmatch"></div>

<div class="nw">
  <button class="sr-btn b" onclick="p5()">← Vorige</button>
  <button class="sr-btn g" onclick="n5()">Volgende: goedgekeurde tools →</button>
  <span class="nh">Stap 3/11</span>
</div>`;
  renderLabelMatchLeerling();
}

function m5s3(c){
  c.innerHTML = `
<div class="s-badge">🛠️ Stap 4 van 11 · Welke tools mag je gebruiken?</div>
<h2 class="ch2">Goedgekeurde <em>AI-tools</em></h2>
<p class="cp">Sint-Rembert kiest bewust voor <strong>Microsoft Copilot</strong> als voornaamste AI-tool. Copilot is geïntegreerd in je schoolaccount, waardoor je gebruik binnen de beveiligde schoolomgeving blijft. Wat je intypt wordt <strong>niet</strong> gebruikt om AI-modellen mee te trainen.</p>

<div class="grid2">
  <div class="pane-ok lijst-ok">
    <div class="lijst-h-ok">✅ Toegestane AI-toepassingen</div>
    <div>→ Microsoft Copilot (eerste keuze, met schoolaccount)</div>
    <div>→ Bookwidgets AI</div>
    <div>→ ChatGPT (let op: gratis versie deelt data)</div>
    <div>→ Google Gemini</div>
    <div>→ NotebookLM</div>
  </div>
  <div class="pane-nok lijst-nok">
    <div class="lijst-h-nok">⚠️ Let op</div>
    <div>→ Bij twijfel: vraag het aan je leerkracht voor je een nieuwe tool gebruikt</div>
    <div>→ Gebruik nooit tools waarbij je moet betalen zonder toestemming van je ouders</div>
  </div>
</div>

<p class="cp">Waarom is dit belangrijk? Bij externe, gratis platformen is vaak onduidelijk wat er met je data gebeurt. Door voor Copilot te kiezen via je schoolaccount, blijft je informatie beschermd.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p5()">← Vorige</button>
  <button class="sr-btn g" onclick="n5()">Volgende: mag het wel of niet? →</button>
  <span class="nh">Stap 4/11</span>
</div>`;
}

function m5s4(c){
  c.innerHTML = `
<div class="s-badge">🧑‍🎓 Stap 5 van 11 · Praktijkscenario's</div>
<h2 class="ch2">Praktijkscenario's: <em>wat zou jij doen?</em></h2>
<p class="cp">Hier volgen herkenbare situaties uit het echte schoolleven. Bekijk elk scenario en beslis: mag dit wel, of mag dit niet?</p>
<div id="magwel-leerling"></div>

<div class="nw">
  <button class="sr-btn b" onclick="p5()">← Vorige</button>
  <button class="sr-btn g" onclick="n5()">Volgende: waarom geen detectietools →</button>
  <span class="nh">Stap 5/11</span>
</div>`;
  renderMagWelLeerling();
}

function m5s5(c){
  c.innerHTML = `
<div class="s-badge">🔍 Stap 6 van 11 · AI-detectie: waarom niet?</div>
<h2 class="ch2">Waarom gebruikt Sint-Rembert <em>geen</em> AI-detectietools?</h2>
<p class="cp">Je zou verwachten dat een school tools gebruikt die "AI-tekst" herkennen om plagiaat op te sporen. Sint-Rembert doet dit bewust <strong>niet</strong>. Waarom?</p>

<div class="ib warn">
  <div class="ib-t">⚠️ AI-detectietools zijn onbetrouwbaar</div>
  <div class="ib-b">Tools die beweren AI-tekst te herkennen leveren regelmatig <strong>valse beschuldigingen</strong> op — vooral bij leerlingen die formeel schrijven, of niet-moedertaalsprekers. Onderzoek toont aan dat deze tools geregeld menselijke tekst verkeerd bestempelen als "AI-geschreven".</div>
</div>

<p class="cp">In plaats daarvan vertrekt evaluatie op Sint-Rembert vanuit <strong>vertrouwen en gesprek</strong>. Leerkrachten ontwerpen opdrachten die inzicht geven in jouw denken en redeneren — bijvoorbeeld via mondelinge toelichting, procesgesprekken, of tussentijdse versies van je werk.</p>

<h3 class="ch3">💬 Wat als je leerkracht twijfelt?</h3>
<p class="cp">Als een leerkracht vermoedt dat je (te veel) AI gebruikte zonder dat het toegelaten was, zal die met jou in gesprek gaan — niet blindelings een detectietool geloven. Eerlijkheid is dan je beste kaart: leg uit wat je wel en niet zelf deed.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p5()">← Vorige</button>
  <button class="sr-btn g" onclick="n5()">Volgende: video →</button>
  <span class="nh">Stap 6/11</span>
</div>`;
}

function m5s6(c){
  c.innerHTML = `
<div class="s-badge">🎬 Stap 7 van 11 · Video</div>
<h2 class="ch2">Bekijk: <em>onderwijs & AI</em></h2>
<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/xpedFIZFmhc" allowfullscreen loading="lazy" title="Arjen Lubach — Valt het onderwijs nog te redden van AI"></iframe></div>
<p class="cp">Deze video toont op scherpe (en humoristische) wijze hoe AI de dagelijkse schoolpraktijk en traditioneel huiswerk op zijn kop zet.</p>

<div class="disc-card">
  <div class="disc-q">1. De video laat zien dat traditioneel huiswerk steeds vaker door een chatbot wordt gedaan. Wat betekent dit volgens jou voor hoe scholen huiswerk zouden moeten geven?</div>
  <div class="disc-a">Veel scholen (waaronder Sint-Rembert) verschuiven naar meer klasgebonden verwerking en mondelinge toetsing, precies omdat thuis-huiswerk makkelijker door AI gedaan kan worden.</div>
</div>
<div class="disc-card">
  <div class="disc-q">2. Als "detectie" niet werkt, hoe zorgen scholen er dan voor dat leerlingen echt zelf leren?</div>
  <div class="disc-a">Door meer te focussen op het proces (hoe kwam je tot je antwoord?) in plaats van enkel het eindproduct — en door leerlingen te motiveren vanuit het "waarom" van een vaardigheid.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p5()">← Vorige</button>
  <button class="sr-btn g" onclick="n5()">Volgende: leeftijd & maturiteit →</button>
  <span class="nh">Stap 7/11</span>
</div>`;
}

function m5s7(c){
  c.innerHTML = `
<div class="s-badge">🎂 Stap 8 van 11 · AI per leeftijd</div>
<h2 class="ch2">Waarom <em>niet iedereen</em> dezelfde regels heeft</h2>
<p class="cp">Je merkt misschien dat jongere leerlingen op school minder vrij met AI mogen werken dan oudere. Dat is bewust beleid: AI-gebruik hangt af van leeftijd en maturiteit.</p>

<div style="background: white; border-left: 4px solid #3a2b9e; border-radius: 12px; padding: 20px; margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 14px; color: #3a2b9e; text-transform: uppercase; margin-bottom: 12px;">📖 Eerste graad</div>
  <p style="font-size: 13px; color: #3d4f8a; line-height: 1.8; font-weight: 600;">
    AI-gebruik gebeurt vooral <strong>onder begeleiding</strong> van je leerkracht. Focus ligt op verkennen: wat is AI, wat kan het wel en niet, hoe herken je echte van AI-gegenereerde content. Nog niet toegestaan tijdens toetsen/examens.
  </p>
</div>

<div style="background: white; border-left: 4px solid var(--blue); border-radius: 12px; padding: 20px; margin: 20px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 14px; color: var(--blue); text-transform: uppercase; margin-bottom: 12px;">📘 Tweede & derde graad</div>
  <p style="font-size: 13px; color: #3d4f8a; line-height: 1.8; font-weight: 600;">
    Meer ruimte om zelfstandig te experimenteren, met toenemende verantwoordelijkheid. Je leert AI kritisch inzetten voor onderzoek, brainstorm en verwerking — steeds volgens het label dat je leerkracht per opdracht aangeeft.
  </p>
</div>

<p class="cp">Deze opbouw beschermt jongere leerlingen tegen te vroege afhankelijkheid van AI, terwijl oudere leerlingen de kans krijgen om AI-vaardigheden op te bouwen die ze ook na school nodig zullen hebben.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p5()">← Vorige</button>
  <button class="sr-btn g" onclick="n5()">Volgende: kennischeck →</button>
  <span class="nh">Stap 8/11</span>
</div>`;
}

function m5s8(c){
  const quiz = [
    {q: 'Wat is het uitgangspunt van het AI-beleid op Sint-Rembert?', o: ['AI-gebruik is altijd toegestaan, tenzij een leerkracht het verbiedt.','AI-gebruik is niet toegestaan, tenzij je leerkracht expliciet toestemming geeft via een label.','AI-gebruik is enkel toegestaan voor leerlingen ouder dan 16.','Er is geen algemeen uitgangspunt, elke leerkracht bepaalt dit apart zonder kader.'], a: 1, f: 'Het beleid vertrekt van "niet toegestaan, tenzij" — labels maken per opdracht duidelijk wat wél mag.' },
    {q: 'Bij welk label mag AI enkel gebruikt worden voor brainstorm/ideeën, terwijl jij de volledige tekst zelf schrijft?', o: ['Label 1','Label 2','Label 4','Label 5'], a: 1, f: 'Label 2 (Ideeën) staat AI toe voor inspiratie, maar het geschreven werk moet van jou zijn.' },
    {q: 'Waarom gebruikt Sint-Rembert geen AI-detectietools om plagiaat op te sporen?', o: ['Omdat zulke tools te duur zijn.','Omdat ze onbetrouwbaar zijn en regelmatig valse beschuldigingen opleveren.','Omdat de school geen belang hecht aan eerlijkheid.','Omdat er geen enkele tool bestaat die dit probeert te doen.'], a: 1, f: 'AI-detectietools zijn wetenschappelijk onvoldoende betrouwbaar — de school kiest voor gesprek en vertrouwen in plaats daarvan.' },
    {q: 'Welke AI-tool wordt bij voorkeur gebruikt op Sint-Rembert, en waarom?', o: ['ChatGPT gratis versie, omdat het meest bekend is.','Microsoft Copilot met schoolaccount, omdat data binnen de beveiligde schoolomgeving blijft.','Elke tool mag, er is geen voorkeur.','Enkel tools die door leerlingen zelf ontwikkeld zijn.'], a: 1, f: 'Copilot met schoolaccount beschermt je gegevens en gebruikt ze niet om modellen te trainen.' },
    {q: 'Waarom verschillen de AI-regels tussen jongere en oudere leerlingen?', o: ['Omdat jongere leerlingen AI niet mogen kennen.','Omdat AI-gebruik moet aansluiten bij leeftijd en maturiteit — jongere leerlingen krijgen meer begeleiding.','Omdat oudere leerlingen betere computers hebben.','Er is geen verschil tussen leeftijdsgroepen.'], a: 1, f: 'De opbouw beschermt jongere leerlingen tegen te vroege afhankelijkheid, terwijl oudere leerlingen stapsgewijs meer verantwoordelijkheid krijgen.' }
  ];
  rQuiz(c, quiz, 5, 'mod5', n5, 60);
}

function m5s9(c){
  c.innerHTML = `
<div class="s-badge">✍️ Stap 10 van 11 · Jouw eigen AI-afspraken</div>
<h2 class="ch2">Wat zijn <em>jouw</em> regels?</h2>
<p class="cp">Je kent nu de 5 AI-labels en het beleid van Sint-Rembert. Tijd om na te denken over je eigen houding tegenover AI op school.</p>

<h3 class="ch3">💭 Stellingen</h3>
<div id="stl-m5"></div>

<p class="cp">Noteer je reflectie: Welk AI-label vind jij het makkelijkst om je aan te houden, en welk het moeilijkst? Wat zou jij doen als een klasgenoot je vraagt om "gewoon zijn ChatGPT-tekst te kopiëren"?</p>
<textarea class="sr-ta" id="ref5" placeholder="Het makkelijkste label vind ik... Als een klasgenoot me dat zou vragen, zou ik..."></textarea>

<div class="nw">
  <button class="sr-btn b" onclick="p5()">← Vorige</button>
  <button class="sr-btn g" id="ref5btn" onclick="sRef5()">✅ Module 5 afronden →</button>
  <span class="nh">Stap 10/11</span>
</div>`;
  const ta = document.getElementById('ref5');
  ta.value = localStorage.getItem('sr_l_ref5') || '';
  ta.oninput = ()=>localStorage.setItem('sr_l_ref5', ta.value);
  renderStellingenLeerling('stl-m5', 'l_m5', ['Het is eerlijker om altijd te zeggen wanneer je AI hebt gebruikt, ook als het niet verplicht is.','AI-labels per opdracht zijn een goed systeem om duidelijkheid te geven.']);
}

function sRef5(){
  const v = (document.getElementById('ref5').value||'').trim();
  if(v.length < 20){ alert('Vul eerst je reflectie in (minstens een paar zinnen).'); return; }
  n5();
}

function m5s10(c){
  c.innerHTML = `
<div class="s-badge">📋 Stap 11 van 11 · Samenvatting</div>
<h2 class="ch2">Samengevat: <em>AI op school</em></h2>
<div style="background: rgba(127,224,0,0.1); border-radius: 12px; padding: 20px; margin: 16px 0;">
<p style="font-size: 14px; color: #3d4f8a; line-height: 1.9; margin: 0;">
✅ Check altijd het <strong>AI-label</strong> van een opdracht voor je AI gebruikt<br>
✅ Bij twijfel: <strong>vraag het aan je leerkracht</strong><br>
✅ Gebruik bij voorkeur <strong>Copilot met je schoolaccount</strong><br>
✅ Wees <strong>eerlijk en transparant</strong> over je AI-gebruik<br>
✅ AI-detectie wordt niet gebruikt — vertrouwen en gesprek staan centraal<br>
✅ De regels groeien mee met je leeftijd en maturiteit
</p>
</div>
<p class="cp">Je bent nu klaar voor de laatste module: wat betekent AI voor de wereld en jouw toekomst?</p>

<div class="nw">
  <button class="sr-btn b" onclick="p5()">← Vorige</button>
  <button class="sr-btn g" onclick="n5()">Module 5 afsluiten →</button>
  <span class="nh">Stap 11/11</span>
</div>`;
}

/* ════════════════════════════════════════════
   MODULE 6 — AI IN MAATSCHAPPIJ (11 stappen, FINALE)
   ════════════════════════════════════════════ */

const m6 = [m6s0, m6s1, m6s2, m6s3, m6s4, m6s5, m6s6, m6s7, m6s8, m6s9, m6s10];

function rm6(){ const c=document.getElementById('m6c'); c.innerHTML=''; rDots(6,m6.length,S.mod6.step); m6[S.mod6.step](c); lockNextButtons(c); }
function n6(){ S.mod6.step++; ss(); S.mod6.step>=m6.length ? d6() : rm6(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); }
function p6(){ if(S.mod6.step > 0){ S.mod6.step--; ss(); rm6(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); } }
function d6(){ S.mod6.done=true; S.mod6.step=0; ss(); up(); rmc(); sv('cert'); }

function m6s0(c){
  c.innerHTML = `
<div class="s-badge">🌍 Stap 1 van 11 · De laatste module!</div>
<h2 class="ch2">AI in de <em>Maatschappij</em></h2>
<p class="cp">Je hebt in de vorige 5 modules geleerd wat AI is, hoe het werkt, wat generatieve AI kan, welke ethische risico's er zijn, en wat de regels op school zijn. In deze laatste module kijk je verder: wat betekent AI voor de wereld, voor jobs, en voor jouw eigen toekomst?</p>

<div class="ib warn">
  <div class="ib-t">🏁 Bijna klaar!</div>
  <div class="ib-b">Na deze module krijg je je certificaat. Deze module bevat een <strong>grote afsluitende reflectie</strong> — neem er de tijd voor, want dit is jouw kans om je eigen visie op AI te formuleren.</div>
</div>

<div class="nw">
  <button class="sr-btn g" onclick="n6()">Volgende: AI en jobs →</button>
  <span class="nh">Stap 1/11</span>
</div>`;
}

function m6s1(c){
  c.innerHTML = `
<div class="s-badge">💼 Stap 2 van 11 · AI en de arbeidsmarkt</div>
<h2 class="ch2">Gaat AI <em>jouw toekomstige job</em> overnemen?</h2>
<p class="cp">Eén van de meest besproken vragen rond AI: welke jobs verdwijnen, welke veranderen, en welke nieuwe ontstaan er?</p>

<h3 class="ch3">📉 Jobs die veranderen door AI</h3>
<div style="background: rgba(255,193,7,0.12); border-radius: 8px; padding: 16px; margin: 16px 0;">
<p style="font-size: 13px; color: #3d4f8a; line-height: 1.8; margin: 0;">
Taken die <strong>routinematig en voorspelbaar</strong> zijn, worden het snelst beïnvloed: eenvoudige teksten schrijven, data invoeren, eerste-lijns klantenservice, basisvertalingen, simpele code schrijven. Dit betekent niet dat deze jobs volledig verdwijnen — vaak veranderen ze, waarbij AI het routinewerk overneemt en de mens zich focust op complexere taken.
</p>
</div>

<h3 class="ch3">📈 Jobs en vaardigheden die belangrijker worden</h3>
<ul style="font-size: 13px; color: #3d4f8a; line-height: 1.8; padding-left: 20px;">
<li><strong>Kritisch denken:</strong> AI-output controleren en beoordelen</li>
<li><strong>Creativiteit:</strong> Nieuwe ideeën bedenken die AI niet kan verzinnen</li>
<li><strong>Empathie & mensenwerk:</strong> Zorg, begeleiding, onderwijs — waar menselijk contact centraal staat</li>
<li><strong>AI-geletterdheid:</strong> Weten hoe je AI-tools slim inzet (jij bent hier al mee bezig!)</li>
<li><strong>Complexe probleemoplossing:</strong> Situaties waar geen duidelijk "juist antwoord" is</li>
</ul>

<h3 class="ch3">🆕 Volledig nieuwe jobs</h3>
<p class="cp">Net zoals internet nieuwe jobs schiep die 30 jaar geleden niet bestonden (social media manager, app-ontwikkelaar), zal AI ook nieuwe beroepen creëren — sommigen bestaan vandaag al: prompt engineer, AI-ethicus, AI-trainer.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p6()">← Vorige</button>
  <button class="sr-btn g" onclick="n6()">Volgende: doe-opdracht →</button>
  <span class="nh">Stap 2/11</span>
</div>`;
}

function m6s2(c){
  c.innerHTML = `
<div class="s-badge">🧩 Stap 3 van 11 · Doe-opdracht</div>
<h2 class="ch2">Hoe <em>AI-proof</em> is dit beroep?</h2>
<p class="cp">Bekijk elk beroep: hoe sterk denk je dat AI dit beroep zal beïnvloeden de komende 10 jaar? Klik om het antwoord te zien.</p>
<div id="jobcheck"></div>

<div class="nw">
  <button class="sr-btn b" onclick="p6()">← Vorige</button>
  <button class="sr-btn g" onclick="n6()">Volgende: video →</button>
  <span class="nh">Stap 3/11</span>
</div>`;
  renderJobCheck();
}

function m6s3(c){
  c.innerHTML = `
<div class="s-badge">🎬 Stap 4 van 11 · Video</div>
<h2 class="ch2">Bekijk: <em>AI en de toekomst van werk</em></h2>
<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/JMLsHI8aV0g" allowfullscreen loading="lazy" title="AI en de toekomst van werk"></iframe></div>
<div class="ib warn">
  <div class="ib-t">📝 Kijk kritisch</div>
  <div class="ib-b">Video's over "de toekomst van AI" bevatten vaak een mix van goed onderbouwde feiten en speculatie. Vraag jezelf af: welke uitspraken zijn gebaseerd op huidige trends, en welke zijn pure gok?</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p6()">← Vorige</button>
  <button class="sr-btn g" onclick="n6()">Volgende: AI wereldwijd →</button>
  <span class="nh">Stap 4/11</span>
</div>`;
}

function m6s4(c){
  c.innerHTML = `
<div class="s-badge">🌐 Stap 5 van 11 · AI wereldwijd</div>
<h2 class="ch2">AI is niet overal <em>hetzelfde</em></h2>
<p class="cp">De manier waarop landen omgaan met AI verschilt sterk — met grote gevolgen voor privacy, vrijheid en veiligheid.</p>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0;">
<div style="background: white; border-left: 4px solid var(--blue); border-radius: 8px; padding: 14px;">
<strong style="color: var(--blue); font-size: 12px; text-transform: uppercase;">🇪🇺 Europa</strong>
<p style="font-size: 12px; color: #3d4f8a; margin-top: 8px; line-height: 1.6;">De <strong>EU AI Act</strong> (2024) is de eerste uitgebreide AI-wetgeving ter wereld. Ze verbiedt bepaalde toepassingen (zoals sociale scoring van burgers) en verplicht transparantie en veiligheidstests voor risicovolle AI-systemen.</p>
</div>
<div style="background: white; border-left: 4px solid var(--red); border-radius: 8px; padding: 14px;">
<strong style="color: var(--red); font-size: 12px; text-transform: uppercase;">🌏 Andere aanpakken</strong>
<p style="font-size: 12px; color: #3d4f8a; margin-top: 8px; line-height: 1.6;">Sommige landen zetten AI in voor grootschalige gezichtsherkenning en burgerbewaking, andere laten de markt vrijwel ongereguleerd. Dit leidt tot grote verschillen in privacy en vrijheid wereldwijd.</p>
</div>
</div>

<h3 class="ch3">⚖️ Waarom regelgeving belangrijk is</h3>
<p class="cp">AI zonder regels kan leiden tot machtsconcentratie bij enkele grote techbedrijven, verlies van privacy, en oneerlijke beslissingen zonder verhaal (bijvoorbeeld een AI die je sollicitatie afwijst zonder uitleg). Wetgeving zoals de EU AI Act probeert een balans te vinden tussen innovatie toelaten en burgers beschermen.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p6()">← Vorige</button>
  <button class="sr-btn g" onclick="n6()">Volgende: discussie →</button>
  <span class="nh">Stap 5/11</span>
</div>`;
}

function m6s5(c){
  c.innerHTML = `
<div class="s-badge">💬 Stap 6 van 11 · Grote discussievragen</div>
<h2 class="ch2">De <em>grote</em> vragen over AI</h2>
<div class="disc-card">
  <div class="disc-q">1. Sommigen zeggen dat AI ooit slimmer dan mensen zal worden ("superintelligentie"). Anderen zeggen dat dit sciencefiction is. Wat denk jij, en waarom?</div>
  <div class="disc-a">Dit is een open, wetenschappelijk omstreden vraag. Sommige AI-experts (waaronder oprichters van grote AI-bedrijven) waarschuwen hiervoor; anderen vinden het overdreven en afleidend van de échte, huidige problemen zoals bias en desinformatie.</div>
</div>
<div class="disc-card">
  <div class="disc-q">2. Zou je een wereld willen waarin AI de meeste beslissingen voor je neemt (welke studie, welke job, welke partner) omdat het "objectiever" zou zijn?</div>
  <div class="disc-a">De meeste mensen vinden autonomie (zelf beslissen) belangrijk, ook al maakt AI soms "betere" statistische keuzes. Dit raakt een kernvraag: wat maakt een leven goed — enkel het resultaat, of ook de vrijheid om zelf te kiezen?</div>
</div>
<div class="disc-card">
  <div class="disc-q">3. Moet er een leeftijdsgrens komen voor het gebruik van bepaalde AI-tools (zoals er nu is voor sociale media)?</div>
  <div class="disc-a">Verschillende landen en de EU AI Act discussiëren hierover. Argumenten voor: bescherming tegen manipulatie en afhankelijkheid. Argumenten tegen: moeilijk te handhaven, en jongeren missen kansen om AI-geletterdheid op te bouwen.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p6()">← Vorige</button>
  <button class="sr-btn g" onclick="n6()">Volgende: stellingen →</button>
  <span class="nh">Stap 6/11</span>
</div>`;
}

function m6s6(c){
  c.innerHTML = `
<div class="s-badge">💭 Stap 7 van 11 · Stellingen</div>
<h2 class="ch2">Waar sta <em>jij</em>?</h2>
<p class="cp">Geen goed of fout antwoord — enkel jouw mening.</p>
<div id="stl-m6"></div>

<div class="nw">
  <button class="sr-btn b" onclick="p6()">← Vorige</button>
  <button class="sr-btn g" onclick="n6()">Volgende: 5/10/50 jaar →</button>
  <span class="nh">Stap 7/11</span>
</div>`;
  renderStellingenLeerling('stl-m6', 'l_m6', ['Over 10 jaar zal AI de meeste huiswerktaken volledig kunnen overnemen.','Er zou internationale wetgeving moeten komen die AI-ontwikkeling strenger controleert.','Ik maak me meer zorgen over hoe mensen AI misbruiken, dan over AI zelf.']);
}

function m6s7(c){
  c.innerHTML = `
<div class="s-badge">🔮 Stap 8 van 11 · Blik vooruit</div>
<h2 class="ch2">AI over <em>5, 10 en 50 jaar</em></h2>
<p class="cp">Niemand kan de toekomst voorspellen, maar experts schetsen wel scenario's op basis van huidige trends.</p>

<div style="background: white; border-left: 4px solid var(--green); border-radius: 12px; padding: 18px; margin: 16px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 14px; color: var(--green); margin-bottom: 10px;">📅 Over 5 jaar (2031)</div>
  <p style="font-size: 13px; color: #3d4f8a; line-height: 1.7;">AI-assistenten worden nog gewoner in school en werk. Verwacht: betere AI-tutoren op maat, meer AI in creatieve tools (video, muziek), striktere regelgeving rond deepfakes en AI-transparantie.</p>
</div>

<div style="background: white; border-left: 4px solid var(--blue); border-radius: 12px; padding: 18px; margin: 16px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 14px; color: var(--blue); margin-bottom: 10px;">📅 Over 10 jaar (2036)</div>
  <p style="font-size: 13px; color: #3d4f8a; line-height: 1.7;">Grotere veranderingen op de arbeidsmarkt worden zichtbaar. Onderwijs zal waarschijnlijk verder verschuiven naar vaardigheden die AI niet kan overnemen. AI-geletterdheid wordt een basisvaardigheid, net als lezen en rekenen vandaag.</p>
</div>

<div style="background: white; border-left: 4px solid #9C27B0; border-radius: 12px; padding: 18px; margin: 16px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 14px; color: #9C27B0; margin-bottom: 10px;">📅 Over 50 jaar (2076)</div>
  <p style="font-size: 13px; color: #3d4f8a; line-height: 1.7;">Hier wordt het pure speculatie. Niemand — ook geen expert — weet écht hoe de wereld er dan uitziet. Dat is precies waarom JOUW generatie mee vorm zal geven aan hoe dit verloopt.</p>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p6()">← Vorige</button>
  <button class="sr-btn g" onclick="n6()">Volgende: kennischeck →</button>
  <span class="nh">Stap 8/11</span>
</div>`;
}

function m6s8(c){
  const quiz = [
    {q: 'Welk type taken wordt het snelst beïnvloed door AI op de arbeidsmarkt?', o: ['Creatieve, unieke taken.','Routinematige en voorspelbare taken.','Taken die menselijk contact vereisen.','Alle taken evenveel.'], a: 1, f: 'Routinematige, voorspelbare taken zijn het makkelijkst te automatiseren met huidige AI-technologie.' },
    {q: 'Wat is de EU AI Act?', o: ['Een AI-chatbot gemaakt door de Europese Unie.','De eerste uitgebreide AI-wetgeving ter wereld, met regels over transparantie en veiligheid.','Een gratis cursus over AI.','Een verbod op alle vormen van AI in Europa.'], a: 1, f: 'De EU AI Act (2024) reguleert AI-gebruik op basis van risiconiveau en verplicht transparantie bij hoog-risico toepassingen.' },
    {q: 'Welke vaardigheden worden belangrijker in een AI-wereld?', o: ['Enkel technische computervaardigheden.','Kritisch denken, creativiteit, empathie en AI-geletterdheid.','Vaardigheden worden minder belangrijk, AI doet alles.','Enkel snel kunnen typen.'], a: 1, f: 'Vaardigheden die AI niet makkelijk kan overnemen — kritisch denken, creativiteit, mensenwerk — worden waardevoller.' },
    {q: 'Waarom verschilt AI-regelgeving sterk tussen landen?', o: ['Omdat AI in sommige landen niet bestaat.','Omdat landen verschillende waarden hebben rond privacy, vrijheid en staatscontrole.','Er is geen verschil, alle landen hebben dezelfde regels.','Omdat AI enkel in Europa gebruikt wordt.'], a: 1, f: 'Verschillen in politieke waarden leiden tot sterk uiteenlopende aanpakken, van strenge regulering tot quasi-vrije markt of staatscontrole.' },
    {q: 'Wat is een realistische houding tegenover voorspellingen over AI op 50 jaar?', o: ['Volledig vertrouwen, experts weten dit zeker.','Kritisch blijven — niemand, ook geen expert, kan de verre toekomst met zekerheid voorspellen.','Nooit over de toekomst nadenken.','Enkel geloven wat op sociale media staat.'], a: 1, f: 'Lange-termijnvoorspellingen zijn inherent onzeker — gezonde scepsis is op zijn plaats, zonder het onderwerp te negeren.' }
  ];
  rQuiz(c, quiz, 6, 'mod6', n6, 60);
}

function m6s9(c){
  c.innerHTML = `
<div class="s-badge">✍️ Stap 10 van 11 · GROTE Afsluitende Reflectie</div>
<h2 class="ch2">Jouw <em>visie</em> op AI</h2>
<p class="cp">Dit is de belangrijkste reflectie van de hele cursus. Je hebt nu 6 modules doorlopen: wat AI is, hoe het werkt, wat generatieve AI kan, welke ethische risico's er zijn, wat de regels op school zijn, en wat AI betekent voor de maatschappij.</p>

<div class="ib warn">
  <div class="ib-t">🎯 Neem er de tijd voor</div>
  <div class="ib-b">Schrijf minstens <strong>een volledige paragraaf</strong> (5-8 zinnen). Er is geen goed of fout antwoord — dit is jouw eigen, doordachte visie.</div>
</div>

<h3 class="ch3">💭 Denk na over:</h3>
<ul style="font-size: 13px; color: #3d4f8a; line-height: 1.8; padding-left: 20px;">
<li>Hoe wil JIJ dat AI eruitziet over 10 jaar — voor school, voor werk, voor de maatschappij?</li>
<li>Wat vind je het meest hoopvol aan AI? Wat vind je het meest verontrustend?</li>
<li>Wat ga je zelf anders doen na deze cursus (bijvoorbeeld: kritischer checken, bewuster gebruiken)?</li>
</ul>

<textarea class="sr-ta" id="ref6" style="min-height: 180px;" placeholder="Mijn visie op AI over 10 jaar is... Het meest hoopvolle vind ik... Het meest verontrustende vind ik... Na deze cursus ga ik zelf..."></textarea>

<div class="nw">
  <button class="sr-btn b" onclick="p6()">← Vorige</button>
  <button class="sr-btn g" id="ref6btn" onclick="sRef6()">✅ Module 6 afronden →</button>
  <span class="nh">Stap 10/11</span>
</div>`;
  const ta = document.getElementById('ref6');
  ta.value = localStorage.getItem('sr_l_ref6') || '';
  ta.oninput = ()=>localStorage.setItem('sr_l_ref6', ta.value);
}

function sRef6(){
  const v = (document.getElementById('ref6').value||'').trim();
  if(v.length < 50){ alert('Dit is de belangrijkste reflectie van de cursus — vul minstens een volledige paragraaf in (5-8 zinnen).'); return; }
  n6();
}

function m6s10(c){
  c.innerHTML = `
<div class="s-badge">🎉 Stap 11 van 11 · Klaar!</div>
<h2 class="ch2">Je hebt het <em>gehaald</em>!</h2>
<p class="cp">Je hebt alle 6 modules van de AI-Skills cursus voltooid. Je begrijpt nu:</p>
<div style="background: rgba(127,224,0,0.1); border-radius: 12px; padding: 20px; margin: 16px 0;">
<p style="font-size: 14px; color: #3d4f8a; line-height: 1.9; margin: 0;">
✅ Wat AI is en hoe het zich onderscheidt van gewone software<br>
✅ Hoe machine learning en neurale netwerken werken<br>
✅ Hoe generatieve AI zoals ChatGPT en DALL-E functioneert<br>
✅ Welke ethische risico's er zijn: bias, deepfakes, privacy, energie<br>
✅ De 5 AI-labels en regels van Sint-Rembert<br>
✅ Wat AI betekent voor de maatschappij en jouw toekomst
</p>
</div>
<p class="cp">Klik hieronder om je certificaat te bekijken en te downloaden!</p>

<div class="nw">
  <button class="sr-btn b" onclick="p6()">← Vorige</button>
  <button class="sr-btn g" onclick="n6()">🏆 Bekijk mijn certificaat →</button>
  <span class="nh">Stap 11/11</span>
</div>`;
}

/* ════════════════════════════════════════════
   QUIZ ENGINE (herbruikt patroon van teacher-versie)
   ════════════════════════════════════════════ */

function rQuiz(con, qs, modN, sk, onComplete, pass){
  const id = 'q'+modN+'_'+Date.now();
  const st = { ans: new Array(qs.length).fill(null), correct: new Array(qs.length).fill(false) };
  const wrap = document.createElement('div');

  const shuffle = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  qs.forEach(q => {
    const origCorrectAnswer = q.o[q.a];
    const shuffledOptions = shuffle(q.o);
    q.o = shuffledOptions;
    q.a = shuffledOptions.indexOf(origCorrectAnswer);
  });

  let prevBtnHtml = `<button class="sr-btn b" style="background:#cbd5e1; color:var(--blue); margin-right:auto;" onclick="p${modN}()">← Vorige stap</button>`;

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
    else { nb.textContent = '↺ Probeer opnieuw'; nb.onclick = ()=>{ window['rm'+modN](); document.getElementById('main').scrollTo({top:0}); }; }
  };
}

/* ════════════════════════════════════════════
   STELLINGEN (herbruikt patroon)
   ════════════════════════════════════════════ */

function renderStellingenLeerling(containerId, groupKey, stellingen){
  const g = document.getElementById(containerId);
  if(!g) return;
  let saved = {};
  try{ saved = JSON.parse(localStorage.getItem('sr_l_stellingen_'+groupKey)||'{}'); }catch(e){}
  let html = '';
  stellingen.forEach((s,i)=>{
    const val = saved[i];
    html += `<div class="stelling-card" style="background:white;border-radius:8px;padding:16px;margin:12px 0;border-left:4px solid var(--blue);">
      <div style="font-size:13px;color:#3d4f8a;font-weight:600;margin-bottom:10px;">${i+1}. ${s}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        ${['Sterk oneens','Oneens','Neutraal','Eens','Sterk eens'].map((lbl,vi)=>`<button class="stl-btn" data-i="${i}" data-v="${vi}" style="flex:1;min-width:90px;padding:8px 6px;border-radius:6px;border:2px solid ${val===vi?'var(--blue)':'#e0e4f5'};background:${val===vi?'var(--blue)':'white'};color:${val===vi?'white':'#3d4f8a'};font-size:11px;font-weight:700;cursor:pointer;">${lbl}</button>`).join('')}
      </div>
    </div>`;
  });
  g.innerHTML = html;
  g.querySelectorAll('.stl-btn').forEach(b=>{
    b.onclick = ()=>{
      const i = +b.dataset.i, v = +b.dataset.v;
      saved[i] = v;
      localStorage.setItem('sr_l_stellingen_'+groupKey, JSON.stringify(saved));
      renderStellingenLeerling(containerId, groupKey, stellingen);
    };
  });
}

/* ════════════════════════════════════════════
   MODULE 1 HELPERS
   ════════════════════════════════════════════ */

function renderAiCards(){
  const items = [
    {n:'Spamfilter e-mail', ai:true, w:'Machine learning'},
    {n:'Rekenmachine', ai:false, w:'Vaste regels'},
    {n:'TikTok "voor jou"-feed', ai:true, w:'Algoritme leert van je gedrag'},
    {n:'Verkeerslicht op vaste timer', ai:false, w:'Vaste regels'},
    {n:'Google Translate', ai:true, w:'Taalmodel'},
    {n:'ChatGPT', ai:true, w:'Groot taalmodel (LLM)'}
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

function renderHalluCardsLeerling(){
  const items = [
    { t:'"Een studie van de Universiteit Gent uit 2022 toont aan dat leerlingen die dagelijks AI gebruiken 15% betere examenresultaten behalen."', h:true, e:'Hallucinatie: een vage, niet-bestaande studie met een erg specifiek percentage — een klassiek hallucinatiepatroon.' },
    { t:'"De Tweede Wereldoorlog eindigde in Europa op 8 mei 1945."', h:false, e:'Klopt — dit is een algemeen geverifieerd historisch feit.' },
    { t:'"Leonardo da Vinci schilderde de Mona Lisa, vermoedelijk tussen 1503 en 1519."', h:false, e:'Klopt — niet elke specifieke uitspraak is een hallucinatie. Kritisch blijven werkt in twee richtingen.' },
    { t:'"Volgens het schoolreglement van Sint-Rembert artikel 27 mag je nooit een rekenmachine gebruiken tijdens wiskundetoetsen."', h:true, e:'Hallucinatie: een verzonnen artikelnummer met een bewering die niet klopt met de realiteit.' }
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

/* ════════════════════════════════════════════
   MODULE 2 HELPERS
   ════════════════════════════════════════════ */

function renderMLTypeCards(){
  const items = [
    { d:'Een systeem krijgt 5.000 foto\'s, elk gelabeld "kat" of "hond", en leert het verschil herkennen.', t:'Supervised', e:'De data was gelabeld — het systeem leerde van voorbeelden met een "juist antwoord".' },
    { d:'Een systeem analyseert duizenden klantaankopen zonder labels, en ontdekt zelf 4 groepen klanten met gelijkaardig koopgedrag.', t:'Unsupervised', e:'Geen labels — het systeem zocht zelf structuur/groepen in de data.' },
    { d:'Een AI leert schaken door miljoenen partijen tegen zichzelf te spelen, met een beloning bij winst en een "straf" bij verlies.', t:'Reinforcement', e:'Leren door vallen en opstaan met beloning/straf, zonder vooraf gelabelde voorbeelden.' },
    { d:'Een systeem krijgt 10.000 e-mails, elk gemarkeerd als "spam" of "geen spam", en leert nieuwe e-mails classificeren.', t:'Supervised', e:'Gelabelde voorbeelden ("spam"/"geen spam") — klassiek supervised learning.' }
  ];
  const g = document.getElementById('mltype');
  if(!g) return;
  items.forEach((it,idx)=>{
    const card = document.createElement('div'); card.className='lm-card';
    const types = ['Supervised','Unsupervised','Reinforcement'];
    let opts = '';
    types.forEach(t => opts += '<button class="lm-btn" data-v="'+t+'" style="width:auto;padding:0 14px;">'+t+'</button>');
    card.innerHTML = '<div class="lm-q">'+(idx+1)+'. '+it.d+'</div><div class="lm-opts">'+opts+'</div><div class="lm-fb" id="mlfb'+idx+'"></div>';
    g.appendChild(card);
    card.querySelectorAll('.lm-btn').forEach(b=>{
      b.onclick = ()=>{
        if(card.dataset.done) return;
        card.dataset.done='1';
        const v = b.dataset.v, ok = v===it.t;
        card.querySelectorAll('.lm-btn').forEach(bb=>{
          bb.disabled = true;
          if(bb.dataset.v === it.t) bb.classList.add('correct');
          else if(bb===b && !ok) bb.classList.add('wrong');
        });
        const fb = document.getElementById('mlfb'+idx);
        fb.className = 'lm-fb show';
        fb.textContent = (ok?'✅ Juist — ':'❌ Niet helemaal — het juiste antwoord is '+it.t+'. ')+it.e;
      };
    });
  });
}

function renderTrainOrder(){
  const g = document.getElementById('trainorder');
  if(!g) return;
  const steps = [
    {n:'Pre-training', d:'Het model leest enorme hoeveelheden tekst van het internet en leert welk woord waarschijnlijk volgt.', order:1},
    {n:'Fine-tuning', d:'Mensen geven voorbeelden van goede vraag-antwoord-paren om het model behulpzamer te maken.', order:2},
    {n:'RLHF', d:'Mensen beoordelen AI-antwoorden; het model leert nuttige, veilige antwoorden geven.', order:3}
  ];
  const shuffled = [...steps].sort(()=>Math.random()-0.5);
  let html = '<div style="display:flex;flex-direction:column;gap:10px;">';
  shuffled.forEach((s,i)=>{
    html += `<div class="lm-card" data-order="${s.order}" style="display:flex;align-items:center;gap:12px;">
      <div style="font-weight:800;color:var(--blue);font-size:18px;min-width:24px;">?</div>
      <div style="flex:1;"><strong>${s.n}</strong><br><span style="font-size:12px;color:#3d4f8a;">${s.d}</span></div>
    </div>`;
  });
  html += '</div><div style="text-align:center;margin-top:16px;"><button class="sr-btn g" id="checkorder">Controleer volgorde</button></div><div id="orderfb" style="margin-top:12px;"></div>';
  g.innerHTML = html;
  document.getElementById('checkorder').onclick = ()=>{
    const cards = g.querySelectorAll('.lm-card');
    let correct = true;
    cards.forEach((card,i)=>{
      const order = +card.dataset.order;
      const numEl = card.querySelector('div');
      if(order === i+1){ numEl.textContent = '✓'; numEl.style.color='var(--green)'; }
      else { numEl.textContent = '✗'; numEl.style.color='var(--red)'; correct = false; }
    });
    document.getElementById('orderfb').innerHTML = correct
      ? '<div style="color:var(--green);font-weight:700;">✅ Juist! Dit is de correcte volgorde: Pre-training → Fine-tuning → RLHF.</div>'
      : '<div style="color:var(--red);font-weight:700;">De juiste volgorde is: 1) Pre-training 2) Fine-tuning 3) RLHF. Bekijk de ✓/✗ hierboven.</div>';
  };
}

/* ════════════════════════════════════════════
   MODULE 3 HELPERS
   ════════════════════════════════════════════ */

function renderPromptCompareLeerling(){
  const pairs = [
    { a:'Vertel over honden.', b:'Geef 3 interessante feiten over hoe honden geuren kunnen ruiken, in maximaal 100 woorden, voor een spreekbeurt van 12 minuten.', better:'b' },
    { a:'Help met mijn opstel.', b:'Geef feedback op de structuur van mijn opstel over klimaatverandering: is de opbouw (inleiding-kern-slot) duidelijk? Wat kan beter?', better:'b' },
    { a:'Leg de Franse Revolutie uit in precies 5 zinnen, met de 3 belangrijkste oorzaken, voor een leerling van 15 jaar.', b:'Wat is de Franse Revolutie?', better:'a' }
  ];
  const g = document.getElementById('promptcompare');
  if(!g) return;
  pairs.forEach((p,idx)=>{
    const card = document.createElement('div'); card.className='lm-card';
    card.innerHTML = `<div class="lm-q">${idx+1}. Welke prompt is sterker?</div>
      <div style="display:flex;flex-direction:column;gap:8px;margin:10px 0;">
        <button class="lm-btn" data-v="a" style="width:100%;text-align:left;padding:10px;height:auto;white-space:normal;">A: "${p.a}"</button>
        <button class="lm-btn" data-v="b" style="width:100%;text-align:left;padding:10px;height:auto;white-space:normal;">B: "${p.b}"</button>
      </div>
      <div class="lm-fb" id="pcfb${idx}"></div>`;
    g.appendChild(card);
    card.querySelectorAll('.lm-btn').forEach(b=>{
      b.onclick = ()=>{
        if(card.dataset.done) return;
        card.dataset.done='1';
        const v = b.dataset.v, ok = v===p.better;
        card.querySelectorAll('.lm-btn').forEach(bb=>{
          bb.disabled = true;
          if(bb.dataset.v === p.better) bb.classList.add('correct');
          else if(bb===b && !ok) bb.classList.add('wrong');
        });
        const fb = document.getElementById('pcfb'+idx);
        fb.className = 'lm-fb show';
        fb.textContent = ok ? '✅ Juist! Deze prompt is specifieker en geeft duidelijkere verwachtingen.' : '❌ Niet helemaal — prompt '+p.better.toUpperCase()+' is specifieker en geeft betere resultaten.';
      };
    });
  });
}

function renderAIRealCheck(){
  const items = [
    { d:'Een tekst gebruikt heel vaak woorden als "Bovendien", "Daarnaast" en "Kortom", en is erg gestructureerd met veel opsommingen.', ai:true, e:'Dit is een typisch patroon van AI-gegenereerde tekst — mensen schrijven doorgaans losser.' },
    { d:'Een foto van een hand toont 6 vingers.', ai:true, e:'Een klassiek (maar steeds zeldzamer wordend) signaal van AI-beeldgeneratie.' },
    { d:'Een artikel bevat een typfout en een persoonlijke anekdote van de auteur over een ervaring uit haar jeugd.', ai:false, e:'Persoonlijke anekdotes en kleine onvolkomenheden zijn eerder tekenen van menselijk geschreven tekst.' },
    { d:'Een video toont een bekende persoon die iets zegt dat volledig indruist tegen alles wat die persoon publiekelijk altijd heeft gezegd, gedeeld via een anoniem account.', ai:true, e:'Verdacht scenario voor een deepfake — controleer altijd bij officiële, betrouwbare bronnen.' }
  ];
  const g = document.getElementById('airealcheck');
  if(!g) return;
  items.forEach((it,idx)=>{
    const card = document.createElement('div'); card.className='lm-card';
    card.innerHTML = '<div class="lm-q">'+(idx+1)+'. '+it.d+'</div><div class="lm-opts"><button class="lm-btn" data-v="ai" style="width:auto;padding:0 16px">🤖 Waarschijnlijk AI</button><button class="lm-btn" data-v="echt" style="width:auto;padding:0 16px">👤 Waarschijnlijk echt</button></div><div class="lm-fb" id="arcfb'+idx+'"></div>';
    g.appendChild(card);
    card.querySelectorAll('.lm-btn').forEach(b=>{
      b.onclick = ()=>{
        if(card.dataset.done) return;
        card.dataset.done='1';
        const v = b.dataset.v, picked_ai = v==='ai';
        const correct = picked_ai === it.ai;
        card.querySelectorAll('.lm-btn').forEach(bb=>{
          bb.disabled = true;
          const bbAi = bb.dataset.v==='ai';
          if(bbAi === it.ai) bb.classList.add('correct');
          else if(bb===b && !correct) bb.classList.add('wrong');
        });
        const fb = document.getElementById('arcfb'+idx);
        fb.className = 'lm-fb show';
        fb.textContent = (correct?'✅ Juist — ':'❌ Niet helemaal — ')+it.e;
      };
    });
  });
}

/* ════════════════════════════════════════════
   MODULE 4 HELPERS
   ════════════════════════════════════════════ */

function renderBiasCheck(){
  const items = [
    { d:'Een AI-systeem voor gezichtsherkenning werkt 99% accuraat bij lichte huidskleur, maar slechts 65% bij donkere huidskleur.', bias:true, e:'Klassiek voorbeeld van bias — de trainingsdata bevatte waarschijnlijk vooral foto\'s van mensen met een lichtere huidskleur.' },
    { d:'Een AI-systeem voorspelt het weer even accuraat voor elke stad in het land, ongeacht de grootte van de stad.', bias:false, e:'Geen aanwijzing voor bias — weersvoorspelling is gebaseerd op fysieke metingen, niet op maatschappelijke patronen.' },
    { d:'Een sollicitatie-AI geeft systematisch lagere scores aan CV\'s met namen die klinken alsof ze van een bepaalde origine zijn, ook al zijn de kwalificaties identiek.', bias:true, e:'Dit is een bekend en onderzocht probleem — namen kunnen onbedoeld invloed hebben op AI-scores door patronen in historische data.' },
    { d:'Een AI-tool die appels van peren onderscheidt op basis van vorm en kleur, getest op duizenden diverse foto\'s van beide fruitsoorten.', bias:false, e:'Fruit classificeren heeft geen maatschappelijke dimensie — hier is bias niet aan de orde op dezelfde manier.' }
  ];
  const g = document.getElementById('biascheck');
  if(!g) return;
  items.forEach((it,idx)=>{
    const card = document.createElement('div'); card.className='lm-card';
    card.innerHTML = '<div class="lm-q">'+(idx+1)+'. '+it.d+'</div><div class="lm-opts"><button class="lm-btn" data-v="ja" style="width:auto;padding:0 16px">⚠️ Mogelijke bias</button><button class="lm-btn" data-v="nee" style="width:auto;padding:0 16px">✅ Geen bias-signaal</button></div><div class="lm-fb" id="bcfb'+idx+'"></div>';
    g.appendChild(card);
    card.querySelectorAll('.lm-btn').forEach(b=>{
      b.onclick = ()=>{
        if(card.dataset.done) return;
        card.dataset.done='1';
        const v = b.dataset.v, picked_bias = v==='ja';
        const correct = picked_bias === it.bias;
        card.querySelectorAll('.lm-btn').forEach(bb=>{
          bb.disabled = true;
          const bbBias = bb.dataset.v==='ja';
          if(bbBias === it.bias) bb.classList.add('correct');
          else if(bb===b && !correct) bb.classList.add('wrong');
        });
        const fb = document.getElementById('bcfb'+idx);
        fb.className = 'lm-fb show';
        fb.textContent = (correct?'✅ Juist — ':'❌ Niet helemaal — ')+it.e;
      };
    });
  });
}

/* ════════════════════════════════════════════
   MODULE 5 HELPERS
   ════════════════════════════════════════════ */

function renderLabelMatchLeerling(){
  const items = [
    { d:'Leerlingen schrijven een opstel over hun zomervakantie, volledig met de hand, zonder enige digitale hulp.', a:1 },
    { d:'Leerlingen mogen AI gebruiken om op ideeën te komen voor een werkstuk, maar moeten zelf de volledige tekst schrijven.', a:2 },
    { d:'Leerlingen schrijven zelf een eerste versie en mogen AI enkel gebruiken om hun tekst grammaticaal te verbeteren.', a:3 },
    { d:'Leerlingen maken een infographic en mogen AI gebruiken om een deel van de illustraties of tekstblokken aan te vullen, naast hun eigen werk.', a:4 },
    { d:'Leerlingen mogen volledig vrij AI gebruiken om een marketingplan te schrijven, zolang ze achteraf kunnen uitleggen welke keuzes ze maakten.', a:5 }
  ];
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

function renderMagWelLeerling(){
  const items = [
    {
      t:'Situatie 1: Je gebruikt ChatGPT om te brainstormen over ideeën voor je werkstuk, maar schrijft de volledige tekst zelf. Je leerkracht gaf label 2 (Ideeën).',
      ok:true,
      e:'Mag — Dit is precies waarvoor label 2 bedoeld is. AI voor inspiratie, jij schrijft de tekst.'
    },
    {
      t:'Situatie 2: Bij een toets zonder AI-toestemming (label 1) gebruik je stiekem je telefoon om ChatGPT een antwoord te laten geven.',
      ok:false,
      e:'Mag NIET — dit is fraude tijdens een toets/examen. Label 1 betekent geen AI, punt uit.'
    },
    {
      t:'Situatie 3: Je kopieert een volledig ChatGPT-antwoord en levert dit in als je eigen opstel, zonder het te vermelden, bij een opdracht met label 2.',
      ok:false,
      e:'Mag NIET — dit overschrijdt het toegestane label (2 = enkel ideeën) en is bovendien plagiaat.'
    },
    {
      t:'Situatie 4: Je gebruikt Copilot (met je schoolaccount) om je eigen geschreven tekst te laten nakijken op grammaticafouten, bij een opdracht met label 3.',
      ok:true,
      e:'Mag — Label 3 (Bewerking) staat precies dit toe: AI helpt met stijl/grammatica op jouw eigen tekst.'
    },
    {
      t:'Situatie 5: Je vertelt je leerkracht eerlijk dat je AI hebt gebruikt voor een deel van je werk, ook al was dat niet verplicht om te melden.',
      ok:true,
      e:'Mag — en is zelfs aan te moedigen! Transparantie bouwt vertrouwen op, ook als het niet strikt verplicht is.'
    }
  ];
  const g = document.getElementById('magwel-leerling');
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

/* ════════════════════════════════════════════
   MODULE 6 HELPERS
   ════════════════════════════════════════════ */

function renderJobCheck(){
  const items = [
    { job:'Data-invoerder (typt gegevens over van papier naar computer)', risk:'Hoog risico', e:'Zeer routinematig en voorspelbaar — AI (met OCR-technologie) kan dit al grotendeels automatiseren.' },
    { job:'Kleuterjuf/-meester', risk:'Laag risico', e:'Vereist emotionele verbinding, fysieke zorg en aanpassing aan jonge kinderen — moeilijk te automatiseren.' },
    { job:'Basisvertaler van eenvoudige teksten', risk:'Hoog risico', e:'AI-vertaaltools worden steeds beter voor standaardteksten, al blijft nuance en context soms een uitdaging.' },
    { job:'Psycholoog / therapeut', risk:'Laag risico', e:'Vertrouwen, empathie en complexe menselijke interactie staan centraal — AI kan ondersteunen maar moeilijk vervangen.' },
    { job:'Chirurg', risk:'Laag risico', e:'Vereist fijne motoriek, jarenlange training en aansprakelijkheid — AI ondersteunt (bijv. robotchirurgie) maar vervangt niet.' }
  ];
  const g = document.getElementById('jobcheck');
  if(!g) return;
  items.forEach((it,idx)=>{
    const card = document.createElement('div'); card.className='lm-card';
    card.innerHTML = `<div class="lm-q">${idx+1}. ${it.job}</div>
      <div style="text-align:center;margin:10px 0;"><button class="sr-btn" data-idx="${idx}" style="font-size:12px;">Toon inschatting</button></div>
      <div class="lm-fb" id="jcfb${idx}"></div>`;
    g.appendChild(card);
  });
  g.querySelectorAll('button[data-idx]').forEach(b=>{
    b.onclick = ()=>{
      const idx = +b.dataset.idx, it = items[idx];
      const fb = document.getElementById('jcfb'+idx);
      fb.className = 'lm-fb show';
      const color = it.risk==='Hoog risico' ? 'var(--red)' : 'var(--green)';
      fb.innerHTML = '<strong style="color:'+color+'">'+it.risk+'</strong> — '+it.e;
      b.disabled = true;
    };
  });
}
