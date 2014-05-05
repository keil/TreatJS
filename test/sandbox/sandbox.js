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

this.x = 1;
this.y = 2;
this.z = 3;

var a = 1;
var b = 2;
var c = 3;

var o = {
  p:4711,
  q:function() {
    // this.p=4712; violation
    return this.p;
  }
};

function n() {
  this.p = 4711;
  //this.p = breakout; // violation
  this.q = function() {
    // breakout(); // violation
    this.p=4712; // ok 
    return this.p;
  }
}


function breakout() {
  // print("@@@@@@@@@@@@@@@@@@@@" + this.x);
} 


function f() {

  // this.x; // violation
  //  this.y=2; // violation

  //  a; // violation
  //  print("@@@" + b);

  //b=2; // violation

  var u=1; // ok
  u; // ok

  z; // ok
  this.z; // ok

  c; // ok
  this.c; // ok

  // Math.abs(4711); // violation

  // print("@" + (c===this.c));

  // print("@" + z);
  // print("@" + this.z);

  // print("@" + c);
  // print("@" + this.c);

  o;
  o.p;
  o.q();

  var nprime = new n(); // violation
  nprime.p;
  nprime.q();
  nprime.p=4712;

  return g();
}

function g(flag) {
  //  this.x; // violation
  //  this.y=2; // violation

  // a; // violation
  // b=2; // violation

  // var u=1; // ok
  // u; // ok

  z; // ok
  this.z; // ok

  c; // ok
  this.c; // ok

  //  Math.abs(4711); // violation

  // f(); // violation

  if(flag!=true) g(true);

  return h();
}

function h() {

  //  this.x; // violation
  // this.y=2; // violation

  //   a; // violation
  //  b=2; // violation

  var u=1; // ok
  u; // ok

  z; // ok
  this.z; // ok

  c; // ok
  this.c; // ok

  var result = true;
  function hprime() {
    //print("#######################################");
    return result;
  }
  return hprime();
}




var x = {z:z, c:c, g:g, h:h, o:o, n:n, print:print}; // allowed values
var result = _.eval(f, x);
//print(result);

//print(f());
//
