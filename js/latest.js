const SHEET_CSV_URL='https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/pub?output=csv';
let allPosts=[],activeTag='all';

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
function fmtDate(s){try{return new Date(s).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}catch{return s}}
function excerpt(html,n=130){const d=document.createElement('div');d.innerHTML=html||'';const t=(d.textContent||'').trim();return t.length>n?t.slice(0,n)+'…':t}
function slug(p){return'post-'+p.title.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')}

function renderPosts(posts){
  const grid=document.getElementById('posts-grid');if(!grid)return;
  if(!posts.length){grid.innerHTML='<div class="posts-empty">No posts found.</div>';updateCount(0,0);return}
  grid.innerHTML=posts.map((p,i)=>{
    const tag=(p.tag||'other').toLowerCase().trim();
    return`<article class="post-card reveal" id="${slug(p)}" data-tag="${tag}" data-idx="${i}" style="transition-delay:${(i%6)*.05}s">
      <div class="post-card-header"><span class="tag-pill ${tag}">${p.tag||'Other'}</span><span class="post-date">${fmtDate(p.date)}</span></div>
      <h3 class="post-title">${p.title}</h3>
      <p class="post-excerpt">${excerpt(p.html)}</p>
      <button class="post-read-more" data-idx="${i}">Read more <span>→</span></button>
    </article>`;
  }).join('');
  grid.querySelectorAll('[data-idx]').forEach(el=>{el.addEventListener('click',()=>openModal(posts[parseInt(el.dataset.idx)]))});
  const ob=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');ob.unobserve(x.target)}})},{threshold:.08});
  grid.querySelectorAll('.reveal').forEach(el=>ob.observe(el));
  grid.querySelectorAll('.post-card').forEach(c=>{c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');c.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%')})});
  updateCount(posts.length,allPosts.length);
}
function updateCount(shown,total){const el=document.getElementById('filter-count');if(el)el.textContent=shown===total?`${total} posts`:`${shown} / ${total}`}

function openModal(post){
  const modal=document.getElementById('post-modal');
  const tag=(post.tag||'other').toLowerCase().trim();
  document.getElementById('modal-tag').innerHTML=`<span class="tag-pill ${tag}">${post.tag||'Other'}</span>`;
  document.getElementById('modal-date').textContent=fmtDate(post.date);
  document.getElementById('modal-title').textContent=post.title;
  document.getElementById('modal-content').innerHTML=post.html||'<p>No content.</p>';
  modal.classList.add('open');modal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  history.pushState(null,'','#'+slug(post));
}
function closeModal(){
  document.getElementById('post-modal').classList.remove('open');
  document.getElementById('post-modal').setAttribute('aria-hidden','true');
  document.body.style.overflow='';
  history.pushState(null,'',window.location.pathname+window.location.search);
}
function showToast(){const t=document.getElementById('share-toast');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2000)}

async function loadPosts(){
  const grid=document.getElementById('posts-grid');
  try{
    const r=await fetch(SHEET_CSV_URL);if(!r.ok)throw 0;
    allPosts=parseCSV(await r.text()).sort((a,b)=>new Date(b.date)-new Date(a.date));
    const params=new URLSearchParams(window.location.search);
    const tp=params.get('tag');
    if(tp){activeTag=tp.toLowerCase();document.querySelectorAll('.filter-tab').forEach(b=>b.classList.toggle('active',b.dataset.tag===activeTag))}
    renderPosts(activeTag==='all'?allPosts:allPosts.filter(p=>(p.tag||'other').toLowerCase().trim()===activeTag));
    const hash=window.location.hash.slice(1);
    if(hash){const p=allPosts.find(x=>slug(x)===hash);if(p)setTimeout(()=>openModal(p),500)}
  }catch{grid.innerHTML='<div class="posts-empty">Connect your Google Sheet to see posts.<br><small style="font-size:.65rem;letter-spacing:.06em;margin-top:8px;display:block">Update SHEET_CSV_URL in js/latest.js</small></div>'}
}

document.addEventListener('DOMContentLoaded',()=>{
  loadPosts();
  document.getElementById('filter-tabs')?.addEventListener('click',e=>{
    const b=e.target.closest('.filter-tab');if(!b)return;
    document.querySelectorAll('.filter-tab').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');activeTag=b.dataset.tag;
    renderPosts(activeTag==='all'?allPosts:allPosts.filter(p=>(p.tag||'other').toLowerCase().trim()===activeTag));
    const url=new URL(window.location);activeTag==='all'?url.searchParams.delete('tag'):url.searchParams.set('tag',activeTag);history.pushState(null,'',url);
  });
  document.getElementById('modal-close')?.addEventListener('click',closeModal);
  document.getElementById('modal-backdrop')?.addEventListener('click',closeModal);
  document.getElementById('modal-share')?.addEventListener('click',()=>{navigator.clipboard.writeText(location.origin+location.pathname+location.hash).then(showToast)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
});
