// Reverse-mortgage presentation for Shiral Perger / MAKE SENSE.
// Run: NODE_PATH=<dir with pptxgenjs, react-icons, react, react-dom, sharp> node build.js
const path = require('path');
const pptxgen = require('pptxgenjs');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const L = require('react-icons/lu');
const sharp = require('sharp');
const { applyTheme } = require(process.env.PPTX_SKILL + '/scripts/apply_theme.js');

const A = f => path.join(__dirname, 'assets', f);
const OUT = path.join(__dirname, 'משכנתה-הפוכה-שיראל-פרגר.pptx');

const HEX = { navy: '001A4D', blue: '004AAD', cyan: '1FB3C8', teal: '137897', ice: 'E8F8FB', ink: '14213D', muted: '5A6478', line: 'DDE3EF', gray: 'F1F3F7', white: 'FFFFFF' };
const THEME = {
  name: 'MAKE SENSE', headFontFace: 'Arial', bodyFontFace: 'Arial',
  colors: { dk1: HEX.ink, lt1: HEX.white, dk2: HEX.navy, lt2: HEX.ice, accent1: HEX.blue, accent2: HEX.cyan, accent3: HEX.teal, accent4: HEX.muted, accent5: HEX.line, accent6: HEX.gray, hlink: HEX.blue, folHlink: HEX.teal },
};

async function icon(name, hex, px = 256) {
  const svg = renderToStaticMarkup(React.createElement(L[name], { size: px, color: '#' + hex }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return 'image/png;base64,' + buf.toString('base64');
}
async function dims(f) { const m = await sharp(A(f)).metadata(); return { w: m.width, h: m.height }; }

(async () => {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5
  pres.title = 'משכנתה הפוכה – שיראל פרגר, MAKE SENSE';
  pres.author = 'שיראל פרגר';
  pres.company = 'MAKE SENSE';
  pres.rtlMode = true;
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;
  const he = { rtlMode: true, lang: 'he-IL', align: 'right' };

  // ── layouts ──────────────────────────────────────────────
  const footer = [
    { image: { x: 0.45, y: 6.88, w: 0.86, h: 0.44, path: A('logo.png') } },
    { text: { text: 'MAKESENSE | שיראל פרגר – יועץ משכנתאות', options: { x: 1.38, y: 6.92, w: 4.6, h: 0.36, fontSize: 10, color: C.accent4, align: 'left', rtlMode: false, lang: 'he-IL', margin: 0 } } },
  ];
  pres.defineSlideMaster({
    title: 'CONTENT', background: { color: C.background1 },
    objects: [
      ...footer,
      { placeholder: { options: { name: 'title', type: 'title', x: 0.6, y: 0.35, w: 12.13, h: 0.8, fontSize: 32, bold: true, color: C.accent1, align: 'right', rtlMode: true, lang: 'he-IL', margin: 0, valign: 'middle' }, text: 'כותרת' } },
      { placeholder: { options: { name: 'sub', type: 'body', x: 0.6, y: 1.12, w: 12.13, h: 0.45, fontSize: 16, color: C.accent3, align: 'right', rtlMode: true, lang: 'he-IL', margin: 0, valign: 'top' }, text: 'כותרת משנה' } },
    ],
    slideNumber: { x: 12.35, y: 6.92, w: 0.5, h: 0.36, fontSize: 10, color: C.accent4, align: 'right' },
  });
  pres.defineSlideMaster({
    title: 'DARK', background: { color: C.text2 },
    objects: [
      { image: { x: 0.45, y: 6.88, w: 0.86, h: 0.44, path: A('logo-white.png') } },
      { text: { text: 'MAKESENSE | שיראל פרגר – יועץ משכנתאות', options: { x: 1.38, y: 6.92, w: 4.6, h: 0.36, fontSize: 10, color: C.background2, align: 'left', rtlMode: false, lang: 'he-IL', margin: 0 } } },
    ],
  });

  const ICON = {};
  const need = ['LuHouse', 'LuBanknote', 'LuScale', 'LuUsers', 'LuCreditCard', 'LuSun', 'LuHeartPulse', 'LuPaintRoller', 'LuShieldCheck', 'LuRefreshCw', 'LuCalendarHeart', 'LuSearch', 'LuSlidersHorizontal', 'LuHeart', 'LuGraduationCap', 'LuFileText', 'LuPhone', 'LuMail', 'LuArrowDownToLine', 'LuArrowUpFromLine', 'LuUserCheck', 'LuUmbrella', 'LuBuilding2', 'LuKeyRound', 'LuFlag', 'LuScrollText', 'LuLandmark', 'LuCircleCheck', 'LuCircleX', 'LuHandCoins', 'LuPlane', 'LuBadgeCheck', 'LuGavel', 'LuClipboardList', 'LuPercent', 'LuInfo', 'LuBriefcase'];
  for (const n of need) { ICON[n + '_w'] = await icon(n, HEX.white); ICON[n + '_b'] = await icon(n, HEX.blue); ICON[n + '_t'] = await icon(n, HEX.teal); ICON[n + '_g'] = await icon(n, '8A93A6'); }

  const T = (s, text, o) => s.addText(text, { isTextBox: true, ...he, fontSize: 16, color: C.text1, margin: 0, ...o });
  const shadow = () => ({ type: 'outer', color: '00337A', blur: 10, offset: 3, angle: 90, opacity: 0.12 });
  const card = (s, x, y, w, h, fill = C.background1, name) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.14, fill: { color: fill }, line: { color: HEX.line, width: 0.75 }, shadow: shadow(), objectName: name });
  const bubble = (s, x, y, d, fill, ic, name) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { type: 'none' }, objectName: name });
    s.addImage({ data: ICON[ic], x: x + d * 0.24, y: y + d * 0.24, w: d * 0.52, h: d * 0.52, altText: '' });
  };
  const content = (title, sub, section) => { const s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: section }); s.addText(title, { placeholder: 'title', ...he }); s.addText(sub, { placeholder: 'sub', ...he }); return s; };
  const photo = async (s, f, x, y, w, h, extra = {}) => { const d = await dims(f); s.addImage({ path: A(f), x, y, w, h, sizing: { type: 'cover', w, h }, altText: extra.alt || '', rounding: extra.round || false }); };

  // ── 1 · COVER ────────────────────────────────────────────
  pres.addSection({ title: 'פתיחה' });
  let s = pres.addSlide({ masterName: 'DARK', sectionTitle: 'פתיחה' });
  await photo(s, 'sunset-family.jpg', 0, 0, 5.9, 7.5, { alt: 'משפחה רב-דורית בשקיעה' });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.9, y: 0, w: 0.08, h: 7.5, fill: { color: C.accent2 }, line: { type: 'none' }, objectName: 'divider' });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 10.0, y: 0.7, w: 2.75, h: 1.45, rectRadius: 0.16, fill: { color: C.background1 }, line: { type: 'none' }, objectName: 'logo card' });
  s.addImage({ path: A('logo.png'), x: 10.2, y: 0.83, w: 2.35, h: 1.2, altText: 'MAKE SENSE' });
  T(s, [{ text: 'משכנתה הפוכה', options: { breakLine: true, color: C.background1 } }, { text: 'נזילות פיננסית', options: { breakLine: true, color: C.accent2 } }, { text: 'ונכס נשאר במשפחה', options: { color: C.background1 } }], { x: 6.5, y: 2.45, w: 6.25, h: 2.4, fontSize: 44, bold: true, fontFace: THEME.headFontFace, valign: 'top', lineSpacingMultiple: 0.95 });
  T(s, 'פתרון מימון גמיש ומותאם אישית, מגיל 55 ומעלה', { x: 6.5, y: 4.95, w: 6.25, h: 0.5, fontSize: 20, color: C.background2 });
  const pills = [['LuHouse', 'הבית נשאר שלכם'], ['LuBanknote', 'כסף נזיל'], ['LuUsers', 'שקט למשפחה']];
  pills.forEach(([ic, t], i) => {
    const x = 10.6 - i * 2.25;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 5.75, w: 2.15, h: 0.48, rectRadius: 0.24, fill: { color: C.accent2, transparency: 82 }, line: { color: HEX.cyan, width: 1 }, objectName: 'pill ' + (i + 1) });
    s.addImage({ data: ICON[ic + '_w'], x: x + 1.75, y: 5.85, w: 0.28, h: 0.28, altText: '' });
    T(s, t, { x: x + 0.1, y: 5.75, w: 1.6, h: 0.48, fontSize: 13, bold: true, color: C.background1, valign: 'middle' });
  });
  T(s, [{ text: 'שיראל פרגר', options: { bold: true, color: C.accent2 } }, { text: ' | ייעוץ משכנתאות ופתרונות מימון', options: { color: C.background1 } }], { x: 6.5, y: 6.85, w: 6.25, h: 0.4, fontSize: 14 });
  s.addNotes('פתיחה: משכנתה הפוכה היא דרך להפוך חלק מהשווי של הבית לכסף נזיל, בלי למכור אותו ובלי לעזוב אותו. היום נעבור על איך זה עובד, למי זה מתאים, מה ההבדל בין המסלולים בחברות הביטוח ובבנקים, ואיך עושים את זה נכון.');

  // ── 2 · ABOUT SHIRAL ─────────────────────────────────────
  s = content('נעים להכיר: שיראל פרגר', 'יועץ משכנתאות, מימון נדל״ן והתנהלות מול גופים פיננסיים | MAKE SENSE', 'פתיחה');
  s.addShape(pres.shapes.OVAL, { x: 0.75, y: 1.85, w: 3.3, h: 3.3, fill: { color: C.background2 }, line: { color: HEX.cyan, width: 4 }, objectName: 'photo ring' });
  await photo(s, 'shiral.jpg', 0.85, 1.95, 3.1, 3.1, { round: true, alt: 'שיראל פרגר' });
  const creds = [['LuGraduationCap', 'B.A כלכלה וניהול'], ['LuGraduationCap', 'M.B.A מנהל עסקים, התמחות בייעוץ עסקי'], ['LuBadgeCheck', 'חבר בהתאחדות יועצי המשכנתאות'], ['LuKeyRound', '4 עסקאות נדל״ן אישיות'], ['LuUsers', 'עשרות משפחות מלוות']];
  creds.forEach(([ic, t], i) => {
    const y = 1.85 + i * 0.6;
    bubble(s, 12.2, y, 0.48, C.background2, ic + '_t', 'cred icon ' + (i + 1));
    T(s, t, { x: 5.0, y, w: 7.05, h: 0.48, fontSize: 17, bold: i < 3, valign: 'middle' });
  });
  card(s, 5.0, 4.95, 7.73, 1.0, C.background2, 'story');
  T(s, [{ text: 'ראיתי מקרוב את ההורים שלי מתמודדים עם החלטות כלכליות גדולות בלי איש מקצוע לצידם. ', options: {} }, { text: 'לכן אני מלווה כל משפחה כאילו היא המשפחה שלי.', options: { bold: true, color: C.accent1 } }], { x: 5.25, y: 5.02, w: 7.25, h: 0.86, fontSize: 15, valign: 'middle', italic: true });
  const clients = ['client-003.jpg', 'client-024.jpg', 'client-042.jpg', 'client-027.jpg'];
  for (let i = 0; i < clients.length; i++) await photo(s, clients[i], 0.75 + i * 0.85, 5.45, 0.78, 0.58, { alt: 'לקוחות של שיראל' });
  T(s, 'לקוחות שליוויתי', { x: 0.75, y: 6.08, w: 3.3, h: 0.3, fontSize: 11, color: C.accent4, align: 'center' });
  s.addNotes('כמה מילים עליי: יועץ משכנתאות ומימון, עם רקע אקדמי בכלכלה ובמנהל עסקים, חבר בהתאחדות יועצי המשכנתאות. הסיפור האישי שלי, ההורים שלי שנאלצו להתמודד בלי ליווי, הוא הסיבה שאני מלווה כל משפחה כאילו היא שלי.');

  // ── 3 · WHAT IS IT ───────────────────────────────────────
  pres.addSection({ title: 'מהי משכנתה הפוכה' });
  s = content('מהי משכנתה הפוכה?', 'הלוואה בשעבוד הבית, בלי לוותר על הבית. 3 עמודי התווך', 'מהי משכנתה הפוכה');
  const pillars = [['LuHouse', 'הנכס נשאר שלכם', 'בעלות מלאה ומגורים בבית לכל החיים'], ['LuBanknote', 'גמישות בקבלת הכסף', 'סכום חד-פעמי, קצבה חודשית, או משיכה בפעימות לפי צורך'], ['LuScale', 'החזר לפי הצרכים', 'אפס החזר, ריבית בלבד, או החזר חודשי רגיל']];
  pillars.forEach(([ic, t, d], i) => {
    const x = 8.85 - i * 4.1;
    card(s, x, 1.95, 3.85, 4.35, C.background1, 'pillar ' + (i + 1));
    bubble(s, x + 1.3, 2.3, 1.25, i === 1 ? C.accent2 : C.accent1, ic + '_w', 'pillar icon ' + (i + 1));
    T(s, t, { x: x + 0.3, y: 3.8, w: 3.25, h: 0.6, fontSize: 22, bold: true, color: C.accent1, align: 'center' });
    T(s, d, { x: x + 0.3, y: 4.45, w: 3.25, h: 1.3, fontSize: 16, color: C.accent4, align: 'center', valign: 'top' });
  });
  T(s, 'מגיל 55 · פטור מביטוח חיים · ביטוח מבנה חובה', { x: 0.6, y: 6.4, w: 12.13, h: 0.35, fontSize: 14, bold: true, color: C.accent3, align: 'center' });
  s.addNotes('משכנתה הפוכה היא הלוואה בשעבוד דירה שבבעלותכם, כבר מגיל 55. הבית נשאר שלכם, מקבלים כסף בצורה שמתאימה לכם, ובוחרים איך להחזיר: אפשר בכלל לא לשלם עד סוף הדרך, לשלם רק ריבית, או החזר חודשי רגיל. אין חובת ביטוח חיים, ביטוח מבנה הוא חובה.');

  // ── 4 · GOALS ────────────────────────────────────────────
  s = content('מה אפשר לעשות עם הכסף?', 'סיבות ומטרות נפוצות לקחת משכנתה הפוכה', 'מהי משכנתה הפוכה');
  await photo(s, 'beach-family.jpg', 0.6, 1.85, 3.6, 4.7, { alt: 'משפחה בחוף' });
  const goals = [['LuUsers', 'עזרה לילדים ולנכדים', 'דירה, חתונה, לימודים'], ['LuCreditCard', 'סגירת חובות', 'משכנתה קיימת או הלוואות יקרות'], ['LuHandCoins', 'השלמת הכנסה', 'ושמירה על רמת החיים בפרישה'], ['LuHeartPulse', 'בריאות וסיעוד', 'טיפולים, סיעוד והתאמות'], ['LuPaintRoller', 'שיפוץ, הרחבה וממ״ד', 'ובית נגיש ומותאם לגיל'], ['LuPlane', 'איכות חיים', 'טיולים, תחביבים ושקט נפשי']];
  goals.forEach(([ic, t, d], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 8.75 - col * 4.25, y = 1.85 + row * 1.6;
    card(s, x, y, 4.0, 1.4, C.background1, 'goal ' + (i + 1));
    bubble(s, x + 3.0, y + 0.3, 0.8, i % 2 ? C.accent2 : C.accent1, ic + '_w', 'goal icon ' + (i + 1));
    T(s, t, { x: x + 0.2, y: y + 0.25, w: 2.7, h: 0.45, fontSize: 18, bold: true, color: C.accent1 });
    T(s, d, { x: x + 0.2, y: y + 0.72, w: 2.7, h: 0.45, fontSize: 14, color: C.accent4 });
  });
  s.addNotes('הכסף ניתן לכל מטרה. הנפוצות: לעזור לילדים לקנות דירה, לסגור משכנתה או הלוואות יקרות, להשלים הכנסה בפרישה, לממן טיפולים, לשפץ, להרחיב או להוסיף ממ״ד, ופשוט ליהנות מאיכות חיים.');

  // ── 5 · LIFE WITH / WITHOUT ──────────────────────────────
  s = content('עם או בלי? ההבדל מורגש', 'איך נראים החיים בגיל השלישי, עם משכנתה הפוכה ובלעדיה', 'מהי משכנתה הפוכה');
  card(s, 6.95, 1.9, 5.78, 4.6, C.accent6, 'without');
  bubble(s, 12.0, 2.15, 0.55, '8A93A6', 'LuCircleX_w', 'x icon');
  T(s, 'בלי משכנתה הפוכה', { x: 7.2, y: 2.15, w: 4.7, h: 0.55, fontSize: 22, bold: true, color: C.accent4, valign: 'middle' });
  const without = [['LuBanknote', 'מחיה מקצבה דלה'], ['LuUsers', 'נשענים על הילדים'], ['LuHouse', 'בית שלא מותאם לגיל'], ['LuCreditCard', 'החזרים חודשיים גבוהים']];
  without.forEach(([ic, t], i) => { const y = 3.0 + i * 0.82; s.addImage({ data: ICON[ic + '_g'], x: 12.05, y: y + 0.08, w: 0.42, h: 0.42, altText: '' }); T(s, t, { x: 7.2, y, w: 4.7, h: 0.58, fontSize: 18, color: C.accent4, valign: 'middle' }); });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.9, w: 6.05, h: 4.6, rectRadius: 0.14, fill: { color: C.accent1 }, line: { type: 'none' }, shadow: shadow(), objectName: 'with' });
  bubble(s, 5.85, 2.15, 0.55, C.accent2, 'LuCircleCheck_w', 'check icon');
  T(s, 'עם משכנתה הפוכה', { x: 0.85, y: 2.15, w: 4.9, h: 0.55, fontSize: 22, bold: true, color: C.background1, valign: 'middle' });
  const withL = [['LuHandCoins', 'הכנסה נוספת ועצמאות כלכלית'], ['LuHeart', 'עוזרים לילדים, במקום להישען עליהם'], ['LuPaintRoller', 'שיפוץ, הרחבה או ממ״ד בבית'], ['LuSun', 'שמחה ואיכות חיים, כבר עכשיו']];
  withL.forEach(([ic, t], i) => { const y = 3.0 + i * 0.82; s.addImage({ data: ICON[ic + '_w'], x: 5.9, y: y + 0.08, w: 0.42, h: 0.42, altText: '' }); T(s, t, { x: 0.85, y, w: 4.9, h: 0.58, fontSize: 18, bold: true, color: C.background1, valign: 'middle' }); });
  s.addNotes('בלי פתרון, הרבה אנשים בגיל השלישי חיים מקצבה דלה, נשענים על הילדים, גרים בבית שלא מתאים להם ומשלמים החזרים גבוהים. עם משכנתה הפוכה הם מקבלים עצמאות, עוזרים לילדים במקום להישען עליהם, ונהנים מהחיים כבר עכשיו.');

  // ── 6 · TRACKS ───────────────────────────────────────────
  pres.addSection({ title: 'מסלולים וכמה כסף' });
  s = content('איך מקבלים ואיך מחזירים?', 'שני צירים, ותמהיל אחד שמתאים בדיוק לכם', 'מסלולים וכמה כסף');
  const rows = [
    ['איך מקבלים?', 'LuArrowDownToLine', C.accent2, [['סכום חד-פעמי', 'מראש, בבת אחת'], ['קצבה חודשית', 'להגדלת ההכנסה השוטפת'], ['משיכות לפי צורך', 'בפעימות, כשצריך']]],
    ['איך מחזירים?', 'LuArrowUpFromLine', C.accent1, [['ללא החזר חודשי', 'בלון מלא: הכל בסוף הדרך'], ['ריבית בלבד', 'בלון חלקי: הקרן בסוף'], ['החזר חודשי קבוע', 'שפיצר: החוב קטן']]],
  ];
  rows.forEach(([label, ic, col, opts], r) => {
    const y = 1.95 + r * 2.35;
    card(s, 0.6, y, 12.13, 2.1, C.background1, 'axis ' + (r + 1));
    bubble(s, 11.65, y + 0.25, 0.8, col, ic + '_w', 'axis icon ' + (r + 1));
    T(s, label, { x: 9.3, y: y + 0.3, w: 2.25, h: 0.7, fontSize: 22, bold: true, color: C.accent1, valign: 'middle' });
    opts.forEach(([t, d], i) => {
      const x = 6.45 - i * 2.8;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: y + 0.25, w: 2.6, h: 1.6, rectRadius: 0.12, fill: { color: r ? 'E6EEFA' : C.background2 }, line: { type: 'none' }, objectName: `option ${r + 1}.${i + 1}` });
      T(s, t, { x: x + 0.15, y: y + 0.45, w: 2.3, h: 0.5, fontSize: 18, bold: true, color: C.accent1, align: 'center' });
      T(s, d, { x: x + 0.15, y: y + 0.98, w: 2.3, h: 0.7, fontSize: 14, color: C.accent4, align: 'center', valign: 'top' });
    });
  });
  s.addNotes('שני צירים: איך מקבלים את הכסף, חד-פעמי, קצבה או משיכות, ואיך מחזירים. ללא החזר: הכל בסוף. ריבית בלבד: משלמים ריבית, והקרן בסוף. שפיצר: החזר חודשי רגיל שמקטין את החוב. משלבים את מה שמתאים למשפחה.');

  // ── 7 · DEBT OVER TIME (native charts) ───────────────────
  s = content('שווי הנכס תמיד מעל יתרת החוב', 'התפתחות החוב לפי שיטת ההחזר, מהיום ועד 120 (להמחשה)', 'מסלולים וכמה כסף');
  const labels = ['היום', '+5', '+10', '+15', 'עד 120'];
  const value = [100, 108, 117, 126, 136];
  const debts = [['ללא החזר חודשי', 'החוב גדל מהר יותר', [30, 38, 48, 60, 75]], ['ריבית בלבד', 'החוב גדל לאט', [30, 31, 32, 33, 34]], ['שפיצר', 'החוב הולך וקטן', [30, 23, 15, 7, 0]]];
  debts.forEach(([t, cap, d], i) => {
    const x = 8.75 - i * 4.07;
    card(s, x, 1.85, 3.95, 4.65, C.background1, 'chart card ' + (i + 1));
    T(s, t, { x: x + 0.2, y: 1.98, w: 3.55, h: 0.45, fontSize: 18, bold: true, color: C.accent1, align: 'center' });
    s.addChart(pres.charts.LINE, [{ name: 'שווי הנכס', labels, values: value }, { name: 'יתרת החוב', labels, values: d }], {
      x: x + 0.1, y: 2.45, w: 3.75, h: 3.3, chartColors: [HEX.cyan, HEX.blue], lineSize: 3, lineDataSymbol: 'none',
      showLegend: true, legendPos: 'b', legendFontSize: 11, legendFontFace: '+mn-lt', legendColor: HEX.muted,
      catAxisLabelColor: HEX.muted, catAxisLabelFontSize: 11, catAxisLabelFontFace: '+mn-lt',
      valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 140, valGridLine: { color: HEX.line, size: 0.5 }, catGridLine: { style: 'none' },
      showTitle: false, objectName: 'debt chart ' + (i + 1), altText: `${t}: שווי הנכס עולה, ${cap}`,
    });
    T(s, cap, { x: x + 0.2, y: 5.85, w: 3.55, h: 0.45, fontSize: 16, bold: true, color: i === 2 ? C.accent3 : C.accent1, align: 'center' });
  });
  T(s, 'בכל אחד מהמסלולים, שווי הנכס נשאר גבוה מיתרת החוב', { x: 0.6, y: 6.5, w: 12.13, h: 0.35, fontSize: 14, bold: true, color: C.accent3, align: 'center' });
  s.addNotes('כך נראה החוב לאורך השנים. בשפיצר החוב יורד לאפס. בריבית בלבד הוא גדל לאט, בעיקר בגלל הצמדה. ללא החזר הוא גדל מהר יותר, בגלל ריבית דריבית. אבל בכל המסלולים שווי הנכס, שעולה לאורך השנים, נשאר גבוה מהחוב. המספרים להמחשה.');

  // ── 8 · HOW MUCH (native chart) ──────────────────────────
  s = content('כמה מגיע לכם?', 'אחוז המימון המרבי משווי הנכס בשוק, לפי גיל הלווה הצעיר', 'מסלולים וכמה כסף');
  s.addChart(pres.charts.BAR, [{ name: 'מימון מרבי', labels: ['55', '60', '70', '80', '90+'], values: [35, 39, 48, 50, 60] }], {
    x: 0.6, y: 1.8, w: 7.6, h: 4.85, barDir: 'col', barGapWidthPct: 45, chartColors: [HEX.blue],
    showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0"%"', dataLabelColor: HEX.blue, dataLabelFontSize: 14, dataLabelFontBold: true, dataLabelFontFace: '+mn-lt',
    catAxisLabelColor: HEX.muted, catAxisLabelFontSize: 14, catAxisLabelFontFace: '+mn-lt', catAxisTitle: 'גיל הלווה הצעיר', showCatAxisTitle: true, catAxisTitleColor: HEX.muted, catAxisTitleFontSize: 12, catAxisTitleFontFace: '+mn-lt',
    valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 70, valGridLine: { color: HEX.line, size: 0.5 }, catGridLine: { style: 'none' }, showLegend: false,
    showTitle: true, title: 'מימון מרבי בשוק (%)', titleColor: HEX.ink, titleFontSize: 14, titleFontFace: '+mn-lt', objectName: 'max financing chart', altText: 'מימון מרבי לפי גיל: 55 – 35%, 60 – 39%, 70 – 48%, 80 – 50%, 90+ – 60%',
  });
  const ranges = [['גיל 55', '15%–35%'], ['גיל 60', '20%–39%'], ['גיל 70', '30%–48%'], ['גיל 80', 'עד 50%'], ['גיל 90 ומעלה', '50%–60%']];
  card(s, 8.6, 1.8, 4.13, 4.85, C.background2, 'ranges');
  T(s, 'הטווח בשוק', { x: 8.85, y: 1.95, w: 3.65, h: 0.5, fontSize: 20, bold: true, color: C.accent1 });
  ranges.forEach(([a, r], i) => { const y = 2.55 + i * 0.72; T(s, a, { x: 10.55, y, w: 1.95, h: 0.55, fontSize: 17, bold: true, color: C.accent3, valign: 'middle' }); T(s, r.startsWith('עד') ? r : r, { x: 8.85, y, w: 1.95, h: 0.55, fontSize: 19, bold: true, color: C.accent1, align: 'left', valign: 'middle', rtlMode: r.startsWith('עד') }); });
  T(s, 'השיעור בפועל נקבע לפי הגוף המלווה, הנכס והשמאות', { x: 8.85, y: 6.15, w: 3.65, h: 0.4, fontSize: 11, color: C.accent4 });
  s.addNotes('ככל שהגיל עולה, שיעור המימון עולה. בגיל 55 מדובר בסביבות 15 עד 35 אחוז משווי הנכס, ובגיל 90 ומעלה עד 50 עד 60 אחוז. אלה טווחים מהשוואת השוק; השיעור בפועל תלוי בגוף, בנכס ובשמאות.');

  // ── 9 · INSURERS vs BANKS (table) ────────────────────────
  pres.addSection({ title: 'חברות ביטוח מול בנקים' });
  s = content('חברות ביטוח מול בנקים: מה ההבדל?', 'משכנתה הפוכה בחברות הביטוח, מול משכנתה לגיל השלישי (פנסיונית) בבנקים', 'חברות ביטוח מול בנקים');
  const hd = (t, fill, col) => ({ text: t, options: { bold: true, fontSize: 15, color: col, fill: { color: fill }, align: 'center', valign: 'middle', rtlMode: true, lang: 'he-IL' } });
  const cell = (t, o = {}) => ({ text: t, options: { fontSize: 13, color: HEX.ink, align: 'right', valign: 'middle', rtlMode: true, lang: 'he-IL', ...o } });
  const topic = t => cell(t, { bold: true, color: HEX.blue, fill: { color: HEX.ice } });
  const cmp = [
    ['גוף מפקח', 'רשות שוק ההון, ביטוח וחיסכון', 'בנק ישראל (הוראות ניהול בנקאי תקין)'],
    ['בדיקת הכנסות', 'במסלול ללא החזר, בדרך כלל ללא בדיקת יכולת החזר', 'לרוב נבדקת יכולת ההחזר, במיוחד במסלולים עם תשלום חודשי'],
    ['תקופת ההלוואה', 'ללא מועד פירעון קבוע: עד מכירה, מעבר או פטירה', 'תקופה מוגדרת מראש (לדוגמה עד 30 שנה)'],
    ['החזר חודשי', 'אפס החזר, ריבית בלבד או שפיצר', 'לרוב תשלום ריבית או החזר חודשי'],
    ['אופן קבלת הכסף', 'חד-פעמי, ובחלק מהגופים גם קצבה חודשית ומשיכות', 'בעיקר סכום חד-פעמי'],
    ['עמלת פירעון מוקדם', 'בחלק מהגופים אין; באחרים רק בשנים הראשונות', 'לפי כללי בנק ישראל (בעיקר במסלולים קבועים)'],
    ['תנאי סף ודרישות', 'שווי נכס מינימלי (לרוב 1–1.5 מיליון ₪), יידוע ילדים, אישור רפואי מגיל 75–80', 'אישורים רפואיים וחתימת הילדים, לפי מדיניות הבנק'],
    ['גמישות', 'מוצר ייעודי לגיל השלישי, גמיש במשיכות ובמסלולי ההחזר', 'מוצר משכנתה בהתאמה לגיל, לעיתים ריבית נמוכה כשיש יכולת החזר'],
  ];
  const tbl = [[hd('בנקים: משכנתה לגיל השלישי', HEX.blue, HEX.white), hd('חברות ביטוח: משכנתה הפוכה', HEX.teal, HEX.white), hd('נושא', HEX.ice, HEX.blue)]];
  cmp.forEach(([a, ins, bank]) => tbl.push([cell(bank), cell(ins), topic(a)]));
  s.addTable(tbl, { x: 0.6, y: 1.75, w: 12.13, colW: [4.75, 4.75, 2.63], rowH: 0.52, border: { type: 'solid', color: HEX.line, pt: 0.75 }, fontFace: THEME.bodyFontFace, margin: [0.04, 0.12, 0.04, 0.12], objectName: 'insurers vs banks table' });
  T(s, 'ההשוואה כללית; התנאים משתנים בין הגופים ומתעדכנים. בבדיקה אישית משווים בין 2–3 גופים רלוונטיים.', { x: 0.6, y: 6.5, w: 12.13, h: 0.32, fontSize: 11, color: C.accent4 });
  s.addNotes('זה ההבדל המרכזי. חברות הביטוח מפוקחות על ידי רשות שוק ההון, ובמסלול ללא החזר בדרך כלל לא בודקות הכנסות, כי אין תשלום חודשי. ההלוואה בלי מועד פירעון קבוע. בבנקים, המפוקחים על ידי בנק ישראל, המוצר לגיל השלישי הוא לרוב בתקופה מוגדרת, ונבדקת יכולת החזר כשיש תשלום חודשי. כל אחד מתאים לפרופיל אחר, ותנאים משתנים בין הגופים.');

  // ── 10 · WHICH FITS WHOM ─────────────────────────────────
  s = content('מה מתאים למי?', 'הבחירה תלויה בהכנסה, במטרה ובמה שרוצים להשאיר לילדים', 'חברות ביטוח מול בנקים');
  const fits = [
    [8.85, HEX.teal, 'LuUmbrella', 'חברת ביטוח מתאימה כש…', ['אין הכנסה שוטפת שמספיקה לבדיקה', 'רוצים אפס החזר חודשי', 'רוצים קצבה חודשית או משיכות לפי צורך', 'רוצים הלוואה בלי מועד פירעון קבוע']],
    [4.75, HEX.blue, 'LuLandmark', 'בנק מתאים כש…', ['יש פנסיה או הכנסה יציבה', 'אפשר לשלם ריבית או החזר חודשי', 'רוצים לשמור על ההון שעובר לילדים', 'מתאים פריסה לתקופה מוגדרת']],
  ];
  fits.forEach(([x, col, ic, t, items], k) => {
    card(s, x, 1.85, 3.88, 4.65, C.background1, 'fit ' + (k + 1));
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.85, w: 3.88, h: 0.95, rectRadius: 0.14, fill: { color: col }, line: { type: 'none' }, objectName: 'fit head ' + (k + 1) });
    s.addImage({ data: ICON[ic + '_w'], x: x + 3.2, y: 2.08, w: 0.5, h: 0.5, altText: '' });
    T(s, t, { x: x + 0.15, y: 1.95, w: 3.0, h: 0.75, fontSize: 17, bold: true, color: C.background1, valign: 'middle' });
    items.forEach((it, i) => { const yy = 3.05 + i * 0.82; s.addImage({ data: ICON[(k ? 'LuCircleCheck_b' : 'LuCircleCheck_t')], x: x + 3.3, y: yy + 0.06, w: 0.34, h: 0.34, altText: '' }); T(s, it, { x: x + 0.2, y: yy, w: 3.0, h: 0.72, fontSize: 15, valign: 'top' }); });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.85, w: 3.85, h: 4.65, rectRadius: 0.14, fill: { color: C.text2 }, line: { type: 'none' }, objectName: 'advisor box' });
  bubble(s, 1.95, 2.15, 1.1, C.accent2, 'LuSearch_w', 'advisor icon');
  T(s, 'התפקיד שלי', { x: 0.85, y: 3.4, w: 3.35, h: 0.5, fontSize: 22, bold: true, color: C.background1, align: 'center' });
  T(s, 'לבדוק את שני העולמות, להשוות בין 2–3 גופים רלוונטיים, ולבנות את התמהיל שמתאים למשפחה שלכם', { x: 0.85, y: 3.95, w: 3.35, h: 2.2, fontSize: 16, color: C.background2, align: 'center', valign: 'top' });
  s.addNotes('בקצרה: אם אין הכנסה שוטפת או שרוצים אפס החזר, חברת ביטוח מתאימה יותר. אם יש פנסיה יציבה ואפשר לשלם ריבית, בנק יכול להיות זול יותר ולשמור על ההון לירושה. אני בודק את שני העולמות ומשווה בין 2–3 גופים רלוונטיים.');

  // ── 11 · PROTECTIONS ─────────────────────────────────────
  pres.addSection({ title: 'ביטחון, תהליך ועלויות' });
  s = content('ביטחון ושקיפות למשפחה וליורשים', 'הגנות שחשוב לבדוק בכל הצעה', 'ביטחון, תהליך ועלויות');
  const prots = [['LuShieldCheck', 'הגנת חוב', 'החוב לא יעלה על שווי הנכס במועד הפירעון'], ['LuRefreshCw', 'גמישות', 'פירעון או שינוי מסלול בכל עת; בחלק מהגופים ללא עמלת פירעון מוקדם'], ['LuCalendarHeart', 'זכויות היורשים', 'לאחר 120: שנה שלמה להסדיר את החוב או למכור את הנכס בעצמם']];
  prots.forEach(([ic, t, d], i) => {
    const x = 8.85 - i * 4.1;
    card(s, x, 1.9, 3.85, 3.6, C.background1, 'protection ' + (i + 1));
    bubble(s, x + 1.4, 2.2, 1.05, i === 1 ? C.accent2 : C.accent1, ic + '_w', 'protection icon ' + (i + 1));
    T(s, t, { x: x + 0.3, y: 3.45, w: 3.25, h: 0.55, fontSize: 22, bold: true, color: C.accent1, align: 'center' });
    T(s, d, { x: x + 0.3, y: 4.05, w: 3.25, h: 1.3, fontSize: 15, color: C.accent4, align: 'center', valign: 'top' });
  });
  const facts = [['LuUserCheck', 'מגיל 55'], ['LuUmbrella', 'פטור מביטוח חיים'], ['LuBuilding2', 'ביטוח מבנה חובה']];
  facts.forEach(([ic, t], i) => {
    const x = 8.85 - i * 4.1;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 5.75, w: 3.85, h: 0.7, rectRadius: 0.35, fill: { color: C.background2 }, line: { type: 'none' }, objectName: 'fact ' + (i + 1) });
    s.addImage({ data: ICON[ic + '_t'], x: x + 3.25, y: 5.88, w: 0.44, h: 0.44, altText: '' });
    T(s, t, { x: x + 0.2, y: 5.75, w: 2.95, h: 0.7, fontSize: 17, bold: true, color: C.accent3, valign: 'middle' });
  });
  s.addNotes('שלוש הגנות שחשוב לבדוק: שהחוב לא יעלה על שווי הנכס, גמישות לפרוע או לשנות מסלול, ותנאים ליורשים אחרי 120. חשוב לוודא את הסעיפים האלה בחוזה של כל גוף.');

  // ── 12 · ROADMAP ─────────────────────────────────────────
  s = content('מפת הדרך: 5 צעדים פשוטים', 'ואני מטפל בכל השאר', 'ביטחון, תהליך ועלויות');
  const steps = [['LuClipboardList', 'פגישה ואיסוף מסמכים', 'מבינים את הצורך ואוספים מסמכים בפגישה אחת'], ['LuFileText', 'הגשה ואישורים', 'הגשה ל-2–3 גופים מתאימים ואישורים עקרוניים'], ['LuSlidersHorizontal', 'בניית תמהיל', 'ובחירת שיטת ההחזר שמתאימה לכם'], ['LuSearch', 'שמאות', 'ואישור רפואי, רק אם נדרש לפי הגיל'], ['LuKeyRound', 'חתימה ורישום', 'חוזה, שעבוד וביטוח מבנה']];
  s.addShape(pres.shapes.LINE, { x: 1.4, y: 2.62, w: 10.6, h: 0, line: { color: HEX.cyan, width: 4, dashType: 'dash' }, objectName: 'road' });
  steps.forEach(([ic, t, d], i) => {
    const x = 10.85 - i * 2.4;
    bubble(s, x + 0.45, 2.0, 1.25, i % 2 ? C.accent2 : C.accent1, ic + '_w', 'step icon ' + (i + 1));
    s.addShape(pres.shapes.OVAL, { x: x + 1.35, y: 1.9, w: 0.45, h: 0.45, fill: { color: C.background1 }, line: { color: HEX.blue, width: 1.5 }, objectName: 'step number ' + (i + 1) });
    T(s, String(i + 1), { x: x + 1.35, y: 1.9, w: 0.45, h: 0.45, fontSize: 14, bold: true, color: C.accent1, align: 'center', valign: 'middle' });
    T(s, t, { x, y: 3.45, w: 2.15, h: 0.75, fontSize: 17, bold: true, color: C.accent1, align: 'center', valign: 'top' });
    T(s, d, { x, y: 4.2, w: 2.15, h: 0.95, fontSize: 14, color: C.accent4, align: 'center', valign: 'top' });
  });
  card(s, 0.6, 5.4, 12.13, 1.15, C.background2, 'related');
  s.addImage({ data: ICON.LuScrollText_t, x: 12.05, y: 5.6, w: 0.5, h: 0.5, altText: '' });
  T(s, 'מומלץ להסדיר במקביל', { x: 8.6, y: 5.5, w: 3.35, h: 0.45, fontSize: 17, bold: true, color: C.accent1 });
  T(s, [{ text: 'ייפוי כוח מתמשך: ', options: { bold: true, color: C.accent3 } }, { text: 'בוחרים מראש מי יחליט בשבילכם אם יידרש. ', options: {} }, { text: 'צוואה: ', options: { bold: true, color: C.accent3 } }, { text: 'מסדירה את הדירה והיתרה ומונעת מחלוקות.', options: {} }], { x: 0.85, y: 5.95, w: 11.1, h: 0.5, fontSize: 14 });
  s.addNotes('התהליך קצר: פגישה אחת לאיסוף מסמכים, הגשה ל-2–3 גופים מתאימים, בניית תמהיל ושיטת החזר, שמאות, וחתימה. במקביל כדאי להסדיר ייפוי כוח מתמשך וצוואה.');

  // ── 13 · WITH / WITHOUT ADVISOR ──────────────────────────
  s = content('התהליך בלי יועץ, מול התהליך איתי', 'אותה מטרה. דרך אחרת לגמרי', 'ביטחון, תהליך ועלויות');
  const adv = [['השוואה', 'פונים לגוף אחד ומקבלים את ההצעה שלו', 'השוואה בין 2–3 גופים רלוונטיים'], ['מסלול', 'מסלול סטנדרטי אחד', 'תמהיל מותאם שמפחית עלויות ריבית'], ['עלויות', 'מגלים אותן תוך כדי', 'כל העלויות שקופות מראש'], ['ניירת', 'לבד מול טפסים ואישורים', 'פגישה אחת לאיסוף מסמכים, ואני מטפל בשאר'], ['המשפחה', 'החלטה בלי תמונה מלאה', 'שקיפות וביטחון לכל המשפחה'], ['אחרי החתימה', 'אתם לבד', 'ליווי גם אחרי קבלת הכסף']];
  const t2 = [[hd('✓  עם שיראל פרגר', HEX.blue, HEX.white), hd('✕  בלי יועץ', 'E3E6EC', HEX.muted), hd('נושא', HEX.ice, HEX.blue)]];
  adv.forEach(([a, no, yes]) => t2.push([cell(yes, { bold: true, fill: { color: 'E3F5F8' } }), cell(no, { color: HEX.muted, fill: { color: 'F6F7F9' } }), topic(a)]));
  s.addTable(t2, { x: 0.6, y: 1.8, w: 12.13, colW: [4.9, 4.9, 2.33], rowH: 0.62, border: { type: 'solid', color: HEX.white, pt: 2 }, fontFace: THEME.bodyFontFace, margin: [0.05, 0.14, 0.05, 0.14], objectName: 'advisor table' });
  s.addNotes('בלי יועץ, פונים לגוף אחד ומקבלים את ההצעה שלו, ומגלים עלויות תוך כדי. איתי: השוואה בין 2–3 גופים רלוונטיים, תמהיל מותאם, שקיפות מלאה בעלויות, ליווי של כל המשפחה, וגם אחרי החתימה.');

  // ── 14 · COSTS ───────────────────────────────────────────
  s = content('עלויות נלוות: שקוף, פשוט, בלי הפתעות', 'רוב העלויות חד-פעמיות, ואת עמלת פתיחת התיק אפשר לצרף להלוואה', 'ביטחון, תהליך ועלויות');
  const c1 = [['פתיחת תיק', '1,000–5,900 ₪ או 0.5%'], ['רישום שעבוד', '210 ₪'], ['ביטוח מבנה', 'לפי פוליסה'], ['אישור רפואי (מגיל 75–80)', 'צד ג׳']];
  const c2 = [['שינוי תנאי ההלוואה', '320 ₪'], ['שינוי או תיקון שעבוד', '210 ₪'], ['מעבר לנכס אחר', '750 ₪'], ['פירעון מוקדם (תפעולי)', '60 ₪'], ['עמלת פירעון מוקדם', '0 ₪ / משתנה']];
  const ap = [['דירה עד 3 מ׳', '1,715 ₪'], ['דירה 3–5 מ׳', '2,950 ₪'], ['צמוד קרקע עד 5 מ׳', '2,950 ₪'], ['צמוד קרקע מעל 5 מ׳', '4,130–5,310 ₪'], ['נחלה / מושב', '7,060–8,070 ₪']];
  const costCol = (x, title, fill, items) => {
    const rowsT = [[{ text: title, options: { colspan: 2, bold: true, fontSize: 16, color: HEX.white, fill: { color: fill }, align: 'right', rtlMode: true, lang: 'he-IL' } }]];
    items.forEach(([n, p]) => rowsT.push([cell(p, { bold: true, color: HEX.blue, align: 'left' }), cell(n)]));
    s.addTable(rowsT, { x, y: 1.85, w: 3.9, colW: [1.65, 2.25], rowH: 0.52, border: { type: 'solid', color: HEX.line, pt: 0.75 }, fontFace: THEME.bodyFontFace, margin: [0.04, 0.1, 0.04, 0.1], objectName: title });
  };
  costCol(8.83, 'בתחילת הדרך (פעם אחת)', HEX.blue, c1);
  costCol(4.71, 'רק אם תבקשו / בסוף הדרך', HEX.cyan, c2);
  costCol(0.6, 'תעריפי שמאות (כולל מע״מ)', HEX.teal, ap);
  card(s, 0.6, 5.45, 12.13, 0.95, C.background2, 'example');
  T(s, [{ text: 'לדוגמה: ', options: { bold: true, color: C.accent3 } }, { text: 'בהלוואה של 500,000 ₪, עלויות הגוף המלווה בפתיחה הן כ-1,200–6,100 ₪, כלומר רק 0.2%–1.2% מסכום ההלוואה.', options: {} }], { x: 0.85, y: 5.5, w: 11.65, h: 0.85, fontSize: 16, valign: 'middle' });
  T(s, 'התעריפים לדוגמה, משתנים בין הגופים ומתעדכנים. שמאי, רופא ועו״ד משולמים ישירות לנותן השירות.', { x: 0.6, y: 6.5, w: 12.13, h: 0.32, fontSize: 11, color: C.accent4 });
  s.addNotes('העלויות שקופות: פתיחת תיק, רישום שעבוד וביטוח מבנה בהתחלה, עמלות קטנות רק אם מבקשים שינויים, ושמאות לפי סוג ושווי הנכס. בהלוואה של חצי מיליון, עלויות הפתיחה הן בערך 0.2 עד 1.2 אחוז.');

  // ── 15 · FAQ ─────────────────────────────────────────────
  pres.addSection({ title: 'סיכום' });
  s = content('שאלות נפוצות', 'תשובות קצרות לשאלות שעולות בכל פגישה', 'סיכום');
  const faq = [['מאיזה גיל?', 'מגיל 55, לפי גיל בן או בת הזוג הצעירים'], ['הדירה נשארת שלי?', 'כן. הבעלות נשארת שלכם, וממשיכים לגור בה'], ['צריך ביטוח חיים?', 'לא. יש פטור, רק ביטוח מבנה הוא חובה'], ['יש משכנתה פתוחה?', 'אפשר. סוגרים אותה מתוך ההלוואה החדשה'], ['חייבים לשלם כל חודש?', 'לא. אפשר אפס החזר, ריבית בלבד או החזר רגיל'], ['מה קורה אחרי 120?', 'היורשים פורעים ושומרים על הדירה, או מוכרים']];
  faq.forEach(([q, a], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 6.78 - col * 6.18, y = 1.85 + row * 1.5;
    card(s, x, y, 5.95, 1.3, C.background1, 'faq ' + (i + 1));
    bubble(s, x + 5.1, y + 0.3, 0.65, C.background2, 'LuInfo_t', 'faq icon ' + (i + 1));
    T(s, q, { x: x + 0.25, y: y + 0.18, w: 4.75, h: 0.45, fontSize: 18, bold: true, color: C.accent1 });
    T(s, a, { x: x + 0.25, y: y + 0.65, w: 4.75, h: 0.45, fontSize: 15, color: C.accent4 });
  });
  s.addNotes('כמה שאלות שעולות כמעט בכל פגישה, עם תשובות קצרות.');

  // ── 16 · CLOSING ─────────────────────────────────────────
  s = pres.addSlide({ masterName: 'DARK', sectionTitle: 'סיכום' });
  s.addShape(pres.shapes.OVAL, { x: 0.9, y: 1.25, w: 4.0, h: 4.0, fill: { color: C.background1 }, line: { color: HEX.cyan, width: 5 }, objectName: 'photo ring' });
  await photo(s, 'shiral.jpg', 1.0, 1.35, 3.8, 3.8, { round: true, alt: 'שיראל פרגר' });
  T(s, 'רוצים לדעת כמה אתם יכולים לקבל?', { x: 5.6, y: 1.35, w: 7.13, h: 1.4, fontSize: 40, bold: true, color: C.background1, fontFace: THEME.headFontFace, valign: 'top' });
  T(s, 'פגישת ייעוץ ושיקוף אפשרויות, ללא התחייבות', { x: 5.6, y: 2.85, w: 7.13, h: 0.5, fontSize: 20, color: C.background2 });
  const contacts = [['LuPhone', '052-441-5395'], ['LuMail', 'sp.makesense@gmail.com']];
  contacts.forEach(([ic, t], i) => {
    const y = 3.65 + i * 0.85;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.0, y, w: 4.73, h: 0.66, rectRadius: 0.33, fill: { color: C.accent2, transparency: 80 }, line: { color: HEX.cyan, width: 1 }, objectName: 'contact ' + (i + 1) });
    s.addImage({ data: ICON[ic + '_w'], x: 12.18, y: y + 0.15, w: 0.36, h: 0.36, altText: '' });
    T(s, t, { x: 8.2, y, w: 3.85, h: 0.66, fontSize: 20, bold: true, color: C.background1, valign: 'middle', align: 'left', rtlMode: false });
  });
  T(s, [{ text: 'שיראל פרגר', options: { bold: true, color: C.accent2 } }, { text: ' | יועץ משכנתאות | MAKE SENSE', options: { color: C.background1 } }], { x: 5.6, y: 5.55, w: 7.13, h: 0.45, fontSize: 18 });
  T(s, 'המידע במצגת כללי ואינו מהווה ייעוץ אישי או הצעה. הנתונים להמחשה; תנאי ההלוואה, שיעורי המימון, הריביות והעמלות משתנים בין הגופים ונתונים לאישורם.', { x: 5.6, y: 6.15, w: 7.13, h: 0.6, fontSize: 10, color: C.background2 });
  s.addNotes('לסיום: כל משפחה שונה. בפגישה קצרה נבדוק כמה אתם יכולים לקבל, איזה מסלול מתאים, ומה ההבדל בין האפשרויות בחברות הביטוח ובבנקים. ללא התחייבות.');

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log('wrote', OUT);
})().catch(e => { console.error(e); process.exit(1); });
