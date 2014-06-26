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
    //return "1";
    return (a+b);
  }

  var addChecked = _.assert(addUnchecked,
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber)
    );

  addChecked(1, 2);
  //addChecked("1", 2);

})();

(function() {

  function addUnchecked(a, b) {
    //return 1;
    return (a+b);
  }

  var addChecked = _.assert(addUnchecked,
    _.AdvancedFunctionContract([IsString, IsString], IsString)
    );

  addChecked("1", "2");
  //addChecked("1", 2);

})();
