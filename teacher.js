// Sint-Rembert AI-Geletterdheid Cursus — LEERKRACHTEN ENHANCED VERSION
// Met integrated PDF export (certificaat + alle antwoorden + reflecties)

const S = {
  m1: false, m2: false, m3: false,
  username: '',
  storageKey: 'sr_leerkrachten_v3_enhanced',
  answers: {} // Store all answers, quiz, reflections, stellingen
};

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  updateUI();
  updateProgress();
  
  // Username input
  const un = document.getElementById('un');
  un.disabled = false;
  un.value = S.username || '';
  un.addEventListener('change', sn);
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

function sn() {
  S.username = document.getElementById('un').value.trim();
  document.getElementById('av').textContent = S.username ? S.username.charAt(0).toUpperCase() : '?';
  saveState();
  updateUI();
}

function updateUI() {
  const av = document.getElementById('av');
  av.textContent = S.username ? S.username.charAt(0).toUpperCase() : '?';
  
  // Update module badges
  if (!S.m1) document.getElementById('l1').textContent = '›';
  if (S.m1 && !S.m2) document.getElementById('l2').textContent = '✓';
  if (S.m2) document.getElementById('l3').textContent = '✓';
  if (S.m1 && S.m2) document.getElementById('lc').textContent = '✓';
  
  // Enable/disable nav items
  document.getElementById('nav-mod1').classList.remove('locked');
  if (S.m1) document.getElementById('nav-mod2').classList.remove('locked');
  if (S.m3) document.getElementById('nav-mod3').classList.remove('locked'); // Optional
  if (S.m1 && S.m2) document.getElementById('nav-cert').classList.remove('locked');
}

function updateProgress() {
  let done = 0;
  if (S.m1) done++;
  if (S.m2) done++;
  const pct = Math.round((done / 2) * 100); // 2 verplichte modules
  
  document.getElementById('pb').style.width = pct + '%';
  document.getElementById('pct').textContent = pct + '%';
  
  if (!S.m1 && !S.m2) {
    document.getElementById('st-status').textContent = 'Start Module 1';
  } else if (S.m1 && !S.m2) {
    document.getElementById('st-status').textContent = 'Module 1 klaar, volg Module 2';
  } else if (S.m1 && S.m2) {
    document.getElementById('st-status').textContent = 'Klaar! Download certificaat';
  }
}

function sv(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');
  
  if (view !== 'cert' && document.getElementById('cert-view')) {
    document.getElementById('cert-view').style.display = 'none';
  }
}

function sm(mod) {
  // Check if module is unlocked
  if (mod === 1 || (mod === 2 && S.m1) || mod === 3) { // Module 3 is optional
    sv('mod' + mod);
  } else {
    alert('Voltooi eerst Module 1!');
  }
}

function tryC() {
  if (S.m1 && S.m2) {
    showCertificate();
  } else {
    alert('Voltooi eerst modules 1 & 2!');
  }
}

function goHome() {
  sv('home');
}

function completeModule(num) {
  S['m' + num] = true;
  saveState();
  updateUI();
  updateProgress();
  alert('✅ Module ' + num + ' voltooid!');
  sv('home');
}

// Save all types of answers
function saveAnswer(fieldId, type) {
  let value = '';
  
  // Textarea
  const textarea = document.getElementById(fieldId);
  if (textarea) {
    value = textarea.value;
  }
  
  // Radio buttons (quiz or stellingen)
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
}

// Auto-save textareas on change
document.addEventListener('change', (e) => {
  if (e.target.tagName === 'TEXTAREA') {
    saveAnswer(e.target.id);
  }
  if (e.target.tagName === 'INPUT' && e.target.type === 'radio') {
    saveAnswer(e.target.name);
  }
});

// Also auto-save on input for textareas
document.addEventListener('input', (e) => {
  if (e.target.tagName === 'TEXTAREA') {
    S.answers[e.target.id] = e.target.value;
  }
});

function showCertificate() {
  // Hide all normal views
  document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
  
  // Show certificate
  document.getElementById('cert-view').style.display = 'block';
  document.getElementById('cert-name').textContent = S.username || 'Leerkracht';
  document.getElementById('cert-date').textContent = new Date().toLocaleDateString('nl-NL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// ═══════════════════════════════════════════════════════
// MEGA FUNCTION: Download Complete PDF with Certificate + Answers
// ═══════════════════════════════════════════════════════

function downloadCompletePDF() {
  if (!S.username || !S.username.trim()) {
    alert('⚠️ Vul eerst je naam in (linksboven in de zijbalk)!');
    return;
  }

  if (!S.m1 || !S.m2) {
    alert('⚠️ Voltooi eerst modules 1 & 2 voor het certificaat!');
    return;
  }

  // Collect all answers
  const allAnswers = S.answers || {};
  
  // Create HTML for PDF
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
            <li>AI begrijpen & herkennen (3 elementen)</li>
            <li>Machine Learning & Deep Learning</li>
            <li>EU AI Act (artikel 4) kennen</li>
            <li>Leerlingen veilig begeleiden</li>
            <li>AI-Spelregels toepassen</li>
            <li>Verantwoord AI-gebruik in onderwijs</li>
          </ul>
        </div>
        
        <div style="margin: 30px 0; padding: 20px; background: white; border-left: 4px solid #0066cc;">
          <div style="display: flex; justify-content: space-around; font-size: 13px;">
            <div><strong>Datum</strong><br>${new Date().toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div><strong>Kader</strong><br>EU AI Act (art. 4)</div>
            <div><strong>Geldigheid</strong><br>2 jaar</div>
          </div>
        </div>
        
        <p style="font-size: 12px; color: #999; margin-top: 40px; margin-bottom: 0;">Scholengroep Sint-Rembert · 2026-2027</p>
      </div>
      
      <!-- QUIZ ANSWERS PAGE -->
      <div style="page-break-after: always; padding: 40px; background: #f5f5f5;">
        <h1 style="color: #0066cc; border-bottom: 3px solid #0066cc; padding-bottom: 10px;">📊 Quiz Antwoorden</h1>
        
        ${getFormattedAnswers('quiz')}
      </div>
      
      <!-- STELLINGEN PAGE -->
      <div style="page-break-after: always; padding: 40px; background: #f5f5f5;">
        <h1 style="color: #0066cc; border-bottom: 3px solid #0066cc; padding-bottom: 10px;">🎯 Stellingen — Jouw Mening</h1>
        
        ${getFormattedAnswers('stellingen')}
      </div>
      
      <!-- REFLECTIONS PAGE -->
      <div style="padding: 40px; background: #f5f5f5;">
        <h1 style="color: #0066cc; border-bottom: 3px solid #0066cc; padding-bottom: 10px;">✏️ Reflecties & Actiestappen</h1>
        
        ${getFormattedAnswers('reflection')}
        
        <div style="margin-top: 60px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 12px; color: #999;">
          <p><strong>Document gegenereerd:</strong> ${new Date().toLocaleString('nl-NL')}</p>
          <p>Sint-Rembert AI-Geletterdheid Programma · Alle antwoorden zijn lokaal opgeslagen</p>
        </div>
      </div>
    </div>
  `;

  // Create PDF using html2pdf
  const element = document.createElement('div');
  element.innerHTML = htmlContent;
  
  const opt = {
    margin: 10,
    filename: `AI-Certificaat-Leerkracht-${S.username}-${new Date().getFullYear()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  html2pdf().set(opt).from(element).save();
}

// Helper function to format answers for PDF
function getFormattedAnswers(type) {
  let html = '';
  
  // Quiz answers (q_* pattern)
  if (type === 'quiz') {
    const quizAnswers = Object.keys(S.answers).filter(k => k.match(/^q_m/));
    
    if (quizAnswers.length === 0) {
      html = '<p style="color: #999;">Geen quiz-antwoorden opgeslagen.</p>';
    } else {
      quizAnswers.forEach(key => {
        const answer = S.answers[key];
        const label = key.replace('q_', 'Quiz ').replace('_', ' - ');
        
        html += `
          <div style="background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #0066cc; border-radius: 4px;">
            <p style="margin: 0; font-weight: bold; color: #0066cc;">${label}</p>
            <p style="margin: 8px 0 0 0; color: #333;">Antwoord: <strong>${answer || 'Niet beantwoord'}</strong></p>
          </div>
        `;
      });
    }
  }
  
  // Stellingen (stel_* pattern)
  if (type === 'stellingen') {
    const stellingen = Object.keys(S.answers).filter(k => k.match(/^stel_/));
    
    if (stellingen.length === 0) {
      html = '<p style="color: #999;">Geen stellingen beantwoord.</p>';
    } else {
      const stellingenTeksten = {
        'stel_m2_1': 'Stelling 1: "AI zal leerlingen minder goed zelfstandig laten schrijven"',
        'stel_m2_2': 'Stelling 2: "Ik moet AI-output ALTIJD controleren"',
        'stel_m3_1': 'Stelling 3: "Few-shot prompting bespaart mij tijd bij toetsen"'
      };
      
      stellingen.forEach(key => {
        const answer = S.answers[key];
        const tekst = stellingenTeksten[key] || key;
        
        html += `
          <div style="background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #ff9800; border-radius: 4px;">
            <p style="margin: 0; font-weight: bold; color: #ff9800;">${tekst}</p>
            <p style="margin: 8px 0 0 0; color: #333;">Jouw mening: <strong>${answer || 'Niet beantwoord'}</strong></p>
          </div>
        `;
      });
    }
  }
  
  // Reflections (ans_* pattern)
  if (type === 'reflection') {
    const reflections = Object.keys(S.answers).filter(k => k.match(/^ans_/));
    
    if (reflections.length === 0) {
      html = '<p style="color: #999;">Geen reflecties ingevuld.</p>';
    } else {
      const reflectionLabels = {
        'ans_m1_1': 'Module 1: Waar zie je AI in je dagelijkse werk?',
        'ans_m2_1': 'Module 2: Welke AI-afspraken wil je met leerlingen?',
        'ans_m2_2': 'Module 2: Concrete actiestap voor komende maand',
        'ans_m3_1': 'Module 3: Welke prompt wil je uitproberen?',
        'ans_m3_2': 'Module 3: Je visie op Copilot op lange termijn'
      };
      
      reflections.forEach(key => {
        const answer = S.answers[key];
        const label = reflectionLabels[key] || key;
        
        html += `
          <div style="background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #ff9800; border-radius: 4px;">
            <p style="margin: 0; font-weight: bold; color: #ff9800;">${label}</p>
            <p style="margin: 8px 0 0 0; color: #333; white-space: pre-wrap; font-family: Courier New, monospace; font-size: 12px;">
              ${answer ? answer.replace(/</g, '&lt;').replace(/>/g, '&gt;') : 'Niet ingevuld'}
            </p>
          </div>
        `;
      });
    }
  }
  
  return html || '<p style="color: #999;">Geen antwoorden beschikbaar.</p>';
}

// Check if html2pdf loaded
window.addEventListener('load', () => {
  if (typeof html2pdf === 'undefined') {
    console.warn('html2pdf niet geladen, fallback beschikbaar');
  }
});
