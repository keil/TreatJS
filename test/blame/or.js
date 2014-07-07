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

  function addUnchecked(a, b) {
    return /*"1"+*/(a+b);
  }

 var or = _.Or(
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber),
    _.AdvancedFunctionContract([IsString, IsString], IsString));

 var addChecked = _.assert(addUnchecked, or);

addChecked("a","b");
addChecked(1,1);
 
})();

(function() {

  function addUnchecked(a, b) {
    return (a+b);
  }

 var or = _.Or(
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber),
    _.AdvancedFunctionContract([GreaterThanZero, GreaterThanZero], GreaterThanZero));

 var addChecked = _.assert(addUnchecked, or);

//addChecked("a","b");
addChecked(1,1);
 
})();
