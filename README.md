# timedex
countdown timer working out

This is a an easy to configure countdown timer for doing HIIT or Tabata type workouts or really any kind of workout where time is involved.

Simply clone the project then run npm install on the command line to install all the dependencies.

First thing you need to do before running it is create a text file with your list of exercises. You will see a text file in the directory called exercises.txt. You can use this as an example to create your own. You can also run the app using this file for the first time just to get an idea of what it does.

There is only one required argument which is the path to the text file with the exercises. The first line should be a number representing the number of seconds to work for each exercise. The second line should be a number to represent the number of seconds to rest between each exercise. The rest of the file is the list of exercises. 

Here is a simple example of running using the defaults

node timedex.js -e exercises.txt

