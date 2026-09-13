/* Кит_Биржа — сортировка таблицы по клику на заголовок столбца.
   Таблица уже отрендерена в HTML (ради SEO); скрипт лишь переставляет строки. */
(function () {
  var table = document.getElementById('birzha');
  if (!table) return;
  var tbody = table.querySelector('tbody');
  var headers = table.querySelectorAll('th.sortable');

  function valueOf(row, key, type) {
    var cell = row.querySelector('[data-' + key + ']');
    var raw = cell ? cell.getAttribute('data-' + key) : '';
    if (type === 'num') return parseFloat(raw) || 0;
    return (raw || '').toLowerCase();
  }

  function sortBy(key, type, dir) {
    var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr'));
    rows.sort(function (a, b) {
      var va = valueOf(a, key, type);
      var vb = valueOf(b, key, type);
      if (va < vb) return dir === 'asc' ? -1 : 1;
      if (va > vb) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    rows.forEach(function (r) { tbody.appendChild(r); });
  }

  headers.forEach(function (th) {
    th.addEventListener('click', function () {
      var key = th.getAttribute('data-key');
      var type = th.getAttribute('data-type');
      // Текущее направление этого столбца → переключаем; иначе с дефолта.
      var dir = th.classList.contains('sorted-asc') ? 'desc' : 'asc';

      headers.forEach(function (h) {
        h.classList.remove('sorted-asc', 'sorted-desc');
        var arr = h.querySelector('.arr');
        if (arr) arr.textContent = '';
      });

      th.classList.add(dir === 'asc' ? 'sorted-asc' : 'sorted-desc');
      var arr = th.querySelector('.arr');
      if (arr) arr.textContent = dir === 'asc' ? '▴' : '▾';

      sortBy(key, type, dir);
    });
  });

  // ── Поиск по названию канала ───────────────────────────────────────────────
  var search = document.getElementById('birzha-search');
  var countEl = document.getElementById('birzha-count');
  var emptyEl = document.getElementById('birzha-empty');
  var totalText = countEl ? countEl.textContent : '';

  function fmt(n) {
    try { return n.toLocaleString('ru-RU'); } catch (e) { return String(n); }
  }

  if (search) {
    search.addEventListener('input', function () {
      var q = search.value.trim().toLowerCase();
      var rows = tbody.querySelectorAll('tr');
      var shown = 0;
      rows.forEach(function (row) {
        var cell = row.querySelector('[data-title]');
        var title = cell ? (cell.getAttribute('data-title') || '').toLowerCase() : '';
        var match = q === '' || title.indexOf(q) !== -1;
        row.style.display = match ? '' : 'none';
        if (match) shown++;
      });
      if (countEl) countEl.textContent = q === '' ? totalText : fmt(shown);
      if (emptyEl) emptyEl.hidden = shown !== 0;
    });
  }
})();
