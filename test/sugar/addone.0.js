/*
 * Example 0 (baseline)
 * ====================
 */


/*
 * Normal Code (without contarcts)
 * -------------------------------
 */
var addOne_0_baseline = (function () {

  var plus = function (x, y) {
    return x + y;
  }

  var addOne = function (x) {
    return plus (x, 1);
  }

  return addOne;

})();
