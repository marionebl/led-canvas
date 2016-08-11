import LedCanvas from '../src'

const styleSheet = `
* {
  box-sizing: border-box;
}
html,
body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
body {
  background: black;
}
canvas {
  width: 100%;
  height: 100%;
}
`

function createStyle () {
  const style = document.createElement('style')
  style.appendChild(document.createTextNode(styleSheet))
  document.head.appendChild(style)
}

function createCanvas () {
  const canvas = document.createElement('canvas')
  const width = window.innerWidth * window.devicePixelRatio
  const height = window.innerHeight * window.devicePixelRatio
  canvas.width = width
  canvas.height = height
  return canvas
}

function createBoard () {
  const canvas = createCanvas()
  const board = LedCanvas.create(canvas)

  window.addEventListener('resize', () => {
    board.refresh(canvas)
  })

  document.body.appendChild(canvas)
  return board
}

function frame (board, status) {
  const method = typeof status === 'undefined' ? 'toggle' : 'set'

  board.row(0)[method](status)
  board.row(board.matrix.height - 1)[method](status)
  board.column(0)[method](status)
  board.column(board.matrix.width - 1)[method](status)
}

function main () {
  createStyle()
  const board = createBoard()
  board.start()
  window.board = board

  let count = 0

  setInterval(() => {
    frame(board)
    board.write('Count to ' + String(++count), 2, 1)
  }, 1000)
}

main()
