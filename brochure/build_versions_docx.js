// Builds brochure/MAKESENSE-brochure-3-versions.docx: guiding principles + 3 versions
// (graphic language, writing tone, expressions per panel) with previews.
// Usage (from repo root): node brochure/build_versions_docx.js   (render the 3 versions first)
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType,
  AlignmentType, LevelFormat, BorderStyle, PageBreak, Footer, PageNumber, HeadingLevel, ImageRun,
} = require('docx');

const BLUE = '004AAD', DEEP = '0A2A5E', TEAL = '1EC8C8', INK = '0A0A0A', GREY = '5E6573', SKY = 'EAF2FE';
const FONT = 'Arial';
const D = __dirname;

const run = (text, o = {}) => new TextRun({ text, font: FONT, rightToLeft: true, bold: o.bold, boldComplexScript: o.bold,
  italics: o.italic, italicsComplexScript: o.italic, size: o.size || 21, sizeComplexScript: o.size || 21, color: o.color || INK });
const rich = (t, o = {}) => t.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map(x => x.startsWith('**') ? run(x.slice(2, -2), { ...o, bold: true }) : run(x, o));
const p = (t, o = {}) => new Paragraph({ bidirectional: true, alignment: o.align || AlignmentType.START, spacing: { before: o.before ?? 0, after: o.after ?? 120, line: 300 }, keepNext: o.keepNext, children: rich(t, o) });
const h1 = (t, color = BLUE) => new Paragraph({ bidirectional: true, heading: HeadingLevel.HEADING_1, spacing: { before: 320, after: 160 }, keepNext: true,
  border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: TEAL, space: 6 } }, children: [run(t, { bold: true, size: 34, color })] });
const h2 = (t, color = DEEP) => new Paragraph({ bidirectional: true, heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 100 }, keepNext: true, children: [run(t, { bold: true, size: 26, color })] });
const bullet = t => new Paragraph({ bidirectional: true, numbering: { reference: 'bul', level: 0 }, spacing: { after: 60, line: 290 }, children: rich(t) });
const br = () => new Paragraph({ children: [new PageBreak()] });
const bd = { style: BorderStyle.SINGLE, size: 4, color: 'C9DCF8' };
const borders = { top: bd, bottom: bd, left: bd, right: bd };
function table(rows, widths, o = {}) {
  return new Table({
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: widths, visuallyRightToLeft: true,
    rows: rows.map((r, ri) => new TableRow({ tableHeader: o.header && ri === 0, cantSplit: true,
      children: r.map((c, ci) => {
        const head = o.header && ri === 0, first = o.firstCol && ci === 0 && !head;
        return new TableCell({ width: { size: widths[ci], type: WidthType.DXA }, borders,
          shading: head ? { type: ShadingType.CLEAR, color: 'auto', fill: o.headFill || BLUE } : first ? { type: ShadingType.CLEAR, color: 'auto', fill: SKY } : undefined,
          margins: { top: 70, bottom: 70, left: 110, right: 110 },
          children: String(c).split('\n').map(l => p(l, { after: 30, size: o.size || 19, bold: head || first, color: head ? 'FFFFFF' : INK })) });
      }) })),
  });
}
const img = (file, w, h) => new ImageRun({ type: 'png', data: fs.readFileSync(path.join(D, file)), transformation: { width: w, height: h } });

// ---------- the three versions ----------
const versions = [
  {
    key: 'A', name: 'גרסה A · "בנק פרטי"', short: 'שקט מקצועי', file: 'brochure-v3.html', out: 'out-v3', color: DEEP,
    idea: 'דוח שנתי של בנק פרטי. אמון נבנה מסדר, מאוויר ומטיפוגרפיה, ולא מקישוטים.',
    fits: 'מפגשי BNI, משקיעים, בעלי עסקים, ולקוחות שמחפשים "הכתובת הרצינית".',
    graphic: [
      ['תחושה', 'יוקרתי, שקט, עריכתי (Editorial)'],
      ['צבעים', 'נייר לבן חם #FAFAF7 · תכלת עדין #EEF3FA · כחול רויאל #004AAD · כחול עמוק #0A2A5E · טורקיז #1EC8C8 רק לנקודה ולמשפט אחד'],
      ['טיפוגרפיה', 'כותרות בסריף עברי Frank Ruhl Libre · גוף Heebo Light'],
      ['צורות', 'בלי פינות מעוגלות, בלי צללים ובלי גרדיאנטים. קווים דקים (0.25 מ"מ) מפרידים בין רעיונות'],
      ['צילום', 'דואוטון: שחור-לבן על כחול המותג, עד קצה הדף'],
      ['פרטים מזהים', 'מספרי עמודים "02 / 08" · ספרה ענקית "3" בסריף · ציטוטים בסריף כחול בלי מסגרות'],
    ],
    tone: [
      ['קול', 'מדוד, סמכותי, מאופק. אומר מעט, וכל מילה שוקלת'],
      ['אורך משפט', '6–10 מילים. משפטים שלמים, בלי סלנג'],
      ['פנייה', '"אתם", באופן מכבד. שיראל בגוף ראשון רק בסיפור'],
      ['שאלות רטוריות', 'אחת בלבד: "מי מייצג אתכם?"'],
      ['להימנע', 'סימני קריאה, הבטחות, מילים רגשיות מדי'],
    ],
    expr: [
      ['1 · כריכה', 'השליטה הכלכלית שלכם מתחילה כאן.', 'שיראל פרגר · יועץ פיננסי עצמאי · 052-441-5395'],
      ['2 · משכנתאות ואשראי', 'המשכורת נכנסת. ההלוואות יוצאות. והמינוס נשאר.', 'סדר בהלוואות, במרחק שיחה'],
      ['3 · נדל"ן', 'לפני שקונים, מוכרים או משקיעים, בודקים את המספרים.', 'הנכס הבא, במרחק שיחה'],
      ['4 · עסקים (גב)', 'העסק מוכן לצמוח. התזרים לא.', 'הצמיחה הבאה, במרחק שיחה'],
      ['5 · כאב', 'הבנק מייצג את הבנק. מי מייצג אתכם?', '"הבנק אמר לא." · "ההחזר רק עולה."'],
      ['6 · שיראל', 'ראיתי מקרוב מה טעות פיננסית עושה למשפחה.', '"יש לו המון ידע, והמון סבלנות." · יונתן'],
      ['7 · בידול', 'אני לא מוכר לכם את מה שיש לבנק. אני בוחן מה נכון לכם.', 'בנק אחד ← כמה גופים מממנים'],
      ['8 · הנעה לפעולה', 'הצעד הראשון מבטיח שלא תישארו במקום.', 'לא צריך לדעת מה הפתרון. מספיק להתחיל בשיחה.'],
    ],
  },
  {
    key: 'B', name: 'גרסה B · "בגובה העיניים"', short: 'חם ואנושי', file: 'brochure-vB.html', out: 'out-vB', color: BLUE,
    idea: 'שיחה עם חבר שמבין בכסף. אמון נבנה מחום, מאמפתיה ומשפה פשוטה.',
    fits: 'משפחות, זוגות צעירים, רוכשי דירה ראשונה, ומי שהנושא הכספי מלחיץ אותו.',
    graphic: [
      ['תחושה', 'חם, נגיש, אופטימי'],
      ['צבעים', 'לבן · תכלת רך #F5F9FF / #E7F1FD · כחול רויאל #004AAD · טורקיז רך #E2F8F8 לרקע של תגיות'],
      ['טיפוגרפיה', 'כותרות Rubik SemiBold (עגול וידידותי) · גוף Heebo · סלוגן וחתימה בכתב יד'],
      ['צורות', 'פינות מעוגלות (4–6 מ"מ) · תגיות "גלולה" · כפתור הנעה לפעולה מעוגל עם הטלפון בתוכו'],
      ['צילום', 'צבעוני וטבעי, במסגרת מעוגלת רכה'],
      ['פרטים מזהים', 'בועות דיבור אמיתיות · השוואה בכרטיסים רכים · חתימה בכתב יד'],
    ],
    tone: [
      ['קול', 'אמפתי, מדבר, חם. כמו מישהו שיושב מולך עם קפה'],
      ['אורך משפט', '5–9 מילים. שפה מדוברת: "יושבים, מסדרים, נושמים"'],
      ['פנייה', '"אתם", בחום. שיראל משתף מעצמו ("גדלתי בבית...")'],
      ['שאלות רטוריות', 'מותרות כפתיח של פאנל: "מרגישים ש...?", "חולמים על...?"'],
      ['להימנע', 'מונחים מקצועיים בלי הסבר, טון של מכירה'],
    ],
    expr: [
      ['1 · כריכה', 'כסף לא צריך להדיר לכם שינה.', 'שיראל פרגר, יועץ פיננסי עצמאי · 052-441-5395'],
      ['2 · משכנתאות ואשראי', 'מרגישים שהחודש נגמר לפני המשכורת?', 'שקט בסוף החודש, במרחק שיחה'],
      ['3 · נדל"ן', 'חולמים על הדירה הבאה? בואו נוודא שהיא גם הגיונית.', 'הבית הבא, במרחק שיחה'],
      ['4 · עסקים (גב)', 'בניתם עסק מאפס. מגיע לו לנשום.', 'הצמיחה הבאה, במרחק שיחה'],
      ['5 · כאב', 'הבנק דואג לבנק. מי דואג לכם?', 'אם אמרתם פעם אחד מהמשפטים האלה, אתם לא לבד.'],
      ['6 · שיראל', 'גדלתי בבית שהכסף הכביד עליו.', '"הגענו עם המון חששות ופחדים, ויצאנו מרוצים." · חני'],
      ['7 · בידול', 'אני לא עובד בשביל הבנק. אני עובד בשבילכם.', 'שפה של בנק ← הסבר בגובה העיניים'],
      ['8 · הנעה לפעולה', 'הצעד הראשון מבטיח שלא תישארו במקום.', 'לא צריך להגיע מוכנים. רק להרים טלפון.'],
    ],
  },
  {
    key: 'C', name: 'גרסה C · "חד וישיר"', short: 'סמכותי ודוגרי', file: 'brochure-vC.html', out: 'out-vC', color: INK,
    idea: 'ביטחון של מי שיודע מה הוא עושה. אמון נבנה מסמכות, ממספרים ומאמירות חדות.',
    fits: 'בעלי עסקים, עצמאים, משקיעים, ואנשי עסקים ב-BNI שאוהבים "תכל\'ס".',
    graphic: [
      ['תחושה', 'נועז, חד, בעל ניגודיות גבוהה'],
      ['צבעים', 'שחור #0A0A0A · לבן · כחול רויאל #004AAD · טורקיז #1EC8C8 כהדגשת "מרקר" מתחת למילים'],
      ['טיפוגרפיה', 'כותרות Rubik Black (משקל 900), גדולות מאוד · גוף Heebo Medium'],
      ['צורות', 'מלבנים חדים · מסגרות שחורות עבות · מספור 01 / 02 / 03 · טלפון בתוך מלבן כחול'],
      ['צילום', 'שחור-לבן בניגודיות גבוהה, על רקע לבן, בתוך פאנל שחור'],
      ['פרטים מזהים', 'קו טורקיז בסגנון מרקר מתחת למשפט המפתח · ספרה "3" ענקית עם "דירות עד גיל 30"'],
    ],
    tone: [
      ['קול', 'דוגרי, בטוח, תכל\'סי. אומר את הדבר בפנים'],
      ['אורך משפט', '3–7 מילים. משפטים קצרים, ניגודים ומספרים'],
      ['פנייה', 'ישירה. "אני" בכותרות סמכות ("אני יודע לאן להגיש")'],
      ['שאלות רטוריות', 'מינימום. אמירות במקום שאלות'],
      ['להימנע', 'יהירות, הבטחות לתוצאה, הפחדה'],
    ],
    expr: [
      ['1 · כריכה', 'אני יודע לאן להגיש כדי לקבל "כן".', 'שיראל פרגר · יועץ פיננסי עצמאי · 052-441-5395'],
      ['2 · משכנתאות ואשראי', 'מינוס קבוע הוא לא גזירת גורל.', '01 תשלום אחד ברור · 02 כמה בנקים מתחרים'],
      ['3 · נדל"ן', 'לא כמה אפשר לקבל. כמה נכון לקחת.', '3 דירות עד גיל 30'],
      ['4 · עסקים (גב)', 'אשראי יקר עוצר צמיחה.', 'מימון לעסק נמדד בעלות הכוללת, לא רק בריבית.'],
      ['5 · כאב', '"לא" מבנק אחד הוא לא סוף הדרך.', 'הבנק מייצג את הבנק. מי מייצג אתכם?'],
      ['6 · שיראל', 'ראיתי מה טעות פיננסית עושה. מאז אני עובד אחרת.', 'ידע מקצועי. שקיפות מלאה. ליווי עד החתימה.'],
      ['7 · בידול', 'הבנק מוכר מוצר. אני בונה תוכנית.', 'מגישים לכל מקום ← מגישים למקום הנכון'],
      ['8 · הנעה לפעולה', 'שיחה אחת. תמונה ברורה.', 'הצעד הראשון מבטיח שלא תישארו במקום.'],
    ],
  },
];

const children = [];
// cover
children.push(
  new Paragraph({ spacing: { before: 2200, after: 200 }, alignment: AlignmentType.CENTER, bidirectional: true, children: [run('MAKE SENSE', { bold: true, size: 56, color: BLUE })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, bidirectional: true, spacing: { after: 160 }, children: [run('העלון המתקפל · 3 גרסאות', { bold: true, size: 36 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, bidirectional: true, spacing: { after: 600 }, children: [run('עקרונות מנחים · שפות גרפיות · טון כתיבה · ביטויים', { size: 26, color: GREY })] }),
  table([['גרסה', 'אופי', 'קובץ'],
    ['A · בנק פרטי', 'שקט מקצועי, עריכתי', 'out-v3/makesense-brochure-print.pdf'],
    ['B · בגובה העיניים', 'חם ואנושי', 'out-vB/makesense-brochure-print.pdf'],
    ['C · חד וישיר', 'סמכותי ודוגרי', 'out-vC/makesense-brochure-print.pdf']], [2600, 3000, 4038], { header: true, firstCol: true }),
  br(),
);

// principles
children.push(h1('1. עקרונות מנחים (משותפים לשלוש הגרסאות)'));
[
  '**תפקיד העלון:** כרטיס ביקור והצגה עצמית. המטרה היא אמון, מקצועיות, ופנייה או הפניה. העלון לא מלמד את כל השירותים.',
  '**מדד הצלחה:** כמה אנשים ירצו לדבר עם שיראל, לא כמה מידע נכנס לעלון.',
  '**מקסימום 5 שורות טקסט בפאנל.** כותרת, משפט ערך, עד 3 מסרים והנעה לפעולה. לוגו, צילום, QR וחתימה הם אלמנטים גרפיים.',
  '**פאנל אחד, קהל אחד, מסר אחד.** משפחות (2), משקיעים (3), עסקים (4), מפנים (5, 8).',
  '**המסע:** בחוץ, השירותים (מה תקבלו). בפנים, הסיפור (כאב ← שיראל ← בידול ← הצעד הבא).',
  '**מסר הבידול:** הבנק מייצג את הבנק. שיראל מייצג את הלקוח, ויודע לאן להגיש כדי לקבל "כן".',
  '**הוכחה:** "קניתי 3 דירות עד גיל 30", B.A ו-M.B.A, חבר בהתאחדות יועצי המשכנתאות, ועדויות אמיתיות (בן, יונתן, חני).',
  '**דאגה למפנים:** "מקרים שאני פוגש כל הזמן", ו"תפנו אותו אליי, ואעדכן אתכם".',
  '**הנעה לפעולה:** "[תוצאה], במרחק שיחה". משפט הסיום "הצעד הראשון מבטיח שלא תישארו במקום" מופיע בכל הגרסאות.',
  '**אחריות:** בלי הבטחות לאישור או לחיסכון. "כל מקרה נבחן לגופו" מופיע בגב. רק MAKE SENSE ושיראל פרגר, בלי שמות של גופים אחרים.',
  '**מותג:** כחול רויאל #004AAD, טורקיז #1EC8C8 כהדגשה בלבד, הלוגו המקורי, והצילום האמיתי של שיראל.',
  '**דפוס:** 8 פאנלים של 160×90 מ"מ (16:9), 4 בכל צד, קיפול אקורדיון, גלישה של 3 מ"מ, שוליים בטוחים של 6 מ"מ לפחות.',
].forEach(t => children.push(bullet(t)));

// comparison
children.push(h1('2. השוואה מהירה'));
children.push(table([
  ['', 'A · בנק פרטי', 'B · בגובה העיניים', 'C · חד וישיר'],
  ['רגש מרכזי', 'ביטחון ושקט', 'חום והקלה', 'סמכות ותכל\'ס'],
  ['כותרות', 'סריף (Frank Ruhl)', 'Rubik עגול', 'Rubik Black'],
  ['צבע דומיננטי', 'נייר חם + כחול', 'לבן + תכלת', 'שחור + כחול'],
  ['צילום', 'דואוטון כחול', 'צבעוני, מסגרת רכה', 'שחור-לבן חד'],
  ['טון', 'מדוד ומאופק', 'אמפתי ומדובר', 'דוגרי וקצר'],
  ['הכי מתאים ל', 'BNI, משקיעים, עסקים', 'משפחות ורוכשים', 'עצמאים ובעלי עסקים'],
  ['סיכון', 'עלול להרגיש מרוחק', 'עלול להרגיש פחות "פרימיום"', 'עלול להרגיש אגרסיבי'],
], [1900, 2580, 2580, 2578], { header: true, firstCol: true }));
children.push(p('**ההמלצה שלנו ל-BNI:** גרסה A כבסיס. אפשר לשלב בה את הכותרת של גרסה C בכריכה, "אני יודע לאן להגיש כדי לקבל כן", ואת הסיפור החם של גרסה B בפאנל 6.', { before: 140 }));

// versions
versions.forEach(v => {
  children.push(br());
  children.push(h1(v.name, v.color));
  children.push(p(`**הרעיון:** ${v.idea}`));
  children.push(p(`**מתאים במיוחד ל:** ${v.fits}`));
  children.push(h2('שפה גרפית'));
  children.push(table(v.graphic, [2200, 7438], { firstCol: true }));
  children.push(h2('טון כתיבה'));
  children.push(table(v.tone, [2200, 7438], { firstCol: true }));
  children.push(h2('ביטויים בעלון'));
  children.push(table([['פאנל', 'כותרת / ביטוי מרכזי', 'ביטוי משלים / הנעה לפעולה'], ...v.expr], [2200, 3900, 3538], { header: true, firstCol: true, headFill: v.color === INK ? '222222' : v.color }));
  children.push(h2('תצוגה מקדימה (צד חיצוני · צד פנימי)'));
  children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [
    img(`${v.out}/preview-sideA.png`, 205, 461), new TextRun({ text: '      ' }), img(`${v.out}/preview-sideB.png`, 205, 461)] }));
  children.push(p(`קובץ לדפוס: brochure/${v.out}/makesense-brochure-print.pdf · קובץ מקור: brochure/${v.file}`, { align: AlignmentType.CENTER, size: 17, color: GREY, before: 80 }));
});

// approvals
children.push(br());
children.push(h1('3. לפני דפוס (בכל גרסה)'));
['אישור מבן, מיונתן ומחני להשתמש בשמם הפרטי ובציטוט.', 'צילום פורטרט מקורי ברזולוציה גבוהה, עם כתפיים שלמות.',
 'סריקת בדיקה של ה-QR (wa.me/972524415395).', 'הגהה מודפסת על נייר מט 170–200 גר\' אחרי המרה ל-CMYK.',
 'בחירת גרסה: A, B או C, או שילוב לפי ההמלצה.'].forEach(t => children.push(bullet(t)));

const doc = new Document({
  creator: 'MAKE SENSE', title: 'MAKE SENSE · העלון המתקפל · 3 גרסאות',
  styles: { default: { document: { run: { font: FONT, size: 21, rightToLeft: true } } } },
  numbering: { config: [{ reference: 'bul', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.START,
    style: { paragraph: { indent: { start: 360, hanging: 260 } }, run: { color: TEAL } } }] }] },
  sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
    footers: { default: new Footer({ children: [new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER,
      children: [run('MAKE SENSE · 3 גרסאות לעלון · עמוד ', { size: 16, color: GREY }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: GREY, font: FONT })] })] }) },
    children }],
});
Packer.toBuffer(doc).then(b => { const o = path.join(D, 'MAKESENSE-brochure-3-versions.docx'); fs.writeFileSync(o, b); console.log('wrote', o); });
