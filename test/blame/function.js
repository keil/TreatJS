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
    return (a+b);
  }

  var addChecked = Contract.assert(addUnchecked,
    Contract.AFunction([IsNumber, IsNumber], IsNumber)
    );

  addChecked(1, 2);
  ///addChecked("1", 2);

})();

(function() {

  function addUnchecked(a, b) {
    //return 1;
    return (a+b);
  }

  var addChecked = Contract.assert(addUnchecked,
    Contract.AFunction([IsString, IsString], IsString)
    );

  addChecked("1", "2");
  //addChecked("1", 2);

})();


(function() {

  function addUnchecked(a, b) {
    return 1+(a+b);
  }
  var addChecked = Contract.assert(addUnchecked, 
    Contract.AFunction([IsNumber, IsNumber], IsNumber));

  addChecked(3,3);
  //addChecked("3","3");

  function NumToNum(x) {
    return 7;
  }

  function NumNumToNum(f) {
    f(1);
    return 7;
  }
  var NumNumToNumC = Contract.assert(NumNumToNum, 
    Contract.AFunction([Contract.AFunction([IsNumber], IsNumber)], IsNumber));

  NumNumToNumC(NumToNum);

  function NumToNumNum(x) {
    return NumToNum;
  }
  var NumToNumNumC = Contract.assert(NumToNumNum, 
      Contract.AFunction([IsNumber], Contract.AFunction([IsNumber], IsNumber)));

  NumToNumNumC(7)(2);
  //NumToNumNumC("1")(2);
  //NumToNumNumC(1)("2");

  function NumToNum1(x) {
    return 7;
  }

  function NumToNum2(x) {
    return 7;
  }

  function NumNumToNumNum(f) {
    f(1);
    return NumToNum2;
  }
  var NumNumToNumNumC = Contract.assert(NumNumToNumNum, 
      Contract.AFunction([Contract.AFunction([IsNumber], IsNumber)], Contract.AFunction([IsNumber], IsNumber)));

  NumNumToNumNumC(NumToNum1)(1);

  function NumToNum3(x) {
    return 7;
  }

  function NumNumToNumNumX(f) {
    return NumToNum3;
  }
  var NumNumToNumNumXC = Contract.assert(NumNumToNumNumX, 
      Contract.AFunction([Contract.AFunction([IsNumber], IsNumber)], Contract.AFunction([IsNumber], IsNumber)));

  NumNumToNumNumXC(NumToNum3)(1);

})();
