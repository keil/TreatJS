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
    handler( _.Callback.Handle(_.Logic.True, _.Logic.False, _.Logic.False));
    };
    }
    PolymorphicHandler.prototype = Object.create(Handler.prototype);*/




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
