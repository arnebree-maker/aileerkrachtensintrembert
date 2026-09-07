// ===== CONFIG =====
const HELPDESK_EMAIL = 'informaticadienst.pedagogisch@sint-rembert.be';

// ===== NAVIGATION =====
function goTeacher() {
    window.location.href = 'teacher.html';
}

function goStudent() {
    window.location.href = 'leerlingen.html';
}

// ===== HELPDESK WIDGET =====
function toggleHelpdesk() {
    const widget = document.getElementById('helpdeskWidget');
    widget.classList.toggle('active');
    
    if (widget.classList.contains('active')) {
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
        `Antwoord naar: ${email || '(niet opgegeven)'}\n` +
        `Datum: ${new Date().toLocaleString('nl-BE')}`
    );
    
    const mailtoLink = `mailto:${HELPDESK_EMAIL}?subject=${subject}&body=${body}`;
    
    // Open mail client
    window.location.href = mailtoLink;
    
    // Show confirmation
    setTimeout(() => {
        alert('✅ Je vraag is verstuurd!\n\nAls je geen mail-app hebt:\n' + HELPDESK_EMAIL);
        document.getElementById('helpForm').reset();
        toggleHelpdesk();
    }, 500);
}

// ===== ANIMATIONS =====
document.addEventListener('DOMContentLoaded', () => {
    // Smooth fade-in for cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.15}s`;
    });
    
    // Add ripple effect to cards
    setupCardRipples();
});

function setupCardRipples() {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!this.querySelector('button:disabled')) {
                createRipple(e, this);
            }
        });
    });
}

function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        pointer-events: none;
        animation: ripple-out 0.6s ease-out;
    `;
    
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

// ===== INJECT RIPPLE ANIMATION =====
if (!document.querySelector('style[data-ripple]')) {
    const style = document.createElement('style');
    style.setAttribute('data-ripple', 'true');
    style.textContent = `
        @keyframes ripple-out {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}
