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

var GreaterThanZero = Contract.Base(function(arg) {
  return (arg>0);
},"GreaterThanZero");

var x = Contract.assert(4711, typeOfNumber);
var x = Contract.assert("4711", typeOfString);
var x = Contract.assert(4711, GreaterThanZero);
var x = Contract.assert(true, Any);

var obj = {x:4711};

function predicate(arg) {
  return true;
}

var sec = Contract.assert(obj, Contract.Base(predicate));
