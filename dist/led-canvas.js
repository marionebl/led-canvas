(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var animationFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	function( callback ){
		window.setTimeout(callback, 1000 / 60);
	};

module.exports = animationFrame;


},{}],2:[function(require,module,exports){
var animationFrame = require('./frame');

function loop (board) {
	animationFrame(function(){
		board.render(board.context);
		loop(board);
	});
}

module.exports = loop;


},{"./frame":1}],3:[function(require,module,exports){
var defaults = {
	matrix: {
		width: 100
	}
};

module.exports = defaults;


},{}],4:[function(require,module,exports){
var _slice = Array.prototype.slice;
var objectAssign = require('object-assign');

var calculateBounds = require('./matrix/calculateBounds');
var populate = require('./matrix/populate');

var Matrix = require('./matrix');
var Cursor = require('./text/cursor');

var loop = require('./animation/loop');
var defaults = require('./defaults');

var LedCanvas = function() {
    var LedCanvas = function LedCanvas(el, options, LedClass, font) {
		this.font = font;
		this.options = objectAssign({}, defaults, options || {});
		this.setup(el, LedClass);
	};

    Object.defineProperties(LedCanvas.prototype, {
        setup: {
            writable: true,

            value: function(el, LedClass) {
                el.width = el.clientWidth * window.devicePixelRatio;
                el.height = el.clientHeight * window.devicePixelRatio;
                var _bounds = calculateBounds(el.width, el.height, this.options.matrix);
                var _leds = populate(_bounds.x, _bounds.y, _bounds.dim, LedClass);

                this.context = el.getContext('2d');
                this.matrix = new Matrix(_bounds.x, _bounds.y, _leds);
                this.cursor = new Cursor(1, 0, this.font.meta.lineHeight, _bounds.x, _bounds.y);
            }
        },

        start: {
            writable: true,

            value: function() {
                loop(this);
            }
        },

        get: {
            writable: true,

            value: function() {
                var args = _slice.call(arguments);
                return this.matrix.get.apply(this.matrix, _slice.call(args));
            }
        },

        prop: {
            writable: true,

            value: function() {
                var args = _slice.call(arguments);
                return this.matrix.prop.apply(this.matrix, _slice.call(args));
            }
        },

        row: {
            writable: true,

            value: function(y) {
                return this.matrix.row(y);
            }
        },

        column: {
            writable: true,

            value: function(x) {
                return this.matrix.column(x);
            }
        },

        rect: {
            writable: true,

            value: function() {
                var args = _slice.call(arguments);
                return this.matrix.rect.apply(this.matrix, _slice.call(args));
            }
        },

        render: {
            writable: true,

            value: function() {
                var args = _slice.call(arguments);
                return this.matrix.render.apply(this.matrix, _slice.call(args));
            }
        },

        set: {
            writable: true,

            value: function(x, y, state) {
                if (state === undefined)
                    state = true;

                return this.matrix.get(x, y).set(state);
            }
        },

        toggle: {
            writable: true,

            value: function(x, y, state) {
                return this.matrix.get(x, y).toggle(state);
            }
        },

        write: {
            writable: true,

            value: function(str, x, y) {
                var _this = this;
                var cursor = (x && y) ? new Cursor(x, y) : this.cursor;

                str.split('').forEach(function(character) {
                    if (character === ' ') {
                        cursor.plus(4);
                    }

                    var fontCharacter = _this.font.chars[character];
                    if (! fontCharacter) return;

                    var charWidth = fontCharacter.width || _this.font.meta.charWidth;
                    var charSpacing = _this.font.meta.charSpacing || 1;
                    var pixelOffset = fontCharacter.offset || 0;

                    var matrix = _this.rect(_this.cursor.x, _this.cursor.y, charWidth, _this.font.meta.lineHeight);
                    matrix.set(false);

                    fontCharacter.data.forEach(function(pixel){
                        matrix.index(pixel + pixelOffset).set(true);
                    });

                    cursor.plus(charWidth + charSpacing);
                });
            }
        }
    });

    return LedCanvas;
}();

function ledCanvasFactory(el, options, LedClass, font) {
	return new LedCanvas(el, options, LedClass, font);
}

module.exports = ledCanvasFactory;


},{"./animation/loop":2,"./defaults":3,"./matrix":6,"./matrix/calculateBounds":5,"./matrix/populate":7,"./text/cursor":8,"object-assign":9}],5:[function(require,module,exports){
function calculateBounds (width, height, options) {
	var _fitX = width, _fitY = height, _x = 0, _y = 0, _dim = 0;

	if (options.width) {
		_fitX = width / options.width;
	}

	if (options.height) {
		_fitY = height / options.height;
	}

	_dim = Math.min(_fitX, _fitY);

	if (options.width) {
		_x = options.width + 2;
		_y = Math.floor(height / _dim);
	} else {
		_x = Math.floor(width / _dim);
		_y = options.height + 2;
	}

	return { x: _x, y: _y, dim: _dim };
}

module.exports = calculateBounds;


},{}],6:[function(require,module,exports){
var _slice = Array.prototype.slice;

var Matrix = function() {
    var Matrix = function Matrix(x, y, leds) {
        if (leds === undefined)
            leds = [];

        if (y === undefined)
            y = 0;

        if (x === undefined)
            x = 0;

        this.leds = leds;
        this.x = x;
        this.y = y;
    };

    Object.defineProperties(Matrix.prototype, {
        get: {
            writable: true,

            value: function(x, y) {
                return new Matrix(1, 1, [this.leds[Math.min(x, this.x) + Math.min(y, this.y) * this.x]]);
            }
        },

        index: {
            writable: true,

            value: function(idx) {
                return new Matrix(1, 1, [this.leds[idx]]);
            }
        },

        prop: {
            writable: true,

            value: function(key, value) {
                var _leds = this.leds.filter(function(led){
                    return led[key] == value;
                });

                var _xBuffer = _leds.map(function (led) { return led.x; });
                var _yBuffer = _leds.map(function (led) { return led.y; });

                var _x = Math.max.apply(Math, _xBuffer) - Math.min.apply(Math, _xBuffer);
                var _y = Math.max.apply(Math, _yBuffer) - Math.min.apply(Math, _yBuffer);

                return new Matrix(_x, _y, _leds);
            }
        },

        row: {
            writable: true,

            value: function(y) {
                return new Matrix(this.x, 1, this.leds.filter(function(led){
                    return led.y == y;
                }));
            }
        },

        column: {
            writable: true,

            value: function(x) {
                return new Matrix(1, this.y, this.leds.filter(function(led){
                    return led.x == x;
                }));
            }
        },

        rect: {
            writable: true,

            value: function(x, y, xc, yc) {
                if (yc === undefined)
                    yc = 1;

                if (xc === undefined)
                    xc = 1;

                var _xmax = x + xc;
                var _ymax = y + yc;

                return new Matrix(xc, yc, this.leds.filter(function(_ymax) {
                    return function(_xmax) {
                        return function(led){
                            return led.x >= x && led.x < _xmax && led.y >= y && led.y < _ymax;
                        };
                    };
                }(_ymax)(_xmax)));
            }
        },

        set: {
            writable: true,

            value: function(state) {
                return this.leds.forEach(function(led){
                    led.enabled = state;
                });
            }
        },

        toggle: {
            writable: true,

            value: function() {
                return this.leds.forEach(function(led){
                    led.enabled = ! led.enabled;
                });
            }
        },

        render: {
            writable: true,

            value: function() {
                var args = _slice.call(arguments);
                this.leds.forEach(function(led){
                    led.render.apply(led, _slice.call(args));
                });
            }
        },

        add: {
            writable: true,

            value: function(matrix) {
                this.leds = this.leds.concat(matrix.leds);
            }
        }
    });

    return Matrix;
}();

module.exports = Matrix;


},{}],7:[function(require,module,exports){
function populate (x, y, dim, Led) {
	var _length = x*y;
	var _leds = [];

	for (var _i = 0; _i < _length; _i++) {
		var _yc = Math.floor(_i / x);
		var _xc = _i - (x * _yc);
		_leds.push(new Led(_xc, _yc, dim));
	}

	return _leds;
}

module.exports = populate;


},{}],8:[function(require,module,exports){
var Cursor = function() {
    var Cursor = function Cursor(x, y, height, maxX, maxY) {
		this.x = x;
		this.y = y;

		this.height = height;

		this.max = {
			x: maxX,
			y: maxY
		};
	};

    Object.defineProperties(Cursor.prototype, {
        reset: {
            writable: true,

            value: function() {
                this.x = 1;
                this.y = 0;
            }
        },

        plus: {
            writable: true,

            value: function(x) {
                if (this.x + x <= this.max.x) {
                    this.x += x;
                } else {
                    this.line();
                }
            }
        },

        minus: {
            writable: true,

            value: function(x) {
                if (this.x + x >= 0) {
                    this.x -= x;
                } else {
                    this.line(-1);
                }
            }
        },

        line: {
            writable: true,

            value: function(offset) {
                if (offset === undefined)
                    offset = 1;

                var distance = offset * this.height;
                this.x = 1;

                if (this.y + distance <= this.max.y && this.y + distance >= 0) {
                    this.y += distance;
                } else {
                    this.reset();
                }
            }
        }
    });

    return Cursor;
}();

module.exports = Cursor;


},{}],9:[function(require,module,exports){
'use strict';

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var pendingException;
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = Object.keys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			try {
				to[keys[i]] = from[keys[i]];
			} catch (err) {
				if (pendingException === undefined) {
					pendingException = err;
				}
			}
		}
	}

	if (pendingException) {
		throw pendingException;
	}

	return to;
};

},{}]},{},[4]);
