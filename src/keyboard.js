// Keyboard Shortcuts & Easter Eggs
class KeyboardHandler {
  constructor() {
    this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    this.konamiIndex = 0;
    this.init();
  }

  init() {
    this.setupKeyboardShortcuts();
    this.setupKonamiCode();
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Theme toggle: Ctrl/Cmd + Shift + T
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        this.toggleTheme();
      }

      // Scroll to top: Home key
      if (e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Scroll to bottom: End key
      if (e.key === 'End') {
        e.preventDefault();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }

      // Navigate sections: 1-4 keys
      if (['1', '2', '3', '4'].includes(e.key) && !e.ctrlKey && !e.metaKey) {
        const sections = document.querySelectorAll('section[id]');
        const index = parseInt(e.key) - 1;
        if (sections[index]) {
          sections[index].scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  setupKonamiCode() {
    document.addEventListener('keydown', (e) => {
      if (e.key === this.konamiCode[this.konamiIndex]) {
        this.konamiIndex++;
        if (this.konamiIndex === this.konamiCode.length) {
          this.activateEasterEgg();
          this.konamiIndex = 0;
        }
      } else {
        this.konamiIndex = 0;
      }
    });
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }

  activateEasterEgg() {
    // Fun easter egg: Add rainbow effect
    document.body.style.animation = 'rainbow 5s linear infinite';
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    // Show message
    const message = document.createElement('div');
    message.textContent = '🎉 Konami Code Activated! 🎉';
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--accent-color);
      color: var(--bg-color);
      padding: 2rem 4rem;
      border-radius: 1rem;
      font-size: 2rem;
      font-weight: bold;
      z-index: 10000;
      animation: fadeInBlur 0.5s ease forwards;
    `;
    document.body.appendChild(message);

    setTimeout(() => {
      message.style.animation = 'fadeOut 0.5s ease forwards';
      setTimeout(() => message.remove(), 500);
      document.body.style.animation = '';
      style.remove();
    }, 3000);
  }
}

// Initialize
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KeyboardHandler;
} else {
  window.KeyboardHandler = KeyboardHandler;
}
