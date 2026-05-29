/* ============================================================
   TOBY GREGG — Shared Components (Nav + Footer)
   ============================================================ */

(function () {
  const navHTML = `
<nav id="site-nav">
  <a href="index.html" class="nav-logo">Toby Gregg</a>
  <ul class="nav-links">
    <li><a href="index.html" data-page="index">Home</a></li>
    <li><a href="latest.html" data-page="latest">Latest</a></li>
    <li><a href="contact.html" data-page="contact" class="nav-cta">Contact</a></li>
  </ul>
  <button class="nav-hamburger" id="hamburger" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
</nav>
<div class="nav-mobile" id="nav-mobile">
  <a href="index.html">Home</a>
  <a href="latest.html">Latest</a>
  <a href="contact.html">Contact</a>
</div>
`;

  const footerHTML = `
<footer id="site-footer">
  <div class="footer-inner">
    <span class="footer-logo">Toby Gregg</span>
    <ul class="footer-links">
      <li><a href="index.html">Home</a></li>
      <li><a href="latest.html">Latest</a></li>
      <li><a href="contact.html">Contact</a></li>
    </ul>
    <span class="footer-copy">© 2026 Toby Gregg. All rights reserved.</span>
  </div>
</footer>
`;

  // Inject
  const navEl = document.getElementById('nav-placeholder');
  const footerEl = document.getElementById('footer-placeholder');
  if (navEl) navEl.outerHTML = navHTML;
  if (footerEl) footerEl.outerHTML = footerHTML;

  // Active link highlighting
  const page = document.body.dataset.page || '';
  document.querySelectorAll('[data-page]').forEach(a => {
    if (a.dataset.page === page) a.classList.add('active');
  });

  // Scroll → nav bg
  const nav = document.getElementById('site-nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('nav-mobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }
})();

/* ── Custom Cursor ─────────────────────────────────────────────── */
(function () {
  if (window.innerWidth < 600) return;

  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.id = 'cursor-dot';
  ring.id = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Lazy ring follow
  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  // Hover state on interactive elements
  const hoverSel = 'a, button, [role=button], .filter-btn, .post-header, .post-share-btn, input, textarea, .btn, .platform-btn';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverSel)) ring.classList.add('hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverSel)) ring.classList.remove('hover');
  });
})();

/* ── Toast utility ─────────────────────────────────────────────── */
window.showToast = function (msg, icon = '✓') {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.innerHTML = `<span>${icon}</span> ${msg}`;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2800);
};

/* ── Reveal on scroll ──────────────────────────────────────────── */
window.initReveal = function () {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => obs.observe(el));
};

document.addEventListener('DOMContentLoaded', window.initReveal);
