// ===== Sidebar toggle (mobile) =====
const sidebar = document.getElementById('sidebar');
const toggle = document.getElementById('navToggle');

toggle.addEventListener('click', () => sidebar.classList.toggle('open'));

// Close sidebar on nav-link click (mobile)
document.querySelectorAll('#sidebar a').forEach(a => {
  a.addEventListener('click', () => {
    if (window.innerWidth <= 900) sidebar.classList.remove('open');
  });
});

// ===== Active section highlighting via IntersectionObserver =====
const sections = document.querySelectorAll('main section[id]');
const navLinks = new Map();
document.querySelectorAll('#sidebar a[href^="#"]').forEach(a => {
  navLinks.set(a.getAttribute('href').slice(1), a);
});

const setActive = (id) => {
  navLinks.forEach((link, key) => {
    link.classList.toggle('active', key === id);
  });
};

const observer = new IntersectionObserver((entries) => {
  // Pick the entry closest to the top that is intersecting
  const visible = entries
    .filter(e => e.isIntersecting)
    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
  if (visible.length > 0) setActive(visible[0].target.id);
}, {
  rootMargin: '-10% 0px -70% 0px',
  threshold: 0
});

sections.forEach(s => observer.observe(s));
