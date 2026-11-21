// Inlines src/ images into a single self-contained index.html (upload anywhere).
const fs = require('fs'), path = require('path');
let html = fs.readFileSync('src/page.html', 'utf8');
html = html.replace(/src="([\w.-]+\.(png|jpg))"/g, (m, f, ext) =>
  `src="data:image/${ext === 'jpg' ? 'jpeg' : 'png'};base64,${fs.readFileSync(path.join('src', f)).toString('base64')}"`);
fs.writeFileSync('index.html', html);
console.log('index.html', (html.length / 1024).toFixed(0) + 'KB');
