function populate(x, y, dim, Led) {
	let length = x * y;
	let leds = [];

	for (let i = 0; i < length; i++) {
		let yc = Math.floor(i / x);
		let xc = i - (x * yc);
		leds.push(new Led(xc, yc, dim));
	}

	return leds;
}

module.exports = populate;
