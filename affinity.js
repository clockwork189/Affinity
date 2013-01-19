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
			// Co-planar points. We add a help point and try again.
			this.addHelpPoint();
			this.buildHelpMatrices();
			if (!this.gaussJordan(this.m)) {
				// Adding help point doesnt work :(
				throw "sorry, can't help you";
			}
		}
	}

	AffineTransformation.prototype.gaussJordan = function(m) {
		var maxrow;

		var eps = 1.0 / Math.pow(10, 10),
		h = m.length,
		w = m[0].length;

		for (var y = 0 , i = y; h >= 0 ? i < h : i > h; y = 0 <= h ? ++i : --i) {
			maxrow = y;

			for (var y2 = y + 1, j = y2, ref1 =y2; ref1 <= h ? j < h : j > h; y2 = ref1 <= h ? ++j : --j) {
				if (Math.abs(m[y2][y]) > Math.abs(m[maxrow][y])) {
					maxrow = y2;
				}
			}

			var ref2 = [m[maxrow], m[y]];
			m[y] = ref2[0];
			m[maxrow] = ref2[1];

			if (Math.abs(m[y][y]) <= eps) {
				return false;
			}
			
			for (var y2 = y + 1, k = y2, ref3 = y2; ref3 <= h ? k < h : k > h; y2 = ref3 <= h ? ++k : --k) {
				var c = m[y2][y] / m[y][y];
				for (var x = y, l = x; y <= w ? l < w : l > w; x = y <= w ? ++l : --l) {
					m[y2][x] -= m[y][x] * c;
				}
			}
		}

		for (var y = h - 1, q = y, ref4 = y; ref4 <= 0 ? q <= 0 : q >= 0; y = ref4 <= 0 ? ++q : --q) {
			var c = m[y][y];
			for (var y2 = 0, n = y2; y >= 0 ? n < y : n > y; y2 = 0 <= y ? ++n : --n) {
				for (var x = w -1, o = x, ref5 = x; ref5 <= y ? o <= y : o >= y; x = ref5 <= y ? ++o : --o) {
					m[y2][x] -= m[y][x] * m[y2][y] / c;
				}
			}
	
			m[y][y] /= c;
			
			for (var x = h, p = x; h <= w ? p < w : p > w; x = h <= w ? ++p : --p) {
				m[y][x] /= c;
			}
		}
		return true;
	};

	AffineTransformation.prototype.transformation_matrix = function() {
		if (this.matrix) {
			return this.matrix;
		}

		this.matrix = [];
		
		for (var i = 0, j = i, ref = this.dimensions; ref >= 0 ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
			this.matrix[i] = [];
			for (var n = 0, m = n, ref1 = this.dimensions; 0 <= ref1 ? m < ref1 : m > ref1; n = 0 <= ref1 ? ++m : --m) {
				this.matrix[i].push(parseFloat(this.m[n][i + this.dimensions + 1]));
			}
			this.matrix[i].push(parseFloat(this.m[this.dimensions][i + this.dimensions + 1]));
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
		// Using Sylvester.js to Create a Matrix
		return $M(this.transformation_matrix());
	};

	AffineTransformation.prototype.inverseTransformationMatrix = function() {
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

	AffineTransformation.prototype.transform = function(pt) {
		return this.transformWithMatrix(pt, this.transformation_matrix_m());
	};

	// Go from result to parent point
	AffineTransformation.prototype.inverseTransform = function(pt) {
		return this.transformWithMatrix(pt, this.inverseTransformationMatrix());
	};

	AffineTransformation.prototype.transformWithMatrix = function(pt, matrix) {
		var i;
		pt = pt.slice(0, 2);
		pt.push(1);
		var orig = $M((function() {
			var results = [];
			for (var _i = 0, _len = pt.length; _i < _len; _i++) {
				i = pt[_i];
				results.push([i]);
			}
			return results;
		})());
		var res = matrix.x(orig);
		return ((function() {
			var ref = res.elements,
			results = [];
			for (var _i = 0, _len = ref.length; _i < _len; _i++) {
				i = ref[_i];
				results.push(i[0]);
			}
			return results;
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