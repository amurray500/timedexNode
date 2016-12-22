 $(function() {
  // Handler for .ready() called.

var clock;
var countdownid = 0;
var exData = "test";
var exLoop = [];
var currentEx = '';
var currentTime = '';
var currentExCounter = 0;
var nextEx = '';
var nextTime = '';
var lastRunFlag = false;

$.get( "/getdata", function( data ) {
  exData = data.data;
});

function buildExLoop(dataObj)
{
  $('#cdDiv').removeClass('pauseInterval');
  $("#cdDiv").html('');
  currentExCounter = 0;

  exLoop = [];

  // add warmup section
  exLoop.push({ex:'Warm Up', time:dataObj.warmTime});
  exLoop.push({ex:'Rest', time:dataObj.restTime});

  // add exercise sections
  dataObj.exerciseData.forEach(function(entry) {
    exLoop.push({ex:entry, time:dataObj.workTime});
    exLoop.push({ex:'Rest', time:dataObj.restTime});
  });
  
  $('#startBtn').prop("disabled",false);

} // end buildExLoop function

$('body').on('click', '#startBtn', function (){
    buildExLoop(exData);
    $("#ellapsedTimeInput").val(exData.ellapsedTimex);
    $("#timeLeftInput").val(exData.timeLeft);
    $("#totalTimeInput").val(exData.totalTime);
    $("#exerciseCntInput").val(currentExCounter + " of " + exData.totalExercises);
    $('#startBtn').prop("disabled",true);
    lastRunFlag = false;
    
    startCounter();
  });

  $("#stopBtn").click(function() {
    console.log("stopBtn button clicked");
    clearInterval(countdownid);
    buildExLoop(exData);
  })

  $("#pauseBtn").click(function() {
    console.log("pauseBtn button clicked");
    $('#cdDiv').toggleClass('pauseInterval');
  })

  $("#resetBtn").click(function() {
    console.log("resetBtn button clicked");
    clearInterval(countdownid);
    buildExLoop(exData);
    $("#ellapsedTimeInput").val(exData.ellapsedTimex);
    $("#timeLeftInput").val(exData.timeLeft);
    $("#totalTimeInput").val(exData.totalTime);
    $("#exerciseCntInput").val(currentExCounter + " of " + exData.totalExercises);
  })

function startCounter() {

  seedVariables();
  countdownid = setInterval(countdown, 1000);

}

function seedVariables() {
  var topEx = null;
  var nextEx = null;



  topEx = exLoop.shift();
  currentEx = topEx.ex;
  currentTime = topEx.time;

  if (typeof exLoop[0] !== 'undefined') {
    nextEx = exLoop[0].ex;
    nextTime = exLoop[0].time;
  } 
  else {
    nextEx = 'Done!';
    nextTime = 0;
    lastRunFlag = true;
  } // end if

    console.log(`${currentEx} : ${currentTime} : ${nextEx}`);

    $('#currentExercise').html(currentEx);
    $('#nextExercise').html(nextEx);

    if ((currentEx != 'Warm Up') && (currentEx != 'Rest')) {
      $("#exerciseCntInput").val(++currentExCounter + " of " + exData.totalExercises);
    } 

    setCounterColor(currentEx);
    clock = currentTime;

}

function countdown() {
    if (clock > 0) {
      if (!$('#cdDiv').hasClass('pauseInterval')) {
        $("#cdDiv").html(--clock);
        $('#ellapsedTimeInput').val(parseInt($('#ellapsedTimeInput').val()) + 1);
        $('#timeLeftInput').val(parseInt($('#timeLeftInput').val()) - 1);
      }
    }
    else {
      clearInterval(countdownid);
      if (lastRunFlag !== true) {
        seedVariables();
        countdownid = setInterval(countdown, 1000);
      }
      else {
        $('#startBtn').prop("disabled",false);
      } // end if

    } // end if
  }

function setCounterColor(currentEx) {
  if (currentEx === 'Rest') {
    $("#cdDiv").css('color', 'red');
  }
  else {
    $("#cdDiv").css('color', 'green');
  }

}

});

