// Renders the ad in Facebook feed (4:5) and square (1:1) sizes.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  for (const [w, h, out] of [[1080, 1350, 'ad-1080x1350.png'], [1080, 1080, 'ad-1080x1080.png']]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto(`file://${path.resolve('ad.html')}?w=${w}&h=${h}`, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: out });
    await p.close();
  }
  await b.close();
})();
