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

// Note: Still Testing Code

function TreatJSStatistics() {
  if(!(this instanceof TreatJSStatistics)) return new TreatJSStatistics();

  var counts = new Array();

  this.inc = function(key) {
    return (counts[key]) ? (counts[key]++) : counts[key]=0;
  }

  this.reset = function() {
    counts = new Array();
  }

  this.get = function(key) {
    return counts[key];
  }

  this.print = function (out) {
    counts.foreach(function(key, value) {
      out("#" + key + " = " + value);
    })
  }
}

TreatJSStatistics.prototype.ASSERTION = "ASSERTION";

TreatJSStatistics.prototype.BASE = "BASE";

TreatJSStatistics.prototype.FUNCTION = "FUNCTION";
TreatJSStatistics.prototype.DEPENDENT = "DEPENDENT";
TreatJSStatistics.prototype.OBJECT = "OBJECT";

TreatJSStatistics.prototype.INTERSECTION = "INTERSECTION";
TreatJSStatistics.prototype.UNION = "UNION";

TreatJSStatistics.prototype.AND = "AND";
TreatJSStatistics.prototype.OR = "OR";
TreatJSStatistics.prototype.NOT = "NOT";

TreatJSStatistics.prototype.WITH = "WITH";


// COPNSTRUCTOR
