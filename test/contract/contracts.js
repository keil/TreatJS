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

GreaterThanZero = _.BaseContract(function(arg) {
        return (arg>0);
},"GreaterThanZero");


IsNumber = _.BaseContract(function(arg) {
        return ((typeof arg) === "number");
},"IsNumber");

IsString = _.BaseContract(function(arg) {
        return ((typeof arg) === "string");
},"IsString");

IsBoolean = _.BaseContract(function(arg) {
        return ((typeof arg) === "boolean");
},"IsBoolean");


Any = _.BaseContract(function(arg) {
        return true; 
},"Any");


ContainsToString = _.BaseContract(function(obj) {
        return (obj.hasOwnProperty("toString")) ? true : false;
},"ContainsToString");


AbsLowerThan100 = _.BaseContract(function (val) {
        return (Math.abs(val) < 100)
},"AbsLowerThan100");


True = _.BaseContract(function(arg) {
        return true; 
},"True");

False = _.BaseContract(function(arg) {
        return false; 
},"False");



InstanceOfTarget =  _.BaseContract(function(arg) {
        return (arg instanceof target); 
},"InstanceOfTarget");


InstanceOfObject =  _.With({Object:Object}, _.BaseContract(function(arg) {
        return (arg instanceof Object); 
},"InstanceOfObject"));

InstanceOfFunction =  _.With({Function:Function}, _.BaseContract(function(arg) {
        return (arg instanceof Function); 
},"InstanceOfFunction"));


IsArray = _.With({Array:Array}, _.BaseContract(function(arg) {
        return (arg instanceof Array);
},"IsArray"));
