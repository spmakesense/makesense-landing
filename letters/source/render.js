// usage: node render.js <dir> <name>   -> <dir>/<name>.pdf, <dir>/<name>.png
const { chromium } = require('playwright');
(async () => {
  const [S, N] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 3.125 });
  await p.goto('file://' + S + '/' + N + '.html'); await p.waitForTimeout(300);
  const sh = await p.evaluate(() => document.body.scrollHeight);
  const over = await p.evaluate(() => [...document.querySelectorAll('.page *')].filter(e => { const r = e.getBoundingClientRect(); return r.bottom > 1123 - 30 && r.height > 0; }).length);
  console.log(N, 'scrollHeight', sh, 'elements in bottom 30px:', over);
  await p.screenshot({ path: S + '/' + N + '.png' });
  await p.pdf({ path: S + '/' + N + '.pdf', format: 'A4', printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } });
  await b.close();
})();
