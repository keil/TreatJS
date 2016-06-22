/*
 * Example 4
 * =========
 */



/*
 * Normal Code (without contarcts)
 * -------------------------------
 */
var addOne0 = (function () {

  var plus = function (x, y) {
    return x + y;
  }

  var addOne = function (x) {
    return plus (x, 1);
  }

  return addOne;

})();



/*
 * Normal Code (eith contarcts)
 * ----------------------------
 */
var addOne1 = (function () {

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
var addOne2 = (function () {

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
var addOne3 = (function () {

  var plus = function (x, y) {
    return x + y;
  }

  var addOne = Contract.assert(Contract.assert(function (x) {
    return plus (x, 1);
  }, Contract.AFunction([], Any)), Contract.AFunction([Natural], Natural)); // TODO

  return addOne;

})();



