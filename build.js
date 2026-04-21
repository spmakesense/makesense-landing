const fs = require('fs');

const LOGO  = 'data:image/jpeg;base64,' + fs.readFileSync('./logo_b64.txt',  'utf8');
const PHOTO = 'data:image/png;base64,'  + fs.readFileSync('./photo_b64.txt', 'utf8');
const HFCA  = 'data:image/png;base64,'  + fs.readFileSync('G:/האחסון שלי/תהליך השירות/הוצלא/MAKESENSE Logo/חבר-התאחדות.png').toString('base64');
const GUIDE = 'data:application/pdf;base64,' + fs.readFileSync('G:/האחסון שלי/תהליך השירות/מדריכים/תרשים תהליך מחזור משכנתה.pdf').toString('base64');

// ── Lucide-style inline SVG helpers ──────────────────────────
const icons = {
  clock:     `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  alert:     `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  file:      `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  building:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>`,
  shield:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  zap:       `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  lock:      `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>`,
  award:     `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`,
  home:      `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  chart:     `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`,
  hourglass: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 00-.586-1.414L12 12l-4.414 4.414A2 2 0 007 17.828V22M7 2v4.172a2 2 0 00.586 1.414L12 12l4.414-4.414A2 2 0 0017 6.172V2"/></svg>`,
  bulb:      `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 018.91 14"/></svg>`,
  scale:     `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="3" x2="12" y2="21"/><path d="M19 9H5M5 15h14M3 21h18M5 9a7 7 0 0014 0"/></svg>`,
  users:     `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`,
  dollar:    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`,
  ban:       `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`,
  wallet:    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>`,
  refresh:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>`,
  user:      `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  help:      `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  star:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  check:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  msgCircle: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`,
  creditCard:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
  frown:     `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  phone:     `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 0 0 0 .18 2 2 0 012 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`,
  arrowLeft: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
  handshake: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/></svg>`,
  eye:       `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  calCheck:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M9 16l2 2 4-4"/></svg>`,
  siren:     `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.07 4.93A10 10 0 006.99 3.34"/><path d="M4 6l1.06 1.06"/><path d="M17.32 17.32A10 10 0 0120.66 17"/><path d="M18 20l-1.06-1.06"/><circle cx="12" cy="13" r="3"/><path d="M12 2v3M12 21v-3M2 12h3M21 12h-3"/></svg>`,
  external:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
  wa: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.531 5.846L.057 23.157c-.08.292.195.558.483.464l5.453-1.721A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.012-1.37l-.359-.213-3.723 1.174 1.187-3.63-.233-.371A9.818 9.818 0 0112 2.182c5.428 0 9.818 4.39 9.818 9.818S17.428 21.818 12 21.818z"/></svg>`,
};

const html = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>שיראל פרגר | MAKE SENSE — עד 30.6.26 אתה יכול לאחד. אחרי — לא.</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<style>
:root{
  --royal:#0d21a1;--royal-d:#081890;--royal-l:#1a33c8;
  --amber:#FF9D00;--amber-d:#e08800;--amber-l:#ffb733;
  --white:#ffffff;--off:#f9fafb;--g50:#f4f5f7;--g100:#eef0f2;
  --g200:#dde0e6;--g400:#9ca3af;--g600:#6b7280;--g800:#1f2937;
  --onyx:#141414;--red-bg:#fef2f2;--red:#dc2626;--green:#16a34a;
  --r:8px;--r-md:16px;--r-lg:24px;--r-xl:40px;
  --sh-xs:0 1px 3px rgba(0,0,0,.07);
  --sh-sm:0 2px 12px rgba(13,33,161,.08);
  --sh-md:0 8px 32px rgba(13,33,161,.13);
  --sh-lg:0 20px 60px rgba(13,33,161,.18);
  --sh-amber:0 8px 28px rgba(255,157,0,.35);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
body{font-family:'Arial','Helvetica',sans-serif;background:#fff;color:var(--onyx);direction:rtl;text-align:right;overflow-x:hidden;line-height:1.6}
h1,h2,h3,.hero h1,.sec-h{font-family:'Arial','Helvetica',sans-serif}
a{color:inherit;text-decoration:none} img{max-width:100%;display:block} button{cursor:pointer;border:none;outline:none;font-family:inherit}
.container{max-width:1140px;margin:0 auto;padding:0 24px}

/* icon utility */
.icon{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}
.icon svg{display:block}

/* ── PROGRESS ─────────────────────────────────────── */
#pb{position:fixed;top:0;right:0;height:3px;background:linear-gradient(90deg,var(--amber),#ff6b00);z-index:2000;width:0;box-shadow:0 0 8px rgba(255,157,0,.6);transition:width .5s linear}

/* ── TICKER ───────────────────────────────────────── */
.ticker{background:var(--onyx);color:#fff;padding:9px 0;font-size:14px;font-weight:600;position:sticky;top:3px;z-index:1000}
.ticker-inner{display:flex;align-items:center;justify-content:center;gap:10px;white-space:nowrap;flex-wrap:wrap}
.ticker .t-dot{width:8px;height:8px;background:#ef4444;border-radius:50%;animation:blink 1s infinite;flex-shrink:0}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
.ticker b{color:var(--amber)}
.ticker .t-icon svg{stroke:#ef4444}

/* ── NAVBAR ───────────────────────────────────────── */
.navbar{background:#fff;border-bottom:1px solid var(--g100);position:sticky;top:30px;z-index:999;box-shadow:var(--sh-xs)}
.nav-top{display:flex;align-items:center;justify-content:space-between;padding:10px 0 8px}
.nav-logo img{height:96px;width:auto}
.nav-links{display:flex;align-items:center;justify-content:center;gap:4px;padding:6px 0 10px;border-top:1px solid var(--g100)}
.nav-link{font-size:13px;font-weight:600;color:var(--g600);padding:5px 14px;border-radius:var(--r-xl);transition:all .2s;white-space:nowrap}
.nav-link:hover{color:var(--royal);background:rgba(13,33,161,.06)}
@media(max-width:640px){.nav-links{gap:2px}.nav-link{font-size:12px;padding:5px 10px}}
.nav-cta{background:var(--amber);color:var(--onyx);font-weight:800;font-size:15px;padding:11px 26px;border-radius:var(--r-xl);transition:all .25s;box-shadow:var(--sh-amber);display:inline-flex;align-items:center;gap:8px}
.nav-cta:hover{background:var(--amber-d);transform:translateY(-2px);box-shadow:0 12px 32px rgba(255,157,0,.45)}

/* ── HERO ─────────────────────────────────────────── */
.hero{background:#fff;padding:64px 0 0;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:-120px;left:-200px;width:700px;height:700px;background:radial-gradient(circle,rgba(13,33,161,.04) 0%,transparent 70%);pointer-events:none}
.hero-grid{display:grid;grid-template-columns:1.1fr 0.9fr;gap:40px;align-items:center}

.hero-eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(255,157,0,.09);border:1.5px solid rgba(255,157,0,.25);color:#9a5900;font-size:12px;font-weight:700;letter-spacing:.4px;padding:6px 16px;border-radius:var(--r-xl);margin-bottom:20px;text-transform:uppercase}
.hero h1{font-size:clamp(30px,3.8vw,50px);font-weight:900;line-height:1.13;margin-bottom:20px;color:var(--onyx)}
.g-text{background:linear-gradient(135deg,var(--royal) 0%,var(--royal-l) 50%,#4f67ff 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.underline-amber{position:relative;display:inline-block}
.underline-amber::after{content:'';position:absolute;bottom:-4px;right:0;left:0;height:5px;background:var(--amber);border-radius:3px;animation:slide-in .8s .3s both}
@keyframes slide-in{from{width:0;right:auto;left:0}to{width:100%}}

.hero-sub{font-size:clamp(16px,1.8vw,19px);color:var(--g600);line-height:1.7;margin-bottom:32px;max-width:520px}
.hero-sub b{color:var(--onyx)}
.hero-ctas{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:36px}

.btn-wa{background:linear-gradient(135deg,#25D366,#1da851);color:#fff;font-weight:800;font-size:17px;padding:15px 32px;border-radius:var(--r-xl);display:inline-flex;align-items:center;gap:10px;transition:all .25s;box-shadow:0 4px 20px rgba(37,211,102,.35)}
.btn-wa:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(37,211,102,.5)}
.btn-ghost{background:transparent;border:2px solid var(--g200);color:var(--g800);font-weight:700;font-size:15px;padding:15px 26px;border-radius:var(--r-xl);transition:all .25s;display:inline-flex;align-items:center;gap:8px}
.btn-ghost:hover{border-color:var(--royal);color:var(--royal)}
.btn-ghost .icon svg{transition:transform .2s}
.btn-ghost:hover .icon svg{transform:translateX(-3px)}

.hero-trust{display:flex;align-items:center;gap:16px;flex-wrap:wrap;font-size:13px;color:var(--g600);font-weight:500}
.hero-trust .sep{color:var(--g200)}
.trust-item{display:inline-flex;align-items:center;gap:5px}
.trust-item .icon svg{stroke:var(--green)}

/* countdown card */
.hero-card{background:#fff;border:1.5px solid var(--g100);border-radius:var(--r-lg);padding:32px 28px;box-shadow:var(--sh-md);position:relative;overflow:hidden}
.hero-card::before{content:'';position:absolute;top:0;right:0;left:0;height:4px;background:linear-gradient(90deg,var(--royal),var(--amber))}
.card-label{font-size:13px;font-weight:600;color:var(--g600);margin-bottom:4px;display:flex;align-items:center;gap:7px}
.card-label .icon svg{stroke:var(--g400)}
.card-date{font-size:24px;font-weight:900;color:var(--onyx);margin-bottom:20px}
.card-date span{color:var(--royal)}
.cd-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:20px}
.cd-unit{background:var(--g50);border:1px solid var(--g100);border-radius:var(--r-md);padding:16px 6px;text-align:center}
.cd-num{font-size:clamp(26px,3.5vw,38px);font-weight:900;color:var(--royal);line-height:1;display:block;font-variant-numeric:tabular-nums}
.cd-lbl{font-size:11px;color:var(--g400);margin-top:4px;font-weight:600;letter-spacing:.3px}
.reg-pill{background:var(--red-bg);border:1px solid rgba(220,38,38,.12);border-radius:var(--r);padding:14px 16px;display:flex;gap:10px;align-items:flex-start;font-size:13px;color:#7f1d1d;line-height:1.55}
.reg-pill .icon{margin-top:1px}
.reg-pill .icon svg{stroke:var(--red)}
.reg-pill strong{color:var(--red)}

.hero-wave{margin-top:60px}
.hero-wave svg{display:block;width:100%}

/* ── TRUST BAND ───────────────────────────────────── */
.trust-band{background:var(--royal);padding:20px 0}
.trust-band .inner{display:flex;justify-content:center;align-items:center;flex-wrap:wrap}
.t-item{display:flex;align-items:center;gap:10px;color:rgba(255,255,255,.9);font-size:14px;font-weight:600;padding:0 28px;position:relative}
.t-item:not(:last-child)::after{content:'';position:absolute;left:0;top:20%;bottom:20%;width:1px;background:rgba(255,255,255,.2)}
.t-icon-wrap{width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.t-icon-wrap .icon svg{stroke:#fff;width:16px;height:16px}

/* ── SECTION BASE ─────────────────────────────────── */
.section{padding:88px 0}
.sec-gray{background:var(--g50)}
.sec-white{background:#fff}
.tag{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:var(--royal);background:rgba(13,33,161,.07);padding:5px 14px;border-radius:var(--r-xl);margin-bottom:14px}
.tag .icon svg{stroke:var(--royal);width:13px;height:13px}
.sec-h{font-size:clamp(26px,3.2vw,42px);font-weight:900;line-height:1.15;margin-bottom:14px;color:var(--onyx)}
.sec-p{font-size:18px;color:var(--g600);max-width:600px;margin-bottom:48px;line-height:1.7}

/* ── WAKE-UP / PROBLEM ────────────────────────────── */
.wakeup-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.wcard{background:#fff;border:1px solid var(--g100);border-radius:var(--r-md);padding:28px;box-shadow:var(--sh-xs);transition:all .35s cubic-bezier(.25,.8,.25,1);position:relative;overflow:hidden}
.wcard::before{content:'';position:absolute;top:0;right:0;width:4px;height:0;background:var(--royal);border-radius:0 0 0 4px;transition:height .4s ease}
.wcard:hover{box-shadow:var(--sh-md);transform:translateY(-4px)}
.wcard:hover::before{height:100%}
.wcard-icon{width:48px;height:48px;border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;margin-bottom:16px;flex-shrink:0}
.wcard-icon.blue{background:rgba(13,33,161,.08)}
.wcard-icon.blue svg{stroke:var(--royal)}
.wcard-icon.amber{background:rgba(255,157,0,.1)}
.wcard-icon.amber svg{stroke:var(--amber-d)}
.wcard-icon.red{background:rgba(220,38,38,.07)}
.wcard-icon.red svg{stroke:var(--red)}
.wcard-icon.green{background:rgba(22,163,74,.08)}
.wcard-icon.green svg{stroke:var(--green)}
.wcard h3{font-size:18px;font-weight:800;margin-bottom:10px;color:var(--onyx)}
.wcard p{font-size:14px;color:var(--g600);line-height:1.7}

.law-callout{margin-top:40px;background:var(--g50);border:1.5px solid var(--g200);border-radius:var(--r-md);padding:36px 40px;display:grid;grid-template-columns:auto 1fr;gap:28px;align-items:start;position:relative;overflow:hidden}
.law-callout::before{content:'';position:absolute;right:0;top:0;bottom:0;width:5px;background:linear-gradient(180deg,var(--royal),var(--amber))}
.law-icon-wrap{width:56px;height:56px;background:var(--royal);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:var(--sh-sm);flex-shrink:0}
.law-icon-wrap svg{stroke:#fff;width:26px;height:26px}
.law-callout h3{font-size:20px;font-weight:800;margin-bottom:10px;color:var(--royal)}
.law-callout p{font-size:15px;color:var(--g800);line-height:1.75;margin-bottom:16px}
.law-hl{background:rgba(255,157,0,.09);border-right:3px solid var(--amber);padding:12px 16px;border-radius:0 var(--r) var(--r) 0;font-size:14px;font-weight:600;color:#8a5000;line-height:1.5;display:flex;align-items:flex-start;gap:8px}
.law-hl .icon svg{stroke:#8a5000;flex-shrink:0;margin-top:1px}

/* ── WHO ──────────────────────────────────────────── */
.who-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.who-card{background:#fff;border-radius:var(--r-lg);padding:32px 24px;text-align:center;box-shadow:var(--sh-xs);border:1.5px solid var(--g100);transition:all .3s ease}
.who-card:hover{border-color:var(--amber);box-shadow:0 0 0 4px rgba(255,157,0,.07),var(--sh-md);transform:translateY(-6px)}
.who-icon{width:64px;height:64px;background:rgba(13,33,161,.07);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px}
.who-icon svg{stroke:var(--royal);width:28px;height:28px}
.who-card:hover .who-icon{background:var(--royal)}
.who-card:hover .who-icon svg{stroke:#fff}
.who-icon,.who-card,.who-icon svg{transition:all .3s}
.who-card h3{font-size:17px;font-weight:800;color:var(--onyx);margin-bottom:10px}
.who-card p{font-size:14px;color:var(--g600);line-height:1.65}

/* ── COST (dark) ──────────────────────────────────── */
.cost-section{background:var(--onyx);padding:88px 0;position:relative;overflow:hidden}
.cost-section::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 10% 50%,rgba(13,33,161,.35) 0%,transparent 50%),radial-gradient(ellipse at 90% 30%,rgba(255,157,0,.1) 0%,transparent 50%);pointer-events:none}
.cost-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:44px}
.cost-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:var(--r-md);padding:28px 22px;transition:all .3s}
.cost-card:hover{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.14);transform:translateY(-4px)}
.cost-icon{width:52px;height:52px;border-radius:50%;background:rgba(239,68,68,.15);display:flex;align-items:center;justify-content:center;margin-bottom:16px}
.cost-icon svg{stroke:#fca5a5;width:24px;height:24px}
.cost-card h3{font-size:17px;font-weight:800;color:#fca5a5;margin-bottom:10px}
.cost-card p{font-size:14px;color:rgba(255,255,255,.6);line-height:1.65}
.deadline-card{background:linear-gradient(135deg,var(--amber-d),var(--amber));border-radius:var(--r-md);padding:28px 36px;display:flex;align-items:center;gap:24px}
.dl-icon{width:56px;height:56px;background:rgba(0,0,0,.15);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.dl-icon svg{stroke:var(--onyx);width:26px;height:26px}
.deadline-card h3{font-size:20px;font-weight:900;color:var(--onyx);margin-bottom:6px}
.deadline-card p{font-size:15px;color:rgba(0,0,0,.65)}

/* ── HOW IT WORKS ─────────────────────────────────── */
.steps-wrap{position:relative}
.steps-line{position:absolute;top:36px;right:calc(16.66% + 12px);left:calc(16.66% + 12px);height:2px;background:var(--g200);z-index:0}
.steps-line::after{content:'';position:absolute;top:0;right:0;height:100%;width:0;background:var(--royal);transition:width 1.5s ease}
.steps-line.animated::after{width:100%}
.steps-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;position:relative;z-index:1}
.step{text-align:center;padding:0 12px}
.step-num{width:72px;height:72px;background:#fff;border:3px solid var(--g200);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;transition:all .4s ease;position:relative;z-index:1}
.step-num svg{stroke:var(--g400);width:28px;height:28px;transition:stroke .4s}
.step.active .step-num{background:var(--royal);border-color:var(--royal);box-shadow:var(--sh-md)}
.step.active .step-num svg{stroke:#fff}
.step h3{font-size:18px;font-weight:800;margin-bottom:10px}
.step p{font-size:14px;color:var(--g600);line-height:1.7}
.step-tag{display:inline-flex;align-items:center;gap:6px;margin-top:12px;background:rgba(255,157,0,.09);color:#8a5000;font-size:12px;font-weight:700;padding:5px 12px;border-radius:var(--r-xl)}
.step-tag svg{stroke:#8a5000;width:13px;height:13px}

/* ── ABOUT ────────────────────────────────────────── */
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
.about-img-wrap{position:relative}
.about-img{width:80%;max-width:320px;display:block;margin:0 auto;object-fit:contain;border-radius:var(--r-lg);box-shadow:var(--sh-lg)}
.hfca-badge{position:absolute;bottom:-20px;right:-20px;width:80px;height:80px;background:#fff;border-radius:50%;box-shadow:var(--sh-md);display:flex;align-items:center;justify-content:center;overflow:hidden;border:3px solid #fff}
.hfca-badge img{width:60px;height:60px;object-fit:contain}
.years-badge{position:absolute;top:20px;left:-20px;background:var(--royal);color:#fff;border-radius:var(--r-md);padding:12px 18px;box-shadow:var(--sh-md);text-align:center}
.years-badge .num{font-size:28px;font-weight:900;display:block}
.years-badge .lbl{font-size:11px;font-weight:600;opacity:.8}
.about-tag{display:inline-flex;align-items:center;gap:6px;color:var(--royal);font-size:12px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px}
.about-tag svg{stroke:var(--royal);width:14px;height:14px}
.about-content h2{font-size:clamp(26px,3vw,38px);font-weight:900;line-height:1.2;margin-bottom:16px}
.about-content>p{font-size:16px;color:var(--g600);line-height:1.8;margin-bottom:28px}
.cred-list{list-style:none;display:flex;flex-direction:column;gap:12px;margin-bottom:32px}
.cred-item{display:flex;align-items:flex-start;gap:12px;font-size:15px;color:var(--g800);line-height:1.55}
.cred-check{width:24px;height:24px;background:rgba(22,163,74,.1);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
.cred-check svg{stroke:var(--green);width:13px;height:13px;stroke-width:3}
.about-links{display:flex;gap:12px;flex-wrap:wrap}
.link-pill{display:inline-flex;align-items:center;gap:7px;border:1.5px solid var(--g200);color:var(--g800);font-size:13px;font-weight:600;padding:9px 18px;border-radius:var(--r-xl);transition:all .25s}
.link-pill:hover{border-color:var(--royal);color:var(--royal);background:rgba(13,33,161,.04)}
.link-pill svg{stroke:currentColor;width:14px;height:14px}

/* ── TESTIMONIALS ─────────────────────────────────── */
.testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.testi-card{background:#fff;border:1px solid var(--g100);border-radius:var(--r-md);padding:28px;box-shadow:var(--sh-xs);transition:all .3s;position:relative;overflow:hidden}
.testi-card:hover{box-shadow:var(--sh-md);transform:translateY(-4px)}
.testi-card::before{content:'"';position:absolute;top:8px;left:14px;font-family:Georgia,serif;font-size:80px;font-weight:900;color:rgba(13,33,161,.05);line-height:.8}
.stars{display:flex;gap:3px;margin-bottom:12px}
.stars .icon svg{fill:var(--amber);stroke:none;width:16px;height:16px}
.saving-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(22,163,74,.08);border:1px solid rgba(22,163,74,.18);color:#15803d;font-size:13px;font-weight:700;padding:4px 12px;border-radius:var(--r-xl);margin-bottom:14px}
.saving-badge .icon svg{stroke:#15803d;width:14px;height:14px}
.testi-card blockquote{font-size:15px;color:var(--g800);line-height:1.75;margin-bottom:20px;font-style:italic}
.testi-card blockquote b{color:var(--royal);font-style:normal}
.testi-author{display:flex;align-items:center;gap:10px;border-top:1px solid var(--g100);padding-top:16px}
.author-av{width:40px;height:40px;border-radius:50%;background:var(--royal);color:#fff;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.author-name{font-size:14px;font-weight:700;display:block}
.author-detail{font-size:12px;color:var(--g400)}

/* ── FAQ ──────────────────────────────────────────── */
.faq-wrap{max-width:760px;margin:0 auto}
.faq-item{background:#fff;border:1px solid var(--g100);border-radius:var(--r-md);margin-bottom:10px;overflow:hidden;box-shadow:var(--sh-xs);transition:box-shadow .3s}
.faq-item:hover,.faq-item.open{box-shadow:var(--sh-sm)}
.faq-q{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;cursor:pointer;font-size:16px;font-weight:700;color:var(--onyx);transition:background .2s;gap:12px}
.faq-q:hover{background:var(--g50)}
.faq-item.open .faq-q{color:var(--royal)}
.faq-btn{width:28px;height:28px;border-radius:50%;background:rgba(13,33,161,.07);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .3s ease}
.faq-btn svg{stroke:var(--royal);width:16px;height:16px;transition:transform .3s}
.faq-item.open .faq-btn{background:var(--royal);transform:rotate(45deg)}
.faq-item.open .faq-btn svg{stroke:#fff}
.faq-a{padding:0 24px;font-size:15px;color:var(--g600);line-height:1.75;max-height:0;overflow:hidden;transition:max-height .4s ease,padding .4s ease}
.faq-item.open .faq-a{max-height:300px;padding:0 24px 20px}

/* ── FINAL CTA ────────────────────────────────────── */
.final-cta{background:var(--g50);border-top:1px solid var(--g100);padding:88px 0;position:relative;overflow:hidden}
.final-cta::before{content:'';position:absolute;top:-200px;left:-300px;width:800px;height:800px;background:radial-gradient(circle,rgba(13,33,161,.05) 0%,transparent 60%);pointer-events:none}
.cta-box{background:#fff;border:1.5px solid var(--g100);border-radius:var(--r-lg);padding:52px 56px;max-width:780px;margin:0 auto;box-shadow:var(--sh-md);text-align:center;position:relative;overflow:hidden}
.cta-box::before{content:'';position:absolute;top:0;right:0;left:0;height:4px;background:linear-gradient(90deg,var(--royal),var(--amber))}
.cta-box h2{font-size:clamp(26px,3vw,40px);font-weight:900;margin-bottom:12px;line-height:1.15}
.cta-box>p{font-size:18px;color:var(--g600);margin-bottom:32px;line-height:1.65}
.mini-cd{display:inline-flex;align-items:center;gap:8px;background:rgba(220,38,38,.06);border:1px solid rgba(220,38,38,.13);border-radius:var(--r-xl);padding:10px 24px;font-size:14px;font-weight:700;color:var(--red);margin-bottom:28px}
.mini-cd .icon svg{stroke:var(--red);width:16px;height:16px}
.cta-btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
.btn-primary-big{background:linear-gradient(135deg,var(--amber),var(--amber-l));color:var(--onyx);font-weight:900;font-size:18px;padding:17px 40px;border-radius:var(--r-xl);display:inline-flex;align-items:center;gap:10px;transition:all .25s;box-shadow:var(--sh-amber)}
.btn-primary-big:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(255,157,0,.5)}
.btn-phone{background:transparent;border:2px solid var(--g200);color:var(--g800);font-weight:700;font-size:16px;padding:17px 32px;border-radius:var(--r-xl);display:inline-flex;align-items:center;gap:8px;transition:all .25s}
.btn-phone:hover{border-color:var(--royal);color:var(--royal)}
.btn-phone svg{stroke:currentColor}
.no-obligation{font-size:13px;color:var(--g400);margin-top:16px;display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap}
.no-obligation .icon svg{stroke:var(--green);width:14px;height:14px}

/* ── SOCIAL + FOOTER ──────────────────────────────── */
.social-bar{background:var(--g50);border-top:1px solid var(--g100);padding:32px 0;text-align:center}
.social-label{font-size:14px;color:var(--g600);margin-bottom:16px;font-weight:500}
.social-icons{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}
.s-icon{width:44px;height:44px;border-radius:50%;background:#fff;border:1.5px solid var(--g200);display:flex;align-items:center;justify-content:center;transition:all .25s}
.s-icon svg{width:20px;height:20px;fill:var(--g600);transition:fill .25s}
.s-icon:hover{transform:translateY(-3px);box-shadow:var(--sh-sm)}
.s-icon.ig:hover{background:#E1306C;border-color:#E1306C}.s-icon.ig:hover svg{fill:#fff}
.s-icon.fb:hover{background:#1877F2;border-color:#1877F2}.s-icon.fb:hover svg{fill:#fff}
.s-icon.yt:hover{background:#FF0000;border-color:#FF0000}.s-icon.yt:hover svg{fill:#fff}
.s-icon.li:hover{background:#0A66C2;border-color:#0A66C2}.s-icon.li:hover svg{fill:#fff}
.s-icon.tt:hover{background:#000;border-color:#000}.s-icon.tt:hover svg{fill:#fff}
.s-icon.wa:hover{background:#25D366;border-color:#25D366}.s-icon.wa:hover svg{fill:#fff}
footer{background:var(--g800);color:rgba(255,255,255,.5);padding:28px 0;text-align:center;font-size:13px}
footer a{color:rgba(255,255,255,.7);transition:color .2s}
footer a:hover{color:var(--amber)}
.footer-links{display:flex;justify-content:center;gap:24px;flex-wrap:wrap;margin-bottom:10px}
.footer-logo{height:36px;width:auto;filter:brightness(0) invert(1) opacity(.4);margin:0 auto 12px}

/* ── STICKY WA ────────────────────────────────────── */
.sticky-wa{position:fixed;bottom:28px;left:24px;background:linear-gradient(135deg,#25D366,#1da851);border-radius:var(--r-xl);display:flex;align-items:center;gap:10px;padding:13px 20px;box-shadow:0 4px 24px rgba(37,211,102,.55);z-index:998;animation:waf 3s ease-in-out infinite;color:#fff;font-family:'Heebo',sans-serif;font-weight:800;font-size:14px;white-space:nowrap}
.sticky-wa svg{width:24px;height:24px;fill:#fff;flex-shrink:0}
.sticky-wa-text{display:flex;flex-direction:column;line-height:1.2}
.sticky-wa-text span:first-child{font-size:14px;font-weight:800}
.sticky-wa-text span:last-child{font-size:11px;font-weight:500;opacity:.85}
@media(max-width:480px){.sticky-wa-text span:last-child{display:none}.sticky-wa{padding:13px 16px}}
@keyframes waf{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
.sticky-wa:hover{animation:none;transform:scale(1.1)}

/* ── ANIMATIONS ───────────────────────────────────── */
.fade-up{opacity:0;transform:translateY(30px);transition:opacity .6s ease,transform .6s ease}
.fade-up.visible{opacity:1;transform:translateY(0)}
.fade-up.d1{transition-delay:.1s}.fade-up.d2{transition-delay:.2s}.fade-up.d3{transition-delay:.3s}

/* ── RESPONSIVE ───────────────────────────────────── */
@media(max-width:980px){
  .hero-grid,.about-grid{grid-template-columns:1fr;gap:40px}
  .who-grid,.steps-grid,.testi-grid,.cost-grid{grid-template-columns:1fr 1fr}
  .steps-line{display:none}
  .wakeup-grid{grid-template-columns:1fr 1fr}
  .law-callout{grid-template-columns:1fr;gap:18px}
}
@media(max-width:640px){
  .who-grid,.steps-grid,.testi-grid,.cost-grid,.wakeup-grid{grid-template-columns:1fr}
  .trust-band .inner{gap:4px}
  .t-item{padding:8px 16px}
  .t-item::after{display:none}
  .cta-box{padding:36px 24px}
  .hero-ctas,.cta-btns{flex-direction:column}
  .btn-wa,.btn-ghost,.btn-primary-big,.btn-phone{justify-content:center}
  .deadline-card{flex-direction:column;text-align:center}
  .cd-num{font-size:28px}
  .hero{padding:40px 0 0}
}

/* ── ACCESSIBILITY WIDGET ───────────────────────────── */
.acc-btn{position:fixed;bottom:100px;left:24px;width:50px;height:50px;background:var(--royal);border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:9200;box-shadow:var(--sh-md);cursor:pointer;border:3px solid #fff;transition:transform .2s}
.acc-btn:hover{transform:scale(1.1)}
.acc-btn svg{stroke:#fff;fill:none}
.acc-panel{position:fixed;bottom:160px;left:24px;width:230px;background:#fff;border-radius:var(--r-lg);box-shadow:0 16px 48px rgba(0,0,0,.22);z-index:9200;display:none;overflow:hidden;direction:rtl}
.acc-panel.open{display:block}
.acc-panel-title{background:var(--royal);color:#fff;font-size:13px;font-weight:700;padding:12px 16px;display:flex;justify-content:space-between;align-items:center}
.acc-panel-title button{background:none;border:none;color:#fff;cursor:pointer;font-size:18px;line-height:1}
.acc-rows{padding:8px 0}
.acc-row{display:flex;align-items:center;justify-content:space-between;padding:9px 16px;font-size:13px;font-weight:600;color:var(--g800);border-bottom:1px solid var(--g100);cursor:pointer;transition:background .15s}
.acc-row:last-child{border-bottom:none}
.acc-row:hover{background:var(--g50)}
.acc-row.active{color:var(--royal)}
.acc-row .acc-ctrl{display:flex;gap:6px;align-items:center}
.acc-ctrl button{width:26px;height:26px;border-radius:6px;border:1.5px solid var(--g200);background:#fff;font-weight:700;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;color:var(--g800)}
.acc-ctrl button:hover{border-color:var(--royal);color:var(--royal)}
.acc-reset{width:100%;padding:10px;border:none;background:var(--g50);color:var(--g600);font-size:12px;font-weight:600;cursor:pointer;border-top:1px solid var(--g100);font-family:inherit}
.acc-reset:hover{background:var(--g100)}

/* ── MORTGAGE UPLOAD FORM ────────────────────────────── */
.mort-section{background:linear-gradient(135deg,#0a1850 0%,var(--royal) 100%);padding:72px 0;position:relative;overflow:hidden}
.mort-section::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");pointer-events:none}
.mort-grid{display:grid;grid-template-columns:1.1fr 0.9fr;gap:56px;align-items:center;position:relative}
.mort-badge{display:inline-flex;align-items:center;gap:7px;background:rgba(255,157,0,.2);border:1px solid rgba(255,157,0,.4);color:var(--amber);font-size:11px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;padding:5px 14px;border-radius:var(--r-xl);margin-bottom:14px}
.mort-title{font-size:clamp(22px,2.6vw,36px);font-weight:900;color:#fff;line-height:1.2;margin-bottom:14px}
.mort-desc{font-size:15px;color:rgba(255,255,255,.72);line-height:1.7;margin-bottom:20px}
.mort-steps{list-style:none;display:flex;flex-direction:column;gap:12px}
.mort-step{display:flex;align-items:flex-start;gap:12px}
.mort-step-num{width:26px;height:26px;border-radius:50%;background:var(--amber);color:var(--onyx);font-weight:900;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
.mort-step-text{font-size:14px;color:rgba(255,255,255,.82);line-height:1.5}
.mort-step-text b{color:#fff}
.mort-card{background:#fff;border-radius:var(--r-lg);padding:32px 28px;box-shadow:0 24px 64px rgba(0,0,0,.3)}
.mort-card h3{font-size:18px;font-weight:800;color:var(--onyx);margin-bottom:6px}
.mort-card p{font-size:13px;color:var(--g600);margin-bottom:20px;line-height:1.5}
.mort-form{display:flex;flex-direction:column;gap:11px}
.mort-submit{background:var(--amber);color:var(--onyx);font-weight:900;font-size:15px;padding:14px;border-radius:var(--r);border:none;font-family:inherit;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:9px;transition:all .22s;margin-top:4px;box-shadow:var(--sh-amber)}
.mort-submit:hover{background:var(--amber-d);transform:translateY(-2px)}
.mort-note{font-size:11px;color:var(--g400);text-align:center;margin-top:6px;line-height:1.5}
@media(max-width:700px){.mort-grid{grid-template-columns:1fr}}

/* ── VIDEOS SECTION ──────────────────────────────────── */
.videos-section{background:var(--g50);padding:80px 0}
.videos-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:40px}
.videos-grid-2{grid-template-columns:repeat(2,1fr)}
.video-wrap{width:100%;aspect-ratio:16/9;border-radius:var(--r-md);overflow:hidden;box-shadow:var(--sh-md);background:#111;display:block}
.video-wrap iframe{width:100%;height:100%;border:0;display:block}
@media(max-width:900px){.videos-grid{grid-template-columns:1fr 1fr}}
@media(max-width:580px){.videos-grid,.videos-grid-2{grid-template-columns:1fr}}

/* ── GUIDE LEAD FORM ─────────────────────────────────── */
.guide-section{background:linear-gradient(135deg,var(--royal) 0%,var(--royal-l) 100%);padding:72px 0;position:relative;overflow:hidden}
.guide-section::before{content:'';position:absolute;top:-80px;left:-120px;width:500px;height:500px;background:radial-gradient(circle,rgba(255,255,255,.06) 0%,transparent 65%);pointer-events:none}
.guide-grid{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
.guide-label{display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,.15);color:#fff;font-size:12px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;padding:6px 16px;border-radius:var(--r-xl);margin-bottom:14px}
.guide-title{font-family:'Arial','Helvetica',sans-serif;font-size:clamp(24px,2.8vw,38px);font-weight:900;color:#fff;line-height:1.2;margin-bottom:14px}
.guide-desc{font-size:15px;color:rgba(255,255,255,.78);line-height:1.7;margin-bottom:20px}
.guide-bullets{list-style:none;display:flex;flex-direction:column;gap:9px}
.guide-bullets li{display:flex;align-items:center;gap:9px;font-size:14px;color:rgba(255,255,255,.85);font-weight:500}
.guide-bullets li .icon svg{stroke:var(--amber)}
.guide-card{background:#fff;border-radius:var(--r-lg);padding:32px 28px;box-shadow:0 20px 60px rgba(0,0,0,.25)}
.guide-card h3{font-family:'Arial','Helvetica',sans-serif;font-size:20px;font-weight:800;color:var(--onyx);margin-bottom:6px}
.guide-card p{font-size:13px;color:var(--g600);margin-bottom:22px;line-height:1.5}
.guide-form{display:flex;flex-direction:column;gap:12px}
.form-field{display:flex;flex-direction:column;gap:5px}
.form-field label{font-size:13px;font-weight:600;color:var(--g800)}
.form-field input{padding:12px 16px;border:1.5px solid var(--g200);border-radius:var(--r);font-family:inherit;font-size:14px;color:var(--onyx);outline:none;transition:border-color .2s;text-align:right;direction:rtl}
.form-field input:focus{border-color:var(--royal);box-shadow:0 0 0 3px rgba(13,33,161,.08)}
.form-field input::placeholder{color:var(--g400)}
.guide-submit{background:linear-gradient(135deg,var(--royal),var(--royal-l));color:#fff;font-weight:800;font-size:15px;padding:14px;border-radius:var(--r);border:none;font-family:inherit;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:9px;transition:all .22s;margin-top:4px;box-shadow:var(--sh-md)}
.guide-submit:hover{transform:translateY(-2px);box-shadow:var(--sh-lg)}
.guide-privacy{font-size:11px;color:var(--g400);text-align:center;margin-top:8px}

/* ── PDF MODAL ───────────────────────────────────────── */
.pdf-overlay{position:fixed;inset:0;background:rgba(10,16,50,.88);backdrop-filter:blur(8px);z-index:9100;display:none;flex-direction:column}
.pdf-overlay.show{display:flex}
.pdf-topbar{background:var(--royal);padding:12px 20px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.pdf-topbar-title{color:#fff;font-weight:700;font-size:15px}
.pdf-close-btn{background:rgba(255,255,255,.2);border:none;border-radius:6px;color:#fff;cursor:pointer;padding:7px 14px;font-family:inherit;font-size:13px;font-weight:600;display:flex;align-items:center;gap:7px;transition:background .2s}
.pdf-close-btn:hover{background:rgba(255,255,255,.3)}
.pdf-iframe-wrap{flex:1;overflow:hidden}
.pdf-iframe-wrap iframe{width:100%;height:100%;border:0}
@media(max-width:700px){
  .guide-grid{grid-template-columns:1fr}
  .guide-title{font-size:26px}
}

/* ── OBJECTIONS SECTION ──────────────────────────────── */
.obj-section{background:var(--g50);padding:80px 0}
.obj-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:40px}
.obj-card{background:#fff;border-radius:var(--r-md);padding:20px 22px;border:1.5px solid var(--g100);transition:border-color .2s,box-shadow .2s}
.obj-card:hover{border-color:var(--royal);box-shadow:var(--sh-sm)}
.obj-q{font-size:14px;font-weight:800;color:var(--onyx);margin-bottom:8px;display:flex;align-items:flex-start;gap:8px;line-height:1.35}
.obj-q-icon{width:22px;height:22px;border-radius:50%;background:rgba(13,33,161,.08);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
.obj-q-icon svg{stroke:var(--royal)}
.obj-a{font-size:13px;color:var(--g600);line-height:1.6;padding-right:30px}
.obj-a b{color:var(--onyx)}

.not-for-box{margin-top:32px;background:#fff;border:2px solid var(--g200);border-radius:var(--r-lg);padding:28px 32px;display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start}
.not-for-title{font-size:15px;font-weight:800;color:var(--g800);margin-bottom:12px;display:flex;align-items:center;gap:8px}
.not-for-title .icon svg{stroke:var(--red)}
.not-for-list{list-style:none;display:flex;flex-direction:column;gap:8px}
.not-for-list li{display:flex;align-items:flex-start;gap:8px;font-size:13px;color:var(--g600);line-height:1.5}
.not-for-list li .icon svg{stroke:var(--red);flex-shrink:0;margin-top:2px}
.for-list li .icon svg{stroke:var(--green)}
@media(max-width:700px){
  .obj-grid{grid-template-columns:1fr}
  .not-for-box{grid-template-columns:1fr}
}

/* ── ACCESSIBILITY EFFECTS ───────────────────────────── */
.acc-high-contrast{filter:contrast(1.5) brightness(1.1)}
.acc-grayscale{filter:grayscale(100%)}
.acc-links-highlight a{outline:3px solid var(--amber)!important;outline-offset:2px}
.acc-no-anim *,.acc-no-anim *::before,.acc-no-anim *::after{animation:none!important;transition:none!important}
.acc-big-cursor,.acc-big-cursor *{cursor:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M8 4 L8 28 L14 22 L18 30 L21 29 L17 21 L25 21 Z' fill='black' stroke='white' stroke-width='1.5'/%3E%3C/svg%3E") 0 0,auto!important}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}

/* ── WARMUP POPUP ─────────────────────────────────────── */
.popup-overlay{position:fixed;inset:0;background:rgba(10,16,60,.72);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .35s}
.popup-overlay.show{opacity:1}
.popup-box{background:#fff;border-radius:var(--r-lg);width:100%;max-width:480px;box-shadow:0 24px 80px rgba(13,33,161,.28);overflow:hidden;transform:translateY(24px) scale(.97);transition:transform .35s cubic-bezier(.34,1.56,.64,1)}
.popup-overlay.show .popup-box{transform:translateY(0) scale(1)}
.popup-top{background:linear-gradient(135deg,var(--royal) 0%,var(--royal-l) 100%);padding:20px 24px 18px;position:relative}
.popup-top-label{font-size:11px;font-weight:700;color:rgba(255,255,255,.55);letter-spacing:.8px;text-transform:uppercase;margin-bottom:4px}
.popup-top-title{font-size:20px;font-weight:900;color:#fff;line-height:1.25}
.popup-top-sub{font-size:13px;color:rgba(255,255,255,.7);margin-top:6px;line-height:1.45}
.popup-close{position:absolute;top:14px;left:16px;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .2s;border:none;font-size:0;line-height:0}
.popup-close:hover{background:rgba(255,255,255,.28)}
.popup-close svg{pointer-events:none}
.popup-progress{display:flex;gap:6px;margin-top:14px}
.popup-progress span{height:3px;border-radius:2px;flex:1;background:rgba(255,255,255,.25);transition:background .35s}
.popup-progress span.done{background:var(--amber)}

.popup-body{padding:24px 24px 20px}
.popup-q-label{font-size:12px;font-weight:700;color:var(--g600);letter-spacing:.4px;text-transform:uppercase;margin-bottom:10px}
.popup-q-text{font-size:17px;font-weight:800;color:var(--onyx);margin-bottom:18px;line-height:1.4}
.popup-opts{display:grid;gap:10px}
.popup-opts.grid2{grid-template-columns:1fr 1fr}
.opt-btn{background:var(--g50);border:2px solid var(--g100);border-radius:var(--r-md);padding:13px 16px;cursor:pointer;text-align:right;transition:all .18s;font-family:inherit;width:100%;display:flex;align-items:center;gap:10px}
.opt-btn:hover{border-color:var(--royal);background:#f0f3ff;transform:translateY(-1px);box-shadow:var(--sh-sm)}
.opt-btn.selected{border-color:var(--royal);background:#eff2ff;box-shadow:0 0 0 3px rgba(13,33,161,.1)}
.opt-btn .opt-icon{width:34px;height:34px;border-radius:8px;background:#fff;border:1px solid var(--g100);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.opt-btn .opt-icon svg{stroke:var(--royal)}
.opt-label{font-weight:700;font-size:14px;color:var(--onyx);line-height:1.25}
.opt-sub{font-size:12px;color:var(--g600);margin-top:2px;font-weight:400}

.popup-result{padding:24px 24px 28px;text-align:center}
.result-icon-wrap{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,rgba(13,33,161,.08),rgba(13,33,161,.15));display:flex;align-items:center;justify-content:center;margin:0 auto 14px}
.result-icon-wrap svg{stroke:var(--royal)}
.result-title{font-size:19px;font-weight:900;color:var(--onyx);margin-bottom:8px;line-height:1.3}
.result-desc{font-size:14px;color:var(--g600);margin-bottom:22px;line-height:1.6}
.result-desc b{color:var(--onyx)}
.popup-wa-btn{background:linear-gradient(135deg,#25D366,#1da851);color:#fff;font-weight:800;font-size:15px;padding:14px 24px;border-radius:var(--r-xl);display:inline-flex;align-items:center;gap:10px;width:100%;justify-content:center;box-shadow:0 4px 18px rgba(37,211,102,.35);transition:all .22s;border:none;font-family:inherit;cursor:pointer}
.popup-wa-btn:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(37,211,102,.5)}
.popup-skip{margin-top:12px;font-size:13px;color:var(--g600);cursor:pointer;text-decoration:underline;text-underline-offset:2px;background:none;border:none;font-family:inherit;display:block;width:100%;text-align:center}
.popup-skip:hover{color:var(--g800)}
@media(max-width:460px){
  .popup-opts.grid2{grid-template-columns:1fr}
  .popup-top-title{font-size:17px}
  .popup-q-text{font-size:15px}
}
</style>
</head>
<body>

<div id="pb"></div>

<!-- SKIP TO CONTENT (נגישות) -->
<a href="#main-content" class="sr-only" style="position:absolute;top:-99px;left:0;z-index:9999;background:var(--royal);color:#fff;padding:8px 16px;border-radius:0 0 8px 0;font-weight:700;transition:top .2s" onfocus="this.style.top='0'" onblur="this.style.top='-99px'">דלג לתוכן הראשי</a>

<!-- ACCESSIBILITY WIDGET -->
<div id="acc-panel" class="acc-panel" role="dialog" aria-label="תפריט נגישות" aria-modal="true">
  <div class="acc-panel-title">
    <span>נגישות</span>
    <button onclick="toggleAcc()" aria-label="סגור תפריט נגישות">×</button>
  </div>
  <div class="acc-rows">
    <div class="acc-row" role="group" aria-label="גודל טקסט">
      <span>גודל טקסט</span>
      <div class="acc-ctrl">
        <button onclick="fontSize(-1)" aria-label="הקטן טקסט">A-</button>
        <button onclick="fontSize(1)"  aria-label="הגדל טקסט">A+</button>
      </div>
    </div>
    <div class="acc-row" id="acc-contrast" onclick="toggleContrast()" role="button" tabindex="0" aria-pressed="false">
      <span>ניגודיות גבוהה</span>
      <span style="font-size:11px;color:var(--g400)" id="acc-contrast-lbl">כבוי</span>
    </div>
    <div class="acc-row" id="acc-gray" onclick="toggleGray()" role="button" tabindex="0" aria-pressed="false">
      <span>גווני אפור</span>
      <span style="font-size:11px;color:var(--g400)" id="acc-gray-lbl">כבוי</span>
    </div>
    <div class="acc-row" id="acc-links" onclick="toggleLinks()" role="button" tabindex="0" aria-pressed="false">
      <span>הדגש קישורים</span>
      <span style="font-size:11px;color:var(--g400)" id="acc-links-lbl">כבוי</span>
    </div>
    <div class="acc-row" id="acc-anim" onclick="toggleAnim()" role="button" tabindex="0" aria-pressed="false">
      <span>עצור אנימציות</span>
      <span style="font-size:11px;color:var(--g400)" id="acc-anim-lbl">כבוי</span>
    </div>
    <div class="acc-row" id="acc-cursor" onclick="toggleCursor()" role="button" tabindex="0" aria-pressed="false">
      <span>סמן גדול</span>
      <span style="font-size:11px;color:var(--g400)" id="acc-cursor-lbl">כבוי</span>
    </div>
  </div>
  <button class="acc-reset" onclick="resetAcc()">אפס הגדרות נגישות</button>
</div>
<button class="acc-btn" onclick="toggleAcc()" aria-label="פתח תפריט נגישות" title="נגישות">
  <svg width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="2"/><path d="M12 8c-4 0-7 1.5-7 3.5S8 15 8 18h8c0-3 3-4.5 3-6.5S16 8 12 8z"/><path d="M8.5 11.5l-2 5M15.5 11.5l2 5"/></svg>
</button>

<!-- Sticky WA -->
<a class="sticky-wa" href="https://wa.me/972524415395?text=היי שיראל! ראיתי את הדף, רוצה לבדוק אם אני יכול לאחד הלוואות לפני 30.6.26" target="_blank" rel="noopener">
  ${icons.wa}
  <div class="sticky-wa-text">
    <span>שלח הודעה עכשיו</span>
    <span>שיחת אבחון חינמית</span>
  </div>
</a>

<!-- TICKER -->
<div class="ticker">
  <div class="ticker-inner">
    <span class="t-dot"></span>
    <span class="icon" style="line-height:0">${icons.alert.replace('width="18" height="18"','width="14" height="14"')}</span>
    <b>הוראת בנק ישראל — חוזר 2840:</b>
    מ-1.7.2026 לא ניתן לאחד הלוואות לכל מטרה למשכנתא. נותרו:&nbsp;<b id="ticker-cd">—</b>
  </div>
</div>

<!-- NAVBAR -->
<nav class="navbar">
  <div class="container">
    <div class="nav-top">
      <div class="nav-logo"><img src="${LOGO}" alt="MAKE SENSE"/></div>
      <a href="https://wa.me/972524415395?text=היי שיראל, רוצה לבדוק אם אני יכול לאחד הלוואות לפני 30.6.26" target="_blank" class="nav-cta">
        <span class="icon">${icons.msgCircle}</span>
        בדוק את הזכאות שלך — בחינם
      </a>
    </div>
    <div class="nav-links">
      <a href="#problem" class="nav-link">מה הבעיה?</a>
      <a href="#how-it-works" class="nav-link">איך זה עובד?</a>
      <a href="#about" class="nav-link">אודות שיראל</a>
      <a href="#objections" class="nav-link">שאלות ותשובות</a>
      <a href="#testimonials" class="nav-link">המלצות</a>
      <a href="#proof" class="nav-link">הוכחה מהשטח</a>
      <a href="#videos" class="nav-link">לקוחות ממליצים</a>
      <a href="#upload" class="nav-link">העלאת יתרות</a>
      <a href="#guide" class="nav-link">מדריך חינמי</a>
      <a href="#faq" class="nav-link">שאלות נפוצות</a>
      <a href="#contact" class="nav-link">דברו איתי</a>
    </div>
  </div>
</nav>

<!-- HERO -->
<section class="hero" id="main-content">
  <div class="container">
    <div class="hero-grid">

      <div>
        <div class="hero-eyebrow">
          <span class="icon">${icons.clock.replace('width="18" height="18"','width="13" height="13"')}</span>
          חלון הזדמנויות — עד 30.6.2026
        </div>
        <h1>
          הבנק שלך לא יגיד לך את זה —<br/>
          אבל יש לך <span class="underline-amber">חלון אחרון</span><br/>
          <span class="g-text">לחסוך אלפי שקלים בחודש</span>
        </h1>
        <p class="hero-sub">
          אם יש לך נכס והלוואות — כנראה שאתה משלם יותר ממה שצריך.
          בנק ישראל מאפשר לאחד הכל עד <b>30 ביוני 2026</b>. אחרי זה? הדלת נסגרת — לצמיתות.
        </p>
        <div class="hero-ctas">
          <a href="https://wa.me/972524415395?text=היי שיראל, ראיתי את הדף ורוצה לבדוק אם אני יכול לאחד הלוואות לפני 30.6.26" target="_blank" class="btn-wa">
            <span class="icon">${icons.wa}</span>
            שלח הודעה בוואטספ
          </a>
          <a href="#how-it-works" class="btn-ghost">
            <span class="icon">${icons.arrowLeft}</span>
            איך זה עובד?
          </a>
        </div>
        <div class="hero-trust">
          <span class="trust-item"><span class="icon">${icons.check.replace('width="14" height="14"','width="13" height="13"')}</span>ייעוץ ראשוני בחינם</span>
          <span class="sep">|</span>
          <span class="trust-item"><span class="icon">${icons.check.replace('width="14" height="14"','width="13" height="13"')}</span>ללא התחייבות</span>
          <span class="sep">|</span>
          <span class="trust-item"><span class="icon">${icons.check.replace('width="14" height="14"','width="13" height="13"')}</span>תוצאות תוך 48 שעות</span>
        </div>
      </div>

      <!-- Countdown card -->
      <div class="hero-card">
        <div class="card-label">
          <span class="icon">${icons.clock.replace('width="18" height="18"','width="15" height="15"')}</span>
          הזמן שנותר לפעולה
        </div>
        <div class="card-date">30 <span>יוני</span> 2026</div>
        <div class="cd-grid">
          <div class="cd-unit"><span class="cd-num" id="d">--</span><div class="cd-lbl">ימים</div></div>
          <div class="cd-unit"><span class="cd-num" id="h">--</span><div class="cd-lbl">שעות</div></div>
          <div class="cd-unit"><span class="cd-num" id="m">--</span><div class="cd-lbl">דקות</div></div>
          <div class="cd-unit"><span class="cd-num" id="s">--</span><div class="cd-lbl">שניות</div></div>
        </div>
        <div class="reg-pill">
          <span class="icon">${icons.file.replace('width="18" height="18"','width="16" height="16"')}</span>
          <div><strong>חוזר בנק ישראל 2840 (2026)</strong> — הלוואות לכל מטרה המשועבדות לנכס ייכנסו למגבלת ה-40% DTI. מי שלא יאחד לפני 30.6.26 — לא יוכל לאחד כלל.</div>
        </div>
      </div>

    </div>
  </div>
  <div class="hero-wave">
    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 15C480 30 240 60 0 30Z" fill="#f4f5f7"/>
    </svg>
  </div>
</section>

<!-- TRUST BAND -->
<div class="trust-band">
  <div class="container">
    <div class="inner">
      <div class="t-item"><div class="t-icon-wrap"><span class="icon">${icons.building.replace('width="18" height="18"','width="16" height="16"')}</span></div>מוסמך מטעם בנק ישראל</div>
      <div class="t-item"><div class="t-icon-wrap"><span class="icon">${icons.handshake.replace('width="18" height="18"','width="16" height="16"')}</span></div>ייעוץ ראשוני חינמי</div>
      <div class="t-item"><div class="t-icon-wrap"><span class="icon">${icons.zap.replace('width="18" height="18"','width="16" height="16"')}</span></div>ניתוח תוך 48 שעות</div>
      <div class="t-item"><div class="t-icon-wrap"><span class="icon">${icons.lock.replace('width="18" height="18"','width="16" height="16"')}</span></div>דיסקרטי לחלוטין</div>
      <div class="t-item"><div class="t-icon-wrap"><span class="icon">${icons.award.replace('width="18" height="18"','width="16" height="16"')}</span></div>חבר התאחדות יועצי המשכנתאות</div>
    </div>
  </div>
</div>

<!-- PROBLEM -->
<section class="section sec-gray" id="problem">
  <div class="container">
    <div style="text-align:center;margin-bottom:48px">
      <div class="tag"><span class="icon">${icons.alert.replace('width="18" height="18"','width="13" height="13"')}</span>מה בדיוק קורה?</div>
      <h2 class="sec-h">הבנק לא יזכיר לך את זה.<br/><span class="g-text">אבל אתה חייב לדעת.</span></h2>
      <p class="sec-p" style="margin:12px auto 0">רוב בעלי הנכסים בישראל משלמים מאות ואלפי שקלים מיותרים כל חודש — ויש להם עד 30.6.26 לתקן את זה.</p>
    </div>
    <div class="wakeup-grid">
      <div class="wcard fade-up">
        <div class="wcard-icon blue"><span class="icon">${icons.home}</span></div>
        <h3>מה זה "הלוואה לכל מטרה" על נכס?</h3>
        <p>הלוואה שלקחת מהבנק כנגד שעבוד הדירה שלך — לשיפוץ, לרכב, לחינוך. נשמע לוגי, אבל הריבית עליה 7–10% לשנה. המשכנתא עומדת ב-4–5%. ההפרש הזה עולה לך הון.</p>
      </div>
      <div class="wcard fade-up d1">
        <div class="wcard-icon amber"><span class="icon">${icons.chart}</span></div>
        <h3>מה בנק ישראל שינה בחוזר 2840?</h3>
        <p>החל מ-1.7.2026, הלוואות "לכל מטרה" על נכס ייחשבו כחלק ממגבלת ה-DTI (40%). בפועל — הבנק לא יוכל לאחד אותן למשכנתא. החלון שקיים היום ייסגר לגמרי.</p>
      </div>
      <div class="wcard fade-up d2">
        <div class="wcard-icon red"><span class="icon">${icons.hourglass}</span></div>
        <h3>מה קורה אחרי 30.6.2026?</h3>
        <p>מי שלא איחד — ימשיך לשלם ריביות גבוהות לנצח. לא יוכל לארגן מחדש. לא יוכל להוריד את ההחזר החודשי. ויחכה לחלון שכבר לא יפתח שוב.</p>
      </div>
      <div class="wcard fade-up d3">
        <div class="wcard-icon green"><span class="icon">${icons.bulb}</span></div>
        <h3>מה אפשר לעשות עכשיו?</h3>
        <p>לאחד את כל ההלוואות למשכנתא אחת בריבית נמוכה. להפחית את ההחזר החודשי. לשחרר כסף שנתקע כל חודש — ולהחזיר אותו לכיס שלך.</p>
      </div>
    </div>
    <div class="law-callout fade-up">
      <div class="law-icon-wrap"><span class="icon">${icons.scale}</span></div>
      <div>
        <h3>מה בדיוק אומרת הרגולציה?</h3>
        <p>חוזר 2840 של בנק ישראל (2026) קובע שסך כל ההחזרים להלוואות דיור — כולל "הלוואות לכל מטרה" המשועבדות לנכס — יוגבל ל-<strong>40% מההכנסה הפנויה</strong>. היום, לפני 30.6.26, ניתן לאחד לפני שהחישוב הזה נכנס לתוקף.</p>
        <div class="law-hl">
          <span class="icon">${icons.alert.replace('width="18" height="18"','width="15" height="15"')}</span>
          מי שיפעל לפני 30.6.26 — יוכל לאחד, לחסוך ולארגן מחדש. מי שיחכה — הבנק פשוט לא יאשר.
        </div>
      </div>
    </div>
  </div>
</section>

<!-- WHO -->
<section class="section sec-white" id="who">
  <div class="container">
    <div style="text-align:center;margin-bottom:40px">
      <div class="tag"><span class="icon">${icons.users.replace('width="18" height="18"','width="13" height="13"')}</span>למי זה רלוונטי?</div>
      <h2 class="sec-h">תענה על שאלה אחת:<br/><span class="g-text">האם זה אתה?</span></h2>
    </div>
    <div class="who-grid">
      <div class="who-card fade-up">
        <div class="who-icon"><span class="icon">${icons.home}</span></div>
        <h3>יש לך נכס + הלוואה נוספת עליו</h3>
        <p>לקחת הלוואה כנגד הדירה לכל מטרה? זה בדיוק מה שניתן לאחד לפני 30.6.26 — ולחסוך כסף אמיתי.</p>
      </div>
      <div class="who-card fade-up d1">
        <div class="who-icon"><span class="icon">${icons.creditCard}</span></div>
        <h3>אתה משלם 2–3 החזרים במקביל</h3>
        <p>משכנתא + הלוואה + עוד הלוואה. ניתן לאחד לתשלום אחד נמוך יותר — ולנשום בסוף החודש.</p>
      </div>
      <div class="who-card fade-up d2">
        <div class="who-icon"><span class="icon">${icons.frown}</span></div>
        <h3>החודש "לא מגיע לסוף"</h3>
        <p>כשאין נשימה בסוף החודש — לרוב הסיבה היא מבנה ההלוואות, לא ההכנסה. ניתן לשחרר 1,000–3,500 ₪ בחודש.</p>
      </div>
    </div>
  </div>
</section>

<!-- COST -->
<section class="cost-section">
  <div class="container">
    <div style="text-align:center;margin-bottom:48px">
      <div class="tag" style="background:rgba(255,157,0,.14);color:var(--amber-l)"><span class="icon" style="line-height:0">${icons.dollar.replace('width="22" height="22"','width="13" height="13"').replace('stroke="currentColor"','stroke="var(--amber-l)"')}</span>מה אתה מפסיד בכל חודש?</div>
      <h2 class="sec-h" style="color:#fff">לא לפעול הוא גם<br/><span style="color:var(--amber)">החלטה — ועם מחיר</span></h2>
      <p class="sec-p" style="color:rgba(255,255,255,.6);margin:12px auto 0">אלה לא מספרים תיאורטיים. זה מה שקורה כשמחכים.</p>
    </div>
    <div class="cost-grid">
      <div class="cost-card fade-up">
        <div class="cost-icon"><span class="icon">${icons.dollar.replace('width="22" height="22"','width="24" height="24"').replace('stroke="currentColor"','stroke="#fca5a5"')}</span></div>
        <h3>ריבית מיותרת של 7–10%</h3>
        <p>על כל ₪200,000 הלוואה "לכל מטרה" — אתה משלם 4,000–10,000 ₪ ריבית בשנה. שנה אחר שנה.</p>
      </div>
      <div class="cost-card fade-up d1">
        <div class="cost-icon"><span class="icon">${icons.ban.replace('width="22" height="22"','width="24" height="24"').replace('stroke="currentColor"','stroke="#fca5a5"')}</span></div>
        <h3>חסימה בנקאית לצמיתות</h3>
        <p>מ-1.7.26 הבנק לא יוכל לאחד. לא מדיניות — חוק. לא יהיה "חלון אחר". פספסת — פספסת.</p>
      </div>
      <div class="cost-card fade-up d2">
        <div class="cost-icon"><span class="icon">${icons.lock.replace('width="18" height="18"','width="24" height="24"').replace('stroke="currentColor"','stroke="#fca5a5"')}</span></div>
        <h3>תזרים לחוץ לשנים</h3>
        <p>כשאתה משלם 2–3 הלוואות — אין כסף לחסכון, אין לחופש, אין לדברים שחשובים. הכסף "נבלע".</p>
      </div>
    </div>
    <div class="deadline-card">
      <div class="dl-icon"><span class="icon">${icons.siren.replace('width="22" height="22"','width="26" height="26"')}</span></div>
      <div>
        <h3>30 ביוני 2026 — התאריך שאסור לפספס</h3>
        <p>זו לא סיסמה שיווקית. זה תאריך ספציפי שנקבע על-ידי בנק ישראל. בדוק כמה ימים נותרו בספירה למעלה — ואז תחליט.</p>
      </div>
    </div>
  </div>
</section>

<!-- HOW IT WORKS -->
<section class="section sec-gray" id="how-it-works">
  <div class="container">
    <div style="text-align:center;margin-bottom:56px">
      <div class="tag"><span class="icon">${icons.refresh.replace('width="18" height="18"','width="13" height="13"')}</span>תהליך העבודה</div>
      <h2 class="sec-h">3 צעדים —<br/><span class="g-text">מהשיחה הראשונה לכסף בכיס</span></h2>
    </div>
    <div class="steps-wrap">
      <div class="steps-line" id="steps-line"></div>
      <div class="steps-grid">
        <div class="step active fade-up">
          <div class="step-num"><span class="icon">${icons.msgCircle.replace('width="18" height="18"','width="28" height="28"')}</span></div>
          <h3>שיחת אבחון חינמית</h3>
          <p>20 דקות. תספר לי על ההלוואות, ההכנסות, מבנה הנכס. אגיד לך ישר — אם יש כאן פוטנציאל חיסכון ואם הזמן כדאי.</p>
          <div class="step-tag"><span class="icon">${icons.clock.replace('width="18" height="18"','width="13" height="13"')}</span>20 דקות בלבד</div>
        </div>
        <div class="step active fade-up d1">
          <div class="step-num"><span class="icon">${icons.file.replace('width="18" height="18"','width="28" height="28"')}</span></div>
          <h3>תכנית מדויקת עם מספרים</h3>
          <p>תוך 48 שעות אבנה תכנית: אילו הלוואות לאחד, ריבית צפויה, כמה חוסכים בחודש. לא הבטחות — מספרים אמיתיים.</p>
          <div class="step-tag"><span class="icon">${icons.chart.replace('width="22" height="22"','width="13" height="13"')}</span>חיסכון ממוצע: 1,500–3,500 ₪/חודש</div>
        </div>
        <div class="step active fade-up d2">
          <div class="step-num"><span class="icon">${icons.building.replace('width="18" height="18"','width="28" height="28"')}</span></div>
          <h3>ליווי מלא מול הבנק</h3>
          <p>אני עובד מולך ומול הבנק — ממשא ומתן על הריבית, הכנת המסמכים, ועד החתימה הסופית. אתה לא לבד בשום שלב.</p>
          <div class="step-tag"><span class="icon">${icons.award.replace('width="18" height="18"','width="13" height="13"')}</span>ליווי עד הסגירה</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ABOUT -->
<section class="section sec-white" id="about">
  <div class="container">
    <div class="about-grid">
      <div class="about-img-wrap fade-up">
        <img class="about-img" src="${PHOTO}" alt="שיראל פרגר — MAKE SENSE"/>
        <div class="hfca-badge"><img src="${HFCA}" alt="חבר התאחדות"/></div>
        <div class="years-badge"><span class="num">500+</span><span class="lbl">משפחות שעזרתי להן</span></div>
      </div>
      <div class="about-content fade-up d1">
        <div class="about-tag"><span class="icon">${icons.user.replace('width="18" height="18"','width="14" height="14"')}</span>מי אני?</div>
        <h2>שיראל פרגר —<br/>הופך ידע בנקאי<br/><span class="g-text">לכסף פנוי בכיס</span></h2>
        <p>אני יועץ משכנתאות ופיננסי, ומתמחה בדיוק בנקודה שבה בנקים לא ממהרים לעזור: ארגון מחדש של הלוואות קיימות כדי לשחרר תזרים. עבדתי עם מאות משפחות שחיפשו "מאיפה לחסוך" — ורובן גילו שהתשובה לא היתה בצמצום, אלא בניהול חכם יותר של ההתחייבויות.</p>
        <ul class="cred-list">
          <li class="cred-item"><div class="cred-check"><span class="icon">${icons.check}</span></div><span>יועץ מוסמך ורשום — חבר התאחדות יועצי המשכנתאות בישראל</span></li>
          <li class="cred-item"><div class="cred-check"><span class="icon">${icons.check}</span></div><span>ניסיון ישיר מול כל הבנקים הגדולים — פועלים, לאומי, מזרחי, דיסקונט, הבינלאומי</span></li>
          <li class="cred-item"><div class="cred-check"><span class="icon">${icons.check}</span></div><span>מתמחה באיחוד הלוואות, מחזורים ותכנון פיננסי משפחתי</span></li>
          <li class="cred-item"><div class="cred-check"><span class="icon">${icons.check}</span></div><span>עובד <strong>בשבילך</strong> בלבד — לא בשביל הבנק, לא בשביל עמלות צד ג'</span></li>
        </ul>
        <div class="about-links">
          <a href="https://hfca.org.il/userprofile/?id=1381" target="_blank" class="link-pill"><span class="icon">${icons.building.replace('width="18" height="18"','width="14" height="14"')}</span>פרופיל HFCA<span class="icon">${icons.external}</span></a>
          <a href="https://www.balance-home.co.il/" target="_blank" class="link-pill"><span class="icon">${icons.eye.replace('width="18" height="18"','width="14" height="14"')}</span>balance-home.co.il<span class="icon">${icons.external}</span></a>
          <a href="https://wa.me/972524415395" target="_blank" class="link-pill"><span class="icon">${icons.phone.replace('width="18" height="18"','width="14" height="14"')}</span>052-441-5395</a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- OBJECTIONS -->
<section class="obj-section" id="objections" aria-labelledby="obj-heading">
  <div class="container">
    <div style="text-align:center;margin-bottom:8px">
      <div class="tag"><span class="icon">${icons.help.replace('width="18" height="18"','width="13" height="13"')}</span>שאלות אמיתיות</div>
      <h2 class="sec-h" id="obj-heading">מה עובר לך בראש<br/><span class="g-text">עכשיו בזמן שאתה קורא?</span></h2>
      <p class="sec-p" style="margin:10px auto 0">ריכזתי את כל החששות שאני שומע — עם תשובות ישרות</p>
    </div>

    <div class="obj-grid">
      ${[
        ['כמה זה עולה לי?',
         'שיחת אבחון — <b>חינמית לחלוטין.</b> אם נמשיך: שכ"ט מוסכם מראש, שקוף, ללא הפתעות. לא גובה עמלות מהבנק.'],
        ['אני לא בטוח שאני מתאים.',
         'רוב האנשים חושבים כך. <b>20 דקות אבחון — ואנחנו יודעים.</b> שמעתי "לא מתאים" מלקוחות שחסכו 2,000 ₪ בחודש.'],
        ['אני יכול לדבר לבד עם הבנק.',
         'אפשר. אבל הבנק בא מוכן — אתה לא. <b>הפרש ריבית ממוצע שאני משיג ללקוחות: 0.4%–0.8%.</b> על 200K ₪ זה 1,600 ₪ בשנה.'],
        ['כבר פניתי לבנק — הם אמרו לא.',
         '<b>הבנק ענה למה שביקשת</b> — לא למה שאפשר לבקש. ניסיון זה לדעת איך לנסח, מה להביא, ואיך לנהל מו"מ.'],
        ['אין לי זמן לעסוק בזה.',
         '<b>20 דקות</b> שיחה. <b>48 שעות</b> לתכנית. <b>3–6 שבועות</b> לתוצאה. לעומת: תשלום ריביות מיותרות לשנים.'],
        ['זה נשמע טוב מדי להיות אמיתי.',
         'לא קסם — <b>פעולה מפוקחת ע"י בנק ישראל.</b> מאות משפחות עשו זאת. הלקוחות בדף הזה — אמיתיים, עם שמות.'],
        ['מה יקרה לדירוג האשראי שלי?',
         'תהליך נכון לא פוגע בדירוג. <b>הפחתת חוב פעיל בריבית גבוהה — משפרת אותו לאורך זמן.</b> נבדוק לפני שמגישים כל בקשה.'],
        ['אולי עדיף לחכות שהריבית תרד?',
         'ריבית פריים — לא ידוע מתי תרד ובכמה. <b>מ-1.7.2026 — האיחוד חסום בחוק.</b> החלון לא מחכה לריבית.'],
        ['אני לא רוצה שהבנק "יסתכל עלי" לרעה.',
         'בקשה מסודרת מראה ניהול פיננסי חכם. <b>לקוח שמבין את הזכויות שלו — מקבל יחס אחר.</b>'],
        ['יש לי כבר יועץ / הבנק "ידאג לי".',
         'הבנק עובד בשביל הבנק — לא בשבילך. <b>אני מייצג אותך בלבד.</b> כל עמלה שאני חוסך לך — ישירות לכיסך.'],
      ].map(([q,a])=>`
      <div class="obj-card">
        <div class="obj-q">
          <div class="obj-q-icon"><span class="icon">${icons.help.replace('width="18" height="18"','width="12" height="12"')}</span></div>
          ${q}
        </div>
        <div class="obj-a">${a}</div>
      </div>`).join('')}
    </div>

    <div class="not-for-box" role="region" aria-label="למי מתאים ולמי לא">
      <div>
        <div class="not-for-title"><span class="icon">${icons.ban.replace('width="22" height="22"','width="16" height="16"').replace('stroke="currentColor"','stroke="var(--red)"')}</span>למי זה <u>לא</u> מתאים</div>
        <ul class="not-for-list">
          <li><span class="icon">${icons.ban.replace('width="22" height="22"','width="13" height="13"').replace('stroke="currentColor"','stroke="var(--red)"')}</span>סה"כ הלוואות מחוץ למשכנתה מתחת ל-₪50,000</li>
          <li><span class="icon">${icons.ban.replace('width="22" height="22"','width="13" height="13"').replace('stroke="currentColor"','stroke="var(--red)"')}</span>מתכנן למכור את הנכס בשנה הקרובה</li>
          <li><span class="icon">${icons.ban.replace('width="22" height="22"','width="13" height="13"').replace('stroke="currentColor"','stroke="var(--red)"')}</span>ניצול נכס (LTV) גבוה מ-75% ללא גמישות</li>
          <li><span class="icon">${icons.ban.replace('width="22" height="22"','width="13" height="13"').replace('stroke="currentColor"','stroke="var(--red)"')}</span>מחפש פתרון קסם — בלי להבין מספרים</li>
        </ul>
      </div>
      <div>
        <div class="not-for-title" style="color:var(--green)"><span class="icon">${icons.check.replace('width="14" height="14"','width="16" height="16"').replace('stroke="currentColor"','stroke="var(--green)"')}</span>למי זה <u>כן</u> מתאים</div>
        <ul class="not-for-list for-list">
          <li><span class="icon">${icons.check.replace('width="14" height="14"','width="13" height="13"').replace('stroke="currentColor"','stroke="var(--green)"')}</span>יש לך נכס עם הלוואות מחוץ למשכנתה</li>
          <li><span class="icon">${icons.check.replace('width="14" height="14"','width="13" height="13"').replace('stroke="currentColor"','stroke="var(--green)"')}</span>ההחזר החודשי לוחץ על התזרים</li>
          <li><span class="icon">${icons.check.replace('width="14" height="14"','width="13" height="13"').replace('stroke="currentColor"','stroke="var(--green)"')}</span>רוצה לדעת בדיוק מה המצב — ולפעול בזמן</li>
          <li><span class="icon">${icons.check.replace('width="14" height="14"','width="13" height="13"').replace('stroke="currentColor"','stroke="var(--green)"')}</span>מעדיף מישהו שעובד בשבילו — לא בשביל הבנק</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- TESTIMONIALS -->
<section class="section sec-gray" id="testimonials">
  <div class="container">
    <div style="text-align:center;margin-bottom:40px">
      <div class="tag"><span class="icon">${icons.star.replace('width="16" height="16"','width="13" height="13"')}</span>תוצאות אמיתיות</div>
      <h2 class="sec-h">משפחות שפעלו בזמן —<br/><span class="g-text">ומרגישות את זה בכיס</span></h2>
    </div>
    <div class="testi-grid">
      <div class="testi-card fade-up">
        <div class="saving-badge"><span class="icon">${icons.dollar.replace('width="22" height="22"','width="14" height="14"').replace('stroke="currentColor"','stroke="#15803d"')}</span>חיסכון: 2,200 ₪/חודש</div>
        <div class="stars">${[1,2,3,4,5].map(()=>`<span class="icon">${icons.star}</span>`).join('')}</div>
        <blockquote>לא האמנתי שזה אפשרי. שיראל מיפה את כל ההלוואות שלנו ב-48 שעות ובנה תכנית עם מספרים אמיתיים. <b>חסכנו 2,200 ₪ בחודש</b> — כסף שעשה לנו חופש.</blockquote>
        <div class="testi-author"><div class="author-av">מ.כ</div><div><span class="author-name">מ. כהן</span><span class="author-detail">בעלת דירה בפ"ת | איחוד 3 הלוואות</span></div></div>
      </div>
      <div class="testi-card fade-up d1">
        <div class="saving-badge"><span class="icon">${icons.dollar.replace('width="22" height="22"','width="14" height="14"').replace('stroke="currentColor"','stroke="#15803d"')}</span>חיסכון: 1,700 ₪/חודש</div>
        <div class="stars">${[1,2,3,4,5].map(()=>`<span class="icon">${icons.star}</span>`).join('')}</div>
        <blockquote>חשבתי שאנחנו "תקועים" עם ההחזר לכל החיים. שיראל גילה שניתן להוריד מ-6,500 ₪ ל-4,800 ₪. <b>עכשיו יש לנו גם מה לחסוך בסוף חודש.</b></blockquote>
        <div class="testi-author"><div class="author-av">א.ר</div><div><span class="author-name">א. ריכטר</span><span class="author-detail">זוג מרמת גן | מחזור + איחוד</span></div></div>
      </div>
      <div class="testi-card fade-up d2">
        <div class="saving-badge"><span class="icon">${icons.dollar.replace('width="22" height="22"','width="14" height="14"').replace('stroke="currentColor"','stroke="#15803d"')}</span>חיסכון: 3,100 ₪/חודש</div>
        <div class="stars">${[1,2,3,4,5].map(()=>`<span class="icon">${icons.star}</span>`).join('')}</div>
        <blockquote>פנינו לשיראל חודשיים לפני הדדליין. הוא הדריך אותנו צעד אחר צעד וניהל מו"מ עם הבנק בשבילנו. <b>חוסכים 3,100 ₪ בחודש</b> ויש לנו שקט נפשי.</blockquote>
        <div class="testi-author"><div class="author-av">ל.ש</div><div><span class="author-name">ל. שמש</span><span class="author-detail">משפחה מחיפה | ניצול חלון הזדמנויות</span></div></div>
      </div>
    </div>
  </div>
</section>

<!-- PROOF VIDEOS -->
<section class="videos-section" id="proof" style="background:#fff">
  <div class="container">
    <div style="text-align:center;margin-bottom:8px">
      <div class="tag" style="background:rgba(255,157,0,.1);color:var(--amber-d)"><span class="icon">${icons.eye.replace('width="18" height="18"','width="13" height="13"').replace('stroke="currentColor"','stroke="var(--amber-d)"')}</span>הוכחה מהשטח</div>
      <h2 class="sec-h">ראה איך מהלך כזה<br/><span class="g-text">נראה בפועל</span></h2>
      <p class="sec-p" style="margin:10px auto 0">לא הבטחות — תהליכים אמיתיים, מספרים אמיתיים, שיחות עם לקוחות אמיתיים</p>
    </div>
    <div class="videos-grid videos-grid-2">
      <div class="video-wrap"><iframe src="https://www.youtube-nocookie.com/embed/uerpLWnmYv8" title="הוכחה מהשטח 1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
      <div class="video-wrap"><iframe src="https://www.youtube-nocookie.com/embed/82p49ro4zuU?start=45" title="הוכחה מהשטח 2" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
    </div>
  </div>
</section>

<!-- VIDEOS -->
<section class="videos-section" id="videos">
  <div class="container">
    <div style="text-align:center;margin-bottom:8px">
      <div class="tag"><span class="icon">${icons.star.replace('width="16" height="16"','width="13" height="13"')}</span>לקוחות ממליצים</div>
      <h2 class="sec-h">הם כבר פעלו —<br/><span class="g-text">תשמע ישירות מהם</span></h2>
      <p class="sec-p" style="margin:10px auto 0">לא מילים שלי — סרטונים אמיתיים מלקוחות שחסכו אלפי שקלים בחודש</p>
    </div>
    <div class="videos-grid">
      <div class="video-wrap"><iframe src="https://www.youtube-nocookie.com/embed/5SQnHGV9aW4"  title="המלצת לקוח 1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
      <div class="video-wrap"><iframe src="https://www.youtube-nocookie.com/embed/Y_4tQWMqOCs"   title="המלצת לקוח 2" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
      <div class="video-wrap"><iframe src="https://www.youtube-nocookie.com/embed/_VVXHzMNYo0"  title="המלצת לקוח 3" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
      <div class="video-wrap"><iframe src="https://www.youtube-nocookie.com/embed/ZCQg9UpUB9Y"  title="המלצת לקוח 4" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
      <div class="video-wrap"><iframe src="https://www.youtube-nocookie.com/embed/QAeCAVgDzIA"  title="המלצת לקוח 5" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
    </div>
  </div>
</section>

<!-- MORTGAGE UPLOAD -->
<section class="mort-section" id="upload" aria-labelledby="mort-title">
  <div class="container">
    <div class="mort-grid">
      <div>
        <div class="mort-badge"><span class="icon">${icons.file.replace('width="18" height="18"','width="12" height="12"').replace('stroke="currentColor"','stroke="var(--amber)"')}</span>בדיקה חכמה</div>
        <h2 class="mort-title" id="mort-title">העלה את יתרות המשכנתה שלך<br/>לבדיקה — מקבל תשובה תוך 24 שעות</h2>
        <p class="mort-desc">רוצה לדעת בדיוק כמה אתה יכול לחסוך? העלה את דוח יתרות המשכנתה שלך — אנחנו נבדוק, ננתח, ונחזור אליך עם מספרים אמיתיים.</p>
        <ul class="mort-steps" aria-label="שלבי התהליך">
          <li class="mort-step"><span class="mort-step-num" aria-hidden="true">1</span><span class="mort-step-text"><b>מלא שם ומספר טלפון</b> בטופס</span></li>
          <li class="mort-step"><span class="mort-step-num" aria-hidden="true">2</span><span class="mort-step-text"><b>עלה לפלטפורמת הבדיקה</b> — תועבר אוטומטית</span></li>
          <li class="mort-step"><span class="mort-step-num" aria-hidden="true">3</span><span class="mort-step-text"><b>העלה את קובץ יתרות המשכנתה</b> (PDF מהבנק)</span></li>
          <li class="mort-step"><span class="mort-step-num" aria-hidden="true">4</span><span class="mort-step-text"><b>מקבל ניתוח + המלצה</b> תוך 24 שעות ישירות אליך</span></li>
        </ul>
      </div>
      <div class="mort-card">
        <h3>השאר פרטים → העלה קובץ</h3>
        <p>לאחר מילוי הפרטים תועבר אוטומטית לפלטפורמת ההעלאה</p>
        <form class="mort-form" id="mort-form" onsubmit="submitMortForm(event)" novalidate>
          <div class="form-field">
            <label for="mf-name">שם מלא <span aria-hidden="true" style="color:var(--red)">*</span></label>
            <input id="mf-name" type="text" placeholder="ישראל ישראלי" required autocomplete="name" aria-required="true"/>
          </div>
          <div class="form-field">
            <label for="mf-phone">טלפון <span aria-hidden="true" style="color:var(--red)">*</span></label>
            <input id="mf-phone" type="tel" placeholder="05X-XXX-XXXX" required autocomplete="tel" aria-required="true"/>
          </div>
          <div class="form-field">
            <label for="mf-bank">שם הבנק (אופציונלי)</label>
            <input id="mf-bank" type="text" placeholder="לאומי / פועלים / מזרחי..." autocomplete="off"/>
          </div>
          <button type="submit" class="mort-submit" aria-label="שלח פרטים ועבור להעלאת קובץ">
            <span class="icon">${icons.file.replace('width="18" height="18"','width="16" height="16"')}</span>
            שלח → העלה קובץ יתרות
          </button>
          <p class="mort-note">הנתונים מוצפנים ומאובטחים. לא מועברים לצד שלישי.</p>
        </form>
      </div>
    </div>
  </div>
</section>

<!-- GUIDE LEAD FORM -->
<section class="guide-section" id="guide">
  <div class="container">
    <div class="guide-grid">
      <div>
        <div class="guide-label"><span class="icon">${icons.file.replace('width="18" height="18"','width="13" height="13"').replace('stroke="currentColor"','stroke="#fff"')}</span>מדריך חינמי</div>
        <h2 class="guide-title">תרשים תהליך מחזור משכנתה ואיחוד הלוואות — כל הצעדים בדף אחד</h2>
        <p class="guide-desc">הורד את המדריך המקצועי שאני נותן ללקוחות שלי — צעד אחר צעד מהאבחון ועד לחיסכון בכיס. בחינם, ללא שלוחים.</p>
        <ul class="guide-bullets">
          <li><span class="icon">${icons.check.replace('width="14" height="14"','width="13" height="13"')}</span>תרשים מלא של כל שלב בתהליך המחזור</li>
          <li><span class="icon">${icons.check.replace('width="14" height="14"','width="13" height="13"')}</span>מה צריך להכין לפגישה עם הבנק</li>
          <li><span class="icon">${icons.check.replace('width="14" height="14"','width="13" height="13"')}</span>איך מנהלים מו"מ נכון על הריבית</li>
          <li><span class="icon">${icons.check.replace('width="14" height="14"','width="13" height="13"')}</span>מה לא לחתום עליו לפני שמבינים</li>
        </ul>
      </div>
      <div class="guide-card">
        <h3>קבל גישה מיידית למדריך</h3>
        <p>השאר שם ומספר — ואני אשלח לך את המדריך ישירות</p>
        <form class="guide-form" id="guide-form" onsubmit="submitGuideForm(event)">
          <div class="form-field">
            <label for="gf-name">שם מלא</label>
            <input id="gf-name" type="text" placeholder="ישראל ישראלי" required autocomplete="name"/>
          </div>
          <div class="form-field">
            <label for="gf-phone">מספר טלפון</label>
            <input id="gf-phone" type="tel" placeholder="05X-XXX-XXXX" required autocomplete="tel"/>
          </div>
          <button type="submit" class="guide-submit">
            <span class="icon">${icons.file.replace('width="18" height="18"','width="16" height="16"').replace('stroke="currentColor"','stroke="#fff"')}</span>
            פתח את המדריך עכשיו
          </button>
          <p class="guide-privacy">המידע שלך מאובטח ולא יועבר לצד שלישי</p>
        </form>
      </div>
    </div>
  </div>
</section>

<!-- PDF MODAL -->
<div class="pdf-overlay" id="pdf-modal">
  <div class="pdf-topbar">
    <span class="pdf-topbar-title">תרשים תהליך מחזור משכנתה ואיחוד הלוואות</span>
    <button class="pdf-close-btn" onclick="closePdf()">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      סגור
    </button>
  </div>
  <div class="pdf-iframe-wrap">
    <iframe id="pdf-frame" src="" title="מדריך מחזור משכנתה"></iframe>
  </div>
</div>

<!-- FAQ -->
<section class="section sec-white" id="faq">
  <div class="container">
    <div style="text-align:center;margin-bottom:40px">
      <div class="tag"><span class="icon">${icons.help.replace('width="18" height="18"','width="13" height="13"')}</span>שאלות נפוצות</div>
      <h2 class="sec-h">שאלת? <span class="g-text">כנראה כבר שאלו לפניך</span></h2>
    </div>
    <div class="faq-wrap">
      ${[
        ['מה זה "איחוד הלוואות לתוך המשכנתא" בפשטות?','לוקחים את כל ההלוואות שלך — הלוואות אישיות, "לכל מטרה" על הנכס, הלוואות שיפוץ — ומשלבים אותן לתוך משכנתא אחת. התוצאה: ריבית נמוכה יותר, החזר חודשי נמוך יותר, וסדר כלכלי.'],
        ['למה דווקא עד 30.6.2026? מה ישתנה?','חוזר בנק ישראל 2840 קובע שמ-1.7.2026 הלוואות "לכל מטרה" על נכס ייחשבו בחישוב ה-DTI המוגבל ל-40%. בפועל — הבנק לא יוכל לאשר איחוד כי יחרוג מהמגבלה. כיום, לפני 30.6.26, החלון עדיין פתוח.'],
        ['כמה כסף אפשר לחסוך? יש מספרים?','זה תלוי בגובה ההלוואות וריביותיהן. הלקוחות שעבדתי איתם חוסכים בין 1,000 ל-3,500 ₪ בחודש. על הלוואה של 200,000 ₪ בריבית של 8% — משלמים 16,000 ₪ ריבית בשנה. איחוד לריבית של 4.5% חוסך 7,000 ₪ בשנה — ו-70,000 ₪ על 10 שנים.'],
        ['האם כל אחד יכול לאחד?','לא כולם מתאימים — זה תלוי ב-LTV (שיעור ניצול הנכס), ה-DTI (יחס ההחזר להכנסה), ומצב ההלוואות הקיים. בדיוק בשביל זה שיחת האבחון קיימת — תוך 20 דקות אנחנו יודעים אם יש כאן פוטנציאל.'],
        ['כמה עולה הייעוץ?','שיחת האבחון הראשונית וניתוח הכלכלי — חינמיים לחלוטין. אם נחליט להמשיך, שכ"ט מוסכם מראש ושקוף, ללא הפתעות. לא גובה עמלות מהבנק — עובד בשבילך בלבד.'],
        ['כמה זמן לוקח? יש זמן עד 30.6.26?','שיחת אבחון: 20 דקות. תכנית: 48 שעות. תהליך מול הבנק: 3–6 שבועות. יש זמן — אבל לא אינסופי. ככל שמתחילים מוקדם יותר, פחות לחץ ויותר מרחב לנהל מו"מ טוב יותר.'],
      ].map(([q,a])=>`
      <div class="faq-item">
        <div class="faq-q" onclick="tog(this)">${q}<div class="faq-btn">${icons.arrowLeft.replace('width="16" height="16"','width="14" height="14"').replace('polyline points="12 19 5 12 12 5"','polyline points="6 9 12 15 18 9"')}</div></div>
        <div class="faq-a">${a}</div>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- FINAL CTA -->
<section class="final-cta" id="contact">
  <div class="container">
    <div class="cta-box">
      <div class="mini-cd">
        <span class="icon">${icons.alert.replace('width="18" height="18"','width="16" height="16"')}</span>
        נותרו: <span id="final-cd">—</span> ימים לפני סגירת החלון
      </div>
      <h2>כל יום שעובר<br/>עולה לך כסף אמיתי</h2>
      <p>שלח הודעה עכשיו — תוך שעה אחזור אליך לשיחת אבחון חינמית של 20 דקות. בלי התחייבות, בלי לחץ.</p>
      <div class="cta-btns">
        <a href="https://wa.me/972524415395?text=היי שיראל! ראיתי את הדף על הוראת בנק ישראל ורוצה לבדוק אם אני יכול לאחד הלוואות לפני 30.6.26. מתי אפשר לדבר?" target="_blank" class="btn-primary-big">
          <span class="icon">${icons.wa}</span>
          שלח הודעה בוואטספ — עכשיו
        </a>
        <a href="tel:+972524415395" class="btn-phone">
          <span class="icon">${icons.phone}</span>
          052-441-5395
        </a>
      </div>
      <div class="no-obligation">
        <span class="trust-item"><span class="icon">${icons.check.replace('width="14" height="14"','width="13" height="13"')}</span>ייעוץ ראשוני חינמי</span>
        <span style="color:var(--g200)">·</span>
        <span class="trust-item"><span class="icon">${icons.check.replace('width="14" height="14"','width="13" height="13"')}</span>ללא התחייבות</span>
        <span style="color:var(--g200)">·</span>
        <span class="trust-item"><span class="icon">${icons.check.replace('width="14" height="14"','width="13" height="13"')}</span>תשובה תוך שעה</span>
      </div>
    </div>
  </div>
</section>

<!-- SOCIAL -->
<div class="social-bar">
  <div class="container">
    <p class="social-label">עקבו אחרי לתכנים על משכנתאות, פיננסים וכלכלת המשפחה</p>
    <div class="social-icons">
      <a href="https://www.instagram.com/shirelpra/" target="_blank" class="s-icon ig"><svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
      <a href="https://www.facebook.com/MakeSenseByShirel" target="_blank" class="s-icon fb"><svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
      <a href="https://www.youtube.com/@makesense.morgage" target="_blank" class="s-icon yt"><svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
      <a href="https://www.linkedin.com/in/shirel-prager/" target="_blank" class="s-icon li"><svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
      <a href="https://www.tiktok.com/@shirelpra" target="_blank" class="s-icon tt"><svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.52V6.76a4.85 4.85 0 01-1.02-.07z"/></svg></a>
      <a href="https://wa.me/972524415395" target="_blank" class="s-icon wa"><svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.531 5.846L.057 23.157c-.08.292.195.558.483.464l5.453-1.721A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.012-1.37l-.359-.213-3.723 1.174 1.187-3.63-.233-.371A9.818 9.818 0 0112 2.182c5.428 0 9.818 4.39 9.818 9.818S17.428 21.818 12 21.818z"/></svg></a>
    </div>
  </div>
</div>

<!-- FOOTER -->
<footer>
  <div class="container">
    <img class="footer-logo" src="${LOGO}" alt="MAKE SENSE"/>
    <div class="footer-links">
      <a href="https://hfca.org.il/userprofile/?id=1381" target="_blank">HFCA — פרופיל</a>
      <a href="https://www.balance-home.co.il/" target="_blank">balance-home.co.il</a>
      <a href="tel:+972524415395">052-441-5395</a>
      <a href="mailto:sp.makesense@gmail.com">sp.makesense@gmail.com</a>
    </div>
    <p>© 2026 MAKE SENSE | שיראל פרגר — יועץ משכנתאות, פיננסים וליווי כלכלי</p>
    <p style="margin-top:6px;font-size:11px;color:rgba(255,255,255,.22)">המידע הוא למטרות מידע כללי בלבד ואינו מהווה ייעוץ משפטי, פיננסי או השקעתי.</p>
  </div>
</footer>

<!-- WARMUP POPUP -->
<div class="popup-overlay" id="warmup-overlay">
  <div class="popup-box" role="dialog" aria-modal="true" aria-label="שאלון אישי">

    <!-- STEP 1 -->
    <div id="popup-step1">
      <div class="popup-top">
        <button class="popup-close" onclick="closePopup()" aria-label="סגור">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div class="popup-top-label">שאלה 1 מתוך 2</div>
        <div class="popup-top-title">לפני שמדברים — שאלה קטנה</div>
        <div class="popup-top-sub">תשובות גלויות עוזרות לי להבין איפה אתה עומד</div>
        <div class="popup-progress"><span class="done"></span><span></span></div>
      </div>
      <div class="popup-body">
        <div class="popup-q-label">שאלה ראשונה</div>
        <div class="popup-q-text">כמה אתה מחזיר כיום על הלוואות<br/>מחוץ למשכנתה?</div>
        <div class="popup-opts" id="q1-opts">
          <button class="opt-btn" data-val="עד 1000" onclick="selectQ1(this)">
            <div class="opt-icon">${icons.wallet.replace('width="22" height="22"','width="18" height="18"')}</div>
            <div><div class="opt-label">עד ₪1,000 בחודש</div><div class="opt-sub">הלוואה קטנה אחת או שתיים</div></div>
          </button>
          <button class="opt-btn" data-val="1000-2500" onclick="selectQ1(this)">
            <div class="opt-icon">${icons.creditCard.replace('width="22" height="22"','width="18" height="18"')}</div>
            <div><div class="opt-label">₪1,000 – ₪2,500 בחודש</div><div class="opt-sub">כמה הלוואות שנגמרות לאט</div></div>
          </button>
          <button class="opt-btn" data-val="2500-5000" onclick="selectQ1(this)">
            <div class="opt-icon">${icons.dollar.replace('width="22" height="22"','width="18" height="18"')}</div>
            <div><div class="opt-label">₪2,500 – ₪5,000 בחודש</div><div class="opt-sub">מרגיש כבד בתזרים</div></div>
          </button>
          <button class="opt-btn" data-val="מעל 5000" onclick="selectQ1(this)">
            <div class="opt-icon">${icons.frown.replace('width="22" height="22"','width="18" height="18"')}</div>
            <div><div class="opt-label">מעל ₪5,000 בחודש</div><div class="opt-sub">זה כואב כל סוף חודש</div></div>
          </button>
        </div>
      </div>
    </div>

    <!-- STEP 2 -->
    <div id="popup-step2" style="display:none">
      <div class="popup-top">
        <button class="popup-close" onclick="closePopup()" aria-label="סגור">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div class="popup-top-label">שאלה 2 מתוך 2</div>
        <div class="popup-top-title">אחרון — מבטיח</div>
        <div class="popup-top-sub">תגיד לי מה הכיוון שלך, ואני אדע איך לעזור</div>
        <div class="popup-progress"><span class="done"></span><span class="done"></span></div>
      </div>
      <div class="popup-body">
        <div class="popup-q-label">שאלה שנייה</div>
        <div class="popup-q-text">מה היית עושה עם מעל<br/>₪200,000 פנויים?</div>
        <div class="popup-opts grid2" id="q2-opts">
          <button class="opt-btn" data-val="משקיע" onclick="selectQ2(this)" style="flex-direction:column;align-items:center;text-align:center;padding:18px 12px">
            <div class="opt-icon" style="margin-bottom:8px">${icons.chart.replace('width="22" height="22"','width="20" height="20"')}</div>
            <div><div class="opt-label">משקיע</div><div class="opt-sub">נדל"ן, שוק ההון, קרנות</div></div>
          </button>
          <button class="opt-btn" data-val="מכסה חובות" onclick="selectQ2(this)" style="flex-direction:column;align-items:center;text-align:center;padding:18px 12px">
            <div class="opt-icon" style="margin-bottom:8px">${icons.shield.replace('width="18" height="18"','width="20" height="20"')}</div>
            <div><div class="opt-label">מכסה חובות</div><div class="opt-sub">יוצא מההלוואות לגמרי</div></div>
          </button>
          <button class="opt-btn" data-val="צריכה פרטית" onclick="selectQ2(this)" style="flex-direction:column;align-items:center;text-align:center;padding:18px 12px">
            <div class="opt-icon" style="margin-bottom:8px">${icons.bulb.replace('width="22" height="22"','width="20" height="20"')}</div>
            <div><div class="opt-label">צריכה פרטית</div><div class="opt-sub">חופשה, שיפוץ, חינוך</div></div>
          </button>
          <button class="opt-btn" data-val="עוד לא יודע" onclick="selectQ2(this)" style="flex-direction:column;align-items:center;text-align:center;padding:18px 12px">
            <div class="opt-icon" style="margin-bottom:8px">${icons.help.replace('width="18" height="18"','width="20" height="20"')}</div>
            <div><div class="opt-label">עוד לא יודע</div><div class="opt-sub">רוצה קודם לראות מספרים</div></div>
          </button>
        </div>
      </div>
    </div>

    <!-- STEP 3 — RESULT -->
    <div id="popup-step3" style="display:none">
      <div class="popup-top" style="padding-bottom:20px">
        <div class="popup-top-label">תוצאה אישית</div>
        <div class="popup-top-title" id="res-title">יש כאן פוטנציאל אמיתי</div>
        <div class="popup-progress"><span class="done"></span><span class="done"></span></div>
      </div>
      <div class="popup-result">
        <div class="result-icon-wrap">
          ${icons.zap.replace('width="18" height="18"','width="28" height="28"')}
        </div>
        <div class="result-title" id="res-heading">בואו נבדוק יחד את המספרים</div>
        <div class="result-desc" id="res-body">בהתאם לתשובות שלך, <b>יש סבירות גבוהה שאפשר לשחרר לך כסף</b> — בדיוק לפני שהחלון ייסגר ב-30.6.2026.</div>
        <a href="https://wa.me/972524415395?text=היי שיראל! עניתי על השאלון בדף. רוצה לבדוק אם אני יכול לאחד הלוואות לפני 30.6.26 — מתי אפשר לדבר?" target="_blank" class="popup-wa-btn" onclick="closePopup()">
          ${icons.wa}
          שלח לי הודעה בוואטסאפ עכשיו
        </a>
        <button class="popup-skip" onclick="closePopup()">אסגור ואמשיך לקרוא</button>
      </div>
    </div>

  </div>
</div>

<script>
function pad(n){return String(n).padStart(2,'0')}
function tick(){
  const end=new Date('2026-06-30T23:59:59'),now=new Date();
  let diff=Math.max(0,end-now);
  const d=Math.floor(diff/86400000),h=Math.floor(diff%86400000/3600000),
        m=Math.floor(diff%3600000/60000),s=Math.floor(diff%60000/1000);
  ['d','h','m','s'].forEach((id,i)=>{const el=document.getElementById(id);if(el)el.textContent=pad([d,h,m,s][i])});
  const t=document.getElementById('ticker-cd');if(t)t.textContent=pad(d)+':'+pad(h)+':'+pad(m)+':'+pad(s);
  const f=document.getElementById('final-cd');if(f)f.textContent=d;
  const total=72*86400000,pct=Math.min(100,Math.max(0,(1-diff/total)*100));
  const pb=document.getElementById('pb');if(pb)pb.style.width=pct+'%';
}
tick();setInterval(tick,1000);
function tog(el){const item=el.parentElement,open=item.classList.contains('open');document.querySelectorAll('.faq-item.open').forEach(i=>i.classList.remove('open'));if(!open)item.classList.add('open')}
const io=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting)x.target.classList.add('visible')})},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.fade-up').forEach(el=>io.observe(el));
const sl=document.getElementById('steps-line');
if(sl){new IntersectionObserver(([e])=>{if(e.isIntersecting)sl.classList.add('animated')},{threshold:.3}).observe(sl)}
document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}})});

/* ── WARMUP POPUP ── */
let _q1='',_q2='';
function openPopup(){const ov=document.getElementById('warmup-overlay');if(ov)ov.classList.add('show')}
function closePopup(){const ov=document.getElementById('warmup-overlay');if(ov){ov.classList.remove('show');setTimeout(()=>ov.style.display='none',350)}}
function selectQ1(btn){
  document.querySelectorAll('#q1-opts .opt-btn').forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected');_q1=btn.dataset.val;
  setTimeout(()=>{
    document.getElementById('popup-step1').style.display='none';
    document.getElementById('popup-step2').style.display='';
  },280);
}
function selectQ2(btn){
  document.querySelectorAll('#q2-opts .opt-btn').forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected');_q2=btn.dataset.val;
  setTimeout(()=>{
    document.getElementById('popup-step2').style.display='none';
    const s3=document.getElementById('popup-step3');s3.style.display='';
    // personalise result copy
    const titles={
      'משקיע':['איחוד הוא הצעד הראשון להשקעה הבאה','שחרור ₪200K מהלוואות = הון ראשוני שעובד בשבילך. בואו נחשב יחד כמה אפשר לשחרר לפני 30.6.26.'],
      'מכסה חובות':['זה בדיוק מה שאיחוד עושה','לסגור הלוואות יקרות עם ריבית של 8–10% ולהחליף אותן במשכנתא של 4.5% — זה לא חלום. זה מספרים. <b>בואו נבדוק שלך.</b>'],
      'צריכה פרטית':['כסף לדברים שחשובים לך','כשמוריד את ההחזר ב-2,000 ₪ בחודש — פתאום יש כסף. <b>בואו נראה אם אתה זכאי לפני 30.6.</b>'],
      'עוד לא יודע':['קודם המספרים — אחר כך ההחלטה','זה בדיוק נכון. שיחת האבחון עם שיראל היא 20 דקות של מספרים אמיתיים — בלי לחץ, בלי התחייבות.'],
    };
    const [h,b]=titles[_q2]||['יש כאן פוטנציאל אמיתי','בהתאם לתשובות שלך — שווה לבדוק. שיחת אבחון חינמית של 20 דקות.'];
    document.getElementById('res-heading').textContent=h;
    document.getElementById('res-body').innerHTML='בהתאם לתשובות שלך, '+b;
  },280);
}
/* ── ACCESSIBILITY ── */
let _accFontSize=0,_accContrast=false,_accGray=false,_accLinks=false,_accAnim=false,_accCursor=false;
function toggleAcc(){const p=document.getElementById('acc-panel');p.classList.toggle('open');const btn=document.querySelector('.acc-btn');btn.setAttribute('aria-expanded',p.classList.contains('open'))}
function fontSize(dir){
  _accFontSize=Math.max(-3,Math.min(5,_accFontSize+dir));
  document.documentElement.style.fontSize=(100+_accFontSize*8)+'%';
}
function _toggle(id,lbl,cls,flag,key){
  flag=!flag;
  document.body.classList.toggle(cls,flag);
  document.getElementById(lbl).textContent=flag?'פעיל':'כבוי';
  document.getElementById(id).setAttribute('aria-pressed',flag);
  document.getElementById(id).classList.toggle('active',flag);
  return flag;
}
function toggleContrast(){_accContrast=_toggle('acc-contrast','acc-contrast-lbl','acc-high-contrast',_accContrast)}
function toggleGray(){_accGray=_toggle('acc-gray','acc-gray-lbl','acc-grayscale',_accGray)}
function toggleLinks(){_accLinks=_toggle('acc-links','acc-links-lbl','acc-links-highlight',_accLinks)}
function toggleAnim(){_accAnim=_toggle('acc-anim','acc-anim-lbl','acc-no-anim',_accAnim)}
function toggleCursor(){_accCursor=_toggle('acc-cursor','acc-cursor-lbl','acc-big-cursor',_accCursor)}
function resetAcc(){
  _accFontSize=0;_accContrast=false;_accGray=false;_accLinks=false;_accAnim=false;_accCursor=false;
  document.documentElement.style.fontSize='';
  ['acc-high-contrast','acc-grayscale','acc-links-highlight','acc-no-anim','acc-big-cursor'].forEach(c=>document.body.classList.remove(c));
  ['acc-contrast-lbl','acc-gray-lbl','acc-links-lbl','acc-anim-lbl','acc-cursor-lbl'].forEach(id=>{document.getElementById(id).textContent='כבוי'});
  ['acc-contrast','acc-gray','acc-links','acc-anim','acc-cursor'].forEach(id=>{document.getElementById(id).setAttribute('aria-pressed','false');document.getElementById(id).classList.remove('active')});
}
// close acc panel on outside click
document.addEventListener('click',function(e){const p=document.getElementById('acc-panel');if(p.classList.contains('open')&&!p.contains(e.target)&&!e.target.closest('.acc-btn'))p.classList.remove('open')});

/* ── MORTGAGE UPLOAD FORM ── */
function submitMortForm(e){
  e.preventDefault();
  const name=document.getElementById('mf-name').value.trim();
  const phone=document.getElementById('mf-phone').value.trim();
  const bank=document.getElementById('mf-bank').value.trim();
  if(!name||!phone)return;
  const btn=e.target.querySelector('.mort-submit');
  btn.textContent='מעביר אותך...';btn.disabled=true;
  const msg=encodeURIComponent('היי שיראל! '+name+' ('+phone+')'+(bank?' מבנק '+bank:'')+' מילא טופס ורוצה להעלות יתרות משכנתה לבדיקה.');
  setTimeout(()=>{
    window.open('https://wa.me/972524415395?text='+msg,'_blank');
    window.open('https://app.wisecard.co.il/c/SimulatorPDF/22dab606e30f/43e60f4856e392729c09f3c517c2a277','_blank');
    btn.textContent='✓ פותח פלטפורמת העלאה...';
  },400);
}

/* ── GUIDE PDF ── */
const _GUIDE_SRC = '${GUIDE}';
function submitGuideForm(e){
  e.preventDefault();
  const name=document.getElementById('gf-name').value.trim();
  const phone=document.getElementById('gf-phone').value.trim();
  if(!name||!phone)return;
  // open PDF modal
  const modal=document.getElementById('pdf-modal');
  const frame=document.getElementById('pdf-frame');
  frame.src=_GUIDE_SRC;
  modal.classList.add('show');
  // open WhatsApp notification to Shirel
  const msg=encodeURIComponent('היי שיראל! '+name+' ('+phone+') הוריד את המדריך מדף הנחיתה ומעוניין לבדוק זכאות לפני 30.6.26');
  setTimeout(()=>window.open('https://wa.me/972524415395?text='+msg,'_blank'),800);
}
function closePdf(){
  const modal=document.getElementById('pdf-modal');
  modal.classList.remove('show');
  setTimeout(()=>{document.getElementById('pdf-frame').src=''},300);
}
document.getElementById('pdf-modal')?.addEventListener('click',function(e){if(e.target===this)closePdf()});

// show popup after 4 seconds
setTimeout(openPopup,4000);
// close on overlay click
document.getElementById('warmup-overlay')?.addEventListener('click',function(e){if(e.target===this)closePopup()});
</script>
</body>
</html>`;

fs.writeFileSync('./index.html', html, 'utf8');
const size = fs.statSync('./index.html').size;
console.log('Built successfully. File size:', (size/1024).toFixed(0), 'KB');
