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

  // out
  var error = _.error;
  var violation = _.violation;
  var blame = _.blame;

  // prototypes
  var Contract = _.Core.Contract;
  var Constructor = _.Core.Constructor;

  // contracts
  var DelayedContract = _.Delayed;
  var ImmediateContract = _.Immediate;
  var CombinatorContract = _.Combinator;

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

  var UnionContract = _.Union;
  var IntersectionContract = _.Intersection;
  var NegationContract = _.Negation;

  // maps
  var Map = _.Map;
  var StringMap = _.Map.StringMap;

  // callbacks
  var Callback = _.Callback.Callback;
  var Handle =  _.Callback.Handle;

  var AndCallback = _.Callback.AndCallback;
  var OrCallback = _.Callback.OrCallback;
  var NotCallback = _.Callback.NotCallback;

  var RootCallback = _.Callback.RootCallback;
  var BaseCallback = _.Callback.BaseCallback;
  var FunctionCallback = _.Callback.FunctionCallback;
  var ObjectCallback = _.Callback.ObjectCallback;

  var IntersectionCallback = _.Callback.IntersectionCallback;
  var UnionCallback = _.Callback.UnionCallback;
  var NegationCallback = _.Callback.NegationCallback;

  // logic
  var translate = _.Logic.translate;

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

    var callback = RootCallback(function(handle) {
      if(handle.contract.isFalse()) {

        var msg = "Contract Violation: " + handle.blame();
        msg+="\n";
        msg+="Blame is on: ";
        if(handle.caller.isFalse() && !handle.callee.isFalse()) {
          msg+="Caller";
        } else if(!handle.caller.isFalse() && handle.callee.isFalse()) {
          msg+="Callee";
        } else if(handle.caller.isFalse() && handle.callee.isFalse()) {
          msg+="Caller, Callee";
        } else {
          msg+="-";
        }

        /* TODO
         * remove print output
         */
        print("@Caller:   " + handle.caller);
        print("@Callee:   " + handle.callee);
        print("@Contract: " + handle.contract);

        blame(contract, msg, (new Error()).fileName, (new Error()).lineNumber);
      }
    }, contract);
    return assertWith(arg, contract, new Global(), callback.rootHandler);
  }

  function assertWith(arg, contract, global, callbackHandler) {
    log("assert with", contract);

    if(!(contract instanceof Contract)) error("Wrong Contract.", (new Error()).fileName, (new Error()).lineNumber);
    if(!(callbackHandler instanceof Function)) error("Wrong Callback Handler.", (new Error()).fileName, (new Error()).lineNumber);

    // ___          _   _   _          ___         _               _   
    //| __|  _ _ _ | |_| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| _| || | ' \| / /  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_| \_,_|_||_|_\_\\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

    if(contract instanceof FunctionContract) {
      if(!(arg instanceof Function)) callbackHandler(Handle(_.Logic.True, _.Logic.False, _.Logic.False));

      var handler = new FunctionHandler(contract, global, callbackHandler);
      var proxy = new Proxy(arg, handler);
      return proxy;
    }

    // __  __     _   _            _  ___         _               _   
    //|  \/  |___| |_| |_  ___  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
    //| |\/| / -_)  _| ' \/ _ \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_|  |_\___|\__|_||_\___/\__,_|\___\___/_||_\__|_| \__,_\__|\__|

    if(contract instanceof MethodContract) {
      if(!(arg instanceof Function)) callbackHandler(Handle(_.Logic.True, _.Logic.False, _.Logic.False));

      var handler = new MethodHandler(contract, global, callbackHandler);
      var proxy = new Proxy(arg, handler);
      return proxy;
    }

    //  ___  _     _        _    ___         _               _   
    // / _ \| |__ (_)___ __| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| (_) | '_ \| / -_) _|  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
    // \___/|_.__// \___\__|\__|\___\___/_||_\__|_| \__,_\__|\__|
    //          |__/                                             

    else if (contract instanceof ObjectContract) {
      if(!(arg instanceof Object)) callbackHandler(Handle(_.Logic.True, _.Logic.False, _.Logic.False));

      /* STRICT MODE */
      /* TODO
         if(contract.strict) {
         contract.map.foreach(function(key, contract) {
         arg[key] = assertWith(arg[key], contract, global, callbackHandler);
         });
         }*/

      var handler = new ObjectHandler(contract, global, callbackHandler);
      var proxy = new Proxy(arg, handler);
      return proxy;
    }

    // ___                        _         _    ___         _               _   
    //|   \ ___ _ __  ___ _ _  __| |___ _ _| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| |) / -_) '_ \/ -_) ' \/ _` / -_) ' \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___/\___| .__/\___|_||_\__,_\___|_||_\__|\___\___/_||_\__|_| \__,_\__|\__|
    //         |_|                                                               

    if(contract instanceof DependentContract) {
      if(!(arg instanceof Function)) callbackHandler(Handle(_.Logic.True, _.Logic.False, _.Logic.False));

      var handler = new DependentHandler(contract, global, callbackHandler);
      var proxy = new Proxy(arg, handler);
      return proxy;
    }

    //__      ___ _   _    ___         _               _   
    //\ \    / (_) |_| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
    // \ \/\/ /| |  _| ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //  \_/\_/ |_|\__|_||_\___\___/_||_\__|_| \__,_\__|\__|                                                   

    else if (contract instanceof WithContract) {
      var newglobal = global.merge(contract.binding);
      return assertWith(arg, contract.contract, newglobal, callbackHandler);
    }

    //   _           _  ___         _               _   
    //  /_\  _ _  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
    // / _ \| ' \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
    ///_/ \_\_||_\__,_|\___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof AndContract) {
      var contracted = undefined;

      // _                    _ _      _       
      //(_)_ __  _ __  ___ __| (_)__ _| |_ ___ 
      //| | '  \| '  \/ -_) _` | / _` |  _/ -_)
      //|_|_|_|_|_|_|_\___\__,_|_\__,_|\__\___|

      if(immediateContract(contract)) {
        var callback = AndCallback(callbackHandler, contract);

        var first = assertWith(arg, contract.first, global, callback.leftHandler);
        var second = assertWith(first, contract.second, global,  callback.rightHandler);

        contracted = arg;
      }

      //    _     _                  _ 
      // __| |___| |__ _ _  _ ___ __| |
      /// _` / -_) / _` | || / -_) _` |
      //\__,_\___|_\__,_|\_, \___\__,_|
      //                 |__/          

      if(delayedContarct(contract)) {

        //delayed contract assertion
        function assert() {
          var callback = AndCallback(callbackHandler, contract);

          var first = assertWith(arg, contract.first, global, callback.leftHandler);
          var second = assertWith(first, contract.second, global,  callback.rightHandler);

          return second;
        }

        var handler = new DelayedHandler(assert);
        var proxy = new Proxy(arg, handler);

        contracted = proxy;
      }

      return contracted;
    }

    //  ___       ___         _               _   
    // / _ \ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| (_) | '_| (__/ _ \ ' \  _| '_/ _` / _|  _|
    // \___/|_|  \___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof OrContract) {
      var contracted = undefined;

      // _                    _ _      _       
      //(_)_ __  _ __  ___ __| (_)__ _| |_ ___ 
      //| | '  \| '  \/ -_) _` | / _` |  _/ -_)
      //|_|_|_|_|_|_|_\___\__,_|_\__,_|\__\___|

      if(immediateContract(contract)) {
        var callback = OrCallback(callbackHandler, contract);

        var first = assertWith(arg, contract.first, global, callback.leftHandler);
        var second = assertWith(first, contract.second, global,  callback.rightHandler);

        contracted = arg;
      }

      //    _     _                  _ 
      // __| |___| |__ _ _  _ ___ __| |
      /// _` / -_) / _` | || / -_) _` |
      //\__,_\___|_\__,_|\_, \___\__,_|
      //                 |__/          

      if(delayedContarct(contract)) {

        //delayed contract assertion
        function assert() {
          var callback = OrCallback(callbackHandler, contract);

          var first = assertWith(arg, contract.first, global, callback.leftHandler);
          var second = assertWith(first, contract.second, global,  callback.rightHandler);

          return second;
        }

        var handler = new DelayedHandler(assert);
        var proxy = new Proxy(arg, handler);

        contracted = proxy;
      }

      return contracted;
    }

    // _  _     _    ___         _               _   
    //| \| |___| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| .` / _ \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_|\_\___/\__|\___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof NotContract) {
      var contracted = undefined;

      // _                    _ _      _       
      //(_)_ __  _ __  ___ __| (_)__ _| |_ ___ 
      //| | '  \| '  \/ -_) _` | / _` |  _/ -_)
      //|_|_|_|_|_|_|_\___\__,_|_\__,_|\__\___|

      if(immediateContract(contract)) {
        var callback = NotCallback(callbackHandler, contract);
        var sub = assertWith(arg, contract.sub, global, callback.subHandler);
        contracted = sub;
      }

      //    _     _                  _ 
      // __| |___| |__ _ _  _ ___ __| |
      /// _` / -_) / _` | || / -_) _` |
      //\__,_\___|_\__,_|\_, \___\__,_|
      //                 |__/          

      if(delayedContarct(contract)) {

        //delayed contract assertion
        function assert() {
          var callback = NotCallback(callbackHandler, contract);
          var sub = assertWith(arg, contract.sub, global, callback.subHandler);
          return sub;
        }

        var handler = new DelayedHandler(assert);
        var proxy = new Proxy(arg, handler);

        contracted = proxy;
      }

      return contracted;
    }

    // ___     _                      _   _          ___         _               _   
    //|_ _|_ _| |_ ___ _ _ ___ ___ __| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    // | || ' \  _/ -_) '_(_-</ -_) _|  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___|_||_\__\___|_| /__/\___\__|\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof IntersectionContract) {
      var contracted = undefined;

      // _                    _ _      _       
      //(_)_ __  _ __  ___ __| (_)__ _| |_ ___ 
      //| | '  \| '  \/ -_) _` | / _` |  _/ -_)
      //|_|_|_|_|_|_|_\___\__,_|_\__,_|\__\___|

      if(immediateContract(contract)) {
        var callback = IntersectionCallback(callbackHandler, contract);

        var first = assertWith(arg, contract.first, global, callback.leftHandler);
        var second = assertWith(first, contract.second, global,  callback.rightHandler);

        contracted = arg;
      }

      //    _     _                  _ 
      // __| |___| |__ _ _  _ ___ __| |
      /// _` / -_) / _` | || / -_) _` |
      //\__,_\___|_\__,_|\_, \___\__,_|
      //                 |__/          

      if(delayedContarct(contract)) {

        //delayed contract assertion
        function assert() {
          var callback = IntersectionCallback(callbackHandler, contract);

          var first = assertWith(arg, contract.first, global, callback.leftHandler);
          var second = assertWith(first, contract.second, global,  callback.rightHandler);

          return second;
        }

        var handler = new DelayedHandler(assert);
        var proxy = new Proxy(arg, handler);

        contracted = proxy;
      }

      return contracted;
    }

    // _   _      _          ___         _               _   
    //| | | |_ _ (_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| |_| | ' \| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    // \___/|_||_|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof UnionContract) {
      var contracted = undefined;

      // _                    _ _      _       
      //(_)_ __  _ __  ___ __| (_)__ _| |_ ___ 
      //| | '  \| '  \/ -_) _` | / _` |  _/ -_)
      //|_|_|_|_|_|_|_\___\__,_|_\__,_|\__\___|

      if(immediateContract(contract)) {
        var callback = UnionCallback(callbackHandler, contract);

        var first = assertWith(arg, contract.first, global, callback.leftHandler);
        var second = assertWith(first, contract.second, global,  callback.rightHandler);

        contracted = arg;
      }

      //    _     _                  _ 
      // __| |___| |__ _ _  _ ___ __| |
      /// _` / -_) / _` | || / -_) _` |
      //\__,_\___|_\__,_|\_, \___\__,_|
      //                 |__/          

      if(delayedContarct(contract)) {

        //delayed contract assertion
        function assert() {
          var callback = UnionCallback(callbackHandler, contract);

          var first = assertWith(arg, contract.first, global, callback.leftHandler);
          var second = assertWith(first, contract.second, global,  callback.rightHandler);

          return second;
        }

        var handler = new DelayedHandler(assert);
        var proxy = new Proxy(arg, handler);

        contracted = proxy;
      }

      return contracted;
    }

    // _  _               _   _          ___         _               _   
    //| \| |___ __ _ __ _| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| .` / -_) _` / _` |  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_|\_\___\__, \__,_|\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|
    //         |___/       

    else if (contract instanceof NegationContract) {
      var contracted = undefined;

      // _                    _ _      _       
      //(_)_ __  _ __  ___ __| (_)__ _| |_ ___ 
      //| | '  \| '  \/ -_) _` | / _` |  _/ -_)
      //|_|_|_|_|_|_|_\___\__,_|_\__,_|\__\___|

      if(immediateContract(contract)) {
        var callback = NegationCallback(callbackHandler, contract);
        var sub = assertWith(arg, contract.sub, global, callback.subHandler);
        contracted = sub;
      }

      //    _     _                  _ 
      // __| |___| |__ _ _  _ ___ __| |
      /// _` / -_) / _` | || / -_) _` |
      //\__,_\___|_\__,_|\_, \___\__,_|
      //                 |__/          

      if(delayedContarct(contract)) {

        //delayed contract assertion
        function assert() {
          var callback = NegationCallback(callbackHandler, contract);
          var sub = assertWith(arg, contract.sub, global, callback.subHandler);
          return sub;
        }

        var handler = new DelayedHandler(assert);
        var proxy = new Proxy(arg, handler);

        contracted = proxy;
      }

      return contracted;
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

      var callback = BaseCallback(callbackHandler, contract);



      try {
        var result = translate(_.eval(contract.predicate, globalArg, thisArg, argsArray));
      } catch (e) {
        var result = _.Logic.Conflict;
      } finally {
        var handle = Handle(_.Logic.True, result, result);
        callback.predicateHandler(handle);
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

      var callback = BaseCallback(callbackHandler, contract);

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
        var result = translate(contract.predicate.apply(thisArg, argsArray));
      } catch (e) {
        var result = _.Logic.make(1,1);
      } finally {
        var handle = Handle(_.Logic.True, result, result);
        callback.predicateHandler(handle);
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
      return assertWith(arg, construct(contract), global, callbackHandler);
    }

    else error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
  }

  // _ __ _ _ ___ __| (_)__ __ _| |_ ___ ___
  //| '_ \ '_/ -_) _` | / _/ _` |  _/ -_|_-<
  //| .__/_| \___\__,_|_\__\__,_|\__\___/__/
  //|_|                                     

  /** Delayed Contarct
   * @param contarct Contarct
   * @return true if contarct contains delayed contract
   */
  function delayedContarct(contract) {
    switch(true) {
      case contract instanceof DelayedContract:
        return true;
        break;
      case contract instanceof ImmediateContract:
        return false;
        break;
      case contract instanceof CombinatorContract: 
        switch(true) {
          case contract instanceof AndContract:
          case contract instanceof OrContract:
          case contract instanceof IntersectionContract:
          case contract instanceof UnionContract:
            return (delayedContarct(contract.first) || delayedContarct(contract.second))
              break;
          case contract instanceof NotContract:
          case contract instanceof NegationContract:
            return delayedContarct(contract.sub);
            break;
          case contract instanceof WithContract:
            return delayedContarct(contract.contract);
            break;
        }
        break;
      default:
        // default value
        return true;
    }
  }

  /** Immediate Contarct
   * @param contarct Contarct
   * @return true if contarcts contains immediate contract on its top-level
   */
  function immediateContract(contract) {
    switch(true) {
      case contract instanceof DelayedContract:
        return false;
        break;
      case contract instanceof ImmediateContract:
        return true;
        break;
      case contract instanceof CombinatorContract:
        switch(true) {
          case contract instanceof AndContract:
          case contract instanceof OrContract:
          case contract instanceof IntersectionContract:
          case contract instanceof UnionContract:
            return (immediateContract(contract.first) || immediateContract(contract.second))
              break;
          case contract instanceof NotContract:
          case contract instanceof NegationContract:
            return immediateContract(contract.sub);
            break;
          case contract instanceof WithContract:
            return immediateContract(contract.contract);
            break;
        }
        break;
      default:
        // default value
        return true;
    }
  }

  // _    _                 _ _           
  //| |  | |               | | |          
  //| |__| | __ _ _ __   __| | | ___ _ __ 
  //|  __  |/ _` | '_ \ / _` | |/ _ \ '__|
  //| |  | | (_| | | | | (_| | |  __/ |   
  //|_|  |_|\__,_|_| |_|\__,_|_|\___|_|   

  function DelayedHandler(assert) {
    if(!(this instanceof DelayedHandler)) return new DelayedHandler(assert);

    this.apply = function(target, thisArg, args) {
      return assert().apply(thisArg, args);
    };
  }

  function FunctionHandler(contract, global, handler) {
    if(!(this instanceof FunctionHandler)) return new FunctionHandler(contract, global, handler);
    this.apply = function(target, thisArg, args) {
      var callback = FunctionCallback(handler, contract);
      var args = assertWith(args, contract.domain, global, callback.domainHandler);
      var val = target.apply(thisArg, args);  
      return assertWith(val, contract.range, global, callback.rangeHandler);
    };
    this.construct = function(target, args) {
      var obj = Object.create(target.prototype);
      this.apply(target, obj, args);
      return obj;
    };
  }

  function MethodHandler(contract, global, handler) {
    if(!(this instanceof MethodHandler)) return new MethodHandler(contract, global, handler);

    this.apply = function(target, thisArg, args) {

      // domain := arguments + this
      // range  := return

      var callback = FunctionCallback(handler, contract);
      var domainCallback = AndCallback(callback.domainHandler, contract);

      var thisArg = assertWith(thisArg, contract.context, global, domainCallback.leftHandler);
      var args = assertWith(args, contract.domain, global, domainCallback.rightHandler);
      var val = target.apply(thisArg, args);  
      return assertWith(val, contract.range, global, callback.rangeHandler);
    };
    this.construct = function(target, args) {
      var obj = Object.create(target.prototype);
      this.apply(target, obj, args);
      return obj;
    };
  }

  function DependentHandler(contract, global, handler) {
    if(!(this instanceof DependentHandler)) return new DependentHandler(contract, global, handler);

    this.apply = function(target, thisArg, args) {
      var range = constructWith(args, contract.constructor, global);
      var val = target.apply(thisArg, args); 
      return assertWith(val, range, global, handler);
    };
    this.construct = function(target, args) {
      var obj = Object.create(target.prototype);
      this.apply(target, this, args);
      return obj;
    };
  }

  function ObjectHandler(contract, global, handler) {
    if(!(this instanceof ObjectHandler)) return new ObjectHandler(contract, global, handler);

    var callbacks = {};

    function getCallback(name) {
      callbacks[name] = callbacks[name] || ObjectCallback(handler, contract);
      return callbacks[name];
    }

    this.get = function(target, name, receiver) {
      var callback = getCallback(name);

      if(contract.map instanceof StringMap) {
        return (contract.map.has(name)) ? assertWith(target[name], contract.map.get(name), global, callback.getHandler) : target[name];
      } else {
        /* TODO
         * test this
         */
        var target = target[name];
        contract.map.slice(name).foreach(function(i, contract) {
          target = assertWith(target, contract, global, callback.getHandler);
        });
        return target;
      } 
    };

    this.set = function(target, name, value, reveiver) {
      var callback = getCallback(name);

      if(contract.map instanceof StringMap) {
        value = (contract.map.has(name)) ? assertWith(value, contract.map.get(name), global, callback.setHandler) : value;
      }
      /* TODO
       * check regex map
       * strict mode only in ObjectCallback
       */
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

    var newglobal = (constructor.binding!==undefined) ? global.merge(constructor.binding) : global;   
    var globalArg = newglobal.dump(); 
    var thisArg = undefined;
    var argsArray = args;

    var treatjs = {};
    var newBaseContract = function (predicate, name) {
      return SandboxContract(predicate, globalArg, name);
    };

    for(property in _) {
      if(property==="BaseContract") {
        __define(property, newBaseContract, treatjs);
      }
      else __define(property, _[property], treatjs);
    }

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
