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
(function(TreatJS) {

  // TreatJS Configuration Flags 
  var Config = new Object();
  // TreatJS Verbose Flags
  var Verbose = new Object();

  //             _                 
  //__ _____ _ _| |__  ___ ___ ___ 
  //\ V / -_) '_| '_ \/ _ (_-</ -_)
  // \_/\___|_| |_.__/\___/__/\___|

  var sandbox = undefined;
  var assert = undefined;
  var statistic = undefined;

  Object.defineProperties(Verbose, {
    "sandbox": {
      get: function () {
        return (sandbox===undefined) ? false : sandbox;
      },
    set: function (arg) {
      sandbox = (sandbox===undefined) ? arg : sandbox;
      return arg;
    },
    enumerable:true
    },
    "assert": {
      get: function () {
        return (assert===undefined) ? false : assert;
      },
    set: function (arg) {
      assert = (assert===undefined) ? arg : assert;
      return arg;
    },
    enumerable:true
    },
    "statistic": {
      get: function () {
        return (statistic===undefined) ? false : statistic;
      },
      set: function (arg) {
        statistic = (statistic===undefined) ? arg : statistic;
        return arg;
      },
      enumerable:true
    }
  });

  //               _    _     
  // ___ _ _  __ _| |__| |___ 
  /// -_) ' \/ _` | '_ \ / -_)
  //\___|_||_\__,_|_.__/_\___|

  // contract assertion
  var assertion = undefined;
  //  sandbox membrane
  var membrane = undefined;
  // decompile functions
  var decompile = undefined;
  // canonicalize contracts
  var canonicalize = undefined;

  Object.defineProperties(Config, {
    "assertion": {
      get: function () {
        return (assertion===undefined) ? true : assertion;
      },
    set: function (arg) {
      assertion = (assertion===undefined) ? arg : assertion;
      return arg;
    },
    enumerable:true
    },
    "membrane": {
      get: function () {
        return (membrane===undefined) ? true : membrane;
      },
    set: function (arg) {
      membrane = (membrane===undefined) ? arg : membrane;
      return arg;
    },
    enumerable:true
    },
    "decompile": {
      get: function () {
        return (decompile===undefined) ? true : decompile;
      },
      set: function (arg) {
        decompile = (decompile===undefined) ? arg : decompile;
        return arg;
      },
      enumerable:true
    },
    "canonicalize": {
      get: function () {
        return (canonicalize===undefined) ? true : canonicalize;
      },
      set: function (arg) {
        canonicalize = (canonicalize===undefined) ? arg : canonicalize;
        return arg;
      },
      enumerable:true
    }});

  //               _     
  // _ __  ___  __| |___ 
  //| '  \/ _ \/ _` / -_)
  //|_|_|_\___/\__,_\___|

  // use newGlobal in sandbox
  var newGlobal = false;

  // pass-through of native functions
  var nativePassThrough = true;

  // pass-through of contracts
  var contractPassThrough = true;

  // print stack trace on error
  var stackTrace = true;

  // call quit
  var quitOnError = true;

  Object.defineProperties(Config, {
    "newGlobal": {
      value: newGlobal, enumerable:true,
    },
    "nativePassThrough": {
      value: nativePassThrough, enumerable:true
    },
    "contractPassThrough": {
      value: contractPassThrough, enumerable:true
    },
    "quitOnError": {
      value: quitOnError, enumerable:true
    },
    "stackTrace": {
      value: stackTrace, enumerable:true
    }
  });

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Config", Config);
  TreatJS.extend("Verbose", Verbose);

})(TreatJS);
