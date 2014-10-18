var objectAssign = require('object-assign');

var calculateBounds = require('./matrix/calculateBounds');
var populate = require('./matrix/populate');

var Matrix = require('./matrix');
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

		this.cursor = { x: 0, y: 0 };
		this.context = el.getContext('2d');
		this.matrix = new Matrix(bounds.x, bounds.y, leds);
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

	all() {
		return this.matrix.all();
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
	 * @param {Integer} [x=0] - starting x coordinate to write from
	 * @param {Integer} [y=0] - starting y coordinate to write from
	 */
	write(str, size=1, x = this.cursor.x, y = this.cursor.y) {
		if (typeof str === 'undefined') return;

		if (typeof str !== 'string') {
			str = str.toString();
		}

		this.cursor = { x, y };
		var charSpacing = this.font.meta.charSpacing || 1;

		str.split('').forEach((char) => {
			if (char === ' ') {
				this.cursor.x += charSpacing*3;
				return;
			}

			let sign = this.font.chars[char];
			if (! sign) return;

			if (this.cursor.x + sign.width + charSpacing*2 >= this.matrix.x) {
				this.cursor = { x: 0, y: this.cursor.y + this.font.meta.lineHeight + charSpacing };
			}

			let offsetX = charSpacing + this.cursor.x;
			let offsetY = charSpacing + this.cursor.y;

			var self = this;

			for (let i = 0; i < sign.data.length; i += 2) {
				self.set(sign.data[i] + offsetX, sign.data[i +1] + offsetY);
			}

			this.cursor.x += this.font.meta.monospaced ? this.font.meta.charWidth + charSpacing : sign.width + charSpacing;
		});
	}
}

function ledCanvasFactory(el, options, LedClass, font) {
	return new LedCanvas(el, options, LedClass, font);
}

module.exports = ledCanvasFactory;
