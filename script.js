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
