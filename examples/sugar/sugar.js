/*
 * Normal Code
 */
(function () {

  function plus (x, y) {
    return x + y;
  }

  function addOne (x) {
    return plus (x, 1);
  }

  function appendOne (x) {
    return plus (x, "1");
  }

})();

/*
 * Contracted Counterpart
 */
(function () {

  function plus (x, y) {
    return x + y;
  }

  function addOne (x) {
    var plusNumber = Contract.assert(plus, Contract.AFunction([typeNumber, typeNumber], typeNumber));
    return plusString (x, 1);
  }

  function appendOne (x) {
        var plusString = Contract.assert(plus, Contract.AFunction([typeString, typeString], typeString));\
    return plusString (x, "1");
  }

})();

/*
 * TreatJS Contracted Counterpart
 * TreatJS allows to combine contract to avoid multiple inheritances 
 * of the same target with different contracts.
 */
(function () {

  function _plus (x, y) {
    return x + y;
  }

  var plus = Contract.assert(plus, Contract.Intersection(
    Contract.AFunction([typeNumber, typeNumber], typeNumber),
    Contract.AFunction([typeString, typeString], typeString))
    );

  function addOne (x) {
    return plus (x, 1);
  }

  function appendOne (x) {
    return plus (x, "1");
  }

})();
