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



//load("test/blame/negation.js");


// ==================================================
// test polymorphic contracts

//load("contracts/access3.js");
//load("test/access.js");

/*
 * Note: A Parametric Contract can be implemented by using 
 * with (dynamic binding/ value application) or constructores.
 * Difference: they were evaluated right away when asserted. 
 * A Parametric Contract is some kind of delayed constructor,
 * that only accepts contracts as agruments.
 */

var A = Contract.Polymorphic.Variable("A");
var B = Contract.Polymorphic.Variable("B");
var C = Contract.Polymorphic.Variable("C");

var V = Contract.Polymorphic.Variables([A,B]);

var F = Contract.AFunction([A,A], A);
//print(F);


/*
var F = Contract.AFunction([A,A], A);
var V = Contract.Variables([A,B]);
var P = Contract.Parametric(V, F);
*/

var f = function(x,y) {
  return (x+y);
}

var plus1 = Contract.assert(f, Contract.With({$A:typeOfNumber, $B:typeOfNumber}, F));
plus1(1,2);

//var plus = Contract.assert(f, P);

// f(typeOfNumber, typeOfString)(1, 2);
// var g = f(typeOfNumber, typeOfString); g(1, 2);




TreatJS.Version.print();
TreatJS.Config.print();
TreatJS.Statistic.print();

quit();





/*

(function() {

  function f(x, r) {
    return r;
  }

  var NumNum = Contract.AFunction([typeOfNumber], typeOfNumber);
  var g = Contract.assert(f, NumNum);

  //g(1,1); // ok
  //g(1,"a"); // blame subject
  //g("a", 1); // blame context
  //g("a","a"); // blame context
  
})();

(function() {

  function f(x, r) {
    return r;
  }

  var NumNum = Contract.AFunction([typeOfNumber], typeOfNumber);
  var g = Contract.assert(f, NumNum);

  //g(1,1); // ok
  //g(1,"a"); // blame subject
  //g("a", 1); // blame context
  //g("a","a"); // blame context
  
})();



(function() {

  function f(x, r) {
    return r;
  }

  var NumNum = Contract.AFunction([typeOfNumber], typeOfNumber);
  var g = Contract.assert(f, NumNum);

  //g(1,1); // ok
  //g(1,"a"); // blame subject
  //g("a", 1); // blame context
  //g("a","a"); // blame context
  
})();

*/





//load("test/blame/negation.js");


// ==================================================
// test polymorphic contracts

//load("contracts/access3.js");
//load("test/access.js");


TreatJS.Version.print();
TreatJS.Config.print();
TreatJS.Statistic.print();




quit();



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



