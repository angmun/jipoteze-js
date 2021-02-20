// Get all the sections except intro that will be accessed through an arrow icon
let cat_fit = document.getElementById("fitness");
let cat_fd = document.getElementById("food");
let cat_nght = document.getElementById("nightlife");
let cat_shop = document.getElementById("shopping");
let cat_wild = document.getElementById("wildlife");
let all_cat = [cat_fit, cat_fd, cat_nght, cat_shop, cat_wild];
// Get all the arrows for the respective sections as well
let arw_cat_fit = document.getElementById("fitness-arrow");
let arw_cat_fd = document.getElementById("food-arrow");
let arw_cat_nght = document.getElementById("nightlife-arrow");
let arw_cat_shop = document.getElementById("shopping-arrow");
let arw_cat_wild = document.getElementById("wildlife-arrow");

// Include the header logo to clear other sections when needed
let site_logo = document.querySelector("#main-header #site-logo");

// Use the main element's top padding value to update the section paddings
let mainPaddingTop = window.getComputedStyle(document.getElementById("main-main")).getPropertyValue("padding-top");

// To hide a section again
let hideSection = function(){
  if(this != cat_nght){
    this.style.width = "0";
  }
  if(this == cat_nght){
    this.style.minHeight = "0";
    this.style.height = "0";
  }
  this.style.visibility = "hidden";
  this.style.padding = "0";
};

// When the arrows are pressed, their respective sections are made visible
let showSection = function(){
  this.style.width = "100%";
  this.style.minHeight = "100%";
  this.style.height = "100%";
  this.style.visibility = "visible";
  this.style.padding = mainPaddingTop + " 1rem 1rem 1rem";
  for (var i = 0; i < all_cat.length; i++) {
    if(all_cat[i] != this){
      hideSection.call(all_cat[i]);
    }
  }
};


// Clear the sections off the page
site_logo.onclick = function(){
  hideSection.call(cat_fit);
  hideSection.call(cat_fd);
  hideSection.call(cat_nght);
  hideSection.call(cat_shop);
  hideSection.call(cat_wild);
};

// Show sections according to which arrow was pressed
arw_cat_fit.onclick = function(){
  if(cat_fit.style.visibility != "visible"){showSection.call(cat_fit);}
  else{hideSection.call(cat_fit);}
};
arw_cat_fd.onclick = function(){
  if(cat_fd.style.visibility != "visible"){showSection.call(cat_fd);}
  else{hideSection.call(cat_fd);}
};
arw_cat_nght.onclick = function(){
  if(cat_nght.style.visibility != "visible"){showSection.call(cat_nght);}
  else{hideSection.call(cat_nght);}
};
arw_cat_shop.onclick = function(){
  if(cat_shop.style.visibility != "visible"){showSection.call(cat_shop);}
  else{hideSection.call(cat_shop);}
};
arw_cat_wild.onclick = function(){
  if(cat_wild.style.visibility != "visible"){showSection.call(cat_wild);}
  else{hideSection.call(cat_wild);}
};
