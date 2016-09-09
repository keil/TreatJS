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

//  ___         _               _      
// / __|___ _ _| |_ __ _ _ _ __| |_ ___
//| (__/ _ \ ' \  _/ _` | '_/ _|  _(_-<
// \___\___/_||_\__\__,_|_| \__|\__/__/

Contracts.build(this);





print(TreatJS);
print(TreatJS.version);

print(Contract);
print(Contract.version);

print(TreatJS.Contract);


//print(TreatJS.TreatJS.Core);




(function() {

  

  function dump(path, package) {
    for (var name in package) {
      print(`${path} . ${name}`);
      dump(`${path} . ${name}`, package[name]);
    }    
  }
  
  print("\n\n::: TreatJS");
  dump("TreatJS", TreatJS);

})();


(function() {

  print("\n\n::: Contract");
  for (var name in Contract) {
    print(`Contarct . ${name}`);
  }

})();





/**
 * make it more felxibale, shoudl be possible to instanceit contract on this or an _
 * or on any other contract
 */

var _ = _ || (function(Contract) {

  this.Any = Contract.Base(function(arg) {
    return true; 
  },"Any");


  this.typeUndefined = Contract.Base(function(arg) {
    return ((typeof arg) === "undefined");
  },"typeUndefined");

  this.typeObject =  Contract.Base(function(arg) {
    return ((typeof arg) === "object");
  },"typeObject");

  this.typeBoolean = Contract.Base(function(arg) {
    return ((typeof arg) === "boolean");
  },"typeBoolean");

  this.typeNumber = Contract.Base(function(arg) {
    return ((typeof arg) === "number");
  },"typeNumber");

  this.typeString = Contract.Base(function(arg) {
    return ((typeof arg) === "string");
  },"typeString");
  
  this.typeSymbol = Contract.Base(function(arg) {
    return ((typeof arg) === "symbol");
  },"typeSymbol");

  this.typeFunction = Contract.Base(function(arg) {
    return ((typeof arg) === "function");
  },"typeFunction");




  this.InstanceOf = Contract.Constructor(function(constructor) {

    return Contract.Base(function(object) {
      return (object instanceof constructor); 
    },  `InstanceOf ${constructor.name}`);
  }, "InstanceOf");


  this.Between = Contract.Constructor(function(min, max) {
    return Contract.Base(function(value) {
      return (min <= value) && (value <= max); 
    }, `Between ${min} ${max}`);
  }, "BetweenXX");


  return this;

}).apply(this, [Contract]);

//print(Contract.assert("1", _.typeNumber));
print("AAAAAAAAA");


var between_0_9 = Contract.construct(Between, [0,1]);
Contract.assert(0, between_0_9);








print("AAAAAAAAA");

//Contract.assert("1", Contract.typeNumber);

var isArray = Contract.construct(InstanceOf, [Array]);
//Contract.assert({}, isArray);


print("XXXXXXXX");

//Contract.assert("1", typeNumber);


///Contract.assert(1, typeNumber);



//print(TreatJS.Callback.Function);
//print(TreatJS.assertWith);


//load("test/sugar/test.js");

//quit();





// ==================================================

//TreatJS.Statistic.print();

// ==================================================

quit();