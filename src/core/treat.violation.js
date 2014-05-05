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

  // ______                     
  //|  ____|                    
  //| |__   _ __ _ __ ___  _ __ 
  //|  __| | '__| '__/ _ \| '__|
  //| |____| |  | | | (_) | |   
  //|______|_|  |_|  \___/|_|   

  function error(msg, file, line) {
    if(_.Debugger && _.Debugger instanceof TreatJSDebugger) {
      _.Debugger.error(msg, file, line);
    } else {
      print("Error (" + file + ":" + line + "):\n" + msg);
      if(_.Config.stackTrace) print(new Error().stack);
      quit();
    }
  }

  function violation(msg, file, line) {
    if(_.Debugger instanceof TreatJSDebugger) {
      _.Debugger.violation(msg, file, line);
    } else {

      print("Violation: (" + file + ":" + line + "):\n" + msg);
      if(_.Config.stackTrace) print(new Error().stack);
      quit();
    }
  }

  function blame(contract, msg, file, line) {
    if(_.Debugger instanceof TreatJSDebugger) {
      _.Debugger.blame(contract, msg, file, line);
    } else {

      print("Violation: (" + file + ":" + line + "):\n" + msg);
      print("Violated Contract: " + contract.toString());
      if(_.Config.stackTrace) print(new Error().stack);
      quit();
    }
  }

  /**
   * Core Functions
   */

  __define("error", error, _);
  __define("violation", violation, _);
  __define("blame", blame, _);

})(_);
