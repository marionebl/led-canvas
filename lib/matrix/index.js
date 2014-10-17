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

	all() {
		return this.leds;
	}
}

module.exports = Matrix;
