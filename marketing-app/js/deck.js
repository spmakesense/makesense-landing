/* Listing presentation (מצגת מכירה לבעלים): auto-built slides, presenter mode, print to PDF */
'use strict';

const CHANNEL_CARDS = [
  ['📸', 'צילום ווידאו מקצועי', 'סטילס, וידאו סיור, רילס אנכי ותוכנית דירה'],
  ['🌐', 'פורטלים מובילים', 'יד2, מדלן, הומלס — מודעות מודגשות'],
  ['🎯', 'קמפיין ממומן', 'פייסבוק ואינסטגרם, טרגוט גיאוגרפי וריטרגטינג'],
  ['💬', 'וואטסאפ וקהילות', 'קבוצות שכונה, נדל״ן עירוני ומתווכים'],
  ['🤝', 'מאגר קונים ומתווכים', 'פנייה אישית לקונים מתאימים ושיתופי פעולה'],
  ['🚪', 'בתים פתוחים', 'אירועים מתוכננים עם הרשמה מראש ומשוב'],
  ['🪧', 'שלט ופרינט', 'שלט עם QR, פלאיירים לשכנים וחוברת נכס'],
  ['📊', 'דיווח ובקרה', 'דו״ח שבועי ונקודות החלטה מבוססות נתונים'],
];

function slideShell(p, inner, { n, bar = true, foot = true, cls = '' } = {}) {
  const st = S.settings;
  return `<div class="slide ${cls}" style="--sp:${st.primary};--sa:${st.accent}">${bar ? '<div class="s-bar"></div>' : ''}
    <div class="s-pad">${inner}</div>
    ${foot ? `<div class="s-foot"><span>${st.logo ? `<img src="${st.logo}" alt="">` : `<b>${esc(st.agency || st.agentName || '')}</b>`}</span><span>${esc(shortAddr(p.q))}</span><span>${esc([st.agentName, st.phone].filter(Boolean).join(' · '))}${n ? ` · ${n}` : ''}</span></div>` : ''}
  </div>`;
}
const head = (k, t, s) => `<div class="s-kicker">${esc(k)}</div><h2 class="s-title">${esc(t)}</h2>${s ? `<div class="s-sub">${esc(s)}</div>` : ''}`;

async function deckGraphics(p) {
  const out = [];
  for (const cfg of [{ tpl: 'hero', fmt: 'square' }, { tpl: 'specs', fmt: 'story' }, { tpl: 'event', fmt: 'square', headline: 'בית פתוח' }]) {
    const c = document.createElement('canvas');
    try { await renderGraphic(c, p, { ...studioDefaults(p), ...(p.studio || {}), ...cfg, headline: cfg.headline || dealWord(p) }); out.push(c.toDataURL('image/jpeg', 0.82)); } catch { out.push(''); }
  }
  return out;
}

function deckSlides(p, gfx) {
  const q = p.q, R = isRent(p), st = S.settings, r = cmaResult(p), ts = trendStats(p.market.series);
  const PR = st.primary, AC = st.accent, ch = { text: '#5d6475', grid: '#e8eaf2', color: PR, accent: AC, font: 14 };
  const pl = ensurePlan(p), price = askPrice(p), m = p.market.manual || {};
  const hl = String(q.highlights || '').split('\n').filter(Boolean);
  const weak = String(q.weaknesses || '').split('\n').filter(Boolean);
  const cov = coverPhoto(p);
  const S_ = [];

  S_.push({ id: 'cover', t: 'שער', html: n => `<div class="slide" style="--sp:${PR};--sa:${AC}">
    <div style="position:absolute;inset:0;background:${cov ? `url('${cov}') center/cover` : `linear-gradient(120deg,${PR},#000)`}"></div>
    <div style="position:absolute;inset:0;background:linear-gradient(270deg,rgba(8,12,40,.92) 0%,rgba(8,12,40,.75) 45%,rgba(8,12,40,.1) 100%)"></div>
    <div style="position:absolute;top:0;right:0;bottom:0;width:62%;padding:80px 72px;display:flex;flex-direction:column;justify-content:center;color:#fff">
      ${st.logo ? `<img src="${st.logo}" style="height:64px;align-self:flex-start;margin-bottom:auto;background:#fff;border-radius:10px;padding:6px">` : ''}
      <div style="color:${AC};font-weight:800;font-size:22px;letter-spacing:1px">${R ? 'הצעה לשיווק והשכרת הנכס' : 'הצעה לשיווק ומכירת הנכס'}</div>
      <h1 style="color:#fff;font-size:64px;font-weight:900;margin:10px 0 8px">${esc(addrLine(q).split(',')[0])}</h1>
      <div style="font-size:26px;opacity:.85">${esc(addrLine(q).split(',').slice(1).join(',').trim())}</div>
      <div style="font-size:22px;margin-top:22px;opacity:.9">${esc(keyFacts(q).slice(0, 4).join(' · '))}</div>
      <div style="margin-top:auto;font-size:19px;opacity:.85">הוכן עבור: <b>${esc(q.ownerName || 'בעלי הנכס')}</b> · ${fmtDate(todayISO())}<br>${esc([st.agentName, st.agentTitle, st.agency].filter(Boolean).join(' | '))}</div>
    </div></div>` });

  S_.push({ id: 'agent', t: 'מי אנחנו', html: n => slideShell(p, `${head('נעים להכיר', st.agentName || 'שם הסוכן', [st.agentTitle, st.agency].filter(Boolean).join(' · '))}
    <div class="s-body"><div class="s-col" style="flex:1.4"><p style="font-size:21px;line-height:1.6;margin:0">${esc(st.bio || 'ליווי מקצועי ואישי של בעלי נכסים — מתמחור מבוסס נתונים, דרך שיווק ממוקד ועד חתימה על חוזה. אני מאמין/ה בשקיפות מלאה, בדיווח שוטף ובתכנית עבודה ברורה עם יעדים ונקודות בקרה.')}</p>
      <ul class="s-list" style="margin-top:20px"><li>תמחור מבוסס עסקאות אמת ונתוני הלמ״ס</li><li>תכנית שיווק כתובה עם לוח זמנים ותקציב</li><li>דו״ח שבועי ושקיפות מלאה לאורך כל הדרך</li></ul></div>
      <div class="s-col"><div class="s-spec" style="grid-template-columns:1fr 1fr">${[[st.years, 'שנות ניסיון'], [st.deals, 'עסקאות'], [st.license, 'רישיון תיווך'], [st.phone, 'טלפון']].filter(x => x[0]).map(([v, l]) => `<div><small>${l}</small><b>${esc(v)}</b></div>`).join('') || '<div><small>מלאו פרטים בהגדרות</small><b>—</b></div>'}</div></div></div>`, { n }) });

  const specs = [['חדרים', q.rooms], ['שטח בנוי', has(q.sqm) ? q.sqm + ' מ״ר' : ''], ['קומה', floorTxt(q).replace('קומה ', '')], ['מרפסת', num(q.balconySqm) ? q.balconySqm + ' מ״ר' : ''], ['גינה', num(q.gardenSqm) ? q.gardenSqm + ' מ״ר' : ''], ['חניה', num(q.parking) ? q.parking : ''], ['מעלית', q.elevator === 'yes' ? 'יש' : q.elevator === 'no' ? 'אין' : ''], ['ממ״ד', q.mamad === 'yes' ? 'יש' : q.mamad === 'no' ? 'אין' : ''], ['מחסן', q.storage === 'yes' ? 'יש' : ''], ['שנת בנייה', q.buildYear], ['מצב', q.condition], ['כיווני אוויר', (q.airDirections || []).join(', ')]].filter(x => has(x[1])).slice(0, 8);
  S_.push({ id: 'property', t: 'הנכס', html: n => slideShell(p, `${head('הנכס', autoTitle(q) + (q.neighborhood ? ' בשכונת ' + q.neighborhood : ''), addrLine(q))}
    <div class="s-body"><div class="s-col" style="flex:1.5"><div class="s-spec">${specs.map(([l, v]) => `<div><small>${l}</small><b style="font-size:${String(v).length > 8 ? 18 : 26}px">${esc(v)}</b></div>`).join('')}</div>
      ${(q.features || []).length ? `<div style="margin-top:18px;font-size:17px;color:#5d6475">${esc((q.features || []).join(' · '))}</div>` : ''}</div>
      ${cov ? `<div class="s-col" style="background:url('${cov}') center/cover;border-radius:18px"></div>` : ''}</div>`, { n }) });

  S_.push({ id: 'value', t: 'יתרונות וקהל יעד', html: n => slideShell(p, `${head('המיצוב השיווקי', 'למה קונים יבחרו דווקא בנכס הזה', '')}
    <div class="s-body"><div class="s-col"><h3 style="font-size:22px">היתרונות המרכזיים</h3><ul class="s-list">${(hl.length ? hl : featureList(q).slice(0, 4)).slice(0, 5).map(h => `<li>${esc(h)}</li>`).join('')}</ul>
      ${(q.nearby || []).length ? `<h3 style="font-size:22px;margin-top:18px">בסביבה</h3><div style="font-size:18px;color:#5d6475">${esc(q.nearby.join(' · '))}</div>` : ''}</div>
      <div class="s-col"><h3 style="font-size:22px">קהל היעד</h3><div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:20px">${(q.audience || ['משפרי דיור', 'משפחות צעירות']).map(a => `<span style="background:${PR};color:#fff;padding:8px 18px;border-radius:99px;font-size:18px;font-weight:600">${esc(a)}</span>`).join('')}</div>
      ${weak.length ? `<h3 style="font-size:22px">התנגדויות צפויות — והמענה שלנו</h3><div class="s-card" style="font-size:17px;line-height:1.6">${weak.slice(0, 4).map(w => `<div>• ${esc(w)}</div>`).join('')}</div>` : ''}</div></div>`, { n }) });

  if (p.photos.length >= 2) S_.push({ id: 'gallery', t: 'גלריה', html: n => { const ph = p.photos.slice(0, 6); const cols = ph.length <= 2 ? 2 : 3; return slideShell(p, `${head('גלריה', 'הנכס בתמונות', '')}<div class="gal" style="grid-template-columns:repeat(${cols},1fr);grid-template-rows:repeat(${Math.ceil(ph.length / cols)},1fr)">${ph.map(s => `<div style="background-image:url('${s}')"></div>`).join('')}</div>`, { n }); } });

  S_.push({ id: 'market', t: 'מגמות שוק', html: n => slideShell(p, `${head('נתוני שוק', R ? 'מגמות בשוק השכירות' : 'מגמות מחירי הדירות', p.market.seriesName ? `${p.market.seriesName} · מקור: ${p.market.source || 'הלמ״ס'}` : 'נתוני הלמ״ס ונתוני האזור')}
    <div class="s-body"><div class="s-col" style="flex:1.7">${p.market.series?.length ? Charts.line(p.market.series, { ...ch, w: 760, h: 400 }) : '<div class="s-card" style="font-size:20px">שאבו את מדד מחירי הדירות מהלמ״ס בלשונית ״שוק ו-CMA״ כדי להציג כאן את המגמה.</div>'}</div>
      <div class="s-col"><div class="s-spec" style="grid-template-columns:1fr">
        ${[[fmtPct(ts.yoy), 'שינוי שנתי במדד'], [fmtPct(ts.y3), 'שינוי ב-3 שנים'], [m.cityAvg ? fmtShort(num(m.cityAvg)) : '', R ? 'שכ״ד ממוצע בעיר' : 'מחיר ממוצע לדירה בעיר'], [m.cityPpsqm ? fmtN(num(m.cityPpsqm)) + ' ₪' : '', 'מחיר ממוצע למ״ר באזור'], [m.dom ? m.dom + ' ימים' : '', 'זמן שיווק ממוצע'], [m.inventory, 'נכסים מתחרים כעת'], [m.mortgageRate ? m.mortgageRate + '%' : '', 'ריבית משכנתא ממוצעת']].filter(x => x[0] && x[0] !== '—').slice(0, 4).map(([v, l]) => `<div><small>${l}</small><b>${esc(v)}</b></div>`).join('')}
      </div>${m.source ? `<div style="font-size:13px;color:#5d6475;margin-top:8px">מקור נתוני אזור: ${esc(m.source)}</div>` : ''}</div></div>`, { n }) });

  const used = (r.used || []).slice().sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 10);
  if (used.length) {
    S_.push({ id: 'comps', t: 'עסקאות להשוואה', html: n => slideShell(p, `${head('ניתוח שוק השוואתי (CMA)', R ? 'שכירויות ונכסים מוצעים באזור' : 'עסקאות ונכסים מוצעים באזור', `${r.nSold} עסקאות שבוצעו · ${r.n - r.nSold} נכסים מוצעים · מקורות: nadlan.gov.il, פורטלים, מאגר המשרד`)}
      <table><thead><tr><th>כתובת</th><th>סטטוס</th><th>תאריך</th><th>${R ? 'שכ״ד' : 'מחיר'}</th><th>מ״ר</th><th>חד׳</th><th>קומה</th><th>₪/מ״ר</th><th>₪/מ״ר מותאם*</th></tr></thead>
      <tbody>${used.map(c => `<tr><td>${esc(c.address)}</td><td>${c.kind === 'listing' ? 'מוצע' : R ? 'הושכר' : 'נמכר'}</td><td>${fmtDate(c.date)}</td><td>${fmtN(num(c.price))}</td><td>${fmtN(num(c.sqm))}</td><td>${fmtN(num(c.rooms), 1)}</td><td>${has(c.floor) ? c.floor : '—'}</td><td>${fmtN(c.ppsqm)}</td><td><b>${fmtN(c.adjPpsqm)}</b></td></tr>`).join('')}</tbody></table>
      <div style="font-size:13px;color:#5d6475;margin-top:10px">* מותאם לזמן (לפי מדד הלמ״ס), קומה, מצב הנכס והנחת מו״מ על מודעות פעילות.</div>`, { n }) });
    S_.push({ id: 'cma', t: 'הערכת שווי', html: n => slideShell(p, `${head('הערכת שווי', R ? 'שכ״ד שוק משוער' : 'שווי שוק משוער לנכס', '')}
      <div class="s-body"><div class="s-col" style="flex:1.5">${Charts.hbars(r.used.slice(0, 10).map(x => ({ label: (x.address || '').slice(0, 24), value: x.adjPpsqm })), { ...ch, w: 720, rowH: 38, labelW: 230, ref: { value: r.ppsqmW, label: 'ממוצע משוקלל' } })}</div>
        <div class="s-col"><div class="s-card" style="text-align:center;padding:26px"><div style="font-size:18px;color:#5d6475">${R ? 'שכ״ד שוק משוער' : 'שווי שוק משוער'}</div><div class="s-big">${fmtILS(r.value)}</div><div style="font-size:17px;color:#5d6475;margin-top:6px">טווח: ${fmtShort(r.low)} – ${fmtShort(r.high)}</div></div>
        <div class="s-spec" style="grid-template-columns:1fr 1fr;margin-top:14px"><div><small>₪ למ״ר מותאם</small><b>${fmtN(r.ppsqmW)}</b></div><div><small>שטח אפקטיבי</small><b>${fmtN(r.effSqm, 0)} מ״ר</b></div><div><small>נכסים בניתוח</small><b>${r.n}</b></div><div><small>רמת ביטחון</small><b>${r.confidence}</b></div></div></div></div>`, { n }) });
    if (r.tiers) S_.push({ id: 'pricing', t: 'אסטרטגיית מחיר', html: n => { const gap = r.ownerGap, dom = domEstimate(gap); const owner = num(R ? q.ownerRent : q.ownerPrice); return slideShell(p, `${head('אסטרטגיית תמחור', 'מחיר נכון = יותר קונים, יותר הצעות, מחיר סופי גבוה יותר', '')}
      <div style="display:flex;gap:20px">${[['competitive', 'תחרותי', 'תנועה מקסימלית, פוטנציאל לכמה מציעים'], ['market', 'מחיר שוק מומלץ', 'האיזון הנכון בין מחיר לזמן'], ['ambitious', 'שאפתני', 'בדיקת גבול השוק — דורש בקרה מוקדמת']].map(([k, t, d]) => `<div class="tier ${k === 'market' ? 'rec' : ''}"><div style="font-size:19px;font-weight:700">${t}${k === 'market' ? ' ⭐' : ''}</div><b>${fmtILS(r.tiers[k])}</b><div style="font-size:16px;color:#5d6475">${d}</div></div>`).join('')}</div>
      <div class="s-card" style="margin-top:22px;font-size:20px;display:flex;justify-content:space-between;gap:20px"><div>מחיר השיווק המוצע: <b style="color:${PR};font-size:28px">${fmtILS(price)}</b></div>${!isNaN(owner) ? `<div>ציפיית הבעלים: <b>${fmtILS(owner)}</b> (${fmtPct(gap)} מהשווי)${dom ? ` · זמן שיווק צפוי: <b>${dom.days} ימים</b>` : ''}</div>` : ''}</div>`, { n }); } });
  }

  S_.push({ id: 'why', t: 'למה תמחור נכון קריטי', html: n => slideShell(p, `${head('תובנה', 'החודש הראשון בשוק הוא החשוב ביותר', 'קונים פעילים עוקבים אחרי כל נכס חדש. העניין בשיאו בשבועות הראשונים — ואחר כך יורד.')}
    <div class="s-body"><div class="s-col" style="flex:1.6">${Charts.interest({ ...ch, w: 760, h: 380 })}<div style="font-size:12px;color:#5d6475">המחשה עקרונית של דפוס העניין בנכס חדש בשוק</div></div>
    <div class="s-col"><ul class="s-list" style="font-size:18px"><li>נכס שמתומחר נכון מההתחלה מושך יותר ביקורים והצעות מקבילות</li><li>נכס ש״יושב״ בשוק נתפס כבעייתי — והקונים מצפים להנחה גדולה יותר</li><li>הורדת מחיר מאוחרת מובילה בדרך כלל למחיר סופי נמוך יותר מתמחור נכון מראש</li><li>לכן התכנית כוללת נקודות בקרה קבועות מראש וכללי החלטה ברורים</li></ul></div></div>`, { n }) });

  S_.push({ id: 'channels', t: 'ערוצי שיווק', html: n => slideShell(p, `${head('ערוצי השיווק', 'חשיפה מקסימלית לקונים הנכונים', '')}<div class="chan">${CHANNEL_CARDS.filter(([, t]) => !(t === 'שלט ופרינט' && q.discreet === 'yes') && !(t === 'בתים פתוחים' && q.openHouse === 'no')).map(([i, t, d]) => `<div><i>${i}</i><b>${t}</b>${d}</div>`).join('')}</div>`, { n }) });

  if (gfx?.some(Boolean)) S_.push({ id: 'graphics', t: 'דוגמאות גרפיקה', html: n => slideShell(p, `${head('חומרי שיווק', 'כך הנכס ייראה ברשתות ובוואטסאפ', 'גרפיקות שהוכנו במיוחד לנכס — פוסט, סטורי והזמנה לבית פתוח')}
    <div style="display:flex;gap:26px;justify-content:center;align-items:flex-start;flex:1;min-height:0">${gfx.map((g, i) => g ? `<img src="${g}" style="height:${i === 1 ? 440 : 400}px;border-radius:12px;box-shadow:0 12px 30px rgba(0,0,0,.18)">` : '').join('')}</div>`, { n }) });

  S_.push({ id: 'plan', t: 'תכנית השיווק', html: n => slideShell(p, `${head('תכנית העבודה', `תכנית שיווק ל-${pl.days} ימים`, `התחלה ${fmtDate(pl.start)} · ${pl.events.length} משימות ואירועים · ${pl.events.filter(e => e.cat === 'review').length} נקודות בקרה`)}
    <div style="display:flex;gap:10px;flex:1;min-height:0">${pl.phases.map((ph, i) => `<div style="flex:${Math.max(ph.to - ph.from + 1, pl.days / 9)};background:#f6f7fb;border-radius:14px;overflow:hidden;display:flex;flex-direction:column">
      <div style="background:hsl(${232 - i * 22} 70% ${42 + i * 3}%);color:#fff;padding:10px 12px"><div style="font-size:13px;opacity:.85">ימים ${ph.from}–${ph.to}</div><b style="font-size:16px;line-height:1.25;display:block">${esc(ph.t)}</b></div>
      <div style="padding:10px 12px;font-size:13px;line-height:1.45;color:#333">${pl.events.filter(e => !e.rec && phaseOf(pl, e.day) === i).slice(0, 6).map(e => `<div style="margin-bottom:5px">• ${esc(e.title)}</div>`).join('')}</div></div>`).join('')}</div>`, { n }) });

  const milestones = pl.events.filter(e => ['event', 'review'].includes(e.cat) || /השקה|עלייה לאוויר/.test(e.title)).slice(0, 11);
  S_.push({ id: 'milestones', t: 'אירועים ונקודות בקרה', html: n => slideShell(p, `${head('לוח אירועים', 'אירועים מרכזיים ונקודות החלטה', '')}
    <div class="s-body"><div class="s-col" style="flex:1.6"><table><thead><tr><th>יום</th><th>תאריך</th><th>אירוע</th></tr></thead><tbody>${milestones.map(e => `<tr><td><b>${e.day}</b></td><td>${fmtDate(addDays(pl.start, e.day - 1))}</td><td>${esc(e.title)}</td></tr>`).join('')}</tbody></table></div>
    <div class="s-col"><div class="s-card"><h3 style="font-size:20px;margin-top:0">כללי החלטה מוסכמים</h3><ul class="s-list" style="font-size:16px"><li>פחות מ-4 ביקורים בשבוע ב-3 השבועות הראשונים ← בחינת מחיר</li><li>10 ביקורים ללא הצעה ← רענון מסר / עדכון מחיר 2–3%</li><li>משוב חוזר על אותה חולשה ← מענה ממוקד (שיפוץ קל, גמישות, הצגה מחדש)</li></ul></div></div></div>`, { n }) });

  const cost = pl.events.reduce((a, e) => a + (num(e.cost) || 0), 0);
  S_.push({ id: 'reporting', t: 'דיווח ושקיפות', html: n => slideShell(p, `${head('שקיפות מלאה', 'איך תדעו בכל רגע מה קורה עם הנכס', '')}
    <div class="s-body"><div class="s-col"><ul class="s-list"><li>דו״ח שבועי בוואטסאפ: חשיפות, פניות, ביקורים ומשוב</li><li>פגישת אסטרטגיה בכל נקודת בקרה</li><li>עדכון מיידי על כל הצעה שמתקבלת</li><li>עדכוני שוק: עסקאות חדשות ונכסים מתחרים</li></ul></div>
    <div class="s-col"><div class="s-spec" style="grid-template-columns:1fr 1fr"><div><small>דו״חות שבועיים</small><b>${pl.events.filter(e => e.cat === 'report').length}</b></div><div><small>נקודות בקרה</small><b>${pl.events.filter(e => e.cat === 'review').length}</b></div><div><small>בתים פתוחים / ימי ביקורים</small><b>${pl.events.filter(e => e.cat === 'event').length}</b></div><div><small>השקעה שיווקית מתוכננת</small><b style="font-size:22px">${fmtILS(cost)}</b></div></div></div></div>`, { n }) });

  if (R) S_.push({ id: 'tenant', t: 'סינון שוכרים', html: n => slideShell(p, `${head('שוכר איכותי', 'תהליך סינון ובחירת שוכר', '')}<div class="chan">${[['🧾', 'בדיקת יכולת', 'תלושי שכר / אישור רו״ח, יחס שכ״ד להכנסה'], ['📞', 'המלצות', 'שיחה עם משכיר קודם'], ['🔍', 'בדיקת אשראי', 'BDI / נתוני אשראי בהסכמה'], ['🛡', 'ביטחונות', 'ערבות בנקאית, ערבים, צ׳קים'], ['📝', 'חוזה מוגן', 'נספח ציוד, אופציה, הצמדה'], ['📷', 'פרוטוקול מסירה', 'תיעוד מצב הדירה בתמונות'], ['🔑', 'מסירה', 'מסירת מפתחות והעברת חשבונות'], ['🤝', 'ליווי', 'זמינות לאורך תקופת השכירות']].map(([i, t, d]) => `<div><i>${i}</i><b>${t}</b>${d}</div>`).join('')}</div>`, { n }) });

  S_.push({ id: 'next', t: 'השלבים הבאים', html: n => slideShell(p, `${head('יוצאים לדרך', 'השלבים הבאים', '')}
    <div class="s-body"><div class="s-col" style="flex:1.3">${[['חתימה על הסכם שיווק', q.exclusive === 'yes' ? `בלעדיות ל-${q.exclusiveMonths || 6} חודשים` : 'הגדרת תנאי העבודה'], ['איסוף מסמכים', 'נסח טאבו, תוכניות, היתרים'], ['הכנת הנכס וצילום', 'תוך 7 ימים מהחתימה'], ['השקה', `עלייה לאוויר ב-${fmtDate(addDays(pl.start, (pl.events.find(e => /עלייה לאוויר/.test(e.title))?.day || 11) - 1))}`]].map(([t, d], i) => `<div style="display:flex;gap:16px;align-items:center;margin-bottom:16px"><div style="flex:0 0 52px;height:52px;border-radius:50%;background:${PR};color:#fff;display:grid;place-items:center;font:900 24px Rubik">${i + 1}</div><div><b style="font-size:21px">${t}</b><div style="color:#5d6475;font-size:16px">${esc(d)}</div></div></div>`).join('')}</div>
    <div class="s-col"><div class="s-card" style="font-size:18px;line-height:1.8"><b style="font-size:20px">תנאי ההתקשרות</b><br>עמלה: ${esc(q.commission || st.fee || '—')}<br>${q.exclusive === 'yes' ? `בלעדיות: ${esc(q.exclusiveMonths || 6)} חודשים<br>` : ''}${has(q.budget) ? `תקציב שיווק: ${fmtILS(num(q.budget))}<br>` : ''}מחיר שיווק: ${fmtILS(price)}</div>
      <div style="display:flex;gap:30px;margin-top:40px;font-size:15px;color:#5d6475"><div style="flex:1;border-top:2px solid #141414;padding-top:6px">חתימת הבעלים</div><div style="flex:1;border-top:2px solid #141414;padding-top:6px">חתימת המתווך</div></div></div></div>`, { n }) });

  S_.push({ id: 'thanks', t: 'תודה', html: n => `<div class="slide" style="--sp:${PR};--sa:${AC};background:linear-gradient(120deg,${PR},${shade(PR, -0.45)});color:#fff">
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:14px">
      ${st.logo ? `<img src="${st.logo}" style="height:90px;background:#fff;border-radius:14px;padding:8px">` : ''}
      <h1 style="color:#fff;font-size:72px;font-weight:900;margin:0">תודה!</h1>
      <div style="font-size:26px;opacity:.9">בואו נמכור את הנכס שלכם — במחיר הנכון ובזמן הנכון</div>
      <div style="font-size:28px;font-weight:800;color:${AC};margin-top:16px">${esc([st.agentName, st.phone].filter(Boolean).join(' · '))}</div>
      <div style="font-size:20px;opacity:.85">${esc([st.email, st.website].filter(Boolean).join(' · '))}</div></div></div>` });

  return S_;
}

let deckIdx = 0, deckCache = null;
async function buildDeck(p) {
  const gfx = await deckGraphics(p);
  const all = deckSlides(p, gfx);
  const on = all.filter(s => !(p.deck?.off || []).includes(s.id));
  return { all, on, html: on.map((s, i) => s.html(`${i + 1}/${on.length}`)) };
}

async function renderDeck() {
  const p = P(); p.deck ||= { off: [] };
  $('#view').innerHTML = `<div class="card-head"><div><h1>מצגת לבעלי הנכס</h1><div class="muted">מצגת מכירה מלאה שנבנית אוטומטית מהשאלון, ה-CMA, התכנית והגרפיקות</div></div>
    <div class="row"><button class="btn" id="dk-refresh">↻ רענון</button><button class="btn" id="dk-print">🖨 הדפסה / שמירה כ-PDF</button><button class="btn primary" id="dk-present">▶ הצגה במסך מלא</button></div></div>
    <div class="deck-wrap"><div class="card slide-list" id="dk-list">טוען…</div><div><div class="stage" id="dk-stage"></div>
    <div class="row between" style="margin-top:10px"><button class="btn" id="dk-prev">→ הקודמת</button><span id="dk-num" class="muted"></span><button class="btn" id="dk-next">הבאה ←</button></div>
    <div class="note" style="margin-top:10px">להפקת PDF: ״הדפסה / שמירה כ-PDF״ ← יעד: ״שמירה כ-PDF״. מומלץ Chrome, ללא שוליים, עם ״גרפיקות רקע״ מסומן.</div></div></div>`;
  deckCache = await buildDeck(p);
  const { all, on, html } = deckCache;
  deckIdx = clamp(deckIdx, 0, on.length - 1);
  $('#dk-list').innerHTML = all.map(s => { const i = on.indexOf(s); return `<label class="${i === deckIdx ? 'on' : ''}" data-sid="${s.id}"><input type="checkbox" ${i >= 0 ? 'checked' : ''}> <span>${i >= 0 ? i + 1 + '. ' : ''}${esc(s.t)}</span></label>`; }).join('');
  const show = () => {
    const stg = $('#dk-stage'); if (!stg) return;
    stg.innerHTML = html[deckIdx] || '';
    const sl = stg.firstElementChild; if (sl) sl.style.transform = `scale(${stg.clientWidth / 1280})`;
    $('#dk-num').textContent = `${deckIdx + 1} / ${on.length}`;
    $$('#dk-list label').forEach(l => l.classList.toggle('on', on.indexOf(all.find(s => s.id === l.dataset.sid)) === deckIdx));
  };
  show();
  new ResizeObserver(show).observe($('#dk-stage'));
  $$('#dk-list label').forEach(l => {
    const s = all.find(x => x.id === l.dataset.sid), cb = l.querySelector('input');
    cb.onchange = () => { const off = p.deck.off; cb.checked ? off.splice(off.indexOf(s.id), 1) : off.push(s.id); touch(); renderDeck(); };
    l.querySelector('span').onclick = e => { e.preventDefault(); const i = on.indexOf(s); if (i >= 0) { deckIdx = i; show(); } };
  });
  $('#dk-prev').onclick = () => { deckIdx = Math.max(0, deckIdx - 1); show(); };
  $('#dk-next').onclick = () => { deckIdx = Math.min(on.length - 1, deckIdx + 1); show(); };
  $('#dk-refresh').onclick = () => renderDeck();
  $('#dk-print').onclick = () => { $('#print-deck').innerHTML = html.join(''); setTimeout(() => window.print(), 300); };
  $('#dk-present').onclick = () => present(html, deckIdx);
}

function present(html, start = 0) {
  const el = $('#presenter'); let i = start;
  el.hidden = false;
  const draw = () => {
    el.innerHTML = html[i] + `<div class="pctl"><button data-a="next">‹ הבאה</button><span style="color:#fff;padding:6px">${i + 1}/${html.length}</span><button data-a="prev">הקודמת ›</button><button data-a="close">✕ סגירה</button></div>`;
    const sl = el.querySelector('.slide'), k = Math.min(innerWidth / 1280, innerHeight / 720);
    sl.style.transform = `translate(-50%,-50%) scale(${k})`;
    el.querySelectorAll('[data-a]').forEach(b => b.onclick = e => { e.stopPropagation(); act(b.dataset.a); });
  };
  const act = a => { if (a === 'next') i = Math.min(html.length - 1, i + 1); else if (a === 'prev') i = Math.max(0, i - 1); else return close(); draw(); };
  const key = e => { if (['ArrowLeft', ' ', 'PageDown'].includes(e.key)) act('next'); else if (['ArrowRight', 'PageUp'].includes(e.key)) act('prev'); else if (e.key === 'Escape') close(); };
  const close = () => { el.hidden = true; el.innerHTML = ''; removeEventListener('keydown', key); removeEventListener('resize', draw); if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); };
  el.onclick = () => act('next');
  addEventListener('keydown', key); addEventListener('resize', draw);
  el.requestFullscreen?.().catch(() => {});
  draw();
}
