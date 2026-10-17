/* Copywriting: posts per channel / tone / campaign event + WhatsApp groups tracker */
'use strict';

const CHANNELS = [
  ['wa_group', 'וואטסאפ — קבוצות'], ['wa_private', 'וואטסאפ — אישי לקונה'], ['facebook', 'פייסבוק'], ['instagram', 'אינסטגרם'],
  ['portal', 'תיאור ליד2 / מדלן'], ['sms', 'SMS קצר'], ['owner', 'עדכון לבעלים'],
];
const TONES = [['pro', 'מקצועי'], ['warm', 'חם ומשפחתי'], ['lux', 'יוקרתי'], ['invest', 'למשקיעים'], ['urgent', 'הזדמנות / דחיפות']];
const EVENTS = [['launch', 'השקה — חדש בשוק'], ['teaser', 'בקרוב בשוק'], ['openhouse', 'בית פתוח'], ['pricedrop', 'מחיר מעודכן'], ['reminder', 'תזכורת / רענון'], ['feature', 'דגש על יתרון'], ['neighborhood', 'השכונה'], ['sold', 'נמכר / הושכר']];

function cxData(p, o) {
  const q = p.q, R = isRent(p), price = num(o.price) || askPrice(p);
  const hl = String(q.highlights || '').split('\n').map(s => s.trim()).filter(Boolean);
  const feats = featureList(q).filter(f => !keyFacts(q).includes(f));
  return {
    q, R, price,
    priceS: !isNaN(price) ? `${fmtN(price)} ₪${R ? ' לחודש' : ''}` : '',
    type: autoTitle(q), where: autoSub(q), city: q.city || '', hood: q.neighborhood || '',
    facts: keyFacts(q), hl, feats, near: (q.nearby || []).slice(0, 5),
    audience: (q.audience || [])[0] || '', entry: q.entryDate ? fmtDate(q.entryDate) : (q.entryFlex === 'גמיש' ? 'גמישה' : ''),
    agent: S.settings.agentName || '', phone: S.settings.phone || '', agency: S.settings.agency || ''
  };
}

/** emoji helper respects the toggle */
const E = (o, e) => o.emoji ? e + ' ' : '';
const B = (o, s) => o.wa ? `*${s}*` : s;

function hooks(d, o) {
  const t = o.tone, deal = d.R ? 'להשכרה' : 'למכירה';
  const H = {
    pro: [`${d.type} ${deal} ${d.where ? 'ב' + d.where.replace(/^שכונת /, 'שכונת ') : ''}`.trim(), `נכס חדש ${deal}: ${d.type}${d.city ? ' ב' + d.city : ''}`, `${d.facts.slice(0, 2).join(', ')} — ${d.where}`],
    warm: [`מחפשים בית שבאמת מרגישים בו בבית? 🏡`.replace(' 🏡', o.emoji ? ' 🏡' : ''), `הבית הבא של המשפחה שלכם${d.hood ? ' בשכונת ' + d.hood : ''} מחכה`, `כאן הילדים יגדלו, כאן תשתו קפה של שבת במרפסת`],
    lux: [`נכס יוקרה נדיר${d.city ? ' ב' + d.city : ''}`, `${d.type} ברמת גימור יוצאת דופן`, `למי שמחפש את הטוב ביותר${d.hood ? ' בשכונת ' + d.hood : ''}`],
    invest: [`הזדמנות השקעה${d.city ? ' ב' + d.city : ''}`, `${d.type} — תשואה, ביקוש ופוטנציאל השבחה`, `משקיעים? הנכס הזה עונה על כל הקריטריונים`],
    urgent: [`הזדמנות שלא תחזור${d.city ? ' ב' + d.city : ''}!`, `נכסים כאלה לא נשארים הרבה זמן בשוק`, `מי שמחכה — מפספס. ${d.type} ${deal}`],
  };
  return H[t] || H.pro;
}

function eventLine(d, o) {
  const dt = o.evDate ? new Date(o.evDate + 'T12:00:00') : null;
  const when = dt ? `${dt.toLocaleDateString('he-IL', { weekday: 'long' })} ${dt.toLocaleDateString('he-IL', { day: 'numeric', month: 'long' })}${o.evTime ? ', ' + o.evTime : ''}` : '[יום ותאריך, שעות]';
  return {
    launch: [`${E(o, '🆕')}${B(o, 'חדש בשוק!')}`, `${E(o, '✨')}${B(o, 'עלה עכשיו לשיווק')}`, `${E(o, '📢')}${B(o, 'בלעדי — לפני כולם')}`],
    teaser: [`${E(o, '👀')}${B(o, 'בקרוב בשוק')} — מי שנרשם עכשיו מקבל ביקור ראשון לפני הפרסום הרחב`, `${E(o, '⏳')}${B(o, 'עולה לשיווק בימים הקרובים')}`, `${E(o, '🔒')}${B(o, 'הצצה מוקדמת למאגר הלקוחות שלנו')}`],
    openhouse: [`${E(o, '🚪')}${B(o, 'בית פתוח')} — ${when}`, `${E(o, '📅')}${B(o, 'מוזמנים לבית פתוח')}: ${when}`, `${E(o, '🔑')}${B(o, 'בואו לראות בעיניים')} — ${when}`],
    pricedrop: [`${E(o, '📉')}${B(o, 'מחיר מעודכן!')}${num(o.oldPrice) ? ` (במקום ${fmtN(num(o.oldPrice))} ₪)` : ''}`, `${E(o, '💥')}${B(o, 'ירידת מחיר')} — עכשיו זה הזמן`, `${E(o, '🎯')}${B(o, 'הבעלים גמישים — מחיר חדש')}`],
    reminder: [`${E(o, '🔁')}${B(o, 'עדיין זמין')} — ועדיין אחד הנכסים הכי שווים באזור`, `${E(o, '📌')}${B(o, 'תזכורת')}: הנכס עוד מחכה לבעלים החדשים`, `${E(o, '⭐')}${B(o, 'למי שפספס')}`],
    feature: [`${E(o, '⭐')}${B(o, d.hl[0] || 'היתרון שעושה את ההבדל')}`, `${E(o, '💡')}${B(o, 'מה מיוחד בנכס הזה?')}`, `${E(o, '🎯')}${B(o, 'הפרט שכולם שואלים עליו')}`],
    neighborhood: [`${E(o, '📍')}${B(o, `למה לגור ${d.hood ? 'בשכונת ' + d.hood : 'כאן'}?`)}`, `${E(o, '🌳')}${B(o, 'לא רק דירה — אורח חיים')}`, `${E(o, '🏘')}${B(o, 'השכונה שכולם רוצים לגור בה')}`],
    sold: [`${E(o, '🎉')}${B(o, d.R ? 'הושכר!' : 'נמכר!')}`, `${E(o, '🔑')}${B(o, 'עוד משפחה קיבלה מפתח')}`, `${E(o, '✅')}${B(o, 'עסקה נסגרה בהצלחה')}`],
  }[o.event] || [''];
}

function bodyLines(d, o, v) {
  const L = [];
  const factIcon = f => !o.emoji ? '• ' : (/חדר/.test(f) ? '🛏 ' : /מ״ר/.test(f) && !/מרפסת|גינה/.test(f) ? '📐 ' : /קומה|קרקע/.test(f) ? '🏢 ' : /מרפסת|גינה/.test(f) ? '🌞 ' : /חני/.test(f) ? '🚗 ' : /מעלית/.test(f) ? '🛗 ' : /ממ״ד/.test(f) ? '🛡 ' : /מחסן/.test(f) ? '📦 ' : '✔ ');
  if (o.event === 'neighborhood') {
    if (d.near.length) L.push(`${d.near.map(n => (o.emoji ? '✔ ' : '• ') + n).join('\n')}`);
    if (d.q.locationNotes) L.push(d.q.locationNotes);
    L.push(`ובלב כל זה: ${d.type}, ${d.facts.slice(0, 3).join(', ')}.`);
    return L;
  }
  if (o.event === 'sold') {
    L.push(`${d.type} ${d.where ? 'ב' + d.where : ''} ${d.R ? 'הושכר' : 'נמכר'} ${o.soldDays ? `תוך ${o.soldDays} ימים` : 'בהצלחה'}${o.soldNote ? ' — ' + o.soldNote : ''}.`);
    L.push('תודה לבעלים על האמון, ובהצלחה לבעלים החדשים!');
    L.push(`${E(o, '💬')}שוקלים ${d.R ? 'להשכיר' : 'למכור'} נכס באזור? אשמח לבנות עבורכם ניתוח שוק ותכנית שיווק ללא התחייבות.`);
    return L;
  }
  if (o.event === 'feature' && d.hl.length) {
    L.push(d.hl.slice(0, v === 1 ? 2 : 1).join('\n'));
  }
  const factsBlock = d.facts.slice(0, o.channel === 'sms' ? 3 : 7).map(f => factIcon(f) + f).join('\n');
  if (v === 2 && d.hl.length && o.event !== 'feature') L.push(d.hl.slice(0, 3).map(h => (o.emoji ? '⭐ ' : '• ') + h).join('\n'));
  L.push(factsBlock);
  if (v !== 2 && d.hl.length && o.event !== 'feature') L.push(d.hl.slice(0, 2).map(h => (o.emoji ? '✨ ' : '– ') + h).join('\n'));
  if (o.tone === 'warm' && d.near.length) L.push(`${E(o, '📍')}קרוב ל${d.near.slice(0, 3).join(', ')}`);
  if (o.tone === 'invest') {
    const val = num(d.q.estValue);
    L.push(`${E(o, '📈')}ביקוש גבוה באזור${!d.R && d.q.renewal && d.q.renewal !== 'אין' && d.q.renewal !== 'בניין חדש / לא רלוונטי' ? ` · ${d.q.renewal}` : ''}${d.R && !isNaN(val) && !isNaN(d.price) ? ` · תשואה ברוטו ${fmtN(d.price * 12 / val * 100, 1)}%` : ''}`);
  }
  if (o.tone === 'lux' && d.feats.length) L.push(d.feats.slice(0, 4).join(' · '));
  if (d.entry) L.push(`${E(o, '📆')}כניסה: ${d.entry}`);
  if (o.showPrice && d.priceS) L.push(`${E(o, '💰')}${B(o, d.priceS)}`);
  return L;
}

function ctaLine(d, o, v) {
  const ph = d.phone ? ` ${d.phone}` : '';
  const sig = [d.agent, d.agency].filter(Boolean).join(' | ');
  const c = [
    `${E(o, '📞')}לפרטים ותיאום ביקור:${ph}${sig ? '\n' + sig : ''}`,
    `${E(o, '👈')}רוצים לראות? שלחו הודעה ואחזור אליכם עוד היום${ph ? ':' + ph : ''}${sig ? '\n' + sig : ''}`,
    `${E(o, '🔑')}מספר הביקורים מוגבל — תאמו עכשיו${ph ? ':' + ph : ''}${sig ? '\n' + sig : ''}`,
  ];
  if (o.event === 'openhouse') c[0] = `${E(o, '✍️')}ההגעה בהרשמה מראש בלבד${ph ? ':' + ph : ''}${sig ? '\n' + sig : ''}`;
  return c[v % 3] + (o.link ? `\n${E(o, '🔗')}${o.link}` : '');
}

function hashtags(d) {
  const tag = s => s.replace(/[()"'״׳.,]/g, '').trim().replace(/[\s-]+/g, '_'); const city = tag(d.city), hood = tag(d.hood);
  return ['#נדלן', d.R ? '#דירה_להשכרה' : '#דירה_למכירה', city && `#נדלן_${city}`, city && `#${d.R ? 'להשכרה' : 'למכירה'}_${city}`, hood && `#${hood}`, '#בית_חדש', '#נכס_חדש', d.R ? '#שכירות' : '#משפרי_דיור'].filter(Boolean).join(' ');
}

function genVariants(p, o) {
  const d = cxData(p, o), out = [];
  if (o.channel === 'owner') return ownerReports(p, d, o);
  if (o.channel === 'portal') return portalTexts(p, d, o);
  const wa = o.channel.startsWith('wa');
  const oo = { ...o, wa };
  for (let v = 0; v < 3; v++) {
    const ev = eventLine(d, oo)[v], hk = hooks(d, oo)[v];
    let parts;
    if (o.channel === 'sms') {
      parts = [`${o.event === 'openhouse' ? eventLine(d, { ...oo, emoji: false })[0].replace(/\*/g, '') : (o.event === 'launch' ? 'חדש בשוק: ' : '')}${d.type}${d.where ? ' ב' + d.where : ''}`, d.facts.slice(0, 3).join(', '), o.showPrice && d.priceS ? d.priceS : '', `${d.agent || ''} ${d.phone || ''}`.trim()].filter(Boolean);
      out.push(parts.join(' | ')); continue;
    }
    if (o.channel === 'wa_private') {
      parts = [`היי [שם] ${o.emoji ? '👋' : ''}`.trim(),
        v === 0 ? `נזכרתי בך כשעלה אצלי נכס שמתאים בדיוק למה שחיפשת:` : v === 1 ? `יש לי נכס חדש שעוד לא פורסם בשום מקום, ואני חושב/ת שהוא מאוד מתאים לך:` : `רציתי לעדכן אותך ראשון/ה לפני שזה יוצא לפרסום:`,
        `${B(oo, `${d.type}${d.where ? ' ב' + d.where : ''}`)}`, ...bodyLines(d, oo, v).slice(0, 2), o.showPrice && d.priceS ? `${E(oo, '💰')}${d.priceS}` : '',
        v === 2 ? 'מתי נוח לך לבוא לראות? יש לי חלונות מחר ומחרתיים.' : 'רוצה שאשלח עוד תמונות / סרטון, או לקבוע ביקור?'];
      out.push(parts.filter(Boolean).join('\n\n')); continue;
    }
    parts = [ev, o.event === 'launch' || o.event === 'reminder' || o.event === 'pricedrop' || o.event === 'teaser' ? B(oo, hk) : '', ...bodyLines(d, oo, v), ctaLine(d, oo, v)];
    let t = parts.filter(Boolean).join('\n\n');
    if (o.channel === 'instagram') t = t.replace(/\*/g, '') + '\n\n' + hashtags(d);
    if (o.channel === 'facebook' && v === 1) t += '\n\n' + hashtags(d).split(' ').slice(0, 4).join(' ');
    out.push(t);
  }
  return out;
}

function portalTexts(p, d, o) {
  const q = d.q;
  const title = `${d.type}${q.view && q.view !== 'ללא נוף מיוחד' ? ' עם ' + q.view : ''}${d.hood ? ' בשכונת ' + d.hood : ''}`;
  const long = [
    title, '',
    `${d.type} ${d.R ? 'להשכרה' : 'למכירה'}${d.where ? ' ב' + d.where : ''}. ${d.facts.join(', ')}.`,
    d.hl.length ? 'מה מיוחד בנכס:\n' + d.hl.map(h => '• ' + h).join('\n') : '',
    d.feats.length ? 'מפרט: ' + d.feats.join(', ') + '.' : '',
    d.near.length ? 'בסביבה: ' + d.near.join(', ') + '.' : '',
    q.locationNotes || '',
    d.entry ? `כניסה: ${d.entry}.` : '',
    q.arnona ? `ארנונה דו-חודשית: ${fmtN(q.arnona)} ₪.` : '', q.vaad ? `ועד בית: ${fmtN(q.vaad)} ₪.` : '',
    d.R && q.furnished ? `${q.furnished}.` : '', d.R && q.pets ? `חיות מחמד: ${q.pets === 'yes' ? 'מותר' : q.pets === 'no' ? 'אסור' : 'בתיאום'}.` : '',
    o.showPrice && d.priceS ? `מחיר: ${d.priceS}` : '',
    `לפרטים ותיאום: ${[d.agent, d.phone].filter(Boolean).join(' ')}`
  ].filter((x, i) => x !== '' || i === 1).join('\n');
  const short = `${title}. ${d.facts.slice(0, 5).join(', ')}.${d.hl[0] ? ' ' + d.hl[0] + '.' : ''}${o.showPrice && d.priceS ? ' ' + d.priceS + '.' : ''}`;
  const titles = [title, `${d.facts.slice(0, 2).join(' | ')} | ${d.hood || d.city}`, `${d.hl[0] || d.type} — ${d.city}`].join('\n');
  return [long, short, 'כותרות מוצעות למודעה:\n' + titles];
}

function ownerReports(p, d, o) {
  const pl = p.plan, day = pl ? Math.max(1, Math.floor((new Date(todayISO()) - new Date(pl.start)) / 864e5) + 1) : '';
  const name = (p.q.ownerName || '').split(' ')[0] || '[שם]';
  const next = pl ? pl.events.filter(e => !e.done && e.day >= day).slice(0, 3).map(e => `• ${e.title} (${fmtDate(addDays(pl.start, e.day - 1))})`).join('\n') : '';
  return [
    `שלום ${name} ${o.emoji ? '👋' : ''}\n\n${B({ wa: true }, `עדכון שבועי — ${shortAddr(p.q)}`)}${day ? ` (יום ${day} בקמפיין)` : ''}\n\n${o.emoji ? '👁 ' : ''}חשיפות למודעות: [__]\n${o.emoji ? '📞 ' : ''}פניות חדשות: [__]\n${o.emoji ? '🚪 ' : ''}ביקורים שהתקיימו: [__]\n${o.emoji ? '💬 ' : ''}משוב עיקרי מהמבקרים: [__]\n\n${B({ wa: true }, 'מה עשינו השבוע:')}\n• [__]\n\n${B({ wa: true }, 'השבוע הבא:')}\n${next || '• [__]'}\n\nאשמח לשאלות בכל שלב,\n${d.agent}`,
    `${name}, עדכון קצר ${o.emoji ? '🙂' : ''}\nהשבוע: [__] פניות, [__] ביקורים. המשוב הבולט: [__].\nבשבוע הבא מתוכנן: ${pl ? (pl.events.find(e => !e.done && e.day >= day)?.title || '[__]') : '[__]'}.\nנדבר ביום [__] לסיכום.`,
    `${B({ wa: true }, `נקודת בקרה — ${shortAddr(p.q)}`)}\n\nשלום ${name},\nלפי התכנית שסיכמנו, הגענו לנקודת בקרה.\n\nהנתונים: [__] פניות, [__] ביקורים, [__] הצעות.\nהשוק מסביב: [__] עסקאות חדשות באזור, [__] נכסים מתחרים.\n\nההמלצה שלי: [להמשיך כמו שזה / לרענן חומרים / לעדכן מחיר ל-__ ₪] — כי [__].\n\nבוא/י נקבע שיחה של 15 דקות להחלטה.`
  ];
}

function waHTML(t) { return esc(t).replace(/\*([^*\n]+)\*/g, '<b>$1</b>').replace(/_([^_\n]+)_/g, '<i>$1</i>'); }

function renderContent() {
  const p = P();
  p.content = { channel: 'wa_group', tone: 'pro', event: 'launch', emoji: true, showPrice: true, link: '', evDate: '', evTime: '', oldPrice: '', groups: [], ...(p.content || {}) };
  const o = p.content, vars = genVariants(p, o), wa = o.channel.startsWith('wa') || o.channel === 'owner';
  const today = todayISO();
  $('#view').innerHTML = `
  <div class="card-head"><div><h1>פוסטים והודעות וואטסאפ</h1><div class="muted">נוסחים מוכנים לכל ערוץ ולכל שלב בקמפיין — נבנים מנתוני השאלון. ערכו, העתיקו או שלחו ישירות.</div></div></div>
  <div class="split">
    <div class="card sticky">
      <h3>ערוץ</h3><div class="chips" id="cx-ch">${CHANNELS.map(([k, t]) => `<span class="chip ${o.channel === k ? 'on' : ''}" data-v="${k}">${t}</span>`).join('')}</div>
      ${o.channel !== 'owner' && o.channel !== 'portal' ? `<h3 style="margin-top:14px">שלב / אירוע</h3><div class="chips" id="cx-ev">${EVENTS.map(([k, t]) => `<span class="chip ${o.event === k ? 'on' : ''}" data-v="${k}">${t}</span>`).join('')}</div>
      <h3 style="margin-top:14px">טון</h3><div class="chips" id="cx-tone">${TONES.map(([k, t]) => `<span class="chip ${o.tone === k ? 'on' : ''}" data-v="${k}">${t}</span>`).join('')}</div>` : ''}
      <div class="fields" style="grid-template-columns:1fr;margin-top:14px">
        ${o.event === 'openhouse' ? `<label class="f"><span class="lbl">תאריך בית פתוח</span><input type="date" data-o="evDate" value="${esc(o.evDate)}"></label><label class="f"><span class="lbl">שעות</span><input data-o="evTime" value="${esc(o.evTime)}" placeholder="10:00–12:00"></label>` : ''}
        ${o.event === 'pricedrop' ? `<label class="f"><span class="lbl">מחיר קודם</span><input type="number" data-o="oldPrice" value="${esc(o.oldPrice)}"></label>` : ''}
        ${o.event === 'sold' ? `<label class="f"><span class="lbl">נמכר תוך (ימים)</span><input type="number" data-o="soldDays" value="${esc(o.soldDays)}"></label><label class="f"><span class="lbl">הערה (למשל: ״מעל המחיר המבוקש״)</span><input data-o="soldNote" value="${esc(o.soldNote)}"></label>` : ''}
        <label class="f"><span class="lbl">קישור (חוברת נכס / מודעה / וידאו)</span><input type="url" data-o="link" value="${esc(o.link)}" placeholder="https://"></label>
        <label class="row" style="gap:8px"><input type="checkbox" data-o="emoji" ${o.emoji ? 'checked' : ''}> אימוג׳י</label>
        <label class="row" style="gap:8px"><input type="checkbox" data-o="showPrice" ${o.showPrice ? 'checked' : ''}> הצגת מחיר</label>
      </div>
    </div>
    <div>
      <div class="grid ${vars.length > 2 ? 'g3' : 'g2'}" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr))">
        ${vars.map((t, i) => `<div class="card" style="margin:0;display:flex;flex-direction:column;gap:10px">
          <div class="row between"><b>נוסח ${i + 1}</b><small class="muted">${t.length} תווים</small></div>
          ${wa ? `<div class="wa-frame"><div class="wa-bubble" data-prev="${i}">${waHTML(t)}</div></div>` : ''}
          <textarea class="post" data-var="${i}" rows="10">${esc(t)}</textarea>
          <div class="row"><button class="btn sm primary" data-copy="${i}">⧉ העתקה</button>${wa || o.channel === 'sms' ? `<a class="btn sm wa" data-wa="${i}" target="_blank" rel="noopener">שליחה בוואטסאפ</a>` : ''}${o.channel === 'facebook' ? `<a class="btn sm" target="_blank" rel="noopener" href="https://www.facebook.com/">פתיחת פייסבוק</a>` : ''}</div>
        </div>`).join('')}
      </div>
      ${o.channel === 'instagram' || o.channel === 'facebook' ? `<div class="note" style="margin-top:12px">צרפו לפוסט את הגרפיקה מ<a href="#" data-tabgo="studio">סטודיו הגרפיקה</a> — לאינסטגרם פורמט 4:5, לסטורי 9:16.</div>` : ''}
    </div>
  </div>

  <div class="card" style="margin-top:16px">
    <div class="card-head"><div><h2>קבוצות הפצה (וואטסאפ / פייסבוק)</h2><small class="muted">רשימת הקבוצות של הנכס, מעקב מתי נשלח לכל קבוצה ותזכורת לרענון. בוואטסאפ ״שליחה״ פותחת את האפליקציה עם הנוסח — בוחרים שם את הקבוצה.</small></div>
      <button class="btn sm" id="gr-add">＋ קבוצה</button></div>
    ${o.groups.length ? `<div class="table-wrap"><table class="t"><thead><tr><th>קבוצה</th><th>פלטפורמה</th><th>קהל / אזור</th><th>קישור</th><th>נשלח לאחרונה</th><th>סטטוס</th><th></th></tr></thead><tbody>
      ${o.groups.map(g => { const days = g.last ? Math.floor((new Date(today) - new Date(g.last)) / 864e5) : null; const due = days == null || days >= (g.every || 7);
        return `<tr data-g="${g.id}"><td><input data-gk="name" value="${esc(g.name)}"></td>
        <td><select data-gk="platform">${['וואטסאפ', 'פייסבוק', 'טלגרם', 'אחר'].map(x => `<option ${g.platform === x ? 'selected' : ''}>${x}</option>`).join('')}</select></td>
        <td><input data-gk="area" value="${esc(g.area)}"></td>
        <td>${g.link ? `<a href="${esc(g.link)}" target="_blank" rel="noopener">פתיחה</a>` : `<input data-gk="link" placeholder="https://chat.whatsapp.com/…" value="">`}</td>
        <td>${g.last ? fmtDate(g.last) + ` <small class="muted">(לפני ${days} ימים)</small>` : '—'}</td>
        <td>${due ? '<span class="badge warn">לשלוח</span>' : '<span class="badge ok">עודכן</span>'}</td>
        <td class="row" style="flex-wrap:nowrap"><a class="btn sm wa" data-gsend="${g.id}" target="_blank" rel="noopener">שליחת נוסח 1</a><button class="btn sm" data-gdone="${g.id}">✓ נשלח</button><button class="btn ghost sm" data-gdel="${g.id}">✕</button></td></tr>`; }).join('')}
      </tbody></table></div>` : `<div class="note">הוסיפו את הקבוצות שבהן אתם מפרסמים: קבוצות שכונה, ״דירות ב${esc(p.q.city || 'עיר')}״, קבוצות מתווכים, קהילות הורים, קבוצות עולים ועוד. מומלץ לא לשלוח לאותה קבוצה יותר מפעם בשבוע — ובכל פעם בזווית אחרת.</div>`}
  </div>`;
  bindContent(p, vars);
}

function bindContent(p, vars) {
  const o = p.content, v = $('#view');
  v.querySelectorAll('[data-tabgo]').forEach(b => b.onclick = e => { e.preventDefault(); go(b.dataset.tabgo); });
  const pick = (sel, key) => $$(sel + ' .chip').forEach(c => c.onclick = () => { o[key] = c.dataset.v; touch(); renderContent(); });
  pick('#cx-ch', 'channel'); pick('#cx-ev', 'event'); pick('#cx-tone', 'tone');
  v.querySelectorAll('[data-o]').forEach(el => el.addEventListener('change', () => { o[el.dataset.o] = el.type === 'checkbox' ? el.checked : el.value; touch(); renderContent(); }));
  const cur = i => $(`[data-var="${i}"]`).value;
  v.querySelectorAll('[data-var]').forEach(ta => ta.addEventListener('input', () => {
    const i = ta.dataset.var, pv = $(`[data-prev="${i}"]`); if (pv) pv.innerHTML = waHTML(ta.value);
    const a = $(`[data-wa="${i}"]`); if (a) a.href = 'https://wa.me/?text=' + encodeURIComponent(ta.value);
  }));
  v.querySelectorAll('[data-copy]').forEach(b => b.onclick = () => copyText(cur(b.dataset.copy)));
  v.querySelectorAll('[data-wa]').forEach(a => a.href = 'https://wa.me/?text=' + encodeURIComponent(cur(a.dataset.wa)));
  $('#gr-add').onclick = () => { o.groups.push({ id: uid(), name: 'קבוצה חדשה', platform: 'וואטסאפ', area: p.q.city || '', link: '', last: '', every: 7 }); touch(); renderContent(); };
  v.querySelectorAll('tr[data-g]').forEach(tr => {
    const g = o.groups.find(x => x.id === tr.dataset.g);
    tr.querySelectorAll('[data-gk]').forEach(el => el.addEventListener('change', () => { g[el.dataset.gk] = el.value; touch(); if (el.dataset.gk === 'link') renderContent(); }));
  });
  v.querySelectorAll('[data-gsend]').forEach(a => {
    const g = o.groups.find(x => x.id === a.dataset.gsend);
    const text = $('[data-var="0"]')?.value || vars[0] || '';
    a.href = g.platform === 'וואטסאפ' ? 'https://wa.me/?text=' + encodeURIComponent(text) : (g.link || '#');
    a.addEventListener('click', () => { if (g.platform !== 'וואטסאפ') copyText(text); g.last = todayISO(); touch(); setTimeout(renderContent, 300); });
  });
  v.querySelectorAll('[data-gdone]').forEach(b => b.onclick = () => { o.groups.find(x => x.id === b.dataset.gdone).last = todayISO(); touch(); renderContent(); });
  v.querySelectorAll('[data-gdel]').forEach(b => b.onclick = () => { o.groups = o.groups.filter(x => x.id !== b.dataset.gdel); touch(); renderContent(); });
}
