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
(function(TreatJS) {

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
      "inc": { value: inc }
    });
    Object.defineProperties(this, {
      "reset": { value: reset }
    });
    Object.defineProperties(this, {
      "get": { value: get }
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

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Statistic", (new Statistic()));

})(TreatJS);
