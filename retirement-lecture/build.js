// Lecture deck: "ההורים שלנו, הכסף שלהם, והשקט של כולנו" — Shiral Perger / MAKE SENSE.
// Run: PPTX_SKILL=<pptx skill dir> NODE_PATH=<node_modules with pptxgenjs, react-icons, react, react-dom, sharp> node build.js
const path = require('path');
const pptxgen = require('pptxgenjs');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const L = require('react-icons/lu');
const sharp = require('sharp');
const { applyTheme } = require(process.env.PPTX_SKILL + '/scripts/apply_theme.js');

const A = f => path.join(__dirname, 'assets', f);
const OUT = path.join(__dirname, 'ההורים-שלנו-הכסף-שלהם-שיראל-פרגר.pptx');
const HEX = { navy: '001A4D', blue: '004AAD', cyan: '1FB3C8', teal: '137897', ice: 'E8F8FB', ink: '14213D', muted: '5A6478', line: 'DDE3EF', gray: 'F1F3F7', white: 'FFFFFF', gray2: '8A93A6', warn: 'E5614A' };
const THEME = {
  name: 'MAKE SENSE', headFontFace: 'Arial', bodyFontFace: 'Arial',
  colors: { dk1: HEX.ink, lt1: HEX.white, dk2: HEX.navy, lt2: HEX.ice, accent1: HEX.blue, accent2: HEX.cyan, accent3: HEX.teal, accent4: HEX.muted, accent5: HEX.line, accent6: HEX.gray, hlink: HEX.blue, folHlink: HEX.teal },
};
const W = 13.333;

const iconCache = {};
async function ic(name, hex) {
  const k = name + hex; if (iconCache[k]) return iconCache[k];
  const svg = renderToStaticMarkup(React.createElement(L[name], { size: 256, color: '#' + hex }));
  return (iconCache[k] = 'image/png;base64,' + (await sharp(Buffer.from(svg)).png().toBuffer()).toString('base64'));
}

(async () => {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.title = 'ההורים שלנו, הכסף שלהם, והשקט של כולנו';
  pres.author = 'שיראל פרגר';
  pres.company = 'MAKE SENSE';
  pres.rtlMode = true;
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;
  const he = { rtlMode: true, lang: 'he-IL', align: 'right' };

  // stepped corner from the MAKE SENSE guide + logo/credit footer
  const corner = [
    { rect: { x: 12.98, y: 6.55, w: 0.36, h: 0.95, fill: { color: HEX.blue } } },
    { rect: { x: 12.66, y: 6.88, w: 0.32, h: 0.62, fill: { color: HEX.cyan } } },
    { rect: { x: 12.4, y: 7.12, w: 0.26, h: 0.38, fill: { color: 'B9C1CF' } } },
  ];
  const credit = color => ({ text: { text: 'MAKESENSE | שיראל פרגר – יועץ משכנתאות', options: { x: 1.38, y: 6.92, w: 4.6, h: 0.36, fontSize: 10, color, align: 'left', rtlMode: false, lang: 'he-IL', margin: 0 } } });
  pres.defineSlideMaster({
    title: 'CONTENT', background: { color: 'F7F9FC' },
    objects: [
      ...corner,
      { image: { x: 0.45, y: 6.88, w: 0.86, h: 0.44, path: A('logo.png') } },
      credit(HEX.muted),
      { placeholder: { options: { name: 'title', type: 'title', x: 3.45, y: 0.36, w: 9.28, h: 0.78, fontSize: 30, bold: true, color: C.accent1, align: 'right', rtlMode: true, lang: 'he-IL', margin: 0, valign: 'middle' }, text: 'כותרת' } },
    ],
    slideNumber: { x: 11.75, y: 6.92, w: 0.5, h: 0.36, fontSize: 10, color: C.accent4, align: 'right' },
  });
  pres.defineSlideMaster({
    title: 'DARK', background: { color: C.text2 },
    objects: [...corner, { image: { x: 0.45, y: 6.88, w: 0.86, h: 0.44, path: A('logo-white.png') } }, credit('CFEFF5')],
  });

  // ── helpers ──
  const T = (s, text, o) => s.addText(text, { isTextBox: true, ...he, fontSize: 18, color: C.text1, margin: 0, ...o });
  const shadow = () => ({ type: 'outer', color: '00337A', blur: 12, offset: 3, angle: 90, opacity: 0.12 });
  const card = (s, x, y, w, h, fill, name) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.16, fill: { color: fill || C.background1 }, line: { type: 'none' }, shadow: shadow(), objectName: name });
  const bubble = async (s, x, y, d, fill, icon, iconHex = HEX.white, name = 'icon') => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { type: 'none' }, objectName: name });
    s.addImage({ data: await ic(icon, iconHex), x: x + d * 0.23, y: y + d * 0.23, w: d * 0.54, h: d * 0.54, altText: '' });
  };
  const img = (s, f, x, y, w, h, o = {}) => s.addImage({ path: A(f), x, y, w, h, sizing: { type: 'cover', w, h }, altText: o.alt || '', rounding: !!o.round });
  const tag = (s, t) => { s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 0.52, w: 2.6, h: 0.42, rectRadius: 0.21, fill: { color: C.background2 }, line: { type: 'none' }, objectName: 'section tag' }); T(s, t, { x: 0.7, y: 0.52, w: 2.4, h: 0.42, fontSize: 12, bold: true, color: C.accent3, align: 'center', valign: 'middle' }); };
  const content = (title, section, sec, kicker) => { const s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: sec }); s.addText(title, { placeholder: 'title', ...he }); if (section) tag(s, section); if (kicker) T(s, kicker, { x: 0.6, y: 1.12, w: 12.13, h: 0.4, fontSize: 17, color: C.accent3, bold: true }); return s; };
  const dark = sec => pres.addSlide({ masterName: 'DARK', sectionTitle: sec });
  const big = (s, n, x, y, w, h, color, size = 66, o = {}) => T(s, n, { x, y, w, h, fontSize: size, bold: true, color, align: 'center', valign: 'middle', rtlMode: false, ...o });
  // row of icon tiles (right→left), label under each
  const tiles = async (s, items, y, h, opts = {}) => {
    const n = items.length, gap = 0.3, w = (12.13 - gap * (n - 1)) / n;
    for (let i = 0; i < n; i++) {
      const [icon, label, sub, hi] = items[i]; const x = 12.73 - w - i * (w + gap);
      card(s, x, y, w, h, hi ? C.accent1 : C.background1, 'tile ' + (i + 1));
      const d = Math.min(1.25, w * 0.5);
      await bubble(s, x + (w - d) / 2, y + 0.35, d, hi ? HEX.cyan : (i % 2 ? HEX.cyan : HEX.blue), icon);
      T(s, label, { x: x + 0.15, y: y + 0.45 + d, w: w - 0.3, h: 0.9, fontSize: opts.fs || 20, bold: true, color: hi ? C.background1 : C.accent1, align: 'center', valign: 'top' });
      if (sub) T(s, sub, { x: x + 0.15, y: y + 1.25 + d, w: w - 0.3, h: h - 1.4 - d, fontSize: 15, color: hi ? C.background2 : C.accent4, align: 'center', valign: 'top' });
    }
  };
  const src = (s, t, dark) => T(s, t, { x: 0.6, y: 6.5, w: 11.6, h: 0.3, fontSize: 10, italic: true, color: dark ? 'CFEFF5' : C.accent4 });
  const chartTxt = { catAxisLabelColor: HEX.muted, catAxisLabelFontSize: 14, catAxisLabelFontFace: '+mn-lt', valAxisHidden: true, catGridLine: { style: 'none' }, dataLabelFontFace: '+mn-lt', dataLabelFontSize: 14, dataLabelFontBold: true };

  // ════ א. פתיחה ════
  pres.addSection({ title: 'פתיחה' });
  let s = dark('פתיחה');
  img(s, 'sunset-family.jpg', 0, 0, 5.6, 7.5, { alt: 'משפחה רב-דורית בשקיעה' });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.6, y: 0, w: 0.08, h: 7.5, fill: { color: C.accent2 }, line: { type: 'none' }, objectName: 'divider' });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 10.05, y: 0.6, w: 2.7, h: 1.4, rectRadius: 0.16, fill: { color: C.background1 }, line: { type: 'none' }, objectName: 'logo card' });
  s.addImage({ path: A('logo.png'), x: 10.22, y: 0.72, w: 2.36, h: 1.2, altText: 'MAKE SENSE' });
  T(s, [{ text: 'ההורים שלנו,', options: { breakLine: true, color: C.background1 } }, { text: 'הכסף שלהם,', options: { breakLine: true, color: C.accent2 } }, { text: 'והשקט של כולנו', options: { color: C.background1 } }], { x: 6.2, y: 2.3, w: 6.55, h: 2.6, fontSize: 48, bold: true, valign: 'top' });
  T(s, 'פתרונות וליווי כלכלי לגיל השלישי', { x: 6.2, y: 5.0, w: 6.55, h: 0.55, fontSize: 24, color: C.background2 });
  T(s, [{ text: 'שיראל פרגר', options: { bold: true, color: C.accent2 } }, { text: ' | יועץ משכנתאות ופתרונות מימון', options: { color: C.background1 } }], { x: 6.2, y: 5.85, w: 6.55, h: 0.45, fontSize: 16 });
  s.addNotes('תודה שבאתם. ההרצאה הזו היא לא על הכסף שלכם, היא על הכסף של ההורים שלכם, ועל מה שיקרה לכם אם לא נדבר עליו.');

  s = content('כמה מכם באמת יודעים איפה ההורים עומדים?', 'פתיחה', 'פתיחה', 'שלוש שאלות. הרימו יד אם התשובה היא כן');
  const polls = [['LuPiggyBank', 'מי יודע כמה פנסיה ההורים שלו יקבלו?'], ['LuScrollText', 'מי יודע אם יש להם ייפוי כוח מתמשך?'], ['LuHandCoins', 'מי כבר עוזר להם כלכלית היום?']];
  for (let i = 0; i < 3; i++) {
    const x = 8.83 - i * 4.1;
    card(s, x, 1.7, 3.9, 4.6, i === 2 ? C.accent1 : C.background1, 'poll ' + (i + 1));
    big(s, String(i + 1), x, 1.85, 3.9, 1.0, i === 2 ? HEX.cyan : HEX.blue, 54);
    await bubble(s, x + 1.35, 2.95, 1.2, i === 2 ? HEX.cyan : HEX.ice, polls[i][0], i === 2 ? HEX.white : HEX.blue);
    T(s, polls[i][1], { x: x + 0.3, y: 4.4, w: 3.3, h: 1.6, fontSize: 21, bold: true, color: i === 2 ? C.background1 : C.accent1, align: 'center', valign: 'top' });
  }
  s.addNotes('מבקשים הצבעה. ברוב הקהלים מעט ידיים יורמו בשתי השאלות הראשונות, והרבה בשלישית. "זה הפער שאנחנו סוגרים היום."');

  s = content('אתם מממנים שני דורות במקביל', 'פתיחה', 'פתיחה', 'הילדים מלמטה, ההורים מלמעלה, והלחץ באמצע');
  const layers = [['LuUsers', 'ההורים', '55+', HEX.teal], ['LuUser', 'אנחנו', '30–40', HEX.blue], ['LuBaby', 'הילדים', '', HEX.cyan]];
  for (let i = 0; i < 3; i++) {
    const y = 1.75 + i * 1.55;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.9, y, w: 5.83, h: 1.35, rectRadius: 0.2, fill: { color: layers[i][3] }, line: { type: 'none' }, shadow: shadow(), objectName: 'layer ' + (i + 1) });
    s.addImage({ data: await ic(layers[i][0], HEX.white), x: 11.6, y: y + 0.3, w: 0.75, h: 0.75, altText: '' });
    T(s, layers[i][1], { x: 8.6, y, w: 2.8, h: 1.35, fontSize: 30, bold: true, color: C.background1, valign: 'middle' });
    if (layers[i][2]) T(s, layers[i][2], { x: 7.1, y, w: 1.5, h: 1.35, fontSize: 24, bold: true, color: C.background1, align: 'center', valign: 'middle', rtlMode: false });
  }
  T(s, [{ text: 'הדור הראשון שמממן', options: { breakLine: true } }, { text: 'שני דורות במקביל', options: { color: C.accent2 } }], { x: 0.6, y: 2.4, w: 5.9, h: 1.8, fontSize: 36, bold: true, color: C.accent1, valign: 'middle' });
  T(s, 'משכנתה, גן, חוגים… ועכשיו גם ההורים', { x: 0.6, y: 4.3, w: 5.9, h: 0.6, fontSize: 20, color: C.accent4 });
  s.addNotes('משכנתה, גן, חוגים, ועכשיו גם ההורים. הלחץ אמיתי, והוא מגיע בדרך כלל ברגע הכי פחות מתאים.');

  s = content('שיראל פרגר: ליווי כלכלי לכל המשפחה', 'פתיחה', 'פתיחה', 'יועץ משכנתאות ופתרונות מימון | MAKE SENSE');
  s.addShape(pres.shapes.OVAL, { x: 8.75, y: 1.6, w: 3.9, h: 3.9, fill: { color: C.background1 }, line: { color: HEX.cyan, width: 5 }, objectName: 'photo ring' });
  img(s, 'shiral.jpg', 8.87, 1.72, 3.66, 3.66, { round: true, alt: 'שיראל פרגר' });
  const creds = [['LuGraduationCap', 'B.A כלכלה · M.B.A'], ['LuBadgeCheck', 'חבר בהתאחדות יועצי המשכנתאות'], ['LuUsers', 'עשרות משפחות מלוות']];
  for (let i = 0; i < 3; i++) { const y = 1.75 + i * 0.85; await bubble(s, 7.75, y, 0.62, HEX.ice, creds[i][0], HEX.teal); T(s, creds[i][1], { x: 2.4, y, w: 5.2, h: 0.62, fontSize: 20, bold: true, valign: 'middle' }); }
  const cl = ['client-003.jpg', 'client-024.jpg', 'client-042.jpg', 'client-027.jpg'];
  for (let i = 0; i < 4; i++) img(s, cl[i], 6.0 - i * 1.8, 4.5, 1.6, 1.2, { alt: 'לקוחות שליוויתי' });
  T(s, '"ראיתי את ההורים שלי מתמודדים לבד. לכן אני מלווה כל משפחה כאילו היא שלי."', { x: 0.6, y: 5.9, w: 7.6, h: 0.6, fontSize: 16, italic: true, color: C.accent3 });
  s.addNotes('הסיפור האישי: ראיתי את ההורים שלי מתמודדים עם החלטות כלכליות גדולות בלי איש מקצוע לצידם. זה מה שהביא אותי לתחום.');

  // ════ ב. המציאות במספרים ════
  pres.addSection({ title: 'המציאות במספרים' });
  s = content('ההורים שלכם יחיו כ-20 שנה אחרי הפרישה', 'המציאות במספרים', 'המציאות במספרים', 'השאלה היא ממה הם יחיו');
  big(s, '83.8', 7.3, 1.7, 5.4, 1.9, HEX.blue, 110);
  T(s, 'שנות תוחלת חיים בישראל · 4 ב-OECD', { x: 7.3, y: 3.6, w: 5.4, h: 0.5, fontSize: 18, color: C.accent4, align: 'center' });
  s.addShape(pres.shapes.RECTANGLE, { x: 1.0, y: 5.05, w: 11.3, h: 0.14, fill: { color: HEX.line }, line: { type: 'none' }, objectName: 'timeline' });
  s.addShape(pres.shapes.RECTANGLE, { x: 1.0, y: 5.05, w: 11.3, h: 0.14, fill: { color: HEX.cyan }, line: { type: 'none' }, objectName: 'timeline fill' });
  [[11.9, '67', 'פרישה'], [6.55, '76', ''], [1.0, '85+', '']].forEach(([x, n, l], i) => { s.addShape(pres.shapes.OVAL, { x: x - 0.2 + (i === 2 ? 0.2 : 0), y: 4.87, w: 0.5, h: 0.5, fill: { color: i === 0 ? HEX.blue : HEX.teal }, line: { color: HEX.white, width: 3 }, objectName: 'tick ' + (i + 1) }); big(s, n, x - 0.6, 5.45, 1.4, 0.5, HEX.blue, 22); if (l) T(s, l, { x: x - 0.6, y: 5.9, w: 1.4, h: 0.4, fontSize: 14, color: C.accent4, align: 'center' }); });
  T(s, '≈ 20 שנה שצריך לממן', { x: 3.5, y: 4.2, w: 6.3, h: 0.6, fontSize: 26, bold: true, color: C.accent3, align: 'center' });
  await bubble(s, 0.9, 1.9, 1.9, HEX.ice, 'LuHourglass', HEX.blue);
  src(s, 'מקור: OECD Health Statistics 2025; הלמ״ס, לוחות תמותה');
  s.addNotes('תוחלת החיים בישראל היא 83.8 שנים, הרביעית בגובהה ב-OECD. נשים כ-85.7, גברים כ-81.7. פרישה היא לא סוף הדרך, היא עוד 20 שנה שצריך לממן.');

  s = content('גיל הפרישה של נשים עולה ל-65', 'המציאות במספרים', 'המציאות במספרים', 'את הגיל המדויק של אמא בודקים במחשבון של ביטוח לאומי');
  card(s, 6.95, 1.7, 5.78, 4.6, C.background1, 'men');
  await bubble(s, 9.05, 2.0, 1.6, HEX.blue, 'LuPersonStanding');
  big(s, '67', 6.95, 3.7, 5.78, 1.4, HEX.blue, 88);
  T(s, 'גברים', { x: 6.95, y: 5.2, w: 5.78, h: 0.6, fontSize: 24, bold: true, color: C.accent4, align: 'center' });
  card(s, 0.6, 1.7, 5.78, 4.6, C.background1, 'women');
  await bubble(s, 2.7, 2.0, 1.6, HEX.cyan, 'LuPersonStanding');
  big(s, '62 → 65', 0.6, 3.7, 5.78, 1.4, HEX.teal, 72);
  T(s, 'נשים · עולה בהדרגה עד 2032', { x: 0.6, y: 5.2, w: 5.78, h: 0.6, fontSize: 22, bold: true, color: C.accent4, align: 'center' });
  src(s, 'מקור: חוק גיל פרישה; המוסד לביטוח לאומי');
  s.addNotes('גברים 67. נשים: עולה בהדרגה מ-62 ל-65 עד 2032. אמא שלכם אולי עדיין עובדת. כדאי לבדוק את הגיל המדויק במחשבון של ביטוח לאומי.');

  s = content('קצבת הזקנה נמוכה מקו העוני', 'המציאות במספרים', 'המציאות במספרים', 'גם עם תוספת ותק מלאה: 2,757 ₪ מול קו עוני של 3,547 ₪');
  s.addChart(pres.charts.BAR, [{ name: '₪ בחודש', labels: ['קצבה בסיסית', 'עם ותק מלא', 'קו העוני'], values: [1838, 2757, 3547] }], {
    x: 0.6, y: 1.6, w: 8.0, h: 4.9, barDir: 'col', barGapWidthPct: 60, chartColors: [HEX.blue, HEX.cyan, HEX.warn], invertedColors: [HEX.blue], ...chartTxt,
    showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '#,##0" ₪"', dataLabelColor: HEX.ink, valAxisMinVal: 0, valAxisMaxVal: 4200, valGridLine: { style: 'none' }, showLegend: false,
    showTitle: true, title: 'קצבת אזרח ותיק ליחיד, 2026', titleColor: HEX.ink, titleFontSize: 14, titleFontFace: '+mn-lt', objectName: 'allowance chart', altText: 'קצבה בסיסית 1,838 ₪, עם ותק מלא 2,757 ₪, קו העוני 3,547 ₪',
  });
  card(s, 9.0, 1.9, 3.73, 4.3, C.accent1, 'message');
  await bubble(s, 10.2, 2.25, 1.3, HEX.cyan, 'LuTriangleAlert');
  T(s, 'הקצבה לבד לא מגיעה לקו העוני', { x: 9.25, y: 3.8, w: 3.25, h: 1.6, fontSize: 24, bold: true, color: C.background1, align: 'center', valign: 'top' });
  T(s, '+924 ₪ לבן/בת זוג', { x: 9.25, y: 5.4, w: 3.25, h: 0.5, fontSize: 15, color: C.background2, align: 'center' });
  src(s, 'מקור: המוסד לביטוח לאומי, סכומי הקצבאות 2026; דוח העוני 2024 (קו העוני ליחיד)');
  s.addNotes('קצבת אזרח ותיק ב-2026: 1,838 ₪ ליחיד, עם תוספת ותק מלאה כ-2,757 ₪, ולבן או בת זוג מתווספים 924 ₪. קו העוני ליחיד הוא 3,547 ₪. הקצבה מהמדינה לבד לא מגיעה לקו העוני.');

  s = content('רק 44% מקבלים פנסיה בכלל', 'המציאות במספרים', 'המציאות במספרים', 'מבני גיל הפרישה שאינם עובדים. ומי שמקבל, מקבל בממוצע כ-6,700 ₪');
  s.addChart(pres.charts.DOUGHNUT, [{ name: 'פנסיה', labels: ['מקבלים פנסיה', 'לא מקבלים'], values: [44, 56] }], {
    x: 7.2, y: 1.55, w: 5.5, h: 4.9, holeSize: 62, chartColors: [HEX.blue, HEX.line], showPercent: true, showValue: false, dataLabelColor: HEX.ink, dataLabelFontSize: 16, dataLabelFontBold: true, dataLabelFontFace: '+mn-lt',
    showLegend: true, legendPos: 'b', legendFontSize: 14, legendFontFace: '+mn-lt', legendColor: HEX.muted, showTitle: false, objectName: 'pension doughnut', altText: '44% מבני גיל הפנסיה שאינם עובדים מקבלים פנסיה',
  });
  big(s, '44%', 8.45, 3.15, 3.0, 1.0, HEX.blue, 40);
  const pstat = [['≈ 6,700 ₪', 'פנסיה ממוצעת בקרב המקבלים', HEX.blue], ['⅓ פחות', 'הפנסיה של נשים', HEX.teal]];
  pstat.forEach(([n, l, c], i) => { const y = 1.8 + i * 2.3; card(s, 0.6, y, 6.2, 2.0, C.background1, 'stat ' + (i + 1)); big(s, n, 0.6, y + 0.2, 6.2, 1.1, c, 50); T(s, l, { x: 0.8, y: y + 1.3, w: 5.8, h: 0.5, fontSize: 18, color: C.accent4, align: 'center' }); });
  src(s, 'מקור: נתוני הכנסות פנסיונרים לשנת 2024, כפי שפורסמו בביזפורטל');
  s.addNotes('פחות ממחצית מבני גיל הפנסיה שלא עובדים מקבלים פנסיה. הממוצע בקרב המקבלים כ-6,700 ₪, ולנשים בכשליש פחות. לרבים יש הפקדות חלקיות, קרנות ישנות או כספים אבודים.');

  s = content('לזוג טיפוסי חסרים כ-2,300 ₪ בכל חודש', 'המציאות במספרים', 'המציאות במספרים', 'מי מכם משלים את הפער הזה היום?');
  s.addChart(pres.charts.BAR, [{ name: '₪ בחודש', labels: ['הכנסה', 'הוצאה'], values: [7200, 9500] }], {
    x: 6.6, y: 1.55, w: 6.1, h: 4.95, barDir: 'col', barGapWidthPct: 55, chartColors: [HEX.cyan, HEX.blue], ...chartTxt, catAxisLabelFontSize: 18,
    showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '#,##0" ₪"', dataLabelColor: HEX.ink, valAxisMinVal: 0, valAxisMaxVal: 11000, valGridLine: { style: 'none' }, showLegend: false,
    showTitle: true, title: 'זוג פנסיונרים טיפוסי (להמחשה)', titleColor: HEX.ink, titleFontSize: 14, titleFontFace: '+mn-lt', objectName: 'gap chart', altText: 'הכנסה 7,200 ₪ מול הוצאה 9,500 ₪',
  });
  big(s, '−2,300 ₪', 0.6, 1.9, 5.7, 1.5, HEX.warn, 72);
  T(s, 'פער בכל חודש', { x: 0.6, y: 3.4, w: 5.7, h: 0.5, fontSize: 22, color: C.accent4, align: 'center' });
  card(s, 0.9, 4.35, 5.1, 1.6, C.accent1, 'who pays');
  T(s, [{ text: 'כ-27,600 ₪', options: { breakLine: true, color: C.accent2 } }, { text: 'חסרים בכל שנה', options: {} }], { x: 1.1, y: 4.45, w: 4.7, h: 1.4, fontSize: 26, bold: true, color: C.background1, align: 'center', valign: 'middle' });
  src(s, 'המחשה: על בסיס קצבאות ביטוח לאומי 2026 ופנסיה משוערת');
  s.addNotes('הכנסה של כ-7,200 ₪ מול הוצאה של כ-9,500 ₪. פער של כ-2,300 ₪ בחודש. מי סוגר את הפער? לרוב, אתם. אבל יש דרכים אחרות.');


  s = content('3 הנחות שעולות להורים כסף', 'המציאות במספרים', 'המציאות במספרים', 'כמה מהן שמעתם בבית?');
  const myths = [
    ['"יש להם פנסיה, הם יסתדרו"', '56%', 'מבני גיל הפרישה שלא עובדים לא מקבלים פנסיה בכלל'],
    ['"המדינה תדאג להם"', '1,838 ₪', 'קצבת זקנה בסיסית: כמחצית מקו העוני'],
    ['"בבית לא נוגעים, זה לירושה"', '≈ 900K ₪', 'נזילים מדירה של 3 מ׳ בגיל 70, והיתרה עדיין עוברת לילדים'],
  ];
  for (let i = 0; i < 3; i++) {
    const x = 8.83 - i * 4.1, [myth, num, fact] = myths[i];
    card(s, x, 1.75, 3.9, 1.55, 'EEF0F4', 'myth ' + (i + 1));
    s.addImage({ data: await ic('LuCircleX', HEX.gray2), x: x + 3.35, y: 1.88, w: 0.4, h: 0.4, altText: '' });
    T(s, myth, { x: x + 0.2, y: 1.85, w: 3.1, h: 1.35, fontSize: 19, bold: true, color: C.accent4, valign: 'middle', strike: 'sngStrike' });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 3.5, w: 3.9, h: 2.9, rectRadius: 0.16, fill: { color: C.accent1 }, line: { type: 'none' }, shadow: shadow(), objectName: 'fact ' + (i + 1) });
    T(s, 'בפועל', { x: x + 0.2, y: 3.62, w: 3.5, h: 0.4, fontSize: 15, bold: true, color: C.accent2 });
    big(s, num, x, 3.95, 3.9, 1.0, HEX.white, 40);
    T(s, fact, { x: x + 0.25, y: 5.0, w: 3.4, h: 1.25, fontSize: 16, color: C.background2, align: 'center', valign: 'top' });
  }
  src(s, 'מקור: נתוני פנסיונרים 2024 (ביזפורטל); ביטוח לאומי 2026; השוואת גופים מלווים 2026 (הדוגמה להמחשה)');
  s.addNotes('שלוש הנחות ששומעים כמעט בכל בית. יש להם פנסיה? 56% מבני גיל הפרישה שלא עובדים לא מקבלים פנסיה בכלל. המדינה תדאג? הקצבה הבסיסית היא כמחצית מקו העוני. בבית לא נוגעים? בגיל 70 דירה של 3 מיליון יכולה לשחרר כ-900 אלף ₪, והיתרה עדיין עוברת לילדים.');

  // ════ ג. תכנון פרישה ════
  pres.addSection({ title: 'תכנון פרישה' });
  s = content('4 מנופים שסוגרים את הפער', 'תכנון פרישה', 'תכנון פרישה', 'מתחילים מהפשוט, ומסיימים בבית');
  await tiles(s, [['LuBadgeCheck', 'מיצוי זכויות'], ['LuPercent', 'מיסוי חכם'], ['LuSearch', 'ארגון החיסכון'], ['LuHouse', 'הבית כנכס', '', true]], 1.75, 3.4, { fs: 26 });
  card(s, 0.6, 5.5, 12.13, 0.95, C.background2, 'levers note');
  T(s, 'מנוף אחרי מנוף, סוגרים את הפער', { x: 0.9, y: 5.5, w: 11.5, h: 0.95, fontSize: 24, bold: true, color: C.accent3, align: 'center', valign: 'middle' });
  s.addNotes('ארבעה מנופים, זו מפת ההמשך: מיצוי זכויות, מיסוי חכם, ארגון החיסכון, והבית כנכס.');

  s = content('מנוף 1: זכויות שלא מבקשים, לא מקבלים', 'תכנון פרישה', 'תכנון פרישה', 'חלק מהתוספות בביטוח לאומי דורשות הגשת בקשה');
  await tiles(s, [['LuTrendingUp', 'תוספת ותק', 'עד +50%'], ['LuHandCoins', 'השלמת הכנסה', 'להכנסה נמוכה'], ['LuClock', 'דחיית קצבה', 'קצבה גדולה יותר'], ['LuHeart', 'גיל 80+', 'קצבה מוגדלת']], 1.75, 3.6);
  card(s, 0.6, 5.6, 12.13, 0.85, C.background2, 'tip');
  T(s, 'הרבה זכאים פשוט לא מגישים בקשה', { x: 0.9, y: 5.6, w: 11.5, h: 0.85, fontSize: 22, bold: true, color: C.accent3, align: 'center', valign: 'middle' });
  src(s, 'מקור: המוסד לביטוח לאומי; כל זכות, תוספת השלמת הכנסה 2026');
  s.addNotes('תוספת ותק: 2% לכל שנת ביטוח, עד 50%. השלמת הכנסה: כשהפנסיה של יחיד לא עולה על כ-1,790 ₪, ולזוג כ-2,823 ₪. דחיית קצבה מגדילה אותה. מגיל 80 הקצבה מוגדלת. השלמת הכנסה פותחת גם הנחות נוספות.');

  s = content('הנחות קטנות, סכום גדול', 'תכנון פרישה', 'תכנון פרישה', 'ארנונה, תחבורה ותרופות מצטברות למאות שקלים בחודש');
  const perks = [['LuLandmark', 'ארנונה'], ['LuBus', 'תחבורה'], ['LuPill', 'תרופות'], ['LuZap', 'חשמל'], ['LuDroplet', 'מים'], ['LuTicket', 'תרבות']];
  for (let i = 0; i < 6; i++) { const col = i % 3, row = Math.floor(i / 3); const x = 8.83 - col * 4.1, y = 1.75 + row * 2.4; card(s, x, y, 3.9, 2.15, C.background1, 'perk ' + (i + 1)); await bubble(s, x + 1.4, y + 0.25, 1.1, i % 2 ? HEX.cyan : HEX.blue, perks[i][0]); T(s, perks[i][1], { x, y: y + 1.45, w: 3.9, h: 0.55, fontSize: 22, bold: true, color: C.accent1, align: 'center' }); }
  src(s, 'מקור: כל זכות, זכויות והטבות לאזרחים ותיקים');
  s.addNotes('ארנונה, תחבורה ציבורית, תרופות, חשמל ומים, תרבות. כל הנחה נשמעת קטנה, ביחד מדובר במאות שקלים בחודש. מפנים לאתר כל זכות.');

  s = content('מנוף 2: טופס שגוי עולה אלפי שקלים', 'תכנון פרישה', 'תכנון פרישה', 'קיבוע זכויות נכון מגדיל את הקצבה נטו, בכל חודש');
  s.addChart(pres.charts.BAR, [{ name: 'פטור ממס על קצבה', labels: ['2025', '2026', '2027', '2028'], values: [57, 57.5, 62.5, 67] }], {
    x: 0.6, y: 1.55, w: 7.4, h: 4.95, barDir: 'col', barGapWidthPct: 50, chartColors: [HEX.cyan, HEX.blue, HEX.cyan, HEX.cyan], invertedColors: [HEX.cyan], ...chartTxt, catAxisLabelFontSize: 16,
    showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0.0"%"', dataLabelColor: HEX.ink, valAxisMinVal: 0, valAxisMaxVal: 80, valGridLine: { style: 'none' }, showLegend: false,
    showTitle: true, title: 'פטור ממס על קצבה מזכה', titleColor: HEX.ink, titleFontSize: 14, titleFontFace: '+mn-lt', objectName: 'tax exemption chart', altText: 'פטור ממס: 57% ב-2025, 57.5% ב-2026, 62.5% ב-2027, 67% ב-2028',
  });
  card(s, 8.4, 1.75, 4.33, 2.3, C.accent1, 'max exemption');
  big(s, '5,422 ₪', 8.4, 1.9, 4.33, 1.2, HEX.white, 48);
  T(s, 'פטורים ממס בכל חודש (2026)', { x: 8.6, y: 3.1, w: 3.93, h: 0.6, fontSize: 17, color: C.background2, align: 'center' });
  card(s, 8.4, 4.3, 4.33, 2.0, C.background1, 'warning');
  await bubble(s, 11.8, 4.5, 0.7, 'FDECE8', 'LuTriangleAlert', HEX.warn);
  T(s, [{ text: 'טופס 161ח', options: { bold: true, color: 'C2410C', breakLine: true } }, { text: 'סוגר את הפטור על 22.5% בלבד', options: {} }], { x: 8.6, y: 4.45, w: 3.1, h: 1.7, fontSize: 18, valign: 'middle' });
  src(s, 'מקור: רשות המסים; פקודת מס הכנסה (קיבוע זכויות); ביזפורטל ו-Funder, 2026');
  s.addNotes('קיבוע זכויות בטופס 161ד מול פקיד השומה. הפטור ב-2026 הוא 57.5%, עד כ-5,422 ₪ בחודש, ועולה ל-67% ב-2028. הטופס המקוצר 161ח סוגר את הסל על 22.5% בלבד, טעות נפוצה. פריסת מענקים נכונה חוסכת אלפי שקלים.');

  s = content('מנוף 3: כסף שאף אחד לא יודע עליו', 'תכנון פרישה', 'תכנון פרישה', 'קרנות ישנות וחסכונות שנשכחו מחכים ב"הר הכסף"');
  await tiles(s, [['LuSearch', 'הר הכסף', 'כספים אבודים'], ['LuClipboardList', 'מסלקה פנסיונית', 'תמונה מלאה'], ['LuPercent', 'דמי ניהול', 'בדיקה והורדה'], ['LuLayers', 'איחוד קופות', 'פחות פיצול']], 1.75, 3.6);
  card(s, 0.6, 5.6, 12.13, 0.85, C.accent1, 'homework');
  T(s, 'משימה להערב: 10 דקות עם ההורים מול "הר הכסף"', { x: 0.9, y: 5.6, w: 11.5, h: 0.85, fontSize: 22, bold: true, color: C.background1, align: 'center', valign: 'middle' });
  src(s, 'מקור: משרד האוצר, אתר "הר הכסף"; המסלקה הפנסיונית');
  s.addNotes('הר הכסף לאיתור כספים אבודים, המסלקה הפנסיונית לתמונה מלאה, בדיקת דמי ניהול ואיחוד קופות. תרגיל: הערב, שבו עם ההורים 10 דקות מול אתר הר הכסף.');

  s = content('קצבה או היוון: החלטה לכל החיים', 'תכנון פרישה', 'תכנון פרישה', 'אחרי החתימה אין דרך חזרה');
  const ann = [[6.95, HEX.blue, 'LuShieldCheck', 'קצבה', 'ביטחון לכל החיים'], [0.6, HEX.cyan, 'LuWallet', 'היוון', 'גמישות עכשיו']];
  for (const [x, col, icn, t, d] of ann) { card(s, x, 1.75, 5.78, 3.6, C.background1, t); await bubble(s, x + 2.14, 2.0, 1.5, col, icn); T(s, t, { x, y: 3.65, w: 5.78, h: 0.7, fontSize: 32, bold: true, color: C.accent1, align: 'center' }); T(s, d, { x, y: 4.35, w: 5.78, h: 0.6, fontSize: 20, color: C.accent4, align: 'center' }); }
  await bubble(s, 6.14, 2.85, 1.05, HEX.navy, 'LuScale');
  card(s, 0.6, 5.6, 12.13, 0.85, 'FDECE8', 'irreversible');
  T(s, 'החלטה בלתי הפיכה, ייעוץ לפני שחותמים', { x: 0.9, y: 5.6, w: 11.5, h: 0.85, fontSize: 22, bold: true, color: 'C2410C', align: 'center', valign: 'middle' });
  src(s, 'מקור: ביזפורטל, קצבה מזערית 2026');
  s.addNotes('קצבה נותנת ביטחון לכל החיים, היוון נותן גמישות. להיוון נדרשת קודם קצבה מזערית של כ-5,306 ₪ ב-2026. גם בחירת מסלול הפנסיה, שארים ותקופת הבטחה, היא החלטה בלתי הפיכה.');

  s = content('500 ₪ בחודש הם 120,000 ₪ ב-20 שנה', 'תכנון פרישה', 'תכנון פרישה', 'גם צד ההוצאות הוא מנוף');
  await tiles(s, [['LuLayers', 'איחוד הלוואות'], ['LuShieldCheck', 'ביטוחים כפולים'], ['LuWifi', 'תקשורת וחשבונות'], ['LuCalculator', 'תקציב פשוט']], 1.75, 2.9);
  card(s, 0.6, 4.9, 12.13, 1.55, C.accent1, 'savings stat');
  T(s, [{ text: 'כל הוצאה קבועה שווה בדיקה', options: { breakLine: true } }, { text: 'פעם אחת בודקים, 20 שנה נהנים', options: { color: C.accent2 } }], { x: 0.9, y: 4.9, w: 11.5, h: 1.55, fontSize: 30, bold: true, color: C.background1, align: 'center', valign: 'middle' });
  src(s, 'חישוב: 500 ₪ × 12 חודשים × 20 שנה, ללא תשואה');
  s.addNotes('איחוד הלוואות יקרות, בדיקת ביטוחים כפולים, הוזלת תקשורת וחשבונות, ותקציב חודשי פשוט. כל 500 ₪ שחוסכים בחודש הם 120,000 ₪ על פני 20 שנה.');

  s = dark('תכנון פרישה');
  await bubble(s, 5.67, 1.1, 2.0, HEX.cyan, 'LuHouse');
  T(s, 'גם אחרי שמיצינו הכל, נשאר פער?', { x: 0.6, y: 3.4, w: 12.13, h: 0.8, fontSize: 30, color: C.background2, align: 'center' });
  T(s, [{ text: 'אבל לרוב ההורים יש נכס אחד גדול', options: { breakLine: true } }, { text: 'שעוד לא עבד בשבילם', options: { color: C.accent2 } }], { x: 0.6, y: 4.25, w: 12.13, h: 1.7, fontSize: 40, bold: true, color: C.background1, align: 'center', valign: 'top' });
  s.addNotes('גם אחרי שמיצינו את כל הזכויות, לרוב נשאר פער. אבל לרוב ההורים יש נכס אחד גדול, שעוד לא עבד בשבילם.');

  // ════ ד. הבית כנכס ════
  pres.addSection({ title: 'הבית כנכס' });
  s = content('עשירים בקירות, עניים בכיס', 'הבית כנכס', 'הבית כנכס');
  card(s, 6.95, 1.75, 5.78, 4.7, C.accent1, 'walls');
  await bubble(s, 8.99, 2.05, 1.7, HEX.cyan, 'LuHouse');
  big(s, '3,000,000 ₪', 6.95, 3.95, 5.78, 1.2, HEX.white, 50);
  T(s, 'שווי הדירה', { x: 6.95, y: 5.15, w: 5.78, h: 0.6, fontSize: 22, color: C.background2, align: 'center' });
  card(s, 0.6, 1.75, 5.78, 4.7, C.background1, 'pocket');
  await bubble(s, 2.64, 2.05, 1.7, HEX.gray, 'LuWallet', HEX.gray2);
  big(s, '0 ₪', 0.6, 3.95, 5.78, 1.2, HEX.warn, 60);
  T(s, 'בחשבון הבנק', { x: 0.6, y: 5.15, w: 5.78, h: 0.6, fontSize: 22, color: C.accent4, align: 'center' });
  s.addNotes('רוב העושר של דור ההורים נמצא בדירה. השאלה היא איך להשתמש בו בלי למכור ובלי לעזוב.');

  s = content('4 דרכים להפוך את הבית לכסף', 'הבית כנכס', 'הבית כנכס', 'רק אחת מהן משאירה את ההורים בבית');
  await tiles(s, [['LuArrowRightLeft', 'למכור ולעבור', 'לדירה קטנה'], ['LuKeyRound', 'להשכיר', 'ולעבור לגור אחרת'], ['LuHotel', 'דיור מוגן', 'מכירה ומעבר'], ['LuHeart', 'משכנתה הפוכה', 'נשארים בבית', true]], 1.75, 4.6);
  s.addNotes('ארבע אפשרויות עם הבית. לשלוש הראשונות יש מחיר: לעזוב את הבית. רוב ההורים לא רוצים לעזוב, ולכן משכנתה הפוכה.');

  s = content('הבית נשאר שלהם, הכסף אצלם', 'הבית כנכס', 'הבית כנכס', 'משכנתה הפוכה בשלושה משפטים');
  await tiles(s, [['LuHouse', 'הבית נשאר שלהם', 'מגורים לכל החיים'], ['LuBanknote', 'כסף בגמישות', 'חד-פעמי, קצבה או משיכות'], ['LuScale', 'החזר לפי הצורך', 'גם אפס החזר']], 1.75, 3.9);
  const chips = [['LuUserCheck', 'מגיל 55'], ['LuUmbrella', 'פטור מביטוח חיים'], ['LuBuilding2', 'ביטוח מבנה חובה']];
  for (let i = 0; i < 3; i++) { const x = 8.83 - i * 4.1; s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 5.85, w: 3.9, h: 0.62, rectRadius: 0.31, fill: { color: C.background2 }, line: { type: 'none' }, objectName: 'chip ' + (i + 1) }); s.addImage({ data: await ic(chips[i][0], HEX.teal), x: x + 3.3, y: 5.96, w: 0.4, h: 0.4, altText: '' }); T(s, chips[i][1], { x: x + 0.2, y: 5.85, w: 3.0, h: 0.62, fontSize: 17, bold: true, color: C.accent3, valign: 'middle' }); }
  s.addNotes('הלוואה בשעבוד הדירה, מגיל 55. הבית נשאר שלהם, מקבלים כסף בגמישות, ובוחרים איך להחזיר, גם בלי החזר חודשי בכלל.');

  s = content('ההורים בוחרים איך לקבל ואיך להחזיר', 'הבית כנכס', 'הבית כנכס', 'שני צירים, תמהיל אחד שמתאים להם');
  const axes = [['מקבלים', 'LuArrowDownToLine', HEX.cyan, ['חד-פעמי', 'קצבה חודשית', 'משיכות לפי צורך']], ['מחזירים', 'LuArrowUpFromLine', HEX.blue, ['אפס החזר', 'ריבית בלבד', 'שפיצר']]];
  for (let r = 0; r < 2; r++) {
    const y = 1.75 + r * 2.4; const [lab, icn, col, opts] = axes[r];
    card(s, 0.6, y, 12.13, 2.15, C.background1, 'axis ' + (r + 1));
    await bubble(s, 11.55, y + 0.45, 1.0, col, icn);
    T(s, lab, { x: 9.2, y, w: 2.2, h: 2.15, fontSize: 28, bold: true, color: C.accent1, valign: 'middle' });
    opts.forEach((o, i) => { const x = 6.45 - i * 2.8; s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: y + 0.4, w: 2.6, h: 1.35, rectRadius: 0.14, fill: { color: r ? 'E6EEFA' : C.background2 }, line: { type: 'none' }, objectName: `opt ${r + 1}.${i + 1}` }); T(s, o, { x, y: y + 0.4, w: 2.6, h: 1.35, fontSize: 21, bold: true, color: C.accent1, align: 'center', valign: 'middle' }); });
  }
  s.addNotes('שני צירים: איך מקבלים, חד-פעמי, קצבה או משיכות. ואיך מחזירים: אפס החזר, ריבית בלבד, או שפיצר. משלבים לפי מה שמתאים להורים.');

  s = content('"לא יישאר לנו כלום?" בואו נבדוק', 'הבית כנכס', 'הבית כנכס', 'בכל המסלולים, שווי הנכס נשאר מעל יתרת החוב');
  const labels = ['היום', '+5', '+10', '+15', 'עד 120'], value = [100, 108, 117, 126, 136];
  const debts = [['ללא החזר', 'גדל מהר יותר', [30, 38, 48, 60, 75]], ['ריבית בלבד', 'גדל לאט', [30, 31, 32, 33, 34]], ['שפיצר', 'הולך וקטן', [30, 23, 15, 7, 0]]];
  debts.forEach(([t, cap, d], i) => {
    const x = 8.75 - i * 4.07; card(s, x, 1.65, 3.95, 4.85, C.background1, 'chart ' + (i + 1));
    T(s, t, { x, y: 1.8, w: 3.95, h: 0.5, fontSize: 22, bold: true, color: C.accent1, align: 'center' });
    s.addChart(pres.charts.LINE, [{ name: 'שווי הנכס', labels, values: value }, { name: 'יתרת החוב', labels, values: d }], {
      x: x + 0.1, y: 2.3, w: 3.75, h: 3.45, chartColors: [HEX.cyan, HEX.blue], lineSize: 4, lineDataSymbol: 'none', showLegend: true, legendPos: 'b', legendFontSize: 12, legendFontFace: '+mn-lt', legendColor: HEX.muted,
      catAxisLabelColor: HEX.muted, catAxisLabelFontSize: 11, catAxisLabelFontFace: '+mn-lt', valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 140, valGridLine: { color: HEX.line, size: 0.5 }, catGridLine: { style: 'none' }, objectName: 'debt ' + (i + 1), altText: `${t}: החוב ${cap}, שווי הנכס עולה`,
    });
    T(s, 'החוב ' + cap, { x, y: 5.85, w: 3.95, h: 0.5, fontSize: 18, bold: true, color: i === 2 ? C.accent3 : C.accent1, align: 'center' });
  });
  src(s, 'המחשה בלבד; ההתפתחות בפועל תלויה בריבית, בהצמדה ובשווי הנכס');
  s.addNotes('זה החשש הראשון של הילדים: לא יישאר לנו כלום? בשפיצר החוב יורד, בריבית בלבד גדל לאט, וללא החזר גדל מהר יותר, בגלל ריבית דריבית. אבל בכל המסלולים שווי הנכס נשאר גבוה מהחוב. להמחשה.');

  s = content('בגיל 70: כ-900 אלף ₪ מדירה של 3 מ׳', 'הבית כנכס', 'הבית כנכס', 'ככל שהגיל עולה, אחוז המימון עולה');
  s.addChart(pres.charts.BAR, [{ name: 'מימון מרבי', labels: ['55', '60', '70', '80', '90+'], values: [35, 39, 48, 50, 60] }], {
    x: 0.6, y: 1.55, w: 7.6, h: 4.95, barDir: 'col', barGapWidthPct: 45, chartColors: [HEX.blue], ...chartTxt, showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0"%"', dataLabelColor: HEX.blue,
    valAxisMinVal: 0, valAxisMaxVal: 70, valGridLine: { style: 'none' }, showLegend: false, showCatAxisTitle: true, catAxisTitle: 'גיל הלווה הצעיר', catAxisTitleColor: HEX.muted, catAxisTitleFontSize: 12, catAxisTitleFontFace: '+mn-lt',
    showTitle: true, title: 'מימון מרבי בשוק משווי הנכס', titleColor: HEX.ink, titleFontSize: 14, titleFontFace: '+mn-lt', objectName: 'financing chart', altText: 'מימון מרבי לפי גיל: 35% בגיל 55 עד 60% מגיל 90',
  });
  card(s, 8.6, 1.75, 4.13, 4.7, C.accent1, 'example');
  await bubble(s, 10.07, 2.0, 1.2, HEX.cyan, 'LuHouse');
  T(s, 'דירה של 3 מ׳ ₪, גיל 70', { x: 8.75, y: 3.35, w: 3.83, h: 0.6, fontSize: 18, color: C.background2, align: 'center' });
  big(s, '≈ 900K ₪', 8.6, 3.95, 4.13, 1.2, HEX.white, 46);
  T(s, 'להמחשה בלבד', { x: 8.75, y: 5.4, w: 3.83, h: 0.4, fontSize: 12, color: C.background2, align: 'center' });
  src(s, 'מקור: השוואת תנאי גופים מלווים בשוק, 2026; הדוגמה להמחשה');
  s.addNotes('ככל שהגיל עולה, שיעור המימון עולה: בגיל 55 בין 15 ל-35 אחוז, ובגיל 90 עד 50–60 אחוז. בדירה של 3 מיליון ₪ בגיל 70, מדובר בכ-900 אלף ₪.');

  s = content('חברת ביטוח או בנק? ההבדל מתחיל בהכנסות', 'הבית כנכס', 'הבית כנכס', 'מי שאין לו הכנסה לבדיקה, צריך מסלול אחר');
  const hd = (t, f, c) => ({ text: t, options: { bold: true, fontSize: 18, color: c, fill: { color: f }, align: 'center', valign: 'middle', rtlMode: true, lang: 'he-IL' } });
  const cell = (t, o = {}) => ({ text: t, options: { fontSize: 16, color: HEX.ink, align: 'right', valign: 'middle', rtlMode: true, lang: 'he-IL', ...o } });
  const topic = t => cell(t, { bold: true, color: HEX.blue, fill: { color: HEX.ice } });
  const rows = [['פיקוח', 'רשות שוק ההון', 'בנק ישראל'], ['בדיקת הכנסות', 'בדרך כלל לא (בלי החזר)', 'לרוב כן'], ['תקופה', 'בלי מועד פירעון קבוע', 'תקופה מוגדרת'], ['החזר חודשי', 'אפס / ריבית / שפיצר', 'לרוב ריבית או החזר'], ['קבלת הכסף', 'חד-פעמי, ולעיתים קצבה', 'בעיקר חד-פעמי']];
  const tbl = [[hd('בנקים', HEX.blue, HEX.white), hd('חברות ביטוח', HEX.teal, HEX.white), hd('', HEX.ice, HEX.blue)]];
  rows.forEach(([a, i, b]) => tbl.push([cell(b), cell(i), topic(a)]));
  s.addTable(tbl, { x: 0.6, y: 1.75, w: 12.13, colW: [4.6, 4.6, 2.93], rowH: 0.72, border: { type: 'solid', color: HEX.white, pt: 2 }, fill: { color: HEX.white }, fontFace: THEME.bodyFontFace, margin: [0.05, 0.15, 0.05, 0.15], objectName: 'insurers vs banks' });
  src(s, 'מקור: השוואה כללית של מוצרי הגופים המלווים; התנאים משתנים ומתעדכנים');
  s.addNotes('בלי הכנסה לבדיקה, חברת ביטוח. עם פנסיה יציבה, אולי בנק. ההשוואה כללית, והתנאים משתנים בין הגופים.');

  s = content('"ומה איתנו? הירושה?"', 'הבית כנכס', 'הבית כנכס', 'היורשים בוחרים מה לעשות, ויש להם שנה להחליט');
  await tiles(s, [['LuKeyRound', 'לפרוע', 'ולשמור על הדירה'], ['LuHandCoins', 'למכור', 'ולקבל את היתרה'], ['LuCalendarHeart', 'שנה שלמה', 'להחליט בשקט']], 1.75, 3.5);
  card(s, 0.6, 5.5, 12.13, 0.95, C.accent1, 'quote');
  T(s, 'ירושה היא גם הורים מאושרים עכשיו, בלי שתצטרכו לממן אותם', { x: 0.9, y: 5.5, w: 11.5, h: 0.95, fontSize: 22, bold: true, italic: true, color: C.background1, align: 'center', valign: 'middle' });
  src(s, 'מקור: תנאי הגופים המלווים; יש לבדוק את הסעיפים בחוזה');
  s.addNotes('אחרי 120 היורשים בוחרים: לפרוע ולשמור על הדירה, או למכור ולקבל את היתרה, ויש להם שנה להחליט. ירושה היא לא רק כסף אחרי, היא גם הורים מאושרים עכשיו.');

  s = content('אותו בית, שני סיפורי פרישה', 'הבית כנכס', 'הבית כנכס', 'קצבה דלה מול עצמאות');
  card(s, 6.95, 1.7, 5.78, 4.8, C.background1, 'without');
  T(s, 'בלי', { x: 6.95, y: 1.85, w: 5.78, h: 0.7, fontSize: 30, bold: true, color: C.accent4, align: 'center' });
  const wo = [['LuBanknote', 'קצבה דלה'], ['LuUsers', 'נשענים על הילדים'], ['LuHouse', 'בית לא מותאם'], ['LuCreditCard', 'החזרים גבוהים']];
  for (let i = 0; i < 4; i++) { const y = 2.75 + i * 0.9; s.addImage({ data: await ic(wo[i][0], HEX.gray2), x: 11.7, y: y + 0.08, w: 0.55, h: 0.55, altText: '' }); T(s, wo[i][1], { x: 7.3, y, w: 4.2, h: 0.7, fontSize: 21, color: C.accent4, valign: 'middle' }); }
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.7, w: 6.05, h: 4.8, rectRadius: 0.16, fill: { color: C.accent1 }, line: { type: 'none' }, shadow: shadow(), objectName: 'with' });
  img(s, 'beach-family.jpg', 0.6, 1.7, 2.3, 4.8, { alt: 'משפחה בחוף הים' });
  T(s, 'עם', { x: 2.9, y: 1.85, w: 3.75, h: 0.7, fontSize: 30, bold: true, color: C.accent2, align: 'center' });
  const wi = [['LuHandCoins', 'עצמאות כלכלית'], ['LuHeart', 'עוזרים לנכדים'], ['LuPaintRoller', 'שיפוץ, הרחבה, ממ״ד'], ['LuSmile', 'איכות חיים עכשיו']];
  for (let i = 0; i < 4; i++) { const y = 2.75 + i * 0.9; s.addImage({ data: await ic(wi[i][0], HEX.white), x: 5.9, y: y + 0.08, w: 0.55, h: 0.55, altText: '' }); T(s, wi[i][1], { x: 3.05, y, w: 2.75, h: 0.7, fontSize: 20, bold: true, color: C.background1, valign: 'middle' }); }
  s.addNotes('בלי פתרון: קצבה דלה, נשענים על הילדים, בית לא מותאם והחזרים גבוהים. עם משכנתה הפוכה: עצמאות, עוזרים לנכדים במקום להישען עליהם, משפצים, ונהנים כבר עכשיו.');

  // ════ ה. ההגנות ════
  pres.addSection({ title: 'ההגנות' });
  s = dark('ההגנות');
  T(s, 'לא תרצו שזה יקרה…', { x: 0.6, y: 0.9, w: 12.13, h: 1.0, fontSize: 44, bold: true, color: C.background1, align: 'center' });
  T(s, '4 מקרים אמיתיים. 4 פתרונות פשוטים.', { x: 0.6, y: 1.95, w: 12.13, h: 0.6, fontSize: 24, color: C.accent2, align: 'center' });
  const cases = [['LuScrollText', 'צוואה וירושה'], ['LuSignature', 'ייפוי כוח מתמשך'], ['LuStethoscope', 'ביטוח סיעודי'], ['LuHospital', 'ביטוחי בריאות']];
  for (let i = 0; i < 4; i++) { const x = 9.95 - i * 3.05; s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 3.05, w: 2.8, h: 2.9, rectRadius: 0.18, fill: { color: C.accent1, transparency: 35 }, line: { color: HEX.cyan, width: 1.5 }, objectName: 'case ' + (i + 1) }); await bubble(s, x + 0.75, 3.3, 1.3, HEX.cyan, cases[i][0]); T(s, cases[i][1], { x: x + 0.1, y: 4.8, w: 2.6, h: 0.9, fontSize: 20, bold: true, color: C.background1, align: 'center', valign: 'top' }); }
  s.addNotes('עד עכשיו דיברנו על איך להגדיל את הכסף. עכשיו נדבר על איך לא לאבד אותו, ואת השקט של המשפחה, ברגע אחד.');

  const caseData = [
    ['צוואה וירושה', 'LuScrollText', 'אבא נפטר בלי צוואה. כשאמא רצתה למכור ולעבור לדיור מוגן, אח אחד סירב, והכל נתקע.', 'צוואה מסודרת (גם הדדית) שמותאמת לרצון ההורים. בן הזוג שנשאר חי בשקט, והמשפחה מאוחדת.'],
    ['ייפוי כוח מתמשך', 'LuSignature', 'אמא אובחנה בדמנציה. אף אחד לא יכול לפעול בחשבון שלה, והילדים נגררו לבית משפט לחודשים.', 'ייפוי כוח מתמשך שנחתם מראש בפני עו״ד מוסמך. ההורים בוחרים בעצמם מי יחליט בשבילם.'],
    ['ביטוח סיעודי', 'LuStethoscope', 'אבא עבר אירוע מוחי והפך סיעודי. מטפלת עולה אלפי שקלים בחודש, והחסכונות נגמרו תוך שנה.', 'בדיקה מראש של הביטוח הסיעודי והפוליסות, מימוש גמלת סיעוד, ומשכנתה הפוכה כגיבוי.'],
    ['ביטוחי בריאות', 'LuHospital', 'אמא נזקקה לניתוח, ואז התברר שהביטוח הפרטי שלה בוטל לפני שנים כי הוראת קבע נפלה.', 'מיפוי כל הביטוחים ב"הר הביטוח", ביטול כפילויות ושמירה על מה שחשוב באמת.'],
  ];
  for (let i = 0; i < 4; i++) {
    const [t, icn, bad, fix] = caseData[i];
    s = content(`מקרה ${i + 1}: ${t}`, 'ההגנות', 'ההגנות', 'מה הייתם עושים במקומם?');
    card(s, 0.6, 1.65, 12.13, 2.25, 'EEF0F4', 'bad');
    await bubble(s, 11.45, 1.95, 1.0, 'FDECE8', 'LuTriangleAlert', HEX.warn);
    T(s, 'לא תרצו שזה יקרה…', { x: 6.5, y: 1.85, w: 4.8, h: 0.55, fontSize: 20, bold: true, color: 'C2410C' });
    T(s, bad, { x: 2.5, y: 2.45, w: 8.8, h: 1.3, fontSize: 21, color: C.text1, valign: 'top' });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 4.1, w: 12.13, h: 2.35, rectRadius: 0.16, fill: { color: C.accent1 }, line: { type: 'none' }, shadow: shadow(), objectName: 'fix' });
    await bubble(s, 11.45, 4.4, 1.0, HEX.cyan, 'LuCircleCheck');
    T(s, 'הפתרון', { x: 6.5, y: 4.3, w: 4.8, h: 0.55, fontSize: 20, bold: true, color: C.accent2 });
    T(s, fix, { x: 2.5, y: 4.9, w: 8.8, h: 1.3, fontSize: 21, bold: true, color: C.background1, valign: 'top' });
    await bubble(s, 0.85, 2.85, 1.5, i % 2 ? HEX.cyan : HEX.blue, icn);
    src(s, 'מקרה להמחשה, אינו סיפור של לקוח אמיתי');
    s.addNotes(`מספרים את המקרה כסיפור, כ-90 שניות, ושואלים את הקהל: "למי מההורים שלכם כבר יש ${t}?" המקרים להמחשה.`);
  }

  // ════ ו. מקרה בוחן ════
  pres.addSection({ title: 'מקרה בוחן' });
  s = content('משפחת לוי: הילדים משלמים 1,500 ₪ בחודש', 'מקרה בוחן', 'מקרה בוחן', 'נשמע מוכר?');
  const lev = [['LuUsers', '70 + 68', 'גילאי ההורים'], ['LuBanknote', '7,200 ₪', 'הכנסה חודשית'], ['LuReceipt', '9,500 ₪', 'הוצאה חודשית'], ['LuHouse', '3 מ׳ ₪', 'שווי הדירה']];
  for (let i = 0; i < 4; i++) { const x = 9.75 - i * 3.05; card(s, x, 1.7, 2.85, 3.2, C.background1, 'fact ' + (i + 1)); await bubble(s, x + 0.85, 1.95, 1.15, i === 2 ? 'FDECE8' : HEX.ice, lev[i][0], i === 2 ? HEX.warn : HEX.blue); big(s, lev[i][1], x, 3.2, 2.85, 0.8, i === 2 ? HEX.warn : HEX.blue, 32); T(s, lev[i][2], { x, y: 4.05, w: 2.85, h: 0.5, fontSize: 16, color: C.accent4, align: 'center' }); }
  card(s, 0.6, 5.2, 12.13, 1.25, 'FDECE8', 'kids pay');
  T(s, [{ text: 'הילדים מעבירים ', options: {} }, { text: '1,500 ₪ בחודש', options: { color: 'C2410C' } }, { text: ' כדי לסגור את הפער', options: {} }], { x: 0.9, y: 5.2, w: 11.5, h: 1.25, fontSize: 26, bold: true, align: 'center', valign: 'middle' });
  src(s, 'מקרה להמחשה; המספרים מעוגלים');
  s.addNotes('הורים בני 70 ו-68. קצבת זקנה וותק כ-3,700 ₪ ופנסיה כ-3,500 ₪, ביחד כ-7,200 ₪. הוצאות כ-9,500 ₪. דירה בשווי 3 מיליון ₪. הילדים מעבירים 1,500 ₪ בחודש.');

  s = content('אחרי התכנון: הילדים מפסיקים לשלם', 'מקרה בוחן', 'מקרה בוחן', 'שלושה מנופים סגרו את הפער');
  s.addChart(pres.charts.BAR, [{ name: 'קצבאות ופנסיה', labels: ['לפני', 'אחרי'], values: [7200, 7800] }, { name: 'חיסכון בהוצאות', labels: ['לפני', 'אחרי'], values: [0, 500] }, { name: 'משכנתה הפוכה', labels: ['לפני', 'אחרי'], values: [0, 2500] }, { name: 'עזרה מהילדים', labels: ['לפני', 'אחרי'], values: [1500, 0] }], {
    x: 0.6, y: 1.55, w: 7.2, h: 4.95, barDir: 'col', barGrouping: 'stacked', barGapWidthPct: 55, chartColors: [HEX.blue, HEX.teal, HEX.cyan, 'F4A28C'], ...chartTxt, catAxisLabelFontSize: 18,
    showValue: false, valAxisMinVal: 0, valAxisMaxVal: 11500, valGridLine: { color: HEX.line, size: 0.5 }, showLegend: true, legendPos: 'b', legendFontSize: 13, legendFontFace: '+mn-lt', legendColor: HEX.muted,
    showTitle: true, title: 'מקורות ההכנסה החודשית (₪)', titleColor: HEX.ink, titleFontSize: 14, titleFontFace: '+mn-lt', objectName: 'levi chart', altText: 'לפני: 7,200 ₪ ועוד 1,500 ₪ מהילדים. אחרי: 7,800 ₪, 500 ₪ חיסכון ו-2,500 ₪ ממשכנתה הפוכה, בלי עזרה מהילדים',
  });
  const after = [['LuBadgeCheck', '+600 ₪', 'זכויות ומס'], ['LuScissors', '+500 ₪', 'פחות הוצאות'], ['LuHouse', '+2,500 ₪', 'משכנתה הפוכה']];
  for (let i = 0; i < 3; i++) { const y = 1.65 + i * 1.28; card(s, 8.2, y, 4.53, 1.12, C.background1, 'lever ' + (i + 1)); await bubble(s, 11.85, y + 0.17, 0.78, i === 2 ? HEX.cyan : HEX.blue, after[i][0]); big(s, after[i][1], 8.35, y, 1.9, 1.12, HEX.blue, 26); T(s, after[i][2], { x: 10.2, y, w: 1.55, h: 1.12, fontSize: 16, bold: true, color: C.accent4, valign: 'middle' }); }
  card(s, 8.2, 5.55, 4.53, 0.9, C.accent1, 'result');
  T(s, 'הילדים כבר לא משלמים ✓', { x: 8.35, y: 5.55, w: 4.23, h: 0.9, fontSize: 20, bold: true, color: C.background1, align: 'center', valign: 'middle' });
  src(s, 'מקרה להמחשה; המספרים מעוגלים');
  s.addNotes('אחרי: כ-600 ₪ ממיצוי זכויות ומס, כ-500 ₪ מצמצום הוצאות, ומשכנתה הפוכה של כ-900 אלף ₪: 300 אלף לשיפוץ ולעזרה לנכד, והשאר משיכות של כ-2,500 ₪ בחודש. הפער נסגר, והילדים כבר לא משלמים. להמחשה בלבד.');

  s = content('השיחה שכדאי לקיים השבת', 'מקרה בוחן', 'מקרה בוחן', 'חמש שאלות שפותחות את הנושא בלי ויכוח');
  const qs = [['LuSparkles', 'מה הייתם רוצים לעשות?'], ['LuBanknote', 'כמה נכנס בחודש?'], ['LuSearch', 'איפה החסכונות?'], ['LuScrollText', 'יש ייפוי כוח?'], ['LuMessageCircle', 'ממה אתם הכי חוששים?']];
  for (let i = 0; i < 5; i++) {
    const col = i < 3 ? i : i - 3, row = i < 3 ? 0 : 1; const w = 3.85;
    const x = row === 0 ? 8.88 - col * 4.14 : 6.81 - col * 4.14, y = 1.75 + row * 2.35;
    s.addShape(pres.shapes.ROUNDED_RECTANGULAR_CALLOUT, { x, y, w, h: 1.85, fill: { color: i === 0 ? C.accent1 : C.background1 }, line: { color: i === 0 ? HEX.blue : HEX.line, width: 1 }, shadow: shadow(), objectName: 'bubble ' + (i + 1) });
    s.addImage({ data: await ic(qs[i][0], i === 0 ? HEX.cyan : HEX.teal), x: x + w - 0.85, y: y + 0.3, w: 0.6, h: 0.6, altText: '' });
    T(s, qs[i][1], { x: x + 0.25, y: y + 0.2, w: w - 1.15, h: 1.3, fontSize: 21, bold: true, color: i === 0 ? C.background1 : C.accent1, valign: 'middle' });
  }
  T(s, 'מתחילים מהחלומות, לא מהחובות · מזמינים את כל האחים', { x: 0.6, y: 6.15, w: 12.13, h: 0.4, fontSize: 16, bold: true, color: C.accent3, align: 'center' });
  s.addNotes('חמש שאלות לשיחת שבת: מה הייתם רוצים לעשות, כמה נכנס בחודש, איפה החסכונות, האם יש ייפוי כוח מתמשך, וממה אתם הכי חוששים. להתחיל מהחלומות, לא מהחובות, ולהזמין את כל האחים.');

  // ════ ז. סיכום ════
  pres.addSection({ title: 'סיכום' });
  s = dark('סיכום');
  s.addShape(pres.shapes.OVAL, { x: 0.9, y: 1.1, w: 3.9, h: 3.9, fill: { color: C.background1 }, line: { color: HEX.cyan, width: 5 }, objectName: 'photo ring' });
  img(s, 'shiral.jpg', 1.02, 1.22, 3.66, 3.66, { round: true, alt: 'שיראל פרגר' });
  T(s, 'קבעו בדיקה משפחתית השבוע', { x: 5.4, y: 0.9, w: 7.33, h: 0.9, fontSize: 38, bold: true, color: C.background1 });
  T(s, 'שעה אחת, כל המשפחה, תוכנית ברורה. ללא התחייבות', { x: 5.4, y: 1.75, w: 7.33, h: 0.6, fontSize: 22, color: C.accent2 });
  const inc = [['LuBadgeCheck', 'מיפוי זכויות'], ['LuHouse', 'אפשרויות הבית'], ['LuClipboardList', 'תוכנית ברורה']];
  for (let i = 0; i < 3; i++) { const x = 10.55 - i * 2.6; await bubble(s, x + 0.65, 2.7, 1.0, HEX.cyan, inc[i][0]); T(s, inc[i][1], { x, y: 3.8, w: 2.3, h: 0.5, fontSize: 17, bold: true, color: C.background1, align: 'center' }); }
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.2, y: 5.25, w: 3.3, h: 1.45, rectRadius: 0.12, fill: { color: C.background1 }, line: { type: 'none' }, objectName: 'qr card' });
  s.addImage({ path: A('qr-wa.png'), x: 1.3, y: 5.33, w: 1.3, h: 1.3, altText: 'QR לוואטסאפ של שיראל' });
  T(s, 'סרקו לוואטסאפ', { x: 2.65, y: 5.25, w: 1.75, h: 1.45, fontSize: 15, bold: true, color: C.accent1, align: 'center', valign: 'middle' });
  const ct = [['LuPhone', '052-441-5395'], ['LuMail', 'sp.makesense@gmail.com']];
  for (let i = 0; i < 2; i++) { const y = 4.75 + i * 0.85; s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.6, y, w: 5.13, h: 0.68, rectRadius: 0.34, fill: { color: C.accent2, transparency: 80 }, line: { color: HEX.cyan, width: 1 }, objectName: 'contact ' + (i + 1) }); s.addImage({ data: await ic(ct[i][0], HEX.white), x: 12.15, y: y + 0.15, w: 0.38, h: 0.38, altText: '' }); T(s, ct[i][1], { x: 7.8, y, w: 4.2, h: 0.68, fontSize: 21, bold: true, color: C.background1, valign: 'middle', align: 'left', rtlMode: false }); }
  s.addNotes('הצעד הבא: פגישת בדיקה משפחתית ללא התחייבות. מיפוי הכנסות וזכויות, בדיקת אפשרויות הבית, ותוכנית ברורה. אפשר להוסיף הטבה לנרשמים מההרצאה.');

  s = dark('סיכום');
  T(s, 'שאלות?', { x: 0.6, y: 1.0, w: 12.13, h: 1.6, fontSize: 80, bold: true, color: C.background1, align: 'center' });
  const lev4 = [['LuBadgeCheck', 'זכויות'], ['LuPercent', 'מס'], ['LuSearch', 'חיסכון'], ['LuHouse', 'הבית']];
  for (let i = 0; i < 4; i++) { const x = 9.4 - i * 2.4; await bubble(s, x + 0.45, 3.1, 1.3, i === 3 ? HEX.cyan : HEX.blue, lev4[i][0]); T(s, lev4[i][1], { x, y: 4.5, w: 2.2, h: 0.5, fontSize: 20, bold: true, color: C.background2, align: 'center' }); }
  T(s, 'תודה! · שיראל פרגר | MAKE SENSE', { x: 0.6, y: 5.5, w: 12.13, h: 0.6, fontSize: 22, color: C.accent2, align: 'center' });
  T(s, 'המידע במצגת כללי ואינו מהווה ייעוץ אישי. הנתונים נכונים ל-2026 ולהמחשה; יש לבדוק מול המקורות הרשמיים.', { x: 0.6, y: 6.15, w: 12.13, h: 0.4, fontSize: 11, color: 'CFEFF5', align: 'center' });
  s.addNotes('שאלות ותשובות. בסיום מחלקים את הצ\'קליסט "10 דברים לבדוק עם ההורים".');


  // ════ מפת הדרך הביתה (שקופית אחרונה) ════
  s = content('מפת הדרך: 8 תחנות לבדוק עם ההורים', 'קחו הביתה', 'סיכום', 'סמנו V על כל תחנה שסגרתם');
  const RY1 = 3.15, RY2 = 5.0, band = 0.46, roadC = 'D6E6FB';
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.0, y: RY1 - band / 2, w: 11.55, h: band, rectRadius: 0.23, fill: { color: roadC }, line: { type: 'none' }, objectName: 'road top' });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.0, y: RY2 - band / 2, w: 10.9, h: band, rectRadius: 0.23, fill: { color: roadC }, line: { type: 'none' }, objectName: 'road bottom' });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.0, y: RY1 - band / 2, w: band, h: RY2 - RY1 + band, rectRadius: 0.23, fill: { color: roadC }, line: { type: 'none' }, objectName: 'road turn' });
  s.addShape(pres.shapes.LINE, { x: 1.5, y: RY1, w: 10.9, h: 0, line: { color: HEX.white, width: 2, dashType: 'dash' }, objectName: 'lane top' });
  s.addShape(pres.shapes.LINE, { x: 1.5, y: RY2, w: 9.9, h: 0, line: { color: HEX.white, width: 2, dashType: 'dash' }, objectName: 'lane bottom' });
  const stops = [
    ['LuMessageCircle', 'שיחה פתוחה', 'מתחילים מהחלומות'], ['LuBanknote', 'הכנסות וזכויות', 'ותק · השלמת הכנסה'], ['LuPercent', 'מס', 'קיבוע זכויות 161ד'], ['LuSearch', 'חיסכון', 'הר הכסף · מסלקה'],
    ['LuScissors', 'הוצאות', 'הלוואות · ביטוחים כפולים'], ['LuHouse', 'הבית', 'שווי · משכנתה הפוכה'], ['LuScrollText', 'צוואה וייפוי כוח', 'אצל עו״ד מוסמך'], ['LuStethoscope', 'סיעוד ובריאות', '"הר הביטוח"'],
  ];
  const xsTop = [11.25, 8.75, 6.25, 3.75], xsBot = [2.3, 4.75, 7.2, 9.65];
  for (let i = 0; i < 8; i++) {
    const top = i < 4, cx = top ? xsTop[i] : xsBot[i - 4], cy = top ? RY1 : RY2, d = 0.95;
    await bubble(s, cx - d / 2, cy - d / 2, d, i % 2 ? HEX.cyan : HEX.blue, stops[i][0], HEX.white, 'stop ' + (i + 1));
    s.addShape(pres.shapes.OVAL, { x: cx + 0.22, y: cy - 0.62, w: 0.4, h: 0.4, fill: { color: C.background1 }, line: { color: HEX.blue, width: 1.25 }, objectName: 'num ' + (i + 1) });
    T(s, String(i + 1), { x: cx + 0.22, y: cy - 0.62, w: 0.4, h: 0.4, fontSize: 12, bold: true, color: C.accent1, align: 'center', valign: 'middle', rtlMode: false });
    const ly = top ? cy - 1.55 : cy + 0.6;
    T(s, stops[i][1], { x: cx - 1.15, y: ly, w: 2.3, h: 0.42, fontSize: 17, bold: true, color: C.accent1, align: 'center', valign: top ? 'bottom' : 'top' });
    T(s, stops[i][2], { x: cx - 1.15, y: ly + 0.42, w: 2.3, h: 0.38, fontSize: 13, color: C.accent4, align: 'center', valign: 'top' });
  }
  await bubble(s, 11.35, RY2 - 0.55, 1.1, HEX.teal, 'LuFlag', HEX.white, 'finish');
  T(s, 'בדיקה משפחתית', { x: 10.95, y: RY2 + 0.6, w: 1.85, h: 0.42, fontSize: 14, bold: true, color: C.accent3, align: 'center' });
  T(s, '052-441-5395', { x: 11.0, y: RY2 + 1.02, w: 1.78, h: 0.36, fontSize: 13, bold: true, color: C.accent1, align: 'center', rtlMode: false });
  T(s, 'התחלה', { x: 11.85, y: RY1 + 0.3, w: 0.9, h: 0.3, fontSize: 12, bold: true, color: C.accent3, align: 'center' });
  s.addNotes('לפני שנפרדים: מפת הדרך הביתה. שמונה תחנות, כל אחת היא טיפ מההרצאה: שיחה פתוחה, הכנסות וזכויות, מס, חיסכון, הוצאות, הבית, צוואה וייפוי כוח, וסיעוד ובריאות. מי שרוצה לעבור את המסלול איתי, מגיע לבדיקה משפחתית.');

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log('wrote', OUT);
})().catch(e => { console.error(e); process.exit(1); });
