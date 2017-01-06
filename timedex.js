var express = require('express');
var app = express();
var path = require('path');
var open = require("open");
var inputs = require("./timedex-input.js");
var eData = require("./timedex-read.js");

// create a rolling file logger based on date/time
const opts = {
	logDirectory: 'wod-log',
	fileNamePattern: 'wod-<DATE>.log',
	dateFormat: 'YYYY.MM.DD'
};

const log = require('simple-node-logger').createRollingFileLogger(opts);

var dataObj = {};

var exerciseFile = inputs.exerciseFile;

var exerciseData = eData.readExFile(exerciseFile);

// remove any empty strings
exerciseData = exerciseData.filter(entry => entry.trim() != '');
dataObj.exerciseData = [];

exerciseData.forEach(function (entry) {
	var lineArray = entry.split(',');
	dataObj.exerciseData.push({
		exercise: lineArray[0].replace(/( +)/gm, " "),
		time: lineArray[1].replace(/( |\r\n|\n|\r)/gm, "")
	});
});

dataObj.totalExercises = exerciseData.length;
dataObj.onExercise = 0;
dataObj.totalTime = calcTotalTime();
dataObj.ellapsedTimex = 0;
dataObj.timeLeft = dataObj.totalTime - dataObj.ellapsedTimex;

console.log(`totalTime: ${dataObj.totalTime}`);

dataObj.exerciseData.forEach(function (entry) {
	console.log(entry.exercise + " for " + entry.time + " second(s)");
	log.info(entry.exercise + " for " + entry.time + " second(s)");
});
log.info('');

function calcTotalTime() {
	var totalTime = 0;
	dataObj.exerciseData.forEach(function (entry) {
		totalTime += parseInt(entry.time);
	});
	return totalTime;
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