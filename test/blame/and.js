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

(function() {

  function addUnchecked(a, b) {
    return "1"+(a+b);
  }

  var intersection = _.And(
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber),
    _.Not(_.AdvancedFunctionContract([IsString, IsString], _.Not(IsString)))
    );
  var addChecked = _.assert(addUnchecked, intersection);

  //addChecked("1","1");
  //addChecked("1",1);
  //addChecked("1","1");
  //addChecked(1,1);

})();

(function() {

  function addUnchecked(a, b) {
    return "1"+(a+b);
  }

  var intersection = _.And(
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber),
    _.Not(_.AdvancedFunctionContract([IsString, IsString], _.Not(IsString)))
    );
  var addChecked = _.assert(addUnchecked, intersection);

  //addChecked("1","1");
  //addChecked("1",1);
  //addChecked("1","1");
  //addChecked(1,1);

})();


(function() {

  function addUnchecked(a, b) {
    return (a+b);
  }

  var intersection =      _.And(
    _.AdvancedFunctionContract([IsString, IsString], IsString),
    _.Not(_.AdvancedFunctionContract([IsNumber, IsNumber], _.Not(IsNumber)))
    );
  var addChecked = _.assert(addUnchecked, intersection);

  addChecked("1","1");
  //addChecked("1",1);
  //addChecked("1","1");
  //addChecked(1,1);

})();
