// Enhanced Main JavaScript with All Features
// import { profileData } from './data.js';

// DOM Elements
const app = document.getElementById('app');
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

// Enhanced Cursor Logic with Context Awareness
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Smooth cursor follow
function animateCursor() {
    const speed = 0.2;
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Magnetic Cursor Effect
function addMagneticEffect() {
    const magneticElements = document.querySelectorAll('.magnetic, a, button, .card, .skill-card');
    
    magneticElements.forEach(el => {
        el.addEventListener('mouseenter', (e) => {
            cursor.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
        
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            el.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
}

// Click effect
document.addEventListener('mousedown', () => {
    cursor.classList.add('click');
});

document.addEventListener('mouseup', () => {
    cursor.classList.remove('click');
});

// Theme Toggle
function initThemeToggle() {
    // Create theme toggle button
    const themeBtn = document.createElement('button');
    themeBtn.className = 'theme-toggle-btn';
    themeBtn.setAttribute('aria-label', 'Toggle theme');
    themeBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>
    `;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeBtn.classList.add('theme-toggle');
        setTimeout(() => themeBtn.classList.remove('theme-toggle'), 500);
    });
    
    document.body.appendChild(themeBtn);
}

// Render Functions
const renderHero = () => {
    return `
    <section id="about" class="hero fade-in">
      <p class="hero-subtitle scroll-reveal">Hello, I'm ${profileData.name}</p>
      <h1 class="scroll-reveal delay-1">${profileData.role} <br> <span style="color: var(--accent-color)">${profileData.location}</span></h1>
      <p class="scroll-reveal delay-2" style="max-width: 600px; margin-top: 1rem; opacity: 0.8;">${profileData.about}</p>
      <div class="scroll-reveal delay-3" style="margin-top: 2rem;">
        <a href="#contact" class="magnetic" style="border: 1px solid var(--accent-color); padding: 1rem 2rem; border-radius: 4px; color: var(--accent-color);">Get in Touch</a>
      </div>
    </section>
    `;
};

const renderExperience = () => {
    const items = profileData.experience.map((exp, index) => `
    <div class="card scroll-reveal stagger-${index + 1} tilt-card">
      <span class="card-meta">${exp.period}</span>
      <h3>${exp.role}</h3>
      <p style="font-weight: 600; margin-bottom: 0.5rem;">${exp.company}</p>
      <p style="font-size: 0.9rem; opacity: 0.7;">${exp.location}</p>
      <p style="margin-top: 1rem;">${exp.description}</p>
    </div>
    `).join('');

    return `
    <section id="experience">
      <h2 class="scroll-reveal">Experience</h2>
      <div class="card-grid">
        ${items}
      </div>
    </section>
    `;
};

const renderSkills = () => {
    const items = profileData.skills.map((skill, index) => {
        const proficiency = skill.proficiency || 4;
        const emoji = skill.emoji || '⚡';
        const proficiencyDots = Array.from({ length: 5 }, (_, i) => 
            `<div class="proficiency-dot ${i < proficiency ? 'filled' : ''}"></div>`
        ).join('');
        
        return `
        <div class="skill-card scroll-reveal stagger-${(index % 8) + 1}" tabindex="0">
          <div class="skill-header">
            <span><span class="skill-icon-emoji">${emoji}</span>${skill.name}</span>
            <span class="skill-icon">+</span>
          </div>
          <div class="skill-proficiency proficiency-dots">
            ${proficiencyDots}
          </div>
          <div class="skill-description">
            <p>${skill.description}</p>
          </div>
        </div>
        `;
    }).join('');

    return `
    <section id="skills">
      <h2 class="scroll-reveal">Skills & Technologies</h2>
      <div class="skills-container">
        ${items}
      </div>
    </section>
    `;
};

const renderProjects = () => {
    const items = profileData.projects.map((project, index) => `
    <div class="card scroll-reveal stagger-${index + 1} tilt-card">
      <span class="card-meta">${project.year}</span>
      <h3>${project.name}</h3>
      <p>${project.description}</p>
      ${project.tech ? `<p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.7;">Tech: ${project.tech}</p>` : ''}
    </div>
    `).join('');

    return `
    <section id="projects">
      <h2 class="scroll-reveal">Featured Projects</h2>
      <div class="card-grid">
        ${items}
      </div>
    </section>
    `;
};

const renderContact = () => {
    return `
    <section id="contact" style="min-height: 50vh;">
      <h2 class="scroll-reveal connect-heading">Let's Connect</h2>
      <p class="scroll-reveal delay-1" style="font-size: 1.5rem; margin-bottom: 2rem;">Ready to optimize your systems?</p>
      
      <div class="contact-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; margin-top: 3rem; align-items: start;">
        <div class="scroll-reveal delay-2">
          <h3 style="font-size: 1.5rem; margin-bottom: 1.5rem;">Get in Touch</h3>
          <a href="mailto:sauryajanbandhu@gmail.com" class="magnetic" style="font-size: 1.5rem; border-bottom: 2px solid var(--accent-color); display: inline-block; margin-bottom: 2rem;">sauryajanbandhu@gmail.com</a>
          
          <div style="margin-top: 2rem;">
            <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">📍 Location</p>
            <p style="font-size: 1.2rem; font-weight: 600;">New Zealand</p>
          </div>
          
          <div style="margin-top: 1.5rem;">
            <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">💼 Current Role</p>
            <p style="font-size: 1.2rem; font-weight: 600;">System Engineer</p>
          </div>
        </div>
        
        <div class="scroll-reveal delay-3" style="position: relative;">
          <div id="map" style="height: 400px; border-radius: 12px; overflow: hidden; border: 1px solid var(--border-color);"></div>
        </div>
      </div>
    </section>
    `;
};

// Skill Card Interaction
const addSkillListeners = () => {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        const toggleCard = () => {
            // Close other cards
            skillCards.forEach(c => {
                if (c !== card) c.classList.remove('active');
            });
            // Toggle current card
            card.classList.toggle('active');
        };
        
        card.addEventListener('click', toggleCard);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCard();
            }
        });
    });
};

// Hover effects for cursor
const addHoverListeners = () => {
    const hoverables = document.querySelectorAll('a, button, .card, .skill-card');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
};

// Loading Screen
function showLoadingScreen() {
    const loading = document.createElement('div');
    loading.className = 'loading-screen';
    loading.innerHTML = `
        <div style="text-align: center;">
            <h1 style="font-size: 3rem; margin-bottom: 1rem;">Loading...</h1>
            <div class="shimmer" style="width: 200px; height: 4px; background: var(--accent-color); margin: 0 auto;"></div>
        </div>
    `;
    document.body.appendChild(loading);
    
    setTimeout(() => {
        loading.classList.add('fade-out');
        setTimeout(() => loading.remove(), 800);
    }, 1500);
}

// Scroll to Top Button
function initScrollToTop() {
    const btn = document.createElement('button');
    btn.className = 'scroll-to-top';
    btn.innerHTML = '↑';
    btn.setAttribute('aria-label', 'Scroll to top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    document.body.appendChild(btn);
}

// Navigation Scroll Spy - Highlight active section
function initNavScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    function updateActiveNav() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Check if section is in viewport (with offset for navbar)
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Update on scroll
    window.addEventListener('scroll', updateActiveNav);
    
    // Initial update
    updateActiveNav();
}

// Init
const init = () => {
    showLoadingScreen();
    
    app.innerHTML = `
    ${renderHero()}
    ${renderExperience()}
    ${renderProjects()}
    ${renderSkills()}
    ${renderContact()}
    `;

    addHoverListeners();
    addSkillListeners();
    addMagneticEffect();
    initThemeToggle();
    initScrollToTop();
    initNavScrollSpy(); // Add scroll spy for nav highlighting
    
    // Initialize modules
    if (typeof ScrollEffects !== 'undefined') {
        new ScrollEffects();
    }
    
    if (typeof KeyboardHandler !== 'undefined') {
        new KeyboardHandler();
    }

    if (typeof WeatherWidget !== 'undefined') {
        new WeatherWidget();
    }
    
    // Initialize map after a short delay to ensure DOM is ready
    setTimeout(initMap, 100);
};

// Initialize Map
function initMap() {
    const mapElement = document.getElementById('map');
    
    // Enhanced error handling
    if (!mapElement) {
        console.warn('Map element not found');
        return;
    }
    
    if (typeof L === 'undefined') {
        console.error('Leaflet library not loaded');
        mapElement.innerHTML = '<p style="padding:2rem;text-align:center;color:var(--text-secondary);">Map temporarily unavailable</p>';
        return;
    }
    
    try {
        // New Zealand coordinates (centered on North Island)
        const nzLat = -41.2865;
        const nzLng = 174.7762;
        
        const map = L.map('map', {
            center: [nzLat, nzLng],
            zoom: 6,
            zoomControl: true,
            scrollWheelZoom: false
        });
        
        // Theme-aware tile selection
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const tileTheme = currentTheme === 'light' ? 'light_all' : 'dark_all';
        
        const tileLayer = L.tileLayer(`https://{s}.basemaps.cartocdn.com/${tileTheme}/{z}/{x}/{y}{r}.png`, {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);
        
        // Listen for theme changes and update map tiles
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    const newTheme = document.documentElement.getAttribute('data-theme') || 'dark';
                    const newTileTheme = newTheme === 'light' ? 'light_all' : 'dark_all';
                    
                    // Remove old layer and add new one
                    map.removeLayer(tileLayer);
                    L.tileLayer(`https://{s}.basemaps.cartocdn.com/${newTileTheme}/{z}/{x}/{y}{r}.png`, {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                        subdomains: 'abcd',
                        maxZoom: 20
                    }).addTo(map);
                }
            });
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
        
        // Add custom marker
        const customIcon = L.divIcon({
            className: 'custom-map-marker',
            html: '<div style="background: var(--accent-color); width: 20px; height: 20px; border-radius: 50%; border: 3px solid var(--bg-color); box-shadow: 0 0 20px rgba(255,255,255,0.5);"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        
        L.marker([nzLat, nzLng], { icon: customIcon })
            .addTo(map)
            .bindPopup('<b>New Zealand</b><br>System Engineer')
            .openPopup();
    } catch (error) {
        console.error('Error initializing map:', error);
        mapElement.innerHTML = '<p style="padding:2rem;text-align:center;color:var(--text-secondary);">Unable to load map</p>';
    }
}

init();
