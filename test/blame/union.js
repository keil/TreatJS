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
    if(a==1) return "x";
    if(a==2) return false;
    return (a+b);
  }

  var union1 = _.Union(
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber),
    _.AdvancedFunctionContract([GreaterThanZero, GreaterThanZero], IsString));

  var addChecked5 = _.assert(addUnchecked, union1);
  addChecked5(1);
  //addChecked5(2);
  //addChecked5(-1);

})();
