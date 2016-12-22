$(function () {
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
  var fogHorn;
  var beep;
  var ping;
  var shotgun;

  createSoundEffects();

  $.get("/getdata", function (data) {
    exData = data.data;
  });

  function buildExLoop(dataObj) {
    $('#cdDiv').removeClass('pauseInterval');
    $("#cdDiv").html('');
    currentExCounter = 0;

    exLoop = [];

    // add warmup section
    exLoop.push({ ex: 'Warm Up', time: dataObj.warmTime });
    exLoop.push({ ex: 'Rest', time: dataObj.restTime });

    // add exercise sections
    dataObj.exerciseData.forEach(function (entry) {
      exLoop.push({ ex: entry, time: dataObj.workTime });
      exLoop.push({ ex: 'Rest', time: dataObj.restTime });
    });

    $('#startBtn').prop("disabled", false);

  } // end buildExLoop function

  $('body').on('click', '#startBtn', function () {
    buildExLoop(exData);
    $("#ellapsedTimeInput").val(exData.ellapsedTimex);
    $("#timeLeftInput").val(exData.timeLeft);
    $("#totalTimeInput").val(exData.totalTime);
    $("#exerciseCntInput").val(currentExCounter + " of " + exData.totalExercises);
    $('#startBtn').prop("disabled", true);
    lastRunFlag = false;

    startCounter();
  });

  $("#stopBtn").click(function () {
    console.log("stopBtn button clicked");
    clearInterval(countdownid);
    buildExLoop(exData);
  })

  $("#pauseBtn").click(function () {
    console.log("pauseBtn button clicked");
    $('#cdDiv').toggleClass('pauseInterval');
  })

  $("#resetBtn").click(function () {
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
    $('#cdDiv').html(currentTime);

  }

  function countdown() {
    if (clock > 0) {
      if (!$('#cdDiv').hasClass('pauseInterval')) {
        if (clock < 4) {
          beep.play();
        }

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
        $('#startBtn').prop("disabled", false);
      } // end if

    } // end if
  }

  function setCounterColor(currentEx) {
    if (currentEx === 'Rest') {
      $("#cdDiv").css('color', 'red');
      fogHorn.play();
    }
    else {
      $("#cdDiv").css('color', 'green');
      shotgun.play();
    }

  }

  function createSoundEffects() {
   fogHorn = new Howl({
      src: ['sounds/foghorn-daniel_simon.mp3']
    });

  beep = new Howl({
      src: ['sounds/Beep-SoundBible.com-923660219.mp3']
    });

  ping = new Howl({
      src: ['sounds/glass_ping-Go445-1207030150.mp3']
    });

  shotgun = new Howl({
      src: ['sounds/shotgun-mossberg590-RA_The_Sun_God-451502290.mp3']
    });

  }

});

