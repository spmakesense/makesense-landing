# Builds checklist.html (A4, 2 pages) in the MAKE SENSE guide style; make-pdf.js prints it.
import re, pathlib
deck = pathlib.Path('../../reverse-mortgage-deck/deck.html').read_text(encoding='utf8')
a = deck.index('<svg width="0" height="0" style="position:absolute">'); b = deck.index('</svg>', deck.index('<symbol id="corner"')) + 6
defs = deck[a:b].replace('</defs>', '''
    <symbol id="scissors" viewBox="0 0 24 24"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/></symbol>
    <symbol id="scroll" viewBox="0 0 24 24"><path d="M15 12h-5M15 8h-5M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/></symbol>
    <symbol id="pen" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></symbol>
    <symbol id="steth" viewBox="0 0 24 24"><path d="M5 3v6a5 5 0 0 0 10 0V3"/><path d="M10 14v2a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="12" r="2"/></symbol>
    <symbol id="hospital" viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M12 7v6M9 10h6M9 21v-4h6v4"/></symbol>
    <symbol id="alert" viewBox="0 0 24 24"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></symbol>
    <symbol id="ok" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m7.5 12.5 3 3 6-6.5"/></symbol>
  </defs>''')

money = [
  ('cash', 'כמה נכנס בחודש?', 'קצבת זקנה, תוספת ותק, פנסיות והכנסות נוספות', 'אישור שנתי מביטוח לאומי ודוחות הקרנות'),
  ('shield', 'מיצוי זכויות', 'השלמת הכנסה, ותק, דחיית קצבה והנחות לאזרח ותיק', 'אתר "כל זכות" או סניף ביטוח לאומי'),
  ('percent', 'מס על הקצבה', 'האם נעשה קיבוע זכויות (161ד)? האם המענקים נפרסו נכון?', 'פקיד השומה, בליווי יועץ'),
  ('search', 'חסכונות אבודים', 'קרנות ישנות, קופות גמל ופוליסות שנשכחו', 'אתר "הר הכסף" והמסלקה הפנסיונית'),
  ('scissors', 'הלוואות והוצאות', 'הלוואות יקרות, ביטוחים כפולים, חשבונות מנופחים', 'דפי חשבון של 3 החודשים האחרונים'),
  ('home', 'הבית', 'כמה הוא שווה, ואילו אפשרויות יש: להישאר, להשכיר, דיור מוגן או משכנתה הפוכה', 'שמאות או הערכת שווי, ושיחת ייעוץ'),
]
cases = [
  ('scroll', 'צוואה וירושה',
   'אבא נפטר בלי צוואה, והדירה עברה בירושה לאמא ולשלושת האחים. כשאמא רצתה למכור ולעבור לדיור מוגן, אח אחד סירב, והכל נתקע.',
   'צוואה מסודרת, למשל צוואה הדדית בין בני הזוג, שמותאמת לרצון ההורים. בן הזוג שנשאר חי בשקט, והמשפחה נשארת מאוחדת.'),
  ('pen', 'ייפוי כוח מתמשך',
   'אמא אובחנה בדמנציה, ואף אחד לא יכול לפעול בחשבון הבנק שלה. הילדים נאלצו לפנות לבית משפט כדי להתמנות לאפוטרופוסים, תהליך של חודשים.',
   'ייפוי כוח מתמשך שנחתם מראש בפני עורך דין שהוסמך לכך. ההורים בוחרים בעצמם מי יחליט בשבילם, ובדיוק לפי רצונם.'),
  ('steth', 'ביטוח סיעודי',
   'אבא עבר אירוע מוחי והפך סיעודי. מטפלת צמודה עולה אלפי שקלים בחודש, והחסכונות של ההורים נגמרו תוך שנה.',
   'בודקים מראש את הביטוח הסיעודי בקופת החולים ואת הפוליסות הקיימות, ומממשים את גמלת הסיעוד. משכנתה הפוכה יכולה לשמש גיבוי.'),
  ('hospital', 'ביטוחי בריאות',
   'אמא נזקקה לניתוח, ואז התברר שהביטוח הפרטי שלה בוטל לפני שנים, כי הוראת קבע נפלה ואף אחד לא שם לב.',
   'ממפים את כל הביטוחים באתר "הר הביטוח", מבטלים כפילויות ושומרים על מה שחשוב באמת.'),
]
ic = lambda n: f'<svg class="i"><use href="#{n}"/></svg>'
rows = ''.join(f'''<div class="row"><span class="box"></span><span class="ic">{ic(i)}</span><div class="tx"><h3><span class="num">{k+1}</span>{t}</h3><p>{d}</p><small>{ic("info")}איך בודקים: {how}</small></div></div>''' for k,(i,t,d,how) in enumerate(money))
cs = ''.join(f'''<div class="case"><div class="ch"><span class="box"></span><span class="ic">{ic(i)}</span><h3><span class="num">{k+7}</span>{t}</h3></div>
  <div class="pair"><div class="bad">{ic("alert")}<div><b>לא תרצו שזה יקרה…</b><p>{bad}</p></div></div>
  <div class="fix">{ic("ok")}<div><b>הפתרון</b><p>{fix}</p></div></div></div></div>''' for k,(i,t,bad,fix) in enumerate(cases))
foot = '''<svg class="corner r"><use href="#corner"/></svg><svg class="corner l"><use href="#corner"/></svg>
<div class="foot"><div class="brand"><img src="logo.png" alt="MAKE SENSE"><span>שיראל פרגר – יועץ משכנתאות | MAKESENSE</span></div>
<img class="sig" src="signature.png" alt="איתכם לכל הדרך, שיראל"><img class="member" src="member.png" alt="חבר בהתאחדות יועצי המשכנתאות"></div>'''
html = f'''<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>10 דברים לבדוק עם ההורים</title>
<link href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700;800&family=Karantina:wght@700&display=block" rel="stylesheet">
<style>
:root{{--blue:#004aad;--navy:#001a4d;--cyan:#1fb3c8;--teal:#137897;--ice:#e8f8fb;--ink:#1a2233;--muted:#5a6478;--line:#d9dee8}}
@page{{size:A4;margin:0}}*{{box-sizing:border-box;margin:0;padding:0}}
body{{font-family:'Assistant',sans-serif;color:var(--ink);-webkit-print-color-adjust:exact;print-color-adjust:exact}}
svg.i{{width:1em;height:1em;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;flex:none}}
.page{{width:210mm;height:297mm;position:relative;overflow:hidden;page-break-after:always;background:linear-gradient(170deg,#eceef1 0%,#f7f8fa 40%,#fdfdfe 100%)}}
.page:last-child{{page-break-after:auto}}
.tab{{position:absolute;top:10mm;right:9mm;background:var(--blue);color:#fff;font-weight:800;font-size:13pt;padding:1.6mm 6mm 2mm;border-radius:12px}}
.hero{{position:absolute;top:22mm;right:13mm;left:13mm}}
.hero h1{{font-family:'Karantina';font-size:50pt;line-height:.9;color:var(--blue)}}
.hero h1 em{{font-style:normal;color:var(--cyan)}}
.hero p{{font-size:12.5pt;font-weight:700;color:var(--teal);margin-top:2mm}}
.how{{display:flex;gap:2mm;margin-top:3.5mm;flex-wrap:wrap}}
.how span{{display:flex;align-items:center;gap:1.5mm;background:#fff;border:1px solid var(--line);border-radius:99px;padding:.8mm 3.5mm;font-size:9.5pt;font-weight:700;color:var(--ink)}}
.how svg{{color:var(--cyan);font-size:11pt}}
.sec{{display:flex;align-items:center;gap:2.5mm;font-family:'Karantina';font-size:24pt;color:var(--blue);line-height:1;margin-bottom:3mm}}
.sec .pill{{font-family:'Assistant';font-size:10pt;font-weight:800;color:#fff;background:var(--teal);border-radius:99px;padding:.6mm 3mm}}
.list{{position:absolute;top:73mm;right:13mm;left:13mm}}
.row{{display:flex;align-items:flex-start;gap:3.5mm;background:#fff;border-radius:14px;padding:4.2mm 4.5mm;margin-bottom:3.6mm;box-shadow:0 4px 14px rgba(0,74,173,.07)}}
.box{{flex:none;width:7mm;height:7mm;border:2px solid var(--blue);border-radius:6px;margin-top:1mm;background:#fff}}
.ic{{flex:none;width:11mm;height:11mm;border-radius:50%;background:var(--ice);color:var(--blue);display:flex;align-items:center;justify-content:center;font-size:16pt}}
.row:nth-child(even) .ic{{background:#dff4f8;color:var(--teal)}}
.tx h3{{font-size:15pt;font-weight:800;color:var(--blue);display:flex;align-items:center;gap:2mm;line-height:1.2}}
.num{{font-family:'Karantina';font-size:17pt;color:var(--cyan);line-height:1}}
.tx p{{font-size:12pt;color:var(--ink);margin-top:.5mm;line-height:1.35}}
.tx small{{display:flex;align-items:center;gap:1.3mm;font-size:10pt;color:var(--muted);margin-top:1mm;font-weight:600}}
.tx small svg{{color:var(--cyan)}}
.cases{{position:absolute;top:24mm;right:13mm;left:13mm}}
.case{{background:#fff;border-radius:14px;padding:3mm 4mm;margin-bottom:3mm;box-shadow:0 4px 14px rgba(0,74,173,.07)}}
.ch{{display:flex;align-items:center;gap:3mm}}
.ch .box{{margin-top:0}}
.ch h3{{font-size:14pt;font-weight:800;color:var(--blue);display:flex;align-items:center;gap:2mm}}
.pair{{display:grid;grid-template-columns:1fr 1fr;gap:2.5mm;margin-top:2mm}}
.bad,.fix{{display:flex;gap:2.2mm;align-items:flex-start;border-radius:10px;padding:2.2mm 3mm;font-size:10pt;line-height:1.35}}
.bad{{background:#f1f2f5}}.bad>svg{{color:#e5614a;font-size:14pt;margin-top:.5mm}}.bad b{{color:#c2410c}}
.fix{{background:var(--blue);color:#fff}}.fix>svg{{color:var(--cyan);font-size:14pt;margin-top:.5mm}}.fix b{{color:var(--cyan)}}
.bad b,.fix b{{display:block;font-size:10pt}}
.cta{{position:absolute;left:13mm;right:13mm;bottom:38mm;background:linear-gradient(120deg,var(--blue),var(--navy));border-radius:16px;color:#fff;padding:4.5mm 6mm;display:flex;align-items:center;gap:6mm}}
.cta .qr{{background:#fff;border-radius:10px;padding:1.5mm;flex:none}}.cta .qr img{{width:24mm;height:24mm;display:block}}
.cta h2{{font-family:'Karantina';font-size:24pt;line-height:1}}
.cta p{{font-size:11pt;opacity:.92;margin-top:1mm}}
.cta .ph{{display:inline-flex;align-items:center;gap:2mm;margin-top:2mm;background:var(--cyan);color:#fff;font-weight:800;font-size:14pt;border-radius:99px;padding:1mm 5mm;direction:ltr}}
.disc{{position:absolute;left:13mm;right:13mm;bottom:31mm;font-size:7.8pt;color:var(--muted);line-height:1.35}}
.foot{{position:absolute;bottom:0;left:0;right:0;height:30mm;display:flex;align-items:flex-end;justify-content:space-between;padding:0 27mm 5mm}}
.brand{{display:flex;flex-direction:column;align-items:center;gap:1mm}}.brand img{{height:12mm}}.brand span{{font-size:7.5pt;font-weight:700;color:var(--blue)}}
.sig{{height:15mm}}.member{{height:10mm}}
.corner{{position:absolute;bottom:0;width:20mm;height:38mm}}.corner.r{{right:0}}.corner.l{{left:0;transform:scaleX(-1)}}
</style></head><body>{defs}
<section class="page">
  <div class="tab">צ׳קליסט למשפחה</div>
  <div class="hero"><h1>10 דברים לבדוק<br><em>עם ההורים</em></h1>
    <p>ההורים שלנו, הכסף שלהם, והשקט של כולנו</p>
    <div class="how"><span>{ic("ok")}סמנו V על כל סעיף שסגרתם</span><span>{ic("family")}מזמינים את כל האחים</span><span>{ic("heart")}מתחילים מהחלומות, לא מהחובות</span></div></div>
  <div class="list"><div class="sec">חלק א׳: הכסף <span class="pill">6 בדיקות</span></div>{rows}</div>
  {foot}
</section>
<section class="page">
  <div class="tab">חלק ב׳: ההגנות</div>
  <div class="cases"><div class="sec">4 מקרים שלא תרצו שיקרו <span class="pill">מקרים להמחשה</span></div>{cs}</div>
  <div class="cta"><div class="qr"><img src="qr-wa.png" alt="QR לוואטסאפ"></div>
    <div><h2>רוצים לעבור על הרשימה יחד?</h2><p>בדיקה משפחתית: שעה אחת, כל המשפחה, תוכנית ברורה. ללא התחייבות.</p><span class="ph">{ic("phone")}052-441-5395</span></div></div>
  <p class="disc">המידע כללי ואינו מהווה ייעוץ אישי, משפטי או ביטוחי. בענייני צוואה, ייפוי כוח וביטוח מומלץ להיעזר בעורך דין ובבעל רישיון מתאים. המקרים להמחשה בלבד.</p>
  {foot}
</section></body></html>'''
pathlib.Path('checklist.html').write_text(html, encoding='utf8')
print('ok')
