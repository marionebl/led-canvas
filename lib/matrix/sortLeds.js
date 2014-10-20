function sortLeds(a, b) {
	let offset = a.y - b.y;
	return (offset !== 0) ? offset : a.x - b.x;
}

module.exports = sortLeds;
