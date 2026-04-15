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
// Footer: Greeting + Day + Local Time + Weather
// ============================================
(function () {
  var greetingEl = document.getElementById('footer-greeting');
  var weatherEl = document.getElementById('footer-weather');
  if (!greetingEl || !weatherEl) return;

  // --- Time-aware greeting ---
  function getGreeting(hour) {
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 22) return 'Good evening';
    return 'Burning the midnight oil?';
  }

  // --- Day-of-week message ---
  var dayMessages = {
    0: 'Sunday vibes',
    1: 'Hope your Monday is treating you kindly',
    2: 'Halfway to halfway',
    3: 'Mid-week energy',
    4: 'Almost there',
    5: 'Happy Friday!',
    6: "Hope you're enjoying the weekend"
  };

  // --- Weather contextual wording (Charmie style) ---
  function weatherMood(tempF) {
    if (tempF < 32) return 'Bundle up out there';
    if (tempF < 50) return 'A light jacket kind of day';
    if (tempF < 65) return 'Hoodie weather';
    if (tempF < 75) return 'Golden temperature kind of day';
    if (tempF < 85) return 'Warm and easy';
    if (tempF < 95) return 'A hot one';
    return 'Stay hydrated out there';
  }

  // --- Format time in a specific timezone (e.g. "8:47 PM") ---
  function formatTimeInTz(timezone) {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(new Date());
    } catch (e) {
      return null;
    }
  }

  // --- Get hour (0-23) and day-of-week (0-6) in a specific timezone ---
  function getTzParts(timezone) {
    try {
      var parts = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        weekday: 'short',
        hour12: false
      }).formatToParts(new Date());
      var hourStr, weekday;
      parts.forEach(function (p) {
        if (p.type === 'hour') hourStr = p.value;
        if (p.type === 'weekday') weekday = p.value;
      });
      var dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var hour = parseInt(hourStr, 10);
      // Intl can return "24" for midnight in some locales — normalize to 0
      if (hour === 24) hour = 0;
      return { hour: hour, day: dayMap[weekday] };
    } catch (e) {
      return null;
    }
  }

  // --- Render greeting using a timezone (or browser default if none) ---
  function renderGreeting(timezone) {
    var parts = timezone ? getTzParts(timezone) : null;
    if (!parts) {
      var now = new Date();
      parts = { hour: now.getHours(), day: now.getDay() };
    }
    greetingEl.textContent = getGreeting(parts.hour) + ' — ' + dayMessages[parts.day] + '.';
  }

  // --- Initial render with browser timezone (instant, no wait for API) ---
  renderGreeting(null);

  // --- Fetch geo + weather, then re-render with geo timezone ---
  fetch('https://get.geojs.io/v1/ip/geo.json')
    .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
    .then(function (geo) {
      var city = geo.city || geo.region || '';
      var lat = geo.latitude;
      var lon = geo.longitude;
      var tz = geo.timezone;
      if (!lat || !lon) throw new Error('no coords');

      // Re-render greeting using the geo-determined timezone
      if (tz) renderGreeting(tz);

      return fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=' + lat +
        '&longitude=' + lon + '&current_weather=true&temperature_unit=fahrenheit'
      )
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .then(function (wx) {
          var tempF = wx.current_weather && wx.current_weather.temperature;
          if (tempF === undefined) throw new Error('no temp');
          var timeStr = (tz && formatTimeInTz(tz)) || formatTimeInTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
          var locStr = city ? ' in ' + city : ' where you are';
          var msg = "It's " + timeStr + locStr + ' — ' +
                    Math.round(tempF) + '°F · ' + weatherMood(tempF) + '.';
          weatherEl.textContent = msg;
        });
    })
    .catch(function () {
      // Graceful fallback: just show browser-local time
      var fallbackTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      weatherEl.textContent = "It's " + formatTimeInTz(fallbackTz) + ' where you are.';
    });
})();

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
