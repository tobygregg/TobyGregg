// Scroll reveal + instant reveal on load
function revealElements(){
  document.querySelectorAll(".reveal").forEach(el => {
    el.classList.add("active");
  });
}

window.addEventListener("scroll", () => {
  document.querySelectorAll(".reveal").forEach(el => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    if(elementTop < windowHeight - 80){
      el.classList.add("active");
    }
  });
});

// Run reveal instantly when page loads
window.addEventListener("load", revealElements);

// Hamburger menu
const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".menu");

if(hamburger){
  hamburger.addEventListener("click", () => {
    menu.classList.toggle("active");
  });
}
