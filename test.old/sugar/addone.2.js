/*
 * Example 2
 * =========
 */

/*
 * Normal Code (with contarcts)
 * ----------------------------
 */
var addOne_2_normal = (function () {

  var plus = Contract.assert(function (x, y) {
    return x + y;
  }, Contract.Intersection(
    Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber),
    Contract.AFunction([typeOfString, typeOfString], typeOfString)
    ));

  var addOne = function (x) {
    return plus (x, 1);
  }

  return addOne;

})();

/*
 * Baseline Simplification 
 * -----------------------
 */
var addOne_2_baseline = (function () {

  var global = new TreatJS.Global({});
  var left, right;
  with(TreatJS.Callback) {
    var root = Root(function(){}, null);
    var intersection = Intersection(root.rootHandler);
    _left = Function(intersection.leftHandler);
    _right = Function(intersection.rightHandler);
  }

  var plus = function (x, y) {
    return x + y;
  }

  var addOne = Contract.assertWith(Contract.assertWith(function (x) {
    return plus (Contract.assertWith(Contract.assertWith(x, typeOfString, global, _right.domainHandler), typeOfNumber, global, _left.domainHandler), 1);
  }, Contract.AFunction([], typeOfNumber), global, _left.rangeHandler), Contract.AFunction([], typeOfString), global, _right.rangeHandler);

  return addOne;

})();

/*
 * Subset Simplification 
 * ---------------------
 */
var addOne_2_subset = (function () {

  var global = new TreatJS.Global({});
  var _intersection;
  with(TreatJS.Callback) {
    var root = Root(function(){}, null);
    _intersection = Intersection(root.rootHandler);
  }

  var plus = function (x, y) {
    return x + y;
  }

  var addOne = Contract.assertWith(Contract.assertWith(function (x) {
    return plus (x, 1);
  }, Contract.AFunction([], False), global, _intersection.rightHandler), Contract.AFunction([typeOfNumber], typeOfNumber), global, _intersection.leftHandler);

  return addOne;

})();
