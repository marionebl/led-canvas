function loop (board) {
  window.requestAnimationFrame(function (stamp) {
    board.render(board.context, stamp)
    loop(board)
  })
}

export default loop
