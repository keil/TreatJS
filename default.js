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

// ___     _     _   
//| _ \_ _(_)_ _| |_ 
//|  _/ '_| | ' \  _|
//|_| |_| |_|_||_\__|

TreatJS.Print.printVersion();
TreatJS.Print.printConfiguration();
TreatJS.Print.printStatistic();
TreatJS.Print.printPackage();
TreatJS.Print.printContract();

print("************************************");

const NumNum_Num = Contract.Function(Contract.Object([typeNumber, typeNumber]), typeNumber);
const StrStr_Str = Contract.Function(Contract.Object([typeString, typeString]), typeString);

const PosPos_Pos = Contract.Function(Contract.Object([Positive, Positive]), Positive);
const EvenEven_Even = Contract.Function(Contract.Object([Even, Even]), Even);

const realFuncC = Contract.Intersection.from(StrStr_Str, typeFunction);
print("====>", realFuncC);

const intersection = Contract.Intersection.from(NumNum_Num, realFuncC);
print("====>", intersection);


/*
quit();
const union = Contract.Union(EvenEven_Even, PosPos_Pos);

const intersection = Contract.Intersection.from(union, StrStr_Str);
print(intersection);
//const intersection = Contract.IIntersection(union, StrStr_Str);
*/


//var inter = new Contract.Intersection(plusNumber, typeFunction);

//var inter = Contract.Intersection.from(plusNumber, typeFunction);

//var inter = Contract.Intersection(plusNumber, typeFunction);
//
///const NumNuNum = Contract.Function(Contract.Object([typeNumber, typeNumber]), typeNumber);

//var inter = Contract.Intersection.from(NumNuNum, typeFunction);
//print(inter)


//var inter = new Contract.Intersection(plusNumber, typeFunction);


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
