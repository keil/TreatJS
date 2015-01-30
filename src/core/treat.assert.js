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

  // out
  var error = TreatJS.error;
  var violation = TreatJS.violation;
  var blame = TreatJS.blame;

  // prototypes
  var Contract = TreatJS.Core.Contract;
  var Constructor = TreatJS.Core.Constructor;

  // core contracts
  var DelayedContract = TreatJS.Contract.Delayed;
  var ImmediateContract = TreatJS.Contract.Immediate;
  var CombinatorContract = TreatJS.Contract.Combinator;
  var WrapperContract = TreatJS.Contract.Wrapper;

  var BaseContract = TreatJS.Contract.Base;

  var FunctionContract = TreatJS.Contract.Function;
  var MethodContract = TreatJS.Contract.Method;
  var DependentContract = TreatJS.Contract.Dependent;
  var ObjectContract = TreatJS.Contract.Object;

  var WithContract = TreatJS.Contract.With;

  var AndContract = TreatJS.Contract.And;
  var OrContract = TreatJS.Contract.Or;
  var NotContract = TreatJS.Contract.Not;

  var UnionContract = TreatJS.Contract.Union;
  var IntersectionContract = TreatJS.Contract.Intersection;
  var NegationContract = TreatJS.Contract.Negation;

  var ReflectionContract = TreatJS.Contract.Reflection;

  // TODO, experimental
  //var VariableContract = TreatJS.Polymorphic.Variable;
  //var ContractContract = TreatJS.Polymorphic.Abstraction;

  // core constuctors
  var ContractConstructor = TreatJS.Constructor.Constructor;

  // handler
  var DelayedHandler = TreatJS.Handler.Delayed;

  var FunctionHandler = TreatJS.Handler.Function;
  var DependentHandler = TreatJS.Handler.Dependent;
  var MethodHandler = TreatJS.Handler.Method;
  var ObjectHandler = TreatJS.Handler.Object;

  var RefelctionHandler = TreatJS.Handler.Reflection;
  var NoOpHandler = TreatJS.Handler.NoOp;

  // maps
  var Map = TreatJS.Map.Map;
  var StringMap = TreatJS.Map.StringMap;

  // core callbacks
  var Callback = TreatJS.Callback.Callback;
  var Handle =  TreatJS.Callback.Handle;

  var RootCallback = TreatJS.Callback.Root;
  var BaseCallback = TreatJS.Callback.Base;
  var FunctionCallback = TreatJS.Callback.Function;
  var ObjectCallback = TreatJS.Callback.Object;
  var PropertyCallback = TreatJS.Callback.Property;

  var AndCallback = TreatJS.Callback.And;
  var OrCallback = TreatJS.Callback.Or;
  var NotCallback = TreatJS.Callback.Not;

  var IntersectionCallback = TreatJS.Callback.Intersection;
  var UnionCallback = TreatJS.Callback.Union;
  var NegationCallback = TreatJS.Callback.Negation;

  // logic
  var translate = TreatJS.Logic.translate;

  // predicates
  var canonical = TreatJS.canonical;
  var delayed = TreatJS.delayed;
  var immediate = TreatJS.immediate;

  // canonicalize
  var canonicalize = TreatJS.canonicalize;

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
    if(_.Config.Verbose.statistic) TreatJS.Statistic.inc(key);
  }

  // ___               _ _              ___         _               _   
  /// __| __ _ _ _  __| | |__  _____ __/ __|___ _ _| |_ _ _ __ _ __| |_ 
  //\__ \/ _` | ' \/ _` | '_ \/ _ \ \ / (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___/\__,_|_||_\__,_|_.__/\___/_\_\\___\___/_||_\__|_| \__,_\__|\__|

  function SandboxContract(predicate, global, name) {
    if(!(this instanceof SandboxContract)) return new SandboxContract(predicate, global, name);
    else BaseContract.call(this, predicate, name);
 
    if(!(global instanceof Object)) error("Wrong Argument", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "global": {
        value: global
      },
    });
  }
  SandboxContract.prototype = Object.create(BaseContract.prototype);

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
      if(!canonical(contract)) return assert(arg, TreatJS.canonicalize(contract));
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
        if(!(arg instanceof Function)) callbackHandler(Handle(_.Logic.True, TreatJS.Logic.False, TreatJS.Logic.False));

        var handler = new FunctionHandler(contract, global, callbackHandler);
        var proxy = new Proxy(arg, handler);
        return proxy;
      }

      // __  __     _   _            _  ___         _               _   
      //|  \/  |___| |_| |_  ___  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
      //| |\/| / -_)  _| ' \/ _ \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
      //|_|  |_\___|\__|_||_\___/\__,_|\___\___/_||_\__|_| \__,_\__|\__|

      if(contract instanceof MethodContract) {
        if(!(arg instanceof Function)) callbackHandler(Handle(_.Logic.True, TreatJS.Logic.False, TreatJS.Logic.False));

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
        if(!(arg instanceof Object)) callbackHandler(Handle(_.Logic.True, TreatJS.Logic.False, TreatJS.Logic.False));

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

      else if(contract instanceof DependentContract) {
        if(!(arg instanceof Function)) callbackHandler(Handle(_.Logic.True, TreatJS.Logic.False, TreatJS.Logic.False));

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

      // TODO, reset order !


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
            var result = TreatJS.Logic.Conflict;
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
            var result = TreatJS.Logic.Conflict;
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

        // TODO, add sbc contract to the global object
        return assertWith(arg, construct(contract, global.dump()), global, callbackHandler);
      }

      // TODO, abstraction

      //   _   _       _               _   _          
      //  /_\ | |__ __| |_ _ _ __ _ __| |_(_)___ _ _  
      // / _ \| '_ (_-<  _| '_/ _` / _|  _| / _ \ ' \ 
      ///_/ \_\_.__/__/\__|_| \__,_\__|\__|_\___/_||_|

      // else if(contract instanceof ContractAbstraction) {
      //      // TODO: old code
      //      // return assertWith(arg, construct(contract), global, callbackHandler);
      //      return assertWith(arg, construct(contract, global.dump()), global, callbackHandler);
      //    }




      // ___      __ _        _   _          
      //| _ \___ / _| |___ __| |_(_)___ _ _  
      //|   / -_)  _| / -_) _|  _| / _ \ ' \ 
      //|_|_\___|_| |_\___\__|\__|_\___/_||_|

      if(contract instanceof ReflectionContract) {
        if(!(arg instanceof Object)) callbackHandler(Handle(_.Logic.True, TreatJS.Logic.False, TreatJS.Logic.False));

        var reflect = new ReflectionHandler(contract, global, callbackHandler);
        var noop = new NoOpHandler();
        var proxy = new Proxy(arg, new Proxy(noop, reflect));
        return proxy;
      }


      else if(true) return TreatJS.Polymorphic.assert(arg, contract, global, callbackHandler)


        //    _      __           _ _   
        // __| |___ / _|__ _ _  _| | |_ 
        /// _` / -_)  _/ _` | || | |  _|
        //\__,_\___|_| \__,_|\_,_|_|\__|

      else error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
    }






    //         _               _ 
    // _____ _| |_ ___ _ _  __| |
    /// -_) \ /  _/ -_) ' \/ _` |
    //\___/_\_\\__\___|_||_\__,_|

    TreatJS.extend("assert", construct);


    /**
     * Core Functions
     */

    __define("construct", construct, _);
    __define("assert", assert, _);

    __define("canonical", canonical, _);
    __define("delayed", delayed, _);
    __define("immediate", immediate, _);

  })(TreatJS);
