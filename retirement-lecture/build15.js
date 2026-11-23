// 15-slide lecture deck (generated layout from build2.js; backups hidden at the end)
// v2 lecture deck — photo-led, low-text, story thread ("נועה"), law-based cases,
// Morph transitions + timed entrance animations (PowerPoint 365 / 2019+).
// Run: PPTX_SKILL=<pptx skill dir> NODE_PATH=<node_modules: pptxgenjs, react-icons, react, react-dom, sharp, jszip> node build2.js
const path = require('path'), fs = require('fs');
const pptxgen = require('pptxgenjs');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const L = require('react-icons/lu');
const sharp = require('sharp');
const JSZip = require('jszip');
const { applyTheme } = require(process.env.PPTX_SKILL + '/scripts/apply_theme.js');

const A = f => path.join(__dirname, 'assets', f);
const AI = f => A('ai/' + f + '.jpg');
const OUT = path.join(__dirname, 'ההורים-שלנו-הכסף-שלהם-15-שקפים-שיראל-פרגר.pptx');
const HEX = { navy: '001A4D', blue: '004AAD', cyan: '1FB3C8', teal: '137897', ice: 'E8F8FB', ink: '14213D', muted: '5A6478', line: 'DDE3EF', gray: 'F1F3F7', white: 'FFFFFF', gray2: '8A93A6', warn: 'E5614A', warnD: 'C2410C' };
const THEME = { name: 'MAKE SENSE', headFontFace: 'Arial', bodyFontFace: 'Arial',
  colors: { dk1: HEX.ink, lt1: HEX.white, dk2: HEX.navy, lt2: HEX.ice, accent1: HEX.blue, accent2: HEX.cyan, accent3: HEX.teal, accent4: HEX.muted, accent5: HEX.line, accent6: HEX.gray, hlink: HEX.blue, folHlink: HEX.teal } };

const cache = {};
async function ic(name, hex) {
  const k = name + hex; if (cache[k]) return cache[k];
  const svg = renderToStaticMarkup(React.createElement(L[name], { size: 256, color: '#' + hex }));
  return (cache[k] = 'image/png;base64,' + (await sharp(Buffer.from(svg)).png().toBuffer()).toString('base64'));
}

(async () => {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE'; pres.rtlMode = true;
  pres.title = 'ההורים שלנו, הכסף שלהם, והשקט של כולנו'; pres.author = 'שיראל פרגר'; pres.company = 'MAKE SENSE';
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  let BACKUP = false; const _addSlide = pres.addSlide.bind(pres); pres.addSlide = o => _addSlide(BACKUP ? { ...o, sectionTitle: 'גיבוי' } : o);
  const C = pres.SchemeColor, he = { rtlMode: true, lang: 'he-IL', align: 'right' };

  const corner = [
    { rect: { x: 12.98, y: 6.55, w: 0.36, h: 0.95, fill: { color: HEX.blue } } },
    { rect: { x: 12.66, y: 6.88, w: 0.32, h: 0.62, fill: { color: HEX.cyan } } },
    { rect: { x: 12.4, y: 7.12, w: 0.26, h: 0.38, fill: { color: 'B9C1CF' } } },
  ];
  const credit = color => ({ text: { text: 'MAKESENSE | שיראל פרגר – יועץ משכנתאות', options: { x: 1.38, y: 6.92, w: 4.6, h: 0.36, fontSize: 10, color, align: 'left', rtlMode: false, lang: 'he-IL', margin: 0 } } });
  pres.defineSlideMaster({ title: 'CONTENT', background: { color: 'F7F9FC' }, objects: [...corner, { image: { x: 0.45, y: 6.88, w: 0.86, h: 0.44, path: A('logo.png') } }, credit(HEX.muted),
    { placeholder: { options: { name: 'title', type: 'title', x: 3.45, y: 0.36, w: 9.28, h: 0.78, fontSize: 30, bold: true, color: C.accent1, align: 'right', rtlMode: true, lang: 'he-IL', margin: 0, valign: 'middle' }, text: 'כותרת' } }],
    slideNumber: { x: 11.75, y: 6.92, w: 0.5, h: 0.36, fontSize: 10, color: C.accent4, align: 'right' } });
  pres.defineSlideMaster({ title: 'DARK', background: { color: C.text2 }, objects: [...corner, { image: { x: 0.45, y: 6.88, w: 0.86, h: 0.44, path: A('logo-white.png') } }, credit('CFEFF5')] });
  pres.defineSlideMaster({ title: 'PHOTO', background: { color: C.text2 }, objects: [] });

  // ── helpers ──
  let seq = 0; const an = (n) => `a${String(n).padStart(2, '0')}_` + (++seq); // animation order tag
  // every paragraph (incl. each run of a multi-line array) gets RTL + right alignment unless it is an LTR string
  const T = (s, text, o) => { const base = { ...he, ...o }; const t = Array.isArray(text) ? text.map(r => ({ ...r, options: { rtlMode: base.rtlMode, align: base.align, lang: 'he-IL', ...(r.options || {}) } })) : text; return s.addText(t, { isTextBox: true, fontSize: 18, color: C.text1, margin: 0, ...base }); };
  const shadow = () => ({ type: 'outer', color: '00337A', blur: 14, offset: 4, angle: 90, opacity: 0.14 });
  const card = (s, x, y, w, h, fill, name) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.16, fill: { color: fill || C.background1 }, line: { type: 'none' }, shadow: shadow(), objectName: name });
  const bubble = async (s, x, y, d, fill, icon, iconHex = HEX.white, name = 'icon') => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { type: 'none' }, objectName: name });
    s.addImage({ data: await ic(icon, iconHex), x: x + d * 0.23, y: y + d * 0.23, w: d * 0.54, h: d * 0.54, altText: '', objectName: name + ' glyph' });
  };
  // pre-crop every photo to the exact box ratio (cx/cy = focus centre 0..1) so nothing is ever stretched
  const crop = async (file, w, h, cx = 0.5, cy = 0.5) => {
    const m = await sharp(file).metadata(), tr = w / h;
    let cw = m.width, ch = Math.round(m.width / tr); if (ch > m.height) { ch = m.height; cw = Math.round(m.height * tr); }
    const clamp = (v, max) => Math.max(0, Math.min(max, Math.round(v)));
    const left = clamp(cx * m.width - cw / 2, m.width - cw), top = clamp(cy * m.height - ch / 2, m.height - ch);
    return 'image/jpeg;base64,' + (await sharp(file).extract({ left, top, width: cw, height: ch }).jpeg({ quality: 90 }).toBuffer()).toString('base64');
  };
  const img = async (s, file, x, y, w, h, alt, name, cx, cy, extra = {}) => s.addImage({ data: await crop(file, w, h, cx, cy), x, y, w, h, altText: alt || '', objectName: name || 'photo', ...extra });
  const photo = (s, f, x, y, w, h, alt, name, cx, cy) => img(s, AI(f), x, y, w, h, alt, name, cx, cy);
  // plain-language strip: one sentence per term
  const plain = (s, text, y = 5.85, h = 0.6) => { s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 12.13, h, rectRadius: 0.12, fill: { color: HEX.ice }, line: { type: 'none' }, objectName: 'plain' }); T(s, [{ text: 'במילים פשוטות: ', options: { bold: true, color: C.accent3 } }, { text, options: {} }], { x: 0.85, y, w: 11.63, h, fontSize: 15, color: C.text1, valign: 'middle' }); };
  const veil = (s, x, y, w, h, t = 25, color = HEX.navy, name = 'veil') => s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color, transparency: t }, line: { type: 'none' }, objectName: name });
  const brand = s => { s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.35, y: 6.82, w: 5.0, h: 0.52, rectRadius: 0.26, fill: { color: HEX.navy, transparency: 25 }, line: { type: 'none' }, objectName: 'brand pill' }); s.addImage({ path: A('logo-white.png'), x: 0.5, y: 6.86, w: 0.86, h: 0.44, altText: 'MAKE SENSE', objectName: 'brand logo' }); T(s, 'MAKESENSE | שיראל פרגר – יועץ משכנתאות', { x: 1.45, y: 6.82, w: 3.8, h: 0.52, fontSize: 10, color: 'E6F6FA', align: 'left', rtlMode: false, valign: 'middle' }); };
  const tag = (s, t, darkBg) => { s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 0.52, w: 2.6, h: 0.42, rectRadius: 0.21, fill: { color: darkBg ? HEX.cyan : HEX.ice }, line: { type: 'none' }, objectName: 'section tag' }); T(s, t, { x: 0.7, y: 0.52, w: 2.4, h: 0.42, fontSize: 12, bold: true, color: darkBg ? C.background1 : C.accent3, align: 'center', valign: 'middle' }); };
  const content = (title, section, sec, kicker) => { const s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: sec }); s.addText(title, { placeholder: 'title', ...he }); if (section) tag(s, section); if (kicker) T(s, kicker, { x: 0.6, y: 1.12, w: 12.13, h: 0.4, fontSize: 17, color: C.accent3, bold: true }); return s; };
  const big = (s, n, x, y, w, h, color, size = 66, o = {}) => T(s, n, { x, y, w, h, fontSize: size, bold: true, color, align: 'center', valign: 'middle', rtlMode: false, ...o });
  const src = (s, t, dark) => T(s, t, { x: 0.6, y: 6.5, w: 11.6, h: 0.3, fontSize: 10, italic: true, color: dark ? 'CFEFF5' : C.accent4 });
  const srcPhoto = (s, t) => T(s, t, { x: 5.6, y: 6.9, w: 6.7, h: 0.36, fontSize: 10, italic: true, color: 'E6F6FA', valign: 'middle' });
  const chartTxt = { catAxisLabelColor: HEX.muted, catAxisLabelFontSize: 14, catAxisLabelFontFace: '+mn-lt', valAxisHidden: true, catGridLine: { style: 'none' }, dataLabelFontFace: '+mn-lt', dataLabelFontSize: 14, dataLabelFontBold: true };
  const notes = (s, t) => s.addNotes(t);
  // "expert hat" slide: 5 key points + what it is worth in money
  const hatSlide = async (sec, tagTxt, role, icon, money, moneyCap, pts, srcTxt, note) => {
    const s = content('בעיני ' + role + ': 5 דגשים', tagTxt, sec);
    card(s, 0.6, 1.45, 3.9, 4.95, C.accent1, an(1));
    await bubble(s, 2.0, 1.7, 1.1, HEX.cyan, icon, HEX.white, an(1) + 'b');
    T(s, 'כמה זה שווה?', { x: 0.75, y: 2.95, w: 3.6, h: 0.45, fontSize: 18, bold: true, color: C.accent2, align: 'center', objectName: an(1) + 'h' });
    T(s, money, { x: 0.7, y: 3.4, w: 3.7, h: 1.0, fontSize: money.length > 11 ? 29 : 36, bold: true, color: C.background1, align: 'center', valign: 'middle', objectName: an(1) + 'n' });
    T(s, moneyCap, { x: 0.85, y: 4.45, w: 3.4, h: 1.8, fontSize: 14, color: C.background2, align: 'center', valign: 'top', objectName: an(1) + 'c' });
    for (let i = 0; i < 5; i++) { const y = 1.45 + i * 1.0;
      card(s, 4.75, y, 7.98, 0.88, C.background1, an(2 + i));
      s.addShape(pres.shapes.OVAL, { x: 12.12, y: y + 0.2, w: 0.48, h: 0.48, fill: { color: i % 2 ? HEX.cyan : HEX.blue }, line: { type: 'none' }, objectName: an(2 + i) + 'o' });
      T(s, String(i + 1), { x: 12.12, y: y + 0.2, w: 0.48, h: 0.48, fontSize: 15, bold: true, color: C.background1, align: 'center', valign: 'middle', rtlMode: false, objectName: an(2 + i) + 'k' });
      T(s, [{ text: pts[i][0], options: { breakLine: true, bold: true, color: C.accent1, fontSize: 16 } }, { text: pts[i][1], options: { fontSize: 13, color: C.text1 } }], { x: 4.95, y, w: 7.05, h: 0.88, valign: 'middle', objectName: an(2 + i) + 't' }); }
    src(s, srcTxt);
    notes(s, note);
    return s;
  };

  // ════════════ 1–2. פתיחה ════════════
  pres.addSection({ title: 'פתיחה' });
  let s = pres.addSlide({ masterName: 'PHOTO', sectionTitle: 'פתיחה' });
  await photo(s, 'cover', 0, 0, 13.333, 7.5, 'שלושה דורות סביב שולחן שישי', '!!hero');
  veil(s, 6.2, 0, 7.133, 7.5, 12, HEX.navy, '!!veil');
  s.addShape(pres.shapes.RECTANGLE, { x: 6.2, y: 0, w: 0.07, h: 7.5, fill: { color: HEX.cyan }, line: { type: 'none' }, objectName: '!!rule' });
  T(s, [{ text: 'ההורים שלנו,', options: { breakLine: true } }, { text: 'הכסף שלהם,', options: { breakLine: true, color: C.accent2 } }, { text: 'והשקט של כולנו', options: {} }], { x: 6.8, y: 1.6, w: 6.0, h: 2.9, fontSize: 50, bold: true, color: C.background1, valign: 'top', objectName: an(1) });
  T(s, 'פתרונות וליווי כלכלי לגיל השלישי', { x: 6.8, y: 4.6, w: 6.0, h: 0.6, fontSize: 24, color: 'CFEFF5', objectName: an(2) });
  T(s, [{ text: 'שיראל פרגר', options: { bold: true, color: C.accent2 } }, { text: ' | יועץ משכנתאות ופתרונות מימון', options: {} }], { x: 6.8, y: 5.4, w: 6.0, h: 0.45, fontSize: 17, color: C.background1, objectName: an(3) });
  brand(s);
  notes(s, 'ההרצאה הזו היא על הכסף של ההורים שלכם, ועל השקט של כל המשפחה. פותחים בהצבעה, שלוש שאלות: מי יודע כמה פנסיה ההורים יקבלו? למי יש להורים ייפוי כוח מתמשך? מי יודע מה כתוב בצוואה שלהם? ברוב הקהלים מעט ידיים עולות: זה הפער שנסגור היום.');

  s = pres.addSlide({ masterName: 'PHOTO', sectionTitle: 'פתיחה' });
  await photo(s, 'noa', 0, 0, 13.333, 7.5, 'נועה, 38, בשיחת טלפון ליד חשבונות', '!!hero');
  veil(s, 0, 0, 5.6, 7.5, 10, HEX.navy, '!!veil');
  T(s, 'תכירו את נועה', { x: 0.6, y: 1.2, w: 4.6, h: 0.8, fontSize: 36, bold: true, color: C.accent2, objectName: an(1) });
  T(s, [{ text: 'בת 38, שני ילדים ומשכנתה.', options: { breakLine: true } }, { text: 'מהחודש, גם 1,500 ₪ להורים.', options: { color: C.accent2 } }], { x: 0.6, y: 2.2, w: 4.6, h: 1.8, fontSize: 26, bold: true, color: C.background1, valign: 'top', objectName: an(2) });
  T(s, 'נלווה אותה ואת ההורים שלה לאורך כל ההרצאה', { x: 0.6, y: 4.3, w: 4.6, h: 1.0, fontSize: 18, color: 'CFEFF5', valign: 'top', objectName: an(3) });
  brand(s);
  notes(s, 'נועה היא דמות מורכבת, שמבוססת על משפחות רבות שאני פוגש. נעקוב אחריה ואחרי ההורים שלה עד הסוף.');

  // ════════════ 3–4. המציאות ════════════
  pres.addSection({ title: 'המציאות במספרים' });
  s = pres.addSlide({ masterName: 'PHOTO', sectionTitle: 'המציאות במספרים' });
  await photo(s, 'promenade', 0, 0, 13.333, 7.5, 'זוג מבוגר בטיילת בשקיעה', '!!hero');
  veil(s, 5.4, 0, 7.933, 7.5, 14, HEX.navy, '!!veil');
  T(s, 'עוד 20 שנה של חיים, ומעט מאוד כסף', { x: 5.9, y: 0.6, w: 6.9, h: 0.9, fontSize: 32, bold: true, color: C.background1, objectName: an(1) });
  const facts = [['כ-20 שנה', true, 'זה כמה חי בממוצע מי שהגיע היום לגיל 65'], ['1,838 ₪', false, 'קצבת הזקנה הבסיסית בחודש. בערך מחצית מקו העוני (3,547 ₪)'], ['44%', false, 'מבני גיל הפרישה שלא עובדים מקבלים פנסיה מעבודה. כל השאר, לא']];
  facts.forEach(([n, heb, l], i) => { const y = 1.75 + i * 1.6;
    T(s, n, { x: 5.9, y, w: 6.9, h: 0.8, fontSize: 46, bold: true, color: C.accent2, rtlMode: heb, align: 'right', valign: 'middle', objectName: an(2 + i) });
    T(s, l, { x: 5.9, y: y + 0.8, w: 6.9, h: 0.6, fontSize: 18, color: C.background1, valign: 'top', objectName: an(2 + i) + 't' }); });
  srcPhoto(s, 'מקור: מבקר המדינה 2026; ביטוח לאומי 2026; הלמ״ס 2026 (נתוני 2024)');
  brand(s);
  notes(s, 'שלושה מספרים. מי שהגיע ל-65 חי בממוצע עד 85 (גבר) או 87.6 (אישה), כלומר כ-20 שנה שצריך לממן (מבקר המדינה 2026). קצבת הזקנה הבסיסית ליחיד 1,838 ₪, וגם עם תוספת ותק מלאה 2,757 ₪, מתחת לקו העוני ליחיד, 3,547 ₪. מי שאין לו הכנסה אחרת יכול לבקש השלמת הכנסה. רק 44.2% מבני גיל הפרישה שאינם עובדים מקבלים פנסיה (הלמ״ס), והממוצע לנשים 5,481 ₪ מול 8,184 ₪ לגברים. הגרפים המלאים בשקפי הגיבוי.');

  s = pres.addSlide({ masterName: 'PHOTO', sectionTitle: 'המציאות במספרים' });
  await photo(s, 'parents-home', 0, 0, 13.333, 7.5, 'ההורים של נועה בסלון', '!!hero');
  veil(s, 0, 0, 6.3, 7.5, 8, HEX.navy, '!!veil');
  T(s, 'ההורים של נועה', { x: 0.6, y: 0.7, w: 5.3, h: 0.7, fontSize: 32, bold: true, color: C.accent2, objectName: an(1) });
  const gap = [['נכנס בחודש', '7,200 ₪', HEX.white, 'קצבאות ופנסיה'], ['יוצא בחודש', '9,500 ₪', 'F4A28C', 'מחיה, תרופות, עזרה בבית'], ['חסר בחודש', '2,300 ₪', HEX.cyan, 'כ-550 אלף ₪ ב-20 שנה']];
  gap.forEach(([l, n, c, sub], i) => { const y = 1.6 + i * 1.38;
    T(s, l, { x: 0.6, y, w: 5.3, h: 0.4, fontSize: 18, bold: true, color: 'CFEFF5', objectName: an(2 + i) + 'l' });
    T(s, [{ text: n, options: { color: c } }, ...(sub ? [{ text: '  ' + sub, options: { fontSize: 15, bold: false, color: 'CFEFF5' } }] : [])], { x: 0.6, y: y + 0.38, w: 5.3, h: 0.8, fontSize: 40, bold: true, valign: 'middle', objectName: an(2 + i) }); });
  T(s, [{ text: 'נועה משלימה 1,500 ₪ בחודש', options: { breakLine: true } }, { text: 'והשאר יוצא מהחסכונות', options: { color: C.accent2 } }], { x: 0.6, y: 5.85, w: 5.3, h: 0.9, fontSize: 20, bold: true, color: C.background1, valign: 'top', objectName: an(5) });
  srcPhoto(s, 'דמויות מורכבות, להמחשה; על בסיס קצבאות ביטוח לאומי 2026');
  brand(s);
  notes(s, 'יוסי ורחל, ההורים של נועה, בני 71 ו-68. קצבאות וותק כ-3,700 ₪ ופנסיה כ-3,500 ₪. הוצאות כ-9,500 ₪. חסרים 2,300 ₪ בחודש. נועה משלימה 1,500, והשאר נשחק מהחסכונות. לאורך 20 שנה זה 2,300 × 12 × 20 = כ-550 אלף ₪, הסכום שהתוכנית צריכה לסגור.');

  // ════════════ 5–7. המנופים ════════════
  pres.addSection({ title: 'תכנון פרישה' });
  const levers = [['LuBadgeCheck', 'זכויות', 'כסף מביטוח לאומי שמגיע, אבל צריך לבקש', 'עד כ-220 אלף ₪'], ['LuSearch', 'חסכונות', 'כסף שנשכח, והוצאות שאפשר לחתוך', 'כ-500 ₪ בחודש'], ['LuPercent', 'מס', 'פחות מס על הפנסיה, בטופס הנכון', 'כ-860 ₪ בחודש'], ['LuHouse', 'הבית', 'חלק מהדירה הופך לכסף, בלי למכור', 'עד כ-1.4 מיליון ₪']];
  const leverStrip = async (s, active) => {
    const act = [].concat(active), big4 = act[0] < 0;
    for (let i = 0; i < 4; i++) {
      const on = act.includes(i);
      const w = big4 ? 2.8 : (on ? 2.3 : 1.8), h = big4 ? 4.0 : 0.95;
      const xx = big4 ? 9.93 - i * 3.11 : (12.73 - [0, 1, 2, 3].slice(0, i + 1).reduce((a, k) => a + (act.includes(k) ? 2.3 : 1.8) + 0.2, 0) + 0.2);
      const y = big4 ? 1.6 : 1.6;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: xx, y, w, h, rectRadius: 0.14, fill: { color: on || big4 ? (i === 3 ? HEX.cyan : HEX.blue) : 'E3E8F2' }, line: { type: 'none' }, shadow: shadow(), objectName: '!!lev' + i });
      const d = big4 ? 1.2 : 0.5;
      s.addImage({ data: await ic(levers[i][0], on || big4 ? HEX.white : HEX.gray2), x: big4 ? xx + (w - d) / 2 : xx + w - d - 0.2, y: big4 ? y + 0.35 : y + 0.22, w: d, h: d, altText: '', objectName: '!!levi' + i });
      if (big4) {
        T(s, levers[i][2], { x: xx + 0.2, y: y + 2.2, w: w - 0.4, h: 0.85, fontSize: 15, color: C.background1, align: 'center', valign: 'top', objectName: an(1) + 'd' + i });
        s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: xx + 0.2, y: y + 3.15, w: w - 0.4, h: 0.6, rectRadius: 0.3, fill: { color: HEX.navy, transparency: 55 }, line: { type: 'none' }, objectName: an(2) + 'p' + i });
        T(s, levers[i][3], { x: xx + 0.2, y: y + 3.15, w: w - 0.4, h: 0.6, fontSize: 17, bold: true, color: C.background1, align: 'center', valign: 'middle', objectName: an(2) + 'm' + i }); }
      T(s, levers[i][1], { x: xx + 0.1, y: big4 ? y + 1.6 : y, w: big4 ? w - 0.2 : w - d - 0.35, h: big4 ? 0.6 : h, fontSize: big4 ? 28 : 17, bold: true, color: on || big4 ? C.background1 : C.accent4, align: big4 ? 'center' : 'right', valign: 'middle', objectName: '!!levt' + i });
    }
  };
  s = content('4 מנופים שסוגרים את הפער', 'תכנון פרישה', 'תכנון פרישה', 'וכמה כל אחד מהם יכול להיות שווה');
  await leverStrip(s, -1);
  src(s, 'הסכומים להמחשה. החישובים בהערות הדובר ובשקפי הגיבוי');
  notes(s, 'ארבעה מנופים, מהפשוט לגדול. זכויות: תוספת ותק מלאה ליחיד, 919 ₪ בחודש, כ-220 אלף ₪ ב-20 שנה. חסכונות והוצאות: אצל ההורים של נועה כ-500 ₪ בחודש. מס: פטור מלא בטופס 161ד על פנסיה של 12,000 ₪ חוסך כ-860 ₪ בחודש. הבית: בגיל 70, דירה של 3 מיליון ₪ יכולה לשחרר עד כ-1.4 מיליון ₪ במימון המרבי בשוק.');

  s = content('זכויות וחסכונות: כסף שמגיע, אבל צריך לבקש', 'תכנון פרישה', 'תכנון פרישה', 'שני המנופים הזולים ביותר: לא עולים כלום, רק דורשים לבדוק');
  await leverStrip(s, [0, 1]);
  const finds = [['LuTrendingUp', 'תוספת ותק', 'עד 50% יותר בקצבה, למי ששילם ביטוח לאומי שנים רבות'], ['LuHandCoins', 'השלמת הכנסה', 'תוספת למי שההכנסה שלו נמוכה, ופותחת גם הנחות'], ['LuSearch', '"הר הכסף"', 'אתר ממשלתי שמאתר חסכונות ופנסיות שנשכחו'], ['LuScissors', 'הוצאות', 'ביטוחים כפולים והלוואות יקרות, לבטל או לאחד']];
  for (let i = 0; i < 4; i++) { const x = 9.83 - i * 3.07; card(s, x, 2.8, 2.9, 2.6, C.background1, an(1 + i)); await bubble(s, x + 1.0, 2.98, 0.9, i % 2 ? HEX.cyan : HEX.blue, finds[i][0], HEX.white, an(1 + i) + 'b'); T(s, finds[i][1], { x, y: 3.95, w: 2.9, h: 0.5, fontSize: 21, bold: true, color: C.accent1, align: 'center', objectName: an(1 + i) + 't' }); T(s, finds[i][2], { x: x + 0.2, y: 4.45, w: 2.5, h: 0.9, fontSize: 15, color: C.accent4, align: 'center', valign: 'top', objectName: an(1 + i) + 's' }); }
  card(s, 0.6, 5.55, 12.13, 0.85, C.background2, an(5));
  T(s, [{ text: 'מה עושים: ', options: { bold: true, color: C.accent3 } }, { text: 'מגישים תביעה בזמן. על איחור משלמים בדרך כלל רטרואקטיבית רק עד 12 חודשים.', options: { breakLine: true } }, { text: 'כמה זה שווה: ', options: { bold: true, color: C.accent3 } }, { text: 'תוספת ותק מלאה, עד כ-220 אלף ₪ ב-20 שנה. ההורים של נועה: 300 ₪ יותר ו-500 ₪ פחות הוצאות, כל חודש.', options: {} }], { x: 0.85, y: 5.55, w: 11.63, h: 0.85, fontSize: 15, color: C.text1, valign: 'middle', objectName: an(5) + 't' });
  src(s, 'מקור: ביטוח לאומי, תוספת ותק והשלמת הכנסה 2026; משרד האוצר, "הר הכסף"; כל זכות, תשלום רטרואקטיבי. סכומי ההמחשה מעוגלים');
  notes(s, 'הזכויות: תוספת ותק, 2% על כל שנת ביטוח מעל 10 שנים, עד 50% מהקצבה. השלמת הכנסה למי שהכנסתו נמוכה, והיא פותחת הנחות בארנונה ובעוד. הקצבה לא אוטומטית: צריך להגיש, ועל איחור משלמים רטרואקטיבית בדרך כלל עד 12 חודשים. החסכונות: הר הכסף מאתר קופות שנשכחו, ובדיקת הוצאות קבועות מוצאת ביטוחים כפולים והלוואות יקרות. חישוב: תוספת ותק מלאה ליחיד 919 ₪ בחודש, כ-220 אלף ₪ ב-20 שנה. אצל ההורים של נועה, כ-300 ₪ זכויות וכ-500 ₪ פחות הוצאות (להמחשה).');

  s = content('מס: טופס אחד, אלפי שקלים', 'תכנון פרישה', 'תכנון פרישה', 'טופס 161ד ("קיבוע זכויות") הוא הבקשה ממס הכנסה שקובעת כמה מהפנסיה לא ימוסה');
  await leverStrip(s, 2);
  card(s, 6.95, 2.9, 5.78, 2.85, C.accent1, an(1));
  big(s, '5,422 ₪', 6.95, 3.1, 5.78, 1.3, HEX.white, 56, { objectName: an(1) + 'n' });
  T(s, 'מהפנסיה החודשית יכולים להיות פטורים ממס (2026), עם הטופס המלא', { x: 7.1, y: 4.45, w: 5.48, h: 0.9, fontSize: 19, color: C.background2, align: 'center', valign: 'top', objectName: an(1) + 't' });
  card(s, 0.6, 2.9, 6.05, 2.85, C.background1, an(2));
  await bubble(s, 5.6, 3.15, 0.85, 'FDECE8', 'LuTriangleAlert', HEX.warn, an(2) + 'b');
  T(s, [{ text: 'הטעות הנפוצה: הטופס המקוצר', options: { breakLine: true, color: C.accent1, bold: true, paraSpaceAfter: 6 } }, { text: 'בטופס 161ח הפטור נקבע על 22.5% בלבד, במקום עד 57.5% בטופס המלא.', options: { breakLine: true, color: C.text1, paraSpaceAfter: 6 } }, { text: 'מה עושים: ממלאים את הטופס המלא, עם יועץ פרישה או רואה חשבון.', options: { color: C.accent3, fontSize: 17 } }], { x: 0.85, y: 3.1, w: 4.6, h: 2.55, fontSize: 19, valign: 'top', objectName: an(2) + 't' });
  card(s, 0.6, 5.95, 12.13, 0.5, C.background2, an(3));
  T(s, 'כמה זה שווה: כ-860 ₪ בחודש על פנסיה של 12,000 ₪ · ההורים של נועה: 300 ₪ בחודש', { x: 0.9, y: 5.95, w: 11.5, h: 0.5, fontSize: 18, bold: true, color: C.accent3, align: 'center', valign: 'middle', objectName: an(3) + 't' });
  src(s, 'מקור: כל זכות, הטבות מס בפרישה, טופס 161ד; ביזפורטל 2026; מדרגות מס 2026. המחשה. מומלץ בתיאום עם בעל רישיון פנסיוני');
  notes(s, 'קיבוע זכויות בטופס 161ד מנצל את הפטור, עד כ-5,422 ₪ בחודש ב-2026. הטופס המקוצר 161ח סוגר את הסל על 22.5% בלבד. אצל ההורים של נועה, כ-300 ₪ בחודש (להמחשה). חישוב 860 ₪: פנסיה של 12,000 ₪; הפטור של 5,422 ₪ מוריד את החלק שממוסה ב-10%, 14% ו-20%. בפנסיה נמוכה, מתחת לסף המס, החיסכון קטן יותר. זה מידע כללי; את הטופס ממלאים עם בעל רישיון או רואה חשבון.');

  // ════════════ 8–10. הבית ════════════
  pres.addSection({ title: 'הבית כנכס' });
  s = content('הבית: משכנתה הפוכה, במשפט אחד', 'הבית כנכס', 'הבית כנכס');
  card(s, 0.6, 1.3, 12.13, 1.45, C.accent1, an(1));
  T(s, [{ text: 'הלוואה לבני 55 ומעלה, כנגד הדירה שלהם: ', options: { color: C.accent2 } }, { text: 'ממשיכים לגור בבית, לא חייבים להחזיר כל חודש, והחוב נפרע בדרך כלל ממכירת הדירה בסוף הדרך.', options: {} }], { x: 0.95, y: 1.3, w: 11.43, h: 1.45, fontSize: 23, bold: true, color: C.background1, valign: 'middle', objectName: an(1) + 't' });
  const pil = [['LuWallet', 'חיים בכבוד', 'תוספת קבועה לפנסיה, בלי לגעת בחסכונות'], ['LuHammer', 'שיפוץ וממ״ד', 'בית בטוח ונוח, שמתאים לגיל'], ['LuKey', 'עזרה לילדים בדירה', 'הון עצמי לילדים. מתעדים בכתב אם זו מתנה או הלוואה, ומתאמים עם הצוואה']];
  for (let i = 0; i < 3; i++) { const x = 8.83 - i * 4.1; card(s, x, 2.95, 3.9, 2.95, C.background1, an(2 + i)); await bubble(s, x + 1.5, 3.15, 0.9, i === 1 ? HEX.cyan : HEX.blue, pil[i][0], HEX.white, an(2 + i) + 'b'); T(s, pil[i][1], { x, y: 4.15, w: 3.9, h: 0.6, fontSize: 23, bold: true, color: C.accent1, align: 'center', objectName: an(2 + i) + 't' }); T(s, pil[i][2], { x: x + 0.25, y: 4.8, w: 3.4, h: 0.95, fontSize: 16, color: C.accent4, align: 'center', valign: 'top', objectName: an(2 + i) + 's' }); }
  plain(s, 'התנאים: גיל 55 ומעלה, דירה בבעלות ההורים וביטוח מבנה. לא צריך ביטוח חיים. הכסף מגיע כסכום אחד, כתשלום חודשי או במשיכות לפי הצורך.', 6.05, 0.55);
  notes(s, 'משכנתה הפוכה במשפט אחד: הלוואה לבני 55 ומעלה כנגד הדירה. ממשיכים לגור בבית, לא חייבים להחזיר כל חודש, והחוב נפרע בדרך כלל ממכירת הדירה בסוף הדרך. הבית נשאר רשום על שמם, עם שעבוד לטובת הגוף המלווה. שלוש מטרות נפוצות: תוספת למחיה, שיפוץ וממ״ד, ועזרה לילדים בהון עצמי לדירה. כשעוזרים לילד אחד, מתעדים בכתב אם זו מתנה או הלוואה ומתאמים עם הצוואה, כדי לשמור על הוגנות בין האחים.');

  s = content('3 פחדים, 3 תשובות', 'הבית כנכס', 'הבית כנכס', 'מה ההורים אומרים, ומה קורה בפועל');
  const fears = [
    ['LuHouse', '"אם לא אשלם, יקחו לי את הבית"', 'במסלול בלי החזר חודשי אין מה "לא לשלם". גרים בבית כל החיים, והחוב נפרע רק במכירה, במעבר לדיור מוגן או אחרי 120.', 'בתנאי שגרים בדירה ומחזיקים ביטוח מבנה'],
    ['LuUsers', '"לא תישאר ירושה לילדים"', 'הדירה נשארת על שמכם. בסוף הדרך הילדים בוחרים: מחזירים את החוב ושומרים את הדירה, או מוכרים ומקבלים כל מה שמעל החוב.', 'הירושה קטנה, אבל לא נעלמת'],
    ['LuHeart', '"אני לא רוצה חובות"', 'זה כסף שכבר שלכם, תקוע בקירות. לוותר עליו פירושו לוותר על חיים טובים עכשיו. ובחלק מהגופים החוב לא יעלה על שווי הדירה.', 'את זה בודקים מראש, בהסכם'],
  ];
  for (let i = 0; i < 3; i++) { const x = 8.83 - i * 4.1, [icn, q, a, f] = fears[i];
    card(s, x, 1.7, 3.9, 1.25, 'EEF0F4', an(1 + i * 2)); T(s, q, { x: x + 0.2, y: 1.7, w: 3.5, h: 1.25, fontSize: 19, bold: true, color: C.accent4, align: 'center', valign: 'middle', objectName: an(1 + i * 2) + 't' });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 3.1, w: 3.9, h: 3.3, rectRadius: 0.16, fill: { color: C.accent1 }, line: { type: 'none' }, shadow: shadow(), objectName: an(2 + i * 2) });
    s.addImage({ data: await ic(icn, HEX.cyan), x: x + 3.25, y: 3.28, w: 0.42, h: 0.42, altText: '', objectName: an(2 + i * 2) + 'i' });
    T(s, 'בפועל', { x: x + 0.25, y: 3.28, w: 2.9, h: 0.42, fontSize: 16, bold: true, color: C.accent2, objectName: an(2 + i * 2) + 'h' });
    T(s, a, { x: x + 0.25, y: 3.8, w: 3.4, h: 1.85, fontSize: 16, color: C.background1, valign: 'top', objectName: an(2 + i * 2) + 'a' });
    T(s, f, { x: x + 0.25, y: 5.7, w: 3.4, h: 0.55, fontSize: 13, italic: true, color: C.background2, valign: 'middle', objectName: an(2 + i * 2) + 'f' }); }
  src(s, 'הסבר כללי; התנאים המדויקים משתנים בין הגופים המלווים ומפורטים בהסכם ההלוואה');
  notes(s, 'שלושת המשפטים שאני שומע הכי הרבה. 1) "יקחו לי את הבית": במסלול ללא החזר חודשי אין תשלום שאפשר לפספס. התנאים העיקריים הם לגור בדירה ולהחזיק ביטוח מבנה. החוב נפרע כשמוכרים, עוברים לדיור מוגן או אחרי 120. 2) "לא תישאר ירושה": הדירה רשומה על שם ההורים. היורשים בוחרים אם להחזיר את החוב ולשמור את הדירה, או למכור ולקבל את היתרה. 3) "לא רוצה חובות": זה הכסף שלהם. השאלה היא אם לחיות טוב עכשיו או להוריש דירה מלאה. בחלק מהגופים יש התחייבות שהחוב לא יעלה על שווי הנכס; בודקים בהסכם.');

  s = content('כמה אפשר לקבל, ומה זה עולה', 'הבית כנכס', 'הבית כנכס', 'בגיל 70: עד כ-1.4 מיליון ₪ מדירה של 3 מיליון. ההורים של נועה לקחו רק 900 אלף');
  s.addChart(pres.charts.BAR, [{ name: 'מימון מרבי', labels: ['55', '60', '70', '80', '90+'], values: [35, 39, 48, 50, 60] }], { x: 0.6, y: 1.6, w: 6.1, h: 4.75, barDir: 'col', barGapWidthPct: 45, chartColors: [HEX.blue], ...chartTxt, showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0"%"', dataLabelColor: HEX.blue, valAxisMinVal: 0, valAxisMaxVal: 70, valGridLine: { style: 'none' }, showLegend: false, showTitle: true, title: 'אחוז מימון מרבי משווי הדירה, לפי גיל בן הזוג הצעיר', titleColor: HEX.ink, titleFontSize: 13, titleFontFace: '+mn-lt', objectName: an(1), altText: 'מימון מרבי בשוק לפי גיל: 35% בגיל 55 עד 60% בגיל 90 ומעלה' });
  card(s, 7.0, 1.6, 5.73, 4.75, C.background1, an(2));
  T(s, 'המחיר, בגלוי', { x: 7.25, y: 1.72, w: 5.23, h: 0.5, fontSize: 22, bold: true, color: C.accent1, objectName: an(2) + 'h' });
  const costs = ['הריבית מצטברת על כל שקל שנמשך, והחוב גדל עם השנים.', 'הבדל של 1% בריבית: כ-250 אלף ₪ חוב נוסף אחרי 15 שנה, על 900 אלף.', 'יש עמלות פתיחה, שמאות ועורך דין. בודקים מראש.', 'לוקחים רק מה שצריך, ומשווים 2–3 גופים מתאימים.'];
  T(s, costs.map((c, i) => ({ text: c, options: { bullet: { indent: 18 }, breakLine: i < costs.length - 1, paraSpaceAfter: 5 } })), { x: 7.25, y: 2.25, w: 5.23, h: 2.45, fontSize: 15, color: C.text1, valign: 'top', objectName: an(3) });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.2, y: 4.8, w: 5.33, h: 1.4, rectRadius: 0.12, fill: { color: 'FDECE8' }, line: { type: 'none' }, objectName: an(4) });
  T(s, [{ text: 'מתי זה לא מתאים', options: { breakLine: true, bold: true, color: HEX.warnD, fontSize: 16 } }, { text: 'כשמתכננים למכור בקרוב, כשצריך סכום קטן, או כשחשוב להוריש דירה מלאה.', options: { fontSize: 14 } }], { x: 7.4, y: 4.8, w: 4.93, h: 1.4, color: C.text1, valign: 'middle', objectName: an(4) + 't' });
  src(s, 'מקור: השוואת תנאי גופים מלווים בשוק, 2026; החישוב להמחשה, בלי הצמדה למדד');
  notes(s, 'אחוז המימון המרבי בשוק עולה עם הגיל: 35% בגיל 55 ועד 60% מגיל 90. בגיל 70 על דירה של 3 מיליון זה עד כ-1.4 מיליון ₪, וההורים של נועה לקחו רק 900 אלף, כי הריבית נצברת על כל שקל. חישוב: 900,000 × 1.05 בחזקת 15 = כ-1.87 מיליון; × 1.04 בחזקת 15 = כ-1.62 מיליון; הפרש כ-250 אלף ₪. מתי לא מתאים: כשמתכננים למכור בקרוב (העלויות לא משתלמות), כשצריך סכום קטן (יש דרכים זולות יותר), או כשלהורים חשוב להוריש דירה מלאה. חלופות: מעבר לדירה קטנה, השכרת יחידה, מחזור משכנתה קיימת. השוואת ביטוח מול בנק בשקף גיבוי.');

  // ════════════ 11–12. מקרים ════════════
  pres.addSection({ title: 'מקרים' });
  const caseFocus = [0.42, 0.33, 0.38, 0.33];
  s = content('4 דברים שלא תרצו שיקרו', 'מקרים', 'מקרים', 'מקרים לפי החוק, בשמות בדויים. ולכל אחד, פתרון פשוט');
  const grid = [
    ['case-inheritance', 'בלי צוואה: הדירה נתקעה', 'אבא נפטר בלי צוואה. הילדים יורשים 25% מהדירה, ובלי הסכמת כולם אי אפשר למכור.', 'צוואה בזמן. לזוג: צוואה הדדית.', '750 אלף ₪ תקועים'],
    ['case-dementia', 'בלי ייפוי כוח: החשבון קפוא', 'אמא אובחנה בדמנציה. כדי לשלם בשבילה, צריך לבקש מבית המשפט למנות אפוטרופוס.', 'ייפוי כוח מתמשך, אצל עורך דין מוסמך.', ''],
    ['case-nursing', 'סיעוד: החסכונות נגמרים', 'מטפל צמוד עולה לפחות שכר מינימום, ועוד ביטוח ומגורים. ביטוח לאומי משלם רק חלק.', 'לבדוק איזה ביטוח סיעודי יש, ולתכנן מקור כסף.', ''],
    ['case-health', 'ביטוח בריאות: הפוליסה בוטלה', 'הוראת הקבע נפלה והביטוח בוטל. בגיל מבוגר קשה מאוד להצטרף מחדש.', 'בודקים פעם בשנה ב"הר הביטוח".', ''],
  ];
  for (let i = 0; i < 4; i++) { const [f, t, what, fix, chip] = grid[i], x = i % 2 === 0 ? 6.78 : 0.6, y = i < 2 ? 1.6 : 3.8, w = 5.95, h = 2.05;
    card(s, x, y, w, h, C.background1, an(1 + i));
    await photo(s, f, x + w - 1.85, y, 1.85, h, t, an(1 + i) + 'p', caseFocus[i]);
    T(s, t, { x: x + 0.2, y: y + 0.1, w: w - 2.25, h: 0.45, fontSize: 17, bold: true, color: C.accent1, objectName: an(1 + i) + 't' });
    T(s, what, { x: x + 0.2, y: y + 0.55, w: w - 2.25, h: 0.85, fontSize: 13, color: C.text1, valign: 'top', objectName: an(1 + i) + 'w' });
    T(s, [{ text: 'הפתרון: ', options: { bold: true, color: C.accent3 } }, { text: fix, options: { bold: true, color: C.text1 } }], { x: x + 0.2, y: y + 1.42, w: w - 2.25, h: 0.5, fontSize: 13, valign: 'middle', objectName: an(1 + i) + 'f' });
    if (chip) { s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.15, y: y - 0.18, w: 1.9, h: 0.36, rectRadius: 0.18, fill: { color: HEX.warn }, line: { type: 'none' }, objectName: an(1 + i) + 'c' }); T(s, chip, { x: x + 0.15, y: y - 0.18, w: 1.9, h: 0.36, fontSize: 12, bold: true, color: C.background1, align: 'center', valign: 'middle', objectName: an(1 + i) + 'ct' }); } }
  card(s, 0.6, 5.95, 12.13, 0.45, C.accent1, an(5));
  T(s, 'מסדרים הכל בשולחן אחד: עורך דין, בעל רישיון ביטוח ותוכנית כלכלית אחת', { x: 0.85, y: 5.95, w: 11.63, h: 0.45, fontSize: 16, bold: true, color: C.background1, align: 'center', valign: 'middle', objectName: an(5) + 't' });
  src(s, 'מקור: חוק הירושה, סעיפים 8א ו-11; משרד המשפטים, האפוטרופוס הכללי; ביטוח לאומי; רשות שוק ההון, "הר הביטוח". מקרים מורכבים');
  notes(s, 'ארבעה מקרים, השמות בדויים והכללים אמיתיים. 1) צוואה: דירה של 3 מיליון רשומה על שני ההורים. בלי צוואה, האלמנה מקבלת מחצית מהחצי של האב ונשארת עם 75%, והילדים חולקים 25%, כ-750 אלף ₪. בלי הסכמה של כולם, פירוק שיתוף בבית משפט. צוואה הדדית (סעיף 8א) מסדירה מראש. 2) דמנציה: בלי ייפוי כוח מתמשך, בקשה למינוי אפוטרופוס בבית המשפט לענייני משפחה. ייפוי כוח מתמשך נחתם אצל עו״ד שהוסמך ומופקד אצל האפוטרופוס הכללי. 3) סיעוד: מטפל זר זכאי לשכר מינימום (6,443.85 ₪ ב-2026), ועוד ביטוח בריאות, מגורים ופיקדון. 4) ביטוח בריאות שלא משולם מתבטל, ובגיל מבוגר קשה להצטרף מחדש. המקרים המלאים בשקפי הגיבוי.');

  s = content('סיעוד: מי משלם, ולכמה זמן?', 'מקרים', 'מקרים', 'סיעוד יכול להימשך שנים. הביטוחים משלמים רק חלק מהזמן');
  { const X0 = 0.9, X5 = 3.6, X15 = 7.4, XE = 9.0, top = 1.85, rh = 0.78, gapY = 1.02;
    [X5, X15].forEach((xv, k) => s.addShape(pres.shapes.LINE, { x: xv, y: top - 0.1, w: 0, h: 3 * gapY + 0.05, line: { color: HEX.gray2, width: 1, dashType: 'dash' }, objectName: 'tick' + k }));
    const rowsN = [
      ['ביטוח לאומי', 'לפי מבחן תלות ומבחן הכנסה', XE, HEX.teal, 'גמלת סיעוד: בין כ-1,700 לכ-7,400 ₪ בחודש, כל עוד צריך'],
      ['ביטוח סיעודי בקופת החולים', 'רובד בסיסי, בתשלום חודשי נפרד', X5, HEX.blue, 'עד 5 שנים'],
      ['רובד מורחב', 'רק למי שרכש עד 4.12.2023', X15, HEX.cyan, 'עד 15 שנים בסך הכל'],
    ];
    rowsN.forEach(([name, sub, xEnd, col, txt], i) => { const y = top + i * gapY;
      T(s, [{ text: name, options: { breakLine: true, bold: true, color: C.accent1, fontSize: 18 } }, { text: sub, options: { fontSize: 13, color: C.accent4 } }], { x: 9.25, y, w: 3.48, h: rh, valign: 'middle', objectName: an(1 + i) + 'l' });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: X0, y, w: xEnd - X0, h: rh, rectRadius: 0.12, fill: { color: col }, line: { type: 'none' }, objectName: an(1 + i) });
      T(s, txt, { x: X0 + 0.15, y, w: xEnd - X0 - 0.3, h: rh, fontSize: 16, bold: true, color: C.background1, align: 'center', valign: 'middle', objectName: an(1 + i) + 't' });
      if (i === 1) { s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: X5 + 0.08, y, w: XE - X5 - 0.08, h: rh, rectRadius: 0.12, fill: { color: 'FDECE8' }, line: { color: HEX.warn, width: 1, dashType: 'dash' }, objectName: an(4) });
        T(s, 'ואחרי 5 שנים? המשפחה, החסכונות, או הבית', { x: X5 + 0.2, y, w: XE - X5 - 0.35, h: rh, fontSize: 15, bold: true, color: HEX.warnD, align: 'center', valign: 'middle', objectName: an(4) + 't' }); } });
    const ax = [['היום', X0], ['5 שנים', X5], ['15 שנים', X15], ['ומעבר', XE]];
    ax.forEach(([t, xv]) => T(s, t, { x: xv - 0.7, y: top + 3 * gapY - 0.02, w: 1.4, h: 0.35, fontSize: 13, bold: true, color: C.accent4, align: 'center' })); }
  plain(s, 'ביטוח סיעודי בקופת החולים אינו חלק מסל הבריאות: זה ביטוח נפרד שמשלמים עליו כל חודש. הוא משלם סכום קבוע לפי הגיל שבו הצטרפתם, ונמוך יותר למי שהצטרף מגיל 60. "סיעודי" הוא מי שצריך עזרה של אדם אחר בפעולות יום-יום, כמו לקום, להתלבש, להתרחץ ולאכול, או שסובל מירידה קוגניטיבית.', 5.35, 0.95);
  src(s, 'מקור: רשות שוק ההון, הוראות ביטוח סיעודי קבוצתי לחברי קופות החולים ותיקון 2023 (הקפאת הרובד המורחב עד 1.1.2028); ביטוח לאומי, גמלת סיעוד ומבחן הכנסות 2026');
  notes(s, 'הרבה חושבים שקופת החולים "מכסה סיעוד". בפועל, סל הבריאות הרגיל לא כולל ביטוח סיעודי. מה שיש בקופות הוא ביטוח סיעודי קבוצתי, נפרד מהסל, שמשלמים עליו כל חודש. ברובד הבסיסי הוא משלם סכום חודשי קבוע עד 5 שנים, והסכום תלוי בגיל ההצטרפות. מי שרכש רובד מורחב עד 4.12.2023 מכוסה עד 15 שנים בסך הכל. מאז ועד 1.1.2028 אי אפשר לרכוש את הרובד המורחב. ביטוח לאומי משלם גמלת סיעוד כל עוד יש זכאות, אבל היא לא מכסה מטפל צמוד. אחרי שהביטוחים נגמרים, הכסף בא מהמשפחה, מהחסכונות, או מהבית. בודקים בהר הביטוח מה בדיוק יש להורים, מאיזה גיל הצטרפו ואיזה רובד.');

  // ════════════ 13–15. סוף ════════════
  pres.addSection({ title: 'סוף הסיפור' });
  s = pres.addSlide({ masterName: 'PHOTO', sectionTitle: 'סוף הסיפור' });
  await photo(s, 'happy-after', 0, 0, 13.333, 7.5, 'סבים מחבקים נכדים בבית המשופץ', '!!hero');
  veil(s, 0, 0, 6.0, 7.5, 10, HEX.navy, '!!veil');
  T(s, 'חצי שנה אחרי', { x: 0.6, y: 0.7, w: 5.0, h: 0.8, fontSize: 36, bold: true, color: C.accent2, objectName: an(1) });
  const after = [['600 ₪', 'יותר בחודש, מזכויות וממס'], ['500 ₪', 'פחות הוצאות בחודש'], ['2,500 ₪', 'בחודש, ממשכנתה הפוכה']];
  after.forEach(([n, l], i) => { const y = 1.7 + i * 1.15; T(s, [{ text: n, options: { fontSize: 36, bold: true, color: C.background1 } }, { text: '  ' + l, options: { fontSize: 18, color: 'CFEFF5' } }], { x: 0.6, y, w: 5.1, h: 0.95, valign: 'middle', objectName: an(2 + i) }); });
  T(s, [{ text: 'וגם: שיפוץ, ממ״ד ועזרה לנכדים', options: { breakLine: true } }, { text: 'ונועה מפסיקה לשלם', options: { color: C.accent2 } }], { x: 0.6, y: 5.3, w: 5.0, h: 1.2, fontSize: 22, bold: true, color: C.background1, valign: 'top', objectName: an(5) });
  srcPhoto(s, 'המחשה: משכנתה הפוכה של כ-900 אלף ₪, 300 אלף לשיפוץ ולעזרה, והשאר משיכות');
  brand(s);
  notes(s, 'חצי שנה אחרי: כ-600 ₪ מזכויות ומס, כ-500 ₪ פחות הוצאות, ומשכנתה הפוכה של כ-900 אלף ₪, מתוכם 300 אלף לשיפוץ, ממ״ד ועזרה לנכד, והשאר משיכות של כ-2,500 ₪ בחודש. הפער נסגר, ונועה מפסיקה לשלם. להמחשה.');

  s = content('מפת הדרך: 8 תחנות לבדוק עם ההורים', 'קחו הביתה', 'סוף הסיפור', 'סמנו V על כל תחנה שסגרתם');
  const RY1 = 3.15, RY2 = 5.0, band = 0.46, roadC = 'D6E6FB';
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.0, y: RY1 - band / 2, w: 11.55, h: band, rectRadius: 0.23, fill: { color: roadC }, line: { type: 'none' }, objectName: 'road1' });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.0, y: RY2 - band / 2, w: 10.9, h: band, rectRadius: 0.23, fill: { color: roadC }, line: { type: 'none' }, objectName: 'road2' });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.0, y: RY1 - band / 2, w: band, h: RY2 - RY1 + band, rectRadius: 0.23, fill: { color: roadC }, line: { type: 'none' }, objectName: 'road3' });
  const stops = [['LuMessageCircle', 'שיחה פתוחה', '5 שאלות בצ׳קליסט'], ['LuBanknote', 'זכויות', 'מה מגיע מביטוח לאומי'], ['LuPercent', 'מס', 'טופס 161ד המלא'], ['LuSearch', 'חסכונות', 'לאתר כסף שנשכח'], ['LuScissors', 'הוצאות', 'לבטל כפילויות'], ['LuHouse', 'הבית', 'משכנתה הפוכה מתאימה?'], ['LuScrollText', 'צוואה וייפוי כוח', 'אצל עורך דין'], ['LuStethoscope', 'סיעוד ובריאות', 'לבדוק ב"הר הביטוח"']];
  const xsTop = [11.25, 8.75, 6.25, 3.75], xsBot = [2.3, 4.75, 7.2, 9.65];
  for (let i = 0; i < 8; i++) { const top = i < 4, cx = top ? xsTop[i] : xsBot[i - 4], cy = top ? RY1 : RY2, d = 0.95;
    await bubble(s, cx - d / 2, cy - d / 2, d, i % 2 ? HEX.cyan : HEX.blue, stops[i][0], HEX.white, an(1 + i));
    const ly = top ? cy - 1.55 : cy + 0.6;
    T(s, stops[i][1], { x: cx - 1.15, y: ly, w: 2.3, h: 0.42, fontSize: 17, bold: true, color: C.accent1, align: 'center', valign: top ? 'bottom' : 'top', objectName: an(1 + i) + 't' });
    T(s, stops[i][2], { x: cx - 1.15, y: ly + 0.42, w: 2.3, h: 0.38, fontSize: 13, color: C.accent4, align: 'center', valign: 'top', objectName: an(1 + i) + 's' }); }
  await bubble(s, 11.35, RY2 - 0.55, 1.1, HEX.teal, 'LuFlag', HEX.white, an(9));
  T(s, 'בדיקה משפחתית', { x: 10.95, y: RY2 + 0.6, w: 1.85, h: 0.42, fontSize: 14, bold: true, color: C.accent3, align: 'center', objectName: an(9) + 't' });
  notes(s, 'מפת הדרך הביתה: שמונה תחנות, כל אחת טיפ מההרצאה. מי שרוצה לעבור את המסלול איתי, מגיע לבדיקה משפחתית.');

  s = pres.addSlide({ masterName: 'DARK', sectionTitle: 'סוף הסיפור' });
  s.addShape(pres.shapes.OVAL, { x: 0.9, y: 0.8, w: 3.9, h: 3.9, fill: { color: C.background1 }, line: { color: HEX.cyan, width: 5 }, objectName: an(1) });
  await img(s, A('shiral.jpg'), 1.02, 0.92, 3.66, 3.66, 'שיראל פרגר', an(1) + 'p', 0.5, 0.5, { rounding: true });
  T(s, 'קבעו בדיקה משפחתית השבוע', { x: 5.4, y: 0.7, w: 7.33, h: 0.85, fontSize: 36, bold: true, color: C.background1, objectName: an(2) });
  T(s, 'שעה אחת, כל המשפחה, ויוצאים עם תוכנית כתובה. ללא התחייבות', { x: 5.4, y: 1.55, w: 7.33, h: 0.5, fontSize: 19, color: C.accent2, objectName: an(3) });
  T(s, [{ text: 'שיראל פרגר, יועץ משכנתאות ופתרונות מימון', options: { breakLine: true, bold: true } }, { text: 'B.A כלכלה · M.B.A · חבר בהתאחדות יועצי המשכנתאות', options: {} }], { x: 5.4, y: 2.15, w: 7.33, h: 0.8, fontSize: 15, color: 'CFEFF5', objectName: an(3) + 'c' });
  const ct = [['LuPhone', '052-441-5395'], ['LuMail', 'sp.makesense@gmail.com']];
  for (let i = 0; i < 2; i++) { const y = 3.15 + i * 0.82; s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.6, y, w: 5.13, h: 0.66, rectRadius: 0.33, fill: { color: C.accent2, transparency: 80 }, line: { color: HEX.cyan, width: 1 }, objectName: an(4 + i) }); s.addImage({ data: await ic(ct[i][0], HEX.white), x: 12.15, y: y + 0.14, w: 0.38, h: 0.38, altText: '', objectName: an(4 + i) + 'i' }); T(s, ct[i][1], { x: 7.8, y, w: 4.2, h: 0.66, fontSize: 20, bold: true, color: C.background1, valign: 'middle', align: 'left', rtlMode: false, objectName: an(4 + i) + 't' }); }
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.2, y: 5.0, w: 3.3, h: 1.45, rectRadius: 0.12, fill: { color: C.background1 }, line: { type: 'none' }, objectName: an(6) });
  s.addImage({ path: A('qr-wa.png'), x: 1.3, y: 5.08, w: 1.3, h: 1.3, altText: 'QR לוואטסאפ', objectName: an(6) + 'q' });
  T(s, 'סרקו לוואטסאפ', { x: 2.65, y: 5.0, w: 1.75, h: 1.45, fontSize: 15, bold: true, color: C.accent1, align: 'center', valign: 'middle', objectName: an(6) + 't' });
  T(s, 'שאלות?', { x: 5.4, y: 4.85, w: 7.33, h: 1.0, fontSize: 48, bold: true, color: C.background1, objectName: an(7) });
  T(s, 'המידע במצגת כללי ואינו מהווה ייעוץ אישי, משפטי, פנסיוני או ביטוחי. המקרים מורכבים ובשמות בדויים. הנתונים נכונים ל-2026.', { x: 5.4, y: 6.1, w: 7.33, h: 0.5, fontSize: 10, color: 'CFEFF5' });
  notes(s, 'הצעד הבא: בדיקה משפחתית ללא התחייבות. שעה אחת עם כל המשפחה, יוצאים עם תוכנית כתובה. ראיתי את ההורים שלי מתמודדים עם החלטות כלכליות גדולות בלי איש מקצוע לצידם, וזה מה שהביא אותי לתחום. סרקו את הקוד או התקשרו. ואז: שאלות. מחלקים את הצ׳קליסט.');

  // ════════════ שקפי גיבוי (מוסתרים) ════════════
  pres.addSection({ title: 'גיבוי' });
  BACKUP = true;
  s = content('קצבת הזקנה נמוכה מקו העוני', 'המציאות במספרים', 'המציאות במספרים', 'גם עם תוספת ותק מלאה');
  s.addChart(pres.charts.BAR, [{ name: '₪ בחודש', labels: ['קצבה בסיסית', 'עם ותק מלא', 'קו העוני'], values: [1838, 2757, 3547] }], {
    x: 0.6, y: 1.6, w: 8.0, h: 4.15, catAxisOrientation: 'maxMin', barDir: 'col', barGapWidthPct: 60, chartColors: [HEX.blue, HEX.cyan, HEX.warn], ...chartTxt, showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '#,##0" ₪"', dataLabelColor: HEX.ink,
    valAxisMinVal: 0, valAxisMaxVal: 4200, valGridLine: { style: 'none' }, showLegend: false, objectName: an(1), altText: 'קצבה בסיסית 1,838 ₪, עם ותק מלא 2,757 ₪, קו העוני ליחיד 3,547 ₪' });
  card(s, 9.0, 1.75, 3.73, 3.9, C.accent1, an(2));
  T(s, 'חסרים', { x: 9.0, y: 1.95, w: 3.73, h: 0.5, fontSize: 20, bold: true, color: C.accent2, align: 'center', objectName: an(2) + 'h' });
  big(s, '790 ₪', 9.0, 2.4, 3.73, 1.2, HEX.white, 52, { objectName: an(2) + 'n' });
  T(s, 'כל חודש עד קו העוני, גם עם תוספת ותק מלאה, למי שאין לו הכנסה אחרת', { x: 9.25, y: 3.75, w: 3.25, h: 1.2, fontSize: 21, bold: true, color: C.background2, align: 'center', valign: 'top', objectName: an(2) + 't' });
  plain(s, 'קצבת זקנה היא הסכום שביטוח לאומי משלם כל חודש מגיל הפרישה. תוספת ותק היא תוספת של עד 50% למי ששילם ביטוח לאומי שנים רבות. קו העוני הוא ההכנסה שמתחתיה אדם נחשב עני. למי שאין הכנסה נוספת יש גם השלמת הכנסה, אבל צריך לבקש.');
  src(s, 'מקור: המוסד לביטוח לאומי, סכומי הקצבאות 2026; דוח העוני 2024 (קו העוני ליחיד)');
  notes(s, 'קצבה בסיסית ליחיד 1,838 ₪, עם ותק מלא 2,757 ₪, וקו העוני ליחיד 3,547 ₪. גם במקרה הטוב חסרים כ-790 ₪ בחודש.');

  s = content('רק 44% מקבלים פנסיה בכלל', 'המציאות במספרים', 'המציאות במספרים', 'בקרב בני גיל הפרישה שאינם עובדים');
  s.addChart(pres.charts.DOUGHNUT, [{ name: 'פנסיה', labels: ['מקבלים פנסיה', 'לא מקבלים'], values: [44.2, 55.8] }], { x: 7.3, y: 1.6, w: 5.4, h: 4.15, holeSize: 64, chartColors: [HEX.blue, HEX.line], showPercent: false, showValue: false, showLegend: true, legendPos: 'b', legendFontSize: 14, legendFontFace: '+mn-lt', legendColor: HEX.muted, objectName: an(1), altText: '44.2% מקבלים פנסיה' });
  big(s, '44%', 8.5, 2.95, 3.0, 1.0, HEX.blue, 44, { objectName: an(1) + 'n' });
  s.addChart(pres.charts.BAR, [{ name: 'פנסיה ממוצעת', labels: ['נשים', 'גברים'], values: [5481, 8184] }], { x: 0.6, y: 1.6, w: 6.3, h: 4.15, barDir: 'bar', barGapWidthPct: 45, chartColors: [HEX.cyan, HEX.blue], ...chartTxt, catAxisLabelFontSize: 18, showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '#,##0" ₪"', dataLabelColor: HEX.ink, valAxisMinVal: 0, valAxisMaxVal: 10000, valGridLine: { style: 'none' }, showLegend: false, showTitle: true, title: 'פנסיה ממוצעת בקרב המקבלים', titleColor: HEX.ink, titleFontSize: 14, titleFontFace: '+mn-lt', objectName: an(2), altText: 'נשים 5,481 ₪, גברים 8,184 ₪' });
  plain(s, 'פנסיה היא קצבה חודשית מקרן פנסיה או מביטוח מנהלים, מכסף שנחסך בשנות העבודה. היא באה בנוסף לקצבת הזקנה של ביטוח לאומי, ורוב בני הדור לא צברו כזו.');
  src(s, 'מקור: הלמ״ס, חודש האזרח הוותיק 2026 (נתוני 2024): נשים 63+ וגברים 67+ שאינם עובדים');
  notes(s, '44.2% מבני גיל הפרישה שאינם עובדים מקבלים פנסיה. הממוצע בקרב המקבלים 6,678 ₪, ולנשים 5,481 ₪ מול 8,184 ₪ לגברים, כשליש פחות.');

  s = content('3 הנחות שעולות להורים כסף', 'המציאות במספרים', 'המציאות במספרים', 'כמה מהן שמעתם בבית?');
  const myths = [['"יש להם פנסיה, הם יסתדרו"', '56%', 'מבני גיל הפרישה שלא עובדים, לא מקבלים פנסיה'], ['"המדינה תדאג להם"', '1,838 ₪', 'קצבת הזקנה הבסיסית, כמחצית מקו העוני'], ['"בבית לא נוגעים"', 'עד 1.4 מיליון ₪', 'אפשר לקבל כנגד דירה ששווה 3 מיליון ₪, בגיל 70']];
  for (let i = 0; i < 3; i++) { const x = 8.83 - i * 4.1, [m, n, f] = myths[i];
    card(s, x, 1.75, 3.9, 1.4, 'EEF0F4', an(1 + i * 2)); T(s, m, { x: x + 0.2, y: 1.8, w: 3.5, h: 1.3, fontSize: 19, bold: true, color: C.accent4, align: 'center', valign: 'middle', strike: 'sngStrike', objectName: an(1 + i * 2) + 't' });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 3.35, w: 3.9, h: 3.0, rectRadius: 0.16, fill: { color: C.accent1 }, line: { type: 'none' }, shadow: shadow(), objectName: an(2 + i * 2) });
    T(s, 'בפועל', { x: x + 0.2, y: 3.5, w: 3.5, h: 0.4, fontSize: 15, bold: true, color: C.accent2, objectName: an(2 + i * 2) + 'h' });
    big(s, n, x, 3.95, 3.9, 1.1, HEX.white, 44, { objectName: an(2 + i * 2) + 'n' });
    T(s, f, { x: x + 0.25, y: 5.1, w: 3.4, h: 1.0, fontSize: 17, color: C.background2, align: 'center', valign: 'top', objectName: an(2 + i * 2) + 'f' }); }
  src(s, 'מקור: הלמ״ס 2026 (נתוני 2024); ביטוח לאומי 2026; השוואת גופים מלווים 2026 (הדוגמה להמחשה)');
  notes(s, 'יש להם פנסיה? 56% מבני גיל הפרישה שלא עובדים לא מקבלים פנסיה. המדינה תדאג? הקצבה הבסיסית היא כמחצית מקו העוני. בבית לא נוגעים? בגיל 70, במימון המרבי בשוק (48%), דירה של 3 מיליון יכולה לשחרר עד כ-1.4 מיליון ₪.');

  await hatSlide('תכנון פרישה', 'תכנון פרישה', 'עו״ד ביטוח לאומי', 'LuLandmark', 'עד כ-220 אלף ₪', 'תוספת ותק מלאה ליחיד: 919 ₪ בחודש (50% מ-1,838 ₪), לאורך 20 שנה. המחשה.', [
    ['הקצבה לא מגיעה לבד', 'צריך להגיש תביעה בגיל הזכאות. על איחור משלמים בדרך כלל רטרואקטיבית רק עד 12 חודשים.'],
    ['תוספת ותק', '2% על כל שנת ביטוח מעל 10 שנים, עד 50% מהקצבה. בודקים שכל השנים נספרו.'],
    ['תוספת דחייה', 'מי שלא קיבל קצבה בגלל הכנסה מעבודה, מקבל 5% תוספת על כל שנת דחייה עד גיל 70.'],
    ['השלמת הכנסה', 'למי שאין הכנסה נוספת או שהיא נמוכה. צריך לבקש, והיא פותחת גם הנחות נוספות.'],
    ['גמלת סיעוד', 'מגישים כשמתחילים להזדקק לעזרה. נקבעת לפי מבחן תלות ומבחן הכנסה, ואפשר לערער.'],
  ], 'מקור: ביטוח לאומי, קצבת זקנה, תוספת ותק ותוספת דחייה 2026; כל זכות, תשלום קצבת זיקנה רטרואקטיבי', 'חישוב: קצבה בסיסית ליחיד 1,838 ₪, תוספת ותק מלאה 50% = 919 ₪ בחודש, 11,028 ₪ בשנה, כ-220 אלף ₪ ב-20 שנה. הדגשים: הקצבה לא אוטומטית (רטרו עד 12 חודשים ככלל; אחרי גיל 70 יש כללים מיוחדים), תוספת ותק 2% לשנה מעל 10 שנים עד 50%, תוספת דחייה 5% לשנה עד גיל 70 למי שלא קיבל קצבה בגלל הכנסות, השלמת הכנסה למי שהכנסתו נמוכה, וגמלת סיעוד לפי מבחן תלות ומבחן הכנסה עם זכות ערעור.');

  await hatSlide('תכנון פרישה', 'תכנון פרישה', 'סוכן ביטוח פנסיוני', 'LuBriefcase', 'כ-860 ₪ בחודש', 'פטור מלא בטופס 161ד על פנסיה של 12,000 ₪, לפי מדרגות המס. כ-200 אלף ₪ ב-20 שנה. המחשה.', [
    ['טופס 161ד, המלא', 'מנצל את כל הפטור ממס על הפנסיה, עד 5,422 ₪ בחודש. הטופס המקוצר 161ח נותן רק 22.5%.'],
    ['בחירת מסלול הקצבה', 'כמה ימשיך לבן הזוג אחרי פטירה, והאם יש תקופת הבטחה. אחרי הבחירה כמעט אי אפשר לשנות.'],
    ['מקדם ההמרה', 'המספר שהופך את הצבירה לקצבה חודשית. פוליסה ישנה עם מקדם מובטח לא מעבירים בלי בדיקה.'],
    ['דמי ניהול', 'משלמים גם בזמן הפנסיה. כל 0.1% על מיליון ₪ שווה 1,000 ₪ בשנה.'],
    ['ביטוחים כפולים', 'שתי פוליסות בריאות שמחזירות הוצאות = תשלום כפול, החזר אחד. כל 100 ₪ בחודש הם 24 אלף ₪ ב-20 שנה.'],
  ], 'מקור: רשות המסים, קיבוע זכויות (161ד) ופטור נוסף (161ח); מדרגות מס הכנסה 2026. החישוב להמחשה', 'חישוב: פנסיה ברוטו 12,000 ₪. בלי פטור, החלק שמעל 6,578 ₪ ממוסה ב-10%, 14% ו-20% לפי המדרגות. פטור של 5,422 ₪ מוריד מס של כ-860 ₪ בחודש (432 ₪ ב-10%, 3,050 ₪ ב-14%, 1,940 ₪ ב-20%). בפנסיה נמוכה, שממילא מתחת לסף המס, החיסכון קטן יותר. הטופס המקוצר 161ח נותן רק את הפטור הנוסף (22.5%) בלי הבסיסי. מסלול הקצבה (שאירים, תקופת הבטחה) נבחר פעם אחת. מקדם המרה מובטח בפוליסות ישנות הוא נכס. דמי ניהול: 0.1% ממיליון = 1,000 ₪ בשנה. כפל ביטוחי בריאות מסוג שיפוי: משלמים פעמיים, מקבלים החזר פעם אחת.');

  await hatSlide('תכנון פרישה', 'תכנון פרישה', 'מתכנן פרישה', 'LuCompass', 'כ-550 אלף ₪', 'הפער של ההורים של נועה, 2,300 ₪ בחודש, לאורך 20 שנה. זה הסכום שהתוכנית צריכה לסגור.', [
    ['קודם תקציב', 'כמה נכנס וכמה יוצא בכל חודש. בלי המספר הזה, כל החלטה היא ניחוש.'],
    ['מתכננים ל-20–25 שנה', 'מי שהגיע לגיל 65 חי בממוצע עוד 20 שנה ויותר. הכסף צריך להספיק עד הסוף.'],
    ['הסדר הנכון', 'קודם זכויות ומס, אחר כך חסכונות, ורק אז הבית. כל שלב זול מזה שאחריו.'],
    ['אינפלציה שוחקת', 'כסף בעו״ש שלא צמוד מאבד כ-40% מכוח הקנייה ב-20 שנה, באינפלציה של 2.5% בשנה.'],
    ['כרית ביטחון', 'כמה חודשי הוצאות בצד, בכסף זמין, לאירוע רפואי או לתיקון בבית.'],
  ], 'מקור: מבקר המדינה 2026 (תוחלת חיים בגיל 65); חישובי המחשה', 'חישוב: 2,300 ₪ × 12 × 20 = 552,000 ₪. אינפלציה: 1.025 בחזקת 20 = 1.64, כלומר כוח הקנייה יורד ל-61% (ירידה של כ-39%). הקצבאות מביטוח לאומי והפנסיה צמודות, אבל פיקדונות ועו״ש לא. הסדר: זכויות ומס עולים כמעט אפס, חסכונות נגמרים, והבית הוא המקור האחרון והגדול.');

  s = content('"לא יישאר לנו כלום?" בואו נבדוק', 'הבית כנכס', 'הבית כנכס', 'שלוש דרכים להחזיר. בכל אחת, הדירה נשארת שווה יותר מהחוב');
  const labels = ['היום', '+5', '+10', '+15', 'עד 120'], value = [100, 108, 117, 126, 136];
  const debts = [['לא מחזירים כלום', 'החוב גדל, כי הריבית מצטברת', [30, 38, 48, 60, 75]], ['מחזירים רק ריבית', 'החוב נשאר בערך כמו שהיה', [30, 31, 32, 33, 34]], ['מחזירים כל חודש', 'החוב יורד עד אפס', [30, 23, 15, 7, 0]]];
  debts.forEach(([t, cap, d], i) => { const x = 8.75 - i * 4.07; card(s, x, 1.65, 3.95, 4.8, C.background1, an(1 + i));
    T(s, t, { x, y: 1.8, w: 3.95, h: 0.5, fontSize: 21, bold: true, color: C.accent1, align: 'center', objectName: an(1 + i) + 't' });
    s.addChart(pres.charts.LINE, [{ name: 'שווי הנכס', labels, values: value }, { name: 'יתרת החוב', labels, values: d }], { x: x + 0.1, y: 2.3, w: 3.75, h: 3.4, chartColors: [HEX.cyan, HEX.blue], lineSize: 4, lineDataSymbol: 'none', showLegend: true, legendPos: 'b', legendFontSize: 12, legendFontFace: '+mn-lt', legendColor: HEX.muted, catAxisLabelColor: HEX.muted, catAxisLabelFontSize: 11, catAxisLabelFontFace: '+mn-lt', valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 140, valGridLine: { color: HEX.line, size: 0.5 }, catGridLine: { style: 'none' }, objectName: an(1 + i) + 'c', altText: `${t}: החוב ${cap}` });
    T(s, cap, { x, y: 5.8, w: 3.95, h: 0.5, fontSize: 17, bold: true, color: i === 2 ? C.accent3 : C.accent1, align: 'center', objectName: an(1 + i) + 'k' }); });
  src(s, 'המחשה בלבד; ההתפתחות בפועל תלויה בריבית, בהצמדה ובשווי הנכס');
  notes(s, 'החשש הראשון של הילדים. בשפיצר החוב יורד, בריבית בלבד גדל לאט, וללא החזר גדל מהר יותר בגלל ריבית דריבית. בכל המסלולים, שווי הנכס נשאר גבוה מהחוב. להמחשה.');

  s = content('חברת ביטוח או בנק?', 'הבית כנכס', 'הבית כנכס', 'שני מוצרים דומים, עם הבדלים שחשוב להכיר');
  const hd = (t, f, c) => ({ text: t, options: { bold: true, fontSize: 19, color: c, fill: { color: f }, align: 'center', valign: 'middle', rtlMode: true, lang: 'he-IL' } });
  const cell = (t, o = {}) => ({ text: t, options: { fontSize: 17, color: HEX.ink, align: 'right', valign: 'middle', rtlMode: true, lang: 'he-IL', ...o } });
  const topic = t => cell(t, { bold: true, color: HEX.blue, fill: { color: HEX.ice } });
  const rows = [['מי מפקח', 'רשות שוק ההון', 'בנק ישראל'], ['עד מתי', 'בלי תאריך סיום, עד סוף הדרך', 'תלוי בבנק ובמסלול, לעיתים לתקופה מוגדרת'], ['איך מחזירים', 'בסוף בלבד, רק ריבית, או כל חודש', 'בסוף בלבד, רק ריבית, או כל חודש'], ['איך קוראים לזה', 'משכנתה הפוכה', 'משכנתה לגיל השלישי']];
  const tbl = [[hd('בנקים', HEX.blue, HEX.white), hd('חברות ביטוח', HEX.teal, HEX.white), hd('', HEX.ice, HEX.blue)]];
  rows.forEach(([a, i, b]) => tbl.push([cell(b), cell(i), topic(a)]));
  s.addTable(tbl, { x: 0.6, y: 1.75, w: 12.13, colW: [4.6, 4.6, 2.93], rowH: 0.72, border: { type: 'solid', color: HEX.white, pt: 2 }, fill: { color: HEX.white }, fontFace: THEME.bodyFontFace, margin: [0.05, 0.15, 0.05, 0.15], objectName: an(1) });
  plain(s, 'בשני העולמות אפשר לקבל כסף כנגד הדירה ולבחור איך להחזיר. ההבדל העיקרי הוא מי מפקח ועד מתי ההלוואה. משווים 2–3 גופים שמתאימים להורים, לא את כל השוק.', 5.6, 0.7);
  src(s, 'מקור: אתרי הגופים ומסמכי מוצר, 2026; השוואה כללית, התנאים משתנים בין הגופים');
  notes(s, 'שני העולמות מציעים מסלולים דומים, גם בבנקים יש בלון מלא. ההבדלים: גוף מפקח, ותקופה, כשבחברות הביטוח אין מועד פירעון קבוע. משווים 2–3 גופים רלוונטיים.');

  await hatSlide('הבית כנכס', 'הבית כנכס', 'יועץ משכנתאות הפוכות', 'LuHouse', 'כ-250 אלף ₪', 'ההפרש בחוב אחרי 15 שנה על הלוואה של 900 אלף ₪, בין ריבית של 4% לריבית של 5%, בלי החזרים. המחשה.', [
    ['לוקחים רק מה שצריך', 'הריבית נצברת על כל שקל שנמשך. משיכות לפי הצורך זולות מסכום גדול מראש.'],
    ['משווים 2–3 גופים מתאימים', 'ריבית, הצמדה, עמלת פתיחה ושמאות. הבדל של 1% בריבית שווה מאות אלפי שקלים.'],
    ['בודקים מה קורה בסוף', 'כמה זמן יש ליורשים להחזיר, והאם החוב מוגבל לשווי הדירה.'],
    ['החזר מוקדם', 'האם יש עמלה אם מחזירים לפני הזמן, למשל כשמוכרים את הדירה או מקבלים ירושה.'],
    ['כל המשפחה בפגישה', 'פגישה אחת עם ההורים והילדים מונעת הפתעות ומריבות בהמשך.'],
  ], 'חישוב המחשה בריבית דריבית; התנאים בפועל משתנים בין הגופים המלווים', 'חישוב: 900,000 × 1.05 בחזקת 15 = כ-1.87 מיליון ₪. 900,000 × 1.04 בחזקת 15 = כ-1.62 מיליון ₪. ההפרש כ-250 אלף ₪, וזה בלי הצמדה למדד. לכן משווים 2–3 גופים רלוונטיים, ולוקחים רק מה שצריך. הסכום של ההורים של נועה (900 אלף) קטן מהמימון המרבי בגיל 70 (עד כ-1.4 מיליון), בכוונה.');

  const caseSlide = async (i, file, title, what, law, fix, lawSrc, stat) => {
    const s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'מקרים' });
    await photo(s, file, 0, 0, 5.6, 7.5, title, '!!case' + i, caseFocus[i]);
    s.addText(title, { placeholder: 'title', ...he });
    tag(s, 'מקרה ' + (i + 1));
    s.addShape(pres.shapes.RECTANGLE, { x: 5.6, y: 0, w: 0.07, h: 7.5, fill: { color: HEX.cyan }, line: { type: 'none' }, objectName: 'rule' });
    const beats = [['LuMessageCircle', 'מה קרה', what, 'EEF0F4', C.text1, HEX.gray2], ['LuGavel', 'מה החוק אומר', law, C.background1, C.text1, HEX.blue], ['LuShieldCheck', 'מה היה מונע את זה', fix, C.accent1, C.background1, HEX.cyan]];
    for (let k = 0; k < 3; k++) { const y = 1.45 + k * 1.62, [icn, h, body, fill, col, icHex] = beats[k];
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.0, y, w: 6.73, h: 1.45, rectRadius: 0.14, fill: { color: fill }, line: { type: 'none' }, shadow: shadow(), objectName: an(1 + k) });
      s.addImage({ data: await ic(icn, k === 2 ? HEX.cyan : icHex), x: 12.1, y: y + 0.2, w: 0.45, h: 0.45, altText: '', objectName: an(1 + k) + 'i' });
      T(s, h, { x: 8.0, y: y + 0.15, w: 4.0, h: 0.4, fontSize: 15, bold: true, color: k === 2 ? C.accent2 : (k === 1 ? C.accent1 : C.accent4), objectName: an(1 + k) + 'h' });
      T(s, body, { x: 6.25, y: y + 0.55, w: 5.75, h: 0.85, fontSize: 16, bold: k === 2, color: col, valign: 'top', objectName: an(1 + k) + 'b' }); }
    if (stat) { s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.4, y: 5.55, w: 4.8, h: 1.0, rectRadius: 0.14, fill: { color: HEX.navy, transparency: 15 }, line: { type: 'none' }, objectName: an(4) }); T(s, stat, { x: 0.55, y: 5.55, w: 4.5, h: 1.0, fontSize: 15, bold: true, color: C.background1, align: 'center', valign: 'middle', objectName: an(4) + 't' }); }
    T(s, lawSrc, { x: 6.0, y: 6.4, w: 6.3, h: 0.3, fontSize: 10, italic: true, color: C.accent4 });
    return s;
  };
  s = await caseSlide(0, 'case-inheritance', 'משפחת לוין: הדירה נתקעה',
    'אבא נפטר בלי צוואה. אמא רוצה למכור ולעבור לדיור מוגן, ובן אחד מסרב.',
    'בלי צוואה, הילדים יורשים חלק מהדירה (25% כשהיא של שני ההורים). בלי הסכמת כולם, המכירה עוברת לבית משפט.',
    'צוואה בזמן. לזוג: "צוואה הדדית", מסמך משותף שקובע מה בן הזוג שנשאר יכול לעשות עם הדירה.',
    'מקור: חוק הירושה, התשכ״ה-1965, סעיפים 8א ו-11; כל זכות, ירושה על פי דין. מקרה מורכב, שמות בדויים', null);
  notes(s, 'הדירה רשומה על שני ההורים, ולכן רק החצי של האב הוא עיזבון. לפי סעיף 11 לחוק הירושה, כשאין צוואה, בן הזוג מקבל מחצית מהעיזבון (וגם את הרכב ואת מטלטלי הבית), והילדים מתחלקים במחצית השנייה. כל אחד הוא שותף בדירה. כשאחד מסרב, נשאר רק הליך פירוק שיתוף בבית משפט. צוואה הדדית (סעיף 8א) מאפשרת לבני זוג להסדיר את זה מראש.');
  s = await caseSlide(1, 'case-dementia', 'משפחת שגיא: החשבון קפוא',
    'אמא אובחנה בדמנציה. הבנק לא מאפשר לילדים לשלם בשבילה אפילו את הארנונה.',
    'בלי ייפוי כוח, פונים לבית המשפט שימנה "אפוטרופוס": אדם שינהל את ענייניה. הליך ארוך ובפיקוח.',
    '"ייפוי כוח מתמשך": אמא בוחרת מראש מי ינהל את ענייניה אם לא תוכל. נחתם אצל עורך דין מוסמך.',
    'מקור: משרד המשפטים, האפוטרופוס הכללי; כל זכות, אפוטרופסות. מקרה מורכב, שמות בדויים', null);
  notes(s, 'בלי ייפוי כוח מתמשך, המשפחה צריכה לבקש מינוי אפוטרופוס מבית המשפט לענייני משפחה. זה הליך שכולל אגרה, עמדות של בני המשפחה ופיקוח. ייפוי כוח מתמשך נערך מראש בפני עורך דין שעבר הכשרה של האפוטרופוס הכללי, ומופקד אצלו.');
  s = await caseSlide(2, 'case-nursing', 'משפחת מזרחי: מטפל צמוד',
    'אבא עבר אירוע מוחי וזקוק למטפל צמוד. החסכונות מתחילים להיגמר.',
    'מטפל צמוד מקבל לפחות שכר מינימום (6,444 ₪), ועוד ביטוח ומגורים. ביטוח לאומי משתתף בין כ-1,700 לכ-7,400 ₪, לפי המצב.',
    'לבדוק מראש איזה ביטוח סיעודי יש ולכמה שנים, ולתכנן מאיפה יבוא הכסף אחר כך. למשל, משכנתה הפוכה.',
    'מקור: ביטוח לאומי, גמלת סיעוד 2026; שכר מינימום 2026; כל זכות, העסקת עובד זר בסיעוד. מקרה מורכב', null);
  notes(s, 'מטפל זר זכאי לשכר מינימום, 6,443.85 ₪ ב-2026, ובנוסף פיקדון, ביטוח בריאות ומגורים. גמלת הסיעוד בכסף נעה בין כ-1,705 ₪ ברמה 1 לכ-7,440 ₪ ברמה 6 (מאפריל 2026), ונבדקת גם לפי מבחן הכנסה. הפער נופל על המשפחה.');
  s = await caseSlide(3, 'case-health', 'משפחת כהן: הפוליסה שנעלמה',
    'אמא צריכה ניתוח. מתברר שהביטוח הפרטי שלה בוטל לפני שנים, כשהוראת הקבע נפלה.',
    'ביטוח שלא משלמים עליו מתבטל. בגיל מבוגר קשה מאוד, ולפעמים בלתי אפשרי, להצטרף מחדש.',
    '"הר הביטוח": אתר ממשלתי שמראה את כל הביטוחים של ההורים. בודקים בו פעם בשנה.',
    'מקור: משרד האוצר, רשות שוק ההון, "הר הביטוח". מקרה מורכב, שמות בדויים', null);
  notes(s, 'ביטוח שלא משולם מתבטל, ולעיתים איש במשפחה לא שם לב. "הר הביטוח" של רשות שוק ההון מראה את כל הפוליסות. פעם בשנה, 10 דקות.');

  await hatSlide('מקרים', 'מקרים', 'עו״ד צוואות וירושות', 'LuScale', '750 אלף ₪', 'החלק של הילדים בדירה של 3 מיליון ₪ בלי צוואה, כשהדירה רשומה על שני ההורים. תקוע עד שכולם מסכימים.', [
    ['בלי צוואה, החוק מחליט', 'לבן הזוג מחצית מהעיזבון ולילדים השאר. כשהדירה של שניהם: לבן הזוג 75% ולילדים 25%.'],
    ['צוואה הדדית', 'בני הזוג קובעים יחד מה קורה אחרי הראשון ואחרי השני. ביטולה מוגבל, ולכן מנסחים בזהירות.'],
    ['ייפוי כוח מתמשך', 'ההורה בוחר מראש מי ינהל את הכסף, הבריאות והעניינים האישיים, אם לא יוכל. חוסך אפוטרופסות.'],
    ['רק אצל עו״ד מוסמך', 'עורך דין שעבר הכשרה של האפוטרופוס הכללי, והמסמך מופקד אצל האפוטרופוס הכללי.'],
    ['אין מס ירושה בישראל', 'אבל במכירה של דירה שהתקבלה בירושה עשוי לחול מס שבח. בודקים לפני שמוכרים.'],
  ], 'מקור: חוק הירושה, התשכ״ה-1965, סעיפים 8א ו-11; משרד המשפטים, ייפוי כוח מתמשך. המחשה', 'חישוב: דירה של 3 מיליון ₪ רשומה חצי-חצי על בני הזוג. העיזבון של האב הוא החצי שלו, 1.5 מיליון. בלי צוואה, האלמנה מקבלת מחצית ממנו (750 אלף) ונשארת עם 75% מהדירה, והילדים חולקים 750 אלף (25%). כל אחד מהם שותף, ובלי הסכמה צריך פירוק שיתוף בבית משפט. צוואה הדדית לפי סעיף 8א: אחרי מות הראשון, ביטולה מוגבל. ייפוי כוח מתמשך נערך אצל עו״ד שהוסמך ומופקד אצל האפוטרופוס הכללי. אין מס ירושה, אבל מס שבח עשוי לחול במכירת דירה שהתקבלה בירושה, לפי התנאים.');

  s = pres.addSlide({ masterName: 'PHOTO', sectionTitle: 'סוף הסיפור' });
  await photo(s, 'kitchen-talk', 0, 0, 13.333, 7.5, 'בת ושני הורים סביב שולחן המטבח', '!!hero');
  veil(s, 7.0, 0, 6.333, 7.5, 10, HEX.navy, '!!veil');
  T(s, 'השיחה של השבת הקרובה', { x: 7.4, y: 0.7, w: 5.4, h: 0.8, fontSize: 32, bold: true, color: C.background1, objectName: an(1) });
  const qs = ['מה הייתם רוצים לעשות?', 'כמה נכנס בחודש?', 'איפה כל החסכונות?', 'יש ייפוי כוח וצוואה?', 'ממה אתם הכי חוששים?'];
  qs.forEach((q, i) => { const y = 1.8 + i * 0.88; s.addShape(pres.shapes.OVAL, { x: 12.15, y: y + 0.12, w: 0.5, h: 0.5, fill: { color: i === 0 ? HEX.cyan : HEX.white }, line: { type: 'none' }, objectName: an(2 + i) }); T(s, String(i + 1), { x: 12.15, y: y + 0.12, w: 0.5, h: 0.5, fontSize: 15, bold: true, color: i === 0 ? C.background1 : C.accent1, align: 'center', valign: 'middle', rtlMode: false, objectName: an(2 + i) + 'n' }); T(s, q, { x: 7.4, y, w: 4.6, h: 0.75, fontSize: 22, bold: i === 0, color: i === 0 ? C.accent2 : C.background1, valign: 'middle', objectName: an(2 + i) + 't' }); });
  T(s, 'מתחילים מהחלומות, לא מהחובות', { x: 7.4, y: 6.3, w: 5.4, h: 0.4, fontSize: 16, italic: true, color: 'CFEFF5', objectName: an(7) });
  brand(s);
  notes(s, 'חמש שאלות לשבת הקרובה. מתחילים מהחלומות, לא מהחובות, ומזמינים את כל האחים.');

  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'סיום' });
  s.addText('מקורות הנתונים', { placeholder: 'title', ...he }); tag(s, 'נספח');
  const refs = [
    ['בני 65+, תוחלת חיים בגיל 65', 'מבקר המדינה, היערכות להזדקנות האוכלוסייה, 2026', 'https://library.mevaker.gov.il/sites/DigitalLibrary/Documents/2026/Population-Aging/2026-Population-Aging-101-Taktzir.pdf'],
    ['קצבאות 2026', 'המוסד לביטוח לאומי, גובה הקצבאות לשנת 2026', 'https://www.btl.gov.il/About/news/Pages/ArchiveFolder/2026/hadasaidkonkitzva2026.aspx'],
    ['קו העוני', 'המוסד לביטוח לאומי, דוח העוני 2024', 'https://www.btl.gov.il/About/news/Pages/ArchiveFolder/2026/dohoni2024hadasa.aspx'],
    ['פנסיה: 44%, נשים מול גברים', 'הלמ״ס, חודש האזרח הוותיק 2026 (ביזפורטל)', 'https://www.bizportal.co.il/general/news/article/20046899'],
    ['פטור ממס על קצבה', 'כל זכות, הטבות מס בפרישה, טופס 161ד', 'https://www.kolzchut.org.il/he/%D7%94%D7%98%D7%91%D7%95%D7%AA_%D7%9E%D7%A1_%D7%91%D7%A4%D7%A8%D7%99%D7%A9%D7%94_%D7%9C%D7%A4%D7%A0%D7%A1%D7%99%D7%94_(%D7%98%D7%95%D7%A4%D7%A1_161%D7%93_%22%D7%A7%D7%99%D7%91%D7%95%D7%A2_%D7%96%D7%9B%D7%95%D7%99%D7%95%D7%AA%22)'],
    ['ירושה על פי דין', 'כל זכות, ירושה על פי דין (חוק הירושה, סעיף 11)', 'https://www.kolzchut.org.il/he/%D7%99%D7%A8%D7%95%D7%A9%D7%94_%D7%A2%D7%9C_%D7%A4%D7%99_%D7%93%D7%99%D7%9F'],
    ['ייפוי כוח מתמשך', 'משרד המשפטים, עריכה והפקדה של ייפוי כוח מתמשך', 'https://www.gov.il/he/service/edit_and_deposit_continuous_power_of_attorney'],
    ['מינוי אפוטרופוס', 'gov.il, בקשה למינוי אפוטרופוס לבגירים', 'https://www.gov.il/he/service/request_to_appoint_guardian'],
    ['גמלת סיעוד', 'ביטוח לאומי, קצבה בכסף בגמלת סיעוד', 'https://www.btl.gov.il/benefits/Long_Term_Care/Pages/money.aspx'],
    ['ביטוח סיעודי בקופות החולים', 'רשות שוק ההון, ביטוח סיעודי קבוצתי לחברי קופות החולים (הודעה 2023)', 'https://www.gov.il/BlobFolder/dynamiccollectorresultitem/notice-2023-012/he/RIA_LTC_01082023_pdf.pdf'],
    ['העסקת עובד זר בסיעוד', 'כל זכות, מדריך להעסקת עובד זר בסיעוד', 'https://www.kolzchut.org.il/he/%D7%9E%D7%93%D7%A8%D7%99%D7%9A_%D7%9C%D7%94%D7%A2%D7%A1%D7%A7%D7%AA_%D7%A2%D7%95%D7%91%D7%93_%D7%96%D7%A8_%D7%91%D7%A1%D7%99%D7%A2%D7%95%D7%93'],
    ['משכנתה הפוכה', 'השוואת תנאי גופים מלווים ודפי עמלות 2026 (חומר מקצועי)', ''],
  ];
  refs.forEach(([what, name, url], i) => { const col = i < 6 ? 0 : 1, row = i < 6 ? i : i - 6, x = col === 0 ? 6.75 : 0.6, y = 1.45 + row * 0.86;
    T(s, what, { x, y, w: 5.98, h: 0.34, fontSize: 14, bold: true, color: C.accent1 });
    T(s, url ? [{ text: name, options: { hyperlink: { url, tooltip: url }, color: C.accent3 } }] : name, { x, y: y + 0.34, w: 5.98, h: 0.4, fontSize: 12, color: C.accent3 }); });
  notes(s, 'נספח מוסתר: מקורות מלאים.');

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);

  // ── post-process: Morph transitions + timed entrance animations + hidden appendix ──
  const z = await JSZip.loadAsync(fs.readFileSync(OUT));
  const slides = Object.keys(z.files).filter(f => /^ppt\/slides\/slide\d+\.xml$/.test(f)).sort((a, b) => +a.match(/(\d+)/)[1] - +b.match(/(\d+)/)[1]);
  const morph = '<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"><mc:Choice xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main" Requires="p159"><p:transition spd="slow" xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" p14:dur="1200"><p159:morph option="byObject"/></p:transition></mc:Choice><mc:Fallback><p:transition spd="slow"><p:fade/></p:transition></mc:Fallback></mc:AlternateContent>';
  for (let k = 0; k < slides.length; k++) {
    const p = slides[k]; let x = await z.file(p).async('string');
    // collect animated shapes: name a<NN>_<seq>...
    const groups = {};
    for (const m of x.matchAll(/<p:cNvPr id="(\d+)" name="a(\d\d)_[^"]*"/g)) (groups[+m[2]] = groups[+m[2]] || []).push(m[1]);
    const order = Object.keys(groups).map(Number).sort((a, b) => a - b);
    let timing = '';
    if (order.length) {
      let id = 3; const pars = [];
      order.forEach((g, gi) => {
        const delay = 300 + gi * 450;
        const effects = groups[g].map((spid, j) => {
          const a = ++id, b = ++id, c = ++id;
          return `<p:par><p:cTn id="${a}" presetID="10" presetClass="entr" presetSubtype="0" fill="hold" nodeType="${gi === 0 && j === 0 ? 'afterEffect' : 'withEffect'}"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst><p:set><p:cBhvr><p:cTn id="${b}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn><p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr><p:to><p:strVal val="visible"/></p:to></p:set><p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="${c}" dur="600"/><p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl></p:cBhvr></p:animEffect></p:childTnLst></p:cTn></p:par>`;
        }).join('');
        pars.push(`<p:par><p:cTn id="${++id}" fill="hold"><p:stCondLst><p:cond delay="${delay}"/></p:stCondLst><p:childTnLst>${effects}</p:childTnLst></p:cTn></p:par>`);
      });
      timing = `<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst><p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst><p:par><p:cTn id="${++id}" fill="hold"><p:stCondLst><p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond></p:stCondLst><p:childTnLst>${pars.join('')}</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn><p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst><p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq></p:childTnLst></p:cTn></p:par></p:tnLst></p:timing>`;
    }
    x = x.replace('</p:clrMapOvr>', '</p:clrMapOvr>' + morph + timing);
    // safety net: any Hebrew paragraph that is not explicitly left-aligned (LTR phone/email/credit) is RTL
    x = x.replace(/<a:pPr(?![^>]*\brtl=)(?![^>]*algn="l")/g, '<a:pPr rtl="1"');
    if (k >= 15) x = x.replace('<p:sld ', '<p:sld show="0" ');
    z.file(p, x);
  }
  Object.keys(z.files).filter(f => z.files[f].dir).forEach(f => { delete z.files[f]; });
  fs.writeFileSync(OUT, await z.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
  console.log('wrote', OUT, slides.length, 'slides');
})().catch(e => { console.error(e); process.exit(1); });

