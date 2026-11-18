const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file://' + path.resolve('guide.html'), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: 'משכנתה-הפוכה-מדריך.pdf', format: 'A4', printBackground: true, preferCSSPageSize: true });
  await b.close();
})();
