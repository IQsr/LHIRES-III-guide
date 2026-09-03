// ===== Accessible mobile navigation =====
const sidebar = document.getElementById('sidebar');
const toggle = document.getElementById('navToggle');
const backdrop = document.getElementById('navBackdrop');

const setMenu = (open) => {
  sidebar.classList.toggle('open', open);
  backdrop.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  document.body.classList.toggle('menu-open', open);
};

toggle.addEventListener('click', () => setMenu(!sidebar.classList.contains('open')));
backdrop.addEventListener('click', () => setMenu(false));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setMenu(false);
    toggle.focus();
  }
});

document.querySelectorAll('#sidebar a').forEach((link) => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 900) setMenu(false);
  });
});

// ===== Light / dark theme =====
const themeToggle = document.getElementById('themeToggle');
const THEME_KEY = 'lhires-guide-theme';

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  const isLight = theme === 'light';
  themeToggle.textContent = isLight ? '☾' : '☀';
  themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isLight ? '#f6f8fa' : '#0f1419');
};

let savedTheme = null;
try {
  savedTheme = localStorage.getItem(THEME_KEY);
} catch (_) {
  // Storage can be unavailable in privacy-restricted browsers.
}
applyTheme(savedTheme === 'light' ? 'light' : 'dark');

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  applyTheme(next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch (_) {}
});

// ===== Active section highlighting =====
const sections = document.querySelectorAll('main section[id]');
const navLinks = new Map();
document.querySelectorAll('#sidebar a[href^="#"]').forEach((link) => {
  navLinks.set(link.getAttribute('href').slice(1), link);
});

const setActive = (id) => {
  navLinks.forEach((link, key) => {
    link.classList.toggle('active', key === id);
    if (key === id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
};

const observer = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
  if (visible.length > 0) setActive(visible[0].target.id);
}, {
  rootMargin: '-10% 0px -70% 0px',
  threshold: 0
});

sections.forEach((section) => observer.observe(section));

// ===== Persistent observing checklist =====
const checklist = [...document.querySelectorAll('.check-list input[type="checkbox"]')];
const progress = document.getElementById('checkProgress');
const resetButton = document.getElementById('resetChecklist');
const printButton = document.getElementById('printChecklist');
const fieldIds = ['sessionDate', 'sessionObserver', 'sessionTarget', 'sessionSetting', 'sessionLampFrame'];
const fields = fieldIds.map((id) => document.getElementById(id)).filter(Boolean);
const CHECKLIST_KEY = 'lhires-observing-checklist-v1';

const updateProgress = () => {
  const complete = checklist.filter((item) => item.checked).length;
  progress.textContent = `${complete} / ${checklist.length} completed`;
  progress.classList.toggle('complete', complete === checklist.length);
};

const readChecklistState = () => {
  try {
    return JSON.parse(localStorage.getItem(CHECKLIST_KEY) || '{}');
  } catch (_) {
    return {};
  }
};

const saveChecklistState = () => {
  const state = {
    checks: checklist.map((item) => item.checked),
    fields: Object.fromEntries(fields.map((field) => [field.id, field.value]))
  };
  try {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(state));
  } catch (_) {}
  updateProgress();
};

const savedChecklist = readChecklistState();
checklist.forEach((item, index) => {
  item.checked = Boolean(savedChecklist.checks?.[index]);
  item.addEventListener('change', saveChecklistState);
});
fields.forEach((field) => {
  field.value = savedChecklist.fields?.[field.id] || '';
  field.addEventListener('input', saveChecklistState);
});

const dateField = document.getElementById('sessionDate');
if (dateField && !dateField.value) {
  dateField.value = new Date().toISOString().slice(0, 10);
  saveChecklistState();
}

resetButton.addEventListener('click', () => {
  const confirmed = window.confirm('Clear the saved checklist and start a new observing night?');
  if (!confirmed) return;
  checklist.forEach((item) => { item.checked = false; });
  fields.forEach((field) => { field.value = ''; });
  if (dateField) dateField.value = new Date().toISOString().slice(0, 10);
  saveChecklistState();
});

printButton.addEventListener('click', () => window.print());
updateProgress();
