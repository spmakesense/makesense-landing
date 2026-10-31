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
      ['כותרת (2 שורות)', '**השליטה הכלכלית שלכם**\n**מתחילה כאן**', '26–30pt · Black · "השליטה" בטורקיז'],
      ['הגדרת תחומים', 'משכנתאות · אשראי · השקעות נדל"ן · מימון לעסקים', '10pt · לבן'],
      ['שם ותפקיד', 'שיראל פרגר · יועץ פיננסי עצמאי', '10pt · Medium'],
      ['סלוגן', 'לתכנן. לצמוח. להגשים.', '11pt · "להגשים" בטורקיז'],
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
      ['כותרת (2 שורות)', '**המשכורת נכנסת. ההלוואות יוצאות.**\n**והמינוס נשאר.**', '22–24pt · Bold · שחור'],
      ['משפט ערך', 'בונים מחדש את המשכנתה וההלוואות, כך שאפשר לנשום.', '11pt'],
      ['3 מסרים (שורת אייקונים)', 'משכנתה או מחזור · איחוד הלוואות · בדיקה מול כמה גופים', '9.5pt · מתחת לכל אייקון'],
      ['הנעה לפעולה', '**סדר בהלוואות, במרחק שיחה** · 052-441-5395', '11pt · טלפון בכחול'],
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
      ['כותרת (2 שורות)', '**לפני שקונים, מוכרים או משקיעים,**\n**בודקים את המספרים.**', '22–24pt · Bold'],
      ['משפט ערך', 'אני משקיע נדל"ן בעצמי. השאלה היא כמה נכון לקחת.', '11pt'],
      ['3 מסרים (שורת אייקונים)', 'בדיקת כדאיות · הון עצמי מנכס קיים · תכנון המימון', '9.5pt · אפשר להסיר (ראו ביקורת)'],
      ['הנעה לפעולה', '**הנכס הבא, במרחק שיחה** · 052-441-5395', '11pt'],
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
      ['כותרת (שורה אחת)', '**העסק מוכן לצמוח. התזרים לא.**', '24pt · Black · "התזרים לא" בטורקיז'],
      ['משפט ערך (2 שורות)', 'מימון נכון משרת את תוכנית הצמיחה,\nולא חונק את התזרים.', '11pt · לבן'],
      ['3 מסרים (שורת אייקונים)', 'בחינת חלופות מימון · החזר לפי התזרים · העלות הכוללת, לא רק הריבית', '9.5pt'],
      ['הנעה לפעולה', '**הצמיחה הבאה, במרחק שיחה** · 052-441-5395', '11pt'],
    ],
    visual: [
      'קו גרף אחד דק בטורקיז, שעולה לאורך הפאנל.',
      'לוגו לבן בפינה. זה מה שרואים על השולחן כשהעלון מקופל.',
      'באות זעירה בתחתית: "כל מקרה נבחן לגופו ובכפוף לאישור הגוף המממן."',
    ],
  },
  {
    no: 5, side: 'פנימי', name: 'כאב והזדהות', bg: 'לבן, מרחב גדול', lines: 4,
    goal: 'שהקורא יעצור ויגיד: זה בדיוק המצב שלי', audience: 'כולם, וגם המפנה ששומע את המשפטים האלה',
    understand: 'אתם לבד מול המערכת, ומישהו אחר מייצג את הצד השני', key: 'הבנק מייצג את הבנק. מי מייצג אתכם?',
    copy: [
      ['משפט פתיחה', 'כשזה מגיע לכסף גדול, קל להרגיש לבד מול המערכת.', '12pt'],
      ['3 בועות (שורה אחת)', '"הבנק אמר לא." · "ההחזר רק עולה." · "העסק צריך אוויר."', '10pt · בועות דיבור עדינות'],
      ['כותרת גדולה (2 שורות)', '**הבנק מייצג את הבנק.**\n**מי מייצג אתכם?**', '30pt · Black · "מי מייצג אתכם?" בכחול'],
    ],
    visual: [
      'הפאנל הכי חשוב בעלון, ולכן אין בו שום דבר אחר.',
      'שלוש בועות דיבור בגדלים מעט שונים, טקסט כחול ומסגרת תכלת דקה.',
      'המשפט המרכזי בתחתית ובמרכז, וסביבו מרחב ריק.',
      'זה המקום היחיד בעלון שבו מופיע "הבנק מייצג את הבנק".',
    ],
  },
  {
    no: 6, side: 'פנימי', name: 'הסיפור של שיראל', bg: 'תכלת עדין', lines: 5,
    goal: 'חיבור אנושי ואמון', audience: 'כולם',
    understand: 'שיראל מכיר את המחיר של טעויות פיננסיות מבפנים', key: 'סיפור, בחירה ושליחות',
    copy: [
      ['כותרת (2 שורות)', '**ראיתי מקרוב מה טעות פיננסית**\n**עושה למשפחה.**', '22–24pt · Bold'],
      ['משפט משלים', 'אז בחרתי ללמוד, להתמקצע, ולעמוד לצד מי שצריך.', '11pt'],
      ['2 נתונים (שורה אחת)', 'B.A כלכלה + M.B.A · חבר בהתאחדות יועצי המשכנתאות', '9.5pt · נקודות טורקיז'],
      ['חתימה', 'שיראל', 'כתב יד · כחול · 20pt'],
    ],
    visual: [
      'צילום אמיתי של שיראל בחצי הפאנל, רגוע ומסתכל למצלמה. הטקסט בחצי השני.',
      'בלי ביוגרפיה. אם יש עדות לקוח אמיתית, היא תחליף את שורת הנתונים.',
    ],
  },
  {
    no: 7, side: 'פנימי', name: 'שיטת העבודה והבידול', bg: 'לבן', lines: 5,
    goal: 'להמחיש למה כדאי לעבוד עם יועץ עצמאי ולא להסתפק בהצעה מהבנק', audience: 'מי שמשווה, ומי שכבר קיבל הצעה מהבנק',
    understand: 'הבנק מוכר מוצר, שיראל בונה פתרון', key: 'אני בוחן מה נכון לכם',
    copy: [
      ['כותרת (2 שורות)', '**אני לא מוכר לכם את מה שיש לבנק.**\n**אני בוחן מה נכון לכם.**', '22–24pt · Bold · השורה השנייה בכחול'],
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
      ['פתיחה (שורה אחת)', 'לא צריך לדעת מה הפתרון. מספיק להתחיל בשיחה.', '12pt · לבן'],
      ['פרטי קשר (שורה אחת)', 'שיחת היכרות ללא עלות · **052-441-5395** · sp.makesense@gmail.com', '11pt · טלפון 14pt'],
      ['הפניה (שורה אחת)', 'מכירים מישהו שזה בדיוק המצב שלו? תכירו לו אותי.', '9.5pt'],
      ['משפט סיום (2 שורות)', '**הצעד הראשון מבטיח**\n**שלא תישארו במקום.**', '28pt · Black · "שלא תישארו במקום" בטורקיז'],
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
children.push(p('**סגנון:** Premium Editorial / Private Banking.'));
children.push(h3('צבעים'));
children.push(table([
  ['תפקיד', 'צבע', 'HEX'],
  ['מותג ראשי', 'כחול רויאל', '#004AAD'],
  ['רקע כהה', 'גרדיאנט כחול', '#1F8BF0 → #004AAD → #002C6B'],
  ['טקסט על רקע בהיר', 'שחור', '#0A0A0A'],
  ['הדגשה קטנה', 'טורקיז', '#1EC8C8'],
  ['רקע בהיר', 'לבן / תכלת', '#FFFFFF / #F4F8FF'],
], [2800, 2600, 4238], { header: true, firstColShade: true }));
children.push(p('**חלוקה:** 60% לבן ותכלת, 30% כחול, 10% טורקיז. טורקיז רק למילה אחת בכותרת, לקו דק ולנקודה באייקון. לא לגופי טקסט על רקע לבן.', { before: 100 }));
children.push(h3('טיפוגרפיה'));
children.push(table([
  ['שימוש', 'גופן', 'גודל'],
  ['כותרת ראשית', 'Rubik Bold/Black, או גופן עברי גאומטרי מקביל', '22–30pt'],
  ['משפט ערך', 'Heebo Regular/Medium', '11–12pt'],
  ['מסרים קצרים', 'Heebo Medium', '9.5–10.5pt'],
  ['הנעה לפעולה', 'Rubik Medium', '11pt, טלפון 14pt'],
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
 'יותר מגרדיאנט אחד בפאנל, וגרדיאנט על טקסט.',
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
  '**"אני משקיע נדל"ן בעצמי" עובר לפאנל 3,** ושם הוא משמש הוכחה.',
  '**"במרחק שיחה" הוא מוטיב** בפאנלים 2, 3 ו-4, וכל פעם הוא מופיע עם תוצאה אחרת ובלי הבטחה.',
  '**משפט הסיום של העלון:** "הצעד הראשון מבטיח שלא תישארו במקום." הוא הקונספט של פאנל 8, ולא שורה נוספת.',
].forEach(t => children.push(bullet(t)));

// ---------- 8. self-critique ----------
children.push(h1('8. ביקורת עצמית'));
children.push(table([
  ['שאלה', 'תשובה'],
  ['כפילויות?', 'אין. "במרחק שיחה" חוזר בכוונה, כמוטיב. אם הוא ירגיש כמו טיק, אפשר להשאיר אותו רק בגב (פאנל 4).'],
  ['יותר מדי מסרים?', 'בכל פאנל שירות יש 3 מסרים, זה הגבול. בפאנל 3 שורת המסרים מיותרת, וההמלצה היא להסיר אותה.'],
  ['הבידול ברור?', 'כן. הוא נבנה ברצף של פאנלים 5 ← 6 ← 7. החולשה: אין עדות לקוח.'],
  ['יש סיבה ליצור קשר?', 'כן: שיחה ללא עלות, ובלי צורך לדעת מראש מה הפתרון. למפנה יש משפט אחד ברור.'],
  ['אפשר להסיר עוד?', 'פאנל 3: שורת המסרים. פאנל 4: אפשר לקצר את משפט הערך לשורה אחת.'],
], [2600, 7038], { header: true, firstColShade: true }));

// ---------- 9. approvals ----------
children.push(h1('9. לאשר לפני עיצוב ודפוס'));
['הוצאת הפירמידה מהעלון.', 'הכיתוב "יועץ פיננסי עצמאי" מתחת לשם.',
 '"במרחק שיחה" בשלושה פאנלים, או בגב בלבד.', 'עדות לקוח אמיתית (שורה אחת עם שם פרטי), אם יש.',
 'קישור ה-QR: wa.me/972524415395, עם הודעה כתובה מראש.', 'צילום של שיראל ברזולוציה גבוהה (300dpi בגודל ההדפסה).',
].forEach(t => children.push(bullet(t)));

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
