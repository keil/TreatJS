/*
 * Example 1
 * =========
 */

/*
 * Normal Code (with contarcts)
 * ----------------------------
 */
var addOne_1_normal = (function () {

  var plus = Contract.assert(function (x, y) {
    return x + y;
  }, Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber))

  var addOne = function (x) {
    return plus (x, 1);
  }

  return addOne;

})();

/*
 * Baseline Simplification 
 * -----------------------
 */
var addOne_1_baseline = (function () {

  var global = new TreatJS.Global({});
  var _function;
  with(TreatJS.Callback) {
    var root = Root(function(){}, null);
    _function = Function(root.rootHandler);
  }

  var plus = function (x, y) {
    return x + y;
  }

  var addOne = Contract.assertWith(function (x) {
    return plus (Contract.assertWith(x, typeOfNumber, global, _function.domainHandler), 1);
  }, Contract.AFunction([], typeOfNumber), global, _function.rangeHandler);

  return addOne;

})();

/*
 * Subset Simplification 
 * ---------------------
 */
var addOne_1_subset = (function () {

  var global = new TreatJS.Global({});
  var _root;
  with(TreatJS.Callback) {
    _root = Root(function(){}, null);
  }

  var plus = function (x, y) {
    return x + y;
  }

  var addOne = Contract.assertWith(function (x) {
    return plus (x, 1);
  }, Contract.AFunction([typeOfNumber], typeOfNumber), global, _root.rootHandler);

  return addOne;

})();
