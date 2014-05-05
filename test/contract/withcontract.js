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

Predicate = _.BaseContract(function(arg) {
        // print("@@@@@@@@@@@"+arg);
        // print("@@@@@@@@@@@"+obj.x);
        return obj.x;
});

// Base Contracts

//var x = _.assert(4711, Predicate);
var x = _.assert(4711, _.With({obj:obj, print:print}, Predicate));
var x = _.assert(4711, _.With({print:print}, _.With({obj:obj}, Predicate)));
//var x = _.assert(4711, _.With({obj:obj, print:print}, _.With({obj:obj2}, Predicate)));

// Function Contracts

var func        = function(x) {return 4711;}
var func2       = function(x) {return "chacha";}
var func3       = function(x, y) { return (x+y);}

var test = _.assert(
                func,
                _.FunctionContract(_.ObjectContract(_.StringMap({0:IsNumber})), _.With({obj:obj}, Predicate))
                );

var test2 = _.assert(
                func2,
                _.With({obj:obj},_.FunctionContract(Any, Predicate))
                );

var test3 = _.assert(
                func3,
                _.FunctionContract(_.ObjectContract(_.StringMap({0:_.With({obj:obj}, Predicate), 1:Any})), Any)
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

var contract = _.ObjectContract(_.StringMap({
        x:_.With({obj:obj},Predicate),
    y:_.FunctionContract(_.ObjectContract(_.StringMap({0:GreaterThanZero})), _.With({obj:obj},Predicate)),
    z:Any
}));

var test = _.assert(obj, contract);

test["x"];

var f = test["y"];
var v = f(4711);

test["y"] = function(x) {return "chacha";};
var g = test["y"];

// Test 3.2
// ObjectContract with top-level With

var contract = _.With({obj:obj}, _.ObjectContract(_.StringMap({
        x:Predicate,
    y:_.FunctionContract(_.ObjectContract(_.StringMap({0:Predicate})), Predicate),
    z:Any
})));

var test2 = _.assert(obj, contract);

test2["x"];

var f = test2["y"];
var v = f(4711);

test2["y"] = function(x) {return "chacha";};
var g = test2["y"];

// Test 3.3
// ObjectContract with nested With

var contract = _.ObjectContract(_.StringMap({
        x:IsNumber,
    y:_.With({obj:obj}, _.FunctionContract(_.ObjectContract(_.StringMap({0:Predicate})), Any)),
    z:Any
}));

var test3 = _.assert(obj, contract);

test3["x"];

var f = test3["y"];
var v = f(4711);

test["y"] = function(x) {return "chacha";};
var g = test3["y"];
