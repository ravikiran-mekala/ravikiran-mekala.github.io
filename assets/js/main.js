// ============================================
// Animated Stat Counters
// ============================================
(function () {
  var counters = document.querySelectorAll('.stat-value[data-target]');
  if (!counters.length) return;

  function animateCounter(el) {
    var target = parseInt(el.dataset.target, 10);
    var suffix = el.dataset.suffix || '';
    var duration = 1200;
    var start = performance.now();

    function update(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (c) { obs.observe(c); });
})();

// ============================================
// Active Nav Highlighting
// ============================================
(function () {
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.header-nav a');
  if (!sections.length || !navLinks.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -60% 0px' });

  sections.forEach(function (s) { observer.observe(s); });
})();

// ============================================
// Smooth Scroll for Nav Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    var target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ============================================
// Header Name Hover Easter Egg
// ============================================
(function () {
  var name = document.querySelector('.header-name');
  if (!name) return;
  var original = name.textContent;
  var alternate = 'HEY THERE!';

  name.addEventListener('mouseenter', function () {
    name.textContent = alternate;
  });
  name.addEventListener('mouseleave', function () {
    name.textContent = original;
  });
})();
