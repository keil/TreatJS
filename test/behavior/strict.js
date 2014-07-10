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

var obj = {a:4711, b:"4712", c:true}

var test = _.assert(
    obj,
    _.AdvancedObjectContract({a:IsNumber, b:IsString, c:IsBoolean}, true));

//test.a;
//test.b;
//test.c;

var obj = {a:"4711", b:4712, c:"true"}

var test = _.assert(
    obj,
    _.Not(_.AdvancedObjectContract({a:IsNumber, b:IsString, c:IsBoolean}, true)));

//test.a;
//test.b;
//test.c;

test.c = 4711;
test.c;


(function() {
  var obj = {a:4711, b:"4712", c:4713};

  var objC = _.ObjectContract(_.Map.StringMap({a:IsNumber, b:IsNumber, c:IsNumber}));
  var objP = _.assert(obj, objC);

  objP.a;
  //objP.a = true;
  //objP.a;
})();

(function() {
  var obj = {a:4711, b:4712, c:4713};

  var objC = _.ObjectContract(_.Map.StringMap({a:IsNumber, b:IsNumber, c:IsNumber}, true));
  var objP = _.assert(obj, objC);

  objP.a;
  //objP.a = true;
  //objP.a;
})();

(function() {

  function fun(a,b,c) {
    print(a);
    print(b);
    //print(c); c is not used
    //print(arguments[3]); // d is not defined
    return true;
  }

  var objC = _.ObjectContract(_.Map.StringMap({0:IsNumber, 1:IsNumber, 2:IsNumber, 4:IsBoolean}, false));
  var funC = _.FunctionContract(objC, True);

  var funP = _.assert(fun, funC);

  funP(4711, 4712, 4713, 4714);
  //funP(4711, 4712, 4713, 4714);

})();

(function() {

  function fun(a,b,c) {
    print(a);
    print(b);
    //print(c); c is not used
    //print(arguments[3]); // d is not defined
    return true;
  }

  var objC = _.ObjectContract(_.Map.StringMap({0:IsNumber, 1:IsNumber, 2:IsNumber}, true));
  var funC = _.FunctionContract(objC, True);

  var funP = _.assert(fun, funC);

  funP(4711, 4712, 4713, 4714);
  //funP(4711, 4712, 4713, 4714);

})();
