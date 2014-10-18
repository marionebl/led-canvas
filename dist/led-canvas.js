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
		//board.context.clearRect(0, 0, board.context.canvas.width, board.context.canvas.height);

		board.matrix.leds.forEach(function(led){
			led.render(board.context);
		});

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
var Matrix = require('./matrix');
var loop = require('./animation/loop');
var defaults = require('./defaults');

var LedCanvas = function() {
    var LedCanvas = function LedCanvas(el, options, LedClass, font) {
		this.font = font;
		this.options = objectAssign({}, defaults, options || {});

		this.cursor = {
			x: 0,
			y: 0
		};

		el.width = el.clientWidth * 2;
		el.height = el.clientHeight * 2;

		this.matrix = new Matrix(el.width, el.height, this.options.matrix, LedClass);
		this.context = el.getContext('2d');

		loop(this);
	};

    Object.defineProperties(LedCanvas.prototype, {
        get: {
            writable: true,

            value: function() {
                var args = _slice.call(arguments);
                return this.matrix.get.apply(this.matrix, _slice.call(args));
            }
        },

        set: {
            writable: true,

            value: function(x, y, state) {
                if (state === undefined)
                    state = true;

                var led = this.get(x, y);
                led.enabled = state;
                return led;
            }
        },

        toggle: {
            writable: true,

            value: function(x, y, state) {
                var led = this.get(x, y);
                led.toggle(state);
                return led;
            }
        },

        invert: {
            writable: true,

            value: function() {
                this.matrix.all().forEach(function(led){
                    led.toggle();
                });
            }
        },

        clear: {
            writable: true,

            value: function() {
                this.cursor = { x : 0, y : 0 };

                this.matrix.all().forEach(function(led){
                    led.enabled = false;
                });
            }
        },

        write: {
            writable: true,

            value: function(str, size, x, y) {
                var _this = this;

                if (y === undefined)
                    y = this.cursor.y;

                if (x === undefined)
                    x = this.cursor.x;

                if (size === undefined)
                    size = 1;

                if (typeof str === 'undefined') return;

                if (typeof str !== 'string') {
                    str = str.toString();
                }

                this.cursor = { x: x, y: y };
                var charSpacing = this.font.meta.charSpacing || 1;

                str.split('').forEach(function(char) {
                    if (char === ' ') {
                        _this.cursor.x += charSpacing*3;
                    }

                    var _sign = _this.font.chars[char];
                    if (! _sign) return;

                    if (_this.cursor.x + _sign.width + charSpacing*2 >= _this.matrix.x) {
                        _this.cursor = { x: 0, y: _this.cursor.y + _this.font.meta.lineHeight + charSpacing };
                    }

                    _sign.data.forEach(function(blob) {
                        _this.set(blob[0] + _this.cursor.x + charSpacing, blob[1] + _this.cursor.y + charSpacing);
                    });

                    _this.cursor.x += _this.font.meta.monospaced ? _this.font.meta.charWidth + charSpacing : _sign.width + charSpacing;
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


},{"./animation/loop":2,"./defaults":3,"./matrix":6,"object-assign":8}],5:[function(require,module,exports){
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
var calculateBounds = require('./calculateBounds'),
		populate = require('./populate'),
		objectAssign = require('object-assign');

var Matrix = function() {
    var Matrix = function Matrix(width, height, options, Led) {
		objectAssign(this, calculateBounds(width, height, options));
		this.leds = populate(this.x, this.y, this.dim, Led);
	};

    Object.defineProperties(Matrix.prototype, {
        update: {
            writable: true,

            value: function(width, height, options) {
                objectAssign(this, calculateBounds(width, height, options));
            }
        },

        get: {
            writable: true,

            value: function(x, y) {
                return this.leds[Math.min(x, this.x) + Math.min(y, this.y) * this.x];
            }
        },

        row: {
            writable: true,

            value: function(y) {
                return this.leds.filter(function(led){
                    return led.y == y;
                });
            }
        },

        column: {
            writable: true,

            value: function(x) {
                return this.leds.filter(function(led){
                    return led.x == x;
                });
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

                return this.leds.filter(function(_ymax) {
                    return function(_xmax) {
                        return function(led){
                            return led.x >= x && led.x <= _xmax && led.y >= y && led.y <= _ymax;
                        };
                    };
                }(_ymax)(_xmax));
            }
        },

        all: {
            writable: true,

            value: function() {
                return this.leds;
            }
        },

        prop: {
            writable: true,

            value: function(key, value) {
                return this.leds.filter(function(led){
                    return led[key] == value;
                });
            }
        }
    });

    return Matrix;
}();

module.exports = Matrix;


},{"./calculateBounds":5,"./populate":7,"object-assign":8}],7:[function(require,module,exports){
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
