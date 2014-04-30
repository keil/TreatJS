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

function TreatJSOut() {
  if(!(this instanceof TreatJSOut)) return new TreatJSOut();

  /** log(msg)
   * @param msg String message
   */ 
  this.logAssert = function(msg, target) {
  }

  /** log(msg)
   * @param msg String message
   */ 
  this.logSandbox = function(msg, target) {
  }
}


function TreatJSShellOut(sysout) {
  if(!(this instanceof TreatJSShellOut)) return new TreatJSShellOut(sysout);

  /** log(msg)
   * @param msg String message
   */ 
  this.assert = function(msg, target) {
    if(_.Config.Verbose.assert) {
      __out(padding_right(msg + " ", ".", 30));
      __blank();
      __out(((target!=undefined)?" "+target:""));
      __blank();
    }
  }

  /** log(msg)
   * @param msg String message
   */ 
  this.sandbox = function(msg, target) {
    if(_.Config.Verbose.sandbox) {
      __out(padding_right(msg + " ", ".", 30) + ((target!=undefined)?" "+target:""));
      __blank();
    }
  }
}
TreatJSShellOut.prototype = new TreatJSOut()
