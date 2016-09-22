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

TreatJS.Print.printVersion();
TreatJS.Print.printConfiguration();

quit();


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
    if(typeof package === "object") for (var name in package) {
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


/*


const flag = true;

function define(f,g) {

  return flag ? new Proxy(f, {
    apply:function(target, thisArg, argumentsArg) {
      g.apply(thisArg, argumentsArg);
      return Reflect.apply(target, thisArg, argumentsArg);
    }
  }) : f;
}

let fibonacci = define(function (n) {
  return n==0 ? 0 : n==1 ? 1 : fibonacci(n-1)+fibonacci(n-2);
}, function (n) {
  print("fibonacci of", n);
});





print(fibonacci(10));
//print(fibonacci);

quit();


*/



print("************************************");






function plus(x,y) {
  return (x+y);
}

var plusNumber = Contract.assert(plus, Contract.Function(Contract.Object([typeNumber, typeNumber]), typeNumber));

print(plusNumber===plus);

plusNumber("1",2);


print("************************************");
var TransparentProxy = TransparentProxy || Proxy;
print("************************************");

// INDY - PICKY - LAX

let f = Contract.assert(function (x) {
  return 1;
}, Contract.Function(Contract.Object([typeNumber]), typeNumber));

let g = Contract.assert(function (x) {
  return "1";
}, Contract.Function(Contract.Object([typeNumber]), typeNumber));

let h = Contract.assert(function (x) {
  return "1";
}, Contract.Function(Contract.Object([typeString]), typeString));


let flat = Contract.Base(function(x) {
  return x(1);
}, "Call x");

//Contract.assert(function(){return true}, flat);
//Contract.assert(h, flat);




let o = Contract.assert({x:1, y:"1", f:function(x){return 1;}, g:function(x){return "1";}, h:function(x){return "1";}},
    Contract.Object({
      x: typeNumber,
      y: typeNumber,
      z: typeNumber,
      f: Contract.Function(Contract.Object([typeNumber]), typeNumber),
      g: Contract.Function(Contract.Object([typeNumber]), typeNumber),
      h: Contract.Function(Contract.Object([typeString]), typeString)
    }));

let flat1 = Contract.Base(function(x) {
//  x.x="1";
  //x.h(1);
//  x.f="1";
  x.f=function(x) {return "1"};
  return true;
}, "Call x");

//Contract.assert(o, flat1);

//o.x = true;
//o.f=function(x) {return "1"};

o.f("1");




//addGlobal(this);






//var Proxy = Proxy || TransparentProxy;



Contract.assert([2154], InstanceOfArray);
//Contract.assert({}, InstanceOfArray);

//Contract.assert(2, Even);
//Contract.assert(1, Even);
//Contract.assert(1, Odd);



print("************************************");

print("************************************");

// ==================================================

//TreatJS.Statistic.print();

// ==================================================

quit();
