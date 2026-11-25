const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const dir = process.argv[2], scale = +(process.argv[3] || 1);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: scale });
  await p.goto('file://' + path.join(dir, 'wedding-guide.html'), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  // overflow check: card grid must end above the CTA/end block
  const info = await p.evaluate(() => [...document.querySelectorAll('.page')].map(pg => {
    const r = pg.getBoundingClientRect(); let maxB = 0, over = [];
    pg.querySelectorAll('.card,.cta,.end,.tl,.money,.emerg,.dd,.steps,.scen,.race,.nextp,.grid4').forEach(e => { const b = e.getBoundingClientRect().bottom - r.top; if (b > r.height + 0.5) over.push(e.className); maxB = Math.max(maxB, b); });
    const g = pg.querySelector('.grid,.grid2,.scen,.dd'), c = pg.querySelector('.cta,.end,.nextp');
    return { h: r.height, gridBottom: g ? g.getBoundingClientRect().bottom - r.top : null, ctaTop: c ? c.getBoundingClientRect().top - r.top : null, ctaBottom: c ? c.getBoundingClientRect().bottom - r.top : null, over };
  }));
  console.log(JSON.stringify(info));
  const pages = await p.$$('.page');
  for (let i = 0; i < pages.length; i++) await pages[i].screenshot({ path: path.join(dir, `page${i + 1}.png`) });
  await p.pdf({ path: path.join(dir, 'wedding-guide.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
  await b.close();
})();
