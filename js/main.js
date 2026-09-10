// ===========================
// Theme Toggle
// ===========================
(function () {
  const toggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const STORAGE_KEY = 'theme';

  const savedTheme = localStorage.getItem(STORAGE_KEY) || 'light';
  root.setAttribute('data-theme', savedTheme);
  updateIcon(savedTheme);

  toggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
    updateIcon(next);
  });

  function updateIcon(theme) {
    toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
})();

// ===========================
// Active nav link on scroll
// ===========================
(function () {
  const sections = document.querySelectorAll('[data-nav-id]');
  const navLinks = document.querySelectorAll('.nav_links a[href^="#"]');

  function updateActive() {
    let currentId = '';

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const id = section.getAttribute('data-nav-id');

      // Section is "active" when its top has scrolled above 40% of viewport
      if (rect.top <= window.innerHeight * 0.4) {
        currentId = id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();

// ===========================
// Scroll Reveal
// ===========================
(function () {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );

  reveals.forEach((el) => observer.observe(el));
})();

// ===========================
// Typewriter Effect
// ===========================
(function () {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const text = el.getAttribute('data-text');
  el.textContent = '';
  let i = 0;

  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, 50 + Math.random() * 30);
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        type();
        observer.disconnect();
      }
    },
    { threshold: 0.5 }
  );

  observer.observe(el);
})();

// ===========================
// Starfield & Fade Overlay
// ===========================
(function () {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];
  const NUM_STARS = 400;
  
  // Variables for scroll interaction
  let scrollSpeed = 0;
  let lastScrollY = window.scrollY;
  
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resize);
  resize();

  // Initialize stars
  for (let i = 0; i < NUM_STARS; i++) {
    stars.push({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: Math.random()
    });
  }

  // Get primary color based on theme
  function getPrimaryColor() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? '#3be872' : '#17c44e'; // fallback to variables
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const color = getPrimaryColor();
    
    // Base speed + extra speed from scrolling
    const speed = 0.0007 + (scrollSpeed * 0.00015);
    
    stars.forEach(star => {
      star.z -= speed;
      
      // Reset star if it passes the screen
      if (star.z <= 0) {
        star.z = 1;
        star.x = Math.random() * 2 - 1;
        star.y = Math.random() * 2 - 1;
      }
      
      // Calculate 3D perspective projection
      const cx = (star.x / star.z) * (width / 2) + (width / 2);
      const cy = (star.y / star.z) * (height / 2) + (height / 2);
      const radius = (1 - star.z) * 3;
      
      // Draw star
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 1 - star.z; // Fade in as it gets closer
      ctx.fill();
    });
    
    ctx.globalAlpha = 1; // reset alpha
    
    // Apply friction to scroll speed so it decays smoothly
    scrollSpeed *= 0.9;
    
    requestAnimationFrame(draw);
  }
  draw();

  // Scroll tracking for fade effect and star speed
  const fadeOverlay = document.querySelector('.fade-overlay');
  const contentPanel = document.querySelector('.content-panel');

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Calculate star speed delta
    const delta = currentScrollY - lastScrollY;
    scrollSpeed += Math.abs(delta);
    lastScrollY = currentScrollY;

    // Calculate fade out for home section
    if (fadeOverlay && contentPanel) {
      const panelRect = contentPanel.getBoundingClientRect();
      
      // panelRect.top is viewport height initially and goes to 0 as it scrolls up
      let progress = 1 - (panelRect.top / window.innerHeight);
      
      // Clamp progress between 0 and 1
      progress = Math.max(0, Math.min(1, progress));
      
      // Apply opacity (fade goes slightly faster than 1:1 so it's fully black right before panel hits top)
      fadeOverlay.style.opacity = Math.min(1, progress * 1.2);
    }
  }, { passive: true });

})();
