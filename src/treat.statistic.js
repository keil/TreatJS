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
(function(_) {

  function Statistic() {
    if(!(this instanceof Statistic)) return new Statistic();

    var counts = new Array();

    this.inc = function(key) {
      return (counts[key]) ? (counts[key]=counts[key]+1) : counts[key]=1;
    }

    this.reset = function() {
      counts = new Array();
    }

    this.get = function(key) {
      return (counts[key]) ? counts[key] : 0;
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

      log("#" + this.ASSERT + " = ", this.get(this.ASSERT));
      log("#" + this.ASSERTWITH + " = ", this.get(this.ASSERTWITH));
      log("#" + this.BASE + " = ", this.get(this.BASE));
      log("#" + this.DECOMPILE + " = ", this.get(this.DECOMPILE));
      log("#" + this.CALLBACK + " = ", this.get(this.CALLBACK));
    }
  }

  // counter flag for top-level contract assertions
  Statistic.prototype.ASSERT = "ASSERT";
  // counter flag for internal contract assertions
  Statistic.prototype.ASSERTWITH = "ASSERTWITH";

  // counter flag for predicate evaluation assertions
  Statistic.prototype.BASE = "BASE";
  // counter flag for sabdbox decompile operations
  Statistic.prototype.DECOMPILE = "DECOMPILE";

  // counter flag for callback update operations
  Statistic.prototype.CALLBACK = "CALLBACK";

  __define("Statistic", Statistic(), _);

})(TreatJS);
