document.addEventListener("DOMContentLoaded", () => {

  // Reveal animation
  document.querySelectorAll(".reveal").forEach(el=>{
    el.classList.add("active");
  });

  // Hamburger menu
  const hamburger = document.querySelector(".hamburger");
  const menu = document.querySelector(".menu");

  if(hamburger){
    hamburger.addEventListener("click", ()=>{
      menu.classList.toggle("active");
    });
  }

  // Page transition animation
  document.querySelectorAll("a").forEach(link=>{
    if(link.href && link.href.startsWith(window.location.origin)){
      link.addEventListener("click", e=>{
        e.preventDefault();

        const transition = document.querySelector(".page-transition");
        if(transition){
          transition.classList.add("active");

          setTimeout(()=>{
            window.location.href = link.href;
          },500);
        }
      });
    }
  });

  // Mouse glow follow effect
  const glow = document.createElement("div");
  glow.style.position = "fixed";
  glow.style.width = "250px";
  glow.style.height = "250px";
  glow.style.borderRadius = "50%";
  glow.style.background = "radial-gradient(circle, rgba(0,170,255,0.25), transparent 70%)";
  glow.style.pointerEvents = "none";
  glow.style.filter = "blur(40px)";
  glow.style.zIndex = "-1";
  document.body.appendChild(glow);

  document.addEventListener("mousemove", e=>{
    glow.style.left = (e.clientX - 125) + "px";
    glow.style.top = (e.clientY - 125) + "px";
  });

});
