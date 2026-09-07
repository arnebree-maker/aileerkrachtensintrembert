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
