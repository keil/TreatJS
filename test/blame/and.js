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
    if(a==1) return -1;
    return (a+b);
  }

  var and = _.And(
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber),
    _.AdvancedFunctionContract([GreaterThanZero, GreaterThanZero], GreaterThanZero));

  var addChecked = _.assert(addUnchecked, and);

  //addChecked("a","b");
  addChecked(10,10);
  //addChecked(-1,-11);
  //addChecked(1,1);

})();
