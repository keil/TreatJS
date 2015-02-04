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

function f(a) { return a+1; }
function ff(a) { return "1"+a; }

//var gf = Contract.assert(4, Contract.Intersection(IsNumber, Contract.AFunction([IsNumber], IsNumber)));

//var g = Contract.assert(f, Contract.Intersection(IsNumber, Contract.AFunction([IsNumber], IsNumber)));

var g = Contract.assert(f, Contract.Intersection(IsFunction, Contract.AFunction([IsNumber], IsNumber)));
g(1);
g("a");

var gg = Contract.assert(ff, Contract.Intersection(IsFunction, Contract.AFunction([IsNumber], IsNumber)));
//gg(1);
gg("a");
