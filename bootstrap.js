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

// ___ ___ _  _ _ _ __ ___ 
//(_-</ _ \ || | '_/ _/ -_)
///__/\___/\_,_|_| \__\___|

// libraries
load("lib/lib_padding.js");

// base source files
// load("src/out.js"); // TODO
// load("src/debugger.js"); // TODO
load("src/treat.js");
load("src/treat.system.js");
load("src/treat.base.js");
load("src/treat.config.js");
load("src/treat.statistic.js");

// core api
load("src/core/treat.violation.js");
load("src/core/treat.sandbox.js");
load("src/core/treat.logic.js");
load("src/core/treat.callback.js");
load("src/core/treat.map.js");
load("src/core/treat.contract.js");
load("src/core/treat.assert.js");
load("src/treat.canonicalize.js");

// convenience api
load("src/treat.convenience.js");

// reflection api
load("src/treat.reflect.js");

//              __ _                    _   _          
// __ ___ _ _  / _(_)__ _ _  _ _ _ __ _| |_(_)___ _ _  
/// _/ _ \ ' \|  _| / _` | || | '_/ _` |  _| / _ \ ' \ 
//\__\___/_||_|_| |_\__, |\_,_|_| \__,_|\__|_\___/_||_|
//                  |___/                              

// set Contract
var Contract = TreatJS.build();
//TreatJS.export(this);
//TreatJS.integrate();

// set configuration
TreatJS.configure({
  assertion: true,
  membrabe: true,
  decompile: true,
  canonicalize: true 
});

// set verbose
TreatJS.verbose({
  assert: false,
  sandbox: false,
  statistic: true
});

//            _               _      
// __ ___ _ _| |_ _ _ __ _ __| |_ ___
/// _/ _ \ ' \  _| '_/ _` / _|  _(_-<
//\__\___/_||_\__|_| \__,_\__|\__/__/

load("contracts/contracts.js");
load("contracts/aliases.js");





// TODO





var targetCon = Contract.Base(function(arg) {
  return true;
});

var nameCon = Contract.Base(function(arg) {
  return (arg==="a") ? true : false ;
  //return true;
});

var valueCon = Contract.Base(function(arg) {
  return (typeof arg === "number") ? true : false;
});

var receiverCon = Contract.Base(function(arg) {
  return true;
});


var obj = {a:4711, b:4712, c:4713};
//var con = Contract.Reflect.Get(targetCon, nameCon, receiverCon);
var con = Contract.Get(targetCon, nameCon, receiverCon);
var prx = Contract.assert(obj, con);

print("--- " + prx.a);
//print("--- " + prx.b);
//print("--- " + prx.c);


var con2 = Contract.Set(targetCon, nameCon, valueCon, receiverCon);
var prx2 = Contract.assert(prx, con2);

print("--- " + prx2.a);
print("--- " + (prx2.a=1));
print("--- " + prx2.a);

//print("--- " + (prx2.b="L"));
//print("--- " + (prx2.a="L"));


/**
typeNumber --> Any




**/

TreatJS.Statistic.print(print);

quit();

// ==================================================

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

var target = {a:{x:{}}, x:1, next:{a:{}, x:1}};
var object = Contract.assert(target, /*Contract.*/Access("a.b.c"));


var oa = object.a;
oa.x;
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



Contract.And(
    Contract.Object({c:typeOfNumber}),
    Contract.Reflect.Get(ObjCon, Con, ObjCon)
);

//Problem, getter function, and  and the argument has to be wrapped bevore calling the getter
//Loesung, Reihenfolge umdrehen umdrehen


//Contract.Object(
//    get
//    dependent cointract,w ekcher mit argumetn name gecalled wird
//)



Contract.Object(
    Contract.Reflect.Get(),
    Contract.Reflect.Set()
);
