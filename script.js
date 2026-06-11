/* ════════════════════════════════════════════
   AI-Cursus Sint-Rembert — script.js (v7)
   M1 Wat is AI (verplicht, 5 stappen)
   M2 Beleid & Leerlingen (verplicht, 5 stappen — incl. AI-bestendig ontwerpen)
   M3 Copilot in de praktijk (OPTIONEEL, 8 stappen — hands-on)
   Certificaat: na M1+M2, slechts 1× downloadbaar
   ════════════════════════════════════════════ */

// ── INSCHRIJFLINK PROFESSIONALISERING (op 1 plek aanpassen) ──
const INSCHRIJF = 'https://VERVANG-DOOR-JULLIE-INSCHRIJFLINK';

// ── STATE (+ migratie van v6) ──
const K = 'sr_ai_v7';
let S = { name:'', mod1:{step:0,done:false}, mod2:{step:0,done:false}, mod3:{step:0,done:false}, certPrinted:false };
function ld(){
  try{
    const s = localStorage.getItem(K);
    if(s){ S = Object.assign(S, JSON.parse(s)); return; }
    const oud = localStorage.getItem('sr_ai_v6');
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
  document.getElementById('nav-mod1').className = S.mod1.done ? 'ni done' : 'ni available';
  document.getElementById('nav-mod2').className = S.mod2.done ? 'ni done' : (S.mod1.done ? 'ni available' : 'ni locked');
  if(S.mod1.done && S.mod2.done){ document.getElementById('nav-cert').className='ni available'; document.getElementById('lc').textContent='›'; }
  if(S.mod1.done) document.getElementById('l1').innerHTML = '<span style="color:var(--green)">✓</span>';
  if(S.mod2.done) document.getElementById('l2').innerHTML = '<span style="color:var(--green)">✓</span>';
  else if(S.mod1.done) document.getElementById('l2').textContent = '›';
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
  if(id==='cert'){ document.getElementById('cert-view').style.display='block'; document.getElementById('nav-cert').classList.add('active'); rc(); document.getElementById('main').scrollTo(0,0); return; }
  document.getElementById('view-'+id).classList.add('active');
  const ni = document.getElementById('nav-'+id); if(ni) ni.classList.add('active');
  document.getElementById('main').scrollTo(0,0);
}
function sm(n){
  if(n===1){ rm1(); sv('mod1'); }
  else if(n===2 && S.mod1.done){ rm2(); sv('mod2'); }
  else if(n===2){ alert('Voltooi eerst module 1.'); }
  else if(n===3){ rm3(); sv('mod3'); }
}
function tm(n){ if(n===2 && S.mod1.done) sm(2); else alert('Voltooi eerst module 1.'); }
function tryC(){ (S.mod1.done && S.mod2.done) ? sv('cert') : alert('Voltooi eerst de 2 verplichte modules (1 en 2).'); }
function rDots(m,tot,cur){
  const c = document.getElementById('sd'+m); if(!c) return; c.innerHTML='';
  for(let i=0;i<tot;i++){
    const d=document.createElement('div');
    d.className='dot '+(i<cur?'done':i===cur?'active':'');
    if(i<cur){ d.style.cursor='pointer'; d.title='Terug naar stap '+(i+1); d.onclick=()=>gotoStep(m,i); }
    c.appendChild(d);
  }
}
function gotoStep(m,i){
  S['mod'+m].step = i; ss();
  if(m===1) rm1(); else if(m===2) rm2(); else rm3();
  document.getElementById('main').scrollTo(0,0);
}
// Voegt in elke stap (behalve de eerste) een "← Vorige stap"-knop toe,
// zodat leerkrachten altijd kunnen terugkeren om iets te herbekijken.
function addPrev(m){
  const step = S['mod'+m].step;
  if(step === 0) return;
  const c = document.getElementById('m'+m+'c');
  let nw = c.querySelector('.nw');
  if(!nw){ nw = document.createElement('div'); nw.className='nw'; c.appendChild(nw); }
  const b = document.createElement('button');
  b.className = 'sr-btn';
  b.style.cssText = 'background:transparent;color:var(--blue);border:2px solid var(--blue)';
  b.textContent = '← Vorige stap';
  b.onclick = ()=>gotoStep(m, step-1);
  nw.insertBefore(b, nw.firstChild);
}

// ── HERBRUIKBARE PROMO ──
function promoMini(tekst){
  return '<div class="promo-mini"><div class="promo-mini-icon">🚀</div><div style="flex:1"><div class="promo-mini-title">Professionaliseringsplan Sint-Rembert</div><div class="promo-mini-desc">'+tekst+'</div></div><a class="promo-mini-btn" href="'+INSCHRIJF+'" target="_blank">Schrijf in</a></div>';
}

// ── CERTIFICAAT: EENMALIGE DOWNLOAD ──
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

/* ════════════════════════════════════════════
   MODULE 1 — WAT IS AI? (5 stappen)
   ════════════════════════════════════════════ */
const m1 = [m1s0, m1s1, m1s2, m1s3, m1s4];
function rm1(){ const c=document.getElementById('m1c'); c.innerHTML=''; rDots(1,m1.length,S.mod1.step); m1[S.mod1.step](c); addPrev(1); }
function n1(){ S.mod1.step++; ss(); S.mod1.step>=m1.length ? d1() : rm1(); document.getElementById('main').scrollTo(0,0); }
function d1(){ S.mod1.done=true; S.mod1.step=0; ss(); up(); rmc(); sv('home'); setTimeout(()=>alert('🎉 Module 1 voltooid! Module 2 is nu beschikbaar.'),300); }

// ── M1 · STAP 1 ──
function m1s0(c){
  c.innerHTML = `
<div class="s-badge">🤖 Stap 1 van 5 · AI overal</div>
<h2 class="ch2">AI is <em>overal</em> — ook al zie je het niet</h2>
<p class="cp">Gezichtsherkenning op je telefoon, de spamfilter in je mailbox, aanbevelingen op YouTube, de routeplanner die files voorspelt — <strong>AI zit al jaren in onze dagelijkse tools</strong>. En sinds de doorbraak van ChatGPT eind 2022 ook steeds nadrukkelijker in het onderwijs: leerlingen gebruiken chatbots voor taken, uitgeverijen bouwen AI in leerplatformen in, en collega's experimenteren met AI voor lesvoorbereiding.</p>
<p class="cp">Maar wat is AI eigenlijk? En wanneer is iets AI, en wanneer niet? Als leerkracht hoef je geen ingenieur te zijn, maar je moet AI wel kunnen <strong>herkennen, benoemen en er verantwoord mee omgaan</strong>. Dat is ook wat artikel 4 van de EU AI Act van organisaties — en dus van ons als school — verwacht: voldoende AI-geletterdheid bij iedereen die met AI werkt.</p>
<p class="cp">In Vlaanderen en Nederland bouwen organisaties zoals het <strong>Kenniscentrum Digisprong</strong> (Vlaamse overheid), het <strong>Kenniscentrum Data & Maatschappij</strong> en <strong>Kennisnet</strong> kaders en materiaal om scholen hierbij te ondersteunen. Deze cursus sluit daar bewust op aan — de bronnen onderaan elke stap verwijzen ernaar.</p>

<div class="ib ok">
  <div class="ib-t">📖 Dit is geen extraatje — het zit in je leerplan</div>
  <div class="ib-b">Goed nieuws voor wie denkt "alweer iets erbij": dat is het niet. <strong>Digitale competentie en mediawijsheid zijn een sleutelcompetentie</strong> in de minimumdoelen en zitten verankerd in de leerplannen die je sowieso realiseert — en kritisch leren omgaan met AI hoort daar vandaag onlosmakelijk bij. Kennisnet werkte dit uit in een kader voor AI-geletterdheid op school (zie bronnen onderaan). Wanneer je met leerlingen over hallucinaties, bias of bronnencontrole werkt, werk je dus letterlijk aan je leerplandoelstellingen — niet alleen aan een Europese verplichting.</div>
</div>

<h3 class="ch3">🎬 Video: Intro Artificiële Intelligentie — EDUbox (VRT NWS)</h3>
<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/yo1g2B5E4W8" allowfullscreen loading="lazy" title="EDUbox AI Intro door Tom Van de Weghe"></iframe></div>
<div class="yt-cap">Tom Van de Weghe (VRT NWS) introduceert AI vanuit Stanford. Deze video komt uit de EDUbox Artificiële intelligentie — een lespakket dat je ook met je leerlingen kan gebruiken.</div>

<div class="ib sr">
  <div class="ib-t">📰 In het nieuws</div>
  <div class="ib-b">VRT NWS volgt AI in het onderwijs op de voet. De artikels hieronder geven je context: waarom dit thema leeft bij leerlingen én waarom scholen zoals Sint-Rembert bewust een beleid voeren.</div>
</div>
<div class="nws-grid">
  <a href="https://www.vrt.be/vrtnws/nl/2024/02/19/onderwijs-artificiele-intelligentie-scholierenkoepel-school-toel/" target="_blank" class="nws-card">
    <div class="nws-src">🔴 VRT NWS</div>
    <div class="nws-title">Scholieren willen AI gebruiken in de klas: "Uit angst verbieden is geen goed idee"</div>
    <div class="nws-desc">De Vlaamse Scholierenkoepel pleit ervoor AI toe te laten als hulpmiddel — en vraagt opleidingen voor leerkrachten. Precies wat je nu volgt.</div>
  </a>
  <a href="https://www.vrt.be/vrtnws/nl/2024/01/30/vrt-lanceert-vernieuwde-edubox-rond-artificiele-intelligentie-vo/" target="_blank" class="nws-card">
    <div class="nws-src">🔴 VRT NWS</div>
    <div class="nws-title">VRT lanceert vernieuwde EDUbox rond AI voor jongeren</div>
    <div class="nws-desc">Interactief lespakket waarmee leerlingen secundair onderwijs AI leren begrijpen én met generatieve AI experimenteren. Gratis te gebruiken in jouw klas.</div>
  </a>
</div>

<h3 class="ch3">🧩 Doe-opdracht: AI of geen AI?</h3>
<p class="cp" style="margin-bottom:14px">Train je eigen AI-herkenning. Klik op elke kaart en ontdek of er AI in zit:</p>
<div id="aig"></div>

<div class="ib sr">
  <div class="ib-t">💡 De 3 bouwstenen van AI</div>
  <div class="ib-b">Elke AI heeft <strong>data</strong> (trainingsmateriaal), <strong>algoritmes</strong> (wiskundige instructies die patronen leren herkennen) en <strong>rekenkracht</strong>. Hoe meer kwalitatieve data, hoe beter het systeem — maar ook: hoe meer vooroordelen die data bevat, hoe meer die doorsijpelen in de output. Onthoud dit, het komt terug in stap 3.</div>
</div>

<div class="cop-oef">
  <div class="cop-title">⊕ Mini-opdracht voor vandaag</div>
  <div class="cop-steps">
    <div class="cop-step"><div class="cop-step-n">1</div>Noteer <strong>3 momenten van vandaag</strong> waarop jij (waarschijnlijk onbewust) AI gebruikte.</div>
    <div class="cop-step"><div class="cop-step-n">2</div>Vraag het morgen ook eens aan je leerlingen als lesopener — je zal verbaasd zijn hoeveel ze er vinden. Een ideaal vertrekpunt voor een klasgesprek over AI.</div>
  </div>
</div>

<div class="bronnen-box">
  <div class="bronnen-title">📚 Bronnen & verdieping</div>
  <div class="bron-row">
    <a href="https://www.vrt.be/vrtnws/nl/2019/09/17/artificiele-intelligentie/" target="_blank" class="bron-tag">EDUbox AI (VRT NWS)</a>
    <a href="https://www.kennisnet.nl/artificial-intelligence/werken-aan-ai-geletterdheid-op-school/" target="_blank" class="bron-tag">Kennisnet: AI-geletterdheid op school</a>
    <a href="https://onderwijs.vlaanderen.be" target="_blank" class="bron-tag">Kenniscentrum Digisprong (Vlaanderen)</a>
    <a href="https://data-en-maatschappij.ai" target="_blank" class="bron-tag">Kenniscentrum Data & Maatschappij</a>
  </div>
</div>

<div class="nw">
  <button class="sr-btn g" onclick="n1()">Volgende: van regels naar GenAI →</button>
  <span class="nh">Stap 1/5</span>
</div>`;
  const items = [
    {n:'Spamfilter e-mail', ai:true,  w:'Leert zelf welke mails spam zijn (machine learning)'},
    {n:'Rekenmachine', ai:false, w:'Volgt vaste regels, leert niets bij'},
    {n:'TikTok-aanbevelingen', ai:true, w:'Algoritme leert jouw voorkeuren uit kijkgedrag'},
    {n:'Kladblok / Notepad', ai:false, w:'Slaat enkel op, geen leren'},
    {n:'Tumor herkennen op scan', ai:true, w:'Deep learning herkent patronen op medische beelden'},
    {n:'Smartschool (basisplatform)', ai:false, w:'Platform; in de kern geen zelflerend systeem'},
    {n:'Copilot M365', ai:true, w:'Generatieve AI op basis van een groot taalmodel (LLM)'},
    {n:'GPS met file-voorspelling', ai:true, w:'Voorspelt reistijden uit realtime data'},
    {n:'Wekker zetten', ai:false, w:'Vaste instructie, geen leren'},
  ];
  const g = document.getElementById('aig');
  items.forEach(it=>{
    const el = document.createElement('div');
    el.className = 'ai-card';
    el.innerHTML = '<div style="font-size:20px;margin-bottom:7px">❓</div><div>'+it.n+'</div><div style="color:var(--muted);font-size:10px;margin-top:4px">Klik om te ontdekken</div>';
    el.onclick = ()=>{
      el.style.borderColor = it.ai ? 'var(--green)' : 'var(--orange)';
      el.style.background = it.ai ? 'rgba(127,224,0,.1)' : 'rgba(249,115,22,.08)';
      el.innerHTML = '<div style="font-size:20px;margin-bottom:7px">'+(it.ai?'🤖':'⬜')+'</div><div style="font-weight:800;color:'+(it.ai?'var(--blue)':'var(--orange)')+'">'+it.n+'</div><div style="font-size:10px;font-weight:600;margin-top:4px;color:'+(it.ai?'var(--blue)':'var(--orange)')+'">'+it.w+'</div>';
    };
    g.appendChild(el);
  });
}

// ── M1 · STAP 2 ──
function m1s1(c){
  c.innerHTML = `
<div class="s-badge">📚 Stap 2 van 5 · Geschiedenis & GenAI</div>
<h2 class="ch2">Van schaakcomputers naar <em>Generatieve AI</em></h2>
<p class="cp">AI bestaat al sinds de jaren 50 — maar de sprong naar <strong>generatieve AI</strong> (GenAI) die tekst, beeld, audio en code kan <em>maken</em>, verandert alles. ChatGPT haalde na de lancering eind 2022 in twee maanden 100 miljoen gebruikers — sneller dan eender welke consumententechnologie ervoor. Dat is de wereld waarin onze leerlingen opgroeien.</p>
<p class="cp">Het cruciale verschil voor jou als leerkracht: vroegere AI kon enkel <strong>classificeren of voorspellen</strong> (is dit spam? welk filmpje vind jij leuk?). Generatieve AI kan iets <strong>nieuws creëren</strong> — en doet dat zo vlot dat de output vaak niet te onderscheiden is van menselijk werk. Dat raakt rechtstreeks aan hoe wij taken geven, evalueren en leerlingen laten leren.</p>

<div class="grid3">
  <div class="wcard"><div class="wc-j">1950–1980</div><div class="wc-t">Procedurele AI</div><div class="wc-d">Regels en logica, door mensen geprogrammeerd. Denk aan schaakcomputers. Leert niets bij: alles wat het kan, werd expliciet ingebouwd.</div></div>
  <div class="wcard"><div class="wc-j">1980–2010</div><div class="wc-t">Machine Learning</div><div class="wc-d">De machine leert zelf patronen uit data: spamfilters, aanbevelingen, fraudedetectie. Geen creatie, wel herkenning en voorspelling.</div></div>
  <div class="wcard"><div class="wc-j">2010–nu</div><div class="wc-t">Deep Learning & GenAI</div><div class="wc-d">Neurale netwerken, geïnspireerd op het brein. Kan nu ook créëren: tekst, beeld, audio, code. ChatGPT, Copilot, Gemini, Midjourney.</div></div>
</div>

<h3 class="ch3">🎬 Video: Voorbeelden van generatieve AI — EDUbox (VRT NWS)</h3>
<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/AQbjsikO3O4" allowfullscreen loading="lazy" title="EDUbox: voorbeelden van generatieve AI door Michiel Vaes"></iframe></div>
<div class="yt-cap">Michiel Vaes toont concrete voorbeelden van wat generatieve AI vandaag kan — uit de vernieuwde EDUbox AI (2024).</div>

<div class="ib warn">
  <div class="ib-t">⚠️ Hallucinaties — het belangrijkste begrip van deze module</div>
  <div class="ib-b">GenAI werkt met <strong>kansberekening</strong>: het voorspelt telkens het meest waarschijnlijke volgende woord. Daardoor klinkt de output altijd zelfverzekerd — óók als ze fout is. Dat noemen we een <strong>hallucinatie</strong>: verzonnen informatie die er betrouwbaar uitziet. Bronvermeldingen, jaartallen, namen, studies: ze kunnen volledig verzonnen zijn. <strong>Controleer dus altijd via betrouwbare bronnen</strong> — en leer je leerlingen hetzelfde.</div>
</div>

<div class="grid2">
  <div class="box-bad">
    <div class="box-h-bad">❌ Hallucinatie 1: de verzonnen studie</div>
    <div class="box-body" style="font-style:italic">"Volgens een studie van prof. K. Van Damme (UGent, 2021) verdubbelt AI-gebruik de leerresultaten van leerlingen in het secundair onderwijs."<br><br><span style="color:var(--red);font-size:11px">→ Klinkt academisch, is volledig verzonnen. Zo'n studie bestaat niet.</span></div>
  </div>
  <div class="box-bad">
    <div class="box-h-bad">❌ Hallucinatie 2: de perfecte uitleg met de foute som</div>
    <div class="box-body" style="font-style:italic">"We lossen 2x² + 5x + 3 = 0 op met de discriminant: D = b² − 4ac = 5² − 4·2·3 = 25 − 24 = <strong>2</strong>, dus √D = √2..."<br><br><span style="color:var(--red);font-size:11px">→ De theorie en de formule kloppen perfect — maar 25 − 24 is natuurlijk 1, geen 2. Een taalmodel voorspelt tekens, het <strong>rekent niet écht</strong>. Net omdat de uitleg errond foutloos oogt, glipt zo'n fout zó een lesvoorbereiding of correctiesleutel binnen.</span></div>
  </div>
</div>

<div class="ib ok">
  <div class="ib-t">✅ Daarom: de leerkracht als "human in the loop"</div>
  <div class="ib-b">Het gevaar van hallucinaties is niet dat AI "domme" fouten maakt, maar dat ze <strong>gevaarlijk overtuigende</strong> fouten maakt: een jaartal dat er net tien jaar naast zit, een rekenstap die fout loopt midden in een verder vlekkeloze uitwerking, een bron die niet bestaat. AI-tools klinken altijd even zeker, of ze nu juist of fout zitten. Jij bent het kritische filter — jouw vakkennis is precies wat AI niet kan vervangen. Check feiten, sommen, studies, namen en datums vooraleer je AI-output gebruikt in lesmateriaal, communicatie of evaluatie. Dat is exact de geletterdheid die de EU AI Act bedoelt.</div>
</div>

<div class="nws-grid">
  <a href="https://www.vrt.be/vrtnws/nl/2025/12/29/kan-ai-helpen-met-studeren-dit-zeggen-experts/" target="_blank" class="nws-card">
    <div class="nws-src">🔴 VRT NWS</div>
    <div class="nws-title">Studeer je beter met AI? "Het neemt zoveel mogelijk denkwerk over"</div>
    <div class="nws-desc">Vier op vijf studenten gebruikt AI bij het studeren. Onderzoekers waarschuwen voor "mentale luiheid" — relevant voor hoe jij taken ontwerpt.</div>
  </a>
  <a href="https://www.vrt.be/vrtnws/nl/2023/01/23/opinie-chatgpt/" target="_blank" class="nws-card">
    <div class="nws-src">🔴 VRT NWS</div>
    <div class="nws-title">ChatGPT verovert het klaslokaal: waarom leerkrachten de tool moeten omarmen</div>
    <div class="nws-desc">Opinie van het Kenniscentrum Data & Maatschappij: verbieden werkt niet — leer leerlingen er kritisch mee omgaan.</div>
  </a>
</div>

<div class="cop-oef">
  <div class="cop-title">⊕ Doe-opdracht: betrap de AI op een fout</div>
  <div class="cop-steps">
    <div class="cop-step"><div class="cop-step-n">1</div>Open Copilot met je schoolaccount en vraag een korte tekst over <strong>een onderwerp uit jouw vak waar jij expert in bent</strong>.</div>
    <div class="cop-step"><div class="cop-step-n">2</div>Lees de output als examinator: <strong>vind minstens één onnauwkeurigheid, vereenvoudiging of fout</strong>. (Lukt dat niet? Vraag dan om bronnen en controleer of die echt bestaan.)</div>
    <div class="cop-step"><div class="cop-step-n">3</div>Bewaar dit voorbeeld — het is goud waard als demonstratie in je klas over kritisch omgaan met AI.</div>
  </div>
</div>

<div class="bronnen-box">
  <div class="bronnen-title">📚 Bronnen & verdieping</div>
  <div class="bron-row">
    <a href="https://www.kennisnet.nl" target="_blank" class="bron-tag">Kennisnet</a>
    <a href="https://www.klasse.be" target="_blank" class="bron-tag">Klasse</a>
    <a href="https://data-en-maatschappij.ai/tags/onderwijs" target="_blank" class="bron-tag">Data & Maatschappij: onderwijs</a>
  </div>
</div>

<div class="nw">
  <button class="sr-btn g" onclick="n1()">Volgende: kansen & gevaren →</button>
  <span class="nh">Stap 2/5</span>
</div>`;
}

// ── M1 · STAP 3 (ethiek & bias + promo Agirdag) ──
function m1s2(c){
  c.innerHTML = `
<div class="s-badge">⚠️ Stap 3 van 5 · Kansen & gevaren</div>
<h2 class="ch2">Mogelijkheden én <em>gevaren</em> van GenAI</h2>
<p class="cp">GenAI biedt enorme kansen voor je lespraktijk — maar ook concrete risico's die je moet kennen om zelf verantwoord te werken én om leerlingen goed te begeleiden. Leerkrachten die de beperkingen van AI begrijpen, zetten de tools doorgaans gerichter en kritischer in dan wie er "gewoon aan begint". Daarom eerst dit overzicht, daarna ga je zelf aan de slag.</p>

<div class="grid2">
  <div class="pane-ok lijst-ok">
    <div class="lijst-h-ok">✅ Kansen voor leerkrachten</div>
    <div>→ Snellere lesvoorbereiding en differentiatiemateriaal</div>
    <div>→ Feedback formuleren op geanonimiseerde leerlingteksten</div>
    <div>→ Administratieve last verlagen (verslagen, mails, planningen)</div>
    <div>→ Creatieve werkvormen en oefeningen op maat genereren</div>
    <div>→ Leerstof herformuleren op verschillende niveaus</div>
    <div>→ Rubrics, quizvragen en exit-tickets sneller opstellen</div>
  </div>
  <div class="pane-nok lijst-nok">
    <div class="lijst-h-nok">⚠️ Gevaren om te kennen</div>
    <div>→ Hallucinaties: overtuigende maar foute informatie</div>
    <div>→ Bias: stereotypen uit trainingsdata in de output</div>
    <div>→ Deepfakes: nep-foto, -video en -audio van echte personen</div>
    <div>→ Auteursrecht en plagiaat bij gegenereerde content</div>
    <div>→ Privacyrisico bij invoer van persoonsgegevens</div>
    <div>→ Energieverbruik en klimaatimpact van grote modellen</div>
  </div>
</div>

<h3 class="ch3">🎬 Video: Ethiek & Bias — EDUbox (VRT NWS)</h3>
<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/Yft4D4TdPxQ" allowfullscreen loading="lazy" title="EDUbox: Ethiek en Bias met An Jacobs"></iframe></div>
<div class="yt-cap">An Jacobs (imec/VUB) over de ethische kant van AI en hoe vooroordelen in systemen sluipen.</div>

<div class="ib warn">
  <div class="ib-t">🎲 Bias — een krachtig leermoment voor jouw klas</div>
  <div class="ib-b">Vraag een beeldgenerator om <em>"een CEO"</em> — grote kans op een witte man in pak. Vraag <em>"een verpleegkundige"</em> — vrijwel zeker een vrouw. De AI reproduceert de stereotypen uit zijn trainingsdata. Wijs je leerlingen hier <strong>expliciet</strong> op: het is een van de sterkste mediawijsheidsmomenten die je gratis in handen hebt. Laat hen zelf voorbeelden zoeken en bespreken waarom dit gebeurt (denk terug aan de 3 bouwstenen: data!).</div>
</div>

${promoMini('Wil je dieper graven in de <strong style="color:white">ethische kant van AI</strong> — gelijke kansen, bias en wat AI doet met de kern van ons onderwijs? Op <strong style="color:white">18 november</strong> verwelkomen we <strong style="color:white">prof. Orhan Agirdag</strong> (KU Leuven, onderwijswetenschappen) als keynotespreker. Plaatsen zijn beperkt.')}

<div class="ib tip">
  <div class="ib-t">🌍 Ook dit is AI-geletterdheid: de ecologische voetafdruk</div>
  <div class="ib-b">Grote AI-modellen trainen en draaien kost véél energie en water. In de EDUbox-reeks legt AI-experte Mieke De Ketelaere dit helder uit — een mooi thema voor vakoverschrijdend werken (STEM, aardrijkskunde, burgerschap). Zoek in de EDUbox-playlist de video "Energieverbruik van AI".</div>
</div>

<h3 class="ch3">🧩 Doe-opdracht: echt of AI-gegenereerd?</h3>
<p class="cp" style="margin-bottom:14px">Leerlingen vragen zich af of jij het verschil ziet. Test jezelf — klik je antwoord per fragment:</p>
<div id="roa"></div>

<div class="bronnen-box">
  <div class="bronnen-title">📚 Bronnen & verdieping</div>
  <div class="bron-row">
    <a href="https://mediawijs.be" target="_blank" class="bron-tag">Mediawijs</a>
    <a href="https://data-en-maatschappij.ai" target="_blank" class="bron-tag">Kenniscentrum Data & Maatschappij</a>
    <a href="https://www.robbewulgaert.be/onderwijs/ai-in-de-klas-waarom-en-hoe" target="_blank" class="bron-tag">AI in de klas: waarom en hoe? (gastblog)</a>
  </div>
</div>

<div class="nw">
  <button class="sr-btn g" onclick="n1()">Volgende: kennischeck →</button>
  <span class="nh">Stap 3/5</span>
</div>`;
  const items = [
    {t:'"De vliegtuigen vlogen in formatie over de wolken van vergeten steden, hun motoren een zacht gebrom van de moderniteit."', ai:true, e:'Poëtisch maar vaag, generieke beeldspraak zonder concrete ervaring — typische LLM-stijl.'},
    {t:'"Ik schreef dit voor mijn dochter op haar zestiende. Ze hield van katten, slechte moppen en de geur van regen op warm asfalt."', ai:false, e:'Specifieke zintuiglijke details en persoonlijke binding — kenmerkend menselijk.'},
    {t:'"Kwantumverstrengeling is een fenomeen waarbij twee deeltjes instantaan gecorreleerd zijn, ongeacht de afstand die hen scheidt."', ai:true, e:'Gladde encyclopediestijl zonder eigen perspectief — klassiek patroon van gegenereerde tekst. (Let op: een mens kán dit ook schrijven — AI-detectie op stijl alleen is nooit waterdicht!)'},
    {t:'"Mijn oma maakte soep met wat overbleef. Ik ben vergeten haar recept op te schrijven. Nu is het weg."', ai:false, e:'Spijt, vergankelijkheid, een concrete situatie met rafelranden — echte menselijke emotie.'},
  ];
  const con = document.getElementById('roa');
  items.forEach((it,i)=>{
    const el = document.createElement('div');
    el.style.cssText = 'background:white;border:2px solid var(--gray);border-radius:10px;padding:18px;margin-bottom:10px';
    el.innerHTML = '<div style="font-size:13px;font-style:italic;color:#3d4f8a;margin-bottom:12px;background:var(--off);padding:11px;border-radius:7px;line-height:1.7;border-left:3px solid var(--blue)">'+it.t+'</div>'
      + '<div style="display:flex;gap:10px">'
      + '<button class="roa-btn" data-i="'+i+'" data-g="1" style="flex:1;background:rgba(10,31,168,.08);border:2px solid rgba(10,31,168,.2);color:var(--blue);border-radius:7px;padding:10px;cursor:pointer;font-family:\'Archivo Black\',sans-serif;font-size:11px;text-transform:uppercase">🤖 AI-gegenereerd</button>'
      + '<button class="roa-btn" data-i="'+i+'" data-g="0" style="flex:1;background:rgba(127,224,0,.1);border:2px solid rgba(127,224,0,.3);color:var(--blue);border-radius:7px;padding:10px;cursor:pointer;font-family:\'Archivo Black\',sans-serif;font-size:11px;text-transform:uppercase">👤 Door een mens</button>'
      + '</div><div id="roa-fb-'+i+'" style="display:none;margin-top:9px;padding:9px 13px;border-radius:7px;font-size:12px;font-weight:700;line-height:1.5"></div>';
    con.appendChild(el);
  });
  con.querySelectorAll('.roa-btn').forEach(b=>{
    b.onclick = ()=>{
      const i = +b.dataset.i, g = b.dataset.g==='1', it = items[i], ok = g===it.ai;
      const fb = document.getElementById('roa-fb-'+i);
      fb.style.display='block';
      fb.style.background = ok?'rgba(127,224,0,.15)':'rgba(224,32,32,.07)';
      fb.style.color = ok?'#2d6a00':'var(--red)';
      fb.style.border = '2px solid '+(ok?'var(--green)':'var(--red)');
      fb.textContent = (ok?'✅ Correct! ':'❌ Niet correct. ')+it.e;
      b.parentElement.querySelectorAll('button').forEach(x=>x.disabled=true);
    };
  });
}

// ── M1 · STAP 4: quiz ──
function m1s3(c){
  const quiz = [
    {q:'Wat is een hallucinatie bij generatieve AI?', o:['De AI geeft eerlijk aan dat ze het antwoord niet zeker weet','De AI genereert overtuigende maar foute informatie, zonder enig signaal van twijfel','De AI kopieert letterlijk een foute bron die ze op het internet vond','De AI weigert te antwoorden omdat de vraag te moeilijk is'], a:1, f:'Dát is net het verraderlijke: er is geen twijfelsignaal en er is geen "foute bron" die je kan traceren — het model construeert zélf plausibel klinkende onzin via kansberekening. Daarom: altijd verifiëren.'},
    {q:'Welke AI-tool is binnen Sint-Rembert volledig ondersteund en dataproof?', o:['ChatGPT (gratis versie)','Google Gemini','Copilot M365 met schoolaccount','Midjourney'], a:2, f:'Copilot M365 via je schoolaccount valt onder de schoolovereenkomst met gegevensbescherming. Andere tools mogen nooit persoonsgegevens of schooldocumenten krijgen.'},
    {q:'Wat is de grote sprong van generatieve AI t.o.v. eerdere AI?', o:['Ze begrijpt taal nu écht, zoals een mens dat doet','Ze kan nieuwe content creëren (tekst, beeld, audio, code)','Ze zoekt voortaan alles live op het internet op in plaats van te gokken','Ze haalt haar antwoorden uit een gecontroleerde databank van feiten'], a:1, f:'GenAI creëert — maar "begrijpt" niet zoals een mens, zoekt niet standaard alles live op en put niet uit een gecontroleerde feitendatabank. Het blijft kansberekening op patronen, en net daarom blijven hallucinaties bestaan.'},
    {q:'Waarom is bias in AI relevant voor jouw lespraktijk?', o:['AI is altijd neutraal, dus niet relevant','AI reproduceert stereotypen uit trainingsdata — een mediawijsheidsthema voor de klas','Bias komt enkel voor in betalende tools','Bias maakt AI enkel trager'], a:1, f:'AI leert van data vol menselijke vooroordelen. Dit expliciet bespreken met leerlingen is een van de waardevolste AI-lessen die je kan geven.'},
    {q:'Een AI-tekst vermeldt een wetenschappelijke studie met auteur en jaartal. Wat doe je?', o:['Overnemen — met bron is het betrouwbaar','De bron zelf opzoeken en controleren of die echt bestaat','Enkel het jaartal controleren','Aan de AI vragen of de bron klopt'], a:1, f:'Verzonnen bronvermeldingen zijn een klassieke hallucinatie. Zelf verifiëren via betrouwbare kanalen is de enige juiste reflex — aan de AI zelf vragen is niet betrouwbaar.'},
  ];
  rQuiz(c, quiz, 1, 'mod1', n1, 60);
}

// ── M1 · STAP 5: reflectie ──
function m1s4(c){
  c.innerHTML = `
<div class="s-badge">✍️ Stap 5 van 5 · Vertaalslag naar jouw vak</div>
<h2 class="ch2">Vertaal naar <em>jouw lespraktijk</em></h2>
<p class="cp">Je weet nu wat AI is, hoe generatieve AI werkt en waar de risico's zitten. Kennis wordt pas waardevol als je ze <strong>vertaalt naar je eigen klas</strong>. De kernvraag is niet "gebruik ik AI of niet?", maar: <strong>op welk moment voegt AI écht iets toe aan mijn onderwijs — en wanneer net niet?</strong></p>
<p class="cp">Leerkrachten die dit vooraf voor zichzelf scherpstellen, staan veel sterker in gesprekken met leerlingen over verantwoord gebruik. Bovendien is jouw antwoord op deze vraag straks de basis voor het AI-label dat je aan taken koppelt (module 2).</p>

<div class="cop-oef">
  <div class="cop-title">⊕ Reflectie-opdracht — verplicht onderdeel</div>
  <div class="cop-steps">
    <div class="cop-step"><div class="cop-step-n">1</div>Denk aan een <strong>recente les</strong> die je gaf. Wat deed je, wat waren de leerdoelen?</div>
    <div class="cop-step"><div class="cop-step-n">2</div>Waar had AI <strong>meerwaarde</strong> kunnen hebben — bij de voorbereiding, de uitvoering of de evaluatie? Of net nergens?</div>
    <div class="cop-step"><div class="cop-step-n">3</div>Benoem <strong>één concrete situatie in jouw vak waar je AI zou uitsluiten</strong> — en waarom. (Tip: denk aan wat de leerling zélf moet kunnen aantonen.)</div>
  </div>
</div>

<p class="cp" style="margin-bottom:10px"><strong>Noteer je reflectie hieronder:</strong></p>
<textarea class="sr-ta" id="r1" placeholder="Ik denk aan mijn les [vak/leerjaar]...&#10;AI zou meerwaarde hebben bij...&#10;AI zou ik uitsluiten bij... omdat..."></textarea>
<div style="font-size:11px;color:var(--muted);font-weight:600;margin-top:5px">Wordt lokaal opgeslagen in je browser — niet gedeeld.</div>

<div class="ib ok">
  <div class="ib-t">✅ Klaar voor module 2</div>
  <div class="ib-b">In module 2 leer je het AI-beleid van Sint-Rembert kennen — de 5 AI-labels, de transparantieregels, hoe je leerlingen begeleidt én hoe je je eigen opdrachten AI-bestendig maakt. Jouw reflectie van zonet komt daar meteen van pas.</div>
</div>

<div class="nw">
  <button class="sr-btn g" id="r1btn" onclick="sR1()">✅ Module 1 afronden →</button>
  <span class="nh">Module 2 wordt vrijgegeven</span>
</div>`;
  const ta = document.getElementById('r1');
  ta.value = localStorage.getItem('sr_r1') || '';
  ta.oninput = ()=>localStorage.setItem('sr_r1', ta.value);
}
function sR1(){
  const v = (document.getElementById('r1').value||'').trim();
  if(v.length < 100){ alert('Neem nog even de tijd voor je reflectie (een paar volwaardige zinnen). Net dat stilstaan bij je eigen lespraktijk is het hele punt van deze stap. 😉'); return; }
  n1();
}

/* ════════════════════════════════════════════
   MODULE 2 — BELEID & LEERLINGEN (5 stappen)
   ════════════════════════════════════════════ */
const m2 = [m2s0, m2s1, m2s2, m2s3, m2s4];
function rm2(){ const c=document.getElementById('m2c'); c.innerHTML=''; rDots(2,m2.length,S.mod2.step); m2[S.mod2.step](c); addPrev(2); }
function n2(){ S.mod2.step++; ss(); S.mod2.step>=m2.length ? d2() : rm2(); document.getElementById('main').scrollTo(0,0); }
function d2(){ S.mod2.done=true; S.mod2.step=0; ss(); up(); rmc(); sv('cert'); }

// ── M2 · STAP 1: spelregels, labels, AI Act ──
function m2s0(c){
  c.innerHTML = `
<div class="s-badge">🛡️ Stap 1 van 5 · Spelregels & AI-labels</div>
<h2 class="ch2">Het AI-beleid van <em>Sint-Rembert</em></h2>
<p class="cp">Een helder AI-beleid beschermt iedereen: leerlingen weten waar ze aan toe zijn, jij kan consequent evalueren, en de school voldoet aan haar wettelijke verplichtingen. Sint-Rembert werkt daarvoor met <strong>5 AI-labels</strong> die je aan elke taak of toets koppelt. Geen label = onduidelijkheid = discussie. Wees dus duidelijk, wees consistent, wees het rolmodel.</p>

<h3 class="ch3">De 5 AI-labels</h3>
<div class="labels-grid">
  <div class="label-card l1"><div class="lc-num">1</div><div class="lc-name">Geen AI</div><div class="lc-desc">AI volledig verboden. De leerling werkt zelfstandig.</div></div>
  <div class="label-card l2"><div class="lc-num">2</div><div class="lc-name">Ideeën & structuur</div><div class="lc-desc">Enkel brainstorm en structuur. Inhoud van de leerling zelf.</div></div>
  <div class="label-card l3"><div class="lc-num">3</div><div class="lc-name">AI-bewerking</div><div class="lc-desc">Eigen werk bewerken, verbeteren, preciseren. Niet het schrijven zelf.</div></div>
  <div class="label-card l4"><div class="lc-num">4</div><div class="lc-name">AI + menselijke aanvulling</div><div class="lc-desc">AI-output kritisch verwerken en aanvullen. Actieve inbreng vereist.</div></div>
  <div class="label-card l5"><div class="lc-num">5</div><div class="lc-name">AI vrij</div><div class="lc-desc">AI vrij toegelaten. Transparantie blijft verplicht.</div></div>
</div>

<div class="ib sr">
  <div class="ib-t">🎯 Drie basisprincipes voor leerlingen (alle labels)</div>
  <div class="ib-b"><strong>1.</strong> De leerling blijft volledig verantwoordelijk voor het ingediende werk — ook als AI eraan meeschreef.<br><strong>2.</strong> Het werkstuk moet ondubbelzinnig aantonen dat de leerling de beoogde competenties verworven heeft.<br><strong>3.</strong> <strong>Transparantie is altijd verplicht:</strong> leerlingen noteren welke AI-middelen ze gebruikten en hoe (zie bundel onderzoeksvaardigheden).</div>
</div>

<h3 class="ch3">⚖️ De EU AI Act — wat betekent die voor jou?</h3>
<p class="cp">De EU AI Act is de eerste grote AI-wet ter wereld. <strong>Artikel 4</strong> (van toepassing sinds 2 februari 2025) verwacht van organisaties die AI gebruiken — dus ook scholen — dat hun personeel over voldoende <strong>AI-geletterdheid</strong> beschikt. Concreet: je hoeft geen jurist of programmeur te zijn, maar je moet begrijpen wat AI is, wat de risico's zijn en hoe je er in jouw professionele context verantwoord mee omgaat.</p>
<p class="cp">De wet deelt AI-toepassingen ook in volgens risico: van verboden praktijken (zoals sociale scoring) over hoog-risico (bv. AI die examenresultaten beoordeelt!) tot minimaal risico. Goed om te weten: <strong>AI die leerlingen evalueert of toelating bepaalt, geldt als hoog-risico</strong> — nog een reden waarom de eindverantwoordelijkheid voor evaluatie altijd bij jou als leerkracht blijft, nooit bij een tool. Het Kenniscentrum Data & Maatschappij biedt een gratis online tool om de impact van de AI Act op een toepassing in te schatten.</p>

<h3 class="ch3">🎬 Videoreeks: EDUbox Artificiële intelligentie (VRT NWS)</h3>
<div class="yt-wrap"><iframe src="https://www.youtube.com/embed/videoseries?list=PL1zloQd6C9_x_AiCofL-d_t4GuXtcKgBF" allowfullscreen loading="lazy" title="EDUbox AI volledige videoreeks"></iframe></div>
<div class="yt-cap">De volledige EDUbox-videoreeks. Handig voor jezelf én rechtstreeks bruikbaar als lesmateriaal — de bijbehorende lesbundel is gratis via VRT NWS.</div>

<div class="nws-grid">
  <a href="https://www.vrt.be/vrtnws/nl/2023/02/02/hoe-omgaan-met-chatgtp-in-het-onderwijs-gemeenschapsonderwijs-h/" target="_blank" class="nws-card">
    <div class="nws-src">🔴 VRT NWS</div>
    <div class="nws-title">Hoe omgaan met ChatGPT in het onderwijs? GO! maakte een handleiding</div>
    <div class="nws-desc">Hoe een andere onderwijskoepel haar AI-beleid opbouwde: informatieveiligheid, didactisch gebruik en schoolafspraken.</div>
  </a>
  <a href="https://www.vrt.be/vrtnws/nl/2026/03/30/heeft-huiswerk-nog-zin-in-tijden-van-artificiele-intelligentie/" target="_blank" class="nws-card">
    <div class="nws-src">🔴 VRT NWS</div>
    <div class="nws-title">Leraren worstelen met huiswerk door AI</div>
    <div class="nws-desc">Leerkrachten geven minder of ander huiswerk door AI. Experts: kijk naar het leerproces in plaats van enkel het eindproduct — precies waar de AI-labels je bij helpen.</div>
  </a>
</div>

<div class="cop-oef">
  <div class="cop-title">⊕ Doe-opdracht: label je volgende taak</div>
  <div class="cop-steps">
    <div class="cop-step"><div class="cop-step-n">1</div>Neem de <strong>eerstvolgende taak</strong> die je aan een klas geeft in gedachten.</div>
    <div class="cop-step"><div class="cop-step-n">2</div>Kies bewust een van de 5 labels. Vraag jezelf: <em>welke competentie moet deze taak aantonen, en verstoort AI dat bewijs?</em></div>
    <div class="cop-step"><div class="cop-step-n">3</div>Communiceer het label expliciet bij de opdracht — op papier, in Smartschool of op het bord. Hou deze taak bij de hand: in stap 3 ga je ze AI-bestendig maken.</div>
  </div>
</div>

<div class="bronnen-box">
  <div class="bronnen-title">📚 Bronnen & verdieping</div>
  <div class="bron-row">
    <a href="https://data-en-maatschappij.ai" target="_blank" class="bron-tag">Data & Maatschappij: AI Act-tool</a>
    <a href="https://onderwijs.vlaanderen.be" target="_blank" class="bron-tag">Kenniscentrum Digisprong (Vlaanderen)</a>
    <a href="https://www.kennisnet.nl/artificial-intelligence/werken-aan-ai-geletterdheid-op-school/" target="_blank" class="bron-tag">Kennisnet: AI-geletterdheid op school</a>
  </div>
</div>

<div class="nw">
  <button class="sr-btn g" onclick="n2()">Volgende: leerlingen begeleiden →</button>
  <span class="nh">Stap 1/5</span>
</div>`;
}

// ── M2 · STAP 2: leerlingen begeleiden ──
function m2s1(c){
  c.innerHTML = `
<div class="s-badge">🧑‍🏫 Stap 2 van 5 · Leerlingen begeleiden</div>
<h2 class="ch2">Zo begeleid je <em>leerlingen</em> bij AI</h2>
<p class="cp">Leerlingen gebruiken AI — met of zonder jouw toestemming. De vraag is dus niet óf je ermee aan de slag gaat, maar <strong>hoe je hen leert er verstandig mee om te gaan</strong>. De Vlaamse Scholierenkoepel vraagt het zelf: laat AI toe als hulpmiddel en leer ons er verantwoord mee werken. Verbieden uit angst werkt niet; begeleiden met duidelijke kaders wél.</p>
<p class="cp">Dit is geen extra vak erbij, maar een houding die je in je bestaande lessen verweeft. Zes concrete rollen die jij als leerkracht opneemt:</p>

<div class="ll-grid">
  <div class="ll-card"><div class="ll-icon">🔍</div><div class="ll-title">Transparantie vragen</div><div class="ll-desc">Maak "welke AI gebruikte je en hoe?" een standaardvraag bij elke indiening — ook bij label 5. Zo wordt eerlijkheid de norm, geen biecht.</div></div>
  <div class="ll-card"><div class="ll-icon">🤔</div><div class="ll-title">Kritisch denken trainen</div><div class="ll-desc">Laat leerlingen AI-output analyseren, fouten zoeken en verbeteren in plaats van overnemen. AI-output corrigeren is een leeractiviteit op zich.</div></div>
  <div class="ll-card"><div class="ll-icon">⚖️</div><div class="ll-title">Eerlijkheid bespreken</div><div class="ll-desc">Bespreek open: wanneer is AI-hulp zoals een woordenboek, en wanneer is het fraude? Het verschil zit in welke competentie de taak moet aantonen.</div></div>
  <div class="ll-card"><div class="ll-icon">🎭</div><div class="ll-title">Rolmodel zijn</div><div class="ll-desc">Wees transparant wanneer jij AI gebruikte bij lesvoorbereiding. Dat normaliseert verantwoord gebruik en maakt je geloofwaardig.</div></div>
  <div class="ll-card"><div class="ll-icon">🛡️</div><div class="ll-title">Privacy bewaken</div><div class="ll-desc">Leer leerlingen nooit persoonsgegevens (van zichzelf of anderen) in AI-tools in te voeren. Geen namen, adressen, foto's of resultaten.</div></div>
  <div class="ll-card"><div class="ll-icon">🌱</div><div class="ll-title">Proces boven product</div><div class="ll-desc">Evalueer vaker het leerproces: tussenstappen, kladversies, mondelinge toelichting. Dat maakt je evaluatie AI-bestendiger dan elk verbod.</div></div>
</div>

<div class="ib warn">
  <div class="ib-t">⚠️ Over AI-detectietools: wees voorzichtig</div>
  <div class="ib-b">Tools die beweren AI-tekst te herkennen zijn <strong>onbetrouwbaar</strong>: ze geven vals-positieven (echte leerlingteksten als "AI" bestempeld) en vals-negatieven. Een beschuldiging van fraude enkel op basis van zo'n tool is niet te verantwoorden. Bouw je aanpak liever op procesevaluatie, gesprek en duidelijke labels vooraf.</div>
</div>

<div class="ib tip">
  <div class="ib-t">💬 Gespreksstarters voor in de klas</div>
  <div class="ib-b">• "Wat zou er gebeuren als iedereen zijn taken volledig door AI laat maken — wat leer je dan nog?"<br>• "Is AI gebruiken hetzelfde als je ouders je tekst laten nalezen? Waarom (niet)?"<br>• "Genereer een afbeelding van 'een dokter' en 'een poetshulp'. Wat valt op? Hoe komt dat?"<br>• "Aan wie behoort een tekst die AI schreef op basis van jouw idee?"</div>
</div>

<h3 class="ch3">⚖️ Auteursrecht & eigenaarschap — de vragen die je gegarandeerd krijgt</h3>
<div class="ib sr">
  <div class="ib-t">"Wie is de auteur als ik mijn taak met Copilot maak (label 5)?"</div>
  <div class="ib-b">Op puur AI-gegenereerde tekst of beelden rust naar de huidige stand van het recht in principe <strong>géén auteursrecht</strong>: er is geen menselijke maker. De leerling is dus geen "auteur" van wat de AI schreef — maar blijft wel <strong>volledig verantwoordelijk</strong> voor alles wat hij indient (basisprincipe 1) en moet het gebruik transparant vermelden. Hoe meer eigen creatieve inbreng (herschrijven, selecteren, combineren), hoe meer het werk wél weer "van de leerling" wordt — precies wat de labels 2 t.e.m. 4 nastreven.</div>
</div>
<div class="ib sr">
  <div class="ib-t">"Mag ik als leerkracht een AI-afbeelding of -tekst in mijn cursus of toets opnemen?"</div>
  <div class="ib-b"><strong>Ja, dat mag.</strong> Goede praktijk: vermeld de gebruikte tool (transparantie — wees het rolmodel dat je van leerlingen verwacht). Twee aandachtspunten: AI-output kan sterk lijken op bestaand beschermd werk (vermijd herkenbare personages, logo's of "in de stijl van" een levende kunstenaar), en dit rechtsgebied evolueert snel — bij twijfel: vraag je pedagogisch ICT-coördinator.</div>
</div>

<div class="cop-oef">
  <div class="cop-title">⊕ Doe-opdracht: plan één AI-gesprek</div>
  <div class="cop-steps">
    <div class="cop-step"><div class="cop-step-n">1</div>Kies één gespreksstarter hierboven die past bij jouw vak of klasgroep.</div>
    <div class="cop-step"><div class="cop-step-n">2</div>Plan concreet <strong>wanneer</strong> je dit gesprek voert (welke les, welke week).</div>
    <div class="cop-step"><div class="cop-step-n">3</div>Bonus: koppel het aan de EDUbox AI uit stap 1 — daar zit kant-en-klaar lesmateriaal bij.</div>
  </div>
</div>

<div class="bronnen-box">
  <div class="bronnen-title">📚 Bronnen & verdieping</div>
  <div class="bron-row">
    <a href="https://www.vrt.be/vrtnws/nl/2024/02/19/onderwijs-artificiele-intelligentie-scholierenkoepel-school-toel/" target="_blank" class="bron-tag">VRT NWS: standpunt Scholierenkoepel</a>
    <a href="https://thomasmore.be/nl/expertisecentrum-onderwijs-en-leren/blog/help-mijn-leerlingen-maken-hun-huiswerk-met-chatgpt" target="_blank" class="bron-tag">Thomas More: huiswerk & AI</a>
    <a href="https://mediawijs.be" target="_blank" class="bron-tag">Mediawijs</a>
  </div>
</div>

<div class="nw">
  <button class="sr-btn g" onclick="n2()">Volgende: je opdracht AI-bestendig maken →</button>
  <span class="nh">Stap 2/5</span>
</div>`;
}

// ── M2 · STAP 3 (NIEUW): AI-bestendig ontwerpen ──
function m2s2(c){
  c.innerHTML = `
<div class="s-badge">🔧 Stap 3 van 5 · AI-bestendig ontwerpen</div>
<h2 class="ch2">Maak je opdracht <em>AI-bestendig</em></h2>
<p class="cp">Een label communiceren is stap één. Maar de slimste aanpak is je opdracht zó ontwerpen dat ze waardevol blijft, <strong>óók als er AI in de buurt is</strong>. Niet door AI te verbieden en te hopen, maar door het denkwerk van de leerling zichtbaar en onmisbaar te maken. Drie ontwerpstrategieën:</p>

<div class="grid3">
  <div class="wcard"><div class="wc-j">Strategie 1</div><div class="wc-t">Persoonlijk & lokaal</div><div class="wc-d">Koppel de opdracht aan eigen ervaringen, de eigen klas, de eigen gemeente of actualiteit van deze week. Wat AI niet kan kennen, moet de leerling zelf aanbrengen.</div></div>
  <div class="wcard"><div class="wc-j">Strategie 2</div><div class="wc-t">Proces zichtbaar</div><div class="wc-d">Vraag kladversies, tussenstappen, een logboek of een korte mondelinge verdediging van gemaakte keuzes. Het eindproduct is dan nog maar een déél van de evaluatie.</div></div>
  <div class="wcard"><div class="wc-j">Strategie 3</div><div class="wc-t">AI als leerobject</div><div class="wc-d">Draai het om: laat leerlingen AI-output analyseren, fouten zoeken, verbeteren of beargumenteerd verwerpen. AI gebruiken wordt dan zélf de leeractiviteit (label 4).</div></div>
</div>

<div class="ib tip">
  <div class="ib-t">✏️ En vergeet het analoge niet</div>
  <div class="ib-b">Een "ouderwetse" opdracht in de klas — pen en papier, zonder schermen — is óók een volwaardige en soms <strong>noodzakelijke</strong> vorm van AI-bestendig evalueren. Wil je zeker weten dat de basiskennis erin zit (hoofdrekenen, woordenschat, een redenering opbouwen zonder hulpmiddelen), dan is een analoog moment in de les simpelweg de sterkste garantie. AI-bestendig ontwerpen betekent dus niet alles digitaal heruitvinden: <strong>bewust afwisselen</strong> tussen analoge momenten, procesgerichte taken en AI-als-leerobject is de krachtigste combinatie.</div>
</div>

<h3 class="ch3">Voor & na: drie herwerkte opdrachten</h3>
<div class="grid2">
  <div class="box-bad"><div class="box-h-bad">❌ Kwetsbaar</div><div class="box-body" style="font-style:italic">"Schrijf een opstel van 800 woorden over de Eerste Wereldoorlog."</div></div>
  <div class="box-good"><div class="box-h-good">✅ AI-bestendig (label 2)</div><div class="box-body">"Onderzoek hoe WO1 jouw gemeente raakte (monument, straatnaam, familieverhaal). Schrijf een opstel waarin je minstens 2 lokale elementen verwerkt. Kladversie maken we in de les; je verdedigt nadien 3 keuzes mondeling."</div></div>
  <div class="box-bad"><div class="box-h-bad">❌ Kwetsbaar</div><div class="box-body" style="font-style:italic">"Maak een samenvatting van hoofdstuk 5."</div></div>
  <div class="box-good"><div class="box-h-good">✅ AI-bestendig (label 4)</div><div class="box-body">"Maak eerst zelf een samenvatting. Laat daarna een AI hetzelfde doen. Duid 3 verschillen aan en leg uit: wat miste de AI, wat miste jij, en wat zegt dat over het hoofdstuk?"</div></div>
  <div class="box-bad"><div class="box-h-bad">❌ Kwetsbaar</div><div class="box-body" style="font-style:italic">"Los oefeningen 1 tot 10 op tegen volgende week."</div></div>
  <div class="box-good"><div class="box-h-good">✅ AI-bestendig (label 1 of 4)</div><div class="box-body">"Los de oefeningen op. Kies er 2 en leg je redenering stap voor stap uit (kort filmpje, audio of in de les). Of: hier is een foutieve uitwerking — vind de fout en verbeter ze met uitleg."</div></div>
</div>

<h3 class="ch3">🧩 Doe-opdracht: welke herwerking is het sterkst?</h3>
<p class="cp" style="margin-bottom:14px">Kies per situatie de herwerking die de opdracht het meest AI-bestendig maakt:</p>
<div id="ab-con"></div>

<h3 class="ch3">✅ Checklist: is mijn opdracht AI-bestendig?</h3>
<p class="cp" style="margin-bottom:10px">Neem de taak uit stap 1 erbij en vink af wat al klopt. Klik op elk item:</p>
<div class="chk-list" id="chk-list"></div>
<div id="chk-score" style="font-size:12px;font-weight:700;color:var(--muted);margin-bottom:8px"></div>

<div class="ib ok">
  <div class="ib-t">💡 Vooruitblik: laat een agent dit voor je doen</div>
  <div class="ib-b">In de optionele module "Copilot in de praktijk" bouw je een eigen <strong>AI-bestendige-opdrachten-coach</strong>: een Copilot-agent die elke taak die je hem geeft herwerkt volgens deze strategieën én jouw gekozen AI-label. Eén keer bouwen, eindeloos hergebruiken — en deelbaar met je vakgroep.</div>
</div>

<div class="nw">
  <button class="sr-btn g" onclick="n2()">Volgende: kennischeck →</button>
  <span class="nh">Stap 3/5</span>
</div>`;
  // mini-oefening: kies de sterkste herwerking
  const ab = [
    {t:'Frans, 3e jaar: "Schrijf een dialoog in een restaurant (20 zinnen)."', o:['Eis 30 zinnen in plaats van 20','Laat de dialoog in duo\'s live inspreken en improviseren op 2 onverwachte wendingen die jij ter plekke geeft','Verbied AI en laat thuis maken','Laat de dialoog typen in plaats van schrijven'], c:1, e:'Live uitvoeren met onvoorspelbare elementen maakt het eindproduct onlosmakelijk van de competentie (spreken!). Meer zinnen eisen of verbieden-en-hopen verandert niets wezenlijks.'},
    {t:'Geschiedenis, 5e jaar: "Bespreek de oorzaken van de Franse Revolutie."', o:['Vraag een langere tekst met meer bronnen','Laat leerlingen een AI-gegenereerd antwoord kritisch beoordelen: wat klopt, wat is te oppervlakkig, wat ontbreekt — en aanvullen met het bronnenmateriaal uit de les','Geef de opdracht als verrassingstoets','Laat het antwoord handgeschreven indienen'], c:1, e:'AI als leerobject (label 4): de leerling moet de leerstof écht beheersen om AI-output te kunnen beoordelen. Handschrift of verrassing pakt het leerdoel niet aan.'},
    {t:'Nederlands, 2e jaar: "Schrijf een verhaal van 1 pagina."', o:['Laat het verhaal vertrekken vanuit een klasfoto-moment of gebeurtenis van deze maand op school, met een schrijfles waarin de kladversie ontstaat','Vraag 2 pagina\'s in plaats van 1','Gebruik een AI-detector bij het verbeteren','Verbied computers volledig'], c:0, e:'Persoonlijke en lokale context plus zichtbaar proces in de les: de twee sterkste strategieën gecombineerd. Detectors zijn onbetrouwbaar en langere teksten zijn voor AI geen obstakel.'},
  ];
  const con = document.getElementById('ab-con');
  ab.forEach((s,i)=>{
    const el = document.createElement('div'); el.className='scb';
    let ch = '';
    s.o.forEach((o,j)=>{ ch += '<button class="sc-choice" data-i="'+i+'" data-j="'+j+'">'+o+'</button>'; });
    el.innerHTML = '<div class="sc-title">Situatie '+(i+1)+'</div><div class="sc-text">'+s.t+'</div><div class="sc-choices">'+ch+'</div><div id="abfb-'+i+'" style="display:none;margin-top:9px;padding:9px 13px;border-radius:7px;font-size:12px;font-weight:700;line-height:1.5"></div>';
    con.appendChild(el);
  });
  con.querySelectorAll('.sc-choice').forEach(b=>{
    b.onclick = ()=>{
      const i=+b.dataset.i, j=+b.dataset.j, s=ab[i], ok=j===s.c;
      b.classList.add(ok?'sg':'sb');
      const fb=document.getElementById('abfb-'+i);
      fb.style.display='block';
      fb.style.background = ok?'rgba(127,224,0,.15)':'rgba(224,32,32,.06)';
      fb.style.color = ok?'#2d6a00':'var(--red)';
      fb.style.border = '2px solid '+(ok?'var(--green)':'var(--red)');
      fb.textContent = (ok?'✅ Correct! ':'❌ Niet de sterkste keuze. ')+s.e;
      b.closest('.sc-choices').querySelectorAll('button').forEach(x=>x.disabled=true);
    };
  });
  // checklist
  const items = [
    'De opdracht vraagt persoonlijke, lokale of heel recente context die AI niet kan kennen',
    'Het leerproces telt zichtbaar mee (kladversie, logboek, tussenstap, mondelinge toelichting)',
    'Het AI-label staat expliciet bij de opdracht en is gekozen vanuit de te bewijzen competentie',
    'Als AI toegelaten is: er zit een verplichte reflectie of kritische verwerking van de AI-output in',
    'De evaluatie steunt niet uitsluitend op het eindproduct',
  ];
  const cl = document.getElementById('chk-list');
  let n = 0;
  items.forEach(t=>{
    const el = document.createElement('div'); el.className='chk-item';
    el.innerHTML = '<div class="chk-box"></div><div>'+t+'</div>';
    el.onclick = ()=>{
      el.classList.toggle('checked');
      el.querySelector('.chk-box').textContent = el.classList.contains('checked') ? '✓' : '';
      n = cl.querySelectorAll('.checked').length;
      const sc = document.getElementById('chk-score');
      sc.textContent = n + ' van ' + items.length + ' afgevinkt' + (n>=4 ? ' — sterke opdracht! 🎯' : n>=2 ? ' — goed bezig, kies 1 strategie om toe te voegen.' : ' — kies 1 of 2 strategieën hierboven en herwerk je taak.');
      sc.style.color = n>=4 ? '#2d6a00' : 'var(--orange)';
    };
    cl.appendChild(el);
  });
}

// ── M2 · STAP 4: quiz ──
function m2s3(c){
  const quiz = [
    {q:'Een leerling gebruikte duidelijk AI bij een taak met label 1 ("Geen AI"). Wat doe je?', o:['Je laat het gaan: zonder sluitend bewijs van een detectietool kan je toch niets hardmaken','Je behandelt het als een onregelmatigheid conform het schoolreglement, zoals elk ander niet-toegelaten hulpmiddel','Je trekt stilzwijgend punten af — een gesprek maakt het alleen maar groter','Je zet het label voortaan op 5, dan kan niemand nog in de fout gaan'], a:1, f:'Een onregelmatigheid behandel je via het schoolreglement — net zoals een spiekbriefje. "Geen bewijs, dus laten gaan" is precies waarom procesevaluatie zo belangrijk is; stilzwijgend straffen is oneerlijk en onhoudbaar; het label opgeven ondermijnt het hele systeem.'},
    {q:'Een leerling vraagt: "Hebt u dit lesplan met AI gemaakt?" Beste reactie?', o:['Ontkennen om je gezag te bewaren','Eerlijk antwoorden en uitleggen hoe je het gebruikte en controleerde','Zeggen dat dat de leerling niet aangaat','Het onderwerp veranderen'], a:1, f:'Transparantie is een kernprincipe — ook voor jou. Eerlijk antwoorden maakt je een geloofwaardig rolmodel en is meteen een mediawijsheidsles.'},
    {q:'Wat moeten leerlingen ALTIJD vermelden bij AI-gebruik (labels 2 t/m 5)?', o:['Niets, dat is privé','Welke AI-middelen ze gebruikten en hoe','Enkel de naam van de tool','Enkel als de leerkracht er expliciet om vraagt'], a:1, f:'Transparantie is verplicht: leerlingen noteren welke AI-middelen ze gebruikten en hoe (bundel onderzoeksvaardigheden). De leerling blijft bovendien zelf verantwoordelijk voor het werk.'},
    {q:'Wat maakt een opdracht het meest AI-bestendig?', o:['Een hoger woordenaantal eisen','Het leerproces zichtbaar en onmisbaar maken: persoonlijke context, kladversies, mondelinge verdediging','Een AI-detectietool gebruiken bij het verbeteren','Alle taken voortaan op papier laten maken'], a:1, f:'Ontwerp wint van controle: persoonlijke/lokale context en zichtbaar proces maken het denkwerk van de leerling onvervangbaar. Detectors zijn onbetrouwbaar, woordenaantallen zijn voor AI geen obstakel.'},
    {q:'Een collega wil leerlingenteksten mét namen door een AI-detectietool halen om fraude te bewijzen. Wat is het belangrijkste bezwaar?', o:['Detectietools zijn te duur','Detectietools zijn onbetrouwbaar én je voert persoonsgegevens in een niet-goedgekeurde tool in','Het kost te veel tijd','Er is geen bezwaar'], a:1, f:'Dubbel probleem: AI-detectie is aantoonbaar onbetrouwbaar (vals-positieven!) én leerlingwerk met namen uploaden schendt de spelregels rond persoonsgegevens.'},
    {q:'Je wil AI-feedback op de tekst van leerling "Jonas D.". Wat doe je?', o:['Naam en tekst integraal in ChatGPT plakken','De tekst anonimiseren en dan Copilot M365 met schoolaccount gebruiken','Nooit AI gebruiken voor feedback','Een gratis tool gebruiken, dat gaat sneller'], a:1, f:'Geanonimiseerde teksten mogen in Copilot M365 via je schoolaccount. Namen van leerlingen horen nooit in een AI-tool — ook niet in de goedgekeurde.'},
    {q:'Waarom geldt AI die leerlingen evalueert als "hoog-risico" onder de EU AI Act?', o:['Omdat AI-systemen technisch nog niet betrouwbaar genoeg zijn — zodra ze beter worden, vervalt dit','Omdat zulke beslissingen grote impact hebben op iemands toekomst — de eindverantwoordelijkheid blijft bij de mens','Omdat de wet alle AI-gebruik in het onderwijs als hoog-risico beschouwt','Dat klopt niet: het geldt enkel voor commerciële tools, niet als de school zelf iets bouwt'], a:1, f:'Het risiconiveau hangt af van de impact op mensen, niet van de technische kwaliteit of van wie het systeem bouwde — en zeker niet álle onderwijs-AI is hoog-risico (een quizgenerator bijvoorbeeld niet). Evalueren en toelating bepalen: dat raakt iemands kansen, dus blijft de mens eindverantwoordelijk.'},
  ];
  rQuiz(c, quiz, 2, 'mod2', n2, 70);
}

// ── M2 · STAP 5: scenario's + afronding ──
function m2s4(c){
  c.innerHTML = `
<div class="s-badge">🏁 Stap 5 van 5 · Praktijkscenario's & afronding</div>
<h2 class="ch2">Wat doe jij? — <em>Praktijkscenario's</em></h2>
<p class="cp">Tot slot: drie situaties die je als leerkracht bij Sint-Rembert reëel kan tegenkomen. Kies telkens de beste reactie.</p>
<div id="sc-con"></div>

<h3 class="ch3">✍️ Afsluitende reflectie</h3>
<p class="cp" style="margin-bottom:10px">Formuleer <strong>één concrete stap</strong> die jij de komende maand zet rond AI in jouw lespraktijk:</p>
<textarea class="sr-ta" id="r3" placeholder="Ik ga bij mijn lessen [vak] het AI-label duidelijk communiceren door...&#10;Of: ik herwerk taak ... AI-bestendig met strategie ...&#10;Of: ik voer het klasgesprek over ... in de week van ..."></textarea>

<div class="ib tip">
  <div class="ib-t">🌱 Start klein — dit hoeft niet allemaal morgen</div>
  <div class="ib-b">Voel je lichte AI-stress na deze module? Heel normaal — en je bent zeker niet de enige in de lerarenkamer. Goed nieuws: je hoeft je evaluatiesysteem niet om te gooien en je hoeft geen AI-expert te worden. Kies dít semester <strong>één taak</strong> om bewust te labelen of AI-bestendig te herwerken, en plan <strong>één klasgesprek</strong>. Dat is genoeg om te starten. De rest groeit vanzelf, op jouw tempo — en met de ondersteuning van het professionaliseringsaanbod hieronder.</div>
</div>

<div class="ib ok">
  <div class="ib-t">🎉 Bijna klaar!</div>
  <div class="ib-b">Na het afronden ontvang je je certificaat. <strong>Let op: je kan het maar één keer downloaden</strong> — controleer dus eerst je naam in de zijbalk. Daarna upload je het op Smartschool. Zin in meer? De optionele module <strong>"Copilot in de praktijk"</strong> staat voor je klaar — niet verplicht, wél de moeite.</div>
</div>

${promoMini('En noteer alvast: keynote <strong style="color:white">Orhan Agirdag op 18 november</strong> over AI en ethiek, plus het praktische <strong style="color:white">sporenaanbod met Howest</strong> doorheen het schooljaar.')}

<div class="nw">
  <button class="sr-btn g" onclick="sR3()">🏆 Afronden & certificaat ontvangen →</button>
  <span class="nh">Upload daarna op Smartschool</span>
</div>`;
  const sc = [
    {t:'Een collega wil een klasrapport mét leerlingennamen uploaden naar gratis ChatGPT om snel een samenvatting te krijgen. "Het is toch maar intern", zegt ze.', o:['Prima — het blijft binnen de school','Niet doen: persoonsgegevens in een niet-goedgekeurde tool schendt de AI-spelregels. Wijs haar op Copilot M365 + anonimiseren','Mag, als ze haar privé-mailadres gebruikt','Mag, als ze het rapport daarna verwijdert uit de chat'], c:1, e:'Niet alleen "tegen de regels": alles wat je in de gratis versie van zulke tools typt, kan standaard gebruikt worden om hun modellen verder te trainen. Leerlinggegevens kunnen zo letterlijk buiten de school belanden — "het is maar intern" bestaat daar niet. Copilot met schoolaccount (het schildje!) sluit die trainingsdata-kraan: jouw invoer wordt niet gebruikt om modellen te trainen. Dus: anonimiseren + Copilot M365.'},
    {t:'Een leerling meldt achteraf eerlijk: "Ik gebruikte AI voor mijn taak (label 2), maar ik vergat het te vermelden bij de indiening."', o:['Negeren — het resultaat telt','De transparantieverplichting is geschonden; je spreekt de leerling erop aan en handelt naargelang context en schoolreglement','Automatisch een nul, einde discussie','Niets doen omdat de leerling het zelf kwam zeggen'], c:1, e:'Transparantie is een kernprincipe en niet vrijblijvend. Tegelijk weeg je context mee: eerlijk komen melden verdient een ander gevolg dan betrapt worden. Maar zomaar negeren ondermijnt het systeem.'},
    {t:'Je geeft een schrijfopdracht: leerlingen moeten zélf de inhoud en structuur schrijven, maar mogen AI inzetten om stijl en spelling te verbeteren. Welk label?', o:['Label 1: Geen AI','Label 2: Ideeën & structuur','Label 3: AI-bewerking','Label 5: AI vrij'], c:2, e:'Label 3 (AI-bewerking): AI mag het eigen werk verbeteren en preciseren, maar niet de inhoud creëren. De gedachten en de opbouw blijven van de leerling.'},
  ];
  const con = document.getElementById('sc-con');
  sc.forEach((s,i)=>{
    const el = document.createElement('div'); el.className='scb';
    let ch = '';
    s.o.forEach((o,j)=>{ ch += '<button class="sc-choice" data-i="'+i+'" data-j="'+j+'">'+o+'</button>'; });
    el.innerHTML = '<div class="sc-title">Scenario '+(i+1)+'</div><div class="sc-text">'+s.t+'</div><div class="sc-choices">'+ch+'</div><div id="scfb-'+i+'" style="display:none;margin-top:9px;padding:9px 13px;border-radius:7px;font-size:12px;font-weight:700;line-height:1.5"></div>';
    con.appendChild(el);
  });
  con.querySelectorAll('.sc-choice').forEach(b=>{
    b.onclick = ()=>{
      const i=+b.dataset.i, j=+b.dataset.j, s=sc[i], ok=j===s.c;
      b.classList.add(ok?'sg':'sb');
      const fb=document.getElementById('scfb-'+i);
      fb.style.display='block';
      fb.style.background = ok?'rgba(127,224,0,.15)':'rgba(224,32,32,.06)';
      fb.style.color = ok?'#2d6a00':'var(--red)';
      fb.style.border = '2px solid '+(ok?'var(--green)':'var(--red)');
      fb.textContent = (ok?'✅ Correct! ':'❌ Niet de beste keuze. ')+s.e;
      b.closest('.sc-choices').querySelectorAll('button').forEach(x=>x.disabled=true);
    };
  });
  const ta = document.getElementById('r3');
  ta.value = localStorage.getItem('sr_r3') || '';
  ta.oninput = ()=>localStorage.setItem('sr_r3', ta.value);
}
function sR3(){
  const v = (document.getElementById('r3').value||'').trim();
  if(v.length < 60){ alert('Maak je actiestap nog wat concreter: welke taak of welk gesprek, in welke klas, wanneer? Dat is je persoonlijke vertaalslag van deze module.'); return; }
  n2();
}

/* ════════════════════════════════════════════
   MODULE 3 — COPILOT IN DE PRAKTIJK (OPTIONEEL, 8 stappen)
   ════════════════════════════════════════════ */
const m3 = [m3s0, m3s1, m3s2, m3s3, m3s4, m3s5, m3s6, m3s7];
function rm3(){ const c=document.getElementById('m3c'); c.innerHTML=''; rDots(3,m3.length,S.mod3.step); m3[S.mod3.step](c); addPrev(3); }
function n3(){ S.mod3.step++; ss(); S.mod3.step>=m3.length ? d3() : rm3(); document.getElementById('main').scrollTo(0,0); }
function d3(){ S.mod3.done=true; S.mod3.step=0; ss(); up(); rmc(); sv('home'); setTimeout(()=>alert('🎉 Optionele verdieping voltooid — sterk! Breng het nu in de praktijk en deel je ervaringen met collega\'s.'),300); }

// ── M3 · STAP 1: aan de slag & personalisatie ──
function m3s0(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel — niet verplicht voor je certificaat</span><span class="s-badge">✨ Stap 1 van 8 · Aan de slag</span></div>
<h2 class="ch2">Copilot M365 — <em>jouw AI-assistent</em></h2>
<p class="cp">Copilot Chat zit <strong>inbegrepen in je Microsoft 365-schoolaccount</strong> — je hebt niets extra nodig. Het is binnen Sint-Rembert de enige volledig ondersteunde, dataproof AI-tool. In deze module ga je écht aan de slag: je personaliseert Copilot, schrijft prompts, maakt een poster voor je lokaal, bouwt lesmateriaal in de Teach-module en maakt tot slot je eigen agent. Geen theorie zonder doen — elke stap heeft een opdracht die je nu meteen uitvoert.</p>

<div class="tz g">
  <div class="tz-title">🟢 Volledig ondersteund door Sint-Rembert — dataproof</div>
  <div class="tz-tools"><div class="tt">Copilot M365 (schoolaccount)</div><div class="tt">Copilot Chat</div><div class="tt">BookWidgets AI</div><div class="tt">Canva AI (schoollicentie)</div></div>
</div>
<div class="tz o">
  <div class="tz-title">🟠 Toegestaan met aandacht — nooit persoonsgegevens of schooldocumenten</div>
  <div class="tz-tools"><div class="tt">ChatGPT</div><div class="tt">Google Gemini</div><div class="tt">NotebookLM</div><div class="tt">Claude.ai</div><div class="tt">Perplexity</div><div class="tt">Gamma.app</div></div>
</div>
<div class="tz gr">
  <div class="tz-title">⬜ Eigen verantwoordelijkheid — geen schoolondersteuning</div>
  <div class="tz-tools"><div class="tt" style="background:#e5e7eb;color:#6b7280">Midjourney, Grok, Meta AI en andere niet-gecontracteerde tools</div></div>
</div>

<h3 class="ch3">De 4 onderdelen die je in deze module verkent</h3>
<div class="grid2">
  <div class="wcard"><div style="font-size:22px;margin-bottom:8px">💬</div><div class="wc-t">Chat</div><div class="wc-d">Je AI-sparringpartner voor vragen, ideeën en eerste versies. Via je schoolaccount met gegevensbescherming: je invoer wordt niet gebruikt om modellen te trainen.</div></div>
  <div class="wcard"><div style="font-size:22px;margin-bottom:8px">🎨</div><div class="wc-t">Maakmodule (Create)</div><div class="wc-d">Afbeeldingen, posters en infographics genereren en bewerken — zonder designkennis. In stap 3 maak jij hiermee een poster voor je eigen lokaal.</div></div>
  <div class="wcard"><div style="font-size:22px;margin-bottom:8px">📚</div><div class="wc-t">Onderwijsmodule (Teach)</div><div class="wc-d">Speciaal voor leerkrachten: lesplannen, leesniveaus aanpassen, rubrics, quizzen, flashcards. In stap 4 en 5 werk je hierin met je eigen lesmateriaal.</div></div>
  <div class="wcard"><div style="font-size:22px;margin-bottom:8px">🤖</div><div class="wc-t">Agents</div><div class="wc-d">Bouw een mini-Copilot met jouw vaste instructies. In stap 6 maak je de AI-bestendige-opdrachten-coach uit module 2 werkelijkheid.</div></div>
</div>

<div class="cop-oef">
  <div class="cop-title">⊕ Doe-opdracht 1: open Copilot en check je bescherming</div>
  <div class="cop-steps">
    <div class="cop-step"><div class="cop-step-n">1</div>Ga naar <strong>copilot.microsoft.com</strong> en log in met je <strong>schoolaccount</strong>.</div>
    <div class="cop-step"><div class="cop-step-n">2</div>Controleer het <strong>schild-icoon (Protected)</strong> bovenaan — dat bevestigt de gegevensbescherming via je schoolaccount. Zie je het niet? Log uit en opnieuw in met het juiste account. <strong>Zonder schild: niet verdergaan.</strong></div>
    <div class="cop-step"><div class="cop-step-n">3</div>Verken de linkerzijbalk: je ziet er onder andere <strong>Search, Library, Create, Teach</strong> en <strong>Agents</strong>. Die volgorde is meteen ons pad door deze module.</div>
  </div>
</div>

<h3 class="ch3">⚙️ Copilot op jouw maat: personalisatie</h3>
<p class="cp">Copilot kan je vaste voorkeuren onthouden via <strong>aangepaste instructies</strong> (Settings → Personalisation → Custom instructions). Eén keer goed instellen betekent dat élke toekomstige output al in jouw stijl en context vertrekt: jouw vak, jouw graad, jouw toon. Dat bespaart je in elke prompt opnieuw dezelfde uitleg.</p>

<div class="cop-oef">
  <div class="cop-title">⊕ Doe-opdracht 2: laat Copilot zijn eigen instructies schrijven</div>
  <div class="cop-steps">
    <div class="cop-step"><div class="cop-step-n">1</div>Verzamel 2 à 3 teksten die jij zelf schreef (een opdrachtblad, een mail naar ouders, een cursustekst). <strong>Verwijder eerst alle namen en persoonsgegevens.</strong></div>
    <div class="cop-step"><div class="cop-step-n">2</div>Vraag in Copilot Chat: <em>"Schrijf aangepaste instructies voor Copilot die mijn schrijfstijl en mijn context als leerkracht [vak, graad] beschrijven. Baseer je op de bijgevoegde teksten."</em> en voeg je bestanden toe.</div>
    <div class="cop-step"><div class="cop-step-n">3</div>Lees het resultaat kritisch, pas aan wat niet klopt, en plak het in <strong>Settings → Personalisation → Custom instructions</strong>.</div>
    <div class="cop-step"><div class="cop-step-n">4</div>Test: vraag een korte mail aan ouders over een uitstap. Klinkt die nu meer als jij?</div>
  </div>
</div>

<h3 class="ch3">📖 Officiële training (Microsoft Learn, gratis & in het Nederlands)</h3>
<a href="https://learn.microsoft.com/nl-nl/training/educator-center/product-guides/copilot" target="_blank" class="ms-card">
  <div class="ms-src">Microsoft Learn · Educator Center</div>
  <div class="nws-title">Microsoft 365 Copilot in het onderwijs</div>
  <div class="nws-desc">Startpunt met productgidsen, video's en stapsgewijze handleidingen voor Copilot in de klas.</div>
</a>
<a href="https://learn.microsoft.com/nl-nl/training/modules/enhance-teaching-learning-microsoft-copilot/" target="_blank" class="ms-card">
  <div class="ms-src">Microsoft Learn · Module</div>
  <div class="nws-title">Onderwijs en leren verbeteren met Copilot Chat</div>
  <div class="nws-desc">Gratis zelfstudiemodule: prompts ontwerpen, materiaal maken en AI-output kritisch beoordelen.</div>
</a>

<div class="nw">
  <button class="sr-btn o" onclick="n3()">Volgende: prompts schrijven →</button>
  <span class="nh">Stap 1/8</span>
</div>`;
}

// ── M3 · STAP 2: prompten ──
function m3s1(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">✍️ Stap 2 van 8 · Prompting</span></div>
<h2 class="ch2">Het geheim zit in <em>je prompt</em></h2>
<p class="cp">Een goede prompt is als een goede instructie aan een nieuwe collega: <strong>duidelijk, met context en een verwacht resultaat</strong>. Vaag erin = vaag eruit. Specifiek erin = direct bruikbaar eruit. Vijf bouwstenen maken het verschil:</p>

<div class="bws">
  <div class="bw"><div class="bw-num">1</div><div><div class="bw-lbl">🎭 Rol</div><div class="bw-desc">Welke expertise neemt Copilot aan? "Je bent een ervaren didacticus wiskunde in het secundair onderwijs..."</div></div></div>
  <div class="bw"><div class="bw-num">2</div><div><div class="bw-lbl">🎯 Doel / Taak</div><div class="bw-desc">Wat moet er concreet gebeuren? "Schrijf een lesplan..." / "Maak 10 oefeningen over..."</div></div></div>
  <div class="bw"><div class="bw-num">3</div><div><div class="bw-lbl">📍 Context</div><div class="bw-desc">Voor wie, in welke situatie? "...voor het 4e jaar, voorkennis X, gemengde klas met 2 zorgleerlingen."</div></div></div>
  <div class="bw"><div class="bw-num">4</div><div><div class="bw-lbl">📂 Bron</div><div class="bw-desc">Wat geef je mee? Eindtermen, een bestaande tekst, het thema van vorige les... (nooit persoonsgegevens!)</div></div></div>
  <div class="bw"><div class="bw-num">5</div><div><div class="bw-lbl">📋 Verwachtingen</div><div class="bw-desc">Hoe moet de output eruitzien? "Tabel, max 400 woorden, differentiatie als aparte kolom."</div></div></div>
</div>

<h3 class="ch3">❌ Zwak vs. ✅ sterk</h3>
<div class="grid2">
  <div class="box-bad">
    <div class="box-h-bad">❌ Zwakke prompt</div>
    <div class="box-body" style="font-style:italic">"Maak een les over WO2."</div>
    <div style="font-size:11px;color:var(--red);margin-top:6px;font-weight:600">Geen leerjaar, geen duur, geen doel, geen formaat. Copilot maakt íets — maar zelden iets bruikbaars.</div>
  </div>
  <div class="box-good">
    <div class="box-h-good">✅ Sterke prompt</div>
    <div class="box-body">"Je bent een ervaren geschiedenisleerkracht. Schrijf een lesplan van 50 min over de oorzaken van WO2 voor het 4e jaar. Doel: oorzaken kunnen verklaren en verbanden leggen. Output: stappenplan per 10 min + differentiatieopdracht + 3 doordenkvragen."</div>
  </div>
</div>

<h3 class="ch3">🚀 Twee technieken voor gevorderden</h3>
<div class="grid2">
  <div class="wcard"><div class="wc-j">Techniek 1 · Few-shot</div><div class="wc-t">Geef een voorbeeld mee</div><div class="wc-d">Niets stuurt de output zo hard als een eigen voorbeeld. Vergelijk: <em>"Schrijf 3 examenvragen over de Franse Revolutie"</em> versus <em>"Schrijf 3 examenvragen over de Franse Revolutie. Dit is het soort vraag dat ik zoek: 'Leg uit waarom de financiële crisis van 1788 niet de enige oorzaak van de revolutie was — gebruik twee andere oorzaken in je antwoord.'"</em> Met dat ene voorbeeld kopieert Copilot jouw niveau, vraagstijl en denkdiepte — in plaats van standaard meerkeuzevraagjes te produceren.</div></div>
  <div class="wcard"><div class="wc-j">Techniek 2 · Chain of thought</div><div class="wc-t">"Leg je redenering stap voor stap uit"</div><div class="wc-d">Voeg deze zin toe aan je prompt en het taalmodel wordt gedwongen trager en explicieter te "redeneren" — wat aantoonbaar minder fouten oplevert. Onmisbaar bij wiskunde, wetenschappen en alles met berekeningen (herinner je de discriminant-blunder uit module 1!). Extra bonus: een stap-voor-stap-uitwerking kan je meteen zélf controleren, stap per stap, in plaats van enkel het eindantwoord te moeten vertrouwen.</div></div>
</div>

<div class="cop-oef">
  <div class="cop-title">⊕ Doe-opdracht: test beide technieken</div>
  <div class="cop-steps">
    <div class="cop-step"><div class="cop-step-n">1</div><strong>Few-shot:</strong> vraag Copilot 3 examenvragen over een onderwerp uit jouw vak — eerst zonder, dan mét één eigen voorbeeldvraag. Vergelijk de kwaliteit. Het verschil is meestal spectaculair.</div>
    <div class="cop-step"><div class="cop-step-n">2</div><strong>Chain of thought:</strong> laat Copilot een oefening uit jouw vak uitwerken met de toevoeging "Leg je redenering stap voor stap uit." Controleer elke stap als examinator — vind je een fout, dan heb je meteen weer klasmateriaal.</div>
  </div>
</div>

<div class="ib tip">
  <div class="ib-t">💡 Pro-tip: voer een gesprek, geen losse vraag</div>
  <div class="ib-b">Je eerste prompt hoeft niet perfect te zijn. Reageer op de output: "korter", "moeilijker", "voeg een voorbeeld toe uit de leefwereld van 15-jarigen", "herschrijf op B1-niveau". Copilot onthoudt de context binnen het gesprek — gebruik dat. En bewaar prompts die goed werken: zo bouw je je eigen bibliotheek op (in de laatste stap krijg je er alvast een paar van ons).</div>
</div>

<div class="cop-oef">
  <div class="cop-title">⊕ Doe-opdracht: schrijf 3 prompts voor jouw vak</div>
  <div class="cop-steps">
    <div class="cop-step"><div class="cop-step-n">1</div>Schrijf in Copilot een prompt voor <strong>een lesplan</strong> in jouw vak — met alle 5 bouwstenen.</div>
    <div class="cop-step"><div class="cop-step-n">2</div>Schrijf er een voor <strong>een differentiatieopdracht</strong> voor jouw klas.</div>
    <div class="cop-step"><div class="cop-step-n">3</div>Schrijf er een voor <strong>een exit-ticket</strong> bij een les naar keuze.</div>
    <div class="cop-step"><div class="cop-step-n">4</div>Itereer minstens één keer op elke output ("korter", "concreter", "ander voorbeeld"). Beoordeel kritisch: wat moet jij als vakexpert nog corrigeren?</div>
  </div>
</div>

<p class="cp" style="margin-bottom:10px"><strong>Plak hieronder je beste prompt</strong> en laat hem analyseren op de bouwstenen:</p>
<textarea class="sr-ta" id="poef" placeholder="Plak hier je prompt..."></textarea>
<button class="rv-btn" id="pchk">📊 Analyseer mijn prompt</button>
<div id="pscore" style="font-size:12px;font-weight:700;color:var(--muted);margin-top:8px;margin-bottom:14px"></div>

<div class="nw">
  <button class="sr-btn o" onclick="n3()">Volgende: de Maakmodule →</button>
  <span class="nh">Stap 2/8</span>
</div>`;
  const ta = document.getElementById('poef');
  ta.value = localStorage.getItem('sr_p3') || '';
  ta.oninput = ()=>localStorage.setItem('sr_p3', ta.value);
  document.getElementById('pchk').onclick = ()=>{
    const t = ta.value.toLowerCase();
    const ch = [
      {l:'Rol', f: t.includes('je bent') || t.includes('als een') || t.includes('expert') || t.includes('leerkracht') || t.includes('didacticus')},
      {l:'Doel/Taak', f: t.includes('schrijf') || t.includes('maak') || t.includes('ontwerp') || t.includes('genereer') || t.includes('stel op')},
      {l:'Context', f: /\d/.test(t) && (t.includes('jaar') || t.includes('graad') || t.includes('klas') || t.includes('niveau'))},
      {l:'Verwachtingen', f: t.includes('output') || t.includes('tabel') || t.includes('max') || t.includes('woorden') || t.includes('lijst') || t.includes('stappenplan')},
    ];
    const bonus = [
      {l:'Few-shot (voorbeeld)', f: t.includes('voorbeeld')},
      {l:'Chain of thought (stap voor stap)', f: t.includes('stap voor stap') || t.includes('redenering')},
    ];
    const ok = ch.filter(x=>x.f).length;
    const pct = Math.round(ok/ch.length*100);
    const sc = document.getElementById('pscore');
    sc.innerHTML = 'Score: <strong>'+pct+'%</strong> — '+ch.map(x=>(x.f?'✅':'⬜')+' '+x.l).join(' · ')
      + '<br>Gevorderd: '+bonus.map(x=>(x.f?'🌟':'⬜')+' '+x.l).join(' · ')
      + (pct<100?'<br><span style="font-weight:600">Tip: ontbrekende bouwstenen toevoegen levert vrijwel altijd betere output op. (Dit is een eenvoudige woordcheck — geen volwaardige beoordeling.)</span>':' — sterke prompt! 🎯');
    sc.style.color = pct>=75 ? '#2d6a00' : 'var(--orange)';
  };
}

// ── M3 · STAP 3: Maakmodule — posteropdracht ──
function m3s2(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">🎨 Stap 3 van 8 · Maakmodule</span></div>
<h2 class="ch2">Visueel creëren: maak een <em>poster voor je lokaal</em></h2>
<p class="cp">De <strong>Maakmodule (Create)</strong> genereert afbeeldingen, posters, infographics en banners — en laat je die ook bewerken: tekst aanpassen, achtergrond verwijderen, elementen wissen. Je vindt alles terug onder <strong>Library</strong>. In deze stap maak je geen oefenplaatje, maar iets dat je écht gebruikt: een <strong>poster met de AI-klasafspraken voor jouw lokaal</strong>.</p>

<div class="grid2">
  <div class="wcard"><div style="font-size:22px;margin-bottom:8px">🖼️</div><div class="wc-t">Wat kan je maken?</div><div class="wc-d">Afbeelding, infographic, poster, verhaal, formulier, banner... Kies bovenaan het type vóór je je beschrijving typt — dat bepaalt het formaat en de opbouw.</div></div>
  <div class="wcard"><div style="font-size:22px;margin-bottom:8px">🎭</div><div class="wc-t">Stijlen & bewerken</div><div class="wc-d">Kies een stijl (Flat Design, Sketch, Watercolor...) en bewerk nadien: <strong>Edit text</strong> voor tekstfouten, <strong>Erase</strong> voor storende elementen, achtergrond vervangen of vervagen.</div></div>
</div>

<div class="cop-oef">
  <div class="cop-title">⊕ Hoofdopdracht: de AI-afsprakenposter (stap voor stap)</div>
  <div class="cop-steps">
    <div class="cop-step"><div class="cop-step-n">1</div>Bedenk <strong>3 klasafspraken rond AI</strong> voor jouw lokaal. Bijvoorbeeld: "Vraag eerst welk AI-label geldt" — "Vermeld altijd welke AI je gebruikte" — "Nooit namen of persoonlijke info in een AI-tool".</div>
    <div class="cop-step"><div class="cop-step-n">2</div>Open in Copilot <strong>Create</strong> en kies <strong>"Design a poster"</strong>.</div>
    <div class="cop-step"><div class="cop-step-n">3</div>Schrijf je beschrijving met de bouwstenen uit stap 2, bv.: <em>"Ontwerp een poster voor een klaslokaal secundair onderwijs met deze 3 afspraken rond AI-gebruik: [afspraak 1], [afspraak 2], [afspraak 3]. Rustige uitstraling, grote leesbare titels, weinig tekst, positieve toon."</em></div>
    <div class="cop-step"><div class="cop-step-n">4</div>Kies een <strong>stijl</strong> die past bij jouw lokaal (Flat Design werkt vaak goed voor posters) en genereer. Niet tevreden? Pas je beschrijving aan en genereer opnieuw — itereren hoort erbij.</div>
    <div class="cop-step"><div class="cop-step-n">5</div><strong>Controleer alle gegenereerde tekst op fouten.</strong> Beeldgeneratoren maken geregeld spel- en taalfouten in afbeeldingen — dit is hét leermoment van deze opdracht. Verbeter via <strong>Edit text</strong>.</div>
    <div class="cop-step"><div class="cop-step-n">6</div><strong>Download</strong> je poster, druk af en hang ze op in je lokaal. Vanaf nu start elk AI-gesprek in jouw klas bij die poster.</div>
  </div>
</div>

<h3 class="ch3">✅ Succescriteria — check je poster</h3>
<div class="chk-list" id="poster-chk"></div>

<div class="ib warn">
  <div class="ib-t">⚠️ Spelregels voor beeldgeneratie</div>
  <div class="ib-b">• Genereer <strong>nooit afbeeldingen van echte, herkenbare personen</strong> — zeker geen leerlingen of collega's.<br>• Vermijd "in de stijl van [levende kunstenaar]" — dat schuurt met auteursrecht en is geen goed voorbeeld voor leerlingen.<br>• Gegenereerde "feiten" in infographics (cijfers, jaartallen, kaarten) zijn vaak fout: controleer alles vóór je het klasseert als lesmateriaal.</div>
</div>

<div class="cop-oef">
  <div class="cop-title">⊕ Bonusopdracht: infographic voor jouw vak</div>
  <div class="cop-steps">
    <div class="cop-step"><div class="cop-step-n">1</div>Kies een proces of stappenplan uit jouw vak (de waterkringloop, een recept, een veiligheidsprocedure in het atelier, een werkpostfiche...).</div>
    <div class="cop-step"><div class="cop-step-n">2</div>Maak er via <strong>Design an infographic</strong> een visueel stappenplan van. Geef de stappen letterlijk mee in je beschrijving — dan klopt de inhoud.</div>
    <div class="cop-step"><div class="cop-step-n">3</div>Controleer, verbeter de tekst en bewaar in je <strong>Library</strong>.</div>
  </div>
</div>

<div class="nw">
  <button class="sr-btn o" onclick="n3()">Volgende: de Teach-module →</button>
  <span class="nh">Stap 3/8</span>
</div>`;
  const items = [
    'Leesbaar vanop 5 meter (grote titels, weinig tekst)',
    'Geen spel- of taalfouten in de gegenereerde tekst (gecheckt en verbeterd!)',
    'De 3 afspraken sluiten aan bij de AI-spelregels en labels van Sint-Rembert',
    'Positief geformuleerd ("doe dit") in plaats van enkel verboden',
    'Gedownload en klaar om op te hangen',
  ];
  const cl = document.getElementById('poster-chk');
  items.forEach(t=>{
    const el = document.createElement('div'); el.className='chk-item';
    el.innerHTML = '<div class="chk-box"></div><div>'+t+'</div>';
    el.onclick = ()=>{ el.classList.toggle('checked'); el.querySelector('.chk-box').textContent = el.classList.contains('checked') ? '✓' : ''; };
    cl.appendChild(el);
  });
}

// ── M3 · STAP 4: Teach 1 — lesmateriaal ──
function m3s3(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">📚 Stap 4 van 8 · Teach: lesmateriaal</span></div>
<h2 class="ch2">De Onderwijsmodule: <em>lesmateriaal</em> op maat</h2>
<p class="cp">De <strong>Teach-module</strong> is gebouwd voor leerkrachten en zit in je linkerzijbalk. De tools zijn geordend in vier groepen: <strong>Curriculum planning</strong> (lesplannen), <strong>Modify existing content</strong> (bestaand materiaal aanpassen), <strong>Homework & assessments</strong> (rubrics en quizzen) en <strong>Learning Activities</strong> (interactieve oefeningen). In deze stap werk je met de eerste twee — en niet met oefenmateriaal, maar met <strong>een echte les die je binnenkort geeft</strong>.</p>

<div class="cop-oef">
  <div class="cop-title">⊕ Opdracht A: lesplan voor een echte les</div>
  <div class="cop-steps">
    <div class="cop-step"><div class="cop-step-n">1</div>Open <strong>Teach → Curriculum planning → Lesson plan</strong>.</div>
    <div class="cop-step"><div class="cop-step-n">2</div>Kies een les die je <strong>volgende week effectief geeft</strong>. Vul in: onderwerp, leerjaar, lesduur, en plak de relevante leerplandoelen erbij (bron-bouwsteen!).</div>
    <div class="cop-step"><div class="cop-step-n">3</div>Genereer en lees als vakexpert: kloppen de fasen? Past de timing bij jóuw klas? Sluit het aan bij je leerplan — niet bij een Amerikaans curriculum?</div>
    <div class="cop-step"><div class="cop-step-n">4</div>Itereer: vraag een alternatieve instap, een andere werkvorm voor de kern, of een kortere afsluiter. Vergelijk met hoe jij de les zelf zou opbouwen — en neem het beste van beide.</div>
  </div>
</div>

<div class="cop-oef">
  <div class="cop-title">⊕ Opdracht B: één tekst, drie niveaus (dé verborgen parel)</div>
  <div class="cop-steps">
    <div class="cop-step"><div class="cop-step-n">1</div>Neem een <strong>bestaande leestekst</strong> uit je eigen cursus (zonder persoonsgegevens).</div>
    <div class="cop-step"><div class="cop-step-n">2</div>Open <strong>Teach → Modify existing content → Modify reading level</strong> en plak je tekst. Vraag een eenvoudigere versie voor leerlingen met taalnoden.</div>
    <div class="cop-step"><div class="cop-step-n">3</div>Doe hetzelfde via <strong>Differentiate instructions</strong>: laat je opdrachtinstructies herwerken voor verschillende niveaus in je klas.</div>
    <div class="cop-step"><div class="cop-step-n">4</div>Controleer of de vereenvoudigde versie <strong>inhoudelijk niets wezenlijks verliest</strong> — vereenvoudigen mag het leerdoel niet uithollen. Pas aan waar nodig.</div>
  </div>
</div>

<div class="ib tip">
  <div class="ib-t">💡 Waarom dit zo waardevol is</div>
  <div class="ib-b">Differentiëren op leesniveau is een van de meest tijdrovende klussen in het onderwijs — en een van de plekken waar AI het meest oplevert zonder dat het leerdoel in gevaar komt. Jij blijft bepalen wát er geleerd wordt; Copilot helpt enkel de <em>toegang</em> tot die leerstof verbreden. Dat is "alleen meerwaarde" in de praktijk.</div>
</div>

<div class="nw">
  <button class="sr-btn o" onclick="n3()">Volgende: evalueren & oefenen →</button>
  <span class="nh">Stap 4/8</span>
</div>`;
}

// ── M3 · STAP 5: Teach 2 — evalueren & oefenen ──
function m3s4(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">📝 Stap 5 van 8 · Teach: evalueren & oefenen</span></div>
<h2 class="ch2">Rubrics, quizzen & <em>oefenmateriaal</em></h2>
<p class="cp">Zelfde module, andere groepen: <strong>Homework & assessments</strong> en <strong>Learning Activities</strong>. Hier maak je in enkele minuten wat anders een avond kost — een rubric, een quiz die rechtstreeks naar Microsoft Forms gaat, en interactieve oefensets voor je leerlingen.</p>

<div class="grid3">
  <div class="wcard"><div style="font-size:22px;margin-bottom:8px">📊</div><div class="wc-t">Rubric</div><div class="wc-d">Beoordelingsrubric met consistente criteria bij elke opdracht. Jij bepaalt de criteria, Copilot schrijft de niveaubeschrijvingen uit.</div></div>
  <div class="wcard"><div style="font-size:22px;margin-bottom:8px">❓</div><div class="wc-t">Quiz → Forms</div><div class="wc-d">Genereert quizvragen bij jouw leerstof en exporteert rechtstreeks naar Microsoft Forms — meteen deelbaar en zelfverbeterend.</div></div>
  <div class="wcard"><div style="font-size:22px;margin-bottom:8px">🃏</div><div class="wc-t">Learning Activities</div><div class="wc-d">Flashcards, invuloefeningen (fill in the blanks) en matching-oefeningen om leerstof in te oefenen tot ze zit.</div></div>
</div>

<div class="cop-oef">
  <div class="cop-title">⊕ Opdracht A: rubric bij een bestaande opdracht</div>
  <div class="cop-steps">
    <div class="cop-step"><div class="cop-step-n">1</div>Open <strong>Teach → Homework & assessments → Rubric</strong>.</div>
    <div class="cop-step"><div class="cop-step-n">2</div>Plak de opdracht die je in module 2 AI-bestendig maakte. Vraag een rubric met 4 criteria — en eis dat <strong>"proces & eigen inbreng"</strong> er één van is.</div>
    <div class="cop-step"><div class="cop-step-n">3</div>Kritische check: beoordeelt deze rubric wat <strong>jij</strong> echt belangrijk vindt, of stuurt ze je ongemerkt naar andere accenten? Schrap en herschrijf — de rubric is van jou, niet van Copilot.</div>
  </div>
</div>

<div class="cop-oef">
  <div class="cop-title">⊕ Opdracht B: quiz die meteen in Forms staat</div>
  <div class="cop-steps">
    <div class="cop-step"><div class="cop-step-n">1</div>Open <strong>Teach → Homework & assessments → Quiz</strong> en geef je lesonderwerp + leerjaar mee.</div>
    <div class="cop-step"><div class="cop-step-n">2</div>Genereer 8 vragen en <strong>controleer elke vraag én elk "juist" antwoord</strong> — hallucinaties sluipen ook in quizvragen.</div>
    <div class="cop-step"><div class="cop-step-n">3</div>Exporteer naar <strong>Microsoft Forms</strong>, open het resultaat en test hem zelf in.</div>
  </div>
</div>

<div class="cop-oef">
  <div class="cop-title">⊕ Opdracht C: oefenset voor je leerlingen</div>
  <div class="cop-steps">
    <div class="cop-step"><div class="cop-step-n">1</div>Open <strong>Teach → Learning Activities</strong> en kies <strong>Flashcards</strong>, <strong>Fill in the Blanks</strong> of <strong>Matching</strong> — wat het best past bij jouw leerstof van deze week.</div>
    <div class="cop-step"><div class="cop-step-n">2</div>Genereer een set van 10 items, controleer en verbeter.</div>
    <div class="cop-step"><div class="cop-step-n">3</div>Bedenk waar dit in je les past: als instap-opfrissing, als verwerking of als examenvoorbereiding die leerlingen zelfstandig doorlopen.</div>
  </div>
</div>

<div class="ib warn">
  <div class="ib-t">⚖️ Eén grens blijft overeind</div>
  <div class="ib-b">Copilot mag quizvragen en rubrics <strong>maken</strong> — maar leerlingenwerk <strong>beoordelen</strong> doe jij. Herinner je module 2: AI die evalueert geldt onder de EU AI Act als hoog-risico, en binnen Sint-Rembert ligt de eindverantwoordelijkheid voor elke beoordeling bij de leerkracht. Een rubric uit Copilot is een instrument in jouw handen, geen vervanger ervan.</div>
</div>

<div class="nw">
  <button class="sr-btn o" onclick="n3()">Volgende: bouw je eigen agent →</button>
  <span class="nh">Stap 5/8</span>
</div>`;
}

// ── M3 · STAP 6: agent bouwen ──
function m3s5(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">🤖 Stap 6 van 8 · Agents</span></div>
<h2 class="ch2">Bouw je eigen <em>agent</em></h2>
<p class="cp">Een <strong>agent</strong> is een voorgeconfigureerde mini-Copilot: jij geeft hem één keer vaste instructies, context en eventueel kennisbronnen, en daarna doet hij telkens precies die ene taak — zonder dat je je schoolcontext opnieuw moet uitleggen. Denk aan een lesplan-assistent die jouw leerplan kent, een rapport-helper die jullie vaste feedbackstructuur volgt, of een planner die jullie procedures kent. Eén keer goed bouwen = elke week tijd winnen. En je kan hem <strong>delen met je vakgroep</strong>, zodat iedereen met dezelfde kwaliteit werkt.</p>

<h3 class="ch3">Zo bouw je een agent in 5 stappen</h3>
<div class="bws">
  <div class="bw"><div class="bw-num">1</div><div><div class="bw-lbl">Taak bepalen</div><div class="bw-desc">Kies één specifieke, terugkerende taak. Klein beginnen werkt: een agent die één ding goed doet verslaat een agent die alles half doet.</div></div></div>
  <div class="bw"><div class="bw-num">2</div><div><div class="bw-lbl">Beschrijven in gewone taal</div><div class="bw-desc">Open Agents → New agent en beschrijf wat hij moet doen. Copilot zet jouw beschrijving zelf om in uitgewerkte instructies — geen programmeerkennis nodig.</div></div></div>
  <div class="bw"><div class="bw-num">3</div><div><div class="bw-lbl">Kennis toevoegen</div><div class="bw-desc">Voeg via Configure enkele publieke webbronnen toe waar de agent zich op baseert (bv. leerplanpagina's). Nooit interne documenten met persoonsgegevens.</div></div></div>
  <div class="bw"><div class="bw-num">4</div><div><div class="bw-lbl">Testen & itereren</div><div class="bw-desc">Probeer hem uit met echte voorbeelden via "Try it". Reageert hij niet zoals gewenst? Pas de instructies aan en test opnieuw — iteratie maakt het verschil.</div></div></div>
  <div class="bw"><div class="bw-num">5</div><div><div class="bw-lbl">Delen</div><div class="bw-desc">Tevreden? Deel de agent met je vakgroep of team. Zo bouwt de hele school verder op elkaars beste werk.</div></div></div>
</div>

<div class="cop-oef">
  <div class="cop-title">⊕ Hoofdopdracht: de AI-bestendige-opdrachten-coach (uit module 2!)</div>
  <div class="cop-steps">
    <div class="cop-step"><div class="cop-step-n">1</div>Open <strong>Agents → New agent</strong> in de linkerzijbalk van Copilot.</div>
    <div class="cop-step"><div class="cop-step-n">2</div>Beschrijf je agent in gewone taal. Vertrek gerust van dit voorbeeld en maak het van jou: <em>"Maak een agent die bestaande taken en toetsen van leerkrachten herwerkt zodat leerlingen zelf blijven nadenken. De agent vraagt eerst naar vak, leerjaar en het gewenste AI-label van onze school (1 = geen AI, 2 = ideeën & structuur, 3 = AI-bewerking, 4 = AI + menselijke aanvulling, 5 = AI vrij). Daarna levert hij: de herwerkte opdracht met expliciet AI-kader, afspraken per fase van de opdracht, en 2 reflectievragen die kritisch denken over AI-output uitlokken. Hij vertrekt altijd van de bestaande opdracht en verzint geen nieuwe leerinhoud."</em></div>
    <div class="cop-step"><div class="cop-step-n">3</div>Bekijk onder <strong>Configure</strong> de instructies die Copilot genereerde. Lees ze kritisch en scherp aan waar nodig — dit is prompten op een hoger niveau.</div>
    <div class="cop-step"><div class="cop-step-n">4</div><strong>Test</strong> met de taak die je in module 2 door de checklist haalde. Vergelijk: doet de agent het beter, slechter of anders dan jij? Itereer op de instructies tot de output klopt.</div>
    <div class="cop-step"><div class="cop-step-n">5</div>Werkt hij goed? <strong>Deel hem met je vakgroep</strong> en vertel het je pedagogisch ICT-coördinator — sterke agents verdienen een schoolbreed publiek.</div>
  </div>
</div>

<div class="ib warn">
  <div class="ib-t">⚠️ Spelregels voor agents</div>
  <div class="ib-b">• Kennisbronnen = <strong>publieke webpagina's</strong>. Nooit klaslijsten, rapporten, zorgdossiers of andere documenten met persoonsgegevens.<br>• Een gedeelde agent draagt jouw naam: test grondig vóór je deelt.<br>• De output van een agent blijft AI-output — alle controleregels uit deze cursus blijven gelden.</div>
</div>

<div class="nw">
  <button class="sr-btn o" onclick="n3()">Volgende: kennischeck →</button>
  <span class="nh">Stap 6/8</span>
</div>`;
}

// ── M3 · STAP 7: kennischeck ──
function m3s6(c){
  const quiz = [
    {q:'Je opent Copilot maar ziet het schild-icoon (Protected) niet. Wat doe je?', o:['Gewoon verdergaan, het is maar een icoontje','Uitloggen en opnieuw aanmelden met je schoolaccount — zonder schild geen gegevensbescherming','Een ander AI-platform gebruiken','De pagina herladen en hopen'], a:1, f:'Het schild bevestigt dat je via je schoolaccount met gegevensbescherming werkt. Zonder schild werk je mogelijk op een persoonlijk account — en gelden de waarborgen niet.'},
    {q:'Je genereert een poster en de tekst erop bevat een spelfout. Wat is de juiste reflex?', o:['Negeren, niemand ziet het','De tekst verbeteren via Edit text — gegenereerde tekst in afbeeldingen bevat geregeld fouten','Opnieuw genereren tot het toevallig juist is','Beeldgeneratie voortaan vermijden'], a:1, f:'Beeldgeneratoren maken vaak taalfouten in afbeeldingen. Altijd controleren en via Edit text verbeteren — zeker bij materiaal dat in je klas hangt.'},
    {q:'Je hebt één sterke leestekst maar leerlingen met heel verschillende leesniveaus. Welke tool?', o:['Create → Design a poster','Teach → Modify existing content → Modify reading level','Agents → New agent','Library → Images'], a:1, f:'Modify reading level herschrijft je bestaande tekst op een ander leesniveau — een van de krachtigste differentiatietools in de Teach-module.'},
    {q:'Waar gaat een quiz uit de Teach-module naartoe bij export?', o:['Naar een Word-document dat je daarna zelf nog moet omzetten','Rechtstreeks naar Microsoft Forms, meteen deelbaar en zelfverbeterend','Rechtstreeks naar Smartschool als oefentoets','Nergens — hij blijft enkel binnen Copilot raadpleegbaar'], a:1, f:'De Quiz-tool exporteert rechtstreeks naar Microsoft Forms. Wel eerst elke vraag én elk "juist" antwoord controleren — hallucinaties sluipen ook in quizvragen.'},
    {q:'Wat is een Copilot-agent?', o:['Een aparte AI die op een ander, krachtiger taalmodel draait dan Copilot Chat','Een voorgeconfigureerde Copilot met jouw vaste instructies en context, herbruikbaar en deelbaar','Een assistent die volledig zelfstandig taken uitvoert zonder dat jij nog iets hoeft te vragen of te controleren','Een chatbot die je voor leerlingen klaarzet zodat de leerkracht niet meer hoeft te antwoorden'], a:1, f:'Een agent is gewoon Copilot mét jouw vaste instructies — geen krachtiger model, geen autonoom systeem en zeker geen vervanger van de leerkracht. Alle controleregels uit deze cursus blijven onverkort gelden.'},
    {q:'Wat hoort NIET thuis in de kennisbronnen van een agent?', o:['Een publieke leerplanpagina','Interne documenten met persoonsgegevens, zoals klaslijsten of zorgdossiers','Een publieke pagina over didactiek','De website van de school'], a:1, f:'Kennisbronnen zijn publieke webpagina\'s. Documenten met persoonsgegevens horen nooit in een AI-tool — ook niet in een agent, ook niet via het schoolaccount.'},
    {q:'Wat is de slimste aanpak bij je eerste agent?', o:['Meteen één super-agent voor al je taken bouwen','Klein beginnen met één specifieke taak, testen met echte voorbeelden en stap voor stap verfijnen','De instructies van een collega kopiëren zonder te testen','Wachten tot Microsoft kant-en-klare agents levert'], a:1, f:'Eén taak, echte testvoorbeelden, itereren. Een agent die één ding goed doet verslaat een agent die alles half doet — uitbreiden kan altijd nog.'},
  ];
  rQuiz(c, quiz, 3, 'mod3', n3, 70);
}

// ── M3 · STAP 8: promptbibliotheek + slot ──
function m3s7(c){
  const prompts = [
    ['Misconceptie-scan', 'Je bent een ervaren didacticus voor [vak]. Ik geef les over [concept] aan [leerjaar].\n1. Som 5 typische misconcepties op, telkens met uitleg waarom leerlingen die hebben.\n2. Geef per misconceptie 1 diagnosevraag + het verwachte foute antwoord.\n3. Ontwerp een micro-remediëring van 10 min voor de twee hardnekkigste.\nOutput: tabel (misconceptie | diagnosevraag | aanpak) + kort 10-minutenplan.'],
    ['Leestekst op 3 niveaus', 'Maak een leestekst over [onderwerp] voor [leerjaar] op 3 niveaus: basis, standaard, verdieping.\nPer niveau: tekst (max 180 woorden) + 5 kernwoorden + 3 begripsvragen.\nExtra: 2 tips voor zorgleerlingen + 1 verrijkingstaak voor snelle leerlingen.'],
    ['Feedback op anonieme tekst', 'Ik geef je zo een beoordelingsrubric en een GEANONIMISEERDE leerlingtekst.\nSchrijf leerlingvriendelijke feedback volgens feed-up (doel), feedback (wat lukt al / nog niet) en feed-forward (volgende stap). Max 120 woorden, warm en motiverend, spreek de leerling aan met "je".\nGeef daarnaast aparte leerkrachtnotities: 3 observaties + 2 instructietips.'],
    ['Exit-ticket met analyse', 'Ontwerp een exit-ticket voor [onderwerp] (les van [duur] min, [leerjaar]).\nInhoud: 2 checkvragen, 1 toepassingsvraag, 1 zelfinschattingsvraag.\nGeef ook: correctiesleutel + de foutpatronen die ik waarschijnlijk zal zien + wat ik morgen best kort herhaal.'],
    ['Heldere instructies in 3 versies', 'Ik geef je zo een opdrachtinstructie. Herschrijf ze in 3 versies:\n1. Superkort en helder (max 80 woorden).\n2. Met extra structuur: genummerde stappen + een afvinkbare checklist.\n3. Taalsteunversie: korte zinnen + woordenlijst met 8 moeilijke woorden uitgelegd.\nBehoud telkens de bedoeling en de evaluatie-eisen. Vraag eerst naar mijn instructie als ik ze nog niet gaf.'],
    ['Klasgesprek met rollen', 'Ontwerp een gestructureerd klasgesprek over de stelling: [stelling] voor [leerjaar] in [vak].\nLever: 5 openingsvragen (van eenvoudig naar verdiepend), 4 rolkaarten (samenvatter, doorvrager, bronnenbewaker, bruggenbouwer) met voorbeeldzinnen, een korte observatiechecklist voor mij, en als afsluiter 1 reflectievraag + 1 schrijfopdracht van 5 minuten.'],
  ];
  let cards = '';
  prompts.forEach(p=>{
    cards += '<div class="pc"><div class="pc-head"><div class="pc-title">'+p[0]+'</div><button class="pc-copy" data-p="'+encodeURIComponent(p[1])+'">📋 Kopieer</button></div><div class="pc-body">'+p[1]+'</div></div>';
  });
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">🎯 Stap 8 van 8 · Promptbibliotheek & slot</span></div>
<h2 class="ch2">Jouw <em>startbibliotheek</em> met EDU-prompts</h2>
<p class="cp">Zes beproefde promptsjablonen voor de klaspraktijk. Kopieer, vervang de [haakjes] door jouw vak en leerjaar, en plak in Copilot. Onthoud: <strong>nooit persoonsgegevens</strong> — werk altijd met geanonimiseerde teksten. En bewaar je eigen toppers erbij: zo groeit dit uit tot jouw persoonlijke bibliotheek.</p>
${cards}

<h3 class="ch3">🎯 Slotopdracht</h3>
<p class="cp" style="margin-bottom:12px">Kijk terug op de hele module. Noteer: welke opdracht leverde jou het meest op (poster, lesplan, leesniveaus, rubric, quiz, agent)? Wat ga je vanaf nu wekelijks gebruiken? En wat deel je met je vakgroep?</p>
<textarea class="sr-ta" id="r2" placeholder="Meest opgeleverd: ...&#10;Wekelijks gebruiken: ...&#10;Delen met mijn vakgroep: ..."></textarea>

<div class="ib ok">
  <div class="ib-t">🎉 Verdieping voltooid!</div>
  <div class="ib-b">Je hebt nu alles in handen: prompten, visueel materiaal, de volledige Teach-module en je eigen agent. Breng het in de praktijk, deel je beste prompts en agents met collega's, en geef je ervaringen door aan je pedagogisch ICT-coördinator. Zo bouwen we samen aan een slimme, verantwoorde AI-cultuur binnen Sint-Rembert.</div>
</div>

${promoMini('Smaakt dit naar meer? In het <strong style="color:white">sporenaanbod met Howest</strong> ga je hier doorheen het schooljaar mee verder — praktische workshops op jouw niveau, van Copilot-starter tot gevorderd werken met agents. En op <strong style="color:white">18 november</strong>: keynote van prof. Orhan Agirdag over AI en ethiek.')}

<div class="nw">
  <button class="sr-btn o" onclick="sR2()">✅ Optionele module afronden →</button>
  <span class="nh">Geen invloed op je certificaat</span>
</div>`;
  c.querySelectorAll('.pc-copy').forEach(b=>{
    b.onclick = ()=>{
      navigator.clipboard.writeText(decodeURIComponent(b.dataset.p)).then(()=>{
        b.textContent='✅ Gekopieerd!'; setTimeout(()=>b.textContent='📋 Kopieer',2000);
      }).catch(()=>{ alert('Kopiëren mislukt — selecteer de tekst handmatig.'); });
    };
  });
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
  wrap.innerHTML = '<div class="s-badge">📝 Kennischeck</div><h2 class="ch2">Test je <em>kennis</em></h2><p class="cp">Beantwoord alle vragen. Je hebt minstens <strong>'+pass+'%</strong> nodig om verder te gaan. Niet gelukt? Geen stress — je kan de quiz gewoon opnieuw doen.</p>';
  const d = document.createElement('div'); d.className='qc';
  let inner = '<div class="qh"><div class="qi">📝</div><div><div class="qt">Kennischeck — '+(modN===3?'optionele module':'module '+modN)+'</div><div class="qs">'+qs.length+' vragen · slaagdrempel '+pass+'%</div></div></div>';
  qs.forEach((q,qi)=>{
    inner += '<div class="qb"><div class="qq">'+(qi+1)+'. '+q.q+'</div><div class="opts">';
    q.o.forEach((opt,oi)=>{
      inner += '<button class="opt" data-qi="'+qi+'" data-oi="'+oi+'" id="'+id+'-o'+qi+'-'+oi+'"><span class="ol">'+String.fromCharCode(65+oi)+'</span>'+opt+'</button>';
    });
    inner += '</div><div class="fb" id="'+id+'-f'+qi+'"></div></div>';
  });
  inner += '<div class="q-res" id="'+id+'-r"></div><button class="q-next" id="'+id+'-n" disabled>Controleer & ga verder →</button>';
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
    r.innerHTML = '<div class="q-score '+(ok?'pass':'fail')+'">'+sc+'%</div><div class="q-msg">'+(ok?'✅ Geslaagd! Klik om verder te gaan.':'❌ Nog niet geslaagd. Lees de feedback bij de vragen en probeer opnieuw.')+'</div>';
    S[sk].quizScore = sc; ss();
    const nb = document.getElementById(id+'-n');
    if(ok){ nb.textContent = 'Verder →'; nb.onclick = ()=>onComplete(); }
    else { nb.textContent = '↺ Quiz opnieuw doen'; nb.onclick = ()=>{ if(sk==='mod1') rm1(); else if(sk==='mod2') rm2(); else rm3(); document.getElementById('main').scrollTo(0,0); }; }
  };
}
