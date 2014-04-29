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
var $ = _ ;

// verbose/ false
$.Config.Verbose.sandbox = false;
$.Config.Verbose.assert = false;

$.Config.assertion = true;
$.Config.membrane = true;
$.Config.decompile = true;

load("benchmark/octane/run.js")

quit();
