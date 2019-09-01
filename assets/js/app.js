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



  function loadTrainsFromFirebase() {
    // create empty train array

    trainArray = [];

    database.ref().on("child_added", function (snapshot) {
      // storing the snapshot.val() in a variable for convenience
      var sv = snapshot.val();
      // console.log(sv);
      test = sv;
      // determine train frequency
      var trainFreq = sv.trainInterval;
      var trainStart = moment(sv.trainServStart, "HH:mm").subtract(1, "years");
      var difference = moment().diff(trainStart, "minutes")
      var timeRemaining = trainFreq - (difference % trainFreq);

      trainArray.push({ "trainName": sv.trainName, "trainLocation": sv.trainLocation, "timeRemaining": timeRemaining })


      // clear existing entries from ticker
      $("#train-1").empty();
      $("#train-2").empty();
      $("#train-3").empty();
      $("#train-4").empty();
      $("#train-5").empty();

      // sort the train array by timeRemaining
      var sortedArray = trainArray.sort(function (a, b) {
        return a.timeRemaining - b.timeRemaining;
      });

      function getTrainInfo(n) {
        if (sortedArray[n]) {
          // if the array entry exists get information.
          var trainName = sortedArray[n].trainName;
          var city = sortedArray[n].trainLocation;
          var nextArrival = sortedArray[n].timeRemaining;

          var arrival = `
<div>
  <pre>
Train Name: ${trainName}
City: ${city}
Next Arrival: ${nextArrival} minutes
  </pre>
</div>
                `
          return arrival;

        }
      }


      train1 = getTrainInfo(0);
      train2 = getTrainInfo(1);
      train3 = getTrainInfo(2);
      train4 = getTrainInfo(3);
      train5 = getTrainInfo(4);

      $("#train-1").append(train1);
      $("#train-2").append(train2);
      $("#train-3").append(train3);
      $("#train-4").append(train4);
      $("#train-5").append(train5);


      // Handle the errors
    }, function (errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });
  };



  function startClock() {
    currTime = moment();
    $("#time-display").text("Current Time: " + currTime.format("HH:mm:ss"));
    var t = setTimeout(startClock, 500);

    if (moment().seconds() === 0) {
      // update train list every minute
      loadTrainsFromFirebase();
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

    loadTrainsFromFirebase(); // fetches the trains
  });

  startClock();
  loadTrainsFromFirebase(); // fetches the trains

});

