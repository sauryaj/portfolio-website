// Scroll Effects & Parallax - Enhanced with Mobile Optimizations
class ScrollEffects {
  constructor() {
    this.isMobile = window.innerWidth <= 768;
    this.isLowEnd = window.innerWidth <= 480;
    this.ticking = false;
    this.init();
  }

  init() {
    this.setupScrollProgress();
    this.setupScrollReveal();
    
    // Only enable parallax on desktop for better mobile performance
    if (!this.isMobile) {
      this.setupParallax();
    }
    
    this.setupSectionIndicators();
  }

  setupScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    // Throttle scroll updates using requestAnimationFrame
    const updateProgress = () => {
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      progressBar.style.transform = `scaleX(${scrolled / 100})`;
      this.ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        window.requestAnimationFrame(updateProgress);
        this.ticking = true;
      }
    }, { passive: true });
  }

  setupParallax() {
    // Parallax for hero section typography
    const heroTitle = document.querySelector('.hero h1');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    let ticking = false;
    
    const updateParallax = () => {
      const scrolled = window.scrollY;
      
      // Parallax for hero elements (slower movement)
      if (heroTitle && scrolled < window.innerHeight) {
        heroTitle.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroTitle.style.opacity = 1 - (scrolled / 600);
      }
      
      if (heroSubtitle && scrolled < window.innerHeight) {
        heroSubtitle.style.transform = `translateY(${scrolled * 0.2}px)`;
        heroSubtitle.style.opacity = 1 - (scrolled / 700);
      }
      
      // Section headings parallax
      const headings = document.querySelectorAll('section h2');
      headings.forEach(heading => {
        const rect = heading.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const offset = (window.innerHeight - rect.top) * 0.1;
          heading.style.transform = `translateY(${offset}px)`;
        }
      });
      
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  setupScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const cards = document.querySelectorAll('.card');
    let ticking = false;
    
    const revealOnScroll = () => {
      // Standard scroll reveal
      revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        // Reduce reveal distance on mobile for faster animations
        const elementVisible = this.isMobile ? 100 : 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          el.classList.add('revealed');
        }
      });
      
      // Alternating card reveals (left/right) - only on desktop
      if (!this.isMobile) {
        cards.forEach((card, index) => {
          const cardTop = card.getBoundingClientRect().top;
          const cardVisible = 100;
          
          if (cardTop < window.innerHeight - cardVisible && !card.classList.contains('revealed')) {
            // Alternate between left and right
            if (index % 2 === 0) {
              card.classList.add('slide-in-left');
            } else {
              card.classList.add('slide-in-right');
            }
            card.classList.add('revealed');
          }
        });
      } else {
        // On mobile, just reveal cards without slide animation
        cards.forEach(card => {
          const cardTop = card.getBoundingClientRect().top;
          if (cardTop < window.innerHeight - 100 && !card.classList.contains('revealed')) {
            card.classList.add('revealed');
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }
        });
      }
      
      // Animate proficiency dots on scroll
      const skillCards = document.querySelectorAll('.skill-card:not(.active)');
      skillCards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        if (cardTop < window.innerHeight - 100) {
          const dots = card.querySelectorAll('.proficiency-dot.filled');
          dots.forEach((dot, i) => {
            if (!dot.classList.contains('animate')) {
              // Reduce delay on mobile
              const delay = this.isLowEnd ? i * 50 : (this.isMobile ? i * 75 : i * 100);
              setTimeout(() => {
                dot.classList.add('animate');
              }, delay);
            }
          });
        }
      });
      
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(revealOnScroll);
        ticking = true;
      }
    }, { passive: true });
    
    revealOnScroll(); // Initial check
  }

  setupSectionIndicators() {
    const sections = document.querySelectorAll('section[id]');
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'section-indicators';
    
    // Hide section indicators on mobile for cleaner UI
    if (this.isMobile) {
      indicatorsContainer.style.display = 'none';
    }
    
    sections.forEach((section, index) => {
      const indicator = document.createElement('div');
      indicator.className = 'section-indicator';
      indicator.dataset.section = section.id;
      indicator.addEventListener('click', () => {
        section.scrollIntoView({ behavior: 'smooth' });
      });
      indicatorsContainer.appendChild(indicator);
    });
    
    document.body.appendChild(indicatorsContainer);

    // Update active indicator on scroll with throttling
    let ticking = false;
    const updateIndicators = () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute('id');
        }
      });

      document.querySelectorAll('.section-indicator').forEach(indicator => {
        indicator.classList.remove('active');
        if (indicator.dataset.section === current) {
          indicator.classList.add('active');
        }
      });
      
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateIndicators);
        ticking = true;
      }
    }, { passive: true });
  }
}

// Initialize
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScrollEffects;
} else {
  window.ScrollEffects = ScrollEffects;
}
