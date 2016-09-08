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

print("Object 1 ==========");

(function() {

  // test oject

  function X() {
  }

  function A() {
  }
  A.prototype = {};

  function B() {
  }
  B.prototype = new A();

  function C() {
  }
  C.prototype = new B();

  var c = new C();

  print("= " + (c instanceof C));
  print("= " + (c instanceof B));
  print("= " + (c instanceof A));
  print("= " + (c instanceof X));

  var d = TreatJS.clone(c);

  print("= " + (d instanceof C));
  print("= " + (d instanceof B));
  print("= " + (d instanceof A));
  print("= " + (d instanceof X));

})();

print("Object 2 ==========");

(function() {

  // test oject

  function X() {
  }

  function A() {
  }
  A.prototype = {};

  function B() {
  }
  B.prototype = Object.create(A.prototype);

  function C() {
  }
  C.prototype = Object.create(B.prototype);

  var c = new C();

  print("= " + (c instanceof C));
  print("= " + (c instanceof B));
  print("= " + (c instanceof A));
  print("= " + (c instanceof X));

  var d = TreatJS.clone(c);

  print("= " + (d instanceof C));
  print("= " + (d instanceof B));
  print("= " + (d instanceof A));
  print("= " + (d instanceof X));

})();

print("Function 1 ==========");

(function() {

  // test function 

  function X() {
  }

  function A() {
  }
  A.prototype = {};

  function B() {
  }
  B.prototype = new A();

  function C() {
  }
  C.prototype = new B();

  var c = new C();

  print("= " + (c instanceof C));
  print("= " + (c instanceof B));
  print("= " + (c instanceof A));
  print("= " + (c instanceof X));

  var D = TreatJS.clone(C);
  var d = new D();

  print("= " + (d instanceof D));
  print("= " + (d instanceof B));
  print("= " + (d instanceof A));
  print("= " + (d instanceof X));

})();

print("Function 2 ==========");

(function() {

  // test function 

  function X() {
  }

  function A() {
  }
  A.prototype = {};

  function B() {
  }
  B.prototype = Object.create(A.prototype)

  function C() {
  }
  C.prototype = Object.create(B.prototype)

  var c = new C();

  print("= " + (c instanceof C));
  print("= " + (c instanceof B));
  print("= " + (c instanceof A));
  print("= " + (c instanceof X));

  var D = TreatJS.clone(C);
  var d = new D();

  print("= " + (d instanceof D));
  print("= " + (d instanceof B));
  print("= " + (d instanceof A));
  print("= " + (d instanceof X));

})();
