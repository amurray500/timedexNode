var program = require('commander');

program
	.version('1.0')
	.option('-e, --exerciseFile <path>', 'The file with the list of exercises.')
	.parse(process.argv);

if (typeof program.exerciseFile === 'undefined') {
	console.log('Error: No exercise file was entered.');
	program.help();
}


module.exports.exerciseFile = program.exerciseFile;