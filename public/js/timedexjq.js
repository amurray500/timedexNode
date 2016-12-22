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
    var fogHorn;
    var beep;
    var ping;
    var shotgun;
    
    // save dom elements
    var ellapsedTimeInput = $('#ellapsedTimeInput');
    var cdDiv = $('#cdDiv');
    var innerProgressDiv = $('#innerProgressDiv');
    var timeLeftInput = $('#timeLeftInput');
    var totalTimeInput = $("#totalTimeInput");
    var startBtn = $('#startBtn');
    var stopBtn = $("#stopBtn");
    var pauseBtn = $("#pauseBtn");
    var resetBtn = $("#resetBtn");
    var currentExercise = $('#currentExercise');
    var nextExercise = $('#nextExercise');

    createSoundEffects();

    $.get("/getdata", function(data) {
        exData = data.data;
    }).then(function() {
        setProgressBar(exData.totalTime);
    });



    function buildExLoop(dataObj) {
        cdDiv.removeClass('pauseInterval');
        cdDiv.html('');
        currentExCounter = 0;

        exLoop = [];

        // add warmup section
        exLoop.push({ ex: 'Warm Up', time: dataObj.warmTime });
        exLoop.push({ ex: 'Rest', time: dataObj.restTime });

        // add exercise sections
        dataObj.exerciseData.forEach(function(entry) {
            exLoop.push({ ex: entry, time: dataObj.workTime });
            exLoop.push({ ex: 'Rest', time: dataObj.restTime });
        });

        startBtn.prop("disabled", false);

    } // end buildExLoop function

    $('body').on('click', '#startBtn', function() {
        buildExLoop(exData);
        ellapsedTimeInput.val(exData.ellapsedTimex);
        timeLeftInput.val(exData.timeLeft);
        totalTimeInput.val(exData.totalTime);


        startBtn.prop("disabled", true);
        lastRunFlag = false;

        startCounter();
    });

    stopBtn.click(function() {
        console.log("stopBtn button clicked");
        clearInterval(countdownid);
        buildExLoop(exData);
    })

    pauseBtn.click(function() {
        console.log("pauseBtn button clicked");
        cdDiv.toggleClass('pauseInterval');
    })

    resetBtn.click(function() {
        console.log("resetBtn button clicked");
        clearInterval(countdownid);
        buildExLoop(exData);
        ellapsedTimeInput.val(exData.ellapsedTimex);
        timeLeftInput.val(exData.timeLeft);
        totalTimeInput.val(exData.totalTime);
        updateProgressBar(0);
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

        currentExercise.html(currentEx);
        nextExercise.html(nextEx);

        setCounterColor(currentEx);
        clock = currentTime;
        cdDiv.html(currentTime);

    }

    function countdown() {
        if (clock > 0) {
            if (!cdDiv.hasClass('pauseInterval')) {
                if (clock < 4) {
                    beep.play();
                }

                cdDiv.html(--clock);
                ellapsedTimeInput.val(parseInt(ellapsedTimeInput.val()) + 1);
                timeLeftInput.val(parseInt(timeLeftInput.val()) - 1);
                updateProgressBar(Math.round((ellapsedTimeInput.val()/innerProgressDiv.attr('aria-valuemax')) * 100));
            }
        }
        else {
            clearInterval(countdownid);
            if (lastRunFlag !== true) {
                seedVariables();
                countdownid = setInterval(countdown, 1000);
            }
            else {
                startBtn.prop("disabled", false);
            } // end if

        } // end if
    }

    function setCounterColor(currentEx) {
        if (currentEx === 'Rest') {
            cdDiv.css('color', 'red');
            fogHorn.play();
        }
        else {
            cdDiv.css('color', 'green');
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

    function setProgressBar(maxTime) {
        console.log('in setProgressBar: ' + maxTime);
        innerProgressDiv.attr('aria-valuemax', maxTime);

    }

    function updateProgressBar(percent) {
      console.log('percent = ' + percent)
      innerProgressDiv.attr('aria-valuenow', percent);
      innerProgressDiv.width(percent + '%');
      innerProgressDiv.html(percent + '%');
    }

});

