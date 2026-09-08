// Sint-Rembert AI-Skills voor Leerlingen — Version 3.0
// Complete & working with proper PDF download

const S = {
  m1: false, m2: false, m3: false, m4: false, m5: false, m6: false,
  username: '',
  storageKey: 'sr_leerlingen_v3',
  answers: {}
};

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  updateUI();
  const un = document.getElementById('un');
  if (un) {
    un.value = S.username || '';
    un.addEventListener('change', sn);
  }
});

function saveState() {
  localStorage.setItem(S.storageKey, JSON.stringify(S));
}

function loadState() {
  const saved = localStorage.getItem(S.storageKey);
  if (saved) Object.assign(S, JSON.parse(saved));
}

function sn() {
  S.username = (document.getElementById('un')?.value || '').trim();
  const av = document.getElementById('av');
  if (av) av.textContent = S.username ? S.username.charAt(0).toUpperCase() : '?';
  saveState();
}

function updateUI() {
  const av = document.getElementById('av');
  if (av) av.textContent = S.username ? S.username.charAt(0).toUpperCase() : '?';
  if (!S.m1) document.getElementById('l1').textContent = '›';
  if (S.m1 && !S.m2) document.getElementById('l2').textContent = '✓';
  if (S.m2 && !S.m3) document.getElementById('l3').textContent = '✓';
  if (S.m3 && !S.m4) document.getElementById('l4').textContent = '✓';
  if (S.m4 && !S.m5) document.getElementById('l5').textContent = '✓';
  if (S.m5 && !S.m6) document.getElementById('l6').textContent = '✓';
  if (S.m6) document.getElementById('lc').textContent = '✓';
  
  document.getElementById('nav-mod1').classList.remove('locked');
  if (S.m1) document.getElementById('nav-mod2').classList.remove('locked');
  if (S.m2) document.getElementById('nav-mod3').classList.remove('locked');
  if (S.m3) document.getElementById('nav-mod4').classList.remove('locked');
  if (S.m4) document.getElementById('nav-mod5').classList.remove('locked');
  if (S.m5) document.getElementById('nav-mod6').classList.remove('locked');
  if (S.m6) document.getElementById('nav-cert').classList.remove('locked');
  
  updateProgress();
}

function updateProgress() {
  let done = 0;
  if (S.m1) done++;
  if (S.m2) done++;
  if (S.m3) done++;
  if (S.m4) done++;
  if (S.m5) done++;
  if (S.m6) done++;
  
  const pct = Math.round((done / 6) * 100);
  document.getElementById('pb').style.width = pct + '%';
  document.getElementById('pct').textContent = pct + '%';
}

function sv(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const el = document.getElementById('view-' + view);
  if (el) el.classList.add('active');
  if (view !== 'cert') {
    const cv = document.getElementById('cert-view');
    if (cv) cv.style.display = 'none';
  }
}

function goHome() {
  sv('home');
}

function sm(mod) {
  if (mod === 1 || (mod === 2 && S.m1) || (mod === 3 && S.m2) || (mod === 4 && S.m3) || (mod === 5 && S.m4) || (mod === 6 && S.m5)) {
    sv('mod' + mod);
  } else {
    alert('Voltooi eerst de vorige modules!');
  }
}

function tryC() {
  if (S.m6) {
    showCertificate();
  } else {
    alert('Voltooi eerst alle 6 modules!');
  }
}

function completeModule(num) {
  S['m' + num] = true;
  saveState();
  updateUI();
  alert('✅ Module ' + num + ' voltooid! Volgende module ontgrendeld.');
  sv('home');
}

function saveAnswer(fieldId) {
  const textarea = document.getElementById(fieldId);
  if (textarea) {
    S.answers[fieldId] = textarea.value;
  }
  const radio = document.querySelector(`input[name="${fieldId}"]:checked`);
  if (radio) {
    S.answers[fieldId] = radio.value;
  }
  saveState();
}

document.addEventListener('change', (e) => {
  if (e.target.tagName === 'TEXTAREA' || (e.target.tagName === 'INPUT' && e.target.type === 'radio')) {
    saveAnswer(e.target.id || e.target.name);
  }
});

function showCertificate() {
  document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
  document.getElementById('cert-view').style.display = 'block';
  document.getElementById('cert-name').textContent = S.username || 'Leerling';
  document.getElementById('cert-date').textContent = new Date().toLocaleDateString('nl-NL', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

function downloadPDF() {
  if (!S.m6) {
    alert('Voltooi eerst alle 6 modules!');
    return;
  }
  
  const content = `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
      <div style="text-align: center; border: 3px solid #0066cc; border-radius: 8px; padding: 40px; margin-bottom: 30px;">
        <h1 style="color: #0066cc; text-transform: uppercase;">Certificaat</h1>
        <h2 style="color: #0066cc; font-size: 20px;">AI-Skills voor Leerlingen</h2>
        <p style="font-size: 14px; margin: 20px 0;">Dit certificaat bevestigt dat</p>
        <p style="font-size: 22px; font-weight: bold; color: #0066cc;">${S.username || 'Leerling'}</p>
        <p style="font-size: 14px;">alle 6 modules succesvol heeft voltooid.</p>
        <p style="margin-top: 30px; font-size: 12px;">${new Date().toLocaleDateString('nl-NL')}</p>
      </div>
      
      <h2 style="color: #0066cc;">Je Antwoorden:</h2>
      ${Object.keys(S.answers).map(key => `
        <div style="background: #f5f5f5; padding: 10px; margin: 10px 0; border-left: 4px solid #0066cc;">
          <strong>${key}:</strong> ${S.answers[key]}
        </div>
      `).join('')}
    </div>
  `;
  
  if (typeof html2pdf !== 'undefined') {
    const element = document.createElement('div');
    element.innerHTML = content;
    html2pdf().set({
      margin: 10,
      filename: `AI-Certificaat-${S.username || 'Leerling'}-${new Date().getFullYear()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    }).from(element).save();
  } else {
    alert('PDF-library niet geladen, probeer het later opnieuw.');
  }
}
