// Sint-Rembert AI-Geletterdheid Cursus — LEERKRACHTEN COMPLETE VERSION
// Version 3.0 Enhanced with Full PDF Export
// ALL functions defined here - no missing references!

const S = {
  m1: false, m2: false, m3: false,
  username: '',
  storageKey: 'sr_leerkrachten_v3_complete',
  answers: {}
};

// ════════════════════════════════════════════════════════
// INITIALIZATION
// ════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  console.log('✓ Teacher script loaded');
  loadState();
  updateUI();
  updateProgress();
  
  const un = document.getElementById('un');
  if (un) {
    un.disabled = false;
    un.value = S.username || '';
    un.addEventListener('change', sn);
  }
});

// ════════════════════════════════════════════════════════
// STATE MANAGEMENT
// ════════════════════════════════════════════════════════

function saveState() {
  try {
    localStorage.setItem(S.storageKey, JSON.stringify(S));
  } catch(e) {
    console.warn('⚠️ localStorage write failed:', e);
  }
}

function loadState() {
  try {
    const saved = localStorage.getItem(S.storageKey);
    if (saved) {
      Object.assign(S, JSON.parse(saved));
      console.log('✓ State loaded from localStorage');
    }
  } catch(e) {
    console.warn('⚠️ localStorage read failed:', e);
  }
}

function sn() {
  S.username = (document.getElementById('un')?.value || '').trim();
  const av = document.getElementById('av');
  if (av) av.textContent = S.username ? S.username.charAt(0).toUpperCase() : '?';
  saveState();
  updateUI();
}

// ════════════════════════════════════════════════════════
// UI UPDATES
// ════════════════════════════════════════════════════════

function updateUI() {
  const av = document.getElementById('av');
  if (av) av.textContent = S.username ? S.username.charAt(0).toUpperCase() : '?';
  
  // Update badges
  try {
    if (!S.m1) document.getElementById('l1').textContent = '›';
    if (S.m1 && !S.m2) document.getElementById('l2').textContent = '✓';
    if (S.m2) document.getElementById('l3').textContent = '✓';
    if (S.m1 && S.m2) document.getElementById('lc').textContent = '✓';
  } catch(e) {
    console.warn('⚠️ Badge update failed:', e);
  }
  
  // Update nav items
  try {
    document.getElementById('nav-mod1').classList.remove('locked');
    if (S.m1) document.getElementById('nav-mod2').classList.remove('locked');
    if (S.m3) document.getElementById('nav-mod3').classList.remove('locked');
    if (S.m1 && S.m2) document.getElementById('nav-cert').classList.remove('locked');
  } catch(e) {
    console.warn('⚠️ Nav update failed:', e);
  }
}

function updateProgress() {
  try {
    let done = 0;
    if (S.m1) done++;
    if (S.m2) done++;
    const pct = Math.round((done / 2) * 100);
    
    const pb = document.getElementById('pb');
    if (pb) pb.style.width = pct + '%';
    
    const pctEl = document.getElementById('pct');
    if (pctEl) pctEl.textContent = pct + '%';
    
    const status = document.getElementById('st-status');
    if (status) {
      if (!S.m1 && !S.m2) {
        status.textContent = 'Start Module 1';
      } else if (S.m1 && !S.m2) {
        status.textContent = 'Module 1 klaar, volg Module 2';
      } else if (S.m1 && S.m2) {
        status.textContent = 'Klaar! Download certificaat';
      }
    }
  } catch(e) {
    console.warn('⚠️ Progress update failed:', e);
  }
}

// ════════════════════════════════════════════════════════
// NAVIGATION
// ════════════════════════════════════════════════════════

function sv(view) {
  console.log('→ Navigating to:', view);
  try {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const viewEl = document.getElementById('view-' + view);
    if (viewEl) {
      viewEl.classList.add('active');
    } else {
      console.warn('⚠️ View not found:', 'view-' + view);
    }
    
    if (view !== 'cert' && document.getElementById('cert-view')) {
      document.getElementById('cert-view').style.display = 'none';
    }
  } catch(e) {
    console.error('❌ Navigation error:', e);
  }
}

function goHome() {
  sv('home');
}

function sm(mod) {
  console.log('→ Module selected:', mod);
  if (mod === 1 || (mod === 2 && S.m1) || mod === 3) {
    sv('mod' + mod);
  } else {
    alert('⚠️ Voltooi eerst Module 1!');
  }
}

function tryC() {
  if (S.m1 && S.m2) {
    showCertificate();
  } else {
    alert('⚠️ Voltooi eerst modules 1 & 2!');
  }
}

// ════════════════════════════════════════════════════════
// MODULE MANAGEMENT
// ════════════════════════════════════════════════════════

function completeModule(num) {
  console.log('✓ Completing module:', num);
  S['m' + num] = true;
  saveState();
  updateUI();
  updateProgress();
  alert('✅ Module ' + num + ' voltooid!');
  sv('home');
}

// ════════════════════════════════════════════════════════
// ANSWER MANAGEMENT
// ════════════════════════════════════════════════════════

function saveAnswer(fieldId, type) {
  let value = '';
  
  // Textarea
  const textarea = document.getElementById(fieldId);
  if (textarea) {
    value = textarea.value;
  }
  
  // Radio
  const radio = document.querySelector(`input[name="${fieldId}"]:checked`);
  if (radio) {
    value = radio.value;
  }
  
  S.answers[fieldId] = value;
  saveState();
  
  // Feedback
  const feedbackEl = document.getElementById('feedback_' + fieldId);
  if (feedbackEl) {
    feedbackEl.innerHTML = '✅ Opgeslagen!';
    feedbackEl.style.color = 'green';
    setTimeout(() => {
      feedbackEl.innerHTML = '';
    }, 2000);
  }
  
  console.log('→ Answer saved:', fieldId, '=', value.substring(0, 30) + '...');
}

// Auto-save
document.addEventListener('change', (e) => {
  if (e.target.tagName === 'TEXTAREA') {
    saveAnswer(e.target.id);
  }
  if (e.target.tagName === 'INPUT' && e.target.type === 'radio') {
    saveAnswer(e.target.name);
  }
});

// ════════════════════════════════════════════════════════
// CERTIFICATE
// ════════════════════════════════════════════════════════

function showCertificate() {
  console.log('→ Showing certificate');
  try {
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    
    const certView = document.getElementById('cert-view');
    if (certView) {
      certView.style.display = 'block';
      document.getElementById('cert-name').textContent = S.username || 'Leerkracht';
      document.getElementById('cert-date').textContent = new Date().toLocaleDateString('nl-NL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  } catch(e) {
    console.error('❌ Certificate error:', e);
  }
}

// ════════════════════════════════════════════════════════
// PDF EXPORT — MEGA FUNCTION
// ════════════════════════════════════════════════════════

function downloadCompletePDF() {
  console.log('→ Downloading PDF');
  
  if (!S.username || !S.username.trim()) {
    alert('⚠️ Vul eerst je naam in (linksboven in de zijbalk)!');
    return;
  }

  if (!S.m1 || !S.m2) {
    alert('⚠️ Voltooi eerst modules 1 & 2 voor het certificaat!');
    return;
  }

  const allAnswers = S.answers || {};
  
  let htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 900px; margin: 0 auto;">
      
      <!-- CERTIFICATE PAGE -->
      <div style="page-break-after: always; text-align: center; padding: 60px 40px; border: 3px solid #0066cc; border-radius: 8px; background: #f9f9f9; margin-bottom: 40px;">
        <div style="font-size: 24px; margin-bottom: 20px;">🎉</div>
        <h1 style="font-family: 'Arial Black', sans-serif; font-size: 36px; color: #0066cc; text-transform: uppercase; margin-bottom: 10px;">Certificaat</h1>
        <h2 style="font-size: 24px; color: #0066cc; margin-bottom: 30px;">AI-Geletterdheid voor Leerkrachten</h2>
        
        <div style="border-top: 2px solid #0066cc; border-bottom: 2px solid #0066cc; padding: 30px 0; margin: 30px 0;">
          <p style="font-size: 16px; color: #666; margin: 0 0 10px 0;">Dit certificaat bevestigt dat</p>
          <p style="font-size: 28px; font-weight: bold; color: #0066cc; margin: 0 0 20px 0;">${S.username || 'Leerkracht'}</p>
          <p style="font-size: 14px; color: #666; margin: 0;">de cursus <strong>AI-Spelregels & AI-Geletterdheid voor Leerkrachten</strong> succesvol heeft voltooid.</p>
        </div>
        
        <div style="text-align: left; background: #e6f2ff; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <p style="font-weight: bold; margin-top: 0; color: #0066cc;">Verworven competenties:</p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>AI begrijpen & herkennen</li>
            <li>Machine Learning & Deep Learning</li>
            <li>EU AI Act (artikel 4) kennen</li>
            <li>Leerlingen veilig begeleiden</li>
            <li>AI-Spelregels toepassen</li>
            <li>Verantwoord AI-gebruik</li>
          </ul>
        </div>
        
        <div style="margin: 30px 0; padding: 20px; background: white; border-left: 4px solid #0066cc;">
          <div style="display: flex; justify-content: space-around; font-size: 13px;">
            <div><strong>Datum</strong><br>${new Date().toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div><strong>Kader</strong><br>EU AI Act</div>
            <div><strong>Geldigheid</strong><br>2 jaar</div>
          </div>
        </div>
        
        <p style="font-size: 12px; color: #999; margin-top: 40px; margin-bottom: 0;">Scholengroep Sint-Rembert · 2026-2027</p>
      </div>
      
      <!-- ANSWERS PAGE -->
      <div style="padding: 40px; background: #f5f5f5;">
        <h1 style="color: #0066cc; border-bottom: 3px solid #0066cc; padding-bottom: 10px;">📊 Je Antwoorden & Reflecties</h1>
        
        ${formatAnswersForPDF()}
      </div>
    </div>
  `;

  const element = document.createElement('div');
  element.innerHTML = htmlContent;
  
  // Check if html2pdf available
  if (typeof html2pdf !== 'undefined') {
    const opt = {
      margin: 10,
      filename: `AI-Certificaat-Leerkracht-${S.username}-${new Date().getFullYear()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save();
    console.log('✓ PDF generated');
  } else {
    console.warn('⚠️ html2pdf not available, using fallback');
    downloadPDFFallback();
  }
}

function formatAnswersForPDF() {
  let html = '';
  const allAnswers = S.answers || {};
  
  Object.keys(allAnswers).forEach(key => {
    const answer = allAnswers[key];
    if (!answer) return;
    
    html += `
      <div style="background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #0066cc; border-radius: 4px;">
        <p style="margin: 0; font-weight: bold; color: #0066cc;">${key}</p>
        <p style="margin: 8px 0 0 0; color: #333; white-space: pre-wrap; font-family: Courier New, monospace; font-size: 12px;">
          ${answer.substring(0, 200)}${answer.length > 200 ? '...' : ''}
        </p>
      </div>
    `;
  });
  
  return html || '<p style="color: #999;">Geen antwoorden opgeslagen.</p>';
}

function downloadPDFFallback() {
  let text = `
════════════════════════════════════════════════════════
CERTIFICAAT — AI-GELETTERDHEID VOOR LEERKRACHTEN
SCHOLENGROEP SINT-REMBERT
════════════════════════════════════════════════════════

Leerkracht: ${S.username}
Datum: ${new Date().toLocaleDateString('nl-NL')}

JE ANTWOORDEN:
`;
  
  Object.keys(S.answers || {}).forEach(key => {
    text += `\n${key}:\n${S.answers[key]}\n`;
  });
  
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AI-Certificaat-Leerkracht-${S.username}-${new Date().getFullYear()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  console.log('✓ TXT fallback downloaded');
}

// ════════════════════════════════════════════════════════
// FINAL CHECKS
// ════════════════════════════════════════════════════════

console.log('✓ All functions defined');
console.log('✓ Teacher.js ready');
