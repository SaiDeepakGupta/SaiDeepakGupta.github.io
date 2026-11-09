(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  if (reduce) { root.classList.remove('js'); return; }

  /* 1. Hero: type the command, then reveal the rest */
  var cmd = document.querySelector('.prompt .cmd');
  var text = cmd ? cmd.textContent : '';
  if (cmd) cmd.textContent = '';
  var i = 0;
  function type() {
    if (cmd && i < text.length) {
      cmd.textContent += text[i++];
      setTimeout(type, 90);
    } else {
      root.classList.add('hero-ready');
    }
  }
  setTimeout(type, 350);

  /* 2. Scroll reveals with a small stagger */
  var targets = document.querySelectorAll(
    'main h2, main article, .stats li, .skills dt, .skills dd, #about > p, #contact > p, #contact ul, #education ul'
  );
  targets.forEach(function (el) {
    el.classList.add('reveal');
    var sibs = Array.prototype.filter.call(el.parentNode.children, function (c) {
      return c.tagName === el.tagName;
    });
    el.style.setProperty('--d', Math.min(sibs.indexOf(el), 4) * 90 + 'ms');
  });

  /* 3. Count-up stats */
  function countUp(strong) {
    var m = strong.textContent.match(/^([^\d]*)(\d+)(.*)$/);
    if (!m) return;
    var end = +m[2], start = performance.now(), dur = 1100;
    function step(t) {
      var k = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - k, 3);
      strong.textContent = m[1] + Math.round(end * eased) + m[3];
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      if (e.target.matches('.stats li')) countUp(e.target.querySelector('strong'));
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
  targets.forEach(function (el) { io.observe(el); });

  /* 4. Highlight the nav link for the section on screen */
  var links = {};
  document.querySelectorAll('nav ul a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var a = links[e.target.id];
      if (a) a.classList.toggle('active', e.isIntersecting);
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });
})();
