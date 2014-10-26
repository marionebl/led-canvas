var getBounds = require('./getBounds');
var sortLeds = require('./sortLeds');

class Matrix {
	constructor(x = 0, y = 0, width = 1, height = 1, leds = []){
		if (leds.length === 0) {
			return null;
		}
		this.leds = leds;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	get(x, y) {
		x = (x >= this.width) ? 0 : x;
		y = (y >= this.height) ? 0 : y;
		let led = this.leds[x + y * this.width];
		let leds = led ? [led] : undefined;
		return led ? new Matrix(x, y, 1, 1, leds) : null;
	}

	index(idx) {
		var led = this.leds[idx];
		return new Matrix(led.x, led.y, 1, 1, [led]);
	}

	prop(key, value) {
		let leds = this.leds.filter(function(led){
			return led[key] == value;
		});

		let bounds = getBounds(leds);
		return new Matrix(bounds.x, bounds.y, bounds.width, bounds.height, leds);
	}

	row(y) {
		return new Matrix(this.x, y, this.width, 1, this.leds.filter(function(led){
			return led.y == y;
		}));
	}

	column(x) {
		return new Matrix(x, this.y, 1, this.height, this.leds.filter(function(led){
			return led.x == x;
		}));
	}

	rect(x, y, width = 1, height = 1) {
		let xmax = x + width;
		let ymax = y + height;

		return new Matrix(x, y, width, height, this.leds.filter(function(led){
			return led.x >= x && led.x < xmax && led.y >= y && led.y < ymax;
		}));
	}

	set(key, value) {
		if (typeof key !== 'string') {
			this.leds.forEach(function(led){
				led.enabled = typeof key === 'undefined' ? true : key;
			});
		} else {
			this.leds.forEach(function(led){
				led.set(key, value);
			});
		}
		return this;
	}

	toggle() {
		this.leds.forEach(function(led){
			led.enabled = ! led.enabled;
		});

		return this;
	}

	render(...args) {
		this.leds.forEach(function(led){
			led.render(...args);
		});

		return this;
	}

	add(matrix) {
		let leds = this.leds.concat(matrix.leds).sort(sortLeds);
		let bounds = getBounds(leds);
		return new Matrix(bounds.x, bounds.y, bounds.width, bounds.height, leds);
	}
}

module.exports = Matrix;
