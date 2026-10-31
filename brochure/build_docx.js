// Builds brochure/MAKESENSE-brochure-copy.docx — full copy + design notes (Hebrew, RTL).
// Usage (from repo root): node brochure/build_docx.js
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType,
  AlignmentType, LevelFormat, BorderStyle, PageBreak, Footer, PageNumber, HeadingLevel,
} = require('docx');

const BLUE = '004AAD', DEEP = '002C6B', TEAL = '1EC8C8', INK = '0A0A0A', GREY = '5E6573', SKY = 'EAF2FE', SKY2 = 'F4F8FF';
const FONT = 'Arial';
const W = 9638; // content width (A4, 2cm margins)

// ---------- helpers ----------
const run = (text, o = {}) => new TextRun({
  text, font: FONT, rightToLeft: true,
  bold: o.bold, boldComplexScript: o.bold, italics: o.italic, italicsComplexScript: o.italic,
  size: o.size || 21, sizeComplexScript: o.size || 21, color: o.color || INK,
});
// rich text: "**bold** normal" -> runs
const rich = (text, o = {}) => text.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map(t =>
  t.startsWith('**') ? run(t.slice(2, -2), { ...o, bold: true }) : run(t, o));
const p = (text, o = {}) => new Paragraph({
  bidirectional: true, alignment: o.align || AlignmentType.START,
  spacing: { before: o.before ?? 0, after: o.after ?? 120, line: o.line || 300 },
  children: rich(text, o), keepNext: o.keepNext,
});
const h1 = (text) => new Paragraph({
  bidirectional: true, heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 160 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: TEAL, space: 6 } },
  children: [run(text, { bold: true, size: 34, color: BLUE })], keepNext: true,
});
const h2 = (text, color = DEEP) => new Paragraph({
  bidirectional: true, heading: HeadingLevel.HEADING_2, spacing: { before: 280, after: 120 },
  children: [run(text, { bold: true, size: 27, color })], keepNext: true,
});
const h3 = (text) => new Paragraph({
  bidirectional: true, heading: HeadingLevel.HEADING_3, spacing: { before: 180, after: 80 },
  children: [run(text, { bold: true, size: 23, color: BLUE })], keepNext: true,
});
const bullet = (text, o = {}) => new Paragraph({
  bidirectional: true, numbering: { reference: 'bul', level: 0 },
  spacing: { after: 60, line: 290 }, children: rich(text, o),
});
const pageBreak = () => new Paragraph({ children: [new PageBreak()] });

const border = { style: BorderStyle.SINGLE, size: 4, color: 'C9DCF8' };
const borders = { top: border, bottom: border, left: border, right: border };
// table(rows, widths, {header:true}) — rows: array of arrays of strings (supports **bold**)
function table(rows, widths, o = {}) {
  const total = widths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: total, type: WidthType.DXA }, columnWidths: widths, visuallyRightToLeft: true,
    rows: rows.map((r, ri) => new TableRow({
      tableHeader: o.header && ri === 0, cantSplit: true,
      children: r.map((cell, ci) => {
        const head = o.header && ri === 0;
        const first = o.firstColShade && ci === 0 && !head;
        const lines = String(cell).split('\n');
        return new TableCell({
          width: { size: widths[ci], type: WidthType.DXA }, borders,
          shading: head ? { type: ShadingType.CLEAR, color: 'auto', fill: BLUE } : first ? { type: ShadingType.CLEAR, color: 'auto', fill: SKY } : undefined,
          margins: { top: 70, bottom: 70, left: 110, right: 110 },
          children: lines.map(l => p(l, { after: 30, line: 276, size: o.size || 20, bold: head || first, color: head ? 'FFFFFF' : INK })),
        });
      }),
    })),
  });
}
const gap = () => new Paragraph({ spacing: { after: 80 }, children: [] });

// ---------- content ----------
const panels = [
  {
    no: 1, side: 'חיצוני', name: 'כריכה', bg: 'כחול עמוק (גרדיאנט)', lines: 5,
    goal: 'לעצור את העין, ליצור סקרנות ולמקם את המותג', audience: 'כולם',
    understand: 'שיראל הוא יועץ פיננסי עצמאי לכסף הגדול: בית, אשראי, נדל"ן ועסק', key: 'שליטה',
    copy: [
      ['כותרת (2 שורות)', '**השליטה הכלכלית שלכם**\n**מתחילה כאן**', '22pt · Black · "השליטה הכלכלית שלכם" בטורקיז'],
      ['הגדרת תחומים', 'משכנתאות · אשראי · השקעות נדל"ן · מימון לעסקים', '9.5pt · לבן'],
      ['שם ותפקיד', 'שיראל פרגר · יועץ פיננסי עצמאי', '10pt · Rubik Medium'],
      ['סלוגן', 'לתכנן. לצמוח. להגשים.', '10.5pt · "להגשים" בטורקיז'],
    ],
    visual: [
      'צילום אמיתי של שיראל, בזרועות שלובות, בשליש השמאלי של הפאנל.',
      'לוגו MAKE SENSE לבן וקטן מעל הכותרת.',
      'הרבה אוויר. בלי רשימת שירותים.',
    ],
  },
  {
    no: 2, side: 'חיצוני', name: 'משכנתאות ופתרונות אשראי', bg: 'לבן', lines: 5,
    goal: 'שמשפחה או בעל נכס יזהו את המצוקה החודשית וירצו לבדוק אותה', audience: 'משפחות, זוגות, בעלי נכסים',
    understand: 'אפשר לבנות מחדש את המשכנתה וההלוואות', key: 'מהמינוס לסדר',
    copy: [
      ['כותרת (2 שורות)', '**המשכורת נכנסת. ההלוואות יוצאות.**\n**והמינוס נשאר.**', '21pt · ExtraBold · "והמינוס נשאר" בכחול'],
      ['משפט ערך', 'בונים מחדש את המשכנתה וההלוואות, כך שאפשר לנשום.', '11pt'],
      ['3 מסרים (שורת אייקונים)', 'משכנתה או מחזור · איחוד הלוואות · בדיקה מול כמה גופים', '9.5pt · מתחת לכל אייקון'],
      ['הנעה לפעולה', '**סדר בהלוואות, במרחק שיחה** · 052-441-5395', '10.5pt · טלפון בכחול'],
    ],
    visual: [
      'שלושה אייקוני קו בשורה אחת: בית, חיצים שמתאחדים, שלושה בניינים.',
      'הערת "כל מקרה נבחן לגופו ובכפוף לאישור הגוף המממן" עוברת לפאנל 4, באות זעירה.',
    ],
  },
  {
    no: 3, side: 'חיצוני', name: 'השקעות נדל"ן', bg: 'תכלת בהיר', lines: 5,
    goal: 'למצב את שיראל כמי שמבין את הקשר בין נדל"ן, מימון ותכנון', audience: 'בעלי דירות, משפרי דיור, משקיעים',
    understand: 'בודקים לפני שמתחייבים', key: 'בודקים את המספרים',
    copy: [
      ['כותרת (2 שורות)', '**לפני שקונים, מוכרים או משקיעים,**\n**בודקים את המספרים.**', '18pt · ExtraBold · שורה שנייה בכחול'],
      ['משפט ערך', 'קניתי 3 דירות עד גיל 30. השאלה היא תמיד כמה נכון לקחת.', '11pt'],
      ['עדות (שורה אחת)', '"ידע להנחות אותנו בצורה ברורה לאורך כל התהליך." · בן, נכס להשקעה', '9.4pt · כחול'],
      ['הנעה לפעולה', '**הנכס הבא, במרחק שיחה** · 052-441-5395', '10.5pt'],
    ],
    visual: [
      'אייקון אחד גדול בקו דק, מחשבון ובית, בצד שמאל. אין צורך בעוד אייקונים.',
    ],
  },
  {
    no: 4, side: 'חיצוני (גב העלון המקופל)', name: 'מימון לעסקים', bg: 'כחול עמוק (גרדיאנט)', lines: 5,
    goal: 'לדבר לבעל העסק בשפה עסקית, לא בשפה של הלוואות', audience: 'עצמאים, חברות בע"מ, חברי BNI',
    understand: 'מימון הוא כלי של תוכנית צמיחה', key: 'מימון שלא חונק את התזרים',
    copy: [
      ['כותרת (שורה אחת)', '**העסק מוכן לצמוח. התזרים לא.**', '23pt · Black · "התזרים לא" בטורקיז'],
      ['משפט ערך (2 שורות)', 'מימון נכון משרת את תוכנית הצמיחה,\nולא חונק את התזרים.', '11pt · לבן'],
      ['3 מסרים (שורת אייקונים)', 'בחינת חלופות מימון · החזר לפי התזרים · העלות הכוללת, לא רק הריבית', '9.5pt'],
      ['הנעה לפעולה', '**הצמיחה הבאה, במרחק שיחה** · 052-441-5395', '10.5pt'],
    ],
    visual: [
      'קו גרף אחד דק בטורקיז, שעולה לאורך הפאנל.',
      'לוגו לבן בפינה. זה מה שרואים על השולחן כשהעלון מקופל.',
      'באות זעירה בתחתית: "כל מקרה נבחן לגופו ובכפוף לאישור הגוף המממן."',
    ],
  },
  {
    no: 5, side: 'פנימי', name: 'כאב והזדהות', bg: 'לבן, מרחב גדול', lines: 5,
    goal: 'שהקורא יעצור ויגיד: זה בדיוק המצב שלי', audience: 'כולם, וגם המפנה ששומע את המשפטים האלה',
    understand: 'אתם לבד מול המערכת, ומישהו אחר מייצג את הצד השני', key: 'הבנק מייצג את הבנק. מי מייצג אתכם?',
    copy: [
      ['משפט פתיחה', 'כשזה מגיע לכסף גדול, קל להרגיש לבד מול המערכת.', '12pt'],
      ['3 בועות (שורה אחת)', '"הבנק אמר לא." · "ההחזר רק עולה." · "העסק צריך אוויר."', '10pt · בועות דיבור עדינות'],
      ['כותרת גדולה (2 שורות)', '**הבנק מייצג את הבנק.**\n**מי מייצג אתכם?**', '29pt · Black · "מי מייצג אתכם?" בכחול'],
      ['שורת תגיות (שורה אחת)', '**מקרים שאני פוגש כל הזמן:** זוגות צעירים · משפרי דיור · מסורבי בנקים · עצמאים · בעלי עסקים · משקיעי נדל"ן · בני 55+', '7.6pt · תגיות עדינות במסגרת תכלת'],
    ],
    visual: [
      'הפאנל הכי חשוב בעלון, ולכן אין בו שום דבר אחר.',
      'שלוש בועות דיבור בגדלים מעט שונים, טקסט כחול ומסגרת תכלת דקה.',
      'המשפט המרכזי בתחתית ובמרכז, וסביבו מרחב ריק.',
      'זה המקום היחיד בעלון שבו מופיע "הבנק מייצג את הבנק".',
      'שורת התגיות היא ההוכחה ששיראל הוא מוקד ידע למגוון מקרים, וגם רשימת הטריגרים למפנה. אם היא לא נכנסת בשורה אחת, מוותרים על "בני 55+".',
    ],
  },
  {
    no: 6, side: 'פנימי', name: 'הסיפור של שיראל', bg: 'תכלת עדין', lines: 5,
    goal: 'חיבור אנושי ואמון', audience: 'כולם',
    understand: 'שיראל מכיר את המחיר של טעויות פיננסיות מבפנים', key: 'סיפור, בחירה ושליחות',
    copy: [
      ['כותרת (2 שורות)', '**ראיתי מקרוב מה טעות פיננסית**\n**עושה למשפחה.**', '18pt · ExtraBold'],
      ['משפט משלים', 'למדתי את מה שאף אחד לא לימד אותנו.', '10.5pt'],
      ['נתונים (שורה אחת)', 'B.A כלכלה + M.B.A · חבר בהתאחדות יועצי המשכנתאות', '9pt · אפור'],
      ['עדות לקוח (שורה אחת)', '**"יש לו המון ידע, והמון סבלנות."** · יונתן, הגיע עם מצב מורכב מהסטנדרט', '9.4pt · כחול'],
      ['חתימה (אלמנט גרפי, לא נספר)', 'שיראל', 'כתב יד · כחול · 24pt'],
    ],
    visual: [
      'צילום אמיתי של שיראל בחצי הפאנל, רגוע ומסתכל למצלמה. הטקסט בחצי השני.',
      'בלי ביוגרפיה. עדות לקוח מחליפה את שורת הנתונים: מפנה סומך על לקוח מרוצה יותר משהוא סומך על תואר.',
    ],
  },
  {
    no: 7, side: 'פנימי', name: 'שיטת העבודה והבידול', bg: 'לבן', lines: 5,
    goal: 'להמחיש למה כדאי לעבוד עם יועץ עצמאי ולא להסתפק בהצעה מהבנק', audience: 'מי שמשווה, ומי שכבר קיבל הצעה מהבנק',
    understand: 'הבנק מוכר מוצר, שיראל בונה פתרון', key: 'אני בוחן מה נכון לכם',
    copy: [
      ['כותרת (2 שורות)', '**אני לא מוכר לכם את מה שיש לבנק.**\n**אני בוחן מה נכון לכם.**', '21pt · ExtraBold · השורה השנייה בכחול'],
      ['השוואה · שורה 1', 'בנק אחד  ←  כמה גופים מממנים', '10.5pt'],
      ['השוואה · שורה 2', 'המוצר של הבנק  ←  תוכנית לפי המטרות שלכם', '10.5pt'],
      ['השוואה · שורה 3', 'מגישים לכל מקום  ←  מגישים למקום הנכון', '10.5pt'],
    ],
    visual: [
      'השוואה גרפית בשני טורים: בצד ימין "יועץ בבנק" באפור, ובצד שמאל "MAKE SENSE" בכחול, עם חץ טורקיז דק ביניהם.',
      'רעיון גרפי אחד בלבד. פירמידת הביטחון הכלכלי לא נכנסת לפאנל (ראו החלטות אסטרטגיות).',
    ],
  },
  {
    no: 8, side: 'פנימי', name: 'הנעה לפעולה', bg: 'כחול עמוק (גרדיאנט)', lines: 5,
    goal: 'להפוך את העניין לשיחת היכרות, ולתת למפנה משפט פשוט', audience: 'כולם, ובמיוחד חברי BNI',
    understand: 'לא צריך לדעת מה הפתרון. מספיק להתחיל בשיחה', key: 'הצעד הראשון מבטיח שלא תישארו במקום',
    copy: [
      ['פתיחה (שורה אחת)', 'לא צריך לדעת מה הפתרון. מספיק להתחיל בשיחה.', '11pt · תכלת בהיר'],
      ['פרטי קשר (שורה אחת)', 'שיחת היכרות ללא עלות · **052-441-5395** · sp.makesense@gmail.com', '8.8pt · טלפון 11.5pt Bold'],
      ['הפניה (שורה אחת)', '**מכירים מישהו שתקוע מול הבנק? תפנו אותו אליי, ואעדכן אתכם.**', '8.6pt'],
      ['משפט סיום (2 שורות)', '**הצעד הראשון מבטיח**\n**שלא תישארו במקום.**', '25pt · Black · "שלא תישארו במקום" בטורקיז'],
    ],
    visual: [
      'משפט הסיום הוא הקונספט של הפאנל: הוא בתחתית, ממורכז, הגדול ביותר בפאנל, ומעליו קו טורקיז קצר.',
      'QR גדול (25 מ"מ לפחות) לוואטסאפ על ריבוע לבן, בצד שמאל, בלי כיתוב.',
      'לוגו לבן קטן בפינה.',
    ],
  },
];

const children = [];

// ---------- cover ----------
children.push(
  new Paragraph({ spacing: { before: 2400, after: 200 }, alignment: AlignmentType.CENTER, bidirectional: true, children: [run('MAKE SENSE', { bold: true, size: 56, color: BLUE })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, bidirectional: true, spacing: { after: 160 }, children: [run('ברושור מתקפל · 8 פאנלים', { bold: true, size: 36, color: INK })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, bidirectional: true, spacing: { after: 600 }, children: [run('קופירייטינג מלא והנחיות עיצוביות ומקצועיות', { size: 28, color: GREY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, bidirectional: true, children: [run('שיראל פרגר · יועץ פיננסי עצמאי', { size: 24, color: DEEP })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, bidirectional: true, spacing: { after: 200 }, children: [run('052-441-5395 · sp.makesense@gmail.com', { size: 22, color: GREY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, bidirectional: true, children: [run('לתכנן. לצמוח. להגשים.', { bold: true, size: 26, color: TEAL })] }),
  pageBreak(),
);

// ---------- 1. strategy ----------
children.push(h1('1. מטרה, קהל ומיצוב'));
children.push(h3('מטרת הברושור'));
['לגרום לאדם לזהות את עצמו באחד המסרים.',
 'לעורר תחושה שיש מישהו שמבין את הבעיה שלו.',
 'לבנות אמון בשיראל פרגר כאיש מקצוע עצמאי שמייצג את הלקוח.',
 'לבדל את MAKE SENSE מיועץ בבנק, מתווך או משווק הלוואות.',
 'להביא את הקורא לשיחת היכרות.'].forEach(t => children.push(bullet(t)));
children.push(p('**מדד ההצלחה:** כמה אנשים ירצו לדבר עם שיראל אחרי הקריאה, לא כמה מידע נכנס לעלון.', { before: 80 }));
children.push(h3('קהלי יעד: כל פאנל מדבר לקהל אחד'));
children.push(table([
  ['קהל', 'הכאב', 'הפאנל שלו'],
  ['משפחות, זוגות ובעלי נכסים', 'מינוס, הלוואות, משכנתה לא מותאמת', '2, 5'],
  ['בעלי דירות ומשקיעי נדל"ן', 'פחד לקחת יותר מדי, תזמון ומימון', '3'],
  ['עצמאים ובעלי עסקים', 'תזרים חנוק, אשראי יקר', '4'],
  ['מפנים (BNI, לקוחות מרוצים)', '"את מי להפנות?"', '5, 8'],
], [3600, 3838, 2200], { header: true }));
children.push(h3('המיצוב'));
children.push(p('**המסר המרכזי:** הבנק מייצג את הבנק. אני מייצג אתכם.'));
children.push(p('שיראל לא מוכר הלוואות ולא רק משווה ריביות. הערך שלו:'));
['ראייה פיננסית רחבה.', 'בחינה של כמה חלופות וגופים מממנים.', 'פתרון שמתאים למצב ולמטרות של הלקוח.',
 'ליווי אישי מול הגופים המממנים.', 'שקיפות, סדר והבנה של המשמעות לטווח הארוך.',
 'ידע: יודע לאן להגיש כדי לקבל "כן", ולאן לא להגיש כדי לא לקבל "לא". חוסך זמן, כסף ואנרגיה.'].forEach(t => children.push(bullet(t)));
children.push(p('**טון:** מקצועי, בגובה העיניים, בטוח, לא מתנשא. בלי הבטחות מוגזמות, הפחדות או שפה מכירתית אגרסיבית.', { before: 80 }));

// ---------- 2. format ----------
children.push(h1('2. פורמט ודפוס'));
children.push(table([
  ['פרמטר', 'מפרט'],
  ['פאנל', '160×90 מ"מ, 16:9 לרוחב'],
  ['גיליון', '4 פאנלים זה מתחת לזה בכל צד: 160×360 מ"מ, דו-צדדי'],
  ['קיפול', 'אקורדיון, 3 קווים אופקיים. העלון המקופל הוא כרטיס בגודל 160×90 מ"מ'],
  ['מקופל', 'פאנל 1 בחזית, פאנל 4 בגב'],
  ['גלישה (bleed)', '3 מ"מ מכל צד, כך שקובץ העבודה הוא 166×366 מ"מ'],
  ['שוליים בטוחים', '6 מ"מ מכל קצה ומכל קו קיפול. אין טקסט שחוצה קו קיפול'],
  ['צבע ותמונות', 'CMYK, תמונות ב-300dpi לפחות'],
  ['נייר מומלץ', 'כרומו מט 170–200 גר\', אפשר עם למינציה מט'],
  ['פלט', 'PDF לדפוס עם סימני חיתוך וקיפול'],
  ['קובץ מקור', 'brochure/brochure.html (HTML/CSS במידות מדויקות), PDF מופק עם node brochure/render.js'],
], [2600, 7038], { header: true, firstColShade: true }));

// ---------- 3. structure ----------
children.push(h1('3. מבנה הסיפור'));
children.push(p('**הצד החיצוני** שיווקי, חד וממוקד שירותים. **הצד הפנימי** סיפורי, רגשי ואישי.'));
children.push(table([
  ['שורה', 'פנימי: המסע (למה לבחור בי)', 'חיצוני: השירותים (מה תקבלו)'],
  ['1', 'פאנל 5 · כאב והזדהות', 'פאנל 1 · כריכה'],
  ['2', 'פאנל 6 · הסיפור של שיראל', 'פאנל 2 · משכנתאות ואשראי'],
  ['3', 'פאנל 7 · שיטה ובידול', 'פאנל 3 · השקעות נדל"ן'],
  ['4', 'פאנל 8 · הנעה לפעולה', 'פאנל 4 · מימון לעסקים (גב)'],
], [1000, 4319, 4319], { header: true, firstColShade: true }));
children.push(p('**רצף הבידול בצד הפנימי:**', { before: 120, after: 60 }));
['פאנל 5 שואל: "מי מייצג אתכם?"', 'פאנל 6 עונה: "אני, ולמה".', 'פאנל 7 מראה: "במה זה שונה".',
 'פאנל 8 מזמין: "מספיק להתחיל בשיחה".'].forEach(t => children.push(bullet(t)));

// ---------- 4. copy rules ----------
children.push(h1('4. כללי קופירייטינג'));
children.push(h3('הכלל החשוב ביותר: מקסימום 5 שורות טקסט בכל פאנל'));
['כל שורה גלויה בעיצוב הסופי נספרת: כותרת, משפט, כיתוב, פרטי קשר והנעה לפעולה.',
 'כותרת שנשברת לשתי שורות נספרת 2.',
 'שורת אייקונים עם 3 תוויות קצרות זו לצד זו נספרת 1.',
 'לוגו, תמונה, QR וחתימה גרפית אינם טקסט, ולכן לא נספרים.',
 'לא מקטינים פונטים כדי להכניס עוד תוכן.'].forEach(t => children.push(bullet(t)));
children.push(h3('עקרונות'));
['שפה טבעית, מדוברת, ישראלית ובגובה העיניים. משפטים של 4–10 מילים.',
 'כותרות שמדברות על תוצאה או על כאב, לא על שם השירות.',
 'בלי מילים שחוקות כמו "פתרונות מתקדמים", "מעטפת פיננסית" או "ללא פשרות".',
 'אף רעיון לא חוזר בשני פאנלים. "הבנק מייצג את הבנק" מופיע רק בפאנל 5.',
 'שאלה רטורית אחת בלבד בכל העלון: "מי מייצג אתכם?".',
 'לא מבטיחים חיסכון או אישור מימון. "יודע לאן להגיש", ולא "מבטיח כן".',
 'לא ממציאים נתונים, ניסיון או הישגים.',
 'ההבדל בין משכנתאות, השקעות נדל"ן ומימון לעסקים נשמר.',
 'מוטיב קבוע בהנעה לפעולה: "[תוצאה], במרחק שיחה".',
 'כל משפט צריך להצדיק את המקום שהוא תופס.'].forEach(t => children.push(bullet(t)));

// ---------- 5. design ----------
children.push(h1('5. הנחיות עיצוב'));
children.push(p('**סגנון:** Premium Editorial / Private Banking, לפי מערכת העיצוב "בניין" (Bauhaus): שטוח, בלי גרדיאנטים ובלי צללים, צבע הדגשה אחד (טורקיז) שמשמש רק להנעה לפעולה ולמילת מפתח אחת, פינות ישרות, ומספרי טלפון ומיילים מבודדים בכיוון LTR.'));
children.push(h3('צבעים'));
children.push(table([
  ['תפקיד', 'צבע', 'HEX'],
  ['מותג ראשי', 'כחול רויאל', '#004AAD'],
  ['רקע כהה', 'כחול רויאל שטוח / כחול עמוק שטוח', '#004AAD / #002C6B'],
  ['טקסט על רקע בהיר', 'שחור', '#0A0A0A'],
  ['הדגשה קטנה', 'טורקיז', '#1EC8C8'],
  ['רקע בהיר', 'לבן / תכלת', '#FFFFFF / #F4F8FF'],
], [2800, 2600, 4238], { header: true, firstColShade: true }));
children.push(p('**חלוקה:** 60% לבן ותכלת, 30% כחול, 10% טורקיז. טורקיז רק למילה אחת בכותרת, לקו דק ולנקודה באייקון. לא לגופי טקסט על רקע לבן.', { before: 100 }));
children.push(h3('טיפוגרפיה'));
children.push(table([
  ['שימוש', 'גופן', 'גודל'],
  ['כותרת ראשית', 'Frank Ruhl Libre Bold (סריף עברי), ריווח אותיות 0, גובה שורה 1.15 לפחות', '18–28pt (לפי אורך הכותרת)'],
  ['משפט ערך', 'Heebo Regular', '10.5–12pt'],
  ['מסרים, עדויות, תגיות', 'Heebo Medium / Rubik Medium', '7.6–10.5pt'],
  ['הנעה לפעולה', 'Rubik Medium', '10.5pt, טלפון Bold בכחול'],
  ['טקסט זעיר', 'Heebo Regular', '7pt לפחות'],
  ['חתימה "שיראל"', 'גופן כתב יד עברי', '20pt'],
], [2800, 4638, 2200], { header: true, firstColShade: true }));
children.push(h3('עושים'));
['הרבה מרחב לבן: לפחות 40% שטח ריק בכל פאנל.',
 'כותרות גדולות מאוד, ומסר מרכזי ממורכז.',
 'אייקוני קו עקביים (1.5pt), בכחול עם נקודה בטורקיז. עד 3 בפאנל.',
 'רק הצילום האמיתי של שיראל, ורק הלוגו המקורי של MAKE SENSE.',
 'קו טורקיז דק (12×0.7 מ"מ) מעל המשפט המרכזי, כפרט חוזר.',
 'אחידות בין שני הצדדים, עם אופי שונה לכל צד.'].forEach(t => children.push(bullet(t)));
children.push(h3('לא עושים'));
['תלת-ממד, מטבעות, חזירי חיסכון, תמונות סטוק ולחיצות ידיים.',
 'פאנל שנראה כמו אוסף של כרטיסיות.',
 'גרדיאנטים, צללים ופינות מעוגלות (מקסימום 0.6 מ"מ).',
 'לוגואים של בנקים או של כרטיסי אשראי.',
 'רשימות שירותים ארוכות.'].forEach(t => children.push(bullet(t)));

// ---------- 6. panels ----------
children.push(pageBreak());
children.push(h1('6. התוכן הסופי, פאנל אחר פאנל'));
panels.forEach((pn, i) => {
  if (i === 4) children.push(pageBreak());
  children.push(h2(`פאנל ${pn.no} · ${pn.name}`));
  children.push(table([
    ['צד', pn.side], ['מטרה', pn.goal], ['קהל יעד', pn.audience],
    ['מה הקורא צריך להבין', pn.understand], ['המסר החשוב ביותר', pn.key],
    ['רקע', pn.bg], ['שורות טקסט', `${pn.lines} מתוך 5`],
  ], [2600, 7038], { firstColShade: true }));
  children.push(p('**הקופי:**', { before: 140, after: 60, keepNext: true }));
  children.push(table([['תפקיד', 'טקסט', 'גודל / הדגשה'], ...pn.copy], [2200, 4838, 2600], { header: true, firstColShade: true }));
  children.push(p('**הנחיות למעצב:**', { before: 140, after: 60, keepNext: true }));
  pn.visual.forEach(t => children.push(bullet(t)));
});

// ---------- 7. decisions ----------
children.push(pageBreak());
children.push(h1('7. החלטות אסטרטגיות'));
[
  '**"הבנק מייצג את הבנק" מופיע פעם אחת בלבד, בגדול, בפאנל 5.** בפאנל 7 הרעיון ממשיך בניסוח אחר: "אני לא מוכר לכם את מה שיש לבנק. אני בוחן מה נכון לכם."',
  '**פירמידת הביטחון הכלכלי יוצאת מהעלון. ההמלצה: להשתמש בה בפגישה, ככלי אבחון.** היא מדברת על כלכלת המשפחה, מחלישה את המיצוב כמומחה לאשראי, נדל"ן ומימון לעסקים, ומתחרה בהשוואה לבנק. אם תוחלט להשאיר אותה, היא תחליף את ההשוואה בפאנל 7.',
  '**"אני יודע לאן להגיש" נכנס להשוואה בפאנל 7,** כ"מגישים לכל מקום, מול מגישים למקום הנכון". שם המסר מוכח ולא רק נאמר.',
  '**"קניתי 3 דירות עד גיל 30" נמצא בפאנל 3,** ושם הוא משמש הוכחה מוחשית.',
  '**"במרחק שיחה" הוא מוטיב** בפאנלים 2, 3 ו-4, וכל פעם הוא מופיע עם תוצאה אחרת ובלי הבטחה.',
  '**משפט הסיום של העלון:** "הצעד הראשון מבטיח שלא תישארו במקום." הוא הקונספט של פאנל 8, ולא שורה נוספת.',
].forEach(t => children.push(bullet(t)));

// ---------- 8. self-critique ----------
children.push(h1('8. ביקורת עצמית'));
children.push(table([
  ['שאלה', 'תשובה'],
  ['כפילויות?', 'אין. "במרחק שיחה" חוזר בכוונה, כמוטיב. אם הוא ירגיש כמו טיק, אפשר להשאיר אותו רק בגב (פאנל 4).'],
  ['יותר מדי מסרים?', 'בכל פאנל שירות יש 3 מסרים לכל היותר. בפאנל 3 שורת המסרים הוסרה, ובמקומה נכנסה עדות של לקוח.'],
  ['הבידול ברור?', 'כן. הוא נבנה ברצף של פאנלים 5 ← 6 ← 7. החולשה: אין עדות לקוח.'],
  ['יש סיבה ליצור קשר?', 'כן: שיחה ללא עלות, ובלי צורך לדעת מראש מה הפתרון. למפנה יש משפט אחד ברור.'],
  ['אפשר להסיר עוד?', 'פאנל 4: אפשר לקצר את משפט הערך לשורה אחת.'],
], [2600, 7038], { header: true, firstColShade: true }));

// ---------- 8b. BNI view ----------
children.push(h1('9. מבט של חבר BNI'));
children.push(p('**הרושם:** טוב. "הבנק מייצג את הבנק. מי מייצג אתכם?" נשאר בראש, הסיפור אמין, והעיצוב נקי. ברור ששיראל יועץ עצמאי.'));
children.push(table([
  ['פער', 'התיקון', 'פאנל'],
  ['מה קורה עם מי שאני מפנה? (המוניטין של המפנה)', '"תכירו לו אותי, ואעדכן אתכם."', '8'],
  ['טריגר הפניה כללי מדי', '"מכירים מישהו שתקוע מול הבנק? תפנו אותו אליי."', '8'],
  ['חסרה תחושה של מוקד ידע למגוון מקרים', 'שורת התגיות "מקרים שאני פוגש כל הזמן", עם 7 סוגי אנשים', '5'],
  ['חסרה הוכחה חברתית', 'עדויות אמיתיות של יונתן ובן (צריך אישור שם)', '3, 6'],
], [3600, 4838, 1200], { header: true }));

// ---------- 9. approvals ----------
children.push(h1('10. לאשר לפני עיצוב ודפוס'));
['אישור מיונתן ומבן להשתמש בשם הפרטי ובציטוט.', 'הוצאת הפירמידה מהעלון.', 'הכיתוב "יועץ פיננסי עצמאי" מתחת לשם.',
 '"במרחק שיחה" בשלושה פאנלים, או בגב בלבד.', 
 'קישור ה-QR: wa.me/972524415395, עם הודעה כתובה מראש.', 'צילום של שיראל ברזולוציה גבוהה (300dpi בגודל ההדפסה).',
].forEach(t => children.push(bullet(t)));


// ---------- 11. JSON spec ----------
const spec = {
  project: 'MAKE SENSE brochure',
  advisor: { name: 'שיראל פרגר', title: 'יועץ פיננסי עצמאי', phone: '052-441-5395', email: 'sp.makesense@gmail.com', whatsapp_qr: 'https://wa.me/972524415395' },
  format: { panel_mm: [160, 90], aspect: '16:9', panels_per_side: 4, sheet_mm: [160, 360], fold: 'accordion, 3 horizontal folds', bleed_mm: 3, safe_margin_mm: 6, direction: 'rtl', language: 'he', folded: { front: 'panel_1', back: 'panel_4' } },
  style: {
    mood: 'Premium Editorial / Private Banking',
    colors: { primary: '#004AAD', dark: ['#004AAD', '#002C6B'], gradients: 'none (flat, Bauhaus system)', text: '#0A0A0A', accent: '#1EC8C8', light: ['#FFFFFF', '#F4F8FF'], ratio: '60% light / 30% blue / 10% turquoise' },
    fonts: { headline: 'Frank Ruhl Libre Bold', body: 'Heebo', signature: 'Hebrew handwriting' },
    rules: ['max 5 visible text lines per panel', '40%+ white space', 'thin line icons (1.5pt) blue + turquoise dot, max 3 per panel', 'real photo of Shirel only', 'original MAKE SENSE logo only', 'thin turquoise rule (12x0.7mm) as recurring detail'],
    avoid: ['3D', 'coins', 'piggy banks', 'stock photos', 'handshakes', 'bank or card logos', 'card grids', 'long service lists'],
  },
  sides: [
    {
      side: 'outside', character: 'marketing, sharp, service-focused', order: 'top_to_bottom',
      panels: [
        { id: 'panel_1', role: 'cover', background: '#004AAD', layout: 'text right two-thirds, photo left third',
          text: [
            { role: 'headline', lines: 2, size_pt: 22, weight: 'black', color: '#FFFFFF', highlight: { phrase: 'השליטה הכלכלית שלכם', color: '#1EC8C8' }, value: 'השליטה הכלכלית שלכם מתחילה כאן' },
            { role: 'fields', size_pt: 9.5, value: 'משכנתאות · אשראי · השקעות נדל"ן · מימון לעסקים' },
            { role: 'name', size_pt: 10, value: 'שיראל פרגר · יועץ פיננסי עצמאי' },
            { role: 'slogan', size_pt: 10.5, highlight: { word: 'להגשים', color: '#1EC8C8' }, value: 'לתכנן. לצמוח. להגשים.' } ],
          visuals: ['MAKE SENSE logo, white, small, above headline', 'real photo of Shirel, arms crossed, left third'] },
        { id: 'panel_2', role: 'service: mortgages & credit', audience: 'families, couples, property owners', background: '#FFFFFF',
          text: [
            { role: 'headline', lines: 2, size_pt: 21, highlight: { phrase: 'והמינוס נשאר.', color: '#004AAD' }, value: 'המשכורת נכנסת. ההלוואות יוצאות. והמינוס נשאר.' },
            { role: 'value', size_pt: 11, value: 'בונים מחדש את המשכנתה וההלוואות, כך שאפשר לנשום.' },
            { role: 'icon_row', size_pt: 9.5, items: ['משכנתה או מחזור', 'איחוד הלוואות', 'בדיקה מול כמה גופים'], icons: ['house', 'merging arrows', 'three buildings'] },
            { role: 'cta', size_pt: 11, value: 'סדר בהלוואות, במרחק שיחה · 052-441-5395' } ] },
        { id: 'panel_3', role: 'service: real-estate investment', audience: 'owners, upgraders, investors', background: '#F4F8FF',
          text: [
            { role: 'headline', lines: 2, size_pt: 18, highlight: { phrase: 'בודקים את המספרים.', color: '#004AAD' }, value: 'לפני שקונים, מוכרים או משקיעים, בודקים את המספרים.' },
            { role: 'value', size_pt: 11, value: 'קניתי 3 דירות עד גיל 30. השאלה היא תמיד כמה נכון לקחת.' },
            { role: 'testimonial', size_pt: 9.4, value: 'ידע להנחות אותנו בצורה ברורה לאורך כל התהליך.', by: 'בן, נכס להשקעה' },
            { role: 'cta', size_pt: 11, value: 'הנכס הבא, במרחק שיחה · 052-441-5395' } ],
          visuals: ['one large thin-line icon: calculator + house, left side'] },
        { id: 'panel_4', role: 'service: business financing (back cover when folded)', audience: 'self-employed, companies, BNI members', background: '#004AAD',
          text: [
            { role: 'headline', lines: 1, size_pt: 23, weight: 'black', color: '#FFFFFF', highlight: { word: 'התזרים לא', color: '#1EC8C8' }, value: 'העסק מוכן לצמוח. התזרים לא.' },
            { role: 'value', lines: 2, size_pt: 11, value: 'מימון נכון משרת את תוכנית הצמיחה, ולא חונק את התזרים.' },
            { role: 'icon_row', size_pt: 9.5, items: ['בחינת חלופות מימון', 'החזר לפי התזרים', 'העלות הכוללת, לא רק הריבית'] },
            { role: 'cta', size_pt: 11, value: 'הצמיחה הבאה, במרחק שיחה · 052-441-5395' } ],
          visuals: ['single thin turquoise rising line across panel', 'white logo in corner'],
          fine_print: 'כל מקרה נבחן לגופו ובכפוף לאישור הגוף המממן.' },
      ],
    },
    {
      side: 'inside', character: 'story, emotional, personal', order: 'top_to_bottom',
      panels: [
        { id: 'panel_5', role: 'pain & identification', background: '#FFFFFF', priority: 'most important panel',
          text: [
            { role: 'opening', size_pt: 12, value: 'כשזה מגיע לכסף גדול, קל להרגיש לבד מול המערכת.' },
            { role: 'speech_bubbles', size_pt: 10, items: ['הבנק אמר לא.', 'ההחזר רק עולה.', 'העסק צריך אוויר.'] },
            { role: 'headline', lines: 2, size_pt: 29, weight: 'black', highlight: { phrase: 'מי מייצג אתכם?', color: '#004AAD' }, value: 'הבנק מייצג את הבנק. מי מייצג אתכם?' },
            { role: 'tags', size_pt: 7.6, label: 'מקרים שאני פוגש כל הזמן:', items: ['זוגות צעירים', 'משפרי דיור', 'מסורבי בנקים', 'עצמאים', 'בעלי עסקים', 'משקיעי נדל"ן', 'בני 55+'], drop_if_overflow: 'בני 55+' } ] },
        { id: 'panel_6', role: 'Shirel story', background: '#F4F8FF', layout: 'photo half, text half',
          text: [
            { role: 'headline', lines: 2, size_pt: 18, value: 'ראיתי מקרוב מה טעות פיננסית עושה למשפחה.' },
            { role: 'value', size_pt: 10.5, value: 'למדתי את מה שאף אחד לא לימד אותנו.' },
            { role: 'credentials', size_pt: 9, value: 'B.A כלכלה + M.B.A · חבר בהתאחדות יועצי המשכנתאות' },
            { role: 'testimonial', size_pt: 9.4, value: 'יש לו המון ידע, והמון סבלנות.', by: 'יונתן, הגיע עם מצב מורכב מהסטנדרט' },
            { role: 'signature', style: 'handwriting', color: '#004AAD', value: 'שיראל' } ],
          visuals: ['real photo of Shirel looking at camera'] },
        { id: 'panel_7', role: 'method & differentiation', background: '#FFFFFF',
          text: [
            { role: 'headline', lines: 2, size_pt: 21, highlight: { phrase: 'אני בוחן מה נכון לכם.', color: '#004AAD' }, value: 'אני לא מוכר לכם את מה שיש לבנק. אני בוחן מה נכון לכם.' },
            { role: 'comparison', size_pt: 10.5, columns: ['יועץ בבנק', 'MAKE SENSE'], rows: [['בנק אחד', 'כמה גופים מממנים'], ['המוצר של הבנק', 'תוכנית לפי המטרות שלכם'], ['מגישים לכל מקום', 'מגישים למקום הנכון']] } ],
          visuals: ['two-column comparison: bank in grey, MAKE SENSE in blue, thin turquoise arrows', 'one graphic idea only, no pyramid'] },
        { id: 'panel_8', role: 'call to action', background: '#004AAD',
          text: [
            { role: 'opening', size_pt: 11, color: '#DCE8FA', value: 'לא צריך לדעת מה הפתרון. מספיק להתחיל בשיחה.' },
            { role: 'contact', size_pt: 8.8, phone_size_pt: 11.5, value: 'שיחת היכרות ללא עלות · 052-441-5395 · sp.makesense@gmail.com' },
            { role: 'referral', size_pt: 8.6, value: 'מכירים מישהו שתקוע מול הבנק? תפנו אותו אליי, ואעדכן אתכם.' },
            { role: 'closing_headline', lines: 2, size_pt: 25, weight: 'black', highlight: { phrase: 'שלא תישארו במקום', color: '#1EC8C8' }, value: 'הצעד הראשון מבטיח שלא תישארו במקום.' } ],
          visuals: ['large WhatsApp QR (min 25mm) on white rounded square, left, no caption', 'short turquoise rule above closing headline', 'small white logo'] },
      ],
    },
  ],
};
fs.writeFileSync(path.join(__dirname, 'brochure-spec.json'), JSON.stringify(spec, null, 2));
children.push(pageBreak());
children.push(h1('11. מפרט JSON: שני צדי הברושור (דוגמה)'));
children.push(p('מפרט מובנה של שני הצדדים, לשימוש בכלי עיצוב, בכלי AI או בקוד. הקובץ נשמר גם בנפרד: brochure-spec.json.'));
JSON.stringify(spec, null, 2).split('\n').forEach(line => children.push(new Paragraph({
  bidirectional: false, alignment: AlignmentType.LEFT, spacing: { after: 0, line: 230 },
  shading: { type: ShadingType.CLEAR, color: 'auto', fill: 'F4F6FA' },
  children: [new TextRun({ text: line.replace(/^ +/, m => ' '.repeat(m.length)), font: 'Consolas', size: 15, color: '1F2937' })],
})));

// ---------- document ----------
const doc = new Document({
  creator: 'MAKE SENSE', title: 'ברושור MAKE SENSE: קופירייטינג והנחיות עיצוב',
  styles: { default: { document: { run: { font: FONT, size: 21, rightToLeft: true } } } },
  numbering: { config: [{ reference: 'bul', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.START,
    style: { paragraph: { indent: { start: 360, hanging: 260 } }, run: { color: TEAL } } }] }] },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
    footers: { default: new Footer({ children: [new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER,
      children: [run('MAKE SENSE · ברושור מתקפל · עמוד ', { size: 16, color: GREY }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: GREY, font: FONT })] })] }) },
    children,
  }],
});
Packer.toBuffer(doc).then(buf => {
  const out = path.join(__dirname, 'MAKESENSE-brochure-copy.docx');
  fs.writeFileSync(out, buf);
  console.log('wrote', out);
});
