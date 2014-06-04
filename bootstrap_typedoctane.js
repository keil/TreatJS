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
  load(path + file);
}

var _counter_ = 0;
function _freshID_() {
  _counter_ = (_counter_+1);
  return ("#"+_counter_);
}

quit();
