/* NutriScan AI - single-page frontend (vanilla JS, no build step). */
'use strict';

/* =============================================================== icons */
const P = {
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  home: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z"/>',
  scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3.5"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
  plan: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 15l2 2 4-4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3.5"/>',
  cloud: '<path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2M12 12v9M16 16l-4-4-4 4"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  drop: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5S5 13 5 15a7 7 0 0 0 7 7z"/>',
  wheat: '<path d="M2 22 16 8M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94zM7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94zM11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94zM20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4z"/>',
  dumbbell: '<path d="M14.4 14.4 9.6 9.6M18.66 21.51a2 2 0 1 1-2.83-2.83l-1.77 1.77a2 2 0 1 1-2.83-2.83l6.37-6.37a2 2 0 1 1 2.83 2.83l-1.77 1.77a2 2 0 1 1 2.83 2.83zM21.5 21.5l-1.4-1.4M3.9 3.9 2.5 2.5M6.4 12.77a2 2 0 1 1-2.83-2.83l1.77-1.77a2 2 0 1 1-2.83-2.83l2.83-2.83a2 2 0 1 1 2.83 2.83l1.77-1.77a2 2 0 1 1 2.83 2.83z"/>',
  sprout: '<path d="M7 20h10M10 20c5.5-2.5.8-6.4 3-10M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8zM14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.2 12.5h4.3l1.5-3 2 6 1.5-3h8.3"/>',
  brain: '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4M17.6 6.5A3 3 0 0 0 18 5M6 5a3 3 0 0 0 .4 1.5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  swap: '<path d="m16 3 4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16"/>',
  alert: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M9.9 4.24A9 9 0 0 1 12 4c6.5 0 10 7 10 7a18 18 0 0 1-2.16 3.19M6.6 6.6A18 18 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6M2 2l20 20M14.1 14.1a3 3 0 1 1-4.2-4.2"/>',
  more: '<circle cx="12" cy="5" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="12" cy="19" r="1.2"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-2.64-6.36L21 8M21 3v5h-5"/>',
  sparkles: '<path d="M12 3l1.9 5.8L20 10l-6.1 1.2L12 17l-1.9-5.8L4 10l6.1-1.2zM19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z"/>',
  key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
  bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
};
const ic = (name, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${P[name] || ''}</svg>`;

/* ============================================================= helpers */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const TZ = -new Date().getTimezoneOffset();
const round = (n, d = 0) => { const f = 10 ** d; return Math.round((Number(n) || 0) * f) / f; };
const fmt = (n, d = 0) => round(n, d).toLocaleString(undefined, { maximumFractionDigits: d });
const clamp = (n, a, b) => Math.min(Math.max(n, a), b);
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
const COLORS = ['#EE8434', '#2C8DB6', '#8763E0', '#36A56A', '#DE4F6A', '#E9A91F', '#1F9E9A', '#7A5C3E'];
const CAT_EMOJI = { bread: '🫓', grains: '🍚', south_indian: '🥞', legumes: '🥣', dairy: '🥛', curry: '🍛', protein: '🍗', vegetables: '🥗', drinks: '☕', fruit: '🍎', nuts: '🥜', fats: '🧈', snack: '🥟', fast_food: '🍔', sweets: '🍨', unknown: '🍽️' };
const NUT = {
  calories: { label: 'Calories', unit: 'kcal', color: 'var(--kcal)', bg: '#FDEBDD', icon: 'flame', goal: 'calorie_goal' },
  protein_g: { label: 'Protein', unit: 'g', color: 'var(--protein)', bg: '#DFF0F8', icon: 'dumbbell', goal: 'protein_goal_g' },
  carbs_g: { label: 'Carbs', unit: 'g', color: 'var(--carbs)', bg: '#ECE6FB', icon: 'wheat', goal: 'carbs_goal_g' },
  fat_g: { label: 'Fat', unit: 'g', color: 'var(--fat)', bg: '#FCF1D6', icon: 'drop', goal: 'fat_goal_g' },
  fiber_g: { label: 'Fiber', unit: 'g', color: 'var(--fiber)', bg: '#DDF3E6', icon: 'sprout', goal: 'fiber_goal_g' },
};
const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

const S = {
  token: localStorage.getItem('ns_token'),
  user: null,
  engine: null,
  scan: null,            // {dataUrl, filename, size, quality, checking, error}
  analysis: null,
  results: { hot: null, showBoxes: true, saveName: '', mealType: null },
  plan: { tab: 'summary', days: 7 },
  history: { q: '', type: '' },
};

function toast(msg, type = 'ok') {
  const el = document.createElement('div');
  el.className = `toast ${type === 'error' ? 'error' : ''}`;
  el.innerHTML = `${ic(type === 'error' ? 'alert' : 'check')}<span>${esc(msg)}</span>`;
  $('#toasts').appendChild(el);
  setTimeout(() => el.remove(), type === 'error' ? 5200 : 3200);
}

async function api(path, { method = 'GET', body, signal } = {}) {
  let res;
  try {
    res = await fetch(path, {
      method, signal,
      headers: { 'Content-Type': 'application/json', ...(S.token ? { Authorization: `Bearer ${S.token}` } : {}) },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    if (e.name === 'AbortError') throw e;
    throw new Error('The NutriScan server is not reachable. Make sure it is running.');
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && !path.includes('/auth/')) {
    clearSession();
    go('#/login');
    throw new Error('Your session expired. Log in again.');
  }
  if (!res.ok) {
    const err = new Error(data.error?.message || `Request failed (${res.status}).`);
    err.code = data.error?.code;
    throw err;
  }
  return data;
}
const imgSrc = (url) => (url ? `${url}?token=${encodeURIComponent(S.token)}` : '');

function setSession({ token, user }) {
  S.token = token; S.user = user;
  localStorage.setItem('ns_token', token);
}
function clearSession() {
  S.token = null; S.user = null;
  localStorage.removeItem('ns_token');
}
function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}
const firstName = () => (S.user?.name || '').split(' ')[0];
const initials = () => (S.user?.name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

function dayLabel(iso) {
  const d = new Date(iso); const t = new Date();
  const k = (x) => x.toDateString();
  const y = new Date(); y.setDate(t.getDate() - 1);
  if (k(d) === k(t)) return 'Today';
  if (k(d) === k(y)) return 'Yesterday';
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
}
const timeLabel = (iso) => new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
const macroChips = (t) => `<div class="macros">
  <span class="macro k">${fmt(t.calories)} kcal</span><span class="macro p">${fmt(t.protein_g)} g protein</span>
  <span class="macro c">${fmt(t.carbs_g)} g carbs</span><span class="macro f">${fmt(t.fat_g)} g fat</span></div>`;

/* ============================================================== router */
const ROUTES = {};
function go(hash) { if (location.hash === hash) router(); else location.hash = hash; }
async function router() {
  const [name = '', arg] = location.hash.replace(/^#\/?/, '').split('/');
  const route = name || (S.token ? 'home' : 'login');
  closeOverlays();
  if (!S.token && !['login', 'signup'].includes(route)) return go('#/login');
  if (S.token && ['login', 'signup'].includes(route)) return go('#/home');
  if (S.token && !S.user) {
    try {
      const me = await api('/api/v1/me');
      S.user = me.user; S.engine = me.engine;
    } catch (e) { return; }
  }
  const view = ROUTES[route] || ROUTES.home;
  window.scrollTo(0, 0);
  await view(arg);
}
window.addEventListener('hashchange', router);

/* focus-preserving render: keeps the focused control focused across re-renders */
function paint(html) {
  const active = document.activeElement;
  const key = active?.dataset?.focus;
  const sel = key && active.selectionStart != null ? [active.selectionStart, active.selectionEnd] : null;
  $('#app').innerHTML = html;
  if (key) {
    const el = $(`[data-focus="${CSS.escape(key)}"]`);
    if (el) { el.focus(); if (sel && el.setSelectionRange) try { el.setSelectionRange(...sel); } catch (_) { /* number inputs */ } }
  }
}

/* ============================================================== shell */
function shell(active, content) {
  const nav = [['home', 'Home', 'home'], ['scan', 'Scan meal', 'scan'], ['history', 'History', 'history'], ['plan', 'Nutrition plan', 'plan'], ['profile', 'Profile', 'user']];
  return `<div class="layout">
    <aside class="sidebar">
      <div class="brand"><span class="brand-mark">${ic('leaf')}</span>NutriScan</div>
      <nav class="nav" aria-label="Main">
        ${nav.map(([r, l, i]) => `<a href="#/${r}" class="${active === r ? 'active' : ''}" ${active === r ? 'aria-current="page"' : ''}>${ic(i)}<span>${l}</span></a>`).join('')}
      </nav>
      <div class="nav logout"><a href="#" class="logout-btn" data-action="logout">${ic('logout')}<span>Log out</span></a></div>
    </aside>
    <main class="main">
      <header class="topbar">
        ${S.engine?.mode === 'demo' ? `<a class="pill fair" href="#/profile" title="Add an API key to enable image recognition">${ic('bolt', 'width="13" height="13"')} Demo mode</a>` : `<span class="pill good">${ic('sparkles', 'width="13" height="13"')} AI vision on</span>`}
        <div style="position:relative">
          <button class="user-pill" data-action="user-menu" aria-haspopup="true"><span class="avatar">${esc(initials())}</span>Hello, ${esc(firstName())} ${ic('chevron', 'width="15" height="15"')}</button>
        </div>
      </header>
      <div class="page">${content}</div>
    </main>
  </div>`;
}

document.addEventListener('click', async (e) => {
  const a = e.target.closest('[data-action]');
  const openMenu = $('.menu.user');
  if (openMenu && !e.target.closest('.menu.user') && a?.dataset.action !== 'user-menu') openMenu.remove();
  if (!e.target.closest('.search-pop')) $$('.search-results').forEach((x) => x.remove());
  if (!a) return;
  const act = a.dataset.action;
  if (act === 'logout') {
    e.preventDefault();
    try { await api('/api/v1/auth/logout', { method: 'POST' }); } catch (_) { /* already gone */ }
    clearSession(); toast('Logged out.'); go('#/login');
  } else if (act === 'user-menu') {
    if (openMenu) return openMenu.remove();
    a.parentElement.insertAdjacentHTML('beforeend', `<div class="menu user" role="menu">
      <a href="#/profile" role="menuitem">${ic('user')}Profile</a>
      <a href="#/plan" role="menuitem">${ic('target')}Goals</a>
      <button class="danger-item" data-action="logout" role="menuitem">${ic('logout')}Log out</button></div>`);
  } else if (act === 'pick-file') {
    $('#file-input').click();
  } else if (act === 'camera') {
    openCamera();
  }
});

/* ================================================================ auth */
const BOWL_ART = `<svg class="bowl" viewBox="0 0 400 300" aria-hidden="true">
  <ellipse cx="200" cy="170" rx="190" ry="120" fill="#2a2f2c"/><ellipse cx="200" cy="160" rx="176" ry="108" fill="#3b423e"/>
  <ellipse cx="200" cy="158" rx="160" ry="96" fill="#f3efe6"/>
  <path d="M60 150 Q120 70 200 80 L200 158Z" fill="#E7D6A8"/>
  ${Array.from({ length: 26 }, (_, i) => `<circle cx="${95 + (i % 7) * 15 + (i % 2) * 5}" cy="${105 + Math.floor(i / 7) * 13}" r="6.5" fill="${i % 3 ? '#E0A742' : '#D48E2A'}"/>`).join('')}
  <path d="M200 80 Q300 72 345 150 L200 158Z" fill="#3E8E3A"/>
  ${Array.from({ length: 9 }, (_, i) => `<path d="M${215 + (i % 5) * 24} ${95 + Math.floor(i / 5) * 25} q12 -14 24 0 q-12 14 -24 0z" fill="${i % 2 ? '#5FB548' : '#7BCB5A'}"/>`).join('')}
  <path d="M345 150 Q330 230 220 250 L200 158Z" fill="#8DBF4B"/>
  ${[0, 1, 2, 3].map((i) => `<ellipse cx="${250 + i * 18}" cy="${190 + i * 10}" rx="30" ry="12" transform="rotate(${-30 + i * 8} ${250 + i * 18} ${190 + i * 10})" fill="#A9D46A" stroke="#6E9B2F" stroke-width="3"/>`).join('')}
  <path d="M220 250 Q120 250 60 150 L200 158Z" fill="#F7F1E4"/>
  ${Array.from({ length: 30 }, (_, i) => `<rect x="${90 + (i % 8) * 13}" y="${170 + Math.floor(i / 8) * 13}" width="9" height="4" rx="2" transform="rotate(${(i * 37) % 180} ${94 + (i % 8) * 13} ${172 + Math.floor(i / 8) * 13})" fill="#E9DDC5"/>`).join('')}
  ${[[150, 150], [185, 125], [120, 185], [205, 205], [170, 230], [235, 135]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="#E23B2E"/><circle cx="${x - 5}" cy="${y - 6}" r="4" fill="#F7836F"/>`).join('')}
</svg>`;

function authLayout(form) {
  return `<div class="auth">
    <section class="auth-hero">
      <div class="brand"><span class="brand-mark">${ic('leaf')}</span>NutriScan</div>
      <h2>Scan. Know. Eat better.</h2>
      <p>Upload a photo of your meal and get an itemised nutrition estimate in seconds. Check it, adjust the portions, and keep a history of what you eat.</p>
      ${BOWL_ART}
    </section>
    <section class="auth-form">${form}</section>
  </div>`;
}

ROUTES.login = () => {
  paint(authLayout(`<form class="auth-card" id="auth-form" novalidate>
    <div><h1>Welcome back!</h1><p class="muted">Log in to continue.</p></div>
    <div id="auth-error"></div>
    <div class="field"><label for="email">Email address</label><div class="input-wrap">${ic('mail')}<input class="input" id="email" type="email" autocomplete="email" required></div></div>
    <div class="field"><label for="password">Password</label><div class="input-wrap">${ic('lock')}<input class="input" id="password" type="password" autocomplete="current-password" required>
      <button type="button" class="icon-btn suffix-btn" data-toggle-pw aria-label="Show password" style="border:0">${ic('eye')}</button></div></div>
    <button class="btn primary block" type="submit">Log in</button>
    <div class="divider">or</div>
    <div class="social">
      <button type="button" class="btn block" data-social="Google"><svg viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2-1.9 3.2-4.7 3.2-8z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1-3.7 1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.1a11 11 0 0 0 0 9.8z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3 .6 4.2 1.6l3.1-3.1A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z"/></svg>Continue with Google</button>
      <button type="button" class="btn block" data-social="Apple"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.8 1.2 1.8 2.6 3.1 2.6 1.3-.1 1.7-.8 3.3-.8s2 .8 3.4.8c1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.6-1-2.6-4.1zM13.9 5c.7-.9 1.2-2 1-3.2-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.1 1.2.1 2.3-.6 3.1-1.5z"/></svg>Continue with Apple</button>
    </div>
    <p class="auth-switch">Don't have an account? <a class="link" href="#/signup">Sign up</a></p>
  </form>`));
  bindAuthForm('login');
};

ROUTES.signup = () => {
  paint(authLayout(`<form class="auth-card" id="auth-form" novalidate>
    <div><h1>Create your account</h1><p class="muted">It takes less than a minute.</p></div>
    <div id="auth-error"></div>
    <div class="field"><label for="name">Your name</label><div class="input-wrap">${ic('user')}<input class="input" id="name" autocomplete="name" required></div></div>
    <div class="field"><label for="email">Email address</label><div class="input-wrap">${ic('mail')}<input class="input" id="email" type="email" autocomplete="email" required></div></div>
    <div class="field"><label for="password">Password</label><div class="input-wrap">${ic('lock')}<input class="input" id="password" type="password" autocomplete="new-password" minlength="6" required>
      <button type="button" class="icon-btn suffix-btn" data-toggle-pw aria-label="Show password" style="border:0">${ic('eye')}</button></div>
      <span class="small muted">At least 6 characters.</span></div>
    <button class="btn primary block" type="submit">Create account</button>
    <p class="auth-switch">Already have an account? <a class="link" href="#/login">Log in</a></p>
  </form>`));
  bindAuthForm('signup');
};

function bindAuthForm(mode) {
  const form = $('#auth-form');
  $('[data-toggle-pw]').onclick = (e) => {
    const input = $('#password'); const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    e.currentTarget.innerHTML = ic(show ? 'eyeOff' : 'eye');
    e.currentTarget.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  };
  $$('[data-social]').forEach((b) => { b.onclick = () => toast(`${b.dataset.social} sign-in needs OAuth credentials, which this local build doesn't include. Use email instead.`, 'error'); });
  form.onsubmit = async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]'); const label = btn.textContent;
    btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>';
    const body = { email: $('#email').value, password: $('#password').value };
    if (mode === 'signup') body.name = $('#name').value;
    try {
      const res = await api(`/api/v1/auth/${mode}`, { method: 'POST', body });
      setSession(res);
      const me = await api('/api/v1/me'); S.engine = me.engine;
      toast(mode === 'signup' ? `Welcome, ${firstName()}!` : `Welcome back, ${firstName()}!`);
      go('#/home');
    } catch (err) {
      $('#auth-error').innerHTML = `<div class="form-error" role="alert">${esc(err.message)}</div>`;
      btn.disabled = false; btn.textContent = label;
    }
  };
}

/* ================================================================ home */
const PHONE_ART = `<svg class="phone-art" viewBox="0 0 200 250" aria-hidden="true">
  <path d="M18 40V22a8 8 0 0 1 8-8h18M156 14h18a8 8 0 0 1 8 8v18M182 210v18a8 8 0 0 1-8 8h-18M44 236H26a8 8 0 0 1-8-8v-18" stroke="#9ED3B6" stroke-width="3" fill="none"/>
  <rect x="50" y="10" width="100" height="230" rx="18" fill="#0F4937"/><rect x="57" y="22" width="86" height="206" rx="11" fill="#E8F4ED"/>
  <circle cx="100" cy="125" r="34" fill="#fff" stroke="#D9CDB4" stroke-width="3"/>
  <path d="M72 120 Q84 94 100 94 L100 125Z" fill="#E0A742"/><path d="M100 94 Q124 96 132 122 L100 125Z" fill="#5FB548"/>
  <path d="M132 122 Q128 150 104 157 L100 125Z" fill="#E23B2E"/><path d="M104 157 Q76 154 72 120 L100 125Z" fill="#F4EBD8"/>
  <path d="M76 99V91h8M116 91h8v8M124 151v8h-8M84 159h-8v-8" stroke="#17734F" stroke-width="2.5" fill="none"/>
  <rect class="scanline" x="60" y="38" width="80" height="3" rx="1.5" fill="#3FBF7F" opacity=".8"/>
</svg>`;

ROUTES.home = async () => {
  paint(shell('home', `<div class="page-head"><div><h1>${greeting()}, ${esc(firstName())}! 👋</h1><p>Track your nutrition, one meal at a time.</p></div></div>
    ${engineBanner()}
    <section class="card hero-scan">
      <div><h2>Scan your meal</h2><p>Upload a photo or take a picture of your food to get calories, protein, carbs, fat and fiber for each item.</p>
        <div class="actions"><button class="btn primary" data-action="pick-file">${ic('upload')}Upload image</button><button class="btn" data-action="camera">${ic('camera')}Take photo</button></div>
      </div>${PHONE_ART}
    </section>
    <div class="grid-3" id="home-stats">${[0, 1, 2].map(() => '<div class="card skeleton" style="height:150px"></div>').join('')}</div>
    <section class="card"><div class="card-head"><h2>Recent meals</h2><a class="link" href="#/history">View all</a></div><div id="home-recent"><div class="skeleton" style="height:70px"></div></div></section>`));
  try {
    const [sum, meals] = await Promise.all([api(`/api/v1/summary?days=7&tz=${TZ}`), api('/api/v1/meals?limit=3')]);
    const g = sum.goals; const t = sum.today;
    const pct = (v, goal) => clamp((v / goal) * 100, 0, 100);
    $('#home-stats').innerHTML = `
      <a class="card feature" href="#/plan" style="text-decoration:none;color:inherit"><span class="ico" style="background:#FDEBDD;color:var(--kcal)">${ic('flame')}</span><h3>Know calories</h3>
        <div class="big">${fmt(t.calories)} <small>/ ${fmt(g.calorie_goal)} kcal today</small></div><div class="meter"><span style="width:${pct(t.calories, g.calorie_goal)}%;background:var(--kcal)"></span></div></a>
      <a class="card feature" href="#/plan" style="text-decoration:none;color:inherit"><span class="ico" style="background:#DDF3E6;color:var(--green)">${ic('leaf')}</span><h3>Get nutrition</h3>
        <div class="big">${fmt(t.protein_g)} g <small>protein of ${fmt(g.protein_goal_g)} g</small></div><div class="meter"><span style="width:${pct(t.protein_g, g.protein_goal_g)}%;background:var(--protein)"></span></div></a>
      <a class="card feature" href="#/history" style="text-decoration:none;color:inherit"><span class="ico" style="background:#DDF3E6;color:var(--green)">${ic('heart')}</span><h3>Build healthy habits</h3>
        <div class="big">${sum.streak} <small>${sum.streak === 1 ? 'day' : 'days'} logging in a row</small></div><p class="small muted">${sum.total_meals} meals logged in the last 7 days.</p></a>`;
    $('#home-recent').innerHTML = meals.meals.length
      ? `<div class="day-group">${meals.meals.map(mealRow).join('')}</div>`
      : `<div class="empty-state"><div class="emoji">🍽️</div><p class="muted">No meals yet. Scan your first meal to start your history.</p>
         <div class="actions"><button class="btn primary" data-action="pick-file">${ic('upload')}Upload image</button><button class="btn" data-seed>Load a sample week</button></div></div>`;
    bindMealRows(meals.meals);
    bindSeed();
  } catch (e) { toast(e.message, 'error'); }
};

function engineBanner() {
  if (S.engine?.mode !== 'demo') return '';
  return `<div class="banner warn">${ic('bolt')}<div class="body"><b>Demo mode: image recognition is off</b>
    <span class="small">Without an AI key, NutriScan reads food names from the file name (for example <i>roti_dal_rice.jpg</i>) and you confirm the items. Add your Anthropic API key to recognise foods from the photo itself.</span>
    <div class="actions"><a class="btn sm primary" href="#/profile">${ic('key')}Add API key</a></div></div></div>`;
}

function bindSeed() {
  $$('[data-seed]').forEach((b) => {
    b.onclick = async () => {
      b.disabled = true; b.innerHTML = '<span class="spinner"></span>';
      try { const r = await api('/api/v1/demo/seed', { method: 'POST', body: { tz: TZ } }); toast(`Added ${r.created} sample meals.`); router(); } catch (e) { toast(e.message, 'error'); b.disabled = false; }
    };
  });
}

/* ================================================================ scan */
$('#file-input').addEventListener('change', (e) => {
  const file = e.target.files[0];
  e.target.value = '';
  if (file) acceptFile(file);
});

function acceptFile(file) {
  const okType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
  S.scan = { filename: file.name, size: file.size, dataUrl: null, quality: null, checking: false, error: null };
  if (!okType) S.scan.error = `${file.name} isn't a supported image. Use JPG, PNG or WEBP.`;
  else if (file.size > 5 * 1024 * 1024) S.scan.error = `This image is ${(file.size / 1048576).toFixed(1)} MB. The limit is 5 MB.`;
  if (S.scan.error) { S.scan.dataUrl = null; return location.hash === '#/scan' ? ROUTES.scan() : go('#/scan'); }
  const reader = new FileReader();
  reader.onload = () => { setScanImage(reader.result, file.name, file.size); };
  reader.readAsDataURL(file);
}

async function setScanImage(dataUrl, filename, size) {
  S.scan = { dataUrl, filename, size, quality: null, checking: true, error: null };
  if (location.hash !== '#/scan') go('#/scan'); else ROUTES.scan();
  try {
    const r = await api('/api/v1/quality-check', { method: 'POST', body: { image: dataUrl } });
    if (S.scan?.dataUrl !== dataUrl) return;
    S.scan.quality = r.quality; S.scan.format = r.format;
  } catch (e) {
    if (S.scan?.dataUrl !== dataUrl) return;
    S.scan.error = e.message;
  }
  S.scan.checking = false;
  if (location.hash === '#/scan') ROUTES.scan();
}

ROUTES.scan = () => {
  const sc = S.scan;
  let body;
  if (!sc?.dataUrl) {
    body = `${sc?.error ? `<div class="banner error">${ic('alert')}<div class="body">${esc(sc.error)}</div></div>` : ''}
    <div class="card"><div class="scan-grid">
      <div class="dropzone" id="dropzone" role="button" tabindex="0" aria-label="Upload a meal photo">
        <div>${ic('cloud', 'class="big-ico"')}<p><b>Drag and drop your image here</b></p><p class="muted small" style="margin:.4rem 0 .9rem">or</p>
        <button class="btn primary" data-action="pick-file">Choose file</button></div>
      </div>
      <span class="or-sep">or</span>
      <div class="card camera-card" data-action="camera" role="button" tabindex="0"><div>${ic('camera', 'class="big-ico"')}<h3>Take a photo</h3><p class="muted small">Use your camera to capture your meal.</p></div></div>
    </div>
    <p class="small muted" style="margin-top:1rem">Supported formats: JPG, PNG, WEBP (max 5 MB). For best results, shoot from above in good light with the whole plate in frame.</p></div>`;
  } else {
    const q = sc.quality;
    body = `<div class="card"><div class="preview-grid">
      <div class="preview-img"><img src="${sc.dataUrl}" alt="Selected meal photo"></div>
      <div style="display:grid;gap:1rem">
        <h2>Ready to analyse</h2>
        <dl class="facts"><dt>File</dt><dd>${esc(sc.filename)}</dd><dt>Size</dt><dd>${(sc.size / 1024).toFixed(0)} KB</dd>
          ${q ? `<dt>Dimensions</dt><dd>${q.width} × ${q.height}px</dd>` : ''}</dl>
        <div class="quality">
          ${sc.checking ? '<div class="row"><span>Checking photo quality…</span><span class="spinner" style="color:var(--green)"></span></div>'
    : sc.error ? `<div class="row" style="color:var(--danger)">${esc(sc.error)}</div>`
      : `<div class="row"><b>Photo quality</b><span class="pill ${q.label.toLowerCase()}">${q.label}, ${q.score}/100</span></div>
             <div class="meter"><span style="width:${q.score}%;background:${q.score >= 75 ? 'var(--fiber)' : q.score >= 50 ? 'var(--fat)' : 'var(--danger)'}"></span></div>
             ${q.warnings.length ? `<ul class="small" style="margin:0;padding-left:1.1rem;color:var(--warn)">${q.warnings.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>` : '<span class="small muted">Lighting and focus look good.</span>'}`}
        </div>
        ${S.engine?.mode === 'demo' ? `<div class="banner warn small">${ic('bolt')}<div class="body">Demo mode reads food names from the file name. Rename the file (e.g. <i>idli_sambar.jpg</i>) or add foods on the next screen.</div></div>` : ''}
        <div style="display:flex;gap:.6rem;flex-wrap:wrap">
          <button class="btn primary" id="analyze-btn" ${sc.checking || sc.error ? 'disabled' : ''}>${ic('sparkles')}Analyse meal</button>
          <button class="btn" data-action="pick-file">Choose another</button>
          <button class="btn ghost" data-action="camera">${ic('camera')}Retake</button>
        </div>
      </div></div></div>`;
  }
  paint(shell('scan', `<div class="page-head"><div><h1>Scan your meal</h1><p>Upload a food image or take a photo to get nutrition details.</p></div></div>${body}`));
  const dz = $('#dropzone');
  if (dz) {
    dz.ondragover = (e) => { e.preventDefault(); dz.classList.add('drag'); };
    dz.ondragleave = () => dz.classList.remove('drag');
    dz.ondrop = (e) => { e.preventDefault(); dz.classList.remove('drag'); const f = e.dataTransfer.files[0]; if (f) acceptFile(f); };
    dz.onclick = (e) => { if (!e.target.closest('button')) $('#file-input').click(); };
    dz.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('#file-input').click(); } };
  }
  const cam = $('.camera-card'); if (cam) cam.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCamera(); } };
  const btn = $('#analyze-btn'); if (btn) btn.onclick = runAnalysis;
};

/* --------------------------------------------------------------- camera */
let camStream = null;
function stopCamera() { if (camStream) { camStream.getTracks().forEach((t) => t.stop()); camStream = null; } }
function closeOverlays() { stopCamera(); $('#overlay-root').innerHTML = ''; }

async function openCamera() {
  if (!navigator.mediaDevices?.getUserMedia) {
    toast('This browser can\'t open the camera here. Choose a photo instead.', 'error');
    return $('#file-input').click();
  }
  $('#overlay-root').innerHTML = `<div class="modal-back" id="cam-modal"><div class="modal" role="dialog" aria-modal="true" aria-label="Take a photo">
    <div class="modal-head"><h2>Take a photo</h2><button class="icon-btn" id="cam-close" aria-label="Close">${ic('x')}</button></div>
    <div class="modal-body"><div class="camera-view" id="cam-view"><span class="spinner" style="color:#fff"></span></div>
      <p class="small muted">Fit the whole plate inside the frame and hold steady.</p></div>
    <div class="modal-foot" id="cam-actions"><button class="btn primary" id="cam-shoot" disabled>${ic('camera')}Capture</button></div></div></div>`;
  $('#cam-close').onclick = closeOverlays;
  $('#cam-modal').onclick = (e) => { if (e.target.id === 'cam-modal') closeOverlays(); };
  try {
    camStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1440 } }, audio: false });
  } catch (e) {
    closeOverlays();
    toast(e.name === 'NotAllowedError' ? 'Camera permission was denied. Allow it in your browser, or upload a photo.' : 'No camera was found. Upload a photo instead.', 'error');
    return;
  }
  const view = $('#cam-view'); if (!view) return stopCamera();
  view.innerHTML = '<video autoplay playsinline muted></video><div class="frame"></div>';
  const video = $('video', view); video.srcObject = camStream;
  const shoot = $('#cam-shoot'); shoot.disabled = false;
  shoot.onclick = () => {
    const c = document.createElement('canvas');
    c.width = video.videoWidth; c.height = video.videoHeight;
    c.getContext('2d').drawImage(video, 0, 0);
    const dataUrl = c.toDataURL('image/jpeg', 0.9);
    stopCamera();
    view.innerHTML = `<img src="${dataUrl}" alt="Captured photo">`;
    $('#cam-actions').innerHTML = `<button class="btn" id="cam-retake">${ic('refresh')}Retake</button><button class="btn primary" id="cam-use">${ic('check')}Use photo</button>`;
    $('#cam-retake').onclick = () => { closeOverlays(); openCamera(); };
    $('#cam-use').onclick = () => {
      closeOverlays();
      const name = `camera_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.jpg`;
      setScanImage(dataUrl, name, Math.round((dataUrl.length * 3) / 4));
    };
  };
}

/* ----------------------------------------------------------- processing */
const STAGES = [
  ['Detecting food items…', 'Our AI is analysing your image and identifying the food items and portion sizes.', 'Detecting food'],
  ['Calculating nutrition…', 'Matching each item to the nutrition catalog and scaling to the estimated grams.', 'Calculating nutrition'],
  ['Generating results…', 'Adding up totals and checking which items need your confirmation.', 'Generating results'],
];

async function runAnalysis() {
  const sc = S.scan; if (!sc?.dataUrl) return;
  const ctrl = new AbortController();
  let progress = 4; let stage = 0; let done = false;
  const stepsHtml = () => STAGES.map((s, i) => `<div class="step ${i < stage || (done && i === stage) ? 'done' : i === stage ? 'active' : ''}"><span class="dot">${i < stage || (done && i === stage) ? ic('check') : ''}</span>${s[2]}</div>`).join('');
  const root = $('#overlay-root');
  const C = 2 * Math.PI * 68;
  const draw = () => {
    const el = $('#proc', root);
    if (el) {
      $('#proc-arc').setAttribute('stroke-dashoffset', C * (1 - progress / 100));
      $('#proc-title').textContent = STAGES[stage][0];
      $('#proc-text').textContent = STAGES[stage][1];
      $('#proc-bar').style.width = `${progress}%`;
      $('#proc-bar').parentElement.setAttribute('aria-valuenow', Math.round(progress));
      $('#proc-steps').innerHTML = stepsHtml();
      return;
    }
    root.innerHTML = `<div class="processing" id="proc" role="dialog" aria-modal="true" aria-label="Analysing meal">
      <div class="bg" style="background-image:url('${sc.dataUrl}')"></div>
      <div class="top"><div class="brand"><span class="brand-mark">${ic('leaf')}</span>NutriScan</div><button class="btn sm" id="cancel-scan">Cancel</button></div>
      <div class="inner">
        <div class="ring"><svg class="track" viewBox="0 0 150 150"><circle cx="75" cy="75" r="68" stroke="rgba(255,255,255,.12)" stroke-width="6" fill="none"/>
          <circle id="proc-arc" cx="75" cy="75" r="68" stroke="#3FBF7F" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - progress / 100)}" style="transition:stroke-dashoffset .35s"/></svg>
          <div class="core">${ic('brain')}</div></div>
        <h2 id="proc-title">${STAGES[stage][0]}</h2><p id="proc-text">${STAGES[stage][1]}</p>
        <div class="progress" role="progressbar" aria-valuenow="${Math.round(progress)}" aria-valuemin="0" aria-valuemax="100"><span id="proc-bar" style="width:${progress}%"></span></div>
        <div class="steps" id="proc-steps">${stepsHtml()}</div>
      </div></div>`;
    $('#cancel-scan').onclick = () => { ctrl.abort(); };
  };
  draw();
  const timer = setInterval(() => {
    progress = Math.min(progress + (progress < 40 ? 3.2 : progress < 70 ? 1.6 : 0.5), 92);
    stage = progress < 40 ? 0 : progress < 70 ? 1 : 2;
    draw();
  }, 280);
  try {
    const a = await api('/api/v1/analyze', { method: 'POST', body: { image: sc.dataUrl, filename: sc.filename }, signal: ctrl.signal });
    clearInterval(timer);
    for (const s of [1, 2]) { if (stage < s) { stage = s; progress = s === 1 ? 55 : 80; draw(); await new Promise((r) => setTimeout(r, 380)); } }
    progress = 100; done = true; draw();
    await new Promise((r) => setTimeout(r, 450));
    S.analysis = a; S.results = { hot: null, showBoxes: true, saveName: '', mealType: null };
    S.scan = null;
    root.innerHTML = '';
    go(`#/results/${a.analysis_id}`);
  } catch (e) {
    clearInterval(timer);
    if (e.name === 'AbortError') { root.innerHTML = ''; toast('Scan cancelled.'); return; }
    root.innerHTML = `<div class="processing"><div class="bg" style="background-image:url('${sc.dataUrl}')"></div><div class="inner">
      <div class="ring"><div class="core" style="border-color:#F28B8B;animation:none">${ic('alert')}</div></div>
      <h2>The scan didn't finish</h2><p>${esc(e.message)}</p>
      <div style="display:flex;gap:.6rem"><button class="btn" id="err-close">Back</button><button class="btn" id="err-retry" style="background:#3FBF7F;border-color:#3FBF7F">${ic('refresh')}Retry</button></div></div></div>`;
    $('#err-close').onclick = () => { root.innerHTML = ''; };
    $('#err-retry').onclick = () => { root.innerHTML = ''; runAnalysis(); };
  }
}

/* ============================================================= results */
const confClass = (c) => (c >= 0.8 ? 'hi' : c >= 0.6 ? 'mid' : 'lo');
const ORIGIN = { model: 'AI', corrected: 'Edited', user: 'Added by you', demo: 'Sample' };

ROUTES.results = async (id) => {
  if (!id) return go('#/scan');
  if (S.analysis?.analysis_id !== id) {
    paint(shell('scan', '<div class="skeleton" style="height:60px"></div><div class="skeleton" style="height:420px"></div>'));
    try { S.analysis = await api(`/api/v1/analyses/${id}`); S.results = { hot: null, showBoxes: true, saveName: '', mealType: null }; } catch (e) {
      paint(shell('scan', `<div class="card empty-state"><div class="emoji">🔎</div><h2>Result not found</h2><p class="muted">${esc(e.message)}</p><a class="btn primary" href="#/scan">Scan a meal</a></div>`));
      return;
    }
  }
  renderResults();
};

function statusBanner(a) {
  const reasons = a.review_reasons || [];
  if (a.status === 'FAILED') {
    return `<div class="banner error">${ic('alert')}<div class="body"><b>Recognition failed</b><span>${esc(a.failure_reason)}</span>
      <div class="actions"><a class="btn sm" href="#/scan">${ic('refresh')}Try another photo</a><button class="btn sm" data-focus-add>${ic('plus')}Add foods manually</button></div></div></div>`;
  }
  if (a.status === 'SAVED') {
    return `<div class="banner success">${ic('check')}<div class="body"><b>Saved to your history</b><span class="small">This meal is locked. Delete it from history if you need to change it.</span>
      <div class="actions"><a class="btn sm primary" href="#/history">View history</a></div></div></div>`;
  }
  if (a.status === 'NEEDS_CONFIRMATION') {
    return `<div class="banner warn">${ic('alert')}<div class="body"><b>Please check these results</b><ul>${reasons.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
      ${a.items.length ? `<div class="actions"><button class="btn sm primary" id="confirm-items">${ic('check')}Everything looks right</button></div>` : ''}</div></div>`;
  }
  return `<div class="banner info">${ic('info')}<div class="body"><span>Nutrition calculated. Adjust any portion or food that looks off, then save the meal.${reasons.length ? ` ${esc(reasons.join(' '))}` : ''}</span></div></div>`;
}

function renderResults() {
  const a = S.analysis; const R = S.results;
  const locked = a.status === 'SAVED';
  const t = a.total;
  const kcalFromMacros = t.protein_g * 4 + t.carbs_g * 4 + t.fat_g * 9;
  const fiberGoal = S.user.preferences.fiber_goal_g;
  const boxes = a.items.map((it, i) => it.bbox ? `<div class="bbox ${R.hot === it.id ? 'hot' : ''}" data-hot="${it.id}" style="--c:${COLORS[i % COLORS.length]};left:${it.bbox[0] * 100}%;top:${it.bbox[1] * 100}%;width:${it.bbox[2] * 100}%;height:${it.bbox[3] * 100}%"><span class="tag">${i + 1} ${esc(it.label)}</span></div>` : '').join('');
  const hasBoxes = a.items.some((i) => i.bbox);
  const itemsHtml = a.items.length ? a.items.map((it, i) => itemRow(it, i, locked)).join('')
    : `<div class="empty-state" style="padding:1.5rem"><div class="emoji">🍽️</div><p class="muted">No items yet. Search below to add what's on your plate.</p></div>`;
  const mealType = R.mealType || guessMealType();
  const defaultName = a.items.slice(0, 3).map((i) => i.label).join(' + ');

  paint(shell('scan', `
    <div class="page-head"><div><h1>Your meal results</h1><p>Here's what we found and its nutrition value.</p></div>
      <a class="btn" href="#/scan" id="scan-another">${ic('scan')}Scan another meal</a></div>
    ${statusBanner(a)}
    <div class="results-grid">
      <div class="col">
        <section class="card" style="padding:.8rem">
          <div class="photo ${R.showBoxes ? '' : 'hide-boxes'}">${a.image_url ? `<img src="${imgSrc(a.image_url)}" alt="Your meal">` : '<div class="photo-placeholder">🍽️</div>'}${boxes}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:.6rem;padding:.7rem .3rem 0;flex-wrap:wrap">
            <span class="small muted">${a.notes ? esc(a.notes) : `${a.items.length} item${a.items.length === 1 ? '' : 's'} detected`}</span>
            ${hasBoxes ? `<label class="small" style="display:flex;gap:.4rem;align-items:center;cursor:pointer"><input type="checkbox" id="toggle-boxes" ${R.showBoxes ? 'checked' : ''}> Show detection boxes</label>` : ''}
          </div>
        </section>
        <section class="card">
          <div class="card-head"><h2>Detected items</h2>${locked ? '' : '<span class="small muted">Edit grams, swap or remove items</span>'}</div>
          <div class="items">${itemsHtml}</div>
          ${locked ? '' : `<div class="search-pop" style="margin-top:.9rem"><div class="input-wrap">${ic('plus')}<input class="input" id="add-food" data-focus="add-food" placeholder="Add a food, e.g. curd, banana, naan" autocomplete="off" aria-label="Add a food"></div></div>`}
        </section>
      </div>
      <div class="col">
        <section class="card totals-card">
          <div class="card-head"><h2>Total nutrition</h2>${t.incomplete ? `<span class="pill fair">${ic('alert', 'width="12" height="12"')} Excludes ${t.missing_items.length} unknown item${t.missing_items.length > 1 ? 's' : ''}</span>` : ''}</div>
          <div class="tiles">${Object.entries(NUT).map(([k, n]) => `<div class="tile"><span class="ico" style="background:${n.bg};color:${n.color}">${ic(n.icon)}</span><span class="v">${fmt(t[k], k === 'calories' ? 0 : 1)}${k === 'calories' ? '' : ' g'}</span><span class="l">${n.label}${k === 'calories' ? ' (kcal)' : ''}</span></div>`).join('')}</div>
          ${a.items.some((i) => i.calorie_range) ? `<p class="small muted" style="margin-top:.8rem">Some portions are uncertain, so the true total could be roughly ${fmt(sumRange(a.items, 0))}–${fmt(sumRange(a.items, 1))} kcal.</p>` : ''}
        </section>
        <section class="card">
          <div class="card-head"><h2>Nutrition breakdown</h2><span class="small muted">Share of calories</span></div>
          <div class="breakdown">
            ${[['protein_g', 'protein', 4], ['carbs_g', 'carbs', 4], ['fat_g', 'fat', 9]].map(([k, s]) => `<div class="bk-row"><div class="top"><b>${NUT[k].label}</b><span>${fmt(t[k], 1)} g (${t.energy_split[s]}%)</span></div><div class="meter"><span style="width:${kcalFromMacros ? t.energy_split[s] : 0}%;background:${NUT[k].color}"></span></div></div>`).join('')}
            <div class="bk-row"><div class="top"><b>Fiber</b><span>${fmt(t.fiber_g, 1)} g (${Math.round((t.fiber_g / fiberGoal) * 100)}% of daily goal)</span></div><div class="meter"><span style="width:${clamp((t.fiber_g / fiberGoal) * 100, 0, 100)}%;background:var(--fiber)"></span></div></div>
          </div>
        </section>
        ${locked ? '' : `<section class="card">
          <div class="card-head"><h2>Save this meal</h2></div>
          <div style="display:grid;gap:.9rem">
            <div class="field"><label for="meal-name">Meal name</label><input class="input" id="meal-name" data-focus="meal-name" placeholder="${esc(defaultName || 'My meal')}" value="${esc(R.saveName)}" maxlength="80"></div>
            <div class="field"><label>Meal type</label><div class="chips">${MEAL_TYPES.map((m) => `<button class="chip ${m === mealType ? 'on' : ''}" data-meal-type="${m}" aria-pressed="${m === mealType}">${m}</button>`).join('')}</div></div>
            <button class="btn primary block" id="save-meal" ${t.calories > 0 ? '' : 'disabled'}>${ic('check')}Save meal</button>
            ${t.calories > 0 ? '' : '<span class="small muted">Add at least one catalog food to save.</span>'}
          </div></section>`}
        <section class="card">
          <details class="assume"><summary>How this was calculated ${ic('chevron')}</summary>
            <dl class="facts">
              <dt>Recognition</dt><dd>${esc(a.model.name)} (${esc(a.model.version)})</dd>
              <dt>Nutrition data</dt><dd>${esc(a.nutrition_source.name)}, v${esc(a.nutrition_source.version)}</dd>
              <dt>Basis</dt><dd>${esc(a.nutrition_source.basis)}, scaled to each item's grams</dd>
              <dt>Portions</dt><dd>${portionSummary(a.items)}</dd>
              <dt>Photo quality</dt><dd>${a.quality ? `${a.quality.label}, ${a.quality.score}/100` : 'n/a'}</dd>
              <dt>Analysis ID</dt><dd class="small">${esc(a.analysis_id)}</dd>
            </dl>
            <p class="disclaimer">${esc(a.nutrition_source.note)} NutriScan gives estimates for general awareness and is not medical or dietary advice.</p>
          </details>
        </section>
      </div>
    </div>`));
  bindResults();
}

const sumRange = (items, idx) => items.reduce((s, i) => s + (i.nutrition ? (i.calorie_range ? i.calorie_range[idx] : i.nutrition.calories) : 0), 0);
function portionSummary(items) {
  if (!items.length) return 'No items';
  const c = { model_estimate: 0, user_confirmed: 0, default_serving: 0 };
  items.forEach((i) => { c[i.portion_method] = (c[i.portion_method] || 0) + 1; });
  return [c.model_estimate && `${c.model_estimate} estimated from the photo`, c.user_confirmed && `${c.user_confirmed} set by you`, c.default_serving && `${c.default_serving} default serving size`].filter(Boolean).join(', ');
}
function guessMealType() {
  const h = new Date().getHours();
  return h >= 5 && h < 11 ? 'breakfast' : h < 16 && h >= 11 ? 'lunch' : h >= 16 && h < 19 ? 'snack' : 'dinner';
}

function itemRow(it, i, locked) {
  const color = COLORS[i % COLORS.length];
  const n = it.nutrition;
  return `<div class="item ${it.supported ? '' : 'unsupported'} ${S.results.hot === it.id ? 'hot' : ''}" data-hot="${it.id}" style="--c:${color}">
    <div class="item-top">
      <span class="swatch">${i + 1}</span>
      <div class="item-name">${esc(it.label)}
        ${it.confidence != null && it.origin !== 'corrected' ? `<span class="conf ${confClass(it.confidence)}" title="How sure the model is about this food">${Math.round(it.confidence * 100)}% match</span>` : ''}
        <span class="origin">${ORIGIN[it.origin] || 'AI'}</span></div>
      <div class="item-kcal">${n ? `${fmt(n.calories)} <small>kcal</small>` : '<small>No data</small>'}</div>
    </div>
    ${it.supported ? `<div class="item-controls">
      ${locked ? `<span class="small"><b>${fmt(it.portion_g)} g</b></span>` : `<div class="stepper" role="group" aria-label="Portion of ${esc(it.label)}">
        <button data-step="-" data-id="${it.id}" data-focus="dec-${it.id}" aria-label="Less">${ic('minus')}</button>
        <input type="number" inputmode="numeric" min="1" max="3000" value="${it.portion_g}" data-grams="${it.id}" data-focus="grams-${it.id}" aria-label="Grams">
        <span class="unit">g</span>
        <button data-step="+" data-id="${it.id}" data-focus="inc-${it.id}" aria-label="More">${ic('plus')}</button></div>`}
      <div class="item-meta"><span>≈ ${esc(it.serving_text)}</span>${it.portion_note ? `<span>(${esc(it.portion_note)})</span>` : ''}
        ${it.calorie_range ? `<span title="Portion is uncertain">range ${it.calorie_range[0]}–${it.calorie_range[1]} kcal</span>` : ''}</div>
      ${locked ? '' : `<div class="item-actions search-pop">
        <button class="icon-btn" data-swap="${it.id}" data-focus="swap-${it.id}" title="Change food" aria-label="Change food">${ic('swap')}</button>
        <button class="icon-btn" data-remove="${it.id}" title="Remove" aria-label="Remove ${esc(it.label)}">${ic('trash')}</button></div>`}
    </div>
    ${n ? `<div class="macros"><span class="macro p">${fmt(n.protein_g, 1)} g protein</span><span class="macro c">${fmt(n.carbs_g, 1)} g carbs</span><span class="macro f">${fmt(n.fat_g, 1)} g fat</span><span class="macro" style="background:#DDF3E6;color:var(--green-strong)">${fmt(n.fiber_g, 1)} g fiber</span></div>` : ''}`
    : `<div class="item-controls"><span class="small" style="color:var(--warn)">Not in the nutrition catalog, so it isn't counted.</span>
      ${locked ? '' : `<div class="item-actions search-pop"><button class="btn sm" data-swap="${it.id}">${ic('swap')}Pick closest food</button><button class="icon-btn" data-remove="${it.id}" aria-label="Remove">${ic('trash')}</button></div>`}</div>`}
  </div>`;
}

let correcting = Promise.resolve();
function editItems(mutate) {
  correcting = correcting.then(async () => {
    const items = S.analysis.items.map((i) => ({ id: i.id, food_id: i.food_id, portion_g: i.portion_g }));
    mutate(items);
    try {
      S.analysis = await api(`/api/v1/analyses/${S.analysis.analysis_id}/corrections`, { method: 'POST', body: { items } });
    } catch (e) { toast(e.message, 'error'); }
    if (location.hash.startsWith('#/results')) renderResults();
  });
  return correcting;
}
const pendingGrams = {};
const flushGrams = debounce(() => editItems((items) => {
  Object.entries(pendingGrams).forEach(([id, g]) => { const it = items.find((x) => x.id === id); if (it) it.portion_g = g; delete pendingGrams[id]; });
}), 450);
function commitGrams(id, grams) { pendingGrams[id] = grams; flushGrams(); }

function foodSearch(anchor, onPick, placeholder) {
  $$('.search-results').forEach((x) => x.remove());
  const host = anchor.closest('.search-pop');
  let input = anchor.tagName === 'INPUT' ? anchor : null;
  const box = document.createElement('div');
  box.className = 'search-results';
  if (!input) {
    box.innerHTML = `<div style="padding:.3rem"><input class="input" placeholder="${esc(placeholder)}" aria-label="Search foods" autocomplete="off"></div><div class="res"></div>`;
    box.style.minWidth = '280px'; box.style.left = 'auto';
    input = $('input', box);
  } else box.innerHTML = '<div class="res"></div>';
  host.appendChild(box);
  if (anchor !== input) input.focus();
  let kb = -1; let results = [];
  const renderRes = () => {
    $('.res', box).innerHTML = results.length ? results.map((f, i) => `<button data-pick="${f.id}" class="${i === kb ? 'kb' : ''}"><span><span>${CAT_EMOJI[f.category] || '🍽️'}</span> <span class="sr-name">${esc(f.name)}</span></span><span class="sr-meta">${fmt((f.per_100g.calories * f.serving.grams) / 100)} kcal per ${f.serving.unit}</span></button>`).join('')
      : '<div class="empty">No matching food in the catalog. Try another name.</div>';
    $$('[data-pick]', box).forEach((b) => { b.onclick = (e) => { e.stopPropagation(); box.remove(); onPick(results.find((f) => f.id === b.dataset.pick)); }; });
  };
  const search = debounce(async () => {
    try { results = (await api(`/api/v1/foods?q=${encodeURIComponent(input.value)}&limit=8`)).foods; kb = -1; if (box.isConnected) renderRes(); } catch (e) { /* ignore */ }
  }, 150);
  input.oninput = search;
  input.onkeydown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); kb = Math.min(kb + 1, results.length - 1); renderRes(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); kb = Math.max(kb - 1, 0); renderRes(); }
    else if (e.key === 'Enter' && results.length) { e.preventDefault(); box.remove(); onPick(results[Math.max(kb, 0)]); }
    else if (e.key === 'Escape') box.remove();
  };
  search();
}

function bindResults() {
  const a = S.analysis;
  $$('[data-hot]').forEach((el) => {
    el.onmouseenter = () => { $$(`[data-hot="${el.dataset.hot}"]`).forEach((x) => x.classList.add('hot')); };
    el.onmouseleave = () => { $$(`[data-hot="${el.dataset.hot}"]`).forEach((x) => x.classList.remove('hot')); };
  });
  const tb = $('#toggle-boxes'); if (tb) tb.onchange = () => { S.results.showBoxes = tb.checked; $('.photo').classList.toggle('hide-boxes', !tb.checked); };
  $$('[data-step]').forEach((b) => {
    b.onclick = () => {
      const input = $(`[data-grams="${b.dataset.id}"]`);
      const cur = Number(input.value) || 0;
      const step = cur >= 200 ? 25 : 10;
      input.value = clamp(b.dataset.step === '+' ? cur + step : cur - step, 1, 3000);
      commitGrams(b.dataset.id, Number(input.value));
    };
  });
  $$('[data-grams]').forEach((inp) => {
    inp.onchange = () => { const v = clamp(Math.round(Number(inp.value) || 1), 1, 3000); inp.value = v; commitGrams(inp.dataset.grams, v); };
    inp.onkeydown = (e) => { if (e.key === 'Enter') inp.blur(); };
  });
  $$('[data-remove]').forEach((b) => { b.onclick = () => editItems((items) => items.splice(items.findIndex((x) => x.id === b.dataset.remove), 1)).then(() => toast('Item removed.')); });
  $$('[data-swap]').forEach((b) => {
    b.onclick = (e) => {
      e.stopPropagation();
      foodSearch(b, (food) => editItems((items) => { const it = items.find((x) => x.id === b.dataset.swap); it.food_id = food.id; it.portion_g = food.serving.grams; }).then(() => toast(`Changed to ${food.name}.`)), 'Search the catalog');
    };
  });
  const add = $('#add-food');
  if (add) {
    add.onfocus = add.onclick = () => $('.search-results', add.closest('.search-pop')) || foodSearch(add, (food) => { add.value = ''; editItems((items) => items.push({ food_id: food.id, portion_g: food.serving.grams })).then(() => toast(`${food.name} added.`)); });
  }
  $$('[data-focus-add]').forEach((b) => { b.onclick = () => $('#add-food')?.focus(); });
  const confirmBtn = $('#confirm-items'); if (confirmBtn) confirmBtn.onclick = () => editItems(() => {}).then(() => toast('Items confirmed.'));
  const nameInput = $('#meal-name'); if (nameInput) nameInput.oninput = () => { S.results.saveName = nameInput.value; };
  $$('[data-meal-type]').forEach((b) => { b.onclick = () => { S.results.mealType = b.dataset.mealType; renderResults(); }; });
  const save = $('#save-meal');
  if (save) {
    save.onclick = async () => {
      save.disabled = true; save.innerHTML = '<span class="spinner"></span>';
      await correcting;
      try {
        await api('/api/v1/meals', { method: 'POST', body: { analysis_id: a.analysis_id, name: S.results.saveName, meal_type: S.results.mealType || guessMealType(), tz: TZ } });
        S.analysis = await api(`/api/v1/analyses/${a.analysis_id}`);
        toast('Meal saved to history.');
        renderResults();
      } catch (e) { toast(e.message, 'error'); save.disabled = false; save.innerHTML = `${ic('check')}Save meal`; }
    };
  }
}

/* ======================================================= nutrition plan */
ROUTES.plan = async () => {
  const P_ = S.plan;
  paint(shell('plan', `<div class="page-head"><div><h1>Nutrition plan</h1><p>Your intake over time and the targets you're aiming for.</p></div>
    <div class="seg" role="tablist">${[['summary', 'Summary'], ['goals', 'Goals and targets']].map(([k, l]) => `<button role="tab" aria-selected="${P_.tab === k}" class="${P_.tab === k ? 'on' : ''}" data-tab="${k}">${l}</button>`).join('')}</div></div>
    <div id="plan-body"><div class="skeleton" style="height:380px"></div></div>`));
  $$('[data-tab]').forEach((b) => { b.onclick = () => { S.plan.tab = b.dataset.tab; ROUTES.plan(); }; });
  try {
    const sum = await api(`/api/v1/summary?days=${P_.days}&tz=${TZ}`);
    if (P_.tab === 'summary') renderSummary(sum); else renderGoals(sum);
  } catch (e) { toast(e.message, 'error'); }
};

function ringSvg(pct, color, label) {
  const r = 36; const c = 2 * Math.PI * r; const p = clamp(pct, 0, 1);
  return `<svg viewBox="0 0 86 86"><circle cx="43" cy="43" r="${r}" stroke="#EDF2EE" stroke-width="8" fill="none"/>
    <circle cx="43" cy="43" r="${r}" stroke="${color}" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p)}" transform="rotate(-90 43 43)"/>
    <text x="43" y="48" text-anchor="middle" font-size="15" font-weight="800" fill="var(--ink)">${label}</text></svg>`;
}

function barChart(series, goal) {
  const W = 560; const H = 230; const pad = { l: 40, r: 10, t: 14, b: 30 };
  const max = Math.max(goal * 1.15, ...series.map((d) => d.calories), 500);
  const step = (W - pad.l - pad.r) / series.length; const bw = Math.min(34, step * 0.62);
  const y = (v) => pad.t + (H - pad.t - pad.b) * (1 - v / max);
  const ticks = [0, max / 3, (2 * max) / 3, max].map((v) => Math.round(v / 100) * 100);
  const showEvery = series.length > 14 ? Math.ceil(series.length / 10) : 1;
  return `<div class="bar-chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Daily calories chart">
    ${ticks.map((t) => `<line x1="${pad.l}" x2="${W - pad.r}" y1="${y(t)}" y2="${y(t)}" stroke="#EDF2EE"/><text x="${pad.l - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="var(--muted)">${t}</text>`).join('')}
    ${series.map((d, i) => { const x = pad.l + i * step + (step - bw) / 2; const over = d.calories > goal * 1.1; const dt = new Date(`${d.date}T12:00:00`);
    return `<rect class="bar" data-i="${i}" x="${x}" y="${y(d.calories)}" width="${bw}" height="${Math.max(0, H - pad.b - y(d.calories))}" rx="5" fill="${over ? 'var(--kcal)' : d.meals ? 'var(--green)' : '#E3ECE6'}"/>
      ${i % showEvery === 0 ? `<text x="${x + bw / 2}" y="${H - 10}" text-anchor="middle" font-size="11" fill="var(--muted)">${series.length > 7 ? dt.getDate() : dt.toLocaleDateString(undefined, { weekday: 'short' })}</text>` : ''}`; }).join('')}
    <line x1="${pad.l}" x2="${W - pad.r}" y1="${y(goal)}" y2="${y(goal)}" stroke="var(--forest)" stroke-dasharray="5 5" stroke-width="1.5"/>
    <text x="${W - pad.r}" y="${y(goal) - 6}" text-anchor="end" font-size="11" font-weight="700" fill="var(--forest)">Goal ${fmt(goal)}</text>
  </svg></div>`;
}

function donut(split, center) {
  const segs = [['carbs', 'var(--carbs)'], ['protein', 'var(--protein)'], ['fat', 'var(--fat)']];
  const r = 70; const c = 2 * Math.PI * r; let off = 0;
  const total = segs.reduce((s, [k]) => s + split[k], 0) || 1;
  return `<svg viewBox="0 0 180 180" width="190" height="190" role="img" aria-label="Macronutrient distribution">
    <circle cx="90" cy="90" r="${r}" stroke="#EDF2EE" stroke-width="22" fill="none"/>
    ${segs.map(([k, col]) => { const len = (split[k] / total) * c; const s = `<circle cx="90" cy="90" r="${r}" stroke="${col}" stroke-width="22" fill="none" stroke-dasharray="${len} ${c - len}" stroke-dashoffset="${-off}" transform="rotate(-90 90 90)"/>`; off += len; return s; }).join('')}
    <text x="90" y="88" text-anchor="middle" font-size="26" font-weight="800" fill="var(--ink)">${center}</text>
    <text x="90" y="108" text-anchor="middle" font-size="12" fill="var(--muted)">kcal / day</text></svg>`;
}

function suggestions(sum) {
  const g = sum.goals; const t = sum.today; const hour = new Date().getHours(); const tips = [];
  if (!sum.total_meals) return [['sparkles', 'Scan your meals for a few days to get personalised suggestions here.']];
  const left = g.calorie_goal - t.calories;
  if (t.meals === 0) tips.push(['scan', 'Nothing logged today yet. Scan your next meal to keep your streak going.']);
  else if (left > 0) tips.push(['flame', `You have about ${fmt(left)} kcal left for today.`]);
  else tips.push(['flame', `You're ${fmt(-left)} kcal over today's goal. A lighter dinner such as soup, salad or grilled protein would balance it.`]);
  if (t.protein_g < g.protein_goal_g * (hour >= 17 ? 0.7 : 0.4)) tips.push(['dumbbell', `Protein is at ${fmt(t.protein_g)} g of ${g.protein_goal_g} g. Paneer, dal, eggs, curd or grilled chicken help close the gap.`]);
  if (sum.average.fiber_g && sum.average.fiber_g < g.fiber_goal_g * 0.7) tips.push(['sprout', `Your average fiber is ${fmt(sum.average.fiber_g)} g a day. Add sprouts, rajma, chole, fruit or a side salad.`]);
  if (sum.energy_split.fat > 35) tips.push(['drop', `${sum.energy_split.fat}% of your calories come from fat. Watch fried snacks and extra ghee or butter.`]);
  if (sum.energy_split.carbs > 62) tips.push(['wheat', `Carbs make up ${sum.energy_split.carbs}% of your calories. Try swapping part of the rice or roti for vegetables or protein.`]);
  if (tips.length < 3) tips.push(['heart', `You've logged ${sum.days_logged} of the last ${sum.days} days. Consistent logging makes these trends more accurate.`]);
  return tips.slice(0, 4);
}

function renderSummary(sum) {
  const g = sum.goals;
  if (!sum.total_meals) {
    $('#plan-body').innerHTML = `<div class="card empty-state"><div class="emoji">📊</div><h2>No meals in the last ${sum.days} days</h2>
      <p class="muted">Scan a meal to see your calorie trend and macro balance here, or load a sample week to explore.</p>
      <div class="actions"><a class="btn primary" href="#/scan">${ic('scan')}Scan a meal</a><button class="btn" data-seed>Load a sample week</button></div></div>`;
    return bindSeed();
  }
  $('#plan-body').innerHTML = `<div style="display:grid;gap:1.2rem">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap">
      <h2>Nutrition summary</h2>
      <select class="input" id="range" style="width:auto;min-height:38px" aria-label="Date range">${[7, 14, 30].map((d) => `<option value="${d}" ${d === sum.days ? 'selected' : ''}>Last ${d} days</option>`).join('')}</select>
    </div>
    <section class="card"><div class="stat-row">${Object.entries(NUT).map(([k, n]) => `<div class="stat"><span class="ico" style="background:${n.bg};color:${n.color}">${ic(n.icon)}</span>
      <span class="l">Avg ${n.label.toLowerCase()}</span><span class="v">${fmt(sum.average[k])} ${n.unit}</span><span class="g">Goal ${fmt(g[n.goal])} ${n.unit}</span></div>`).join('')}</div>
      <p class="small muted" style="margin-top:.8rem">Averages cover the ${sum.days_logged} day${sum.days_logged === 1 ? '' : 's'} you logged meals.</p></section>
    <div class="chart-grid">
      <section class="card"><div class="card-head"><h2>Calorie intake</h2><span class="small muted">Orange bars are more than 10% over goal</span></div>${barChart(sum.series, g.calorie_goal)}</section>
      <section class="card"><div class="card-head"><h2>Macronutrient distribution</h2></div><div class="donut-wrap">${donut(sum.energy_split, fmt(sum.average.calories))}
        <div class="legend">${[['carbs', 'Carbs', 'var(--carbs)'], ['protein', 'Protein', 'var(--protein)'], ['fat', 'Fat', 'var(--fat)']].map(([k, l, c]) => `<div><i style="background:${c}"></i>${l}<b>${sum.energy_split[k]}%</b></div>`).join('')}</div></div></section>
    </div>
    <section class="card"><div class="card-head"><h2>Today's progress</h2><span class="small muted">${sum.today.meals} meal${sum.today.meals === 1 ? '' : 's'} logged today</span></div>
      <div class="rings">${Object.entries(NUT).map(([k, n]) => `<div class="ring-stat">${ringSvg(sum.today[k] / g[n.goal], n.color, `${Math.round((sum.today[k] / g[n.goal]) * 100)}%`)}<span class="v">${fmt(sum.today[k])} / ${fmt(g[n.goal])} ${n.unit}</span><span class="l">${n.label}</span></div>`).join('')}</div></section>
    <div class="grid-2">
      <section class="card"><div class="card-head"><h2>Suggestions</h2></div><div class="tips">${suggestions(sum).map(([i, t]) => `<div class="tip"><span class="ico">${ic(i)}</span><span>${esc(t)}</span></div>`).join('')}</div></section>
      <section class="card"><div class="card-head"><h2>Most eaten</h2></div><div class="list-rows">${sum.top_foods.map((f) => `<div class="r"><span>${CAT_EMOJI[f.category] || '🍽️'} ${esc(f.label)}</span><span class="muted">${f.count}× (${fmt(f.calories)} kcal)</span></div>`).join('')}</div>
        <div class="list-rows" style="margin-top:1rem">${MEAL_TYPES.map((m) => `<div class="r"><span style="text-transform:capitalize">${m}</span><span class="muted">${sum.meal_types[m] || 0} meals</span></div>`).join('')}</div></section>
    </div></div>`;
  $('#range').onchange = (e) => { S.plan.days = Number(e.target.value); ROUTES.plan(); };
  const chart = $('.bar-chart');
  $$('.bar', chart).forEach((b) => {
    b.onmouseenter = () => {
      const d = sum.series[b.dataset.i]; const box = chart.getBoundingClientRect(); const r = b.getBoundingClientRect();
      chart.insertAdjacentHTML('beforeend', `<div class="chart-tip" style="left:${r.left - box.left + r.width / 2}px;top:${r.top - box.top}px"><b>${new Date(`${d.date}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</b><br>${fmt(d.calories)} kcal, ${d.meals} meal${d.meals === 1 ? '' : 's'}<br>P ${fmt(d.protein_g)} g, C ${fmt(d.carbs_g)} g, F ${fmt(d.fat_g)} g</div>`);
    };
    b.onmouseleave = () => $$('.chart-tip', chart).forEach((x) => x.remove());
  });
}

const ACTIVITY = [['1.2', 'Mostly sitting'], ['1.375', 'Light exercise 1–3 days a week'], ['1.55', 'Moderate exercise 3–5 days'], ['1.725', 'Hard exercise 6–7 days']];
function calcTargets(p) {
  const w = Number(p.weight); const h = Number(p.height); const age = Number(p.age);
  if (!(w > 25 && h > 100 && age >= 14)) return null;
  const bmr = 10 * w + 6.25 * h - 5 * age + (p.sex === 'female' ? -161 : 5);
  const tdee = bmr * Number(p.activity);
  const kcal = Math.round((tdee + (p.goal === 'lose' ? -400 : p.goal === 'gain' ? 300 : 0)) / 10) * 10;
  const protein = Math.round(w * (p.goal === 'maintain' ? 1.2 : 1.6));
  const fat = Math.round((kcal * 0.28) / 9);
  const carbs = Math.max(50, Math.round((kcal - protein * 4 - fat * 9) / 4));
  return { bmr: Math.round(bmr), tdee: Math.round(tdee), calorie_goal: Math.max(1000, kcal), protein_goal_g: protein, fat_goal_g: fat, carbs_goal_g: carbs, fiber_goal_g: Math.round((kcal / 1000) * 14) };
}

function renderGoals() {
  const g = S.user.preferences;
  const p = { sex: 'male', age: 28, height: 170, weight: 68, activity: '1.375', goal: 'maintain', ...(g.profile || {}) };
  $('#plan-body').innerHTML = `<div class="grid-2" style="align-items:start">
    <section class="card"><div class="card-head"><h2>Daily targets</h2></div>
      <form id="goals-form" style="display:grid;gap:1rem">
        <div class="form-grid" style="grid-template-columns:1fr 1fr">${Object.entries(NUT).map(([k, n]) => `<div class="field"><label for="g-${k}">${n.label} (${n.unit})</label><input class="input" type="number" id="g-${k}" name="${n.goal}" value="${g[n.goal]}"></div>`).join('')}</div>
        <div id="goals-error"></div>
        <button class="btn primary" type="submit">${ic('check')}Save targets</button>
      </form></section>
    <section class="card"><div class="card-head"><h2>Work out my targets</h2></div>
      <p class="small muted" style="margin-bottom:1rem">Uses the Mifflin-St Jeor equation. It's a starting point; a dietitian can tailor it for health conditions.</p>
      <div class="form-grid" id="calc">
        <div class="field"><label for="c-sex">Sex</label><select class="input" id="c-sex" name="sex"><option value="male">Male</option><option value="female">Female</option></select></div>
        <div class="field"><label for="c-age">Age</label><input class="input" type="number" id="c-age" name="age" value="${p.age}"></div>
        <div class="field"><label for="c-height">Height (cm)</label><input class="input" type="number" id="c-height" name="height" value="${p.height}"></div>
        <div class="field"><label for="c-weight">Weight (kg)</label><input class="input" type="number" id="c-weight" name="weight" value="${p.weight}"></div>
        <div class="field" style="grid-column:span 2"><label for="c-activity">Activity</label><select class="input" id="c-activity" name="activity">${ACTIVITY.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select></div>
        <div class="field" style="grid-column:1/-1"><label>Goal</label><div class="chips" id="c-goal">${[['lose', 'Lose weight'], ['maintain', 'Maintain'], ['gain', 'Gain muscle']].map(([v, l]) => `<button type="button" class="chip ${p.goal === v ? 'on' : ''}" data-goal="${v}">${l}</button>`).join('')}</div></div>
      </div>
      <div id="calc-out"></div>
    </section></div>`;
  $('#c-sex').value = p.sex; $('#c-activity').value = p.activity;
  const read = () => ({ sex: $('#c-sex').value, age: $('#c-age').value, height: $('#c-height').value, weight: $('#c-weight').value, activity: $('#c-activity').value, goal: $('.chip.on', $('#c-goal'))?.dataset.goal || 'maintain' });
  const update = () => {
    const r = calcTargets(read());
    $('#calc-out').innerHTML = r ? `<div class="calc-out"><div><b>${fmt(r.bmr)}</b><span>kcal at rest (BMR)</span></div><div><b>${fmt(r.tdee)}</b><span>kcal to maintain</span></div><div><b>${fmt(r.calorie_goal)}</b><span>kcal daily target</span></div>
      <div><b>${r.protein_goal_g} g</b><span>protein</span></div><div><b>${r.carbs_goal_g} g</b><span>carbs</span></div><div><b>${r.fat_goal_g} g</b><span>fat</span></div></div>
      <button class="btn primary block" id="use-calc" style="margin-top:1rem">${ic('target')}Use these targets</button>` : '<p class="small muted" style="margin-top:1rem">Enter your age, height and weight to see suggested targets.</p>';
    const use = $('#use-calc');
    if (use) use.onclick = () => saveGoals({ calorie_goal: r.calorie_goal, protein_goal_g: r.protein_goal_g, carbs_goal_g: r.carbs_goal_g, fat_goal_g: r.fat_goal_g, fiber_goal_g: r.fiber_goal_g, profile: read() });
  };
  $$('#calc input, #calc select').forEach((el) => { el.oninput = update; });
  $$('[data-goal]').forEach((b) => { b.onclick = () => { $$('[data-goal]').forEach((x) => x.classList.toggle('on', x === b)); update(); }; });
  update();
  $('#goals-form').onsubmit = (e) => {
    e.preventDefault();
    const prefs = {}; new FormData(e.target).forEach((v, k) => { prefs[k] = v; });
    saveGoals(prefs);
  };
}

async function saveGoals(prefs) {
  try {
    const r = await api('/api/v1/me', { method: 'PUT', body: { preferences: prefs } });
    S.user = r.user; toast('Targets saved.'); renderGoals();
  } catch (e) { const el = $('#goals-error'); if (el) el.innerHTML = `<div class="form-error">${esc(e.message)}</div>`; toast(e.message, 'error'); }
}

/* ============================================================= history */
function mealRow(m) {
  return `<div class="meal-row" data-meal="${m.id}" tabindex="0" role="button" aria-label="Open ${esc(m.name)}">
    ${m.image_url ? `<img class="thumb" src="${imgSrc(m.image_url)}" alt="" loading="lazy">` : `<span class="thumb">${CAT_EMOJI[m.items[0]?.category] || '🍽️'}</span>`}
    <div class="info"><span class="name">${esc(m.name)}</span>${macroChips(m.totals)}
      <span class="when"><span style="text-transform:capitalize">${m.meal_type}</span><span>${dayLabel(m.captured_at)}, ${timeLabel(m.captured_at)}</span></span></div>
    <div class="search-pop"><button class="icon-btn" data-meal-menu="${m.id}" aria-label="Meal actions">${ic('more')}</button></div>
  </div>`;
}

function bindMealRows(meals) {
  $$('[data-meal]').forEach((row) => {
    const m = meals.find((x) => x.id === row.dataset.meal);
    row.onclick = (e) => { if (!e.target.closest('[data-meal-menu]') && !e.target.closest('.menu')) openMeal(m); };
    row.onkeydown = (e) => { if (e.key === 'Enter') openMeal(m); };
  });
  $$('[data-meal-menu]').forEach((b) => {
    b.onclick = (e) => {
      e.stopPropagation();
      $$('.menu.row-menu').forEach((x) => x.remove());
      const m = meals.find((x) => x.id === b.dataset.mealMenu);
      b.parentElement.insertAdjacentHTML('beforeend', `<div class="menu row-menu" role="menu"><button data-open>${ic('eye')}View details</button><button class="danger-item" data-del>${ic('trash')}Delete meal</button></div>`);
      const menu = $('.menu.row-menu', b.parentElement);
      $('[data-open]', menu).onclick = (ev) => { ev.stopPropagation(); menu.remove(); openMeal(m); };
      $('[data-del]', menu).onclick = (ev) => { ev.stopPropagation(); menu.remove(); deleteMeal(m); };
      setTimeout(() => document.addEventListener('click', () => menu.remove(), { once: true }));
    };
  });
}

ROUTES.history = async () => {
  const H = S.history;
  paint(shell('history', `<div class="page-head"><div><h1>Meal history</h1><p>Every meal you've saved, newest first.</p></div><a class="btn primary" href="#/scan">${ic('scan')}Scan a meal</a></div>
    <div class="toolbar"><div class="input-wrap">${ic('search')}<input class="input" id="h-search" data-focus="h-search" placeholder="Search meals or foods" value="${esc(H.q)}" aria-label="Search meals"></div>
      <div class="chips">${[['', 'All'], ...MEAL_TYPES.map((m) => [m, m])].map(([v, l]) => `<button class="chip ${H.type === v ? 'on' : ''}" data-type="${v}">${l}</button>`).join('')}</div></div>
    <div id="h-list"><div class="skeleton" style="height:300px"></div></div>`));
  $('#h-search').oninput = debounce((e) => { S.history.q = e.target.value; loadHistory(); }, 250);
  $$('[data-type]').forEach((b) => { b.onclick = () => { S.history.type = b.dataset.type; $$('[data-type]').forEach((x) => x.classList.toggle('on', x === b)); loadHistory(); }; });
  loadHistory();
};

async function loadHistory() {
  const H = S.history;
  try {
    const { meals } = await api(`/api/v1/meals?q=${encodeURIComponent(H.q)}&meal_type=${H.type}`);
    const list = $('#h-list'); if (!list) return;
    if (!meals.length) {
      list.innerHTML = H.q || H.type ? `<div class="card empty-state"><div class="emoji">🔍</div><p class="muted">No meals match your search. Try another food name or clear the filter.</p></div>`
        : `<div class="card empty-state"><div class="emoji">🍽️</div><h2>No meals saved yet</h2><p class="muted">Scan a meal and save it to build your history.</p><div class="actions"><a class="btn primary" href="#/scan">${ic('scan')}Scan a meal</a><button class="btn" data-seed>Load a sample week</button></div></div>`;
      return bindSeed();
    }
    const groups = {};
    meals.forEach((m) => { const k = new Date(m.captured_at).toDateString(); (groups[k] = groups[k] || []).push(m); });
    list.innerHTML = `<div style="display:grid;gap:1.4rem">${Object.values(groups).map((ms) => `<section class="day-group"><div class="day-head"><h3>${dayLabel(ms[0].captured_at)}</h3><span>${fmt(ms.reduce((s, m) => s + m.totals.calories, 0))} kcal</span></div>${ms.map(mealRow).join('')}</section>`).join('')}</div>`;
    bindMealRows(meals);
  } catch (e) { toast(e.message, 'error'); }
}

function modal(html, cls = '') {
  $('#overlay-root').innerHTML = `<div class="modal-back" id="modal-back"><div class="modal ${cls}" role="dialog" aria-modal="true">${html}</div></div>`;
  const back = $('#modal-back');
  back.onclick = (e) => { if (e.target === back || e.target.closest('[data-close]')) closeOverlays(); };
  const onKey = (e) => { if (e.key === 'Escape') { closeOverlays(); document.removeEventListener('keydown', onKey); } };
  document.addEventListener('keydown', onKey);
  $('.modal button, .modal a', back)?.focus();
}

function confirmDialog({ title, body, confirm, danger }) {
  return new Promise((resolve) => {
    modal(`<div class="modal-head"><h2>${esc(title)}</h2><button class="icon-btn" data-close aria-label="Close">${ic('x')}</button></div>
      <div class="modal-body"><p>${esc(body)}</p></div>
      <div class="modal-foot"><button class="btn" data-close>Keep it</button><button class="btn ${danger ? 'danger solid' : 'primary'}" id="dlg-ok">${esc(confirm)}</button></div>`, 'sm');
    $('#dlg-ok').onclick = () => { closeOverlays(); resolve(true); };
    $$('[data-close]').forEach((b) => b.addEventListener('click', () => resolve(false)));
  });
}

function openMeal(m) {
  const t = m.totals;
  modal(`<div class="modal-head"><div><h2>${esc(m.name)}</h2><p class="small muted" style="text-transform:capitalize">${m.meal_type}, ${dayLabel(m.captured_at)} at ${timeLabel(m.captured_at)}</p></div><button class="icon-btn" data-close aria-label="Close">${ic('x')}</button></div>
    <div class="modal-body">
      ${m.image_url ? `<div class="photo"><img src="${imgSrc(m.image_url)}" alt="${esc(m.name)}"></div>` : ''}
      <div class="tiles">${Object.entries(NUT).map(([k, n]) => `<div class="tile"><span class="ico" style="background:${n.bg};color:${n.color}">${ic(n.icon)}</span><span class="v">${fmt(t[k], k === 'calories' ? 0 : 1)}${k === 'calories' ? '' : ' g'}</span><span class="l">${n.label}</span></div>`).join('')}</div>
      <div class="table-scroll"><table class="items-table"><thead><tr><th>Food</th><th class="n">Portion</th><th class="n">kcal</th><th class="n">Protein</th><th class="n">Carbs</th><th class="n">Fat</th></tr></thead>
        <tbody>${m.items.map((i) => `<tr><td>${CAT_EMOJI[i.category] || '🍽️'} ${esc(i.label)}</td><td class="n">${i.portion_g ? `${fmt(i.portion_g)} g` : '–'}</td>${i.nutrition ? `<td class="n">${fmt(i.nutrition.calories)}</td><td class="n">${fmt(i.nutrition.protein_g, 1)} g</td><td class="n">${fmt(i.nutrition.carbs_g, 1)} g</td><td class="n">${fmt(i.nutrition.fat_g, 1)} g</td>` : '<td class="n" colspan="4">Not in catalog</td>'}</tr>`).join('')}</tbody></table></div>
      <dl class="facts small"><dt>Recognition</dt><dd>${esc(m.model_version)}</dd><dt>Nutrition data</dt><dd>${esc(m.nutrition_source?.name)} v${esc(m.nutrition_source?.version)}</dd></dl>
    </div>
    <div class="modal-foot"><button class="btn danger" id="m-del">${ic('trash')}Delete meal</button><button class="btn primary" data-close>Done</button></div>`);
  $('#m-del').onclick = () => deleteMeal(m);
}

async function deleteMeal(m) {
  const ok = await confirmDialog({ title: 'Delete this meal?', body: `“${m.name}” and its photo will be permanently removed from your history.`, confirm: 'Delete meal', danger: true });
  if (!ok) return;
  try { await api(`/api/v1/meals/${m.id}`, { method: 'DELETE' }); toast('Meal deleted.'); router(); } catch (e) { toast(e.message, 'error'); }
}

/* ============================================================= profile */
ROUTES.profile = async () => {
  const u = S.user;
  paint(shell('profile', `<div class="page-head"><div><h1>Profile</h1><p>Your account, AI engine and data.</p></div></div>
    <div class="grid-2" style="align-items:start">
      <div class="col">
        <section class="card"><div class="card-head"><h2>Account</h2></div>
          <form id="acct" style="display:grid;gap:1rem">
            <div style="display:flex;gap:1rem;align-items:center"><span class="avatar" style="width:56px;height:56px;font-size:1.2rem">${esc(initials())}</span>
              <div><b>${esc(u.name)}</b><p class="small muted">${esc(u.email)}</p><p class="small muted">Member since ${new Date(u.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p></div></div>
            <div class="field"><label for="p-name">Name</label><input class="input" id="p-name" value="${esc(u.name)}"></div>
            <button class="btn" type="submit">Save name</button>
          </form></section>
        <section class="card"><div class="card-head"><h2>Your data</h2></div>
          <div style="display:grid;gap:.8rem">
            <p class="small muted">Photos and meals are stored only on this computer, in the <code>data</code> folder next to the app.</p>
            <button class="btn" data-seed>${ic('sparkles')}Load a sample week of meals</button>
            <button class="btn danger" id="wipe">${ic('trash')}Delete all my meals and photos</button>
            <button class="btn ghost" data-action="logout">${ic('logout')}Log out</button>
          </div></section>
      </div>
      <section class="card" id="engine-card"><div class="skeleton" style="height:260px"></div></section>
    </div>`));
  $('#acct').onsubmit = async (e) => {
    e.preventDefault();
    try { const r = await api('/api/v1/me', { method: 'PUT', body: { name: $('#p-name').value } }); S.user = r.user; toast('Name updated.'); ROUTES.profile(); } catch (err) { toast(err.message, 'error'); }
  };
  $('#wipe').onclick = async () => {
    const ok = await confirmDialog({ title: 'Delete all meal data?', body: 'Every saved meal, analysis and photo in your account will be permanently deleted. Your login stays.', confirm: 'Delete everything', danger: true });
    if (!ok) return;
    try { const r = await api('/api/v1/me/data', { method: 'DELETE' }); toast(`Deleted ${r.deleted_meals} meals.`); } catch (e) { toast(e.message, 'error'); }
  };
  bindSeed();
  renderEngine();
};

async function renderEngine() {
  const card = $('#engine-card');
  try {
    const e = await api('/api/v1/settings/engine');
    S.engine = e.engine;
    const on = e.engine.mode === 'vision';
    card.innerHTML = `<div class="card-head"><h2>AI recognition engine</h2><span class="pill ${on ? 'good' : 'fair'}">${on ? 'Vision recognition on' : 'Demo mode'}</span></div>
      <div style="display:grid;gap:1rem">
        <p class="small muted">${on ? `Photos are analysed by <b>${esc(e.model)}</b>. It identifies foods, draws boxes around them and estimates grams. Nutrition is then calculated locally from the catalog.`
    : 'Add an Anthropic API key to recognise foods from the photo. Without one, NutriScan runs in demo mode and reads food names from the file name.'}</p>
        <div class="field"><label for="k-key">Anthropic API key</label><div class="input-wrap">${ic('key')}<input class="input" id="k-key" type="password" placeholder="${on ? esc(e.api_key_masked) : 'sk-ant-...'}" autocomplete="off"></div>
          <span class="small muted">${e.engine.key_source === 'environment' ? 'Currently loaded from the ANTHROPIC_API_KEY environment variable.' : 'Stored in data/settings.json on this computer.'} Get a key at console.anthropic.com.</span></div>
        <div class="field"><label for="k-model">Model</label><input class="input" id="k-model" value="${esc(e.model)}"></div>
        <div style="display:flex;gap:.6rem;flex-wrap:wrap"><button class="btn primary" id="k-save">${ic('check')}Save engine settings</button>${e.engine.key_source === 'profile' ? '<button class="btn danger" id="k-remove">Remove key</button>' : ''}</div>
        <div id="k-error"></div>
      </div>`;
    $('#k-save').onclick = async () => {
      const body = { model: $('#k-model').value }; const key = $('#k-key').value.trim();
      if (key) body.api_key = key;
      try { const r = await api('/api/v1/settings/engine', { method: 'PUT', body }); S.engine = r.engine; toast('Engine settings saved.'); ROUTES.profile(); } catch (err) { $('#k-error').innerHTML = `<div class="form-error">${esc(err.message)}</div>`; }
    };
    const rm = $('#k-remove');
    if (rm) rm.onclick = async () => { const r = await api('/api/v1/settings/engine', { method: 'PUT', body: { api_key: '' } }); S.engine = r.engine; toast('Key removed. Demo mode is on.'); ROUTES.profile(); };
  } catch (err) { card.innerHTML = `<div class="form-error">${esc(err.message)}</div>`; }
}

/* ================================================================ boot */
router();
