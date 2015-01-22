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

// ==================================================

//load("contracts/access3.js");
//load("test/access.js");

//load("test/lax.js");
//load("test/picky.js");
//load("test/indy.js");


//load("test/blame/negation.js");

(function () {

  function f (g) {
    return g (42);
  }

  function id (x) {
    return x;
  }

  var PosPos = Contract.AFunction([Pos], Pos);
  var NegNeg = Contract.AFunction([Neg], Neg);

  var A = Contract.Base(function(h) {
    //h(1);
    return true;
  }, "CallWithPos");

  var B = Contract.Base(function(h) {
    //h(-1);
    return true;
  }, "CallWithNeg");

  var C = Contract.AFunction([PosPos], A);
  var D = Contract.AFunction([NegNeg], B);

  var f = Contract.assert(id, Contract.Intersection(C, D));
  
  var g = f(id);
  
  g(42);

});

// ==================================================

// ==================================================

TreatJS.Config.print();
TreatJS.Statistic.print();

quit();


//TreatJS.Config.print();

//TreatJS.Statistic.print();
//var _print_ = print;
//load("benchmark/typedoctane/typed.js");

quit();

// ==================================================
/*
var AccessContract = Contract.Constructor (function ctor (pstr) {
//  var readable = true;
//  var writeable = true;
  var contract = Contract.Base(function(type) {
    return (typeof type) === "number";
  });



//  return Contract.Object();
  return Contract.Object(Contract.RegExpMap([Contract.Mapping(/^xxx$/, contract),
      Contract.Mapping(/^(\d|\w)$/, Contract.Constructor(ctor))
    //   Contract.Mapping(/^x$/, contract)
    ]));
});

var Access = AccessContract.ctor;

var target = {a:{x:{}}, x:1, next:{a:{}, x:1}};*/
//var object = Contract.assert(target, /*Contract.*/Access("a.b.c"));


//var oa = object.a;
//oa.x;
//var ox=object.x;
//var on=object.next;
//on.a;
//on.x;

quit();


/*
// TypeOf Constructor
var TypeOf = Contract.Constructor(function ctor(type ) {
  return Contract.Base(function (arg) {
    return ((typeof arg) === type);
  }, "typeOf " + type);
});

var typeOfNumberx = TypeOf.build("number");

var arraySpec = Contract.AObject(Contract.RegExpMap([
  Contract.Mapping(/get(^Day+Month+Year$)/,
    Contract.SFunction(Any, typeOfNumber))]))
*/

// ==================================================

quit();


/*
Contract.And(
    Contract.Object({c:typeOfNumber}),
    Contract.Reflect.Get(ObjCon, Con, ObjCon)
);
*/
//Problem, getter function, and  and the argument has to be wrapped bevore calling the getter
//Loesung, Reihenfolge umdrehen umdrehen


//Contract.Object(
//    get
//    dependent cointract,w ekcher mit argumetn name gecalled wird
//)



