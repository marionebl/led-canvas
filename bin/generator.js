var fs = require('fs');
var path = require('path');

var inFile = process.argv[2];
var outFile = process.argv[3];
var fullInFile = path.resolve(process.cwd(), inFile || '');
var fullOutFile = path.resolve(process.cwd(), outFile || '');
var fileContent = null;
var characters = [];
var charWidths = [];
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
	var charBuffer = generateCharData(charData);

	var xBuffer = charBuffer.map(function (blob) {
		return blob[0];
	});

	var width = Math.max.apply(Math, xBuffer) + 1;
	charWidths.push(width);

	font.chars[identifier] = {
		data: charBuffer,
		width: width
	};
}

if (Math.max.apply(Math, charWidths) !== Math.min.apply(Math, charWidths)) {
	font.meta.monospaced = false;
}

output = JSON.stringify(font, null, 2);
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
	for (var y = 0; y < character.length; y += 1) {
		var line = character[y];

		for (var x = 0; x < line.length; x += 1) {
			if ([' ', '#', '.'].indexOf(line.charAt(x)) === -1) {
				coords.push([x, y]);
			}
		}
	}
	return coords;
}
