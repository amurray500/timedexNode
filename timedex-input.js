var program = require('commander');

program
	.version('1.0')
	.option('-w, --workTime <integer>', 'Number of seconds for the work segment.', 10)
	.option('-r, --restTime <integer>', 'Number of seconds for the rest segment.', 20)
	.option('-e, --exerciseFile <path>', 'The file with the list of exercises.')
	.parse(process.argv);

if (typeof program.exerciseFile === 'undefined') {
	console.log('Error: No exercise file was entered.');
	program.help();
}


module.exports.exerciseFile = program.exerciseFile;
module.exports.workTime = parseInt(program.workTime);
module.exports.restTime = parseInt(program.restTime);
