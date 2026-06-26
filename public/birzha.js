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
})();
