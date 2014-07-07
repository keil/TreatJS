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
    //return 1;
    if(a==1) arguments.callee("a", "a");

    // if(a==1) addChecked(2, 2);
    // if(a==1) addChecked("2", "2");
    return (a+b);
  }

  var intersection = _.Intersection(
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber),
    _.AdvancedFunctionContract([IsString, IsString], IsString));

  var addChecked = _.assert(addUnchecked, intersection);

  addChecked("a","b");
  addChecked(1,1);

})();

(function() {


  function addUncheckedX(a, b) {
    return (a+b);
  }

  var intersection1 = _.Intersection(
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber),
    _.AdvancedFunctionContract([IsString, IsString], IsString));

  var addChecked1 = _.assert(addUncheckedX, intersection1);

  addChecked1(1,1);
  addChecked1("1","1");

})();

(function() {

   function addUncheckedX(a, b) {
    return "x"+(a+b);
  }

  var intersection2 = _.Or(
      _.And(
        _.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber),
        _.Not(_.AdvancedFunctionContract([IsString, IsString], _.Not(IsString)))
        ),
      _.And(
        _.AdvancedFunctionContract([IsString, IsString], IsString),
        _.Not(_.AdvancedFunctionContract([IsNumber, IsNumber], _.Not(IsNumber)))
        )
      );
  var addChecked2 = _.assert(addUncheckedX, intersection2);

//addChecked2(1,"1");
//addChecked2("1",1);
//addChecked2("1","1");
addChecked2(1,1);

})();
