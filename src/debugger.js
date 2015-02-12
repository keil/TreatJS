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

function TreatJSDebugger() {
  if(!(this instanceof TreatJSDebugger)) return new TreatJSDebugger();
}

TreatJSDebugger.prototype.configtest = function() {
  if(TreatJS.Config.quitOnError!==false) throw new Error("Invalid Configuration!");
} 

TreatJSDebugger.prototype.assertNoBlame = function(fun) {
  this.configtest();

  try {
    fun()
  } catch (err) {
    throw new Error("Failure: No-Blame expected!" + "\n" + err.toString());
  }
  return undefined;
}

TreatJSDebugger.prototype.assertContextBlame = function(fun) {
  this.configtest();

  try {
    fun()
  } catch (err) {
    if(err.blamed!==TreatJS.Error.TreatJSBlame.CONTEXT)
      throw new Error("Failure: Context-Blame expected!" + "\n" + err.toString());
    return undefined;
  }
  throw new Error("Failure: Context-Blame expected!");
}

TreatJSDebugger.prototype.assertSubjectBlame = function(fun) {
  this.configtest();

  try {
    fun()
  } catch (err) {
    if(err.blamed!==TreatJS.Error.TreatJSBlame.SUBJECT)
      throw new Error("Failure: Subject-Blame expected!" + "\n" + err.toString());
    return undefined;
  }
  throw new Error("Failure: Subject-Blame expected!");
}
