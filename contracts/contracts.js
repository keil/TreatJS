/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014-2016, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */

//  _____            _                  _       
// / ____|          | |                | |      
//| |     ___  _ __ | |_ _ __ __ _  ___| |_ ___ 
//| |    / _ \| '_ \| __| '__/ _` |/ __| __/ __|
//| |___| (_) | | | | |_| | | (_| | (__| |_\__ \
// \_____\___/|_| |_|\__|_|  \__,_|\___|\__|___/

/**
 * This files instantiates a number of predefined contracts. 
 * All contracts are typically collected in the `_` obejct
 * part of the `_` object 
 */



var Contracts = Contracts || (function(Contract) {




  this.Any = Contract.Base(function(arg) {
    return true; 
  },"Any");


  this.typeUndefined = Contract.Base(function(arg) {
    return ((typeof arg) === "undefined");
  },"typeUndefined");

  this.typeObject =  Contract.Base(function(arg) {
    return ((typeof arg) === "object");
  },"typeObject");

  this.typeBoolean = Contract.Base(function(arg) {
    return ((typeof arg) === "boolean");
  },"typeBoolean");

  this.typeNumber = Contract.Base(function(arg) {
    return ((typeof arg) === "number");
  },"typeNumber");

  this.typeString = Contract.Base(function(arg) {
    return ((typeof arg) === "string");
  },"typeString");
  
  this.typeSymbol = Contract.Base(function(arg) {
    return ((typeof arg) === "symbol");
  },"typeSymbol");

  this.typeFunction = Contract.Base(function(arg) {
    return ((typeof arg) === "function");
  },"typeFunction");





  return Contracts;

}).apply({}, [Contract]);
