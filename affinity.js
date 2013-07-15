var numeric = require('./numeric');

function AffineTransformation (kwargs) {
	var self = {};

	kwargs = kwargs || {};
	self.from = kwargs.from || [];
	self.to = kwargs.to || [];

	var A = [];
	var B = [];
	var T = [];
	var offsetA = [];
	var offsetB = [];

	var init = function () {
		var dim = self.from.length ? self.from[0].length : 0;
		A = new Array(dim);
		B = new Array(dim);
		offsetA = self.from.length > 2 ? self.from.pop() : new Array(dim);
		offsetB = self.to.length > 2 ? self.to.pop() : new Array(dim);
		for (var i = 0; i < self.from.length; i++) {
			for (var d = 0; d < dim; d++) {
				A[d] = A[d] || [];
				B[d] = B[d] || [];
				offsetA[d] = offsetA[d] || 0;
				offsetB[d] = offsetB[d] || 0;
				A[d][i] = self.from[i][d] - offsetA[d];
				B[d][i] = self.to[i][d] - offsetB[d];
			}
		}
		T = numeric.inv(A);
		return T;
	};

	self.transform = function (point) {
		var coord = numeric.dot(T, numeric.sub(point, offsetA));
		var result = numeric.add(numeric.dot(B, coord), offsetB);
		return result;
	};

	init();

	return self;
};

(typeof global !== "undefined" && global !== null ? global : window).AffineTransformation = AffineTransformation;
if (exports) exports.AffineTransformation = AffineTransformation;