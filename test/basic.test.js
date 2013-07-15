var ok = function (x,m) { if (!x) throw new Error(m); };
var deep = require("deep-equal");

var affine = require("../affinity");

describe('Definition', function () {

  it('should have AffineTransformation', function () {
    ok(affine.AffineTransformation, "has object");
  });

  it('should instantiate an object', function () {

    var obj2 = new affine.AffineTransformation({ from: [[1,2],[2,1]], to: [[2,3],[3,2]] });
    ok(obj2, "has object with from and to");

  });
});

describe('Basic', function() {

  it('should scale the object', function () {

    var obj2 = new affine.AffineTransformation({ from: [[1,0],[0,1]], to: [[10,0],[0,10]] });
    ok(obj2, "has object");
    ok(deep(obj2.transform([1,0]), [10,0]), "properly transforms control point [0]");
    ok(deep(obj2.transform([0,1]), [0,10]), "properly transforms control point [1]");
    ok(deep(obj2.transform([0.5,0.5]), [5,5]), "scales to half");
    ok(deep(obj2.transform([0,0]), [0,0]), "off center");

  });

  it('should work with offset', function () {

    var obj2 = new affine.AffineTransformation({ from: [[2,1],[1,2],[1,1]], to: [[11,1],[1,11],[1,1]] });
    ok(obj2, "has object");
    ok(deep(obj2.transform([2,1]), [11,1]), "properly transforms control point [0]");
    ok(deep(obj2.transform([1,2]), [1,11]), "properly transforms control point [1]");
    ok(deep(obj2.transform([1.5,1.5]), [6,6]), "scales to half");
    ok(deep(obj2.transform([1,1]), [1,1]), "off center");

  });


  it('should skew the object', function () {

    var obj2 = new affine.AffineTransformation({ from: [[0,0],[1,1],[2,0]], to: [[0,0],[2,1],[2,0]] });
    ok(obj2, "has object");
    ok(deep(obj2.transform([0,0]), [0,0]), "properly transforms control point [0]");
    ok(deep(obj2.transform([1,1]), [2,1]), "properly transforms control point [1]");
    ok(deep(obj2.transform([2,0]), [2,0]), "properly transforms control point [2]");
    ok(deep(obj2.transform([0.5,0.5]), [1,0.5]), "properly skews");

  });

  it('should work even if offset', function () {

    var obj2 = new affine.AffineTransformation({ from: [[1,1],[2,2],[1,2]], to: [[20,10],[20,20],[10,20]] });
    ok(obj2, "has object");
    ok(deep(obj2.transform([1,1]), [20,10]), "properly transforms control point [0]");
    ok(deep(obj2.transform([2,2]), [20,20]), "properly transforms control point [1]");
    ok(deep(obj2.transform([1,2]), [10,20]), "properly transforms control point [2]");
    ok(deep(obj2.transform([2,1]), [30,10]), "properly offsets");

  });
});

