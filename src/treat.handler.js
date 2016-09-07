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

TreatJS.package("TreatJS.Handler", function (TreatJS, Contract, configuration) {


  // ___             _   _          _  _              _ _         
  //| __|  _ _ _  __| |_(_)___ _ _ | || |__ _ _ _  __| | |___ _ _ 
  //| _| || | ' \/ _|  _| / _ \ ' \| __ / _` | ' \/ _` | / -_) '_|
  //|_| \_,_|_||_\__|\__|_\___/_||_|_||_\__,_|_||_\__,_|_\___|_|  

  function FunctionHandler(contract, callback, monitor) {

    return {
      apply: function(subject, thisArg, argumentsArg) {

        // new callback
        var callback = new TreatJS.Callback.Function(callback);

        // assert domain contract
        var argumentsArg = monitor(argumentsArg, contract.domain, callback.domain);

        // evaluate subject
        var result = Reflect.apply(subject, thisArg, argumentsArg);

        // assert range contract
        return monitor(result, contract.range, callback.range);       
      }
    }












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

  //  ___             _               _           _  _              _ _         
  // / __|___ _ _  __| |_ _ _ _  _ __| |_ ___ _ _| || |__ _ _ _  __| | |___ _ _ 
  //| (__/ _ \ ' \(_-<  _| '_| || / _|  _/ _ \ '_| __ / _` | ' \/ _` | / -_) '_|
  // \___\___/_||_/__/\__|_|  \_,_\__|\__\___/_| |_||_\__,_|_||_\__,_|_\___|_|  

  // TODO
  function ConstructorHandler(contract, global, handler) {
    if(!(this instanceof ConstructorHandler)) return new ConstructorHandler(contract, global, handler);
    else Handler.call(this);

    this.construct = function(target, argumentsArray) {
      var base = Object.create(target.prototype);
      var value = target.apply(base, argumentsArray);

      var constructed = (value instanceof Object) ? value : base; 
      return assertWith(constructed, contract.contract, global, handler);
    };
  }
  ConstructorHandler.prototype = Object.create(Handler.prototype);

  // ___                        _         _   _  _              _ _         
  //|   \ ___ _ __  ___ _ _  __| |___ _ _| |_| || |__ _ _ _  __| | |___ _ _ 
  //| |) / -_) '_ \/ -_) ' \/ _` / -_) ' \  _| __ / _` | ' \/ _` | / -_) '_|
  //|___/\___| .__/\___|_||_\__,_\___|_||_\__|_||_\__,_|_||_\__,_|_\___|_|  
  //         |_|                                                            

  function DependentHandler(contract, global, handler) {
    if(!(this instanceof DependentHandler)) return new DependentHandler(contract, global, handler);
    else Handler.call(this);

    this.apply = function(target, thisArg, args) {
      var range = constructContract(contract.constructor, args, global);
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


// TODO
  function InvariantHandler(contract, global, handler) {
    if(!(this instanceof InvariantHandler)) return new InvariantHandler(contract, global, handler);
    else Handler.call(this);

    this.set = function(target, name, value, receiver) {
      var result = (target[name] = value);
      assertWith(target, contract, global, handler);
      return result;
    };
  }
  InvariantHandler.prototype = Object.create(Handler.prototype);





  //   _   _       _               _   _          _  _              _ _         
  //  /_\ | |__ __| |_ _ _ __ _ __| |_(_)___ _ _ | || |__ _ _ _  __| | |___ _ _ 
  // / _ \| '_ (_-<  _| '_/ _` / _|  _| / _ \ ' \| __ / _` | ' \/ _` | / -_) '_|
  ///_/ \_\_.__/__/\__|_| \__,_\__|\__|_\___/_||_|_||_\__,_|_||_\__,_|_\___|_|  

  function AbstractionHandler(arg, constructor, global, handler) {
    if(!(this instanceof AbstractionHandler)) return new AbstractionHandler(constructor, global, handler);
    else Handler.call(this);

    this.apply = function(target, thisArg, argsArray) {
      var contract = constructContract(constructor, argsArray, global);
      return assertWith(arg, contract, global, handler);
    };
    this.construct = function(target, args) {
      var obj = Object.create(target.prototype);
      this.apply(target, obj, args);
      return obj;
    };
  }
  AbstractionHandler.prototype = Object.create(Handler.prototype);

  // ___     _                         _    _          _  _              _ _         
  //| _ \___| |_  _ _ __  ___ _ _ _ __| |_ (_)____ __ | || |__ _ _ _  __| | |___ _ _ 
  //|  _/ _ \ | || | '  \/ _ \ '_| '_ \ ' \| (_-< '  \| __ / _` | ' \/ _` | / -_) '_|
  //|_| \___/_|\_, |_|_|_\___/_| | .__/_||_|_/__/_|_|_|_||_\__,_|_||_\__,_|_\___|_|  
  //           |__/              |_|                                                 

  // TODO, required?
  function ForallHandler(forall, global, handler) {
    if(!(this instanceof ForallHandler)) return new ForallHandler(contract, global, handler);
    else Handler.call(this);

    this.apply = function(target, thisArg, args) {
      var variables = new Proxy({length:TreatJS.Config.maxArgs}, new VariableHandler(handler));
      var contract = constructContract(forall.constructor, variables, global);
      var contracted = assertWith(target, contract, global, handler);

      return contracted.apply(thisArg, args);
    };
    this.construct = function(target, args) {
      var obj = Object.create(target.prototype);
      this.apply(target, this, args);
      return obj;
    };
  }
  ForallHandler.prototype = Object.create(Handler.prototype);

  function VariableHandler(handler) {
    if(!(this instanceof VariableHandler)) return new VariableHandler(handler);
    else Handler.call(this);

    this.has = function(target, name) {
      return true;
    }

    this.get = function(target, name, receiver) {
      return (name==="length") ? target.length : new Variable();
    };
  }
  VariableHandler.prototype = Object.create(Handler.prototype);

  function PolymorphicHandler(handler) {
    if(!(this instanceof PolymorphicHandler)) return new PolymorphicHandler(handler);
    else Handler.call(this);

    this.get = function(target, name, receiver) {
      handler(TreatJS.Callback.Handle(False, True));
    };
  }
  PolymorphicHandler.prototype = Object.create(Handler.prototype);






  function EffectHandler(id) {
    if(!(this instanceof EffectHandler)) return new EffectHandler(id);
    else Handler.call(this);

    var listener = [];

    this.get = function(target, name, receiver) {
      notify(TreatJS.Effect.Get(target, id, name));
      return target[name];
    }

    this.set = function(target, name, value, receiver) {
      notify(TreatJS.Effect.Set(target, id, name));
      return target[name]=value;
    }

    this.apply = function(target, thisArg, argumentsArg) {
      notify(TreatJS.Effect.Call(target, id));
      var result = target.apply(thisArg, argumentsArg);
      notify(TreatJS.Effect.Return(target, id));
      return result;
    };
    this.construct = function(target, thisArg, argumentsArg) {
      notify(TreatJS.Effect.Construct(target, id));
      var obj = Object.create(target.prototype);
      this.apply(target, this, args);
      return obj;
    };

    Object.defineProperties(this, {
      "register": {
        value: function(callback) {
          listener.push(callback);
        }
      }
    });

    function notify(effect) {
      for(var i=0; i<listener.length; i++) {
        listener[i](effect);
      }
    }
  }
  EffectHandler.prototype = Object.create(Handler.prototype);







  //         _                 
  // _ _ ___| |_ _  _ _ _ _ _  
  //| '_/ -_)  _| || | '_| ' \ 
  //|_| \___|\__|\_,_|_| |_||_|

  return {
  };

});

