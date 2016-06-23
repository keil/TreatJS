/*
 * Example 3
 * =========
 */

/*
 * Normal Code (with contarcts)
 * ----------------------------
 */
var addOne_3_normal = (function () {

  var plus = Contract.assert(function (x, y) {
    return x + y;
  }, Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber));

  var addOne =  Contract.assert(function (x) {
    return plus (x, 1);
  }, Contract.AFunction([Natural], Natural));

  return addOne;

})();

/*
 * Baseline Simplification 
 * -----------------------
 */
var addOne_3_baseline = (function () {

  var global = new TreatJS.Global({});
  var _function;
  with(TreatJS.Callback) {
    var root = Root(function(){}, null);
    _function = Function(root.rootHandler);
  }

  var plus = function (x, y) {
    return x + y;
  }

  var addOne = Contract.assert(Contract.assertWith(function (x) {
    return plus (Contract.assertWith(x, typeOfNumber, global, _function.domainHandler), 1);
  }, Contract.AFunction([], typeOfNumber), global, _function.rangeHandler), Contract.AFunction([Natural], Natural));

  return addOne;

})();

/*
 * Subset Simplification 
 * ---------------------
 */
var addOne_3_subset = (function () {

  var plus = function (x, y) {
    return x + y;
  }

  var addOne = Contract.assert(function (x) {
    return plus (x, 1);
  }, Contract.AFunction([Natural], Natural));

  return addOne;

})();
