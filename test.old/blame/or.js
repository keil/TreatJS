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

  function addUnchecked(a, b) {
    return /*"1"+*/(a+b);
  }

  var or = Contract.Or(
    Contract.AFunction([IsNumber, IsNumber], IsNumber),
    Contract.AFunction([IsString, IsString], IsString));

  var addChecked = Contract.assert(addUnchecked, or);

  addChecked("a","b");
  addChecked(1,1);

})();

(function() {

  function addUnchecked(a, b) {
    return (a+b);
  }

  var or = Contract.Or(
    Contract.AFunction([IsNumber, IsNumber], IsNumber),
    Contract.AFunction([GreaterThanZero, GreaterThanZero], GreaterThanZero));

  var addChecked = Contract.assert(addUnchecked, or);

  //addChecked("a","b");
  addChecked(1,1);

})();
