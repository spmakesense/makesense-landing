"""Builds the lean landing page (../index.html). Also rebuilds the full guide (../guide.html) via build_web."""
import os, re, sys
D = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, D)
import build_web as W  # builds guide.html as a side effect and provides icons/images/links

BOOK = 'https://moneyflow-ai.com/book/73f13f06-117d-4784-817d-d12000ae27a7'
Q = [
 ('יש לכם חשבון משותף בתנאים שביקשתם, או במה שהבנק נתן?', 'עמלות, פטורים והטבות פתיחה',
  'זוג צעיר הוא לקוח שהבנק רוצה. מי שמבקש בכתב פטור מעמלות והטבת פתיחה חוסך מאות שקלים בשנה. ומי שלא מבקש, משלם.'),
 ('חובות החתונה סגורים, וכסף המתנות כבר עובד בשבילכם?', 'או שהוא עדיין יושב בעו"ש',
  'מינוס שנגרר פוגע בדירוג האשראי בדיוק כשתצטרכו משכנתא. וכסף שנשאר בעו"ש פשוט מתפזר. הוא יכול להיות ההתחלה של ההון העצמי לדירה.'),
 ('אתם יודעים כמה נכנס, כמה יוצא, וכמה חוסכים כל חודש?', 'תקציב משותף, לא "בערך"',
  'מי שחוסך "ממה שנשאר" בסוף החודש, בדרך כלל לא חוסך. קובעים סכום חיסכון בתחילת החודש, בהוראת קבע.'),
 ('אתם יודעים כמה צריך לחסוך בחודש כדי לקנות דירה, ומתי?', 'יעד, תאריך, ואפיק נכון',
  'הון עצמי של כ-30% ממחיר הדירה, פחות מה שכבר יש, חלקי החודשים עד הקנייה. בלי יעד ובלי אפיק נכון, הכסף עומד במקום.'),
 ('הוצאתם תעודת זכאות לדירה בהנחה?', 'מחיר למשתכן, לפני ההגרלות הבאות',
  'זוגות בלי דירה יכולים להשתתף בהגרלות. מוציאים תעודה עכשיו כדי לא לפספס. וחשוב: קניית דירה אחרת קודם עלולה לפגוע בזכאות.'),
 ('בדקתם אם אתם משלמים פעמיים על אותו ביטוח?', 'מהעבודה, מההורים ומה שעשיתם לבד',
  'כמעט אצל כל זוג נמצא לפחות ביטוח אחד כפול. בודקים ב"הר הביטוח", ומבטלים רק אחרי שבודקים מה כל פוליסה מכסה.'),
 ('מי רשום כמוטב בפנסיה ובקרן ההשתלמות שלכם?', 'רמז: אולי עדיין ההורים',
  'הנישואין לא מעדכנים מוטבים אוטומטית. וגם: כיסוי שארים שוויתרתם עליו כרווקים, אובדן כושר עבודה ומסלול השקעה. בוחרים במודע, לא בברירת מחדל.'),
 ('יש לכם 3–6 חודשי הוצאות בצד, ליום שלא מתכננים?', 'קרן חירום, לא בבורסה',
  'אובדן הכנסה, חל"ד מוארך, חל"ת או הוצאה רפואית. בקרן כספית נזילה וללא סיכון, כדי לא לשבור את החיסכון לדירה ולא לקחת הלוואה.'),
]
def q_html(i, q):
    t, s, why = q
    t = t.replace('3–6', '<span class="ltr">3–6</span>')
    return (f'<div class="q"><div class="row"><span class="num">{i + 1}</span>'
            f'<button class="qt" aria-expanded="false" aria-controls="w{i}">{t}<small>{s}</small></button>'
            f'<label class="cb"><input type="checkbox" aria-label="דאגנו לזה: שאלה {i + 1}"><span>{W.I("check", "")}</span></label></div>'
            f'<div class="why" id="w{i}">{why}</div></div>')

html = open(os.path.join(D, 'landing.tpl.html'), encoding='utf-8').read()
for k, v in {'{{QUESTIONS}}': ''.join(q_html(i, q) for i, q in enumerate(Q)), '{{BOOK}}': BOOK, '{{WA}}': W.WA,
             '{{LOGO}}': W.img('logo_s.png', 'image/png'), '{{FACE}}': W.img('face_s.jpg', 'image/jpeg')}.items():
    html = html.replace(k, v)
html = re.sub(r'\{\{I:(\w+)\}\}', lambda m: W.I(m.group(1)), html)
assert '{{' not in html
open(os.path.join(D, '..', 'index.html'), 'w', encoding='utf-8').write(html)
print('landing ok', len(html) // 1024, 'KB')
