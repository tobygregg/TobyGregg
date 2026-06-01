const SHEET_CSV_URL='https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/pub?output=csv';

function parseCSV(text){
  const lines=text.trim().split('\n');
  const headers=lines[0].split(',').map(h=>h.trim().toLowerCase().replace(/"/g,''));
  return lines.slice(1).map(line=>{
    const cols=[];let cur='',inQ=false;
    for(let i=0;i<line.length;i++){const c=line[i];if(c==='"')inQ=!inQ;else if(c===','&&!inQ){cols.push(cur);cur=''}else cur+=c;}
    cols.push(cur);const obj={};
    headers.forEach((h,i)=>obj[h]=(cols[i]||'').replace(/^"|"$/g,'').trim());
    return obj;
  }).filter(r=>r.title&&r.title.trim());
}
function fmtDate(s){try{return new Date(s).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}catch{return s}}
function excerpt(html,n=110){const d=document.createElement('div');d.innerHTML=html||'';const t=(d.textContent||'').trim();return t.length>n?t.slice(0,n)+'…':t}
function slug(p){return'post-'+p.title.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')}

async function loadPreview(){
  const grid=document.getElementById('lp-grid');if(!grid)return;
  try{
    const r=await fetch(SHEET_CSV_URL);if(!r.ok)throw 0;
    const posts=parseCSV(await r.text()).sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,3);
    if(!posts.length){grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--dimmer);font-family:var(--font-mono);font-size:.75rem">No posts yet.</div>';return}
    grid.innerHTML=posts.map((p,i)=>{
      const tag=(p.tag||'other').toLowerCase().trim();
      return`<article class="post-card reveal delay-${i+1}" data-tag="${tag}">
        <div class="post-card-header"><span class="tag-pill ${tag}">${p.tag||'Other'}</span><span class="post-date">${fmtDate(p.date)}</span></div>
        <h3 class="post-title">${p.title}</h3>
        <p class="post-excerpt">${excerpt(p.html)}</p>
        <a href="pages/latest.html#${slug(p)}" class="post-read-more">Read more <span>→</span></a>
      </article>`;
    }).join('');
    const ob=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');ob.unobserve(x.target)}})},{threshold:.1});
    grid.querySelectorAll('.reveal').forEach(el=>ob.observe(el));
    // mouse glow
    grid.querySelectorAll('.post-card').forEach(c=>{c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');c.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%')})});
  }catch{grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--dimmer);font-family:var(--font-mono);font-size:.75rem;letter-spacing:.1em">Connect Google Sheet to see posts</div>'}
}
document.addEventListener('DOMContentLoaded',loadPreview);

/* btn-sm style injection */
const s=document.createElement('style');
s.textContent='.btn-sm{padding:9px 18px;font-size:.72rem;border-radius:10px}';
document.head.appendChild(s);
