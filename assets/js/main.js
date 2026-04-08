// ============================================
// Light / Dark Mode Toggle
// ============================================
(function () {
  var buttons = document.querySelectorAll('.mode-btn');
  if (!buttons.length) return;

  // Restore saved preference
  var saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    buttons.forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.mode === saved);
    });
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var mode = btn.dataset.mode;
      document.documentElement.setAttribute('data-theme', mode);
      localStorage.setItem('theme', mode);
      buttons.forEach(function (b) {
        b.classList.toggle('active', b.dataset.mode === mode);
      });
    });
  });
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
