var express = require('express');
var app = express();
var path = require('path');
var open = require("open");
var inputs = require("./timedex-input.js");
var eData = require("./timedex-read.js");
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "alan",
  password: "pega",
  database: "timedex"
});

var bodyParser = require('body-parser')
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
	extended: true
}));


// create a rolling file logger based on date/time
const opts = {
	logDirectory: 'wod-log',
	fileNamePattern: 'wod-<DATE>.log',
	dateFormat: 'YYYY.MM.DD'
};

var dataObj = {};

var logArray = [];

var exerciseFile = inputs.exerciseFile;

var exerciseData = eData.readExFile(exerciseFile);

// remove any empty strings
exerciseData = exerciseData.filter(entry => entry.trim() != '');
dataObj.exerciseData = [];

exerciseData.forEach(function (entry) {
	var lineArray = entry.split(',');
    console.log("lineArray = " + lineArray)
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
	logArray.push(entry.exercise + " for " + entry.time + " second(s)");
});

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


app.post('/postdata', function (req, res) {
	var status = req.body.status;
   // return;     // @@@@!!!!! for testing purposes only
	if (status === 'Done') {
		const log = require('simple-node-logger').createRollingFileLogger(opts);
		console.log('length of logArray: ' + logArray.length);
		logArray.forEach(function (entry) {
			log.info(entry);
		});
		log.info('');
		// save exercise info to database
		
		
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  
	dataObj.exerciseData.forEach(function (entry) {
	  var sql = "INSERT INTO timedex.workout ( workoutName, workoutDate, exercise, duration) VALUES ('" + exerciseFile + "', NOW(), '" + entry.exercise + "', " + entry.time + ")";

	  con.query(sql, function (err, result) {
	    if (err) throw err;
	    console.log("1 record inserted");
	  });
	});
});
		
		
		

		
	}
});

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});


app.listen(500);

// viewed at http://localhost:500
open("http://localhost:500");
