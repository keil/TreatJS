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
        //print("@@@@@@@@@@@"+arg);
        //print("@@@@@@@@@@@"+obj.x);
        return obj.x;
});

// Base Contracts

//var x = $.assert(-4711, $.And(IsNumber, GreaterThanZero));
var x = $.assert(4711, $.And(IsNumber, GreaterThanZero));

// Function Contracts

var func        = function(x) {return 4711;}
var func2       = function(x) {return "chacha";}

var test = $.assert(
                func,
                $.FunctionContract($.ObjectContract({0:$.And(IsNumber, GreaterThanZero)}), $.And(IsNumber, GreaterThanZero))
                );

// NOTE, only function contracts on functions ?
var test2 = $.assert(
                func2,
                $.And(
                        $.FunctionContract($.ObjectContract({0:IsNumber}), IsNumber),
                        $.FunctionContract($.ObjectContract({0:GreaterThanZero}), GreaterThanZero)
                     )
                );

test(4711);
//test(-4711);
//test("4711");

//test2(4711);
//test2(-4711);
//test2("4711");

// Object Contracts

var obj = {
        x:4711,
        y:function(x) {return (x+1);},
        z:"chacha"
};

// Test 3.1
// ObjectContract with nested base-level With

var contract = $.And(
                $.ObjectContract({
                        y:$.FunctionContract($.ObjectContract({0:GreaterThanZero}), $.With({obj:obj},Predicate))
                }),
                $.ObjectContract({
                        x:$.With({obj:obj},Predicate)
                })
                );


var test = $.assert(obj, contract);

test["x"];

var f = test["y"];
var v = f(4711);

test["y"] = function(x) {return "chacha";};
var g = test["y"];

// Test 3.2
// ObjectContract with top-level With

var contract = $.With({obj:obj}, $.ObjectContract({
        x:$.And(Predicate, IsNumber),
    y:$.And($.FunctionContract($.ObjectContract({0:IsNumber}), IsNumber), $.FunctionContract($.ObjectContract({0:Predicate}), Predicate)),
    z:Any
}));

var test2 = $.assert(obj, contract);

test2["x"];

var f = test2["y"];
//var v = f(4711);

test2["y"] = function(x) {return "chacha";};
var g = test2["y"];

// Test 3.3
// ObjectContract with nested With

var contract = $.ObjectContract({
        x:IsNumber,
    y:$.With({obj:obj}, $.And($.ObjectContract({}), $.FunctionContract($.ObjectContract({0:Predicate}), Any))),
    z:Any
});

// new $.ObjectContract({})

var test3 = $.assert(obj, contract);

test3["x"];

var f = test3["y"];
var v = f(4711);

test["y"] = function(x) {return "chacha";};
var g = test3["y"];