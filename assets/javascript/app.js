//Initialize firebase
var config = {
    apiKey: "AIzaSyC2GkxBsfzVOnDBDZ5TBS0bz2WP-buN5dw",
    authDomain: "train-schedule-59ceb.firebaseapp.com",
    databaseURL: "https://train-schedule-59ceb.firebaseio.com",
    projectId: "train-schedule-59ceb",
    storageBucket: "train-schedule-59ceb.appspot.com",
    messagingSenderId: "99070318127"
  };

firebase.initializeApp(config);

var database = firebase.database();

//Button for adding trains
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    //Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var trainFreq = $("#frequency-input").val().trim();

    //Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: trainDest,
        time: firstTrain,
        frequency: trainFreq,
    };

    //Uploads employee data to the database
    database.ref().push(newTrain);

    //Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.time);
    console.log(newTrain.frequency);

    alert("Train successfully added");

    //Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
});

//Create firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().destination;
    var firstTrain = childSnapshot.val().time;
    var trainFreq = childSnapshot.val().frequency;

    // Employee Info
    console.log(trainName);
    console.log(trainDest);
    console.log(firstTrain);
    console.log(trainFreq);

    //First train converted
    var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
    console.log(firstTrainConverted);

    //Difference between times
    var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
    console.log(diffTime);

    //Time apart
    var timeRemain = diffTime % trainFreq;
    console.log(timeRemain);

    //Minutes until train
    var minTilTrain = trainFreq - timeRemain;
    console.log(minTilTrain);

    //Next Arrival
    var nextTrain = moment().add(minTilTrain, "minutes");
    console.log(nextTrain);

    var nextArrival = moment(nextTrain).format("HH:mm");
    console.log(nextArrival);
    
    //Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDest),
        $("<td>").text(trainFreq),
        $("<td>").text(nextArrival),
        $("<td>").text(minTilTrain),
    );

    //Append the new row to the table
    $("#train-table > tbody").append(newRow);
});
