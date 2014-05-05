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

function run(file) {
  print("\n\n\n##########\n# " + file + "\n");
  load(file);
}


//  makes TreatJS available under $
//var $ = _ ;

run("test/contract/basecontracts.js");
run("test/contract/functioncontracts.js");
run("test/contract/objectcontracts.js");

run("test/contract/andcontract.js");
run("test/contract/orcontract.js");
run("test/contract/notcontract.js");

run("test/contract/withcontract.js");
run("test/contract/dependentcontracts.js");
run("test/contract/constructor.js");

// sandbox tests
run("test/sandbox/sandbox.js");
run("test/sandbox/bind.js");

run("test/miscellaneous/logic.js");

quit();
