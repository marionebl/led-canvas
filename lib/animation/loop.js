var animationFrame = require('./frame');

function loop (board) {
	animationFrame(function(){
		board.context.clearRect(0, 0, board.context.canvas.width, board.context.canvas.height);

		board.matrix.leds.forEach(function(led){
			led.render(board.context);
		});

		loop(board);
	});
}

module.exports = loop;
