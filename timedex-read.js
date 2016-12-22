fs = require('fs');

function readExFile(exFile) {
    var exerciseData = fs.readFileSync(exFile, 'utf8').split("\n");
    return exerciseData;
}

module.exports.readExFile = readExFile;