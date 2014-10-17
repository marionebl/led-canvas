var Symbol = require('symbol');
var on = Symbol('on');
var arc = Math.PI * 2;

class Led {
	constructor (x, y, size, enabled = false) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.enabled = enabled;
	}

	toggle (flag) {
		if (typeof flag === 'boolean') {
			this.enabled = flag;
		} else {
			this.enabled = ! this.enabled;
		}

		return this;
	}

	set enabled (state) {
		this[on] = state;
		return this;
	}

	get enabled () {
		return this[on];
	}

	render (context) {
		context.beginPath();
		context.arc(this.x*this.size + this.size/2, this.y*this.size + this.size/2, this.size/2 - this.size/7.5, 0, arc);
		context.fillStyle = this.enabled ? 'rgba(255,255,255,1)':'rgba(255,255,255,.1)';
		context.fill();
	}
}

module.exports = Led;
