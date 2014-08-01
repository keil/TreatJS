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

var Any = TreatJS.BaseContract(function(arg) {
  return true; 
},"Any");



/* TypeOf-Contracts */

var typeOfNumber = TreatJS.BaseContract(function(arg) {
  return ((typeof arg) === "number");
},"typeOfNumber");

var typeOfString = TreatJS.BaseContract(function(arg) {
  return ((typeof arg) === "string");
},"typeOfString");

var typeOfBoolean = TreatJS.BaseContract(function(arg) {
  return ((typeof arg) === "boolean");
},"typeOfBoolean");

var typeOfObject =  TreatJS.BaseContract(function(arg) {
  return ((typeof arg) === "object");
},"typeOfObject");

var typeOfFunction = TreatJS.BaseContract(function(arg) {
  return ((typeof arg) === "function");
},"typeOfFunction");

var typeOfUndefined = TreatJS.BaseContract(function(arg) {
  return ((typeof arg) === "undefined");
},"typeOfUndefined");


/* InstanceOf-Contracts */

var instanceOfTarget =  TreatJS.BaseContract(function(arg) {
  return (arg instanceof target); 
},"instanceOfTarget");



var instanceOfObject =  TreatJS.With({Object:Object}, TreatJS.BaseContract(function(arg) {
  return (arg instanceof Object); 
},"instanceOfObject"));

var instanceOfFunction =  TreatJS.With({Function:Function}, TreatJS.BaseContract(function(arg) {
  return (arg instanceof Function); 
},"instanceOfFunction"));

var instanceOfArray = TreatJS.With({Array:Array}, TreatJS.BaseContract(function(arg) {
  return (arg instanceof Array);
},"instanceOfArray"));

var instanceOfBoolean = TreatJS.With({Boolean:Boolean}, TreatJS.BaseContract(function(arg) {
  return (arg instanceof Boolean);
},"instanceOfBoolean"));

var instanceOfDate = TreatJS.With({Date:Date}, TreatJS.BaseContract(function(arg) {
  return (arg instanceof Date);
},"instanceOfDate"));

var instanceOfIterator = TreatJS.With({Iterator:Iterator}, TreatJS.BaseContract(function(arg) {
  return (arg instanceof Iterator);
},"instanceOfIterator"));

var instanceOfNumber = TreatJS.With({Number:Number}, TreatJS.BaseContract(function(arg) {
  return (arg instanceof Number);
},"instanceOfNumber"));

var instanceOfString = TreatJS.With({String:String}, TreatJS.BaseContract(function(arg) {
  return (arg instanceof String);
},"instanceOfString"));

var instanceOfRegExp = TreatJS.With({RegExp:RegExp}, TreatJS.BaseContract(function(arg) {
  return (arg instanceof RegExp);
},"instanceOfRegExp"));

var instanceOfError = TreatJS.With({Error:Error}, TreatJS.BaseContract(function(arg) {
  return (arg instanceof Error);
},"instanceOfError"));



/* Is-Contracts */

var isNaN= TreatJS.BaseContract(function(arg) {
  return (arg === NaN);
},"isNaN");

var isUndefined = TreatJS.BaseContract(function(arg) {
  return (arg === undefined);
},"isUndefined");

var isNull = TreatJS.BaseContract(function(arg) {
  return (arg === "boolean");
},"isNull");

var isTrue = TreatJS.BaseContract(function(arg) {
  return (arg) ? true : false; 
},"isTrue");

var isFalse = TreatJS.BaseContract(function(arg) {
  return (arg) ? false : true; 
},"isFalse");



/* Is-Contracts */

var isPrimitiveValue = TreatJS.BaseContract(function(arg) {
  return (target !== Object(target)) ? true : false; 
},"isPrimitiveValue");

var isNativeFunction = TreatJS.BaseContract(function(arg) {
  return (Function.prototype.toString.apply(func).indexOf('[native code]') > -1); 
},"isNativeFunction");
