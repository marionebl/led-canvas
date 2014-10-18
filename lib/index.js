var objectAssign = require('object-assign');

var Matrix = require('./matrix');
var Led = require('./led');
var LedCanvasFont = require('./font/enhanced');

var loop = require('./animation/loop');
var defaults = require('./defaults');

class LedCanvas {
	/**
	 * @param  {HTMLCanvasElement} <canvas> element to draw on
	 * @param  {Object} [options={}] - LedCanvas options
	 * @param  {Class}  [Led=LedCanvasLed] - Led class to use
	 * @param  {Object} [font] - Object describing the font to use for LedCanvas::write
	 * @return {Object} LedCanvas instance
	 */
	constructor(el, options = {}, LedClass = Led, font = LedCanvasFont) {
		this.font = font;
		this.options = objectAssign({}, defaults, options);

		this.cursor = {
			x: 0,
			y: 0
		};

		el.width = el.clientWidth * 2;
		el.height = el.clientHeight * 2;

		this.matrix = new Matrix(el.width, el.height, this.options.matrix, LedClass);
		this.context = el.getContext('2d');

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

	/**
	 * Set a single led's state
	 * @param {Integer} x - x coordinate of the led to manipulate
	 * @param {Integer} y - y coordinate of the led to manipulate
	 * @param {Boolean} [state=true] - Target state of the led
	 */
	set(x, y, state = true) {
		var led = this.get(x, y);
		led.enabled = state;
		return led;
	}

	/**
	 * Toggle a single led's state
	 * @param {Integer} x - x coordinate of the led to manipulate
	 * @param {Integer} y - y coordinate of the led to manipulate
	 * @param {Boolean} [state] - Target state of the led
	 */
	toggle(x, y, state) {
		var led = this.get(x, y);
		led.toggle(state);
		return led;
	}

	invert() {
		this.matrix.all().forEach(function(led){
			led.toggle();
		});
	}

	clear() {
		this.cursor = { x : 0, y : 0 };

		this.matrix.all().forEach(function(led){
			led.enabled = false;
		});
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
			}

			let sign = this.font.chars[char];
			if (! sign) return;

			if (this.cursor.x + sign.width + charSpacing*2 >= this.matrix.x) {
				this.cursor = { x: 0, y: this.cursor.y + this.font.meta.lineHeight + charSpacing };
			}

			sign.data.forEach((blob) => {
				this.set(blob[0] + this.cursor.x + charSpacing, blob[1] + this.cursor.y + charSpacing);
			});

			this.cursor.x += this.font.meta.monospaced ? this.font.meta.charWidth + charSpacing : sign.width + charSpacing;
		});
	}
}

window.LedCanvas = LedCanvas;
module.exports = LedCanvas;
