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
  var _f1, _f2, _f3, _f4, _f5;
  with(TreatJS.Callback) {
    var root = Root(function(){}, null);
    var intersection = Intersection(root.rootHandler);

    var intersection2 = Intersection(intersection.leftHandler);
    var intersection3 = Intersection(intersection.rightHandler);

    var intersection4 = Intersection(intersection2.leftHandler);

    _f1 = Function(intersection3.leftHandler);
    _f2 = Function(intersection3.rightHandler);
    _f3 = Function(intersection4.leftHandler);
    _f4 = Function(intersection4.rightHandler);
    _f5 = Function(intersection2.rightHandler);
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
                            Contract.assertWith(x, typeOfString, global, _f1.domainHandler),
                            typeOfNumber, global, _f2.domainHandler),
                          Positive, global, _f3.domainHandler),
                        Natural, global, _f4.domainHandler),
                      Negative, global, _f5.domainHandler), 1);
                }, 

                Contract.AFunction([], typeOfNumber), global, _f2.rangeHandler), 
              Contract.AFunction([], typeOfString), global, _f1.rangeHandler), 
            Contract.AFunction([], Positive), global, _f3.rangeHandler), 
    Contract.AFunction([], Positive), global, _f4.rangeHandler),
    Contract.AFunction([], Negative), global, _f5.rangeHandler),
    Contract.AFunction([Natural], Positive));

  return addOne;

})();

/*
 * Subset Simplification 
 * ---------------------
 */
var addOne_6_subset = (function () {

  var global = new TreatJS.Global({});
  var _i2, _i3, _i4;
  with(TreatJS.Callback) {
    var root = Root(function(){}, null);
    var intersection = Intersection(root.rootHandler);

    _i2 = Intersection(intersection.leftHandler);
    _i3 = Intersection(intersection.rightHandler);
    _i4 = Intersection(_i2.leftHandler);
  }

  var plus = function (x, y) {
    return x + y;
  }

  var addOne = Contract.assert(Contract.assertWith(Contract.assertWith(Contract.assertWith(function (x) {
    return plus (x, 1);
  }, Contract.AFunction([], False), global, _i3.rightHandler),
        Contract.AFunction([Negative], Negative), global, _i4.rightHandler)
      , Contract.AFunction([Positive], Positive), global, _i3.leftHandler)
    , Contract.AFunction([Natural], Positive));

  return addOne;

})();
