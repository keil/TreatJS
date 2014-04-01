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

GreaterThanZero = $.BaseContract(function(arg) {
        return (arg>0);
},"GreaterThanZero");


IsNumber = $.BaseContract(function(arg) {
        return ((typeof arg) === "number");
},"IsNumber");

IsString = $.BaseContract(function(arg) {
        return ((typeof arg) === "string");
},"IsString");

IsBoolean = $.BaseContract(function(arg) {
        return ((typeof arg) === "boolean");
},"IsBoolean");


Any = $.BaseContract(function(arg) {
        return true; 
},"Any");


ContainsToString = $.BaseContract(function(obj) {
        return (obj.hasOwnProperty("toString")) ? true : false;
},"ContainsToString");


AbsLowerThan100 = $.BaseContract(function (val) {
        return (Math.abs(val) < 100)
},"AbsLowerThan100");


True = $.BaseContract(function(arg) {
        return true; 
},"True");

False = $.BaseContract(function(arg) {
        return false; 
},"False");



InstanceOfTarget =  $.BaseContract(function(arg) {
        return (arg instanceof target); 
},"InstanceOfTarget");


InstanceOfObject =  $.With({Object:Object}, $.BaseContract(function(arg) {
        return (arg instanceof Object); 
},"InstanceOfObject"));

InstanceOfFunction =  $.With({Function:Function}, $.BaseContract(function(arg) {
        return (arg instanceof Function); 
},"InstanceOfFunction"));


IsArray = $.With({Array:Array}, $.BaseContract(function(arg) {
        return (arg instanceof Array);
},"IsArray"));
