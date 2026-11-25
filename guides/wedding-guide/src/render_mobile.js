// Renders wedding-guide-mobile.html into a single long, phone-width PDF + preview PNGs.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const dir = process.argv[2];
  const W = 340;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: W, height: 800 }, deviceScaleFactor: 2 });
  await p.goto('file://' + path.join(dir, 'wedding-guide-mobile.html'), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const H = await p.evaluate(() => Math.ceil(document.documentElement.scrollHeight));
  const wide = await p.evaluate(() => [...document.querySelectorAll('body *')]
    .filter(e => e.getBoundingClientRect().right > document.documentElement.clientWidth + 1 || e.getBoundingClientRect().left < -1)
    .slice(0, 8).map(e => e.className + ' ' + Math.round(e.getBoundingClientRect().left) + '..' + Math.round(e.getBoundingClientRect().right)));
  console.log(JSON.stringify({ height: H, overflowX: wide }));
  await p.addStyleTag({ content: `@page{size:${W}px ${H}px;margin:0}` });
  await p.pdf({ path: path.join(dir, 'wedding-guide-mobile.pdf'), width: `${W}px`, height: `${H}px`, printBackground: true, preferCSSPageSize: true });
  const pages = await p.$$('.page');
  for (let i = 0; i < pages.length; i++) await pages[i].screenshot({ path: path.join(dir, 'src', `m${i + 1}.png`) });
  await b.close();
})();
