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
  var database = firebase.database();



  function trainTicker(){
    trainArray = [];
    // clear existing entries from ticker
    $("#train-1").empty();
    $("#train-2").empty();
    $("#train-3").empty();
    $("#train-4").empty();
    $("#train-5").empty();

    database.ref().on("child_added", function (snapshot) {
      // storing the snapshot.val() in a variable for convenience
      var sv = snapshot.val();
      console.log(sv);
      test = sv;
      // determine train frequency
      var trainFreq = sv.trainInterval;
      var trainStart = moment(sv.trainServStart, "HH:mm").subtract(1, "years");
      var difference = moment().diff(trainStart, "minutes")
      var timeRemaining = trainFreq - (difference % trainFreq);
  
      trainArray.push({"trainFreq": sv.trainInterval,"trainLocation": sv.trainLocation, "timeRemaining":timeRemaining});
      // Change the HTML to reflect the train arrivals
      var arrival = `
      <div>
        <pre>
  Train Name: ${sv.trainName}
  City: ${sv.trainLocation}
  Next Arrival: ${timeRemaining} minutes
        </pre>
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
  };

  function startClock() {
    currTime = moment();
    $("#time-display").text("Current Time: " + currTime.format("HH:mm:ss"));
    var t = setTimeout(startClock, 500);

    if (moment().seconds() === 0){
      // update the ticker
      trainTicker();
    }

  };

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
    $("#trainName").val("");
    $("#trainLocation").val("");
    $("#trainServStart").val("");
    $("#trainInterval").val("");

    trainTicker();

  });

  startClock();
  trainTicker();
});

