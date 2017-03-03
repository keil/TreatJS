/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014-2016, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */

/**
 * Contract Tests
 **/

load("tests/contracts/test.base.js");
load("tests/contracts/test.constructor.js");

load("tests/contracts/test.object.js");
load("tests/contracts/test.function.js");
load("tests/contracts/test.dependent.js");

load("tests/contracts/test.union.js");
load("tests/contracts/test.intersection.js");

/**
 * Convenience Tests
 **/

load("tests/convenience/test.intersection.js");

/**
 * Semantics
 **/

if(TreatJS.getConfiguration().semantics===TreatJS.INDY) {
  load("tests/semantics/test.indy.js");
} else if(TreatJS.getConfiguration().semantics===TreatJS.PICKY) {
  load("tests/semantics/test.picky.js");
} else if(TreatJS.getConfiguration().semantics===TreatJS.LAX) {
  load("tests/semantics/test.lax.js");
}



print("@@@", TreatJS.getConfiguration().semantics);
//if(TreatJS.)


