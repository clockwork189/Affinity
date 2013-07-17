var ok = function (x,m) { if (!x) throw new Error(m); };
var deep = require("deep-equal");

var Projective = require("../projective").Projective;

describe('Definition', function () {

  it('should have Project', function () {
    ok(Projective, "has object");
  });
  it('should instantiate an object', function () {
    var obj2 = new Projective({ from: [[1,2],[2,1]], to: [[2,3],[3,2]] });
    ok(obj2, "has object with from and to");
  });

});

describe('Basic', function() {

  it('should scale the object', function () {
    var obj2 = new Projective({ from: [[1,0],[0,1]], to: [[10,0],[0,10]] });
    ok(obj2, "has object");
    ok(deep(obj2.transform([1,0]), [10,0]), "properly transforms control point [0]");
    ok(deep(obj2.transform([0,1]), [0,10]), "properly transforms control point [1]");
    ok(deep(obj2.transform([0.5,0.5]), [5,5]), "scales to half");
    ok(deep(obj2.transform([0,0]), [0,0]), "off center");
  });

  it('should work with offset', function () {
    var obj2 = new Projective({ from: [[2,1],[1,2],[1,1]], to: [[11,1],[1,11],[1,1]] });
    ok(obj2, "has object");
    ok(deep(obj2.transform([2,1]), [11,1]), "properly transforms control point [0]");
    ok(deep(obj2.transform([1,2]), [1,11]), "properly transforms control point [1]");
    ok(deep(obj2.transform([1.5,1.5]), [6,6]), "scales to half");
    ok(deep(obj2.transform([1,1]), [1,1]), "off center");
  });


  it('should skew the object', function () {
    var obj2 = new Projective({ from: [[0,0],[1,1],[2,0]], to: [[0,0],[2,1],[2,0]] });
    ok(obj2, "has object");
    ok(deep(obj2.transform([0,0]), [0,0]), "properly transforms control point [0]");
    ok(deep(obj2.transform([1,1]), [2,1]), "properly transforms control point [1]");
    ok(deep(obj2.transform([2,0]), [2,0]), "properly transforms control point [2]");
    ok(deep(obj2.transform([0.5,0.5]), [1,0.5]), "properly skews");
  });

  it('should work even if offset', function () {
    var obj2 = new Projective({ from: [[1,1],[2,2],[1,2]], to: [[20,10],[20,20],[10,20]] });
    ok(obj2, "has object");
    ok(deep(obj2.transform([1,1]), [20,10]), "properly transforms control point [0]");
    ok(deep(obj2.transform([2,2]), [20,20]), "properly transforms control point [1]");
    ok(deep(obj2.transform([1,2]), [10,20]), "properly transforms control point [2]");
    ok(deep(obj2.transform([2,1]), [30,10]), "properly offsets");
  });

});

describe('Warp', function() {

  it('should work if perspective transformed', function () {
    var obj2 = new Projective({ from: [[0,0],[0,1],[1,1],[1,0]], to: [[0,0],[1,1],[2,1],[3,0]] });
    ok(obj2, "has object");
    ok(deep(obj2.transform([0.5,0.5]), [1.5,0.75]), "properly transforms (.5, .5)");
    ok(deep(obj2.transform([0.5,0]), [1.5,0]), "properly transforms (.5, 0)");
  });
  it('should work even if offset', function () {
    var obj2 = new Projective({ from: [[1,1],[1,2],[2,2],[2,1]], to: [[1,1],[2,2],[3,2],[4,1]] });
    ok(obj2, "has object");
    ok(deep(obj2.transform([1.5,1.5]), [2.5,1.75]), "properly transforms (.5, .5)");
    ok(deep(obj2.transform([1.5,1]), [2.5,1]), "properly transforms (.5, 0)");
  });

});
