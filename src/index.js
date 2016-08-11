import LedCanvasMatrix from 'led-canvas-matrix'
import LedCanvasText from 'led-canvas-text'
import LedCanvasLed from 'led-canvas-led'
import LedCanvasFont from 'led-canvas-fonts/enhanced'
import NanoEventEmitter from 'nano-event-emitter'
import autobind from 'autobind-decorator'

import loop from './animation/loop'
import defaults from './defaults'

@autobind
class LedCanvas extends NanoEventEmitter {
  static create (...args) {
    return new LedCanvas(...args)
  }

  /**
   * Constructs a new LedCanvas instance
   * @param  {HTMLCanvasElement} [el] - <canvas> element to draw on
   * @param  {Object} [options] - LedCanvas options
   * @param  {Class}  [LedClass] - Led class to use
   * @return {Object} LedCanvas instance
   */
  constructor (el, options = {}, LedClass = LedCanvasLed) {
    super()
    this.options = { ...defaults, ...options }
    this.ledClass = LedClass
    this.setup(el)
  }

  /**
   * Sets up basic dimensions and rendering context
   * @param  {HTMLCanvasElement} [el] - <canvas> element to draw on
   */
  setup (el) {
    if (!el.width) {
      el.width = el.clientWidth * window.devicePixelRatio
    }
    if (!el.height) {
      el.height = el.clientHeight * window.devicePixelRatio
    }

    const space = Math.max(el.width, el.height)
    const dim = space / 100
    const width = this.options.width || Math.round(el.width / dim)
    const height = this.options.height || Math.round(el.height / dim)

    this.context = el.getContext('2d')
    this.matrix = new LedCanvasMatrix(0, 0, width, height, (x, y) => {
      return this.getLed(x, y, dim)
    })
  }

  refresh (el) {
    el.width = null
    el.height = null
    this.setup(el)
  }

  /**
   * Return a new Led
   */
  getLed (x, y, dim) {
    const LedClass = this.ledClass
    return new LedClass(x, y, dim)
  }

  /**
   * Starts a requestAnimationFrame loop
   */
  start () {
    loop(this)
  }

  /**
   * Get a single led at {x, y}
   * @param {Integer} x - x coordinate of the led to retrieve
   * @param {Integer} y - y coordinate of the led to retrieve
   */
  get (...args) {
    return this.matrix.get(...args)
  }

  /**
   * Get all leds with the given property values
   * @param {String} key - Property name
   * @param {mixed} value - Property value to match against
   */
  prop (...args) {
    return this.matrix.prop(...args)
  }

  /**
   * Get all leds on row with index [y]
   * @param {Integer} y - y coordinate of the row to retrieve
   */
  row (y) {
    return this.matrix.row(y)
  }

  /**
   * Get all leds on column with index [x]
   * @param {Integer} x - x coordinate of the column to retrieve
   */
  column (x) {
    return this.matrix.column(x)
  }

  /**
   * Get all leds contained by a rectangle with {x:x, y:y, width:width, height:height}
   * @param {Integer} x - x coordinate of the rectangle's upperleft corner
   * @param {Integer} y - y coordinate of the rectangle's upperleft corner
   * @param {Integer} width - width of the rectangle
   * @param {Integer} height - height of the rectangle
   */
  rect (...args) {
    return this.matrix.rect(...args)
  }

  /**
   * Rerender all changed leds on the board
   * @param {CanvasRenderingContext2D} context - Rendering context drawn on
   * @param {Integer} timestamp - Time delta since the loop has been started
   */
  render (...args) {
    this.emit('before:render', ...args)
    this.matrix.render(...args)
    this.emit('after:render', ...args)
    return this
  }

  /**
   * Set a single led's state
   * @param {Integer} x - x coordinate of the led to manipulate
   * @param {Integer} y - y coordinate of the led to manipulate
   * @param {Boolean} [state=true] - Target state of the led
   */
  set (x, y, state = true) {
    return this.matrix.get(x, y).set(state)
  }

  /**
   * Toggle a single led's state
   * @param {Integer} x - x coordinate of the led to manipulate
   * @param {Integer} y - y coordinate of the led to manipulate
   * @param {Boolean} [state] - Target state of the led
   */
  toggle (x, y, state) {
    return this.matrix.get(x, y).toggle(state)
  }

  /**
   * Move a given matrix by x horizontally and y vertically on the matrix
   * @param {Matrix} matrix - matrix to move on the board
   * @param {Integer} [x=0] - Number of leds to move the matrix on the x-axis by
   * @param {Integer} [y=0] - Number of leds to move the matrix on the y-axis by
   */
  move (matrix, x = 0, y = 0) {
    var enabledLeds = []

    var leds = matrix.leds.map((led) => {
      let nextLed = this.matrix.get(led.x + x, led.y + y)
      if (led.enabled) {
        enabledLeds.push(nextLed)
      }
      return nextLed.leds[0]
    })

    matrix.set(false)

    enabledLeds.forEach(function (led) {
      led.set(true)
    })

    return new LedCanvasMatrix(matrix.x + x, matrix.y + y, matrix.width, matrix.height, leds)
  }

  /**
   * Write a string to the led board
   * @param {String} str - string to write to the led board
   * @param {Integer} x - starting x coordinate to write from
   * @param {Integer} y - starting y coordinate to write from
   * @param {Object} font - LedCanvasFont to use
   */
  write (str, x = 0, y = 0, font = LedCanvasFont) {
    var text = new LedCanvasText(str, font, (xc, yc) => {
      return this.getLed(xc, yc)
    })

    return this.insert(text, x, y)
  }

  /**
   * Insert a matrix to the led board
   * @param {Object} LedMatrix - matrix to render on the led board
   * @param {Integer} x - starting x coordinate to render from
   * @param {Integer} y - starting y coordinate to render from
   */
  insert (matrix, x = 0, y = 0) {
    return this.matrix.join(matrix, x, y)
  }
}

export default LedCanvas
export {LedCanvas as LedCanvas}
