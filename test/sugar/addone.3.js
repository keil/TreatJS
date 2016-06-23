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

  var plus = function (x, y) {
    return x + y;
  }

  var addOne = Contract.assert(Contract.assert(function (x) {
    return plus (Contract.assert(x, typeOfNumber), 1);
  }, Contract.AFunction([], typeOfNumber)), Contract.AFunction([Natural], Natural));

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
