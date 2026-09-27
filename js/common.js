// ============================================================
//  common.js — Shared scripts for all pages
//  บ้านปีเตอร์@ปากช่อง
// ============================================================

// Back to Top button visibility
(function () {
  var backBtn = document.getElementById('backToTop');
  if (!backBtn) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      backBtn.classList.add('show');
    } else {
      backBtn.classList.remove('show');
    }
  });
})();

// Scroll Reveal using IntersectionObserver (used on index.html)
(function () {
  var revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(function (el) { revealObserver.observe(el); });
})();

// Animated counter for hero stats (used on index.html)
(function () {
  var heroStats = document.querySelector('.hero-stats');
  if (!heroStats) return;
  function animateCounters() {
    document.querySelectorAll('.stat-num').forEach(function (el) {
      var text = el.textContent;
      var match = text.match(/(\d+)/);
      if (!match) return;
      var target = parseInt(match[1]);
      var suffix = text.replace(match[1], '').trim();
      var prefix = text.substring(0, text.indexOf(match[1]));
      var current = 0;
      var step = Math.ceil(target / 30);
      var timer = setInterval(function () {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = prefix + current + (suffix ? ' ' + suffix : '');
      }, 40);
    });
  }
  var statsObserver = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) { animateCounters(); statsObserver.disconnect(); }
  }, { threshold: 0.5 });
  statsObserver.observe(heroStats);
})();

// Dropdown toggle (navbar video dropdown on index.html)
window.toggleDropdown = function (e) {
  e.stopPropagation();
  var dd = document.getElementById('videoDropdown');
  if (dd) dd.classList.toggle('show');
};

window.addEventListener('click', function (event) {
  if (!event.target.matches('.dropdown-btn')) {
    var dropdowns = document.getElementsByClassName('dropdown-content');
    for (var i = 0; i < dropdowns.length; i++) {
      if (dropdowns[i].classList.contains('show')) {
        dropdowns[i].classList.remove('show');
      }
    }
  }
});

// Hamburger menu toggle (replaces onclick on button)
(function () {
  var hamburger = document.getElementById('hamburger-btn');
  if (!hamburger) return;
  hamburger.addEventListener('click', function () {
    var navLinks = document.querySelector('.nav-links');
    if (navLinks) navLinks.classList.toggle('show-mobile');
  });
})();

// Scroll-to handler for data-scroll-to attribute
(function () {
  document.querySelectorAll('[data-scroll-to]').forEach(function (el) {
    el.addEventListener('click', function () {
      var targetId = el.getAttribute('data-scroll-to');
      var target = document.getElementById(targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();

// Line CTA buttons (replaces onclick window.open on data-line-cta)
(function () {
  document.querySelectorAll('[data-line-cta="true"]').forEach(function (el) {
    el.addEventListener('click', function () {
      window.open('https://page.line.me/mtk7269d?openQrModal=true', '_blank', 'noopener,noreferrer');
    });
  });
})();
