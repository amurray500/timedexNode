# timedex
countdown timer working out

This is a an easy to configure countdown timer for doing HIIT or Tabata type workouts or really any kind of workout where time is involved.

Simply clone the project. You no longer need to run npm install because I am pushing all the files including those that you would normally install locally. the npm install did not setup everything correctly.

First thing you need to do before running it is create a text file with your list of exercises. You will see a text file in the directory called exercises.txt. You can use this as an example to create your own. You can also run the app using this file for the first time just to get an idea of what it does.

There is only one required argument which is the path to the text file with the exercises. The exercise file should list on each line an exercise or the word "Rest". Each line should also end with a comma and then an integer that tells the timer how many seconds to count down for that event.

Here is a simple example of running the app:

node timedex.js -e exercises.txt

Note that logging has been added so that you can keep track of your workout history. A new folder now exists called wod-log. If you run the app multiple times in a day then the new data simply get concatenated to the end of the log file for that day. If this is the first run for the day a new file is created. The timestamp is used to name the files.
