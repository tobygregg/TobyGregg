/* ============================================================
   REDSHIFT — main.js
   ============================================================ */

<script>
const t = document.getElementById('transition');

document.querySelectorAll('a').forEach(a=>{
  a.addEventListener('click',e=>{
    if(a.href.includes('.html')){
      e.preventDefault();
      t.classList.add('active');
      setTimeout(()=>location=a.href,700);
    }
  });
});

window.onload=()=>{
  setTimeout(()=>t.classList.remove('active'),100);
}

// subtle mouse parallax
const hero = document.querySelector('.hero');
hero?.addEventListener('mousemove',e=>{
  const x = (e.clientX / window.innerWidth - 0.5) * 10;
  const y = (e.clientY / window.innerHeight - 0.5) * 10;
  hero.style.transform = `translate(${x}px, ${y}px)`;
});
</script>

