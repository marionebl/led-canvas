class Cursor{
	constructor(x, y, height, maxX, maxY) {
		this.x = x;
		this.y = y;

		this.height = height;

		this.max = {
			x: maxX,
			y: maxY
		};
	}

	reset() {
		this.x = 1;
		this.y = 0;
	}

	plus(x) {
		if (this.x + x <= this.max.x) {
			this.x += x;
		} else {
			this.line();
		}
	}

	minus(x) {
		if (this.x + x >= 0) {
			this.x -= x;
		} else {
			this.line(-1);
		}
	}

	line(offset = 1) {
		var distance = offset * this.height;
		this.x = 1;

		if (this.y + distance <= this.max.y && this.y + distance >= 0) {
			this.y += distance;
		} else {
			this.reset();
		}
	}
}

module.exports = Cursor;
