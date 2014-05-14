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

var obj         = {p:"#"};

var context = _.BaseContract(function(thisArg) {
  return (thisArg.p === "#");
}, "#");

obj.test = _.assert(
    func,
    _.MethodContract(_.ObjectContract(_.Map.StringMap({0:IsNumber})), IsNumber, context)
    );

obj.test2 = _.assert(
    func2,
    _.MethodContract(Any, IsString, context)
    );

obj.test3 = _.assert(
    func3,
    _.MethodContract(_.ObjectContract(_.Map.StringMap({0:IsNumber, 1:IsNumber})), IsNumber, context)
    );

  obj.test(4711);
  obj.test2("chacha");
  obj.test3(4711, 4712);


  var f = function (a, b) {
    return (a>b);
  }

//g = _.assert(f, _.MethodContract({0:IsNumber, 1:IsNumber}, IsBoolean));
//g = _.assert(f, _.SMethodContract(IsNumber, IsNumber, IsBoolean));

//g(1,2);
//g(2,1);
//g("a", 1);
//g(1, "a");
//g(1, true);


function f() {}


(function() {
  var f = function(a) {return 7};
  var c = _.MethodContract(_.ObjectContract(_.Map.StringMap({0:IsNumber})), IsNumber, context);
  obj.g = _.assert(f, c);

  obj.g(7);
  //obj.g(true);

  var d = _.Not(_.MethodContract(_.ObjectContract(_.Map.StringMap({0:IsNumber})), IsNumber, context));
  obj.h = _.assert(f, d);

  // h(7);
  obj.h(true);
  //h(7);

})();
