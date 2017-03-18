$(function () {
    // Handler for .ready() called.
    'use strict';

    const START = "Start";
    const PAUSE = "Pause";
    const RESTART = "Restart";

    var clock, countdownid = 0,
        exData = "test",
        exLoop = [],
        currentEx = '',
        currentTime = '',
        currentExCounter = 0,
        nextEx = '',
        nextTime = '',
        lastRunFlag = false,
        alreadyLogged = false,
        fogHorn, beep, ping, shotgun, applause;

    // save dom elements
    var ellapsedTimeInput = $('#ellapsedTimeInput'),
        cdDiv = $('#cdDiv'),
        innerProgressDiv = $('#innerProgressDiv'),
        timeLeftInput = $('#timeLeftInput'),
        totalTimeInput = $("#totalTimeInput"),
        startPauseBtn = $('#startPauseBtn'),
        resetBtn = $("#resetBtn"),
        currentExercise = $('#currentExercise'),
        nextExercise = $('#nextExercise');


    (function createSoundEffects() {
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

        applause = new Howl({
            src: ['sounds/Stadium Applause-SoundBible.com-1018949101.mp3']
        });

    })();

    function pad(num) {
        return ("0" + num).slice(-2);
    }

    function formatTime(secs) {
        var timeString = "";
        var minutes = Math.floor(secs / 60);
        secs = secs % 60;
        minutes = minutes % 60;
        if (minutes == 0) {
            return secs;
        } else {
            return minutes + ":" + pad(secs);
        }
    }

    function getSecondsFromTime(timeStr) {
        var seconds;

        if (timeStr.indexOf(":") >= 0) {
            var timeArray = timeStr.split(":");
            seconds = parseInt(timeArray[0]) * 60; //change minutes to seconds
            seconds = seconds + parseInt(timeArray[1]); // add seconds from current time
        } else {
            seconds = timeStr;
        }

        return seconds;

    }

    function updateTime(timeStr, incFlag) {
        // this string includes a minute part need to change to all seconds first
        var seconds = getSecondsFromTime(timeStr);

        if (incFlag === true) {
            seconds++;
        } else {
            seconds--;
        }

        return formatTime(seconds);
    }

    $.get("/getdata", function (data) {
        exData = data.data;
        //   console.log("exData: " + JSON.stringify(exData));

        fillMiddleFrameWithExerciseDetail();

    }).then(function () {
        setProgressBar(exData.totalTime);
        totalTimeInput.val(formatTime(exData.totalTime));
    });

    function logWorkOut() {
        if (!alreadyLogged) {
            alreadyLogged = true;
            $.post("/postdata", {
                status: "Done"
            });

        }

    }

    function buildExLoop(dataObj) {
        cdDiv.removeClass('pauseInterval');
        cdDiv.html('');
        currentExCounter = 0;

        exLoop = [];

        // add exercise sections
        dataObj.exerciseData.forEach(function (entry) {
            exLoop.push({
                ex: entry.exercise,
                time: entry.time
            });
        });

    } // end buildExLoop function

    startPauseBtn.click(function () {
        var buttonText = startPauseBtn.text();

        if (buttonText === START) {
            startPauseBtn.text(PAUSE);
            buildExLoop(exData);
            ellapsedTimeInput.val(formatTime(exData.ellapsedTimex));
            timeLeftInput.val(formatTime(exData.timeLeft));
            totalTimeInput.val(formatTime(exData.totalTime));

            lastRunFlag = false;
            startCounter();

        } else if (buttonText === PAUSE) {
            startPauseBtn.text(RESTART);
            cdDiv.addClass('pauseInterval');
        } else {
            startPauseBtn.text(PAUSE);
            cdDiv.removeClass('pauseInterval');
        }
    });

    resetBtn.click(function () {
        clearInterval(countdownid);
        buildExLoop(exData);
        ellapsedTimeInput.val(formatTime(exData.ellapsedTimex));
        timeLeftInput.val(formatTime(exData.timeLeft));
        totalTimeInput.val(formatTime(exData.totalTime));
        currentExercise.html('&nbsp;');
        nextExercise.html('&nbsp;');
        updateProgressBar(0);
        startPauseBtn.text(START);
        fillMiddleFrameWithExerciseDetail();
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
        } else {
            nextEx = 'Done!';
            nextTime = 0;
            lastRunFlag = true;
        } // end if

        currentExercise.html(currentEx);
        nextExercise.html(nextEx);

        setCounterColor(currentEx);
        clock = currentTime;
        cdDiv.html(formatTime(currentTime));

    }

    function countdown() {
        if (clock > 0) {
            if (!cdDiv.hasClass('pauseInterval')) {
                if (clock < 4) {
                    beep.play();
                }

                cdDiv.html(formatTime(--clock));
                ellapsedTimeInput.val(updateTime(ellapsedTimeInput.val(), true));
                timeLeftInput.val(updateTime(timeLeftInput.val(), false));
                var percent = Math.round((getSecondsFromTime(ellapsedTimeInput.val()) / innerProgressDiv.attr('aria-valuemax')) * 100);
                updateProgressBar(percent);
                if (percent == 100) {
                    applause.play();
                    logWorkOut();
                }
            }
        } else {
            clearInterval(countdownid);
            if (lastRunFlag !== true) {
                seedVariables();
                countdownid = setInterval(countdown, 1000);
            } else {
                startPauseBtn.text(START);
            } // end if

        } // end if
    }

    function setCounterColor(currentEx) {
        if (currentEx.toLowerCase() === 'rest') {
            cdDiv.css('color', 'red');
            fogHorn.play();
        } else {
            cdDiv.css('color', 'green');
            shotgun.play();
        }

    }

    function setProgressBar(maxTime) {
        innerProgressDiv.attr('aria-valuemax', maxTime);

    }

    function updateProgressBar(percent) {
        innerProgressDiv.attr('aria-valuenow', percent);
        innerProgressDiv.width(percent + '%');
        innerProgressDiv.html(percent + '%');
    }

    function fillMiddleFrameWithExerciseDetail() {

        var exerciseList = exData["exerciseData"];

        var uniqExList = [];
        $.each(exerciseList, function (index, exerciseData) {
            //            console.log(index + ": " + exerciseData.exercise + ": " + exerciseData.time);
            if ((uniqExList.indexOf(exerciseData.exercise) === -1) && (exerciseData.exercise.toLowerCase() !== "delay") && (exerciseData.exercise.toLowerCase() !== "rest"))
                uniqExList.push(exerciseData.exercise)
        });

        var htmlStr = [];
        htmlStr.push(
            "<table id=\"exerciseListTable\">",
            "<tr><th>",
            "Exercises",
            "</th></tr>"
        );

        $.each(uniqExList, function (index, value) {
            htmlStr.push("<tr><td>",value,"</td></tr>");
            console.log("value: " + value);
        });

        htmlStr.push("</table>");
        cdDiv.html(htmlStr.join(""));
    }

});
