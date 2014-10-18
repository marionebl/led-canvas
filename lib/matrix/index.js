var calculateBounds = require('./calculateBounds'),
		populate = require('./populate'),
		objectAssign = require('object-assign');

class Matrix {
	constructor(width, height, options, Led) {
		objectAssign(this, calculateBounds(width, height, options));
		this.leds = populate(this.x, this.y, this.dim, Led);
	}

	update(width, height, options) {
		objectAssign(this, calculateBounds(width, height, options));
	}

	get(x, y) {
		return this.leds[Math.min(x, this.x) + Math.min(y, this.y) * this.x];
	}

	row(y) {
		return this.leds.filter(function(led){
			return led.y == y;
		});
	}

	column(x) {
		return this.leds.filter(function(led){
			return led.x == x;
		});
	}

	rect(x, y, xc = 1, yc = 1) {
		let xmax = x + xc;
		let ymax = y + yc;

		return this.leds.filter(function(led){
			return led.x >= x && led.x <= xmax && led.y >= y && led.y <= ymax;
		});
	}

	all() {
		return this.leds;
	}

	prop(key, value) {
		return this.leds.filter(function(led){
			return led[key] == value;
		});
	}
}

module.exports = Matrix;
