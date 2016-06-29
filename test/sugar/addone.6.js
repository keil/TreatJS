/*
 * Example 6
 * =========
 */

/*
 * Normal Code (with contarcts)
 * ----------------------------
 */
var addOne_6_normal = (function () {

  var plus = Contract.assert(function (x, y) {
    return x + y;
  }, 
  Contract.Intersection(
          Contract.Intersection(
                  Contract.Intersection(
                          Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber),
                          Contract.AFunction([typeOfString, typeOfString], typeOfString)
                          ),
                  Contract.Intersection(
                          Contract.AFunction([Positive, Natural], Positive),
                          Contract.AFunction([Natural, Positive], Positive)
                          )
                  ),
          Contract.AFunction([Negative, Negative], Negative)
          )
  );

  var addOne = Contract.assert(function (x) {
    return plus (x, 1);
  }, Contract.AFunction([Natural], Positive));

  return addOne;

})();

/*
 * Baseline Simplification 
 * -----------------------
 */
var addOne_6_baseline = (function () {

  var global = new TreatJS.Global({});
  var left, right;
  with(TreatJS.Callback) {
    var root = Root(function(){}, null);
    var intersection = Intersection(root.rootHandler);
    _left = Function(intersection.leftHandler);
    _right = Function(intersection.rightHandler);
  }

  var plus = function (x, y) {
    return x + y;
  }

  var addOne = Contract.assert(
                  Contract.assertWith(
                          Contract.assertWith(
                                  Contract.assertWith(
                                          Contract.assertWith(
                                                  Contract.assertWith(
        
                                  function (x) {
    return plus (
                    Contract.assertWith(
                            Contract.assertWith(
                                    Contract.assertWith(
                                            Contract.assertWith(
                                                    Contract.assertWith(x, typeOfString, global, _right.domainHandler),
                                                    typeOfNumber, global, _left.domainHandler),
                                             Positive, global, _left.domainHandler),
                                     Positive, global, _left.domainHandler)
                             Negative, global, _left.domainHandler)

, 1);
  }, 

  Contract.AFunction([], typeOfNumber), global, _left.rangeHandler), 
  Contract.AFunction([], typeOfString), global, _right.rangeHandler), 

  Contract.AFunction([], Positive), global, _left.rangeHandler), 
  Contract.AFunction([], Positive), global, _left.rangeHandler),
  Contract.AFunction([], Negative), global, _left.rangeHandler),

  Contract.AFunction([], typeOfString), global, _right.rangeHandler),
                  
Contract.AFunction([Natural], Positive));

  return addOne;

})();

/*
 * Subset Simplification 
 * ---------------------
 */
var addOne_6_subset = (function () {

  var global = new TreatJS.Global({});
  var _intersection;
  with(TreatJS.Callback) {
    var root = Root(function(){}, null);
    _intersection = Intersection(root.rootHandler);
  }

  var plus = function (x, y) {
    return x + y;
  }

  var addOne = Contract.assert(Contract.assertWith(function (x) {
    return plus (x, 1);
  }, Contract.AFunction([], False), global, _intersection.rightHandler), Contract.AFunction([Natural], Natural));

  return addOne;

})();

