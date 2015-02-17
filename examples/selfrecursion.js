/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014-2015, Proglang, University of Freiburg.
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

  function add1(x) {
    return x+1;
  }

  var add1Num = Contract.assert(add1, Contract.AFunction([typeOfNumber], typeOfNumber));
  print(add1Num(1));
  //print(add1Num("1"));

})();

(function() {

  function add1rec(x) {
    return (x==0) ? (add1rec(x-1))+1 : "0";
  }

  var add1Num = Contract.assert(add1rec, Contract.AFunction([typeOfNumber], typeOfNumber));
  //print(add1Num(1));
  //print(add1Num("1"));

})();

(function() {

  var add1Num = function (x) {
    return (x==0) ? (add1Num("a"+(x-1)))+1 : 0;
  }

  var add1Num = Contract.assert(add1Num, Contract.AFunction([typeOfNumber], typeOfNumber));
  print(add1Num(1));
  //print(add1Num("1"));

})();

(function() {

  var add1Num = Contract.assert(function (x) {
    return (x==0) ? (add1Num("a"+(x-1)))+1 : 0;
  }, Contract.AFunction([typeOfNumber], typeOfNumber));
  print(add1Num(1));
  //print(add1Num("1"));

})();
