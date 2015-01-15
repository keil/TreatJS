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

// Test Implementation of Access Permission Contracts
//  


var AccessContract = Contract.Constructor (function ctor (ac) {
  var any = Contract.Base(function(property) {
    return true;
  });
  var readable = Contract.Base(function(property) {
    return (property!=="b");
    return true;
  });
  var writeable = Contract.Base(function(property) {
    return true;
  });
   
  var get = Contract.Get(Contract.And(
    Contract.AFunction({1:readable}, any),
    Contract.Dependent(Contract.Constructor(ctor))
    ));
  var set = Contract.Get(Contract.AFunction({1:writeable}, any));

  return Contract.And(get, set);
});

var Access = AccessContract.ctor;

var target = {a:{a:{}, b:{}, c:{}}, b:{a:{}, b:{}, c:{}}, c:{a:{}, b:{}, c:{}}};
var object = Contract.assert(target, Access("a.a"));

object.a;
//object.b;
object.a.b;





// TODO

// reflection
//run("test/reflect/get.js");
//run("test/reflect/set.js");



TreatJS.Statistic.print(print);

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



