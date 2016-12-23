var express = require('express');
var app = express();
var path = require('path');
var open = require("open");
var inputs = require("./timedex-input.js");
var eData = require("./timedex-read.js");

var dataObj = {};

dataObj.workTime = inputs.workTime;
dataObj.restTime = inputs.restTime;
var exerciseFile = inputs.exerciseFile;

var exerciseData = eData.readExFile(exerciseFile);

// remove any empty strings
dataObj.exerciseData = exerciseData.filter(entry => entry.trim() != '');

console.log(`${dataObj.exerciseData.length}`);
dataObj.totalExercises = dataObj.exerciseData.length;
dataObj.onExercise = 0;
dataObj.totalTime = calcTotalTime();
dataObj.ellapsedTimex = 0;
dataObj.timeLeft = dataObj.totalTime - dataObj.ellapsedTimex;

console.log(`totalTime: ${dataObj.totalTime}`);

dataObj.exerciseData.forEach(function (entry) {
	console.log(entry);
});

function calcTotalTime() {
	return (dataObj.totalExercises * dataObj.workTime) + (dataObj.totalExercises * dataObj.restTime);
}

app.use(express.static(path.join(__dirname, 'public')));

app.use("/styles", express.static(__dirname + '/public/css'));
app.use("/scripts", express.static(__dirname + '/public/js'));
app.use("/images", express.static(__dirname + '/public/images'));

app.get("/getdata", function (req, res) {
	res.json({
		data: dataObj
	});
});

// viewed at http://localhost:500
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(500);

open("http://localhost:500");
