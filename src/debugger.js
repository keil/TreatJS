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

function TreatJSDebugger() {
  if(!(this instanceof TreatJSDebugger)) return new TreatJSDebugger();

  // TODO
  this.catch = function(result) {
  }

  this.error = function(msg, file, line) {}
  this.violation = function(msg, file, line) {}
  this.blame = function(contract, msg, file, line) {}
}

function TreatJSDebuggerUnit() {
  if(!(this instanceof TreatJSDebugger)) return new TreatJSDebugger();
  else TreatJSDebugger.call(this);

  var errorStack = new Array();
  var violationStack = new Array();
  var blameStack = new Array();

  this.error = function(msg, file, line) {
    errorStack.push("Error (" + file + ":" + line + "):\n" + msg);
  }
  this.violation = function(msg, file, line) {
    violationStack.push("Error (" + file + ":" + line + "):\n" + msg);
  }

  this.blame = function(contract, msg, file, line) {
    blameStack.push(
        ("Violation: (" + file + ":" + line + "):\n" + msg) + "\n" +
        ("Violated Contract: " + contract.toString())
        );
  }

  function assertTrue(stack) {
    var result = stack.pop();

    if(!result) {
      print(new Error().stack);
      quit();
    }
    clear(stack);
  }

  function assertFalse(stack) {
    var result = stack.pop();

print("RESULT " + result);

    if(!result) {
      print(new Error().stack);
      quit();
    } else {
      print("" + result);
    }
    clear(stack);
  }

  function clear(stack) {
    while(stack.length > 0) {
      stack.pop();
    }
  }

  this.assertNoError = function() {
    assertTrue(errorStack);
  }
  this.assertError = function() {
    assertFalse(errorStack);
  }

  this.assertNoViolation = function() {
    assertTrue(violationStack);
  }
  this.assertViolation = function() {
    assertFalse(violationStack);
  }

  this.assertNoBlame = function() {
    assertTrue(blameStack);
  }
  this.assertBlame = function() {
    assertFalse(blameStack);
  }

}
TreatJSDebuggerUnit.prototype = new TreatJSDebugger();
