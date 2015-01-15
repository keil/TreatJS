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


function TreatJSStatistics() {
  if(!(this instanceof TreatJSStatistics)) return new TreatJSStatistics();

  var counts = new Array();

  this.inc = function(key) {
    return (counts[key]) ? (counts[key]=counts[key]+1) : counts[key]=1;
  }

  this.reset = function() {
    counts = new Array();
  }

  this.get = function(key) {
    return counts[key];
  }

  this.print = function () {

    if(_.Config.Verbose.statistic) {
      __out(padding_right("TreatJS Statistics ", ".", 30));
      __blank();
    }

    function log(msg, value) {
      if(_.Config.Verbose.statistic) {
        __subout(padding_right(msg + " ", ".", 30) + padding_left(value + "", " ", 9));
        __blank();
      }
    }

    log("#" + this.ASSERT + " = ", counts[this.ASSERT]);
    log("#" + this.BASE + " = ", counts[this.BASE]);
  }
}

TreatJSStatistics.prototype.ASSERT = "ASSERT";
TreatJSStatistics.prototype.BASE = "BASE";
