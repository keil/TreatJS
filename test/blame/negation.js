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

  function addUncheckedX(a, b) {
    //return 8;
    //return "a";
    return /*"x"+*/(a+b);
  }

  var negation = _.Negation(_.AdvancedFunctionContract([IsNumber, IsNumber], _.Negation(IsNumber)));
  var addChecked2 = _.assert(addUncheckedX, negation);

  addChecked2("1","1");
  //addChecked2("1",1);
  addChecked2(1,1);

})();

(function() {


  function NotNumToNum(x) {
    return 3;
  }
  var negation1 = _.Negation(_.AdvancedFunctionContract([IsNumber], IsNumber));
  var NotNumToNumC = _.assert(NotNumToNum, negation1);
  //NotNumToNumC(1);

  function NotNotNumToNum(x) {
    return 3;
  }
  var negation2 = _.Negation(_.Negation(_.AdvancedFunctionContract([IsNumber], IsNumber)));
  var NotNotNumToNumC = _.assert(NotNotNumToNum, negation2);
 // NotNotNumToNumC("2");

})();
