/* ============================================================
   TOBY GREGG — Home Page JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvas();
  initHeroTitle();
  initTiltCards();
  initCounters();
});

/* ── Hero Canvas Particles ─────────────────────────────────────── */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles, mouse = { x: null, y: null };

  const COLORS = ['#00e87a', '#3b7bff', '#00c96a', '#2563ff'];
  const COUNT = window.innerWidth < 768 ? 60 : 120;
  const MAX_DIST = 120;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.init(); }
    init() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 1.5 + 0.5;
      this.a  = Math.random() * 0.5 + 0.15;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          this.vx += (dx / d) * 0.3;
          this.vy += (dy / d) * 0.3;
        }
      }
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.x  += this.vx;
      this.y  += this.vy;
      if (this.x < 0) this.x = W;
      if (this.x > W) this.x = 0;
      if (this.y < 0) this.y = H;
      if (this.y > H) this.y = 0;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.a;
      ctx.fill();
    }
  }

  function buildParticles() {
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const grad = ctx.createLinearGradient(
            particles[i].x, particles[i].y,
            particles[j].x, particles[j].y
          );
          grad.addColorStop(0, particles[i].color);
          grad.addColorStop(1, particles[j].color);
          ctx.strokeStyle = grad;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    ctx.globalAlpha = 1;
    drawConnections();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); buildParticles(); });
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  resize();
  buildParticles();
  loop();
}

/* ── Hero Title Stagger Reveal ─────────────────────────────────── */
function initHeroTitle() {
  const words = document.querySelectorAll('.hero-title .word');
  if (!words.length) return;

  let delay = 300;
  words.forEach((w, i) => {
    setTimeout(() => w.classList.add('revealed'), delay + i * 120);
  });

  // Glitch effect on "TOBY GREGG" every few seconds
  const glitchEl = document.querySelector('.hero-title');
  if (!glitchEl) return;

  function glitch() {
    glitchEl.style.filter = 'blur(1px)';
    setTimeout(() => {
      glitchEl.style.filter = 'none';
      glitchEl.style.transform = 'skewX(-1deg)';
      setTimeout(() => {
        glitchEl.style.transform = 'none';
        glitchEl.style.filter = 'blur(0.5px)';
        setTimeout(() => { glitchEl.style.filter = 'none'; }, 60);
      }, 50);
    }, 50);
  }

  setInterval(() => {
    if (Math.random() > 0.6) glitch();
  }, 4000);
}

/* ── 3D Tilt Cards ─────────────────────────────────────────────── */
function initTiltCards() {
  if (window.innerWidth < 768) return;

  document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) / (r.width  / 2);
      const dy = (e.clientY - cy) / (r.height / 2);
      card.style.transform = `perspective(800px) rotateY(${dx * 3}deg) rotateX(${-dy * 2}deg) translateZ(4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ── Animated Counters ─────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '';
      const dur    = 1400;
      const start  = performance.now();

      function tick(now) {
        const t   = Math.min((now - start) / dur, 1);
        const val = Math.round(easeOut(t) * target);
        el.textContent = val + suffix;
        if (t < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach(c => obs.observe(c));
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}
