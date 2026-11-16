/* Small script for internship.html: theme, mobile menu, reveal. */
'use strict';
document.documentElement.classList.add('js');
const $ = (s, c = document) => c.querySelector(s);
const root = document.documentElement;
const themeBtn = $('.theme-toggle');
function setTheme(t) {
  root.dataset.theme = t;
  themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  try { localStorage.setItem('theme', t); } catch (e) {}
}
let saved = null;
try { saved = localStorage.getItem('theme'); } catch (e) {}
setTheme(saved || 'dark');
themeBtn.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

const toggle = $('.nav-toggle'), menu = $('#nav-menu');
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

const io = new IntersectionObserver((entries, obs) => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
}), { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(n => io.observe(n));
$('#year').textContent = new Date().getFullYear();
