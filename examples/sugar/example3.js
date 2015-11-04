/**
 *  Optimize Contarct Code
 *  - the contract on addOne is subset of the contract on plus
 *  - move contract to module boundaries, in case that they can be checked statically
 *  (cf. Example 3.4)
 */

/**
 * Example 3.1
 * non-optimized code
 */
var Module = (function() {

  var plus = Contract.assert(function (x, y) {
    return x + y;
  }, Contract.Intersection(
    Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber),
    Contract.AFunction([typeOfString, typeOfString], typeOfString)));

  var addOne = Contract.assert(function (x) {
    return plus (x, 1);
  }, Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber));

  var appenOne = Contract.assert(function (x) {
    return plus (x, "1");
  }, Contract.AFunction([typeOfString, typeOfString], typeOfString));

  return {ddOne:addOne, appendOne:appenOne};

})();

Module.addOne(1);

//TreatJS Statistics ........... .........................................................................................
//... #ASSERT =  ...............        3 ................................................................................
//... #ASSERTWITH =  ...........       16 ................................................................................
//... #BASE =  .................        8 ................................................................................
//... #MEMBRANE =  .............       40 ................................................................................
//... #DECOMPILE =  ............        2 ................................................................................
//... #CALLBACK =  .............       40 ................................................................................    

/**
 * Example 3.2
 * optimized code
 */
var Module = (function() {

  var plus = function (x, y) {
    return x + y;
  }
  
  var addOne = Contract.assert(function (x) {
    return plus (x, 1);
  }, Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber));

  var appenOne = Contract.assert(function (x) {
    return plus (x, "1");
  }, Contract.AFunction([typeOfString, typeOfString], typeOfString));

  /* NOTE:
   * Static optimizer removes contract on plus because it knows that all 
   * arguments are subset or equals to the union of the domain parts and 
   * the return is in the intersection.
   */

  return {addOne:addOne, appendOne:appenOne};

})();

Module.addOne(1);

//TreatJS Statistics ........... .........................................................................................
//... #ASSERT =  ...............        2 ................................................................................
//... #ASSERTWITH =  ...........        5 ................................................................................
//... #BASE =  .................        2 ................................................................................
//... #MEMBRANE =  .............       10 ................................................................................
//... #DECOMPILE =  ............        1 ................................................................................
//... #CALLBACK =  .............        8 ................................................................................

/**
 * Example 3.3
 * optimized code/ 2
 */
var Module = (function() {

  var plus = function (x, y) {
    return x + y;
  }
  
  var addOne = Contract.assert(function (x) {
    return plus (x, 1);
  }, Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber));

  var appenOne = Contract.assert(function (x) {
    return plus (x, "1");
  }, Contract.AFunction([typeOfString, typeOfString], typeOfString));

  /* NOTE:
   * Static optimizer moves contract to the module boundaries.
   */

  return {
    plus:Contract.assert(plus, Contract.Intersection( Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber),
    Contract.AFunction([typeOfString, typeOfString], typeOfString))),
    addOne:Contract.assert(addOne, Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber)),
    appendOne:Contract.assert(appendOne, Contract.AFunction([typeOfString, typeOfString], typeOfString))
  };

})();

Module.addOne(1);

/**
 * Example 3.4
 * non-ptimizable code
 */
var Module = (function() {

  var plus = Contract.assert(function (x, y) {
    return x + y;
  }, Contract.Intersection(
    Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber),
    Contract.AFunction([typeOfString, typeOfString], typeOfString)));

  var addOne = Contract.assert(function (x) {
    return plus (x, 1);
  }, Contract.Intersection(
    Contract.AFunction([typeOfNumber], typeOfNumber),
    Contract.AFunction([typeOfString], typeOfString)));

  /* NOTE:
   * Code cannot be otimized because addOne accepts number and 
   * string values, and thus it may call plus with a woring arument.
   */

  return { plus:plus, addOne:addOne };

})();

Module.addOne(1);
