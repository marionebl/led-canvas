var animationFrame = require('./frame');

function loop (board) {
	animationFrame(function(){
		board.render(board.context);
		loop(board);
	});
}

module.exports = loop;
