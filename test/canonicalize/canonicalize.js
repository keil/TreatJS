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

function testCC(contract) {
  print("\n\n");
  print("canonical? " + _.canonical(contract));
  print(contract);

  if(!_.canonical(contract)) throw new Error("No canonical contract!");
  var contractP = _.canonicalize(contract);
  print(contractP);
  if(!_.canonical(contractP)) throw new Error("No canonical contract!");
}

function testNCC(contract) {
  print("\n\n");
  print("canonical? " + _.canonical(contract));
  print(contract);

  if(_.canonical(contract)) throw new Error("No non-canonical contract!");
  var contractP = _.canonicalize(contract);
  print(contractP);
  if(!_.canonical(contractP)) throw new Error("No canonical contract!");
}


// TODO, make two test functions

var bc = IsBoolean;
var oc = _.ObjectContract(_.Map.StringMap());
var fc = _.FunctionContract( _.ObjectContract(_.Map.StringMap({0:IsNumber})), IsNumber);
var dc = _.DependentContract( _.Constructor(function(){}));



// Canonical Contracts
// Immediate Contract
testCC ( bc );
testCC ( oc );

testCC ( _.Or(bc, oc) );
testCC ( _.Intersection(bc, oc) );

testCC ( _.Negation(bc) );
testCC ( _.Not(bc) );

testCC ( _.With({}, bc) );

// Delayed Contract
testCC ( fc );
testCC ( dc );

testCC ( _.Or(fc, dc) );
testCC ( _.Intersection(fc, dc) );

testCC ( _.Negation(fc) );
testCC ( _.Not(fc) );

testCC ( _.With({}, fc) );

// Contracts
testCC ( _.Or(bc, fc) );
testCC ( _.Intersection(bc, fc) );

testCC ( _.And(bc, fc) );
testCC ( _.Union(bc, fc) );

testCC ( _.And(bc, fc) );
testCC ( _.Union(bc, fc) );

testCC ( _.Or(bc, _.And(bc, fc)) );
testCC ( _.Intersection(bc, _.And(bc, fc)) );

testCC ( _.And(_.And(bc, fc), _.Or(bc, _.And(bc, fc))) );
testCC ( _.Union(_.And(bc, fc), _.Intersection(bc, _.And(bc, fc))) );

// Non-canonical Contracts
testNCC ( _.Or(fc, bc) );
testNCC ( _.Intersection(fc, bc) );

testNCC ( _.Negation(_.Or(bc, fc)) );
testNCC ( _.Negation(_.Intersection(bc, fc)) );

testNCC ( _.Negation(_.And(bc, fc)) );
testNCC ( _.Negation(_.Union(bc, fc)) );

testNCC ( _.Negation(_.Or(fc, bc)) );
testNCC ( _.Negation(_.Intersection(fc, bc)) );

testNCC ( _.Negation(_.And(fc, bc)) );
testNCC ( _.Negation(_.Union(fc, bc)) );

testNCC ( _.With({},_.Or(bc, fc)) );
testNCC ( _.With({},_.Intersection(bc, fc)) );

testNCC ( _.Negation(_.With({},_.Or(bc, fc))) );
testNCC ( _.Negation(_.With({},_.Intersection(bc, fc))) );

testCC ( _.Union ( _.Intersection(fc, bc), _.Intersection(fc, bc) ));
testNCC ( _.Intersection ( _.Union(fc, bc), _.Union(fc, bc) ));

testCC ( _.Union ( _.Negation(_.Intersection(fc, bc)), _.Intersection(fc, bc) ));
testNCC ( _.Intersection ( _.Negation(_.Union(fc, bc)), _.Union(fc, bc) ));





(function() {

  var contract = _.Or(
    _.And(
      _.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber),
      _.Not(_.AdvancedFunctionContract([IsString, IsString], _.Not(IsString)))
      ),
    _.And(
      _.AdvancedFunctionContract([IsBoolean, IsBoolean], IsBoolean),
      _.Not(_.AdvancedFunctionContract([IsNaN, IsNaN], _.Not(IsNaN)))
      )
    );

  testNCC(contract);

})();
