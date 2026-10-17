/* App shell: routing, dashboard, settings, backup */
'use strict';

let curTab = 'dashboard';
const RENDER = {
  dashboard: renderDashboard, questionnaire: renderQuestionnaire, cma: renderCMA, plan: renderPlan,
  studio: renderStudio, content: renderContent, deck: renderDeck, settings: renderSettings,
};

function go(tab) {
  if ($(`.tabs [data-tab="${tab}"]`)?.dataset.need && !P()) tab = 'dashboard';
  curTab = tab;
  try { history.replaceState(null, '', '#' + tab); } catch { /* sandboxed */ }
  $$('.tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  updateHeader();
  RENDER[tab]();
  scrollTo(0, 0);
}
function updateHeader() {
  const p = P();
  $('#project-name').textContent = p ? shortAddr(p.q) : 'כל הנכסים';
  $$('.tabs [data-need]').forEach(b => b.disabled = !p);
}

function projectStatus(p) {
  const pr = qProgress(p).total, r = cmaResult(p);
  return [
    ['שאלון', pr >= 0.8, `${Math.round(pr * 100)}%`],
    ['CMA', r.n >= 3 && !isNaN(r.value), `${r.n} נכסים`],
    ['תכנית', !!p.plan, p.plan ? `${p.plan.days} ימים` : '—'],
    ['תמונות', p.photos.length > 0, `${p.photos.length}`],
  ];
}

function renderDashboard() {
  const list = S.projects;
  $('#view').innerHTML = `
  <div class="card hero">
    <h1 style="color:#fff">מכינים מצגת שיווק מנצחת לבעלי הנכס</h1>
    <p>מילוי שאלון על הנכס ← ניתוח שוק ועסקאות (CMA) עם נתוני הלמ״ס ← תכנית שיווק עד 180 יום ← גרפיקות, פוסטים והודעות וואטסאפ ← מצגת מכירה מוכנה להצגה ול-PDF.</p>
    <div class="row" style="margin-top:12px"><button class="btn accent" id="new-sale">＋ נכס חדש למכירה</button><button class="btn" id="new-rent" style="background:rgba(255,255,255,.12);color:#fff;border-color:rgba(255,255,255,.3)">＋ נכס חדש להשכרה</button><button class="btn ghost" id="demo" style="color:#fff">טעינת נכס לדוגמה</button></div>
    <div class="steps-mini">${[['1. שאלון', 'כל פרטי הנכס, הבעלים והמטרות'], ['2. שוק ו-CMA', 'מדד הלמ״ס + עסקאות להשוואה'], ['3. תכנית שיווק', 'שלבים, אירועים ותקציב'], ['4. גרפיקות ותוכן', 'פוסטים, סטורי ווואטסאפ'], ['5. מצגת', 'מוכנה להצגה ולהדפסה']].map(([a, b]) => `<div><b>${a}</b>${b}</div>`).join('')}</div>
  </div>
  ${list.length ? `<h2>הנכסים שלי (${list.length})</h2><div class="proj-grid">${list.map(p => { const cv = coverPhoto(p); return `<div class="card proj" data-open="${p.id}">
    <div class="ph" style="${cv ? `background-image:url('${cv}')` : ''}">${cv ? '' : '🏠'}</div>
    <div class="bd"><div class="row between"><b>${esc(shortAddr(p.q))}</b><span class="badge">${isRent(p) ? 'השכרה' : 'מכירה'}</span></div>
      <small>${esc([p.q.ownerName, keyFacts(p.q).slice(0, 2).join(' · ')].filter(Boolean).join(' · ') || 'טרם מולא')}</small>
      <div class="row" style="margin-top:8px;gap:4px">${projectStatus(p).map(([t, ok, v]) => `<span class="badge ${ok ? 'ok' : ''}">${t}: ${v}</span>`).join('')}</div>
      <div class="row" style="margin-top:10px"><button class="btn sm" data-dup="${p.id}">שכפול</button><button class="btn sm danger" data-rm="${p.id}">מחיקה</button><small class="muted" style="margin-inline-start:auto">עודכן ${fmtDate(new Date(p.updatedAt).toISOString())}</small></div></div></div>`; }).join('')}</div>`
    : `<div class="card"><h2>אין עדיין נכסים</h2><p class="muted">התחילו נכס חדש, או טענו נכס לדוגמה כדי לראות איך נראית מצגת מלאה.</p></div>`}`;
  $('#new-sale').onclick = () => { newProject('sale'); qStep = 'deal'; go('questionnaire'); };
  $('#new-rent').onclick = () => { newProject('rent'); qStep = 'deal'; go('questionnaire'); };
  $('#demo').onclick = () => { loadDemo(); go('cma'); };
  $$('[data-open]').forEach(c => c.onclick = e => { if (e.target.closest('button')) return; S.currentId = c.dataset.open; saveNow(); go('questionnaire'); });
  $$('[data-dup]').forEach(b => b.onclick = () => { const src = S.projects.find(p => p.id === b.dataset.dup); const cp = JSON.parse(JSON.stringify(src)); cp.id = uid(); cp.createdAt = cp.updatedAt = Date.now(); cp.q.street = (cp.q.street || '') + ' (עותק)'; S.projects.unshift(cp); saveNow(); renderDashboard(); });
  $$('[data-rm]').forEach(b => b.onclick = () => { if (!confirm('למחוק את הנכס וכל הנתונים שלו?')) return; S.projects = S.projects.filter(p => p.id !== b.dataset.rm); if (S.currentId === b.dataset.rm) S.currentId = null; saveNow(); updateHeader(); renderDashboard(); });
}

function renderSettings() {
  const st = S.settings;
  const F = (k, l, t = 'text', ph = '') => `<label class="f"><span class="lbl">${l}</span><input type="${t}" data-st="${k}" value="${esc(st[k])}" placeholder="${esc(ph)}"></label>`;
  $('#view').innerHTML = `<h1>הגדרות</h1>
  <div class="grid g2">
    <div class="card"><h2>פרופיל הסוכן / המשרד</h2><p class="muted">מופיע בגרפיקות, בהודעות ובמצגת.</p>
      <div class="fields">${F('agentName', 'שם מלא')}${F('agentTitle', 'תפקיד')}${F('agency', 'שם המשרד')}${F('phone', 'טלפון', 'tel')}${F('email', 'אימייל', 'email')}${F('website', 'אתר / קישור')}${F('license', 'מספר רישיון תיווך')}${F('years', 'שנות ניסיון', 'number')}${F('deals', 'מספר עסקאות', 'text', '120+')}${F('fee', 'עמלה ברירת מחדל')}
        <label class="f wide"><span class="lbl">על עצמי (לשקף ״מי אנחנו״ במצגת)</span><textarea data-st="bio" rows="3">${esc(st.bio)}</textarea></label></div></div>
    <div class="card"><h2>מיתוג</h2>
      <div class="row" style="gap:16px;align-items:flex-end">
        <div><small>לוגו</small><div class="drop" id="logo-drop" style="width:160px;height:90px;padding:6px;display:grid;place-items:center">${st.logo ? `<img src="${st.logo}" style="max-width:100%;max-height:76px">` : 'העלאת לוגו'}</div>${st.logo ? '<button class="btn sm ghost danger" id="logo-rm">הסרה</button>' : ''}</div>
        <label class="f"><span class="lbl">צבע ראשי</span><input type="color" data-st="primary" value="${esc(st.primary)}"></label>
        <label class="f"><span class="lbl">צבע הדגשה</span><input type="color" data-st="accent" value="${esc(st.accent)}"></label>
        <label class="f"><span class="lbl">ערכת תצוגה</span><select data-st="theme">${[['auto', 'אוטומטי'], ['light', 'בהיר'], ['dark', 'כהה']].map(([v, t]) => `<option value="${v}" ${st.theme === v ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
      </div>
      <h2 style="margin-top:22px">מקורות נתונים</h2>
      <div class="fields">${F('cbsSaleCode', 'קוד סדרה — מדד מחירי דירות (למ״ס)', 'text', '40010')}${F('cbsRentCode', 'קוד סדרה — מדד שכר דירה (למ״ס)', 'text', 'קוד מאתר הלמ״ס')}
        <label class="f wide"><span class="lbl">כתובת פרוקסי (אופציונלי)</span><input data-st="proxyUrl" value="${esc(st.proxyUrl)}" placeholder="https://my-proxy.example.com/?url={url}"></label></div>
      <div class="note" style="margin-top:10px">הנתונים נשאבים מ-API המדדים הציבורי של הלמ״ס (api.cbs.gov.il). אם הדפדפן חוסם גישה ישירה, הריצו את <code>node server.js</code> מתיקיית האפליקציה — השרת מגיש את האפליקציה ומשמש כפרוקסי מאובטח למקורות הממשלתיים. את קודי הסדרות ניתן למצוא באתר הלמ״ס תחת ״מחשבון ומדדים״.</div>
    </div>
  </div>
  <div class="card"><h2>גיבוי ושחזור</h2><p class="muted">כל הנתונים נשמרים בדפדפן הזה בלבד. ייצאו גיבוי כדי להעביר למחשב אחר או לשמור עותק.</p>
    <div class="row"><button class="btn primary" id="bk-exp">⤓ ייצוא גיבוי (JSON)</button><button class="btn" id="bk-imp">⤒ שחזור מגיבוי</button><button class="btn danger" id="bk-wipe">מחיקת כל הנתונים</button></div></div>`;
  $$('[data-st]').forEach(el => el.addEventListener('input', () => { st[el.dataset.st] = el.value; save(); if (['primary', 'accent', 'theme'].includes(el.dataset.st)) applyBrand(); }));
  $('#logo-drop').onclick = async () => { const [f] = await pickFiles('image/*', false); if (!f) return; st.logo = f.type === 'image/svg+xml' ? await fileToDataURL(f) : await compressImage(f, 600, 0.9); saveNow(); renderSettings(); };
  const rm = $('#logo-rm'); if (rm) rm.onclick = () => { st.logo = ''; saveNow(); renderSettings(); };
  $('#bk-exp').onclick = () => download(`nadlan-studio-backup-${todayISO()}.json`, JSON.stringify(S), 'application/json');
  $('#bk-imp').onclick = async () => {
    const [f] = await pickFiles('.json,application/json', false); if (!f) return;
    try { const d = JSON.parse(await f.text()); if (!Array.isArray(d.projects)) throw 0; if (!confirm(`לשחזר ${d.projects.length} נכסים? הנתונים הנוכחיים יוחלפו.`)) return; S = { ...S, ...d, settings: { ...DEFAULT_SETTINGS, ...d.settings } }; saveNow(); applyBrand(); go('dashboard'); toast('הגיבוי שוחזר ✓', 'ok'); }
    catch { toast('קובץ גיבוי לא תקין', 'err'); }
  };
  $('#bk-wipe').onclick = () => { if (confirm('למחוק את כל הנכסים וההגדרות? לא ניתן לבטל.')) { S = { settings: { ...DEFAULT_SETTINGS }, projects: [], currentId: null }; saveNow(); applyBrand(); go('dashboard'); } };
}

/* Demo property — clearly marked sample data for exploring the app */
function loadDemo() {
  const p = newProject('sale');
  Object.assign(p.q, {
    ownerName: 'משפחת כהן (דוגמה)', ownerPhone: '050-0000000', motivation: 'שדרוג דיור', urgency: 'עד 6 חודשים', ownerPrice: 3150000, minPrice: 2900000,
    entryFlex: 'גמיש', exclusive: 'yes', exclusiveMonths: 6, city: 'רמת גן', neighborhood: 'הבורסה (דוגמה)', street: 'רחוב הדוגמה', houseNo: '12',
    nearby: ['גני ילדים', 'בתי ספר', 'פארק / גינה ציבורית', 'רכבת קלה', 'מרכז מסחרי'], locationNotes: 'רחוב שקט, 4 דקות הליכה לתחנת הרכבת הקלה ולפארק.',
    propertyType: 'דירה', rooms: 4, sqm: 102, balconySqm: 12, floor: 6, totalFloors: 9, buildYear: 2012, bathrooms: 2, parking: 1, parkingType: 'מקורה בטאבו',
    elevator: 'yes', mamad: 'yes', storage: 'yes', condition: 'שמור', view: 'נוף פתוח', airDirections: ['דרום', 'מערב'],
    features: ['מזגנים מפוצלים', 'סוויטת הורים', 'דוד שמש', 'תריסים חשמליים'], registration: 'טאבו (רשם המקרקעין)', hasMortgage: 'yes', renewal: 'בניין חדש / לא רלוונטי',
    highlights: 'מרפסת שמש 12 מ״ר עם נוף פתוח\nממ״ד, חניה מקורה ומחסן\n4 דקות מהרכבת הקלה', weaknesses: 'מטבח מקורי משנת הבנייה ← מוצג עם הדמיית שדרוג ומחיר בהתאם',
    audience: ['משפחות צעירות', 'משפרי דיור', 'אנשי הייטק'], showings: 'בתיאום מראש של 24 שעות', openHouse: 'yes', sign: 'yes', staging: 'maybe', budget: 6000, commission: '2% + מע״מ'
  });
  const d = n => addDays(todayISO(), -n);
  p.comps = [
    ['רחוב הדוגמה 8', d(60), 3050000, 98, 4, 4], ['רחוב הדוגמה 15', d(130), 2980000, 100, 4, 3], ['שדרות לדוגמה 3', d(200), 3200000, 110, 4.5, 8],
    ['רחוב נוסף 21', d(95), 2850000, 95, 4, 2], ['רחוב נוסף 5', d(300), 2900000, 104, 4, 5], ['שדרות לדוגמה 11', d(20), 3290000, 106, 4, 7, 'listing'],
  ].map(([address, date, price, sqm, rooms, floor, kind]) => ({ id: uid(), on: true, kind: kind || 'sold', cond: 'same', adj: '', address, date, price, sqm, rooms, floor, source: 'דוגמה' }));
  p.cma.trendAnnual = 4; p.cma.useIndex = false;
  p.market.manual = { cityPpsqm: 29500, areaYoy: 4, dom: 75, source: 'נתוני דוגמה בלבד' };
  p.content.groups = [{ id: uid(), name: 'דירות למכירה ברמת גן', platform: 'וואטסאפ', area: 'רמת גן', link: '', last: '', every: 7 }, { id: uid(), name: 'הורים בשכונה', platform: 'פייסבוק', area: 'שכונה', link: '', last: '', every: 10 }];
  saveNow(); toast('נטען נכס לדוגמה — כל הנתונים בו פיקטיביים', 'ok');
}

/* boot */
loadState(); applyBrand();
$$('.tabs button').forEach(b => b.onclick = () => go(b.dataset.tab));
$('#brand').onclick = () => go('dashboard');
go((location.hash || '').slice(1) in RENDER ? location.hash.slice(1) : (P() ? 'questionnaire' : 'dashboard'));
