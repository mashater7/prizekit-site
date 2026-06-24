/* Появление элементов при прокрутке — мягкий каскад (stagger).
   Без зависимостей, мимо CSS-бандла. Уважает prefers-reduced-motion. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Что анимируем: карточки, шаги, пункты «Возможностей», заголовки секций, CTA-панель.
  var selector = '.card, .step-card, .feats li, .sec-h2, .cta .container, .post-list li';
  var nodes = Array.prototype.slice.call(document.querySelectorAll(selector));

  if (reduce || !('IntersectionObserver' in window) || !nodes.length) {
    return; // браузер сам покажет всё как есть
  }

  nodes.forEach(function (el) { el.classList.add('reveal'); });

  var io = new IntersectionObserver(function (entries, obs) {
    // элементы, вошедшие в кадр одной «волной», получают нарастающую задержку
    var batch = entries.filter(function (e) { return e.isIntersecting; });
    batch.forEach(function (entry, i) {
      var el = entry.target;
      el.style.setProperty('--d', Math.min(i * 60, 300) + 'ms');
      el.classList.add('in');
      obs.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  nodes.forEach(function (el) { io.observe(el); });
})();
