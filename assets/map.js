// The map variable will be initialized when showMap is called
var theMap;

// The information window that opens when a marker is clicked will be initialized when a window is being made
var infoWindow;

// We would need to keep track of the markers being set on the map
var currMarkers = [];

// Load the data from the locations.json file using XMLHttpRequest
var xhr = new XMLHttpRequest();
xhr.open("GET","assets/locations.json");
xhr.overrideMimeType("application/json");
xhr.send();
xhr.onload = function(){
  var locationData = JSON.parse(xhr.responseText);
  var actualLocations = locationData.locations;
  // Define categories of locations that map to the category buttons in the front end
  var categories = {"all":locationData.categories, "fit": "fitness", "rest":"food", "night":"nightlife","mall":"shopping","wild":"wildlife"};

  // Set the buttons to change background color when pressed
  var cat_buttons = document.getElementsByClassName("category");
  // Change the color of the buttons according to which was pressed and which wasn't
  window.addEventListener("click", function(e){
    for(let j=0;j<cat_buttons.length;j++){
      if(e.target == cat_buttons[j]){
        cat_buttons[j].style.backgroundColor = "#1f4c0d";
        cat_buttons[j].style.color = "#fcfbfb";
        cat_buttons[j].style.borderColor = "#A50016";
      }
      else{
        cat_buttons[j].style.backgroundColor = "#fcfbfb";
        cat_buttons[j].style.color = "#1f4c0d";
        cat_buttons[j].style.borderColor = "#1f4c0d";
      }
    }
  });

  // Initialize a value for use to track which locations to display on the map
  var onTheMap;
  // The marks to be displayed on the map are dependent on which category button was pressed, each button gets an onclick listener that determines the list of locations to display on the map
  for(let i=0;i<cat_buttons.length;i++){
    cat_buttons[i].addEventListener("click", function(){
      // Clear previously existing Markers from the map
      clearMarkers();
      // Get the element's id and use it to obtain the categories of locations to get from the JSON data
      onTheMap = categories[cat_buttons[i].id];

      // At this point onTheMap is either a single value or an array of values, that will determine our way forward
      var theLocationsToShow;
      if(typeof(onTheMap) == "object"){
        // All locations would need to be displayed on the map
        theLocationsToShow = [];
        onTheMap.forEach(function(item){
          theLocationsToShow = theLocationsToShow.concat(actualLocations[item]);
        });
      }
      else{
        // The selected category of locations would need to be displayed on the map
        theLocationsToShow = actualLocations[onTheMap];
      }

      // We have our list of locations, so let's get some markers on the map
      for(let m=0; m<theLocationsToShow.length; m++) {
       addMarker(theLocationsToShow[m]);
      }

      // Zoom out to show all the markers on the map
      zoomOut(currMarkers);
    });
  }
}

// Display the map on the page
var showMap = function(){
  let centerPoint = {lat:-1.330511, lng:36.924929};
  theMap = new google.maps.Map(document.getElementById("loc-map"),
{center: centerPoint , zoom: 15, mapTypeId: google.maps.MapTypeId.HYBRID});
}

// Set up a couple of helper functions for creating markers and information windows when needed
// Create a Marker with a unique icon given a location and add it to the map
var addMarker = function(aLoc){
  let pos = {lat:aLoc.coordinates[0],lng:aLoc.coordinates[1]};
  let title = aLoc.name;
  let loc_img = aLoc.img_url;
  let loc_desc = aLoc.description;
  let loc_url = aLoc.location_url;
  let aMarker = new google.maps.Marker(
    {map:theMap, position:pos, animation: google.maps.Animation.DROP, icon: 'assets/media/icons/marker.png'}
  );
  aMarker.setTitle(title);
  currMarkers.push(aMarker);
  google.maps.event.addListener(aMarker, "click",
  function(e){
    makeInfoWindow(this.position, this.title, loc_img, loc_desc, loc_url);}
);};

// Remove Markers on the map
var clearMarkers = function(){
  for(let i=0; i<currMarkers.length;i++){
    currMarkers[i].setMap(null);
  }
  currMarkers = [];
};

// Create an Information Window
var makeInfoWindow = function(pos, title, img, desc, url){
  if(infoWindow) infoWindow.close();
  let windowContent = "<div class='txt-c p-p5' style='width:250px;'><h3>"+title+"</h3><figure class='txt-c m-h-auto'><img src="+img+" alt="+title+" style='width:200px'></figure><p>"+desc+"</p><p><a href="+url+">Check out their website here</a></p></div>";
  infoWindow = new google.maps.InfoWindow(
    {map:theMap, position:pos, content:windowContent, maxWidth:300}
  );
}

// Zoom out to show all visible markers on the map
var zoomOut = function(marks){
  // Create a bound on the map for the map viewport
  let boundary = new google.maps.LatLngBounds();
  for (let a = 0; a < marks.length; a++) {
    boundary.extend(marks[a].position);
  }
  theMap.fitBounds(boundary);
}
