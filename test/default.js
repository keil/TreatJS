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

// ==================================================

// subset semantics
// run("test/callback/subset.js");

// ==================================================

// f : [[Even]->Even] -> Even \cap [[Pos]->Pos] -> Pos
function f ( g ) {
  // g : [Even]->Even \cup [Pos]->Pos] 
  // x : Even \cap Pos
  g(x); 
}





// plus : [Num,Num] -> Num \cap [Str,Str]-> Str 
function plus (x, y) {
  return (x+y);
}

// tets: [[Num,Num] -> Num] -> Num 
function test (plus) {
  return plus(1,2)
}


// add1 : [([Num,Num] -> Num), Num
function add1(plus, x) {
  return plus(x, 1);
}

// inc : 
function inc (add1) {
  return add1(plus);
}



// ==================================================

TreatJS.Statistic.print();

// ==================================================

quit();
