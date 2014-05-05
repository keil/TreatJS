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
  var blame = _.blame;

  var Contract = _.Core.Contract;
  var Constructor = _.Core.Constructor;

  var ContractConstructor = _.Constructor;

  var BaseContract = _.BaseContract;

  var FunctionContract = _.FunctionContract;
  var MethodContract = _.MethodContract;
  var DependentContract = _.DependentContract;
  var ObjectContract = _.ObjectContract;

  var WithContract = _.With;

  var AndContract = _.And;
  var OrContract = _.Or;
  var NotContract = _.Not;

  var Map = _.Map;
  var StringMap = _.StringMap;

  /** log(msg)
   * @param msg String message
   */ 
  function log(msg, target) {
    if(_.Config.Verbose.assert) {
      __out(padding_right(msg + " ", ".", 30));
      __blank();
      __out(((target!=undefined)?" "+target:""));
      __blank();
    }
  }

  // ___               _ _              ___         _               _   
  /// __| __ _ _ _  __| | |__  _____ __/ __|___ _ _| |_ _ _ __ _ __| |_ 
  //\__ \/ _` | ' \/ _` | '_ \/ _ \ \ / (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___/\__,_|_||_\__,_|_.__/\___/_\_\\___\___/_||_\__|_| \__,_\__|\__|

  function SandboxContract(predicate, global, name) {
    if(!(this instanceof SandboxContract)) return new SandboxContract(predicate, global, name);

    if(!(predicate instanceof Function)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
    if(!(global instanceof Object)) error("Wrong Argument", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "predicate": {
        get: function () { return predicate; } },
      "global": {
        get: function () { return global; } },
      "name": {
        get: function () { return name; } }
    });

    this.toString = function() { return "[" + ((name!=undefined) ? name : predicate.toString()) + "]"; };
  }
  SandboxContract.prototype = new Contract();

  //  ___ _     _          _ 
  // / __| |___| |__  __ _| |
  //| (_ | / _ \ '_ \/ _` | |
  // \___|_\___/_.__/\__,_|_|

  function Global(global) {
    if(!(this instanceof Global)) return new Global(global);

    global = (global==undefined) ? {} : global;

    this.dump = function() {
      return global; 
    }

    this.clone = function() {
      var newglobal = {};
      for(key in global) newglobal[key] = global[key];
      return new Global(newglobal);
    }

    this.merge = function(binding) {
      var newglobal = this.clone().dump();
      for(key in binding) newglobal[key] = binding[key];
      return new Global(newglobal);
    }

    this.toString = function() {
      var string = "";
      for(p in global) {
        string += " " + p + ":" + global[p];
      }
      return "{" + string + "}";
    }
  }

  //                         _   
  //                        | |  
  //  __ _ ___ ___  ___ _ __| |_ 
  // / _` / __/ __|/ _ \ '__| __|
  //| (_| \__ \__ \  __/ |  | |_ 
  // \__,_|___/___/\___|_|   \__|

  function assert(arg, contract) {
    log("assert", contract);

    // disbale assertion
    if(!_.Config.assertion) return arg;

    if(!(contract instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    // callback axiom
    var callback = function(arg, msg) {
      if(arg.isFalse()) 
        blame(contract, msg, (new Error()).fileName, (new Error()).lineNumber);
    }
    return assertWith(arg, contract, new Global(), callback);
  }

  function assertWith(arg, contract, global, callback) {
    log("assert with", contract);

    if(!(contract instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    // ___          _   _   _          ___         _               _   
    //| __|  _ _ _ | |_| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| _| || | ' \| / /  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_| \_,_|_||_|_\_\\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

    if(contract instanceof FunctionContract) {
      if(!(arg instanceof Function)) error("Wrong Argument", (new Error()).fileName, (new Error()).lineNumber);

      var handler = new FunctionHandler(contract, global, callback);
      var proxy = new Proxy(arg, handler);
      return proxy;
    }

    // __  __     _   _            _  ___         _               _   
    //|  \/  |___| |_| |_  ___  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
    //| |\/| / -_)  _| ' \/ _ \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_|  |_\___|\__|_||_\___/\__,_|\___\___/_||_\__|_| \__,_\__|\__|

    if(contract instanceof MethodContract) {
      if(!(arg instanceof Function)) error("Wrong Argument", (new Error()).fileName, (new Error()).lineNumber);

      var handler = new MethodHandler(contract, global, callback);
      var proxy = new Proxy(arg, handler);
      return proxy;
    }

    //  ___  _     _        _    ___         _               _   
    // / _ \| |__ (_)___ __| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| (_) | '_ \| / -_) _|  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
    // \___/|_.__// \___\__|\__|\___\___/_||_\__|_| \__,_\__|\__|
    //          |__/                                             

    else if (contract instanceof ObjectContract) {
      if(!(arg instanceof Object)) error("Wrong Argument", (new Error()).fileName, (new Error()).lineNumber);

      /* STRICT MODE */
      if(contract.strict) {
        contract.map.foreach(function(key, contract) {
          arg[key] = assertWith(arg[key], contract, global, callback.subHandler);
        });
      }

      var handler = new ObjectHandler(contract, global, callback);
      var proxy = new Proxy(arg, handler);
      return proxy;
    }

    // ___                        _         _    ___         _               _   
    //|   \ ___ _ __  ___ _ _  __| |___ _ _| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| |) / -_) '_ \/ -_) ' \/ _` / -_) ' \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___/\___| .__/\___|_||_\__,_\___|_||_\__|\___\___/_||_\__|_| \__,_\__|\__|
    //         |_|                                                               

    if(contract instanceof DependentContract) {
      if(!(arg instanceof Function)) error("Wrong Argument", (new Error()).fileName, (new Error()).lineNumber);

      var handler = new DependentHandler(contract, global, callback);
      var proxy = new Proxy(arg, handler);
      return proxy;
    }

    //__      ___ _   _    ___         _               _   
    //\ \    / (_) |_| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
    // \ \/\/ /| |  _| ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //  \_/\_/ |_|\__|_||_\___\___/_||_\__|_| \__,_\__|\__|                                                   

    else if (contract instanceof WithContract) {
      var newglobal = global.merge(contract.binding);
      return assertWith(arg, contract.contract, newglobal, callback);
    }

    //   _           _  ___         _               _   
    //  /_\  _ _  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
    // / _ \| ' \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
    ///_/ \_\_||_\__,_|\___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof AndContract) {
      var callback = _.AndCallback(callback);
      var tmp = assertWith(arg, contract.first, global, callback.leftHandler);
      return assertWith(tmp, contract.second, global,  callback.rightHandler); 
    }

    //  ___       ___         _               _   
    // / _ \ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| (_) | '_| (__/ _ \ ' \  _| '_/ _` / _|  _|
    // \___/|_|  \___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof OrContract) {
      var callback = _.OrCallback(callback);
      var tmp = assertWith(arg, contract.first, global, callback.leftHandler);
      return assertWith(tmp, contract.second, global,  callback.rightHandler); 
    }

    // _  _     _    ___         _               _   
    //| \| |___| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| .` / _ \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_|\_\___/\__|\___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof NotContract) {
      var callback = _.NotCallback(callback);
      return assertWith(arg, contract.sub, global, callback.subHandler);
    }

    // ___                ___         _               _   
    //| _ ) __ _ ___ ___ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| _ \/ _` (_-</ -_) (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___/\__,_/__/\___|\___\___/_||_\__|_| \__,_\__|\__|

    else if(contract instanceof BaseContract) {
      var globalArg = global.dump(); 
      var thisArg = undefined;
      var argsArray = new Array();

      argsArray.push(arg);

      try {
        var result = _.eval(contract.predicate, globalArg, thisArg, argsArray);
      } catch (e) {
        var result = false;
      } finally {
        if(!result) {
          callback(_.Logic.translate(false), "@"+contract.toString());
        } else {
          callback(_.Logic.translate(true), "@"+contract.toString());
        }
        return arg;
      }
    }

    // ___               _ _              ___         _               _   
    /// __| __ _ _ _  __| | |__  _____ __/ __|___ _ _| |_ _ _ __ _ __| |_ 
    //\__ \/ _` | ' \/ _` | '_ \/ _ \ \ / (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___/\__,_|_||_\__,_|_.__/\___/_\_\\___\___/_||_\__|_| \__,_\__|\__|

    else if(contract instanceof SandboxContract) {
      var globalArg = global.dump(); 
      var thisArg = undefined;
      var argsArray = new Array();

      argsArray.push(_.wrap(arg));

      /* Merge global objects
      */ 

      // clone object
      function clone(obj) {
        var tmp = {};
        for(var property in obj) tmp[property] = obj[property];
        return tmp;
      }
      // clear object
      function clear(obj) {
        for(var property in obj) delete obj[property];
      }
      // copy objA[property] => objB[property]
      function copy(objA, objB) {
        for(var property in objA) objB[property]=objA[property];
      }

      var backupGlobal = clone(contract.global);
      copy(globalArg, contract.global);

      try {
        var result = contract.predicate.apply(thisArg, argsArray);
      } catch (e) {
        var result = false;
      } finally {
        if(!result) {
          callback(_.Logic.translate(false), "@"+contract.toString());
        } else {
          callback(_.Logic.translate(true), "@"+contract.toString());
        }
        clear(contract.global);
        copy(backupGlobal, contract.global);
        return arg;
      }
    }

    //  ___             _               _           
    // / __|___ _ _  __| |_ _ _ _  _ __| |_ ___ _ _ 
    //| (__/ _ \ ' \(_-<  _| '_| || / _|  _/ _ \ '_|
    // \___\___/_||_/__/\__|_|  \_,_\__|\__\___/_|  

    else if(contract instanceof Constructor) {
      return assertWith(arg, construct(contract), global, callback);
    }

    else error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
  }

  // _    _                 _ _           
  //| |  | |               | | |          
  //| |__| | __ _ _ __   __| | | ___ _ __ 
  //|  __  |/ _` | '_ \ / _` | |/ _ \ '__|
  //| |  | | (_| | | | | (_| | |  __/ |   
  //|_|  |_|\__,_|_| |_|\__,_|_|\___|_|   

  function FunctionHandler(contract, global, callback) {
    if(!(this instanceof FunctionHandler)) return new FunctionHandler(contract, global, callback);

    this.apply = function(target, thisArg, args) {
      var args = assertWith(args, contract.domain, global, callback);
      var val = target.apply(thisArg, args);  
      return assertWith(val, contract.range, global, callback);
    };
    this.construct = function(target, args) {
      var obj = Object.create(target.prototype);
      this.apply(target, obj, args);
      return obj;
    };
  }

  function MethodHandler(contract, global, callback) {
    if(!(this instanceof MethodHandler)) return new MethodHandler(contract, global, callback);

    this.apply = function(target, thisArg, args) {
      var thisArg = assertWith(thisArg, context, global, callback);
      var args = assertWith(args, contract.domain, global, callback);
      var val = target.apply(thisArg, args);  
      return assertWith(val, range, global, callback);
    };
    this.construct = function(target, args) {
      var obj = Object.create(target.prototype);
      this.apply(target, obj, args);
      return obj;
    };
  }

  function DependentHandler(contract, global, callback) {
    if(!(this instanceof DependentHandler)) return new DependentHandler(contract, global, callback);

    this.apply = function(target, thisArg, args) { 
      var range = constructWith(args, contract.constructor, global);
      var val = target.apply(thisArg, args); 
      return assertWith(val, range, global, callback);
    };
    this.construct = function(target, args) {
      var obj = Object.create(target.prototype);
      this.apply(target, this, args);
      return obj;
    };
  }

  function ObjectHandler(contract, global, callback) {
    if(!(this instanceof ObjectHandler)) return new ObjectHandler(contract, global, callback);

    this.get = function(target, name, receiver) {
      if(contract.map instanceof StringMap) {
        return (contract.map.has(name)) ? assertWith(target[name], contract.map.get(name), global, callback) : target[name];
      } else {
        var target = target[name];
        contract.map.slice(name).foreach(function(i, contract) {
          target = assertWith(target, contract, global, callback);
        });
        return target;
      } 
    };

    this.set = function(target, name, value, reveiver) {
      var value = (contract.map.has(name)) ? assertWith(value, contract.map.get(name), global, callback) : value;
      return target[name] = value;
    }
  }

  //                     _                   _   
  //                    | |                 | |  
  //  ___ ___  _ __  ___| |_ _ __ _   _  ___| |_ 
  // / __/ _ \| '_ \/ __| __| '__| | | |/ __| __|
  //| (_| (_) | | | \__ \ |_| |  | |_| | (__| |_ 
  // \___\___/|_| |_|___/\__|_|   \__,_|\___|\__|

  function construct(constructor) {
    log("construct", constructor);

    if(!(constructor instanceof Constructor)) error("Wrong Constructor", (new Error()).fileName, (new Error()).lineNumber);

    var args = Array.slice(arguments);
    args.shift();
    return constructWith(args, constructor, new Global());
  }

  function constructWith(args, constructor, global) {
    log("construct with", constructor);

    if(!(constructor instanceof Constructor)) error("Wrong Constructor", (new Error()).fileName, (new Error()).lineNumber);

    var globalArg = global.dump(); 
    var thisArg = undefined;
    var argsArray = args;

    var treatjs = {};
    var newBaseContract = function (predicate, name) {
      return SandboxContract(predicate, globalArg, name);
    };

    for(property in _) {
      if(proeprty==="BaseContract") __defined(property, newBaseContract, treatjs);
      else __defined(property, _[property], treatjs);
    }





    /** TODO
     * Bind the _ (TreatJS) Object
     *
     * Replace the BaseContract by a SandboxContrct
     * Use a fore each loop
     */
    /*
       newglobal.FunctionContract = FunctionContract;
    //newglobal.SFunctionContract = SFunctionContract;
    newglobal.DependentContract = DependentContract;
    newglobal.ObjectContract = ObjectContract;

    newglobal.With = WithContract;

    newglobal.And = AndContract;
    newglobal.Or = OrContract;
    newglobal.Not = NotContract;

    newglobal.Constructor = ContractConstructor;

    newglobal.assert = assert;
    newglobal.construct = construct;
    */

    globalArg["_"] = treatjs;

    var contract = (_.eval(constructor.constructor, globalArg, thisArg, argsArray));

    if(!(contract instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
    return contract;
  }

  /**
   * Core Functions
   */

  __define("construct", construct, _);
  __define("assert", assert, _);

})(_);

