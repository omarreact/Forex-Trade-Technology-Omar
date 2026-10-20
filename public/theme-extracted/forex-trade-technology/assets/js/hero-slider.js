/* Accessible standalone homepage slider. Runs without frameworks or remote assets. */
(function () {
  'use strict';
  function init(root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll(':scope > .ftt-slide'));
    if (slides.length < 2) return;
    var index = 0, tick, reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var controls = document.createElement('div'); controls.className = 'ftt-slider-controls';
    var dots = document.createElement('div'); dots.className = 'ftt-slider-dots';
    var arrows = document.createElement('div'); arrows.className = 'ftt-slider-arrows';
    slides.forEach(function (s, i) {
      s.id = 'ftt-hero-slide-' + (i + 1);
      var d = document.createElement('button'); d.type = 'button';
      d.setAttribute('aria-label', 'Show slide ' + (i + 1));
      d.addEventListener('click', function () { show(i); restart(); }); dots.appendChild(d);
    });
    [['\u2190', -1, 'Previous slide'], ['\u2192', 1, 'Next slide']].forEach(function (spec) {
      var b = document.createElement('button'); b.type = 'button';
      b.textContent = spec[0]; b.setAttribute('aria-label', spec[2]);
      b.addEventListener('click', function () { show(index + spec[1]); restart(); }); arrows.appendChild(b);
    });
    controls.appendChild(dots); controls.appendChild(arrows); root.appendChild(controls);
    root.setAttribute('aria-roledescription', 'carousel');
    function show(n) {
      index = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) {
        var active = i === index;
        s.classList.toggle('is-active', active); s.setAttribute('aria-hidden', String(!active));
        if ('inert' in s) s.inert = !active;
        dots.children[i].setAttribute('aria-current', active ? 'true' : 'false');
      });
    }
    function stop() { window.clearInterval(tick); tick = null; }
    function play() { if (!reduced && !tick && !document.hidden) tick = window.setInterval(function () { show(index + 1); }, 6500); }
    function restart() { stop(); play(); }
    root.addEventListener('mouseenter', stop); root.addEventListener('mouseleave', play);
    root.addEventListener('focusin', stop); root.addEventListener('focusout', function (e) { if (!root.contains(e.relatedTarget)) play(); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else play(); });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); show(index + (e.key === 'ArrowRight' ? 1 : -1)); restart(); }
    });
    root.classList.add('ftt-slider-ready'); show(0); play();
  }
  function ready() { document.querySelectorAll('.ftt-front-hero .ftt-slider').forEach(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
}());
