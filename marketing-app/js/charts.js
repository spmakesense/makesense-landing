/* Lightweight SVG charts (RTL friendly, print safe) */
'use strict';

const Charts = (() => {
  const theme = o => ({
    text: o.text || 'var(--muted)', grid: o.grid || 'var(--border)',
    color: o.color || 'var(--primary)', accent: o.accent || 'var(--accent)', font: o.font || 12
  });
  const st = (fill, extra = '') => `style="fill:${fill};${extra}"`;
  const niceTicks = (min, max, n = 5) => {
    if (min === max) { min -= 1; max += 1; }
    const span = max - min, step0 = span / n, mag = Math.pow(10, Math.floor(Math.log10(step0)));
    const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= step0) || step0;
    const lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step, out = [];
    for (let v = lo; v <= hi + step / 2; v += step) out.push(+v.toFixed(10));
    return out;
  };
  const shortN = v => Math.abs(v) >= 1e6 ? fmtN(v / 1e6, 1) + 'M' : Math.abs(v) >= 1e4 ? fmtN(v / 1e3, 0) + 'K' : fmtN(v, Math.abs(v) < 10 ? 1 : 0);

  /** points: [{label, value}] in chronological order; rendered left→right (time axis convention) */
  function line(points, o = {}) {
    const t = theme(o), W = o.w || 720, H = o.h || 280, pl = 54, pr = 16, pt = 16, pb = 34;
    const vals = points.map(p => p.value).filter(v => !isNaN(v));
    if (vals.length < 2) return `<div class="note">אין מספיק נתונים להצגת גרף.</div>`;
    const ticks = niceTicks(Math.min(...vals), Math.max(...vals));
    const y0 = ticks[0], y1 = ticks[ticks.length - 1];
    const X = i => pl + (W - pl - pr) * (i / (points.length - 1));
    const Y = v => pt + (H - pt - pb) * (1 - (v - y0) / (y1 - y0));
    let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(o.title || 'גרף')}" style="font-family:Heebo,Arial;direction:ltr">`;
    ticks.forEach(v => { s += `<line x1="${pl}" x2="${W - pr}" y1="${Y(v)}" y2="${Y(v)}" style="stroke:${t.grid}" stroke-width="1"/><text x="${pl - 8}" y="${Y(v) + 4}" text-anchor="end" font-size="${t.font}" ${st(t.text)}>${shortN(v)}</text>`; });
    const every = Math.max(1, Math.ceil(points.length / 8));
    points.forEach((p, i) => { if ((i % every === 0 && points.length - 1 - i >= every * 0.6) || i === points.length - 1) s += `<text x="${X(i)}" y="${H - 10}" text-anchor="middle" font-size="${t.font - 1}" ${st(t.text)}>${esc(p.label)}</text>`; });
    const path = points.map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(p.value).toFixed(1)}`).join('');
    s += `<path d="${path} L${X(points.length - 1)},${Y(y0)} L${X(0)},${Y(y0)} Z" style="fill:${t.color};opacity:.08"/>`;
    s += `<path d="${path}" fill="none" style="stroke:${t.color}" stroke-width="2.5" stroke-linejoin="round"/>`;
    const li = points.length - 1;
    s += `<circle cx="${X(li)}" cy="${Y(points[li].value)}" r="5" ${st(t.accent)} stroke="#fff" stroke-width="2"/>`;
    s += `<text x="${X(li) - 8}" y="${Y(points[li].value) - 10}" text-anchor="end" font-size="${t.font + 1}" font-weight="700" ${st(t.color)}>${shortN(points[li].value)}</text>`;
    return s + '</svg>';
  }

  /** horizontal bars: items [{label, value, hl}] — bars grow right→left (RTL) */
  function hbars(items, o = {}) {
    const t = theme(o), W = o.w || 720, rowH = o.rowH || 30, lw = o.labelW || 200, vw = 70, H = items.length * rowH + 30;
    if (!items.length) return `<div class="note">אין נתונים.</div>`;
    const vals = items.map(i => i.value).filter(v => !isNaN(v)).concat(o.ref && !isNaN(o.ref.value) ? [o.ref.value] : []);
    const lo = Math.min(...vals) * 0.9, hi = Math.max(...vals) * 1.02, ref = o.ref;
    const span = W - lw - vw - 10, X = v => span * clamp((v - lo) / (hi - lo || 1), 0.02, 1);
    let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="font-family:Heebo,Arial;direction:ltr">`;
    items.forEach((it, i) => {
      const y = 8 + i * rowH, w = X(it.value || 0), x0 = W - lw - 10;
      s += `<text x="${W}" y="${y + rowH / 2 + 2}" text-anchor="start" direction="rtl" font-size="${t.font + 1}" ${st(it.hl ? t.color : t.text, it.hl ? 'font-weight:700' : '')}>${esc(it.label)}</text>`;
      s += `<rect x="${x0 - w}" y="${y + 4}" width="${w}" height="${rowH - 10}" rx="5" ${st(it.hl ? t.accent : t.color, it.hl ? '' : 'opacity:.75')}/>`;
      s += `<text x="${x0 - w - 6}" y="${y + rowH / 2 + 3}" text-anchor="end" font-size="${t.font}" ${st(t.text)}>${o.fmt ? o.fmt(it.value) : fmtN(it.value)}</text>`;
    });
    if (ref && !isNaN(ref.value)) {
      const x = W - lw - 10 - X(ref.value);
      s += `<line x1="${x}" x2="${x}" y1="0" y2="${H - 22}" style="stroke:${t.accent}" stroke-width="2" stroke-dasharray="5 4"/><text x="${x}" y="${H - 6}" text-anchor="middle" font-size="${t.font}" font-weight="700" ${st(t.accent)} direction="rtl">${esc(ref.label)}: ${fmtN(ref.value)}</text>`;
    }
    return s + '</svg>';
  }

  /** scatter: points [{x,y,label}], subject {x,y,label} */
  function scatter(points, o = {}) {
    const t = theme(o), W = o.w || 720, H = o.h || 300, pl = 60, pr = 18, pt = 34, pb = 40;
    const all = [...points, ...(o.subject ? [o.subject] : [])].filter(p => !isNaN(p.x) && !isNaN(p.y));
    if (all.length < 2) return `<div class="note">הוסיפו לפחות שתי עסקאות להשוואה כדי לראות את הפיזור.</div>`;
    const xt = niceTicks(Math.min(...all.map(p => p.x)), Math.max(...all.map(p => p.x)), 6);
    const yt = niceTicks(Math.min(...all.map(p => p.y)), Math.max(...all.map(p => p.y)), 5);
    const X = v => pl + (W - pl - pr) * (v - xt[0]) / (xt[xt.length - 1] - xt[0]);
    const Y = v => pt + (H - pt - pb) * (1 - (v - yt[0]) / (yt[yt.length - 1] - yt[0]));
    let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="font-family:Heebo,Arial;direction:ltr">`;
    yt.forEach(v => s += `<line x1="${pl}" x2="${W - pr}" y1="${Y(v)}" y2="${Y(v)}" style="stroke:${t.grid}"/><text x="${pl - 8}" y="${Y(v) + 4}" text-anchor="end" font-size="${t.font}" ${st(t.text)}>${shortN(v)}</text>`);
    xt.forEach(v => s += `<text x="${X(v)}" y="${H - 20}" text-anchor="middle" font-size="${t.font}" ${st(t.text)}>${fmtN(v)}</text>`);
    s += `<text x="${(W + pl) / 2}" y="${H - 3}" text-anchor="middle" font-size="${t.font}" ${st(t.text)}>${esc(o.xLabel || '')}</text>`;
    if (o.fit && points.length >= 2) {
      const n = points.length, mx = mean(points.map(p => p.x)), my = mean(points.map(p => p.y));
      const b = points.reduce((a, p) => a + (p.x - mx) * (p.y - my), 0) / (points.reduce((a, p) => a + (p.x - mx) ** 2, 0) || 1);
      const a0 = my - b * mx, xa = xt[0], xb = xt[xt.length - 1];
      if (n >= 2 && isFinite(b)) s += `<line x1="${X(xa)}" y1="${Y(a0 + b * xa)}" x2="${X(xb)}" y2="${Y(a0 + b * xb)}" style="stroke:${t.color};opacity:.35" stroke-width="2" stroke-dasharray="6 5"/>`;
    }
    points.forEach(p => s += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="6" ${st(p.kind === 'listing' ? 'none' : t.color, p.kind === 'listing' ? `stroke:${t.color};stroke-width:2` : 'opacity:.8')}><title>${esc(p.label || '')}</title></circle>`);
    if (o.subject && !isNaN(o.subject.y)) {
      const sx = X(o.subject.x), sy = Y(o.subject.y);
      s += `<circle cx="${sx}" cy="${sy}" r="9" ${st(t.accent)} stroke="#fff" stroke-width="2.5"/><text x="${sx}" y="${sy - 14}" text-anchor="middle" font-size="${t.font + 1}" font-weight="700" ${st(t.accent)} direction="rtl">${esc(o.subject.label || 'הנכס')}</text>`;
    }
    return s + '</svg>';
  }

  /** illustrative buyer-interest curve vs. days on market */
  function interest(o = {}) {
    const t = theme(o), W = o.w || 720, H = o.h || 260, pl = 40, pr = 16, pt = 34, pb = 36;
    const X = d => pl + (W - pl - pr) * d / 120, Y = v => pt + (H - pt - pb) * (1 - v);
    const f = d => 0.82 * (0.12 + 0.88 * Math.exp(-((d - 10) ** 2) / 260) * (d < 10 ? 0.6 + 0.4 * d / 10 : 1) + (d > 10 ? 0.18 * Math.exp(-d / 60) : 0));
    let path = ''; for (let d = 0; d <= 120; d += 2) path += `${d ? 'L' : 'M'}${X(d).toFixed(1)},${Y(Math.min(1, f(d))).toFixed(1)}`;
    let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="font-family:Heebo,Arial;direction:ltr">`;
    s += `<rect x="${X(0)}" y="${pt}" width="${X(28) - X(0)}" height="${H - pt - pb}" ${st(t.accent, 'opacity:.12')}/>`;
    [0, 30, 60, 90, 120].forEach(d => s += `<text x="${X(d)}" y="${H - 14}" text-anchor="middle" font-size="${t.font}" ${st(t.text)}>יום ${d}</text>`);
    s += `<line x1="${pl}" x2="${W - pr}" y1="${Y(0)}" y2="${Y(0)}" style="stroke:${t.grid}"/>`;
    s += `<path d="${path}" fill="none" style="stroke:${t.color}" stroke-width="3"/>`;
    s += `<text x="${X(14)}" y="${pt - 10}" text-anchor="middle" font-size="${t.font + 1}" font-weight="700" ${st(t.accent)} direction="rtl">חלון הזדמנות: 4 השבועות הראשונים</text>`;
    s += `<text x="${X(88)}" y="${Y(0.32)}" text-anchor="middle" font-size="${t.font}" ${st(t.text)} direction="rtl">נכס ״נשחק״ — פחות פניות, יותר מיקוח</text>`;
    s += `<text x="${pl - 4}" y="${pt + 4}" text-anchor="end" font-size="${t.font - 1}" ${st(t.text)} transform="rotate(-90 ${pl - 24} ${pt + 60})" direction="rtl">עניין קונים</text>`;
    return s + '</svg>';
  }

  /** small donut for budget split */
  function donut(items, o = {}) {
    const W = o.w || 220, r = W / 2 - 10, c = W / 2, tot = items.reduce((a, i) => a + i.value, 0);
    if (!tot) return '';
    let a0 = -Math.PI / 2, s = `<svg viewBox="0 0 ${W} ${W}" width="${W}">`;
    items.forEach(it => {
      const a1 = a0 + 2 * Math.PI * it.value / tot, big = a1 - a0 > Math.PI ? 1 : 0;
      s += `<path d="M${c + r * Math.cos(a0)},${c + r * Math.sin(a0)} A${r},${r} 0 ${big} 1 ${c + r * Math.cos(a1)},${c + r * Math.sin(a1)}" fill="none" stroke="${it.color}" stroke-width="22"/>`;
      a0 = a1;
    });
    return s + `<text x="${c}" y="${c + 6}" text-anchor="middle" font-family="Rubik" font-weight="800" font-size="18" style="fill:${o.text || 'currentColor'}">${fmtShort(tot)}</text></svg>`;
  }

  return { line, hbars, scatter, interest, donut };
})();
