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
 * Contract API requires a lot of effort and is hard to read.
 */
(function () {

  function plus (x, y) {
    return x + y;
  }

  function addOne (x) {
    var plusNumber = Contract.assert(plus, Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber));
    return plusString (x, 1);
  }

  function appendOne (x) {
    var plusString = Contract.assert(plus, Contract.AFunction([typeOfString, typeOfString], typeOfString));\
  return plusString (x, "1");
  }

})();

/*
 * TreatJS Contracted Counterpart
 * Contract API requires a lot of effort and is hard to read.
 */
(function () {

  function _plus (x, y) {
    return x + y;
  }

  var plus = Contract.assert(plus, Contract.Intersection(
      Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber),
      Contract.AFunction([typeOfString, typeOfString], typeOfString))
    );

  function addOne (x) {
    return plus (x, 1);
  }

  function appendOne (x) {
    return plus (x, "1");
  }

})();

/*
 * Goal
 * Shorter contract annotations are easier to read.
 * Example is backward compatible.
 */
(function () {

  /* @ ([typeNumber, typeNumber] -> typeNumber) + ([typeString, typeString] -> typeString) */
  function plus (x, y) {
    return x + y;
  }

  /* @ [typeNumber] -> typeNumber */
  function addOne (x) {
    return plus (x, 1);
  }

  /* @ [typeString] -> typeString */
  function appendOne (x) {
    return plus (x, "1");
  }

})();

/*
 * Goal
 * A Macro system can be used to establish a new syntax that allows 
 * to have build-in contract definitions
 */
(function () {

  define "typeNumber" as (arg => (typeof arg) === 'number');
  define "typeString" as (arg => (typeof arg) === 'string');
  define("StringToString", [typeString] -> typeString);

  function plus (x, y) {
    return x + y;
  } @ ([typeNumber, typeNumber] -> typeNumber) + ([typeString, typeString] -> typeString);

  function addOne (x) {
    return plus (x, 1);
  }  @ [typeNumber] -> typeNumber;

  var addOne2 = addOne @ ([typeNumber, typeNumber] -> typeNumber) + ([typeString, typeString] -> typeString);

  function appendOne (x) {
    return plus (x, "1");
  } @ StringToString;

});
