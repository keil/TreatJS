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
    return if(typeof x == "string") ? plus(x, "1") : plus (x, 1);
  }, Contract.Intersection(
          Contract.AFunction([Natural], Natural),
          Contract.AFunction([typeOfString], typeOfString)
          );

  return addOne;

})();

/*
 * Baseline Simplification 
 * -----------------------
 */
var addOne_4_baseline = (function () {

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

  var addOne = Contract.assert(Contract.assertWith(Contract.assertWith(function (x) {
    return if(typeof x == "string") ?
            
            Contract.assertWith(Contract.assertWith(

            plus (Contract.assertWith(Contract.assertWith(x, typeOfString, global, _right.domainHandler), typeOfNumber, global, _left.domainHandler), 1) 
            
            , typeOfString, global, _right.domainHandler), typeOfNumber, global, _left.domainHandler)
            
            :


            plus (Contract.assertWith(Contract.assertWith(x, typeOfString, global, _right.domainHandler), typeOfNumber, global, _left.domainHandler), 1);
   }, Contract.AFunction([], typeOfNumber), global, _left.rangeHandler), Contract.AFunction([], typeOfString), global, _right.rangeHandler), Contract.AFunction([Natural], Natural));

  return addOne;

})();

/*
 * Subset Simplification 
 * ---------------------
 */
var addOne_4_subset = (function () {

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

