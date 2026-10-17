/* Property questionnaire: schema-driven form with sections */
'use strict';

const YESNO = [['yes', 'כן'], ['no', 'לא']];
const sale = q => q.dealType !== 'rent';
const rent = q => q.dealType === 'rent';

const Q_SECTIONS = [
  { id: 'deal', title: 'לקוח ועסקה', icon: '🤝', fields: [
    { k: 'dealType', t: 'seg', label: 'סוג העסקה', opts: [['sale', 'מכירה'], ['rent', 'השכרה']], rerender: true, req: true },
    { k: 'ownerName', t: 'text', label: 'שם הבעלים', req: true },
    { k: 'ownerPhone', t: 'tel', label: 'טלפון' },
    { k: 'ownerEmail', t: 'email', label: 'אימייל' },
    { k: 'motivation', t: 'select', label: 'סיבת המכירה', show: sale, opts: ['שדרוג דיור', 'צמצום / ילדים עזבו', 'רילוקיישן', 'ירושה / עיזבון', 'פירוק שיתוף / גירושין', 'מימוש השקעה', 'מעבר לעיר אחרת', 'קושי כלכלי', 'אחר'], req: true },
    { k: 'motivation', t: 'select', label: 'סיבת ההשכרה', show: rent, opts: ['נכס להשקעה', 'מעבר זמני / רילוקיישן', 'דירת ירושה', 'בעלים עוברים לנכס אחר', 'אחר'] },
    { k: 'urgency', t: 'select', label: 'לוח זמנים רצוי', opts: ['גמיש — ממקסמים מחיר', 'עד 6 חודשים', 'עד 3 חודשים', 'דחוף — עד חודש'], req: true },
    { k: 'ownerPrice', t: 'number', label: 'מחיר שהבעלים מצפה לו (₪)', show: sale, req: true },
    { k: 'minPrice', t: 'number', label: 'מחיר רצפה / מינימום (₪)', show: sale },
    { k: 'ownerRent', t: 'number', label: 'שכ״ד חודשי מבוקש (₪)', show: rent, req: true },
    { k: 'estValue', t: 'number', label: 'שווי הנכס המשוער (לחישוב תשואה)', show: rent },
    { k: 'entryDate', t: 'date', label: 'מועד כניסה / פינוי' },
    { k: 'entryFlex', t: 'select', label: 'גמישות במועד הכניסה', opts: ['גמיש', 'גמיש חלקית', 'קשיח'] },
    { k: 'exclusive', t: 'seg', label: 'בלעדיות', opts: [['yes', 'כן'], ['no', 'לא'], ['maybe', 'בבחינה']] },
    { k: 'exclusiveMonths', t: 'number', label: 'משך בלעדיות (חודשים)', showIf: q => q.exclusive === 'yes' },
    { k: 'prevMarketing', t: 'textarea', label: 'האם הנכס שווק בעבר? (כמה זמן, באיזה מחיר, למה לא נמכר)', wide: true },
  ] },
  { id: 'loc', title: 'מיקום', icon: '📍', fields: [
    { k: 'city', t: 'text', label: 'עיר / יישוב', req: true, list: ['תל אביב-יפו', 'ירושלים', 'חיפה', 'ראשון לציון', 'פתח תקווה', 'אשדוד', 'נתניה', 'באר שבע', 'חולון', 'בני ברק', 'רמת גן', 'רחובות', 'בת ים', 'אשקלון', 'כפר סבא', 'הרצליה', 'מודיעין-מכבים-רעות', 'חדרה', 'רעננה', 'רמלה', 'לוד', 'נהריה', 'בית שמש', 'קריית אתא', 'עפולה', 'טבעון', 'קריית ביאליק', 'הוד השרון', 'גבעתיים', 'נס ציונה', 'ראש העין', 'יבנה', 'זכרון יעקב', 'כרמיאל', 'נוף הגליל', 'יוקנעם עילית'] },
    { k: 'neighborhood', t: 'text', label: 'שכונה' },
    { k: 'street', t: 'text', label: 'רחוב', req: true },
    { k: 'houseNo', t: 'text', label: 'מספר בית' },
    { k: 'aptNo', t: 'text', label: 'מספר דירה' },
    { k: 'gush', t: 'text', label: 'גוש' },
    { k: 'helka', t: 'text', label: 'חלקה' },
    { k: 'subHelka', t: 'text', label: 'תת-חלקה' },
    { k: 'nearby', t: 'multi', label: 'בקרבת הנכס', wide: true, opts: ['גני ילדים', 'בתי ספר', 'תיכון', 'פארק / גינה ציבורית', 'מרכז מסחרי', 'קניון', 'סופרמרקט', 'תחבורה ציבורית', 'תחנת רכבת', 'רכבת קלה', 'גישה לכבישים ראשיים', 'חוף ים', 'בית כנסת', 'מתנ״ס', 'קופת חולים', 'בית חולים', 'אוניברסיטה / מכללה', 'מרכז העיר', 'שבילי אופניים', 'אזור תעסוקה'] },
    { k: 'locationNotes', t: 'textarea', label: 'מה מיוחד בשכונה / ברחוב?', wide: true, ph: 'רחוב שקט ללא מוצא, קהילה צעירה, 5 דק׳ הליכה לפארק...' },
  ] },
  { id: 'prop', title: 'מאפייני הנכס', icon: '🏢', fields: [
    { k: 'propertyType', t: 'select', label: 'סוג נכס', req: true, opts: ['דירה', 'דירת גן', 'פנטהאוז', 'דופלקס', 'מיני פנטהאוז', 'דירת גג', 'סטודיו / יחידת דיור', 'קוטג׳ / בית פרטי', 'דו-משפחתי', 'טורי', 'מגרש', 'משרד', 'חנות / מסחרי'] },
    { k: 'rooms', t: 'number', label: 'מספר חדרים', step: 0.5, req: true },
    { k: 'sqm', t: 'number', label: 'שטח בנוי (מ״ר)', req: true },
    { k: 'sqmNet', t: 'number', label: 'שטח נטו / רישום (מ״ר)' },
    { k: 'balconySqm', t: 'number', label: 'מרפסת (מ״ר)' },
    { k: 'gardenSqm', t: 'number', label: 'גינה / חצר (מ״ר)' },
    { k: 'roofSqm', t: 'number', label: 'מרפסת גג (מ״ר)' },
    { k: 'floor', t: 'number', label: 'קומה', req: true },
    { k: 'totalFloors', t: 'number', label: 'מספר קומות בבניין' },
    { k: 'buildYear', t: 'number', label: 'שנת בנייה' },
    { k: 'bathrooms', t: 'number', label: 'חדרי רחצה / שירותים' },
    { k: 'parking', t: 'number', label: 'חניות' },
    { k: 'parkingType', t: 'select', label: 'סוג חניה', showIf: q => num(q.parking) > 0, opts: ['מקורה בטאבו', 'בטאבו לא מקורה', 'משותפת', 'חניה עוקבת', 'רובוטית'] },
    { k: 'elevator', t: 'seg', label: 'מעלית', opts: YESNO },
    { k: 'mamad', t: 'seg', label: 'ממ״ד', opts: YESNO },
    { k: 'storage', t: 'seg', label: 'מחסן', opts: YESNO },
    { k: 'condition', t: 'select', label: 'מצב הנכס', req: true, opts: ['חדש מקבלן', 'חדש (עד 5 שנים)', 'משופץ ברמה גבוהה', 'שמור', 'דורש שיפוץ קל', 'דורש שיפוץ כללי'] },
    { k: 'view', t: 'select', label: 'נוף', opts: ['ללא נוף מיוחד', 'נוף פתוח', 'נוף לים', 'נוף לפארק / ירוק', 'נוף עירוני', 'נוף להרים'] },
    { k: 'airDirections', t: 'multi', label: 'כיווני אוויר', opts: ['צפון', 'דרום', 'מזרח', 'מערב'] },
    { k: 'features', t: 'multi', label: 'תוספות ושדרוגים', wide: true, opts: ['מיזוג מרכזי', 'מזגנים מפוצלים', 'מטבח משודרג', 'אי במטבח', 'סוויטת הורים', 'חדר ארונות', 'חימום תת-רצפתי', 'דוד שמש', 'תריסים חשמליים', 'בית חכם', 'נגישות לנכים', 'מעלית שבת', 'סורגים', 'דלת פלדלת', 'בריכה', 'ג׳קוזי', 'מרתף', 'חדר עבודה', 'יחידת הורים', 'ריהוט איכותי', 'לובי מפואר', 'שומר / קב״ט', 'חדר כושר בבניין', 'פאנלים סולאריים', 'עמדת טעינה לרכב'] },
    { k: 'furnished', t: 'select', label: 'ריהוט', show: rent, opts: ['לא מרוהטת', 'מרוהטת חלקית', 'מרוהטת מלאה'] },
    { k: 'pets', t: 'seg', label: 'חיות מחמד', show: rent, opts: [['yes', 'מותר'], ['no', 'אסור'], ['maybe', 'בתיאום']] },
    { k: 'arnona', t: 'number', label: 'ארנונה דו-חודשית (₪)' },
    { k: 'vaad', t: 'number', label: 'ועד בית חודשי (₪)' },
  ] },
  { id: 'legal', title: 'משפטי ותכנוני', icon: '⚖️', fields: [
    { k: 'registration', t: 'select', label: 'רישום הזכויות', opts: ['טאבו (רשם המקרקעין)', 'רשות מקרקעי ישראל', 'חברה משכנת', 'בית משותף לא רשום', 'אחר'] },
    { k: 'ownersCount', t: 'number', label: 'מספר בעלים רשומים' },
    { k: 'hasMortgage', t: 'seg', label: 'משכנתא / שעבוד על הנכס', opts: YESNO },
    { k: 'mortgageBalance', t: 'number', label: 'יתרת משכנתא משוערת (₪)', showIf: q => q.hasMortgage === 'yes' },
    { k: 'renewal', t: 'select', label: 'התחדשות עירונית', opts: ['אין', 'תמ״א 38 — בשלבי התארגנות', 'תמ״א 38 — חתום / בביצוע', 'פינוי-בינוי — בתכנון', 'פינוי-בינוי — מאושר', 'בניין חדש / לא רלוונטי'] },
    { k: 'buildingRights', t: 'textarea', label: 'זכויות בנייה לא מנוצלות / היתרים', ph: 'הצמדת גג, אפשרות לתוספת חדר, היתר להרחבה...' },
    { k: 'irregularities', t: 'textarea', label: 'חריגות בנייה / הערות אזהרה / עיקולים' },
    { k: 'tenantNow', t: 'seg', label: 'יש שוכר כיום?', opts: YESNO },
    { k: 'tenantUntil', t: 'date', label: 'חוזה השכירות הנוכחי עד', showIf: q => q.tenantNow === 'yes' },
    { k: 'documents', t: 'multi', label: 'מסמכים שהתקבלו', wide: true, opts: ['נסח טאבו עדכני', 'אישור זכויות', 'תשריט / תוכנית דירה', 'היתר בנייה', 'טופס 4 / 5', 'חוזה רכישה מקורי', 'צו בית משותף', 'אישור עירייה', 'חשבונות ארנונה', 'מפרט טכני', 'ייפוי כוח', 'הסכם תיווך חתום'] },
  ] },
  { id: 'mkt', title: 'שיווק', icon: '📣', fields: [
    { k: 'highlights', t: 'textarea', label: '3 היתרונות הכי חזקים של הנכס (שורה לכל יתרון)', wide: true, req: true, ph: 'מרפסת שמש עם נוף פתוח\nשכונה שקטה ליד הפארק\nחניה כפולה ומחסן' },
    { k: 'weaknesses', t: 'textarea', label: 'חולשות / התנגדויות צפויות ואיך עונים עליהן', wide: true, ph: 'קומה רביעית ללא מעלית → מחיר אטרקטיבי + פוטנציאל תמ״א' },
    { k: 'audience', t: 'multi', label: 'קהל יעד', wide: true, req: true, opts: ['זוגות צעירים', 'משפחות צעירות', 'משפחות גדולות', 'משפרי דיור', 'משקיעים', 'גיל הזהב / מצמצמים', 'רוכשי דירה ראשונה', 'תושבי חוץ / עולים', 'קהל דתי', 'סטודנטים', 'אנשי הייטק', 'עסקים ויזמים'] },
    { k: 'showings', t: 'select', label: 'זמינות לביקורים', opts: ['בכל עת בתיאום', 'ימי חול אחה״צ', 'רק בסופי שבוע', 'בתיאום מראש של 24 שעות', 'מוגבל מאוד'] },
    { k: 'openHouse', t: 'seg', label: 'מאשרים בית פתוח?', opts: YESNO },
    { k: 'sign', t: 'seg', label: 'מאשרים שלט על הבניין?', opts: YESNO },
    { k: 'staging', t: 'seg', label: 'מוכנים להשקיע בהום-סטיילינג?', opts: [['yes', 'כן'], ['no', 'לא'], ['maybe', 'אולי']] },
    { k: 'discreet', t: 'seg', label: 'שיווק דיסקרטי (ללא כתובת מלאה)?', opts: YESNO },
    { k: 'budget', t: 'number', label: 'תקציב שיווק מוסכם (₪)' },
    { k: 'commission', t: 'text', label: 'עמלת תיווך מוסכמת', ph: '2% + מע״מ' },
    { k: 'notes', t: 'textarea', label: 'הערות נוספות', wide: true },
  ] },
  { id: 'photos', title: 'תמונות', icon: '📷', fields: [] },
];

let qStep = 'deal';

function qVisible(f, q) { return (!f.show || f.show(q)) && (!f.showIf || f.showIf(q)); }
function qProgress(p) {
  const q = p.q, out = {};
  let tot = 0, done = 0;
  for (const s of Q_SECTIONS) {
    if (s.id === 'photos') { out[s.id] = p.photos.length ? 1 : 0; tot++; done += p.photos.length ? 1 : 0; continue; }
    const fs = s.fields.filter(f => qVisible(f, q));
    const d = fs.filter(f => has(q[f.k])).length;
    out[s.id] = fs.length ? d / fs.length : 1;
    const req = fs.filter(f => f.req); tot += req.length; done += req.filter(f => has(q[f.k])).length;
  }
  out.total = tot ? done / tot : 0;
  return out;
}

function renderField(f, q) {
  const v = q[f.k];
  const lbl = `<span class="lbl">${esc(f.label)}${f.req ? ' <span style="color:var(--accent)">*</span>' : ''}</span>`;
  const cls = f.wide || f.t === 'multi' || f.t === 'textarea' ? 'f wide' : 'f';
  switch (f.t) {
    case 'seg': return `<div class="${cls}"><label class="f">${lbl}</label><div class="seg" data-k="${f.k}" ${f.rerender ? 'data-rr="1"' : ''}>${f.opts.map(([val, t]) => `<button type="button" data-v="${val}" class="${v === val ? 'on' : ''}">${t}</button>`).join('')}</div></div>`;
    case 'select': return `<label class="${cls}">${lbl}<select data-k="${f.k}"><option value="">בחרו…</option>${f.opts.map(o => `<option ${o === v ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select></label>`;
    case 'multi': return `<div class="${cls}"><label class="f">${lbl}</label><div class="chips" data-multi="${f.k}">${f.opts.map(o => `<span class="chip ${(v || []).includes(o) ? 'on' : ''}" data-v="${esc(o)}">${esc(o)}</span>`).join('')}</div></div>`;
    case 'textarea': return `<label class="${cls}">${lbl}<textarea data-k="${f.k}" rows="3" placeholder="${esc(f.ph || '')}">${esc(v)}</textarea></label>`;
    default: {
      const list = f.list ? `list="dl-${f.k}"` : '';
      const dl = f.list ? `<datalist id="dl-${f.k}">${f.list.map(o => `<option value="${esc(o)}">`).join('')}</datalist>` : '';
      return `<label class="${cls}">${lbl}<input type="${f.t}" data-k="${f.k}" value="${esc(v)}" ${f.step ? `step="${f.step}"` : ''} placeholder="${esc(f.ph || '')}" ${list} ${f.t === 'number' ? 'inputmode="decimal"' : ''}>${dl}</label>`;
    }
  }
}

function renderQuestionnaire() {
  const p = P(), q = p.q, pr = qProgress(p);
  const sec = Q_SECTIONS.find(s => s.id === qStep) || Q_SECTIONS[0];
  const idx = Q_SECTIONS.indexOf(sec);
  let body;
  if (sec.id === 'photos') {
    body = `<p class="muted">העלו תמונות של הנכס. התמונה המסומנת ככריכה תשמש לגרפיקות ולשער המצגת. התמונות נדחסות ונשמרות בדפדפן בלבד.</p>
      <div class="drop" id="ph-drop">📷 לחצו או גררו לכאן תמונות (JPG/PNG)</div>
      <div class="photos" style="margin-top:14px">${p.photos.map((src, i) => `<div class="photo ${i === (p.coverIdx || 0) ? 'cover' : ''}" style="background-image:url('${src}')"><div class="tools"><button data-cover="${i}">${i === (p.coverIdx || 0) ? '★ כריכה' : 'קבע ככריכה'}</button><button data-del="${i}">🗑</button></div></div>`).join('')}</div>`;
  } else {
    body = `<div class="fields">${sec.fields.filter(f => qVisible(f, q)).map(f => renderField(f, q)).join('')}</div>`;
  }
  $('#view').innerHTML = `
    <div class="card-head"><div><h1>שאלון נכס</h1><div class="muted">${esc(addrLine(q))} · ${isRent() ? 'השכרה' : 'מכירה'}</div></div>
      <div style="min-width:220px"><div class="row between"><small>השלמת שדות חובה</small><b>${Math.round(pr.total * 100)}%</b></div><div class="progress"><i style="width:${pr.total * 100}%"></i></div></div></div>
    <div class="stepper">${Q_SECTIONS.map(s => `<button data-step="${s.id}" class="${s.id === sec.id ? 'on' : ''}">${s.icon} ${s.title} <span class="pct">${Math.round(pr[s.id] * 100)}%</span></button>`).join('')}</div>
    <div class="card"><h2>${sec.icon} ${sec.title}</h2>${body}
      <div class="row between" style="margin-top:20px">
        <button class="btn" data-go="${idx - 1}" ${idx === 0 ? 'disabled' : ''}>→ הקודם</button>
        ${idx < Q_SECTIONS.length - 1 ? `<button class="btn primary" data-go="${idx + 1}">הבא ←</button>` : `<button class="btn accent" data-tabgo="cma">המשך לניתוח שוק ו-CMA ←</button>`}
      </div></div>`;

  const v = $('#view');
  v.querySelectorAll('[data-step]').forEach(b => b.onclick = () => { qStep = b.dataset.step; renderQuestionnaire(); });
  v.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { qStep = Q_SECTIONS[+b.dataset.go].id; renderQuestionnaire(); scrollTo(0, 0); });
  v.querySelectorAll('[data-tabgo]').forEach(b => b.onclick = () => go(b.dataset.tabgo));
  v.querySelectorAll('input[data-k], select[data-k], textarea[data-k]').forEach(el => {
    el.addEventListener('input', () => { q[el.dataset.k] = el.value; touch(); updateHeader(); });
    el.addEventListener('change', () => { if (sec.fields.some(x => x.showIf && x.showIf.toString().includes(el.dataset.k))) renderQuestionnaire(); });
  });
  v.querySelectorAll('.seg[data-k]').forEach(seg => seg.querySelectorAll('button').forEach(b => b.onclick = () => {
    const k = seg.dataset.k; q[k] = q[k] === b.dataset.v && !seg.dataset.rr ? '' : b.dataset.v;
    if (k === 'dealType') onDealTypeChange(p);
    touch(); renderQuestionnaire(); updateHeader();
  }));
  v.querySelectorAll('[data-multi]').forEach(box => box.querySelectorAll('.chip').forEach(c => c.onclick = () => {
    const k = box.dataset.multi, arr = q[k] = q[k] || [], val = c.dataset.v, i = arr.indexOf(val);
    i >= 0 ? arr.splice(i, 1) : arr.push(val); c.classList.toggle('on'); touch();
  }));
  if (sec.id === 'photos') bindPhotos(p);
}

function onDealTypeChange(p) {
  const r = p.q.dealType === 'rent';
  p.cma.listingDisc = r ? 2 : 4; p.cma.margin = r ? 2 : 3;
  if (p.plan && !p.plan.custom) p.plan = null;
}

function bindPhotos(p) {
  const add = async files => {
    files = files.filter(f => f.type.startsWith('image/'));
    if (!files.length) return;
    toast(`מעבד ${files.length} תמונות…`);
    for (const f of files) { try { p.photos.push(await compressImage(f)); } catch { toast('לא ניתן לקרוא ' + f.name, 'err'); } }
    touch(); renderQuestionnaire();
  };
  const d = $('#ph-drop');
  d.onclick = async () => add(await pickFiles('image/*'));
  d.ondragover = e => { e.preventDefault(); d.style.borderColor = 'var(--primary)'; };
  d.ondragleave = () => d.style.borderColor = '';
  d.ondrop = e => { e.preventDefault(); add([...e.dataTransfer.files]); };
  $$('[data-cover]').forEach(b => b.onclick = () => { p.coverIdx = +b.dataset.cover; touch(); renderQuestionnaire(); });
  $$('[data-del]').forEach(b => b.onclick = () => {
    const i = +b.dataset.del; p.photos.splice(i, 1);
    if ((p.coverIdx || 0) >= p.photos.length) p.coverIdx = 0;
    touch(); renderQuestionnaire();
  });
}
