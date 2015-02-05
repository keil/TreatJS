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

function testCC(contract) {
  print("\n\n");
  print("canonical? " + TreatJS.canonical(contract));
  print(contract);

  if(!TreatJS.canonical(contract)) throw new Error("No canonical contract!");
  var contractP = TreatJS.canonicalize(contract);
  print(contractP);
  if(!TreatJS.canonical(contractP)) throw new Error("No canonical contract!");
}

function testNCC(contract) {
  print("\n\n");
  print("canonical? " + TreatJS.canonical(contract));
  print(contract);

  if(TreatJS.canonical(contract)) throw new Error("No non-canonical contract!");
  var contractP = TreatJS.canonicalize(contract);
  print(contractP);
  if(!TreatJS.canonical(contractP)) throw new Error("No canonical contract!");
}

var bc = IsBoolean;
var oc = Contract.Object(Contract.StringMap());
var fc = Contract.Function( Contract.Object(Contract.StringMap({0:IsNumber})), IsNumber);
var dc = Contract.Dependent( Contract.Constructor(function(){}));

// Canonical Contracts
// Immediate Contract
testCC ( bc );
testCC ( oc );

testCC ( Contract.Or(bc, oc) );
testCC ( Contract.Intersection(bc, oc) );

//testCC ( Contract.Negation(bc) ); // TODO
testCC ( Contract.Not(bc) );

testCC ( Contract.With({}, bc) );

// Delayed Contract
testCC ( fc );
testCC ( dc );

testCC ( Contract.Or(fc, dc) );
testCC ( Contract.Intersection(fc, dc) );

testCC ( Contract.Negation(fc) );
testCC ( Contract.Not(fc) );

testCC ( Contract.With({}, fc) );

// Contracts
testCC ( Contract.Or(bc, fc) );
testCC ( Contract.Intersection(bc, fc) );

testCC ( Contract.And(bc, fc) );
testCC ( Contract.Union(bc, fc) );

testCC ( Contract.And(bc, fc) );
testCC ( Contract.Union(bc, fc) );

testCC ( Contract.Or(bc, Contract.And(bc, fc)) );
testCC ( Contract.Intersection(bc, Contract.And(bc, fc)) );

testCC ( Contract.And(Contract.And(bc, fc), Contract.Or(bc, Contract.And(bc, fc))) );
testCC ( Contract.Union(Contract.And(bc, fc), Contract.Intersection(bc, Contract.And(bc, fc))) );

// Non-canonical Contracts
testNCC ( Contract.Or(fc, bc) );
testNCC ( Contract.Intersection(fc, bc) );

//testNCC ( Contract.Negation(Contract.Or(bc, fc)) );
//testNCC ( Contract.Negation(Contract.Intersection(bc, fc)) );

//testNCC ( Contract.Negation(Contract.And(bc, fc)) );
//testNCC ( Contract.Negation(Contract.Union(bc, fc)) );

//testNCC ( Contract.Negation(Contract.Or(fc, bc)) );
//testNCC ( Contract.Negation(Contract.Intersection(fc, bc)) );

//testNCC ( Contract.Negation(Contract.And(fc, bc)) );
//testNCC ( Contract.Negation(Contract.Union(fc, bc)) );

testCC ( Contract.With({},Contract.Or(bc, fc)) );
testCC ( Contract.With({},Contract.Intersection(bc, fc)) );

//testNCC ( Contract.Negation(Contract.With({},Contract.Or(bc, fc))) );
//testNCC ( Contract.Negation(Contract.With({},Contract.Intersection(bc, fc))) );

testCC ( Contract.Union ( Contract.Intersection(fc, bc), Contract.Intersection(fc, bc) ));
testNCC ( Contract.Intersection ( Contract.Union(fc, bc), Contract.Union(fc, bc) ));

//testCC ( Contract.Union ( Contract.Negation(Contract.Intersection(fc, bc)), Contract.Intersection(fc, bc) ));
//testNCC ( Contract.Intersection ( Contract.Negation(Contract.Union(fc, bc)), Contract.Union(fc, bc) ));

(function() {

  var contract = Contract.Or(
    Contract.And(
      Contract.AFunction([IsNumber, IsNumber], IsNumber),
      Contract.Not(Contract.AFunction([IsString, IsString], Contract.Not(IsString)))
      ),
    Contract.And(
      Contract.AFunction([IsBoolean, IsBoolean], IsBoolean),
      Contract.Not(Contract.AFunction([IsNaN, IsNaN], Contract.Not(IsNaN)))
      )
    );

  testNCC(contract);

})();

testCC ( Contract.Not(Contract.And(IsNumber, GreaterThanZero)));
testCC ( Contract.Not(Contract.Or(IsNumber, False)));
testCC ( Contract.Not(Contract.Not(IsNumber)));
