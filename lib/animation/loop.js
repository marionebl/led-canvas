var animationFrame = require('./frame');

function loop (board) {
	animationFrame(function(){
		board.all().render(board.context);
		loop(board);
	});
}

module.exports = loop;
