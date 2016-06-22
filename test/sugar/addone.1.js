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

  var plus = function (x, y) {
    return x + y;
  }

  var addOne = Contract.assert(function (x) {
    return plus (Contract.assert(x, typeOfNumber), 1);
  }, Contract.AFunction([], typeOfNumber));

  return addOne;

})();



/*
 * Subset Simplification 
 * ---------------------
 */
var addOne_1_subset = (function () {

  var plus = function (x, y) {
    return x + y;
  }

  var addOne = Contract.assert(function (x) {
    return plus (x, 1);
  }, Contract.AFunction([typeOfNumber], typeOfNumber));

  return addOne;

})();
