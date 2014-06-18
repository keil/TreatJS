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
//print = function() {}

load("src/shell.js");
load("test/contracts.js");

//  makes TreatJS available under $
//  Note: required to run the testcases
var $ = _ ;

// set configuration
_.configure({
  assertion:true,
  membrabe:true,
  decompile:true
});

// set verbose
_.verbose({
  assert:false,
  sandbox:false
});

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

var _IsNumber_ = _.BaseContract(function(arg) {
  return ((typeof arg) === "number");
},"IsNumber");

var _IsString_ = _.BaseContract(function(arg) {
  return ((typeof arg) === "string");
},"IsString");

var _IsBoolean_ = _.BaseContract(function(arg) {
  return ((typeof arg) === "boolean");
},"IsBoolean");

var _IsUndef_ = _.BaseContract(function(arg) {
  return ((arg+"") == "undefined");
},"IsUndef");

var _Any_ = _.BaseContract(function(arg) {
  return true; 
},"Any");

var _IsObject_ = _.BaseContract(function(arg) {
  return ((typeof arg) === "object");
},"TypeOfObject");

var _IsFunction_ = _.BaseContract(function(arg) {
  return ((typeof arg) === "function");
},"TypeOfFunction");

// TODO
var _IsArray_ = _.With({Array:Array}, _.BaseContract(function(arg) {
  return (arg instanceof Array);
},"IsArray"));

var _IsArrayT_ = _.BaseContract(function(arg) {
  return true;
},"IsArray");

quit();
