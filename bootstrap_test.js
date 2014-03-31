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

//  makes TreatJS available under $
var $ = _ ;

load("test/JSContract/basecontracts.js");
load("test/JSContract/functioncontracts.js");
load("test/JSContract/objectcontracts.js");

load("test/JSContract/andcontract.js");
load("test/JSContract/orcontract.js");
load("test/JSContract/notcontract.js");

load("test/JSContract/withcontract.js");
load("test/JSContract/dependentcontracts.js");
load("test/JSContract/constructor.js");

// sandbox tests
load("test/JSContract/sandbox.js");
load("test/JSContract/bind.js");

quit();
