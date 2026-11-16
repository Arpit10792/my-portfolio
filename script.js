/* ==========================================================================
   Arpit Aggarwal | Portfolio script (vanilla JavaScript, no libraries)
   Edit the DATA section below to change content. Everything else is behaviour.
   ========================================================================== */
'use strict';
document.documentElement.classList.add('js');

/* ============================== DATA ===================================== */
const PROFILE = { email: 'arpitaggarwal5695@gmail.com', github: 'https://github.com/Arpit10792' };

const TYPED_PHRASES = ['web apps that work.', 'games in Java.', 'tools that solve problems.', 'things I can ship.'];

const SKILLS = [
  { title: 'Web development', items: ['HTML', 'CSS', 'JavaScript'] },
  { title: 'Programming', items: ['Java', 'C Programming', 'Python'] },
  { title: 'Tools & workflow', items: ['Git', 'GitHub'] }
];

// category is used by the filter buttons. Replace "#" with real live-demo links.
const PROJECTS = [
  { title: 'Attendance Tracker', category: 'Web', tags: ['HTML', 'CSS', 'JavaScript'],
    desc: 'A fully functional web app for tracking attendance and calculating attendance percentages.',
    github: PROFILE.github, demo: '#' },
  { title: 'Flappy Bird in Java', category: 'Java', tags: ['Java'],
    desc: 'A Flappy Bird game built in Java: guide the bird through the gaps without hitting a pipe.',
    github: PROFILE.github, demo: '' },
  { title: 'Personal Portfolio', category: 'Web', tags: ['HTML', 'CSS', 'JavaScript'],
    desc: 'This website: a responsive portfolio with a dark and light theme.',
    github: PROFILE.github, demo: '#' },
  { title: 'Project Title Four', category: 'Other', tags: ['Python'],
    desc: 'Placeholder: describe what this project does and the problem it solves.',
    github: PROFILE.github, demo: '' }
];

/* ============================== HELPERS ================================== */
const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => [...scope.querySelectorAll(sel)];
const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const el = (tag, className, html) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
};
// Escape text before putting it in innerHTML (keeps data safe if you paste odd characters).
const esc = str => String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let toastTimer;
function toast(message) {
  const t = $('#toast');
  t.textContent = message;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ============================== THEME ==================================== */
const themeBtn = $('.theme-toggle');
function setTheme(theme) {
  root.dataset.theme = theme;
  themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  try { localStorage.setItem('theme', theme); } catch (e) { /* storage blocked: ignore */ }
  document.dispatchEvent(new Event('themechange')); // lets the canvas pick up new colours
}
let savedTheme = null;
try { savedTheme = localStorage.getItem('theme'); } catch (e) {}
setTheme(savedTheme || 'dark');
themeBtn.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

/* ============================== RENDER: SKILLS =========================== */
$('#skills-grid').append(...SKILLS.map(group => {
  const card = el('article', 'skill-group reveal');
  card.innerHTML = `<h3>${esc(group.title)}</h3><ul class="badges">${group.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`;
  return card;
}));

/* ============================== RENDER: PROJECTS + FILTER ================ */
const ICON_GH = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>';
const ICON_LIVE = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>';

const grid = $('#projects-grid');
function renderProjects(filter = 'All') {
  grid.innerHTML = '';
  PROJECTS.filter(p => filter === 'All' || p.category === filter).forEach((p, i) => {
    const card = el('article', 'project');
    card.tabIndex = 0;
    card.style.setProperty('--i', i); // staggers the entrance
    card.innerHTML = `
      <div class="project-top"><span class="chip">${esc(p.category)}</span></div>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.desc)}</p>
      <ul class="tags">${p.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      <div class="project-links">
        <a href="${esc(p.github)}" target="_blank" rel="noopener">${ICON_GH} GitHub</a>
        ${p.demo ? `<a href="${esc(p.demo)}" target="_blank" rel="noopener">${ICON_LIVE} Live demo</a>` : '<span class="no-demo">Demo not available</span>'}
      </div>`;
    grid.append(card);
    attachCardEffects(card);
  });
}
const categories = ['All', ...new Set(PROJECTS.map(p => p.category))];
$('#filters').append(...categories.map((c, i) => {
  const b = el('button', 'filter' + (i === 0 ? ' active' : ''), esc(c));
  b.type = 'button';
  b.setAttribute('aria-pressed', i === 0);
  b.addEventListener('click', () => {
    $$('.filter').forEach(f => { f.classList.remove('active'); f.setAttribute('aria-pressed', 'false'); });
    b.classList.add('active'); b.setAttribute('aria-pressed', 'true');
    renderProjects(c);
  });
  return b;
}));

/* Interactive cards: cursor spotlight + gentle 3D tilt (mouse only) */
function attachCardEffects(card) {
  card.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    card.style.setProperty('--mx', x + 'px');
    card.style.setProperty('--my', y + 'px');
    if (!reducedMotion) {
      card.style.setProperty('--rx', ((y / r.height - 0.5) * -6).toFixed(2) + 'deg');
      card.style.setProperty('--ry', ((x / r.width - 0.5) * 6).toFixed(2) + 'deg');
    }
  });
  card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
}

/* ============================== MOBILE MENU ============================== */
const toggle = $('.nav-toggle'), menu = $('#nav-menu');
function closeMenu() {
  menu.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
}
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
$$('.nav-link').forEach(l => l.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
document.addEventListener('click', e => { if (!e.target.closest('.nav')) closeMenu(); });

/* ============================== SCROLL REVEAL + COUNTERS ================= */
function countUp(node) {
  const target = +node.dataset.count, duration = 900, start = performance.now();
  (function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    node.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))); // ease-out
    if (t < 1) requestAnimationFrame(tick);
  })(start);
}
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    $$('[data-count]', entry.target).forEach(n => reducedMotion ? (n.textContent = n.dataset.count) : countUp(n));
    obs.unobserve(entry.target);
  });
}, { threshold: 0.15 });
$$('.reveal').forEach(n => revealObserver.observe(n));

/* ============================== ACTIVE NAV LINK ========================== */
const links = $$('.nav-link');
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    // Education has no nav link of its own, so it keeps "About" highlighted.
    const id = entry.target.id === 'education' ? 'about' : entry.target.id;
    links.forEach(l => {
      const on = l.getAttribute('href') === '#' + id;
      l.classList.toggle('active', on);
      on ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(s => navObserver.observe(s));

/* ============================== SCROLL: progress bar, header, to-top ===== */
const progress = $('.progress'), header = $('.site-header'), toTop = $('.to-top');
let ticking = false;
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  header.classList.toggle('scrolled', scrollY > 20);
  toTop.classList.toggle('show', scrollY > 600);
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();
toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));

/* ============================== TYPING EFFECT ============================ */
(function typewriter() {
  const target = $('#typed');
  if (reducedMotion) { target.textContent = TYPED_PHRASES[0]; return; }
  let phrase = 0, chars = 0, deleting = false;
  (function step() {
    const text = TYPED_PHRASES[phrase];
    chars += deleting ? -1 : 1;
    target.textContent = text.slice(0, chars);
    let delay = deleting ? 35 : 70;
    if (!deleting && chars === text.length) { deleting = true; delay = 1600; }
    else if (deleting && chars === 0) { deleting = false; phrase = (phrase + 1) % TYPED_PHRASES.length; delay = 350; }
    setTimeout(step, delay);
  })();
})();

/* ============================== HERO CANVAS: particle network ============ */
(function particles() {
  const canvas = $('.hero-canvas'), ctx = canvas.getContext('2d');
  let w, h, dots = [], colour = '139,124,246', running = true, pointer = { x: -999, y: -999 };

  const readColour = () => {
    const hex = getComputedStyle(root).getPropertyValue('--accent').trim().replace('#', '');
    if (hex.length === 6) colour = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16)).join(',');
  };
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(70, Math.floor(w * h / 16000));
    dots = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3 }));
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    dots.forEach((d, i) => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > w) d.vx *= -1;
      if (d.y < 0 || d.y > h) d.vy *= -1;
      ctx.fillStyle = `rgba(${colour},.7)`;
      ctx.beginPath(); ctx.arc(d.x, d.y, 1.6, 0, 6.283); ctx.fill();
      for (let j = i + 1; j < dots.length; j++) {          // connect nearby dots
        const dx = d.x - dots[j].x, dy = d.y - dots[j].y, dist = Math.hypot(dx, dy);
        if (dist < 120) { ctx.strokeStyle = `rgba(${colour},${(1 - dist / 120) * .25})`; ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(dots[j].x, dots[j].y); ctx.stroke(); }
      }
      const pd = Math.hypot(d.x - pointer.x, d.y - pointer.y);  // dots drift away from the cursor
      if (pd < 100) { d.x += (d.x - pointer.x) / pd * .6; d.y += (d.y - pointer.y) / pd * .6; }
    });
    if (running && !reducedMotion) requestAnimationFrame(draw);
  }
  readColour(); resize(); draw();
  addEventListener('resize', resize);
  document.addEventListener('themechange', readColour);
  if (finePointer) canvas.parentElement.addEventListener('pointermove', e => { const r = canvas.getBoundingClientRect(); pointer = { x: e.clientX - r.left, y: e.clientY - r.top }; });
  // Pause when the hero is off screen to save battery.
  new IntersectionObserver(([e]) => { const was = running; running = e.isIntersecting; if (running && !was && !reducedMotion) requestAnimationFrame(draw); }).observe(canvas);
})();

/* ============================== CODE WINDOW TILT ========================= */
const win = $('.code-window');
if (finePointer && !reducedMotion) {
  win.addEventListener('pointermove', e => {
    const r = win.getBoundingClientRect();
    win.style.transform = `perspective(900px) rotateX(${((e.clientY - r.top) / r.height - .5) * -8}deg) rotateY(${((e.clientX - r.left) / r.width - .5) * 8}deg)`;
  });
  win.addEventListener('pointerleave', () => { win.style.transform = ''; });
}

/* ============================== COPY EMAIL =============================== */
$('#copy-email').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(PROFILE.email); toast('Email address copied'); }
  catch (e) { toast('Copy failed. Select the address and copy it manually.'); }
});

/* ============================== CONTACT FORM ============================= */
const form = $('#contact-form'), note = $('#form-note');
const rules = {
  name:    v => v.trim().length >= 2 || 'Enter your name (at least 2 characters).',
  email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address, like name@example.com.',
  subject: v => v.trim().length >= 3 || 'Enter a subject (at least 3 characters).',
  message: v => v.trim().length >= 10 || 'Write a message of at least 10 characters.'
};
function validate(input) {
  const result = rules[input.name](input.value), field = input.closest('.field');
  field.classList.toggle('invalid', result !== true);
  $('.error', field).textContent = result === true ? '' : result;
  input.setAttribute('aria-invalid', result !== true);
  return result === true;
}
$$('input, textarea', form).forEach(i => { i.addEventListener('blur', () => validate(i)); i.addEventListener('input', () => i.closest('.field').classList.contains('invalid') && validate(i)); });
form.addEventListener('submit', e => {
  e.preventDefault();
  const allValid = $$('input, textarea', form).map(validate).every(Boolean);
  if (!allValid) { note.textContent = 'Fix the highlighted fields and try again.'; $('.invalid input, .invalid textarea', form)?.focus(); return; }
  // No backend: open the visitor's email app. Use Formspree or EmailJS later to send real messages.
  const d = Object.fromEntries(new FormData(form));
  location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(`${d.message}\n\nFrom: ${d.name} (${d.email})`)}`;
  note.textContent = 'Your email app should open with the message ready to send.';
});

$('#year').textContent = new Date().getFullYear();
