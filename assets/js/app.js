$(document).ready(function () {
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBR48u2zoYpGycx7FOCRXwwPU2JSwYuFRg",
    authDomain: "train-scheduler-9f671.firebaseapp.com",
    databaseURL: "https://train-scheduler-9f671.firebaseio.com",
    projectId: "train-scheduler-9f671",
    storageBucket: "",
    messagingSenderId: "884798218708",
    appId: "1:884798218708:web:f7446278719684a4"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  function startClock(){
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    $("#time-display").text("Current Time: "+h + ":" + m + ":" + s);
    var t = setTimeout(startClock, 500);  
  };
  function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
  }

  startClock();


  var database = firebase.database();

  $("#submit").on("click", function (event) {
    event.preventDefault();

    var trainName = $("#trainName").val().trim();
    var trainLocation = $("#trainLocation").val().trim();
    var trainServStart = $("#trainServStart").val().trim();
    var trainInterval = $("#trainInterval").val().trim();


    database.ref().push({
      "trainName": trainName,
      "trainLocation": trainLocation,
      "trainServStart": trainServStart,
      "trainInterval": trainInterval,
    });


  });

  database.ref().on("child_added", function (snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();

    // Console.loging the last user's data
    console.log(sv.trainName);
    console.log(sv.trainLocation);
    console.log(sv.trainServStart);
    console.log(sv.trainInterval);

    // Change the HTML to reflect
    var arrival = `
    <div>
      <p>Train Name: ${sv.trainName}</p>
      <p>City: ${sv.trainLocation}</p>
    </div>
    `
    if ($('#train-1').children().length === 0) {
      $("#train-1").append(arrival);
    } else if ($('#train-2').children().length === 0) {
      $("#train-2").append(arrival);
    } else if ($('#train-3').children().length === 0) {
      $("#train-3").append(arrival);
    } else if ($('#train-4').children().length === 0) {
      $("#train-4").append(arrival);
    } else if ($('#train-5').children().length === 0) {
      $("#train-5").append(arrival);
    }
    // Handle the errors
  }, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });


});

