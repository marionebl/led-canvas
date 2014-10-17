class Led {
	constructor (x, y) {
		this.x = x;
		this.y = y;
	}

	toggle (flag) {
		if (typeof flag === 'boolean') {
			this.enabled = flag;
		} else {
			this.enabled = ! this.enabled;
		}

		return this.enabled;
	}

	set enabled (state) {
		this.on = state;
	}

	get enabled () {
		return this.on;
	}
}

module.exports = Led;
