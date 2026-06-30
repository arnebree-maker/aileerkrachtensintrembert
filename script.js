/* ════════════════════════════════════════════
   AI-Cursus Sint-Rembert — script-v2.js
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
let S = { name:'', starttest:{taken:false, score:0, passed:false}, mod1:{step:0,done:false,skipped:false}, mod2:{step:0,done:false}, mod3:{step:0,done:false}, certPrinted:false, visited:{}, stellingen:{} };
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

/* ════════════════════════════════════════════
   LEESTIJD PER PAGINA — instelbaar per stap,
   loopt enkel bij het ÉÉRSTE bezoek aan die
   stap. Klik je op "← Vorige" en kom je later
   opnieuw op diezelfde stap? Dan is hij al
   gemarkeerd als bezocht en verschijnt er geen
   teller meer — de knop is meteen klikbaar.
   ════════════════════════════════════════════ */
function stepKey(modN, stepIdx){ return 'm'+modN+'s'+stepIdx; }
function isVisited(modN, stepIdx){ return !!S.visited[stepKey(modN,stepIdx)]; }
function markVisited(modN, stepIdx){ S.visited[stepKey(modN,stepIdx)] = true; ss(); }

function lockNextButtons(container, modN, stepIdx, seconds){
  const btns = container.querySelectorAll('.nw .sr-btn.g, .nw .sr-btn.o');
  const alreadySeen = isVisited(modN, stepIdx);

  if(alreadySeen || !seconds || seconds <= 0){
    // Geen timer: stap al eerder bezocht, of deze stap heeft geen leestijd nodig
    // (bv. een quizstap of stellingstap regelt zijn eigen knop-status zelf)
    markVisited(modN, stepIdx);
    return;
  }

  markVisited(modN, stepIdx);
  btns.forEach(b=>{
    if(b.dataset.timerId){ clearInterval(+b.dataset.timerId); }
    const original = b.dataset.origText || b.textContent;
    b.dataset.origText = original;
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
  txt += `JOUW STELLINGEN — PERSOONLIJKE MENING\n`;
  txt += `--------------------------------------------------\n`;
  const stellingenLabels = {
    'm1_afhankelijkheid': 'Als leerlingen voor elke schrijfopdracht AI mogen gebruiken, verliezen ze op termijn het vermogen om zelf een gestructureerde tekst te schrijven.',
    'm2_verbeteren': 'Ik zou een AI-tool willen inzetten om een eerste verbetering van toetsen te maken, zolang ik zelf de uiteindelijke score controleer en bevestig.',
  };
  let anyStelling = false;
  Object.keys(stellingenLabels).forEach(key=>{
    const idx = S.stellingen[key];
    if(idx !== undefined){
      anyStelling = true;
      txt += `"${stellingenLabels[key]}"\n→ Jouw antwoord: ${ST_SCALE[idx]}\n\n`;
    }
  });
  if(!anyStelling) txt += `Nog geen stellingen beantwoord.\n\n`;

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
const m1 = [m1s0, m1s1, m1s2, m1s3, m1s4, m1s5, m1s6];
/* Leestijd per stap (seconden) — 0 of weggelaten = geen blokkering (quiz/stelling regelt zichzelf) */
const M1_SECONDS = [15, 20, 25, 0, 10, 0, 0];
function rm1(){ const c=document.getElementById('m1c'); c.innerHTML=''; rDots(1,m1.length,S.mod1.step); m1[S.mod1.step](c); lockNextButtons(c, 1, S.mod1.step, M1_SECONDS[S.mod1.step]); }
function n1(){ S.mod1.step++; ss(); S.mod1.step>=m1.length ? d1() : rm1(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); }
function p1(){ if(S.mod1.step > 0){ S.mod1.step--; ss(); rm1(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); } }
function d1(){ S.mod1.done=true; S.mod1.step=0; ss(); up(); rmc(); sv('home'); setTimeout(()=>alert('🎉 Module 1 voltooid! Module 2 is nu beschikbaar.'),300); }

function m1s0(c){
  c.innerHTML = `
<div class="s-badge">🤖 Stap 1 van 7 · AI overal</div>
<h2 class="ch2">AI is <em>overal</em> — ook al zie je het niet</h2>
<p class="cp">Gezichtsherkenning op je telefoon, de spamfilter in je mailbox, aanbevelingen op YouTube, de routeplanner die files voorspelt — <strong>AI zit al jaren in onze dagelijkse tools</strong>. En sinds de doorbraak van ChatGPT eind 2022 ook steeds nadrukkelijker in het onderwijs: leerlingen gebruiken chatbots voor taken, uitgeverijen bouwen AI in leerplatformen in, en collega's experimenteren met AI voor lesvoorbereiding.</p>
<p class="cp">Maar wat is AI eigenlijk? En wanneer is iets AI, en wanneer niet? Als leerkracht hoef je geen ingenieur te zijn, maar je moet AI wel kunnen <strong>herkennen, benoemen en er verantwoord mee omgaan</strong>. Dat is ook wat artikel 4 van de EU AI Act van organisaties — en dus van ons als school — verwacht: voldoende AI-geletterdheid bij iedereen die met AI werkt.</p>

<h3 class="ch3">🎬 Video: Intro Artificiële Intelligentie — EDUbox (VRT NWS)</h3>
<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/yo1g2B5E4W8" allowfullscreen loading="lazy" title="EDUbox AI Intro door Tom Van de Weghe"></iframe></div>

<h3 class="ch3">🧩 Doe-opdracht: AI of geen AI?</h3>
<div id="aig"></div>

<div class="nw">
  <button class="sr-btn g" onclick="n1()">Volgende: van regels naar GenAI →</button>
  <span class="nh">Stap 1/7</span>
</div>`;
  renderAiCards();
}

function m1s1(c){
  c.innerHTML = `
<div class="s-badge">📚 Stap 2 van 7 · Geschiedenis & GenAI</div>
<h2 class="ch2">Van schaakcomputers naar <em>Generatieve AI</em></h2>
<p class="cp">AI bestaat al sinds de jaren 50 — maar de sprong naar <strong>generatieve AI</strong> (GenAI) die tekst, beeld, audio en code kan <em>maken</em>, verandert alles. ChatGPT haalde na de lancering snel 100 miljoen gebruikers. Het cruciale verschil voor jou als leerkracht: vroegere AI kon enkel <strong>classificeren of voorspellen</strong> (is dit spam?). Generatieve AI kan iets <strong>nieuws creëren</strong>.</p>

<div class="ib warn">
  <div class="ib-t">⚠️ Hallucinaties — Het belangrijkste begrip van deze module</div>
  <div class="ib-b">GenAI werkt met <strong>kansberekening</strong>: het voorspelt telkens het meest waarschijnlijke volgende woord. Daardoor klinkt de output altijd zelfverzekerd — óók als ze fout is. Dat noemen we een <strong>hallucinatie</strong>: verzonnen informatie die er betrouwbaar uitziet.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: kansen & gevaren →</button>
  <span class="nh">Stap 2/7</span>
</div>`;
}

function m1s2(c){
  c.innerHTML = `
<div class="s-badge">⚠️ Stap 3 van 7 · Kansen & gevaren</div>
<h2 class="ch2">Mogelijkheden én <em>gevaren</em> van GenAI</h2>
<p class="cp">GenAI biedt enorme kansen voor je lespraktijk — maar ook concrete risico's die je moet kennen om zelf verantwoord te werken én om leerlingen goed te begeleiden.</p>

<div class="grid2">
  <div class="pane-ok lijst-ok">
    <div class="lijst-h-ok">✅ Kansen voor leerkrachten</div>
    <div>→ Snellere lesvoorbereiding en differentiatiemateriaal</div>
    <div>→ Feedback formuleren op geanonimiseerde leerlingteksten</div>
    <div>→ Administratieve last verlagen</div>
  </div>
  <div class="pane-nok lijst-nok">
    <div class="lijst-h-nok">⚠️ Gevaren om te kennen</div>
    <div>→ Hallucinaties: overtuigende maar foute informatie</div>
    <div>→ Bias: stereotypen uit trainingsdata in de output</div>
    <div>→ Privacyrisico bij invoer van persoonsgegevens</div>
  </div>
</div>

${promoMini('Wil je dieper graven in de ethische kant van AI? Op 18 november verwelkomen we prof. Orhan Agirdag (KU Leuven).')}

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: kennischeck →</button>
  <span class="nh">Stap 3/7</span>
</div>`;
}

function m1s3(c){
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
      a: 2, // Changed index
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
      a: 0, // Changed index
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

function m1s4(c){
  c.innerHTML = `
<div class="s-badge">✍️ Stap 5 van 7 · Vertaalslag naar jouw vak</div>
<h2 class="ch2">Vertaal naar <em>jouw lespraktijk</em></h2>
<p class="cp">Noteer je reflectie hieronder (minstens een paar zinnen):</p>
<textarea class="sr-ta" id="r1" placeholder="Ik denk aan mijn les... AI zou meerwaarde hebben bij... AI zou ik uitsluiten bij... omdat..."></textarea>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" id="r1btn" onclick="sR1()">Volgende →</button>
  <span class="nh">Stap 5/7</span>
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

function m1s5(c){
  c.innerHTML = `
<div class="s-badge">💬 Stap 6 van 7 · Jouw mening</div>
<h2 class="ch2">Stelling: <em>afhankelijkheid</em></h2>
<p class="cp">AI-expert Rani Van Schoors (KU Leuven, Imec) vergelijkt het gebruik van AI bij schrijfopdrachten met GPS bij het lezen van een kaart: "Sinds de komst van de gps vinden we de weg niet meer zonder." Lees de stelling hieronder en geef je mening.</p>
${renderStelling('m1_afhankelijkheid', 'Als leerlingen voor elke schrijfopdracht AI mogen gebruiken, verliezen ze op termijn het vermogen om zelf een gestructureerde tekst te schrijven.', 'Rani Van Schoors, KU Leuven/Imec — Klasse.be', 'n1()', 1, false)}`;
}

function m1s6(c){
  const quiz2 = [
    {
      q: 'Wat is het verschil tussen "intelligentie" bij AI en bij mensen, volgens AI-onderzoek?',
      o: [
        'AI "weet" niets en kan niet "denken" — het bouwt zinnen door patronen na te bootsen op basis van eerder geziene voorbeelden.',
        'AI denkt sneller dan mensen maar komt tot exact dezelfde conclusies.',
        'AI heeft een eigen bewustzijn ontwikkeld sinds de komst van ChatGPT.',
        'Er is wetenschappelijk gezien geen enkel verschil meer tussen AI en menselijke intelligentie.'
      ],
      a: 0,
      f: 'AI bootst na op basis van patronen in trainingsdata. Een aannemelijk antwoord is daardoor niet hetzelfde als een correct antwoord.'
    },
    {
      q: 'Een leerling gebruikt een chatbot-app die op de achtergrond constant gegevens verzamelt. Wat is hier het belangrijkste aandachtspunt?',
      o: [
        'Of de chatbot een leuke avatar heeft.',
        'Of de leerling beseft dat hij met een AI-systeem communiceert en geen persoonlijke informatie deelt.',
        'Of de chatbot in het Nederlands antwoordt.',
        'Of de chatbot gratis is.'
      ],
      a: 1,
      f: 'Gebruikers moeten weten dat ze met een AI-systeem te maken hebben en geen persoonlijke info delen — zelfs als de tool een afgeschermde indruk geeft.'
    },
    {
      q: 'Waarom kan een sterke leerling onbedoeld méér voordeel halen uit een adaptieve AI-leertool dan een zwakkere leerling?',
      o: [
        'Sterke leerlingen hebben een duurder schoolabonnement.',
        'Sterke leerlingen werken sneller, voeden de AI met meer data, en krijgen daardoor sneller feedback op maat — wat de kloof kan vergroten.',
        'Sterke leerlingen krijgen altijd voorrang van de leraar.',
        'Adaptieve tools werken enkel voor leerlingen met een hoog gemiddelde.'
      ],
      a: 1,
      f: 'Hoe meer data een AI-tool krijgt, hoe beter de feedback. Dat kan de kloof tussen sterke en zwakke leerlingen onbedoeld vergroten — een aandachtspunt voor je eigen klaspraktijk.'
    },
  ];
  c.innerHTML = `
<div class="s-badge">🧠 Stap 7 van 7 · Verdieping</div>
<h2 class="ch2">De <em>blackbox</em> en het lerarentekort</h2>
<p class="cp">Een laatste belangrijk inzicht voor je Module 1 wordt afgerond: AI-systemen werken vaak als een <strong>'blackbox'</strong> — je weet niet altijd precies welke algoritmes een beslissing sturen. In 2020 gebruikte de Britse overheid tijdens corona een algoritme om examenscores te berekenen. Dat liep grondig fout: een grote groep studenten kreeg lagere cijfers dan verwacht, zonder dat iemand kon uitleggen waarom. Aan AI het laatste woord geven bij studieadvies of een deliberatie is daarom nooit verstandig.</p>
<div class="ib warn">
  <div class="ib-t">⚠️ Onthou dit</div>
  <div class="ib-b">AI kan een overzicht geven van de prestaties van een leerling en een voorstel genereren voor de klassenraad. Maar de kritische reflex van een lerarenteam blijft onmisbaar — een mens neemt de uiteindelijke beslissing, nooit de machine alleen.</div>
</div>
<h3 class="ch3">📝 Nog 3 extra kennisvragen</h3>`;
  const quizWrap = document.createElement('div');
  c.appendChild(quizWrap);
  rQuiz(quizWrap, quiz2, 1, 'mod1', d1, 60);
  // Override: dit is de afsluitende quiz, dus bij slagen rondt hij module 1 volledig af
}

/* ════════════════════════════════════════════
   MODULE 2 — BELEID & LEERLINGEN (5 stappen)
   ════════════════════════════════════════════ */
const m2 = [m2s0, m2s1, m2s2, m2s3, m2s4, m2s5, m2s6];
const M2_SECONDS = [20, 15, 25, 0, 10, 0, 0];
function rm2(){ const c=document.getElementById('m2c'); c.innerHTML=''; rDots(2,m2.length,S.mod2.step); m2[S.mod2.step](c); lockNextButtons(c, 2, S.mod2.step, M2_SECONDS[S.mod2.step]); }
function n2(){ S.mod2.step++; ss(); S.mod2.step>=m2.length ? d2() : rm2(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); }
function p2(){ if(S.mod2.step > 0){ S.mod2.step--; ss(); rm2(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); } }
function d2(){ S.mod2.done=true; S.mod2.step=0; ss(); up(); rmc(); sv('cert'); }

function m2s0(c){
  c.innerHTML = `
<div class="s-badge">🛡️ Stap 1 van 7 · Spelregels & AI-labels</div>
<h2 class="ch2">Het AI-beleid van <em>Sint-Rembert</em></h2>
<p class="cp">Sint-Rembert werkt met <strong>5 duidelijke AI-labels</strong> om aan taken en opdrachten te koppelen.</p>
<div class="labels-grid">
  <div class="label-card l1"><div class="lc-num">1</div><div class="lc-name">Geen AI</div></div>
  <div class="label-card l2"><div class="lc-num">2</div><div class="lc-name">Ideeën</div></div>
  <div class="label-card l3"><div class="lc-num">3</div><div class="lc-name">Bewerking</div></div>
  <div class="label-card l4"><div class="lc-num">4</div><div class="lc-name">Aanvulling</div></div>
  <div class="label-card l5"><div class="lc-num">5</div><div class="lc-name">Vrij</div></div>
</div>

<div class="nw">
  <button class="sr-btn g" onclick="n2()">Volgende: leerlingen begeleiden →</button>
  <span class="nh">Stap 1/7</span>
</div>`;
}

function m2s1(c){
  c.innerHTML = `
<div class="s-badge">🧑‍🏫 Stap 2 van 7 · Leerlingen begeleiden</div>
<h2 class="ch2">Zo begeleid je <em>leerlingen</em> bij AI</h2>
<p class="cp">Wees transparant en train kritisch denken. Vertrouw niet zomaar op AI-detectietools.</p>
<div class="ib warn">
  <div class="ib-t">⚠️ Over AI-detectietools: Wees voorzichtig</div>
  <div class="ib-b">Tools die beweren AI-tekst te herkennen zijn <strong>onbetrouwbaar</strong>. Ze leveren valse beschuldigingen op en schenden GDPR als je er namen in plaatst.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="n2()">Volgende: AI-bestendig ontwerpen →</button>
  <span class="nh">Stap 2/7</span>
</div>`;
}

function m2s2(c){
  c.innerHTML = `
<div class="s-badge">🔧 Stap 3 van 7 · AI-bestendig ontwerpen</div>
<h2 class="ch2">Maak je opdrachten <em>AI-bestendig</em></h2>
<p class="cp">Ontwerp opdrachten zo dat het leerproces zichtbaar of lokaal/persoonlijk verankerd is.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="n2()">Volgende: kennischeck →</button>
  <span class="nh">Stap 3/7</span>
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
      a: 0, // Changed index
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
      a: 2, // Changed index
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
      a: 2, // Changed index
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
<div class="s-badge">🎯 Stap 5 van 7 · Praktijkscenario's</div>
<h2 class="ch2">Jouw sluitende <em>actiestap</em></h2>
<textarea class="sr-ta" id="r3" placeholder="Ik ga bij mijn lessen het AI-label communiceren door... Of herwerk taak..."></textarea>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="sR3()">Volgende →</button>
  <span class="nh">Stap 5/7</span>
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

function m2s5(c){
  c.innerHTML = `
<div class="s-badge">💬 Stap 6 van 7 · Jouw mening</div>
<h2 class="ch2">Stelling: <em>verbeteren met AI</em></h2>
<p class="cp">Onderzoek van PXL Centrum Digitaal Leren toont dat een AI-model objectiever en nauwkeuriger toetsen verbetert dan een leraar — mits een goede rubric én een eindcontrole door een mens. De AI Act classificeert automatisch verbeteren en scoren overigens als <strong>hoog risico</strong>: een mens moet altijd de uiteindelijke beslissing nemen.</p>
${renderStelling('m2_verbeteren', 'Ik zou een AI-tool willen inzetten om een eerste verbetering van toetsen te maken, zolang ik zelf de uiteindelijke score controleer en bevestig.', 'Vincent Vanrusselt, PXL — Klasse.be', 'n2()', 2, false)}`;
}

function m2s6(c){
  c.innerHTML = `
<div class="s-badge">🧭 Stap 7 van 7 · 4 risiconiveaus van de AI Act</div>
<h2 class="ch2">De AI Act in <em>4 niveaus</em></h2>
<p class="cp">De Europese AI Act deelt AI-toepassingen in volgens risico. Dit kader helpt je inschatten waarom sommige AI-toepassingen vrij mogen worden gebruikt, en andere niet.</p>
<div class="labels-grid" style="grid-template-columns:repeat(2,1fr)">
  <div class="label-card l1"><div class="lc-num">⛔</div><div class="lc-name">Onaanvaardbaar</div></div>
  <div class="label-card l2"><div class="lc-num">🔴</div><div class="lc-name">Hoog risico</div></div>
  <div class="label-card l4"><div class="lc-num">🟠</div><div class="lc-name">Beperkt risico</div></div>
  <div class="label-card l5"><div class="lc-num">🟢</div><div class="lc-name">Minimaal risico</div></div>
</div>
<div class="ib warn">
  <div class="ib-t">📚 Onderwijs zit vaak in 'hoog risico'</div>
  <div class="ib-b">Toegang/toelating tot onderwijs, het evalueren van leerresultaten, schooladvies geven en antispieksoftware tijdens toetsen vallen onder 'hoog risico'. <strong>Generatieve AI zoals Copilot, ChatGPT of Gemini valt momenteel onder 'laag/minimaal risico'</strong> — je mag dus gerust tekst of beeld genereren voor lesmateriaal, mits je de gebruikersvoorwaarden respecteert.</div>
</div>
<h3 class="ch3">🧭 Tien navigatietips, in het kort</h3>
<p class="cp">Het Stella Matutina College in Lede vatte hun aanpak samen in 10 tips. Drie ervan zijn cruciaal voor jouw klaspraktijk: werk met <strong>kleurcodes</strong> (groen = AI vrij toegestaan, oranje = beperkt, rood = verboden) zodat leerlingen meteen weten waar ze aan toe zijn. Verschuif de focus van het <strong>eindproduct naar het leerproces</strong> — laat leerlingen AI-output zelf kritisch beoordelen. En behandel je eigen aanpak niet als afgewerkt: <strong>evalueer en stuur jaarlijks bij</strong>, want AI verandert razendsnel.</p>
<h3 class="ch3">📝 Nog 3 extra kennisvragen</h3>`;
  const quizWrap = document.createElement('div');
  c.appendChild(quizWrap);
  const quiz3 = [
    {
      q: 'Onder welk risiconiveau van de AI Act valt antispieksoftware die toetsen monitort op ongeoorloofd gedrag?',
      o: ['Minimaal risico, net als een spamfilter.', 'Beperkt risico, zoals een gewone chatbot.', 'Hoog risico — net als AI die leerresultaten evalueert of toegang tot onderwijs bepaalt.', 'Onaanvaardbaar risico — dat is altijd verboden.'],
      a: 2,
      f: 'Monitoren en detecteren van ongeoorloofd gedrag tijdens toetsen valt onder hoog risico, samen met toegang tot onderwijs en het evalueren van leerresultaten.'
    },
    {
      q: 'Wie draagt volgens de AI Act de verantwoordelijkheid en eventuele sancties bij een AI-tool die niet voldoet aan de regelgeving?',
      o: ['Altijd de individuele leraar die de tool gebruikte.', 'Altijd de leerling die de tool gebruikte.', 'De toolbouwer/aanbieder van de AI-tool, nooit de gebruiker.', 'Niemand — de AI Act voorziet geen sancties.'],
      a: 2,
      f: 'Sancties gaan naar de toolbouwer, nooit naar de gebruiker. De AI Act beschermt gebruikers en responsabiliseert producenten.'
    },
    {
      q: 'Wat is de geadviseerde minimumleeftijd van UNESCO voor het zelfstandig gebruik van generatieve AI-tools?',
      o: ['8 jaar', '12 jaar', '16 jaar', '18 jaar'],
      a: 1,
      f: 'UNESCO adviseert 12 jaar als richtleeftijd (OpenAI hanteert zelf 13 jaar voor ChatGPT). Het is geen wet, maar wel een aangewezen leeftijdsgrens om mee rekening te houden op school.'
    },
  ];
  rQuiz(quizWrap, quiz3, 2, 'mod2', d2, 60);
}

/* ════════════════════════════════════════════
   MODULE 3 — COPILOT IN DE PRAKTIJK (OPTIONEEL)
   ════════════════════════════════════════════ */
const m3 = [m3s0, m3s1, m3s2, m3s3, m3s4, m3s5, m3s6, m3s7];
const M3_SECONDS = [10, 10, 10, 0, 10, 10, 0, 0];
function rm3(){ const c=document.getElementById('m3c'); c.innerHTML=''; rDots(3,m3.length,S.mod3.step); m3[S.mod3.step](c); lockNextButtons(c, 3, S.mod3.step, M3_SECONDS[S.mod3.step]); }
function n3(){ S.mod3.step++; ss(); S.mod3.step>=m3.length ? d3() : rm3(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); }
function p3(){ if(S.mod3.step > 0){ S.mod3.step--; ss(); rm3(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); } }
function d3(){ S.mod3.done=true; S.mod3.step=0; ss(); up(); rmc(); sv('home'); setTimeout(()=>alert('🎉 Praktijkverdieping voltooid!'),300); }

function m3s0(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">✨ Stap 1 van 8 · Aan de slag</span></div>
<h2 class="ch2">Copilot M365 — <em>jouw assistent</em></h2>
<p class="cp">Zorg dat het beschermde schild-icoon (Protected) actief is.</p>
<div class="nw">
  <button class="sr-btn g" onclick="n3()">Volgende: prompts schrijven →</button>
</div>`;
}
function m3s1(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">✍️ Stap 2 van 8 · Prompting</span></div>
<p class="cp">Gebruik Rol, Doel, Context, Bron en Verwachting.</p>
<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: Maakmodule →</button>
</div>`;
}
function m3s2(c){
  c.innerHTML = `<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">🎨 Stap 3 van 8</span></div><p class="cp">Ontwerp een poster.</p>
<div class="nw"><button class="sr-btn b" onclick="p3()">← Vorige</button><button class="sr-btn g" onclick="n3()">Volgende →</button></div>`;
}
function m3s3(c){
  c.innerHTML = `<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">📚 Stap 4 van 8</span></div><p class="cp">Differentiëren op leesniveaus.</p>
<div class="nw"><button class="sr-btn b" onclick="p3()">← Vorige</button><button class="sr-btn g" onclick="n3()">Volgende →</button></div>`;
}
function m3s4(c){
  c.innerHTML = `<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">📝 Stap 5 van 8</span></div><p class="cp">Quizzen en Rubrics.</p>
<div class="nw"><button class="sr-btn b" onclick="p3()">← Vorige</button><button class="sr-btn g" onclick="n3()">Volgende →</button></div>`;
}
function m3s5(c){
  c.innerHTML = `<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">🤖 Stap 6 van 8</span></div><p class="cp">Bouw je eigen agent.</p>
<div class="nw"><button class="sr-btn b" onclick="p3()">← Vorige</button><button class="sr-btn g" onclick="n3()">Volgende →</button></div>`;
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
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">🎯 Stap 8 van 8</span></div>
<h2 class="ch2">Slotreflectie</h2>
<textarea class="sr-ta" id="r2" placeholder="Meest opgeleverd..."></textarea>
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
   STELLINGEN — opiniepeiling, geen goed/fout.
   Leerkracht geeft mening op een 5-puntsschaal.
   Antwoord wordt bewaard en zit in het
   downloadbare reflectieverslag.
   ════════════════════════════════════════════ */
const ST_SCALE = ['Helemaal mee oneens','Oneens','Neutraal','Eens','Helemaal mee eens'];

function renderStelling(stellingId, stellingTekst, bron, navFn, modN, isLast){
  const saved = S.stellingen[stellingId];
  let opts = '';
  ST_SCALE.forEach((label,i)=>{
    const sel = saved === i ? ' sel' : '';
    opts += `<button class="stelling-opt${sel}" data-i="${i}" onclick="pickStelling('${stellingId}', ${i})">${label}</button>`;
  });
  return `
<div class="stelling-box">
  <div class="stelling-label">💬 Stelling — wat denk jij?</div>
  <div class="stelling-tekst">"${stellingTekst}"</div>
  ${bron ? `<div class="stelling-bron">Bron: ${bron}</div>` : ''}
  <div class="stelling-opts" id="stelling-${stellingId}">${opts}</div>
  <div class="stelling-hint">Er is hier geen goed of fout antwoord — dit is jouw mening, geen kennistoets.</div>
</div>
<div class="nw">
  <button class="sr-btn b" onclick="${modN===1?'p1()':modN===2?'p2()':'p3()'}">← Vorige</button>
  <button class="sr-btn ${isLast?'g':'o'}" id="stelling-next-${stellingId}" onclick="${navFn}" ${!saved && saved!==0 ? 'disabled' : ''}>Volgende →</button>
</div>`;
}

function pickStelling(stellingId, i){
  S.stellingen[stellingId] = i;
  ss();
  document.querySelectorAll(`#stelling-${stellingId} .stelling-opt`).forEach(b=>{
    b.classList.toggle('sel', +b.dataset.i === i);
  });
  const nb = document.getElementById('stelling-next-'+stellingId);
  if(nb) nb.disabled = false;
}


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
