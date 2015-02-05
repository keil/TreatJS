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

  var error = TreatJS.error;
  var violation = TreatJS.violation;

  /** log(msg)
   * @param msg String message
   */ 
  function log(msg, target) {
    if(TreatJS.Verbose.assert) {
      __out(padding_right("decompile / " + msg + " ", ".", 30));
      __blank();
      __out(((target!=undefined)?" "+target:""));
      __blank();
    }
  }

  /** count(msg)
   * @param key String
   */
  function count(key) {
    if(TreatJS.Verbose.statistic) TreatJS.Statistic.inc(key);
  }

  // global -> ( function -> function' )
  var dcache = new WeakMap();

  /** pre decompile (fun, globalArg)
   *
   * Gets the predicate from the cache or decompiles it 
   *
   * @param fun The function object.
   * @param caching Enables function caching.
   * @return a secure function
   */
  function cache(fun, caching) {
    if(caching===false) return decompile(fun);

    if(dcache.has(fun)) {
      log("dcache hit");
      return dcache.get(fun);
    } else {
      log("dcache miss");
      var decompiled = decompile(fun);
      dcache.set(fun, decompiled);
      return decompiled;
    }
  }

  /** decompile (fun)
   *
   * Decompiles a function 
   *
   * @param fun The function object.
   * @return a secure function
   */
  function decompile(fun) {
    log("decompile", fun.toString());
    count(TreatJS.Statistic.DECOMPILE);

    var scopeHandler = new ScopeHandler();

    var string = "(" + fun.toString() + ")"; 
    var scope = (new Proxy({}, scopeHandler));
    var newfun = eval("(function() { with(scope) { return " + string + " }})();");

    return new Proxy(newfun, new DynamicHandler(newfun, scopeHandler));
  }

  // ___                   _  _              _ _         
  /// __| __ ___ _ __  ___| || |__ _ _ _  __| | |___ _ _ 
  //\__ \/ _/ _ \ '_ \/ -_) __ / _` | ' \/ _` | / -_) '_|
  //|___/\__\___/ .__/\___|_||_\__,_|_||_\__,_|_\___|_|  
  //            |_|                                      

  function ScopeHandler (scope) {

    // the scoped object
    var scoped = (scope || {});

    this.has = function(target, name) {
      return (name in scoped);
    };

    this.get = function(target, name, receiver) {
      return scoped[name];
    }

    this.set = function(target, name, value, receiver) {
      return scoped[name] = value;
    }

    // scope-setter 
    // resets the objects used in the scope chain
    Object.defineProperty(this, "scope", {
      set: function (newscope) {
        scoped = newscope;
      },
      enumerable: true
    });
  }

  // ___                       _    _  _              _ _         
  //|   \ _  _ _ _  __ _ _ __ (_)__| || |__ _ _ _  __| | |___ _ _ 
  //| |) | || | ' \/ _` | '  \| / _| __ / _` | ' \/ _` | / -_) '_|
  //|___/ \_, |_||_\__,_|_|_|_|_\__|_||_\__,_|_||_\__,_|_\___|_|  
  //      |__/                                                    

  function DynamicHandler(target, scopeHandler) {

    function eval(scopeArg, thisArg, argsArg) { 
      scopeHandler.scope = scopeArg;
      return target.apply(thisArg, argsArg);
    }

    this.has = function(target, name) {
      return (name==="eval") ? true : (name in target);
    }

    this.get = function(target, name, receiver) {
      return (name==="eval") ? eval : target[name];
    }

    this.apply = function(target, thisArg, argsArray) {
      return eval({}, thisArg, argsArray);
    }
  }

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("decompile", cache);

})(TreatJS);
