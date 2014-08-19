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

(function() {

  function even (x) { // @ Num -> Bool

    var oddC = Contract.assert(odd, Contract.AFunction([typeOfNumber], typeOfBoolean));

    if(x==0) return true;
    else return oddC(x-1);
  }

  function odd (x) { // @ Num -> Bool

    var evenC = Contract.assert(even, Contract.AFunction([typeOfNumber], typeOfBoolean));

    if(x==0) return false;
    else return evenC(x-1);
  }

  print(even(10));

})();



(function() {

  var evenC = Contract.assert( function (x) { // @ Num -> Bool
    if(x==0) return true;
    else return oddC(x-1);
  }, Contract.AFunction([typeOfNumber], typeOfBoolean));;

  var oddC = Contract.assert( function (x) { // @ Num -> Bool
    if(x==0) return false;
    else return evenC(x-1);
  }, Contract.AFunction([typeOfNumber], typeOfBoolean));

  print(evenC(10));

})();
