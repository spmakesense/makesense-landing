(function () {
  var KEY = 'ms-wedding-v2';
  var store = {};
  try { store = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { store = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} }

  /* ---------- checklist: checkboxes + accordion ---------- */
  var tasks = Array.prototype.slice.call(document.querySelectorAll('.task'));
  var progTxt = document.getElementById('progTxt'), progBar = document.getElementById('progBar');
  function progress() {
    var n = tasks.filter(function (t) { return t.querySelector('input').checked; }).length;
    progTxt.textContent = n + ' מתוך ' + tasks.length;
    progBar.style.width = (n / tasks.length * 100) + '%';
  }
  tasks.forEach(function (t) {
    var i = t.dataset.i, cb = t.querySelector('input'), btn = t.querySelector('button.tt');
    cb.checked = !!(store.c && store.c[i]);
    t.classList.toggle('done', cb.checked);
    cb.addEventListener('change', function () {
      store.c = store.c || {}; store.c[i] = cb.checked; save();
      t.classList.toggle('done', cb.checked); progress();
    });
    btn.addEventListener('click', function () {
      var open = !t.classList.contains('open');
      t.classList.toggle('open', open); btn.setAttribute('aria-expanded', open);
    });
  });
  progress();

  /* ---------- sheets (CTAs + deals open as a new section) ---------- */
  var sheet = document.getElementById('sheet'), inner = document.getElementById('sheetInner'), panel = sheet.querySelector('.panel');
  var lastFocus = null, isOpen = false;
  function openSheet(name, push) {
    var tpl = document.getElementById('tpl-' + name); if (!tpl) return;
    inner.innerHTML = ''; inner.appendChild(tpl.content.cloneNode(true));
    lastFocus = document.activeElement;
    sheet.classList.add('on'); document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { sheet.classList.add('show'); panel.scrollTop = 0; var x = inner.querySelector('.x'); if (x) x.focus(); });
    if (push !== false) { try { history.pushState({ sheet: name }, '', '#' + name); } catch (e) {} }
    isOpen = true;
  }
  function closeSheet(fromPop) {
    if (!isOpen) return; isOpen = false;
    sheet.classList.remove('show'); document.body.style.overflow = '';
    setTimeout(function () { sheet.classList.remove('on'); inner.innerHTML = ''; }, 280);
    if (lastFocus) lastFocus.focus();
    if (!fromPop && history.state && history.state.sheet) { try { history.back(); } catch (e) {} }
  }
  document.addEventListener('click', function (e) {
    var o = e.target.closest('[data-open]');
    if (o) { e.preventDefault(); var name = o.getAttribute('data-open'); if (isOpen) { inner.innerHTML = ''; openSheet(name, false); try { history.replaceState({ sheet: name }, '', '#' + name); } catch (er) {} } else openSheet(name); return; }
    if (e.target.closest('[data-close]')) { e.preventDefault(); closeSheet(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });
  window.addEventListener('popstate', function () { if (isOpen) closeSheet(true); });
  if (/^#(contact|deal\d)$/.test(location.hash)) openSheet(location.hash.slice(1), false);

  /* ---------- worksheet ---------- */
  var NUMERIC = ['סכום', 'החזר חודשי', 'יתרה', 'סכום יעד', 'תוך כמה שנים', 'פרמיה בחודש'];
  store.w = store.w || {};
  function num(v) { var n = parseFloat(String(v || '').replace(/[^\d.\-]/g, '')); return isNaN(n) ? 0 : n; }
  function fmt(n) { return Math.round(n).toLocaleString('en-US'); }
  var tables = Array.prototype.slice.call(document.querySelectorAll('table.ws')), idx = 0;
  function heads(t) { return Array.prototype.slice.call(t.querySelectorAll('thead th')).map(function (th) { return th.textContent.trim(); }); }
  tables.forEach(function (t) {
    var h = heads(t), goals = h.indexOf('חיסכון חודשי') > -1;
    t.querySelectorAll('tbody tr').forEach(function (tr) {
      if (tr.classList.contains('ex')) return;
      var cells = tr.querySelectorAll('td');
      for (var c = 1; c < cells.length; c++) {
        var td = cells[c];
        if (tr.classList.contains('tot')) { td.dataset.col = c; continue; }
        if (goals && h[c] === 'חיסכון חודשי') { td.className = 'calc-out'; continue; }
        var inp = document.createElement('input'), id = 'i' + (idx++);
        inp.dataset.id = id;
        if (NUMERIC.indexOf(h[c]) > -1) { inp.className = 'num'; inp.inputMode = 'decimal'; }
        inp.setAttribute('aria-label', (cells[0].childNodes[0].textContent + ' ' + h[c]).trim());
        if (store.w[id]) inp.value = store.w[id];
        td.appendChild(inp);
      }
    });
  });
  document.querySelectorAll('.lt.mine .lr').forEach(function (row) {
    var r = row.getAttribute('data-r');
    [['.ly', 'שנה', 'yr'], ['.lc', 'תחנה (למשל: דירה)', '']].forEach(function (d) {
      var inp = document.createElement('input'), id = 'l' + r + d[2];
      inp.placeholder = d[1]; inp.dataset.id = id; inp.setAttribute('aria-label', d[1] + ' ' + (+r + 1));
      if (d[2]) inp.inputMode = 'numeric';
      if (store.w[id]) inp.value = store.w[id];
      row.querySelector(d[0]).appendChild(inp);
    });
  });
  function total(t) {
    var tot = t.querySelector('tr.tot'); if (!tot) return 0; var h = heads(t), last = 0;
    tot.querySelectorAll('td.f').forEach(function (td) {
      var c = +td.dataset.col; if (NUMERIC.indexOf(h[c]) < 0) return;
      var s = 0;
      t.querySelectorAll('tbody tr:not(.tot)').forEach(function (tr) { var i = tr.querySelectorAll('td')[c].querySelector('input'); if (i) s += num(i.value); });
      td.textContent = s ? fmt(s) + ' ₪' : ''; last = s;
    });
    return last;
  }
  var bals = document.querySelectorAll('.bal .blank'), send = document.querySelector('.wsend');
  function recalc() {
    var r = tables.map(total), inc = r[0], exp = r[1], as = r[2], li = r[3];
    bals[0].textContent = (inc || exp) ? fmt(inc - exp) + ' ₪' : '';
    bals[1].textContent = (as || li) ? fmt(as - li) + ' ₪' : '';
    var goals = [];
    tables.forEach(function (t) {
      var h = heads(t), gi = h.indexOf('חיסכון חודשי'); if (gi < 0) return;
      t.querySelectorAll('tbody tr:not(.ex)').forEach(function (tr) {
        var c = tr.querySelectorAll('td'), a = num(c[1].querySelector('input').value), y = num(c[2].querySelector('input').value);
        var m = a && y ? a / (y * 12) : 0; c[gi].textContent = m ? fmt(m) + ' ₪' : '';
        if (m) goals.push(c[0].textContent.trim() + ': ' + fmt(m) + ' ₪ בחודש');
      });
    });
    var done = tasks.filter(function (t) { return t.querySelector('input').checked; }).length;
    var lines = ['סדר אחרי החתונה', 'סימנו ' + done + ' מתוך 8 צעדים'];
    if (inc || exp) lines.push('הכנסות: ' + fmt(inc) + ' ₪ | הוצאות: ' + fmt(exp) + ' ₪');
    if (as || li) lines.push('שווי נקי: ' + fmt(as - li) + ' ₪');
    if (goals.length) lines.push('מטרות: ' + goals.join(', '));
    send.href = 'https://wa.me/972524415395?text=' + encodeURIComponent(lines.join('\n'));
  }
  document.addEventListener('input', function (e) { var i = e.target; if (!i.dataset || !i.dataset.id) return; store.w[i.dataset.id] = i.value; save(); recalc(); });
  document.addEventListener('change', function (e) { if (e.target.closest('.task')) recalc(); });
  recalc();

  /* ---------- scroll reveal (float up) ---------- */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    var hero = Array.prototype.slice.call(document.querySelectorAll('.hero > *'));
    hero.forEach(function (el, n) { el.classList.add('rv'); el.style.transitionDelay = (n * 90) + 'ms'; });
    requestAnimationFrame(function () { requestAnimationFrame(function () { hero.forEach(function (el) { el.classList.add('in'); }); }); });
    var sel = 'section.s > .tag, section.s > h2.h, section.s > .sub, .tl .st, .task, .mc, .emerg > *, .sx, table.race, .note, .chart, .hchart, .deal, .lottery, .cta-strip, .wcard, section.s > .card, .sig, .foot img, .foot p, .lr';
    var els = Array.prototype.slice.call(document.querySelectorAll(sel));
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) {
      var sib = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.classList.add('rv'); el.style.transitionDelay = Math.min(sib % 4, 3) * 70 + 'ms';
      io.observe(el);
    });
  }
})();
