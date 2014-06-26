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
    print("call");
    //return "1";
    //return 1;
    if(a==1) arguments.callee("a", "a");

//    if(a==1) addChecked(2, 2);
//    if(a==1) addChecked("2", "2");
    return (a+b);
  }

 var intersection = _.Intersection(
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber),
    _.AdvancedFunctionContract([IsString, IsString], IsString));

 var addChecked = _.assert(addUnchecked, intersection);

// addChecked("a","b");
 addChecked(1,1);
 
})();
