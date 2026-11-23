const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + path.resolve('checklist.html'), { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: '10-דברים-לבדוק-עם-ההורים.pdf', printBackground: true, preferCSSPageSize: true }); await b.close(); })();
