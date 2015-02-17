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
(function(TreatJS) {

  // out
  var error = TreatJS.error;
  var violation = TreatJS.violation;
  var blame = TreatJS.blame;

  //__   __        _      _    _     
  //\ \ / /_ _ _ _(_)__ _| |__| |___ 
  // \ V / _` | '_| / _` | '_ \ / -_)
  //  \_/\__,_|_| |_\__,_|_.__/_\___|

  function Variable() {
    if(!(this instanceof Variable)) return new Variable();
  }
  Variable.prototype = {};
  Variable.prototype.toString = function() {
    return "$"+this.id; 
  }

  // generates a fresh id for each variable 
  Object.defineProperty(Variable.prototype, "id", {
    get: (function() {
      var i = 0;

      function makeID() {
        i = i+1;
        return i;
      }

      return function() {
        var id = makeID();
        Object.defineProperty(this, "id", {value: id});
        return id;
      };
    })()
  });

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Variable", {});

  TreatJS.define(TreatJS.Variable, "Variable", Variable);

})(TreatJS);
