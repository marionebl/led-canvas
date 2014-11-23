var animationFrame = require('./frame');

function loop(board) {
	animationFrame(function(stamp) {
		board.render(board.context, stamp);
		loop(board);
	});
}

module.exports = loop;
