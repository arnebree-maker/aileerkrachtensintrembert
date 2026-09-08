// Sint-Rembert AI-Skills voor Leerlingen — ENHANCED VERSION
// Met integrated PDF export (certificaat + alle antwoorden)

const S = {
  m1: false, m2: false, m3: false, m4: false, m5: false, m6: false,
  username: '',
  storageKey: 'sr_leerlingen_v3_enhanced',
  answers: {} // Store all answers
};

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  updateUI();
  
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
}

function sv(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');
  
  // Hide cert-view if showing normal view
  if (view !== 'cert' && document.getElementById('cert-view')) {
    document.getElementById('cert-view').style.display = 'none';
  }
}

function sm(mod) {
  // Check if module is unlocked
  if (mod === 1 || 
      (mod === 2 && S.m1) || 
      (mod === 3 && S.m2) || 
      (mod === 4 && S.m3) || 
      (mod === 5 && S.m4) || 
      (mod === 6 && S.m5)) {
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

// Save individual answer
function saveAnswer(fieldId, type) {
  const value = document.getElementById(fieldId)?.value || 
                document.querySelector(`input[name="${fieldId}"]:checked`)?.value || '';
  
  S.answers[fieldId] = value;
  saveState();
  
  const feedbackEl = document.getElementById('feedback' + fieldId.slice(1));
  if (feedbackEl) {
    feedbackEl.innerHTML = '✅ Opgeslagen!';
    feedbackEl.style.color = 'green';
    setTimeout(() => {
      feedbackEl.innerHTML = '';
    }, 2000);
  }
}

// Save textarea answers on change
document.addEventListener('change', (e) => {
  if (e.target.tagName === 'TEXTAREA') {
    saveAnswer(e.target.id);
  }
});

// Also save on input for textareas
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
  document.getElementById('cert-name').textContent = S.username || 'Leerling';
  document.getElementById('cert-date').textContent = new Date().toLocaleDateString('nl-NL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// ═══════════════════════════════════════════════════
// MEGA FUNCTION: Download Complete PDF with Certificate + Answers
// ═══════════════════════════════════════════════════

function downloadCompletePDF() {
  if (!S.username || !S.username.trim()) {
    alert('⚠️ Vul eerst je naam in (linksboven in de zijbalk)!');
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
        <h2 style="font-size: 24px; color: #0066cc; margin-bottom: 30px;">AI-Skills voor Leerlingen</h2>
        
        <div style="border-top: 2px solid #0066cc; border-bottom: 2px solid #0066cc; padding: 30px 0; margin: 30px 0;">
          <p style="font-size: 16px; color: #666; margin: 0 0 10px 0;">Dit certificaat bevestigt dat</p>
          <p style="font-size: 28px; font-weight: bold; color: #0066cc; margin: 0 0 20px 0;">${S.username || 'Leerling'}</p>
          <p style="font-size: 14px; color: #666; margin: 0;">alle 6 modules van de <strong>AI-Skills voor Leerlingen</strong> cursus succesvol heeft voltooid.</p>
        </div>
        
        <div style="text-align: left; background: #e6f2ff; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <p style="font-weight: bold; margin-top: 0; color: #0066cc;">Verworven competenties:</p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Wat is AI? (overal, 3 elementen)</li>
            <li>Hoe werkt AI? (Machine Learning, Deep Learning)</li>
            <li>Generatieve AI & Prompting</li>
            <li>Ethiek, Bias, Deepfakes</li>
            <li>AI in school verantwoord gebruiken</li>
            <li>Kritisch denken over AI-toekomst</li>
          </ul>
        </div>
        
        <div style="margin: 30px 0; padding: 20px; background: white; border-left: 4px solid #0066cc;">
          <div style="display: flex; justify-content: space-around; font-size: 13px;">
            <div><strong>Datum</strong><br>${new Date().toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div><strong>Niveau</strong><br>Secundair Onderwijs</div>
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
      
      <!-- REFLECTIONS PAGE -->
      <div style="page-break-after: always; padding: 40px; background: #f5f5f5;">
        <h1 style="color: #0066cc; border-bottom: 3px solid #0066cc; padding-bottom: 10px;">✏️ Reflecties</h1>
        
        ${getFormattedAnswers('reflection')}
      </div>
      
      <!-- EXERCISES PAGE -->
      <div style="padding: 40px; background: #f5f5f5;">
        <h1 style="color: #0066cc; border-bottom: 3px solid #0066cc; padding-bottom: 10px;">💭 Oefeningen & Antwoorden</h1>
        
        ${getFormattedAnswers('exercise')}
        
        <div style="margin-top: 60px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 12px; color: #999;">
          <p><strong>Document gegenereerd:</strong> ${new Date().toLocaleString('nl-NL')}</p>
          <p>Sint-Rembert AI-Skills Programma · Alle antwoorden zijn lokaal opgeslagen</p>
        </div>
      </div>
    </div>
  `;

  // Create PDF using html2pdf
  const element = document.createElement('div');
  element.innerHTML = htmlContent;
  
  const opt = {
    margin: 10,
    filename: `AI-Certificaat-${S.username}-${new Date().getFullYear()}.pdf`,
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
  
  // Quiz answers (q*_* pattern)
  if (type === 'quiz') {
    const quizAnswers = Object.keys(S.answers).filter(k => k.match(/^q\d+_\d+$/));
    
    if (quizAnswers.length === 0) {
      html = '<p style="color: #999;">Geen quiz-antwoorden opgeslagen.</p>';
    } else {
      quizAnswers.forEach(key => {
        const answer = S.answers[key];
        const [module, q] = key.match(/q(\d+)_(\d+)/).slice(1);
        
        html += `
          <div style="background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #0066cc; border-radius: 4px;">
            <p style="margin: 0; font-weight: bold; color: #0066cc;">Module ${module} - Vraag ${q}</p>
            <p style="margin: 8px 0 0 0; color: #333;">Antwoord: <strong>${answer || 'Niet beantwoord'}</strong></p>
          </div>
        `;
      });
    }
  }
  
  // Reflections (ans*_ref pattern)
  if (type === 'reflection') {
    const reflections = Object.keys(S.answers).filter(k => k.match(/^ans\d+_ref$/));
    
    if (reflections.length === 0) {
      html = '<p style="color: #999;">Geen reflecties opgeslagen.</p>';
    } else {
      reflections.forEach(key => {
        const answer = S.answers[key];
        const module = key.match(/ans(\d+)_ref/)[1];
        
        html += `
          <div style="background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #ff9800; border-radius: 4px;">
            <p style="margin: 0; font-weight: bold; color: #ff9800;">Module ${module} - Reflectie</p>
            <p style="margin: 8px 0 0 0; color: #333; white-space: pre-wrap; font-family: Courier New, monospace; font-size: 12px;">
              ${answer ? answer.replace(/</g, '&lt;').replace(/>/g, '&gt;') : 'Niet ingevuld'}
            </p>
          </div>
        `;
      });
    }
  }
  
  // Exercises (ans*_1, ans*_2, etc pattern)
  if (type === 'exercise') {
    const exercises = Object.keys(S.answers).filter(k => k.match(/^ans\d+_\d+$/) && !k.match(/ans\d+_ref/));
    
    if (exercises.length === 0) {
      html = '<p style="color: #999;">Geen oefeningen ingevuld.</p>';
    } else {
      exercises.forEach(key => {
        const answer = S.answers[key];
        const [module, ex] = key.match(/ans(\d+)_(\d+)/).slice(1);
        
        html += `
          <div style="background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #4caf50; border-radius: 4px;">
            <p style="margin: 0; font-weight: bold; color: #4caf50;">Module ${module} - Oefening ${ex}</p>
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

// Backup: If html2pdf doesn't load, fallback to simpler print
function downloadCompletePDF_Fallback() {
  const name = S.username || 'Leerling';
  const date = new Date().toLocaleDateString('nl-NL');
  
  let text = `
════════════════════════════════════════════════════════
CERTIFICAAT — AI-SKILLS VOOR LEERLINGEN
SCHOLENGROEP SINT-REMBERT
════════════════════════════════════════════════════════

Certificaathouder: ${name}
Datum voltooiing: ${date}

VERWORVEN COMPETENTIES:
✓ Wat is AI? (overal, 3 elementen)
✓ Hoe werkt AI? (Machine Learning, Deep Learning)
✓ Generatieve AI & Prompting
✓ Ethiek, Bias, Deepfakes
✓ AI in school verantwoord gebruiken
✓ Kritisch denken over AI-toekomst

────────────────────────────────────────────────────────
QUIZ ANTWOORDEN
────────────────────────────────────────────────────────
`;

  // Add quiz answers
  Object.keys(S.answers).forEach(key => {
    if (key.match(/^q\d+_\d+$/)) {
      text += `${key}: ${S.answers[key]}\n`;
    }
  });

  text += `
────────────────────────────────────────────────────────
REFLECTIES
────────────────────────────────────────────────────────
`;

  // Add reflections
  Object.keys(S.answers).forEach(key => {
    if (key.match(/^ans\d+_ref$/)) {
      text += `\n${key}:\n${S.answers[key]}\n\n`;
    }
  });

  // Download as TXT
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AI-Certificaat-${name}-${new Date().getFullYear()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// Check if html2pdf loaded, fallback otherwise
window.addEventListener('load', () => {
  if (typeof html2pdf === 'undefined') {
    console.warn('html2pdf not loaded, using text fallback');
    // Fallback is available if needed
  }
});
