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

// runs a testcase
function run(file) {
  print("\n\n\n##########\n# " + file + "\n");
  load(file);
}

// contracts
run("test/contract/basecontract.js");
run("test/contract/functioncontract.js");
run("test/contract/objectcontract.js");

run("test/contract/andcontract.js");
run("test/contract/orcontract.js");
run("test/contract/notcontract.js");

run("test/contract/withcontract.js");
run("test/contract/dependentcontract.js");
run("test/contract/constructor.js");

// sandbox tests
run("test/sandbox/sandbox.js");
run("test/sandbox/bind.js");

// callback tests
run("test/miscellaneous/logic.js");

// behavior
run("test/behavior/negative.js");
run("test/behavior/positive.js");
run("test/behavior/strict.js");
run("test/behavior/weak.js");
run("test/behavior/nesting.js");

// convinience contarcts
run("test/convenience/functioncontract.js");
run("test/convenience/objectcontract.js");
run("test/convenience/dependentcontract.js");
run("test/convenience/methodcontract.js");

// blame
load("test/blame/base.js");
load("test/blame/immediate.js");
load("test/blame/delayed.js");


load("test/blame/function.js");
load("test/blame/dependent.js");
load("test/blame/object.js");
load("test/blame/object2.js");
load("test/blame/method.js");

load("test/blame/intersection.js");
load("test/blame/union.js");
load("test/blame/negation.js");

load("test/blame/or.js");
load("test/blame/and.js");
load("test/blame/not.js");

quit();
