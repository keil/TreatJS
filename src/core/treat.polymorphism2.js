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

  // core contracts
  var ImmediateContract = TreatJS.Core.Immediate;
  var DelayedContract = TreatJS.Core.Delayed;
  var CombinatorContract = TreatJS.Core.Combinator;
  var WrapperContract = TreatJS.Core.Wrapper;

  // TreatJS Output
  var logoutput = TreatJS.output;

  /** log(msg)
   * @param msg String message
   */ 
  function log(msg, target) {
    if(TreatJS.Verbose.assert) {
      logoutput.log(logoutput.ASSERT, msg, target);
    }
  }

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

  // ___         _                            _   
  //| __|_ ___ _(_)_ _ ___ _ _  _ __  ___ _ _| |_ 
  //| _|| ' \ V / | '_/ _ \ ' \| '  \/ -_) ' \  _|
  //|___|_||_\_/|_|_| \___/_||_|_|_|_\___|_||_\__|


  var env = new WeakMap();

  function conceal(id, proxy, target) {
    log("conceal", id);
    env.set(id, {proxy:proxy, target:target}); 
  }

  function verify(id, proxy) {
    log("verify", id);

    if(!env.has(id)) error("Misleading Polymorphism", (new Error()).fileName, (new Error()).lineNumber);
    else return (env.get(id).proxy===proxy);
  }

  function reveal(id) {
    log("reveal", id);

    if(!env.has(id)) error("Misleading Polymorphism", (new Error()).fileName, (new Error()).lineNumber);
    else return env.get(id).target;
  }

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Polymorphism", {});

  TreatJS.define(TreatJS.Polymorphism, "conceal", conceal);
  TreatJS.define(TreatJS.Polymorphism, "verify", verify);
  TreatJS.define(TreatJS.Polymorphism, "reveal", reveal);

  TreatJS.define(TreatJS.Polymorphism, "Variable", Variable);

})(TreatJS);
