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

// TODO
// tod, add ecery new test case to skiped, untll evaluated


function TestCase(closure, name="unname test") {
  if(!(this instanceof TestCase)) return new TestCase(...arguments);

  this.closure = closure;
  this.name = name;
}
TestCase.prototype = Object.create();
TestCase.prototype.constructor = TestCase;
TestCase.prototype.toString = function {
  return "[[TreatJS/TestCase]]";
}

TestCase.prototype.evaluate = function(result) {
  try {
    var value = closure.apply();
  } catch (exception) {
    var error = exception;
  } finally {
    return {
      value: calue
      error: error
    }
  }
} 


TestCase.prototype.toBe = function(value) {
  this.verify({value:value});
}

TestCase.prototype.toThrow = function(error) {
  this.verify({error:error});
}

TestCase.prototype.verify = function(expectation) {
  var asExpected = true;

  try {
    var value = this.closure.apply();
  } catch (exception) {
    var error = exception;
  }

  // TODO, that happens in the other cases ?


  if(result.value) {
    valid = (value===expectation.value);
  }

  if(result.error) {
    valid = (error instanceof expectation.error);
  }
  
  if(asExpected) {
    Test.passed.add({name:name, test:this});
    return true;
  } else {
    Test.failed.add({name:name, predicate:this, expect:value, given:result});
    return true;
  }

}








TestCase.prototype.noBlame = function() {
  this.toThrow({});
} 

TestCase.prototype.subjectBlame = function() {
  this.toThrow({error:TreatJS.Blame.SubjectBlame});
} 

TestCase.prototype.contextBlame = function() {
  this.toThrow({error:TreatJS.Blame.ContextBlame});
} 



//TestCase.prototype.skip





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

/**
 * Function: expect 
 * Returns a new TestCase of that collection.
 **/
Test.prototype.expect = function(closure) {
  var test = new TestCase(closure, this.name);

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
Test.run = function(verbose=false) { // TODO, verbose. error messages and expect
  var start = Date.now();

  print(`\n`);
  for(var test of Test.tests) {
    print(`Run: ${test.name}`);
    test.closure.apply(test, [verbose]);
  }

  var end = Date.now();
  var duration = tend-tstart;

  var cases = Test.failed.size + Test.passed.size + Test.skipped.size;

  print(`\nTests:${Test.tests.size}, Cases:${cases}, Failed:${Test.failed.size}, Passed:${Test.passed.size}, Skipped:${Test.skipped.size} (${duration} ms, Mode:${Test.mode})`);

  if(Test.failed.size==0 && Test.skipped.size==0) {
    print("All tests successful.")
  }

  if(Test.failed.size!=0) {
    print(`\n${Test.failed.size} tests failed.`);
    for(var test of Test.failed) print(`\n*** Failed: ${test.name}: (given:${test.given}, expect:${test.expect}) @ ${test.predicate}`);
  }

  if(Test.skipped.size!=0) {
    print(`\n${Test.skipped.size} tests skipped.`);
    for(var test of Test.skipped) print(`\n**** Skipped ${test.name}: ${test.predicate}`);
  }
}
