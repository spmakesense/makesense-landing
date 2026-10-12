const { chromium } = require('playwright');
(async () => {
  const S = process.argv[2];
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 3.125 });
  await p.goto('file://' + S + '/flyer.html'); await p.waitForTimeout(300);
  const over = await p.evaluate(() => { const pg = document.querySelector('.page'); return [...pg.children].map(e => e.getBoundingClientRect().bottom).reduce((a, c) => Math.max(a, c), 0); });
  console.log('content bottom px', over, 'of 1123');
  await p.screenshot({ path: S + '/flyer.png' });
  await p.pdf({ path: S + '/flyer.pdf', format: 'A4', printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } });
  await b.close();
})();
