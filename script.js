/* ════════════════════════════════════════════
   AI-Cursus Sint-Rembert — script.js
   M1 Wat is AI (verplicht, 5 stappen)
   M2 Beleid & Leerlingen (verplicht, 5 stappen — incl. AI-bestendig ontwerpen)
   M3 Copilot in de praktijk (OPTIONEEL, 8 stappen — hands-on)
   Certificaat: na M1+M2, slechts 1× downloadbaar
   Features v2: Vorige-navigatie, evenwichtige quizzes, samenvatting downloaden
   ════════════════════════════════════════════ */

// ── INSCHRIJFLINK PROFESSIONALISERING (op 1 plek aanpassen) ──
const INSCHRIJF = 'https://VERVANG-DOOR-JULLIE-INSCHRIJFLINK';

// ── STATE (+ migratie van v7/v6) ──
const K = 'sr_ai_v8';
let S = { name:'', starttest:{taken:false, score:0, passed:false}, mod1:{step:0,done:false,skipped:false}, mod2:{step:0,done:false}, mod3:{step:0,done:false}, certPrinted:false };
function ld(){
  try{
    const s = localStorage.getItem(K);
    if(s){ S = Object.assign(S, JSON.parse(s)); return; }
    const oud = localStorage.getItem('sr_ai_v7') || localStorage.getItem('sr_ai_v6');
    if(oud){
      const o = JSON.parse(oud);
      S.name = o.name || '';
      S.certPrinted = !!o.certPrinted;
      ['mod1','mod2','mod3'].forEach(m=>{ if(o[m] && o[m].done) S[m].done = true; });
      ss();
    }
  }catch(e){}
}
function ss(){ try{ localStorage.setItem(K, JSON.stringify(S)); }catch(e){} }
ld();

document.getElementById('un').value = S.name || '';
function ua(){ const n = (document.getElementById('un').value||'').trim(); document.getElementById('av').textContent = n ? n.charAt(0).toUpperCase() : '?'; }
function sn(){ S.name = document.getElementById('un').value.trim(); ss(); ua(); }
ua(); up(); rmc();

// ── PROGRESS / NAV ──
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
}
function rmc(){
  if(S.mod1.done){ document.getElementById('cm1').classList.add('done'); document.getElementById('bm1').textContent='↺ Herhalen'; document.getElementById('ps1').className='mc-stat ok'; document.getElementById('ps1').textContent='✓ Voltooid'; }
  if(S.mod1.done){ document.getElementById('cm2').classList.remove('locked'); document.getElementById('bm2').disabled=false; document.getElementById('bm2').textContent='▶ Start'; if(!S.mod2.done){ document.getElementById('ps2').className='mc-stat'; document.getElementById('ps2').textContent='Beschikbaar'; } }
  if(S.mod2.done){ document.getElementById('cm2').classList.add('done'); document.getElementById('bm2').textContent='↺ Herhalen'; document.getElementById('ps2').className='mc-stat ok'; document.getElementById('ps2').textContent='✓ Voltooid'; }
  if(S.mod3.done){ document.getElementById('cm3').classList.add('done'); document.getElementById('bm3').textContent='↺ Herhalen'; document.getElementById('ps3').className='mc-stat ok'; document.getElementById('ps3').textContent='✓ Voltooid'; }
}

// ── VIEWS ──
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
  if(n===1){ rm1(); sv('mod1'); }
  else if(n===2 && S.mod1.done){ rm2(); sv('mod2'); }
  else if(n===2){ alert('Voltooi eerst module 1.'); }
  else if(n===3){ rm3(); sv('mod3'); }
}
function tm(n){
  if(!S.starttest.taken){ goStartTest(); return; }
  if(n===2 && S.mod1.done) sm(2); else alert('Voltooi eerst module 1.');
}
function goHome(){ if(!S.starttest.taken){ goStartTest(); return; } sv('home'); }
function goStartTest(){ renderStartTest(); sv('starttest'); }
function tryC(){ (S.mod1.done && S.mod2.done) ? sv('cert') : alert('Voltooi eerst de 2 verplichte modules (1 en 2).'); }
function rDots(m,tot,cur){
  const c = document.getElementById('sd'+m); if(!c) return; c.innerHTML='';
  for(let i=0;i<tot;i++){ const d=document.createElement('div'); d.className='dot '+(i<cur?'done':i===cur?'active':''); c.appendChild(d); }
}

// ── HERBRUIKBARE PROMO ──
function promoMini(tekst){
  return '<div class="promo-mini"><div class="promo-mini-icon">🚀</div><div style="flex:1"><div class="promo-mini-title">Professionaliseringsplan Sint-Rembert</div><div class="promo-mini-desc">'+tekst+'</div></div><a class="promo-mini-btn" href="'+INSCHRIJF+'" target="_blank">Schrijf in</a></div>';
}

// ── CERTIFICAAT & DE DOWNLOAD SAMENVATTING LOGIC ──
function rc(){
  document.getElementById('cert-name').textContent = S.name || 'Leerkracht';
  document.getElementById('cert-date').textContent = new Date().toLocaleDateString('nl-BE',{day:'numeric',month:'long',year:'numeric'});
  const btn = document.getElementById('print-cert-btn');
  const info = document.getElementById('cert-dl-info');
  if(S.certPrinted){
    btn.disabled = true; btn.textContent = '✓ Certificaat al gedownload';
    info.textContent = 'Je hebt je certificaat al gedownload. Zoek het opgeslagen PDF-bestand en upload het op Smartschool.';
    info.style.color = '#2d6a00';
  } else { btn.disabled=false; btn.textContent='🖨️ Download certificaat (PDF)'; info.textContent=''; }
}

function doCertPrint(){
  if(S.certPrinted){ alert('Je hebt je certificaat al gedownload. Zoek het PDF-bestand dat je eerder opsloeg en upload het op Smartschool. Lukt dat niet? Contacteer je pedagogisch ICT-coördinator.'); return; }
  if(!S.name || !S.name.trim()){
    if(!confirm('Je naam is nog niet ingevuld (links onderaan in de zijbalk). Het certificaat vermeldt dan "Leerkracht".\n\nToch doorgaan? Dit kan maar één keer.')) return;
  } else {
    if(!confirm('Let op: je kan je certificaat slechts ÉÉN keer downloaden.\n\nNaam op certificaat: ' + S.name + '\n\nKies in het afdrukvenster "Opslaan als PDF" en bewaar het bestand meteen. Doorgaan?')) return;
  }
  S.certPrinted = true; ss();
  rc();
  window.print();
}

function downloadSummary() {
  const r1 = localStorage.getItem('sr_r1') || 'Geen reflectie ingevuld.';
  const r3 = localStorage.getItem('sr_r3') || 'Geen reflectie ingevuld.';
  const r2 = localStorage.getItem('sr_r2') || 'Geen reflectie ingevuld.';
  const name = S.name || 'Anonieme Leerkracht';

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
  txt += `Jouw inzicht / Vakspecifieke vertaalslag:\n`;
  txt += `${r1}\n\n`;

  txt += `--------------------------------------------------\n`;
  txt += `MODULE 2: BELEID & LEERLINGEN BEGELEIDEN\n`;
  txt += `--------------------------------------------------\n`;
  txt += `Resultaat Kennischeck: ${S.mod2.quizScore || 'Nog niet behaald'}%\n\n`;
  txt += `Jouw concrete actiestap voor de komende maand:\n`;
  txt += `${r3}\n\n`;

  txt += `--------------------------------------------------\n`;
  txt += `MODULE 3: COPILOT IN DE PRAKTIJK (OPTIONEEL)\n`;
  txt += `--------------------------------------------------\n`;
  txt += `Resultaat Kennischeck: ${S.mod3.quizScore || 'Nog niet behaald'}%\n\n`;
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
   STARTTEST — verplichte poort vóór Module 1
   10 vragen · slaagdrempel 80% (8/10) · 1 kans
   Slagen ⇒ Module 1 wordt overgeslagen, start bij Module 2
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
    if(passed){ S.mod1.done = true; S.mod1.skipped = true; }
    ss(); up(); rmc();
    const r=document.getElementById(id+'-r');
    r.className='q-res show';
    r.innerHTML = '<div class="q-score '+(passed?'pass':'fail')+'">'+sc+'%</div><div class="q-msg">'+(passed?'✅ Geslaagd! Module 1 wordt overgeslagen.':'Nog niet voldoende — Module 1 is vereist.')+'</div>';
    const nb=document.getElementById(id+'-n');
    nb.textContent = passed ? 'Naar Module 2 →' : 'Start Module 1 →';
    nb.disabled = false;
    nb.onclick = ()=> passed ? sm(2) : sm(1);
  };
}

/* ════════════════════════════════════════════
   MODULE 1 — WAT IS AI? (5 stappen)
   ════════════════════════════════════════════ */
const m1 = [m1s0, m1s1, m1s2, m1s3, m1s4, m1s5];
function rm1(){ const c=document.getElementById('m1c'); c.innerHTML=''; rDots(1,m1.length,S.mod1.step); m1[S.mod1.step](c); }
function n1(){ S.mod1.step++; ss(); S.mod1.step>=m1.length ? d1() : rm1(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); }
function p1(){ if(S.mod1.step > 0){ S.mod1.step--; ss(); rm1(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); } }
function d1(){ S.mod1.done=true; S.mod1.step=0; ss(); up(); rmc(); sv('home'); setTimeout(()=>alert('🎉 Module 1 voltooid! Module 2 is nu beschikbaar.'),300); }

function m1s0(c){
  c.innerHTML = `
<div class="s-badge">🤖 Stap 1 van 6 · AI overal</div>
<h2 class="ch2">AI is <em>overal</em> — ook al zie je het niet</h2>
<p class="cp">Gezichtsherkenning op je telefoon, de spamfilter in je mailbox, aanbevelingen op YouTube, de routeplanner die files voorspelt — <strong>AI zit al jaren in onze dagelijkse tools</strong>. En sinds de doorbraak van ChatGPT eind 2022 ook steeds nadrukkelijker in het onderwijs: leerlingen gebruiken chatbots voor taken, uitgeverijen bouwen AI in leerplatformen in, en collega's experimenteren met AI voor lesvoorbereiding.</p>
<p class="cp">Maar wat is AI eigenlijk? In de kern is het software die patronen leert herkennen uit grote hoeveelheden data, en op basis daarvan voorspellingen of beslissingen maakt — zonder dat een mens voor elke situatie apart een regel heeft geprogrammeerd. Dat onderscheidt AI van klassieke software, die enkel doet wat letterlijk in de code staat.</p>
<p class="cp">Als leerkracht hoef je geen ingenieur te zijn, maar je moet AI wel kunnen <strong>herkennen, benoemen en er verantwoord mee omgaan</strong>. Dat is ook wat artikel 4 van de EU AI Act van organisaties — en dus van ons als school — verwacht: voldoende AI-geletterdheid bij iedereen die met AI werkt. Het Kenniscentrum Digisprong en Kennisnet wijzen er bovendien op dat die geletterdheid niet enkel technisch is: ze omvat ook kritisch nadenken over wanneer je een tool wél, en wanneer je hem net niet inzet.</p>

<div class="ib warn">
  <div class="ib-t">💡 Wist je dat?</div>
  <div class="ib-b">Veel digitale schooltools die je al jarenlang gebruikt — spellingcontrole, automatische ondertiteling, een planningstool die voorstelt wanneer je best een toets plant — draaien al langer op AI dan ChatGPT bestaat. Het nieuwe is niet "AI in het onderwijs" op zich, maar specifiek <strong>generatieve AI</strong>, die zelf nieuwe content kan maken. Daarover gaat de volgende stap.</div>
</div>

<h3 class="ch3">🎬 Video: Intro Artificiële Intelligentie — EDUbox (VRT NWS)</h3>
<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/yo1g2B5E4W8" allowfullscreen loading="lazy" title="EDUbox AI Intro door Tom Van de Weghe"></iframe></div>

<h3 class="ch3">🧩 Doe-opdracht: AI of geen AI?</h3>
<p class="cp">Klik op elke kaart en denk eerst zelf na: gebruikt deze toepassing AI, of werkt ze met vaste, vooraf geprogrammeerde regels?</p>
<div id="aig"></div>

<div class="nw">
  <button class="sr-btn g" onclick="n1()">Volgende: van regels naar GenAI →</button>
  <span class="nh">Stap 1/5</span>
</div>`;
  renderAiCards();
}

function m1s1(c){
  c.innerHTML = `
<div class="s-badge">📚 Stap 2 van 6 · Geschiedenis & GenAI</div>
<h2 class="ch2">Van vaste regels naar <em>Generatieve AI</em></h2>
<p class="cp">AI bestaat al sinds de jaren 50, en kende eerder al grote doorbraken — denk aan schaakcomputer Deep Blue die in 1997 wereldkampioen Kasparov verslaat. Maar die vroege AI kon vooral één ding: <strong>classificeren of voorspellen</strong>. Is dit e-mailbericht spam? Welke film zou jij waarderen? Het systeem koos tussen vooraf gedefinieerde opties.</p>
<p class="cp">De sprong naar <strong>generatieve AI</strong> (GenAI) verandert dat fundamenteel: deze systemen kunnen tekst, beeld, audio en code <em>maken die nog niet bestond</em>. ChatGPT haalde na zijn lancering eind 2022 razendsnel honderd miljoen gebruikers — geen enkele consumententoepassing groeide ooit zo snel. Sindsdien zijn gelijkaardige tools (Copilot, Gemini, Claude...) overal doorgedrongen, ook in scholen.</p>
<p class="cp">Technisch gezien werkt een taalmodel als GenAI met <strong>kansberekening</strong>: op basis van enorme hoeveelheden tekst leert het systeem welk woord statistisch het meest waarschijnlijk volgt op de woorden die er al staan. Het "begrijpt" dus niet in de menselijke zin van het woord — het voorspelt, woord na woord, wat een plausibel vervolg zou zijn.</p>

<div class="ib warn">
  <div class="ib-t">⚠️ Hallucinaties — het belangrijkste begrip van deze module</div>
  <div class="ib-b">Omdat GenAI altijd het meest waarschijnlijke volgende woord voorspelt, klinkt de output <strong>altijd zelfverzekerd</strong> — ook wanneer ze feitelijk fout is. Dat noemen we een <strong>hallucinatie</strong>: verzonnen informatie die er volkomen betrouwbaar uitziet. Een AI-tool kan bijvoorbeeld een wetenschappelijke studie "citeren" met auteur, titel en jaartal — die er gewoonweg niet bestaat. Het systeem "verzint" niet bewust; het stelt enkel een plausibel vervolg samen, zonder enige garantie dat het ook waar is.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: kansen & gevaren →</button>
  <span class="nh">Stap 2/5</span>
</div>`;
}

function m1s2(c){
  c.innerHTML = `
<div class="s-badge">⚠️ Stap 3 van 6 · Kansen & gevaren</div>
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

<h3 class="ch3">🎲 Bias — een concreet voorbeeld voor in de klas</h3>
<p class="cp">Vraag een beeldgenerator: <em>"Teken een CEO."</em> De kans is groot dat je een witte man van middelbare leeftijd krijgt. Vraag <em>"Teken een verpleegkundige"</em> en je krijgt hoogstwaarschijnlijk een vrouw. De AI verzint dit niet uit het niets — ze reproduceert maatschappelijke stereotypen die in haar trainingsdata oversterk vertegenwoordigd zijn. Dit soort voorbeeld is een krachtig en heel concreet aanknopingspunt om bias met leerlingen te bespreken: het is meteen zichtbaar, het is herkenbaar, en het opent een gesprek over hoe data onze blik kan vertekenen.</p>

<h3 class="ch3">🎭 Deepfakes — wanneer "zien is geloven" niet meer geldt</h3>
<p class="cp">Een deepfake is beeld, video of audio waarin AI het gezicht, de stem of de bewegingen van een bestaand persoon overtuigend nadoet. Voor leerlingen is dit relevant op twee niveaus: enerzijds als bewustmaking ("niet alles wat je ziet is automatisch echt"), anderzijds als concreet risico — gezichten manipuleren of onschuldig lijkende filters toepassen op foto's van klasgenoten valt onder de privacywetgeving (AVG/GDPR) en kan leiden tot pesterijen. Maak dit als leerkracht expliciet duidelijk, en handel kordaat als het toch gebeurt.</p>

${promoMini('Wil je dieper graven in de ethische kant van AI? Op 18 november verwelkomen we prof. Orhan Agirdag (KU Leuven).')}

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: hype of realiteit? →</button>
  <span class="nh">Stap 3/6</span>
</div>`;
}

function m1s3(c){
  c.innerHTML = `
<div class="s-badge">🎬 Stap 4 van 6 · Hype of realiteit?</div>
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
<p class="cp">Leerlingen zien op sociale media de wildste doemscenario's over AI — en evengoed de wildste belofes. Om het gesprek hierover goed te starten (met collega's, of in je eigen klas), gebruiken we twee contrasterende videofragmenten met telkens vijf reflectievragen.</p>

<h3 class="ch3">🎬 Video 1 — NOS op 3: "Roeit AI ons uit… of is het hype?"</h3>
<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/-WDdSiVjBhg" allowfullscreen loading="lazy" title="NOS op 3 — Roeit AI ons uit of is het hype"></iframe></div>
<p class="cp">Deze video plaatst de extreme doemscenario's rondom AI in perspectief en verlegt de focus naar de échte, actuele uitdagingen zoals misinformatie en tech-hypes.</p>

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

<h3 class="ch3">🎬 Video 2 — Arjen Lubach: "Valt het onderwijs nog te redden van AI?"</h3>
<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/xpedFIZFmhc" allowfullscreen loading="lazy" title="Arjen Lubach — Valt het onderwijs nog te redden van AI"></iframe></div>
<p class="cp">Deze video toont op scherpe (en humoristische) wijze hoe AI de dagelijkse lespraktijk en het traditionele huiswerk volledig op zijn kop zet.</p>

<div class="disc-card">
  <div class="disc-q">1. Lubach laat zien dat traditioneel huiswerk steeds vaker door een chatbot wordt gedaan. Is dit niet het uitgelezen moment om onze manier van lesgeven om te gooien?</div>
  <div class="disc-a">Absoluut. Het reproduceren van theorie als thuiswerk heeft zijn langste tijd gehad. Dit dwingt de overstap naar flipping the classroom: basiskennis thuis, verwerking en toetsing in de klas waar jij direct kan bijsturen.</div>
</div>
<div class="disc-card">
  <div class="disc-q">2. Als leerlingen de stof thuis door AI kunnen laten uitleggen, hoe maken we de contacttijd in het klaslokaal dan zo waardevol mogelijk?</div>
  <div class="disc-a">De lestijd wordt de plek voor échte interactie: samen dieper ingaan op de 'waarom'-vraag, fouten analyseren en het leerproces in dialoog zichtbaar maken — in plaats van eenrichtingsverkeer waarbij jij theorie zendt.</div>
</div>
<div class="disc-card">
  <div class="disc-q">3. Leraren zoeken wanhopig naar AI-detectiesoftware. Is het spelen van politieagent de juiste weg, of moeten we onze evaluatie anders inrichten?</div>
  <div class="disc-a">Spelen voor politieagent is een wapenwedloop die we als onderwijs gaan verliezen. De duurzame oplossing is procesgericht evalueren: toetsen op wat leerlingen ter plekke in de klas, mondeling of op papier kunnen demonstreren.</div>
</div>
<div class="disc-card">
  <div class="disc-q">4. Hoe zorgen we ervoor dat leerlingen minder snel de neiging hebben om denkwerk blind uit te besteden aan AI?</div>
  <div class="disc-a">Leg de volledige nadruk op het waarom. Begrijpen leerlingen waarom een vaardigheid cruciaal is voor hun ontwikkeling of latere carrière, dan groeit de intrinsieke motivatie en zien ze in dat ze zichzelf tekortdoen door denkwerk over te slaan.</div>
</div>
<div class="disc-card">
  <div class="disc-q">5. Lubach maakt een grap over "hersenfitness". Welke actieve werkvormen kunnen we gebruiken om leerlingen écht zelf te laten nadenken?</div>
  <div class="disc-a">Keer regelmatig bewust terug naar analoog werken: socratische gesprekken in de kring, fysieke werkvormen of peer-feedbacksessies zonder schermen, zodat het brein gedwongen wordt zelf oplossingen te formuleren.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: kennischeck →</button>
  <span class="nh">Stap 4/6</span>
</div>`;
}

function m1s4(c){
  // EQUAL LENGTH AND VARIABLE ANSWERS FOR QUIZ 1
  const quiz = [
    {
      q: 'Wat is een hallucinatie bij generatieve AI?',
      o: [
        'Wanneer een AI-model weigert antwoord te geven op een ongepaste of onveilige vraag van een gebruiker.',
        'Wanneer een AI-model met grote stelligheid feitelijk onjuiste of verzonnen informatie genereert.',
        'Wanneer een AI-model tijdelijk trager werkt door een overbelasting van de servers of slechte internetverbinding.',
        'Wanneer een AI-model letterlijke tekstblokken overneemt uit de auteursrechtelijk beschermde trainingsdata.'
      ],
      a: 1,
      f: 'Hallucinaties zijn plausibel klinkende maar foutieve output — een direct gevolg van voorspellen op kansberekening.'
    },
    {
      q: 'Welke AI-tool is binnen Sint-Rembert volledig ondersteund en dataproof?',
      o: [
        'De gratis consumentenversie van ChatGPT via een persoonlijk Google- of e-mailaccount.',
        'Google Gemini Advanced mits er ingelogd wordt met een geverifieerd privé-account.',
        'Copilot M365 wanneer je bent aangemeld met je officiële schoolaccount van de scholengroep.',
        'Midjourney Commercial Edition die door de vakgroep esthetica apart wordt aangekocht.'
      ],
      a: 2,
      f: 'Copilot via je schoolaccount valt onder de schoolovereenkomst met gegarandeerde gegevensbescherming.'
    },
    {
      q: 'Wat is de grote sprong van generatieve AI t.o.v. eerdere AI-vormen?',
      o: [
        'Generatieve AI kan volledig nieuwe content creëren zoals vloeiende teksten, afbeeldingen, audio en programmeercode.',
        'Generatieve AI werkt aanzienlijk sneller en vereist veel minder rekenkracht en servercapaciteit om te draaien.',
        'Generatieve AI maakt dankzij de nieuwste taalmodellen nooit meer inhoudelijke fouten of logische misvattingen.',
        'Generatieve AI is uitsluitend geprogrammeerd op basis van door mensen handmatig ingevoerde als-dan-regels.'
      ],
      a: 0,
      f: 'Vroegere AI classificeerde en voorspelde; GenAI creëert nieuwe content.'
    },
    {
      q: 'Waarom is bias in AI relevant voor jouw dagelijkse lespraktijk?',
      o: [
        'Omdat AI-modellen hiermee trager worden in het verwerken van complexe opdrachten van leerlingen.',
        'Omdat AI hiermee stereotypen uit trainingsdata reproduceert, wat een belangrijk mediawijsheidsthema is.',
        'Omdat bias er onbedoeld voor zorgt dat gratis tools minder functies hebben dan betaalde licenties.',
        'Omdat AI hierdoor automatisch een voorkeur ontwikkelt voor Engelstalige bronnen boven Nederlandstalige.'
      ],
      a: 1,
      f: 'AI leert van data vol menselijke vooroordelen. Dit bespreken met leerlingen trainen hun mediawijsheid.'
    },
    {
      q: 'Een AI-tekst vermeldt een wetenschappelijke studie met auteur en jaartal. Wat is de juiste reflex?',
      o: [
        'De bron blindelings overnemen in je lesmateriaal, want een vermelding met jaartal en auteur is betrouwbaar.',
        'De genoemde bron zelfstandig opzoeken via betrouwbare kanalen om te controleren of deze daadwerkelijk bestaat.',
        'Enkel controleren of het jaartal logisch is binnen de historische context van de rest van de tekst.',
        'In dezelfde chat aan de AI-tool vragen of de zojuist gegenereerde bronvermelding wel echt helemaal klopt.'
      ],
      a: 1,
      f: 'Verzonnen bronvermeldingen zijn een klassieke hallucinatie. Zelf controleren is noodzakelijk.'
    }
  ];
  rQuiz(c, quiz, 1, 'mod1', n1, 60);
}

function m1s5(c){
  c.innerHTML = `
<div class="s-badge">✍️ Stap 6 van 6 · Vertaalslag naar jouw vak</div>
<h2 class="ch2">Vertaal naar <em>jouw lespraktijk</em></h2>
<p class="cp">Je kent nu de basis: hoe AI werkt, wat generatieve AI bijzonder maakt, en welke kansen én gevaren erbij horen (hallucinaties, bias, deepfakes, privacy). Tijd om dit concreet te maken voor jouw eigen vak en klaspraktijk.</p>
<p class="cp">Noteer hieronder je reflectie (minstens een paar zinnen): bij welke les of taak zou AI écht meerwaarde bieden? En waar zou je het net bewust <strong>niet</strong> inzetten, en waarom niet?</p>
<textarea class="sr-ta" id="r1" placeholder="Ik denk aan mijn les... AI zou meerwaarde hebben bij... AI zou ik uitsluiten bij... omdat..."></textarea>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" id="r1btn" onclick="sR1()">✅ Module 1 afronden →</button>
  <span class="nh">Stap 6/6</span>
</div>`;
  const ta = document.getElementById('r1');
  ta.value = localStorage.getItem('sr_r1') || '';
  ta.oninput = ()=>localStorage.setItem('sr_r1', ta.value);
}
function sR1(){
  const v = (document.getElementById('r1').value||'').trim();
  if(v.length < 30){ alert('Vul eerst je reflectie in (minstens een paar zinnen).'); return; }
  n1();
}

/* ════════════════════════════════════════════
   MODULE 2 — BELEID & LEERLINGEN (5 stappen)
   ════════════════════════════════════════════ */
const m2 = [m2s0, m2s1, m2s2, m2s3, m2s4];
function rm2(){ const c=document.getElementById('m2c'); c.innerHTML=''; rDots(2,m2.length,S.mod2.step); m2[S.mod2.step](c); }
function n2(){ S.mod2.step++; ss(); S.mod2.step>=m2.length ? d2() : rm2(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); }
function p2(){ if(S.mod2.step > 0){ S.mod2.step--; ss(); rm2(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); } }
function d2(){ S.mod2.done=true; S.mod2.step=0; ss(); up(); rmc(); sv('cert'); }

function m2s0(c){
  c.innerHTML = `
<div class="s-badge">🛡️ Stap 1 van 5 · Spelregels & AI-labels</div>
<h2 class="ch2">Het AI-beleid van <em>Sint-Rembert</em></h2>
<p class="cp">Niet elke opdracht leent zich tot AI-gebruik, en niet elke leerling zal vanzelf aanvoelen waar de grens ligt. Daarom werkt Sint-Rembert met <strong>5 duidelijke AI-labels</strong> die je aan een taak of opdracht koppelt, zodat voor leerlingen meteen helder is wat wel en niet mag.</p>
<div class="labels-grid">
  <div class="label-card l1"><div class="lc-num">1</div><div class="lc-name">Geen AI</div></div>
  <div class="label-card l2"><div class="lc-num">2</div><div class="lc-name">Ideeën</div></div>
  <div class="label-card l3"><div class="lc-num">3</div><div class="lc-name">Bewerking</div></div>
  <div class="label-card l4"><div class="lc-num">4</div><div class="lc-name">Aanvulling</div></div>
  <div class="label-card l5"><div class="lc-num">5</div><div class="lc-name">Vrij</div></div>
</div>
<p class="cp">De labels lopen op van strikt verbod (label 1) tot volledig vrij AI-gebruik (label 5), met daartussen geleidelijk meer ruimte: van AI enkel inzetten om op ideeën te komen, over AI gebruiken om een eigen tekst te verbeteren of aan te vullen, tot uiteindelijk AI volwaardig inzetten als onderdeel van het eindresultaat. Deze schaal is gebaseerd op de AI-gebruiksschaal die Schoolmakers ontwikkelde naar het model van onderzoeker Leon Furze (Universiteit van Melbourne), en wordt door steeds meer Vlaamse scholen gebruikt als praktisch hulpmiddel.</p>

<div class="ib warn">
  <div class="ib-t">🎯 Hoe pas je dit toe?</div>
  <div class="ib-b">Vermeld het label gewoon bovenaan de opdracht: "Label 2 — AI mag enkel voor brainstorm/ideeën." Zo weet de leerling perfect waaraan hij zich moet houden, en kan jij achteraf objectief beoordelen of de regels gevolgd zijn.</div>
</div>

<div class="nw">
  <button class="sr-btn g" onclick="n2()">Volgende: leerlingen begeleiden →</button>
  <span class="nh">Stap 1/5</span>
</div>`;
}

function m2s1(c){
  c.innerHTML = `
<div class="s-badge">🧑‍🏫 Stap 2 van 5 · Leerlingen begeleiden</div>
<h2 class="ch2">Zo begeleid je <em>leerlingen</em> bij AI</h2>
<p class="cp">Leerlingen experimenteren sowieso met AI — met of zonder jouw toestemming. De meest effectieve aanpak is daarom niet verbieden en hopen dat het niet gebeurt, maar <strong>transparant zijn en kritisch denken trainen</strong>. Bespreek openlijk wanneer AI wel en niet aan de orde is, en waarom.</p>
<p class="cp">Een goede vraag om samen met leerlingen te beantwoorden: "Als ik dit met AI maak, leer ik dan nog iets?" Bij een taak die vooral het denkproces moet trainen (een eigen argumentatie opbouwen, een wiskundig bewijs voeren) ondermijnt AI-gebruik het leerdoel zelf. Bij een taak die vooral een eindproduct vraagt (een infographic, een samenvatting van bestaande informatie) ligt dat genuanceerder.</p>

<div class="ib warn">
  <div class="ib-t">⚠️ Over AI-detectietools: wees voorzichtig</div>
  <div class="ib-b">Tools die beweren AI-tekst te herkennen zijn <strong>onbetrouwbaar</strong>. Ze leveren regelmatig valse beschuldigingen op — vooral bij leerlingen die formeel of gestructureerd schrijven, of bij niet-moedertaalsprekers van het Nederlands. Bovendien schend je de privacy van leerlingen als je hun volledige naam samen met hun tekst in zo'n online tool plaatst. Vertrouw bij een vermoeden van AI-gebruik liever op je kennis van de leerling: ken je zijn of haar normale schrijfstijl, en wijkt deze tekst daar sterk van af?</div>
</div>

<h3 class="ch3">💬 Een eerlijk gesprek voeren</h3>
<p class="cp">Een leerling vraagt je weleens: "Hebt u dit met AI gemaakt?" De beste reflex is eerlijkheid: leg uit hoe je de tool als hulpmiddel hebt ingezet, en hoe je zelf de output hebt gecontroleerd en aangepast. Dat maakt je een rolmodel voor het transparante, kritische AI-gebruik dat je ook van leerlingen verwacht.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="n2()">Volgende: AI-bestendig ontwerpen →</button>
  <span class="nh">Stap 2/5</span>
</div>`;
}

function m2s2(c){
  c.innerHTML = `
<div class="s-badge">🔧 Stap 3 van 5 · AI-bestendig ontwerpen</div>
<h2 class="ch2">Maak je opdrachten <em>AI-bestendig</em></h2>
<p class="cp">Achteraf controleren of een leerling AI gebruikte, is lastig en onbetrouwbaar (zie vorige stap). Veel effectiever: ontwerp je opdracht zo dat ze <strong>het leerproces zichtbaar maakt</strong>, in plaats van enkel op het eindproduct te focussen. Drie concrete technieken:</p>

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

<p class="cp">Voor elk AI-label kan je het ontwerp aanpassen: bij <strong>label 1 (geen AI)</strong> werk je het best met een klasmoment of een handgeschreven kladversie. Bij <strong>labels 2-3 (ideeën/bewerking)</strong> vraag je de brainstorm of de eerste versie mee in te leveren, zodat het verschil met de AI-bewerkte eindversie zichtbaar blijft. Bij <strong>labels 4-5 (aanvulling/vrij)</strong> ligt de focus op kritische reflectie: wat heeft de leerling zelf bijgedragen, en wat heeft hij gecontroleerd of aangepast aan de AI-output?</p>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="n2()">Volgende: kennischeck →</button>
  <span class="nh">Stap 3/5</span>
</div>`;
}

function m2s3(c){
  // EQUAL LENGTH AND DIVERSIFIED TRUE INDEXES FOR QUIZ 2
  const quiz = [
    {
      q: 'Een leerling gebruikt AI bij een taak met label 1 ("Geen AI"). Wat doe je?',
      o: [
        'De situatie negeren och de taak gewoon normaal verbeteren, aangezien bijna alle leerlingen AI gebruiken.',
        'Dit behandelen als een onregelmatigheid conform het schoolreglement, net zoals bij klassiek afkijken of fraude.',
        'Stilzwijgend en zonder communicatie een aantal punten aftrekken van het eindresultaat voor deze opdracht.',
        'De leerling verplichten om vanaf nu alle toekomstige taken voor jouw vak verplicht met pen en papier in te dienen.'
      ],
      a: 1,
      f: 'Label 1 = verbod. AI-gebruik is dan een onregelmatigheid conform het schoolreglement.'
    },
    {
      q: 'Een leerling vraagt: "Hebt u dit lesplan met AI gemaakt?" Wat is de beste pedagogische reactie?',
      o: [
        'Eerlijk antwoorden en open uitleggen hoe je de tool hebt ingezet als hulpmiddel en hoe je de output hebt gecontroleerd.',
        'De vraag resoluut ontkennen om je professionele gezag en geloofwaardigheid ten opzichte van de klas te bewaren.',
        'Kort meedelen dat de achterliggende lesvoorbereiding en werkmethoden van de leerkracht de leerling niet aangaan.',
        'De vraag ontwijken en snel overgaan tot de orde van de dag om een discussie over AI-gebruik te vermijden.'
      ],
      a: 0,
      f: 'Transparantie is een kernprincipe. Eerlijk antwoorden maakt je een perfect rolmodel.'
    },
    {
      q: 'Wat moeten leerlingen ALTIJD vermelden bij AI-gebruik onder de labels 2 tot en met 5?',
      o: [
        'Helemaal niets, aangezien het gebruik van digitale hulpmiddelen tot de privésfeer van de leerling behoort.',
        'Enkel de exacte naam van de gebruikte tool (bijvoorbeeld Copilot of ChatGPT) in de voetnoot van hun document.',
        'Ondubbelzinnig noteren welke specifieke AI-middelen ze hebben ingezet en op welke manier (transparantieverplichting).',
        'Niets vermelden tijdens het inleveren, tenzij de leerkracht er bij het verbeteren achteraf expliciet naar vraagt.'
      ],
      a: 2,
      f: 'Transparantie is verplicht volgens de bundel onderzoeksvaardigheden.'
    },
    {
      q: 'Wat maakt een schriftelijke opdracht het meest AI-bestendig bij het ontwerpen?',
      o: [
        'Een aanzienlijk hoger minimaal woordenaantal eisen, zodat de AI de tekst niet zomaar kan genereren.',
        'Het leerproces zichtbaar en onmisbaar maken door het te koppelen aan persoonlijke, lokale of actuele context.',
        'Standaard een online AI-detectietool gebruiken tijdens het verbeteren van de ingeleverde eindproducten.',
        'Alle opdrachten en opstellen voortaan uitsluitend nog handgeschreven laten maken tijdens de lesuren.'
      ],
      a: 1,
      f: 'Ontwerp wint van controle. Persoonlijke context maakt AI-kopieën onmogelijk.'
    },
    {
      q: 'Een collega wilt leerlingenteksten met namen door een AI-detector halen. Wat is het grootste bezwaar?',
      o: [
        'Online AI-detectietools zijn te duur in aanschaf en kosten de scholengroep te veel licentiegeld.',
        'Het kost te veel administratieve tijd om alle teksten handmatig in de online tools te kopiëren en plakken.',
        'Detectietools zijn aantoonbaar onbetrouwbaar én je schendt de privacy door persoonsgegevens in een niet-goedgekeurde tool te voeren.',
        'Er is inhoudelijk geen enkel bezwaar, mits de leerkracht de student achteraf de kans geeft om zich mondeling te verdedigen.'
      ],
      a: 2,
      f: 'AI-detectoren zijn onbetrouwbaar en persoonsgegevens uploaden schendt GDPR-afspraken.'
    },
    {
      q: 'Je wilt AI-feedback op de tekst van leerling "Jonas D.". Wat is de juiste werkwijze?',
      o: [
        'De volledige naam en de tekst integraal in de gratis consumentenversie van ChatGPT plaatsen.',
        'De tekst volledig anonimiseren en vervolgens Copilot M365 met je officiële schoolaccount gebruiken.',
        'Uit principe nooit AI-tools gebruiken voor het formuleren van feedback op het werk van leerlingen.',
        'Een willekeurige gratis online tool gebruiken die specifiek is ontworpen voor automatische feedback.'
      ],
      a: 1,
      f: 'Geanonimiseerde teksten mogen in de beveiligde Copilot M365 omgeving.'
    },
    {
      q: 'Waarom geldt AI die leerlingen evalueert als "hoog-risico" onder de EU AI Act?',
      o: [
        'Omdat dit soort geavanceerde AI-software veel duurder is in licenties dan systemen met een minimaal risico.',
        'Omdat deze beslissingen een grote impact hebben op de toekomst van leerlingen; de eindverantwoordelijkheid moet bij de mens liggen.',
        'Omdat de servers die deze zware evaluatiemodellen draaien extreem veel elektriciteit en koelwater verbruiken.',
        'Dat klopt niet, systemen die gebruikt worden binnen het onderwijs vallen altijd onder de categorie met minimaal risico.'
      ],
      a: 1,
      f: 'Beslissingen over leerresultaten hebben grote invloed. De leerkracht behoudt altijd de eindverantwoording.'
    }
  ];
  rQuiz(c, quiz, 2, 'mod2', n2, 70);
}

function m2s4(c){
  c.innerHTML = `
<div class="s-badge">🏁 Stap 5 van 5 · Praktijkscenario's & afronding</div>
<h2 class="ch2">Jouw sluitende <em>actiestap</em></h2>
<p class="cp">Je kent nu de 5 AI-labels, weet hoe je leerlingen op een transparante en pedagogisch zinvolle manier begeleidt, en hoe je een opdracht AI-bestendig ontwerpt door het proces zichtbaar te maken. Maak dit concreet: kies één actiestap die je de komende maand effectief uitvoert.</p>
<textarea class="sr-ta" id="r3" placeholder="Ik ga bij mijn lessen het AI-label communiceren door... Of herwerk taak..."></textarea>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="sR3()">🏆 Afronden & certificaat ontvangen →</button>
</div>`;
  const ta = document.getElementById('r3');
  ta.value = localStorage.getItem('sr_r3') || '';
  ta.oninput = ()=>localStorage.setItem('sr_r3', ta.value);
}
function sR3(){
  const v = (document.getElementById('r3').value||'').trim();
  if(v.length < 20){ alert('Formuleer eerst je concrete actiestap.'); return; }
  n2();
}

/* ════════════════════════════════════════════
   MODULE 3 — COPILOT IN DE PRAKTIJK (OPTIONEEL)
   ════════════════════════════════════════════ */
const m3 = [m3s0, m3s1, m3s2, m3s3, m3s4, m3s5, m3s6, m3s7];
function rm3(){ const c=document.getElementById('m3c'); c.innerHTML=''; rDots(3,m3.length,S.mod3.step); m3[S.mod3.step](c); }
function n3(){ S.mod3.step++; ss(); S.mod3.step>=m3.length ? d3() : rm3(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); }
function p3(){ if(S.mod3.step > 0){ S.mod3.step--; ss(); rm3(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); } }
function d3(){ S.mod3.done=true; S.mod3.step=0; ss(); up(); rmc(); sv('home'); setTimeout(()=>alert('🎉 Praktijkverdieping voltooid!'),300); }

function m3s0(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">✨ Stap 1 van 8 · Aan de slag</span></div>
<h2 class="ch2">Copilot M365 — <em>jouw assistent</em></h2>
<svg viewBox="0 0 700 100" style="width:100%;height:auto;display:block;margin-bottom:16px;border-radius:var(--rsm);background:var(--blue)" xmlns="http://www.w3.org/2000/svg">
  <text x="60" y="60" font-size="36" text-anchor="middle">🛡️</text>
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

<div class="nw">
  <button class="sr-btn g" onclick="n3()">Volgende: prompts schrijven →</button>
</div>`;
}

function m3s1(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">✍️ Stap 2 van 8 · Prompting</span></div>
<h2 class="ch2">Een goede <em>prompt</em> schrijven</h2>
<p class="cp">De kwaliteit van wat Copilot teruggeeft, hangt sterk af van hoe specifiek je vraag (prompt) is. Een vaag verzoek als "maak een les over de Eerste Wereldoorlog" levert generieke, oppervlakkige output op — net zoals een vage vraag aan een collega ook een vaag antwoord oplevert. Gebruik daarom een vaste structuur, zodat je niets vergeet: <strong>Rol — Doel — Context — Bron — Verwachting (R-D-C-B-V)</strong>.</p>

<svg viewBox="0 0 700 170" style="width:100%;height:auto;display:block;margin:18px 0" xmlns="http://www.w3.org/2000/svg">
  <g font-family="Nunito, sans-serif">
    <rect x="0"   y="20" width="128" height="80" rx="12" fill="var(--blue)"/>
    <rect x="143" y="20" width="128" height="80" rx="12" fill="var(--blue)"/>
    <rect x="286" y="20" width="128" height="80" rx="12" fill="var(--blue)"/>
    <rect x="429" y="20" width="128" height="80" rx="12" fill="var(--blue)"/>
    <rect x="572" y="20" width="128" height="80" rx="12" fill="var(--blue)"/>
    <text x="64"  y="50" text-anchor="middle" font-size="20">🎭</text>
    <text x="207" y="50" text-anchor="middle" font-size="20">🎯</text>
    <text x="350" y="50" text-anchor="middle" font-size="20">🏫</text>
    <text x="493" y="50" text-anchor="middle" font-size="20">📄</text>
    <text x="636" y="50" text-anchor="middle" font-size="20">✅</text>
    <text x="64"  y="75" text-anchor="middle" font-family="Archivo Black, sans-serif" font-size="11" fill="#7FE000">ROL</text>
    <text x="207" y="75" text-anchor="middle" font-family="Archivo Black, sans-serif" font-size="11" fill="#7FE000">DOEL</text>
    <text x="350" y="75" text-anchor="middle" font-family="Archivo Black, sans-serif" font-size="11" fill="#7FE000">CONTEXT</text>
    <text x="493" y="75" text-anchor="middle" font-family="Archivo Black, sans-serif" font-size="11" fill="#7FE000">BRON</text>
    <text x="636" y="75" text-anchor="middle" font-family="Archivo Black, sans-serif" font-size="11" fill="#7FE000">VERWACHTING</text>
    <text x="64"  y="92" text-anchor="middle" font-size="9" fill="rgba(255,255,255,.6)" font-weight="700">wie is AI?</text>
    <text x="207" y="92" text-anchor="middle" font-size="9" fill="rgba(255,255,255,.6)" font-weight="700">wat wil je?</text>
    <text x="350" y="92" text-anchor="middle" font-size="9" fill="rgba(255,255,255,.6)" font-weight="700">voor wie?</text>
    <text x="493" y="92" text-anchor="middle" font-size="9" fill="rgba(255,255,255,.6)" font-weight="700">baseer op?</text>
    <text x="636" y="92" text-anchor="middle" font-size="9" fill="rgba(255,255,255,.6)" font-weight="700">vorm/lengte</text>
  </g>
</svg>

<div class="ib warn">
  <div class="ib-t">📋 Voorbeeldprompt volgens R-D-C-B-V</div>
  <div class="ib-b">
    <strong>Rol:</strong> "Je bent een ervaren leerkracht geschiedenis in het secundair onderwijs."<br>
    <strong>Doel:</strong> "Maak 5 reflectievragen bij een les over de Eerste Wereldoorlog."<br>
    <strong>Context:</strong> "Voor leerlingen van het 4de jaar ASO, die de oorzaken al kennen maar nog niet de gevolgen."<br>
    <strong>Bron:</strong> "Baseer je enkel op het bijgevoegde lesdocument, verzin geen extra feiten."<br>
    <strong>Verwachting:</strong> "Korte, open vragen die aanzetten tot discussie, geen meerkeuzevragen."
  </div>
</div>
<p class="cp">Krijg je niet meteen wat je zoekt? Verfijn dan in een vervolgvraag binnen hetzelfde gesprek ("maak de vragen iets korter", "voeg een vraag toe over perspectief") in plaats van helemaal opnieuw te beginnen — Copilot houdt rekening met de eerdere context van het gesprek. Controleer steeds de output zelf: ook een goede prompt garandeert geen foutloos resultaat, enkel een veel betere uitgangspositie.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: Maakmodule →</button>
</div>`;
}

function m3s2(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">🎨 Stap 3 van 8 · Maakmodule</span></div>
<h2 class="ch2">Een poster of beeld <em>ontwerpen</em></h2>
<p class="cp">Via de Maak- of Designer-module van Copilot kan je snel een visueel ontwerp genereren: een poster voor een klasproject, een infographic bij een les, of een uitnodiging voor een ouderavond. Beschrijf gewoon wat je nodig hebt ("een poster over recyclage, vriendelijke kleuren, voor leerlingen van het 1ste jaar") en kies daarna uit een aantal voorgestelde varianten.</p>
<div class="ib warn">
  <div class="ib-t">✏️ Let op: tekst in beelden klopt vaak niet</div>
  <div class="ib-b">AI-beeldgeneratoren maken regelmatig spelfouten in tekst die op een afbeelding staat. Controleer dit altijd, en gebruik de optie <strong>Edit Text</strong> om de tekst handmatig te corrigeren vóór je het beeld effectief gebruikt in de klas.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: differentiëren →</button>
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
<p class="cp">Je maakt een agent aan via "Agents → New agent": je geeft hem een naam, een duidelijke taakomschrijving ("Help leerlingen oefenen op onregelmatige werkwoorden, geef hints, geen volledige antwoorden"), en eventueel relevante documenten als kennisbasis.</p>
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
  // EQUAL LENGTHS AND BALANCED INDEXES FOR QUIZ 3
  const quiz = [
    {
      q: 'Je opent Copilot maar ziet het schild-icoon (Protected) niet. Wat doe je?',
      o: [
        'Gewoon onbezorgd verdergaan, aangezien het enkel een visueel icoontje betreft zonder functionele impact.',
        'Direct uitloggen en opnieuw aanmelden met je schoolaccount, want zonder schild is er geen dataveiligheid.',
        'Overstappen naar een compleet ander openbaar AI-platform om je werkzaamheden direct te continueren.',
        'De webpagina herhaaldelijk vernieuwen en afwachten tot de server het icoon automatisch toont.'
      ],
      a: 1,
      f: 'Het schild garandeert gegevensbescherming binnen de schoolomgeving.'
    },
    {
      q: 'Je genereert een poster en de tekst erop bevat een spelfout. Wat is de juiste reflex?',
      o: [
        'De fout negeren, aangezien leerlingen in een visuele poster voornamelijk letten op de grafische elementen.',
        'De tekst handmatig corrigeren via de Edit Text optie, omdat AI-beeldgeneratoren geregeld taalfouten maken.',
        'De poster herhaaldelijk volledig opnieuw genereren tot er bij toeval een foutloze versie ontstaat.',
        'Beeldgeneratie in het algemeen direct uitsluiten voor het ontwikkelen van betrouwbaar klasmateriaal.'
      ],
      a: 1,
      f: 'AI-beeldgeneratoren maken vaak spelfouten in afbeeldingen. Altijd handmatig even corrigeren via Edit Text.'
    },
    {
      q: 'Je hebt een sterke basistekst maar leerlingen met uiteenlopende leesniveaus. Welke tool zet je in?',
      o: [
        'De functionaliteit Create waarmee je direct een grafische poster of infographic ontwerpt voor de klas.',
        'De functionaliteit Teach -> Modify existing content -> Modify reading level om de tekst snel aan te passen.',
        'De optie Agents -> New agent om een volledig op maat gemaakte virtuele coach op te zetten voor studenten.',
        'De ingebouwde algemene Library om te zoeken naar reeds bestaande alternatieve teksten over dit thema.'
      ],
      a: 1,
      f: 'Modify reading level herschrijft je tekst op maat voor verschillende leesvaardigheden.'
    }
  ];
  rQuiz(c, quiz, 3, 'mod3', n3, 70);
}

function m3s7(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">🎯 Stap 8 van 8 · Slotreflectie</span></div>
<h2 class="ch2">Slotreflectie</h2>
<p class="cp">Je hebt nu kennisgemaakt met Copilot M365: het schild-icoon en dataveiligheid, gestructureerd prompten (R-D-C-B-V), de Maakmodule voor visueel materiaal, differentiëren op leesniveau, quizzen/rubrics genereren, en het opzetten van een eigen agent. Noteer hieronder wat voor jou het meest waardevol was, en welke stap je als eerste effectief gaat toepassen in je eigen lespraktijk.</p>
<textarea class="sr-ta" id="r2" placeholder="Meest opgeleverd... Wat ik als eerste ga uitproberen..."></textarea>
<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn o" onclick="sR2()">✅ Optionele module afronden →</button>
</div>`;
  const ta = document.getElementById('r2');
  ta.value = localStorage.getItem('sr_r2') || '';
  ta.oninput = ()=>localStorage.setItem('sr_r2', ta.value);
}
function sR2(){ n3(); }

/* ════════════════════════════════════════════
   QUIZ ENGINE
   ════════════════════════════════════════════ */
function rQuiz(con, qs, modN, sk, onComplete, pass){
  const id = 'q'+modN+'_'+Date.now();
  const st = { ans: new Array(qs.length).fill(null), correct: new Array(qs.length).fill(false) };
  const wrap = document.createElement('div');

  // Conditionally show Vorige button in quiz footer container ONLY if step layout permits or inside quiz engine
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

/* ════════════════════════════════════════════
   BOOTSTRAP — uitgesteld tot het einde van het
   bestand, zodat alle const/function-declaraties
   (incl. ST_Q en de module-arrays) al bestaan.
   ════════════════════════════════════════════ */
if(!S.starttest.taken){ goStartTest(); } else { sv('home'); }
