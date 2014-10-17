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
		this.prev = this.enabled;
		this.on = state;
		return this;
	}

	get enabled () {
		return this.on;
	}

	render (context) {
		if (this.enabled === this.prev) return;
		this.prev = this.enabled;

		context.save();

		let x = this.x*this.size;
		let y = this.y*this.size;
		let radius = this.size/2;
		let inner = radius - this.size/7.5;

		if (typeof this.prev !== 'undefined') {
			context.clearRect(x, y, this.size, this.size);
		}

		context.beginPath();
		context.arc(x + radius, y + radius, inner, 0, arc);
		context.fillStyle = this.enabled ? 'rgba(255,255,255,1)':'rgba(255,255,255,.1)';

		if (this.enabled) {
			context.shadowColor = 'rgba(255,255,255,1)';
			context.shadowBlur = radius - inner;
		}

		context.fill();
		context.restore();
	}
}

module.exports = Led;
