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

  function TreatJSError(message) {
    this.name = "Error";
    this.message = message || "";

    this.fileName = "TreatJS";
    this.lineNumber = undefined;
    this.columnNumber = undefined;

    if(TreatJS.Config.stackTrace) this.stack = (new Error).stack;
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

    if(TreatJS.Config.stackTrace) this.stack = (new Error).stack; 
  }
  TreatJSViolation.prototype = new TreatJSError();
  TreatJSViolation.prototype.constructor = TreatJSViolation;

  function TreatJSBlame(contract, blamed, message) {
    this.name = "Contract Violation";
    this.blamed = blamed;
    this.message = message || "";

    this.fileName = "TreatJS";
    this.lineNumber = undefined;
    this.columnNumber = undefined;

    if(TreatJS.Config.stackTrace) this.stack = (new Error).stack; 
  }
  TreatJSBlame.prototype = new TreatJSError();
  TreatJSBlame.prototype.constructor = TreatJSBlame;

  TreatJSBlame.SUBJECT = "CALLEE";
  TreatJSBlame.CONTEXT = "CALLER";

  // ______                     
  //|  ____|                    
  //| |__   _ __ _ __ ___  _ __ 
  //|  __| | '__| '__/ _ \| '__|
  //| |____| |  | | | (_) | |   
  //|______|_|  |_|  \___/|_|   

  function error(msg, file, line) {
    var error =  new TreatJSError(msg + "\n" + file + "\n" + line);

    if(TreatJS.Config.quitOnError) {
      print(error);
      print(error.stack);
      quit();
    } else {
      throw error;
    }
  }

  function violation(msg, file, line) {
    var error =  new TreatJSViolation(msg + "\n" + file + "\n" + line);

    if(TreatJS.Config.quitOnError) {
      print(error);
      print(error.stack);
      quit();
    } else {
      throw error;
    }
  }

  function blame(contract, blamed, msg, file, line) {
    var error = new TreatJSBlame(contract, blamed, msg + "\n" + file + "\n" + line);

    if(TreatJS.Config.quitOnError) {
      print(error);
      print(error.stack);
      quit();
    } else {
      throw error;
    }
  }

  /**
   * expand
   */

  TreatJS.extend("error", error);
  TreatJS.extend("violation", violation);
  TreatJS.extend("blame", blame);

  TreatJS.extend("Error", {});

  TreatJS.define(TreatJS.Error, "TreatJSError", TreatJSError);
  TreatJS.define(TreatJS.Error, "TreatJSViolation", TreatJSViolation);
  TreatJS.define(TreatJS.Error, "TreatJSBlame", TreatJSBlame);

})(TreatJS);
