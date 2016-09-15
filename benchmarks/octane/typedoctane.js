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

// repalce print
var _print_ = print;
print = function() {}

//  makes TreatJS available under $
//  Note: required to run the testcases
//var _ = TreatJS;
//var $ = _ ;

var _file_ = undefined;
function _load_ (path, file) {
  print("load " + file);
  _file_ = file;
  _counter_ = 0;
  load(path + file);
}

var _counter_ = 0;
function _freshID_() {
  _counter_ = (_counter_+1);
  return ("#"+_counter_);
}

// contarcts

this.Any = Contract.Base(function(arg) {
  return true; 
},"Any");

this.typeUndefined = Contract.Base(function(arg) {
  return ((typeof arg) === "undefined");
},"typeUndefined");

this.typeObject =  Contract.Base(function(arg) {
  return ((typeof arg) === "object");
},"typeObject");

this.typeBoolean = Contract.Base(function(arg) {
  return ((typeof arg) === "boolean");
},"typeBoolean");

this.typeNumber = Contract.Base(function(arg) {
  return ((typeof arg) === "number");
},"typeNumber");

this.typeString = Contract.Base(function(arg) {
  return ((typeof arg) === "string");
},"typeString");

this.typeSymbol = Contract.Base(function(arg) {
  return ((typeof arg) === "symbol");
},"typeSymbol");

this.typeFunction = Contract.Base(function(arg) {
  return ((typeof arg) === "function");
},"typeFunction");
