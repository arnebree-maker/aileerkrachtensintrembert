// ===== NAVIGATION =====

function goTeacher() {
  // Navigate to teacher course
  window.location.href = 'teacher.html'; // index.html hernoemen naar teacher.html
}

function goStudent() {
  // Navigate to student course
  window.location.href = 'leerlingen.html';
}

// ===== ANIMATIONS =====
document.addEventListener('DOMContentLoaded', () => {
  // Smooth animations on load
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
  });

  // Add click effects
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function(e) {
      if (!this.querySelector('button:disabled')) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.position = 'absolute';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.background = 'rgba(255,255,255,0.3)';
        ripple.style.borderRadius = '50%';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'ripple-animation 0.6s ease-out';

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      }
    });
  });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ===== HELPDESK FUNCTIONS =====

function toggleHelpdesk() {
  const widget = document.getElementById('helpdeskWidget');
  widget.classList.toggle('active');
  
  if (widget.classList.contains('active')) {
    // Focus textarea when opened
    setTimeout(() => {
      document.getElementById('helpText').focus();
    }, 100);
  }
}

function sendHelp(event) {
  event.preventDefault();
  
  const message = document.getElementById('helpText').value.trim();
  const email = document.getElementById('helpEmail').value.trim();
  
  if (!message) {
    alert('Voer een vraag in!');
    return;
  }

  // Build mailto link
  const subject = encodeURIComponent('Vraag AI-Cursus Sint-Rembert');
  const body = encodeURIComponent(
    `Vraag/Opmerking:\n${message}\n\n` +
    (email ? `Antwoord naar: ${email}\n` : 'Antwoord naar: (niet opgegeven)\n') +
    `Datum: ${new Date().toLocaleString('nl-BE')}`
  );
  
  const mailtoLink = `mailto:informaticadienst.pedagogisch@sint-rembert.be?subject=${subject}&body=${body}`;
  
  // Open mail client
  window.location.href = mailtoLink;
  
  // Show confirmation
  setTimeout(() => {
    alert('✅ Je vraag is verstuurd naar de informaticadienst!\n\nAls je geen mail-app hebt, stuur je vraag handmatig naar:\ninformaticadienst.pedagogisch@sint-rembert.be');
    
    // Reset form
    document.getElementById('helpForm').reset();
    toggleHelpdesk();
  }, 500);
}
