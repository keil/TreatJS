/*
 *  JavaScript Contracts
 *
 * Copyright (c) 2014, Proglang, University of Freiburg.
 *  http://proglang.informatik.uni-freiburg.de/
 * All rights reserved.
 *
 * Author Matthias Keil
 *  http://www.informatik.uni-freiburg.de/~keilr/
 *
 * $Date: 2014-01-08 15:56:23 +0100 (Wed, 08 Jan 2014) $
 * $Rev: 23677 $
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
