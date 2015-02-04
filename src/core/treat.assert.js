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

  var TreatJSError = TreatJS.Error.TreatJSError;
  var TreatJSViolation = TreatJS.Error.TreatJSViolation;
  var TreatJSBlame = TreatJS.Error.TreatJSBlame;

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
/*  var DelayedHandler = TreatJS.Handler.Delayed;

  var FunctionHandler = TreatJS.Handler.Function;
  var DependentHandler = TreatJS.Handler.Dependent;
  var MethodHandler = TreatJS.Handler.Method;
  var ObjectHandler = TreatJS.Handler.Object;

  var RefelctionHandler = TreatJS.Handler.Reflection;
  var NoOpHandler = TreatJS.Handler.NoOp;*/

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

  // construct // TODO
  //var construct = TreatJS.construct;
  //var constructWith = TreatJS.constructWith;


  /** log(msg)
   * @param msg String message
   */ 
  function log(msg, target) {
    if(TreatJS.Verbose.assert) {
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
    if(TreatJS.Verbose.statistic) TreatJS.Statistic.inc(key);
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
      }
    });
  }
  SandboxContract.prototype = Object.create(BaseContract.prototype);

  //  ___ _     _          _ 
  // / __| |___| |__  __ _| |
  //| (_ | / _ \ '_ \/ _` | |
  // \___|_\___/_.__/\__,_|_|

  function Global(bindings) {
    if(!(this instanceof Global)) return new Global(bindings);

    if(!(bindings instanceof Object)) error("Wrong Bingings", (new Error()).fileName, (new Error()).lineNumber);

    // copy bindings
    var raw = {};
    for(var name in bindings) {
      raw[name] = bindings[name];
    }

    Object.defineProperties(this, {
      "raw": {
        value: raw
      }
    });
  }
  Global.prototype = {};

  Global.prototype.dump = function() {
    //return this.raw;
    var dump = {};
    for(var name in this.raw) {
      dump[name] = this.raw[name];
    }
    return dump; 
  }

  Global.prototype.clone = function() {
    var newglobal = {};
    for(var name in this.raw) {
      newglobal[name] = this.raw[name];
    }
    return new Global(newglobal);
  }

  Global.prototype.merge = function(bindings) {
    var newglobal = this.dump();
    for(var name in bindings) {
      newglobal[name] = bindings[name];
    }
    return new Global(newglobal);
  }

  Global.prototype.toString = function() {
    var string = "";
    for(var name in this.raw) {
      string += " " + name + ":" + this.raw[name];
    }
    return "{" + string + "}";
  }

  //                         _   
  //                        | |  
  //  __ _ ___ ___  ___ _ __| |_ 
  // / _` / __/ __|/ _ \ '__| __|
  //| (_| \__ \__ \  __/ |  | |_ 
  // \__,_|___/___/\___|_|   \__|

  function assert(arg, contract) {
    log("assert", contract);
    count(TreatJS.Statistic.ASSERT);

    // disbale assertion
    if(!TreatJS.Config.assertion) return arg;

    if(!(contract instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    if(TreatJS.Config.canonicalize) {
      if(!canonical(contract)) return assert(arg, canonicalize(contract));
    } else {
      if(!canonical(contract)) error("Non-canonical contract", (new Error()).fileName, (new Error()).lineNumber);
    }

    var callback = RootCallback(function(handle) {
      if(handle.caller.isFalse() || handle.callee.isFalse()) {

        var msg = contract.toString(); /*handle.blame();*/
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

        blame(contract, msg, (new Error()).fileName, (new Error()).lineNumber);
      }
    }, contract);
    return assertWith(arg, contract, new Global({}), callback.rootHandler);
  }

  function assertWith(arg, contract, global, callbackHandler) {
    log("assert with", contract);
    count(TreatJS.Statistic.ASSERTWITH);

    if(!(contract instanceof Contract)) error("Wrong Contract.", (new Error()).fileName, (new Error()).lineNumber);
    if(!(callbackHandler instanceof Function)) error("Wrong Callback Handler.", (new Error()).fileName, (new Error()).lineNumber);

    // ___          _   _   _          ___         _               _   
    //| __|  _ _ _ | |_| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| _| || | ' \| / /  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_| \_,_|_||_|_\_\\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

    if(contract instanceof FunctionContract) {
      if(!(arg instanceof Function)) callbackHandler(Handle(TreatJS.Logic.True, TreatJS.Logic.False, TreatJS.Logic.False));

      var handler = new FunctionHandler(contract, global, callbackHandler);
      var proxy = new Proxy(arg, handler);
      return proxy;
    }

    // __  __     _   _            _  ___         _               _   
    //|  \/  |___| |_| |_  ___  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
    //| |\/| / -_)  _| ' \/ _ \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_|  |_\___|\__|_||_\___/\__,_|\___\___/_||_\__|_| \__,_\__|\__|

    if(contract instanceof MethodContract) {
      if(!(arg instanceof Function)) callbackHandler(Handle(TreatJS.Logic.True, TreatJS.Logic.False, TreatJS.Logic.False));

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
      if(!(arg instanceof Object)) callbackHandler(Handle(TreatJS.Logic.True, TreatJS.Logic.False, TreatJS.Logic.False));

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
      if(!(arg instanceof Function)) callbackHandler(Handle(TreatJS.Logic.True, TreatJS.Logic.False, TreatJS.Logic.False));

      var handler = new DependentHandler(contract, global, callbackHandler);
      var proxy = new Proxy(arg, handler);
      return proxy;
    }

    //__      ___ _   _    ___         _               _   
    //\ \    / (_) |_| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
    // \ \/\/ /| |  _| ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //  \_/\_/ |_|\__|_||_\___\___/_||_\__|_| \__,_\__|\__|                                                   

    else if (contract instanceof WithContract) {
      /*var newglobal = {}; // TODO, use global merge // newglobal = new Gloabl();

      for(var name in global) {
        newglobal[name] = global[name];
      }
      for(var name in contract.bindings) {
        newglobal[name] = contract.binding[name];
      }*/
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

    // _  _     _    ___         _               _   
    //| \| |___| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| .` / _ \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_|\_\___/\__|\___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof NotContract) {

      // TODO, definition of Not

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

    // _  _               _   _          ___         _               _   
    //| \| |___ __ _ __ _| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| .` / -_) _` / _` |  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_|\_\___\__, \__,_|\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|
    //         |___/       

    else if (contract instanceof NegationContract) {

      // TODO, definition of negation

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

    // ___      __ _        _   _          
    //| _ \___ / _| |___ __| |_(_)___ _ _  
    //|   / -_)  _| / -_) _|  _| / _ \ ' \ 
    //|_|_\___|_| |_\___\__|\__|_\___/_||_|

    if(contract instanceof ReflectionContract) {
      if(!(arg instanceof Object)) callbackHandler(Handle(TreatJS.Logic.True, TreatJS.Logic.False, TreatJS.Logic.False));

      var reflect = new ReflectionHandler(contract, global, callbackHandler);
      var noop = new NoOpHandler();
      var proxy = new Proxy(arg, new Proxy(noop, reflect));
      return proxy;
    }

    // ___               _ _              ___         _               _   
    /// __| __ _ _ _  __| | |__  _____ __/ __|___ _ _| |_ _ _ __ _ __| |_ 
    //\__ \/ _` | ' \/ _` | '_ \/ _ \ \ / (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___/\__,_|_||_\__,_|_.__/\___/_\_\\___\___/_||_\__|_| \__,_\__|\__|

    else if(contract instanceof SandboxContract) {
      count(TreatJS.Statistic.BASE);

      var globalArg = global.dump(); 
      var thisArg = undefined;
      var argsArray = [TreatJS.wrap(arg)];
 
      /* Merge global objects
      */ 

      var callback = BaseCallback(callbackHandler, contract);

      // TODO, why is this required ?
      // without new decompiling with would not work!
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
          var handle = Handle(TreatJS.Logic.True, result, result);
          callback.predicateHandler(handle);
          clear(contract.global);
          copy(backupGlobal, contract.global);
          return arg;
        }
      }
    }

    // ___                ___         _               _   
    //| _ ) __ _ ___ ___ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| _ \/ _` (_-</ -_) (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___/\__,_/__/\___|\___\___/_||_\__|_| \__,_\__|\__|

    else if(contract instanceof BaseContract) {
      count(TreatJS.Statistic.BASE);

      var globalArg = global.dump();
      var thisArg = undefined;
      var argsArg = [arg];

      var callback = BaseCallback(callbackHandler, contract);

      try {
        var result = translate(TreatJS.eval(contract.predicate, globalArg, thisArg, argsArg));
      } catch (e) { 
        if(e instanceof TreatJSError) {
          var result = e;
        } else {
          
          // TODO
          print("PREDICATE EXCEPTION \n" + e + "\n" + e.stack);
                    
          var result = TreatJS.Logic.Conflict;
        }
      } finally {
        if(result instanceof TreatJSError) {
          throw result;
        } else {
          var handle = new Handle(TreatJS.Logic.True, result);
          callback.predicateHandler(handle);
          return arg;
        }
      }
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
    //    else if(true) return TreatJS.Polymorphic.assert(arg, contract, global, callbackHandler)


    //  ___             _               _           
    // / __|___ _ _  __| |_ _ _ _  _ __| |_ ___ _ _ 
    //| (__/ _ \ ' \(_-<  _| '_| || / _|  _/ _ \ '_|
    // \___\___/_||_/__/\__|_|  \_,_\__|\__\___/_|  

    else if(contract instanceof Constructor) {
      // TODO: old code
      // return assertWith(arg, construct(contract), global, callbackHandler);
      // TODO, add sbc contract to the global object
      // merge global with contracts ? and sbc contract
      return assertWith(arg, construct(contract, global.dump()), global, callbackHandler);
    }

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

  TreatJS.extend("assert", assert);


  // TODO, test
  //

    // _    _                 _ _           
  //| |  | |               | | |          
  //| |__| | __ _ _ __   __| | | ___ _ __ 
  //|  __  |/ _` | '_ \ / _` | |/ _ \ '__|
  //| |  | | (_| | | | | (_| | |  __/ |   
  //|_|  |_|\__,_|_| |_|\__,_|_|\___|_|   

  function Handler() {
    if(!(this instanceof Handler)) return new Handler();
  }
  Handler.prototype = {};
  Handler.toString = function () { "[Halder]"; };

  // ___      _                  _ _  _              _ _         
  //|   \ ___| |__ _ _  _ ___ __| | || |__ _ _ _  __| | |___ _ _ 
  //| |) / -_) / _` | || / -_) _` | __ / _` | ' \/ _` | / -_) '_|
  //|___/\___|_\__,_|\_, \___\__,_|_||_\__,_|_||_\__,_|_\___|_|  
  //                 |__/                                        

  function DelayedHandler(assert) {
    if(!(this instanceof DelayedHandler)) return new DelayedHandler(assert);
    else Handler.call(this);

    this.apply = function(target, thisArg, args) {
      return assert().apply(thisArg, args);
    };
  }
  DelayedHandler.prototype = Object.create(Handler.prototype);

  // ___             _   _          _  _              _ _         
  //| __|  _ _ _  __| |_(_)___ _ _ | || |__ _ _ _  __| | |___ _ _ 
  //| _| || | ' \/ _|  _| / _ \ ' \| __ / _` | ' \/ _` | / -_) '_|
  //|_| \_,_|_||_\__|\__|_\___/_||_|_||_\__,_|_||_\__,_|_\___|_|  

  function FunctionHandler(contract, global, handler) {
    if(!(this instanceof FunctionHandler)) return new FunctionHandler(contract, global, handler);
    else Handler.call(this);

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
  FunctionHandler.prototype = Object.create(Handler.prototype);

  // __  __     _   _            _ _  _              _ _         
  //|  \/  |___| |_| |_  ___  __| | || |__ _ _ _  __| | |___ _ _ 
  //| |\/| / -_)  _| ' \/ _ \/ _` | __ / _` | ' \/ _` | / -_) '_|
  //|_|  |_\___|\__|_||_\___/\__,_|_||_\__,_|_||_\__,_|_\___|_|  

  function MethodHandler(contract, global, handler) {
    if(!(this instanceof MethodHandler)) return new MethodHandler(contract, global, handler);
    else Handler.call(this);

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
  MethodHandler.prototype = Object.create(Handler.prototype);

  // ___                        _         _   _  _              _ _         
  //|   \ ___ _ __  ___ _ _  __| |___ _ _| |_| || |__ _ _ _  __| | |___ _ _ 
  //| |) / -_) '_ \/ -_) ' \/ _` / -_) ' \  _| __ / _` | ' \/ _` | / -_) '_|
  //|___/\___| .__/\___|_||_\__,_\___|_||_\__|_||_\__,_|_||_\__,_|_\___|_|  
  //         |_|                                                            

  function DependentHandler(contract, global, handler) {
    if(!(this instanceof DependentHandler)) return new DependentHandler(contract, global, handler);
    else Handler.call(this);

    this.apply = function(target, thisArg, args) {
      var range = constructWith(contract.constructor, args, global);
      var val = target.apply(thisArg, args); 
      return assertWith(val, range, global, handler);
    };
    this.construct = function(target, args) {
      var obj = Object.create(target.prototype);
      this.apply(target, this, args);
      return obj;
    };
  }
  DependentHandler.prototype = Object.create(Handler.prototype);

  //  ___  _     _        _   _  _              _ _         
  // / _ \| |__ (_)___ __| |_| || |__ _ _ _  __| | |___ _ _ 
  //| (_) | '_ \| / -_) _|  _| __ / _` | ' \/ _` | / -_) '_|
  // \___/|_.__// \___\__|\__|_||_\__,_|_||_\__,_|_\___|_|  
  //          |__/                                          

  function ObjectHandler(contract, global, handler) {
    if(!(this instanceof ObjectHandler)) return new ObjectHandler(contract, global, handler);
    else Handler.call(this);

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
  ObjectHandler.prototype = Object.create(Handler.prototype);

  // ___      __ _        _   _          _  _              _ _         
  //| _ \___ / _| |___ __| |_(_)___ _ _ | || |__ _ _ _  __| | |___ _ _ 
  //|   / -_)  _| / -_) _|  _| / _ \ ' \| __ / _` | ' \/ _` | / -_) '_|
  //|_|_\___|_| |_\___\__|\__|_\___/_||_|_||_\__,_|_||_\__,_|_\___|_|  

  function ReflectionHandler(contract, global, handler) {
    if(!(this instanceof ReflectionHandler)) return new ReflectionHandler(contract, global, handler);
    else Handler.call(this);

    this.get = function(target, name, receiver) {

      if(name === contract.trap) {
        return assertWith(target[name], contract.sub, global, handler);
      } else {
        return target[name];
      }
    };
  }
  ReflectionHandler.prototype = Object.create(Handler.prototype);

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
  NoOpHandler.prototype = Object.create(Handler.prototype);

  // ___     _                         _    _    _  _              _ _         
  //| _ \___| |_  _ _ __  ___ _ _ _ __| |_ (_)__| || |__ _ _ _  __| | |___ _ _ 
  //|  _/ _ \ | || | '  \/ _ \ '_| '_ \ ' \| / _| __ / _` | ' \/ _` | / -_) '_|
  //|_| \___/_|\_, |_|_|_\___/_| | .__/_||_|_\__|_||_\__,_|_||_\__,_|_\___|_|  
  //           |__/              |_|                                           

  // TODO - testing code
  /*function PolymorphicHandler(handler) {
    if(!(this instanceof PolymorphicHandler)) return new PolymorphicHandler(contract, global, handler);
    else Handler.call(this);

    this.get = function(target, name, receiver) {
    handler( TreatJS.Callback.Handle(_.Logic.True, TreatJS.Logic.False, TreatJS.Logic.False));
    };
    }
    PolymorphicHandler.prototype = Object.create(Handler.prototype);*/


// TODO

  //                     _                   _   
  //                    | |                 | |  
  //  ___ ___  _ __  ___| |_ _ __ _   _  ___| |_ 
  // / __/ _ \| '_ \/ __| __| '__| | | |/ __| __|
  //| (_| (_) | | | \__ \ |_| |  | |_| | (__| |_ 
  // \___\___/|_| |_|___/\__|_|   \__,_|\___|\__|

  function construct(constructor, args) {
    log("construct", constructor);

    if(!(constructor instanceof Constructor)) error("Wrong Constructor", (new Error()).fileName, (new Error()).lineNumber);

    // TODO, extend global over Constructors
    // and merge wih arguments
    return constructWith(constructor, ((args==undefined) ? [] : args), new Global({}));
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
      
      //var newglobal = (constructor.binding!==undefined) ? global.merge(constructor.binding) : global;   
      //var globalArg = newglobal.dump(); 
      var globalArg = global.dump();
      var thisArg = undefined;
      var argsArray = args;

      var build = TreatJS.build();
      var contract = {};
      for(var property in build) {
        contract[property] = build[property];
      }
      
      var newBaseContract = function (predicate, name) {
        print("=====================================================================");
        return SandboxContract(predicate, globalArg, name);
      };

      contract.Base = newBaseContract;
      globalArg["Contract"] = contract;



      // TODO
      //Contract.BaseContract = newBaseContract;

      //globalArg["Contract"] = TreatJS.build();
      //globalArg["Contract"].Base = newBaseContract;

      //var treatjs = {};
      //var contract = {}
      
      // TODO, only one avaliable in Sandbox

      /*for(property in TreatJS) {
        if(property==="BaseContract") {
          treatjs[property] = newBaseContract;
          //__define(property, newBaseContract, treatjs);
        }
        else {
          treatjs[property] = TreatJS[property];
          //__define(property, _[property], treatjs);
        }
      }*/

      //var build = TreatJS.build();

      /*for(property in build) {
        if(property==="Base") {
          contract[property] = newBaseContract;
          //__define(property, newBaseContract, contract);
        }
        else {
          contract[property] = build[property];
          //__define(property, build[property], contract);
        }
      }*/

      //globalArg["_"] = treatjs;
      //globalArg["Contract"] = contract;
      //globalArg["C"] = globalArg["Contract"];
      //Not really sandboxed

      var contract = (TreatJS.eval(constructor.constructor, globalArg, thisArg, argsArray));

      if(!(contract instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
      return contract;
    }



    // ___                         _       _     ___         _               _   
    //| _ \__ _ _ _ __ _ _ __  ___| |_ _ _(_)__ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //|  _/ _` | '_/ _` | '  \/ -_)  _| '_| / _| (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_| \__,_|_| \__,_|_|_|_\___|\__|_| |_\__|\___\___/_||_\__|_| \__,_\__|\__|

    if(contract instanceof ParametricContract) {
      //if(!(arg instanceof Object)) callbackHandler(Handle(_.Logic.True, TreatJS.Logic.False, TreatJS.Logic.False));
      // TODO, this must be a contract

      //var handler = new MethodHandler(contract, global, callbackHandler);
      //var proxy = new Proxy(arg, handler);
      //return proxy;
      return undefined;
    } 

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
    //if(!(arg instanceof Object)) callbackHandler(Handle(_.Logic.True, TreatJS.Logic.False, TreatJS.Logic.False));

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
    //if(!(arg instanceof Object)) callbackHandler(Handle(_.Logic.True, TreatJS.Logic.False, TreatJS.Logic.False));

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

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("construct", construct);
  TreatJS.extend("constructWith", constructWith);





  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Handler", {});

  TreatJS.define(TreatJS.Handler, "Delayed", DelayedHandler);

  TreatJS.define(TreatJS.Handler, "Function", FunctionHandler);
  TreatJS.define(TreatJS.Handler, "Method", MethodHandler);
  TreatJS.define(TreatJS.Handler, "Dependent", DependentHandler);
  TreatJS.define(TreatJS.Handler, "Object", ObjectHandler);

  TreatJS.define(TreatJS.Handler, "Reflection", ReflectionHandler);
  TreatJS.define(TreatJS.Handler, "NoOp", NoOpHandler);
  //TreatJS.define(TreatJS.Handler, "Polymorphic", PolymorphicHandler);



})(TreatJS);
