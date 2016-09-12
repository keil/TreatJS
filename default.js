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
//obj2.x = 'df';


var arr = Contract.assert([1,'1'], Contract.Object([typeNumber, typeNumber]));
arr[0];
//arr[1];
//arr[0] = '1';







print("************************************");

//function plus(x, y) {
//  return x+y;
//}

//var plusNUmber = Contract.assert(plus, Contract.Function(Contract.Object([typeNumber, typeNumber]), typeNumber));

//print(plusNUmber(1,2));
//plusNUmber(1,'2');

// todo, test uncontracted parameters in object


print("************************************");


function f(g) {
  //g("1"); g(1);
  g(1); g("1");
  return 1;
}

function g(x) {
  return x;
}

const AxN = Contract.Function(Contract.Object([Any]), typeNumber);
const AxN_xN = Contract.Function(Contract.Object([AxN]), typeNumber);

const AxS = Contract.Function(Contract.Object([Any]), typeString);
const AxS_xS = Contract.Function(Contract.Object([AxS]), typeString);


var ff = Contract.assert(f, Contract.DIntersection(AxN_xN, AxS_xS));

ff(g);
quit();




print("************************************");

// union and intersection with objects

function plus(x, y) {
  return x+y;
}

const NNxN = Contract.Function(Contract.Object([typeNumber, typeNumber]), typeNumber);
const SSxS = Contract.Function(Contract.Object([typeString, typeString]), typeString);


var plus2 = Contract.assert(plus, Contract.DIntersection(NNxN, SSxS));

//print(plus2(1,2));
//print(plus2('1','2'));

//print(plus2(true, true));
//print(plus2(1,true));

//print(plus2('1',2));
print(plus2(1,'2'));






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
