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

var IsNumber = _.BaseContract(function(arg) {
  return ((typeof arg) === "number");
},"IsNumber");

var IsString = _.BaseContract(function(arg) {
  return ((typeof arg) === "string");
},"IsString");

var IsBoolean = _.BaseContract(function(arg) {
  return ((typeof arg) === "boolean");
},"IsBoolean");



var IsNaN= _.BaseContract(function(arg) {
  return (arg === NaN);
},"IsNaN");

var IsUndef = _.BaseContract(function(arg) {
  return (arg === undefined);
},"IsUndef");

var IsNull = _.BaseContract(function(arg) {
  return (arg === "boolean");
},"IsNull");




var Any = _.BaseContract(function(arg) {
  return true; 
},"Any");

var True = _.BaseContract(function(arg) {
  return (arg) ? true : false; 
},"True");

var False = _.BaseContract(function(arg) {
  return (arg) ? false : true; 
},"False");




var Isbject =  _.With({Object:Object}, _.BaseContract(function(arg) {
  return (arg instanceof Object); 
},"InstanceOfObject"));

var IsFunction =  _.With({Function:Function}, _.BaseContract(function(arg) {
  return (arg instanceof Function); 
},"InstanceOfFunction"));

var IsArray = _.With({Array:Array}, _.BaseContract(function(arg) {
  return (arg instanceof Array);
},"IsArray"));



var ContainsToString = _.BaseContract(function(obj) {
  return (obj.hasOwnProperty("toString")) ? true : false;
},"ContainsToString");


var GreaterThanZero = _.BaseContract(function(arg) {
  return (arg>0);
},"GreaterThanZero");


var AbsLowerThan100 = _.BaseContract(function (val) {
  return (Math.abs(val) < 100)
},"AbsLowerThan100");



var InstanceOfTarget =  _.BaseContract(function(arg) {
  return (arg instanceof target); 
},"InstanceOfTarget");


var InstanceOfObject =  _.With({Object:Object}, _.BaseContract(function(arg) {
  return (arg instanceof Object); 
},"InstanceOfObject"));

var InstanceOfFunction =  _.With({Function:Function}, _.BaseContract(function(arg) {
  return (arg instanceof Function); 
},"InstanceOfFunction"));


var IsArray = _.With({Array:Array}, _.BaseContract(function(arg) {
  return (arg instanceof Array);
},"IsArray"));
