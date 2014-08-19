/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */

// function add
function add (x, y) {
  return (x+y);
}



(function() {

  // type of add ?
  // [Number, Number] -> Number INTERSECTION [String, String] -> String
  //
  // lift add:
  // --> [Number, Number] OR [String, String] --> Number AND String

  var addC = Contract.assert(add, Contract.Intersection(
      Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber),
      Contract.AFunction([typeOfString, typeOfString], typeOfString)));

  function f() {
    // add shoudl be of type [Number, Number] -> Number
    return addC(1,1);
  }

  // print(f());

  function g() {
    // add shoudl be of type [String, String] -> String
    return addC("1", "1");
  }

  // print(g());

})();




(function() {

  // type of add ?
  // [Number, Number] -> Number INTERSECTION [String, String] -> String
  //
  // lift add:
  // --> [Number, Number] OR [String, String] --> Number AND String

  var intersection = Contract.Or(
    Contract.And(
      Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber),
      Contract.Not(Contract.AFunction([typeOfString, typeOfString], Contract.Not(typeOfString)))
      ),
    Contract.And(
      Contract.AFunction([typeOfString, typeOfString], typeOfString),
      Contract.Not(Contract.AFunction([typeOfNumber, typeOfNumber], Contract.Not(typeOfNumber)))
      )
    );

  var addC = Contract.assert(add, intersection);

  function f() {
    // add shoudl be of type [Number, Number] -> Number
    return addC(1,1);
  }

  print(f());

  function g() {
    // add shoudl be of type [String, String] -> String
    return addC("1", "1");
  }

  print(g());

})();


