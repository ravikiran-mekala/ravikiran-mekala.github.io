// ============================================
// Particle Network Background
// ============================================
(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height, particles, mouse, animId;
  const PARTICLE_COUNT = 80;
  const MAX_DIST = 120;
  const MOUSE_RADIUS = 150;
  let paused = false;

  function resize() {
    const hero = canvas.parentElement;
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
      });
    }
  }

  mouse = { x: -9999, y: -9999 };

  canvas.parentElement.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.parentElement.addEventListener('mouseleave', function () {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  function animate() {
    if (paused) { animId = requestAnimationFrame(animate); return; }
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Mouse repulsion
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS && dist > 0) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.045;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      // Dampen velocity
      p.vx *= 0.99;
      p.vy *= 0.99;

      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const ddx = p.x - p2.x;
        const ddy = p.y - p2.y;
        const d = Math.sqrt(ddx * ddx + ddy * ddy);
        if (d < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = 'rgba(255, 255, 255,' + (0.15 * (1 - d / MAX_DIST)) + ')';
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(animate);
  }

  // Visibility API — pause when tab hidden
  document.addEventListener('visibilitychange', function () {
    paused = document.hidden;
  });

  window.addEventListener('resize', function () {
    resize();
  });

  // Reduced motion check
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    resize();
    createParticles();
    animate();
  }
})();

// ============================================
// Typing Animation
// ============================================
(function () {
  const el = document.querySelector('.typing-text');
  if (!el) return;
  const phrases = ['Senior Software Engineer', 'Backend Architect', 'AI/ML Enthusiast'];
  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  const TYPE_SPEED = 80;
  const DELETE_SPEED = 40;
  const PAUSE = 2000;

  function tick() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      charIdx++;
      el.textContent = current.substring(0, charIdx);
      if (charIdx === current.length) {
        setTimeout(function () { deleting = true; tick(); }, PAUSE);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      charIdx--;
      el.textContent = current.substring(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, TYPE_SPEED);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  // Reduced motion: just show static text
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = phrases[0];
  } else {
    tick();
  }
})();

// ============================================
// Animated Stat Counters
// ============================================
(function () {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const obs = new IntersectionObserver(function (entries) {
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
// Scroll Animations (fade-in-up, fade-in-left, fade-in-right, scale-in)
// ============================================
(function () {
  var animEls = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in, .fade-in');
  if (!animEls.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animEls.forEach(function (el) { observer.observe(el); });
})();

// ============================================
// Stagger Children (skill pills)
// ============================================
(function () {
  var groups = document.querySelectorAll('.stagger-children');
  if (!groups.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var pills = entry.target.querySelectorAll('.skill-pill');
        pills.forEach(function (pill, i) {
          pill.style.transitionDelay = (i * 40) + 'ms';
        });
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  groups.forEach(function (g) { observer.observe(g); });
})();

// ============================================
// Active Nav Highlighting
// ============================================
(function () {
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a');
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
// Timeline Progress Fill + Dot Glow
// ============================================
(function () {
  var timeline = document.querySelector('.timeline');
  var progress = document.querySelector('.timeline-progress');
  var dots = document.querySelectorAll('.timeline-dot');
  if (!timeline || !progress) return;

  // Dot glow observer
  if (dots.length) {
    var dotObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('glow', entry.isIntersecting);
      });
    }, { threshold: 0.5 });

    dots.forEach(function (d) { dotObs.observe(d); });
  }

  // Progress bar scroll tracking
  function updateProgress() {
    var rect = timeline.getBoundingClientRect();
    var timelineTop = rect.top + window.scrollY;
    var timelineHeight = rect.height;
    var scrolled = window.scrollY + window.innerHeight * 0.5 - timelineTop;
    var pct = Math.max(0, Math.min(1, scrolled / timelineHeight));
    progress.style.height = (pct * 100) + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
})();

// ============================================
// Hero Parallax
// ============================================
(function () {
  var heroContent = document.querySelector('.hero-content');
  var hero = document.querySelector('.hero');
  if (!heroContent || !hero) return;

  // Disable on mobile
  if (window.innerWidth < 768) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', function () {
    var scrollY = window.scrollY;
    var heroH = hero.offsetHeight;
    if (scrollY > heroH) return;
    var pct = scrollY / heroH;
    heroContent.style.transform = 'translateY(' + (pct * 40) + 'px)';
    heroContent.style.opacity = 1 - pct * 0.5;
  }, { passive: true });
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
      // Close mobile menu if open
      document.querySelector('.nav-links').classList.remove('active');
      document.querySelector('.hamburger').classList.remove('active');
    }
  });
});

// ============================================
// Sticky Nav Background on Scroll
// ============================================
(function () {
  var nav = document.querySelector('.navbar');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
})();

// ============================================
// Mobile Hamburger Toggle
// ============================================
(function () {
  var hamburger = document.querySelector('.hamburger');
  var navLinks = document.querySelector('.nav-links');
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
})();

// ============================================
// Button Ripple Effect
// ============================================
(function () {
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      var size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', function () { ripple.remove(); });
    });
  });
})();
