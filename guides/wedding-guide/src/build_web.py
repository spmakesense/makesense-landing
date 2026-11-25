"""Builds the mobile web guide (../index.html) from web.tpl.html + content below + webapp.js."""
import base64, os, re
D = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(D, '..', 'index.html')

def img(name, mime):
    return f'data:{mime};base64,' + base64.b64encode(open(os.path.join(D, name), 'rb').read()).decode()

WA = 'https://wa.me/972524415395?text=%D7%A1%D7%93%D7%A8%20%D7%90%D7%97%D7%A8%D7%99%20%D7%94%D7%97%D7%AA%D7%95%D7%A0%D7%94'
P = {  # lucide-style icon paths
 'card': '<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>',
 'home': '<path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
 'shield': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
 'lock': '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
 'pie': '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>',
 'umbrella': '<path d="M22 12a10 10 0 0 0-20 0z"/><path d="M12 12v8a2 2 0 0 0 4 0"/><path d="M12 2v1"/>',
 'gift': '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
 'sprout': '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
 'target': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
 'key': '<circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6"/><path d="M15.5 7.5l3 3L22 7l-3-3"/>',
 'building': '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
 'hammer': '<path d="M15 12l-8.5 8.5a2.12 2.12 0 0 1-3-3L12 9"/><path d="M17.64 15L22 10.64"/><path d="M20.91 11.7l-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/>',
 'ticket': '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/><path d="M13 5v2M13 17v2M13 11v2"/>',
 'arrow': '<path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>',
 'x': '<path d="M18 6L6 18M6 6l12 12"/>',
 'phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
 'mail': '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/>',
 'cap': '<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
 'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
 'chev': '<path d="M6 9l6 6 6-6"/>',
 'check': '<path d="M20 6L9 17l-5-5"/>',
 'calendar': '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M9 16l2 2 4-4"/>',
 'clock': '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
}
def I(n, cls='i'):
    if n == 'wa':
        return '<svg class="i" viewBox="0 0 24 24" style="fill:currentColor;stroke:none"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>'
    return f'<svg class="{cls}" viewBox="0 0 24 24" aria-hidden="true">{P[n]}</svg>'
LTR = lambda t: f'<span class="ltr">{t}</span>'

# ---------------- checklist ----------------
TASKS = [
 dict(ph=('לבנות', 'p1'), t='פתחנו חשבון משותף וסגרנו תנאים',
      box='<b class="t">3 כללים לניהול העו"ש</b><ol><li>חיובי האשראי יורדים <b>אחרי</b> כניסת המשכורת</li><li>כרית ביטחון: ' + LTR('1–1.5') + ' חודשי הכנסה, <b>גם אחרי ה-10 לחודש</b></li><li>ב-1 לכל חודש עוברים על כל החיובים</li></ol>',
      y=['משווים עמלות ומבקשים פטור בכתב'], n=['לא בוחרים בנק רק כי "ההורים שם"'],
      p='אתם מחליטים אם פותחים חשבון משותף חדש או מאחדים לאחד הקיימים, ומבקשים בכתב פטור מעמלות והטבת פתיחה. הבנק לא מציע את זה מעצמו, אבל זוג צעיר הוא לקוח שהוא רוצה ומוכן להתגמש בשבילו. <b>מי שלא מבקש משלם מאות שקלים בשנה על עמלות מיותרות.</b>'),
 dict(ph=('לסגור', 'p2'), t='סגרנו את חובות החתונה',
      y=['רשימה אחת של כל מה שעוד פתוח', 'סוגרים קודם את הריבית הגבוהה, בדרך כלל המינוס'], n=['לא גוררים חוב מהחתונה לשנה הראשונה'],
      p='רשימה אחת של כל מה שעוד פתוח: ספקים, מינוס, הלוואה או תשלומים בכרטיס. סוגרים קודם את החוב עם הריבית הגבוהה ביותר. <b>חוב שנגרר מהחתונה פוגע בדירוג האשראי, בדיוק כשתצטרכו אותו למשכנתא.</b>'),
 dict(ph=('לסגור', 'p2'), t='העברנו את כסף המתנות לחיסכון',
      y=['קודם סוגרים את חובות האירוע', 'את היתרה מעבירים <b>מיד</b> לחיסכון'], n=['לא משאירים בעו"ש או בפיקדון'],
      p='את מה שנשאר אחרי סגירת החובות מוציאים מהבנק לאפיק חיסכון, כמו קופת גמל להשקעה או פוליסת חיסכון. זו כבר לא "מתנה". זו ההתחלה של ההון העצמי לדירה. <b>כסף שנשאר בעו"ש מתפזר, וכסף שמושקע נכון גדל.</b>'),
 dict(ph=('לבנות', 'p1'), t='בנינו תקציב חודשי',
      box='<b class="t">חיסכון משותף או נפרד?</b><b>משותף:</b> דירה, ילדים וחירום · <b>אישי:</b> פנסיה והשתלמות. ולא מסתירים חובות או חסכונות.',
      y=['רושמים כל הכנסה וכל הוצאה קבועה', 'חוסכים <b>בתחילת</b> החודש, בהוראת קבע'], n=['לא חוסכים "ממה שנשאר"'],
      p='אתם יודעים בדיוק כמה נכנס, כמה יוצא ועל מה. זה לא אומר להפסיק ליהנות. זה אומר להחליט מראש כמה מוציאים על כל דבר. <b>זוג עם תקציב מתווכח פחות על כסף ומגיע ליעדים מהר יותר.</b>'),
 dict(ph=('להגן ולחסוך', 'p3'), t='קבענו יעד וקצב לחיסכון לדירה',
      box='<b class="t">כמה חוסכים בחודש?</b><span class="frac"><span class="fr"><span class="nu">יעד הון עצמי פחות מה שיש</span><span class="de">חודשים עד הקנייה</span></span><span class="eq">= חיסכון חודשי</span></span><br>יעד הון עצמי: כ-' + LTR('30%') + ' ממחיר הדירה.<br>דוגמה: דירה ב-1.6 מיליון, יש 80 אלף, 6 שנים: <b>כ-5,500 ₪ בחודש</b>',
      y=['גמל להשקעה או פוליסת חיסכון, מסלול לפי הזמן עד הדירה'], n=['לא מושכים את קרן ההשתלמות לכל מטרה'],
      p='אתם יודעים כמה הון עצמי צריך, כמה חוסכים כל חודש ובאיזה מסלול, לפי הזמן שנשאר עד הקנייה. ככה "נקנה דירה מתישהו" הופך לתאריך ביומן. <b>בלי יעד ובלי אפיק נכון, הכסף פשוט עומד במקום.</b>'),
 dict(ph=('להגן ולחסוך', 'p3'), t='בדקנו כפילויות בביטוחים',
      y=['בודקים הכול ב"הר הביטוח"', 'מוותרים על כפילויות'], n=['לא מבטלים לפני שבודקים מה הפוליסה מכסה'],
      p='מרכזים את כל הפוליסות של שניכם, מהעבודה, מההורים ומה שעשיתם לבד, ובודקים מה משולם פעמיים. כמעט אצל כל זוג נמצא לפחות ביטוח אחד מיותר. <b>זה כסף שחוזר אליכם כל חודש, בלי לוותר על כיסוי אמיתי.</b>'),
 dict(ph=('להגן ולחסוך', 'p3'), t='סידרנו את הפנסיה: מסלולים ומוטבים',
      y=['בוחרים כיסוי שארים, אובדן כושר עבודה ומסלול השקעה', 'מעדכנים מוטבים ומשווים דמי ניהול'], n=['לא נשארים בברירת מחדל'],
      p='קובעים כמה כיסוי שארים ואובדן כושר עבודה אתם צריכים כזוג, באיזה מסלול הכסף מנוהל ומי רשום כמוטב בגמל, בהשתלמות ובביטוחים. כל שקל שהולך לביטוח לא נחסך לפנסיה, לכן צריך איזון ולא ברירת מחדל. <b>ויתרתם כרווקים על כיסוי שארים, או שההורים עדיין מוטבים? מתקנים קודם.</b>'),
 dict(ph=('להגן ולחסוך', 'p3'), t='התחלנו לבנות קרן חירום',
      y=[LTR('3–6') + ' חודשי הוצאות בקרן כספית', 'ממלאים בסכום קבוע כל חודש'], n=['לא משקיעים במניות ולא נוגעים לחופשה'],
      p='מפרישים כל חודש סכום קבוע לאפיק ללא סיכון ונזיל, כמו קרן כספית, עד שמצטברים ' + LTR('3–6') + ' חודשי הוצאות. הכסף הזה מחכה רק ליום שבאמת תצטרכו, כדי שלא תיקחו הלוואה ולא תשברו את החיסכון לדירה. <b>חופשה, מבצע או מתנה הם לא חירום, וזה מה ששומר על הקרן.</b>'),
]
def task_html(i, t):
    lis = ''.join(f'<li class="y">{x}</li>' for x in t['y']) + ''.join(f'<li class="n">{x}</li>' for x in t['n'])
    box = f'<div class="box">{t["box"]}</div>' if t.get('box') else ''
    return (f'<div class="task {t["ph"][1]}" data-i="{i}"><div class="row">'
            f'<label class="cb"><input type="checkbox" aria-label="סימון: {re.sub("<[^>]+>", "", t["t"])}"><span>{I("check", "")}</span></label>'
            f'<button class="tt" aria-expanded="false" aria-controls="tb{i}"><span class="lbl">{t["t"]}</span>{I("chev", "chev")}</button></div>'
            f'<div class="body" id="tb{i}"><span class="tt" style="display:inline-flex;min-height:0;margin-bottom:8px"><span class="ph">{t["ph"][0]}</span></span>'
            f'{box}<ul class="dd">{lis}</ul><p>{t["p"]}</p></div></div>')

# ---------------- deals ----------------
DEALS = [
 dict(k='k1', c='d1', ic='key', n='נכס מניב', eq=239, pr=151, time='3 שנים', risk=2,
      what='קונים מתחת למחיר השוק בעיר פריפריה עם פוטנציאל צמיחה ותשואה גבוהה, ומשכירים. השכירות מכסה כמעט את כל ההחזר.',
      ex='דירה בעיר פריפריה בשווי 900 אלף ₪, שנקנית ב-825 אלף: 75 אלף מתחת למחיר השוק. השכירות, לפי תשואה של 4.5%, מכסה כמעט את כל החזר המשכנתא.',
      calc=[('שווי שוק', '900,000 ₪'), ('מחיר קנייה (75 אלף מתחת לשוק)', '825,000 ₪'), ('הון עצמי: 25% + כ-4% הוצאות רכישה', 'כ-239,000 ₪'),
            ('משכנתא 75%', '618,750 ₪'), ('שכירות בחודש (תשואה של 4.5%)', '+3,094 ₪'), ('החזר משכנתא בחודש (520 ₪ לכל 100 אלף, 30 שנה)', '−3,218 ₪'),
            ('תזרים חודשי', '−124 ₪'), ('t', 'אחרי 3 שנים'), ('קנייה מתחת לשוק', '+75,000 ₪'), ('עליית ערך: 3% בשנה', '+83,500 ₪'),
            ('קרן שנפרעה מהמשכנתא', '+30,200 ₪'), ('הוצאות רכישה (4%)', '−33,000 ₪'), ('תזרים מצטבר (36 חודשים)', '−4,500 ₪'), ('tot', 'רווח: כ-151,000 ₪')],
      y=['קנייה מתחת לשוק, והשוכר מממן כמעט את כל ההחזר'], no=['חודשים בלי שוכר ותיקונים מורידים את התשואה']),
 dict(k='k2', c='d2', ic='building', n='פינוי בינוי', eq=319, pr=556, time=LTR('5–10') + ' שנים', risk=3, star=True,
      what='קונים דירה ישנה בבניין שנכנס לפרויקט, ומקבלים בסופו דירה חדשה וגדולה יותר.',
      ex='דירת 3 חדרים ישנה בחיפה בכ-1.1 מיליון ₪, הון עצמי של כ-319 אלף, כולל כ-4% הוצאות רכישה. בסוף הפרויקט: דירת 4 חדרים חדשה עם ממ"ד וחניה, בשווי מוערך של כ-1.7 מיליון. הרווח הוא אומדן ותלוי בפרויקט.',
      y=['קפיצת ערך גדולה בלי לשלם על הבנייה'], no=['פרויקטים נמשכים שנים ויכולים להיתקע. בודקים באיזה שלב הם']),
 dict(k='k3', c='d3', ic='home', n='דירה על הנייר', eq=368, pr=100, time='3 שנים', risk=2,
      what='קונים מקבלן לפני הבנייה, משלמים חלק עכשיו ואת השאר במסירה.',
      ex='דירה מקבלן ב-1.6 מיליון ₪: 20% עכשיו (320 אלף) ועוד כ-48 אלף הוצאות רכישה (3%, בלי תיווך). במסירה: משכנתא עד 75% ועוד 5% הון עצמי. ב-3% בשנה, כ-148 אלף עליית ערך וכ-100 אלף נטו תוך 3 שנים.',
      y=['מינוף גבוה בהון עצמי קטן, ופטור ממס רכישה בדירה ראשונה'], no=['עיכובים, הצמדה למדד תשומות, ולפעמים מחיר מנופח']),
 dict(k='k4', c='d4', ic='hammer', n='עסקת פליפ', eq=440, pr=210, time='שנה וחצי', risk=4,
      what='קונים דירה מתחת למחיר השוק, משפצים, ומוכרים אחרי שנה וחצי לפחות.',
      ex='קנייה ב-1 מיליון ₪ מתחת לשוק, שיפוץ של 150 אלף ועוד כ-40 אלף הוצאות רכישה (4%). מכירה ב-1.4 מיליון אחרי שנה וחצי: רווח של כ-210 אלף, פטור ממס שבח כדירה יחידה.',
      y=['ערך שנוצר מהעבודה שלכם, ופטור ממס שבח אחרי 18 חודשים'], no=['מכירה לפני 18 חודשים חייבת במס שבח, ושיפוצים נוטים לחרוג']),
]
def hrow(d, v, mx, time=False):
    w = v / mx * 52
    sub = f'<small>{d["time"]}</small>' if time else ''
    return (f'<div class="hr"><div class="hl"><span class="ic">{I(d["ic"])}</span><span>{d["n"]}{sub}</span></div>'
            f'<div class="tr"><div class="hbar {d["c"]}" style="width:{w:.1f}%"></div><span class="hv">{v} אלף ₪{"*" if time and d.get("star") else ""}</span></div></div>')
EQ = ''.join(hrow(d, d['eq'], 440) for d in DEALS)
PR = ''.join(hrow(d, d['pr'], 556, True) for d in DEALS)
TILES = ''.join(f'<button class="deal {d["k"]}" data-open="deal{i}"><span class="ic">{I(d["ic"])}</span><b>{d["n"]}</b>'
                f'<small>הון עצמי {d["eq"]} אלף · {d["time"]}</small><span class="more">לכל הפרטים {I("arrow")}</span></button>' for i, d in enumerate(DEALS))
def calc_html(d):
    if not d.get('calc'): return ''
    out = '<table class="calc">'
    for a, b in d['calc']:
        if a == 't': out += f'<tr class="ct"><td colspan="2">{b}</td></tr>'
        elif a == 'tot': out += f'<tr class="cg"><td colspan="2">{b}</td></tr>'
        else: out += f'<tr><td>{a}</td><td class="ltr">{b}</td></tr>'
    return out + '</table><p class="small" style="margin-top:6px">לפני מס, תחזוקה וחודשים בלי שוכר. להמחשה בלבד.</p>'
def risk(n): return '<span class="risk">' + ''.join(f'<i class="{"on" if k < n else ""}"></i>' for k in range(4)) + '</span>'
TPLS = ''.join(f'''<template id="tpl-deal{i}">
  <div class="ph-head"><div class="grab"></div><button class="x" data-close aria-label="סגירה">{I("x")}</button><h3 id="sheetTitle">{d["n"]}</h3><p>{d["what"]}</p></div>
  <div class="pbody">
    <div class="kpis"><div class="kpi"><span>הון עצמי</span><b>{d["eq"]} אלף</b></div><div class="kpi"><span>רווח משוער</span><b>{d["pr"]} אלף{"*" if d.get("star") else ""}</b></div><div class="kpi"><span>זמן</span><b style="font-size:24px">{d["time"]}</b></div></div>
    <div class="card" style="margin-bottom:12px"><b style="color:var(--blue-d)">דוגמה</b><p style="font-size:15.5px;margin-top:4px">{d["ex"]}</p>{calc_html(d)}</div>
    <ul class="dd">{''.join(f'<li class="y">{x}</li>' for x in d["y"])}{''.join(f'<li class="n">{x}</li>' for x in d["no"])}</ul>
    <p class="small">רמת סיכון: {risk(d["risk"])}</p>
    <div class="stack"><button class="btn" data-open="contact">{I("arrow")}לבדוק אם זה מתאים לנו</button></div>
    <p class="small" style="margin-top:12px">המספרים להמחשה בלבד, ואין בהם הבטחה לתשואה.</p>
  </div>
</template>
''' for i, d in enumerate(DEALS))

# ---------------- worksheet ----------------
def rows(items, cols):
    out = ''
    for it in items:
        lab, kind = (it if isinstance(it, tuple) else (it, ''))
        out += f'<tr class="{kind}"><td class="lbl">{lab}</td>' + '<td class="f"></td>' * (cols - 1) + '</tr>'
    return out
def tbl(heads, body):
    th = ''.join(f'<th{" class=n" if k else ""}>{h}</th>' for k, h in enumerate(heads))
    return f'<table class="ws"><thead><tr>{th}</tr></thead><tbody>{body}</tbody></table>'
WS = (
 '<div class="wcard"><div class="wt"><span class="wn">1</span>תקציב חודשי<small>₪ בחודש</small></div>'
 + tbl(['הכנסות', 'סכום'], rows(['שכר נטו (1)', 'שכר נטו (2)', 'הכנסות נוספות', ('סה"כ הכנסות', 'tot')], 2))
 + tbl(['הוצאות', 'סכום'], rows(['דיור (שכירות / משכנתא)', 'חשבונות: חשמל, מים, ארנונה', 'מזון וסופר', 'רכב ותחבורה', 'ביטוחים', 'אפליקציות, מנויים ותקשורת', 'יופי וטיפוח', 'בריאות ופארם', 'שירותים מקצועיים', 'פנאי ובילויים', 'חיסכון (בתחילת החודש!)', ('סה"כ הוצאות', 'tot')], 2))
 + '<div class="bal"><span>הכנסות פחות הוצאות</span><span class="blank"></span></div></div>'
 + '<div class="wcard"><div class="wt"><span class="wn">2</span>נכסים והתחייבויות<small>מה יש לנו, ואיפה</small></div>'
 + tbl(['נכסים', 'איפה', 'סכום'], rows(['עו"ש', 'קרן כספית / קרן חירום<small>לאובדן הכנסה, חל"ד מוארך, חל"ת ועוד</small>', 'גמל להשקעה / פוליסת חיסכון', 'קרן השתלמות', 'פנסיה (צבירה)', 'רכב', ('סה"כ נכסים', 'tot')], 3))
 + tbl(['התחייבויות', 'החזר חודשי', 'יתרה'], rows(['הלוואות', 'מינוס', 'תשלומים בכרטיס אשראי', ('סה"כ התחייבויות', 'tot')], 3))
 + '<div class="bal"><span>שווי נקי</span><span class="blank"></span></div></div>'
 + '<div class="wcard"><div class="wt"><span class="wn">3</span>מטרות וחיסכון<small><span class="frac"><span class="fr"><span class="nu">סכום יעד</span><span class="de">שנים × 12</span></span><span class="eq">= חיסכון חודשי</span></span></small></div>'
 + tbl(['מטרה', 'סכום יעד', 'תוך כמה שנים', 'חיסכון חודשי'], '<tr class="ex"><td class="lbl">דוגמה: חופשה</td><td>18,000</td><td>1.5</td><td>1,000</td></tr>' + rows(['קרן חירום', 'דירה', 'רכב', 'טיול', 'ילד ראשון'], 4)) + '</div>'
 + '<div class="wcard"><div class="wt"><span class="wn">4</span>ביטוחים<small>בודקים ב"הר הביטוח"</small></div>'
 + tbl(['סוג', 'חברה', 'פרמיה בחודש', 'כפילות?'], rows(['בריאות', 'חיים / ריסק', 'מחלות קשות', 'קופת חולים ומסלול (שב"ן)', 'דירה ותכולה', 'רכב', 'סיעודי'], 4)) + '</div>'
 + '<div class="wcard"><div class="wt"><span class="wn">5</span>ציר החיים שלנו<small>קודם דוגמה, ואז הציר שלכם</small></div>'
 + '<div class="tl-head"><span class="tlab">דוגמה</span><small>ככה זה יכול להיראות</small></div><div class="lt ex">'
 + ''.join(f'<div class="lr"><div class="ly">{y}</div><div class="ld"><span>{e}</span></div><div class="lc"><b>{n}</b>' + (f'<small>{s}</small>' if s else '') + '</div></div>' for e, n, y, s in [('💍', 'החתונה', '2026', 'היום'), ('✈️', 'טיול ראשון', '2027', 'חיסכון ייעודי'), ('🚗', 'רכב', '2028', 'בלי הלוואה יקרה'), ('🏠', 'דירה', '2030', 'הון עצמי מוכן'), ('👶', 'ילד ראשון', '2031', 'קרן חירום מלאה'), ('👶', 'ילד שני', '2034', '')])
 + '</div><div class="tl-head"><span class="tlab">הציר שלנו</span><small>כתבו שנה ותחנה</small></div><div class="lt mine">'
 + ''.join(f'<div class="lr in-row" data-r="{r}"><div class="ly"></div><div class="ld"><span>{r + 1}</span></div><div class="lc"></div></div>' for r in range(6))
 + '</div>'
 + '<div class="stack"><a class="btn wsend" href="' + WA + '" target="_blank" rel="noopener">' + I('wa') + 'שלחו לי את הסיכום בוואטסאפ</a></div>'
 + '<p class="saved">מה שתמלאו נשמר רק בטלפון שלכם. הכפתור שולח סיכום של הסכומים.</p></div>'
)

html = open(os.path.join(D, 'web.tpl.html'), encoding='utf-8').read()
rep = {'{{TASKS}}': ''.join(task_html(i, t) for i, t in enumerate(TASKS)), '{{EQ_ROWS}}': EQ, '{{PR_ROWS}}': PR,
       '{{DEAL_TILES}}': TILES, '{{DEAL_TPLS}}': TPLS, '{{WORKSHEET}}': WS,
       '{{JS}}': open(os.path.join(D, 'webapp.js'), encoding='utf-8').read(),
       '{{LOGO}}': img('logo_s.png', 'image/png'), '{{FACE}}': img('face_s.jpg', 'image/jpeg'), '{{WA}}': WA, '{{BOOK}}': 'https://moneyflow-ai.com/book/73f13f06-117d-4784-817d-d12000ae27a7'}
for k, v in rep.items(): html = html.replace(k, v)
html = re.sub(r'\{\{I:(\w+)\}\}', lambda m: I(m.group(1)), html)
assert '{{' not in html, html[html.index('{{'):html.index('{{') + 40]
open(OUT, 'w', encoding='utf-8').write(html)
print('ok', len(html) // 1024, 'KB')
