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

  var TreatJSError = _.TreatJSError;
  var TreatJSViolation = _.TreatJSViolation;
  var TreatJSBlame = _.TreatJSBlame;

  // prototypes
  var Contract = _.Core.Contract;
  var Constructor = _.Core.Constructor;

  // contracts
  var DelayedContract = _.Delayed;
  var ImmediateContract = _.Immediate;
  var CombinatorContract = _.Combinator;
  var WrapperContract = _.Wrapper;

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

  var ReflectionContract = _.Reflection;

  // contracts // TODO
  var VariableContract = _.Polymorphic.Variable;


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
  var PropertyCallback = _.Callback.PropertyCallback;

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

  /** count(msg)
   * @param key String
   */
  function count(key) {
    if(_.Config.Verbose.statistic) _.Statistic.inc(key);
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
  SandboxContract.prototype = new ImmediateContract();

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
    count(_.Statistic.ASSERT);

    // disbale assertion
    if(!_.Config.assertion) return arg;

    if(!(contract instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    if(_.Config.canonicalize) {
      if(!canonical(contract)) return assert(arg, _.canonicalize(contract));
    } else {
      if(!canonical(contract)) error("Non-canonical contract", (new Error()).fileName, (new Error()).lineNumber);
    }

    var callback = RootCallback(function(handle) {
      //if(handle.contract.isFalse()) { // TODO, use something like handle.isFalse
      if(handle.caller.isFalse() || handle.callee.isFalse()) {

        var msg = handle.blame();
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

        msg += "\n" + "@Caller:   " + handle.caller;
        msg += "\n" + "@Callee:   " + handle.callee;
        msg += "\n" + "@Contract: " + handle.contract;

        blame(contract, msg, (new Error()).fileName, (new Error()).lineNumber);
      }
    }, contract);
    return assertWith(arg, contract, new Global(), callback.rootHandler);
  }

  function assertWith(arg, contract, global, callbackHandler) {
    log("assert with", contract);
    count(_.Statistic.ASSERTWITH);

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
      if(contract.strict) {
        contract.map.foreach(function(key, contract) {
          arg[key] = assertWith(arg[key], contract, global, callbackHandler);
        });
      }

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
      return assertWith(arg, contract.sub, newglobal, callbackHandler);
    }

    //   _           _  ___         _               _   
    //  /_\  _ _  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
    // / _ \| ' \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
    ///_/ \_\_||_\__,_|\___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof AndContract) {
      var callback = AndCallback(callbackHandler, contract);

      var first = assertWith(arg, contract.first, global, callback.leftHandler);
      var second = assertWith(first, contract.second, global,  callback.rightHandler);

      return second;
    }

    // _   _      _          ___         _               _   
    //| | | |_ _ (_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| |_| | ' \| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    // \___/|_||_|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof UnionContract) {
      var callback = UnionCallback(callbackHandler, contract);

      var first = assertWith(arg, contract.first, global, callback.leftHandler);
      var second = assertWith(first, contract.second, global,  callback.rightHandler);

      return second;
    }

    //  ___       ___         _               _   
    // / _ \ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| (_) | '_| (__/ _ \ ' \  _| '_/ _` / _|  _|
    // \___/|_|  \___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof OrContract) {

      //    _     _                  _ 
      // __| |___| |__ _ _  _ ___ __| |
      /// _` / -_) / _` | || / -_) _` |
      //\__,_\___|_\__,_|\_, \___\__,_|
      //                 |__/          

      if(delayed(contract)) {
        //delayed contract assertion
        function assert() {
          var callback = OrCallback(callbackHandler, contract);

          var first = assertWith(arg, contract.first, global, callback.leftHandler);
          var second = assertWith(first, contract.second, global,  callback.rightHandler);

          return second;
        }

        var handler = new DelayedHandler(assert);
        var proxy = new Proxy(arg, handler);

        return proxy;
      } 

      // _                    _ _      _       
      //(_)_ __  _ __  ___ __| (_)__ _| |_ ___ 
      //| | '  \| '  \/ -_) _` | / _` |  _/ -_)
      //|_|_|_|_|_|_|_\___\__,_|_\__,_|\__\___|

      else {
        var callback = OrCallback(callbackHandler, contract);

        var first = assertWith(arg, contract.first, global, callback.leftHandler);
        var second = assertWith(first, contract.second, global,  callback.rightHandler);

        return second;
      }    
    }

    // ___     _                      _   _          ___         _               _   
    //|_ _|_ _| |_ ___ _ _ ___ ___ __| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    // | || ' \  _/ -_) '_(_-</ -_) _|  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___|_||_\__\___|_| /__/\___\__|\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof IntersectionContract) {

      //    _     _                  _ 
      // __| |___| |__ _ _  _ ___ __| |
      /// _` / -_) / _` | || / -_) _` |
      //\__,_\___|_\__,_|\_, \___\__,_|
      //                 |__/          

      if(delayed(contract)) {
        //delayed contract assertion
        function assert() {
          var callback = IntersectionCallback(callbackHandler, contract);

          var first = assertWith(arg, contract.first, global, callback.leftHandler);
          var second = assertWith(first, contract.second, global,  callback.rightHandler);

          return second;
        }

        var handler = new DelayedHandler(assert);
        var proxy = new Proxy(arg, handler);

        return proxy;
      } 
      // _                    _ _      _       
      //(_)_ __  _ __  ___ __| (_)__ _| |_ ___ 
      //| | '  \| '  \/ -_) _` | / _` |  _/ -_)
      //|_|_|_|_|_|_|_\___\__,_|_\__,_|\__\___|

      else {
        var callback = IntersectionCallback(callbackHandler, contract);

        var first = assertWith(arg, contract.first, global, callback.leftHandler);
        var second = assertWith(first, contract.second, global,  callback.rightHandler);

        return second;
      } 
    }

    // _  _     _    ___         _               _   
    //| \| |___| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| .` / _ \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_|\_\___/\__|\___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof NotContract) {

      //    _     _                  _ 
      // __| |___| |__ _ _  _ ___ __| |
      /// _` / -_) / _` | || / -_) _` |
      //\__,_\___|_\__,_|\_, \___\__,_|
      //                 |__/          

      if(delayed(contract)) {
        //delayed contract assertion
        function assert() {
          var callback = NotCallback(callbackHandler, contract);
          var sub = assertWith(arg, contract.sub, global, callback.subHandler);
          return sub;
        }

        var handler = new DelayedHandler(assert);
        var proxy = new Proxy(arg, handler);

        return  proxy;
      }

      // _                    _ _      _       
      //(_)_ __  _ __  ___ __| (_)__ _| |_ ___ 
      //| | '  \| '  \/ -_) _` | / _` |  _/ -_)
      //|_|_|_|_|_|_|_\___\__,_|_\__,_|\__\___|

      else { 
        var callback = NotCallback(callbackHandler, contract);
        var sub = assertWith(arg, contract.sub, global, callback.subHandler);
        return sub;
      }
    }

    // _  _               _   _          ___         _               _   
    //| \| |___ __ _ __ _| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| .` / -_) _` / _` |  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_|\_\___\__, \__,_|\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|
    //         |___/       

    else if (contract instanceof NegationContract) {

      //    _     _                  _ 
      // __| |___| |__ _ _  _ ___ __| |
      /// _` / -_) / _` | || / -_) _` |
      //\__,_\___|_\__,_|\_, \___\__,_|
      //                 |__/          

      if(delayed(contract)) {
        //delayed contract assertion
        function assert() {
          var callback = NegationCallback(callbackHandler, contract);
          var sub = assertWith(arg, contract.sub, global, callback.subHandler);
          return sub;
        }

        var handler = new DelayedHandler(assert);
        var proxy = new Proxy(arg, handler);

        return  proxy;
      }

      // _                    _ _      _       
      //(_)_ __  _ __  ___ __| (_)__ _| |_ ___ 
      //| | '  \| '  \/ -_) _` | / _` |  _/ -_)
      //|_|_|_|_|_|_|_\___\__,_|_\__,_|\__\___|

      else { 
        var callback = NegationCallback(callbackHandler, contract);
        var sub = assertWith(arg, contract.sub, global, callback.subHandler);
        return sub;
      }
    }

    // ___                ___         _               _   
    //| _ ) __ _ ___ ___ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| _ \/ _` (_-</ -_) (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___/\__,_/__/\___|\___\___/_||_\__|_| \__,_\__|\__|

    else if(contract instanceof BaseContract) {
      count(_.Statistic.BASE);

      var globalArg = global.dump();
      var thisArg = undefined;
      var argsArray = new Array();
      argsArray.push(arg);

      var callback = BaseCallback(callbackHandler, contract);

      try {
        var result = translate(_.eval(contract.predicate, globalArg, thisArg, argsArray));
      } catch (e) { 
        if(e instanceof TreatJSError) {
          var result = e;
        } else {
          var result = _.Logic.Conflict;
        }
      } finally {
        if(result instanceof TreatJSError) {
          throw result;
        } else {
          var handle = Handle(_.Logic.True, result, result);
          callback.predicateHandler(handle);
          return arg;
        }
      }
    }

    // ___               _ _              ___         _               _   
    /// __| __ _ _ _  __| | |__  _____ __/ __|___ _ _| |_ _ _ __ _ __| |_ 
    //\__ \/ _` | ' \/ _` | '_ \/ _ \ \ / (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___/\__,_|_||_\__,_|_.__/\___/_\_\\___\___/_||_\__|_| \__,_\__|\__|

    else if(contract instanceof SandboxContract) {
      count(_.Statistic.BASE);

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
        if(e instanceof TreatJSError) {
          var result = e;
        } else {
          var result = _.Logic.Conflict;
        }
      } finally {
        if(result instanceof TreatJSError) {
          throw result;
        } else {
          var handle = Handle(_.Logic.True, result, result);
          callback.predicateHandler(handle);
          clear(contract.global);
          copy(backupGlobal, contract.global);
          return arg;
        }
      }
    }

    //  ___             _               _           
    // / __|___ _ _  __| |_ _ _ _  _ __| |_ ___ _ _ 
    //| (__/ _ \ ' \(_-<  _| '_| || / _|  _/ _ \ '_|
    // \___\___/_||_/__/\__|_|  \_,_\__|\__\___/_|  

    else if(contract instanceof Constructor) {
      // TODO: old code
      // return assertWith(arg, construct(contract), global, callbackHandler);
      return assertWith(arg, construct(contract, global.dump()), global, callbackHandler);
    }

    // ___      __ _        _   _          
    //| _ \___ / _| |___ __| |_(_)___ _ _  
    //|   / -_)  _| / -_) _|  _| / _ \ ' \ 
    //|_|_\___|_| |_\___\__|\__|_\___/_||_|

    if(contract instanceof ReflectionContract) {
      if(!(arg instanceof Object)) callbackHandler(Handle(_.Logic.True, _.Logic.False, _.Logic.False));

      var reflect = new ReflectionHandler(contract, global, callbackHandler);
      var noop = new NoOpHandler();
      var proxy = new Proxy(arg, new Proxy(noop, reflect));
      return proxy;
    }

    //    _      __           _ _   
    // __| |___ / _|__ _ _  _| | |_ 
    /// _` / -_)  _/ _` | || | |  _|
    //\__,_\___|_| \__,_|\_,_|_|\__|

    else error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
  }

  // _ __ _ _ ___ __| (_)__ __ _| |_ ___ ___
  //| '_ \ '_/ -_) _` | / _/ _` |  _/ -_|_-<
  //| .__/_| \___\__,_|_\__\__,_|\__\___/__/
  //|_|                                     

  /**
   * Canonical Contracts:
   *
   * Immediate Contracts I,J ::=
   *  B | (I cap J)
   *  [| (I or J)]
   *  [| (not I)]
   *  [| with x=e I]
   *
   * Delayed Contracts Q,R ::=
   *  C->D | x->C | (Q cap R) | O
   *  [| (Q or R)]
   *  [| (not Q)]
   *  [| with x=e Q]
   *
   * Contracts C,D ::=
   *  I | Q | (C cup D) | (I cap C)
   *  [| (C and D) | (I or C)]
   *
   */

  /** Canonical Contract
   * @param contract Contract
   * @return true if contract is in canonical form, false otherwise
   */
  function canonical(contract) {
    if(!(contract instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    switch(true) {
      case immediate(contract):
        return true;
        break;
      case delayed(contract):
        return true;
        break;
      case contract instanceof CombinatorContract:
        switch(true) {
          case contract instanceof UnionContract:
          case contract instanceof AndContract:
            return true;
            break;
          case contract instanceof IntersectionContract:
          case contract instanceof OrContract:
            return (immediate(contract.first) && canonical(contract.second));
        }
        break;
      case contract instanceof WrapperContract:
        return canonical(contract.sub);
        // TODO
        //return false;
        break;
      default:
        error("Contract not implemented", (new Error()).fileName, (new Error()).lineNumber);
    }
  }

  /** Delayed Contract
   * @param contract Contract
   * @return true if contract is element of Delayed Contract, false otherwise
   */
  function delayed(contract) {
    if(!(contract instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    switch(true) {
      case contract instanceof ImmediateContract:
        return false;
        break;
      case contract instanceof DelayedContract:
        return true;
        break;
      case contract instanceof CombinatorContract: 
        if((contract instanceof IntersectionContract) || (contract instanceof OrContract))
          return (delayed(contract.first) && delayed(contract.second));
        else
          return false;
        break;
      case contract instanceof WrapperContract:
        return delayed(contract.sub);
        break;
      default:
        error("Contract not implemented", (new Error()).fileName, (new Error()).lineNumber);
    }
  }

  /** Immediate Contract
   * @param contract Contract
   * @return true if contract is element of Immediate Contract, false otherwise
   */
  function immediate(contract) {
    if(!(contract instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    switch(true) {
      case contract instanceof ImmediateContract:
        return true;
        break;
      case contract instanceof DelayedContract:
        return false;
        break;
      case contract instanceof CombinatorContract: 
        if((contract instanceof IntersectionContract) || (contract instanceof OrContract))
          return (immediate(contract.first) && immediate(contract.second));
        else
          return false;
        break;
      case contract instanceof WrapperContract:
        return immediate(contract.sub);
        break;
      default:
        error("Contract not implemented", (new Error()).fileName, (new Error()).lineNumber);
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

    var callback = ObjectCallback(handler, contract);

    var callbacks = {};
    var cache = new WeakMap();

    function getCallback(name) {
      callbacks[name] = callbacks[name] || PropertyCallback(callback.objectHandler, contract);
      return callbacks[name];
    }

    this.get = function(target, name, receiver) {

      function assert(target, name, global, callback) {
        if(contract.map instanceof StringMap) {
          return (contract.map.has(name)) ? assertWith(target[name], contract.map.get(name), global, callback.getHandler) : target[name];
        } else {
          var target = target[name];
          contract.map.slice(name).foreach(function(i, contract) {
            target = assertWith(target, contract, global, callback.getHandler);
          });
          return target;
        } 
      }

      var callback = getCallback(name);

      if(target[name] instanceof Object) {
        if(cache.has(target[name])) {
          return cache.get(target[name]);
        } else {
          var contracted = assert(target, name, global, callback);
          cache.set(target[name], contracted);
          return contracted;
        }
      } else {
        return assert(target, name, global, callback);
      }
    };

    this.set = function(target, name, value, reveiver) {
      var callback = getCallback(name);

      if(contract.map instanceof StringMap) {
        value = (contract.map.has(name)) ? assertWith(value, contract.map.get(name), global, callback.setHandler) : value;
      } else {
        contract.map.slice(name).foreach(function(i, contract) {
          value = assertWith(value, contract, global, callback.setHandler);
        });
      } 

      return target[name] = value;
    }
  }

  function ReflectionHandler(contract, global, handler) {
    if(!(this instanceof ReflectionHandler)) return new ReflectionHandler(contract, global, handler);

    this.get = function(target, name, receiver) {

      if(name === contract.trap) {
        return assertWith(target[name], contract.sub, global, handler);
      } else {
        return target[name];
      }
    };
  }

  function NoOpHandler() {
    if(!(this instanceof NoOpHandler)) return new NoOpHandler();

    // default get trap
    this.get = function(target, name, receiver) {
      return target[name];
    };

    // default set trap
    this.set = function(target, name, value, receiver) {
      return target[name]=value;
    };
  }

  //                     _                   _   
  //                    | |                 | |  
  //  ___ ___  _ __  ___| |_ _ __ _   _  ___| |_ 
  // / __/ _ \| '_ \/ __| __| '__| | | |/ __| __|
  //| (_| (_) | | | \__ \ |_| |  | |_| | (__| |_ 
  // \___\___/|_| |_|___/\__|_|   \__,_|\___|\__|

  function construct(constructor, args) { // TODO
    log("construct", constructor);

    if(!(constructor instanceof Constructor)) error("Wrong Constructor", (new Error()).fileName, (new Error()).lineNumber);

    // TODO, extend global over Constructors
    // and merge wih arguments
    return constructWith(constructor, ((args==undefined) ? [] : args), new Global());
  }

  function constructWith(constructor, args, global) {
    log("construct with", constructor);

    if(!(constructor instanceof Constructor)) error("Wrong Constructor", (new Error()).fileName, (new Error()).lineNumber);

    //  ___         _               _    ___             _               _           
    // / __|___ _ _| |_ _ _ __ _ __| |_ / __|___ _ _  __| |_ _ _ _  _ __| |_ ___ _ _ 
    //| (__/ _ \ ' \  _| '_/ _` / _|  _| (__/ _ \ ' \(_-<  _| '_| || / _|  _/ _ \ '_|
    // \___\___/_||_\__|_| \__,_\__|\__|\___\___/_||_/__/\__|_|  \_,_\__|\__\___/_|  

    if(constructor instanceof ContractConstructor) {
      // BASE CNTRACT
      var newglobal = (constructor.binding!==undefined) ? global.merge(constructor.binding) : global;   
      var globalArg = newglobal.dump(); 
      var thisArg = undefined;
      var argsArray = args;

      var treatjs = {};
      var contract = {}
      var newBaseContract = function (predicate, name) {
        return SandboxContract(predicate, globalArg, name);
      };

      for(property in _) {
        if(property==="BaseContract") {
          __define(property, newBaseContract, treatjs);
        }
        else __define(property, _[property], treatjs);
      }

      var build = _.build();

      for(property in build) {
        if(property==="Base") {
          __define(property, newBaseContract, contract);
        }
        else __define(property, build[property], contract);
      }

      globalArg["_"] = treatjs;
      globalArg["Contract"] = contract;
      globalArg["C"] = globalArg["Contract"];

      var contract = (_.eval(constructor.constructor, globalArg, thisArg, argsArray));

      if(!(contract instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
      return contract;
    }



    // ___                         _       _     ___         _               _   
    //| _ \__ _ _ _ __ _ _ __  ___| |_ _ _(_)__ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //|  _/ _` | '_/ _` | '  \/ -_)  _| '_| / _| (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_| \__,_|_| \__,_|_|_|_\___|\__|_| |_\__|\___\___/_||_\__|_| \__,_\__|\__|

    /* if(contract instanceof ParametricContract) {
      if(!(arg instanceof Object)) callbackHandler(Handle(_.Logic.True, _.Logic.False, _.Logic.False));
      // TODO, this must be a contract

      //var handler = new MethodHandler(contract, global, callbackHandler);
      //var proxy = new Proxy(arg, handler);
      //return proxy;
      return undefined;
    } */

    //__   __        _      _    _      ___         _               _   
    //\ \ / /_ _ _ _(_)__ _| |__| |___ / __|___ _ _| |_ _ _ __ _ __| |_ 
    // \ V / _` | '_| / _` | '_ \ / -_) (__/ _ \ ' \  _| '_/ _` / _|  _|
    //  \_/\__,_|_| |_\__,_|_.__/_\___|\___\___/_||_\__|_| \__,_\__|\__|

    if(constructor instanceof VariableContract) {
      print(constructor);
      print(args[constructor]);
      return args[constructor]; // TODO test
     }

/*
    // ___      ___         _               _   
    //|_ _|_ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    // | || ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___|_||_\___\___/_||_\__|_| \__,_\__|\__|

    if(contract instanceof InContract) {
      //if(!(arg instanceof Object)) callbackHandler(Handle(_.Logic.True, _.Logic.False, _.Logic.False));

      //var handler = new MethodHandler(contract, global, callbackHandler);
      //var proxy = new Proxy(arg, handler);
      //return proxy;
      return undefined;
    }

    //  ___       _    ___         _               _   
    // / _ \ _  _| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| (_) | || |  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
    // \___/ \_,_|\__|\___\___/_||_\__|_| \__,_\__|\__|

    if(contract instanceof OutContract) {
      //if(!(arg instanceof Object)) callbackHandler(Handle(_.Logic.True, _.Logic.False, _.Logic.False));

      //var handler = new MethodHandler(contract, global, callbackHandler);
      //var proxy = new Proxy(arg, handler);
      //return proxy;
      return undefined;
    }
*/


    //    _      __           _ _   
    // __| |___ / _|__ _ _  _| | |_ 
    /// _` / -_)  _/ _` | || | |  _|
    //\__,_\___|_| \__,_|\_,_|_|\__|

    else error("Wrong Constructor", (new Error()).fileName, (new Error()).lineNumber);


















  }

  /**
   * Core Functions
   */

  __define("construct", construct, _);
  __define("assert", assert, _);

  __define("canonical", canonical, _);
  __define("delayed", delayed, _);
  __define("immediate", immediate, _);

})(TreatJS);
