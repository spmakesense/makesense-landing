/* Graphics studio: canvas templates for posts, stories and banners */
'use strict';

const FORMATS = {
  square: { w: 1080, h: 1080, t: 'פוסט ריבועי 1:1' },
  portrait: { w: 1080, h: 1350, t: 'פיד אינסטגרם 4:5' },
  story: { w: 1080, h: 1920, t: 'סטורי / סטטוס 9:16' },
  wide: { w: 1200, h: 630, t: 'באנר / קישור 1.9:1' },
};
const TEMPLATES = [
  ['hero', 'תמונה מלאה'], ['split', 'תמונה + פאנל'], ['frame', 'מסגרת וסרט'], ['collage', 'קולאז׳ 3 תמונות'],
  ['specs', 'אינפוגרפיקה'], ['event', 'בית פתוח'], ['pricedrop', 'עדכון מחיר'], ['sold', 'נמכר / הושכר'],
];
const HEADLINES = p => [dealWord(p), 'חדש בשוק', 'בלעדי', 'הזדמנות', 'בקרוב', 'בית פתוח', 'מחיר מעודכן', isRent(p) ? 'הושכר!' : 'נמכר!'];

function studioDefaults(p) {
  return { tpl: 'hero', fmt: 'square', headline: dealWord(p), title: '', sub: '', showPrice: true, price: '', oldPrice: '', evDate: '', evTime: '10:00–12:00', photo: p.coverIdx || 0, footer: true, cta: 'לתיאום ביקור' };
}
function autoTitle(q) {
  const t = q.propertyType && q.propertyType !== 'דירה' ? q.propertyType.split(' /')[0] : 'דירת';
  const rooms = has(q.rooms) ? `${q.rooms} חדרים` : '';
  return t === 'דירת' ? `${t} ${rooms}`.trim() : `${t}${rooms ? ' · ' + rooms : ''}`;
}
function autoSub(q) {
  const street = q.discreet === 'yes' ? q.street : [q.street, q.houseNo].filter(Boolean).join(' ');
  return [q.neighborhood ? `שכונת ${q.neighborhood}` : street, q.city].filter(Boolean).join(', ');
}

/* ── canvas helpers ── */
const FONT_H = 'Rubik, Heebo, Arial, sans-serif', FONT_B = 'Heebo, Arial, sans-serif';
async function ensureFonts() {
  try { await Promise.all(['900 80px Rubik', '800 60px Rubik', '700 40px Rubik', '400 30px Heebo', '700 30px Heebo', '500 30px Heebo'].map(f => document.fonts.load(f, 'אבג'))); } catch { /* fonts optional */ }
}
function cover(ctx, img, x, y, w, h) {
  if (!img) { const g = ctx.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, '#c7cde4'); g.addColorStop(1, '#8a93b8'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h); return; }
  const k = Math.max(w / img.width, h / img.height), iw = img.width * k, ih = img.height * k;
  ctx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
}
function setFont(ctx, size, weight = 700, fam = FONT_H) { ctx.font = `${weight} ${size}px ${fam}`; }
function fit(ctx, text, maxW, size, weight = 800, fam = FONT_H, min = 18) {
  let s = size; setFont(ctx, s, weight, fam);
  while (ctx.measureText(text).width > maxW && s > min) { s -= 2; setFont(ctx, s, weight, fam); }
  return s;
}
function wrap(ctx, text, maxW) {
  const words = String(text).split(/\s+/), lines = []; let cur = '';
  words.forEach(w => { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; });
  if (cur) lines.push(cur); return lines;
}
function rrect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h); }
function txt(ctx, s, x, y, { size = 40, weight = 700, fam = FONT_H, color = '#fff', align = 'right', maxW, shadow } = {}) {
  ctx.save(); ctx.direction = 'rtl'; ctx.textAlign = align; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = color;
  if (maxW) fit(ctx, s, maxW, size, weight, fam); else setFont(ctx, size, weight, fam);
  if (shadow) { ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = shadow; ctx.shadowOffsetY = 2; }
  ctx.fillText(s, x, y); ctx.restore();
}
function badge(ctx, s, x, y, { size = 44, bg, color = '#141414', padX = 28, h } = {}) {
  ctx.save(); setFont(ctx, size, 800); ctx.direction = 'rtl';
  const w = ctx.measureText(s).width + padX * 2, hh = h || size * 1.6;
  rrect(ctx, x - w, y, w, hh, hh / 2); ctx.fillStyle = bg; ctx.fill();
  ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, x - w / 2, y + hh / 2 + 2); ctx.restore();
  return w;
}
function factsRow(ctx, facts, xRight, y, maxW, { size = 34, color = '#fff', sep = ' · ' } = {}) {
  const s = facts.join(sep);
  txt(ctx, s, xRight, y, { size, weight: 500, fam: FONT_B, color, maxW });
}
async function logoImg() { return S.settings.logo ? loadImg(S.settings.logo).catch(() => null) : null; }
async function footer(ctx, W, H, h, { bg = '#ffffff', color = '#141414', accent } = {}) {
  const st = S.settings, y = H - h;
  ctx.fillStyle = bg; ctx.fillRect(0, y, W, h);
  ctx.fillStyle = accent; ctx.fillRect(0, y, W, 6);
  const pad = W * 0.05, lg = await logoImg();
  let xr = W - pad;
  if (lg) { const lh = h * 0.6, lw = lg.width * lh / lg.height; ctx.drawImage(lg, xr - lw, y + (h - lh) / 2 + 3, lw, lh); xr -= lw + 20; }
  const name = [st.agentName, st.agency].filter(Boolean).join(' | ') || 'שם הסוכן | משרד התיווך';
  txt(ctx, name, xr, y + h * 0.58, { size: h * 0.3, weight: 700, color, maxW: W * 0.5 });
  if (st.phone) txt(ctx, st.phone, pad, y + h * 0.6, { size: h * 0.34, weight: 800, color, align: 'left' });
}

async function renderGraphic(canvas, p, cfg) {
  await ensureFonts();
  const F = FORMATS[cfg.fmt] || FORMATS.square, W = F.w, H = F.h;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d'), q = p.q;
  const PR = S.settings.primary || '#0d21a1', AC = S.settings.accent || '#FF9D00';
  const photos = await Promise.all([cfg.photo, (cfg.photo + 1) % Math.max(1, p.photos.length), (cfg.photo + 2) % Math.max(1, p.photos.length)]
    .map(i => p.photos[i] ? loadImg(p.photos[i]).catch(() => null) : null));
  const img = photos[0];
  const title = cfg.title || autoTitle(q), sub = cfg.sub || autoSub(q);
  const price = num(cfg.price) || askPrice(p);
  const priceTxt = cfg.showPrice && !isNaN(price) ? `${fmtN(price)} ₪${isRent(p) ? ' לחודש' : ''}` : '';
  const facts = keyFacts(q).slice(0, cfg.fmt === 'wide' ? 4 : 5);
  const pad = W * 0.06, wide = cfg.fmt === 'wide', tall = H / W > 1.5;
  const fh = cfg.footer ? (wide ? 84 : 120) : 0;
  const scale = wide ? 0.62 : 1;
  ctx.clearRect(0, 0, W, H);

  switch (cfg.tpl) {
    case 'split': {
      const ph = Math.round((H - fh) * (wide ? 1 : 0.58));
      if (wide) { cover(ctx, img, 0, 0, W * 0.52, H - fh); ctx.fillStyle = PR; ctx.fillRect(W * 0.52, 0, W * 0.48, H - fh); }
      else { cover(ctx, img, 0, 0, W, ph); ctx.fillStyle = PR; ctx.fillRect(0, ph, W, H - ph - fh); }
      const x = W - pad, top = wide ? pad : ph;
      badge(ctx, cfg.headline, x, top - (wide ? 0 : 44 * scale), { size: 46 * scale, bg: AC });
      const tw = wide ? W * 0.48 - pad * 2 : W - pad * 2;
      let y = top + (wide ? 150 : 120) * scale;
      txt(ctx, title, x, y, { size: 84 * scale, weight: 900, maxW: tw }); y += 66 * scale;
      txt(ctx, sub, x, y, { size: 40 * scale, weight: 500, fam: FONT_B, color: 'rgba(255,255,255,.85)', maxW: tw }); y += (tall ? 110 : 76) * scale;
      factsRow(ctx, facts, x, y, tw, { size: 36 * scale }); y += (tall ? 130 : 90) * scale;
      if (priceTxt) txt(ctx, priceTxt, x, y, { size: 70 * scale, weight: 900, color: AC, maxW: tw });
      break;
    }
    case 'frame': {
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
      const m = W * 0.045; cover(ctx, img, m, m, W - 2 * m, H - fh - m * (wide ? 1 : 0.5) - (wide ? 0 : H * 0.2));
      // diagonal ribbon (top-right corner)
      ctx.save(); ctx.translate(W - m, m); ctx.rotate(Math.PI / 4);
      ctx.fillStyle = AC; ctx.fillRect(-W * 0.4, W * 0.1, W * 0.8, 86 * scale);
      ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.fillStyle = '#141414'; setFont(ctx, 46 * scale, 900); ctx.fillText(cfg.headline, 0, W * 0.1 + 60 * scale); ctx.restore();
      if (wide) {
        const g = ctx.createLinearGradient(0, H * 0.35, 0, H - fh); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.75)');
        ctx.fillStyle = g; ctx.fillRect(m, H * 0.35, W - 2 * m, H - fh - H * 0.35 - m);
        txt(ctx, title, W - m - 30, H - fh - m - 70, { size: 54, weight: 900, maxW: W * 0.6, shadow: 8 });
        txt(ctx, [sub, priceTxt].filter(Boolean).join(' · '), W - m - 30, H - fh - m - 24, { size: 30, weight: 500, fam: FONT_B, maxW: W * 0.8 });
      } else {
        const y0 = H - fh - H * 0.2 - m * 0.5;
        txt(ctx, title, W - m, y0 + 90, { size: 72, weight: 900, color: '#141414', maxW: W * 0.62 });
        txt(ctx, sub, W - m, y0 + 145, { size: 36, weight: 500, fam: FONT_B, color: '#5d6475', maxW: W * 0.62 });
        factsRow(ctx, facts.slice(0, 4), W - m, y0 + 195, W * 0.62, { size: 30, color: '#141414' });
        if (priceTxt) { ctx.save(); rrect(ctx, m, y0 + 50, W * 0.3, 130, 22); ctx.fillStyle = PR; ctx.fill(); ctx.restore(); txt(ctx, priceTxt, m + W * 0.15, y0 + 132, { size: 50, weight: 900, align: 'center', maxW: W * 0.27 }); }
      }
      break;
    }
    case 'collage': {
      const ah = H - fh, g = 8;
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
      if (wide) { cover(ctx, photos[0], W * 0.34 + g, 0, W * 0.66 - g, ah); cover(ctx, photos[1], 0, 0, W * 0.34, ah / 2 - g / 2); cover(ctx, photos[2], 0, ah / 2 + g / 2, W * 0.34, ah / 2 - g / 2); }
      else { const mh = ah * 0.62; cover(ctx, photos[0], 0, 0, W, mh); cover(ctx, photos[1], W / 2 + g / 2, mh + g, W / 2 - g / 2, ah - mh - g); cover(ctx, photos[2], 0, mh + g, W / 2 - g / 2, ah - mh - g); }
      const bx = W - pad * 0.7, by = pad * 0.7;
      const boxW = wide ? W * 0.5 : W * 0.7;
      ctx.save(); ctx.globalAlpha = 0.94; rrect(ctx, bx - boxW, by, boxW, (wide ? 200 : 300) * (wide ? 1 : 1), 26); ctx.fillStyle = PR; ctx.fill(); ctx.restore();
      badge(ctx, cfg.headline, bx - 26, by - 30 * scale, { size: 40 * scale, bg: AC });
      txt(ctx, title, bx - 30, by + (wide ? 92 : 130), { size: wide ? 50 : 68, weight: 900, maxW: boxW - 60 });
      txt(ctx, sub, bx - 30, by + (wide ? 140 : 190), { size: wide ? 26 : 34, weight: 500, fam: FONT_B, color: 'rgba(255,255,255,.85)', maxW: boxW - 60 });
      if (priceTxt) txt(ctx, priceTxt, bx - 30, by + (wide ? 185 : 260), { size: wide ? 34 : 48, weight: 900, color: AC, maxW: boxW - 60 });
      break;
    }
    case 'specs': {
      const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, PR); g.addColorStop(1, shade(PR, -0.35));
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const x = W - pad;
      // photo circle
      const r = wide ? 190 : W * 0.2, cx = wide ? pad + r : pad + r, cy = wide ? (H - fh) / 2 : pad + r;
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip(); cover(ctx, img, cx - r, cy - r, 2 * r, 2 * r); ctx.restore();
      ctx.beginPath(); ctx.arc(cx, cy, r + 6, 0, Math.PI * 2); ctx.strokeStyle = AC; ctx.lineWidth = 10; ctx.stroke();
      const tw = wide ? W - pad * 3 - 2 * r : W - pad * 3 - 2 * r;
      badge(ctx, cfg.headline, x, pad * (wide ? 0.6 : 1), { size: 40 * scale, bg: AC });
      txt(ctx, title, x, pad + (wide ? 120 : 180), { size: wide ? 58 : 76, weight: 900, maxW: tw });
      txt(ctx, sub, x, pad + (wide ? 168 : 240), { size: wide ? 28 : 38, weight: 500, fam: FONT_B, color: 'rgba(255,255,255,.8)', maxW: tw });
      // tiles
      const tiles = specTiles(q).slice(0, wide ? 4 : 6);
      const cols = wide ? 4 : (tall ? 2 : 3), rows = Math.ceil(tiles.length / cols);
      const ty = wide ? pad + 210 : (tall ? H * 0.32 : pad + 2 * r + 70);
      const areaW = wide ? tw : W - 2 * pad, tg = 18, tWd = (areaW - tg * (cols - 1)) / cols;
      const tH = wide ? 120 : tall ? 210 : 170;
      tiles.forEach((t, i) => {
        const c = i % cols, rr = Math.floor(i / cols), tx = x - (c + 1) * tWd - c * tg, yy = ty + rr * (tH + tg);
        ctx.save(); rrect(ctx, tx, yy, tWd, tH, 22); ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fill(); ctx.restore();
        txt(ctx, t[0], tx + tWd / 2, yy + tH * 0.52, { size: wide ? 44 : 64, weight: 900, align: 'center', color: AC, maxW: tWd - 20 });
        txt(ctx, t[1], tx + tWd / 2, yy + tH * 0.82, { size: wide ? 22 : 30, weight: 500, fam: FONT_B, align: 'center', color: '#fff', maxW: tWd - 20 });
      });
      if (priceTxt) { const py = wide ? H - fh - 34 : ty + rows * (tH + tg) + (tall ? 140 : 90); txt(ctx, priceTxt, x, py, { size: wide ? 46 : 70, weight: 900, maxW: areaW }); }
      if (!wide && tall) { const hl = String(q.highlights || '').split('\n').filter(Boolean).slice(0, 3); let hy = ty + rows * (tH + tg) + 260; hl.forEach(h => { txt(ctx, '✔ ' + h, x, hy, { size: 38, weight: 500, fam: FONT_B, maxW: W - 2 * pad }); hy += 66; }); }
      break;
    }
    case 'event': {
      cover(ctx, img, 0, 0, W, H - fh);
      ctx.fillStyle = 'rgba(10,14,40,.55)'; ctx.fillRect(0, 0, W, H - fh);
      const cw = wide ? W * 0.56 : W * 0.8, chh = wide ? 380 : tall ? 820 : 640, cx0 = (W - cw) / 2, cy0 = wide ? (H - fh - chh) / 2 : (H - fh - chh) / 2;
      ctx.save(); rrect(ctx, cx0, cy0, cw, chh, 36); ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 40; ctx.fill(); ctx.restore();
      ctx.save(); rrect(ctx, cx0, cy0, cw, wide ? 90 : 150, [36, 36, 0, 0]); ctx.fillStyle = PR; ctx.fill(); ctx.restore();
      const mid = W / 2;
      txt(ctx, cfg.headline || 'בית פתוח', mid, cy0 + (wide ? 64 : 104), { size: wide ? 52 : 80, weight: 900, align: 'center', maxW: cw - 60 });
      const d = cfg.evDate ? new Date(cfg.evDate + 'T12:00:00') : null;
      const dayName = d ? d.toLocaleDateString('he-IL', { weekday: 'long' }) : 'יום ___';
      const dateS = d ? d.toLocaleDateString('he-IL', { day: 'numeric', month: 'long' }) : '__/__';
      let y = cy0 + (wide ? 150 : tall ? 300 : 250);
      txt(ctx, dayName, mid, y, { size: wide ? 34 : 50, weight: 700, align: 'center', color: '#5d6475' }); y += wide ? 62 : 96;
      txt(ctx, dateS, mid, y, { size: wide ? 58 : 96, weight: 900, align: 'center', color: PR, maxW: cw - 60 }); y += wide ? 52 : 90;
      txt(ctx, cfg.evTime || '', mid, y, { size: wide ? 36 : 56, weight: 800, align: 'center', color: '#141414' }); y += wide ? 46 : 90;
      txt(ctx, `${title} · ${sub}`, mid, y, { size: wide ? 24 : 34, weight: 500, fam: FONT_B, align: 'center', color: '#5d6475', maxW: cw - 60 });
      if (!wide) { y += tall ? 110 : 76; badge(ctx, cfg.cta || 'הרשמה מראש בטלפון', mid + 220, y - 44, { size: 34, bg: AC }); }
      break;
    }
    case 'pricedrop': {
      cover(ctx, img, 0, 0, W, H - fh);
      const g = ctx.createLinearGradient(0, 0, 0, H - fh); g.addColorStop(0.3, 'rgba(0,0,0,.05)'); g.addColorStop(1, 'rgba(0,0,0,.82)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H - fh);
      const x = W - pad;
      badge(ctx, cfg.headline || 'מחיר מעודכן', x, pad, { size: 50 * scale, bg: '#dc2626', color: '#fff' });
      const old = num(cfg.oldPrice), b = H - fh - pad;
      txt(ctx, title, x, b - (wide ? 210 : 330), { size: 76 * scale, weight: 900, maxW: W - 2 * pad, shadow: 10 });
      txt(ctx, sub, x, b - (wide ? 165 : 262), { size: 38 * scale, weight: 500, fam: FONT_B, maxW: W - 2 * pad, shadow: 6 });
      if (!isNaN(old)) {
        const os = `${fmtN(old)} ₪`; setFont(ctx, 54 * scale, 700);
        txt(ctx, os, x, b - (wide ? 95 : 150), { size: 54 * scale, weight: 700, color: 'rgba(255,255,255,.7)' });
        const w = ctx.measureText(os).width; ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 7 * scale; ctx.beginPath(); ctx.moveTo(x, b - (wide ? 112 : 170)); ctx.lineTo(x - w, b - (wide ? 112 : 170)); ctx.stroke();
      }
      if (!isNaN(price)) txt(ctx, `${fmtN(price)} ₪`, x, b - 10, { size: 110 * scale, weight: 900, color: AC, shadow: 10 });
      break;
    }
    case 'sold': {
      ctx.filter = 'grayscale(.6) brightness(.8)'; cover(ctx, img, 0, 0, W, H - fh); ctx.filter = 'none';
      ctx.save(); ctx.translate(W / 2, (H - fh) / 2); ctx.rotate(-0.18);
      const sw = wide ? 640 : 820, sh = wide ? 220 : 300;
      rrect(ctx, -sw / 2, -sh / 2, sw, sh, 30); ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fill();
      ctx.lineWidth = 16; ctx.strokeStyle = AC; ctx.stroke();
      ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = AC; setFont(ctx, wide ? 140 : 190, 900);
      ctx.fillText(cfg.headline || (isRent(p) ? 'הושכר!' : 'נמכר!'), 0, 10); ctx.restore();
      txt(ctx, title + (sub ? ' · ' + sub : ''), W / 2, H - fh - pad, { size: 40 * scale, weight: 700, align: 'center', maxW: W - 2 * pad, shadow: 10 });
      txt(ctx, 'רוצים לדעת כמה שווה הנכס שלכם?', W / 2, pad + 40 * scale, { size: 44 * scale, weight: 800, align: 'center', maxW: W - 2 * pad, shadow: 10 });
      break;
    }
    default: { // hero
      cover(ctx, img, 0, 0, W, H - fh);
      const g = ctx.createLinearGradient(0, (H - fh) * 0.35, 0, H - fh); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.85)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H - fh);
      const x = W - pad, b = H - fh - pad * (wide ? 0.6 : 1);
      badge(ctx, cfg.headline, x, pad * (wide ? 0.6 : 1), { size: 52 * scale, bg: AC });
      const tw = W - 2 * pad;
      if (priceTxt) txt(ctx, priceTxt, x, b, { size: 80 * scale, weight: 900, color: AC, maxW: tw, shadow: 12 });
      const off = priceTxt ? 100 * scale : 0;
      factsRow(ctx, facts, x, b - off, tw, { size: 38 * scale });
      txt(ctx, sub, x, b - off - 64 * scale, { size: 40 * scale, weight: 500, fam: FONT_B, maxW: tw, shadow: 8 });
      txt(ctx, title, x, b - off - 126 * scale, { size: 96 * scale, weight: 900, maxW: tw, shadow: 14 });
    }
  }
  if (cfg.footer) await footer(ctx, W, H, fh, { accent: AC });
  return canvas;
}
function specTiles(q) {
  const t = [];
  if (has(q.rooms)) t.push([String(q.rooms), 'חדרים']);
  if (has(q.sqm)) t.push([String(q.sqm), 'מ״ר בנוי']);
  if (has(q.floor)) t.push([num(q.floor) === 0 ? 'קרקע' : String(q.floor), has(q.totalFloors) ? `קומה מתוך ${q.totalFloors}` : 'קומה']);
  if (num(q.balconySqm) > 0) t.push([String(q.balconySqm), 'מ״ר מרפסת']);
  if (num(q.gardenSqm) > 0) t.push([String(q.gardenSqm), 'מ״ר גינה']);
  if (num(q.parking) > 0) t.push([String(q.parking), num(q.parking) > 1 ? 'חניות' : 'חניה']);
  if (q.mamad === 'yes') t.push(['✔', 'ממ״ד']);
  if (q.elevator === 'yes') t.push(['✔', 'מעלית']);
  if (q.storage === 'yes') t.push(['✔', 'מחסן']);
  if (has(q.buildYear)) t.push([String(q.buildYear), 'שנת בנייה']);
  return t;
}
function shade(hex, k) {
  const n = parseInt(hex.replace('#', ''), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = v => Math.round(clamp(k < 0 ? v * (1 + k) : v + (255 - v) * k, 0, 255));
  return '#' + [f(r), f(g), f(b)].map(v => v.toString(16).padStart(2, '0')).join('');
}

/* ── studio UI ── */
function renderStudio() {
  const p = P(); p.studio = { ...studioDefaults(p), ...(p.studio || {}) };
  const c = p.studio;
  $('#view').innerHTML = `
  <div class="card-head"><div><h1>סטודיו גרפיקה</h1><div class="muted">גרפיקות מוכנות לפייסבוק, אינסטגרם, סטטוס וואטסאפ ופורטלים — עם הלוגו והפרטים שלכם</div></div>
    <div class="row"><button class="btn" id="st-all">⤓ כל הפורמטים</button><button class="btn" id="st-view">🔍 תצוגה לשמירה</button><button class="btn primary" id="st-dl">⤓ הורדת PNG</button></div></div>
  <div class="split">
    <div class="card sticky" style="max-height:calc(100vh - 96px);overflow:auto">
      <h3>תבנית</h3><div class="tpl-grid" id="st-tpl">${TEMPLATES.map(([k, t]) => `<button data-v="${k}" class="${c.tpl === k ? 'on' : ''}">${t}</button>`).join('')}</div>
      <h3 style="margin-top:14px">פורמט</h3><div class="tpl-grid" id="st-fmt">${Object.entries(FORMATS).map(([k, f]) => `<button data-v="${k}" class="${c.fmt === k ? 'on' : ''}">${f.t}</button>`).join('')}</div>
      <h3 style="margin-top:14px">תמונה</h3>
      ${p.photos.length ? `<div class="thumbs" id="st-ph">${p.photos.map((s, i) => `<button data-v="${i}" class="${c.photo === i ? 'on' : ''}" style="background-image:url('${s}')"></button>`).join('')}</div>` : `<div class="note">אין תמונות. <a href="#" id="st-addph">העלו תמונות בשאלון</a>.</div>`}
      <div class="fields" style="margin-top:14px;grid-template-columns:1fr">
        <label class="f"><span class="lbl">כותרת תגית</span><input list="hl-list" data-s="headline" value="${esc(c.headline)}"><datalist id="hl-list">${HEADLINES(p).map(h => `<option value="${esc(h)}">`).join('')}</datalist></label>
        <label class="f"><span class="lbl">כותרת ראשית</span><input data-s="title" value="${esc(c.title)}" placeholder="${esc(autoTitle(p.q))}"></label>
        <label class="f"><span class="lbl">שורת משנה</span><input data-s="sub" value="${esc(c.sub)}" placeholder="${esc(autoSub(p.q))}"></label>
        <label class="f"><span class="lbl">מחיר (ריק = מחיר השיווק)</span><input type="number" data-s="price" value="${esc(c.price)}" placeholder="${esc(askPrice(p) || '')}"></label>
        ${c.tpl === 'pricedrop' ? `<label class="f"><span class="lbl">מחיר קודם (יוצג מחוק)</span><input type="number" data-s="oldPrice" value="${esc(c.oldPrice)}"></label>` : ''}
        ${c.tpl === 'event' ? `<label class="f"><span class="lbl">תאריך האירוע</span><input type="date" data-s="evDate" value="${esc(c.evDate)}"></label><label class="f"><span class="lbl">שעות</span><input data-s="evTime" value="${esc(c.evTime)}"></label><label class="f"><span class="lbl">קריאה לפעולה</span><input data-s="cta" value="${esc(c.cta)}"></label>` : ''}
        <label class="row" style="gap:8px"><input type="checkbox" data-s="showPrice" ${c.showPrice ? 'checked' : ''}> הצגת מחיר</label>
        <label class="row" style="gap:8px"><input type="checkbox" data-s="footer" ${c.footer ? 'checked' : ''}> פס פרטי סוכן ולוגו</label>
      </div>
      ${!S.settings.agentName || !S.settings.phone ? `<div class="note" style="margin-top:10px">הוסיפו שם, טלפון ולוגו ב<a href="#" data-tabgo="settings">הגדרות</a> כדי שיופיעו על הגרפיקות.</div>` : ''}
    </div>
    <div><div class="canvas-box"><canvas id="st-canvas"></canvas></div>
      <div class="note" style="margin-top:10px">טיפ: פרסמו את אותו נכס בכמה תבניות לאורך הקמפיין (חדש בשוק ← אינפוגרפיקה ← בית פתוח ← מחיר מעודכן) כדי לייצר ״רענון״ בלי לשחוק את המודעה.</div></div>
  </div>`;
  const cv = $('#st-canvas');
  const draw = debounce(() => renderGraphic(cv, p, c), 120);
  renderGraphic(cv, p, c);
  const v = $('#view');
  v.querySelectorAll('[data-tabgo]').forEach(b => b.onclick = e => { e.preventDefault(); go(b.dataset.tabgo); });
  const ap = $('#st-addph'); if (ap) ap.onclick = e => { e.preventDefault(); qStep = 'photos'; go('questionnaire'); };
  $$('#st-tpl button').forEach(b => b.onclick = () => {
    c.tpl = b.dataset.v;
    if (c.tpl === 'event') c.headline = 'בית פתוח'; else if (c.tpl === 'pricedrop') c.headline = 'מחיר מעודכן'; else if (c.tpl === 'sold') c.headline = isRent(p) ? 'הושכר!' : 'נמכר!';
    else if (['בית פתוח', 'מחיר מעודכן', 'נמכר!', 'הושכר!'].includes(c.headline)) c.headline = dealWord(p);
    touch(); renderStudio();
  });
  $$('#st-fmt button').forEach(b => b.onclick = () => { c.fmt = b.dataset.v; touch(); $$('#st-fmt button').forEach(x => x.classList.toggle('on', x === b)); draw(); });
  $$('#st-ph button').forEach(b => b.onclick = () => { c.photo = +b.dataset.v; touch(); $$('#st-ph button').forEach(x => x.classList.toggle('on', x === b)); draw(); });
  v.querySelectorAll('[data-s]').forEach(el => el.addEventListener('input', () => { c[el.dataset.s] = el.type === 'checkbox' ? el.checked : el.value; touch(); draw(); }));
  const fname = (cfg) => `${shortAddr(p.q).replace(/[\s,]+/g, '_')}_${cfg.tpl}_${cfg.fmt}.png`;
  $('#st-view').onclick = () => showImage(cv.toDataURL('image/png'), 'לחיצה ארוכה (בטלפון) או לחצן ימני ← ״שמירת תמונה״');
  $('#st-dl').onclick = () => cv.toBlob(b => download(fname(c), b), 'image/png');
  $('#st-all').onclick = async () => {
    for (const fmt of Object.keys(FORMATS)) {
      const cc = document.createElement('canvas'), cfg = { ...c, fmt };
      await renderGraphic(cc, p, cfg);
      await new Promise(r => cc.toBlob(b => { download(fname(cfg), b); setTimeout(r, 300); }, 'image/png'));
    }
  };
}
