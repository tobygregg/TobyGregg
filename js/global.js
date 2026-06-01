document.addEventListener('DOMContentLoaded',()=>{

/* ── CURSOR ── */
const dot=document.createElement('div');
const ring=document.createElement('div');
dot.className='c-dot';ring.className='c-ring';
document.body.append(dot,ring);
let mx=-200,my=-200,rx=-200,ry=-200;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px'});
(function tick(){rx+=(mx-rx)*.1;ry+=(my-ry)*.1;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(tick)})();
document.addEventListener('mousedown',()=>ring.classList.add('click'));
document.addEventListener('mouseup',()=>ring.classList.remove('click'));
document.querySelectorAll('a,button,[data-mag],.card-tilt').forEach(el=>{
  el.addEventListener('mouseenter',()=>ring.classList.add('hov'));
  el.addEventListener('mouseleave',()=>ring.classList.remove('hov'));
});

/* ── SCROLL REVEAL ── */
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}});
},{threshold:.1});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>obs.observe(el));

/* ── 3D TILT ── */
document.querySelectorAll('.card-tilt').forEach(card=>{
  const inner=card.querySelector('.card-tilt-inner')||card;
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    inner.style.transform=`perspective(900px) rotateY(${x*12}deg) rotateX(${-y*12}deg) scale(1.02)`;
    card.querySelector('.card-shine')?.style && (card.querySelector('.card-shine').style.background=`radial-gradient(circle at ${(x+.5)*100}% ${(y+.5)*100}%, rgba(255,255,255,.08), transparent 60%)`);
  });
  card.addEventListener('mouseleave',()=>{inner.style.transform='perspective(900px) rotateY(0) rotateX(0) scale(1)'});
});

/* ── MAGNETIC BUTTONS ── */
document.querySelectorAll('[data-mag]').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{
    const r=btn.getBoundingClientRect();
    const x=e.clientX-r.left-r.width/2;
    const y=e.clientY-r.top-r.height/2;
    btn.style.transform=`translate(${x*.28}px,${y*.28}px)`;
    btn.style.transition='transform .1s';
  });
  btn.addEventListener('mouseleave',()=>{btn.style.transform='translate(0,0)';btn.style.transition='transform .6s cubic-bezier(.16,1,.3,1)'});
});

/* ── MOUSE GLOW ON CARDS ── */
document.querySelectorAll('.post-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    card.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
    card.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
  });
});

/* ── SPLIT TEXT CHAR ANIMATION ── */
document.querySelectorAll('[data-split]').forEach(el=>{
  const t=el.textContent;
  el.innerHTML=t.split('').map((c,i)=>
    c===' '?'<span style="display:inline-block;width:.3em"> </span>'
    :`<span class="sc" style="display:inline-block;opacity:0;transform:translateY(80px) rotate(${(Math.random()-.5)*15}deg);transition:opacity .7s ${i*.025}s cubic-bezier(.16,1,.3,1),transform .7s ${i*.025}s cubic-bezier(.16,1,.3,1)">${c}</span>`
  ).join('');
  const charObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.querySelectorAll('.sc').forEach(s=>{s.style.opacity='1';s.style.transform='none'});
        charObs.unobserve(e.target);
      }
    });
  },{threshold:.3});
  charObs.observe(el);
});

/* ── COUNTER ANIMATION ── */
document.querySelectorAll('[data-count]').forEach(el=>{
  const target=parseInt(el.dataset.count);
  const cObs=new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting){
      let start=0;const dur=1800;const step=timestamp=>{
        if(!start)start=timestamp;
        const p=Math.min((timestamp-start)/dur,1);
        el.textContent=Math.floor(p*target)+(el.dataset.suffix||'');
        if(p<1)requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      cObs.unobserve(el);
    }
  },{threshold:.5});
  cObs.observe(el);
});

/* ── PARALLAX HERO ── */
const hero=document.querySelector('.hero');
if(hero){
  window.addEventListener('scroll',()=>{
    const y=window.scrollY;
    const layers=hero.querySelectorAll('[data-parallax]');
    layers.forEach(l=>{l.style.transform=`translateY(${y*parseFloat(l.dataset.parallax)}px)`});
  },{passive:true});
}

/* ── HORIZONTAL SCROLL SECTION ── */
const hScroll=document.querySelector('.h-scroll-track');
if(hScroll){
  const sect=hScroll.closest('.h-scroll-section');
  function updateHScroll(){
    if(window.innerWidth<768)return;
    const rect=sect.getBoundingClientRect();
    const sticky=sect.querySelector('.h-scroll-sticky');
    const total=hScroll.scrollWidth-window.innerWidth;
    if(rect.top<=0&&rect.bottom>=window.innerHeight){
      const pct=Math.min(Math.max(-rect.top/(sect.offsetHeight-window.innerHeight),0),1);
      hScroll.style.transform=`translateX(${-pct*total}px)`;
    }
  }
  window.addEventListener('scroll',updateHScroll,{passive:true});
}

/* ── AMBIENT ORBS ── */
const orbs=document.querySelectorAll('.orb');
window.addEventListener('mousemove',e=>{
  const px=e.clientX/window.innerWidth;
  const py=e.clientY/window.innerHeight;
  orbs.forEach((o,i)=>{
    const f=.015*(i+1);
    o.style.transform=`translate(${px*f*200-f*100}px,${py*f*200-f*100}px)`;
  });
},{passive:true});

});
