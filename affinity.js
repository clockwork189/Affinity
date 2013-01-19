var AffineTransformation = (function () {

	function AffineTransformation(from, to) {
		this.from = from;
		this.to = to;
		this.dimensions = 2;
		
		if (this.from.length !== this.to.length) {
			throw 'Both from and to must be of same size';
		}
		
		if (this.from.length === 0) {
			this.buildNoOpMatrix();
			return;
		}
		
		if (this.from.length === 1) {
			this.buildTranslationMatrix();
			return;
		}
		
		if (this.from.length === 2) {
			this.addHelpPoint();
		}
		
		if (this.to.length < (this.dimensions = this.to[0].length)) {
			throw 'Too few points => under-determined system';
		}
		
		this.buildHelpMatrices();
		
		if (!this.gaussJordan(this.m)) {
			this.addHelpPoint();
			this.buildHelpMatrices();
			if (!this.gaussJordan(this.m)) {
				throw "sorry, can't help you";
			}
		}
	}

	AffineTransformation.prototype.gaussJordan = function(m, eps) {
		var c, maxrow, x, y, y2, i, _j, _k, _l, _m, _n, _o, _p, _ref1, _ref2, _ref3, _ref4, _ref5;
		if (eps === null) {
			eps = 1.0 / Math.pow(10, 10);
		}
	
		var ref = [m.length, m[0].length], h = ref[0], w = ref[1];

		for (y = _i = 0; h >= 0 ? _i < h : _i > h; y = 0 <= h ? ++_i : --_i) {
			maxrow = y;

			for (y2 = _j = _ref1 = y + 1; _ref1 <= h ? _j < h : _j > h; y2 = _ref1 <= h ? ++_j : --_j) {
				if (Math.abs(m[y2][y]) > Math.abs(m[maxrow][y])) {
					maxrow = y2;
				}
			}
			_ref2 = [m[maxrow], m[y]], m[y] = _ref2[0], m[maxrow] = _ref2[1];

			if (Math.abs(m[y][y]) <= eps) {
				return false;
			}
			
			for (y2 = _k = _ref3 = y + 1; _ref3 <= h ? _k < h : _k > h; y2 = _ref3 <= h ? ++_k : --_k) {
				c = m[y2][y] / m[y][y];
				for (x = _l = y; y <= w ? _l < w : _l > w; x = y <= w ? ++_l : --_l) {
					m[y2][x] -= m[y][x] * c;
				}
			}
		}

		for (y = _m = _ref4 = h - 1; _ref4 <= 0 ? _m <= 0 : _m >= 0; y = _ref4 <= 0 ? ++_m : --_m) {
			c = m[y][y];
			for (y2 = _n = 0; 0 <= y ? _n < y : _n > y; y2 = 0 <= y ? ++_n : --_n) {
				for (x = _o = _ref5 = w - 1; _ref5 <= y ? _o <= y : _o >= y; x = _ref5 <= y ? ++_o : --_o) {
					m[y2][x] -= m[y][x] * m[y2][y] / c;
				}
			}
	
			m[y][y] /= c;
			
			for (x = _p = h; h <= w ? _p < w : _p > w; x = h <= w ? ++_p : --_p) {
				m[y][x] /= c;
			}
		}
		return true;
	};

	AffineTransformation.prototype.to_string = function() {
		var i, j, res, str, _i, _j, _ref, _ref1;
		res = '';
		for (j = _i = 0, _ref = this.dimensions; 0 <= _ref ? _i < _ref : _i > _ref; j = 0 <= _ref ? ++_i : --_i) {
			str = "x" + j;
			for (i = _j = 0, _ref1 = this.dimensions; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
				str += "x" + i + " * " + this.m[i][j + this.dimensions + 1];
			}
			str += "" + this.m[this.dimensions][j + this.dimensions + 1];
			res += str + "\n";
		}
		return res;
	};

	AffineTransformation.prototype.transformation_matrix = function() {
		var i, j, _i, _j, _ref, _ref1;
		if (this.matrix) {
			return this.matrix;
		}
		this.matrix = [];
		for (j = _i = 0, _ref = this.dimensions; 0 <= _ref ? _i < _ref : _i > _ref; j = 0 <= _ref ? ++_i : --_i) {
			this.matrix[j] = [];
			for (i = _j = 0, _ref1 = this.dimensions; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
				this.matrix[j].push(parseFloat(this.m[i][j + this.dimensions + 1]));
			}
			this.matrix[j].push(parseFloat(this.m[this.dimensions][j + this.dimensions + 1]));
		}
		return this.matrix;
	};

	AffineTransformation.prototype.buildNoOpMatrix = function() {
		return this.matrix = [[1, 0, 0], [0, 1, 0]];
	};

	AffineTransformation.prototype.buildTranslationMatrix = function() {
		return this.matrix = [[1, 0, this.to[0][0] - this.from[0][0]], [0, 1, this.to[0][1] - this.from[0][1]]];
	};

	AffineTransformation.prototype.transformation_matrix_m = function() {
		return $M(this.transformation_matrix());
	};

	AffineTransformation.prototype.inverse_transformation_matrix = function() {
		var arr, el;
		arr = (function() {
		var _i, _len, _ref, _results;
			_ref = this.transformation_matrix_m().elements;
			_results = [];
			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				el = _ref[_i];
				_results.push(el);
			}
			return _results;
		}).call(this);
		arr.push([0, 0, 1]);
		return $M(arr).inverse();
	};

	AffineTransformation.prototype.to_svg_transform = function() {
		var i, j, res, _i, _j, _ref, _ref1;
		res = [];
		for (i = _i = 0, _ref = this.dimensions; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
			for (j = _j = 0, _ref1 = this.dimensions; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
				res.push(this.transformation_matrix()[j][i]);
			}
		}
		return "matrix(" + (res.join(', ')) + ")";
	};

	AffineTransformation.prototype.transform = function(pt) {
		return this._transform_with_matrix(pt, this.transformation_matrix_m());
	};

	AffineTransformation.prototype.inversely_transform = function(pt) {
		return this._transform_with_matrix(pt, this.inverse_transformation_matrix());
	};

	AffineTransformation.prototype._transform_with_matrix = function(pt, matrix) {
		var i, orig, res;
		pt = pt.slice(0, 2);
		pt.push(1);
		orig = $M((function() {
			var _i, _len, _results;
			_results = [];
			for (_i = 0, _len = pt.length; _i < _len; _i++) {
				i = pt[_i];
				_results.push([i]);
			}
			return _results;
		})());
		res = matrix.x(orig);
		return ((function() {
			var _i, _len, _ref, _results;
			_ref = res.elements;
			_results = [];
			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				i = _ref[_i];
				_results.push(i[0]);
			}
			return _results;
		})()).slice(0, 2);
	};

	AffineTransformation.prototype.addHelpPoint = function() {
		var help;
		help = [];
		help[0] = [-1 * (this.from[1][1] - this.from[0][1]) + this.from[0][1], this.from[1][0] - this.from[0][0] + this.from[0][0]];
		help[1] = [-1 * (this.to[1][1] - this.to[0][1]) + this.to[0][1], this.to[1][0] - this.to[0][0] + this.to[0][0]];
		this.from.push(help[0]);
		return this.to.push(help[1]);
	};

	AffineTransformation.prototype.buildHelpMatrices = function() {
		var a, i, j, k, point, qi, qt, _i, _j, _k, _l, _len, _len1, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
		this.c = (function() {
			var _i, _ref, _results;
			_results = [];
			for (i = _i = 0, _ref = this.dimensions; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
				_results.push((function() {
					var _j, _ref1, _results1;
					_results1 = [];
					for (a = _j = 0, _ref1 = this.dimensions; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; a = 0 <= _ref1 ? ++_j : --_j) {
						_results1.push(0.0);
					}
					return _results1;
				}).call(this));
			}
		return _results;
		}).call(this);
		for (j = _i = 0, _ref = this.dimensions; 0 <= _ref ? _i < _ref : _i > _ref; j = 0 <= _ref ? ++_i : --_i) {
			for (k = _j = 0, _ref1 = this.dimensions; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; k = 0 <= _ref1 ? ++_j : --_j) {
				_ref2 = this.from;
				for (i = _k = 0, _len = _ref2.length; _k < _len; i = ++_k) {
					point = _ref2[i];
					qt = point.concat([1]);
					this.c[k][j] += qt[k] * this.to[i][j];
				}
			}
		}
		
		this.q = (function() {
			var _l, _ref3, _results;
			_results = [];
			for (i = _l = 0, _ref3 = this.dimensions; 0 <= _ref3 ? _l <= _ref3 : _l >= _ref3; i = 0 <= _ref3 ? ++_l : --_l) {
				_results.push((function() {
					var _m, _ref4, _results1;
					_results1 = [];
					for (a = _m = 0, _ref4 = this.dimensions; 0 <= _ref4 ? _m <= _ref4 : _m >= _ref4; a = 0 <= _ref4 ? ++_m : --_m) {
						_results1.push(0.0);
					}
					return _results1;
				}).call(this));
			}
			return _results;
		}).call(this);
		
		_ref3 = this.from;
		
		for (_l = 0, _len1 = _ref3.length; _l < _len1; _l++) {
			qi = _ref3[_l];
			qt = qi.concat([1]);
			for (i = _m = 0, _ref4 = this.dimensions; 0 <= _ref4 ? _m <= _ref4 : _m >= _ref4; i = 0 <= _ref4 ? ++_m : --_m) {
				for (j = _n = 0, _ref5 = this.dimensions; 0 <= _ref5 ? _n <= _ref5 : _n >= _ref5; j = 0 <= _ref5 ? ++_n : --_n) {
					this.q[i][j] += qt[i] * qt[j];
				}
			}
		}
		return this.m = (function() {
			var _o, _ref6, _results;
			_results = [];
			for (i = _o = 0, _ref6 = this.dimensions; 0 <= _ref6 ? _o <= _ref6 : _o >= _ref6; i = 0 <= _ref6 ? ++_o : --_o) {
				_results.push(this.q[i].concat(this.c[i]));
			}
			return _results;
		}).call(this);
	};

	return AffineTransformation;

})();

(typeof global !== "undefined" && global !== null ? global : window).AffineTransformation = AffineTransformation;