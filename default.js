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
print("************************************");


var obj = {
  x:1,
  y:true
}

var obj2 = Contract.assert(obj, Contract.Object({x:typeNumber, y:typeNumber}));

obj2.x;
//obj2.y;

obj2.x = 'df';






print("************************************");

function plus(x, y) {
  return x+y;
}

//var plusNUmber = Contract.assert(plus, )





print("************************************");

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
