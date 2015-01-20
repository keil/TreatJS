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

    function inc(key) {
      return (counts[key]) ? (counts[key]=counts[key]+1) : counts[key]=1;
    }

    function reset() {
      counts = new Array();
    }

    function get(key) {
      return (counts[key]) ? counts[key] : 0;
    }

    Object.defineProperties(this, {
      "inc": {
        get: function () { return inc; } }
    });
    Object.defineProperties(this, {
      "reset": {
        get: function () { return reset; } }
    });
    Object.defineProperties(this, {
      "get": {
        get: function () { return get; } }
    });

  }

  // counter flag for top-level contract assertions
  Statistic.prototype.ASSERT = "ASSERT";
  // counter flag for internal contract assertions
  Statistic.prototype.ASSERTWITH = "ASSERTWITH";

  // counter flag for predicate evaluation assertions
  Statistic.prototype.BASE = "BASE";
  // counter flag for sabdbox wrap operations
  Statistic.prototype.MEMBRANE = "MEMBRANE";
  // counter flag for sabdbox decompile operations
  Statistic.prototype.DECOMPILE = "DECOMPILE";

  // counter flag for callback update operations
  Statistic.prototype.CALLBACK = "CALLBACK";

  __define("Statistic", Statistic(), _);

})(TreatJS);
