/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014-2016, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */

TreatJS.package("TreatJS.Sandbox", function (TreatJS, Contract, configuration) {

  //  ___ _     _          _ 
  // / __| |___| |__  __ _| |
  //| (_ | / _ \ '_ \/ _` | |
  // \___|_\___/_.__/\__,_|_|

  // TODO, depent on flag
  const Global = this;

  // _  _      _   _         
  //| \| |__ _| |_(_)_ _____ 
  //| .` / _` |  _| \ V / -_)
  //|_|\_\__,_|\__|_|\_/\___|

  // TODO, only funtions
  const Native = new WeakSet();

  (function addGlobal(object) {
    for(var name of Object.getOwnPropertyNames(object)) {
      //print("add ...", name);
      var desc = Object.getOwnPropertyDescriptor(object, name);
      if(desc.value && (typeof desc.value === "function")) Native.add(desc.value);
      if(desc.value && (typeof desc.value === "object"))  addGlobal(desc.value);
    }
  })(this);

  function isNative(value) {
    return Native.has(value);
  }

  // ___               _ _              ___         _               _   
  /// __| __ _ _ _  __| | |__  _____ __/ __|___ _ _| |_ _ _ __ _ __| |_ 
  //\__ \/ _` | ' \/ _` | '_ \/ _ \ \ / (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___/\__,_|_||_\__,_|_.__/\___/_\_\\___\___/_||_\__|_| \__,_\__|\__|

  function BaseContract(predicate, name) {
    if(!(this instanceof BaseContract)) return new BaseContract(...arguments);

    if(!(predicate instanceof Function))
      throw new TypeError("Invalid predicate");

    Object.defineProperties(this, {
      "predicate": {
        value: /*predicate //*/ wrapFunction(predicate) // TODO, wrap predicate
      },
      "name": {
        value: name
      }
    });
  }
  BaseContract.prototype = Object.create(TreatJS.Contract.Base.prototype);
  BaseContract.prototype.constructor = BaseContract;
  BaseContract.prototype.toString = function() {
    return this.name ? "#"+this.name : "[[TreatJS/BaseContract]]";
  };






  // ___               _ _              ___         _               _   
  /// __| __ _ _ _  __| | |__  _____ __/ __|___ _ _| |_ _ _ __ _ __| |_ 
  //\__ \/ _` | ' \/ _` | '_ \/ _ \ \ / (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___/\__,_|_||_\__,_|_.__/\___/_\_\\___\___/_||_\__|_| \__,_\__|\__|

  const SandboxContract = Object.create(Contract);

  Object.defineProperty(SandboxContract, "Base", {
    value: BaseContract
  });

  // ___               _ _              ___ _     _          _ 
  /// __| __ _ _ _  __| | |__  _____ __/ __| |___| |__  __ _| |
  //\__ \/ _` | ' \/ _` | '_ \/ _ \ \ / (_ | / _ \ '_ \/ _` | |
  //|___/\__,_|_||_\__,_|_.__/\___/_\_\\___|_\___/_.__/\__,_|_|

  const SandboxGlobal = {
    TreatJS:  TreatJS,
    Contract: SandboxContract,
    print: print
  };

  /**
   * Function decompile (aka Function.prototype.toString).
   * Decompiles a function and returns a string representing the source code of that function.
   */
  const decompile = Function.prototype.toString;


  // TODO
  const Symbols = new Set([
    Symbol.hasInstance,
    Symbol.isConcatSpreadable,
    Symbol.iterator,
    Symbol.match,
    Symbol.replace,
    Symbol.search,
    Symbol.species,
    Symbol.split,
    Symbol.toPrimitive,
    Symbol.toStringTag, //
    Symbol.unscopables
      ]);


  // wrap for arguments passed the membrane
  // cache ? 
  // flag sthat omiyt decomilation and logging?

  
  //  ___                 
  // | __|_ _ _ _ ___ _ _ 
  // | _|| '_| '_/ _ \ '_|
  // |___|_| |_| \___/_|  

  function SandboxError (trapname="Undefiend operaton") {
    this.name = 'Sandbox Error';
    this.message = 'Sandbox function cannot cause observable effects or call functions.' + (trapname? '\nTrap: '+trapname+'.\n' : '');;
    this.stack = (new Error()).stack;
  }
  SandboxError.prototype = Object.create(Error.prototype);
  SandboxError.prototype.constructor = SandboxError;

  //__ __ ___ _ __ _ _ __ 
  //\ V  V / '_/ _` | '_ \
  // \_/\_/|_| \__,_| .__/
  //                |_|   

  /** 
   * proxies: proxy -> target
   **/
  const proxies = new WeakMap();

  /** 
   * targets: target -> proxy
   **/
  const targets = new WeakMap();

  /** 
   * wrap: target -> proxy
   **/
  function wrap(target) {

    /**
     * If target is a primitive value, return target.
     **/
    if (target !== Object(target)) {
      return target;
    }

    /**
     * Avoid re-wrapping of targets/ proxies
     **/
    if(targets.has(target)) {
      return targets.get(target);
    } else if (proxies.has(target)) {
      return target;
    }

    //var handler = new Membrane();
    //var proxy = new Proxy(target, handler);

    var proxy = new Proxy(target, new Proxy({}, {
      get: function(target, name, receiver) {
        throw new SandboxError("get " + name);
      }
    }));

    var proxy = new Proxy(target, new Membrane());

    /**
     * Stores the current proxy
     **/
    targets.set(target, proxy);
    proxies.set(proxy, target);

    return proxy;
  }

  /** 
   * wrap: target -> proxy
   **/
  function unwrap(proxy) {
    if(proxies.has(proxy)) {
      return proxies.get(proxy);
    } else {
      return proxy;
    }
  }





  // __  __           _                      
  //|  \/  |___ _ __ | |__ _ _ __ _ _ _  ___ 
  //| |\/| / -_) '  \| '_ \ '_/ _` | ' \/ -_)
  //|_|  |_\___|_|_|_|_.__/_| \__,_|_||_\___|
  
  function Membrane() {
    if(!(this instanceof Membrane)) return new Membrane(...arguments);

    /**
     * A trap for Object.getPrototypeOf.
     **/
    this.getPrototypeOf = function(target) {
      return wrap(Reflect.getPrototypeOf(target));
    }

    /**
     * A trap for Object.setPrototypeOf.
     **/
    this.setPrototypeOf = function(target, prototype) {
      throw new SandboxError("setPrototypeOf");
    }

    /**
     * A trap for Object.isExtensible
     **/
    this.isExtensible = function(target) {
      return wrap(Reflect.isExtensible(target));
    };

    /** 
     * A trap for Object.preventExtensions.
     **/
    this.preventExtensions = function(target) {
      throw new SandboxError("preventExtensions");
    };

    /** 
     * A trap for Object.getOwnPropertyDescriptor.
     **/
    this.getOwnPropertyDescriptor = function(target, name) {
      return wrap(Reflect.getOwnPropertyDescriptor(target, name));
    };

    /** 
     * A trap for Object.defineProperty.
     **/
    this.defineProperty = function(target, name, desc) {
      throw new SandboxError("defineProperty");
    };

    /** 
     * A trap for the in operator.
     **/
    this.has = function(target, name) {
      return wrap(Reflect.has(target, name));
    };

    /**
     * A trap for getting property values.
     **/
    this.get = function(target, name, receiver) {
      return Symbols.has(name) || name=="prototype" ? Reflect.get(target, name, receiver) : 
        wrap(Reflect.get(target, name, receiver));
    };

    /** 
     * A trap for setting property values.
     **/
    this.set = function(target, name, value, receiver) {
      throw new SandboxError("set");
    };

    /**
     * A trap for the delete operator.
     **/
    this.deleteProperty = function(target, name) {
      throw new SandboxError("deleteProperty");
    };

    /**
     * A trap for Object.getOwnPropertyNames.
     **/
    this.ownKeys = function(target) {
      return wrap(Reflect.ownKeys(target));
    };

    /** 
     * A trap for a function call.
     **/
    this.apply = function(target, thisArg, argumentsList) {
      if(isNative(target))
        wrap(Reflect.apply(target, thisArg, argumentsList));
      else {
        print(isNative(target));
        print(Native.has(Math));
        print(Native.has(Math.abs));
        throw new SandboxError("apply" + target, thisArg);
      }
    };

    /** 
     * A trap for the new operator. 
     **/
    this.construct = function(target, argumentsList) {
      if(isNative(target))
        wrap(Reflect.apply(target, argumentsList));
      else
        throw new SandboxError("construct");
    }
  }

















  // _ _ ___ __ ___ _ __  _ __(_) |___ 
  //| '_/ -_) _/ _ \ '  \| '_ \ | / -_)
  //|_| \___\__\___/_|_|_| .__/_|_\___|
  //                     |_|           

  function recompile(realm, closure) {
    try {

      /**
       * Scope Proxy.
       * Stops the traversal of a scope chain lookup.
       **/
      var scope = new Proxy(realm, {
        has: function() {
          return true;
        }
      });

      /**
       * Source Code.
       * Dcompiled function body.
       **/
      var source = decompile.apply(closure);

      /**
       * New Function Body.
       * Creates a nest function body in the new scope chain.
       **/
      var body = "(function() {'use strict'; return " + ("(" +  source + ")") + "})();";

      /**
       * New Pure Function.
       * Creates the new pure function.
       **/
      var pure = eval("(function() { with(scope) { return " + body + " }})();");

      /**
       * Intercept Aplications.
       * Wrap/Uwrap arguments and return of a function call to protect values.
       **/
      var proxy = wrapFunction(pure);
/*      var proxy =  new Proxy(pure, {
        apply: function(target, thisArg, argumentsList) {

          // traverse arguments
          
          const wrappedArguments = [];
          for(var i=0; i<argumentsList.length; i++) 
            wrappedArguments[i] = wrap(argumentsList[i])

        // TODO, why is this required ?
          return unwrap(target.apply(wrap(thisArg), wrappedArguments));
        }
      });*/

      /**
       * Return new pure function.
       **/    
      return proxy;

    } catch(error) {
      throw new SyntaxError("Incompatible function object. " + error.message);
    } 
  }

  function wrapFunction(closure) {
    return new Proxy(closure, {
      apply: function(target, thisArg, argumentsList) {

        /**
         * traverse arguments
         **/
        const wrappedArguments = [];

        
        print(closure, argumentsList[0] instanceof Array, argumentsList[0] instanceof wrap(Array) , wrap(argumentsList[0]) instanceof Array );
        print(argumentsList[0], wrap(argumentsList[0]));

        for(let i=0; i<argumentsList.length; i++) {
          print("traverse ... ", i, ";", argumentsList[i], ":");

          wrappedArguments[i] = wrap(argumentsList[i])
        }


        return unwrap(Reflect.apply(target, thisArg, wrappedArguments));

    // TODO, why is this required ?
    //return unwrap(target.apply(wrap(thisArg), wrappedArguments));
      }
    });
  }


  function recompilePredicate (predicate) {
    // TODO
    return recompile(wrap(Global), predicate);
  }


  function recompileConstructor (predicate) {
    return recompile(SandboxGlobal, predicate);
  }

  //         _                 
  // _ _ ___| |_ _  _ _ _ _ _  
  //| '_/ -_)  _| || | '_| ' \ 
  //|_| \___|\__|\_,_|_| |_||_|

  return {
    recompilePredicate:   recompilePredicate,
    recompileConstructor: recompileConstructor
  };

});
