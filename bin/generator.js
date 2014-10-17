var fs = require('fs');
var path = require('path');


var inFile = process.argv[2];
var outFile = process.argv[3];
var fullInFile = path.join(__dirname, inFile || '');
var fullOutFile = path.join(__dirname, outFile || '');
var fileContent = null;
var characters = [];
var output = null;
var font = {
    meta: {
        monospaced: true,
        charWidth: -1,
        lineHeight: -1
    },
    chars: {}
};


if (!inFile) {
	return console.log('Please specify a filename as input.');
}

if (!fs.existsSync(fullInFile)) {
	return console.log('File:', fullInFile, 'does not exist.');
}


fileContent = fs.readFileSync(fullInFile).toString('utf-8');
characters = fileContent.split(/\n\n/).map(function (character) {
	return character.split(/\n/);
});


font.meta.charWidth = characters.reduce(charWidth, 0);
font.meta.lineHeight = characters.reduce(charHeight, 0);


for (var i = 0; i < characters.length; i += 1) {
	var charData = characters[i];
	var identifier = charData.shift().replace('# ', '');
	font.chars[identifier] = {
		data: generateCharData(charData)
	};
}


output = JSON.stringify(font);
if (!outFile) {
    console.log(output);
} else {
    fs.writeFileSync(fullOutFile, output);
}


function charWidth(initial, character) {
    var lineLengths = character.map(function (line) { return line.length; });
    var maxLength = Math.max.apply(Math, lineLengths);
    return maxLength > initial ? maxLength : initial;
}

function charHeight(initial, character) {
    var len = character.length - 2;
    return len > initial ? len : initial;
}

function generateCharData(character) {
    var coords = [];
    for (var x = 0; x < character.length; x += 1) {
        var line = character[x];

        for (var y = 0; y < line.length; y += 1) {
            if (line.charAt(y) !== ' ') {
                coords.push([x, y]);
            }
        }
    }
    return coords;
}
