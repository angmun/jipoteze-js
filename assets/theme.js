"use strict";
// Change the ISTE 646 home button when hovered over, pressed or tapped
let home_button = document.getElementById("home-button");
let button_img = home_button.firstChild;
// Add event handlers for onmouseover, onmouseout, ontouchstart and ontouchend;
let buttonLight = function(){
  button_img.src = "assets/media/icons/home-hover.png";
}
let buttonDark = function(){
  button_img.src = "assets/media/icons/home-button.png";
}
button_img.onmouseover = buttonLight;
button_img.ontouchstart = buttonLight;
button_img.onmouseout = buttonDark;

// Bring down the navigation menu on click and hide it when no longer in focus
if(document.querySelector("nav")){
  let menu = document.querySelector("nav figure");
  let dropdown = document.getElementById("dropdown");
  let showCont = function(e){
    dropdown.classList.add("show");
    e.preventDefault();
  }
  let hideCont = function(){
    dropdown.classList.remove("show");
  }
  let closeMenu = function(e){
    if(e.target != menu) {
      hideCont();}
  }
  window.addEventListener("click", closeMenu);
  menu.ontouchstart =showCont;
  menu.onmouseover = showCont;
}
