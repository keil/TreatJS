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

var func        = function(x) {return 4711;}
var func2       = function(x) {return "chacha";}
var func3       = function(x, y) { return (x+y);}

var test = Contract.assert(
    func,
    Contract.Function(Contract.Object(Contract.StringMap({0:IsNumber})), IsNumber)
    );

var test2 = Contract.assert(
    func2,
    Contract.Function(Any, IsString)
    );

var test3 = Contract.assert(
    func3,
    Contract.Function(Contract.Object(Contract.StringMap({0:IsNumber, 1:IsNumber})), IsNumber)
    );

  test(4711);
  test2("chacha");
  test3(4711, 4712);


  var f = function (a, b) {
    return (a>b);
  }

//g = Contract.assert(f, Contract.Function({0:IsNumber, 1:IsNumber}, IsBoolean));
//g = Contract.assert(f, Contract.SFunction(IsNumber, IsNumber, IsBoolean));

//g(1,2);
//g(2,1);
//g("a", 1);
//g(1, "a");
//g(1, true);


function f() {}


(function() {
  var f = function(a) {return 7};
  var c = Contract.Function(Contract.Object(Contract.StringMap({0:IsNumber})), IsNumber);
  var g = Contract.assert(f, c);

  g(7);
  //g(true);

  var d = Contract.Not(Contract.Function(Contract.Object(Contract.StringMap({0:IsNumber})), IsNumber));
  var h = Contract.assert(f, d);

  // h(7);
  h(true);
  //h(7);

})();
