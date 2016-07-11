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


/*
 * Normal Code (without contarcts)
 * -------------------------------
 */
var addOne_0_proxy = (function () {

  var plus = new Proxy(function (x, y) {
    return x + y;
  }, {apply:function(target, thisArg, argumentsArg) { return target.apply(thisArg, argumentsArg); }});

  var addOne = new Proxy(function (x) {
    return plus (x, 1);
  }, {apply:function(target, thisArg, argumentsArg) { return target.apply(thisArg, argumentsArg); }});

  return addOne;

})();
