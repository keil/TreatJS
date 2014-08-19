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

  function TreatJSError(message) {
    this.name = "Error";
    this.message = message || "";

    this.fileName = "TreatJS";
    this.lineNumber = undefined;
    this.columnNumber = undefined;

    this.stack = (new Error).stack;
  }
  TreatJSError.prototype = new Error();
  TreatJSError.prototype.constructor = TreatJSError;

  function TreatJSViolation(message) {
    this.name = "Sandbox Violation";
    this.message = message || "";
    this.stack = (new Error).stack;

    this.fileName = "TreatJS";
    this.lineNumber = undefined;
    this.columnNumber = undefined;

    this.stack = (new Error).stack; 
  }
  TreatJSViolation.prototype = new Error();
  TreatJSViolation.prototype.constructor = TreatJSViolation;

  function TreatJSBlame(contract, message) {
    this.name = "Contract Violation";
    this.message = message || "";

    this.fileName = "TreatJS";
    this.lineNumber = undefined;
    this.columnNumber = undefined;

    this.stack = (new Error).stack; 
  }
  TreatJSBlame.prototype = new Error();
  TreatJSBlame.prototype.constructor = TreatJSBlame;

  // ______                     
  //|  ____|                    
  //| |__   _ __ _ __ ___  _ __ 
  //|  __| | '__| '__/ _ \| '__|
  //| |____| |  | | | (_) | |   
  //|______|_|  |_|  \___/|_|   

  function error(msg, file, line) {
    throw new TreatJSError(msg);
    /*if(_.Debugger && _.Debugger instanceof TreatJSDebugger) {
      _.Debugger.error(msg, file, line);
      } else {
      print("Error (" + file + ":" + line + "):\n" + msg);
      if(_.Config.stackTrace) print(new Error().stack);
      quit();
      }*/
  }

  function violation(msg, file, line) {
    throw new TreatJSViolation(msg);
    /*if(_.Debugger instanceof TreatJSDebugger) {
      _.Debugger.violation(msg, file, line);
      } else {

      print("Violation: (" + file + ":" + line + "):\n" + msg);
      if(_.Config.stackTrace) print(new Error().stack);
      quit();
      }*/
  }

  function blame(contract, msg, file, line) { 
    throw new TreatJSBlame(contract, msg);
    //    quit();
    /*if(_.Debugger instanceof TreatJSDebugger) {
      _.Debugger.blame(contract, msg, file, line);
      } else {

      print("Violation: (" + file + ":" + line + "):\n" + msg);
      print("Violated Contract: " + contract.toString());
      if(_.Config.stackTrace) print(new Error().stack);
      quit();
      }*/
  }

  /**
   * Core Functions
   */

  __define("error", error, _);
  __define("violation", violation, _);
  __define("blame", blame, _);

  __define("TreatJSError", TreatJSError, _);
  __define("TreatJSViolation", TreatJSViolation, _);
  __define("TreatJSBlame", TreatJSBlame, _);

})(TreatJS);
