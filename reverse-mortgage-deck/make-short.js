// Builds the 5-page landscape edition and the stand-alone roadmap page, reusing deck.html's styles/icons.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const deck = fs.readFileSync('deck.html', 'utf8');
const head = deck.slice(0, deck.indexOf('<!-- ═════════ 1 · COVER'));
const FOOT = `<svg class="corner r"><use href="#corner"/></svg><svg class="corner l"><use href="#corner"/></svg>
<div class="foot"><div class="brand"><img src="logo.png" alt="MAKE SENSE"><span>שיראל פרגר – יועץ משכנתאות | MAKESENSE</span></div>
<img class="sig" src="signature.png" alt=""><img class="member" src="member.png" alt=""></div>`;
const jobs = [['short-body.html', 'משכנתה-הפוכה-5-עמודים.pdf'], ['roadmap-body.html', 'מפת-דרך-משכנתה-הפוכה.pdf']];
(async () => {
  const b = await chromium.launch();
  for (const [src, out] of jobs) {
    fs.writeFileSync('_r.html', head + fs.readFileSync(src, 'utf8').replaceAll('<!--FOOT-->', FOOT) + '</body></html>');
    const p = await b.newPage();
    await p.goto('file://' + path.resolve('_r.html'), { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.pdf({ path: out, printBackground: true, preferCSSPageSize: true });
    await p.close();
  }
  await b.close();
  fs.unlinkSync('_r.html');
})();
