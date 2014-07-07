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

function f(a) { return a+1; }
function ff(a) { return "1"+a; }

//var gf = _.assert(4, _.Intersection(IsNumber, _.AdvancedFunctionContract([IsNumber], IsNumber)));

//var g = _.assert(f, _.Intersection(IsNumber, _.AdvancedFunctionContract([IsNumber], IsNumber)));

var g = _.assert(f, _.Intersection(IsFunction, _.AdvancedFunctionContract([IsNumber], IsNumber)));
g(1);
g("a");

var gg = _.assert(ff, _.Intersection(IsFunction, _.AdvancedFunctionContract([IsNumber], IsNumber)));
//gg(1);
gg("a");
