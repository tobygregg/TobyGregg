// Page transition (SAFE VERSION)
document.querySelectorAll("a").forEach(link => {

  // Only apply to internal links
  if(link.hostname === window.location.hostname){

    link.addEventListener("click", function(e){

      // Ignore anchors, mailto, or javascript links
      if(link.getAttribute("href").startsWith("#")) return;

      e.preventDefault();

      const transition = document.querySelector(".page-transition");

      if(transition){
        transition.classList.add("active");

        setTimeout(()=>{
          window.location.href = link.href;
        }, 500);
      } else {
        window.location.href = link.href;
      }

    });

  }

});
