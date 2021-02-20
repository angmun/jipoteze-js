<?php
  // Allow this resource to be accessed from a different origin
  header("Access-Control-Allow-Origin: https://people.rit.edu");

  // Connect to the SQL database
  $servername = "localhost";
  $username = "am5318";
  $password = "besiderolled";
  $db = "am5318";

  // Create a connection to the database
  $connect = new mysqli($servername, $username, $password, $db);
  if ($connect->connect_errno) {
    printf("Connection failed: %s\n", $connect->connect_error);
    exit();
  }

  // Provide the data to get from the database
  function showData($leSqli){
    // Fetch the rows of data from the table for display on the website
    $tableRows = $leSqli->query("SELECT * FROM jipotezeBlog");

    // Process the data in preparation for sending back
    $allPosts = array();
    $i = 0;
    while($row = $tableRows->fetch_assoc()){
      $allPosts[$i]['pname'] = $row['postName'];
      $allPosts[$i]['ptime'] = date("M j, y g:i a", strtotime($row['postDateTime']));
      $allPosts[$i]['plocations'] = $row['visitedLocations'];
      $allPosts[$i]['ptitle'] = $row['postTitle'];
      $allPosts[$i]['ptext'] = $row['postText'];
      $i++;
    }
    // Clear previously loaded data from the php file
    ob_clean();

    ob_start();
    // Provide the data to be retrieved by blog.js
    if($allPosts){
      echo json_encode($allPosts);
    }

  }
  showData($connect);

  // Check if the incoming request is a POST
  if($_SERVER['REQUEST_METHOD'] == 'POST'){
    // From this point onwards, nothing works. I have tried but despite the data being successfully sent here, no data is accessible through $_POST
    if(isset($_POST["postName"])){
      // We can proceed with setting up the form data to upload to the database
      $pname = $_POST["postName"];
      $plocations = $_POST["visitedLocs"];
      $ptitle = $_POST["postTitle"];
      $ptext = $_POST["postText"];

      // Add an entry to the "jipotezeBlog" table
      $connect->query("INSERT INTO jipotezeBlog (postName, visitedLocations, postTitle, postText) VALUES($pname, $plocations, $ptitle, $ptext)");

      // Reload the data after adding a post
      showData($connect);
    }
  }
?>
