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

// DUMP TreatJS Package

print(TreatJS);
print(TreatJS.version);

print(Contract);
print(Contract.version);

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

print("************************************");

function plus (x, y) {
  return (x+y);
}

function addOne(z) {
  return plus(); plus(z, "1");
}

var addOneC = Contract.assert(addOne, Contract.Dependent(Contract.Constructor(function(z) {
  return Contract.Base(function(value) {
    return (typeof value) === (typeof z);
  },"SameType");
},"SameType")));

addOneC(1);


print("************************************");

print("************************************");

// ==================================================

//TreatJS.Statistic.print();

// ==================================================

quit();
