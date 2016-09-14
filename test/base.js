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

// _____       _    ___              
//|_   _|__ __| |_ / __|__ _ ___ ___ 
//  | |/ -_|_-<  _| (__/ _` (_-</ -_)
//  |_|\___/__/\__|\___\__,_/__/\___|

/**
 * Constructor: TestCase
 * Constructor function for test cases.
 **/
function TestCase(test, closure) {
  if(!(this instanceof TestCase)) return new TestCase(...arguments);

  this.closure = closure;
  this.test = test;
}
TestCase.prototype = {};
TestCase.prototype.constructor = TestCase;

/**
 * Function: toString
 **/
TestCase.prototype.toString = function() {
  return "[[TreatJS/TestCase]]";
}

/**
 * Function: toBe
 * Evaluates a test case and tests for a value.
 **/
TestCase.prototype.toBe = function(value) {  
  try {
    var result = this.closure.apply();
  } catch (error) {
    var result = error;
  } finally {
  }

  if(result === value) {
    Test.skipped.delete(this);
    Test.passed.add({name:this.test.name, testcase:this});
    return true;
  } else {
    Test.skipped.delete(this);
    Test.failed.add({name:this.test.name, testcase:this, expect:value, given:result});
    return true;
  }
}

/**
 * Function: toThrow
 * Evaluates a test case and tests for an error.
 **/
TestCase.prototype.toThrow = function(error) {
  try {
    this.closure.apply();
  } catch (error) {
    var result = error;
    print(error);
  } finally {
  }

  if((result === error) || (error && (result instanceof error))) {
    Test.skipped.delete(this);
    Test.passed.add({name:this.test.name, testcase:this});
    return true;
  } else {
    Test.skipped.delete(this);
    Test.failed.add({name:this.test.name, testcase:this, expect:(error ? error.name : "No error"), given:(result ? result.name : "No error")});
    return true;
  }
}

/**
 * Function: noBlame
 * Predefined result.
 **/
TestCase.prototype.noBlame = function() {
  this.toThrow();
} 

/**
 * Function: subjectBlame
 * Predefined result.
 **/
TestCase.prototype.subjectBlame = function() {
  this.toThrow(TreatJS.Blame.PositiveBlame);
} 

/**
 * Function: contextBalme
 * Predefined result.
 **/
TestCase.prototype.contextBlame = function() {
  this.toThrow(TreatJS.Blame.NegativeBlame);
} 

// _____       _   
//|_   _|__ __| |_ 
//  | |/ -_|_-<  _|
//  |_|\___/__/\__|

/**
 * Constructor: Test
 * Constructor function for test collections.
 **/
function Test(name, closure) {
  if(!(this instanceof Test)) return new Test(...arguments);

  this.name = name;
  this.closure = closure;

  Test.tests.add(this);
}
Test.prototype = {};
Test.prototype.constructor = Test;

/**
 * Function: toString
 **/
Test.prototype.toString = function() {
  return "[[TreatJS/Test]]";
}

/**
 * Function: expect 
 * Returns a new TestCase of this collection.
 **/
Test.prototype.expect = function(closure) {
  var test = new TestCase(this, closure);
  Test.skipped.add(test);
  return test;
}

/**
 * Lists of all tests
 **/
Test.tests = new Set();

/**
 * Lists of all test cases
 **/
Test.failed  = new Set();
Test.skipped = new Set();
Test.passed  = new Set();

/**
 * Runs the created test tests 
 **/
Test.run = function(verbose=false) {
  var start = Date.now();

  print(`\n`);
  for(var test of Test.tests) {
    print(`Run: ${test.name}`);
    test.closure.apply(test, [verbose]);
  }

  var end = Date.now();
  var duration = end-start;

  var cases = Test.failed.size + Test.passed.size + Test.skipped.size;

  print(`\nTests:${Test.tests.size}, Cases:${cases}, Failed:${Test.failed.size}, Passed:${Test.passed.size}, Skipped:${Test.skipped.size} (${duration} ms)`);

  if(Test.failed.size==0 && Test.skipped.size==0) {
    print("All tests successful.")
  }

  if(Test.failed.size!=0) {
    print(`\n${Test.failed.size} tests failed.`);
    for(var test of Test.failed) {
      print(`\n*** Failed: ${test.name}: (given:${test.given}, expect:${test.expect}) @ ${test.testcase.test.name}`);
      if(verbose) print("*** Testcase:", test.testcase.closure);
      if(verbose && test.given.stack) print("*** Stack:", test.given.stack);
    }
  }

  if(Test.skipped.size!=0) {
    print(`\n${Test.skipped.size} tests skipped.`);
    for(var test of Test.skipped) {
      print(`\n**** Skipped ${test.name} @ ${test.name}`);
      if(verbose) print("*** Testcase:", test.closure);
    }
  }
}
