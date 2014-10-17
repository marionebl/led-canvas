function calculateBounds (width, height, options) {
	let fitX = width,
	fitY = height,
	x = 0,
	y = 0,
	dim = 0;

	if (options.width) {
		fitX = width / options.width;
	}

	if (options.height) {
		fitY = height / options.height;
	}

	dim = Math.min(fitX, fitY);

	if (options.width) {
		x = options.width + 2;
		y = Math.floor(height / dim);
	} else {
		x = Math.floor(width / dim);
		y = options.height + 2;
	}

	return { x, y, dim };
}

module.exports = calculateBounds;
