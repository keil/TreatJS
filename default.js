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





print("************************************");

//function plus(x, y) {
//  return x+y;
//}

//var plusNUmber = Contract.assert(plus, Contract.Function(Contract.Object([typeNumber, typeNumber]), typeNumber));

//print(plusNUmber(1,2));
//plusNUmber(1,'2');

// todo, test uncontracted parameters in object




print("************************************");

var xxx = {x:4711, y:true};

var NNN = Contract.Object( {x:typeNumber, y:typeNumber, z:typeNumber});
var SSS = Contract.Object( {x:typeString, y:typeString, z:typeString});

var XXX = Contract.assert(xxx, NNN);

XXX.x; // no blame
//XXX.y; // subject blame
XXX.z = 1; // no blame
//XXX.z = true; // context blame

var YYY = Contract.assert(xxx, Contract.DIntersection(NNN, SSS));

//YYY.x; // Subject blame
YYY.x = 7;
//YYY.x = "123";

// after writing one, every read shoudl be fine, because the context can choose
// // ?
//YYY.x;



var ZZZ = Contract.assert(xxx, Contract.Union(NNN, SSS));

ZZZ.x;
ZZZ.x=7;

// What if one or more properties are undefined
// Normally, they are handled as true.
//






print("************************************");


function f(g) {
  //g("1"); g(1);
  //return 1;

  g("1"); g(1);
  return 1;
 // return "1";
}

function g(x) {
  return x;
}

const AxN = Contract.Function(Contract.Object([Any]), typeNumber);
const AxN_xN = Contract.Function(Contract.Object([AxN]), typeNumber);

const AxS = Contract.Function(Contract.Object([Any]), typeString);
const AxS_xS = Contract.Function(Contract.Object([AxS]), typeString);


//var ff = Contract.assert(f, Contract.DIntersection(AxN_xN, AxS_xS));

//ff(g);
//quit();







// ==================================================

//TreatJS.Statistic.print();

// ==================================================

quit();
