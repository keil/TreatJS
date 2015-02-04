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

// Test Use-Case #1
// Compare function input with function output

function eqLength(preArg) {

  var predicate = function (postArg) {
    return (preArg.length==postArg.length);
  };

  return Contract.Base(predicate);
} 

var contract = Contract.Dependent(Contract.Constructor(eqLength));

var f = function(list) {
  return Array(7);
}
var ff = Contract.assert(f, contract);
ff(Array(7));


// Test Use-Case #2
// check some global state, becore and after the call it should be identical

var globalValue1 = "L";

function eqGlobalValue(preArg) {
  var predicate = function (postArg) {
    return (preArg==postArg);
  };

  return Contract.Base(predicate);
} 

var contract = Contract.Dependent(Contract.Constructor(eqGlobalValue));

var g = function() {
  globalValue1 = true ? globalValue1 : "X";
}

function gg() {
  g();
  return globalValue1;
}

var ggg = Contract.assert(gg, Contract.With({print:print},contract));
ggg(globalValue1);

// 2nd run
//
var globalValue1 = {x:"L"};

function eqGlobalValue2(preArg) {
  globalValue1;
  var predicate = function (postArg) {
    return (preArg==postArg);
  };

  return Contract.Base(predicate);
} 

var contract2 = Contract.Dependent(Contract.Constructor(eqGlobalValue2));

var g2 = function() {
  globalValue1 = true ? globalValue1 : {x:"X"};
}

function gg2() {
  g2();
  return globalValue1;
}

var ggg2 = Contract.assert(gg2, Contract.With({print:print,globalValue1:globalValue1},contract2));
ggg2(globalValue1);

// Test Use-Case #3
// flip state, a call is allowed only once

function callOnce(preArg) {

  var called = false;

  var predicate = function (postArg) {
    print("@@@ " + called);
    if(called) {
      return false;
    } else {
      called = true;
      return true;
    }
  };

  var Any = function() {
    return true;
  }

  return Contract.Function(Contract.Base(predicate), Contract.Base(Any));
  //return Contract.Base(predicate);
} 

var contract = Contract.Dependent(Contract.Constructor(callOnce));

function h() {
}

function hh() {
  return h;
}

var hhh = Contract.assert(hh, Contract.With({print:print},contract));
hhhh = hhh();
hhhh();
//hhhh();

// 2nd run
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

  return Contract.Function(Contract.Not(Contract.Base(predicate)), Contract.Base(Any));
  //return Contract.Base(predicate);
} 

var contract = Contract.Dependent(Contract.Constructor(callOnce));

function h() {
}

function hh() {
  return h;
}

var hhh = Contract.assert(hh, Contract.With({print:print},contract));
hhhh = hhh();
hhhh();
//hhhh();
