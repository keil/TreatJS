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

var func        = function(x) {return 4711;}
var func2       = function(x) {return "chacha";}
var func3       = function(x, y) { return (x+y);}

var test = _.assert(
    func,
    _.FunctionContract(_.ObjectContract(_.Map.StringMap({0:IsNumber})), IsNumber)
    );

var test2 = _.assert(
    func2,
    _.FunctionContract(Any, IsString)
    );

var test3 = _.assert(
    func3,
    _.FunctionContract(_.ObjectContract(_.Map.StringMap({0:IsNumber, 1:IsNumber})), IsNumber)
    );

  test(4711);
  test2("chacha");
  test3(4711, 4712);


  var f = function (a, b) {
    return (a>b);
  }

//g = _.assert(f, _.FunctionContract({0:IsNumber, 1:IsNumber}, IsBoolean));
//g = _.assert(f, _.SFunctionContract(IsNumber, IsNumber, IsBoolean));

//g(1,2);
//g(2,1);
//g("a", 1);
//g(1, "a");
//g(1, true);


function f() {}


(function() {
  var f = function(a) {return 7};
  var c = _.FunctionContract(_.ObjectContract(_.Map.StringMap({0:IsNumber})), IsNumber);
  var g = _.assert(f, c);

  g(7);
  //g(true);

  var d = _.Not(_.FunctionContract(_.ObjectContract(_.Map.StringMap({0:IsNumber})), IsNumber));
  var h = _.assert(f, d);

  // h(7);
  h(true);
  //h(7);

})();
