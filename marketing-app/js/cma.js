/* Market data (CBS index), comparable deals, CMA valuation and pricing strategy */
'use strict';

const COND_OPTS = [['same', 'דומה'], ['worse', 'נחות מהנכס'], ['better', 'עדיף על הנכס']];
const CMA_STEP_DEFAULTS = { floorStep: 1, condStep: 5, listingDisc: 4, balconyW: 50, gardenW: 25, margin: 3 };

/* ── CBS (הלמ״ס) price index ─────────────────────── */
function cbsUrl(code, years = 6) {
  const now = new Date(), from = new Date(now.getFullYear() - years, now.getMonth(), 1);
  const mm = d => String(d.getMonth() + 1).padStart(2, '0') + '-' + d.getFullYear();
  return `https://api.cbs.gov.il/index/data/price?id=${encodeURIComponent(code)}&format=json&download=false&startPeriod=${mm(from)}&endPeriod=${mm(now)}&PageSize=500`;
}
function parseCbs(data) {
  let name = '', rows = [];
  const walk = o => {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) {
      if (o.length && o[0] && typeof o[0] === 'object' && 'year' in o[0] && 'month' in o[0]) { rows = rows.concat(o); return; }
      o.forEach(walk); return;
    }
    if (!name && typeof o.name === 'string' && o.date) name = o.name;
    Object.values(o).forEach(walk);
  };
  walk(data);
  const pts = rows.map(r => {
    const v = num(r.currBase?.value ?? r.value ?? r.indexValue ?? r.currBase);
    return { y: +r.year, m: +r.month, value: v };
  }).filter(r => r.y && r.m && !isNaN(r.value));
  const map = new Map(); pts.forEach(p => map.set(p.y * 100 + p.m, p));
  const series = [...map.values()].sort((a, b) => (a.y * 100 + a.m) - (b.y * 100 + b.m))
    .map(p => ({ ...p, label: `${HEB_MONTHS[p.m - 1]} ${String(p.y).slice(2)}` }));
  return { name, series };
}
async function fetchCbsIndex(p, which = 'sale') {
  const code = (which === 'rent' ? S.settings.cbsRentCode : S.settings.cbsSaleCode) || '';
  if (!code.trim()) { toast('הגדירו קוד סדרה של הלמ״ס בהגדרות', 'err'); return; }
  const btn = $('#cbs-fetch'); if (btn) { btn.disabled = true; btn.textContent = 'שואב נתונים…'; }
  try {
    const { data, via } = await fetchJSON(cbsUrl(code.trim()));
    const { name, series } = parseCbs(data);
    if (series.length < 2) throw new Error('לא התקבלו נקודות מדד בתגובה');
    p.market.series = series; p.market.seriesName = name || `סדרה ${code}`;
    p.market.fetchedAt = Date.now(); p.market.source = `הלמ״ס — API מדדים (סדרה ${code}, דרך: ${via})`;
    touch(); toast(`נשאבו ${series.length} נקודות מדד מהלמ״ס ✓`, 'ok');
  } catch (e) {
    toast('השאיבה מהלמ״ס נכשלה. ניתן להפעיל את השרת המקומי (server.js) או להדביק את נתוני המדד ידנית.', 'err');
    console.warn(e); p.market.lastError = String(e.message || e); touch();
  }
  renderCMA();
}
function indexAt(series, iso) {
  if (!series?.length || !iso) return NaN;
  const d = new Date(iso); if (isNaN(d)) return NaN;
  const key = d.getFullYear() * 12 + d.getMonth();
  let best = null, bd = 1e9;
  for (const s of series) { const k = s.y * 12 + (s.m - 1), dd = Math.abs(k - key); if (dd < bd) { bd = dd; best = s; } }
  return bd <= 3 ? best.value : NaN;
}
function trendStats(series) {
  if (!series?.length) return {};
  const last = series[series.length - 1];
  const back = months => { const k = last.y * 12 + last.m - months; let b = null, bd = 1e9; series.forEach(s => { const d = Math.abs(s.y * 12 + s.m - k); if (d < bd) { bd = d; b = s; } }); return bd <= 2 ? b : null; };
  const y1 = back(12), y3 = back(36), m3 = back(3);
  return { last, yoy: y1 ? last.value / y1.value - 1 : NaN, y3: y3 ? last.value / y3.value - 1 : NaN, m3: m3 ? last.value / m3.value - 1 : NaN };
}

/* ── import (paste / CSV / XLSX) ────────────────── */
const COL_SYNONYMS = {
  address: ['כתובת', 'רחוב', 'address', 'מיקום', 'שם הרחוב'],
  date: ['תאריך', 'יום מכירה', 'תאריך עסקה', 'מועד', 'date', 'תאריך מכירה'],
  price: ['מחיר', 'סכום', 'תמורה', 'שווי', 'price', 'שכד', 'שכר דירה', 'מחיר מבוקש'],
  sqm: ['שטח', 'מר', 'גודל', 'sqm', 'area', 'מטר'],
  rooms: ['חדרים', 'חדר', 'rooms'],
  floor: ['קומה', 'floor'],
  year: ['שנת בניה', 'שנת בנייה', 'שנה', 'year'],
  kind: ['סטטוס', 'סוג', 'status']
};
const normH = s => String(s).toLowerCase().replace(/["'״׳`]/g, '').replace(/\s+/g, ' ').trim();
function parseDateAny(v) {
  if (v == null || v === '') return '';
  const s = String(v).trim();
  if (/^\d{5}(\.\d+)?$/.test(s)) { const d = new Date(Math.round((+s - 25569) * 864e5)); return d.toISOString().slice(0, 10); }
  let m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/); if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
  m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/); if (m) { const y = m[3].length === 2 ? '20' + m[3] : m[3]; return `${y}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`; }
  m = s.match(/^(\d{1,2})[-/.](\d{4})$/); if (m) return `${m[2]}-${m[1].padStart(2, '0')}-15`;
  return '';
}
function parseFloorAny(v) { const s = String(v ?? ''); if (/קרקע/.test(s)) return 0; const m = s.match(/-?\d+/); return m ? +m[0] : ''; }
function splitRows(text) {
  const lines = text.replace(/\r/g, '').split('\n').filter(l => l.trim());
  const sep = lines[0]?.includes('\t') ? '\t' : (lines[0]?.split(';').length > lines[0]?.split(',').length ? ';' : ',');
  return lines.map(l => {
    if (sep === '\t') return l.split('\t');
    const out = []; let cur = '', qt = false;
    for (const ch of l) { if (ch === '"') qt = !qt; else if (ch === sep && !qt) { out.push(cur); cur = ''; } else cur += ch; }
    out.push(cur); return out;
  });
}
function importComps(text, kind = 'sold') {
  const rows = splitRows(text);
  if (!rows.length) return [];
  const head = rows[0].map(normH);
  const idx = {};
  for (const [k, syn] of Object.entries(COL_SYNONYMS)) idx[k] = head.findIndex(h => syn.some(s => h.includes(normH(s))));
  let body = rows.slice(1);
  if (idx.price < 0 && idx.sqm < 0) { // no header — assume: address, date, price, sqm, rooms, floor
    Object.assign(idx, { address: 0, date: 1, price: 2, sqm: 3, rooms: 4, floor: 5, year: -1, kind: -1 }); body = rows;
  }
  const g = (r, k) => idx[k] >= 0 ? r[idx[k]] : '';
  return body.map(r => ({
    id: uid(), on: true, cond: 'same', adj: '',
    kind: /מוצע|למכירה|active|listing/i.test(g(r, 'kind')) ? 'listing' : kind,
    address: String(g(r, 'address') || '').trim(),
    date: parseDateAny(g(r, 'date')),
    price: num(g(r, 'price')) || '',
    sqm: num(g(r, 'sqm')) || '',
    rooms: num(g(r, 'rooms')) || '',
    floor: parseFloorAny(g(r, 'floor')),
    year: num(g(r, 'year')) || '',
    source: 'ייבוא'
  })).filter(c => c.price && c.sqm);
}
let xlsxLoading = null;
function loadXLSX() {
  if (window.XLSX) return Promise.resolve();
  return xlsxLoading ||= new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    s.onload = res; s.onerror = () => rej(new Error('טעינת ספריית האקסל נכשלה')); document.head.appendChild(s);
  });
}
async function fileToText(f) {
  if (/\.(xlsx|xls)$/i.test(f.name)) {
    await loadXLSX();
    const wb = XLSX.read(await f.arrayBuffer(), { type: 'array' });
    return XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]], { FS: '\t' });
  }
  return f.text();
}

/* ── valuation ─────────────────────────────────── */
function effSqm(q, c) {
  const s = num(q.sqm); if (isNaN(s)) return NaN;
  return s + (num(q.balconySqm) || 0) * c.balconyW / 100 + (num(q.roofSqm) || 0) * c.balconyW / 100 + (num(q.gardenSqm) || 0) * c.gardenW / 100;
}
function cmaResult(p) {
  const q = p.q, c = { ...CMA_STEP_DEFAULTS, ...p.cma };
  const now = new Date(), series = p.market.series, lastIdx = series?.length ? series[series.length - 1].value : NaN;
  const trend = num(c.trendAnnual) / 100;
  const rows = (p.comps || []).map(cp => {
    const price = num(cp.price), sqm = num(cp.sqm);
    const ppsqm = price / sqm;
    const adj = {};
    // time
    let ft = 1;
    if (c.useIndex && series?.length && cp.date) { const i0 = indexAt(series, cp.date); if (!isNaN(i0)) ft = lastIdx / i0; }
    else if (!isNaN(trend) && cp.date) { const yrs = (now - new Date(cp.date)) / 3.156e10; if (yrs > 0) ft = Math.pow(1 + trend, yrs); }
    adj.time = ft - 1;
    // floor
    const fs = num(q.floor), fc = num(cp.floor);
    adj.floor = (!isNaN(fs) && !isNaN(fc)) ? clamp((fs - fc) * c.floorStep / 100, -0.1, 0.1) : 0;
    adj.cond = cp.cond === 'worse' ? c.condStep / 100 : cp.cond === 'better' ? -c.condStep / 100 : 0;
    adj.listing = cp.kind === 'listing' ? -c.listingDisc / 100 : 0;
    adj.manual = (num(cp.adj) || 0) / 100;
    const factor = (1 + adj.time) * (1 + adj.floor) * (1 + adj.cond) * (1 + adj.listing) * (1 + adj.manual);
    const ageM = cp.date ? (now - new Date(cp.date)) / 2.63e9 : 12;
    const w = (cp.kind === 'listing' ? 0.5 : 1) * (ageM <= 6 ? 1 : ageM <= 12 ? 0.8 : ageM <= 24 ? 0.6 : 0.4);
    return { ...cp, ppsqm, adj, factor, adjPpsqm: ppsqm * factor, w, valid: cp.on !== false && isFinite(ppsqm) && ppsqm > 0 };
  });
  const used = rows.filter(r => r.valid);
  const es = effSqm(q, c);
  const res = { rows, used, effSqm: es, n: used.length, nSold: used.filter(r => r.kind !== 'listing').length };
  if (!used.length) return res;
  const vals = used.map(r => r.adjPpsqm).sort((a, b) => a - b);
  const pct = k => { const i = (vals.length - 1) * k, lo = Math.floor(i), hi = Math.ceil(i); return vals[lo] + (vals[hi] - vals[lo]) * (i - lo); };
  const wsum = used.reduce((a, r) => a + r.w, 0);
  res.ppsqmW = used.reduce((a, r) => a + r.adjPpsqm * r.w, 0) / wsum;
  res.ppsqmMed = median(vals); res.ppsqmLo = pct(0.25); res.ppsqmHi = pct(0.75);
  res.rawPpsqmMed = median(used.map(r => r.ppsqm));
  if (!isNaN(es)) {
    const st = priceStep(res.ppsqmW * es);
    res.value = roundTo(res.ppsqmW * es, st);
    res.low = roundTo(res.ppsqmLo * es, st); res.high = roundTo(res.ppsqmHi * es, st);
    res.tiers = {
      competitive: roundTo(res.value * 0.98, st),
      market: roundTo(res.value * (1 + c.margin / 100), st),
      ambitious: roundTo(res.value * (1 + c.margin / 100 + 0.04), st)
    };
    res.listPrice = res.tiers.market;
    const owner = num(isRent(p) ? q.ownerRent : q.ownerPrice);
    if (!isNaN(owner)) res.ownerGap = owner / res.value - 1;
  }
  // confidence
  const spread = res.ppsqmHi / res.ppsqmLo - 1;
  res.confidence = res.nSold >= 5 && spread < 0.15 ? 'גבוהה' : res.nSold >= 3 && spread < 0.25 ? 'בינונית' : 'נמוכה';
  return res;
}
function domEstimate(gap) {
  if (isNaN(gap)) return null;
  if (gap <= 0.02) return { days: '30–60', txt: 'תמחור מדויק — צפי לפניות רבות ומו״מ קצר', kind: 'ok' };
  if (gap <= 0.07) return { days: '60–120', txt: 'מעט מעל השוק — סביר שיידרש מו״מ או עדכון מחיר אחד', kind: 'warn' };
  return { days: '120+', txt: 'מעל טווח השוק — סיכון ל״שחיקת״ הנכס והורדת מחיר מאוחרת', kind: 'err' };
}

/* ── render ───────────────────────────────────── */
function renderCMA() {
  const p = P(), q = p.q, c = p.cma, r = cmaResult(p), R = isRent(p);
  const unit = R ? 'שכ״ד חודשי' : 'מחיר';
  const ts = trendStats(p.market.series);
  const city = q.city || '';
  const owner = num(R ? q.ownerRent : q.ownerPrice);
  const dom = domEstimate(r.ownerGap);
  const finalP = num(c.finalPrice);

  $('#view').innerHTML = `
  <div class="card-head"><div><h1>ניתוח שוק ו-CMA</h1><div class="muted">${esc(addrLine(q))} · ${fmtN(q.sqm)} מ״ר · ${fmtN(q.rooms, 1)} חד׳ · ${esc(floorTxt(q) || 'קומה לא הוזנה')}</div></div>
    <div class="row"><button class="btn" data-tabgo="questionnaire">✎ עריכת פרטי הנכס</button><button class="btn primary" data-tabgo="plan">המשך לתכנית שיווק ←</button></div></div>

  <div class="grid g2">
    <div class="card">
      <h2>1 · מקורות מידע</h2>
      <div class="stack">
        <div class="row between"><div><b>מדד מחירי ${R ? 'שכירות' : 'דירות'} — הלמ״ס</b><br><small>${p.market.series?.length ? `${esc(p.market.seriesName)} · ${p.market.series.length} נקודות · עודכן ${fmtDate(new Date(p.market.fetchedAt || Date.now()).toISOString())}` : 'טרם נשאב'}</small></div>
          <button class="btn primary" id="cbs-fetch">⤓ שאיבה מהלמ״ס</button></div>
        ${p.market.lastError && !p.market.series?.length ? `<div class="note warn">הדפדפן לא הצליח לגשת ישירות ל-API של הלמ״ס (חסימת CORS או רשת). הפעילו את <b>server.js</b> המצורף (פרוקסי מקומי) או הגדירו כתובת פרוקסי בהגדרות — או הדביקו את הנתונים ידנית למטה.</div>` : ''}
        <details><summary class="muted" style="cursor:pointer">הדבקת מדד ידנית (חודש-שנה, ערך)</summary>
          <textarea id="idx-paste" rows="4" placeholder="01-2024, 512.3&#10;03-2024, 516.8"></textarea>
          <button class="btn sm" id="idx-apply" style="margin-top:6px">החל סדרה</button></details>
        <hr style="border:0;border-top:1px solid var(--border)">
        <b>עסקאות ומודעות להשוואה</b>
        <div class="row">
          <a class="btn sm" href="https://www.nadlan.gov.il/" target="_blank" rel="noopener">🏛 עסקאות בנדל״ן — nadlan.gov.il</a>
          <a class="btn sm" href="https://www.govmap.gov.il/" target="_blank" rel="noopener">🗺 GovMap (גוש/חלקה)</a>
          <a class="btn sm" href="https://www.madlan.co.il/" target="_blank" rel="noopener">מדלן</a>
          <a class="btn sm" href="https://www.yad2.co.il/realestate/${R ? 'rent' : 'forsale'}" target="_blank" rel="noopener">יד2</a>
          <button class="btn sm" id="copy-addr">⧉ העתקת כתובת לחיפוש</button>
        </div>
        <div class="note">טיפ: באתר nadlan.gov.il חפשו את ${esc(q.street ? 'הרחוב ' + q.street : 'הכתובת')}${city ? ' ב' + esc(city) : ''}, סמנו את טבלת העסקאות, העתיקו (Ctrl+C) והדביקו כאן. ניתן גם לייבא קובץ CSV / Excel שיוצא מהאתר. העמודות מזוהות אוטומטית (כתובת, תאריך, מחיר, שטח, חדרים, קומה).</div>
        <textarea id="comp-paste" rows="4" placeholder="הדביקו כאן טבלת עסקאות…"></textarea>
        <div class="row">
          <select id="imp-kind" style="width:auto"><option value="sold">${R ? 'שכירויות שנחתמו' : 'עסקאות שבוצעו'}</option><option value="listing">נכסים מוצעים כעת</option></select>
          <button class="btn primary sm" id="comp-import">ייבוא מהדבקה</button>
          <button class="btn sm" id="comp-file">📄 ייבוא קובץ CSV / Excel</button>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>2 · מגמות שוק</h2>
      ${p.market.series?.length ? `
        <div class="kpis" style="margin-bottom:12px">
          <div class="kpi"><small>שינוי 3 חודשים</small><b>${fmtPct(ts.m3)}</b></div>
          <div class="kpi"><small>שינוי שנתי</small><b>${fmtPct(ts.yoy)}</b></div>
          <div class="kpi"><small>שינוי ב-3 שנים</small><b>${fmtPct(ts.y3)}</b></div>
        </div>
        ${Charts.line(p.market.series, { h: 230, title: p.market.seriesName })}
        <small>מקור: ${esc(p.market.source || 'הוזן ידנית')}</small>` : `<div class="note">שאבו את מדד מחירי הדירות מהלמ״ס כדי להציג מגמה, ולהתאים את מחירי העסקאות הישנות למחירי היום.</div>`}
      <h3 style="margin-top:16px">נתוני אזור (מהלמ״ס / נדל״ן ממשלתי / ניסיון שטח)</h3>
      <div class="fields">
        ${[['cityAvg', R ? 'שכ״ד ממוצע בעיר (₪)' : 'מחיר ממוצע לדירה בעיר (₪)'], ['cityPpsqm', 'מחיר ממוצע למ״ר באזור (₪)'], ['areaYoy', 'שינוי שנתי באזור (%)'], ['dom', 'זמן שיווק ממוצע (ימים)'], ['dealsYear', 'מס׳ עסקאות בשכונה בשנה האחרונה'], ['inventory', 'נכסים דומים מוצעים כעת'], ['mortgageRate', 'ריבית משכנתא ממוצעת (%)'], ['source', 'מקור הנתונים']]
          .map(([k, l]) => `<label class="f"><span class="lbl">${l}</span><input type="${k === 'source' ? 'text' : 'number'}" data-m="${k}" value="${esc(p.market.manual?.[k])}"></label>`).join('')}
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-head"><h2>3 · נכסים להשוואה (${r.n} פעילים)</h2>
      <div class="row"><button class="btn sm" id="comp-add">＋ עסקה</button><button class="btn sm" id="comp-add-l">＋ מודעה פעילה</button>${p.comps.length ? '<button class="btn sm danger" id="comp-clear">ניקוי הכל</button>' : ''}</div></div>
    ${p.comps.length ? `<div class="table-wrap"><table class="t"><thead><tr>
      <th>✓</th><th>סוג</th><th>כתובת</th><th>תאריך</th><th>${unit} (₪)</th><th>מ״ר</th><th>חד׳</th><th>קומה</th><th>מצב יחסי</th><th>התאמה ידנית %</th><th>₪/מ״ר</th><th>התאמות</th><th>₪/מ״ר מותאם</th><th></th></tr></thead><tbody>
      ${r.rows.map(row => `<tr data-id="${row.id}" class="${row.on === false ? 'off' : ''}">
        <td><input type="checkbox" data-c="on" ${row.on !== false ? 'checked' : ''}></td>
        <td><select data-c="kind"><option value="sold" ${row.kind !== 'listing' ? 'selected' : ''}>${R ? 'הושכר' : 'נמכר'}</option><option value="listing" ${row.kind === 'listing' ? 'selected' : ''}>מוצע</option></select></td>
        <td><input class="addr" data-c="address" value="${esc(row.address)}"></td>
        <td><input type="date" data-c="date" value="${esc(row.date)}"></td>
        <td><input type="number" data-c="price" value="${esc(row.price)}" style="width:120px"></td>
        <td><input type="number" data-c="sqm" value="${esc(row.sqm)}" style="width:70px"></td>
        <td><input type="number" step="0.5" data-c="rooms" value="${esc(row.rooms)}" style="width:60px"></td>
        <td><input type="number" data-c="floor" value="${esc(row.floor)}" style="width:60px"></td>
        <td><select data-c="cond">${COND_OPTS.map(([v, t]) => `<option value="${v}" ${row.cond === v ? 'selected' : ''}>${t}</option>`).join('')}</select></td>
        <td><input type="number" data-c="adj" value="${esc(row.adj)}" style="width:70px"></td>
        <td>${fmtN(row.ppsqm)}</td>
        <td title="זמן ${fmtPct(row.adj.time)} · קומה ${fmtPct(row.adj.floor)} · מצב ${fmtPct(row.adj.cond)} · מודעה ${fmtPct(row.adj.listing)} · ידני ${fmtPct(row.adj.manual)}"><span class="badge ${row.factor > 1 ? 'ok' : row.factor < 1 ? 'warn' : ''}">${fmtPct(row.factor - 1)}</span></td>
        <td><b>${fmtN(row.adjPpsqm)}</b></td>
        <td><button class="btn ghost sm" data-c="del" title="מחיקה">✕</button></td></tr>`).join('')}
      </tbody></table></div>` : `<div class="note">עדיין אין נכסים להשוואה. ייבאו טבלת עסקאות מ-nadlan.gov.il או הוסיפו עסקאות ידנית. מומלץ 5–10 עסקאות מהשנתיים האחרונות, באותו רחוב / שכונה, בגודל דומה (±20%).</div>`}
    <details style="margin-top:12px"><summary style="cursor:pointer"><b>פרמטרי התאמה</b> <small class="muted">— איך מנרמלים כל עסקה לנכס שלכם</small></summary>
      <div class="fields" style="margin-top:10px">
        <label class="f"><span class="lbl">התאמת זמן</span><select data-p="useIndex"><option value="1" ${c.useIndex ? 'selected' : ''}>לפי מדד הלמ״ס${p.market.series?.length ? '' : ' (טרם נשאב)'}</option><option value="0" ${!c.useIndex ? 'selected' : ''}>לפי שיעור שנתי ידני</option></select></label>
        <label class="f"><span class="lbl">שיעור שינוי שנתי ידני (%)</span><input type="number" step="0.1" data-p="trendAnnual" value="${esc(c.trendAnnual)}"></label>
        <label class="f"><span class="lbl">פער לכל קומה (%)</span><input type="number" step="0.1" data-p="floorStep" value="${esc(c.floorStep)}"></label>
        <label class="f"><span class="lbl">פער מצב נכס (%)</span><input type="number" step="0.5" data-p="condStep" value="${esc(c.condStep)}"></label>
        <label class="f"><span class="lbl">הנחת מו״מ על מודעות פעילות (%)</span><input type="number" step="0.5" data-p="listingDisc" value="${esc(c.listingDisc)}"></label>
        <label class="f"><span class="lbl">משקל מ״ר מרפסת/גג (%)</span><input type="number" data-p="balconyW" value="${esc(c.balconyW)}"></label>
        <label class="f"><span class="lbl">משקל מ״ר גינה (%)</span><input type="number" data-p="gardenW" value="${esc(c.gardenW)}"></label>
        <label class="f"><span class="lbl">מרווח מו״מ במחיר המבוקש (%)</span><input type="number" step="0.5" data-p="margin" value="${esc(c.margin)}"></label>
      </div></details>
  </div>

  <div class="card">
    <h2>4 · הערכת שווי ותמחור</h2>
    ${r.n && !isNaN(r.value) ? `
    <div class="kpis">
      <div class="kpi hl"><small>${R ? 'שכ״ד שוק משוער' : 'שווי שוק משוער'}</small><b>${fmtILS(r.value)}</b></div>
      <div class="kpi"><small>טווח (רבעון תחתון–עליון)</small><b style="font-size:1.05rem">${fmtShort(r.low)} – ${fmtShort(r.high)}</b></div>
      <div class="kpi"><small>₪ למ״ר מותאם (משוקלל)</small><b>${fmtN(r.ppsqmW)}</b></div>
      <div class="kpi"><small>שטח אפקטיבי</small><b>${fmtN(r.effSqm, 1)} מ״ר</b></div>
      <div class="kpi"><small>רמת ביטחון</small><b>${r.confidence}</b><small>${r.nSold} עסקאות · ${r.n - r.nSold} מודעות</small></div>
      ${R && has(q.estValue) ? `<div class="kpi"><small>תשואה ברוטו</small><b>${fmtN(r.value * 12 / num(q.estValue) * 100, 2)}%</b></div>` : ''}
    </div>
    <div class="grid g2" style="margin-top:16px">
      <div><h3>₪ למ״ר מותאם לפי נכס</h3>${Charts.hbars(r.used.map(x => ({ label: (x.address || 'ללא כתובת').slice(0, 26), value: x.adjPpsqm })), { ref: { value: r.ppsqmW, label: 'ממוצע משוקלל' }, labelW: 190 })}</div>
      <div><h3>${unit} מול שטח</h3>${Charts.scatter(r.used.map(x => ({ x: num(x.sqm), y: num(x.price) * x.factor, label: x.address, kind: x.kind })), { subject: { x: num(q.sqm), y: r.value, label: 'הנכס שלנו' }, xLabel: 'מ״ר', fit: true })}<small class="muted">● עסקה · ○ מודעה פעילה · מחירים מותאמים</small></div>
    </div>
    <h3 style="margin-top:18px">אסטרטגיית מחיר</h3>
    <div class="grid g3">
      ${[['competitive', 'תחרותי', 'מושך תנועה גבוהה ומצב של כמה מציעים. מתאים ללוח זמנים דחוף.'], ['market', 'מחיר שוק מומלץ', `שווי השוק + מרווח מו״מ של ${c.margin}%. האיזון הטוב ביותר בין מחיר לזמן.`], ['ambitious', 'שאפתני', 'בודק את גבול השוק. מחייב נקודת בקרה מוקדמת (יום 21–30) ונכונות לעדכון.']]
        .map(([k, t, d]) => `<div class="kpi" style="${k === 'market' ? 'border:2px solid var(--accent)' : ''}"><small>${t}</small><b>${fmtILS(r.tiers[k])}</b><small>${d}</small><button class="btn sm" style="margin-top:8px" data-tier="${r.tiers[k]}">בחירה כמחיר שיווק</button></div>`).join('')}
    </div>
    ${!isNaN(owner) ? `<div class="note ${dom?.kind === 'ok' ? '' : 'warn'}" style="margin-top:14px">ציפיית הבעלים: <b>${fmtILS(owner)}</b> — ${fmtPct(r.ownerGap)} מול שווי השוק. ${dom ? `זמן שיווק צפוי: <b>${dom.days} ימים</b> · ${dom.txt}.` : ''}</div>` : ''}
    <div class="row" style="margin-top:14px"><label class="f" style="max-width:260px"><span class="lbl">מחיר השיווק הסופי (₪)</span><input type="number" id="final-price" value="${esc(c.finalPrice)}" placeholder="${r.listPrice}"></label>
      <div class="muted" style="align-self:end">${!isNaN(finalP) ? `${fmtPct(finalP / r.value - 1)} מול שווי השוק · ${fmtN(finalP / r.effSqm)} ₪ למ״ר` : 'ברירת מחדל: מחיר השוק המומלץ'}</div></div>
    <p class="muted" style="font-size:12.5px;margin-top:12px">הערכת השווי היא ניתוח שוק השוואתי (CMA) לצורכי שיווק ואינה שומת מקרקעין. התוצאה תלויה באיכות העסקאות שנבחרו ובפרמטרי ההתאמה.</p>
    ` : `<div class="note">הזינו שטח לנכס (בשאלון) ולפחות עסקה אחת להשוואה כדי לקבל הערכת שווי.</div>`}
  </div>`;

  bindCMA(p);
}

function bindCMA(p) {
  const v = $('#view'), R = isRent(p);
  v.querySelectorAll('[data-tabgo]').forEach(b => b.onclick = () => go(b.dataset.tabgo));
  $('#cbs-fetch').onclick = () => fetchCbsIndex(p, R ? 'rent' : 'sale');
  $('#copy-addr').onclick = () => copyText([p.q.street, p.q.houseNo, p.q.city].filter(Boolean).join(' '));
  $('#idx-apply').onclick = () => {
    const pts = $('#idx-paste').value.split('\n').map(l => {
      const m = l.match(/(\d{1,2})[-/.](\d{4})\D+([\d.]+)/) || l.match(/(\d{4})[-/.](\d{1,2})\D+([\d.]+)/);
      if (!m) return null;
      const [a, b] = m[1].length === 4 ? [+m[2], +m[1]] : [+m[1], +m[2]];
      return { y: b, m: a, value: +m[3], label: `${HEB_MONTHS[a - 1]} ${String(b).slice(2)}` };
    }).filter(Boolean).sort((x, y) => (x.y * 100 + x.m) - (y.y * 100 + y.m));
    if (pts.length < 2) return toast('לא זוהו לפחות שתי שורות תקינות', 'err');
    Object.assign(p.market, { series: pts, seriesName: 'מדד (הוזן ידנית)', source: 'הוזן ידנית', fetchedAt: Date.now(), lastError: '' });
    touch(); renderCMA();
  };
  const doImport = text => {
    const rows = importComps(text, $('#imp-kind').value);
    if (!rows.length) return toast('לא זוהו שורות עם מחיר ושטח. ודאו שהשורה הראשונה כוללת כותרות.', 'err');
    p.comps.push(...rows); touch(); toast(`יובאו ${rows.length} נכסים ✓`, 'ok'); renderCMA();
  };
  $('#comp-import').onclick = () => doImport($('#comp-paste').value);
  $('#comp-file').onclick = async () => { const [f] = await pickFiles('.csv,.tsv,.txt,.xlsx,.xls', false); if (f) { try { doImport(await fileToText(f)); } catch (e) { toast(e.message, 'err'); } } };
  const addRow = kind => { p.comps.push({ id: uid(), on: true, kind, cond: 'same', address: p.q.street ? `${p.q.street} ` : '', date: kind === 'listing' ? todayISO() : '', price: '', sqm: '', rooms: '', floor: '', adj: '', source: 'ידני' }); touch(); renderCMA(); };
  $('#comp-add').onclick = () => addRow('sold');
  $('#comp-add-l').onclick = () => addRow('listing');
  const clr = $('#comp-clear'); if (clr) clr.onclick = () => { if (confirm('למחוק את כל הנכסים להשוואה?')) { p.comps = []; touch(); renderCMA(); } };
  const rerender = debounce(() => { const a = document.activeElement, sel = a?.dataset?.c, id = a?.closest?.('tr')?.dataset.id; renderCMA(); if (sel && id) { const el = $(`tr[data-id="${id}"] [data-c="${sel}"]`); el?.focus(); } }, 60);
  v.querySelectorAll('tr[data-id]').forEach(tr => {
    const cp = p.comps.find(x => x.id === tr.dataset.id);
    tr.querySelectorAll('[data-c]').forEach(el => {
      const k = el.dataset.c;
      if (k === 'del') { el.onclick = () => { p.comps = p.comps.filter(x => x !== cp); touch(); renderCMA(); }; return; }
      el.addEventListener('input', () => { cp[k] = el.type === 'checkbox' ? el.checked : el.value; touch(); });
      el.addEventListener('change', () => { cp[k] = el.type === 'checkbox' ? el.checked : el.value; touch(); rerender(); });
    });
  });
  v.querySelectorAll('[data-p]').forEach(el => el.addEventListener('change', () => {
    const k = el.dataset.p; p.cma[k] = k === 'useIndex' ? el.value === '1' : (k === 'trendAnnual' ? el.value : num(el.value) || 0); touch(); renderCMA();
  }));
  v.querySelectorAll('[data-m]').forEach(el => el.addEventListener('input', () => { (p.market.manual ||= {})[el.dataset.m] = el.value; touch(); }));
  v.querySelectorAll('[data-tier]').forEach(b => b.onclick = () => { p.cma.finalPrice = b.dataset.tier; touch(); renderCMA(); toast('מחיר השיווק עודכן ✓', 'ok'); });
  const fp = $('#final-price'); if (fp) fp.addEventListener('change', () => { p.cma.finalPrice = fp.value; touch(); renderCMA(); });
}
