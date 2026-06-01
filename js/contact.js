document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('cf');
  const success=document.getElementById('cf-success');
  const submit=form?.querySelector('.cf-submit');
  if(!form)return;
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    if(submit){submit.textContent='Sending…';submit.disabled=true}
    try{
      const r=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
      if(r.ok){form.reset();if(success){success.classList.add('visible');success.setAttribute('aria-hidden','false')};if(submit)submit.style.display='none'}
      else throw 0;
    }catch{
      if(submit){submit.innerHTML='Error — try again';submit.disabled=false;setTimeout(()=>{submit.innerHTML='Send Message <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>'},3000)}
    }
  });
});
