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

var obj = {x:true};
var obj2 = {x:false};

Predicate = Contract.Base(function(arg) {
  //print("@@@@@@@@@@@"+arg);
  //print("@@@@@@@@@@@"+obj.x);
  return obj.x;
});

// Base Contracts

//var x = Contract.assert(-4711, Contract.And(IsNumber, GreaterThanZero));
var x = Contract.assert(4711, Contract.And(IsNumber, GreaterThanZero));

// Function Contracts

var func        = function(x) {return 4711;}
var func2       = function(x) {return "chacha";}

var test = Contract.assert(
    func,
    Contract.Function(Contract.Object(Contract.StringMap({0:Contract.And(IsNumber, GreaterThanZero)})), Contract.And(IsNumber, GreaterThanZero))
    );

  // NOTE, only function contracts on functions ?
  var test2 = Contract.assert(
      func2,
      Contract.And(
        Contract.Function(Contract.Object(Contract.StringMap({0:IsNumber})), IsNumber),
        Contract.Function(Contract.Object(Contract.StringMap({0:GreaterThanZero})), GreaterThanZero)
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
// Object with nested base-level With

var contract = Contract.And(
    Contract.Object(Contract.StringMap({
      y:Contract.Function(Contract.Object(Contract.StringMap({0:GreaterThanZero})), Contract.With({obj:obj},Predicate))
    })),
    Contract.Object(Contract.StringMap({
      x:Contract.With({obj:obj},Predicate)
    }))
    );


var test = Contract.assert(obj, contract);

test["x"];

var f = test["y"];
var v = f(4711);

test["y"] = function(x) {return "chacha";};
var g = test["y"];

// Test 3.2
// Object with top-level With

var contract = Contract.With({obj:obj}, Contract.Object(Contract.StringMap({
  x:Contract.And(Predicate, IsNumber),
    y:Contract.And(Contract.Function(Contract.Object(Contract.StringMap({0:IsNumber})), IsNumber), Contract.Function(Contract.Object(Contract.StringMap({0:Predicate})), Predicate)),
    z:Any
})));

var test2 = Contract.assert(obj, contract);

test2["x"];

var f = test2["y"];
//var v = f(4711);

test2["y"] = function(x) {return "chacha";};
var g = test2["y"];

// Test 3.3
// Object with nested With

var contract = Contract.Object(Contract.StringMap({
  x:IsNumber,
    y:Contract.With({obj:obj}, Contract.And(Contract.Object(Contract.StringMap({})), Contract.Function(Contract.Object(Contract.StringMap({0:Predicate})), Any))),
    z:Any
}));

// new Contract.Object({})

var test3 = Contract.assert(obj, contract);

test3["x"];

var f = test3["y"];
//var v = f(4711);

test["y"] = function(x) {return "chacha";};
var g = test3["y"];
