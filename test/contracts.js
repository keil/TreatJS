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

(function(_) {

  var Contracts = [];
  __define("Contracts", Contracts, _);

  function __regeister (name, contract, classid) {
    var id = (classid || "Miscellaneous");

    if (Contracts[id] == undefined) Contracts[id] = [];

    Contracts[id][name] = contract;
    __define(name, contract, this);
  }

  /**
   * Predefined Contarcts
   */

  var Any = TreatJS.BaseContract(function(arg) {
    return true; 
  },"Any");

  __regeister("Any", Any, "Miscellaneous");

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

  __regeister("typeOfNumber", typeOfNumber, "typeOf - Contracts");
  __regeister("typeOfString", typeOfString, "typeOf - Contracts");
  __regeister("typeOfBoolean", typeOfBoolean, "typeOf - Contracts");
  __regeister("typeOfObject", typeOfObject, "typeOf - Contracts");
  __regeister("typeOfFunction", typeOfFunction, "typeOf - Contracts");
  __regeister("typeOfUndefined", typeOfUndefined, "typeOf - Contracts");

  /* InstanceOf-Contracts */

  var instanceOfTarget =  TreatJS.BaseContract(function(arg) {
    return (arg instanceof target); 
  },"instanceOfTarget");

  __regeister("instanceOfTarget", instanceOfTarget, "instanceOf - Contracts");



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

  __regeister("instanceOfObject", instanceOfObject, "instanceOf - Contracts");
  __regeister("instanceOfFunction", instanceOfFunction, "instanceOf - Contracts");
  __regeister("instanceOfArray", instanceOfArray, "instanceOf - Contracts");
  __regeister("instanceOfBoolean", instanceOfBoolean, "instanceOf - Contracts");
  __regeister("instanceOfDate", instanceOfDate, "instanceOf - Contracts");
  __regeister("instanceOfIterator", instanceOfIterator, "instanceOf - Contracts");
  __regeister("instanceOfNumber", instanceOfNumber, "instanceOf - Contracts");
  __regeister("instanceOfString", instanceOfString, "instanceOf - Contracts");
  __regeister("instanceOfRegExp", instanceOfRegExp, "instanceOf - Contracts");
  __regeister("instanceOfError", instanceOfError, "instanceOf - Contracts");



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

  __regeister("isNaN", isNaN, "is - Contracts");
  __regeister("isUndefined", isUndefined, "is - Contracts");
  __regeister("isNull", isNull, "is - Contracts");
  __regeister("isTrue", isTrue, "is - Contracts");
  __regeister("isFalse", isFalse, "is - Contracts");



  /* Is-Contracts */

  var isPrimitiveValue = TreatJS.BaseContract(function(arg) {
    return (target !== Object(target)) ? true : false; 
  },"isPrimitiveValue");

  var isNativeFunction = TreatJS.BaseContract(function(arg) {
    return (Function.prototype.toString.apply(func).indexOf('[native code]') > -1); 
  },"isNativeFunction");

  __regeister("isPrimitiveValue", isPrimitiveValue, "is - Contracts");
  __regeister("isNativeFunction", isNativeFunction, "is - Contracts");



  /* Miscellaneous */

  var Even = TreatJS.BaseContract(function(arg) {
    return (arg % 2 === 0);
  },"even");

  var Odd = TreatJS.BaseContract(function(arg) {
    return (arg % 2 === 1);
  },"odd");

  var Pos = TreatJS.BaseContract(function(arg) {
    return (arg > 0);
  },"even");

  var Neg = TreatJS.BaseContract(function(arg) {
    return (arg < 0);
  },"even");

  __regeister("Even", Even, "Miscellaneous");
  __regeister("Odd", Odd, "Miscellaneous");
  __regeister("Pos", Pos, "Miscellaneous");
  __regeister("Neg", Neg, "Miscellaneous");

})(TreatJS);
