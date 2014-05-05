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

  var error = _.error;
  var violation = _.violation;

  /** log(msg)
   * @param msg String message
   */ 
  function log(msg, target) {
    if(_.Config.Verbose.sandbox) {
      __out(padding_right(msg + " ", ".", 30) + ((target!=undefined)?" "+target:""));
      __blank();
    }
  }

  // __  __           _                      
  //|  \/  |___ _ __ | |__ _ _ __ _ _ _  ___ 
  //| |\/| / -_) '  \| '_ \ '_/ _` | ' \/ -_)
  //|_|  |_\___|_|_|_|_.__/_| \__,_|_||_\___|

  var cache = new Cache();

  /** wrap(target)
   *
   * Wraps a target object.
   *
   * @param target Object
   * @param global, list of allowed properties
   * @return Membrane Reference/ Proxy 
   */
  function wrap(target, global) { 
    log("[[wrap]]");

    // IF target is primitive value, return target
    if (target !== Object(target)) {
      return target;
    }

    if(cache.contains(target)) {
      return cache.get(target);
    } else { 
      var membraneHandler = new Membrabe(global);
      var proxy = new Proxy(target, membraneHandler);

      cache.put(target, proxy);

      return proxy;
    }
  }

  /** Membrabe(global)
   * Implements a membrane to evaluate functions in a sandbox
   *
   * @param, the sandboxs global object
   */
  function Membrabe(global) {
    this.getOwnPropertyDescriptor = function(target, name) {
      log("[[getOwnPropertyDescriptor]]", name);
      var desc = Object.getOwnPropertyDescriptor(target, name);
      if (desc !== undefined) desc.value = wrap(desc, global);
      return desc;
    };
    this.getOwnPropertyNames = function(target) {
      log("[[getOwnPropertyNames]]", name);
      return Object.getOwnPropertyNames(target);
    };
    this.getPrototypeOf = function(target) {
      log("[[getPrototypeOf]]", name);
      return Object.getPrototypeOf(target)
    };
    this.defineProperty = function(target, name, desc) {
      log("[[defineProperty]]", name);
      return Object.defineProperty(target, name, desc);
    };
    this.deleteProperty = function(target, name) {
      log("[[deleteProperty]]", name);
      return delete target[name];
    };
    this.freeze = function(target) {
      log("[[freeze]]", name);
      return Object.freeze(target);
    };
    this.seal = function(target) {
      log("[[seal]]", name);
      return Object.seal(target);
    };
    this.preventExtensions = function(target) {
      log("[[preventExtensions]]", name);
      return Object.preventExtensions(target);
    };
    this.isFrozen = function(target) {
      log("[[isFrozen]]", name);
      return Object.isFrozen(target);
    };
    this.isSealed = function(target) {
      log("[[isSealed]]", name);
      return Object.isSealed(target);
    };
    this.isExtensible = function(target) {
      log("[[isExtensible]]", name);
      return Object.isExtensible(target);
    };
    this.has = function(target, name) {
      log("[[has]]", name);
      if(!(name in target)) violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);
      else return (name in target);
    };
    this.hasOwn = function(target, name) {
      log("[[hasOwn]]", name);
      if(!(name in target)) violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);
      else return ({}).hasOwnProperty.call(target, name); 
    };
    this.get = function(target, name, receiver) {
      log("[[get]]", name);
      if(!(name in target)) violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);

      // pass-through of Contract System
      if(name=="$") return target[name];

      if( _.Config.nativePassThrough) {
        // pass-through of native functions
        if(isNativeFunction(target[name])) {
          return target[name];
        }
        else return wrap(target[name], global);
      } else {
        return wrap(target[name], global);
      }
    };
    this.set = function(target, name, value, receiver) {
      log("[[set]]", name);
      // NOTE: no write access allowed
      violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);
      //otherwise use this code:
      //if(!(name in target)) violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);
      //else return target[name] = value;
    };
    this.enumerate = function(target) {
      log("[[enumerate]]", name);
      var result = [];
      for (var name in target) {
        result.push(name);
      };
      return result;
    };
    this.keys = function(target) {
      log("[[keys]]");
      return Object.keys(target);
    };
    this.apply = function(target, thisArg, argsArray) {
      log("[[apply]]");
      return evalFunction(target, global, thisArg, argsArray);
    };
    this.construct = function(target, argsArray) {
      log("[[construct]]");
      return evalNew(target, global, this, argsArray);
    };
  };

  //  ___         _        
  // / __|__ _ __| |_  ___ 
  //| (__/ _` / _| ' \/ -_)
  // \___\__,_\__|_||_\___|

  function Cache() {     
    var handlerMap = new WeakMap();

    /** put entry
     * @param object Key
     * @param object Value
     */
    this.put = function(target, proxy) {
      return handlerMap.set(target, proxy);
    };
    /** get entry
     * @param proxy Key value
     */
    this.get = function(target) {
      return handlerMap.get(target);
    };

    /** contains key
     * @param proxy
     * @return true if key is element of map, false otherwise
     */
    this.contains = function(key) {
      return (handlerMap.get(key, undefined) !== undefined) ? true : false;
    }
  };

  // ___               _ _             
  /// __| __ _ _ _  __| | |__  _____ __
  //\__ \/ _` | ' \/ _` | '_ \/ _ \ \ /
  //|___/\__,_|_||_\__,_|_.__/\___/_\_\

  /** evalInSandbox(fun[, globalArg, thisArg, argsArray])
   *
   * Evaluates the given function in a sandbox. 
   *
   * @param fun The function object.
   * @param globalArg The secure global object.
   * @param thisArg The function this-reference.
   * @param argArray The function arguments
   * @return The result of fun.apply(thisArg, argsArray);
   */
  function evalInSandbox(fun, globalArg, thisArg, argsArray) {
    if(!(fun instanceof Function)) error("No Function Object", (new Error()).fileName, (new Error()).lineNumber);

    var string = "(" + fun.toString() + ")"; 
    var sandbox = globalArg;
    var secureFun = eval("(function() { with(sandbox) { return " + string + " }})();");

    return secureFun.apply(thisArg, argsArray);
  }

  /** evalNewInSandbox(fun[, globalArg, thisArg, argsArray])
   *
   * Evaluates the given function in a sandbox. 
   *
   * @param fun The function object.
   * @param globalArg The secure global object.
   * @param thisArg The function this-reference.
   * @param argArray The function arguments
   * @return The result of fun.apply(thisArg, argsArray);
   */
  function evalNewInSandbox(fun, globalArg, thisArg, argsArray) {
    if(!(fun instanceof Function)) error("No Function Object", (new Error()).fileName, (new Error()).lineNumber);

    var string = "(" + fun.toString() + ")"; 
    var sandbox = wrap(globalArg, globalArg);
    var secureFun = eval("(function() { with(sandbox) { return " + string + " }})();");

    var newObj = Object.create(secureFun.prototype);
    var val = secureFun.apply(newObj, argsArray);

    return (val instanceof Object) ? val : newObj;
  }

  /** evalFunction(fun[, globalArg, thisArg, argsArray])
   *
   * Evaluates the given function in a sandbox. 
   *
   * @param fun The function object.
   * @param globalArg The secure global object.
   * @param thisArg The function this-reference.
   * @param argArray The function arguments
   * @return The result of fun.apply(thisArg, argsArray);
   */
  function evalFunction(fun, globalArg, thisArg, argsArray) {
    globalArg = (globalArg!=undefined) ? globalArg : new Object();
    thisArg = (thisArg!=undefined) ? thisArg : globalArg;
    argsArray = (argsArray!=undefined) ? argsArray : new Array();

    if(!_.Config.decompile) {
      with(globalArg) { return fun.apply(thisArg, argsArray); }
    } else if(!_.Config.membrane) {
      return evalInSandbox(fun, globalArg, thisArg, argsArray);
    } else {
      var sandboxGlobalArg = wrap(globalArg, globalArg);
      var sandboxThisArg = wrap(thisArg, {});
      var sandboxArgsArray = wrap(argsArray, {});

      return evalInSandbox(fun, sandboxGlobalArg, sandboxThisArg, sandboxArgsArray);
    }
  }

  /** evalFunction(fun[, globalArg, thisArg, argsArray])
   *
   * Evaluates the given function in a sandbox. 
   *
   * @param fun The function object.
   * @param globalArg The secure global object.
   * @param thisArg The function this-reference.
   * @param argArray The function arguments
   * @return The result of fun.apply(thisArg, argsArray);
   */
  function evalNew(fun, globalArg, thisArg, argsArray) {
    globalArg = (globalArg!=undefined) ? globalArg : new Object();
    thisArg = (thisArg!=undefined) ? thisArg : globalArg;
    argsArray = (argsArray!=undefined) ? argsArray : new Array();

    if(!_.Config.decompile) {
      with(globalArg) { return fun.apply(thisArg, argsArray); }
    } else if(!_.Config.membrane) {
      return evalNewInSandbox(fun, globalArg, thisArg, argsArray);
    } else {
      var sandboxGlobalArg = wrap(globalArg, globalArg);
      var sandboxThisArg = wrap(thisArg, {});
      var sandboxArgsArray = wrap(argsArray, {});

      return evalNewInSandbox(fun, sandboxGlobalArg, sandboxThisArg, sandboxArgsArray);
    }
  }

  /** bindInSandbox(fun[, globalArg, thisArg, argsArray])
   *
   * Binds the given function in a sandbox. 
   *
   * @param fun The function object.
   * @param globalArg The secure global object.
   * @param thisArg The function this-reference.
   * @param argArray The function arguments
   * @return The result of fun.apply(thisArg, argsArray);
   */
  function bindInSandbox(fun, globalArg, thisArg, argsArray) {
    if(!(fun instanceof Function)) error("No Function Object", (new Error()).fileName, (new Error()).lineNumber);

    var string = "(" + fun.toString() + ")"; 
    var sandbox = globalArg;
    var secureFun = eval("(function() { with(sandbox) { return " + string + " }})();");

    return secureFun.bind(thisArg);
  }

  /** bindFunction(fun[, globalArg, thisArg, argsArray])
   *
   * Binds the given function. 
   *
   * @param fun The function object.
   * @param globalArg The secure global object.
   * @param thisArg The function this-reference.
   * @param argArray The function arguments
   * @return Function
   */
  function bindFunction(fun, globalArg, thisArg, argsArray) {
    globalArg = (globalArg!=undefined) ? globalArg : new Object();
    thisArg = (thisArg!=undefined) ? thisArg : globalArg;
    argsArray = (argsArray!=undefined) ? argsArray : new Array();

    if(!_.Config.decompile) {
      return fun; 
    } else if(!_.Config.membrane) {
      return bindInSandbox(fun, globalArg, thisArg, argsArray);
    } else {
      var sandboxGlobalArg = wrap(globalArg, globalArg);
      var sandboxThisArg = wrap(thisArg, {});
      var sandboxArgsArray = wrap(argsArray, {});

      return bindInSandbox(fun, sandboxGlobalArg, sandboxThisArg, sandboxArgsArray);
    }
  }

  /**
   * Core Functions
   */

  __define("eval", evalFunction, _);
  __define("bind", bindFunction, _);
  __define("wrap", wrap, _);

  // _    _  _      _   _         ___             _   _          
  //(_)__| \| |__ _| |_(_)_ _____| __|  _ _ _  __| |_(_)___ _ _  
  //| (_-< .` / _` |  _| \ V / -_) _| || | ' \/ _|  _| / _ \ ' \ 
  //|_/__/_|\_\__,_|\__|_|\_/\___|_| \_,_|_||_\__|\__|_\___/_||_|

  /** isNativeFunction(func)
   * checks if the function is a native function
   *
   * @param func Function Object
   * @return true, if func is a native function, false otherwise
   */
  function isNativeFunction(func) {
    if(!(func instanceof Function)) return false;

    var toString = getToStringFunction();
    return (toString.apply(func).indexOf('[native code]') > -1);
  }

  /** getToStringFunction()
   * returns the native toString of Function.prototype
   * @return Function
   */
  function getToStringFunction() {
    if(_.Base.toString!=undefined) {
      return _.Base.toString;
    } else if(_.Config.newGlobal) {
      var g = newGlobal();
      return (g.Function.prototype.toString);
    } else {
      return undefined;
    }
  }

  __define("isNativeFunction", isNativeFunction, _);

})(_);
