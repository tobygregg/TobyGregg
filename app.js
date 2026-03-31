/* ══════════════════════════════════════════════════════
   REDSHIFT — app.js
   Cursor · Iris Wipe Transition · Tilt · Magnetic
   Parallax · Scroll Reveals · Audio Player
══════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────
   CURSOR
───────────────────────────────── */
const cursorDot   = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;
let lastEvent = null;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  lastEvent = e;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

(function animateTrail() {
  trailX += (mouseX - trailX) * 0.11;
  trailY += (mouseY - trailY) * 0.11;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
  requestAnimationFrame(animateTrail);
})();

/* ─────────────────────────────────
   NAV SCROLL OPACITY
───────────────────────────────── */
const mainNav = document.getElementById('main-nav');

window.addEventListener('scroll', () => {
  mainNav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ─────────────────────────────────
   PAGE ROUTING
───────────────────────────────── */
let currentPage   = 'home';
let transitioning = false;

/* Called from onclick attrs in HTML */
function goto(page, anchor) {
  if (transitioning) return;
  if (page === currentPage && !anchor) return;
  if (page === currentPage && anchor) { smoothScroll(anchor); return; }

  transitioning = true;

  /* Iris wipe origin = cursor position */
  const ox = lastEvent ? lastEvent.clientX : window.innerWidth  / 2;
  const oy = lastEvent ? lastEvent.clientY : window.innerHeight / 2;

  irisWipe(ox, oy,
    /* mid: swap page */
    () => {
      activatePage(page);
      if (anchor) setTimeout(() => smoothScroll(anchor), 80);
    },
    /* done */
    () => { transitioning = false; }
  );
}

function smoothScroll(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function activatePage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  currentPage = page;

  /* Sync nav */
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });

  window.scrollTo(0, 0);

  /* Boot interactions for new page */
  setTimeout(() => {
    initReveals();
    initTilt();
    initMagnetic();
    bindAudio();
  }, 100);
}

/* ─────────────────────────────────
   IRIS WIPE TRANSITION
   ─ Circular clip-path from cursor
   ─ Origin flash on swap
───────────────────────────────── */
const wipeEl = document.getElementById('page-wipe');

function irisWipe(ox, oy, midCb, doneCb) {
  /* Radius: far enough to cover any viewport */
  const dist = Math.hypot(
    Math.max(ox, window.innerWidth  - ox),
    Math.max(oy, window.innerHeight - oy)
  ) * 1.06;

  /* Dark-red radial gradient centred on origin */
  wipeEl.style.transition  = 'none';
  wipeEl.style.background  = `radial-gradient(circle at ${ox}px ${oy}px, #220008 0%, #070709 55%)`;
  wipeEl.style.clipPath    = `circle(0px at ${ox}px ${oy}px)`;
  wipeEl.classList.add('blocking');

  /* Force reflow so transition starts from 0 */
  void wipeEl.offsetHeight;

  /* ── OPEN ── */
  wipeEl.style.transition = 'clip-path 0.48s cubic-bezier(0.76, 0, 0.24, 1)';
  wipeEl.style.clipPath   = `circle(${dist}px at ${ox}px ${oy}px)`;

  setTimeout(() => {
    /* ── FLASH at origin ── */
    wipeEl.style.transition = 'background 0.06s';
    wipeEl.style.background = `radial-gradient(circle at ${ox}px ${oy}px, #3d000e 0%, #070709 50%)`;

    setTimeout(() => {
      wipeEl.style.background = `radial-gradient(circle at ${ox}px ${oy}px, #070709 0%, #070709 100%)`;
    }, 65);

    /* ── SWAP ── */
    midCb();

    /* ── CLOSE ── (slight hold so new page is visible first) */
    setTimeout(() => {
      wipeEl.style.transition = 'clip-path 0.46s cubic-bezier(0.22, 0, 0.36, 1)';
      wipeEl.style.clipPath   = `circle(0px at ${ox}px ${oy}px)`;

      setTimeout(() => {
        wipeEl.classList.remove('blocking');
        wipeEl.style.transition = 'none';
        doneCb();
      }, 470);
    }, 90);
  }, 490);
}

/* ─────────────────────────────────
   SCROLL REVEALS (IntersectionObserver)
───────────────────────────────── */
function initReveals() {
  const targets = document.querySelectorAll(
    '#page-' + currentPage + ' .reveal:not(.in)'
  );
  if (!targets.length) return;

  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07 });

  targets.forEach(el => obs.observe(el));
}

/* ─────────────────────────────────
   3D CARD TILT
───────────────────────────────── */
function initTilt() {
  document.querySelectorAll('#page-' + currentPage + ' .tilt').forEach(card => {
    let raf = null;
    let targetRx = 0, targetRy = 0;
    let currentRx = 0, currentRy = 0;

    function tick() {
      currentRx += (targetRx - currentRx) * 0.14;
      currentRy += (targetRy - currentRy) * 0.14;

      const doneX = Math.abs(targetRx - currentRx) < 0.01;
      const doneY = Math.abs(targetRy - currentRy) < 0.01;

      card.style.transform = `perspective(900px) rotateX(${currentRx}deg) rotateY(${currentRy}deg) translateZ(5px)`;

      if (!doneX || !doneY) raf = requestAnimationFrame(tick);
    }

    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      targetRx = -y * 10;
      targetRy =  x * 10;
      if (!raf) raf = requestAnimationFrame(tick);
    });

    card.addEventListener('mouseleave', () => {
      targetRx = 0; targetRy = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    });
  });
}

/* ─────────────────────────────────
   MAGNETIC BUTTONS
───────────────────────────────── */
function initMagnetic() {
  document.querySelectorAll('#page-' + currentPage + ' .magnetic').forEach(btn => {
    let raf = null;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let inside = false;

    function tickMag() {
      cx += (tx - cx) * 0.13;
      cy += (ty - cy) * 0.13;

      const done = Math.abs(tx - cx) < 0.05 && Math.abs(ty - cy) < 0.05;
      btn.style.transform = `translate(${cx}px, ${cy}px)`;

      if (!done || inside) raf = requestAnimationFrame(tickMag);
      else raf = null;
    }

    btn.addEventListener('mouseenter', () => { inside = true; });

    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      tx = (e.clientX - r.left - r.width  / 2) * 0.28;
      ty = (e.clientY - r.top  - r.height / 2) * 0.28;
      if (!raf) raf = requestAnimationFrame(tickMag);
    });

    btn.addEventListener('mouseleave', () => {
      inside = false;
      tx = 0; ty = 0;
      if (!raf) raf = requestAnimationFrame(tickMag);
    });
  });
}

/* ─────────────────────────────────
   PARALLAX (hero photo on scroll)
───────────────────────────────── */
const heroImgWrap = document.getElementById('heroImgWrap');

if (heroImgWrap) {
  window.addEventListener('scroll', () => {
    if (currentPage !== 'home') return;
    const y = window.scrollY;
    heroImgWrap.style.transform = `translateY(${y * 0.1}px)`;
  }, { passive: true });
}

/* ─────────────────────────────────
   AUDIO PLAYER
───────────────────────────────── */
let playing  = false;
let progress = 0;
let ticker   = null;
const TOTAL  = 287; /* 4:47 */

function bindAudio() {
  const playBtn     = document.getElementById('playBtn');
  const progressBar = document.getElementById('progressBar');

  if (!playBtn) return;

  playBtn.addEventListener('click', () => {
    playing = !playing;

    if (playing) {
      playBtn.innerHTML = pauseIcon();
      ticker = setInterval(() => {
        progress++;
        if (progress >= TOTAL) {
          progress = 0;
          playing = false;
          clearInterval(ticker);
          playBtn.innerHTML = playIcon();
        }
        updatePlayer();
      }, 1000);
    } else {
      playBtn.innerHTML = playIcon();
      clearInterval(ticker);
    }
  });

  if (progressBar) {
    progressBar.addEventListener('click', e => {
      const pct = e.offsetX / progressBar.offsetWidth;
      progress = Math.floor(pct * TOTAL);
      updatePlayer();
    });
  }
}

function updatePlayer() {
  const fill = document.getElementById('progressFill');
  const time = document.getElementById('currentTime');
  if (fill) fill.style.width = (progress / TOTAL * 100) + '%';
  if (time) {
    const m = Math.floor(progress / 60);
    const s = progress % 60;
    time.textContent = m + ':' + String(s).padStart(2, '0');
  }
}

function playIcon() {
  return `<svg viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>`;
}
function pauseIcon() {
  return `<svg viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
}

/* ─────────────────────────────────
   BOOT
───────────────────────────────── */

/* Block default link clicks on nav */
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', e => e.preventDefault());
});

/* Initial page setup */
initReveals();
initTilt();
initMagnetic();
bindAudio();
