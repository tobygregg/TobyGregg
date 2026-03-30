/* ============================================================
   REDSHIFT — main.js
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────────────────────
   1. CUSTOM CURSOR
   Dot follows instantly; ring lags behind with lerp for feel.
────────────────────────────────────────────────────────────── */
(function initCursor() {
  const dot   = document.getElementById('cursor');
  const ring  = document.getElementById('cursorTrail');
  if (!dot || !ring) return;

  let mx = -100, my = -100; // mouse position
  let rx = -100, ry = -100; // ring (lerped) position
  const LERP = 0.11;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  function tick() {
    // dot snaps
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    // ring lerps
    rx += (mx - rx) * LERP;
    ry += (my - ry) * LERP;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(tick);
  }
  tick();

  // Expand on interactive elements
  const interactives = 'a, button, label, .track, input, textarea';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();


/* ──────────────────────────────────────────────────────────────
   2. NAV — add .nav--scrolled class once user scrolls
────────────────────────────────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const THRESHOLD = 40;

  function update() {
    nav.classList.toggle('nav--scrolled', window.scrollY > THRESHOLD);
  }

  window.addEventListener('scroll', update, { passive: true });
  update(); // run on load in case page is already scrolled
})();


/* ──────────────────────────────────────────────────────────────
   3. VIDEO BACKGROUND UPLOAD
   User picks a local file → URL.createObjectURL → swap in.
────────────────────────────────────────────────────────────── */
(function initVideoUpload() {
  const input       = document.getElementById('videoInput');
  const video       = document.getElementById('bgVideo');
  const placeholder = document.getElementById('bgPlaceholder');
  if (!input || !video || !placeholder) return;

  input.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;

    // Revoke previous object URL to avoid memory leaks
    if (video._objectURL) URL.revokeObjectURL(video._objectURL);

    const url = URL.createObjectURL(file);
    video._objectURL = url;

    video.src = url;
    video.style.display = 'block';
    placeholder.style.display = 'none';

    // Fade video in smoothly
    video.style.opacity = '0';
    video.style.transition = 'opacity 1s ease';
    video.addEventListener('canplay', () => { video.style.opacity = '1'; }, { once: true });
  });
})();


/* ──────────────────────────────────────────────────────────────
   4. SCROLL REVEAL
   Elements with [data-reveal] fade + slide in when they enter
   the viewport. Respects prefers-reduced-motion.
────────────────────────────────────────────────────────────── */
(function initReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  if (prefersReduced) {
    // Skip animation, just show everything
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  targets.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────────────────────────
   5. SMOOTH SCROLL for in-page anchor links
   (Backs up CSS scroll-behavior for browsers that ignore it)
────────────────────────────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


/* ──────────────────────────────────────────────────────────────
   6. TRACK ROW — play icon hover glow (subtle red pulse)
────────────────────────────────────────────────────────────── */
(function initTrackHover() {
  document.querySelectorAll('.track:not(.track--dim)').forEach(track => {
    track.addEventListener('mouseenter', () => {
      track.style.setProperty('--track-glow', '1');
    });
    track.addEventListener('mouseleave', () => {
      track.style.setProperty('--track-glow', '0');
    });
  });
})();
