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

  var plus = function (x, y) {
    return x + y;
  }

  var addOne = Contract.assert(Contract.assert(function (x) {
    return plus (Contract.assert(Contract.assert(x, typeOfString), typeOfNumber), 1); // TODO
  }, Contract.AFunction([], typeOfNumber)), Contract.AFunction([], typeOfString)); // TODO

  return addOne;

})();

/*
 * Subset Simplification 
 * ---------------------
 */
var addOne_2_subset = (function () {

  var plus = function (x, y) {
    return x + y;
  }

  var addOne = Contract.assert(Contract.assert(function (x) {
    return plus (x, 1);
  }, Contract.AFunction([], Any)), Contract.AFunction([typeOfNumber], typeOfNumber));

  return addOne;

})();
