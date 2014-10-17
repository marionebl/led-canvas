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
var ledCanvas = {
	meta: {
		monospaced: false,
		charWidth: 8,
		lineHeight: 12
	},
	chars: {
		':': {
			data: [
				[0, 4],

				[0, 7]],
			width: 1
		},
		' ': {
			data: [],
			width: 2
		},
		0: {
			data: [
				[1, 1], [2, 1], [3, 1], [4, 1], [5, 1],
				[1, 2],                         [5, 2],
				[1, 3],                         [5, 3],
				[1, 4],                         [5, 4],
				[1, 5],                         [5, 5],
				[1, 6],                         [5, 6],
				[1, 7],                         [5, 7],
				[1, 8],                         [5, 8],
				[1, 9],                         [5, 9],
				[1, 10],                       [5, 10],
				[1,11], [2,11],[3,11],[4, 11], [5, 11],
			],
			width: 7
		},
		1: {
			data: [
				[1, 1],
				[1, 2],
				[1, 3],
				[1, 4],
				[1, 5],
				[1, 6],
				[1, 7],
				[1, 8],
				[1, 9],
				[1, 10],
				[1, 11]
			],
			width: 3
		},
		2: {
			data: [
				[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
				                                        [6, 2],
				                                        [6, 3],
				                                        [6, 4],
				                                        [6, 5],
				[1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6],
				[1, 7],
				[1, 8],
				[1, 9],
				[1, 10],
				[1,11],[2, 11],[3, 11],[4, 11],[5, 11],[6, 11]
			],
			width: 8
		},
		3: {
			data: [
				[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
				                                        [6, 2],
				                                        [6, 3],
				                                        [6, 4],
				                                        [6, 5],
				[1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6],
				                                        [6, 7],
				                                        [6, 8],
				                                        [6, 9],
				                                        [6, 10],
				[1,11],[2, 11],[3, 11],[4, 11],[5, 11],[6, 11]
			],
			width: 8
		},
		4: {
			data: [
				[1, 1],                                 [6, 1],
				[1, 2],                                 [6, 2],
				[1, 3],                                 [6, 3],
				[1, 4],                                 [6, 4],
				[1, 5],                                 [6, 5],
				[1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6],
				                                        [6, 7],
				                                        [6, 8],
				                                        [6, 9],
				                                       [6, 10],
				                                       [6, 11],
			],
			width: 8
		},
		5: {
			data: [
				[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
				[1, 2],
				[1, 3],
				[1, 4],
				[1, 5],
				[1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6],
				                                        [6, 7],
				                                        [6, 8],
				                                        [6, 9],
				                                        [6, 10],
				[1,11],[2, 11],[3, 11],[4, 11],[5, 11], [6, 11]
			],
			width: 8
		},
		6: {
			data: [
				[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
				[1, 2],
				[1, 3],
				[1, 4],
				[1, 5],
				[1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6],
				[1, 7],                                  [6, 7],
				[1, 8],                                  [6, 8],
				[1, 9],                                  [6, 9],
				[1, 10],                                 [6, 10],
				[1,11],[2, 11],[3, 11],[4, 11],[5, 11], [6, 11]
			],
			width: 8
		},
		7: {
			data: [
				[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
				                                        [6, 2],
				                                        [6, 3],
				                                        [6, 4],
				                                        [6, 5],
				                                        [6, 6],
				                                        [6, 7],
				                                        [6, 8],
				                                        [6, 9],
				                                        [6, 10],
				                                        [6, 11]
			],
			width: 8
		},
		8: {
			data: [
				[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
				[1, 2],                                 [6, 2],
				[1, 3],                                 [6, 3],
				[1, 4],                                 [6, 4],
				[1, 5],                                 [6, 5],
				[1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6],
				[1, 7],                                 [6, 7],
				[1, 8],                                 [6, 8],
				[1, 9],                                 [6, 9],
				[1, 10],                                [6, 10],
				[1,11],[2, 11],[3, 11],[4, 11],[5, 11], [6, 11]
			],
			width: 8
		},
		9: {
			data: [
				[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
				[1, 2],                                 [6, 2],
				[1, 3],                                 [6, 3],
				[1, 4],                                 [6, 4],
				[1, 5],                                 [6, 5],
				[1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6],
				                                        [6, 7],
				                                        [6, 8],
				                                        [6, 9],
				                                        [6, 10],
				                                        [6, 11]
			],
			width: 8
		}
	}
};

module.exports = ledCanvas;


},{}],5:[function(require,module,exports){
var _slice = Array.prototype.slice;
var objectAssign = require('object-assign');

var Matrix = require('./matrix');
var Led = require('./led');
var LedCanvasFont = require('./font/default');

var loop = require('./animation/loop');
var defaults = require('./defaults');

var LedCanvas = function() {
    var LedCanvas = function LedCanvas(el, options, LedClass, font) {
        if (font === undefined)
            font = LedCanvasFont;

        if (LedClass === undefined)
            LedClass = Led;

        if (options === undefined)
            options = {};

        this.font = font;
        this.options = objectAssign({}, defaults, options);

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
                    y = 0;

                if (x === undefined)
                    x = 0;

                if (size === undefined)
                    size = 1;

                if (typeof str === 'undefined') return;

                if (typeof str !== 'string') {
                    str = str.toString();
                }

                str.split('').forEach(function(char) {
                    var _sign = _this.font.chars[char];
                    if (! _sign) return;

                    if (_this.cursor.x + _sign.width > _this.matrix.x) {
                        _this.cursor = { x: 0, y: _this.cursor.y + _this.font.meta.lineHeight };
                    }

                    _sign.data.forEach(function(blob) {
                        _this.set(blob[0] + _this.cursor.x, blob[1] + _this.cursor.y);
                    });
                    _this.cursor.x += _this.font.meta.monospaced ? _this.font.meta.charWidth : _sign.width;
                });
            }
        }
    });

    return LedCanvas;
}();

window.LedCanvas = LedCanvas;
module.exports = LedCanvas;


},{"./animation/loop":2,"./defaults":3,"./font/default":4,"./led":6,"./matrix":8,"object-assign":10}],6:[function(require,module,exports){
var arc = Math.PI * 2;

var Led = function() {
    var Led = function Led(x, y, size, enabled) {
        if (enabled === undefined)
            enabled = false;

        this.x = x;
        this.y = y;
        this.size = size;
        this.enabled = enabled;
    };

    Object.defineProperties(Led.prototype, {
        toggle: {
            writable: true,

            value: function(flag) {
                if (typeof flag === 'boolean') {
                    this.enabled = flag;
                } else {
                    this.enabled = ! this.enabled;
                }

                return this;
            }
        },

        enabled: {
            set: function(state) {
                this.prev = this.enabled;
                this.on = state;
                return this;
            },

            get: function() {
                return this.on;
            }
        },

        render: {
            writable: true,

            value: function(context) {
                if (this.enabled === this.prev) return;
                this.prev = this.enabled;

                context.save();

                var _x = this.x*this.size;
                var _y = this.y*this.size;
                var _radius = this.size/2;
                var _inner = _radius - this.size/7.5;

                if (typeof this.prev !== 'undefined') {
                    context.clearRect(_x, _y, this.size, this.size);
                }

                context.beginPath();
                context.arc(_x + _radius, _y + _radius, _inner, 0, arc);
                context.fillStyle = this.enabled ? 'rgba(255,255,255,1)':'rgba(255,255,255,.1)';

                if (this.enabled) {
                    context.shadowColor = 'rgba(255,255,255,1)';
                    context.shadowBlur = _radius - _inner;
                }

                context.fill();
                context.restore();
            }
        }
    });

    return Led;
}();

module.exports = Led;


},{}],7:[function(require,module,exports){
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


},{}],8:[function(require,module,exports){
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

        all: {
            writable: true,

            value: function() {
                return this.leds;
            }
        }
    });

    return Matrix;
}();

module.exports = Matrix;


},{"./calculateBounds":7,"./populate":9,"object-assign":10}],9:[function(require,module,exports){
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


},{}],10:[function(require,module,exports){
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

},{}]},{},[5]);
