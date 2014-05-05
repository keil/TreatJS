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

//////////////////////////////////////////////////
// ARRAY FOREACH
//////////////////////////////////////////////////

Array.prototype.foreach = function( callback ) {
  for( var k=0; k<this .length; k++ ) {
    callback( k, this[ k ] );
  }
}

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

Array.prototype.clone = function() {
  return this.slice(0);
};

Array.prototype.clear = function() {
  while (this.length > 0) {
    this.pop();
  }
};

//////////////////////////////////////////////////
// DUMP
//////////////////////////////////////////////////

/* Dump Values to String Output
*/
function __dump(value) {
  if (value === Object(value)) return "[" + typeof value + "]";
  if (typeof value == "string") return "\"" + value + "\"";
  return "" + value;
}


function __define(name, property, target) {
  Object.defineProperty(target, name, {
    get: function () { return property; }
  });
}

//////////////////////////////////////////////////
// OUTPUT
//////////////////////////////////////////////////

var fstWidth = 100;
var sndWidth = 20;
var seperator = ".";

/** Standard Output
*/
function __out(string) {
  putstr(padding_right(string + " ", seperator, fstWidth));
}

/** Notice Output
*/
function __notice(string) {
  putstr(padding_right("... " + string + " ", seperator, fstWidth+sndWidth));
  putstr("\n");
}

/** OK Output
*/
function __ok() {
  putstr(padding_left(" OK", seperator, sndWidth));
  putstr("\n");
}

/** DONE Output
*/
function __done() {
  putstr(padding_left(" DONE", seperator, sndWidth));
  putstr("\n");
}

/** BLANK Output
*/
function __blank() {
  putstr(padding_left(seperator, seperator, sndWidth));
  putstr("\n");
}

/** FAILED Output
*/
function __fail() {
  putstr(padding_left(" FAILED", seperator, sndWidth));
  putstr("\n");
}

/** Sub-Standard Output
*/
function __subout(string) {
  putstr(padding_right("... " + string + " ", seperator, fstWidth));
}
