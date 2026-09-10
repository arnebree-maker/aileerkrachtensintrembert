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
  mod7: {step:0, done:false},
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

function ua(){ const n = (document.getElementById('un')?.value||'').trim(); const av=document.getElementById('av'); if(av) av.textContent = n ? n.charAt(0).toUpperCase() : '?'; const disp=document.getElementById('un-display'); if(disp) disp.textContent = n || 'Naam bij startest ingevuld'; }
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
    const nav7 = document.getElementById('nav-mod7'); if(nav7) nav7.className='ni locked';
    const l7 = document.getElementById('l7'); if(l7) l7.textContent='🔒';
    return;
  }

  // Module 1 always available after starttest
  setModuleNavState(1, true);
  for(let i=2;i<=6;i++){
    const prevDone = S['mod'+(i-1)].done;
    setModuleNavState(i, prevDone);
  }

  // Module 7 (optioneel · Copilot) is altijd beschikbaar, los van de verplichte volgorde
  setModuleNavState(7, true);

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

  // Module 7 (optioneel · Copilot) — altijd beschikbaar, geen vergrendeling
  const cm7 = document.getElementById('cm7');
  if(cm7){
    const bm7 = document.getElementById('bm7');
    const ps7 = document.getElementById('ps7');
    const done7 = S.mod7.done;
    cm7.classList.remove('locked');
    if(done7){
      cm7.classList.add('done');
      bm7.textContent='↺ Herhalen';
      ps7.className='mc-stat ok'; ps7.textContent='✓ Voltooid';
    } else {
      bm7.textContent='▶ Start';
      ps7.className='mc-stat'; ps7.textContent='Altijd beschikbaar';
    }
    bm7.disabled=false;
    bm7.onclick=()=>{ if(!S.starttest.taken){goStartTest();return;} rm7(); sv('mod7'); };
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
  if(n===7){ rm7(); sv('mod7'); return; }
  const prevDone = S['mod'+(n-1)].done;
  if(prevDone){ window['rm'+n](); sv('mod'+n); }
  else { alert('Voltooi eerst Module '+(n-1)+'.'); }
}

function goHome(){
  if(!S.starttest.taken){ goStartTest(); return; }
  sv('home');
}

function goStartTest(){ showNameEntry(); renderStartTest(); sv('starttest'); }

/* ════════════════════════════════════════════
   PODCAST MODAL — Module 1
   ════════════════════════════════════════════ */

function playPodcastL1(){
  const overlay = document.createElement('div');
  overlay.id = 'podcast-overlay-l1';
  overlay.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:9999;`;

  const card = document.createElement('div');
  card.style.cssText = `background:linear-gradient(135deg,#9C27B0 0%,#7B1FA2 100%);border-radius:12px;padding:32px;color:white;text-align:center;max-width:500px;max-height:80vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);`;

  card.innerHTML = `
    <h3 style="color: white; margin-top: 0; margin-bottom: 8px;">🎧 AI-Skills Podcast</h3>
    <p style="font-size: 13px; color: rgba(255,255,255,0.95); margin-bottom: 20px; font-weight: 600;">Een audio-introductie bij deze cursus</p>
    <a href="https://drive.google.com/file/d/1FD8iLx6313brXRIo2uQXNgtTMKplO6kq/view" target="_blank" style="display:flex; align-items:center; justify-content:center; gap:10px; background: white; color: #9C27B0; border-radius: 10px; padding: 16px; margin-bottom: 16px; font-weight: 800; font-size: 15px; text-decoration: none;">
      ▶ Beluister de podcast
    </a>
    <p style="font-size: 11px; color: rgba(255,255,255,0.9); margin-bottom: 16px; line-height: 1.4;">💡 Opent in een nieuw tabblad. Luister gerust meerdere keren — je kan op elk moment terugkeren en zelf verderlezen.</p>
    <button onclick="closeModal('podcast-overlay-l1');" style="background: rgba(255,255,255,0.9); color: #9C27B0; border: none; border-radius: 8px; padding: 12px 24px; font-weight: 700; cursor: pointer;">✓ Sluiten</button>
  `;

  overlay.appendChild(card);
  document.body.appendChild(overlay);
}

function closeModal(id){
  const modal = document.getElementById(id);
  if(modal) modal.remove();
}
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
    if(!confirm('Certificaat + antwoorden downloaden?\n\nNaam op certificaat: ' + S.name + '\n\nKies in het afdrukvenster "Opslaan als PDF" en bewaar het bestand.')) return;
  }
  rc();
  buildAnswersReport();
  window.print();
}

window.addEventListener('afterprint', () => {
  const target = document.getElementById('cert-answers-print');
  if(target){ target.style.display = 'none'; target.innerHTML = ''; }
});

/* ════════════════════════════════════════════
   VOLLEDIG ANTWOORDENRAPPORT — wordt na het
   certificaat afgedrukt in dezelfde PDF
   ════════════════════════════════════════════ */

const STELLING_LABELS = ['Sterk oneens','Oneens','Neutraal','Eens','Sterk eens'];

const MODULE_NAMEN = {
  1: 'Wat is AI?', 2: 'Hoe werkt AI?', 3: 'Generatieve AI',
  4: 'Ethiek & Bias', 5: 'AI in School', 6: 'AI in Maatschappij', 7: 'Copilot Ontdekken'
};

const REFLECTIE_LABELS = {
  1: 'Waar zie je AI in je dagelijkse leven?',
  2: 'Wat vond je het meest verrassend over hoe AI werkt?',
  3: 'Voor welke taak zou je generatieve AI het liefst gebruiken?',
  4: 'Welk risico vind je het meest verontrustend?',
  5: 'Welk AI-label vind je het makkelijkst/moeilijkst?',
  6: 'Jouw grote afsluitende visie op AI'
};

function esc(str){
  return (str||'').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function buildAnswersReport(){
  const name = S.name || 'Leerling';
  let html = `
    <div style="page-break-before: always; padding: 20px 0;">
      <h1 style="font-family:'Archivo Black',sans-serif; color: var(--blue); font-size: 22px; border-bottom: 3px solid var(--blue); padding-bottom: 10px; margin-bottom: 4px;">📋 Volledig Antwoordenoverzicht</h1>
      <p style="font-size: 12px; color: #666; margin-bottom: 24px;">${esc(name)} — gegenereerd op ${new Date().toLocaleDateString('nl-BE',{day:'numeric',month:'long',year:'numeric'})}</p>
  `;

  for(let i=1;i<=6;i++){
    const modDone = S['mod'+i] && S['mod'+i].done;
    const quizScore = (S['mod'+i] && S['mod'+i].quizScore !== undefined) ? S['mod'+i].quizScore + '%' : '—';

    html += `<div style="margin-bottom: 28px; page-break-inside: avoid;">
      <h2 style="font-size: 16px; color: var(--blue); background: #f0f2f5; padding: 8px 12px; border-radius: 6px; margin-bottom: 10px;">Module ${i} — ${MODULE_NAMEN[i]} ${modDone ? '✅' : ''}</h2>
      <p style="font-size: 12px; color: #666; margin: 4px 0 12px 0;"><strong>Kennischeck-score:</strong> ${quizScore}</p>`;

    // Stellingen (modules 1-5)
    if(i <= 5){
      try{
        const raw = localStorage.getItem('sr_l_stellingen_l_m'+i);
        if(raw){
          const parsed = JSON.parse(raw);
          const keys = Object.keys(parsed);
          if(keys.length){
            html += `<p style="font-size:12px; font-weight:700; color:#3d4f8a; margin:10px 0 4px 0;">Stellingen:</p>`;
            keys.forEach(idx=>{
              const val = STELLING_LABELS[parsed[idx]] || '—';
              html += `<p style="font-size:12px; color:#333; margin:2px 0 2px 12px;">Stelling ${parseInt(idx)+1}: <strong>${esc(val)}</strong></p>`;
            });
          }
        }
      }catch(e){}
    }

    // Doe-opdracht prompt-oefeningen (module 2 & 3)
    if(i===2){
      const pUsed = localStorage.getItem('sr_l_prompt_used_m2');
      const pResult = localStorage.getItem('sr_l_prompt_result_m2');
      const pSat = localStorage.getItem('sr_l_prompt_satisfied_m2');
      if(pUsed || pResult || pSat){
        html += `<p style="font-size:12px; font-weight:700; color:#3d4f8a; margin:10px 0 4px 0;">Doe-opdracht — jouw prompt:</p>
          <p style="font-size:12px; color:#333; margin:2px 0; white-space:pre-wrap;"><strong>Prompt:</strong> ${esc(pUsed)}</p>
          <p style="font-size:12px; color:#333; margin:2px 0; white-space:pre-wrap;"><strong>Resultaat:</strong> ${esc(pResult)}</p>
          <p style="font-size:12px; color:#333; margin:2px 0; white-space:pre-wrap;"><strong>Tevreden?</strong> ${esc(pSat)}</p>`;
      }
    }
    if(i===3){
      const pUsed = localStorage.getItem('sr_l_prompt_used_m3');
      const pResult = localStorage.getItem('sr_l_prompt_result_m3');
      if(pUsed || pResult){
        html += `<p style="font-size:12px; font-weight:700; color:#3d4f8a; margin:10px 0 4px 0;">Doe-opdracht — jouw prompt:</p>
          <p style="font-size:12px; color:#333; margin:2px 0; white-space:pre-wrap;"><strong>Prompt:</strong> ${esc(pUsed)}</p>
          <p style="font-size:12px; color:#333; margin:2px 0; white-space:pre-wrap;"><strong>Resultaat:</strong> ${esc(pResult)}</p>`;
      }
    }
    // Charter (module 5)
    if(i===5){
      const charter = localStorage.getItem('sr_l_charter1');
      if(charter){
        html += `<p style="font-size:12px; font-weight:700; color:#3d4f8a; margin:10px 0 4px 0;">Jouw klascharter-voorstel:</p>
          <p style="font-size:12px; color:#333; margin:2px 0; white-space:pre-wrap;">${esc(charter)}</p>`;
      }
    }

    // Reflectie
    const ref = localStorage.getItem('sr_l_ref'+i);
    html += `<p style="font-size:12px; font-weight:700; color:#3d4f8a; margin:10px 0 4px 0;">Reflectie — ${esc(REFLECTIE_LABELS[i]||'')}</p>
      <p style="font-size:12px; color:#333; margin:2px 0 2px 0; white-space:pre-wrap; background:#f9f9f9; padding:8px; border-radius:4px;">${ref ? esc(ref) : '<em>Niet ingevuld.</em>'}</p>`;

    html += `</div>`;
  }

  // Module 7 (optioneel)
  if(S.mod7 && S.mod7.done){
    const m7img_p = localStorage.getItem('sr_l_m7_img_prompt');
    const m7img_r = localStorage.getItem('sr_l_m7_img_result');
    const m7txt = localStorage.getItem('sr_l_m7_txt_result');
    const m7study = localStorage.getItem('sr_l_m7_study_result');
    html += `<div style="margin-bottom: 28px; page-break-inside: avoid;">
      <h2 style="font-size: 16px; color: var(--orange); background: #fff3e0; padding: 8px 12px; border-radius: 6px; margin-bottom: 10px;">Module 7 (optioneel) — Copilot Ontdekken ✅</h2>`;
    if(m7img_p) html += `<p style="font-size:12px; margin:4px 0;"><strong>Afbeelding-prompt:</strong> ${esc(m7img_p)}</p><p style="font-size:12px; margin:4px 0 10px 0;"><strong>Resultaat:</strong> ${esc(m7img_r)}</p>`;
    if(m7txt) html += `<p style="font-size:12px; margin:4px 0 10px 0;"><strong>Creatieve tekst:</strong> ${esc(m7txt)}</p>`;
    if(m7study) html += `<p style="font-size:12px; margin:4px 0;"><strong>Studiehulpmiddel:</strong> ${esc(m7study)}</p>`;
    html += `</div>`;
  }

  html += `<p style="font-size:10px; color:#999; margin-top:20px; border-top:1px solid #ddd; padding-top:10px;">Sint-Rembert AI-Skills · Automatisch gegenereerd antwoordenrapport · ${new Date().toLocaleString('nl-BE')}</p>`;
  html += `</div>`;

  const target = document.getElementById('cert-answers-print');
  target.innerHTML = html;
  target.style.display = 'block';
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
    {q:'Wat is artificiële intelligentie (AI) in de kern?', o:['Software die exact doet wat een programmeur letterlijk heeft voorgeschreven.','Software die patronen leert herkennen uit data en daarop voorspellingen maakt.','Een robot met een eigen bewustzijn en gevoelens.','Een supersnelle rekenmachine die enkel getallen verwerkt.'], a:1, f:'AI herkent patronen in data en gebruikt die om voorspellingen of beslissingen te maken — dat is het fundamentele verschil met gewone software die enkel vaste regels volgt.'},
    {q:'ChatGPT is een voorbeeld van:', o:['Generatieve AI','Een zoekmachine','Een virus','Een besturingssysteem'], a:0, f:'ChatGPT genereert zelf nieuwe tekst op basis van je vraag — dat maakt het generatieve AI, in tegenstelling tot bijvoorbeeld een zoekmachine die enkel bestaande resultaten toont.'},
    {q:'Wat is een "hallucinatie" bij AI?', o:['Wanneer de AI onverwacht crasht en herstart moet worden.','Wanneer AI met evenveel zekerheid iets verzint dat eigenlijk niet klopt.','Wanneer AI een kunstzinnige of grappige tekening maakt.','Wanneer de internetverbinding van de gebruiker plots wegvalt.'], a:1, f:'Een hallucinatie is verzonnen informatie die AI met evenveel overtuiging presenteert als correcte informatie — daarom is controleren zo belangrijk.'},
    {q:'Wat is "bias" bij AI?', o:['Een AI-model dat merkbaar te traag reageert op vragen.','Vooroordelen die AI overneemt uit de data waarop het werd getraind.','Een technische fout die in de programmeercode is geslopen.','Een AI-systeem dat structureel te veel stroom verbruikt.'], a:1, f:'AI leert van bestaande data — en als die data vooroordelen bevat, neemt het systeem die vooroordelen onbewust over.'},
    {q:'Mag je zomaar elke AI-tool gebruiken voor elke schooltaak?', o:['Ja, AI-gebruik is voor elke taak en elk vak altijd toegestaan.','Nee, het hangt af van het AI-label dat je leerkracht per opdracht geeft.','Nee, AI mag in geen enkel geval op school gebruikt worden.','Ja, maar dit mag enkel bij leerlingen uit de derde graad.'], a:1, f:'Sint-Rembert werkt met AI-labels per opdracht (zie Module 5) — dit bepaalt telkens exact wat wel en niet mag.'},
    {q:'Wat is een deepfake?', o:['Een AI-gegenereerde, nagemaakte foto, video of audio die echt lijkt maar het niet is.','Een zeldzame diepzeevis die automatisch wordt herkend door gespecialiseerde AI-software.','Een extra veilige methode om je persoonlijke wachtwoorden te versleutelen en te beveiligen.','Een verouderde vorm van computervirus die dateert uit de allervroegste internetjaren.'], a:0, f:'Deepfakes gebruiken AI om iemands gezicht, stem of beeld overtuigend na te bootsen in content die niet echt gebeurde.'},
    {q:'Waarom verbruikt AI-gebruik (zoals ChatGPT) veel energie?', o:['Omdat de AI voortdurend achtergrondmuziek afspeelt tijdens het antwoorden.','Omdat grote rekencentra nodig zijn om de vele miljarden berekeningen uit te voeren.','Dat klopt eigenlijk niet: AI-gebruik verbruikt nauwelijks extra energie.','Omdat AI-systemen enkel gedurende de nacht actief mogen zijn van de leverancier.'], a:1, f:'Elke AI-vraag vereist enorme rekenkracht in datacenters — dat kost merkbaar meer energie dan een gewone zoekopdracht.'},
    {q:'Wat betekent het als een AI-model "getraind" is?', o:['Het heeft een intensief fysiek trainingsprogramma doorlopen.','Het heeft patronen geleerd uit grote hoeveelheden voorbeelddata.','Het is fysiek verplaatst naar een datacenter in een ander land.','Het heeft een officieel examen afgelegd bij de fabrikant.'], a:1, f:'Trainen betekent: het model kreeg enorme hoeveelheden voorbeelddata te zien en leerde daaruit patronen herkennen.'},
    {q:'Mag je een AI-detectietool (die beweert AI-tekst te herkennen) volledig vertrouwen?', o:['Ja, zulke detectietools zijn wetenschappelijk 100% betrouwbaar bevonden.','Nee, ze zijn onbetrouwbaar en geven soms valse beschuldigingen.','Ja, maar enkel wanneer de tekst volledig in het Engels is geschreven.','Nee, want dit soort detectietools bestaat momenteel nog niet.'], a:1, f:'AI-detectietools zijn wetenschappelijk onvoldoende betrouwbaar bevonden — daarom gebruikt Sint-Rembert ze bewust niet (zie Module 5).'},
    {q:'Wat is het belangrijkste dat je zelf moet doen met AI-output?', o:['Niets, AI heeft altijd gelijk.','Ze kritisch controleren voor je ze gebruikt.','Ze meteen doorsturen naar vrienden.','Ze printen en inleveren.'], a:1, f:'AI kan fouten maken (hallucinaties, bias) zonder dat te laten merken — dus blijf zelf altijd kritisch controleren.'}
  ];

  const box = document.getElementById('st-quiz-box');
  const st = { ans: new Array(quiz.length).fill(null), submitted: false };
  let inner = '<div class="qc">';
  quiz.forEach((q,qi)=>{
    inner += '<div class="qb"><div class="qq">'+(qi+1)+'. '+q.q+'</div><div class="opts">';
    q.o.forEach((opt,oi)=>{
      inner += '<button class="opt" data-qi="'+qi+'" data-oi="'+oi+'" id="stq-o'+qi+'-'+oi+'"><span class="ol">'+String.fromCharCode(65+oi)+'</span>'+opt+'</button>';
    });
    inner += '</div><div class="fb" id="stq-f'+qi+'"></div></div>';
  });
  inner += '<div id="st-result" style="text-align:center;margin-top:12px;"></div>';
  inner += '<div style="text-align:center;margin-top:20px;"><button class="sr-btn g" id="st-submit" disabled>Bevestig antwoorden →</button></div></div>';
  box.innerHTML = inner;

  box.querySelectorAll('.opt').forEach(b=>{
    b.onclick = ()=>{
      if(st.submitted) return;
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
    if(st.submitted) return;
    st.submitted = true;

    let correct = 0;
    quiz.forEach((q,qi)=>{
      const chosen = st.ans[qi];
      const isCorrect = chosen === q.a;
      if(isCorrect) correct++;
      // Toon correct/fout per antwoordoptie
      q.o.forEach((_,oi)=>{
        const optEl = document.getElementById('stq-o'+qi+'-'+oi);
        optEl.disabled = true;
        optEl.classList.remove('cor');
        if(oi === q.a) optEl.classList.add('cor');
        else if(oi === chosen && !isCorrect) optEl.classList.add('wr');
      });
      // Toon uitleg
      const fb = document.getElementById('stq-f'+qi);
      fb.className = 'fb show ' + (isCorrect ? 'ok' : 'nok');
      fb.textContent = (isCorrect ? '✅ ' : '❌ ') + q.f;
    });

    const score = Math.round(correct/quiz.length*100);
    S.starttest = { taken:true, score, passed: score>=70 };
    ss(); up(); rmc();
    const sidebarUn = document.getElementById('un');
    if(sidebarUn) sidebarUn.value = S.name;
    ua();

    document.getElementById('st-result').innerHTML =
      '<div style="font-size:15px;font-weight:800;color:var(--blue);margin-bottom:14px;">Score: '+score+'% ('+correct+'/'+quiz.length+' juist)</div>';

    const submitBtn = document.getElementById('st-submit');
    submitBtn.textContent = 'Ga verder naar Module 1 →';
    submitBtn.disabled = false;
    submitBtn.onclick = ()=>{ rm1(); sv('mod1'); };

    document.getElementById('main').scrollTo({top:0, behavior:'smooth'});
  };
}

/* ════════════════════════════════════════════
   MODULE 1 — WAT IS AI? (11 stappen)
   Gebaseerd op EDUbox Artificiële Intelligentie (VRT/imec/Mediawijs), deel 1
   ════════════════════════════════════════════ */

const m1 = [m1s0, m1s1, m1s2, m1s3, m1s4, m1s5, m1s6, m1s7, m1s8, m1s9, m1s10];

function rm1(){ const c=document.getElementById('m1c'); c.innerHTML=''; rDots(1,m1.length,S.mod1.step); m1[S.mod1.step](c); lockNextButtons(c); }
function n1(){ S.mod1.step++; ss(); S.mod1.step>=m1.length ? d1() : rm1(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); }
function p1(){ if(S.mod1.step > 0){ S.mod1.step--; ss(); rm1(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); } }
function d1(){ S.mod1.done=true; S.mod1.step=0; ss(); up(); rmc(); sv('home'); setTimeout(()=>alert('🎉 Module 1 voltooid! Module 2 is nu beschikbaar.'),300); }

function m1s0(c){
  c.innerHTML = `
<div class="s-badge">🤔 Stap 1 van 11 · AI is overal</div>
<h2 class="ch2">AI is <em>overal</em> aanwezig</h2>
<p class="cp">Geloof het of niet, maar je komt voortdurend in contact met AI. Apps zoals Waze of Google Maps, sociale media zoals Instagram en TikTok, streamingplatformen zoals Netflix en Spotify: ze maken allemaal gebruik van AI. En dat is nog maar het begin — AI wordt in nog veel meer toepassingen gebruikt.</p>

<div style="background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%); border-radius: 12px; padding: 18px 20px; margin: 16px 0; text-align: center; color: white;">
  <div style="font-size: 22px; margin-bottom: 8px;">🎧</div>
  <p style="font-size: 13px; margin: 0 0 12px 0; font-weight: 600;">Liever luisteren dan lezen? Er is een podcast over deze cursus.</p>
  <button onclick="playPodcastL1()" style="background: rgba(255,255,255,0.95); color: #9C27B0; border: none; border-radius: 8px; padding: 10px 20px; font-weight: 700; cursor: pointer; font-size: 13px;">▶ Beluister de podcast</button>
</div>

<div class="ib warn">
  <div class="ib-t">💭 Denk even na</div>
  <div class="ib-b">Voor je verdergaat: in welke apps of toestellen denk jij dat AI verwerkt zit? Onthou je antwoord — aan het eind van deze stap kom je erachter of je gelijk had.</div>
</div>

<h3 class="ch3">📱 Concrete voorbeelden uit de praktijk</h3>
<div style="background: rgba(10,31,168,0.08); border-radius: 8px; padding: 16px; margin: 16px 0;">
<p style="font-size: 13px; color: #3d4f8a; line-height: 1.9; margin: 0;">
<strong>🎙️ dj ImAIne (MNM):</strong> Toen dj Imane Boudadi in 2023 een week niet aanwezig kon zijn tijdens haar programma, werd ze vervangen door een AI-versie van haar stem. De presentatieteksten werden geschreven met ChatGPT, en een gekloonde versie van haar stem sprak ze uit. Een week lang praatte deze fictieve "dj ImAIne" het programma Happy Hits aan elkaar.<br><br>
<strong>📸 Instagram:</strong> Instagram bepaalt welke posts bovenaan je homepagina verschijnen door jouw gedrag te analyseren — welke profielen je volgt, welke foto's je liket, waar je bij stilstaat. Zo ontdekt het patronen en voorspelt het welke content je langer op het platform houdt.<br><br>
<strong>🚗 Zelfrijdende auto's:</strong> Verschillende autofabrikanten ontwikkelen auto's die volledig zelfstandig van punt A naar B rijden, met behulp van meerdere AI-modellen tegelijk.
</p>
</div>

<div class="nw">
  <button class="sr-btn g" onclick="n1()">Volgende: wat is AI precies? →</button>
  <span class="nh">Stap 1/11</span>
</div>`;
}

function m1s1(c){
  c.innerHTML = `
<div class="s-badge">🔍 Stap 2 van 11 · Een definitie</div>
<h2 class="ch2">Wat is artificiële <em>intelligentie</em> precies?</h2>
<p class="cp">Dit is meteen een moeilijke vraag om te beantwoorden, want er bestaan veel verschillende definities. Bovendien blijft AI in volle ontwikkeling.</p>

<div class="ib warn">
  <div class="ib-t">📖 Werkdefinitie</div>
  <div class="ib-b">In brede zin verwijst AI naar <strong>machines die zelfstandig kunnen leren en handelen</strong>. Deze machines kunnen zelf beslissingen nemen, zoals ook dieren en mensen dat doen.</div>
</div>

<p class="cp">Belangrijk om te onthouden: AI is een <strong>containerbegrip</strong>. Dat wil zeggen dat er veel verschillende dingen onder de noemer "AI" vallen — van een simpele spamfilter tot een chatbot die een volledig gesprek voert.</p>

<h3 class="ch3">📜 Een korte tijdlijn</h3>
<p class="cp">Wetenschappers zijn al even bezig met deze technologie. Er werd voor het eerst over gesproken in de jaren '50. AI heeft ondertussen vele evoluties meegemaakt, en heeft gouden en donkere tijden gekend. Op dit moment leven we in een periode waarin AI enorm aan het groeien is.</p>

<h3 class="ch3">🕵️ Hoe weet je of iets écht "intelligent" is?</h3>
<p class="cp">Al in de jaren '50 bedacht een wiskundige een simpele test om deze vraag te beantwoorden: laat een mens via een tekstscherm chatten met iets — soms een mens, soms een machine — zonder te weten met wie hij praat. Kan hij na een tijdje niet meer zeggen wie of wat er aan de andere kant zit? Dan gedraagt die machine zich, voor de buitenwereld, "intelligent". Merk op: dit zegt niets over wat er écht in de machine omgaat, enkel over hoe overtuigend ze zich naar buiten toe gedraagt.</p>

<div style="background: rgba(10,31,168,0.08); border-radius: 8px; padding: 16px; margin: 16px 0;">
<p style="font-size: 13px; color: #3d4f8a; line-height: 1.8; margin: 0;">
<strong>💭 Denkoefening: de kamer vol Chinese symbolen</strong><br>
Stel je een gesloten kamer voor met daarin een persoon die geen woord Chinees kent. Via een gleuf in de deur krijgt hij briefjes met Chinese tekens naar binnen geschoven. Hij heeft een dik handboek met regels: "als je dít teken ziet, schrijf dan dát teken terug." Door dat boek perfect te volgen, stuurt hij foutloze Chinese antwoorden naar buiten — voor de mensen buiten de kamer lijkt het alsof daarbinnen iemand vloeiend Chinees spreekt en begrijpt. Maar de persoon zelf begrijpt er geen snars van; hij volgt gewoon regels.<br><br>
Deze denkoefening laat zien waarom het lastig is om te zeggen of een AI-systeem écht "begrijpt" wat het zegt, of gewoon (razendsnel en heel overtuigend) patronen en regels volgt zonder enig besef van betekenis. Een goede vraag om in je achterhoofd te houden telkens ChatGPT of een andere AI-tool een vlot antwoord geeft.
</p>
</div>

<h3 class="ch3">🎯 Meer voorbeelden van AI-impact</h3>
<div style="background: rgba(127,224,0,0.1); border-radius: 8px; padding: 16px; margin: 16px 0;">
<p style="font-size: 13px; color: #3d4f8a; line-height: 1.9; margin: 0;">
<strong>🎤 'Because of You' — Gustaph:</strong> De Belgische zanger Gustaph nam in 2023 deel aan het Eurovisiesongfestival met zijn hit "Because of You". VRT NWS deed de test: met AI werd de song ingezongen door sterren als Billie Eilish en Taylor Swift. Zelfs de dode zanger Freddie Mercury en de animatiefiguur Homer Simpson "deden mee"!<br><br>
<strong>📺 Reclame op sociale media:</strong> MrBeast is een populair YouTube-kanaal. Op sociale media verscheen ooit een reclamefilmpje waarin hij nieuwe smartphones aanbood voor slechts 2 dollar — maar die advertentie was een <strong>deepfake</strong>. Oplichters kunnen dankzij AI geloofwaardige video's maken waarin ze bekende mensen dingen laten zeggen of doen die ze nooit deden.
</p>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: de 3 elementen →</button>
  <span class="nh">Stap 2/11</span>
</div>`;
}

function m1s2(c){
  c.innerHTML = `
<div class="s-badge">🧩 Stap 3 van 11 · De 3 elementen</div>
<h2 class="ch2">AI bestaat uit <em>3 elementen</em></h2>
<p class="cp">Om AI te kunnen gebruiken, heb je eerst en vooral een <strong>computer</strong> nodig.</p>

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin: 16px 0;">
<div style="background: white; border: 2px solid var(--blue); border-radius: 8px; padding: 14px; text-align:center;">
<div style="font-size:28px;margin-bottom:8px;">💻</div>
<div style="font-weight: 700; color: var(--blue); font-size: 12px; text-transform: uppercase; margin-bottom: 6px;">1. Computersysteem</div>
<p style="font-size: 12px; color: #3d4f8a; line-height: 1.6; margin: 0;">Een sterk en snel computersysteem om de nodige software te voorzien.</p>
</div>
<div style="background: white; border: 2px solid var(--green); border-radius: 8px; padding: 14px; text-align:center;">
<div style="font-size:28px;margin-bottom:8px;">📊</div>
<div style="font-weight: 700; color: var(--green); font-size: 12px; text-transform: uppercase; margin-bottom: 6px;">2. Data</div>
<p style="font-size: 12px; color: #3d4f8a; line-height: 1.6; margin: 0;">Heel veel data. Hoe meer data er zijn, hoe gemakkelijker de computer patronen kan vinden.</p>
</div>
<div style="background: white; border: 2px solid var(--orange); border-radius: 8px; padding: 14px; text-align:center;">
<div style="font-size:28px;margin-bottom:8px;">⚙️</div>
<div style="font-weight: 700; color: var(--orange); font-size: 12px; text-transform: uppercase; margin-bottom: 6px;">3. Algoritmes</div>
<p style="font-size: 12px; color: #3d4f8a; line-height: 1.6; margin: 0;">Algoritmes gebruiken wiskunde om patronen te herkennen en toe te passen op nieuwe data.</p>
</div>
</div>

<p class="cp"><strong>Data</strong> of gegevens zijn een tweede belangrijk element. Een machine leert van data, net zoals jij dat ook doet. Je geeft de machine veel voorbeelden — denk bijvoorbeeld aan duizenden foto's van "zombies" en duizenden foto's van "mensen", zodat je een systeem traint.</p>

<p class="cp">De machine zal die voorbeelden dan <strong>analyseren en naar patronen zoeken</strong>. Ze doet dat met behulp van allerlei wiskundige formules, <strong>algoritmes</strong> genoemd. Dit is het derde element van AI. Als je de machine dan een nieuwe foto toont van een zombie of een mens, zal AI een kans geven, gebaseerd op de analyses: er is bijvoorbeeld 87% kans dat het om een mens gaat.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: doe-opdracht →</button>
  <span class="nh">Stap 3/11</span>
</div>`;
}

function m1s3(c){
  c.innerHTML = `
<div class="s-badge">🧩 Stap 4 van 11 · Doe-opdracht</div>
<h2 class="ch2">Is het <em>AI</em> of niet?</h2>
<p class="cp">Klik op elke kaart en denk eerst zelf na: gebruikt deze toepassing de 3 elementen van AI (computer + data + algoritme dat patronen herkent), of werkt ze met vaste, vooraf geprogrammeerde regels?</p>
<div id="aig"></div>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: impact van AI →</button>
  <span class="nh">Stap 4/11</span>
</div>`;
  renderAiCards();
}

function m1s4(c){
  c.innerHTML = `
<div class="s-badge">🌍 Stap 5 van 11 · De impact van AI</div>
<h2 class="ch2">De <em>impact</em> van artificiële intelligentie</h2>
<p class="cp">AI wordt al veel gebruikt in het dagelijkse leven, maar zal dat in de toekomst nog veel vaker doen. Bij sociale media bijvoorbeeld, maar ook op het vlak van mobiliteit, geneeskunde, muziek... De impact van AI op ons leven is dus nu al groot!</p>

<h3 class="ch3">🚗 Bespreek met jezelf: zelfrijdende auto's</h3>
<div style="background: rgba(10,31,168,0.08); border-radius: 8px; padding: 16px; margin: 16px 0;">
<p style="font-size: 13px; color: #3d4f8a; line-height: 1.8; margin: 0;">
Zouden we in de toekomst zelf niet meer moeten rijden, maar doet de auto alles voor ons? Denk na over deze 3 vragen:<br><br>
1. Waarom zou dit handig zijn in het verkeer?<br>
2. Hoe zou AI in het verkeer een gevaar kunnen vormen?<br>
3. Wat zou jij niet aan AI willen overlaten in de auto?
</p>
</div>

<h3 class="ch3">📉 Niet alleen voordelen</h3>
<p class="cp">AI heeft veel mogelijkheden. De technologie helpt ons leven op vele vlakken vooruit. Maar aan het gebruik van AI zijn <strong>ook risico's verbonden</strong>, zoals je al in het voorbeeld van de MrBeast-deepfake zag.</p>
<p class="cp">De impact van AI op de samenleving valt dus niet te onderschatten. Net daarom is het belangrijk om vragen te stellen. Waarvoor willen we deze technologie gebruiken? Op welke vlakken kan ze zinvol zijn? En moeten we beperkingen opleggen? Hier moeten we met z'n allen, als samenleving, over nadenken.</p>
<p class="cp">Maar dit debat kunnen we enkel voeren wanneer we weten hoe AI en de machines precies werken. En dat gaan we in Module 2 bekijken!</p>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: discussie →</button>
  <span class="nh">Stap 5/11</span>
</div>`;
}

function m1s5(c){
  c.innerHTML = `
<div class="s-badge">💬 Stap 6 van 11 · Discussie</div>
<h2 class="ch2">Wat denk <em>jij</em>?</h2>
<div class="disc-card">
  <div class="disc-q">1. dj ImAIne presenteerde een week lang een radioprogramma zonder dat de echte dj aanwezig was. Zou jij dit oké vinden als luisteraar, zolang het duidelijk vermeld wordt?</div>
  <div class="disc-a">Er is geen goed of fout antwoord. Belangrijk is vaak de transparantie: zolang luisteraars weten dat het om een AI-stem gaat, ervaren de meeste mensen dit als minder problematisch dan wanneer het verborgen wordt gehouden.</div>
</div>
<div class="disc-card">
  <div class="disc-q">2. Instagram "leert" wat jij graag ziet, om je langer op het platform te houden. Vind je dit vooral handig, of vooral verontrustend?</div>
  <div class="disc-a">Beide zijn waar: het is handig omdat je relevante content ziet, maar verontrustend omdat het platform je gedrag stuurt zonder dat je het altijd beseft — en je betaalt ervoor met je data en aandacht.</div>
</div>
<div class="disc-card">
  <div class="disc-q">3. Bedenk zelf: in welke apps of toestellen die je dagelijks gebruikt, zit vermoedelijk AI verwerkt die je nog niet had genoemd?</div>
  <div class="disc-a">Denk aan: automatische ondertiteling, spellingcontrole, gezichtsherkenning om foto's te sorteren, aanbevelingen op YouTube of TikTok, navigatie-apps die files voorspellen.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: video →</button>
  <span class="nh">Stap 6/11</span>
</div>`;
}

function m1s6(c){
  c.innerHTML = `
<div class="s-badge">🎬 Stap 7 van 11 · Video</div>
<h2 class="ch2">Bekijk: <em>AI-toepassingen in de praktijk</em></h2>
<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/sosmC2h4LLE" allowfullscreen loading="lazy" title="EDUbox Artificiële Intelligentie — Introductie"></iframe></div>
<div class="ib warn">
  <div class="ib-t">📝 Samenvatting</div>
  <div class="ib-b">Deze video toont hoe AI al overal om ons heen aanwezig is — van persoonlijke aanbevelingen op Spotify en Netflix tot zelfrijdende auto's. Ze plaatst het dagelijkse AI-gebruik in perspectief, precies zoals de voorbeelden die je hierboven las.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: hype of realiteit? →</button>
  <span class="nh">Stap 7/11</span>
</div>`;
}

function m1s7(c){
  c.innerHTML = `
<div class="s-badge">⚖️ Stap 8 van 11 · Hype of realiteit?</div>
<h2 class="ch2">AI in het nieuws: <em>hype of realiteit?</em></h2>
<p class="cp">Op TikTok en YouTube zie je de wildste doemscenario's over AI — en evengoed de wildste beloftes. Om dat in perspectief te plaatsen, bekijk dit videofragment.</p>

<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/-WDdSiVjBhg" allowfullscreen loading="lazy" title="NOS op 3 — Roeit AI ons uit of is het hype"></iframe></div>
<p class="cp">Deze video plaatst extreme doemscenario's rondom AI in perspectief en verlegt de focus naar de échte, actuele uitdagingen zoals misinformatie en tech-hypes.</p>

<div class="ib warn">
  <div class="ib-t">🎓 Wat zegt de wetenschap?</div>
  <div class="ib-b">Onderzoeker Rani Van Schoors (KU Leuven) illustreert hoe fout AI kan zitten: Google Bard (nu Gemini) vertelde ooit onterecht dat de James Webb-ruimtetelescoop als eerste beelden van buiten ons zonnestelsel had gemaakt — dat klopte niet. Bron: Klasse, "AI in het onderwijs" — <a href="https://www.klasse.be/722771/ai-in-het-onderwijs-expert-rani-schoors/" target="_blank">klasse.be/722771</a></div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: kennischeck →</button>
  <span class="nh">Stap 8/11</span>
</div>`;
}

function m1s8(c){
  const quiz = [
    {q:'Wat is de brede definitie van AI die je in deze module leerde?', o:['Robots die exact bewegen zoals mensen','Machines die zelfstandig kunnen leren en handelen','Elke computer met internetverbinding','Software die nooit fouten maakt'], a:1, f:'AI verwijst in brede zin naar machines die zelfstandig kunnen leren en handelen — zoals ook dieren en mensen dat doen.'},
    {q:'Wat waren de 3 elementen van AI die je leerde?', o:['Scherm, toetsenbord, muis','Computer, data, algoritmes','Wifi, batterij, camera','Software, hardware, internet'], a:1, f:'Een sterk computersysteem, veel data, en algoritmes die patronen herkennen — dat zijn de 3 bouwstenen.'},
    {q:'Bij het dj ImAIne-voorbeeld: wat gebeurde er precies?', o:['Een fysieke AI-robot nam de plaats in van de dj in de radiostudio','Een AI-versie van de stem van dj Imane presenteerde het programma een week lang','De volledige radiozender werd tijdelijk gehackt door een AI-systeem','Luisteraars stemden via een AI-app op hun favoriete nummers'], a:1, f:'ChatGPT schreef de teksten en een gekloonde AI-stem sprak ze uit — een week lang, zonder dat de echte dj aanwezig was.'},
    {q:'Waarom bepaalt Instagram met AI welke posts je ziet?', o:['Om volledig willekeurige content te tonen aan elke individuele gebruiker','Om je gedrag te analyseren en te voorspellen wat jou langer op het platform houdt','Om uitsluitend betaalde reclame te tonen ongeacht je persoonlijke voorkeuren','Om je persoonlijke gegevens automatisch door te sturen naar overheidsinstanties'], a:1, f:'Instagram analyseert patronen in jouw gedrag (likes, kijktijd) om voorspellingen te doen over wat jij interessant vindt.'},
    {q:'Wat toonde het MrBeast-voorbeeld aan?', o:['Dat elke AI-gegenereerde video altijd te herkennen is aan een duidelijk zichtbaar watermerk','Dat AI-deepfakes gebruikt kunnen worden om mensen op te lichten met valse advertenties','Dat MrBeast zelf actief AI-technologie ontwikkelt en verkoopt aan andere kanalen','Dat het maken van deepfakes overal ter wereld wettelijk verboden is verklaard'], a:1, f:'Oplichters gebruikten een AI-gegenereerde nepvideo van MrBeast om een valse (te goedkope) smartphone-aanbieding te promoten.'}
  ];
  rQuiz(c, quiz, 1, 'mod1', n1, 60);
}

function m1s9(c){
  c.innerHTML = `
<div class="s-badge">✍️ Stap 10 van 11 · Stellingen</div>
<h2 class="ch2">Waar sta <em>jij</em>?</h2>
<p class="cp">Geen goed of fout antwoord — enkel jouw mening.</p>
<div id="stl-m1"></div>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" onclick="n1()">Volgende: reflectie →</button>
  <span class="nh">Stap 10/11</span>
</div>`;
  renderStellingenLeerling('stl-m1', 'l_m1', ['Ik zou het oké vinden als een AI-stem soms mijn favoriete radioprogramma presenteert, zolang dit vermeld wordt.','Sociale media zouden verplicht moeten aangeven wanneer AI bepaalt wat ik te zien krijg.']);
}

function m1s10(c){
  c.innerHTML = `
<div class="s-badge">✍️ Stap 11 van 11 · Jouw reflectie</div>
<h2 class="ch2">Vertaal naar <em>jouw leven</em></h2>
<p class="cp">Noteer hieronder je reflectie (minstens een paar zinnen): waar zie JIJ AI in jouw dagelijkse leven — bij dingen die je nu pas beseft dankzij deze module? En wat vond je van de voorbeelden (dj ImAIne, Instagram, de MrBeast-deepfake)?</p>
<p style="font-size:11px;color:#999;font-style:italic;margin:-8px 0 12px 0;">📄 Werk je liever op papier? Deze samenvatting en reflectie staan ook op <strong>pagina 3-4</strong> van je invulcursus.</p>
<textarea class="sr-ta" id="ref1" placeholder="Ik gebruik AI eigenlijk al bij... Het voorbeeld dat me het meest verraste was..."></textarea>

<div class="nw">
  <button class="sr-btn b" onclick="p1()">← Vorige</button>
  <button class="sr-btn g" id="ref1btn" onclick="sRef1()">✅ Module 1 afronden →</button>
  <span class="nh">Stap 11/11</span>
</div>`;
  const ta = document.getElementById('ref1');
  ta.value = localStorage.getItem('sr_l_ref1') || '';
  ta.oninput = ()=>localStorage.setItem('sr_l_ref1', ta.value);
}

function sRef1(){
  const v = (document.getElementById('ref1').value||'').trim();
  if(v.length < 20){ alert('Vul eerst je reflectie in (minstens een paar zinnen).'); return; }
  n1();
}


/* ════════════════════════════════════════════
   MODULE 2 — HOE WERKT AI? (11 stappen)
   Gebaseerd op EDUbox Artificiële Intelligentie, deel 2 "De principes van AI"
   ════════════════════════════════════════════ */

const m2 = [m2s0, m2s1, m2s2, m2s3, m2s4, m2s5, m2s6, m2s7, m2s8, m2s9, m2s10, m2s11];

function rm2(){ const c=document.getElementById('m2c'); c.innerHTML=''; rDots(2,m2.length,S.mod2.step); m2[S.mod2.step](c); lockNextButtons(c); }
function n2(){ S.mod2.step++; ss(); S.mod2.step>=m2.length ? d2() : rm2(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); }
function p2(){ if(S.mod2.step > 0){ S.mod2.step--; ss(); rm2(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); } }
function d2(){ S.mod2.done=true; S.mod2.step=0; ss(); up(); rmc(); sv('home'); setTimeout(()=>alert('🎉 Module 2 voltooid! Module 3 is nu beschikbaar.'),300); }

function m2s0(c){
  c.innerHTML = `
<div class="s-badge">⚙️ Stap 1 van 12 · 3 fasen in de geschiedenis van AI</div>
<h2 class="ch2">Ik denk, jij denkt, <em>het denkt</em></h2>
<p class="cp">AI is een containerbegrip. Dat wil zeggen dat er veel verschillende dingen onder de noemer "AI" vallen. In het algemeen onderscheiden we <strong>3 fasen</strong> in de geschiedenis van AI.</p>

<div style="background: white; border-radius: 8px; padding: 16px; margin: 16px 0; border: 1px solid #e0e4f5;">
<div style="display:flex; align-items:center; gap: 8px; margin-bottom: 10px;">
  <div style="background: var(--blue); color:white; border-radius:50%; width:26px; height:26px; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700;">1</div>
  <strong style="font-size:13px;">Procedurele fase</strong>
</div>
<p style="font-size:12px;color:#3d4f8a;margin:0 0 14px 34px;">In de eerste fase, net na de Tweede Wereldoorlog, leek AI op een instructieboekje om een Ikeabed in elkaar te zetten: eerst doe je stap 1, daarna stap 2, enzovoort.</p>
<div style="display:flex; align-items:center; gap: 8px; margin-bottom: 10px;">
  <div style="background: var(--green); color:white; border-radius:50%; width:26px; height:26px; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700;">2</div>
  <strong style="font-size:13px;">Machine learning</strong>
</div>
<p style="font-size:12px;color:#3d4f8a;margin:0 0 14px 34px;">In de jaren '80 ging AI een tweede fase in: die van machine learning. De rekenkracht van machines werd sterker en je kon een machine dingen aanleren.</p>
<div style="display:flex; align-items:center; gap: 8px; margin-bottom: 10px;">
  <div style="background: var(--orange); color:white; border-radius:50%; width:26px; height:26px; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700;">3</div>
  <strong style="font-size:13px;">Deep learning</strong>
</div>
<p style="font-size:12px;color:#3d4f8a;margin:0 0 0 34px;">Sinds 2010 spreken we van een derde fase binnen AI: die van deep learning. AI is nu in staat om complexe taken uit te voeren. Dit leidde in 2022 tot de doorbraak van generatieve AI, waarbij machines zelf iets kunnen creëren.</p>
</div>

<div class="nw">
  <button class="sr-btn g" onclick="n2()">Volgende: procedurele AI →</button>
  <span class="nh">Stap 1/12</span>
</div>`;
}

function m2s1(c){
  c.innerHTML = `
<div class="s-badge">🔧 Stap 2 van 12 · Fase 1: Procedurele AI</div>
<h2 class="ch2">Hoe werkt <em>procedurele</em> AI?</h2>
<p class="cp">Bij procedurele AI volgt een computer de eenvoudige instructies van een duidelijk stappenplan. Eerst doe je stap 1, dan stap 2, enzovoort.</p>

<div style="background: #f5f5f5; padding: 14px; border-radius: 8px; margin: 16px 0;">
<div style="display:flex; gap:16px; align-items:center; justify-content:space-around; flex-wrap:wrap;">
  <div style="text-align:center;"><div style="font-size:32px;">♟️</div><div style="font-size:11px; font-weight:700; color:#3d4f8a;">Schaakcomputer</div></div>
  <div style="text-align:center;"><div style="font-size:32px;">📧</div><div style="font-size:11px; font-weight:700; color:#3d4f8a;">Spamfilter</div></div>
  <div style="text-align:center;"><div style="font-size:32px;">💬</div><div style="font-size:11px; font-weight:700; color:#3d4f8a;">Simpele chatbots</div></div>
</div>
</div>

<h3 class="ch3">♟️ Hoe "denkt" een schaakcomputer vooruit?</h3>
<p class="cp">Een klassieke schaakcomputer is een mooi voorbeeld van procedurele AI in actie. Voor elke zet die hij overweegt, tekent hij in gedachten een soort boompje: "als ik hier zet, kan mijn tegenstander daarop reageren met A, B of C — en op elk van die reacties kan ík dan weer reageren met..." Dat boompje van mogelijke zetten en tegenzetten wordt al snel enorm groot.</p>
<p class="cp">De computer doorloopt dat hele boompje en kent aan elke uiteindelijke stelling een score toe: goed voor hem, of goed voor de tegenstander. Vervolgens redeneert hij terug: hij gaat ervan uit dat hijzelf steeds de beste zet voor zichzelf kiest, en dat zijn tegenstander steeds de beste zet vóór zichzelf (dus de slechtste voor de computer) zal kiezen. Zo rolt er, helemaal volgens vaste regels, één beste zet uit — geen giswerk, puur stap-voor-stap doorrekenen. Bij eenvoudige spelletjes zoals boter-kaas-en-eieren kan een computer op deze manier zelfs nooit meer verliezen.</p>

<h3 class="ch3">🧟 Doe-opdracht: onderscheid zombie van mens</h3>
<p class="cp">Stel je voor: je moet een computer leren om zombies van mensen te onderscheiden <strong>volgens een vaste procedure</strong> — dus met vaste vragen in een vaste volgorde, zoals een beslisboom:</p>

<div style="background: white; border-radius: 8px; padding: 16px; margin: 16px 0; border: 1px solid #e0e4f5; font-size:12px; color:#3d4f8a; line-height:2;">
❓ Huidskleur natuurlijk? → Nee → <strong>🧟 Zombie</strong><br>
✅ Huidskleur natuurlijk? → Ja → volgende vraag: Ogen normaal?<br>
&nbsp;&nbsp;&nbsp;❓ Ogen leeg? → Ja → volgende vraag: Schedel zichtbaar?<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❓ Hersenen zichtbaar? → Ja → <strong>🧟 Zombie</strong> / Nee → <strong>🙂 Mens</strong><br>
&nbsp;&nbsp;&nbsp;✅ Ogen normaal? → Ja → volgende vraag: Bloedvijm van de mond?<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;❓ Bloedvijm zichtbaar? → Ja → <strong>🧟 Zombie</strong> / Nee → <strong>🙂 Mens</strong>
</div>

<p class="cp">Je zal merken: dit werkt goed <strong>zolang elke situatie exact past</strong> in het vaste stappenplan. Maar dit is een nadeel van procedurele AI: het is geen flexibel systeem. Als er iets nieuws bijkomt — een half-mens-half-zombie, of een mens met griep — dan weet het systeem niet hoe het ermee moet omgaan.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="n2()">Volgende: machine learning →</button>
  <span class="nh">Stap 2/12</span>
</div>`;
}

function m2s2(c){
  c.innerHTML = `
<div class="s-badge">🧠 Stap 3 van 12 · Fase 2: Machine Learning</div>
<h2 class="ch2">Hoe werkt <em>machine learning</em>?</h2>
<p class="cp">Vanaf de jaren '80 slaagden machines erin om dingen te leren, de zogenaamde fase van machine learning. Ze werden getraind om verbanden te zien in data.</p>

<h3 class="ch3">📦 De "black box"</h3>
<p class="cp">Het "leren" gebeurt in de <strong>black box</strong>. Hiermee bedoelen we dat je een resultaat krijgt zonder dat de machine uitlegt of laat zien hoe het dat gedaan heeft.</p>

<div style="background: rgba(10,31,168,0.08); border-radius: 8px; padding: 20px; margin: 16px 0; text-align:center;">
<div style="display:flex; align-items:center; justify-content:center; gap:16px; flex-wrap:wrap;">
  <div style="font-weight:700; color:var(--blue); font-size:14px;">input</div>
  <div style="font-size:20px;">→</div>
  <div style="background:var(--blue); color:white; padding:14px 24px; border-radius:8px; font-weight:700; font-size:13px;">BLACK BOX<br><span style="font-size:10px; opacity:0.8;">algoritme</span></div>
  <div style="font-size:20px;">→</div>
  <div style="font-weight:700; color:var(--blue); font-size:14px;">output</div>
</div>
</div>

<p class="cp">Data worden in een machine gestoken (= input). Er vinden allerlei berekeningen plaats. En ten slotte krijg je een resultaat, de output. We onderscheiden <strong>3 soorten machine learning</strong>: gesuperviseerd leren, ongesuperviseerd leren, en versterkend leren.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="n2()">Volgende: gesuperviseerd leren →</button>
  <span class="nh">Stap 3/12</span>
</div>`;
}

function m2s3(c){
  c.innerHTML = `
<div class="s-badge">👁️ Stap 4 van 12 · 1. Gesuperviseerd leren</div>
<h2 class="ch2">Gesuperviseerd <em>leren</em></h2>
<p class="cp">Dit betekent <strong>"gecontroleerd leren"</strong>. Je vertelt dan aan de computer wat de voorbeelden zijn.</p>

<div style="background: rgba(10,31,168,0.08); border-radius: 8px; padding: 16px; margin: 16px 0;">
<p style="font-size: 13px; color: #3d4f8a; line-height: 1.8; margin: 0;">
Je geeft duizenden foto's van een zombie en zegt: "Dit is een zombie." Je geeft duizenden foto's van een mens en zegt: "Dit is een mens." Zo leert de computer gaandeweg mensen en zombies herkennen. Je werkt met data die een label hebben, ofwel <strong>gelabelde data</strong>.
</p>
</div>

<h3 class="ch3">📸 Een voorbeeld dat je al gebruikt hebt</h3>
<p class="cp">Gezichtsherkenning. De foto-app van jouw smartphone heeft de optie om specifieke personen in je foto's te benoemen, waarna het algoritme op zoek gaat naar andere foto's met dezelfde persoon en deze groepeert. <strong>Maar helemaal zeker is het systeem nooit.</strong></p>

<h3 class="ch3">👥 Eén van de simpelste manieren: kijk naar je "buren"</h3>
<p class="cp">Een van de makkelijkst te begrijpen technieken achter gesuperviseerd leren is verrassend simpel: vergelijk het nieuwe geval gewoon met de voorbeelden die je al kent, en kijk welke het meest gelijken. Stel dat je duizenden gelabelde zombie- en mensfoto's hebt, elk beschreven aan de hand van een paar kenmerken (bijvoorbeeld: hoe bleek de huid is, hoe leeg de ogen staan). Een nieuwe, ongelabelde foto plaats je dan denkbeeldig tussen al die andere foto's. Welke gelabelde foto's liggen het dichtst in de buurt — qua kenmerken — bij deze nieuwe foto? Als de 5 dichtste "buren" allemaal zombies waren, is de kans groot dat deze nieuwe foto ook een zombie is. Geen ingewikkelde formules nodig: gewoon "wie lijkt het meest op wie".</p>

<h3 class="ch3">📧 En hoe berekent een spamfilter dan een kans?</h3>
<p class="cp">Spamfilters (zie ook Module 1) werken vaak met eenzelfde soort denkwijze, maar dan gebaseerd op hoe vaak bepaalde woorden voorkomen. Stel je onderstaand voorbeeld voor, met ronde getallen om het simpel te houden:</p>
<div style="background: white; border-radius: 8px; padding: 14px; margin: 12px 0; border: 1px solid #e0e4f5; font-size:12px; color:#3d4f8a; line-height:1.9;">
📊 Van elke 100 e-mails met het woord "GRATIS" zijn er 90 spam en 10 niet.<br>
📊 Van elke 100 e-mails zónder dat woord zijn er maar 5 spam.<br>
📬 Komt er een nieuwe e-mail binnen met het woord "GRATIS"? Dan weet het systeem: dit lijkt sterk op de groep waarin 90% spam bleek te zijn — dus hoge kans dat dit er ook één is.
</div>
<p class="cp">Zo'n filter combineert dit voor tientallen woorden tegelijk, en telt alles samen op tot één eindkans. Simpel om te begrijpen, en toch verrassend krachtig in de praktijk.</p>

<h3 class="ch3">🧪 Doe-opdracht</h3>
<p class="cp">De computer onderscheidt zombies van mensen door <strong>gelabelde data</strong>: hij leert categorieën herkennen aan de hand van voorbeelden. Na genoeg input kan hij zelfstandig voorspellen.</p>
<div style="background: white; border-radius: 8px; padding: 14px; margin: 12px 0; border: 1px solid #e0e4f5; font-size:12px; color:#3d4f8a; line-height:1.8;">
1️⃣ Stel je voor: je toont de computer 4 voorbeeldfoto's van mensen en 4 van zombies, elk met het juiste label erbij.<br>
2️⃣ Je toont de computer een nieuwe, ongelabelde foto.<br>
3️⃣ De computer berekent een kans om te beslissen tot welke groep het kaartje behoort: "zombie" of "mens" — gebaseerd op de kenmerken die het al kent.
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="n2()">Volgende: ongesuperviseerd leren →</button>
  <span class="nh">Stap 4/12</span>
</div>`;
}

function m2s4(c){
  c.innerHTML = `
<div class="s-badge">🔍 Stap 5 van 12 · 2. Ongesuperviseerd leren</div>
<h2 class="ch2">Ongesuperviseerd <em>leren</em></h2>
<p class="cp">Bij ongesuperviseerd leren worden er geen labels meegegeven aan de input. De machine gaat "ongecontroleerd" leren en moet zelf structuur aanbrengen in de data.</p>
<p class="cp">De algoritmes moeten de data dus onderbrengen in groepen, zonder te weten hoe ze eraan moet beginnen. De machine doet dit door op zoek te gaan naar overeenkomsten in de data. Op basis hiervan zal ze <strong>verzamelingen voorstellen</strong>.</p>

<div class="ib warn">
  <div class="ib-t">🎵 Een voorbeeld dat je kent: Spotify, Netflix, YouTube</div>
  <div class="ib-b">De computer verdeelt gebruikers of content in groepen en kan je bepaalde groepen van producten aanraden, gebaseerd op je kijk-, luister- of koopgedrag. Maar soms loopt dit al eens fout en krijg je producten voorgesteld die je niet leuk vindt.</div>
</div>

<p class="cp">Vergelijk het met een computer die duizenden zombie/mens-kaartjes krijgt <strong>zonder labels</strong>. De machine kijkt zelf naar overeenkomsten (kleur, vorm, patroon) en verdeelt de kaartjes in bijvoorbeeld 2 groepen — zonder dat iemand haar heeft verteld welke groep "zombie" is en welke "mens".</p>

<h3 class="ch3">🕹️ Vergelijk met een spel</h3>
<p class="cp">Denk aan een winkel die producten netjes in categorieën verdeelt zonder dat iemand haar vertelde welke categorieën er bestaan — de machine ontdekt die zelf, op basis van wat vaak samen gekocht wordt.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="n2()">Volgende: versterkend leren →</button>
  <span class="nh">Stap 5/12</span>
</div>`;
}

function m2s5(c){
  c.innerHTML = `
<div class="s-badge">🎮 Stap 6 van 12 · 3. Versterkend leren</div>
<h2 class="ch2">Versterkend <em>leren</em> (reinforcement learning)</h2>
<p class="cp">Ten slotte is er binnen machine learning ook versterkend leren of "reinforcement learning". Dit is zoals een nieuwe videogame die je aan het spelen bent: je leert wat je moet doen door je personage in het spel rond te laten lopen en af en toe fouten te laten maken. Zo leer je al doende wat wel en niet kan.</p>

<svg viewBox="0 0 400 260" style="width:100%;max-width:420px;height:auto;display:block;margin:16px auto;" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="380" height="240" rx="12" fill="#f0f2f5"/>
  <rect x="30" y="30" width="30" height="30" fill="#0A1FA8"/>
  <rect x="90" y="30" width="30" height="30" fill="#0A1FA8"/>
  <rect x="90" y="90" width="30" height="30" fill="#0A1FA8"/>
  <rect x="150" y="90" width="30" height="30" fill="#0A1FA8"/>
  <rect x="150" y="150" width="30" height="150" fill="none"/>
  <rect x="210" y="60" width="30" height="30" fill="#0A1FA8"/>
  <rect x="270" y="120" width="30" height="30" fill="#0A1FA8"/>
  <circle cx="45" cy="200" r="12" fill="#7FE000"/>
  <text x="45" y="205" text-anchor="middle" font-size="14">🤖</text>
  <circle cx="340" cy="45" r="12" fill="#FFC107"/>
  <text x="340" y="50" text-anchor="middle" font-size="14">⭐</text>
  <path d="M45 188 L60 160 L90 160 L120 130 L150 130 L180 130 L210 100 L240 90 L270 90 L300 60 L340 55" stroke="#7FE000" stroke-width="3" fill="none" stroke-dasharray="6,4"/>
</svg>

<div style="background: rgba(255,193,7,0.12); border-radius: 8px; padding: 16px; margin: 16px 0;">
<p style="font-size: 13px; color: #3d4f8a; line-height: 1.8; margin: 0;">
De machine komt terecht in een <strong>omgeving waarin van alles gebeurt en verandert</strong>. De machine leert wat hij moet doen door fouten te maken waardoor hij wordt gestraft, of goede dingen te doen waarvoor hij wordt beloond. Het algoritme ontdekt dus door <strong>trial and error</strong> (door het gewoon te proberen) welke strategieën het gewenste resultaat opleveren.
</p>
</div>

<h3 class="ch3">📋 De 3 soorten machine learning samengevat</h3>
<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin: 16px 0;">
<div style="background: white; border: 2px solid var(--blue); border-radius: 8px; padding: 12px;">
<div style="font-weight: 700; color: var(--blue); font-size: 11px;">👁️ Gesuperviseerd</div>
<p style="font-size: 11px; color: #3d4f8a; margin-top:6px;">Data zijn gelabeld; het algoritme leert het resultaat te voorspellen.</p>
</div>
<div style="background: white; border: 2px solid var(--green); border-radius: 8px; padding: 12px;">
<div style="font-weight: 700; color: var(--green); font-size: 11px;">🔍 Ongesuperviseerd</div>
<p style="font-size: 11px; color: #3d4f8a; margin-top:6px;">Data zijn niet gelabeld; het algoritme leert zelf structuur te vinden.</p>
</div>
<div style="background: white; border: 2px solid var(--orange); border-radius: 8px; padding: 12px;">
<div style="font-weight: 700; color: var(--orange); font-size: 11px;">🎮 Versterkend</div>
<p style="font-size: 11px; color: #3d4f8a; margin-top:6px;">Door trial-and-error leert de machine welke actie het beste is.</p>
</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="n2()">Volgende: doe-opdracht →</button>
  <span class="nh">Stap 6/12</span>
</div>`;
}

function m2s6(c){
  c.innerHTML = `
<div class="s-badge">🧩 Stap 7 van 12 · Doe-opdracht</div>
<h2 class="ch2">Welke soort <em>machine learning</em> is dit?</h2>
<p class="cp">Klik op elk voorbeeld: is dit gesuperviseerd, ongesuperviseerd, of versterkend leren?</p>
<div id="mltype"></div>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="n2()">Volgende: deep learning →</button>
  <span class="nh">Stap 7/12</span>
</div>`;
  renderMLTypeCards();
}

function m2s7(c){
  c.innerHTML = `
<div class="s-badge">🕸️ Stap 8 van 12 · Fase 3: Deep Learning</div>
<h2 class="ch2">Hoe werkt <em>deep learning</em>?</h2>
<p class="cp">Een mens kan snel een hond onderscheiden van een koekje, doordat onze hersenen bliksemsnel enkele vragen stellen: wat ruik ik? Welke kleur heeft het? Maakt het lawaai? Een computer moet dit allemaal aangeleerd krijgen.</p>

<p class="cp">Of neem bijvoorbeeld autorijden. Daar komt veel bij kijken: letten op je omgeving, schakelen, gas geven, remmen, verkeersborden herkennen, in je spiegels kijken, enzovoort. Een zelfrijdende auto zou <strong>voor elk van die taken een apart algoritme</strong> nodig hebben. Een combinatie van al die taken maakt het mogelijk om de auto zelf te laten rijden. Zo'n combinatie noemen we een <strong>neuraal netwerk</strong>.</p>

<div class="ib warn">
  <div class="ib-t">💡 Deep learning = machine learning + neurale netwerken</div>
  <div class="ib-b"><strong>Deep learning</strong> is de combinatie van machine learning met neurale netwerken. Deze techniek heeft de laatste 15 jaar veel nieuwe toepassingen mogelijk gemaakt, omdat ze veel complexere zaken kan analyseren dan één simpel algoritme.</div>
</div>

<p class="cp">Je hoeft de technische details van neurale netwerken niet te kennen. Het belangrijkste om te onthouden: een neuraal netwerk combineert veel kleinere "beslissingen" tot één groot, complex eindresultaat — zoals jouw hersenen ook duizenden kleine signalen combineren om te beslissen "dit is een hond, geen koekje".</p>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="n2()">Volgende: NotebookLM →</button>
  <span class="nh">Stap 8/12</span>
</div>`;
}

function m2s8(c){
  c.innerHTML = `
<div class="s-badge">📓 Stap 9 van 12 · NotebookLM ontdekken</div>
<h2 class="ch2">Google <em>NotebookLM</em>: jouw AI-studiehulp</h2>
<p class="cp">NotebookLM is een gratis AI-tool van Google die speciaal ontworpen is om je te helpen studeren. In tegenstelling tot een chatbot die "uit het hele internet" antwoordt, baseert NotebookLM zich <strong>enkel op documenten die JIJ zelf uploadt</strong> — dus veel minder kans op verzonnen informatie.</p>

<h3 class="ch3">📋 Stap voor stap: hoe gebruik je NotebookLM?</h3>
<div style="background: white; border-left: 4px solid var(--blue); border-radius: 8px; padding: 16px; margin: 16px 0;">
<p style="font-size: 13px; color: #3d4f8a; line-height: 2; margin: 0;">
<strong>Stap 1:</strong> Ga naar <strong>notebooklm.google.com</strong> en log in met een Google-account.<br>
<strong>Stap 2:</strong> Klik op "Nieuwe notebook" en geef die een naam (bijv. "Geschiedenis — Hoofdstuk 4").<br>
<strong>Stap 3:</strong> Upload je bronnen: een PDF van je cursus, je eigen nota's, of een link naar een artikel.<br>
<strong>Stap 4:</strong> NotebookLM leest alles en maakt automatisch een samenvatting.<br>
<strong>Stap 5:</strong> Stel vragen in de chat. Het antwoord komt <strong>met bronvermelding</strong> naar de exacte pagina in je document!<br>
<strong>Stap 6:</strong> Gebruik de extra's: laat een studiegids of quizvragen genereren van je cursus.
</p>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" onclick="n2()">Volgende: probeer het zelf →</button>
  <span class="nh">Stap 9/12</span>
</div>`;
}

function m2s9(c){
  c.innerHTML = `
<div class="s-badge">🧪 Stap 10 van 12 · Doe-opdracht: aan de slag!</div>
<h2 class="ch2">Probeer het <em>zelf</em>: jouw eerste prompt</h2>
<p class="cp">Tijd om zelf te experimenteren! Open in een nieuw tabblad <strong>Copilot</strong> (met je schoolaccount), <strong>NotebookLM</strong>, of een andere toegestane AI-tool.</p>

<div class="ib warn">
  <div class="ib-t">⚠️ Vergeet dit niet!</div>
  <div class="ib-b">Vermeld <strong>altijd</strong> of je toestemming had om AI te gebruiken voor een bepaalde taak (zie het AI-label van je leerkracht, Module 5). Voor deze oefening mag je vrij experimenteren.</div>
</div>

<h3 class="ch3">🎯 De opdracht</h3>
<p class="cp">Kies één van deze twee taken en probeer ze uit:</p>
<ul style="font-size: 13px; color: #3d4f8a; line-height: 1.8; padding-left: 20px;">
<li><strong>Optie A:</strong> Laat AI een vak-onderwerp uitleggen dat je lastig vindt, in maximaal 5 zinnen, met een voorbeeld erbij.</li>
<li><strong>Optie B:</strong> Als je NotebookLM gebruikt: upload een korte tekst of je nota's, en stel er een vraag over.</li>
</ul>

<h3 class="ch3">✍️ Noteer hieronder wat er gebeurde</h3>
<p class="cp"><strong>Welke prompt heb je precies getypt?</strong></p>
<textarea class="sr-ta" id="promptused" style="min-height:60px;" placeholder="Ik typte precies: ..."></textarea>

<p class="cp" style="margin-top:14px;"><strong>Wat kwam eruit? Vat samen wat de AI antwoordde.</strong></p>
<textarea class="sr-ta" id="promptresult" style="min-height:60px;" placeholder="De AI antwoordde dat..."></textarea>

<p class="cp" style="margin-top:14px;"><strong>Was je tevreden? Waarom wel/niet?</strong></p>
<textarea class="sr-ta" id="promptsatisfied" style="min-height:60px;" placeholder="Ik was wel/niet tevreden omdat..."></textarea>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" id="promptbtn" onclick="sPromptExercise()">Volgende: reflectie →</button>
  <span class="nh">Stap 10/12</span>
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

function m2s10(c){
  const quiz = [
    {q: 'Wat is het grootste nadeel van procedurele AI (zoals bij de zombie/mens-beslisboom)?', o: ['Ze is over het algemeen veel te kostbaar en te duur om ooit ergens te kunnen bouwen of onderhouden','Ze is niet flexibel: bij iets nieuws dat niet in het stappenplan past, weet het systeem geen raad','Ze werkt in de praktijk uitsluitend met kleuren als enige mogelijke invoer','Ze heeft, in tegenstelling tot elke andere vorm van AI, geen computer nodig'], a: 1, f: 'Procedurele AI volgt vaste stappen; komt er iets onverwachts bij, dan faalt het systeem.' },
    {q: 'Wat betekent de "black box" bij machine learning?', o: ['Een fysieke, afgesloten doos waarin de computer letterlijk zit','Je krijgt een resultaat zonder dat de machine toont hoe ze daar precies toe kwam','Een streng beveiligingssysteem dat computers tegen hackers beschermt','Een foutmelding die verschijnt wanneer de machine crasht'], a: 1, f: 'Data gaat erin (input), er gebeuren berekeningen, en je krijgt een resultaat (output) — zonder inzicht in het precieze proces.' },
    {q: 'Bij gesuperviseerd leren (zoals de zombie/mens-kaartjes met label): wat is kenmerkend?', o: ['De computer krijgt data mét labels om een categorie te leren voorspellen', 'De computer krijgt bij deze methode eigenlijk nooit enige voorbeelden te zien','Dit is in de praktijk exact hetzelfde als versterkend leren','Er is bij deze aanpak geen enkele menselijke input nodig'], a: 0, f: 'Bij gesuperviseerd leren geef je gelabelde voorbeelden, zodat de computer leert categorieën te herkennen.' },
    {q: 'Bij Spotify- of Netflix-aanbevelingen: welk soort leren is meestal aan het werk?', o: ['Versterkend leren, waarbij het systeem stap voor stap beloond wordt in een spelomgeving', 'Ongesuperviseerd leren: de computer groepeert gebruikers/content zelf, zonder vaste labels','Procedurele AI die simpelweg een lijst van vaste IF-THEN regels volgt','Dit gebeurt in werkelijkheid volledig zonder enige vorm van AI of algoritme'], a: 1, f: 'De computer ontdekt zelf patronen en groepen in kijk-/luistergedrag, zonder dat iemand die groepen vooraf benoemde.' },
    {q: 'Waarom is NotebookLM vaak betrouwbaarder dan een gewone chatbot voor studeren?', o: ['Het genereert doorgaans gewoon sneller een antwoord op elke gestelde vraag','Het baseert antwoorden enkel op de documenten die jij zelf uploadt, met bronvermelding','Het is volledig gratis, terwijl vergelijkbare studietools altijd geld kosten','Er bestaat tussen de twee soorten tools eigenlijk geen enkel praktisch verschil'], a: 1, f: 'Omdat het antwoordt op basis van jouw eigen bronnen in plaats van het hele internet, is de kans op verzonnen informatie veel kleiner.' }
  ];
  rQuiz(c, quiz, 2, 'mod2', n2, 60);
}

function m2s11(c){
  c.innerHTML = `
<div class="s-badge">✍️ Stap 12 van 12 · Jouw reflectie</div>
<h2 class="ch2">Wat vind <em>jij</em> hiervan?</h2>
<p class="cp">Je begrijpt nu de 3 fasen van AI: procedureel, machine learning (met de 3 soorten), en deep learning. En je hebt zelf al geëxperimenteerd met een AI-tool!</p>

<h3 class="ch3">💭 Stellingen</h3>
<div id="stl-m2"></div>

<p class="cp">Noteer je reflectie: Welke van de 3 soorten machine learning (gesuperviseerd, ongesuperviseerd, versterkend) vond je het makkelijkst te begrijpen, en welke het moeilijkst? En hoe was het om zelf een prompt uit te proberen?</p>
<p style="font-size:11px;color:#999;font-style:italic;margin:-8px 0 12px 0;">📄 Werk je liever op papier? Deze samenvatting, stellingen en reflectie staan ook op <strong>pagina 5-7</strong> van je invulcursus.</p>
<textarea class="sr-ta" id="ref2" placeholder="Het makkelijkst te begrijpen vond ik... Toen ik zelf een prompt probeerde, merkte ik..."></textarea>

<div class="nw">
  <button class="sr-btn b" onclick="p2()">← Vorige</button>
  <button class="sr-btn g" id="ref2btn" onclick="sRef2()">✅ Module 2 afronden →</button>
  <span class="nh">Stap 12/12</span>
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
   MODULE 3 — GENERATIEVE AI (13 stappen)
   Gebaseerd op EDUbox Artificiële Intelligentie, deel 3 "Aan de slag"
   ════════════════════════════════════════════ */

const m3 = [m3s0, m3s1, m3s2, m3s3, m3s4, m3s5, m3s6, m3s7, m3s8, m3s9, m3s10, m3s11, m3s12];

function rm3(){ const c=document.getElementById('m3c'); c.innerHTML=''; rDots(3,m3.length,S.mod3.step); m3[S.mod3.step](c); lockNextButtons(c); }
function n3(){ S.mod3.step++; ss(); S.mod3.step>=m3.length ? d3() : rm3(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); }
function p3(){ if(S.mod3.step > 0){ S.mod3.step--; ss(); rm3(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); } }
function d3(){ S.mod3.done=true; S.mod3.step=0; ss(); up(); rmc(); sv('home'); setTimeout(()=>alert('🎉 Module 3 voltooid! Module 4 is nu beschikbaar.'),300); }

function m3s0(c){
  c.innerHTML = `
<div class="s-badge">✨ Stap 1 van 13 · Generatieve AI</div>
<h2 class="ch2">AI is nu een stapje <em>verder</em> gegaan</h2>
<p class="cp">In Module 2 leerde je over deep learning. AI is recent nog een stapje verder gegaan. Algoritmes kunnen nu ook <strong>nieuwe dingen creëren</strong>. We spreken dan van <strong>generatieve AI</strong>.</p>
<p class="cp">Deze nieuwe vorm kon doorbreken omdat computers nu een veel grotere rekenkracht hebben. Zij zijn getraind met bijna alle online informatie. Wanneer jij aan die machine een vraag stelt, voorspelt het algoritme het antwoord door woorden logisch achter elkaar te plaatsen. Dit heeft dus voornamelijk met <strong>kansberekening</strong> te maken.</p>
<p class="cp">Deze algoritmes noemen we ook <strong>taalmodellen</strong>, omdat ze getraind zijn om natuurlijke taal te begrijpen. Met deze modellen kan je niet alleen teksten, maar ook foto's en video's maken.</p>

<div class="ib warn">
  <div class="ib-t">💬 Voorbeeld: chatten met "Friends"</div>
  <div class="ib-b">Stel je voor: je traint een bestaand taalmodel met alle scenario's van de Amerikaanse tv-reeks 'Friends'. Het model leert zo het denken en spreken van de personages imiteren. Nadien kan je een fictief chatgesprek voeren met alle personages. Zij reageren dan op jouw vragen en opmerkingen alsof je écht met hen praat, ook al hebben ze die zinnen nooit uitgesproken.</div>
</div>

<div class="nw">
  <button class="sr-btn g" onclick="n3()">Volgende: hoe genereert AI tekst? →</button>
  <span class="nh">Stap 1/13</span>
</div>`;
}

function m3s1(c){
  c.innerHTML = `
<div class="s-badge">📝 Stap 2 van 13 · Hoe genereert AI tekst?</div>
<h2 class="ch2">Woord voor woord: hoe <em>ChatGPT schrijft</em></h2>
<p class="cp">Wanneer je ChatGPT een vraag stelt, "denkt" het niet zoals jij. Het genereert het antwoord <strong>woord voor woord</strong>, en kiest telkens het meest waarschijnlijke volgende woord — gebaseerd op alles wat het geleerd heeft uit miljarden teksten.</p>

<div style="background: rgba(10,31,168,0.08); border-radius: 8px; padding: 16px; margin: 16px 0;">
<p style="font-size: 13px; color: #3d4f8a; line-height: 1.8; margin: 0;">
<strong>Jij typt:</strong> "Schrijf een gedicht over de zee"<br>
<strong>AI genereert:</strong> "De" → "De zee" → "De zee is" → "De zee is blauw" → ...<br><br>
Bij élke stap berekent het model kansen voor duizenden mogelijke volgende woorden, en kiest meestal het meest waarschijnlijke.
</p>
</div>

<p class="cp">Met deze modellen kan je niet alleen teksten, maar ook foto's en video's maken. Maar nu AI zelf dingen kan creëren, moeten wij niet stoppen met nadenken. <strong>De modellen maken soms ook fouten. Dit noemen we hallucinaties.</strong></p>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: hallucinaties →</button>
  <span class="nh">Stap 2/13</span>
</div>`;
}

function m3s2(c){
  c.innerHTML = `
<div class="s-badge">👻 Stap 3 van 13 · Hallucinaties</div>
<h2 class="ch2">Hoe kan je zien of iets met <em>AI is gemaakt</em>?</h2>
<p class="cp">Je kan er niet zomaar op rekenen dat programma's als ChatGPT jouw huiswerk foutloos maken. <strong>Let vooral op details</strong>, zoals de lichtinval, vingers, gezichten of details in de achtergrond. Een korrelig beeld is meestal ook een teken.</p>

<div style="background: white; border: 2px dashed var(--red); border-radius: 8px; padding: 18px; margin: 16px 0;">
  <div style="font-size:11px;font-weight:700;color:var(--red);text-transform:uppercase;margin-bottom:10px;">🚨 Een echt voorbeeld</div>
  <p style="font-size:13px;color:#333;line-height:1.7;margin:0;">
  Op een AI-gegenereerde foto van een reddingswerker die een kind draagt, tel je bij nader inzien <strong>6 vingers</strong> aan één hand. Dit is een hallucinatie: het beeld ziet er op het eerste gezicht overtuigend echt uit, maar bevat een detail dat onmogelijk klopt.
  </p>
</div>

<p class="cp">Hetzelfde geldt voor tekst: een taalmodel kan met evenveel zelfvertrouwen een <strong>verzonnen feit, bron of citaat</strong> presenteren als een correct antwoord. Het "weet" niet dat het fout zit — het genereert gewoon het meest waarschijnlijke antwoord.</p>

<div class="ib warn">
  <div class="ib-t">✅ Onthoud dit</div>
  <div class="ib-b">Je kan er dus niet zomaar op rekenen dat AI-programma's je huiswerk foutloos maken. Controleer altijd wat je van AI krijgt, zeker voor je het gebruikt in een werkstuk of taak.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: aan de slag →</button>
  <span class="nh">Stap 3/13</span>
</div>`;
}

function m3s3(c){
  c.innerHTML = `
<div class="s-badge">🎮 Stap 4 van 13 · Spelen met AI</div>
<h2 class="ch2">Aan de slag met <em>generatieve AI</em></h2>
<p class="cp">In deze module mag je experimenteren met generatieve AI, de vorm van AI die zelf dingen kan creëren. Zo leer je de mogelijkheden kennen en ontdek je verschillende aspecten.</p>

<p class="cp">Maar voor we aan de oefeningen beginnen, nog even dit. Om iets te kunnen creëren, heeft de machine een opdracht nodig. Daarin zeg je wat je verwacht dat de machine maakt. Zo'n opdracht noemen we <strong>een prompt</strong>.</p>

<div class="ib warn">
  <div class="ib-t">🎯 Wat ga je doen?</div>
  <div class="ib-b">Je doorloopt zo meteen een reeks opdrachten waarin je telkens een specifiek aspect van generatieve AI bestudeert en uitprobeert: herkennen wat AI kan, prompts leren lezen, en zelf prompts schrijven.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: is het echt of AI? →</button>
  <span class="nh">Stap 4/13</span>
</div>`;
}

function m3s4(c){
  c.innerHTML = `
<div class="s-badge">🧩 Stap 5 van 13 · Opdracht 1: Is het echt of AI?</div>
<h2 class="ch2">Is het <em>echt</em> of AI?</h2>
<p class="cp">Je bent ongetwijfeld al vaak in contact gekomen met beelden of teksten die door AI zijn gemaakt. Misschien zelfs zonder dat je het wist. Maar kan jij ook echte content onderscheiden van AI-content?</p>
<p class="cp">Bekijk elke beschrijving hieronder en beslis: is dit waarschijnlijk een teken van AI-gegenereerde content, of niet?</p>
<div id="airealcheck"></div>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: raad de prompt →</button>
  <span class="nh">Stap 5/13</span>
</div>`;
  renderAIRealCheck();
}

function m3s5(c){
  c.innerHTML = `
<div class="s-badge">🧩 Stap 6 van 13 · Opdracht 2: Raad de prompt</div>
<h2 class="ch2">Raad de <em>prompt</em></h2>
<p class="cp">Je hebt nu een eerste keer met prompts gespeeld — al was het passief. Dat is niet altijd eenvoudig. Taalmodellen moet je leren gebruiken. Maar geen nood: prompten kan je leren.</p>
<p class="cp">Bij elk paar prompts hieronder: welke zou een beter, bruikbaarder antwoord opleveren? Klik je keuze aan.</p>
<div id="promptcompare"></div>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: hoe maak je een goede prompt? →</button>
  <span class="nh">Stap 6/13</span>
</div>`;
  renderPromptCompareLeerling();
}

function m3s6(c){
  c.innerHTML = `
<div class="s-badge">🔑 Stap 7 van 13 · Prompt-tips</div>
<h2 class="ch2">Hoe maak je een <em>goede prompt</em>?</h2>
<p class="cp">Prompten is een vak apart. Dat leer je niet zomaar in één, twee, drie. Er bestaan intussen zelfs opleidingen voor en er zijn mensen die dit als beroep doen, <strong>prompt engineers</strong> genoemd. Maar we kunnen je wel enkele tips geven om het resultaat van je prompt zo goed mogelijk te maken.</p>

<h3 class="ch3">📝 Hoe maak je een goede prompt voor tekst?</h3>
<div style="background: rgba(10,31,168,0.08); border-radius: 8px; padding: 16px; margin: 16px 0;">
<p style="font-size: 13px; color: #3d4f8a; line-height: 1.9; margin: 0;">
<strong>1. Wees specifiek over het onderwerp</strong><br>
<strong>2. Geef voldoende context</strong><br>
<strong>3. Wees concreet over de lengte en de output</strong><br>
<strong>4. Stel open vragen</strong>
</p>
</div>

<div style="background: #f0f2f5; padding: 14px; border-radius: 6px; margin: 16px 0; font-size:13px; color:#333;">
✅ <em>"Wat zijn de voordelen van regelmatig hardlopen voor de mentale gezondheid? Schrijf een artikel van ongeveer 150 woorden dat jongeren van 16 jaar moeten begrijpen."</em>
</div>

<h3 class="ch3">🖼️ Hoe maak je een goede prompt voor een beeld?</h3>
<div style="background: rgba(127,224,0,0.1); border-radius: 8px; padding: 16px; margin: 16px 0;">
<p style="font-size: 13px; color: #3d4f8a; line-height: 1.9; margin: 0;">
<strong>1. Wees specifiek over het onderwerp</strong><br>
<strong>2. Geef de gewenste outputvorm</strong><br>
<strong>3. Verduidelijk de stijl</strong>
</p>
</div>

<div style="background: #f0f2f5; padding: 14px; border-radius: 6px; margin: 16px 0; font-size:13px; color:#333;">
✅ <em>"Maak een tekening van een fietsend paard met een pilotenmuts, dat een sigaret rookt, in de stijl van het surrealisme."</em>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: schrijf zelf een prompt →</button>
  <span class="nh">Stap 7/13</span>
</div>`;
}

function m3s7(c){
  c.innerHTML = `
<div class="s-badge">🧪 Stap 8 van 13 · Opdracht 4: Schrijf zelf de prompt</div>
<h2 class="ch2">Nu jij: <em>schrijf zelf een prompt</em></h2>
<p class="cp">Deze tips zijn een eerste hulpmiddel om het beste resultaat uit een prompt te halen. Laten we dit eens uittesten! Open een toegestane AI-tool (Copilot, ChatGPT, ...) in een nieuw tabblad.</p>

<div class="ib warn">
  <div class="ib-t">⚠️ Vergeet dit niet!</div>
  <div class="ib-b">Check altijd eerst of je AI mag gebruiken voor de taak die je uitvoert (het AI-label van je leerkracht, zie Module 5). Voor deze les-oefening mag je vrij oefenen — maar vermeld dit steeds bij echt schoolwerk!</div>
</div>

<h3 class="ch3">🎯 De opdracht</h3>
<p class="cp">Kies een onderwerp en schrijf een prompt met minstens 3 van de tips uit de vorige stap. Probeer hem uit in je AI-tool.</p>

<h3 class="ch3">✍️ Noteer hieronder wat er gebeurde</h3>
<p class="cp"><strong>Welke prompt heb je precies geschreven?</strong></p>
<textarea class="sr-ta" id="promptused3" style="min-height:70px;" placeholder="Mijn prompt was: ..."></textarea>

<p class="cp" style="margin-top:14px;"><strong>Wat kwam eruit, en was je tevreden? Zou je de prompt nog aanpassen?</strong></p>
<textarea class="sr-ta" id="promptresult3" style="min-height:70px;" placeholder="De AI antwoordde... Ik was wel/niet tevreden omdat... Volgende keer zou ik..."></textarea>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" id="prompt3btn" onclick="sPromptExercise3()">Volgende: maak een afbeelding bij een artikel →</button>
  <span class="nh">Stap 8/13</span>
</div>`;
  const ta1 = document.getElementById('promptused3');
  const ta2 = document.getElementById('promptresult3');
  ta1.value = localStorage.getItem('sr_l_prompt_used_m3') || '';
  ta2.value = localStorage.getItem('sr_l_prompt_result_m3') || '';
  ta1.oninput = ()=>localStorage.setItem('sr_l_prompt_used_m3', ta1.value);
  ta2.oninput = ()=>localStorage.setItem('sr_l_prompt_result_m3', ta2.value);
}

function sPromptExercise3(){
  const v1 = (document.getElementById('promptused3').value||'').trim();
  const v2 = (document.getElementById('promptresult3').value||'').trim();
  if(v1.length < 5 || v2.length < 5){ alert('Vul beide velden in — probeer het écht zelf uit voor je verdergaat!'); return; }
  n3();
}

function m3s8(c){
  c.innerHTML = `
<div class="s-badge">📰 Stap 9 van 13 · Opdracht 5: AI als assistent</div>
<h2 class="ch2">Maak een afbeelding bij <em>een artikel</em></h2>
<p class="cp">Generatieve AI geeft zelden direct de output die je in gedachten had. Meestal heb je meerdere pogingen nodig om een goed resultaat te krijgen.</p>
<p class="cp">Maar als je prompten goed onder de knie hebt, kan generatieve AI een <strong>goede assistent</strong> zijn bij bepaalde taken. Journalisten of andere makers kunnen AI inzetten als hulpmiddel — bijvoorbeeld om een passende titel of afbeelding te bedenken bij een artikel. In dat geval moet je wel goed weten hoe je een prompt, stap voor stap, opbouwt.</p>

<div class="ib warn">
  <div class="ib-t">💭 Denk na</div>
  <div class="ib-b">Stel je bent journalist en schreef een artikel over "de terugkeer van de otter in Vlaamse rivieren". Welke prompt zou jij schrijven om een passende illustratie te laten genereren? Gebruik de 3 tips uit stap 7 (onderwerp, outputvorm, stijl).</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: deepfake of niet? →</button>
  <span class="nh">Stap 9/13</span>
</div>`;
}

function m3s9(c){
  c.innerHTML = `
<div class="s-badge">🎭 Stap 10 van 13 · Opdracht 6: Deepfake of niet?</div>
<h2 class="ch2">Deepfake of <em>niet</em>?</h2>
<p class="cp">AI kan een journalist of een andere maker helpen bij het creëren van een goede titel of het maken van een geschikte afbeelding voor een tekst. Dat gaat gemakkelijk. Maar dan hebben we wel duidelijke regels nodig, want <strong>niet iedereen heeft dezelfde goede bedoelingen</strong> als een journalist. Generatieve AI kan ook worden misbruikt.</p>

<h3 class="ch3">🧩 Doe-opdracht: herken bias-signalen</h3>
<p class="cp">Bekijk elk scenario en beslis: is hier sprake van een AI-signaal dat wijst op mogelijk misbruik?</p>
<div id="deepfakecheck"></div>

<div class="ib warn">
  <div class="ib-t">⚖️ Conclusie</div>
  <div class="ib-b">Mensen met slechte bedoelingen kunnen AI misbruiken, bijvoorbeeld door nepnieuws of propaganda te maken en te verspreiden. Omdat de kwaliteit van de resultaten zo goed is, is het onderscheid tussen echt en nep niet meer altijd duidelijk. In de eerste oefeningen ging het nog om onschuldige beelden. Maar als het gaat over het nieuws en de waarheid, dan is de impact van AI veel ingrijpender. We moeten dus met z'n allen alert blijven!</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: discussie →</button>
  <span class="nh">Stap 10/13</span>
</div>`;
  renderDeepfakeCheck();
}

function m3s10(c){
  c.innerHTML = `
<div class="s-badge">💬 Stap 11 van 13 · Discussie</div>
<h2 class="ch2">Waar ligt <em>de grens</em>?</h2>
<div class="disc-card">
  <div class="disc-q">1. Je gebruikt AI om ideeën te brainstormen voor een opstel, maar schrijft de tekst zelf. Is dat "vals spelen"?</div>
  <div class="disc-a">De meeste scholen (incl. Sint-Rembert, zie Module 5) zien dit als toegestaan zolang duidelijk is aangegeven welk AI-label van toepassing is. Brainstormen is een hulpmiddel, geen vervanging van je eigen werk.</div>
</div>
<div class="disc-card">
  <div class="disc-q">2. Een muzikant gebruikt AI om een melodie te componeren, maar schrijft zelf de teksten. Is dit nog "zijn" muziek?</div>
  <div class="disc-a">Er is geen eenduidig antwoord — dit is precies het soort vraag waar de muziekindustrie vandaag mee worstelt. Veel artiesten zien AI als een instrument, terwijl anderen het gevoel hebben dat het creatieve proces wordt uitgehold.</div>
</div>
<div class="disc-card">
  <div class="disc-q">3. Zou jij een AI-gegenereerd kunstwerk kopen voor dezelfde prijs als een door een mens gemaakt kunstwerk?</div>
  <div class="disc-a">Dit is een persoonlijke afweging. Sommigen hechten waarde aan het menselijke verhaal en de tijd erachter; anderen kijken enkel naar het eindresultaat.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" onclick="n3()">Volgende: kennischeck →</button>
  <span class="nh">Stap 11/13</span>
</div>`;
}

function m3s11(c){
  const quiz = [
    {q: 'Hoe genereert een taalmodel zoals ChatGPT een antwoord?', o: ['Het zoekt live op internet en kopieert simpelweg het beste resultaat.','Het genereert woord voor woord, gebaseerd op wat statistisch waarschijnlijk is.','Een team van mensen typt in real time de antwoorden voor je.','Het gebruikt exact dezelfde vaste antwoorden voor elke gebruiker.'], a: 1, f: 'Het model voorspelt telkens het volgende woord op basis van kansberekening uit zijn training.' },
    {q: 'In het voorbeeld met de reddingswerker-foto: hoe herkende je de hallucinatie?', o: ['De foto was zwart-wit.','De persoon op de foto had 6 vingers aan één hand.','Er stond een watermerk op de foto.','De foto was wazig.'], a: 1, f: 'Een verkeerd aantal vingers is een klassiek (maar steeds zeldzamer wordend) signaal van AI-gegenereerde beelden.' },
    {q: 'Wat is "prompt engineering"?', o: ['Het volledig programmeren van een AI-model vanaf nul.','De vaardigheid om goede, doeltreffende prompts te formuleren.','Het technisch repareren van kapotte AI-software.','Een gespecialiseerd technisch beroep in de bouwsector.'], a: 1, f: 'Een goed geformuleerde prompt (specifiek, met context, duidelijke output) geeft veel betere resultaten.' },
    {q: 'Welke 3 tips gelden voor een goede beeldprompt?', o: ['De gewenste kleur, het bestandsformaat, en de maximale prijs','Specifiek onderwerp, gewenste outputvorm, duidelijke stijl','De gewenste lengte, de gebruikte taal, en de doelgroep','De snelheid, de kostprijs, en de algemene kwaliteit'], a: 1, f: 'Wees specifiek over het onderwerp, geef de gewenste outputvorm, en verduidelijk de gewenste stijl.' },
    {q: 'Waarom is het gevaarlijk dat AI-content zo goed geworden is?', o: ['Omdat het produceren van AI-content tegenwoordig simpelweg te duur is geworden.','Omdat mensen met slechte bedoelingen het kunnen misbruiken voor nepnieuws.','Omdat het genereren van content tegenwoordig veel te traag zou verlopen.','Dit is in werkelijkheid niet gevaarlijk, het is enkel handig voor iedereen.'], a: 1, f: 'Naarmate AI-content overtuigender wordt, wordt het voor kwaadwillenden makkelijker om nepnieuws te verspreiden dat niet meer te onderscheiden is van echt nieuws.' }
  ];
  rQuiz(c, quiz, 3, 'mod3', n3, 60);
}

function m3s12(c){
  c.innerHTML = `
<div class="s-badge">✍️ Stap 13 van 13 · Jouw reflectie</div>
<h2 class="ch2">Generatieve AI in <em>jouw leven</em></h2>
<p class="cp">Je begrijpt nu hoe generatieve AI teksten en beelden maakt, hoe je goede prompts schrijft (en hebt dit zelf uitgeprobeerd!), en welke risico's erbij horen.</p>

<h3 class="ch3">💭 Stellingen</h3>
<div id="stl-m3"></div>

<p class="cp">Noteer je reflectie: Voor welke taak zou jij generatieve AI het liefst gebruiken (school of vrije tijd)? En wat vind je van de discussie rond AI-kunst en auteursrecht?</p>
<p style="font-size:11px;color:#999;font-style:italic;margin:-8px 0 12px 0;">📄 Werk je liever op papier? Deze samenvatting, prompt-tips en reflectie staan ook op <strong>pagina 8-10</strong> van je invulcursus.</p>
<textarea class="sr-ta" id="ref3" placeholder="Ik zou generatieve AI gebruiken voor... Over AI-kunst en auteursrecht denk ik..."></textarea>

<div class="nw">
  <button class="sr-btn b" onclick="p3()">← Vorige</button>
  <button class="sr-btn g" id="ref3btn" onclick="sRef3()">✅ Module 3 afronden →</button>
  <span class="nh">Stap 13/13</span>
</div>`;
  const ta = document.getElementById('ref3');
  ta.value = localStorage.getItem('sr_l_ref3') || '';
  ta.oninput = ()=>localStorage.setItem('sr_l_ref3', ta.value);
  renderStellingenLeerling('stl-m3', 'l_m3', ['Prompten is een vaardigheid die ik echt wil trainen.','AI-gegenereerde kunst zou dezelfde waarde moeten hebben als door mensen gemaakte kunst.']);
}

function sRef3(){
  const v = (document.getElementById('ref3').value||'').trim();
  if(v.length < 20){ alert('Vul eerst je reflectie in (minstens een paar zinnen).'); return; }
  n3();
}


/* ════════════════════════════════════════════
   MODULE 4 — ETHIEK & BIAS (11 stappen)
   Gebaseerd op EDUbox Artificiële Intelligentie, deel 2 (slot) & deel 4
   ════════════════════════════════════════════ */

const m4 = [m4s0, m4s1, m4s2, m4s3, m4s4, m4s5, m4s6, m4s7, m4s8, m4s9, m4s10];

function rm4(){ const c=document.getElementById('m4c'); c.innerHTML=''; rDots(4,m4.length,S.mod4.step); m4[S.mod4.step](c); lockNextButtons(c); }
function n4(){ S.mod4.step++; ss(); S.mod4.step>=m4.length ? d4() : rm4(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); }
function p4(){ if(S.mod4.step > 0){ S.mod4.step--; ss(); rm4(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); } }
function d4(){ S.mod4.done=true; S.mod4.step=0; ss(); up(); rmc(); sv('home'); setTimeout(()=>alert('🎉 Module 4 voltooid! Module 5 is nu beschikbaar.'),300); }

function m4s0(c){
  c.innerHTML = `
<div class="s-badge">⚠️ Stap 1 van 11 · Vooroordelen bij AI</div>
<h2 class="ch2">AI is <em>niet neutraal</em></h2>
<p class="cp">AI gebruikt modellen om data te analyseren, te zoeken naar patronen en een voorspelling te maken. Omdat de wereld zo complex is, gebeurt dit <strong>niet met absolute zekerheid</strong>. Dat is geen probleem, zolang we ons hiervan bewust zijn als mens.</p>

<div class="ib warn">
  <div class="ib-t">🐶🍪 Een herkenbaar voorbeeld: hond of koekje?</div>
  <div class="ib-b">AI-systemen die getraind zijn om afbeeldingen te herkennen, verwarren soms een bruin, rond koekje met het gezicht van een hond met vlekken — omdat de patronen (rond, bruin, met vlekken) op elkaar lijken. Onschuldig in dit geval, maar het toont hoe AI met kansen werkt, niet met zekerheden.</div>
</div>

<p class="cp">Stel je nu eens voor dat een AI-systeem voorspelt dat je een bepaalde ziekte hebt, terwijl dat eigenlijk niet zo is. We moeten dus <strong>blijven opletten en niet alles overlaten aan AI</strong>.</p>

<div class="nw">
  <button class="sr-btn g" onclick="n4()">Volgende: ethische dilemma's →</button>
  <span class="nh">Stap 1/11</span>
</div>`;
}

function m4s1(c){
  c.innerHTML = `
<div class="s-badge">⚖️ Stap 2 van 11 · Ethische dilemma's</div>
<h2 class="ch2">AI en <em>ethische dilemma's</em></h2>
<p class="cp">AI komt tot stand dankzij wiskunde. Maar je kan niet alles aan cijferwerk overlaten. <strong>Het menselijk leven is complexer dan cijfers en wiskunde.</strong> Ook waarden en normen spelen een belangrijke rol, en die kan je niet eenvoudig evalueren met een computer.</p>

<p class="cp">Want wat doe je bijvoorbeeld als je moet kiezen tussen je eigen dood of de dood van iemand anders? (Denk aan een zelfrijdende auto die een ongeval niet meer kan vermijden — wie moet ze beschermen?)</p>

<p class="cp">Om waarden af te wegen of de context van een dilemma beter te begrijpen, heb je <strong>emotioneel inzicht</strong> nodig. En dat kan AI niet nabootsen. Sommige beslissingen kunnen we dus niet zomaar overlaten aan AI alleen.</p>

<h3 class="ch3">💼 Voorbeeld: sollicitaties sorteren</h3>
<p class="cp">Een bedrijf gebruikte ooit een AI-tool om CV's te sorteren voor technische functies. Het systeem werd getraind op 10 jaar aan CV's van vorige sollicitanten — vooral mannen, omdat de sector historisch mannelijker was. Het gevolg: CV's met het woord "vrouwen" (bijvoorbeeld "vrouwenschaakclub") kregen automatisch een lagere score. Het bedrijf ontdekte dit op tijd en schafte het systeem af.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p4()">← Vorige</button>
  <button class="sr-btn g" onclick="n4()">Volgende: energieverbruik →</button>
  <span class="nh">Stap 2/11</span>
</div>`;
}

function m4s2(c){
  c.innerHTML = `
<div class="s-badge">🌍 Stap 3 van 11 · Energieverbruik van AI</div>
<h2 class="ch2">AI en het <em>milieu</em>: de verborgen kost</h2>
<p class="cp">AI is geëvolueerd naar grote neurale netwerken die enorm veel berekeningen uitvoeren. Om deze neurale netwerken te laten werken, worden krachtige supercomputers gebruikt die hiervoor een massa aan gegevens verwerken.</p>
<p class="cp">Maar deze berekeningen hebben wel een prijs. <strong>Computers gebruiken namelijk energie als ze een opdracht uitvoeren.</strong> Ook bij het trainen van een nieuw algoritme is dit het geval. Het energieverbruik van AI is immens!</p>

<div class="ib warn">
  <div class="ib-t">⚡ Concreet cijfer</div>
  <div class="ib-b">Een zoekopdracht op ChatGPT gebruikt ongeveer <strong>25 keer meer energie</strong> dan eenzelfde zoekopdracht op Google.</div>
</div>

<h3 class="ch3">🌱 2 suggesties om bewuster om te gaan met AI</h3>
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0;">
<div style="background: white; border-left: 4px solid var(--green); border-radius: 8px; padding: 14px;">
<strong style="color: var(--green); font-size: 12px;">1️⃣ Gebruik ChatGPT niet voor alles</strong>
<p style="font-size: 12px; color: #3d4f8a; margin-top: 8px;">Meestal vind je je antwoord ook gewoon op Google. En dat is beter: want een zoekopdracht op ChatGPT gebruikt 25 keer meer energie dan Google.</p>
</div>
<div style="background: white; border-left: 4px solid var(--green); border-radius: 8px; padding: 14px;">
<strong style="color: var(--green); font-size: 12px;">2️⃣ Kleiner taalmodel op je eigen computer</strong>
<p style="font-size: 12px; color: #3d4f8a; margin-top: 8px;">Zo bespaar je energie, want je hoeft niet elke vraag naar de andere kant van de wereld te sturen. Voordeel: je hebt zelf geen internet nodig en je gegevens blijven veilig bewaard.</p>
</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p4()">← Vorige</button>
  <button class="sr-btn g" onclick="n4()">Volgende: creatieve beroepen →</button>
  <span class="nh">Stap 3/11</span>
</div>`;
}

function m4s3(c){
  c.innerHTML = `
<div class="s-badge">🎬 Stap 4 van 11 · Impact op creatieve beroepen</div>
<h2 class="ch2">Wat betekent AI voor <em>creatief werk</em>?</h2>
<p class="cp">Ook mensen met een creatief beroep (zoals schrijvers en tekenaars) zijn ongerust. Generatieve AI kan namelijk zelf teksten en beelden maken, dus misschien hebben zij binnenkort minder werk? Bovendien zijn die modellen getraind met hun teksten en beelden, zonder dat ze daarvoor zijn betaald.</p>

<div class="ib warn">
  <div class="ib-t">🎬 Hollywood, 2023</div>
  <div class="ib-b">In Hollywood hebben acteurs en scenarioschrijvers in 2023 maandenlang gestaakt. Ze wilden zeker zijn dat hun creativiteit ook in de toekomst wordt erkend. Generatieve AI kan wel leuke ideeën aanbrengen, maar uiteindelijk beschikt het menselijk brein over net wat meer originaliteit.</div>
</div>

<p class="cp">Dit debat is niet uniek voor Hollywood. Ook in de muziekindustrie, journalistiek en beeldende kunst wordt volop gediscussieerd: wie is de "maker" als AI meehielp? En moet die AI toestemming hebben gehad om te leren van bestaand werk?</p>

<div class="nw">
  <button class="sr-btn b" onclick="p4()">← Vorige</button>
  <button class="sr-btn g" onclick="n4()">Volgende: deepfakes herkennen →</button>
  <span class="nh">Stap 4/11</span>
</div>`;
}

function m4s4(c){
  c.innerHTML = `
<div class="s-badge">🎭 Stap 5 van 11 · Deepfakes herkennen</div>
<h2 class="ch2">Hoe herken je een <em>deepfake</em>?</h2>
<p class="cp">Je zag in Module 1 al het voorbeeld van de nep-MrBeast-advertentie. Deepfakes worden steeds beter en moeilijker te herkennen met het blote oog. Toch zijn er signalen om op te letten:</p>

<h3 class="ch3">👀 Visuele signalen</h3>
<ul style="font-size: 13px; color: #3d4f8a; line-height: 1.8; padding-left: 20px;">
<li>Onnatuurlijk knipperen met de ogen, of net helemaal niet knipperen</li>
<li>Vreemde overgangen bij de rand van het gezicht of haar</li>
<li>Verlichting op het gezicht die niet klopt met de rest van de scène</li>
<li>Lipbewegingen die niet helemaal synchroon lopen met het geluid</li>
</ul>

<h3 class="ch3">🔊 Audio-signalen</h3>
<ul style="font-size: 13px; color: #3d4f8a; line-height: 1.8; padding-left: 20px;">
<li>Robotachtige of onnatuurlijke intonatie</li>
<li>Vreemde pauzes op ongebruikelijke plekken</li>
</ul>

<div class="ib warn">
  <div class="ib-t">✅ De gouden regel</div>
  <div class="ib-b">Twijfel je? Check de bron. Komt deze video van een officieel, geverifieerd account? Wordt hetzelfde nieuws ook gemeld door betrouwbare media (VRT, De Standaard...)? Als een schokkend filmpje enkel op één anoniem account staat, wees extra voorzichtig voor je het deelt.</div>
</div>

<p class="cp">Wil je meer weten over hoe je deepfakes herkent? VRT NWS maakte enkele korte filmpjes met tips om zelf te leren factchecken: <a href="https://www.vrt.be/vrtnws/nl/kijk/2023/05/11/fast-ddt-how-to-factcheck-deepfakes-arvato-57297239/" target="_blank">Hoe factcheck je deepfakes?</a> en <a href="https://www.vrt.be/vrtnws/nl/kijk/2023/03/29/ddt-how-to-factcheck-ai-gegenereerde-fotos-arvato-56386080" target="_blank">Hoe factcheck je AI-gegenereerde foto's?</a></p>

<div class="nw">
  <button class="sr-btn b" onclick="p4()">← Vorige</button>
  <button class="sr-btn g" onclick="n4()">Volgende: privacy →</button>
  <span class="nh">Stap 5/11</span>
</div>`;
}

function m4s5(c){
  c.innerHTML = `
<div class="s-badge">🔐 Stap 6 van 11 · Privacy & jouw data</div>
<h2 class="ch2">Wat gebeurt er met wat <em>jij</em> intypt?</h2>
<p class="cp">Wanneer je iets typt in ChatGPT of een andere AI-tool, verdwijnt dat niet zomaar. Bij gratis, publieke AI-tools wordt wat je intypt vaak gebruikt om het model verder te trainen, of bewaard op servers van het bedrijf.</p>

<h3 class="ch3">❌ Wat deel je best NOOIT met AI-chatbots?</h3>
<ul style="font-size: 13px; color: #3d4f8a; line-height: 1.8; padding-left: 20px;">
<li>Je volledige naam samen met adres, telefoonnummer of geboortedatum</li>
<li>Wachtwoorden of inloggegevens</li>
<li>Foto's van paspoort, identiteitskaart of andere officiële documenten</li>
<li>Medische informatie over jezelf of familie</li>
<li>Persoonlijke informatie over vrienden of klasgenoten zonder hun toestemming</li>
</ul>

<div class="ib warn">
  <div class="ib-t">💡 Sint-Rembert kiest bewust voor Copilot</div>
  <div class="ib-b">Dat is waarom de school kiest voor Microsoft Copilot met je schoolaccount: die gegevens blijven binnen de beveiligde schoolomgeving en worden niet gebruikt om AI-modellen te trainen. Meer hierover in Module 5.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p4()">← Vorige</button>
  <button class="sr-btn g" onclick="n4()">Volgende: video →</button>
  <span class="nh">Stap 6/11</span>
</div>`;
}

function m4s6(c){
  c.innerHTML = `
<div class="s-badge">🎬 Stap 7 van 11 · Video: vooroordelen bij AI</div>
<h2 class="ch2">Bekijk: <em>AI en vooroordelen</em></h2>
<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/UG_X_7g63rY" allowfullscreen loading="lazy" title="Vooroordelen en AI"></iframe></div>
<div class="ib warn">
  <div class="ib-t">📝 Waar gaat dit over?</div>
  <div class="ib-b">In de EDUbox-cursus legt professor An Jacobs uit hoe vooroordelen een rol spelen bij AI: omdat systemen leren van data die mensen maakten, kunnen ze bestaande ongelijkheden overnemen en zelfs versterken — vaak zonder dat het bewust zo bedoeld was.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p4()">← Vorige</button>
  <button class="sr-btn g" onclick="n4()">Volgende: doe-opdracht →</button>
  <span class="nh">Stap 7/11</span>
</div>`;
}

function m4s7(c){
  c.innerHTML = `
<div class="s-badge">🧩 Stap 8 van 11 · Doe-opdracht</div>
<h2 class="ch2">Herken de <em>bias</em></h2>
<p class="cp">Bekijk elk scenario en beslis: is hier sprake van mogelijke bias in het AI-systeem?</p>
<div id="biascheck"></div>

<div class="nw">
  <button class="sr-btn b" onclick="p4()">← Vorige</button>
  <button class="sr-btn g" onclick="n4()">Volgende: discussie →</button>
  <span class="nh">Stap 8/11</span>
</div>`;
  renderBiasCheck();
}

function m4s8(c){
  c.innerHTML = `
<div class="s-badge">💬 Stap 9 van 11 · Discussievragen</div>
<h2 class="ch2">Wat denk <em>jij</em> hiervan?</h2>
<div class="disc-card">
  <div class="disc-q">1. Als een AI-systeem onbedoeld discrimineert (zoals bij het sollicitatie-voorbeeld), wie is dan verantwoordelijk?</div>
  <div class="disc-a">De meeste experts vinden dat bedrijven die AI-systemen bouwen en inzetten, verantwoordelijk blijven — ook al was de bias onbedoeld. Ze moeten hun systemen testen op discriminatie voor ze die gebruiken.</div>
</div>
<div class="disc-card">
  <div class="disc-q">2. Vind jij dat AI-bedrijven moeten betalen aan kunstenaars/schrijvers wiens werk gebruikt werd om het model te trainen?</div>
  <div class="disc-a">Dit is precies waar de Hollywood-staking van 2023 over ging. Voorstanders zeggen: makers verdienen compensatie voor hun creatieve bijdrage. Tegenstanders zeggen: het is vergelijkbaar met hoe mensen ook leren door bestaand werk te bestuderen.</div>
</div>
<div class="disc-card">
  <div class="disc-q">3. Zou jij bereid zijn om minder AI te gebruiken als je wist dat het 25x meer energie kost dan een Google-zoekopdracht?</div>
  <div class="disc-a">Een persoonlijke afweging — vergelijk het met andere keuzes die je al maakt voor het milieu. Bewust gebruik (AI enkel wanneer het echt nodig is) i.p.v. volledig vermijden is voor de meesten haalbaarder.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p4()">← Vorige</button>
  <button class="sr-btn g" onclick="n4()">Volgende: kennischeck →</button>
  <span class="nh">Stap 9/11</span>
</div>`;
}

function m4s9(c){
  const quiz = [
    {q: 'Waarom verwart een AI-systeem soms een koekje met een hond?', o: ['Omdat het systeem op dat exacte moment technisch defect is geraakt.','Omdat de patronen op elkaar lijken; AI werkt met kansen.','Omdat honden en koekjes voor elke computer altijd volledig identiek zijn.','Dit is puur theoretisch bedacht en gebeurt in de praktijk eigenlijk nooit echt.'], a: 1, f: 'AI herkent patronen en berekent een kans — bij gelijkaardige patronen kan het dus fout gaan, ook bij onschuldige voorbeelden.' },
    {q: 'Hoeveel meer energie kost een zoekopdracht op ChatGPT ongeveer, vergeleken met Google?', o: ['2 keer meer','25 keer meer','100 keer meer','Evenveel'], a: 1, f: 'Een ChatGPT-zoekopdracht kost ongeveer 25 keer meer energie dan dezelfde zoekopdracht op Google.' },
    {q: 'Waarom staakten acteurs en scenarioschrijvers in Hollywood in 2023?', o: ['Om structureel hogere lonen te eisen voor gevaarlijke stunts en extra scènes.','Om zekerheid te krijgen dat hun creativiteit ook in de toekomst erkend en beschermd wordt.','Om te pleiten voor een merkbaar betere cateringservice op alle filmsets.','Om formeel te eisen dat AI helemaal verboden wordt in de hele filmindustrie.'], a: 1, f: 'Ze wilden garanties dat hun werk niet zomaar door AI vervangen of zonder compensatie gebruikt zou worden om AI te trainen.' },
    {q: 'Wat deel je best NOOIT met een publieke AI-chatbot?', o: ['Algemene, neutrale vragen over een huiswerkonderwerp.','Wachtwoorden, identiteitsdocumenten of medische informatie.','Hypothetische scenario\'s die je zelf verzint ter oefening.','Creatieve schrijfopdrachten voor een taalvak.'], a: 1, f: 'Gevoelige persoonlijke informatie kan door het AI-bedrijf bewaard of gebruikt worden — deel dit nooit met publieke tools.' },
    {q: 'Wat is de beste manier om een deepfake-video te controleren?', o: ['Enkel beoordelen of de beeldkwaliteit er over het algemeen scherp uitziet.','De bron checken: komt het van een officieel account, bevestigd door betrouwbare media?', 'Uit voorzorg besluiten om video\'s in het algemeen nooit meer te bekijken.','Simpelweg vertrouwen op het aantal likes en reacties dat eronder staat.'], a: 1, f: 'Bronkritiek blijft de beste aanpak — visuele signalen zijn niet altijd waterdicht, AI wordt steeds beter.' }
  ];
  rQuiz(c, quiz, 4, 'mod4', n4, 60);
}

function m4s10(c){
  c.innerHTML = `
<div class="s-badge">✍️ Stap 11 van 11 · Jouw reflectie</div>
<h2 class="ch2">Welk risico raakt <em>jou</em> het meest?</h2>
<p class="cp">Je kent nu de belangrijkste ethische risico's van AI: vooroordelen/bias, ethische dilemma's, energieverbruik, impact op creatief werk, deepfakes en privacy.</p>

<h3 class="ch3">💭 Stellingen</h3>
<div id="stl-m4"></div>

<p class="cp">Noteer je reflectie: Welk risico vind jij het meest verontrustend, en waarom? Wat zou jij zelf doen om hier voorzichtig mee om te gaan?</p>
<p style="font-size:11px;color:#999;font-style:italic;margin:-8px 0 12px 0;">📄 Werk je liever op papier? Deze samenvatting, stellingen en reflectie staan ook op <strong>pagina 11-12</strong> van je invulcursus.</p>
<textarea class="sr-ta" id="ref4" placeholder="Het risico dat mij het meest zorgen baart is... Ik zou zelf..."></textarea>

<div class="nw">
  <button class="sr-btn b" onclick="p4()">← Vorige</button>
  <button class="sr-btn g" id="ref4btn" onclick="sRef4()">✅ Module 4 afronden →</button>
  <span class="nh">Stap 11/11</span>
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
   Gebaseerd op EDUbox Artificiële Intelligentie, deel 4 "AI en jij" + Sint-Rembert beleid
   ════════════════════════════════════════════ */

const m5 = [m5s0, m5s1, m5s2, m5s3, m5s4, m5s5, m5s6, m5s7, m5s8, m5s9, m5s10];

function rm5(){ const c=document.getElementById('m5c'); c.innerHTML=''; rDots(5,m5.length,S.mod5.step); m5[S.mod5.step](c); lockNextButtons(c); }
function n5(){ S.mod5.step++; ss(); S.mod5.step>=m5.length ? d5() : rm5(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); }
function p5(){ if(S.mod5.step > 0){ S.mod5.step--; ss(); rm5(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); } }
function d5(){ S.mod5.done=true; S.mod5.step=0; ss(); up(); rmc(); sv('home'); setTimeout(()=>alert('🎉 Module 5 voltooid! Module 6 (laatste!) is nu beschikbaar.'),300); }

function m5s0(c){
  c.innerHTML = `
<div class="s-badge">📚 Stap 1 van 11 · AI in de klas</div>
<h2 class="ch2">AI is een <em>handig hulpmiddel</em> — met afspraken</h2>
<p class="cp">We kunnen er niet omheen: AI is een handig hulpmiddel, ook in de klas of bij je huiswerk. AI-tools kunnen bijvoorbeeld een samenvatting maken van een deel van je cursus, of nogmaals uitleggen hoe een wiskundige berekening precies werkt.</p>
<p class="cp">Maar je zou AI ook een opstel in jouw plaats kunnen laten schrijven. Dat is uiteraard erg gemakkelijk maar niet de bedoeling. Rond het gebruik van AI in de klas zijn daarom <strong>afspraken nodig</strong>.</p>

<div class="ib warn">
  <div class="ib-t">💡 Waarom werkt Sint-Rembert met AI-labels?</div>
  <div class="ib-b">Niet elke opdracht leent zich tot AI-gebruik. Een opstel om je eigen schrijfvaardigheid te tonen is anders dan een infographic waar creativiteit met tools centraal staat. Labels maken voor jou meteen duidelijk wat de bedoeling is bij elke opdracht.</div>
</div>

<div class="nw">
  <button class="sr-btn g" onclick="n5()">Volgende: wel/niet →</button>
  <span class="nh">Stap 1/11</span>
</div>`;
}

function m5s1(c){
  c.innerHTML = `
<div class="s-badge">✅❌ Stap 2 van 11 · Enkele afspraken</div>
<h2 class="ch2">AI-tools gebruiken in de <em>klas</em></h2>
<p class="cp">Hier zijn enkele algemene afspraken om AI-tools te gebruiken in de klas of bij je huiswerk:</p>

<div class="grid2">
  <div class="pane-ok lijst-ok">
    <div class="lijst-h-ok">✅ WEL</div>
    <div>→ Gebruik AI-tools om je te helpen bij bepaalde taken, zoals samenvatten of brainstormen</div>
    <div>→ Laat je inspireren door AI, maar kopieer het niet zomaar</div>
    <div>→ Controleer je resultaat altijd op fouten</div>
    <div>→ Wees transparant: laat het weten wanneer je AI hebt gebruikt</div>
    <div>→ Wees altijd kritisch voor de output</div>
  </div>
  <div class="pane-nok lijst-nok">
    <div class="lijst-h-nok">❌ NIET</div>
    <div>→ Laat AI nooit het hele werk overnemen</div>
    <div>→ Schuif fouten niet af op AI: jij behoudt de verantwoordelijkheid</div>
    <div>→ Deel nooit persoonlijke gegevens met een AI-tool</div>
    <div>→ Gebruik geen werken die door auteursrechten beschermd zijn</div>
  </div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p5()">← Vorige</button>
  <button class="sr-btn g" onclick="n5()">Volgende: de 5 AI-labels →</button>
  <span class="nh">Stap 2/11</span>
</div>`;
}

function m5s2(c){
  c.innerHTML = `
<div class="s-badge">🏷️ Stap 3 van 11 · De 5 AI-labels van Sint-Rembert</div>
<h2 class="ch2">Sint-Rembert vertaalt dit naar <em>5 labels</em></h2>
<p class="cp">Om deze afspraken heel concreet te maken per opdracht, gebruikt Sint-Rembert een schaal van 5 labels — van strikt verbod (label 1) tot volledig vrij AI-gebruik (label 5).</p>

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
  <span class="nh">Stap 3/11</span>
</div>`;
}

function m5s3(c){
  c.innerHTML = `
<div class="s-badge">🧩 Stap 4 van 11 · Doe-opdracht</div>
<h2 class="ch2">Welk label hoort <em>hier</em>?</h2>
<p class="cp">Bekijk elke opdrachtomschrijving en klik op het label (1 t.e.m. 5) dat er volgens jou het best bij past.</p>
<div id="lblmatch"></div>

<div class="nw">
  <button class="sr-btn b" onclick="p5()">← Vorige</button>
  <button class="sr-btn g" onclick="n5()">Volgende: goedgekeurde tools →</button>
  <span class="nh">Stap 4/11</span>
</div>`;
  renderLabelMatchLeerling();
}

function m5s4(c){
  c.innerHTML = `
<div class="s-badge">🛠️ Stap 5 van 11 · Welke tools mag je gebruiken?</div>
<h2 class="ch2">Goedgekeurde <em>AI-tools</em></h2>
<p class="cp">Sint-Rembert kiest bewust voor <strong>Microsoft Copilot</strong> als voornaamste AI-tool voor onderwijsdoeleinden. Copilot is geïntegreerd in je schoolaccount, waardoor je gebruik binnen de beveiligde schoolomgeving blijft. Wat je intypt wordt <strong>niet</strong> gebruikt om AI-modellen mee te trainen. Daarnaast staat het officiële beleidskader ook een aantal andere tools toe.</p>

<div class="grid2">
  <div class="pane-ok lijst-ok">
    <div class="lijst-h-ok">✅ Toegestane AI-toepassingen</div>
    <div>→ Microsoft Copilot for M365 (eerste keuze, met schoolaccount)</div>
    <div>→ Microsoft Copilot Chat</div>
    <div>→ NotebookLM (zie Module 2)</div>
    <div>→ Bookwidgets AI</div>
    <div>→ ChatGPT</div>
    <div>→ Claude.ai</div>
    <div>→ Google Gemini</div>
    <div>→ Gamma.app</div>
  </div>
  <div class="pane-nok lijst-nok">
    <div class="lijst-h-nok">⚠️ Let op</div>
    <div>→ Bij twijfel: vraag het aan je leerkracht voor je een nieuwe tool gebruikt</div>
    <div>→ Gebruik nooit tools waarbij je moet betalen zonder toestemming van je ouders</div>
    <div>→ Enkel Copilot M365 (met je schoolaccount) is volledig veilig voor gevoelige/persoonlijke informatie</div>
  </div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p5()">← Vorige</button>
  <button class="sr-btn g" onclick="n5()">Volgende: praktijkscenario's →</button>
  <span class="nh">Stap 5/11</span>
</div>`;
}

function m5s5(c){
  c.innerHTML = `
<div class="s-badge">🧑‍🎓 Stap 6 van 11 · Praktijkscenario's</div>
<h2 class="ch2">Praktijkscenario's: <em>wat zou jij doen?</em></h2>
<p class="cp">Hier volgen herkenbare situaties uit het echte schoolleven. Bekijk elk scenario en beslis: mag dit wel, of mag dit niet?</p>
<div id="magwel-leerling"></div>

<div class="nw">
  <button class="sr-btn b" onclick="p5()">← Vorige</button>
  <button class="sr-btn g" onclick="n5()">Volgende: waarom geen detectietools →</button>
  <span class="nh">Stap 6/11</span>
</div>`;
  renderMagWelLeerling();
}

function m5s6(c){
  c.innerHTML = `
<div class="s-badge">🔍 Stap 7 van 11 · AI-detectie: waarom niet?</div>
<h2 class="ch2">Waarom gebruikt Sint-Rembert <em>geen</em> AI-detectietools?</h2>
<p class="cp">Je zou verwachten dat een school tools gebruikt die "AI-tekst" herkennen om plagiaat op te sporen. Sint-Rembert doet dit bewust <strong>niet</strong>.</p>

<div class="ib warn">
  <div class="ib-t">⚠️ AI-detectietools zijn onbetrouwbaar</div>
  <div class="ib-b">Tools die beweren AI-tekst te herkennen leveren regelmatig <strong>valse beschuldigingen</strong> op — vooral bij leerlingen die formeel schrijven, of niet-moedertaalsprekers.</div>
</div>

<p class="cp">In plaats daarvan vertrekt evaluatie op Sint-Rembert vanuit <strong>vertrouwen en gesprek</strong>. Leerkrachten ontwerpen opdrachten die inzicht geven in jouw denken en redeneren — bijvoorbeeld via mondelinge toelichting of tussentijdse versies van je werk.</p>

<p class="cp">Als een leerkracht vermoedt dat je (te veel) AI gebruikte zonder dat het toegelaten was, zal die met jou in gesprek gaan. Eerlijkheid is dan je beste kaart: leg uit wat je wel en niet zelf deed.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p5()">← Vorige</button>
  <button class="sr-btn g" onclick="n5()">Volgende: charter maken →</button>
  <span class="nh">Stap 7/11</span>
</div>`;
}

function m5s7(c){
  c.innerHTML = `
<div class="s-badge">📝 Stap 8 van 11 · Stel een charter op</div>
<h2 class="ch2">Maak <em>je eigen</em> klascharter</h2>
<p class="cp">Stel je nu met je klas een <strong>charter</strong> op met daarin afspraken rond het gebruik van AI in de klas. Zijn de afspraken die je in deze module leerde voldoende, of heeft jouw klas nog extra afspraken nodig?</p>

<div class="ib warn">
  <div class="ib-t">💡 Tip</div>
  <div class="ib-b">Weet jij wat er in het schoolreglement staat over het gebruik van AI? Misschien is dit het juiste moment om dat eens te checken!</div>
</div>

<h3 class="ch3">✍️ Schrijf 2 extra afspraken die jij zou toevoegen</h3>
<textarea class="sr-ta" id="charter1" style="min-height:90px;" placeholder="Bijvoorbeeld: 'Als we AI gebruiken voor een groepswerk, moeten we dat samen beslissen.' of 'We spreken af dat...'"></textarea>

<div class="nw">
  <button class="sr-btn b" onclick="p5()">← Vorige</button>
  <button class="sr-btn g" id="charterbtn" onclick="sCharter()">Volgende: kennischeck →</button>
  <span class="nh">Stap 8/11</span>
</div>`;
  const ta = document.getElementById('charter1');
  ta.value = localStorage.getItem('sr_l_charter1') || '';
  ta.oninput = ()=>localStorage.setItem('sr_l_charter1', ta.value);
}

function sCharter(){
  const v = (document.getElementById('charter1').value||'').trim();
  if(v.length < 15){ alert('Schrijf minstens 1-2 concrete afspraken uit.'); return; }
  n5();
}

function m5s8(c){
  const quiz = [
    {q: 'Wat is het uitgangspunt van het AI-beleid op Sint-Rembert?', o: ['AI-gebruik is altijd toegestaan, behalve wanneer een leerkracht het uitdrukkelijk verbiedt.','AI-gebruik is niet toegestaan, tenzij je leerkracht expliciet toestemming geeft via een label.','AI-gebruik is enkel toegestaan voor leerlingen vanaf 16 jaar oud.','Elke individuele leerkracht bepaalt dit apart, zonder algemeen schoolkader.'], a: 1, f: 'Het beleid vertrekt van "niet toegestaan, tenzij" — labels maken per opdracht duidelijk wat wél mag.' },
    {q: 'Bij welk label mag AI enkel gebruikt worden voor brainstorm/ideeën?', o: ['Label 1','Label 2','Label 4','Label 5'], a: 1, f: 'Label 2 (Ideeën) staat AI toe voor inspiratie, maar het geschreven werk moet van jou zijn.' },
    {q: 'Waarom gebruikt Sint-Rembert geen AI-detectietools?', o: ['Omdat de aanschaf van zulke tools veel te duur zou uitvallen.','Omdat ze onbetrouwbaar zijn en regelmatig valse beschuldigingen opleveren.','Omdat de school over het algemeen weinig belang hecht aan eerlijkheid.','Omdat er wereldwijd nog geen enkele tool bestaat die dit probeert.'], a: 1, f: 'AI-detectietools zijn wetenschappelijk onvoldoende betrouwbaar — de school kiest voor gesprek en vertrouwen.' },
    {q: 'Welke AI-tool wordt bij voorkeur gebruikt op Sint-Rembert?', o: ['De gratis versie van ChatGPT, omdat die het bekendst is bij leerlingen.','Microsoft Copilot met schoolaccount, want data blijft binnen de schoolomgeving.','Elke tool mag door leerlingen volledig vrij gekozen worden.','Enkel tools die leerlingen volledig zelf hebben ontwikkeld.'], a: 1, f: 'Copilot met schoolaccount beschermt je gegevens en gebruikt ze niet om modellen te trainen.' },
    {q: 'Volgens de algemene afspraken: wat moet je ALTIJD doen als je AI gebruikte?', o: ['Niets in het bijzonder, want dat is volgens de afspraken niet nodig.','Transparant zijn en laten weten dat je AI hebt gebruikt.','Enkel je ouders hierover inlichten, niet je leerkracht.','Gewoon wachten tot je leerkracht er zelf naar vraagt.'], a: 1, f: 'Transparantie staat centraal in de afspraken: laat altijd weten wanneer je AI hebt ingezet.' }
  ];
  rQuiz(c, quiz, 5, 'mod5', n5, 60);
}

function m5s9(c){
  c.innerHTML = `
<div class="s-badge">✍️ Stap 10 van 11 · Jouw eigen AI-afspraken</div>
<h2 class="ch2">Wat zijn <em>jouw</em> regels?</h2>
<p class="cp">Je kent nu de 5 AI-labels en het beleid van Sint-Rembert.</p>

<h3 class="ch3">💭 Stellingen</h3>
<div id="stl-m5"></div>

<p class="cp">Noteer je reflectie: Welk AI-label vind jij het makkelijkst om je aan te houden, en welk het moeilijkst? Wat zou jij doen als een klasgenoot je vraagt om "gewoon zijn ChatGPT-tekst te kopiëren"?</p>
<p style="font-size:11px;color:#999;font-style:italic;margin:-8px 0 12px 0;">📄 Werk je liever op papier? De labeltabel, stellingen en reflectie staan ook op <strong>pagina 13-14</strong> van je invulcursus.</p>
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
✅ AI-detectie wordt niet gebruikt — vertrouwen en gesprek staan centraal
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
   Gebaseerd op EDUbox Artificiële Intelligentie, deel 4 "AI en de samenleving" + deel 5
   ════════════════════════════════════════════ */

const m6 = [m6s0, m6s1, m6s2, m6s3, m6s4, m6s5, m6s6, m6s7, m6s8, m6s9, m6s10];

function rm6(){ const c=document.getElementById('m6c'); c.innerHTML=''; rDots(6,m6.length,S.mod6.step); m6[S.mod6.step](c); lockNextButtons(c); }
function n6(){ S.mod6.step++; ss(); S.mod6.step>=m6.length ? d6() : rm6(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); }
function p6(){ if(S.mod6.step > 0){ S.mod6.step--; ss(); rm6(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); } }
function d6(){ S.mod6.done=true; S.mod6.step=0; ss(); up(); rmc(); sv('cert'); }

function m6s0(c){
  c.innerHTML = `
<div class="s-badge">🌍 Stap 1 van 11 · De laatste module!</div>
<h2 class="ch2">AI in de <em>Samenleving</em></h2>
<p class="cp">Ook in de samenleving zorgen de nieuwe mogelijkheden van AI voor veel veranderingen. Sommige veranderingen komen iedereen ten goede, maar het is belangrijk om bij andere dingen even stil te staan.</p>

<div class="ib warn">
  <div class="ib-t">🏁 Bijna klaar!</div>
  <div class="ib-b">Na deze module krijg je je certificaat. Deze module bevat 3 klasgesprek-stellingen en een <strong>grote afsluitende reflectie</strong> — neem er de tijd voor.</div>
</div>

<div class="nw">
  <button class="sr-btn g" onclick="n6()">Volgende: AI en jobs →</button>
  <span class="nh">Stap 1/11</span>
</div>`;
}

function m6s1(c){
  c.innerHTML = `
<div class="s-badge">💼 Stap 2 van 11 · Stelling 1: jobs</div>
<h2 class="ch2">Stelling: "AI zal op termijn <em>alle jobs</em> doen verdwijnen"</h2>
<p class="cp">Bespreek deze stelling met jezelf of je klasgenoten. Ben je akkoord of niet? En waarom? De hulpvragen hieronder kunnen je helpen om een mening te formuleren.</p>

<div style="background: white; border-radius: 8px; padding: 16px; margin: 16px 0; border: 1px solid #e0e4f5;">
<p style="font-size: 13px; color: #3d4f8a; line-height: 1.9; margin: 0;">
🤔 Is deze angst realistisch?<br>
🤔 Heeft AI alleen een impact in technische sectoren?<br>
🤔 Welke banen zijn kwetsbaar? En welke zijn minder kwetsbaar?
</p>
</div>

<h3 class="ch3">📉 Wat weten we wel?</h3>
<p class="cp">Taken die <strong>routinematig en voorspelbaar</strong> zijn, worden het snelst beïnvloed door AI: eenvoudige teksten schrijven, data invoeren, eerste-lijns klantenservice. Dit betekent niet dat deze jobs volledig verdwijnen — vaak veranderen ze, waarbij AI het routinewerk overneemt.</p>

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
  <button class="sr-btn g" onclick="n6()">Volgende: stelling 2 →</button>
  <span class="nh">Stap 3/11</span>
</div>`;
  renderJobCheck();
}

function m6s3(c){
  c.innerHTML = `
<div class="s-badge">🚫 Stap 4 van 11 · Stelling 2: liever niet</div>
<h2 class="ch2">Stelling: "Voor sommige zaken wil ik AI <em>liever niet</em> inzetten"</h2>
<p class="cp">Bespreek deze stelling. Ben je akkoord of niet? De hulpvragen kunnen je helpen:</p>

<div style="background: white; border-radius: 8px; padding: 16px; margin: 16px 0; border: 1px solid #e0e4f5;">
<p style="font-size: 13px; color: #3d4f8a; line-height: 1.9; margin: 0;">
🤔 Waar kan AI je vooral bij helpen?<br>
🤔 In welke aspecten van je leven wil je AI liever niet gebruiken?<br>
🤔 Waar zijn mensen beter in dan AI?
</p>
</div>

<h3 class="ch3">🎓 Aan het woord: universitaire experts</h3>
<p class="cp">De Universiteit van Vlaanderen behandelt in korte online colleges vraagstukken zoals: "Moet je nooit meer zelf een eindwerk of verjaardagskaart schrijven dankzij ChatGPT?" en "Gaan slimme computers de wereld veroveren?" — boeiend om zelf eens te bekijken op <a href="https://www.universiteitvanvlaanderen.be" target="_blank">universiteitvanvlaanderen.be</a>.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p6()">← Vorige</button>
  <button class="sr-btn g" onclick="n6()">Volgende: stelling 3 →</button>
  <span class="nh">Stap 4/11</span>
</div>`;
}

function m6s4(c){
  c.innerHTML = `
<div class="s-badge">🎨 Stap 5 van 11 · Stelling 3: creativiteit</div>
<h2 class="ch2">Stelling: "AI zal nooit zo creatief kunnen zijn <em>als mensen</em>"</h2>
<p class="cp">Bespreek deze laatste stelling. De hulpvragen:</p>

<div style="background: white; border-radius: 8px; padding: 16px; margin: 16px 0; border: 1px solid #e0e4f5;">
<p style="font-size: 13px; color: #3d4f8a; line-height: 1.9; margin: 0;">
🤔 Wat betekent creativiteit eigenlijk?<br>
🤔 Kan AI op dezelfde manier creatief zijn als mensen?<br>
🤔 Kan een schilderij of gedicht dat door AI is gemaakt, kunst zijn?
</p>
</div>

<p class="cp">Denk terug aan de Hollywood-staking uit Module 4: acteurs en schrijvers wilden garanties dat hun creativiteit erkend blijft. Dit debat hangt nauw samen met deze stelling.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p6()">← Vorige</button>
  <button class="sr-btn g" onclick="n6()">Volgende: video →</button>
  <span class="nh">Stap 5/11</span>
</div>`;
}

function m6s5(c){
  c.innerHTML = `
<div class="s-badge">🎬 Stap 6 van 11 · Video</div>
<h2 class="ch2">Bekijk: <em>waar moeten we op letten?</em></h2>
<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/JMLsHI8aV0g" allowfullscreen loading="lazy" title="AI-expert over de evolutie van AI"></iframe></div>
<div class="ib warn">
  <div class="ib-t">📝 Waar gaat dit over?</div>
  <div class="ib-b">Hoe meer AI verweven raakt met ons dagelijks leven, hoe meer we ons bewust moeten zijn van de gevaren die de technologie met zich meebrengt. Een AI-expert bekijkt het potentieel van AI, maar vraagt zich ook luidop af wat er gebeurt als de technologie zich sneller ontwikkelt dan de regelgeving.</div>
</div>

<div class="nw">
  <button class="sr-btn b" onclick="p6()">← Vorige</button>
  <button class="sr-btn g" onclick="n6()">Volgende: EU AI Act →</button>
  <span class="nh">Stap 6/11</span>
</div>`;
}

function m6s6(c){
  c.innerHTML = `
<div class="s-badge">⚖️ Stap 7 van 11 · Regelgeving</div>
<h2 class="ch2">De <em>EU AI Act</em>: Europa maakt regels</h2>
<p class="cp">Omdat AI-ontwikkeling zo snel gaat, hebben overheden regelgeving nodig. De <strong>EU AI Act</strong> (2024) is de eerste uitgebreide AI-wetgeving ter wereld.</p>

<div style="background: white; border-left: 4px solid var(--blue); border-radius: 8px; padding: 16px; margin: 16px 0;">
<p style="font-size: 13px; color: #3d4f8a; line-height: 1.8; margin: 0;">
De wet verbiedt bepaalde toepassingen (zoals massale sociale scoring van burgers) en verplicht transparantie en veiligheidstests voor risicovolle AI-systemen. Ze verplicht bijvoorbeeld ook dat personeel van organisaties die AI gebruiken voldoende "AI-geletterd" moet zijn — precies waarom jij deze cursus volgt!
</p>
</div>

<p class="cp">Niet elk land regelt AI op dezelfde manier. Sommige landen zetten AI in voor grootschalige bewaking van burgers, andere laten de markt vrijwel ongereguleerd. Deze verschillen leiden tot grote verschillen in privacy en vrijheid wereldwijd.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p6()">← Vorige</button>
  <button class="sr-btn g" onclick="n6()">Volgende: blik vooruit →</button>
  <span class="nh">Stap 7/11</span>
</div>`;
}

function m6s7(c){
  c.innerHTML = `
<div class="s-badge">🔮 Stap 8 van 11 · Blik vooruit</div>
<h2 class="ch2">AI over <em>5 en 10 jaar</em></h2>
<p class="cp">Niemand kan de toekomst voorspellen, maar experts schetsen wel scenario's op basis van huidige trends.</p>

<div style="background: white; border-left: 4px solid var(--green); border-radius: 12px; padding: 18px; margin: 16px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 14px; color: var(--green); margin-bottom: 10px;">📅 Over 5 jaar</div>
  <p style="font-size: 13px; color: #3d4f8a; line-height: 1.7;">AI-assistenten worden nog gewoner in school en werk. Verwacht: betere AI-tutoren op maat, striktere regelgeving rond deepfakes en AI-transparantie.</p>
</div>

<div style="background: white; border-left: 4px solid var(--blue); border-radius: 12px; padding: 18px; margin: 16px 0;">
  <div style="font-family: 'Archivo Black', sans-serif; font-size: 14px; color: var(--blue); margin-bottom: 10px;">📅 Over 10 jaar</div>
  <p style="font-size: 13px; color: #3d4f8a; line-height: 1.7;">Grotere veranderingen op de arbeidsmarkt worden zichtbaar. AI-geletterdheid wordt een basisvaardigheid, net als lezen en rekenen vandaag.</p>
</div>

<h3 class="ch3">🔬 Wil je zelf verder experimenteren?</h3>
<p class="cp">Met de gratis tool <strong>Scratch</strong> kan je een neuraal netwerk cijfers aanleren. Je helpt het algoritme cijfers te herkennen — een leuke, visuele manier om te zien hoe machine learning werkt in de praktijk.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p6()">← Vorige</button>
  <button class="sr-btn g" onclick="n6()">Volgende: kennischeck →</button>
  <span class="nh">Stap 8/11</span>
</div>`;
}

function m6s8(c){
  const quiz = [
    {q: 'Welk type taken wordt het snelst beïnvloed door AI op de arbeidsmarkt?', o: ['Creatieve, unieke taken.','Routinematige en voorspelbare taken.','Taken die menselijk contact vereisen.','Alle taken evenveel.'], a: 1, f: 'Routinematige, voorspelbare taken zijn het makkelijkst te automatiseren met huidige AI-technologie.' },
    {q: 'Wat is de EU AI Act?', o: ['Een AI-chatbot die speciaal werd ontwikkeld in opdracht van de Europese Unie.','De eerste uitgebreide AI-wetgeving ter wereld, met regels over transparantie en veiligheid.','Een gratis online cursus over AI, aangeboden aan alle Europese burgers.','Een volledig en onvoorwaardelijk verbod op elke denkbare vorm van AI binnen Europa.'], a: 1, f: 'De EU AI Act (2024) reguleert AI-gebruik op basis van risiconiveau en verplicht transparantie bij hoog-risico toepassingen.' },
    {q: 'Waarom verplicht de EU AI Act dat personeel "AI-geletterd" moet zijn?', o: ['Om AI-bedrijven op die manier structureel meer winst te kunnen laten maken.','Om mensen te beschermen tegen risico\'s van AI door hen kritische kennis te geven.','Om AI-gebruik volledig en zonder uitzondering te verbieden op elke werkvloer.','Dit specifieke onderdeel staat in werkelijkheid nergens vermeld in de wet.'], a: 1, f: 'De wet erkent dat kennis over AI mensen beschermt tegen misbruik en verkeerd gebruik — precies waarom jij deze cursus volgt.' },
    {q: 'Waarom verschilt AI-regelgeving sterk tussen landen?', o: ['Omdat AI in bepaalde landen technisch gezien nog altijd niet zou bestaan.','Omdat landen verschillende waarden hebben rond privacy, vrijheid en staatscontrole.','Er bestaat in de dagelijkse praktijk eigenlijk geen enkel verschil tussen landen.','Omdat AI naar verluidt uitsluitend binnen Europa gebruikt zou mogen worden.'], a: 1, f: 'Verschillen in politieke waarden leiden tot sterk uiteenlopende aanpakken, van strenge regulering tot een quasi-vrije markt.' },
    {q: 'Met welke gratis tool kan je zelf een eenvoudig neuraal netwerk trainen om cijfers te herkennen?', o: ['Scratch','Microsoft Word','Google Maps','Instagram'], a: 0, f: 'Met Scratch kan je spelenderwijs een neuraal netwerk cijfers aanleren en zo ontdekken hoe machine learning werkt.' }
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
<li>Wat ga je zelf anders doen na deze cursus?</li>
</ul>
<p style="font-size:11px;color:#999;font-style:italic;margin:0 0 12px 0;">📄 Werk je liever op papier? Deze grote afsluitende reflectie staat ook op <strong>pagina 15-16</strong> van je invulcursus.</p>

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
✅ Wat AI is en de 3 elementen waaruit het bestaat<br>
✅ De 3 fasen: procedureel, machine learning, deep learning<br>
✅ Hoe generatieve AI werkt en hoe je goede prompts schrijft<br>
✅ Ethische risico's: bias, energieverbruik, deepfakes, privacy<br>
✅ De 5 AI-labels en regels van Sint-Rembert<br>
✅ Wat AI betekent voor de maatschappij, jobs, en jouw toekomst
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
   MODULE 7 — COPILOT ONTDEKKEN (optioneel, 7 stappen)
   Vrije verdieping: zelf experimenteren en dingen maken.
   Geen AI-label nodig — dit is een oefenzone, geen schoolopdracht.
   ════════════════════════════════════════════ */

const m7 = [m7s0, m7s1, m7s2, m7s3, m7s4, m7s5, m7s6];

function rm7(){ const c=document.getElementById('m7c'); c.innerHTML=''; rDots(7,m7.length,S.mod7.step); m7[S.mod7.step](c); lockNextButtons(c); }
function n7(){ S.mod7.step++; ss(); S.mod7.step>=m7.length ? d7() : rm7(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); }
function p7(){ if(S.mod7.step > 0){ S.mod7.step--; ss(); rm7(); document.getElementById('main').scrollTo({top:0, behavior:'smooth'}); } }
function d7(){ S.mod7.done=true; S.mod7.step=0; ss(); up(); rmc(); sv('home'); setTimeout(()=>alert('🎉 Copilot Ontdekken voltooid! Je kan dit altijd herhalen om verder te experimenteren.'),300); }

function m7s0(c){
  c.innerHTML = `
<div><span class="opt-badge">🎨 Optioneel</span><span class="s-badge">✨ Stap 1 van 7 · Welkom</span></div>
<h2 class="ch2">Copilot: <em>ontdek het zelf</em></h2>
<p class="cp">Je hebt nu geleerd wat AI is, hoe het werkt, en wat de regels op school zijn. Tijd om zelf aan de slag te gaan! In deze module ga je écht dingen <strong>maken</strong> met Copilot: een afbeelding, een tekst, een studiehulpmiddel — jij kiest.</p>

<div class="ib warn">
  <div class="ib-t">🆓 Dit is een vrije oefenzone</div>
  <div class="ib-b">In tegenstelling tot een echte schoolopdracht hoort hier <strong>geen AI-label</strong> bij (zie Module 5) — dit is bedoeld om vrij te experimenteren en de tool te leren kennen. Gebruik wat je hier maakt gerust voor jezelf, maar lever het niet zomaar in als een "echte" opdracht zonder dat je leerkracht dat heeft goedgekeurd.</div>
</div>

<h3 class="ch3">🛡️ Voor je begint: log veilig in</h3>
<p class="cp">Open Copilot via je schoolaccount (bijvoorbeeld via office.com of de Copilot-app). Check bovenaan het scherm of je een klein <strong>schild-icoon</strong> ziet — dat betekent dat je binnen de beveiligde schoolomgeving werkt en je gegevens niet gebruikt worden om het AI-model te trainen. Zie je geen schild? Meld je dan opnieuw aan met je schoolaccount.</p>

<div class="nw">
  <button class="sr-btn g" onclick="n7()">Volgende: goed prompten →</button>
  <span class="nh">Stap 1/7</span>
</div>`;
}

function m7s1(c){
  c.innerHTML = `
<div><span class="opt-badge">🎨 Optioneel</span><span class="s-badge">💬 Stap 2 van 7 · Prompten opfrissen</span></div>
<h2 class="ch2">Snel <em>opgefrist</em>: een goede prompt</h2>
<p class="cp">Je leerde dit al in Module 3, maar hier een snelle opfrisser voor je begint te experimenteren:</p>

<div style="background: rgba(10,31,168,0.08); border-radius: 8px; padding: 16px; margin: 16px 0;">
<p style="font-size: 13px; color: #3d4f8a; line-height: 1.9; margin: 0;">
<strong>1. Wees specifiek</strong> — "maak een poster" is vaag, "maak een poster over plastic in de oceaan, felle kleuren, voor 12-jarigen" is duidelijk<br>
<strong>2. Geef context</strong> — waarvoor is het bedoeld? Voor wie?<br>
<strong>3. Zeg wat je verwacht</strong> — lengte, stijl, vorm<br>
<strong>4. Niet tevreden? Vraag door</strong> — "maak het korter", "gebruik felle kleuren" — Copilot onthoudt het gesprek
</p>
</div>

<p class="cp">Nu jij! In de volgende stappen ga je 3 dingen zelf maken. Neem er de tijd voor — hoe beter je prompt, hoe leuker het resultaat.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p7()">← Vorige</button>
  <button class="sr-btn g" onclick="n7()">Volgende: maak een beeld →</button>
  <span class="nh">Stap 2/7</span>
</div>`;
}

function m7s2(c){
  c.innerHTML = `
<div><span class="opt-badge">🎨 Optioneel</span><span class="s-badge">🖼️ Stap 3 van 7 · Doe-opdracht: maak een beeld</span></div>
<h2 class="ch2">Maak <em>zelf</em> een afbeelding of poster</h2>
<p class="cp">Open Copilot en zoek de <strong>Create</strong>-functie (soms "Designer" genoemd). Kies iets dat je écht zou kunnen gebruiken:</p>
<ul style="font-size: 13px; color: #3d4f8a; line-height: 1.8; padding-left: 20px;">
<li>Een poster voor een schoolproject of -event</li>
<li>Een illustratie bij een verhaal dat je schrijft</li>
<li>Een uitnodiging voor een verjaardag of activiteit</li>
<li>Gewoon iets grappigs of creatiefs dat je zelf verzint</li>
</ul>
<p class="cp">Probeer minstens 2 keer een andere prompt of stijl, en kies je favoriete resultaat.</p>

<div class="ib warn">
  <div class="ib-t">✏️ Let op tekst in het beeld</div>
  <div class="ib-b">Staat er tekst op je afbeelding? AI maakt daar vaak spelfouten in. Gebruik de "Edit Text"-optie om dit zelf te corrigeren.</div>
</div>

<h3 class="ch3">✍️ Noteer hieronder wat je maakte</h3>
<p class="cp"><strong>Welke prompt gebruikte je (uiteindelijke versie)?</strong></p>
<textarea class="sr-ta" id="m7img_prompt" style="min-height:60px;" placeholder="Mijn prompt was: ..."></textarea>
<p class="cp" style="margin-top:14px;"><strong>Wat maakte je, en ben je tevreden met het resultaat?</strong></p>
<textarea class="sr-ta" id="m7img_result" style="min-height:60px;" placeholder="Ik maakte een... Ik vond het resultaat..."></textarea>

<div class="nw">
  <button class="sr-btn b" onclick="p7()">← Vorige</button>
  <button class="sr-btn g" id="m7img_btn" onclick="sM7Img()">Volgende: schrijf iets creatiefs →</button>
  <span class="nh">Stap 3/7</span>
</div>`;
  const ta1 = document.getElementById('m7img_prompt');
  const ta2 = document.getElementById('m7img_result');
  ta1.value = localStorage.getItem('sr_l_m7_img_prompt') || '';
  ta2.value = localStorage.getItem('sr_l_m7_img_result') || '';
  ta1.oninput = ()=>localStorage.setItem('sr_l_m7_img_prompt', ta1.value);
  ta2.oninput = ()=>localStorage.setItem('sr_l_m7_img_result', ta2.value);
}

function sM7Img(){
  const v1 = (document.getElementById('m7img_prompt').value||'').trim();
  const v2 = (document.getElementById('m7img_result').value||'').trim();
  if(v1.length < 5 || v2.length < 5){ alert('Vul beide velden in — probeer het écht zelf uit voor je verdergaat!'); return; }
  n7();
}

function m7s3(c){
  c.innerHTML = `
<div><span class="opt-badge">🎨 Optioneel</span><span class="s-badge">✍️ Stap 4 van 7 · Doe-opdracht: schrijf iets creatiefs</span></div>
<h2 class="ch2">Schrijf <em>iets</em> met Copilot</h2>
<p class="cp">Open de chat in Copilot en laat je creativiteit los. Kies één optie (of verzin je eigen idee):</p>
<ul style="font-size: 13px; color: #3d4f8a; line-height: 1.8; padding-left: 20px;">
<li>Een kort verhaal (max. 200 woorden) over een onderwerp dat jij kiest</li>
<li>Een gedicht of rap over iets dat je bezighoudt</li>
<li>Een grappige dialoog tussen twee onwaarschijnlijke personages</li>
<li>Een idee voor een script voor een kort filmpje</li>
</ul>
<p class="cp">Vraag gerust door: "maak het spannender", "voeg een plottwist toe", "schrijf het opnieuw in een andere stijl" — dat is precies hoe je met AI leert samenwerken.</p>

<h3 class="ch3">✍️ Noteer hieronder wat je maakte</h3>
<p class="cp"><strong>Wat liet je schrijven, en wat vond je van het resultaat?</strong></p>
<textarea class="sr-ta" id="m7txt_result" style="min-height:80px;" placeholder="Ik liet Copilot... schrijven. Het resultaat vond ik..."></textarea>

<div class="nw">
  <button class="sr-btn b" onclick="p7()">← Vorige</button>
  <button class="sr-btn g" id="m7txt_btn" onclick="sM7Txt()">Volgende: personaliseren →</button>
  <span class="nh">Stap 4/7</span>
</div>`;
  const ta = document.getElementById('m7txt_result');
  ta.value = localStorage.getItem('sr_l_m7_txt_result') || '';
  ta.oninput = ()=>localStorage.setItem('sr_l_m7_txt_result', ta.value);
}

function sM7Txt(){
  const v = (document.getElementById('m7txt_result').value||'').trim();
  if(v.length < 10){ alert('Vul dit veld in — probeer het écht zelf uit voor je verdergaat!'); return; }
  n7();
}

function m7s4(c){
  c.innerHTML = `
<div><span class="opt-badge">🎨 Optioneel</span><span class="s-badge">🎛️ Stap 5 van 7 · Copilot op jouw maat</span></div>
<h2 class="ch2">Personaliseer <em>Copilot</em></h2>
<p class="cp">Wist je dat je Copilot kan vragen om voortaan rekening te houden met jouw voorkeuren? Via <strong>Instellingen → Personalisation → Custom instructions</strong> kan je bijvoorbeeld vragen: "Antwoord voortaan altijd kort en bondig" of "Leg dingen uit alsof ik 14 jaar ben, met concrete voorbeelden."</p>
<p class="cp">Eén keer instellen, en elk volgend gesprek houdt daar automatisch rekening mee — handig als je Copilot regelmatig gebruikt om te studeren.</p>

<h3 class="ch3">🧪 Probeer het uit</h3>
<p class="cp">Stel minstens 1 custom instruction in, en test even of Copilot zich er echt aan houdt in een nieuw gesprek.</p>

<div class="nw">
  <button class="sr-btn b" onclick="p7()">← Vorige</button>
  <button class="sr-btn g" onclick="n7()">Volgende: maak een studiehulp →</button>
  <span class="nh">Stap 5/7</span>
</div>`;
}

function m7s5(c){
  c.innerHTML = `
<div><span class="opt-badge">🎨 Optioneel</span><span class="s-badge">📚 Stap 6 van 7 · Doe-opdracht: maak een studiehulp</span></div>
<h2 class="ch2">Maak een <em>studiehulpmiddel</em></h2>
<p class="cp">Tot slot: gebruik Copilot om iets te maken dat je écht kan helpen bij het studeren. Kies bijvoorbeeld:</p>
<ul style="font-size: 13px; color: #3d4f8a; line-height: 1.8; padding-left: 20px;">
<li>Een korte quiz (5 vragen) over een onderwerp dat je aan het studeren bent</li>
<li>Een samenvatting van een moeilijk hoofdstuk, in je eigen woorden herschreven</li>
<li>Ezelsbruggetjes om iets beter te onthouden</li>
<li>Een overzichtelijk schema van een proces of tijdlijn</li>
</ul>
<p class="cp">Controleer daarna altijd zelf: klopt de inhoud? Mist er iets belangrijks? AI is een startpunt, geen eindpunt.</p>

<h3 class="ch3">✍️ Noteer hieronder wat je maakte</h3>
<textarea class="sr-ta" id="m7study_result" style="min-height:80px;" placeholder="Ik liet Copilot een... maken over... Het hielp mij omdat..."></textarea>

<div class="nw">
  <button class="sr-btn b" onclick="p7()">← Vorige</button>
  <button class="sr-btn g" id="m7study_btn" onclick="sM7Study()">Volgende: afronden →</button>
  <span class="nh">Stap 6/7</span>
</div>`;
  const ta = document.getElementById('m7study_result');
  ta.value = localStorage.getItem('sr_l_m7_study_result') || '';
  ta.oninput = ()=>localStorage.setItem('sr_l_m7_study_result', ta.value);
}

function sM7Study(){
  const v = (document.getElementById('m7study_result').value||'').trim();
  if(v.length < 10){ alert('Vul dit veld in — probeer het écht zelf uit voor je verdergaat!'); return; }
  n7();
}

function m7s6(c){
  c.innerHTML = `
<div><span class="opt-badge">🎨 Optioneel</span><span class="s-badge">🎉 Stap 7 van 7 · Klaar!</span></div>
<h2 class="ch2">Je hebt <em>3 dingen</em> gemaakt!</h2>
<p class="cp">Goed bezig — je hebt zelf een afbeelding, een tekst, en een studiehulpmiddel gemaakt met Copilot. Dat is precies hoe je AI-vaardig wordt: niet door erover te lezen, maar door het zelf te doen.</p>

<div style="background: rgba(127,224,0,0.1); border-radius: 12px; padding: 20px; margin: 16px 0;">
<p style="font-size: 14px; color: #3d4f8a; line-height: 1.9; margin: 0;">
✅ Je logde veilig in met je schoolaccount<br>
✅ Je maakte een AI-gegenereerd beeld<br>
✅ Je schreef een creatieve tekst samen met AI<br>
✅ Je personaliseerde Copilot naar jouw voorkeuren<br>
✅ Je maakte een studiehulpmiddel
</p>
</div>

<div class="ib warn">
  <div class="ib-t">🖼️ Bonustip: kunst als promptbron</div>
  <div class="ib-b">Volgende keer dat je een beeld genereert: bekijk eerst een bestaand schilderij of foto die je mooi vindt, en beschrijf in woorden wat je daaraan opvalt — de kleuren, de compositie, de sfeer. Gebruik die beschrijving als basis voor je prompt. Kunst kijken traint je oog voor detail, en dat maakt je meteen een betere prompter.</div>
</div>

<h3 class="ch3">💭 Nog even nadenken</h3>
<p class="cp">Je liet AI meehelpen bij iets creatiefs (de afbeelding of tekst uit deze module). Vind jij dat dit nog steeds "van jou" is, of verandert AI iets aan wat jij als "eigen werk" beschouwt? Er is geen fout antwoord — het is een vraag waar zelfs professionele kunstenaars vandaag mee worstelen.</p>

<p class="cp">Je kan deze module altijd opnieuw doorlopen om verder te experimenteren — hoe meer je oefent, hoe beter je prompts worden!</p>

<div class="nw">
  <button class="sr-btn b" onclick="p7()">← Vorige</button>
  <button class="sr-btn g" onclick="n7()">✅ Afronden →</button>
  <span class="nh">Stap 7/7</span>
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

function renderDeepfakeCheck(){
  const items = [
    { d:'Een video van een politicus circuleert op sociale media waarin die iets zeer controversieels zegt — gedeeld via een anoniem, pas aangemaakt account, vlak voor verkiezingen.', risk:true, e:'Verdacht: controversiële uitspraak + anoniem account + verdachte timing zijn typische signalen van misbruik via deepfake of nepnieuws.' },
    { d:'Een journalist gebruikt AI om een illustratie te maken bij een artikel over de terugkeer van de otter, en vermeldt duidelijk onderaan dat de afbeelding AI-gegenereerd is.', risk:false, e:'Geen probleem: transparant gebruik van AI als hulpmiddel bij een neutraal onderwerp, met duidelijke bronvermelding.' },
    { d:'Een filmpje toont een bekende YouTuber die een veel te goedkope aanbieding promoot, verspreid via advertenties, terwijl de YouTuber dit nooit zelf plaatste.', risk:true, e:'Dit is exact het patroon van het MrBeast-voorbeeld uit Module 1: een deepfake-advertentie om mensen op te lichten.' },
    { d:'Een leerling gebruikt AI om een screenshot van een historische krant na te maken voor een schoolproject, en zegt er duidelijk bij dat het een AI-gemaakte illustratie is voor het project.', risk:false, e:'Geen probleem: duidelijk gelabeld als schoolproject-illustratie, geen intentie om te misleiden.' }
  ];
  const g = document.getElementById('deepfakecheck');
  if(!g) return;
  items.forEach((it,idx)=>{
    const card = document.createElement('div'); card.className='lm-card';
    card.innerHTML = '<div class="lm-q">'+(idx+1)+'. '+it.d+'</div><div class="lm-opts"><button class="lm-btn" data-v="ja" style="width:auto;padding:0 16px">🚨 Verdacht signaal</button><button class="lm-btn" data-v="nee" style="width:auto;padding:0 16px">✅ Geen probleem</button></div><div class="lm-fb" id="dfcfb'+idx+'"></div>';
    g.appendChild(card);
    card.querySelectorAll('.lm-btn').forEach(b=>{
      b.onclick = ()=>{
        if(card.dataset.done) return;
        card.dataset.done='1';
        const v = b.dataset.v, picked_risk = v==='ja';
        const correct = picked_risk === it.risk;
        card.querySelectorAll('.lm-btn').forEach(bb=>{
          bb.disabled = true;
          const bbRisk = bb.dataset.v==='ja';
          if(bbRisk === it.risk) bb.classList.add('correct');
          else if(bb===b && !correct) bb.classList.add('wrong');
        });
        const fb = document.getElementById('dfcfb'+idx);
        fb.className = 'lm-fb show';
        fb.textContent = (correct?'✅ Juist — ':'❌ Niet helemaal — ')+it.e;
      };
    });
  });
}

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
