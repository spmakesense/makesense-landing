// node render.js [fps] [preview-seconds...]  → reverse-mortgage.mp4 (or preview PNGs)
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
(async () => {
  const fps = +process.argv[2] || 30;
  const shots = process.argv.slice(3).map(Number);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.resolve('video.html'));
  await p.evaluate(() => document.fonts.ready);
  const dur = await p.evaluate(() => window.DURATION);
  const seek = t => p.evaluate(ms => document.getAnimations().forEach(a => { a.pause(); a.currentTime = ms; }), t * 1000);
  if (shots.length) {
    for (const t of shots) { await seek(t); await p.screenshot({ path: `preview_${t}.png` }); }
    return b.close();
  }
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', fps, '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'medium', '-movflags', '+faststart', 'reverse-mortgage.mp4'], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round(dur * fps);
  for (let i = 0; i < n; i++) {
    await seek(i / fps);
    const buf = await p.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 300 === 0) console.log(`frame ${i}/${n}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await b.close();
  console.log('done');
})();
