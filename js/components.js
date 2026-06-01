const NAV_HTML=`
<nav class="site-nav" id="site-nav">
  <a href="/index.html" class="nav-logo">
    <span class="logo-t">Toby</span><span class="logo-dot">.</span><span class="logo-g">Gregg</span>
  </a>
  <div class="nav-links">
    <a href="/index.html" class="nav-link">Home</a>
    <a href="/pages/latest.html" class="nav-link">Latest</a>
    <a href="/pages/contact.html" class="nav-link">Contact</a>
  </div>
  <button class="nav-burger" id="nav-burger" aria-label="Menu"><span></span><span></span><span></span></button>
  <div class="nav-mobile-menu" id="nav-mobile-menu">
    <a href="/index.html" class="nav-mobile-link">Home</a>
    <a href="/pages/latest.html" class="nav-mobile-link">Latest</a>
    <a href="/pages/contact.html" class="nav-mobile-link">Contact</a>
  </div>
</nav>`;

const FOOTER_HTML=`
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <span class="footer-name">Toby Gregg</span>
      <span class="footer-loc">Guernsey, Channel Islands</span>
    </div>
    <div class="footer-links">
      <a href="https://linkedin.com/in/tobygregg" target="_blank" rel="noopener" class="footer-social">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      </a>
      <a href="https://github.com/tobygregg" target="_blank" rel="noopener" class="footer-social">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
      </a>
    </div>
    <div class="footer-copy">© <span id="footer-year"></span> Toby Gregg</div>
  </div>
</footer>`;

function injectComponents(){
  const n=document.getElementById('nav-root');if(n)n.innerHTML=NAV_HTML;
  const f=document.getElementById('footer-root');if(f)f.innerHTML=FOOTER_HTML;
  const yr=document.getElementById('footer-year');if(yr)yr.textContent=new Date().getFullYear();
  const path=window.location.pathname;
  document.querySelectorAll('.nav-link,.nav-mobile-link').forEach(l=>{
    if(l.getAttribute('href')===path||(path==='/'&&l.getAttribute('href')==='/index.html'))l.classList.add('active');
  });
  const burger=document.getElementById('nav-burger');
  const mob=document.getElementById('nav-mobile-menu');
  if(burger&&mob){burger.addEventListener('click',()=>{burger.classList.toggle('open');mob.classList.toggle('open')})}
  const nav=document.getElementById('site-nav');
  window.addEventListener('scroll',()=>{nav.classList.toggle('scrolled',window.scrollY>60)},{passive:true});
}
document.addEventListener('DOMContentLoaded',injectComponents);
