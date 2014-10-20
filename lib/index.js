var objectAssign = require('object-assign');

var calculateBounds = require('./matrix/calculateBounds');
var populate = require('./matrix/populate');

var Matrix = require('./matrix');
var Cursor = require('./text/cursor');

var loop = require('./animation/loop');
var defaults = require('./defaults');

class LedCanvas {
	/**
	 * @param  {HTMLCanvasElement} [el] - <canvas> element to draw on
	 * @param  {Object} [options] - LedCanvas options
	 * @param  {Class}  [LedClass] - Led class to use
	 * @param  {Object} [font] - Object describing the font to use for LedCanvas::write
	 * @return {Object} LedCanvas instance
	 */
	constructor(el, options, LedClass, font) {
		this.font = font;
		this.options = objectAssign({}, defaults, options || {});
		this.setup(el, LedClass);
	}

	setup(el, LedClass) {
		el.width = el.clientWidth * window.devicePixelRatio;
		el.height = el.clientHeight * window.devicePixelRatio;
		let bounds = calculateBounds(el.width, el.height, this.options.matrix);
		let leds = populate(bounds.x, bounds.y, bounds.dim, LedClass);

		this.context = el.getContext('2d');
		this.matrix = new Matrix(bounds.x, bounds.y, leds);
		this.cursor = new Cursor(1, 0, this.font.meta.lineHeight, bounds.x, bounds.y);
	}

	start() {
		loop(this);
	}

	/**
	 * Get a single led
	 * @param {Integer} x - x coordinate of the led to retrieve
	 * @param {Integer} y - y coordinate of the led to retrieve
	 */
	get(...args) {
		return this.matrix.get(...args);
	}

	prop(...args) {
		return this.matrix.prop(...args);
	}

	row(y) {
		return this.matrix.row(y);
	}

	column(x) {
		return this.matrix.column(x);
	}

	rect(...args) {
		return this.matrix.rect(...args);
	}

	render(...args) {
		return this.matrix.render(...args);
	}

	/**
	 * Set a single led's state
	 * @param {Integer} x - x coordinate of the led to manipulate
	 * @param {Integer} y - y coordinate of the led to manipulate
	 * @param {Boolean} [state=true] - Target state of the led
	 */
	set(x, y, state = true) {
		return this.matrix.get(x, y).set(state);
	}

	/**
	 * Toggle a single led's state
	 * @param {Integer} x - x coordinate of the led to manipulate
	 * @param {Integer} y - y coordinate of the led to manipulate
	 * @param {Boolean} [state] - Target state of the led
	 */
	toggle(x, y, state) {
		return this.matrix.get(x, y).toggle(state);
	}

	/**
	 * Write a string to the led board
	 * @param {String} str - string to write to the led board
	 * @param {Integer} x - starting x coordinate to write from
	 * @param {Integer} y - starting y coordinate to write from
	 */
	write(str, x, y) {
		var cursor = (x && y) ? new Cursor(x, y) : this.cursor;

		str.split('').forEach((character) => {
			if (character === ' ') {
				cursor.plus(4);
			}

			var fontCharacter = this.font.chars[character];
			if (! fontCharacter) return;

			var charWidth = fontCharacter.width || this.font.meta.charWidth;
			var charSpacing = this.font.meta.charSpacing || 1;
			var pixelOffset = fontCharacter.offset || 0;

			var matrix = this.rect(this.cursor.x, this.cursor.y, charWidth, this.font.meta.lineHeight);
			matrix.set(false);

			fontCharacter.data.forEach(function(pixel){
				matrix.index(pixel + pixelOffset).set(true);
			});

			cursor.plus(charWidth + charSpacing);
		});
	}
}

function ledCanvasFactory(el, options, LedClass, font) {
	return new LedCanvas(el, options, LedClass, font);
}

module.exports = ledCanvasFactory;
