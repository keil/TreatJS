/*
 * Example 3
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
  }, Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber));

  var addOne =  Contract.assert(function (x) {
    return plus (x, 1);
  }, Contract.AFunction([Positive], Positive));


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

  var addOne = Contract.assert(Contract.assert(function (x) {
    return plus (Contract.assert(x, typeOfNumber), 1);
  }, Contract.AFunction([], typeOfNumber)), Contract.AFunction([Natural], Natural));

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

  var addOne = Contract.assert(function (x) {
    return plus (x, 1);
  }, Contract.AFunction([Natural], Natural));

  return addOne;

})();



/*
 * The Tst Procedure
 * =================
 */

(function test(addOne) {

  var start = Date.now();

  var i = 0;
  while (i < 100000) {
    i = addOne(i);
  }

  var end = Date.now();

  print("Time (ms):", (end-start));
  TreatJS.Statistic.print();

})(addOne3);

