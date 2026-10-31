// Renders brochure.html into:
//   out/makesense-brochure-print.pdf  - 2 pages (side A, side B), 166x366mm = 160x360 trim + 3mm bleed
//   out/preview-sideA.png / sideB.png - trimmed sides with red fold guides
//   out/slides/A1..B4.png             - each 160x90 (16:9) slide on its own
// Usage (from repo root): node brochure/render.js [html=brochure.html] [outdir=out]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const dir = __dirname, out = path.join(dir, process.argv[3] || 'out');
  fs.mkdirSync(path.join(out, 'slides'), { recursive: true });
  const url = 'file://' + path.join(dir, process.argv[2] || 'brochure.html');
  const browser = await chromium.launch();

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: path.join(out, 'makesense-brochure-print.pdf'), width: '166mm', height: '366mm', printBackground: true, preferCSSPageSize: true });
  const overflow = await page.evaluate(() => [...document.querySelectorAll('.slide')].map(s => ({ id: s.id, over: Math.round(s.scrollHeight - s.clientHeight) })).filter(x => x.over > 1));
  console.log('overflowing slides:', JSON.stringify(overflow));

  const prev = await browser.newPage({ deviceScaleFactor: 2.5 });
  await prev.goto(url, { waitUntil: 'networkidle' });
  await prev.evaluate(() => { document.body.classList.add('preview'); return document.fonts.ready; });
  for (const id of ['sideA', 'sideB']) await prev.locator('#' + id).screenshot({ path: path.join(out, `preview-${id}.png`) });

  await prev.evaluate(() => document.body.classList.add('slides'));
  for (const [side, ids] of [['sideA', ['A1', 'A2', 'A3', 'A4']], ['sideB', ['B1', 'B2', 'B3', 'B4']]]) {
    await prev.evaluate(() => window.scrollTo(0, 0));
    const box = await prev.locator('#' + side).boundingBox();
    const h = box.height / 4;
    for (let i = 0; i < 4; i++) {
      await prev.screenshot({ path: path.join(out, 'slides', `${ids[i]}.png`), fullPage: true, clip: { x: box.x, y: box.y + i * h, width: box.width, height: h } });
    }
  }
  await browser.close();
  console.log('done');
})();
