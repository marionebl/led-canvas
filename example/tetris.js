import LedCanvas from '../src'
import LedCanvasFont from 'led-canvas-fonts/enhanced'
import LedCanvasText from 'led-canvas-text'

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

function writeCenter(board, str) {
  const x = Math.round(board.matrix.width / 2)
  const y = Math.round(board.matrix.height / 2)
  const text = new LedCanvasText(str, LedCanvasFont, board.getLed.bind(board))
  const halfWidth = Math.round(text.width / 2)
  const halfHeight = Math.round(text.height / 2)
  board.insert(text, x - halfWidth, y - halfHeight)
  return text
}

function createTetris (board) {
  writeCenter(board, 'Hit [space]')
  board.start()
}

function main () {
  createStyle()
  const board = createBoard()
  const tetris = createTetris(board)
  window.board = board
}

main()
