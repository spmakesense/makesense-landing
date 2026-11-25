// Interactive worksheet for the web version: inputs, live totals, local save, WhatsApp summary.
(function () {
  var KEY = 'ms-wedding-ws-v1';
  var NUMERIC = ['סכום', 'החזר חודשי', 'יתרה', 'סכום יעד', 'תוך כמה שנים', 'פרמיה בחודש'];
  var store = {};
  try { store = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { store = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} }
  function num(v) { var n = parseFloat(String(v || '').replace(/[^\d.\-]/g, '')); return isNaN(n) ? 0 : n; }
  function fmt(n) { return Math.round(n).toLocaleString('en-US'); }

  var idx = 0;
  var tables = Array.prototype.slice.call(document.querySelectorAll('table.ws'));
  tables.forEach(function (t) {
    var heads = Array.prototype.slice.call(t.querySelectorAll('thead th')).map(function (th) { return th.textContent.trim(); });
    var isGoals = heads.indexOf('חיסכון חודשי') > -1;
    t.querySelectorAll('tbody tr').forEach(function (tr) {
      if (tr.classList.contains('ex')) return;
      var cells = tr.querySelectorAll('td');
      for (var c = 1; c < cells.length; c++) {
        var td = cells[c];
        if (!td.classList.contains('f')) continue;
        if (tr.classList.contains('tot')) { td.dataset.col = c; continue; }
        if (isGoals && heads[c] === 'חיסכון חודשי') { td.className = 'calc-out'; continue; }
        var inp = document.createElement('input');
        var id = 'i' + (idx++);
        inp.dataset.id = id;
        if (NUMERIC.indexOf(heads[c]) > -1) { inp.className = 'num'; inp.inputMode = 'decimal'; }
        inp.setAttribute('aria-label', (cells[0].textContent.trim() + ' ' + heads[c]).trim());
        if (store[id]) inp.value = store[id];
        td.appendChild(inp);
      }
    });
  });

  // blank life-timeline rows
  document.querySelectorAll('.mrow').forEach(function (row, r) {
    row.innerHTML = '';
    [['תחנה (למשל: דירה)', ''], ['שנה', 'yr']].forEach(function (d) {
      var inp = document.createElement('input'); var id = 'l' + r + d[1];
      inp.placeholder = d[0]; inp.dataset.id = id; if (d[1]) { inp.className = 'yr'; inp.inputMode = 'numeric'; }
      if (store[id]) inp.value = store[id];
      row.appendChild(inp);
    });
  });

  function colSum(t, c) {
    var s = 0;
    t.querySelectorAll('tbody tr:not(.tot):not(.ex)').forEach(function (tr) {
      var td = tr.querySelectorAll('td')[c]; var i = td && td.querySelector('input');
      if (i && i.classList.contains('num')) s += num(i.value);
    });
    return s;
  }
  function tableTotal(t) {
    var tot = t.querySelector('tr.tot'); if (!tot) return 0;
    var last = 0;
    tot.querySelectorAll('td.f').forEach(function (td) {
      var c = +td.dataset.col; var heads = t.querySelectorAll('thead th');
      if (heads[c] && NUMERIC.indexOf(heads[c].textContent.trim()) > -1) { var v = colSum(t, c); td.textContent = v ? fmt(v) : ''; last = v; }
    });
    return last;
  }
  var bals = document.querySelectorAll('.bal .blank');
  var waLinks = document.querySelectorAll('.wfoot a.btn');

  function recalc() {
    var res = tables.map(tableTotal);
    // budget: tables[0]=income, [1]=expenses ; assets: [2], liabilities: [3] (balance column)
    var income = res[0], expense = res[1], assets = res[2], liab = res[3];
    if (bals[0]) bals[0].textContent = (income || expense) ? fmt(income - expense) : '';
    if (bals[1]) bals[1].textContent = (assets || liab) ? fmt(assets - liab) : '';
    var goals = [];
    tables.forEach(function (t) {
      var heads = Array.prototype.slice.call(t.querySelectorAll('thead th')).map(function (th) { return th.textContent.trim(); });
      var gi = heads.indexOf('חיסכון חודשי'); if (gi < 0) return;
      t.querySelectorAll('tbody tr:not(.ex)').forEach(function (tr) {
        var cells = tr.querySelectorAll('td');
        var amt = num(cells[1].querySelector('input') && cells[1].querySelector('input').value);
        var yrs = num(cells[2].querySelector('input') && cells[2].querySelector('input').value);
        var m = amt && yrs ? amt / (yrs * 12) : 0;
        cells[gi].textContent = m ? fmt(m) : '';
        if (m) goals.push(cells[0].textContent.trim() + ': ' + fmt(m) + ' ₪ בחודש');
      });
    });
    var lines = ['סדר אחרי החתונה'];
    if (income || expense) lines.push('הכנסות: ' + fmt(income) + ' ₪ | הוצאות: ' + fmt(expense) + ' ₪');
    if (assets || liab) lines.push('שווי נקי: ' + fmt(assets - liab) + ' ₪');
    if (goals.length) lines.push('מטרות: ' + goals.join(', '));
    var href = 'https://wa.me/972524415395?text=' + encodeURIComponent(lines.join('\n'));
    waLinks.forEach(function (a) { a.href = href; });
  }

  document.addEventListener('input', function (e) {
    var i = e.target; if (!i.dataset || !i.dataset.id) return;
    store[i.dataset.id] = i.value; save(); recalc();
  });
  var foot = document.querySelector('.wfoot');
  if (foot) { var p = document.createElement('div'); p.className = 'saved'; p.textContent = 'מה שתמלאו נשמר רק בטלפון שלכם. הכפתור שולח סיכום בוואטסאפ.'; foot.parentNode.insertBefore(p, foot.nextSibling); }
  recalc();
})();
