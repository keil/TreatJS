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
load("src/treat.js");
load("test/contracts.js");

function run(file) {
        print("\n\n\n##########\n# " + file + "\n");
        load(file);
}


//  makes TreatJS available under $
var $ = _ ;

run("test/JSContract/basecontracts.js");
run("test/JSContract/functioncontracts.js");
run("test/JSContract/objectcontracts.js");

run("test/JSContract/andcontract.js");
run("test/JSContract/orcontract.js");
run("test/JSContract/notcontract.js");

run("test/JSContract/withcontract.js");
run("test/JSContract/dependentcontracts.js");
run("test/JSContract/constructor.js");

// sandbox tests
run("test/JSContract/sandbox.js");
run("test/JSContract/bind.js");

quit();
