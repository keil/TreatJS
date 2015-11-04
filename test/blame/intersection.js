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
    //return "1";
    //return 1;
    if(a==1) arguments.callee("a", "a");

    // if(a==1) addChecked(2, 2);
    // if(a==1) addChecked("2", "2");
    return (a+b);
  }

  var intersection = Contract.Intersection(
    Contract.AFunction([IsNumber, IsNumber], IsNumber),
    Contract.AFunction([IsString, IsString], IsString));

  var addChecked = Contract.assert(addUnchecked, intersection);

  addChecked("a","b");
  addChecked(1,1);

})();

(function() {


  function addUncheckedX(a, b) {
    return (a+b);
  }

  var intersection1 = Contract.Intersection(
    Contract.AFunction([IsNumber, IsNumber], IsNumber),
    Contract.AFunction([IsString, IsString], IsString));

  var addChecked1 = Contract.assert(addUncheckedX, intersection1);

  addChecked1(1,1);
  addChecked1("1","1");

})();

(function() {

  function addUnchecked(a, b) {
    return /*"1"+*/(a+b);
  }

  var intersection = Contract.Or(
    Contract.And(
      Contract.AFunction([IsNumber, IsNumber], IsNumber),
      Contract.Not(Contract.AFunction([IsString, IsString], Contract.Not(IsString)))
      ),
    Contract.And(
      Contract.AFunction([IsString, IsString], IsString),
      Contract.Not(Contract.AFunction([IsNumber, IsNumber], Contract.Not(IsNumber)))
      )
    );
  var addChecked = Contract.assert(addUnchecked, intersection);

  //addChecked(1,"1");
  //addChecked("1",1);

  addChecked("1","1");
  addChecked(1,1);

})();
