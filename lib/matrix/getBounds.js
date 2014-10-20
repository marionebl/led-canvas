function getBounds(leds) {
	let xBuffer = leds.map(function (led) { return led.x; });
	let yBuffer = leds.map(function (led) { return led.y; });

	let x = Math.min.apply(Math, xBuffer);
	let y = Math.min.apply(Math, yBuffer);

	let width = Math.max.apply(Math, xBuffer) - x + 1;
	let height = Math.max.apply(Math, yBuffer) - y + 1;
	let length = width*height;

	return { x, y, width, height, length };
}

module.exports = getBounds;
