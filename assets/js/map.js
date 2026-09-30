/* Map behaviour. Both parts are progressive: without JavaScript the ring is
   drawn and the open marker sits at its resting place. */
(function () {
  var map = document.querySelector('[data-map]');
  if (!map) return;
  var svg = map.querySelector('.map__svg');
  var vb = svg.viewBox.baseVal;
  var W = vb.width, H = vb.height;
  var stage = map.querySelector('.map__stage');
  var ring = map.querySelector('.map__ring');
  var ghost = map.querySelector('.city--ghost');
  var links = map.querySelectorAll('.map__link');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. The ring draws itself once when the map comes into view, in the order
        of _data/communities.yml, then the open seat appears. */
  if (!reduce && 'IntersectionObserver' in window && ring.getTotalLength) {
    map.style.setProperty('--ring-len', Math.ceil(ring.getTotalLength()) + 1);
    map.classList.add('map--armed');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { map.classList.add('map--drawn'); io.disconnect(); }
      });
    }, { threshold: 0.35 });
    io.observe(map);
  }

  /* 2. On a mouse the open seat follows the pointer: "your city?" goes wherever
        you point. Touch and keyboard keep it at its resting place. */
  if (!ghost || reduce || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  function pct(el, name, span) { return parseFloat(el.style.getPropertyValue(name)) / 100 * span; }
  var cities = Array.prototype.map.call(map.querySelectorAll('.city:not(.city--ghost)'), function (el) {
    return { x: pct(el, '--x', W), y: pct(el, '--y', H) };
  });
  var home = { x: pct(ghost, '--x', W), y: pct(ghost, '--y', H) };
  var pos = { x: home.x, y: home.y }, target = { x: home.x, y: home.y }, raf = null;
  var CLEAR = Math.pow(W * 0.08, 2); /* stay clear of a real city so its link remains clickable */

  function d2(a, b) { var dx = a.x - b.x, dy = a.y - b.y; return dx * dx + dy * dy; }
  function render() {
    ghost.style.setProperty('--x', (pos.x / W * 100).toFixed(2));
    ghost.style.setProperty('--y', (pos.y / H * 100).toFixed(2));
    var near = cities.slice().sort(function (a, b) { return d2(a, pos) - d2(b, pos); });
    for (var i = 0; i < links.length && i < near.length; i++) {
      links[i].setAttribute('x1', pos.x.toFixed(1)); links[i].setAttribute('y1', pos.y.toFixed(1));
      links[i].setAttribute('x2', near[i].x.toFixed(1)); links[i].setAttribute('y2', near[i].y.toFixed(1));
    }
  }
  function step() {
    pos.x += (target.x - pos.x) * 0.16; pos.y += (target.y - pos.y) * 0.16;
    render();
    if (d2(pos, target) > 0.2) { raf = requestAnimationFrame(step); } else { pos.x = target.x; pos.y = target.y; render(); raf = null; }
  }
  function go() { if (!raf) raf = requestAnimationFrame(step); }

  stage.addEventListener('pointermove', function (e) {
    var r = stage.getBoundingClientRect();
    var p = { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H };
    p.x = Math.max(W * 0.036, Math.min(W * 0.964, p.x)); p.y = Math.max(H * 0.04, Math.min(H * 0.96, p.y));
    for (var i = 0; i < cities.length; i++) { if (d2(cities[i], p) < CLEAR) return; }
    target = p; go();
  });
  stage.addEventListener('pointerleave', function () { target = { x: home.x, y: home.y }; go(); });
  map.classList.add('map--live');
})();
