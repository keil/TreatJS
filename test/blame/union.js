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
    if(a==1) return "x";
    if(a==2) return false;
    return (a+b);
  }

  var union1 = Contract.Union(
    Contract.AFunction([IsNumber, IsNumber], IsNumber),
    Contract.AFunction([GreaterThanZero, GreaterThanZero], IsString));

  var addChecked5 = Contract.assert(addUnchecked, union1);
  addChecked5(1);
  //addChecked5(2);
  //addChecked5(-1);

})();
