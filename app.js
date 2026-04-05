/* ══════════════════════════════════════════════════════
   REDSHIFT — app.js
══════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────
   TOUCH DETECTION
───────────────────────────────── */
const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

/* ─────────────────────────────────
   CURSOR  (desktop only)
───────────────────────────────── */
const cursorDot   = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;
let lastEvent = null;

if (!isTouch && cursorDot && cursorTrail) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
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
}

/* ─────────────────────────────────
   NAV — SCROLL OPACITY
───────────────────────────────── */
const mainNav = document.getElementById('main-nav');

window.addEventListener('scroll', () => {
  if (mainNav) mainNav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ─────────────────────────────────
   NAV — MOBILE HAMBURGER
───────────────────────────────── */
const hamburger  = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('navMobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
}

function closeMobileMenu() {
  if (hamburger) hamburger.classList.remove('open');
  if (mobileMenu) mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

/* ─────────────────────────────────
   PAGE ROUTING
───────────────────────────────── */
let currentPage   = 'home';
let transitioning = false;

function goto(page, anchor) {
  closeMobileMenu();
  if (transitioning) return;
  if (page === currentPage && !anchor) return;
  if (page === currentPage && anchor) { smoothScroll(anchor); return; }

  transitioning = true;

  const ox = lastEvent ? lastEvent.clientX : window.innerWidth  / 2;
  const oy = lastEvent ? lastEvent.clientY : window.innerHeight / 2;

  irisWipe(ox, oy,
    () => {
      activatePage(page);
      if (anchor) setTimeout(() => smoothScroll(anchor), 80);
    },
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

  document.querySelectorAll('.nav-links a, .nav-mobile-link').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });

  window.scrollTo(0, 0);

  setTimeout(() => {
    initReveals();
    if (!isTouch) { initTilt(); initMagnetic(); }
    bindAudio();
    initContactForm();
  }, 100);
}

/* ─────────────────────────────────
   IRIS WIPE TRANSITION
───────────────────────────────── */
const wipeEl = document.getElementById('page-wipe');

function irisWipe(ox, oy, midCb, doneCb) {
  const dist = Math.hypot(
    Math.max(ox, window.innerWidth  - ox),
    Math.max(oy, window.innerHeight - oy)
  ) * 1.06;

  wipeEl.style.transition = 'none';
  wipeEl.style.background = `radial-gradient(circle at ${ox}px ${oy}px, #220008 0%, #070709 55%)`;
  wipeEl.style.clipPath   = `circle(0px at ${ox}px ${oy}px)`;
  wipeEl.classList.add('blocking');
  void wipeEl.offsetHeight;

  wipeEl.style.transition = 'clip-path 0.48s cubic-bezier(0.76, 0, 0.24, 1)';
  wipeEl.style.clipPath   = `circle(${dist}px at ${ox}px ${oy}px)`;

  setTimeout(() => {
    wipeEl.style.transition = 'background 0.06s';
    wipeEl.style.background = `radial-gradient(circle at ${ox}px ${oy}px, #3d000e 0%, #070709 50%)`;
    setTimeout(() => {
      wipeEl.style.background = `radial-gradient(circle at ${ox}px ${oy}px, #070709 0%, #070709 100%)`;
    }, 65);

    midCb();

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
   SCROLL REVEALS
───────────────────────────────── */
function initReveals() {
  const targets = document.querySelectorAll('#page-' + currentPage + ' .reveal:not(.in)');
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
   3D CARD TILT  (desktop only)
───────────────────────────────── */
function initTilt() {
  if (isTouch) return;
  document.querySelectorAll('#page-' + currentPage + ' .tilt').forEach(card => {
    let raf = null, targetRx = 0, targetRy = 0, currentRx = 0, currentRy = 0;
    function tick() {
      currentRx += (targetRx - currentRx) * 0.14;
      currentRy += (targetRy - currentRy) * 0.14;
      card.style.transform = `perspective(900px) rotateX(${currentRx}deg) rotateY(${currentRy}deg) translateZ(5px)`;
      if (Math.abs(targetRx - currentRx) > 0.01 || Math.abs(targetRy - currentRy) > 0.01)
        raf = requestAnimationFrame(tick);
      else raf = null;
    }
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      targetRx = -(((e.clientY - r.top)  / r.height) - 0.5) * 10;
      targetRy =  (((e.clientX - r.left) / r.width)  - 0.5) * 10;
      if (!raf) raf = requestAnimationFrame(tick);
    });
    card.addEventListener('mouseleave', () => {
      targetRx = 0; targetRy = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    });
  });
}

/* ─────────────────────────────────
   MAGNETIC BUTTONS  (desktop only)
───────────────────────────────── */
function initMagnetic() {
  if (isTouch) return;
  document.querySelectorAll('#page-' + currentPage + ' .magnetic').forEach(btn => {
    let raf = null, tx = 0, ty = 0, cx = 0, cy = 0, inside = false;
    function tickMag() {
      cx += (tx - cx) * 0.13; cy += (ty - cy) * 0.13;
      btn.style.transform = `translate(${cx}px, ${cy}px)`;
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05 || inside)
        raf = requestAnimationFrame(tickMag);
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
      inside = false; tx = 0; ty = 0;
      if (!raf) raf = requestAnimationFrame(tickMag);
    });
  });
}

/* ─────────────────────────────────
   PARALLAX  (desktop only)
───────────────────────────────── */
const heroImgWrap = document.getElementById('heroImgWrap');
if (heroImgWrap && !isTouch) {
  window.addEventListener('scroll', () => {
    if (currentPage !== 'home') return;
    heroImgWrap.style.transform = `translateY(${window.scrollY * 0.1}px)`;
  }, { passive: true });
}

/* ─────────────────────────────────
   AUDIO PLAYER + STREAMING POPUP
───────────────────────────────── */
let progress = 0;
const TOTAL  = 226; /* 3:46 */

function bindAudio() {
  const playBtn     = document.getElementById('playBtn');
  const popup       = document.getElementById('streamPopup');
  const progressBar = document.getElementById('progressBar');

  if (!playBtn) return;

  /* Clone to remove any previously attached listeners */
  const newBtn = playBtn.cloneNode(true);
  playBtn.parentNode.replaceChild(newBtn, playBtn);

  let popupOpen = false;

  newBtn.addEventListener('click', e => {
    e.stopPropagation();
    popupOpen = !popupOpen;
    if (popup) popup.classList.toggle('visible', popupOpen);
  });

  document.addEventListener('click', e => {
    if (popup && popupOpen && !popup.contains(e.target) && e.target !== newBtn) {
      popupOpen = false;
      popup.classList.remove('visible');
    }
  }, { once: false });

  if (progressBar) {
    progressBar.addEventListener('click', e => {
      const pct = Math.max(0, Math.min(1, e.offsetX / progressBar.offsetWidth));
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

/* ─────────────────────────────────
   CONTACT FORM — FORMSPREE
───────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form || form.dataset.bound) return;
  form.dataset.bound = 'true';

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit-btn');
    const originalHTML = btn.innerHTML;

    btn.innerHTML = 'Sending&hellip;';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.innerHTML = `
          <div class="form-success">
            <div class="form-success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3>Message Sent!</h3>
            <p>Thanks for reaching out &mdash; we&rsquo;ll get back to you soon.</p>
          </div>
        `;
      } else {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
      }
    } catch {
      btn.innerHTML = originalHTML;
      btn.disabled = false;
    }
  });
}

/* ─────────────────────────────────
   BOOT
───────────────────────────────── */
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', e => e.preventDefault());
});

initReveals();
if (!isTouch) { initTilt(); initMagnetic(); }
bindAudio();
initContactForm();
