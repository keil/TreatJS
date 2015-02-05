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

// runs a testcase
function run(file) {
  print("\n\n\n##########\n# " + file + "\n");
  load(file);
}

// contracts
run("test/contract/basecontract.js");
run("test/contract/functioncontract.js");
run("test/contract/methodcontract.js");
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

// miscellaneous tests
run("test/miscellaneous/logic.js");
run("test/miscellaneous/debugger.js");
run("test/miscellaneous/decompile.js");

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
run("test/blame/base.js");
run("test/blame/immediate.js");
run("test/blame/delayed.js");

run("test/blame/function.js");
run("test/blame/dependent.js");
run("test/blame/object.js");
run("test/blame/object2.js");
run("test/blame/method.js");

run("test/blame/intersection.js");
run("test/blame/union.js");
//run("test/blame/negation.js"); // TODO

run("test/blame/or.js");
run("test/blame/and.js");
// run("test/blame/not.js"); // TODO

// canonicalize
load("test/canonicalize/canonicalize.js");

// reflection
run("test/reflect/get.js");
run("test/reflect/set.js");

// callback
//run("test/callback/lax.js");
//run("test/callback/picky.js");
//run("test/callback/indy.js");

TreatJS.Version.print();
TreatJS.Statistic.print();

quit();
