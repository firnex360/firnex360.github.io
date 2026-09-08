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
