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
load("src/out.js");
load("src/debugger.js");
load("src/treat.js");
load("src/treat.system.js");
load("src/treat.base.js");
load("src/treat.config.js");

// core api
load("src/core/treat.violation.js");
load("src/core/treat.sandbox.js");
load("src/core/treat.logic.js");
load("src/core/treat.callback.js");
load("src/core/treat.map.js");
load("src/core/treat.contract.js");
load("src/core/treat.assert.js");

// convenience api
load("src/treat.convenience.js");

//            _               _      
// __ ___ _ _| |_ _ _ __ _ __| |_ ___
/// _/ _ \ ' \  _| '_/ _` / _|  _(_-<
//\__\___/_||_\__|_| \__,_\__|\__/__/

load("test/contracts.js");

//              __ _                    _   _          
// __ ___ _ _  / _(_)__ _ _  _ _ _ __ _| |_(_)___ _ _  
/// _/ _ \ ' \|  _| / _` | || | '_/ _` |  _| / _ \ ' \ 
//\__\___/_||_|_| |_\__, |\_,_|_| \__,_|\__|_\___/_||_|
//                  |___/                              

// set configuration
_.configure({
   assertion:true,
   membrabe:true,
   decompile:true
   });

// set verbose
_.verbose({
  assert:false,
  sandbox:false
});

// ==================================================

function addUnchecked(a, b) {
  return "1"+(a+b);
}

var intersection1 = _.Intersection(
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber),
    _.AdvancedFunctionContract([IsString, IsString], IsString));

print (intersection1);
var addChecked1 = _.assert(addUnchecked, intersection1);

addChecked1("1",1);

  var intersection2 = _.Or(
      _.And(
        _.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber),
        _.Not(_.AdvancedFunctionContract([IsString, IsString], _.Not(IsString)))
        ),
      _.And(
        _.AdvancedFunctionContract([IsString, IsString], IsString),
        _.Not(_.AdvancedFunctionContract([IsNumber, IsNumber], _.Not(IsNumber)))
        )
      );
  print (intersection2);
  var addChecked2 = _.assert(addUnchecked, intersection2);

//addChecked2(1,1);






/**
var intersection2 = _.Intersection(
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber),
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsString));

print (intersection2);
var addChecked4 = _.assert(addUnchecked, intersection2);

//addChecked4(1,1);

//load("test/miscellaneous//logic.js");

*/



// ==================================================
quit();



// TODO


// runs a testcase
function run(file) {
  print("\n\n\n##########\n# " + file + "\n");
  load(file);
}

// set configuration
_.configure({
  assertion:true,
  membrabe:true,
  decompile:true
});

// set verbose
_.verbose({
  assert:true,
  sandbox:true
});

// ==================================================

//_.assert(4711", IsNumber);

var objUnchecked = {x:4711, y:"4711", f:function(x) {return 4711;}, g:function() {return "4711";} };
var objChecked = _.assert(objUnchecked, _.AdvancedObjectContract({
  x:IsNumber,
    y:IsNumber,
    f:_.AdvancedFunctionContract([IsNumber], IsNumber),
    g:_.AdvancedFunctionContract([IsNumber], IsNumber),
}));

//objChecked.x;
//objChecked.y;

//objChecked.y = 7;
//objChecked.y = "2";
//objChecked.y;



//objChecked[0];
//
//
//objChecked.g = function(x) {return "4711";};
//objChecked.g(2);



function addUnchecked(a, b) {
  return 1+(a+b);
}
var addChecked = _.assert(addUnchecked, 
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber));

//addChecked(3,3);
//addChecked("3","3");


function NumToNum(x) {
  return 7;
}

function NumNumToNum(f) {
  f(1);
  return 7;
}
var NumNumToNumC = _.assert(NumNumToNum, 
    _.AdvancedFunctionContract([_.AdvancedFunctionContract([IsNumber], IsNumber)], IsNumber));

//NumNumToNumC(NumToNum);



function NumToNumNum(x) {
  return NumToNum;
}
var NumToNumNumC = _.assert(NumToNumNum, 
    _.AdvancedFunctionContract([IsNumber], _.AdvancedFunctionContract([IsNumber], IsNumber)));

//NumToNumNumC(7)(2);



function NumToNum1(x) {
  return 7;
}

function NumToNum2(x) {
  return 7;
}

function NumNumToNumNum(f) {
  f(1);
  return NumToNum2;
}
var NumNumToNumNumC = _.assert(NumNumToNumNum, 
    _.AdvancedFunctionContract([_.AdvancedFunctionContract([IsNumber], IsNumber)], _.AdvancedFunctionContract([IsNumber], IsNumber)));

//NumNumToNumNumC(NumToNum1)(1);


function NumToNum3(x) {
  return "7";
}

function NumNumToNumNumX(f) {
  return NumToNum3;
}
var NumNumToNumNumXC = _.assert(NumNumToNumNumX, 
    _.AdvancedFunctionContract([_.AdvancedFunctionContract([IsNumber], IsNumber)], _.AdvancedFunctionContract([IsNumber], IsNumber)));

//NumNumToNumNumXC(NumToNum3)(1);



/*
   var addChecked1 = _.assert(addUnchecked, _.Or(
   _.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber),
   _.AdvancedFunctionContract([IsString, IsString], IsString)));

//addChecked1("1","1");

// -

var addChecked2 = _.assert(addUnchecked, _.Or(
_.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber),
_.AdvancedFunctionContract([IsNumber, IsNumber], IsString)));

//addChecked2(1,1);
*/


var intersection1 = _.Intersection(
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber),
    _.AdvancedFunctionContract([IsString, IsString], IsString));

print (intersection1);
var addChecked3 = _.assert(addUnchecked, intersection1);

//addChecked3(1,1);


var intersection2 = _.Intersection(
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber),
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsString));

print (intersection2);
var addChecked4 = _.assert(addUnchecked, intersection2);

//addChecked4(1,1);

//load("test/miscellaneous//logic.js");








var union1 = _.Union(
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber),
    _.AdvancedFunctionContract([GreaterThanZero, GreaterThanZero], IsString));

print (union1);
var addChecked5 = _.assert(addUnchecked, union1);

//addChecked5(1);




function NotNumToNum(x) {
  return 3;
}
var negation1 = _.Negation(_.AdvancedFunctionContract([IsNumber], IsNumber));
var NotNumToNumC = _.assert(NotNumToNum, negation1);
//NotNumToNumC(1);



function NotNotNumToNum(x) {
  return 3;
}
var negation2 = _.Negation(_.Negation(_.AdvancedFunctionContract([IsNumber], IsNumber)));
var NotNotNumToNumC = _.assert(NotNotNumToNum, negation2);
//NotNotNumToNumC("2");





// ==================================================

quit();







var map = new WeakMap();
print(map.keys);
quit();

/*

   function f(x) {
   return true;
   }

   var g = _.assert(f, _.SimpleFunctionContract(IsNumber, IsBoolean));
   */

try {
  var start = 0;
  var end = 0;

  function fgh() {}

  print("#");
  (function () {
    timeout(1)
    start = elapsed();
  for(var i=0; i<10000000000; i++) {
    fgh(i);
  }
  })();
  end = elapsed();
  print("#");
} catch(e) {
  print("@" + e);
}
print("execution time " + (end-start));


//setInterval(function(){alert("Hello")},3000);



/*


   function __make(name, getter, target) {
   Object.defineProperty(target, name, {
   get: getter,
   enumerable: true,
   configurable: true
   });
   }

   function __define(name, property, target) {
   Object.defineProperty(target, name, {
   get: function () { return property; },
   enumerable: true
   });
   }

   function __getter(name, getter, target) {
   Object.defineProperty(target, name, {
   get: getter,
   enumerable: true
   });
   }


   __make("b", function() {
   __make("b", function() {return 4712;}, this);
   return 4711;
   }, this);

   var a = 4711;
//var b = a;


/*if(a===b) {
print("1 - a) " + a);
print("1 - b) " + b);
}/*


/*
var i = 0;

var a = {};
__define("valueOf", function() {
i=i+1;
return "[a]"+i;
}, a);
var b = a;
*/
/*
   var args = {};
   __getter("0", function() {return a}, args);
   __getter("1", function() {return b}, args);

   (function(a, b) {

   if(a===b) {
   print("2 - a) " + a);
   print("2 - b) " + b);
   }

   }).apply(this, args);

   print(args[0]);
   */




// ==================================================

quit();
