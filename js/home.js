const SHEET_CSV_URL='https://docs.google.com/spreadsheets/d/e/2PACX-1vSYHZEesHj-COGX_R5JTmE3Qz0em_KFpY5bra7YtDFESV1a7sDTQXGLXyUa1q3ZSOgrCw5jIX5dm79x/pub?output=csv';

function parseCSV(t){
  const l=t.trim().split('\n');
  const h=l[0].split(',').map(x=>x.trim().toLowerCase().replace(/"/g,''));
  return l.slice(1).map(row=>{
    const c=[];let cur='',q=false;
    for(let i=0;i<row.length;i++){const ch=row[i];if(ch==='"')q=!q;else if(ch===','&&!q){c.push(cur);cur=''}else cur+=ch;}
    c.push(cur);const o={};h.forEach((k,i)=>o[k]=(c[i]||'').replace(/^"|"$/g,'').trim());return o;
  }).filter(r=>r.title&&r.title.trim());
}
function fmtDate(s){try{return new Date(s).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}catch{return s}}
function exc(html,n=100){const d=document.createElement('div');d.innerHTML=html||'';const t=(d.textContent||'').trim();return t.length>n?t.slice(0,n)+'…':t}
function slug(p){return'post-'+p.title.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')}

async function loadPreview(){
  const grid=document.getElementById('lp-grid');if(!grid)return;
  try{
    const r=await fetch(SHEET_CSV_URL);if(!r.ok)throw 0;
    const posts=parseCSV(await r.text()).sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,3);
    if(!posts.length){grid.innerHTML='<div class="lp-loading">No posts yet.</div>';return}
    grid.innerHTML=posts.map((p,i)=>{
      const tag=(p.tag||'other').toLowerCase().trim();
      return`<article class="post-card reveal d${i+1}" data-tag="${tag}">
        <div class="post-card-header"><span class="tag-pill ${tag}">${p.tag||'Other'}</span><span class="post-date">${fmtDate(p.date)}</span></div>
        <h3 class="post-title">${p.title}</h3>
        <p class="post-excerpt">${exc(p.html)}</p>
        <a href="pages/latest.html#${slug(p)}" class="post-read-more">Read more <span>→</span></a>
      </article>`;
    }).join('');
    const ob=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');ob.unobserve(x.target)}})},{threshold:.1});
    grid.querySelectorAll('.reveal').forEach(el=>ob.observe(el));
    grid.querySelectorAll('.post-card').forEach(c=>{c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');c.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%')})});
  }catch{grid.innerHTML='<div class="lp-loading">Connect Google Sheet to see posts</div>'}
}

// H-scroll progress bar
function initProgressBar(){
  const bar=document.getElementById('hsp-bar');
  const section=document.querySelector('.h-scroll-section');
  const track=document.getElementById('h-scroll-track');
  if(!bar||!section||!track)return;
  window.addEventListener('scroll',()=>{
    const rect=section.getBoundingClientRect();
    const p=Math.min(Math.max(-rect.top/(section.offsetHeight-window.innerHeight),0),1);
    bar.style.width=(p*100)+'%';
  },{passive:true});
}

document.addEventListener('DOMContentLoaded',()=>{
  loadPreview();
  initProgressBar();
});
