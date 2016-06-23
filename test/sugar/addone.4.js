/*
 * Example 4
 * =========
 */

/*
 * Normal Code (with contarcts)
 * ----------------------------
 */
var addOne_4_normal = (function () {

  var plus = Contract.assert(function (x, y) {
    return x + y;
  }, Contract.Intersection(
    Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber),
    Contract.AFunction([typeOfString, typeOfString], typeOfString)
    ));

  var addOne = Contract.assert(function (x) {
    return plus (x, 1);
  }, Contract.AFunction([Natural], Natural));

  return addOne;

})();

/*
 * Baseline Simplification 
 * -----------------------
 */
var addOne_4_baseline = (function () {

  var plus = function (x, y) {
    return x + y;
  }

  var addOne = Contract.assert(Contract.assert(Contract.assert(function (x) {
    return plus (Contract.assert(Contract.assert(x, typeOfString), typeOfNumber), 1); // TODO
  }, Contract.AFunction([], typeOfNumber)), Contract.AFunction([], typeOfString)), Contract.AFunction([Natural], Natural)); // TODO

  return addOne;

})();

/*
 * Subset Simplification 
 * ---------------------
 */
var addOne_4_subset = (function () {

  var plus = function (x, y) {
    return x + y;
  }

  var addOne = Contract.assert(Contract.assert(function (x) {
    return plus (x, 1);
  }, Contract.AFunction([], Any)), Contract.AFunction([Natural], Natural));

  return addOne;

})();
