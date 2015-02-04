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

var obj = {a:4711, b:"4712", c:"true"}

var test = Contract.assert(
    obj,
    Contract.Not(Contract.AObject({a:IsNumber, b:IsString, c:IsBoolean}, false)));

//test.a;
//test.b;
test.c;
//test.a;

var obj = {a:"4711", b:4712, c:"true"}

var test = Contract.assert(
    obj,
    Contract.Not(Contract.AObject({a:IsNumber, b:IsString, c:IsBoolean}, true)));

//test.a;
//test.b;
//test.c;

test.c = 4711;
test.c;
