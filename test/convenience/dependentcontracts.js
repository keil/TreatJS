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

// Test Use-Case #1
// Compare function input with function output

(function() {

  function eqLength(preArg) {

    var predicate = function (postArg) {
      return (preArg[0].length==postArg.length);
    };

    return _.BaseContract(predicate);
  } 

  var contract = _.SimpleDependentContract("preArg", eqLength());

  var f = function(list) {
    return Array(7);
  }
  var ff = _.assert(f, contract);
  ff(Array(7));
})();

// Test Use-Case #2
// check some global state, becore and after the call it should be identical
(function() {
  var globalValue1 = "L";

  function eqGlobalValue(preArg) {
    var predicate = function (postArg) {
      return (preArg[0]==postArg);
    };

    return _.BaseContract(predicate);
  } 

  var contract = _.SimpleDependentContract("preArg", eqGlobalValue());

  var g = function() {
    globalValue1 = true ? globalValue1 : "X";
  }

  function gg() {
    g();
    return globalValue1;
  }

  var ggg = _.assert(gg, _.With({print:print},contract));
  ggg(globalValue1);
})();

// 2nd run
(function() {
  var globalValue1 = {x:"L"};

  function eqGlobalValue2(preArg) {
    globalValue1;
    var predicate = function (postArg) {
      return (globalValue1==postArg);
    };

    return _.BaseContract(predicate);
  } 

  var contract2 = _.SimpleDependentContract("preArg", eqGlobalValue2());

  var g2 = function() {
    globalValue1 = true ? globalValue1 : {x:"X"};
  }

  function gg2() {
    g2();
    return globalValue1;
  }

  var ggg2 = _.assert(gg2, _.With({print:print,globalValue1:globalValue1},contract2));
  ggg2(globalValue1);
})();

// Test Use-Case #3
// flip state, a call is allowed only once

(function() {
  function callOnceX(preArg) {

    var called = false;

    /*var predicate = function (postArg) {
      print("@@@ " + called);
      if(called) {
      return false;
      } else {
      called = true;
      return true;
      }
      };*/

    var Any = function() {
      return true;
    }

    return _.FunctionContract(_.BaseContract(Any), _.BaseContract(Any));
    //return _.BaseContract(Any);
  } 

  var contractX = _.SimpleDependentContract("preArg", callOnceX());

  function h() {
  }

  function hh() {
    return h;
  }

  var hhh = _.assert(hh, _.With({print:print},contractX));
  hhhh = hhh();
})();

///hhhh();
//hhhh();

// 2nd run
(function() {
  function callOnce(preArg) {

    var called = false;

    var predicate = function (postArg) {
      if(called) return called;
      else {
        called = true;
        return false;
      }
    };

    var Any = function() {
      return true;
    }

    // using this is not possible becaise the predicate is not defined inside of the sandbox
    //return _.FunctionContract(_.Not(_.BaseContract(predicate)), _.BaseContract(Any));
    //return _.BaseContract(predicate);
    return _.BaseContract(Any);
  } 

  var contract = _.SimpleDependentContract("preArg", callOnce());

  function h() {
  }

  function hh() {
    return h;
  }

  var hhh = _.assert(hh, _.With({print:print}, contract));
  hhhh = hhh();
  hhhh();
  //hhhh();
})();
