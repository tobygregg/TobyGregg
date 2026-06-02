/* ============================================================
   GLOBAL JS — tobygregg.com
   ============================================================ */

/* ── PRELOADER ── */
(function(){
  const pl = document.getElementById('preloader');
  if(!pl) return;
  document.body.style.overflow = 'hidden';
  const bar = pl.querySelector('.pl-bar');
  const pct = pl.querySelector('.pl-pct');
  let count = 0;
  const tick = setInterval(() => {
    count += Math.floor(Math.random() * 18) + 4;
    if(count >= 100){ count = 100; clearInterval(tick); }
    if(pct) pct.textContent = count + '%';
  }, 80);
  setTimeout(() => pl.classList.add('reveal-name'), 150);
  setTimeout(() => pl.classList.add('load'), 350);
  function finish(){ pl.classList.add('done'); document.body.style.overflow = ''; initAll(); }
  if(document.readyState === 'complete') setTimeout(finish, 1800);
  else window.addEventListener('load', () => setTimeout(finish, 1800));
})();

/* ── PAGE TRANSITIONS ── */
const PT = document.getElementById('page-transition');
function transitionTo(href){
  if(!PT){ location.href = href; return; }
  PT.classList.add('enter');
  setTimeout(() => { location.href = href; }, 700);
}
document.addEventListener('click', e => {
  const link = e.target.closest('a[href]');
  if(!link) return;
  const href = link.getAttribute('href');
  if(!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || link.hasAttribute('target') || e.metaKey || e.ctrlKey) return;
  e.preventDefault();
  transitionTo(href);
});
window.addEventListener('pageshow', () => {
  if(PT){ PT.classList.remove('enter'); PT.classList.add('exit'); setTimeout(() => PT.classList.remove('exit'), 900); }
});

/* ── CURSOR ── */
function initCursor(){
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'c-dot'; ring.className = 'c-ring';
  document.body.append(dot, ring);
  let mx = -200, my = -200, rx = -200, ry = -200;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx+'px'; dot.style.top = my+'px'; }, {passive:true});
  (function tick(){ rx += (mx-rx)*.1; ry += (my-ry)*.1; ring.style.left = rx+'px'; ring.style.top = ry+'px'; requestAnimationFrame(tick); })();
  document.addEventListener('mousedown', () => ring.classList.add('click'));
  document.addEventListener('mouseup',   () => ring.classList.remove('click'));
  document.querySelectorAll('a, button, [data-mag], .card-tilt, .wcard, .bento-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hov'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hov'));
  });
  document.querySelectorAll('h1, h2, h3').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('text-hov'));
    el.addEventListener('mouseleave', () => ring.classList.remove('text-hov'));
  });
  // btn glow
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty('--bx', ((e.clientX-r.left)/r.width*100)+'%');
      btn.style.setProperty('--by', ((e.clientY-r.top)/r.height*100)+'%');
    });
  });
}

/* ── SCROLL REVEAL ── */
function initReveal(){
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); }});
  }, {threshold: .08});
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => obs.observe(el));
}

/* ── WORD STAGGER — safe version, handles plain text only ── */
function initWordStagger(){
  document.querySelectorAll('[data-words]').forEach(el => {
    // Collect text nodes and <br> / <span> elements, leave HTML intact
    const nodes = Array.from(el.childNodes);
    el.innerHTML = '';
    nodes.forEach(node => {
      if(node.nodeType === 3){ // text node
        node.textContent.split(' ').forEach((word, i, arr) => {
          if(!word) return;
          const wrap = document.createElement('span');
          wrap.className = 'word-wrap';
          wrap.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom';
          const inner = document.createElement('span');
          inner.className = 'word-inner';
          inner.style.cssText = 'display:inline-block;transform:translateY(110%);transition:transform .85s cubic-bezier(.16,1,.3,1)';
          inner.textContent = word;
          wrap.appendChild(inner);
          el.appendChild(wrap);
          if(i < arr.length - 1) el.appendChild(document.createTextNode(' '));
        });
      } else {
        // preserve <br>, <span class="accent">, etc. exactly
        el.appendChild(node.cloneNode ? node.cloneNode(true) : node);
      }
    });
    // stagger delays
    el.querySelectorAll('.word-inner').forEach((w, i) => {
      w.style.transitionDelay = (i * .045) + 's';
    });
    const obs = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting){
        el.querySelectorAll('.word-inner').forEach(w => { w.style.transform = 'translateY(0)'; });
        obs.unobserve(el);
      }
    }, {threshold: .15});
    obs.observe(el);
  });
}

/* ── 3D TILT ── */
function initTilt(){
  document.querySelectorAll('.card-tilt').forEach(card => {
    const inner = card.querySelector('.card-inner') || card;
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      inner.style.cssText += `transform:perspective(1000px) rotateY(${x*12}deg) rotateX(${-y*12}deg) scale(1.02);transition:transform .1s`;
      const shine = card.querySelector('.card-shine');
      if(shine) shine.style.background = `radial-gradient(circle at ${(x+.5)*100}% ${(y+.5)*100}%, rgba(255,255,255,.1), transparent 55%)`;
    });
    card.addEventListener('mouseleave', () => {
      inner.style.transform = '';
      inner.style.transition = 'transform .7s cubic-bezier(.16,1,.3,1)';
    });
  });
}

/* ── MAGNETIC BUTTONS ── */
function initMagnetic(){
  document.querySelectorAll('[data-mag]').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width/2) * .28;
      const y = (e.clientY - r.top - r.height/2) * .28;
      btn.style.transform = `translate(${x}px,${y}px)`;
      btn.style.transition = 'transform .1s';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0,0)';
      btn.style.transition = 'transform .7s cubic-bezier(.16,1,.3,1)';
    });
  });
}

/* ── POST CARD MOUSE GLOW ── */
function initCardGlow(){
  document.querySelectorAll('.post-card, .bento-card, .wcard').forEach(c => {
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100)+'%');
      c.style.setProperty('--my', ((e.clientY-r.top)/r.height*100)+'%');
    });
  });
}

/* ── COUNTERS ── */
function initCounters(){
  document.querySelectorAll('[data-count]').forEach(el => {
    const t = parseInt(el.dataset.count), suf = el.dataset.suffix || '';
    const obs = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting){
        let s = 0;
        const step = ts => { if(!s) s = ts; const p = Math.min((ts-s)/1800, 1); el.textContent = Math.floor(p*t)+suf; if(p<1) requestAnimationFrame(step); };
        requestAnimationFrame(step); obs.unobserve(el);
      }
    }, {threshold:.5});
    obs.observe(el);
  });
}

/* ── PARALLAX ── */
function initParallax(){
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    document.querySelectorAll('[data-par]').forEach(el => { el.style.transform = `translateY(${y*parseFloat(el.dataset.par)}px)`; });
  }, {passive:true});
}

/* ── ORB MOUSE ── */
function initOrbMouse(){
  const orbs = document.querySelectorAll('.orb');
  if(!orbs.length) return;
  window.addEventListener('mousemove', e => {
    const px = e.clientX/window.innerWidth, py = e.clientY/window.innerHeight;
    orbs.forEach((o,i) => { const f = .02*(i+1); o.style.transform = `translate(${(px-.5)*f*300}px,${(py-.5)*f*200}px)`; });
  }, {passive:true});
}

/* ── HORIZONTAL SCROLL ── */
function initHScroll(){
  const section = document.querySelector('.h-scroll-section');
  const track = document.getElementById('h-scroll-track');
  if(!section || !track) return;
  // On mobile, disable
  if(window.innerWidth < 768){ section.style.height = 'auto'; return; }
  function update(){
    const rect = section.getBoundingClientRect();
    const maxScroll = section.offsetHeight - window.innerHeight;
    if(maxScroll <= 0) return;
    const progress = Math.min(Math.max(-rect.top / maxScroll, 0), 1);
    const maxTranslate = track.scrollWidth - window.innerWidth + 120;
    track.style.transform = `translateX(${-progress * maxTranslate}px)`;
    const bar = document.getElementById('hsp-bar');
    if(bar) bar.style.width = (progress*100)+'%';
  }
  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', () => {
    if(window.innerWidth < 768){ section.style.height='auto'; track.style.transform=''; }
  });
}

/* ── HERO CURSOR DISTORTION ── */
function initHeroCursor(){
  const canvas = document.getElementById('hero-canvas');
  if(!canvas) return;
  const section = document.querySelector('.hero');
  let mouseX = 0, mouseY = 0;
  if(section){
    section.addEventListener('mousemove', e => {
      const r = section.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
      // move orbs subtly toward cursor
      const orbs = section.querySelectorAll('.orb');
      orbs.forEach((o, i) => {
        const factor = 0.025 * (i+1);
        const tx = (mouseX/section.offsetWidth - .5) * factor * 400;
        const ty = (mouseY/section.offsetHeight - .5) * factor * 300;
        o.style.transition = 'transform 1.2s cubic-bezier(.16,1,.3,1)';
        o.style.transform = `translate(${tx}px,${ty}px)`;
      });
    }, {passive:true});
  }
}

/* ── INIT ALL ── */
function initAll(){
  initCursor();
  initReveal();
  initWordStagger();
  initTilt();
  initMagnetic();
  initCardGlow();
  initCounters();
  initParallax();
  initOrbMouse();
  initHScroll();
  initHeroCursor();
}

if(!document.getElementById('preloader')){
  document.addEventListener('DOMContentLoaded', initAll);
}
