# פרומפט ליצירת סקיצה ב-ChatGPT: עלון MAKE SENSE

## איך משתמשים
1. **מצרפים שתי תמונות לשיחה:** את הלוגו (MAKESENSE_Logo) ואת התמונה של שיראל. כך ChatGPT ישתמש בהן כרפרנס ולא ימציא לוגו או פנים.
2. **מדביקים את בלוק הסגנון** (סעיף א), ומיד אחריו את הפרומפט של **צד אחד בלבד** (ב או ג). כל צד הוא תמונה נפרדת.
3. **אם טקסט בעברית יוצא משובש:** מחוללי תמונות מתקשים עם הרבה עברית קטנה. משתמשים בתבנית של שקף בודד (סעיף ד), ויוצרים כל שקף בנפרד.

---

## א. בלוק סגנון (מדביקים בכל פעם)

```
You are a senior graphic designer creating a print-ready design SKETCH (mockup) of a Hebrew marketing brochure for a mortgage, credit and business-financing advisor.

BRAND
- Brand name: MAKE SENSE. Use the attached logo exactly: two flying seagulls above the wordmark "MAKE SENSE" in thin, widely letter-spaced capitals. Do not redraw or restyle it. White version on dark backgrounds, royal-blue version on light backgrounds.
- Person: use the attached photo of Shirel Prager exactly as he looks: a man about 30, short grey-flecked hair, short dark beard, dark button-up shirt, arms crossed, warm confident smile. Do not invent a different face.
- Brand colors only: royal blue #004AAD (primary), blue gradients from #1F8BF0 to #004AAD to #002C6B for dark panels, black #0A0A0A for body text, turquoise #1EC8C8 as a small accent (lines, icon details, one highlighted word in a headline), white and very light blue #F4F8FF for light panels.

FORMAT
- Unfolded sheet, portrait: 4 horizontal 16:9 panels stacked vertically (each panel 160x90 mm), separated by thin dashed fold lines. Accordion fold.
- Hebrew, right-to-left. All text right-aligned or centered. Never mirror Hebrew letters.

TYPOGRAPHY
- Headlines: bold modern Hebrew sans-serif (like Rubik Bold/Black), large, black or white.
- Body: clean Hebrew sans-serif (like Heebo), regular weight, high legibility.
- Kicker above each headline: small, letter-spaced, royal blue (turquoise on dark panels).
- Signature "שיראל": handwritten style.

STYLE: premium, editorial, calm, trustworthy, like a private-banking brochure
- Generous white space, strict grid, centered key messages, clear hierarchy: kicker > headline > short lines > benefits > call to action.
- Icons: one consistent set of thin line icons (1.5px stroke) in royal blue with a small turquoise detail, inside soft light-blue circles.
- Call-to-action: rounded pill button in royal-blue gradient with the phone number in a white inner pill.
- Small details:
  - thin turquoise rule under headlines
  - subtle seagull watermark at 8% opacity on dark panels
  - small "MAKE SENSE" logo and phone number in the corner of service panels
  - soft shadows only

AVOID
- generic AI look: no 3D gold coins, no piggy banks, no glossy clipart, no stock handshakes, no neon glow
- no fake bank or card logos
- no lorem ipsum, no English filler text
- no extra text beyond what is given

TEXT
Render every Hebrew text below exactly as written: same words, same order, correct spelling. If space is tight, reduce font size; do not drop or paraphrase text.
```

---

## ב. צד חיצוני: שער ושירותים (תמונה 1)

```
Create the OUTSIDE side of the brochure: 4 stacked 16:9 panels, top to bottom.

PANEL 1 - COVER (dark royal-blue gradient background)
Right two-thirds: centered text block. Left third: the photo of Shirel inside a tall arch-shaped white frame, with a small black name tag at the bottom of the arch.
- Logo: MAKE SENSE (white)
- Headline (two lines, first line turquoise, second white): "השליטה הכלכלית" / "שלכם מתחילה כאן"
- Sub line (white): "שיראל פרגר · מומחה לפתרונות אשראי, השקעות נדל"ן ומימון לעסקים"
- Row of 4 small white line icons with labels: house "משכנתאות" | layered cards "פתרונות אשראי" | building "השקעות נדל"ן" | briefcase "מימון לעסקים"
- Slogan (bottom, white, last word turquoise): "לתכנן. לצמוח. להגשים."
- Name tag in arch: "שיראל פרגר" / "יועץ משכנתאות ופיננסים"

PANEL 2 - MORTGAGES & CREDIT (white background)
Header row centered: round royal-blue icon (house with a small turquoise dot) + kicker + headline.
- Kicker: "משכנתאות ופתרונות אשראי · לפרטיים ולעצמאים"
- Headline: "משכנתה, הלוואות ומינוס: הגיע הזמן לעשות סדר."
- Service line: "רכישה ומחזור משכנתה, איחוד הלוואות, הלוואה לכל מטרה כנגד נכס, גישור, ופתרונות גם למי שהבנק סירב לו.*"
- Small label "נשמע מוכר?" followed by 4 short quotes in royal blue, separated by dots: "אישור עקרוני ולא יודעים אם הוא טוב" · "משלמים שנים והיתרה לא זזה" · "כמה הלוואות ומינוס חוזר" · "הבנק אמר לא"
- 4 benefit cards in a row, each with its own line icon:
  - calculator: "משכנתה לפי החיים שלכם"
  - magnifier with %: "סימולציית מחזור בשקלים"
  - merging arrows: "תשלום חודשי אחד ומסודר"
  - bank building: "בדיקה מול כמה גופים מממנים"
- Two short lines, centered:
  - "אחרי: מבינים כל שורה, תשלום אחד וברור, מרווח נשימה."
  - "ואם לא? תמהיל לא נכון וריבית יקרה עולים כסף בכל חודש."
- Objection line (bold): "לא צריך להתבייש בחובות, צריך תוכנית. אין כדאיות? תקבלו טיפים לשפר לבד."
- CTA pill: "שלחו לי את ההצעה · בדיקה ראשונה ללא עלות" + "052-441-5395"
- Small referral line: "למפנים: שמעתם 'ההלוואות אוכלות לי את המשכורת'? תכירו לו אותי."
- Footnote, tiny: "*כל מקרה נבחן לגופו ובכפוף לאישור הגוף המממן."

PANEL 3 - REAL-ESTATE INVESTMENT (very light blue gradient background)
Same structure as panel 2. Round icon: building with a small turquoise up-arrow.
- Kicker: "השקעות נדל"ן · בארץ ובחו"ל"
- Headline: "לפני שקונים או מוכרים, בודקים את המספרים."
- Service line: "ליווי משקיעים ורוכשים: בדיקת כדאיות, גיוס הון עצמי מנכס קיים, ומימון בארץ, בחו"ל ובהתחדשות עירונית."
- "נשמע מוכר?" quotes: "יש לי דירה ורוצה עוד אחת" · "מוכרים לשדרג ולא יודעים איך לתזמן" · "רוצים להשקיע בחו"ל ולא יודעים איך לממן"
- 4 benefit cards:
  - rising chart: "כדאיות, תזרים ותשואה, במספרים"
  - two houses with plus: "ההון שבנכס עובד בשבילכם"
  - shield: "החזר לפי תרחיש זהיר"
  - globe: "מרווח ביטחון לתקופת הביניים"
- "אחרי: יודעים כמה לקחתם, למה ואיך מחזירים." / "ואם לא? השקעה בלי תכנון מימון הופכת מהזדמנות ללחץ."
- Objection: "אני משקיע בעצמי. השאלה החשובה היא כמה נכון לקחת."
- CTA pill: "לפני שחותמים, בודקים את המספרים" + "052-441-5395"
- Referral line: "למפנים: שמעתם 'יש לי דירה ואני רוצה עוד אחת'? תכירו לו אותי."

PANEL 4 - BUSINESS FINANCING (dark royal-blue gradient; this is the back cover when folded)
Same structure, white text, turquoise accents. Round icon: briefcase with a turquoise rising line.
- Kicker: "מימון לעסקים · לעצמאים ולחברות בע"מ"
- Headline: "הון לצמיחה, בהחזר שהעסק יכול לשאת."
- Service line: "הלוואות עסקיות, משכנתה לכל מטרה עסקית ואיחוד הלוואות עסקיות, בבדיקה מול כל הגופים המממנים."
- "נשמע מוכר?" quotes: "העסק יכול לגדול וחסר הון" · "הלוואות קצרות ויקרות חונקות את התזרים" · "הבנק מציע רק להגדיל מסגרת"
- 4 benefit cards (white cards, blue icons):
  - magnifier: "בדיקת היתכנות מול כל הגופים"
  - calendar: "החזר שמתאים לתזרים"
  - merging arrows: "פחות הלוואות יקרות"
  - target: "מימון שמחובר לתוכנית צמיחה"
- "אחרי: לעסק יש אוויר: הון זמין ותזרים שמחזיק את ההחזר." / "ואם לא? אשראי קצר ויקר שוחק את הרווח."
- Objection: "החזר נמוך לא תמיד אומר הלוואה זולה, לכן בודקים גם את העלות הכוללת."
- CTA pill (turquoise with black text): "ספרו לי למה העסק צריך את הכסף" + "052-441-5395"
- Bottom strip: white MAKE SENSE logo · "שיראל פרגר" · "052-441-5395"
```

---

## ג. צד פנימי: המסע (תמונה 2)

```
Create the INSIDE side of the brochure: 4 stacked 16:9 panels, top to bottom. This side tells a story, so make it more editorial and emotional than the services side: bigger headlines, more white space, quotes styled like speech.

PANEL 5 - THE PAIN (white background)
- Kicker: "הכול מתחיל בשאלה אחת"
- Big centered headline: "מרגישים שהכסף מנהל אתכם, ולא אתם אותו?"
- 4 speech-bubble style quote cards in a row (royal-blue text, thin light-blue border), each with a tiny line icon:
  - house: "קיבלנו אישור עקרוני, ואין לנו מושג אם זה טוב."
  - cards: "ההלוואות אוכלות לי את המשכורת."
  - building: "יש לי דירה, ואני רוצה לקנות עוד אחת."
  - briefcase: "העסק צריך הון, ואני לא רוצה עוד הלוואה יקרה."
- Line below: "הטעויות היקרות קורות בהחלטות הגדולות: משכנתה, הלוואה, עסקה. ובדרך כלל, כשאין מי שמייצג אתכם."
- Closing line, large, centered (second sentence in royal blue): "הבנק מייצג את הבנק. מי מייצג אתכם?"

PANEL 6 - ME (very light blue gradient background)
Right: text. Left: small round photo of Shirel with a thin turquoise ring.
- Kicker: "נעים להכיר · שיראל פרגר"
- Headline: "ראיתי מקרוב מה טעות פיננסית עושה למשפחה."
- Story paragraph: "הלוואות רעות, התנהלות שגויה מול הבנקים, ואף אחד שיעמוד לצד ההורים שלי. רוב האנשים פשוט לא קיבלו חינוך פיננסי. בחרתי ללמוד, להשקיע בעצמי, ולעמוד לצד מי שאין לו את זה."
- Small bold line: "איך בוחרים יועץ אמין? בודקים השכלה, חברות בהתאחדות, ניסיון אמיתי ושקיפות. הנה שלי:"
- 4 fact tiles (big royal-blue word + small caption):
  - "B.A + M.B.A" / "כלכלה וניהול, מנהל עסקים"
  - "חבר" / "בהתאחדות יועצי המשכנתאות"
  - "משקיע" / "נדל"ן בעצמי"
  - "עשרות" / "משפחות, משקיעים ועסקים שליוויתי"
- Closing line + handwritten signature: "בשבילי זו שליחות: להנגיש את הידע לכל אחד, בגובה העיניים." "שיראל"

PANEL 7 - THE METHOD (white background, two columns under a centered header)
- Kicker: "איך אני עובד"
- Headline (second sentence in royal blue): "הבנק מייצג את הבנק. אני מייצג אתכם."
- Right column: a clean comparison table, 3 columns. Header row: (empty) | "יועץ בבנק" (grey) | "MAKE SENSE" (royal-blue header cell, white text). Rows:
  - "מייצג את" | "הבנק" | "אתכם בלבד"
  - "הצעות" | "של גוף אחד" | "השוואה בין כמה גופים"
  - "התוכנית" | "מה שהבנק מציע" | "לפי החיים שלכם"
  - "ליווי" | "מול הפקיד" | "מהתכנון ועד החתימה"
- Under the table, two small Q&A boxes:
  - "יש ייעוץ חינם בבנק?" "הוא מציג הצעה של גוף אחד. השוואה בין גופים יכולה לחסוך יותר מעלות הייעוץ."
  - "כמה זה עולה?" "פגישת ההיכרות בחינם, והמחיר נסגר מראש."
- Left column: flat 2D pyramid of 8 stacked layers (no 3D), dark blue at the base fading to light blue, top layer turquoise. Title: "פירמידת הביטחון הכלכלי". Caption: "ביטחון כלכלי הוא לא סכום בחשבון. זו תחושה שיש לכם שליטה, גם כשמשהו לא צפוי קורה." Layer labels, bottom to top:
  1. "תזרים חיובי"
  2. "הפרשה קבועה לחיסכון"
  3. "קרן חירום"
  4. "ביטוחים והגנות"
  5. "מטרות ותקציב לטווח בינוני"
  6. "לכל חיסכון יש שם"
  7. "השקעה לטווח ארוך"
  8. "מינוף תזרים והון"
- Bottom strip, 5 small connected steps with arrows (right to left): "שיחת היכרות" → "אבחון" → "תוכנית" → "ביצוע" → "שקט כלכלי"

PANEL 8 - THE NEXT STEP (dark royal-blue gradient background, white text)
- Kicker (turquoise): "הצעד הבא"
- Headline (second sentence turquoise): "נשארתם בפלוס? מעולה. נתקעתם? הגיע הזמן שנדבר."
- Line: "הטעות הנפוצה היא לחכות לרגע המתאים. אפשר להתחיל מכל מצב, ושיחה אחת מספיקה כדי לדעת איפה אתם עומדים."
- Three columns:
  - Right, contact: "פגישת היכרות על כוס קפה, ללא עלות וללא התחייבות" / large "052-441-5395" / "sp.makesense@gmail.com" / "הנאמנים 14, חיפה"
  - Center: QR code on a white rounded square, caption "סרקו וקבעו פגישה בוואטסאפ"
  - Left: box with thin turquoise border. Title "מכירים מישהו שאמר את זה?". Quotes: "הבנק לא אישר לי" · "ההלוואות אוכלות לי את המשכורת" · "יש לי דירה ואני רוצה עוד אחת" · "העסק צריך הון". Closing: "תכירו לו אותי. שיחה אחת, ואני מעדכן אתכם."
- Thin line: "ועוד פתרונות שנבדוק בשיחה: משכנתה הפוכה 55+ · מחיר למשתכן · בנייה עצמית · שיפוצים וממ"ד · נכס מסחרי · נחלות · תושבי חוץ"
- Bottom center: handwritten "אתכם לכל הדרך, שיראל" + white MAKE SENSE logo
```

---

## ד. תבנית לשקף בודד (כשהטקסט יוצא משובש)

```
[paste the STYLE block above]

Create ONE single 16:9 landscape panel (160x90 mm) of this brochure, flat, front view, no mockup background.
Panel: [שם השקף, למשל: PANEL 2 - MORTGAGES & CREDIT]
Background: [white / very light blue gradient / dark royal-blue gradient]
[paste that panel's lines from section ב or ג]
Render all Hebrew text exactly, right-to-left, large enough to read.
```
