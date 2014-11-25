var objectAssign = require('object-assign');
var LedCanvasMatrix = require('led-canvas-matrix');
var LedCanvasText = require('led-canvas-text');
var NanoEventEmitter = require('nano-event-emitter');

//var Cursor = require('./cursor');
var loop = require('./animation/loop');
var defaults = require('./defaults');

class LedCanvas extends NanoEventEmitter {
	/**
	 * Constructs a new LedCanvas instance
	 * @param  {HTMLCanvasElement} [el] - <canvas> element to draw on
	 * @param  {Object} [options] - LedCanvas options
	 * @param  {Class}  [LedClass] - Led class to use
	 * @return {Object} LedCanvas instance
	 */
	constructor(el, options, LedClass) {
		this.options = objectAssign({}, defaults, options || {});
		this.ledClass = LedClass;
		this.setup(el);
		super();
	}

	/**
	 * Sets up basic dimensions and rendering context
	 * @param  {HTMLCanvasElement} [el] - <canvas> element to draw on
	 */
	setup(el) {
		el.width = el.clientWidth * window.devicePixelRatio;
		el.height = el.clientHeight * window.devicePixelRatio;
		this.context = el.getContext('2d');
		this.matrix = new LedCanvasMatrix(0, 0, this.options.matrix.width, this.options.matrix.height, (x, y) => {
			return this.getLed(x, y);
		});
	}

	/**
	 * Return a new Led
	 */
	getLed(x, y) {
		return new this.ledClass(x, y, this.options.matrix.dim);
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

		return new LedCanvasMatrix(matrix.x + x, matrix.y + y, matrix.width, matrix.height, leds);
	}

	/**
	 * Write a string to the led board
	 * @param {String} str - string to write to the led board
	 * @param {Integer} x - starting x coordinate to write from
	 * @param {Integer} y - starting y coordinate to write from
	 */
	write(str, font, x = 0, y = 0) {
		var text = new LedCanvasText(str, font, (xc, yc) => {
			return this.getLed(xc, yc);
		});

		return this.insert(text, x, y);
	}

	/**
	 * Insert a matrix to the led board
	 * @param {Object} LedMatrix - matrix to render on the led board
	 * @param {Integer} x - starting x coordinate to render from
	 * @param {Integer} y - starting y coordinate to render from
	 */
	insert(matrix, x = 0, y = 0) {
		return this.matrix.join(matrix, x, y);
	}
}

function ledCanvasFactory(el, options, LedClass, font) {
	return new LedCanvas(el, options, LedClass, font);
}

module.exports = ledCanvasFactory;
