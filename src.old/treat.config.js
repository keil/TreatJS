/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014-2015, Proglang, University of Freiburg.
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

  var Config = new Object();

  //               _    _     
  // ___ _ _  __ _| |__| |___ 
  /// -_) ' \/ _` | '_ \ / -_)
  //\___|_||_\__,_|_.__/_\___|

  // evaluation semantics
  var DEFAULT_SEMANTICS    = TreatJS.LAX;
  // contract assertion
  var DEFAULT_ASSERTION    = true;
  //  sandbox membrane
  var DEFAULT_MEMBRANE     = true;
  // decompile functions
  var DEFAULT_DECOMPILE    = true;
  // canonicalize contracts
  var DEFAULT_CANONICALIZE = true;
  // callback updates
  var DEFAULT_CALLBACK     = true;
  // predicate evaluation
  var DEFAULT_PREDICATE    = true;
  // debug mode
  var DEFAULT_DEBUG        = false;

  Object.defineProperties(Config, {
    "semantics": {
      value: ((TreatJS.configuration.semantics===undefined) ? 
              DEFAULT_SEMANTICS : TreatJS.configuration.semantics), 
        enumerable: true
    },
    "assertion": {
      value: ((TreatJS.configuration.assertion===undefined) ? 
              DEFAULT_ASSERTION : TreatJS.configuration.assertion), 
      enumerable: true
    },
    "membrane":  { 
      value: ((TreatJS.configuration.membrane===undefined) ? 
              DEFAULT_MEMBRANE : TreatJS.configuration.membrane), 
      enumerable: true
    },
    "decompile": {
      value: ((TreatJS.configuration.decompile===undefined) ? 
              DEFAULT_DECOMPILE : TreatJS.configuration.decompile), 
      enumerable: true
    },
    "canonicalize": {
      value: ((TreatJS.configuration.canonicalize===undefined) ? 
              DEFAULT_CANONICALIZE : TreatJS.configuration.canonicalize), 
      enumerable: true
    },
    "callback": {
      value: ((TreatJS.configuration.callback===undefined) ? 
              DEFAULT_CALLBACK : TreatJS.configuration.callback), 
      enumerable: true
    },
    "predicate": {
      value: ((TreatJS.configuration.predicate===undefined) ? 
              DEFAULT_PREDICATE : TreatJS.configuration.predicate), 
      enumerable: true
    },
    "debug": {
      value: ((TreatJS.configuration.debug===undefined) ? 
              DEFAULT_DEBUG : TreatJS.configuration.debug), 
      enumerable: true
    }
  });

  //               _     
  // _ __  ___  __| |___ 
  //| '  \/ _ \/ _` / -_)
  //|_|_|_\___/\__,_\___|

  // max number of polymorphic arguments
  var DEFAULT_MAXARGS = 8;

  // use newGlobal in sandbox
  var DEFAULT_NEWGLOBAL = false;

  // pass-through of native functions
  var DEFAULT_NATIVEPASSTHROUGH = true;

  // pass-through of contracts
  var DEFAULT_CONTRACTPASSTHROUGH = true;

  // print stack trace on error
  var DEFAULT_STACKTRACE = true;

  // call quit
  var DEFAULT_QUITONERROR = true;

  // pass-through of predicate exceptions
  var DEFAULT_EXCEPTIONSPASSTHROUGH = true;

  Object.defineProperties(Config, {
    "maxArgs": {
      value: ((TreatJS.configuration.maxArgs===undefined) ? 
              DEFAULT_MAXARGS : TreatJS.configuration.maxArgs),
        enumerable: true
    },
    "newGlobal": {
      value: ((TreatJS.configuration.newGlobal===undefined) ? 
              DEFAULT_NEWGLOBAL : TreatJS.configuration.newGlobal),
      enumerable: true
    },
    "nativePassThrough":  { 
      value: ((TreatJS.configuration.nativePassThrough===undefined) ? 
              DEFAULT_NATIVEPASSTHROUGH : TreatJS.configuration.nativePassThrough),
      enumerable: true
    },
    "contractPassThrough": {
      value: ((TreatJS.configuration.contractPassThrough===undefined) ? 
              DEFAULT_CONTRACTPASSTHROUGH : TreatJS.configuration.contractPassThrough),
      enumerable: true
    },
    "quitOnError": {
      value: ((TreatJS.configuration.quitOnError===undefined) ? 
              DEFAULT_STACKTRACE : TreatJS.configuration.quitOnError),
      enumerable: true
    },
    "stackTrace": {
      value: ((TreatJS.configuration.stackTrace===undefined) ? 
              DEFAULT_QUITONERROR : TreatJS.configuration.stackTrace), 
      enumerable: true
    },
    "exceptionPassThrough":  { 
      value: ((TreatJS.configuration.exceptionPassThrough===undefined) ? 
              DEFAULT_EXCEPTIONSPASSTHROUGH : TreatJS.configuration.exceptionPassThrough),
      enumerable: true
    }
  });

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Config", Config);

})(TreatJS);
