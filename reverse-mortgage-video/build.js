// Generates video.html — an 1920x1080 timeline of CSS animations.
// render.js steps through it frame by frame and pipes frames to ffmpeg.
const fs = require('fs');
const b64 = f => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
const PHOTO = b64('shiral.png'), LOGO = b64('logo.png'), MEMBER = b64('member.png');

const PHONE = '052-441-5395';
let T = 0;                       // running scene start time (seconds)
const scenes = [];
// a(name, at, dur) → inline animation attr, `at` relative to scene start
// Voiceover: each scene is stretched to fit its narration clip (vo/durations.json),
// and in-scene reveal times are scaled by the same factor so they follow the speech.
const VO = fs.existsSync('vo/durations.json') ? JSON.parse(fs.readFileSync('vo/durations.json', 'utf8')) : [];
const VO_LEAD = 0.4, VO_TAIL = 0.9;
const voStarts = [];
function scene(base, build) {
  const s = T, i = scenes.length;
  const dur = Math.max(base, VO[i] ? VO[i] + VO_LEAD + VO_TAIL : 0);
  const k = dur / base;
  voStarts.push(+(s + VO_LEAD).toFixed(2));
  const a = (name, at, d = 0.7) => `animation:${name} ${d}s cubic-bezier(.2,.8,.2,1) ${(s + Math.min(at * k, dur - 1.5)).toFixed(2)}s both`;
  scenes.push(`<section class="scene" style="animation:sIn .5s ease ${s}s both, sOut .5s ease ${(s + dur - .5).toFixed(2)}s forwards">${build(a, s)}</section>`);
  T += dur;
}

const ic = {
  home: `<svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/></svg>`,
  user: `<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>`,
  cash: `<svg viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></svg>`,
  cal: `<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>`,
  heart: `<svg viewBox="0 0 24 24"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/></svg>`,
  alert: `<svg viewBox="0 0 24 24"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h0"/></svg>`,
  check: `<svg viewBox="0 0 24 24"><path d="M4 12.5 9.5 18 20 6"/></svg>`,
  bank: `<svg viewBox="0 0 24 24"><path d="M3 10 12 4l9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18"/></svg>`,
  shield: `<svg viewBox="0 0 24 24"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/></svg>`,
  phone: `<svg viewBox="0 0 24 24"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg>`,
};

const qHead = (n, q, a) => `
  <div class="qtag" style="${a('fadeUp', .2)}">שאלה ${n} <span>מתוך 6</span></div>
  <h2 class="qtitle" style="${a('fadeUp', .45)}">${q}</h2>
  <div class="dots" style="${a('fade', .3)}">${[1,2,3,4,5,6].map(i => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</div>`;
const bullets = (a, items, start = 1.6, gap = 1.5) => `<ul class="bul">${items.map((t, i) =>
  `<li style="${a('slideL', start + i * gap)}"><b>${ic.check}</b><span>${t}</span></li>`).join('')}</ul>`;
const note = (a, at, t) => `<div class="note" style="${a('fade', at)}">${t}</div>`;

// ── 1. Hook (5s)
scene(5, a => `
  <div class="bg-royal"></div>
  <div class="center">
    <p class="kicker" style="${a('fadeUp', .2)}">יש לכם דירה בבעלותכם?</p>
    <p class="kicker2" style="${a('fadeUp', 1.0)}">והיא שווה הרבה… אבל אין לכם נזילות?</p>
    <h1 class="mega" style="${a('pop', 2.2, .8)}">משכנתה <em>הפוכה</em></h1>
    <div class="bar" style="${a('grow', 2.8, .8)}"></div>
    <p class="aka" style="${a('fadeUp', 3.2)}">(או בשמה השני: משכנתה לגיל השלישי)</p>
  </div>`);

// ── 2. Intro (6s)
scene(6, a => `
  <div class="bg-white"></div>
  <img class="hero" src="${PHOTO}" style="${a('slideR', .1, 1)}">
  <div class="intro">
    <p class="small-royal" style="${a('fadeUp', .4)}">נעים מאוד,</p>
    <h1 class="name" style="${a('fadeUp', .7)}">שיראל פרגר</h1>
    <p class="role" style="${a('fadeUp', 1.1)}">יועץ משכנתאות &nbsp;|&nbsp; MAKE SENSE</p>
    <div class="pill" style="${a('pop', 2.2)}">6 השאלות החשובות על משכנתה הפוכה</div>
    <p class="sub" style="${a('fadeUp', 3.0)}">כל מה שצריך לדעת לפני שמחליטים — בפחות מ-2 דקות</p>
  </div>`);

// ── Q1 (11s)
scene(11, a => `<div class="bg-off"></div>${qHead(1, 'מה זו בעצם משכנתה הפוכה?', a)}
  <div class="row">
    <div class="col">${bullets(a, [
      'הלוואה בשעבוד הדירה שבבעלותכם — <b>כבר מגיל 55</b>',
      'ממשיכים לגור בבית — <b>הדירה נשארת רשומה על שמכם</b>',
      '<b>סכום חד-פעמי</b>, <b>קצבה חודשית</b> — או <b>גם וגם</b>',
      'ללא חובת החזר חודשי של קרן — הפירעון בסוף הדרך',
    ])}</div>
    <div class="art">
      <div class="house" style="${a('pop', 1.0)}">${ic.home}</div>
      <div class="coin c1" style="${a('coin', 2.4, 1.2)}">₪</div>
      <div class="coin c2" style="${a('coin', 3.2, 1.2)}">₪</div>
      <div class="coin c3" style="${a('coin', 4.0, 1.2)}">₪</div>
      <p class="artcap" style="${a('fade', 4.6)}">ההון שבקירות → כסף נזיל</p>
    </div>
  </div>`);

// ── Q2 (10s)
scene(10, a => `<div class="bg-off"></div>${qHead(2, 'מי יכול לקבל משכנתה הפוכה?', a)}
  <div class="cards">
    ${[[ic.user, 'גיל 55 ומעלה', 'הגיל של בן/בת הזוג הצעיר/ה הוא שקובע'],
       [ic.home, 'דירה בבעלותכם', 'רשומה בטאבו / רמ"י, בה אתם גרים'],
       [ic.bank, 'משכנתה קיימת?', 'אפשר — סוגרים אותה מתוך ההלוואה החדשה']]
      .map(([i, t, d], k) => `<div class="card" style="${a('fadeUp', 1.6 + k * 1.3)}"><b>${i}</b><h3>${t}</h3><p>${d}</p></div>`).join('')}
  </div>
  <div class="ins">
    <div class="chip ok" style="${a('pop', 6.0)}">${ic.check}<span><b>פטור</b> מביטוח חיים</span></div>
    <div class="chip must" style="${a('pop', 6.8)}">${ic.alert}<span><b>חובה</b> ביטוח מבנה</span></div>
  </div>`);

// ── Q3 (12s)  (illustrative LTV by age)
const ltv = [[55, 15], [60, 20], [65, 25], [70, 30], [75, 40], ['80+', 50]];
scene(12, a => `<div class="bg-off"></div>${qHead(3, 'כמה כסף אפשר לקבל?', a)}
  <div class="row">
    <div class="col">${bullets(a, [
      'הסכום נקבע לפי <b>הגיל</b> ולפי <b>שווי הנכס</b>',
      'ככל שהגיל גבוה יותר — שיעור המימון עולה, <b>עד 50% משווי הנכס</b>',
      '<b>חד-פעמי</b>, <b>קצבה חודשית</b> או <b>שילוב של שניהם</b>',
      'לדוגמה: דירה בשווי 3 מיליון ₪, גיל 70 → <b>כ-900 אלף ₪</b>',
    ], 1.6, 1.7)}</div>
    <div class="chart">
      ${ltv.map(([age, p], k) => `<div class="cb"><div class="cv" style="height:${p * 9}px;${a('growUp', 1.8 + k * .35, .9)}"><span>${p}%</span></div><label>${age}</label></div>`).join('')}
      <p class="chartcap" style="${a('fade', 4)}">שיעור מימון לפי גיל — להמחשה בלבד</p>
    </div>
  </div>`);

// ── Q4 (12s)
scene(12, a => `<div class="bg-off"></div>${qHead(4, 'צריך להחזיר כל חודש?', a)}
  <div class="row">
    <div class="col">${bullets(a, [
      '<b>לא חובה.</b> הריבית מצטרפת לקרן ונצברת לאורך השנים',
      'הפירעון — במכירת הדירה, במעבר לדיור מוגן או לאחר פטירה',
      'רוצים לצמצם את הצבירה? אפשר לבחור <b>לשלם ריבית שוטפת</b>',
      'חשוב להבין: <b>ריבית דריבית</b> מגדילה את החוב עם הזמן',
    ], 1.6, 1.7)}</div>
    <div class="growth">
      ${[['היום', 25], ['5 שנים', 34], ['10 שנים', 46], ['15 שנים', 62]].map(([l, w], k) =>
        `<div class="gr"><label>${l}</label><div class="gt"><div class="gv" style="width:${w}%;${a('growX', 2 + k * .6, 1)}"></div></div></div>`).join('')}
      <p class="chartcap" style="${a('fade', 4.6)}">יתרת החוב ללא תשלום ריבית שוטף — להמחשה</p>
    </div>
  </div>`);

// ── Q5 (11s)
scene(11, a => `<div class="bg-off"></div>${qHead(5, 'ומה קורה עם הדירה והירושה?', a)}
  <div class="cards">
    ${[[ic.home, 'הדירה שלכם', 'נשארת בבעלותכם, ואתם ממשיכים לגור בה כל החיים'],
       [ic.heart, 'היורשים בוחרים', 'לפרוע את ההלוואה ולשמור על הדירה — או למכור ולפרוע מהתמורה'],
       [ic.shield, 'היתרה — למשפחה', 'כל מה שנשאר אחרי פירעון החוב עובר ליורשים']]
      .map(([i, t, d], k) => `<div class="card" style="${a('fadeUp', 1.6 + k * 1.4)}"><b>${i}</b><h3>${t}</h3><p>${d}</p></div>`).join('')}
  </div>
  ${note(a, 6.4, 'בחלק מהמסלולים יש התחייבות שהחוב לא יעלה על שווי הנכס — בודקים את זה מראש')}`);

// ── Q6 (11s)
scene(11, a => `<div class="bg-off"></div>${qHead(6, 'על מה חשוב לשים לב?', a)}
  <div class="grid4">
    ${[['ריבית ומסלול', 'קבועה או משתנה, צמודה או לא — ההבדל בסוף הדרך עצום'],
       ['עמלות ועלויות', 'עמלת פתיחה, שמאות, ביטוחים ועמלת פירעון מוקדם'],
       ['השפעה על הירושה', 'כמה יישאר לילדים בעוד 10 ו-20 שנה?'],
       ['שיתוף המשפחה', 'החלטה כזו כדאי לקבל יחד עם הילדים']]
      .map(([t, d], k) => `<div class="tile" style="${a('pop', 1.6 + k * 1.1)}"><b>${ic.alert}</b><div><h3>${t}</h3><p>${d}</p></div></div>`).join('')}
  </div>`);

// ── Why an advisor (10s)
scene(10, a => `
  <div class="bg-royal"></div>
  <div class="why">
    <h2 class="wtitle" style="${a('fadeUp', .2)}">למה לבדוק את זה איתי?</h2>
    <p class="wsub" style="${a('fadeUp', .7)}">התנאים בין הגופים המממנים שונים מאוד — ואני עובד מול כולם</p>
    <div class="lenders">
      ${['בנקים', 'חברות ביטוח', 'גופים חוץ-בנקאיים'].map((t, k) => `<div class="lender" style="${a('pop', 1.6 + k * .5)}">${ic.bank}<span>${t}</span></div>`).join('')}
    </div>
    <div class="arrow" style="${a('growUp', 3.4, .6)}"></div>
    <div class="you" style="${a('pop', 3.9)}">${ic.check}<span>ההצעה הנכונה <b>למשפחה שלכם</b></span></div>
    <ul class="wl">
      ${['השוואת ריביות ושיעורי מימון', 'בניית מסלול שמתאים לצורך — חד-פעמי או חודשי', 'ליווי מלא עד קבלת הכסף']
        .map((t, k) => `<li style="${a('fadeUp', 5 + k * .8)}">${ic.check}${t}</li>`).join('')}
    </ul>
  </div>`);

// ── CTA (9s)
scene(9, a => `
  <div class="bg-white"></div>
  <img class="hero" src="${PHOTO}" style="${a('slideR', .1, 1)}">
  <div class="intro">
    <img class="logo" src="${LOGO}" style="${a('fade', .3)}">
    <h2 class="cta" style="${a('fadeUp', .8)}">רוצים לדעת כמה <em>אתם</em> יכולים לקבל?</h2>
    <p class="sub" style="${a('fadeUp', 1.4)}">בדיקת התאמה ראשונית — ללא התחייבות</p>
    <div class="phone" style="${a('pop', 2.2)}">${ic.phone}<span dir="ltr">${PHONE}</span></div>
    <p class="name2" style="${a('fadeUp', 2.8)}">שיראל פרגר | יועץ משכנתאות</p>
    <img class="member" src="${MEMBER}" style="${a('fade', 3.4)}">
    <p class="disc" style="${a('fade', 3.8)}">המידע בסרטון כללי ואינו מהווה ייעוץ או הצעה. הנתונים להמחשה בלבד; תנאי ההלוואה, שיעורי המימון והריביות משתנים בין הגופים המממנים ונתונים לאישורם.</p>
  </div>`);

const css = fs.readFileSync('style.css', 'utf8');
fs.writeFileSync('video.html', `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;800;900&display=block" rel="stylesheet">
<style>${css}</style></head><body><div id="stage">${scenes.join('\n')}
<div class="brand">${'MAKE SENSE'} · שיראל פרגר</div></div>
<script>window.DURATION=${T};</script></body></html>`);
fs.writeFileSync('vo/starts.json', JSON.stringify(voStarts));
console.log('video.html written, duration', T, 's');
