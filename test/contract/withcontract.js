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

var obj = {x:true};
var obj2 = {x:false};

Predicate = $.BaseContract(function(arg) {
        // print("@@@@@@@@@@@"+arg);
        // print("@@@@@@@@@@@"+obj.x);
        return obj.x;
});

// Base Contracts

//var x = $.assert(4711, Predicate);
var x = $.assert(4711, $.With({obj:obj, print:print}, Predicate));
var x = $.assert(4711, $.With({print:print}, $.With({obj:obj}, Predicate)));
//var x = $.assert(4711, $.With({obj:obj, print:print}, $.With({obj:obj2}, Predicate)));

// Function Contracts

var func        = function(x) {return 4711;}
var func2       = function(x) {return "chacha";}
var func3       = function(x, y) { return (x+y);}

var test = $.assert(
                func,
                $.FunctionContract($.ObjectContract($.StringMap({0:IsNumber})), $.With({obj:obj}, Predicate))
                );

var test2 = $.assert(
                func2,
                $.With({obj:obj},$.FunctionContract(Any, Predicate))
                );

var test3 = $.assert(
                func3,
                $.FunctionContract($.ObjectContract($.StringMap({0:$.With({obj:obj}, Predicate), 1:Any})), Any)
                );

test(4711);
test2("chacha");
test3(4711, 4712);


// Object Contracts

var obj = {
        x:4711,
        y:function(x) {return (x+1);},
        z:"chacha"
};

// Test 3.1
// ObjectContract with nested base-level With

var contract = $.ObjectContract($.StringMap({
        x:$.With({obj:obj},Predicate),
    y:$.FunctionContract($.ObjectContract($.StringMap({0:GreaterThanZero})), $.With({obj:obj},Predicate)),
    z:Any
}));

var test = $.assert(obj, contract);

test["x"];

var f = test["y"];
var v = f(4711);

test["y"] = function(x) {return "chacha";};
var g = test["y"];

// Test 3.2
// ObjectContract with top-level With

var contract = $.With({obj:obj}, $.ObjectContract($.StringMap({
        x:Predicate,
    y:$.FunctionContract($.ObjectContract($.StringMap({0:Predicate})), Predicate),
    z:Any
})));

var test2 = $.assert(obj, contract);

test2["x"];

var f = test2["y"];
var v = f(4711);

test2["y"] = function(x) {return "chacha";};
var g = test2["y"];

// Test 3.3
// ObjectContract with nested With

var contract = $.ObjectContract($.StringMap({
        x:IsNumber,
    y:$.With({obj:obj}, $.FunctionContract($.ObjectContract($.StringMap({0:Predicate})), Any)),
    z:Any
}));

var test3 = $.assert(obj, contract);

test3["x"];

var f = test3["y"];
var v = f(4711);

test["y"] = function(x) {return "chacha";};
var g = test3["y"];
