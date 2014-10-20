var getBounds = require('./getBounds');
var sortLeds = require('./sortLeds');
var objectAssign = require('object-assign');

class Matrix {
	constructor(x = 0, y = 0, width = 1, height = 1, leds = []) {
		this.leds = leds;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	get(x, y) {
		return new Matrix(x, y, 1, 1, [this.leds[Math.min(x, this.width) + Math.min(y, this.height) * this.width]]);
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

	set(state) {
		this.leds.forEach(function(led){
			led.enabled = state;
		});

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
