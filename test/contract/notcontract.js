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

var test = Contract.assert("4711", Contract.Not(IsNumber));

var func        = function(x) {return "4711";}

var test = Contract.assert(
    func,
    Contract.Not(Contract.Function(Contract.Object(Contract.StringMap({0:IsNumber})), IsNumber)
      ));
  test("4711");


  // Test 3.1
  // Object with nested base-level With


  var funC =  Contract.Not(Contract.Function(Contract.Object(
          Contract.StringMap({0:IsNumber})), IsNumber));
  var funX = Contract.assert(function(x) {return 1; }, funC);

  funX("1");
  // funX(1);

  var contract = Contract.Not(
      Contract.Object(
        Contract.StringMap({
          x:IsNumber,
          y:Contract.Function(
            Contract.Object(
              Contract.StringMap({0:IsNumber})), IsNumber),
          z:Any
        })));

var obj = {
  x:"4711",
  y:function(x) {return (x+1);},
  z:"chacha"
};

var test = Contract.assert(obj, contract);

test.x;
test.y("adf");
//test.z;

//var test = Contract.assert(-4711, Contract.Not(Contract.And(IsNumber, GreaterThanZero)));
var test = Contract.assert(-1, Contract.Not(Contract.And(IsNumber, GreaterThanZero)));
var test = Contract.assert(-1, Contract.Or(Contract.Not(IsNumber), Contract.Not(GreaterThanZero)));
var test = Contract.assert("4711", Contract.Not(Contract.Or(IsNumber, False)));
var test = Contract.assert(4711, Contract.Not(Contract.Not(IsNumber)));
