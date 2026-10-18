/* Marketing plan: phases + events over up to 180 days, Gantt, budget, ICS export */
'use strict';

const CATS = {
  prep:    { t: 'הכנה ומסמכים', c: '#6366f1' },
  media:   { t: 'צילום ותוכן', c: '#ec4899' },
  digital: { t: 'פרסום דיגיטלי', c: '#0ea5e9' },
  social:  { t: 'רשתות ווואטסאפ', c: '#22c55e' },
  event:   { t: 'אירועים וביקורים', c: '#f59e0b' },
  network: { t: 'מאגר ומתווכים', c: '#8b5cf6' },
  offline: { t: 'שטח ופרינט', c: '#14b8a6' },
  review:  { t: 'בקרה ותמחור', c: '#ef4444' },
  report:  { t: 'דיווח לבעלים', c: '#64748b' },
  closing: { t: 'מו״מ וסגירה', c: '#16a34a' },
};

const PHASES_SALE = [
  { from: 1, to: 10, t: 'הכנה ובניית ה״מוצר״', goal: 'להכין את הנכס, החומרים והמסמכים לפני שקונה אחד רואה אותו. רושם ראשוני נוצר פעם אחת.', kpi: 'צילום מקצועי, תיאור, גרפיקות, נסח טאבו — מוכנים' },
  { from: 11, to: 30, t: 'השקה — ״חדש בשוק״', goal: 'למקסם את חלון ההזדמנות של השבועות הראשונים, שבו העניין של הקונים בשיאו.', kpi: '15+ פניות · 6+ ביקורים · בית פתוח ראשון' },
  { from: 31, to: 60, t: 'מומנטום וביקורים', goal: 'לשמר חשיפה, לסנן קונים רציניים ולהגיע להצעות ראשונות.', kpi: '8+ ביקורים נוספים · 1–2 הצעות' },
  { from: 61, to: 90, t: 'בקרה ומיצוב מחדש', goal: 'לקבל החלטות על בסיס נתונים: מחיר, מסר, קהל, ותזמון.', kpi: 'החלטת מחיר מתועדת · רענון חומרים' },
  { from: 91, to: 120, t: 'הרחבת קהלים', goal: 'להגיע לקהלים שעוד לא נחשפו: משקיעים, משפרי דיור, מתווכים מאזורים סמוכים.', kpi: '2 ערוצים חדשים · 5+ ביקורים' },
  { from: 121, to: 150, t: 'האצה — הצעת ערך חדשה', goal: 'לייצר סיבה חדשה לפעול עכשיו: גמישות, תוספת ערך או עדכון מחיר.', kpi: 'הצעה רצינית אחת לפחות' },
  { from: 151, to: 180, t: 'מו״מ, סגירה וחוזה', goal: 'לסגור עסקה בטוחה: מימון מאושר, ליווי משפטי ומסירה חלקה.', kpi: 'חוזה חתום' },
];
const PHASES_RENT = [
  { from: 1, to: 5, t: 'הכנה ותנאי השכירות', goal: 'להגדיר מחיר, ביטחונות, ריהוט ומועד כניסה — ולהכין את הדירה להצגה.', kpi: 'צילום, תיאור ותנאים מוגדרים' },
  { from: 6, to: 14, t: 'השקה וחשיפה', goal: 'חשיפה מרוכזת בפורטלים ובקבוצות כדי לייצר תור מתעניינים.', kpi: '20+ פניות · יום ביקורים מרוכז' },
  { from: 15, to: 30, t: 'ביקורים וסינון שוכרים', goal: 'לבחור שוכר איכותי: יכולת כלכלית, המלצות, התאמה לבעלים.', kpi: '2–3 מועמדים מסוננים' },
  { from: 31, to: 45, t: 'בקרה ועדכון', goal: 'אם אין שוכר מתאים — לעדכן מחיר, תנאים או מסר.', kpi: 'החלטה מתועדת' },
  { from: 46, to: 60, t: 'חוזה ומסירה', goal: 'חוזה מוגן, ביטחונות מלאים ופרוטוקול מסירה מצולם.', kpi: 'חוזה חתום ומפתחות נמסרו' },
];

const lux = q => num(q.ownerPrice) >= 4.5e6 || ['פנטהאוז', 'קוטג׳ / בית פרטי', 'דו-משפחתי', 'מיני פנטהאוז'].includes(q.propertyType) || /ים/.test(q.view || '');
const OK = { oh: q => q.openHouse !== 'no', sign: q => q.sign !== 'no' && q.discreet !== 'yes', open: q => q.discreet !== 'yes', staging: q => q.staging !== 'no' };

const EV_SALE = [
  [1, 'prep', 1, 'חתימה על הסכם תיווך ובלעדיות', 'הגדרת תקופה, עמלה, ערוצי שיווק מאושרים, תדירות דיווח ונקודות בקרה.'],
  [1, 'prep', 1, 'הזמנת נסח טאבו ובדיקת זכויות', 'בדיקת בעלים רשומים, שעבודים, הערות אזהרה וחריגות בנייה — כדי למנוע הפתעות במו״מ.'],
  [2, 'prep', 1, 'סיור הכנה: תיקונים, ניקיון והפחתת חפצים', 'רשימת תיקונים קטנים (נורות, ידיות, צבע), ניקיון עמוק והוצאת חפצים אישיים לפני הצילום.', 0],
  [3, 'prep', 2, 'הום-סטיילינג / ביום הנכס', 'סידור רהיטים, טקסטיל, צמחייה ותאורה — מגדיל אטרקטיביות בצילומים ובביקורים.', 2500, OK.staging],
  [5, 'media', 1, 'צילום מקצועי של הנכס', 'סטילס בעדשה רחבה, אור טבעי, תמונות לילה למרפסת/נוף. 20–30 תמונות ערוכות.', 900],
  [5, 'media', 2, 'וידאו סיור + רילס אנכי', 'סרטון 45–60 שניות לרשתות + גרסה אנכית לסטורי ולוואטסאפ.', 1500],
  [6, 'media', 3, 'צילומי רחפן ונוף', 'מראה הבניין, הסביבה, מרחק מפארקים/ים/מרכז. מומלץ במיוחד בנכסי יוקרה ובבתים פרטיים.', 1200, lux],
  [6, 'media', 3, 'סיור וירטואלי 360° ותוכנית דירה גרפית', 'מסנן קונים לא רלוונטיים ומעלה איכות הביקורים.', 1200],
  [7, 'media', 1, 'כתיבת תיאור שיווקי ומסרים לכל קהל יעד', 'כותרת, 3 יתרונות מרכזיים, מענה מראש להתנגדויות — לכל ערוץ בנפרד.'],
  [8, 'media', 1, 'הכנת סט גרפיקות שיווקיות', 'חדש בשוק, פרטי נכס, בית פתוח — בפורמט פוסט, סטורי וכרזה.'],
  [8, 'digital', 2, 'חוברת נכס דיגיטלית / עמוד נחיתה', 'קישור אחד שמרכז תמונות, וידאו, מפרט, מפה ופרטי קשר — לשליחה בוואטסאפ.', 400],
  [9, 'social', 2, 'טיזר ״בקרוב בשוק״', 'הודעה למאגר הקונים ולקבוצות — יוצרת ציפייה ורשימת המתנה לביקור ראשון.', 0, OK.open],
  [10, 'offline', 1, 'שלט ״למכירה״ על הבניין', 'שלט מקצועי עם טלפון וקוד QR לחוברת הנכס.', 300, OK.sign],
  [11, 'digital', 1, 'עלייה לאוויר בפורטלים', 'יד2, מדלן, הומלס ופורטלים מקומיים — מודעה מודגשת עם וידאו.', 600],
  [11, 'social', 1, 'פוסט השקה בפייסבוק ובאינסטגרם + סטורי', 'פוסט ״חדש בשוק״ עם גלריה וקריאה לפעולה לתיאום ביקור.'],
  [11, 'social', 1, 'הפצה בקבוצות וואטסאפ ופייסבוק', 'קבוצות שכונתיות, קבוצות נדל״ן עירוניות, קבוצות מתווכים. הודעה מותאמת לכל קבוצה.'],
  [12, 'digital', 2, 'קמפיין ממומן בפייסבוק / אינסטגרם', 'קהל: רדיוס 5–10 ק״מ, גילאים לפי קהל היעד, ריטרגטינג לצופי הווידאו. 14 יום.', 1500],
  [12, 'network', 1, 'פנייה אישית לקונים מתאימים מהמאגר', 'שיחה/הודעה אישית ל-15–20 הקונים המתאימים ביותר — לפני כולם.'],
  [13, 'network', 2, 'סיור מתווכים / שיתוף פעולה עם משרדים', 'הזמנת מתווכים מהאזור לסיור, עם חוברת ותנאי שת״פ.', 150],
  [14, 'offline', 2, 'פלאיירים לשכנים — ״השכן שלך מוכר״', 'תיבות דואר בבניין ובבניינים סמוכים. שכנים מביאים קונים — חברים ומשפחה.', 400, OK.open],
  [16, 'event', 1, 'בית פתוח ראשון', 'שעתיים בשבת/שישי. הרשמה מראש, דף מידע מודפס, איסוף פרטים ומשוב מכל מבקר.', 200, OK.oh],
  [21, 'review', 1, 'סיכום 3 שבועות ראשונים', 'ניתוח פניות, ביקורים ומשוב. השוואה ליעדי השלב.'],
  [24, 'social', 2, 'רילס ״סיור בנכס״ + קידום', 'וידאו קצר בגוף ראשון עם 3 היתרונות המרכזיים.', 500],
  [28, 'review', 1, 'נקודת בקרה #1 — בדיקת מחיר', 'כלל החלטה: פחות מ-4 ביקורים בשבוע או משוב חוזר על מחיר ← המלצה לעדכון של 2–3% עכשיו, לא בעוד חודשיים.'],
  [32, 'network', 1, 'פולואפ אישי לכל המבקרים והמתעניינים', 'שאלת עומק: מה מנע מכם להתקדם? איסוף התנגדויות אמיתיות.'],
  [35, 'digital', 2, 'קמפיין ריטרגטינג', 'פרסום חוזר לצופי הווידאו ולמבקרי עמוד הנכס.', 800],
  [40, 'event', 1, 'בית פתוח שני', 'ממוקד בקהל יעד שזוהה בשלב ההשקה.', 200, OK.oh],
  [45, 'social', 1, 'פוסט ״למה לגור כאן?״', 'תוכן על השכונה: גנים, פארקים, קהילה, תחבורה — מוכר את אורח החיים.'],
  [50, 'report', 1, 'דו״ח שוק עדכני לבעלים', 'עסקאות חדשות שנרשמו, נכסים מתחרים שעלו/נמכרו, השוואת מחיר.'],
  [55, 'digital', 1, 'רענון תמונת שער וכותרת במודעות', 'החלפת התמונה הראשית והכותרת — מחזיר את המודעה לראש תשומת הלב.'],
  [60, 'review', 1, 'נקודת בקרה #2 — פגישת אסטרטגיה (60 יום)', 'סיכום נתונים מלא. אם אין הצעות: החלטה על מחיר, תוספת ערך או שינוי קהל.'],
  [63, 'review', 1, 'עדכון מחיר / תוספת ערך', 'הורדת מחיר מדודה, גמישות במועד כניסה, השארת ריהוט/מזגנים, השתתפות בהוצאות.'],
  [65, 'social', 1, 'הודעת ״מחיר מעודכן״ / ״הזדמנות״', 'הודעה ייעודית למאגר, למבקרים קודמים ולקבוצות.'],
  [70, 'network', 2, 'פנייה למשקיעים ולקהלים חדשים', 'חוברת תשואה: שכ״ד צפוי, תשואה ברוטו, פוטנציאל השבחה.'],
  [76, 'event', 1, 'בית פתוח שלישי / ״ביקור שקט״ למוזמנים', '', 200, OK.oh],
  [80, 'network', 2, 'הרחבת שיתוף פעולה עם מתווכים', 'פנייה למשרדים בערים סמוכות, תנאי חלוקת עמלה.'],
  [88, 'review', 1, 'ניתוח משפך הפרסום', 'חשיפות ← הקלקות ← פניות ← ביקורים ← הצעות. איפה נוצר החסם?'],
  [90, 'review', 1, 'נקודת בקרה #3 (90 יום)', 'המלצה מבוססת נתונים: המשך, תיקון, או שינוי אסטרטגיה.'],
  [95, 'media', 2, 'צילום מחדש / סטיילינג מחודש', 'עונה אחרת, אור אחר, זוויות חדשות — מראה ״חדש״ בפורטלים.', 700],
  [100, 'digital', 2, 'קמפיין וידאו חדש לקהל שלא נחשף', 'למשל משפרי דיור מערים סמוכות.', 1200],
  [105, 'offline', 3, 'פרסום מקומי: עיתון / ניוזלטר קהילתי', '', 1200],
  [110, 'event', 1, 'בית פתוח רביעי', '', 200, OK.oh],
  [118, 'review', 1, 'עדכון CMA — עסקאות חדשות באזור', 'רענון טבלת ההשוואה ובדיקת מיקום המחיר מול השוק.'],
  [120, 'review', 1, 'נקודת בקרה #4 (120 יום)', ''],
  [125, 'review', 1, 'הצעת ערך חדשה', '״כניסה גמישה״, ״ללא עמלה לקונה״, השתתפות בעלויות — סיבה חדשה לפעול עכשיו.'],
  [130, 'social', 2, 'קמפיין ״הזדמנות אחרונה במחיר הזה״', '', 800],
  [135, 'event', 3, 'אירוע VIP לקונים רציניים', 'כולל יועץ משכנתאות במקום — מסיר את חסם המימון.', 800],
  [145, 'network', 1, 'שיחת ״מה יגרום לך לסגור?״ עם כל המתעניינים', ''],
  [150, 'review', 1, 'נקודת בקרה #5 (150 יום)', ''],
  [155, 'closing', 1, 'ניהול מו״מ ותיאום ציפיות', 'מתקיים בכל שלב שבו מתקבלת הצעה רצינית — לא רק כאן.'],
  [160, 'closing', 1, 'אימות יכולת המימון של הקונה', 'אישור עקרוני למשכנתא והון עצמי — לפני חתימה על זיכרון דברים.'],
  [165, 'closing', 1, 'העברה לעורכי דין וליווי החוזה', ''],
  [172, 'closing', 1, 'ליווי שמאי הבנק ותהליך המשכנתא של הקונה', ''],
  [180, 'closing', 1, 'סיכום קמפיין, פוסט ״נמכר!״ ובקשת המלצה', ''],
];
const EV_RENT = [
  [1, 'prep', 1, 'חתימה על הסכם תיווך', ''],
  [1, 'prep', 1, 'הגדרת תנאי שכירות', 'שכ״ד, ביטחונות (צ׳קים/ערבות בנקאית/ערבים), תקופה, אופציה, חיות מחמד, ריהוט.'],
  [2, 'prep', 1, 'הכנת הדירה: ניקיון, תיקונים, צבע', ''],
  [3, 'media', 1, 'צילום מקצועי + וידאו קצר', '', 700],
  [4, 'media', 1, 'תיאור שיווקי וגרפיקות', ''],
  [6, 'digital', 1, 'עלייה לאוויר: יד2, מדלן, פייסבוק מרקטפלייס', '', 300],
  [6, 'social', 1, 'הפצה בקבוצות דירות להשכרה', 'קבוצות פייסבוק ווואטסאפ עירוניות, סטודנטים, רילוקיישן.'],
  [7, 'digital', 2, 'קידום ממומן קצר', '', 500],
  [10, 'event', 1, 'יום ביקורים מרוכז', 'ריכוז כל המתעניינים לחלון של שעתיים — יוצר תחושת ביקוש.'],
  [13, 'review', 1, 'בקרה: כמות פניות ואיכותן', ''],
  [16, 'closing', 1, 'סינון מועמדים', 'תלושי שכר, המלצות משוכרים קודמים, בדיקת BDI / נתוני אשראי.'],
  [18, 'event', 1, 'יום ביקורים שני', ''],
  [21, 'review', 1, 'נקודת בקרה מחיר', 'אין מועמד מתאים לאחר 2 ימי ביקורים ← עדכון של 3–5% או שינוי תנאים.'],
  [25, 'digital', 1, 'רענון מודעות ותמונת שער', ''],
  [31, 'review', 1, 'נקודת בקרה (30 יום)', ''],
  [35, 'review', 1, 'עדכון מחיר / ריהוט / גמישות', ''],
  [40, 'social', 1, 'הודעת ״מחיר מעודכן״ לקבוצות', ''],
  [46, 'closing', 1, 'ניסוח חוזה שכירות', 'כולל נספח ציוד, אופציה, מנגנון הצמדה וביטחונות.'],
  [50, 'closing', 1, 'קבלת ביטחונות וצ׳קים', ''],
  [55, 'closing', 1, 'פרוטוקול מסירה מצולם ומסירת מפתחות', ''],
  [60, 'closing', 1, 'פוסט ״הושכר!״ ובקשת המלצה', ''],
];

function buildPlan(p, opts) {
  const R = isRent(p), q = p.q;
  const L = opts.days, lvl = opts.level, base = R ? 60 : 180;
  const sc = d => Math.max(1, Math.min(L, Math.round(d * L / base)));
  const phases = (R ? PHASES_RENT : PHASES_SALE).map((ph, i, a) => ({ ...ph, from: i === 0 ? 1 : sc(a[i - 1].to) + 1, to: i === a.length - 1 ? L : sc(ph.to) }));
  const events = [];
  (R ? EV_RENT : EV_SALE).forEach(([day, cat, l, title, desc, cost = 0, cond]) => {
    if (cond === lux) { if (!lux(q) && lvl < 3) return; }
    else if (l > lvl || (cond && !cond(q))) return;
    events.push({ id: uid(), day: sc(day), cat, title, desc, cost, done: false });
  });
  // recurring touchpoints
  for (let d = 7; d <= L; d += 7) events.push({ id: uid(), day: d, cat: 'report', title: `דו״ח שבועי לבעלים #${d / 7}`, desc: 'חשיפות, פניות, ביקורים, משוב קונים והמלצה לשבוע הבא.', cost: 0, done: false, rec: true });
  for (let d = R ? 9 : 18; d <= L - 3; d += R ? 6 : 10) events.push({ id: uid(), day: d, cat: 'social', title: 'הקפצת מודעות + הודעת רענון בקבוצות', desc: 'נוסח חדש בכל פעם (זווית אחרת של הנכס).', cost: 0, done: false, rec: true });
  if (lvl >= 2 && !R) for (let d = 20; d <= L - 5; d += 14) events.push({ id: uid(), day: d, cat: 'social', title: 'סטורי / רילס חדש', desc: '', cost: 0, done: false, rec: true });
  events.sort((a, b) => a.day - b.day);
  return { days: L, level: lvl, start: opts.start || todayISO(), phases, events, createdAt: Date.now() };
}

function ensurePlan(p) {
  if (!p.plan) p.plan = buildPlan(p, { days: isRent(p) ? 60 : 180, level: 2, start: todayISO() });
  return p.plan;
}
function phaseOf(plan, day) { return plan.phases.findIndex(ph => day >= ph.from && day <= ph.to); }

function planToICS(p) {
  const pl = p.plan, z = s => String(s || '').replace(/\\/g, '\\\\').replace(/[,;]/g, m => '\\' + m).replace(/\n/g, '\\n');
  const d8 = iso => iso.replace(/-/g, '');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Nadlan Marketing Studio//HE', 'CALSCALE:GREGORIAN'];
  pl.events.forEach(e => {
    const dt = addDays(pl.start, e.day - 1);
    lines.push('BEGIN:VEVENT', `UID:${e.id}@nadlan-studio`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
      `DTSTART;VALUE=DATE:${d8(dt)}`, `DTEND;VALUE=DATE:${d8(addDays(dt, 1))}`,
      `SUMMARY:${z(`${e.title} — ${shortAddr(p.q)}`)}`, `DESCRIPTION:${z(`${CATS[e.cat]?.t || ''}\n${e.desc || ''}`)}`, 'END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

let planView = 'list', planShowRec = false;
function renderPlan() {
  const p = P(), pl = ensurePlan(p), L = pl.days;
  const today = Math.floor((new Date(todayISO()) - new Date(pl.start)) / 864e5) + 1;
  const cost = pl.events.reduce((a, e) => a + (num(e.cost) || 0), 0), budget = num(p.q.budget);
  const done = pl.events.filter(e => e.done).length;
  const byCat = Object.keys(CATS).map(k => ({ k, value: pl.events.filter(e => e.cat === k).reduce((a, e) => a + (num(e.cost) || 0), 0), color: CATS[k].c })).filter(x => x.value > 0);
  const pos = d => `${((d - 0.5) / L) * 100}%`;

  const gantt = `<div class="gantt"><div class="gantt-inner">
    <div class="gantt-ruler">${Array.from({ length: Math.floor(L / (L > 90 ? 15 : L > 45 ? 7 : 5)) }, (_, i) => (i + 1) * (L > 90 ? 15 : L > 45 ? 7 : 5)).filter(d => d < L).map(d => `<span style="right:${(d - 0.5) / L * 100}%">יום ${d}</span>`).join('')}</div>
    <div class="gantt-row" style="height:40px">${pl.phases.map((ph, i) => `<div class="gantt-bar" title="${esc(ph.t)}" style="right:${((ph.from - 1) / L) * 100}%;width:calc(${((ph.to - ph.from + 1) / L) * 100}% - 3px);background:hsl(${232 - i * 22} 70% ${42 + i * 3}%)">${i + 1}. ${esc(ph.t)}</div>`).join('')}
      ${today >= 1 && today <= L ? `<div class="gantt-today" style="right:${pos(today)}" title="היום"></div>` : ''}</div>
    ${Object.entries(CATS).filter(([k]) => pl.events.some(e => e.cat === k)).map(([k, c]) => `<div class="gantt-row"><span style="position:absolute;inset-inline-start:4px;top:8px;font-size:11px;color:var(--muted)">${c.t}</span>${pl.events.filter(e => e.cat === k).map(e => `<span class="gantt-dot" data-jump="${e.id}" title="יום ${e.day}: ${esc(e.title)}" style="right:${pos(e.day)};background:${c.c};${e.done ? 'opacity:.35' : ''}"></span>`).join('')}${today >= 1 && today <= L ? `<div class="gantt-today" style="right:${pos(today)}"></div>` : ''}</div>`).join('')}
  </div></div>`;

  const list = pl.phases.map((ph, i) => {
    const evs = pl.events.filter(e => phaseOf(pl, e.day) === i && (planShowRec || !e.rec));
    return `<div class="card phase" style="border-inline-start-color:hsl(${232 - i * 22} 70% ${42 + i * 3}%)">
      <div class="phase-head"><h3>שלב ${i + 1}: ${esc(ph.t)}</h3><span class="badge">ימים ${ph.from}–${ph.to} · ${fmtDate(addDays(pl.start, ph.from - 1))} – ${fmtDate(addDays(pl.start, ph.to - 1))}</span></div>
      <p class="muted" style="margin:.2em 0">${esc(ph.goal)}</p><div><small><b>יעדים:</b> ${esc(ph.kpi)}</small></div>
      ${evs.map(e => `<div class="ev ${e.done ? 'done' : ''}" id="ev-${e.id}" data-ev="${e.id}">
        <input type="checkbox" data-e="done" ${e.done ? 'checked' : ''} title="בוצע">
        <div><div class="ev-day">יום <input type="number" data-e="day" value="${e.day}" min="1" max="${L}" style="width:52px;padding:2px 4px"></div><small>${fmtDate(addDays(pl.start, e.day - 1))}</small></div>
        <div><input type="text" class="ev-title" data-e="title" value="${esc(e.title)}" style="border-color:transparent;background:transparent;padding:2px 4px">
          <div class="row" style="margin-top:2px"><span class="badge cat" style="background:${CATS[e.cat]?.c}22;color:${CATS[e.cat]?.c}">${CATS[e.cat]?.t}</span>${e.desc ? `<small class="muted">${esc(e.desc)}</small>` : ''}</div></div>
        <div class="row" style="flex-wrap:nowrap"><input type="number" data-e="cost" value="${esc(e.cost || '')}" placeholder="₪" title="עלות" style="width:80px;padding:4px 6px"><button class="btn ghost sm" data-e="del" title="מחיקה">✕</button></div>
      </div>`).join('') || '<div class="muted" style="padding-top:8px">אין משימות בשלב זה.</div>'}
    </div>`;
  }).join('');

  $('#view').innerHTML = `
  <div class="card-head"><div><h1>תכנית שיווק — ${L} ימים</h1><div class="muted">${esc(addrLine(p.q))} · התחלה ${fmtDate(pl.start)} · סיום ${fmtDate(addDays(pl.start, L - 1))}</div></div>
    <div class="row"><button class="btn" id="ics">📅 ייצוא ליומן (ICS)</button><button class="btn primary" data-tabgo="studio">לגרפיקות ←</button></div></div>
  <div class="grid g2">
    <div class="card"><h3>הגדרות התכנית</h3>
      <div class="fields">
        <label class="f"><span class="lbl">תאריך תחילת שיווק</span><input type="date" id="pl-start" value="${pl.start}"></label>
        <div class="f"><span class="lbl">משך (ימים)</span><div class="seg" id="pl-days">${[30, 60, 90, 120, 180].map(d => `<button data-v="${d}" class="${d === L ? 'on' : ''}">${d}</button>`).join('')}</div></div>
        <div class="f wide"><span class="lbl">רמת השקעה</span><div class="seg" id="pl-lvl">${[[1, 'בסיסית'], [2, 'מורחבת'], [3, 'פרימיום']].map(([v, t]) => `<button data-v="${v}" class="${v === pl.level ? 'on' : ''}">${t}</button>`).join('')}</div></div>
      </div>
      <div class="row" style="margin-top:12px"><button class="btn" id="pl-regen">↻ בנייה מחדש לפי ההגדרות</button><button class="btn" id="pl-add">＋ משימה / אירוע</button></div>
      <p class="muted" style="font-size:12.5px">התכנית בנויה לתרחיש המלא. ברגע שמתקבלת הצעה מתאימה — עוברים לשלב המו״מ והסגירה בכל נקודת זמן.</p>
    </div>
    <div class="card"><h3>סיכום</h3>
      <div class="kpis">
        <div class="kpi"><small>משימות ואירועים</small><b>${pl.events.length}</b><small>${done} בוצעו</small></div>
        <div class="kpi"><small>עלות מתוכננת</small><b>${fmtILS(cost)}</b>${!isNaN(budget) ? `<small>מתוך תקציב ${fmtILS(budget)}</small>` : ''}</div>
        <div class="kpi"><small>היום בקמפיין</small><b>${today >= 1 ? Math.min(today, L) : 'טרם החל'}</b><small>${pl.events.filter(e => e.cat === 'review').length} נקודות בקרה</small></div>
      </div>
      ${!isNaN(budget) && cost > budget ? `<div class="note warn" style="margin-top:10px">העלות המתוכננת חורגת מהתקציב ב-${fmtILS(cost - budget)}.</div>` : ''}
      ${byCat.length ? `<div class="row" style="margin-top:10px;flex-wrap:nowrap;gap:16px">${Charts.donut(byCat, { w: 140 })}<div style="font-size:13px">${byCat.map(x => `<div><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${x.color}"></span> ${CATS[x.k].t}: ${fmtILS(x.value)}</div>`).join('')}</div></div>` : ''}
    </div>
  </div>
  <div class="card"><div class="card-head"><h2>ציר זמן</h2><label class="row" style="gap:6px;font-size:13px"><input type="checkbox" id="pl-rec" ${planShowRec ? 'checked' : ''}> הצגת משימות שוטפות (${pl.events.filter(e => e.rec).length})</label><div class="seg" id="pl-view"><button data-v="list" class="${planView === 'list' ? 'on' : ''}">רשימה לפי שלבים</button><button data-v="gantt" class="${planView === 'gantt' ? 'on' : ''}">גאנט</button></div></div>
    ${planView === 'gantt' ? gantt : gantt.replace('class="gantt"', 'class="gantt" style="max-height:120px;overflow:hidden"').replace(/<div class="gantt-row"><span[\s\S]*$/, '</div></div>')}
  </div>
  ${list}`;
  bindPlan(p);
}

function bindPlan(p) {
  const pl = p.plan, v = $('#view');
  v.querySelectorAll('[data-tabgo]').forEach(b => b.onclick = () => go(b.dataset.tabgo));
  const regen = (o = {}) => { p.plan = buildPlan(p, { days: o.days ?? pl.days, level: o.level ?? pl.level, start: o.start ?? pl.start }); touch(); renderPlan(); };
  const changed = () => pl.events.some(e => e.done) || pl.custom;
  const ask = async () => !changed() || await confirmUI('בניית התכנית מחדש תמחק שינויים וסימוני ״בוצע״. להמשיך?', 'בנייה מחדש', true);
  $('#pl-start').onchange = e => { pl.start = e.target.value || todayISO(); touch(); renderPlan(); };
  $$('#pl-days button').forEach(b => b.onclick = async () => (await ask()) && regen({ days: +b.dataset.v }));
  $$('#pl-lvl button').forEach(b => b.onclick = async () => (await ask()) && regen({ level: +b.dataset.v }));
  $('#pl-regen').onclick = async () => (await ask()) && regen();
  $('#pl-rec').onchange = e => { planShowRec = e.target.checked; renderPlan(); };
  $$('#pl-view button').forEach(b => b.onclick = () => { planView = b.dataset.v; renderPlan(); });
  $('#ics').onclick = () => download(`marketing-plan-${shortAddr(p.q).replace(/\s+/g, '_')}.ics`, planToICS(p), 'text/calendar');
  $('#pl-add').onclick = async () => {
    const r = await dialog({ title: 'משימה / אירוע חדש', ok: 'הוספה', fields: [
      { k: 'title', label: 'שם המשימה' },
      { k: 'day', label: `יום בקמפיין (1–${pl.days})`, type: 'number', value: 14, min: 1, max: pl.days },
      { k: 'cat', label: 'קטגוריה', value: 'event', opts: Object.entries(CATS).map(([k, c]) => [k, c.t]) },
      { k: 'cost', label: 'עלות (₪)', type: 'number', value: 0 }] });
    if (!r || !r.title.trim()) return;
    pl.events.push({ id: uid(), day: clamp(Math.round(num(r.day)) || 1, 1, pl.days), cat: r.cat, title: r.title.trim(), desc: '', cost: num(r.cost) || 0, done: false });
    pl.events.sort((a, b) => a.day - b.day); pl.custom = true; touch(); renderPlan();
  };
  v.querySelectorAll('[data-jump]').forEach(d => d.onclick = () => { planView = 'list'; renderPlan(); const el = $('#ev-' + d.dataset.jump); el?.scrollIntoView({ behavior: 'smooth', block: 'center' }); el && (el.style.background = 'var(--chip)'); });
  v.querySelectorAll('[data-ev]').forEach(row => {
    const e = pl.events.find(x => x.id === row.dataset.ev);
    row.querySelectorAll('[data-e]').forEach(el => {
      const k = el.dataset.e;
      if (k === 'del') { el.onclick = () => { pl.events = pl.events.filter(x => x !== e); pl.custom = true; touch(); renderPlan(); }; return; }
      if (k === 'done') { el.onchange = () => { e.done = el.checked; touch(); row.classList.toggle('done', e.done); }; return; }
      el.addEventListener('input', () => { e[k] = k === 'title' ? el.value : num(el.value) || 0; pl.custom = true; touch(); });
      if (k === 'day' || k === 'cost') el.addEventListener('change', () => { if (k === 'day') { e.day = clamp(Math.round(e.day) || 1, 1, pl.days); pl.events.sort((a, b) => a.day - b.day); } renderPlan(); });
    });
  });
}
