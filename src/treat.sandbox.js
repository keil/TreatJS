/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014-2017, Proglang, University of Freiburg.
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

  const Global = this;

  // _  _      _   _         
  //| \| |__ _| |_(_)_ _____ 
  //| .` / _` |  _| \ V / -_)
  //|_|\_\__,_|\__|_|\_/\___|

  const Native = new WeakSet();

  (function addGlobal(object) {
    for(var name of Object.getOwnPropertyNames(object)) {
      var desc = Object.getOwnPropertyDescriptor(object, name);
      if(desc.value && (typeof desc.value === "function")) Native.add(desc.value);
      if(desc.value && (typeof desc.value === "object"))  addGlobal(desc.value);
    }
  })(this);

  function isNative(value) {
    return Native.has(value);
  }

  // ___               _ _               ___                ___         _               _   
  /// __| __ _ _ _  __| | |__  _____ __ | _ ) __ _ ___ ___ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //\__ \/ _` | ' \/ _` | '_ \/ _ \ \ / | _ \/ _` (_-</ -_) (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___/\__,_|_||_\__,_|_.__/\___/_\_\ |___/\__,_/__/\___|\___\___/_||_\__|_| \__,_\__|\__|

  function BaseContract(predicate, name) {
    if(!(this instanceof BaseContract)) return new BaseContract(predicate, name);

    if(!(predicate instanceof Function))
      throw new TypeError("Invalid predicate");

    Object.defineProperties(this, {
      "predicate": {
        value: predicate
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
        throw new TreatJS.Error.SandboxError("get " + name);
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

  // ___ _       _    _     __  __           _                      
  /// __| |_ _ _(_)__| |_  |  \/  |___ _ __ | |__ _ _ __ _ _ _  ___ 
  //\__ \  _| '_| / _|  _| | |\/| / -_) '  \| '_ \ '_/ _` | ' \/ -_)
  //|___/\__|_| |_\__|\__| |_|  |_\___|_|_|_|_.__/_| \__,_|_||_\___|

  function StrictMembrane() {
    if(!(this instanceof StrictMembrane)) return new StrictMembrane(...arguments);

    /**
     * A trap for Object.getPrototypeOf.
     **/
    this.getPrototypeOf = function(target) {
      throw new TreatJS.Error.SandboxError("getPrototypeOf");
    }

    /**
     * A trap for Object.setPrototypeOf.
     **/
    this.setPrototypeOf = function(target, prototype) {
      throw new TreatJS.Error.SandboxError("setPrototypeOf");
    }

    /**
     * A trap for Object.isExtensible
     **/
    this.isExtensible = function(target) {
      throw new TreatJS.Error.SandboxError("isExtensible");
    };

    /** 
     * A trap for Object.preventExtensions.
     **/
    this.preventExtensions = function(target) {
      throw new TreatJS.Error.SandboxError("preventExtensions");
    };

    /** 
     * A trap for Object.getOwnPropertyDescriptor.
     **/
    this.getOwnPropertyDescriptor = function(target, name) {
      throw new TreatJS.Error.SandboxError("getOwnPropertyDescriptor");
    };

    /** 
     * A trap for Object.defineProperty.
     **/
    this.defineProperty = function(target, name, desc) {
      throw new TreatJS.Error.SandboxError("defineProperty");
    };

    /** 
     * A trap for the in operator.
     **/
    this.has = function(target, name) {
      throw new TreatJS.Error.SandboxError("has");
    };

    /**
     * A trap for getting property values.
     **/
    this.get = function(target, name, receiver) {
      throw new TreatJS.Error.SandboxError("get");      
    };

    /** 
     * A trap for setting property values.
     **/
    this.set = function(target, name, value, receiver) {
      throw new TreatJS.Error.SandboxError("set");
    };

    /**
     * A trap for the delete operator.
     **/
    this.deleteProperty = function(target, name) {
      throw new TreatJS.Error.SandboxError("deleteProperty");
    };

    /**
     * A trap for Object.getOwnPropertyNames.
     **/
    this.ownKeys = function(target) {
      throw new TreatJS.Error.SandboxError("ownKeys");
    };

    /** 
     * A trap for a function call.
     **/
    this.apply = function(target, thisArg, argumentsList) {
      throw new TreatJS.Error.SandboxError("apply" + target, thisArg);
    };

    /** 
     * A trap for the new operator. 
     **/
    this.construct = function(target, argumentsList) {
      throw new TreatJS.Error.SandboxError("construct");
    }
  }

  // ___                __  __           _                      
  //| _ \_  _ _ _ ___  |  \/  |___ _ __ | |__ _ _ __ _ _ _  ___ 
  //|  _/ || | '_/ -_) | |\/| / -_) '  \| '_ \ '_/ _` | ' \/ -_)
  //|_|  \_,_|_| \___| |_|  |_\___|_|_|_|_.__/_| \__,_|_||_\___|

  function PureMembrane() {
    if(!(this instanceof PureMembrane)) return new PureMembrane(...arguments);

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
      throw new TreatJS.Error.SandboxError("setPrototypeOf");
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
      throw new TreatJS.Error.SandboxError("preventExtensions");
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
      throw new TreatJS.Error.SandboxError("defineProperty");
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
      throw new TreatJS.Error.SandboxError("set");
    };

    /**
     * A trap for the delete operator.
     **/
    this.deleteProperty = function(target, name) {
      throw new TreatJS.Error.SandboxError("deleteProperty");
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
      if(true || isNative(target))
        return wrap(Reflect.apply(target, thisArg, argumentsList));
      else {
        print(isNative(target));
        print(Native.has(Math));
        print(Native.has(Math.abs));
        throw new TreatJS.Error.SandboxError("apply" + target, thisArg);
      }
    };

    /** 
     * A trap for the new operator. 
     **/
    this.construct = function(target, argumentsList) {
      if(isNative(target))
        wrap(Reflect.apply(target, argumentsList));
      else
        throw new TreatJS.Error.SandboxError("construct");
    }
  }

  // _  _      ___         __  __           _                      
  //| \| |___ / _ \ _ __  |  \/  |___ _ __ | |__ _ _ __ _ _ _  ___ 
  //| .` / _ \ (_) | '_ \ | |\/| / -_) '  \| '_ \ '_/ _` | ' \/ -_)
  //|_|\_\___/\___/| .__/ |_|  |_\___|_|_|_|_.__/_| \__,_|_||_\___|
  //               |_|                                             
  function NoneMembrane() {
    if(!(this instanceof NoneMembrane)) return new NoneMembrane(...arguments);
  }

  // __  __           _                      
  //|  \/  |___ _ __ | |__ _ _ __ _ _ _  ___ 
  //| |\/| / -_) '  \| '_ \ '_/ _` | ' \/ -_)
  //|_|  |_\___|_|_|_|_.__/_| \__,_|_||_\___|

  let Membrane = (function() {
    switch(configuration.safetylevel) {
      case TreatJS.NONE:
        return NoneMembrane;
        break;

      case TreatJS.PURE:
        return PureMembrane;
        break;

      case TreatJS.STRICT:
        return StrictMembrane;
        break;

    }})();

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

        for(let i=0; i<argumentsList.length; i++) {
          wrappedArguments[i] = wrap(argumentsList[i])
        }

        return Reflect.apply(target, thisArg, wrappedArguments);
      }
    });
  }

  function recompilePredicate (predicate) {
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
    recompilePredicate:   (configuration.safetylevel===TreatJS.NONE) ? x=>x : recompilePredicate,
    recompileConstructor: (configuration.safetylevel===TreatJS.NONE) ? x=>x : recompileConstructor
  };

});
