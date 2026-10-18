// Local server for the marketing studio: serves the app and proxies allow-listed
// Israeli government data sources (CBS index API, GovMap real-estate deals, data.gov.il)
// so the browser is not blocked by CORS.  Usage: node server.js [port]
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const Govmap = require('./js/govmap.js');

const PORT = +(process.argv[2] || process.env.PORT || 8080);
const ROOT = __dirname;
const ALLOWED_HOSTS = ['api.cbs.gov.il', 'www.cbs.gov.il', 'data.gov.il', 'www.nadlan.gov.il', 'nadlan.gov.il', 'www.govmap.gov.il'];
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

function proxy(target, res) {
  let url;
  try { url = new URL(target); } catch { res.writeHead(400); return res.end('bad url'); }
  if (url.protocol !== 'https:' || !ALLOWED_HOSTS.includes(url.hostname)) { res.writeHead(403); return res.end('host not allowed'); }
  const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 NadlanMarketingStudio', Accept: 'application/json,text/plain,*/*' }, timeout: 20000 }, up => {
    if (up.statusCode >= 300 && up.statusCode < 400 && up.headers.location) { up.resume(); return proxy(new URL(up.headers.location, url).toString(), res); }
    res.writeHead(up.statusCode, { 'Content-Type': up.headers['content-type'] || 'application/json', 'Cache-Control': 'public, max-age=3600' });
    up.pipe(res);
  });
  req.on('timeout', () => req.destroy(new Error('timeout')));
  req.on('error', e => { if (!res.headersSent) res.writeHead(502); res.end(String(e.message)); });
}

async function govHttp(url, { method = 'GET', body } = {}) {
  const r = await fetch(url, {
    method, body: body ? JSON.stringify(body) : undefined,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': 'Mozilla/5.0 NadlanMarketingStudio', Referer: 'https://www.govmap.gov.il/' },
    signal: AbortSignal.timeout(20000)
  });
  if (!r.ok) throw new Error(`GovMap HTTP ${r.status}`);
  return r.json();
}
async function deals(u, res) {
  const json = (code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(obj)); };
  const address = (u.searchParams.get('address') || '').trim();
  if (!address) return json(400, { error: 'missing address' });
  try {
    const out = await Govmap.findDeals(address, {
      http: govHttp, years: +u.searchParams.get('years') || 2, radius: +u.searchParams.get('radius') || 100,
      dealType: +u.searchParams.get('dealType') || 2
    });
    json(200, out);
  } catch (e) { json(502, { error: String(e.message || e) }); }
}

http.createServer((req, res) => {
  const u = new URL(req.url, 'http://localhost');
  if (u.pathname === '/api/health') { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end('{"ok":true}'); }
  if (u.pathname === '/api/deals') return deals(u, res);
  if (u.pathname === '/api/proxy') return proxy(u.searchParams.get('url') || '', res);
  const file = path.normalize(path.join(ROOT, decodeURIComponent(u.pathname === '/' ? '/index.html' : u.pathname)));
  if (!file.startsWith(ROOT) || path.basename(file) === 'server.js') { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(buf);
  });
}).listen(PORT, () => console.log(`Marketing studio: http://localhost:${PORT}`));
