/* ════════════════════════════════════════════
   AI-Cursus Sint-Rembert — script.js
   Modules: 1 Wat is AI (verplicht) · 2 Beleid & Leerlingen (verplicht)
            3 Copilot in de praktijk (OPTIONEEL, laatste)
   Certificaat: na module 1+2, slechts 1× downloadbaar
   ════════════════════════════════════════════ */

// ── STATE ──
const K = 'sr_ai_v6';
let S = { name:'', mod1:{step:0,done:false}, mod2:{step:0,done:false}, mod3:{step:0,done:false}, certPrinted:false };
function ld(){ try{ const s = localStorage.getItem(K); if(s) S = Object.assign(S, JSON.parse(s)); }catch(e){} }
function ss(){ try{ localStorage.setItem(K, JSON.stringify(S)); }catch(e){} }
ld();

document.getElementById('un').value = S.name || '';
function ua(){ const n = (document.getElementById('un').value||'').trim(); document.getElementById('av').textContent = n ? n.charAt(0).toUpperCase() : '?'; }
function sn(){ S.name = document.getElementById('un').value.trim(); ss(); ua(); }
ua(); up(); rmc();

// ── PROGRESS / NAV STATE ──
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

// ── VIEW SWITCHING ──
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
  for(let i=0;i<tot;i++){ const d=document.createElement('div'); d.className='dot '+(i<cur?'done':i===cur?'active':''); c.appendChild(d); }
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
   MODULE 1 — WAT IS AI?  (5 stappen)
   ════════════════════════════════════════════ */
const m1 = [m1s0, m1s1, m1s2, m1s3, m1s4];
function rm1(){ const c=document.getElementById('m1c'); c.innerHTML=''; rDots(1,m1.length,S.mod1.step); m1[S.mod1.step](c); }
function n1(){ S.mod1.step++; ss(); S.mod1.step>=m1.length ? d1() : rm1(); document.getElementById('main').scrollTo(0,0); }
function d1(){ S.mod1.done=true; S.mod1.step=0; ss(); up(); rmc(); sv('home'); setTimeout(()=>alert('🎉 Module 1 voltooid! Module 2 is nu beschikbaar.'),300); }

// ── M1 · STAP 1: AI overal ──
function m1s0(c){
  c.innerHTML = `
<div class="s-badge">🤖 Stap 1 van 5 · AI overal</div>
<h2 class="ch2">AI is <em>overal</em> — ook al zie je het niet</h2>
<p class="cp">Gezichtsherkenning op je telefoon, de spamfilter in je mailbox, aanbevelingen op YouTube, de routeplanner die files voorspelt — <strong>AI zit al jaren in onze dagelijkse tools</strong>. En sinds de doorbraak van ChatGPT eind 2022 ook steeds nadrukkelijker in het onderwijs: leerlingen gebruiken chatbots voor taken, uitgeverijen bouwen AI in leerplatformen in, en collega's experimenteren met AI voor lesvoorbereiding.</p>
<p class="cp">Maar wat is AI eigenlijk? En wanneer is iets AI, en wanneer niet? Als leerkracht hoef je geen ingenieur te zijn, maar je moet AI wel kunnen <strong>herkennen, benoemen en er verantwoord mee omgaan</strong>. Dat is ook wat artikel 4 van de EU AI Act van organisaties — en dus van ons als school — verwacht: voldoende AI-geletterdheid bij iedereen die met AI werkt.</p>
<p class="cp">In Vlaanderen en Nederland bouwen organisaties zoals het <strong>Kenniscentrum Digisprong</strong> (Vlaamse overheid), het <strong>Kenniscentrum Data & Maatschappij</strong> en <strong>Kennisnet</strong> kaders en materiaal om scholen hierbij te ondersteunen. Deze cursus sluit daar bewust op aan — de bronnen onderaan elke stap verwijzen ernaar.</p>

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
  <div class="cop-title">⊕ Mini-opdracht voor vandaag (5 min)</div>
  <div class="cop-steps">
    <div class="cop-step"><div class="cop-step-n">1</div>Noteer <strong>3 momenten van vandaag</strong> waarop jij (waarschijnlijk onbewust) AI gebruikte.</div>
    <div class="cop-step"><div class="cop-step-n">2</div>Vraag het morgen ook eens aan je leerlingen als lesopener — je zal verbaasd zijn hoeveel ze er vinden. Een ideaal vertrekpunt voor een klasgesprek over AI.</div>
  </div>
</div>

<div class="bronnen-box">
  <div class="bronnen-title">📚 Bronnen & verdieping</div>
  <div class="bron-row">
    <a href="https://www.vrt.be/vrtnws/nl/2019/09/17/artificiele-intelligentie/" target="_blank" class="bron-tag">EDUbox AI (VRT NWS)</a>
    <a href="https://www.kennisnet.nl" target="_blank" class="bron-tag">Kennisnet</a>
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

// ── M1 · STAP 2: GenAI & hallucinaties ──
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
    <div class="box-h-bad">❌ Voorbeeld van een hallucinatie</div>
    <div class="box-body" style="font-style:italic">"Volgens een studie van prof. K. Van Damme (UGent, 2021) verdubbelt AI-gebruik de leerresultaten van leerlingen in het secundair onderwijs."<br><br><span style="color:var(--red);font-size:11px">→ Klinkt academisch, is volledig verzonnen. Zo'n studie bestaat niet.</span></div>
  </div>
  <div class="box-good">
    <div class="box-h-good">✅ Wat leert ons dit?</div>
    <div class="box-body">AI-tools klinken altijd even zeker, of ze nu juist of fout zitten. Jij bent het kritische filter. Check feiten, studies, namen en datums vooraleer je AI-output gebruikt in lesmateriaal, communicatie of evaluatie. Dat is exact de geletterdheid die de EU AI Act bedoelt.</div>
  </div>
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
  <div class="cop-title">⊕ Doe-opdracht: betrap de AI op een fout (10 min)</div>
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

// ── M1 · STAP 3: kansen, gevaren, bias ──
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
    {q:'Wat is een hallucinatie bij generatieve AI?', o:['De AI weigert te antwoorden','De AI genereert overtuigende maar foute informatie','De AI werkt tijdelijk traag','De AI herhaalt letterlijk zijn trainingsdata'], a:1, f:'Hallucinaties zijn plausibel klinkende maar foutieve output — een direct gevolg van het voorspellen op kansberekening. Daarom: altijd verifiëren.'},
    {q:'Welke AI-tool is binnen Sint-Rembert volledig ondersteund en dataproof?', o:['ChatGPT (gratis versie)','Google Gemini','Copilot M365 met schoolaccount','Midjourney'], a:2, f:'Copilot M365 via je schoolaccount valt onder de schoolovereenkomst met gegevensbescherming. Andere tools mogen nooit persoonsgegevens of schooldocumenten krijgen.'},
    {q:'Wat is de grote sprong van generatieve AI t.o.v. eerdere AI?', o:['Ze werkt sneller','Ze kan nieuwe content creëren (tekst, beeld, audio, code)','Ze verbruikt minder energie','Ze maakt nooit fouten'], a:1, f:'Vroegere AI classificeerde en voorspelde; GenAI creëert. Dat raakt rechtstreeks aan taken, evaluatie en leren in jouw klas.'},
    {q:'Waarom is bias in AI relevant voor jouw lespraktijk?', o:['AI is altijd neutraal, dus niet relevant','AI reproduceert stereotypen uit trainingsdata — een mediawijsheidsthema voor de klas','Bias komt enkel voor in betalende tools','Bias maakt AI enkel trager'], a:1, f:'AI leert van data vol menselijke vooroordelen. Dit expliciet bespreken met leerlingen is een van de waardevolste AI-lessen die je kan geven.'},
    {q:'Een AI-tekst vermeldt een wetenschappelijke studie met auteur en jaartal. Wat doe je?', o:['Overnemen — met bron is het betrouwbaar','De bron zelf opzoeken en controleren of die echt bestaat','Enkel het jaartal controleren','Aan de AI vragen of de bron klopt'], a:1, f:'Verzonnen bronvermeldingen zijn een klassieke hallucinatie. Zelf verifiëren via betrouwbare kanalen is de enige juiste reflex — aan de AI zelf vragen is niet betrouwbaar.'},
  ];
  rQuiz(c, quiz, 1, 'mod1', n1, 60);
}

// ── M1 · STAP 5: activerende reflectie ──
function m1s4(c){
  c.innerHTML = `
<div class="s-badge">✍️ Stap 5 van 5 · Vertaalslag naar jouw vak</div>
<h2 class="ch2">Vertaal naar <em>jouw lespraktijk</em></h2>
<p class="cp">Je weet nu wat AI is, hoe generatieve AI werkt en waar de risico's zitten. Kennis wordt pas waardevol als je ze <strong>vertaalt naar je eigen klas</strong>. De kernvraag is niet "gebruik ik AI of niet?", maar: <strong>op welk moment voegt AI écht iets toe aan mijn onderwijs — en wanneer net niet?</strong></p>
<p class="cp">Leerkrachten die dit vooraf voor zichzelf scherpstellen, staan veel sterker in gesprekken met leerlingen over verantwoord gebruik. Bovendien is jouw antwoord op deze vraag straks de basis voor het AI-label dat je aan taken koppelt (module 2).</p>

<div class="cop-oef">
  <div class="cop-title">⊕ Reflectie-opdracht (10 min) — verplicht onderdeel</div>
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
  <div class="ib-b">In module 2 leer je het AI-beleid van Sint-Rembert kennen — de 5 AI-labels, de transparantieregels en hoe je leerlingen concreet begeleidt. Jouw reflectie van zonet komt daar meteen van pas.</div>
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
  if(v.length < 30){ alert('Vul eerst je reflectie in (minstens een paar zinnen). Zo activeer je wat je leerde — dat is het hele punt van deze stap. 😉'); return; }
  n1();
}

/* ════════════════════════════════════════════
   MODULE 2 — BELEID & LEERLINGEN BEGELEIDEN (4 stappen)
   ════════════════════════════════════════════ */
const m2 = [m2s0, m2s1, m2s2, m2s3];
function rm2(){ const c=document.getElementById('m2c'); c.innerHTML=''; rDots(2,m2.length,S.mod2.step); m2[S.mod2.step](c); }
function n2(){ S.mod2.step++; ss(); S.mod2.step>=m2.length ? d2() : rm2(); document.getElementById('main').scrollTo(0,0); }
function d2(){ S.mod2.done=true; S.mod2.step=0; ss(); up(); rmc(); sv('cert'); }

// ── M2 · STAP 1: spelregels, labels, AI Act ──
function m2s0(c){
  c.innerHTML = `
<div class="s-badge">🛡️ Stap 1 van 4 · Spelregels & AI-labels</div>
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
  <div class="cop-title">⊕ Doe-opdracht: label je volgende taak (5 min)</div>
  <div class="cop-steps">
    <div class="cop-step"><div class="cop-step-n">1</div>Neem de <strong>eerstvolgende taak</strong> die je aan een klas geeft in gedachten.</div>
    <div class="cop-step"><div class="cop-step-n">2</div>Kies bewust een van de 5 labels. Vraag jezelf: <em>welke competentie moet deze taak aantonen, en verstoort AI dat bewijs?</em></div>
    <div class="cop-step"><div class="cop-step-n">3</div>Communiceer het label expliciet bij de opdracht — op papier, in Smartschool of op het bord.</div>
  </div>
</div>

<div class="bronnen-box">
  <div class="bronnen-title">📚 Bronnen & verdieping</div>
  <div class="bron-row">
    <a href="https://data-en-maatschappij.ai" target="_blank" class="bron-tag">Data & Maatschappij: AI Act-tool</a>
    <a href="https://onderwijs.vlaanderen.be" target="_blank" class="bron-tag">Kenniscentrum Digisprong (Vlaanderen)</a>
    <a href="https://www.kennisnet.nl" target="_blank" class="bron-tag">Kennisnet: AI-beleid</a>
  </div>
</div>

<div class="nw">
  <button class="sr-btn g" onclick="n2()">Volgende: leerlingen begeleiden →</button>
  <span class="nh">Stap 1/4</span>
</div>`;
}

// ── M2 · STAP 2: leerlingen begeleiden ──
function m2s1(c){
  c.innerHTML = `
<div class="s-badge">🧑‍🏫 Stap 2 van 4 · Leerlingen begeleiden</div>
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

<div class="cop-oef">
  <div class="cop-title">⊕ Doe-opdracht: plan één AI-gesprek (5 min)</div>
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
  <button class="sr-btn g" onclick="n2()">Volgende: kennischeck →</button>
  <span class="nh">Stap 2/4</span>
</div>`;
}

// ── M2 · STAP 3: quiz ──
function m2s2(c){
  const quiz = [
    {q:'Een leerling gebruikt AI bij een taak met label 1 ("Geen AI"). Wat doe je?', o:['Negeren — iedereen doet het','Behandelen als een onregelmatigheid conform het schoolreglement','Stilzwijgend punten aftrekken','Voortaan alle taken op papier geven'], a:1, f:'Label 1 = volledig verbod. AI-gebruik is dan een onregelmatigheid die je volgens het schoolreglement behandelt. Consistentie is cruciaal voor de geloofwaardigheid van het hele labelsysteem.'},
    {q:'Een leerling vraagt: "Hebt u dit lesplan met AI gemaakt?" Beste reactie?', o:['Ontkennen om je gezag te bewaren','Eerlijk antwoorden en uitleggen hoe je het gebruikte en controleerde','Zeggen dat dat de leerling niet aangaat','Het onderwerp veranderen'], a:1, f:'Transparantie is een kernprincipe — ook voor jou. Eerlijk antwoorden maakt je een geloofwaardig rolmodel en is meteen een mediawijsheidsles.'},
    {q:'Wat moeten leerlingen ALTIJD vermelden bij AI-gebruik (labels 2 t/m 5)?', o:['Niets, dat is privé','Welke AI-middelen ze gebruikten en hoe','Enkel de naam van de tool','Enkel als de leerkracht er expliciet om vraagt'], a:1, f:'Transparantie is verplicht: leerlingen noteren welke AI-middelen ze gebruikten en hoe (bundel onderzoeksvaardigheden). De leerling blijft bovendien zelf verantwoordelijk voor het werk.'},
    {q:'Een collega wil leerlingenteksten mét namen door een AI-detectietool halen om fraude te bewijzen. Wat is het belangrijkste bezwaar?', o:['Detectietools zijn te duur','Detectietools zijn onbetrouwbaar én je voert persoonsgegevens in een niet-goedgekeurde tool in','Het kost te veel tijd','Er is geen bezwaar'], a:1, f:'Dubbel probleem: AI-detectie is aantoonbaar onbetrouwbaar (vals-positieven!) én leerlingwerk met namen uploaden schendt de spelregels rond persoonsgegevens.'},
    {q:'Je wil AI-feedback op de tekst van leerling "Jonas D.". Wat doe je?', o:['Naam en tekst integraal in ChatGPT plakken','De tekst anonimiseren en dan Copilot M365 met schoolaccount gebruiken','Nooit AI gebruiken voor feedback','Een gratis tool gebruiken, dat gaat sneller'], a:1, f:'Geanonimiseerde teksten mogen in Copilot M365 via je schoolaccount. Namen van leerlingen horen nooit in een AI-tool — ook niet in de goedgekeurde.'},
    {q:'Waarom geldt AI die leerlingen evalueert als "hoog-risico" onder de EU AI Act?', o:['Omdat ze duur is','Omdat zulke beslissingen grote impact hebben op iemands toekomst — de eindverantwoordelijkheid blijft bij de mens','Omdat ze veel stroom verbruikt','Dat klopt niet, evaluatie-AI is minimaal risico'], a:1, f:'Beslissingen over leerresultaten en toelating bepalen iemands kansen. Daarom: AI mag jou ondersteunen, maar evalueren doe jij. Altijd.'},
  ];
  rQuiz(c, quiz, 2, 'mod2', n2, 70);
}

// ── M2 · STAP 4: scenario's + afronding ──
function m2s3(c){
  c.innerHTML = `
<div class="s-badge">🏁 Stap 4 van 4 · Praktijkscenario's & afronding</div>
<h2 class="ch2">Wat doe jij? — <em>Praktijkscenario's</em></h2>
<p class="cp">Tot slot: drie situaties die je als leerkracht bij Sint-Rembert reëel kan tegenkomen. Kies telkens de beste reactie.</p>
<div id="sc-con"></div>

<h3 class="ch3">✍️ Afsluitende reflectie</h3>
<p class="cp" style="margin-bottom:10px">Formuleer <strong>één concrete stap</strong> die jij de komende maand zet rond AI in jouw lespraktijk:</p>
<textarea class="sr-ta" id="r3" placeholder="Ik ga bij mijn lessen [vak] het AI-label duidelijk communiceren door...&#10;Of: ik voer het klasgesprek over ... in de week van ...&#10;Of: ik herwerk taak ... zodat het leerproces zichtbaarder wordt..."></textarea>

<div class="ib ok">
  <div class="ib-t">🎉 Bijna klaar!</div>
  <div class="ib-b">Na het afronden ontvang je je certificaat. <strong>Let op: je kan het maar één keer downloaden</strong> — controleer dus eerst je naam in de zijbalk. Daarna upload je het op Smartschool. Zin in meer? De optionele module <strong>"Copilot in de praktijk"</strong> staat voor je klaar — niet verplicht, wél de moeite.</div>
</div>

<div class="nw">
  <button class="sr-btn g" onclick="sR3()">🏆 Afronden & certificaat ontvangen →</button>
  <span class="nh">Upload daarna op Smartschool</span>
</div>`;
  const sc = [
    {t:'Een collega wil een klasrapport mét leerlingennamen uploaden naar gratis ChatGPT om snel een samenvatting te krijgen. "Het is toch maar intern", zegt ze.', o:['Prima — het blijft binnen de school','Niet doen: persoonsgegevens in een niet-goedgekeurde tool schendt de AI-spelregels. Wijs haar op Copilot M365 + anonimiseren','Mag, als ze haar privé-mailadres gebruikt','Mag, als ze het rapport daarna verwijdert uit de chat'], c:1, e:'Schooldocumenten met persoonsgegevens horen nooit in niet-goedgekeurde tools — "intern aanvoelen" verandert daar niets aan. Het juiste alternatief: anonimiseren en Copilot M365 met schoolaccount gebruiken.'},
    {t:'Een leerling meldt achteraf eerlijk: "Ik gebruikte AI voor mijn taak (label 2), maar vergat het te vermelden bij de indiening."', o:['Negeren — het resultaat telt','De transparantieverplichting is geschonden; je spreekt de leerling erop aan en handelt naargelang context en schoolreglement','Automatisch een nul, einde discussie','Niets doen omdat de leerling het zelf kwam zeggen'], c:1, e:'Transparantie is een kernprincipe en niet vrijblijvend. Tegelijk weeg je context mee: eerlijk komen melden verdient een ander gevolg dan betrapt worden. Maar zomaar negeren ondermijnt het systeem.'},
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
  if(v.length < 20){ alert('Formuleer eerst je concrete actiestap — dat is je persoonlijke vertaalslag van deze module.'); return; }
  n2();
}

/* ════════════════════════════════════════════
   MODULE 3 — COPILOT IN DE PRAKTIJK (OPTIONEEL, 4 stappen)
   ════════════════════════════════════════════ */
const m3 = [m3s0, m3s1, m3s2, m3s3];
function rm3(){ const c=document.getElementById('m3c'); c.innerHTML=''; rDots(3,m3.length,S.mod3.step); m3[S.mod3.step](c); }
function n3(){ S.mod3.step++; ss(); S.mod3.step>=m3.length ? d3() : rm3(); document.getElementById('main').scrollTo(0,0); }
function d3(){ S.mod3.done=true; S.mod3.step=0; ss(); up(); rmc(); sv('home'); setTimeout(()=>alert('🎉 Optionele verdieping voltooid — sterk! Breng het nu in de praktijk en deel je ervaringen met collega\'s.'),300); }

// ── M3 · STAP 1: rondleiding ──
function m3s0(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel — niet verplicht voor je certificaat</span><span class="s-badge">✨ Stap 1 van 4 · Rondleiding</span></div>
<h2 class="ch2">Copilot M365 — <em>jouw AI-assistent</em></h2>
<p class="cp">Copilot Chat zit <strong>inbegrepen in je Microsoft 365-schoolaccount</strong> — je hebt niets extra nodig. Het is binnen Sint-Rembert de enige volledig ondersteunde, dataproof AI-tool. In deze optionele verdieping ga je er écht mee aan de slag: prompts schrijven, de Teach-module verkennen en kant-en-klare EDU-prompts meenemen naar je klas.</p>

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

<h3 class="ch3">De 4 onderdelen van Copilot voor leerkrachten</h3>
<div class="grid2">
  <div class="wcard"><div style="font-size:22px;margin-bottom:8px">💬</div><div class="wc-t">Chat</div><div class="wc-d">Je AI-sparringpartner voor vragen, ideeën en eerste versies. Via je schoolaccount met gegevensbescherming: je invoer wordt niet gebruikt om modellen te trainen.</div></div>
  <div class="wcard"><div style="font-size:22px;margin-bottom:8px">🎨</div><div class="wc-t">Create</div><div class="wc-d">Afbeeldingen en visuals genereren voor aantrekkelijk lesmateriaal — zonder designkennis. Denk aan illustraties bij een leestekst of een quiz.</div></div>
  <div class="wcard"><div style="font-size:22px;margin-bottom:8px">📚</div><div class="wc-t">Teach</div><div class="wc-d">Speciaal voor leerkrachten: lesplannen, rubrics, quizzen, leesteksten op niveau. Beschikbaar met een M365 Education-licentie — geen betaalde Copilot-licentie nodig.</div></div>
  <div class="wcard"><div style="font-size:22px;margin-bottom:8px">🤖</div><div class="wc-t">Agents</div><div class="wc-d">Bouw een mini-Copilot met jouw vaste instructies (vak, leerjaar, rapportstructuur). Eén keer instellen, telkens hergebruiken — en deelbaar met collega's.</div></div>
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
<a href="https://support.microsoft.com/nl-nl/topic/lesgeven-in-de-microsoft-365-copilot-app-c4b05fdd-527f-4f85-9775-afb0781a9178" target="_blank" class="ms-card">
  <div class="ms-src">Microsoft Support</div>
  <div class="nws-title">De Teach-module: officiële documentatie</div>
  <div class="nws-desc">Welke onderwijstools zitten in Teach en hoe gebruik je ze — rechtstreeks van de bron.</div>
</a>

<div class="cop-oef">
  <div class="cop-title">⊕ Doe-opdracht: open Copilot — nu meteen</div>
  <div class="cop-steps">
    <div class="cop-step"><div class="cop-step-n">1</div>Ga naar <strong>copilot.microsoft.com</strong> en log in met je <strong>schoolaccount</strong>.</div>
    <div class="cop-step"><div class="cop-step-n">2</div>Controleer het <strong>schild-icoon (Protected)</strong> bovenaan — dat bevestigt de gegevensbescherming via je schoolaccount. Zie je het niet? Log uit en opnieuw in met het juiste account.</div>
    <div class="cop-step"><div class="cop-step-n">3</div>Zoek de <strong>Teach-sectie</strong> en bekijk welke onderwijstools beschikbaar zijn.</div>
    <div class="cop-step"><div class="cop-step-n">4</div>Stel je eerste vraag: <em>"Welke onderwijstools zijn hier beschikbaar en waarvoor dienen ze?"</em></div>
  </div>
</div>

<div class="nw">
  <button class="sr-btn o" onclick="n3()">Volgende: prompts schrijven →</button>
  <span class="nh">Stap 1/4</span>
</div>`;
}

// ── M3 · STAP 2: prompting ──
function m3s1(c){
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">✍️ Stap 2 van 4 · Prompting</span></div>
<h2 class="ch2">Het geheim zit in <em>je prompt</em></h2>
<p class="cp">Een goede prompt is als een goede instructie aan een nieuwe collega: <strong>duidelijk, met context en een verwacht resultaat</strong>. Vaag erin = vaag eruit. Specifiek erin = direct bruikbaar eruit. Vijf bouwstenen maken het verschil:</p>

<div class="bws">
  <div class="bw"><div class="bw-num">1</div><div><div class="bw-lbl">🎭 Rol</div><div class="bw-desc">Welke expertise neemt Copilot aan? "Je bent een ervaren didacticus wiskunde in het secundair onderwijs..."</div></div></div>
  <div class="bw"><div class="bw-num">2</div><div><div class="bw-lbl">🎯 Taak</div><div class="bw-desc">Wat moet er concreet gebeuren? "Schrijf een lesplan van 50 minuten..." / "Maak 10 oefeningen over..."</div></div></div>
  <div class="bw"><div class="bw-num">3</div><div><div class="bw-lbl">📍 Context</div><div class="bw-desc">Voor wie, in welke situatie? "...voor het 4e jaar, voorkennis X, gemengde klas met 2 zorgleerlingen."</div></div></div>
  <div class="bw"><div class="bw-num">4</div><div><div class="bw-lbl">📂 Broninfo</div><div class="bw-desc">Wat geef je mee? Eindtermen, een bestaande tekst, het thema van vorige les... (nooit persoonsgegevens!)</div></div></div>
  <div class="bw"><div class="bw-num">5</div><div><div class="bw-lbl">📋 Formaat</div><div class="bw-desc">Hoe moet de output eruitzien? "Tabel, max 400 woorden, differentiatie als aparte kolom."</div></div></div>
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

<div class="ib tip">
  <div class="ib-t">💡 Pro-tip: itereren loont</div>
  <div class="ib-b">Je eerste prompt hoeft niet perfect te zijn. Reageer op de output: "korter", "moeilijker", "voeg een voorbeeld toe uit de leefwereld van 15-jarigen", "herschrijf op B1-niveau". Copilot onthoudt de context binnen het gesprek — gebruik dat.</div>
</div>

<div class="cop-oef">
  <div class="cop-title">⊕ Doe-opdracht: schrijf 3 prompts voor jouw vak (15 min)</div>
  <div class="cop-steps">
    <div class="cop-step"><div class="cop-step-n">1</div>Schrijf in Copilot een prompt voor <strong>een lesplan</strong> in jouw vak — met alle 5 bouwstenen.</div>
    <div class="cop-step"><div class="cop-step-n">2</div>Schrijf er een voor <strong>een differentiatieopdracht</strong> voor jouw klas.</div>
    <div class="cop-step"><div class="cop-step-n">3</div>Schrijf er een voor <strong>een exit-ticket</strong> bij een les naar keuze.</div>
    <div class="cop-step"><div class="cop-step-n">4</div>Beoordeel de output kritisch: wat is bruikbaar, wat moet jij als vakexpert corrigeren?</div>
  </div>
</div>

<p class="cp" style="margin-bottom:10px"><strong>Plak hieronder je beste prompt</strong> en laat hem analyseren op de 5 bouwstenen:</p>
<textarea class="sr-ta" id="poef" placeholder="Plak hier je prompt..."></textarea>
<button class="rv-btn" id="pchk">📊 Analyseer mijn prompt</button>
<div id="pscore" style="font-size:12px;font-weight:700;color:var(--muted);margin-top:8px;margin-bottom:14px"></div>

<div class="nw">
  <button class="sr-btn o" onclick="n3()">Volgende: kennischeck →</button>
  <span class="nh">Stap 2/4</span>
</div>`;
  const ta = document.getElementById('poef');
  ta.value = localStorage.getItem('sr_p3') || '';
  ta.oninput = ()=>localStorage.setItem('sr_p3', ta.value);
  document.getElementById('pchk').onclick = ()=>{
    const t = ta.value.toLowerCase();
    const ch = [
      {l:'Rol', f: t.includes('je bent') || t.includes('als een') || t.includes('expert') || t.includes('leerkracht') || t.includes('didacticus')},
      {l:'Taak', f: t.includes('schrijf') || t.includes('maak') || t.includes('ontwerp') || t.includes('genereer') || t.includes('stel op')},
      {l:'Context', f: /\d/.test(t) && (t.includes('jaar') || t.includes('graad') || t.includes('klas') || t.includes('niveau'))},
      {l:'Formaat', f: t.includes('output') || t.includes('tabel') || t.includes('max') || t.includes('woorden') || t.includes('lijst') || t.includes('stappenplan')},
    ];
    const ok = ch.filter(x=>x.f).length;
    const pct = Math.round(ok/ch.length*100);
    const sc = document.getElementById('pscore');
    sc.innerHTML = 'Score: <strong>'+pct+'%</strong> — '+ch.map(x=>(x.f?'✅':'⬜')+' '+x.l).join(' · ')+(pct<100?'<br><span style="font-weight:600">Tip: ontbrekende bouwstenen toevoegen levert vrijwel altijd betere output op. (Dit is een eenvoudige woordcheck — geen volwaardige beoordeling.)</span>':' — sterke prompt! 🎯');
    sc.style.color = pct>=75 ? '#2d6a00' : 'var(--orange)';
  };
}

// ── M3 · STAP 3: quiz ──
function m3s2(c){
  const quiz = [
    {q:'Je wil snel een rubric voor een opdracht. Waar zit je het best?', o:['Create (afbeeldingen)','De Teach-sectie van Copilot','Een gewone zoekmachine','Agents'], a:1, f:'Teach bevat specifieke onderwijstools, waaronder rubric-generatie — sneller en gerichter dan een losse chatprompt.'},
    {q:'Wat mag NOOIT in Copilot, ook niet via je schoolaccount?', o:['Een lesplan vragen','De naam en zorgdossier-info van een leerling invoeren','Feedback op een geanonimiseerde tekst','Een mail aan een collega laten opstellen'], a:1, f:'Persoonsgegevens van leerlingen (namen, diagnoses, thuissituatie) horen nooit in AI-tools. Gegevensbescherming via het schoolaccount is geen vrijgeleide — anonimiseer altijd.'},
    {q:'Wat is een Copilot-agent?', o:['Een betaalde consultant van Microsoft','Een voorgeconfigureerde Copilot met jouw vaste instructies en context','Een antivirus-functie','Een chatbot uitsluitend voor directies'], a:1, f:'Een agent = Copilot met jouw vaste instructies (vak, leerjaar, structuur). Eén keer bouwen in gewone taal, telkens hergebruiken, deelbaar met collega\'s.'},
    {q:'Welke prompt levert wellicht de beste output?', o:['"Maak een les."','"Lesplan fotosynthese, 4e jaar, 50 min, doel: proces kunnen uitleggen, differentiatie voor zorgleerlingen, output als tabel met timing."','"Geef ideeën voor biologie."','"Schrijf iets leuks voor mijn klas."'], a:1, f:'Rol/taak/context/doel/formaat — alle bouwstenen aanwezig. Specificiteit bepaalt de kwaliteit van de output.'},
    {q:'Copilot genereert een prima ogend lesplan. Wat doe je vóór je het gebruikt?', o:['Meteen gebruiken, het ziet er goed uit','Inhoudelijk controleren als vakexpert: feiten, niveau, aansluiting bij je leerplan','Alleen de spelling nakijken','Het door een tweede AI laten controleren'], a:1, f:'AI-output is een vertrekpunt, geen eindproduct. Jij blijft verantwoordelijk voor wat er in je klas gebeurt — dat is het transparantieprincipe uit module 2 in de praktijk.'},
  ];
  rQuiz(c, quiz, 3, 'mod3', n3, 70);
}

// ── M3 · STAP 4: promptbibliotheek ──
function m3s3(c){
  const prompts = [
    ['Misconceptie-scan', 'Je bent een ervaren didacticus voor [vak]. Ik geef les over [concept] aan [leerjaar].\n1. Som 5 typische misconcepties op, telkens met uitleg waarom leerlingen die hebben.\n2. Geef per misconceptie 1 diagnosevraag + het verwachte foute antwoord.\n3. Ontwerp een micro-remediëring van 10 min voor de twee hardnekkigste.\nOutput: tabel (misconceptie | diagnosevraag | aanpak) + kort 10-minutenplan.'],
    ['Leestekst op 3 niveaus', 'Maak een leestekst over [onderwerp] voor [leerjaar] op 3 niveaus: basis, standaard, verdieping.\nPer niveau: tekst (max 180 woorden) + 5 kernwoorden + 3 begripsvragen.\nExtra: 2 tips voor zorgleerlingen + 1 verrijkingstaak voor snelle leerlingen.'],
    ['Feedback op anonieme tekst', 'Ik geef je zo een beoordelingsrubric en een GEANONIMISEERDE leerlingtekst.\nSchrijf leerlingvriendelijke feedback volgens feed-up (doel), feedback (wat lukt al / nog niet) en feed-forward (volgende stap). Max 120 woorden, warm en motiverend, spreek de leerling aan met "je".\nGeef daarnaast aparte leerkrachtnotities: 3 observaties + 2 instructietips.'],
    ['Exit-ticket met analyse', 'Ontwerp een exit-ticket voor [onderwerp] (les van [duur] min, [leerjaar]).\nInhoud: 2 checkvragen, 1 toepassingsvraag, 1 zelfinschattingsvraag.\nGeef ook: correctiesleutel + de foutpatronen die ik waarschijnlijk zal zien + wat ik morgen best kort herhaal.'],
  ];
  let cards = '';
  prompts.forEach(p=>{
    cards += '<div class="pc"><div class="pc-head"><div class="pc-title">'+p[0]+'</div><button class="pc-copy" data-p="'+encodeURIComponent(p[1])+'">📋 Kopieer</button></div><div class="pc-body">'+p[1]+'</div></div>';
  });
  c.innerHTML = `
<div><span class="opt-badge">⭐ Optioneel</span><span class="s-badge">🎯 Stap 4 van 4 · Promptbibliotheek & hands-on</span></div>
<h2 class="ch2">Klaar-om-te-gebruiken <em>EDU-prompts</em></h2>
<p class="cp">Vier beproefde promptsjablonen voor de klaspraktijk. Kopieer, vervang de [haakjes] door jouw vak en leerjaar, en plak in Copilot. Onthoud: <strong>nooit persoonsgegevens</strong> — werk altijd met geanonimiseerde teksten.</p>
${cards}

<h3 class="ch3">🎯 Hands-on slotopdracht</h3>
<p class="cp" style="margin-bottom:12px">Kies één prompt hierboven, pas hem aan voor jouw vak, gebruik hem in Copilot en noteer kort je bevindingen:</p>
<textarea class="sr-ta" id="r2" placeholder="Welke prompt gebruikte je? Wat gaf Copilot? Wat paste jij aan als vakexpert? Wat doe je volgende keer anders?"></textarea>

<div class="ib ok">
  <div class="ib-t">🎉 Verdieping voltooid!</div>
  <div class="ib-b">Breng het nu in de praktijk: gebruik Copilot bij je volgende lesvoorbereiding, deel je beste prompts met je vakgroep en geef je ervaringen door aan je pedagogisch ICT-coördinator. Zo bouwen we samen aan een slimme, verantwoorde AI-cultuur binnen Sint-Rembert.</div>
</div>

<div class="nw">
  <button class="sr-btn o" onclick="n3()">✅ Optionele module afronden →</button>
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
