class Matrix {
	constructor(x = 0, y = 0, leds = []) {
		this.leds = leds;
		this.x = x;
		this.y = y;
	}

	get(x, y) {
		return new Matrix(1, 1, [this.leds[Math.min(x, this.x) + Math.min(y, this.y) * this.x]]);
	}

	prop(key, value) {
		let leds = this.leds.filter(function(led){
			return led[key] == value;
		});

		let xBuffer = leds.map(function (led) { return led.x; });
		let yBuffer = leds.map(function (led) { return led.y; });

		let x = Math.max.apply(Math, xBuffer) - Math.min.apply(Math, xBuffer);
		let y = Math.max.apply(Math, yBuffer) - Math.min.apply(Math, yBuffer);

		return new Matrix(x, y, leds);
	}

	row(y) {
		return new Matrix(this.x, 1, this.leds.filter(function(led){
			return led.y == y;
		}));
	}

	column(x) {
		return new Matrix(1, this.y, this.leds.filter(function(led){
			return led.x == x;
		}));
	}

	rect(x, y, xc = 1, yc = 1) {
		let xmax = x + xc;
		let ymax = y + yc;

		return new Matrix(xc, yc, this.leds.filter(function(led){
			return led.x >= x && led.x < xmax && led.y >= y && led.y < ymax;
		}));
	}

	all() {
		return this;
	}

	set(state) {
		return this.all().leds.forEach(function(led){
			led.enabled = state;
		});
	}

	toggle() {
		return this.all().leds.forEach(function(led){
			led.enabled = ! led.enabled;
		});
	}

	render(...args) {
		this.leds.forEach(function(led){
			led.render(...args);
		});
	}

	add(matrix) {
		this.leds = this.leds.concat(matrix.leds);
	}
}

module.exports = Matrix;
