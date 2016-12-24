# timedex
countdown timer working out

This is a an easy to configure countdown timer for doing HIIT or Tabata type workouts or really any kind of workout where time is involved.

Simply clone the project then run npm install on the command line to install all the dependencies.

First thing you need to do before running it is create a text file with your list of exercises. You will see a text file in the directory called exercises.txt. You can use this as an example to create your own. You can also run the app using this file for the first time just to get an idea of what it does.

There is only one required argument and 2 optional. The required is the path to the text file with the exercises. The other two have defaults defined in timedex-input.js which you can update of course. These are the work and rest times that the app uses for the countdown. 

Here is a simple example of running using the defaults

node timedex.js -e exercises.txt

The app will read in all the exercises and then use the defauls for work and rest times. If you want to change the defaults you can run it like this:

node timedex.js -e exercises.txt -w 20 -r 10

