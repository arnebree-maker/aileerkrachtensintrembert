// Sint-Rembert AI-Skills voor Leerlingen
// Version 2.0 (2026)

const S = {
  st: false,      // Starttest passed
  m1: false, m2: false, m3: false, m4: false, m5: false, m6: false,
  username: '',
  storageKey: 'sr_leerlingen_v2'
};

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  updateUI();
  
  // Username input
  const un = document.getElementById('un');
  un.disabled = false;
  un.value = S.username || '';
  un.addEventListener('change', (e) => {
    S.username = e.target.value;
    saveState();
    updateUI();
  });
});

function saveState() {
  localStorage.setItem(S.storageKey, JSON.stringify(S));
}

function loadState() {
  const saved = localStorage.getItem(S.storageKey);
  if (saved) {
    Object.assign(S, JSON.parse(saved));
  }
}

function updateUI() {
  const av = document.getElementById('av');
  av.textContent = S.username ? S.username.charAt(0).toUpperCase() : '?';
  
  // Update module buttons
  if (!S.m1) document.getElementById('l1').textContent = '›';
  if (S.m1 && !S.m2) document.getElementById('l2').textContent = '✓';
  if (S.m2 && !S.m3) document.getElementById('l3').textContent = '✓';
  if (S.m3 && !S.m4) document.getElementById('l4').textContent = '✓';
  if (S.m4 && !S.m5) document.getElementById('l5').textContent = '✓';
  if (S.m5 && !S.m6) document.getElementById('l6').textContent = '✓';
  if (S.m6) document.getElementById('lc').textContent = '✓';
  
  // Enable/disable nav items
  document.getElementById('nav-mod1').classList.remove('locked');
  if (S.m1) document.getElementById('nav-mod2').classList.remove('locked');
  if (S.m2) document.getElementById('nav-mod3').classList.remove('locked');
  if (S.m3) document.getElementById('nav-mod4').classList.remove('locked');
  if (S.m4) document.getElementById('nav-mod5').classList.remove('locked');
  if (S.m5) document.getElementById('nav-mod6').classList.remove('locked');
  if (S.m6) document.getElementById('nav-cert').classList.remove('locked');
  
  // Update buttons
  if (S.m1) {
    document.getElementById('bm2').disabled = false;
    document.getElementById('bm2').textContent = '▶ Start';
    document.getElementById('ps2').textContent = 'Beschikbaar';
    document.getElementById('ps2').classList.remove('locked');
    document.getElementById('cm2').classList.remove('locked');
  }
  if (S.m2) {
    document.getElementById('bm3').disabled = false;
    document.getElementById('bm3').textContent = '▶ Start';
    document.getElementById('ps3').textContent = 'Beschikbaar';
    document.getElementById('ps3').classList.remove('locked');
    document.getElementById('cm3').classList.remove('locked');
  }
  if (S.m3) {
    document.getElementById('bm4').disabled = false;
    document.getElementById('bm4').textContent = '▶ Start';
    document.getElementById('ps4').textContent = 'Beschikbaar';
    document.getElementById('ps4').classList.remove('locked');
    document.getElementById('cm4').classList.remove('locked');
  }
  if (S.m4) {
    document.getElementById('bm5').disabled = false;
    document.getElementById('bm5').textContent = '▶ Start';
    document.getElementById('ps5').textContent = 'Beschikbaar';
    document.getElementById('ps5').classList.remove('locked');
    document.getElementById('cm5').classList.remove('locked');
  }
  if (S.m5) {
    document.getElementById('bm6').disabled = false;
    document.getElementById('bm6').textContent = '▶ Start';
    document.getElementById('ps6').textContent = 'Beschikbaar';
    document.getElementById('ps6').classList.remove('locked');
    document.getElementById('cm6').classList.remove('locked');
  }
}

function sv(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');
}

function sm(mod) {
  if (mod === 1 || (mod === 2 && S.m1) || (mod === 3 && S.m2) || (mod === 4 && S.m3) || (mod === 5 && S.m4) || (mod === 6 && S.m5)) {
    sv('mod' + mod);
  } else if (mod === 6 && S.m5) {
    sv('mod' + mod);
  }
}

function tryC() {
  if (S.m6) {
    showCertificate();
  } else {
    alert('Voltooi eerst alle 6 modules!');
  }
}

function goHome() {
  sv('home');
}

function completeModule(num) {
  S['m' + num] = true;
  saveState();
  updateUI();
  alert('✅ Module ' + num + ' voltooid! Volgende module ontgrendeld.');
  sv('home');
}

function m1Next() {
  const steps = ['m1s1', 'm1s2', 'm1s3', 'm1s4'];
  let current = -1;
  for (let i = 0; i < steps.length; i++) {
    if (!document.getElementById(steps[i]).classList.contains('hidden')) {
      current = i;
      break;
    }
  }
  if (current + 1 < steps.length) {
    document.getElementById(steps[current]).classList.add('hidden');
    document.getElementById(steps[current + 1]).classList.remove('hidden');
  }
}

function m1Quiz() {
  const steps = ['m1s1', 'm1s2', 'm1s3', 'm1s4'];
  steps.forEach(s => document.getElementById(s).classList.add('hidden'));
  document.getElementById('m1s4').classList.remove('hidden');
}

function m1CheckQuiz() {
  const q1 = document.querySelector('input[name="q1"]:checked')?.value;
  const q2 = document.querySelector('input[name="q2"]:checked')?.value;
  const q3 = document.querySelector('input[name="q3"]:checked')?.value;
  
  let score = 0;
  if (q1 === 'a') score++;
  if (q2 === 'a') score++;
  if (q3 === 'b') score++;
  
  const result = document.getElementById('q1result');
  if (score === 3) {
    result.innerHTML = '<div style="background: #d4edda; padding: 12px; border-radius: 6px; color: #155724;"><strong>✅ Perfecte score! 3/3</strong><br>Je begrijpt AI echt!</div>';
    setTimeout(() => completeModule(1), 1500);
  } else {
    result.innerHTML = '<div style="background: #fff3cd; padding: 12px; border-radius: 6px; color: #856404;"><strong>📖 Score: ' + score + '/3</strong><br>Lees de stappen nog even na en probeer opnieuw!</div>';
  }
}

function showCertificate() {
  document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
  document.getElementById('cert-view').style.display = 'block';
  document.getElementById('cert-name').textContent = S.username || 'Leerling';
  document.getElementById('cert-date').textContent = new Date().toLocaleDateString('nl-NL');
}

function doCertPrint() {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(document.querySelector('.cert-box').outerHTML);
  setTimeout(() => printWindow.print(), 250);
}

function downloadSummary() {
  const text = `Sint-Rembert AI-Skills Reflectieverslag
=====================================

Leerling: ${S.username || 'Anoniem'}
Datum: ${new Date().toLocaleDateString('nl-NL')}
Modules voltooid: 6/6 ✅

--- REFLECTIE ---

1. Wat heb je geleerd over AI?
[Jouw antwoord]

2. Hoe zal je AI verantwoord gebruiken?
[Jouw antwoord]

3. Waar wil je grenzen stellen bij AI-gebruik?
[Jouw antwoord]

4. Wat vindt je het meest interessant/eng aan AI?
[Jouw antwoord]

=====================================
Certificaat: Sint-Rembert AI-Skills voor Leerlingen
Geldig voor 2 jaar
`;
  const el = document.createElement('a');
  el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  el.setAttribute('download', 'AI-Skills-Reflectie-' + S.username + '.txt');
  el.click();
}
