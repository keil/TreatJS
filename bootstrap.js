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
load("src/shell.js");
load("test/contracts.js");

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

function addUnchecked(a, b) {
  return (a+b);
}
var addChecked = _.assert(addUnchecked, 
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber));

print("Result:" + addChecked("3","3"));


/**

var addChecked1 = _.assert(addUnchecked, _.Or(
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber),
    _.AdvancedFunctionContract([IsString, IsString], IsString)));

addChecked1("1","1");

// -

var addChecked2 = _.assert(addUnchecked, _.Or(
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber),
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsString)));

addChecked2(1,1);



var intersection1 = _.Intersection(
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber),
    _.AdvancedFunctionContract([IsString, IsString], IsString));

print (intersection1);


var intersection2 = _.Intersection(
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber),
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsString));

print (intersection2);

var addChecked3 = _.assert(addUnchecked, intersection1);
var addChecked4 = _.assert(addUnchecked, intersection2);

addChecked3("1","1");
addChecked4(1,1);

//load("test/miscellaneous//logic.js");



*/













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
