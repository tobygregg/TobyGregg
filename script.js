function reveal(){
  document.querySelectorAll(".reveal").forEach(el=>{
    const top = el.getBoundingClientRect().top;

    if(top < window.innerHeight - 50){
      el.classList.add("active");
    }
  });
}

/* Run immediately when page loads */
window.addEventListener("load", ()=>{
  document.querySelectorAll(".reveal").forEach(el=>{
    el.classList.add("active");
  });
});

/* Run on scroll */
window.addEventListener("scroll", reveal);

document.querySelectorAll(".btn").forEach(btn=>{
  btn.addEventListener("mousemove", e=>{
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top - rect.height/2;
    btn.style.transform = `translate(${x*0.2}px, ${y*0.2}px)`;
  });

  btn.addEventListener("mouseleave", ()=>{
    btn.style.transform = "translate(0,0)";
  });
});
