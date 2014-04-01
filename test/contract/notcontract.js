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

var test = $.assert("4711", $.Not(IsNumber));

var func        = function(x) {return "4711";}

var test = $.assert(
                func,
                $.Not($.FunctionContract($.ObjectContract({0:IsNumber}), IsNumber)
                     ));
test("4711");


// Test 3.1
// ObjectContract with nested base-level With

var contract = $.Not(
                $.ObjectContract({
                        x:IsNumber,
                        y:$.FunctionContract($.ObjectContract({0:GreaterThanZero}), IsNumber),
                        z:Any
                }));

var obj = {
        x:"4711",
        y:function(x) {return (x+1);},
        z:"chacha"
};

var test = $.assert(obj, contract);

test.x;
test.y("adf");
//test.z;

var test = $.assert(-4711, $.Not($.And(IsNumber, GreaterThanZero)));
var test = $.assert("4711", $.Not($.Or(IsNumber, False)));
var test = $.assert(4711, $.Not($.Not(IsNumber)));
