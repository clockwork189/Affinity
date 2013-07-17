if (!numeric) var numeric = require('./numeric');

function AffineTransformation (from, to) {
	var self = {};

	self.from = from || [];
	self.to = to || [];

	var A = [];
	var B = [];
	var T = [];
	var offsetA = [];
	var offsetB = [];

	var init = function () {
		offsetA = self.from.length > 2 ? self.from.pop() : new Array(2);
		offsetB = self.to.length > 2 ? self.to.pop() : new Array(2);
		A = [
			[self.from[0][0] - offsetA[0], self.from[1][0] - offsetA[1]],
			[self.from[0][1] - offsetA[1], self.from[1][1] - offsetA[1]],
		];
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