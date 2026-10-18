/* Core: state, storage, formatting and shared helpers */
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 10);
const num = v => { if (v === '' || v == null) return NaN; const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/[^\d.\-]/g, '')); return isFinite(n) ? n : NaN; };
const has = v => !(v === '' || v == null || (typeof v === 'number' && isNaN(v)) || (Array.isArray(v) && !v.length));
const fmtN = (n, d = 0) => (n == null || isNaN(n)) ? '—' : Number(n).toLocaleString('he-IL', { maximumFractionDigits: d, minimumFractionDigits: d });
const fmtILS = n => (n == null || isNaN(n)) ? '—' : `${fmtN(n)} ₪`;
const fmtPct = (n, d = 1) => (n == null || isNaN(n)) ? '—' : `${n > 0 ? '+' : ''}${fmtN(n * 100, d)}%`;
const fmtShort = n => {
  if (n == null || isNaN(n)) return '—';
  if (Math.abs(n) >= 1e6) return `${fmtN(n / 1e6, 2)} מ׳ ₪`;
  if (Math.abs(n) >= 1e4) return `${fmtN(n / 1e3, 0)} א׳ ₪`;
  return fmtILS(n);
};
const roundTo = (n, step) => Math.round(n / step) * step;
const priceStep = n => n > 3e6 ? 10000 : n > 5e5 ? 5000 : n > 2e4 ? 500 : 50;
const median = a => { const s = a.filter(x => !isNaN(x)).sort((x, y) => x - y); if (!s.length) return NaN; const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const mean = a => { const s = a.filter(x => !isNaN(x)); return s.length ? s.reduce((x, y) => x + y, 0) / s.length : NaN; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const debounce = (fn, ms = 400) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
const todayISO = () => new Date().toISOString().slice(0, 10);
const addDays = (iso, d) => { const t = new Date(iso + 'T12:00:00'); t.setDate(t.getDate() + d); return t.toISOString().slice(0, 10); };
const fmtDate = iso => { if (!iso) return '—'; const d = new Date(iso.length <= 10 ? iso + 'T12:00:00' : iso); return isNaN(d) ? iso : d.toLocaleDateString('he-IL'); };
const HEB_MONTHS = ['ינו׳', 'פבר׳', 'מרץ', 'אפר׳', 'מאי', 'יוני', 'יולי', 'אוג׳', 'ספט׳', 'אוק׳', 'נוב׳', 'דצמ׳'];

function toast(msg, kind = '') {
  const el = document.createElement('div');
  el.className = 'toast ' + kind; el.textContent = msg;
  $('#toasts').appendChild(el);
  setTimeout(() => el.remove(), kind === 'err' ? 6000 : 3200);
}

async function copyText(t) {
  try { await navigator.clipboard.writeText(t); toast('הועתק ללוח ✓', 'ok'); }
  catch { const ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); toast('הועתק ללוח ✓', 'ok'); }
}

function download(name, data, type = 'application/octet-stream') {
  const blob = data instanceof Blob ? data : new Blob([data], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

/* ── state ───────────────────────────── */
const STORE_KEY = 'nadlan-marketing-studio-v1';
const DEFAULT_SETTINGS = {
  agentName: '', agentTitle: 'יועץ/ת נדל״ן', agency: '', phone: '', email: '', website: '', license: '',
  bio: '', years: '', deals: '', fee: '2% + מע״מ', logo: '',
  primary: '#0d21a1', accent: '#FF9D00',
  cbsSaleCode: '40010', cbsRentCode: '', proxyUrl: '', theme: 'auto'
};
let S = { settings: { ...DEFAULT_SETTINGS }, projects: [], currentId: null };

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) { const d = JSON.parse(raw); S = { ...S, ...d, settings: { ...DEFAULT_SETTINGS, ...(d.settings || {}) } }; }
  } catch (e) { console.warn('load failed', e); }
}
let saveWarned = false;
function saveNow() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); saveWarned = false; return true; }
  catch (e) {
    if (!saveWarned) toast('השמירה נכשלה — כנראה שנפח התמונות גדול מדי. הסירו תמונות או ייצאו גיבוי בהגדרות.', 'err');
    saveWarned = true; return false;
  }
}
const save = debounce(saveNow, 350);

const P = () => S.projects.find(p => p.id === S.currentId) || null;

function newProject(dealType = 'sale') {
  const p = {
    id: uid(), createdAt: Date.now(), updatedAt: Date.now(),
    q: { dealType, propertyType: 'דירה', nearby: [], features: [], audience: [], documents: [], airDirections: [] },
    photos: [], coverIdx: 0,
    comps: [],
    cma: { floorStep: 1, condStep: 5, listingDisc: dealType === 'rent' ? 2 : 4, balconyW: 50, gardenW: 25, trendAnnual: '', margin: dealType === 'rent' ? 2 : 3, finalPrice: '', useIndex: true },
    market: { series: [], seriesName: '', fetchedAt: null, source: '', manual: {} },
    plan: null,
    studio: {},
    content: { groups: [] },
    deck: { off: [] }
  };
  S.projects.unshift(p); S.currentId = p.id; saveNow();
  return p;
}

function touch() { const p = P(); if (p) p.updatedAt = Date.now(); save(); }

/* ── property helpers used across modules ── */
const isRent = (p = P()) => p?.q?.dealType === 'rent';
const dealWord = (p = P()) => isRent(p) ? 'להשכרה' : 'למכירה';
function addrLine(q) {
  const street = [q.street, q.houseNo].filter(Boolean).join(' ');
  return [street, q.neighborhood, q.city].filter(Boolean).join(', ') || 'נכס ללא כתובת';
}
function shortAddr(q) { return [q.street && `${q.street}${q.houseNo ? ' ' + q.houseNo : ''}`, q.city].filter(Boolean).join(', ') || 'נכס חדש'; }
function coverPhoto(p = P()) { return p?.photos?.[p.coverIdx || 0] || p?.photos?.[0] || ''; }
function floorTxt(q) {
  if (!has(q.floor)) return '';
  const f = num(q.floor);
  const base = f === 0 ? 'קרקע' : `קומה ${f}`;
  return has(q.totalFloors) ? `${base} מתוך ${q.totalFloors}` : base;
}
function askPrice(p = P()) {
  const f = num(p.cma?.finalPrice);
  if (!isNaN(f)) return f;
  const r = cmaResult(p);
  if (r && !isNaN(r.listPrice)) return r.listPrice;
  return num(isRent(p) ? p.q.ownerRent : p.q.ownerPrice);
}
/** Short list of key selling facts, ordered by marketing weight */
function keyFacts(q) {
  const f = [];
  if (has(q.rooms)) f.push(`${q.rooms} חדרים`);
  if (has(q.sqm)) f.push(`${q.sqm} מ״ר`);
  const fl = floorTxt(q); if (fl) f.push(fl);
  if (has(q.balconySqm) && num(q.balconySqm) > 0) f.push(`מרפסת ${q.balconySqm} מ״ר`);
  if (has(q.gardenSqm) && num(q.gardenSqm) > 0) f.push(`גינה ${q.gardenSqm} מ״ר`);
  if (num(q.parking) > 0) f.push(num(q.parking) > 1 ? `${q.parking} חניות` : 'חניה');
  if (q.elevator === 'yes') f.push('מעלית');
  if (q.mamad === 'yes') f.push('ממ״ד');
  if (q.storage === 'yes') f.push('מחסן');
  return f;
}
function featureList(q) {
  const out = [...keyFacts(q)];
  if (q.condition) out.push(q.condition);
  if (has(q.airDirections) && q.airDirections.length >= 2) out.push(`${q.airDirections.length} כיווני אוויר`);
  if (q.view && q.view !== 'ללא נוף מיוחד') out.push(q.view);
  (q.features || []).forEach(x => out.push(x));
  return [...new Set(out)];
}

/* ── network: direct → local server proxy → custom proxy ── */
let serverProxy = null;
async function detectServer() {
  if (serverProxy !== null) return serverProxy;
  if (!/^https?:/.test(location.protocol)) return (serverProxy = false);
  try { const r = await fetch('api/health', { cache: 'no-store' }); serverProxy = r.ok && (await r.json()).ok === true; }
  catch { serverProxy = false; }
  return serverProxy;
}
async function fetchJSON(url) {
  const attempts = [];
  attempts.push(['ישיר', url]);
  if (await detectServer()) attempts.push(['שרת מקומי', 'api/proxy?url=' + encodeURIComponent(url)]);
  const cp = S.settings.proxyUrl?.trim();
  if (cp) attempts.push(['פרוקסי', cp.includes('{url}') ? cp.replace('{url}', encodeURIComponent(url)) : cp + encodeURIComponent(url)]);
  const errors = [];
  for (const [name, u] of attempts) {
    try {
      const ctl = new AbortController(); const tm = setTimeout(() => ctl.abort(), 15000);
      const r = await fetch(u, { signal: ctl.signal }); clearTimeout(tm);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const txt = await r.text();
      return { data: JSON.parse(txt), via: name };
    } catch (e) { errors.push(`${name}: ${e.message || e}`); }
  }
  throw new Error(errors.join(' | '));
}

/* ── image helpers ── */
function fileToDataURL(file) {
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); });
}
async function compressImage(file, max = 1400, q = 0.74) {
  const src = await fileToDataURL(file);
  const img = await loadImg(src);
  const k = Math.min(1, max / Math.max(img.width, img.height));
  const c = document.createElement('canvas');
  c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', q);
}
const imgCache = new Map();
function loadImg(src) {
  if (imgCache.has(src)) return imgCache.get(src);
  const pr = new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
  imgCache.set(src, pr); return pr;
}
function pickFiles(accept, multiple = true) {
  return new Promise(res => {
    const i = document.createElement('input'); i.type = 'file'; i.accept = accept; i.multiple = multiple;
    i.onchange = () => res([...i.files]); i.click();
  });
}

function applyBrand() {
  const r = document.documentElement;
  r.style.setProperty('--primary', S.settings.primary || DEFAULT_SETTINGS.primary);
  r.style.setProperty('--accent', S.settings.accent || DEFAULT_SETTINGS.accent);
  if (S.settings.theme === 'light' || S.settings.theme === 'dark') r.dataset.theme = S.settings.theme; else delete r.dataset.theme;
}

/* In-page dialogs (native confirm/prompt are unavailable in sandboxed viewers) */
function dialog({ title = '', msg = '', fields = [], ok = 'אישור', cancel = 'ביטול', danger = false } = {}) {
  return new Promise(res => {
    const el = document.createElement('div');
    el.className = 'modal';
    el.innerHTML = `<form class="modal-box" role="dialog" aria-modal="true">
      ${title ? `<h3>${esc(title)}</h3>` : ''}${msg ? `<p>${esc(msg)}</p>` : ''}
      ${fields.map((f, i) => `<label class="f"><span class="lbl">${esc(f.label)}</span>${f.opts
        ? `<select id="dlg-${i}">${f.opts.map(([v, t]) => `<option value="${esc(v)}" ${v === f.value ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select>`
        : `<input id="dlg-${i}" type="${f.type || 'text'}" value="${esc(f.value ?? '')}" ${f.min != null ? `min="${f.min}"` : ''} ${f.max != null ? `max="${f.max}"` : ''}>`}</label>`).join('')}
      <div class="row" style="justify-content:flex-end;margin-top:6px"><button type="button" class="btn" data-x>${esc(cancel)}</button><button class="btn ${danger ? 'danger-fill' : 'primary'}">${esc(ok)}</button></div></form>`;
    const done = v => { el.remove(); removeEventListener('keydown', key); res(v); };
    const key = e => { if (e.key === 'Escape') done(null); };
    el.querySelector('[data-x]').onclick = () => done(null);
    el.onclick = e => { if (e.target === el) done(null); };
    el.querySelector('form').onsubmit = e => {
      e.preventDefault();
      done(fields.length ? Object.fromEntries(fields.map((f, i) => [f.k, el.querySelector('#dlg-' + i).value])) : true);
    };
    addEventListener('keydown', key);
    document.body.appendChild(el);
    (el.querySelector('input,select') || el.querySelector('.btn.primary,.danger-fill'))?.focus();
  });
}
const confirmUI = (msg, ok = 'אישור', danger = false) => dialog({ msg, ok, danger });

/* Show an image full-size so it can be saved with long-press / right-click (downloads may be blocked) */
function showImage(src, caption = '') {
  const el = document.createElement('div');
  el.className = 'modal';
  el.innerHTML = `<div class="modal-box" style="max-width:min(92vw,720px);text-align:center"><img src="${src}" style="max-height:70vh;border-radius:8px"><p class="muted">${esc(caption)}</p><button class="btn primary" type="button">סגירה</button></div>`;
  el.onclick = e => { if (e.target === el || e.target.tagName === 'BUTTON') el.remove(); };
  document.body.appendChild(el);
}
