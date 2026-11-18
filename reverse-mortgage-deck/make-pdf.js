// Builds the reverse-mortgage deck PDF: injects the shared footer into every page, prints with Chromium.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const FOOT = `<svg class="corner r"><use href="#corner"/></svg><svg class="corner l"><use href="#corner"/></svg>
<div class="foot">
  <div class="brand"><img src="logo.png" alt="MAKE SENSE"><span>שיראל פרגר – יועץ משכנתאות | MAKESENSE</span></div>
  <img class="sig" src="signature.png" alt="איתכם לכל הדרך, שיראל">
  <img class="member" src="member.png" alt="חבר בהתאחדות יועצי המשכנתאות">
</div>`;
(async () => {
  fs.writeFileSync('_render.html', fs.readFileSync('deck.html', 'utf8').replaceAll('<!--FOOT-->', FOOT));
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file://' + path.resolve('_render.html'), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: 'משכנתה-הפוכה-MAKESENSE.pdf', printBackground: true, preferCSSPageSize: true });
  await b.close();
  fs.unlinkSync('_render.html');
})();
