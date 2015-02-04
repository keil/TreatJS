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

Predicate = Contract.Base(function(arg) {
  // print("@@@@@@@@@@@"+arg);
  // print("@@@@@@@@@@@"+obj.x);
  return obj.x;
});

// Base Contracts

//var x = Contract.assert(4711, Predicate);
var x = Contract.assert(4711, Contract.With({obj:obj, print:print}, Predicate));
var x = Contract.assert(4711, Contract.With({print:print}, Contract.With({obj:obj}, Predicate)));
//var x = Contract.assert(4711, Contract.With({obj:obj, print:print}, Contract.With({obj:obj2}, Predicate)));

// Function Contracts

var func        = function(x) {return 4711;}
var func2       = function(x) {return "chacha";}
var func3       = function(x, y) { return (x+y);}

var test = Contract.assert(
    func,
    Contract.Function(Contract.Object(Contract.StringMap({0:IsNumber})), Contract.With({obj:obj}, Predicate))
    );

var test2 = Contract.assert(
    func2,
    Contract.With({obj:obj},Contract.Function(Any, Predicate))
    );

var test3 = Contract.assert(
    func3,
    Contract.Function(Contract.Object(Contract.StringMap({0:Contract.With({obj:obj}, Predicate), 1:Any})), Any)
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
// Object with nested base-level With

var contract = Contract.Object(Contract.StringMap({
  x:Contract.With({obj:obj},Predicate),
    y:Contract.Function(Contract.Object(Contract.StringMap({0:GreaterThanZero})), Contract.With({obj:obj},Predicate)),
    z:Any
}));

var test = Contract.assert(obj, contract);

test["x"];

var f = test["y"];
var v = f(4711);

test["y"] = function(x) {return "chacha";};
var g = test["y"];

// Test 3.2
// Object with top-level With

var contract = Contract.With({obj:obj}, Contract.Object(Contract.StringMap({
  x:Predicate,
    y:Contract.Function(Contract.Object(Contract.StringMap({0:Predicate})), Predicate),
    z:Any
})));

var test2 = Contract.assert(obj, contract);

test2["x"];

var f = test2["y"];
var v = f(4711);

test2["y"] = function(x) {return "chacha";};
var g = test2["y"];

// Test 3.3
// Object with nested With

var contract = Contract.Object(Contract.StringMap({
  x:IsNumber,
    y:Contract.With({obj:obj}, Contract.Function(Contract.Object(Contract.StringMap({0:Predicate})), Any)),
    z:Any
}));

var test3 = Contract.assert(obj, contract);

test3["x"];

var f = test3["y"];
var v = f(4711);

test["y"] = function(x) {return "chacha";};
var g = test3["y"];
