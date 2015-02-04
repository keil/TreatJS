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
    if(TreatJS.Verbose.sandbox) {
      __out(padding_right(msg + " ", ".", 30) + ((target!=undefined)?" "+target:""));
      __blank();
    }
  }

  /** count(msg)
   * @param key String
   */
  function count(key) {
    if(TreatJS.Verbose.statistic) _.Statistic.inc(key);
  }


  /** decompile (fun, globalArg)
   *
   * Decompiles a function 
   *
   * @param fun The function object.
   * @param globalArg The secure global object.
   * @return a secure function
   */
  function decompile(fun) {
    log("[[decompile]]");
    count(TreatJS.Statistic.DECOMPILE);

    var string = "(" + fun.toString() + ")"; 
    var global = new Proxy({}, new GlobalHandler({}));
    var newfun = eval("(function() { with(global) { return " + string + " }})();");
 
    Object.defineProperty(newfun, "eval", {
      value: function (global, thisArg, args) {
        //print(this.apply(thisArg, args));
      // TODO, setr target
        //handler.target = global;
        return this.apply(thisArg, args);
        // TODO, make schure that the value is resetted after call
        // mybe by ... 
      },
      enumerable: true
    });

    return newfun;
  }


  function GlobalHandler (origin) {
    this.has = function(scope, name) {
      // return true;
      return origin.hasOwnProperty(name);
      //Object.prototype.hasOwnProperty(origin, name);
      //        (name in origin);
      // return true; // TODO, required ?
    };

    this.get = function(target, name, receiver) {
      return origin[name];
    }

    this.set = function(target, name, value, receiver) {
      return origin[name] = value;
    }

    Object.defineProperty(this, "target", {
      set: function (target) {
        origin = target;
      },
      enumerable: true
    });
  }



  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("decompile", decompile);

})(TreatJS);

