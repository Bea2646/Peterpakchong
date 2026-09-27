// ============================================================
//  gallery.js — Lightbox & photo grid for house/nearby pages
//  บ้านปีเตอร์@ปากช่อง
//  Usage: ต้องกำหนด window.PAGE_IMAGES = [...] ก่อน load ไฟล์นี้
// ============================================================

(function () {
  var images = window.PAGE_IMAGES || [];
  var altPrefix = window.PAGE_ALT_PREFIX || 'รูปภาพ';
  var lbIdx = 0;

  // Build photo grid
  var grid = document.getElementById('photo-grid');
  if (grid && images.length) {
    images.forEach(function (src, i) {
      var img = document.createElement('img');
      img.src = src;
      img.alt = altPrefix + ' รูป ' + (i + 1);
      img.loading = 'lazy';
      if (window.PAGE_FALLBACK_IMG) {
        img.onerror = function () { this.src = window.PAGE_FALLBACK_IMG; };
      }
      img.onclick = function () { openLb(i); };
      grid.appendChild(img);
    });
  }

  function openLb(idx) {
    lbIdx = idx;
    var lb = document.getElementById('lightbox');
    var imgElem = document.getElementById('lb-img');
    if (!lb || !imgElem) return;
    lb.classList.add('open');
    imgElem.src = images[lbIdx];
    if (window.PAGE_FALLBACK_IMG) {
      imgElem.onerror = function () { this.src = window.PAGE_FALLBACK_IMG; };
    }
    var cur = document.getElementById('lb-cur');
    var total = document.getElementById('lb-total');
    if (cur) cur.textContent = lbIdx + 1;
    if (total) total.textContent = images.length;
    document.body.style.overflow = 'hidden';
  }

  window.closeLb = function () {
    var lb = document.getElementById('lightbox');
    if (lb) lb.classList.remove('open');
    document.body.style.overflow = '';
  };

  window.lbNav = function (dir) {
    lbIdx = (lbIdx + dir + images.length) % images.length;
    var imgElem = document.getElementById('lb-img');
    if (!imgElem) return;
    imgElem.src = images[lbIdx];
    if (window.PAGE_FALLBACK_IMG) {
      imgElem.onerror = function () { this.src = window.PAGE_FALLBACK_IMG; };
    }
    var cur = document.getElementById('lb-cur');
    if (cur) cur.textContent = lbIdx + 1;
  };

  document.addEventListener('keydown', function (e) {
    var lb = document.getElementById('lightbox');
    if (!lb || !lb.classList.contains('open')) return;
    if (e.key === 'ArrowRight') window.lbNav(1);
    if (e.key === 'ArrowLeft') window.lbNav(-1);
    if (e.key === 'Escape') window.closeLb();
  });
})();
