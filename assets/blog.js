// Get the form and its fields and first do some validation before creating blog posts
let blog_form = document.forms["blog-form"];
let entry_name = blog_form["your-name"];
let checkboxes = [blog_form["l1"],blog_form["l2"],blog_form["l3"],blog_form["l4"],blog_form["l5"],blog_form["l6"],blog_form["l7"],blog_form["l8"],blog_form["l9"],blog_form["l10"],blog_form["l11"],blog_form["l12"],blog_form["l13"]];
let post_title = blog_form["xp-title"];
let post_text = blog_form["xp-txt"];

// Display posts already in the database in the designated container
// Get the container in which posts would go
let blog_cont = document.getElementById("entries");

// This variable helps keep track of background colors for posts
let current_color = 0;

// Create blog posts from the form data
// Receive data from the server to display posts
let receiveData = function(postCont){
  let xhrSavedPosts = new XMLHttpRequest();
  xhrSavedPosts.open("GET", "https://serenity.ist.rit.edu/~am5318/646/individual_project/blog.php", true);
  xhrSavedPosts.overrideMimeType("application/json");
  xhrSavedPosts.send();
  xhrSavedPosts.onload = function(){
    if(xhrSavedPosts.readyState === xhrSavedPosts.DONE && xhrSavedPosts.status == 200){
      // Check whether the response is non-empty
      if(xhrSavedPosts.responseText){
        var postData = JSON.parse(xhrSavedPosts.responseText);
        // We will go through these colors for post backgrounds
        let colors = ["#000000","#a50016","#1f4c0d"];

        // Clear contents of the post container, then load the post data
        postCont.textContent = "";
        current_color = 0;

        if (postData){
          // Create a post for every json entry
          Object.keys(postData).forEach(function(key){
            let postInfo = postData[key];

            // Create the post container
            let blog_post = document.createElement("section");
            blog_post.classList.add("m-1");
            blog_post.classList.add("blog-post");

            // Add the poster's name to the section
            let post_name = document.createElement("h3");
            post_name.classList.add("p-p75");
            let name_txt = document.createTextNode(postInfo["pname"]);
            post_name.appendChild(name_txt);
            blog_post.appendChild(post_name);

            // Prepare a colorful div for the rest of the content
            let color_div = document.createElement("div");
            color_div.classList.add("p-p75");
            color_div.style.backgroundColor = colors[current_color];
            current_color = (current_color + 1) % 3;

            // Include the timestamp for the post
            let post_time = document.createElement("p");
            let le_time = postInfo["ptime"];
            let time_txt = document.createTextNode("Posted: " + le_time);
            post_time.appendChild(time_txt);

            // Add the timestamp to the colorful div
            color_div.appendChild(post_time);

            // Check for any checked locations to add
            if(postInfo["plocations"]){
              // Prepare a paragraph for display of the locations visited
              let post_locs = document.createElement("p");
              let locs_intro = document.createElement("span");
              locs_intro.style.fontWeight = "bold";
              let intro = document.createTextNode("I have been to ");
              locs_intro.appendChild(intro);
              post_locs.appendChild(locs_intro);
              let places_been = document.createTextNode(postInfo["plocations"]);
              post_locs.appendChild(places_been);

              // Add the locations to the colorful div
              color_div.appendChild(post_locs);
            }

            // Check if we have a full post, title and text and all
            if(postInfo["ptitle"]){
              let le_title = document.createElement("h4");
              le_title.style.paddingTop = "1rem";
              let title_txt = document.createTextNode(postInfo["ptitle"]);
              le_title.appendChild(title_txt);
              let le_txt = document.createElement("p");
              let txt_txt = document.createTextNode(postInfo["ptext"]);
              le_txt.appendChild(txt_txt);
              // Add the post to the colorful div
              color_div.appendChild(le_title);
              color_div.appendChild(le_txt);
            }

            //Add the colorful div to the section
            blog_post.appendChild(color_div);
            //Finally, add the section to the post container
            postCont.insertBefore(blog_post, postCont.childNodes[0]);
        });
        }
      }
    }
  };
}
receiveData(blog_cont);

// Change the appearance of the submit button on click ot touch
let submit_button = document.querySelector("#blog-form button");
let click_appearance = function(){this.style.color="#1f4c0d";this.style.backgroundColor="#fcfbfb";this.style.borderColor="#fcfbfb"};
let hover_appearance = function(){this.style.color="#fcfbfb";this.style.backgroundColor="#a50016";this.style.borderColor="#a50016"};
let original_appearance = function(){this.style.color="#fcfbfb";this.style.backgroundColor="#000000";this.style.borderColor="#000000"};
submit_button.onmousedown = click_appearance.bind(submit_button);
submit_button.onmouseover = hover_appearance.bind(submit_button);
submit_button.onmouseout = original_appearance.bind(submit_button);
window.addEventListener("click", function(e){
  if(event.target != submit_button) original_appearance.call(submit_button);
});

// Check for any checked boxes
function anyChecked(boxes){
  for(let x=0;x<boxes.length;x++){
    if(boxes[x].checked == true){
      return true;
    }
  }
  return false;
}

// Check for all values from an array of fields
function allFilled(fields){
  for(let y=0;y<fields.length;y++){
    if(!fields[y].value){
      return false;
    }
  }
  return true;
}

// Check for some values from an array of fields
function someFilled(fields){
  let filledOnes = [];
  for(let z=0;z<fields.length;z++){
    if(fields[z].value) filledOnes.push(fields[z]);
  }
  if(filledOnes.length > 0 && filledOnes.length < fields.length){
    return true;
  }
  return false;
}

// Show a validation error for this field
function validateThis(aField){
  let originalColor = aField.style.borderColor;
  aField.style.borderColor = "#f44336";
  aField.placeholder = "Please fill out this field";
  aField.onfocus = function(){
    if (!aField.value){
      aField.style.borderColor = originalColor;
      aField.style.color = "#000000";
      aField.value = "";
    }
  };
}

function isValidated(){
  // Send the data to a PHP form using XMLHttpRequest for processing
  let xhrPHP = new XMLHttpRequest();
  let formD = new FormData();

  // Prepare the data for submission to the PHP form
  // Add the given name
  formD.append("postName", entry_name.value);

  // Get a list of the checked values
  let visited_locs = [];
  for (let x=0;x<checkboxes.length;x++){
    if(checkboxes[x].checked){
      visited_locs.push(checkboxes[x].value);
    }
  }

  // Set up a string of locations
  let loc_list = "";
  for (let y=0;y<visited_locs.length;y++){
    // If this is not the first or last entry, add a comma before
    if(y>0 && y<(visited_locs.length-1)){
      loc_list += ", ";
    }
    // Last entry
    if (visited_locs.length > 1 && y==(visited_locs.length-1)) {
      loc_list += " and ";
    }
    loc_list += visited_locs[y];
  }
  formD.append("visitedLocs", loc_list);

  // Add the post title
  formD.append("postTitle", post_title.value);

  // Add the post text
  formD.append("postText", post_text.value);

  // Set listeners to determine success or failure
  xhrPHP.addEventListener("load", function(){
    console.log("Data successfully sent!");
    // receiveData(blog_cont);
  });

  xhrPHP.addEventListener("error", function(){
    console.log("Something went wrong!");
  });
  // Send the data to a PHP file that will upload the data to an SQL table
  xhrPHP.open("POST", "https://serenity.ist.rit.edu/~am5318/646/individual_project/blog.php", true);
  // xhrPHP.setRequestHeader("Content-Type", "multipart/form-data");
  xhrPHP.send(formD);




  // This shows how submitted posts would be created if the data sent through POST was accessible through the blog.php file set up in serenity. Added posts should persist, but since this adds them via javascript with no storage, they are erased after page reload. I have tried my best to resolve the matter, but I have not been able to crack it.
  // We will go through these colors for post backgrounds
  let colors = ["#000000","#a50016","#1f4c0d"];

  // Create the post container
  let blog_post = document.createElement("section");
  blog_post.classList.add("m-1");
  blog_post.classList.add("blog-post");

  // Add the poster's name to the section
  let post_name = document.createElement("h3");
  post_name.classList.add("p-p75");
  let name_txt = document.createTextNode(entry_name.value);
  post_name.appendChild(name_txt);
  blog_post.appendChild(post_name);

  // Prepare a colorful div for the rest of the content
  let color_div = document.createElement("div");
  color_div.classList.add("p-p75");
  color_div.style.backgroundColor = colors[current_color];
  current_color = (current_color + 1) % 3;

  // Check for any checked locations to add
  if(anyChecked(checkboxes)){
    // Get a list of the checked values
    let visited_locs = [];
    for (let x=0;x<checkboxes.length;x++){
      if(checkboxes[x].checked){
        visited_locs.push(checkboxes[x].value);
      }
    }

    // Prepare a paragraph for display of the locations visited
    let post_locs = document.createElement("p");
    let locs_intro = document.createElement("span");
    locs_intro.style.fontWeight = "bold";
    let intro = document.createTextNode("I have been to ");
    locs_intro.appendChild(intro);
    post_locs.appendChild(locs_intro);
    let loc_list = "";
    for (let y=0;y<visited_locs.length;y++){
      // If this is not the first or last entry, add a comma before
      if(y>0 && y<(visited_locs.length-1)){
        loc_list += ", ";
      }
      // Last entry
      if (visited_locs.length > 1 && y==(visited_locs.length-1)) {
        loc_list += " and ";
      }
      loc_list += visited_locs[y];
    }
    let places_been = document.createTextNode(loc_list);
    post_locs.appendChild(places_been);

    // Add the locations to the colorful div
    color_div.appendChild(post_locs);

  }

  // Check if we have a full post, title and text and all
  if(allFilled([post_title, post_text])){
    let le_title = document.createElement("h4");
    le_title.style.paddingTop = "1rem";
    let title_txt = document.createTextNode(post_title.value);
    le_title.appendChild(title_txt);
    let le_txt = document.createElement("p");
    let txt_txt = document.createTextNode(post_text.value);
    le_txt.appendChild(txt_txt);
    // Add the post to the colorful div
    color_div.appendChild(le_title);
    color_div.appendChild(le_txt);
  }

  //Add the colorful div to the section
  blog_post.appendChild(color_div);
  //Finally, add the section to the post container
  blog_cont.insertBefore(blog_post, blog_cont.childNodes[0]);
}

// Check if any fields have been entered without having a name to them
let validating = function(e){
  if((anyChecked(checkboxes) || allFilled([post_title, post_text])) && !entry_name.value){
    e.preventDefault();
    validateThis(entry_name);
  }
  if (someFilled([post_title, post_text]) && !post_title.value) {
    e.preventDefault();
    validateThis(post_title);
  }
  if (someFilled([post_title, post_text]) && !post_text.value) {
    e.preventDefault();
    validateThis(post_text);
  }
  // If the form entries are not empty and a name has been provided for the post, let's display the post
  if (entry_name.value && (anyChecked(checkboxes) || allFilled([post_title, post_text]))){
    isValidated();
  }
}
submit_button.onclick = validating;
