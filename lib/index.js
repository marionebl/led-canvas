var objectAssign = require('object-assign');

var calculateBounds = require('./matrix/calculateBounds');
var populate = require('./matrix/populate');

var Matrix = require('./matrix');
var Cursor = require('./text/cursor');
var EventEmitter = require('./event-emitter');

var loop = require('./animation/loop');
var defaults = require('./defaults');

class LedCanvas extends EventEmitter {
	/**
	 * Constructs a new LedCanvas instance
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
		super();
	}

	/**
	 * Sets up basic dimensions and rendering context
	 * @param  {HTMLCanvasElement} [el] - <canvas> element to draw on
	 * @param  {Class}  [LedClass] - Led class to use
	 */
	setup(el, LedClass) {
		el.width = el.clientWidth * window.devicePixelRatio;
		el.height = el.clientHeight * window.devicePixelRatio;
		let bounds = calculateBounds(el.width, el.height, this.options.matrix);
		let leds = populate(bounds.x, bounds.y, bounds.dim, LedClass);

		this.context = el.getContext('2d');
		this.matrix = new Matrix(0, 0, bounds.x, bounds.y, leds);
		this.cursor = new Cursor(1, 0, this.font.meta.lineHeight, bounds.x, bounds.y);
	}

	/**
	 * Starts a requestAnimationFrame loop
	 */
	start() {
		loop(this);
	}

	/**
	 * Get a single led at {x, y}
	 * @param {Integer} x - x coordinate of the led to retrieve
	 * @param {Integer} y - y coordinate of the led to retrieve
	 */
	get(...args) {
		return this.matrix.get(...args);
	}

	/**
	 * Get all leds with the given property values
	 * @param {String} key - Property name
	 * @param {mixed} value - Property value to match against
	 */
	prop(...args) {
		return this.matrix.prop(...args);
	}

	/**
	 * Get all leds on row with index [y]
	 * @param {Integer} y - y coordinate of the row to retrieve
	 */
	row(y) {
		return this.matrix.row(y);
	}

	/**
	 * Get all leds on column with index [x]
	 * @param {Integer} x - x coordinate of the column to retrieve
	 */
	column(x) {
		return this.matrix.column(x);
	}

	/**
	 * Get all leds contained by a rectangle with {x:x, y:y, width:width, height:height}
	 * @param {Integer} x - x coordinate of the rectangle's upperleft corner
	 * @param {Integer} y - y coordinate of the rectangle's upperleft corner
	 * @param {Integer} width - width of the rectangle
	 * @param {Integer} height - height of the rectangle
	 */
	rect(...args) {
		return this.matrix.rect(...args);
	}

	/**
	 * Rerender all changed leds on the board
	 * @param {CanvasRenderingContext2D} context - Rendering context drawn on
	 * @param {Integer} timestamp - Time delta since the loop has been started
	 */
	render(...args) {
		this.emit('before:render', ...args);
		this.matrix.render(...args);
		this.emit('after:render', ...args);
		return this;
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
	 * Move a given matrix by x horizontally and y vertically on the matrix
	 * @param {Matrix} matrix - matrix to move on the board
	 * @param {Integer} [x=0] - Number of leds to move the matrix on the x-axis by
	 * @param {Integer} [y=0] - Number of leds to move the matrix on the y-axis by
	 */
	move(matrix, x = 0, y = 0) {
		var enabledLeds = [];

		var leds = matrix.leds.map((led) => {
			let nextLed = this.matrix.get(led.x + x, led.y + y);

			if (led.enabled) {
				enabledLeds.push(nextLed);
			}

			return nextLed.leds[0];
		});

		matrix.set(false);

		enabledLeds.forEach(function(led){
			led.set(true);
		});

		return new Matrix(matrix.x + x, matrix.y + y, matrix.width, matrix.height, leds);
	}

	/**
	 * Write a string to the led board
	 * @param {String} str - string to write to the led board
	 * @param {Integer} x - starting x coordinate to write from
	 * @param {Integer} y - starting y coordinate to write from
	 */
	write(str, x, y) {
		var cursor = (x && y) ? new Cursor(x, y) : this.cursor;
		var matrices = [];

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
			matrices.push(matrix);
		});

		return matrices.reduce(function(base, next){
			return base.add(next);
		});
	}
}

function ledCanvasFactory(el, options, LedClass, font) {
	return new LedCanvas(el, options, LedClass, font);
}

module.exports = ledCanvasFactory;
