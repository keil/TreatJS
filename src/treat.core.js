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

TreatJS.package("TreatJS.Core", function (TreatJS, Contract, Configuration, Realm) {

  //  ___         _           _   
  // / __|___ _ _| |_ _____ _| |_ 
  //| (__/ _ \ ' \  _/ -_) \ /  _|
  // \___\___/_||_\__\___/_\_\\__|

  const Contexts = new Array();

  Contexts.push({
    id: "Global Context",
  });

  //__ __ ___ _ __ _ _ __ 
  //\ V  V / '_/ _` | '_ \
  // \_/\_/|_| \__,_| .__/
  //                |_|   

  const Assertions = new Realm.WeakMap();

  function wrap(subject, contract, callback, path, handler) {
    const proxy = new Realm.Proxy(subject, handler);

    Assertions.set(proxy, {
      subject  : subject,
      contract : contract, 
      callback : callback,
      path     : path
    });

    return proxy;
  }

  // _  _ _ ___ __ ___ _ __ _ _ __ 
  //| || | ' \ V  V / '_/ _` | '_ \
  // \_,_|_||_\_/\_/|_| \__,_| .__/
  //                         |_|   

  function unwrap(proxy) {
    if(Assertions.has(proxy)) {
      return unwrap(Assertions.get(proxy).subject);
    } else {
      return proxy;  
    }
  }

  // ___ _  _ _____   __
  //|_ _| \| |   \ \ / /
  // | || .` | |) \ V / 
  //|___|_|\_|___/ |_|  

  function mirrorIndy(subject, path) {
    if(Assertions.has(subject)) {
      const assertion = Assertions.get(subject);   

      // Drop incompatible contract on subject value    
      if(TreatJS.Path.isCompatible(assertion.path, path)) {
        const context = Contexts[Contexts.length-1];
        const cbFork = TreatJS.Callback.Fork(function(handle) {
          if(handle.subject==false) {
            throw new TreatJS.Error.PositiveBlame(subject, assertion.contract);
          } else if (handle.context==false) {
            throw new TreatJS.Error.NegativeBlame(context, assertion.contract);
          }
        }, assertion.callback);

        // If not dropped, reorganize contract monitor 
        return assert(mirrorIndy(assertion.subject, path), assertion.contract, cbFork.contract, assertion.path)
      } else {
        return mirrorIndy(assertion.subject, path);
      }

    } else {
      return subject;
    }
  }

  // ___ ___ ___ _  ____   __
  //| _ \_ _/ __| |/ /\ \ / /
  //|  _/| | (__| ' <  \ V / 
  //|_| |___\___|_|\_\  |_|  

  function mirrorPicky(subject, path) {
    if(Assertions.has(subject)) {
      const assertion = Assertions.get(subject);

      // Drop incompatible contract on subject value    
      if(TreatJS.Path.isCompatible(assertion.path, path)) {
        return assert(mirrorPicky(assertion.subject, path), assertion.contract, assertion.callback, assertion.path);
      } else {
        return mirrorPicky(assertion.subject, path);
      }

    } else {
      return subject;
    }
  }

  // _      _   __  __
  //| |    /_\  \ \/ /
  //| |__ / _ \  >  < 
  //|____/_/ \_\/_/\_\

  function mirrorLax(subject, path) {
    return unwrap(subject);
  }

  //       _                 
  // _ __ (_)_ _ _ _ ___ _ _ 
  //| '  \| | '_| '_/ _ \ '_|
  //|_|_|_|_|_| |_| \___/_|  

  let mirror = (function() {
    switch(Configuration.semantics) {
      case TreatJS.INDY:
        return mirrorIndy;
        break;

      case TreatJS.LAX:
        return mirrorLax;
        break;

      case TreatJS.PICKY:
        return mirrorPicky;
        break;

    }})();

  //    _      __ _          
  // __| |___ / _(_)_ _  ___ 
  /// _` / -_)  _| | ' \/ -_)
  //\__,_\___|_| |_|_||_\___|

  function define(target, log, statistic) {

    if(Configuration.verbose) {
      target = new Realm.Proxy(target, {
        apply: function(target, thisArg, argumentsArg) {
          Reflect.apply(log, thisArg, argumentsArg);
          return Reflect.apply(target, thisArg, argumentsArg);
        }
      });
    }

    if(Configuration.statistic) {
      target = new Realm.Proxy(target, {
        apply: function(target, thisArg, argumentsArg) {
          Reflect.apply(statistic, thisArg, argumentsArg);
          return Reflect.apply(target, thisArg, argumentsArg);
        }
      });
    }

    return target;

  }

  //                               _   
  // _ _  ___  __ _ ______ ___ _ _| |_ 
  //| ' \/ _ \/ _` (_-<_-</ -_) '_|  _|
  //|_||_\___/\__,_/__/__/\___|_|  \__|

  let noassert = define(function(subject, contract) {
    return subject;   
  }, function(subject, contract) {
    TreatJS.Log.log(TreatJS.Log.Keys.ASSERT, "top assert", contract);
  }, function(subject, contract) {
    TreatJS.Statistic.increment(TreatJS.Statistic.Keys.TOPASSERT);
  });

  //                     _   
  // __ _ ______ ___ _ _| |_ 
  /// _` (_-<_-</ -_) '_|  _|
  //\__,_/__/__/\___|_|  \__|

  let topassert = define(function(subject, contract) {

    if(!(contract instanceof TreatJS.Prototype.Contract))
      throw new TypeError("Invalid contract");

    // The current context is the last context in the list
    const context = Contexts[Contexts.length-1];
    const {checkBlameState} = TreatJS.Callback.Root(context, subject, contract);
    const path = new TreatJS.Path.Root(checkBlameState);

    return assert(subject, contract, checkBlameState, path);

  }, function(subject, contract) {
    TreatJS.Log.log(TreatJS.Log.Keys.ASSERT, "top assert", contract);
  }, function(subject, contract) {
    TreatJS.Statistic.increment(TreatJS.Statistic.Keys.TOPASSERT);
  });

  let assert = define(function (subject, contract, callback, path) {

    // ___                ___         _               _   
    //| _ ) __ _ ___ ___ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| _ \/ _` (_-</ -_) (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___/\__,_/__/\___|\___\___/_||_\__|_| \__,_\__|\__|

    if(contract instanceof TreatJS.Contract.Base) {

      // Push contract to context stack.
      Contexts.push({
        id:       contract.toString(),
        contract: contract
      });

      // Evaluate predicate on subject.
      let result = true;
      try {
        result = contract.predicate.apply(undefined, [mirror(subject, path)]);
      } catch (error) {
        if(error instanceof TreatJS.Error.TreatJSError) {
          throw error;
        } else {
          result = false; 
        }
      } finally {
        Contexts.pop(); 
      }

      /**
       * Update Callback Graph.
       * No `true` update.
       **/

      // Update callback graph.
      if(!result) callback({
        context: true,
        subject: result ? true : false       
      });

      // Return subject.
      return subject;
    }

    //  ___  _     _        _    ___         _               _   
    // / _ \| |__ (_)___ __| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| (_) | '_ \| / -_) _|  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
    // \___/|_.__// \___\__|\__|\___\___/_||_\__|_| \__,_\__|\__|
    //          |__/                                             

    else if (contract instanceof TreatJS.Contract.Object) {
      return (subject instanceof Object) ? wrap(subject, contract, callback, path, {
        get: function (target, name, receiver) {          
          const value = Reflect.get(target, name, receiver);       
          return contract.map.has(name) ? assert(value, contract.map.get(name), callback, path) : value;
        },
        set: function (target, name, value, receiver) {
          const {properties} = TreatJS.Callback.Assignment(callback);
          const contracted = contract.map.has(name) ? assert(value, contract.map.get(name), properties, path.Step(properties)) : value;
          return Reflect.set(target, name, contracted, receiver);
        }
      }) : assert(toObject(subject), contract, callback, path);
    }

    else if (contract instanceof TreatJS.Contract.StrictObject) {
      return (subject instanceof Object) ? wrap(subject, contract, callback, path, {
        get: function (target, name, receiver) {
          const value = Reflect.get(target, name, receiver); 
          if(contract.map.has(name)) {                  
            return assert(value, contract.map.get(name), callback, path);
          } else {
            callback({
              context: false,
              subject: true       
            });
            return value;
          }          
        },
        set: function (target, name, value, receiver) {
          if(contract.map.has(name)) {                  
            const {properties} = TreatJS.Callback.Assignment(callback);
            const contracted = assert(value, contract.map.get(name), properties, path.Step(properties));
            return Reflect.set(target, name, contracted, receiver); 
          } else {
            callback({
              context: false,
              subject: true       
            });
            return Reflect.set(target, name, value, receiver);
          } 
        }
      }) : assert(toObject(subject), contract, callback, path);
    }

    // ___          _   _   _          ___         _               _   
    //| __|  _ _ _ | |_| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| _| || | ' \| / /  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_| \_,_|_||_|_\_\\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

    else if(contract instanceof TreatJS.Contract.Function) {
      return (subject instanceof Function) ? wrap(subject, contract, callback, path, {
        apply: function (target, thisArg, argumentsArg) {
          const {domain, range} = TreatJS.Callback.Function(callback);
          const contracted = assert(argumentsArg, contract.domain, domain, path.Step(domain));
          const result = Reflect.apply(target, thisArg, contracted);
          return assert(result, contract.range, range, path.Step(range));
        }
      }) : assert(toFunction(subject), contract, callback, path);
    }

    // __  __     _   _            _  ___         _               _   
    //|  \/  |___| |_| |_  ___  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
    //| |\/| / -_)  _| ' \/ _ \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_|  |_\___|\__|_||_\___/\__,_|\___\___/_||_\__|_| \__,_\__|\__|

    else if(contract instanceof TreatJS.Convenience.Method) {
      return (subject instanceof Function) ? wrap(subject, contract, callback, path, {
        apply: function (target, thisArg, argumentsArg) {
          const {domain, range} = TreatJS.Callback.Function(callback);
          const thisArgContracted = assert(thisArg, contract.target, domain, path.Step(domain));
          const argumentsArgContracted = assert(argumentsArg, contract.domain, domain, path.Step(domain));
          const result = Reflect.apply(target, thisArgContracted, argumentsArgContracted);
          return assert(result, contract.range, range, path.Step(range));
        }
      }) : assert(toFunction(subject), contract, callback, path);
    }

    // ___                        _         _    ___         _               _   
    //|   \ ___ _ __  ___ _ _  __| |___ _ _| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| |) / -_) '_ \/ -_) ' \/ _` / -_) ' \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___/\___| .__/\___|_||_\__,_\___|_||_\__|\___\___/_||_\__|_| \__,_\__|\__|
    //         |_|                                                               

    else if(contract instanceof TreatJS.Contract.Dependent) {
      return (subject instanceof Function) ? wrap(subject, contract, callback, path, {
        apply: function (target, thisArg, argumentsArg) {
          const rangeContract = construct(contract.constructor, argumentsArg);
          const result = Reflect.apply(target, thisArg, argumentsArg);
          return assert(result, rangeContract, callback, path);
        }
      }) : assert(toFunction(subject), contract, callback, path);
    }

    // _   _      _          ___         _               _   
    //| | | |_ _ (_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| |_| | ' \| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    // \___/|_||_|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof TreatJS.Contract.Union) {
      const {left, right} = TreatJS.Callback.Union(callback);
      return assert(assert(subject, contract.left, left, path.Split(left)), contract.right, right, path.Split(right));
    }

    // ___     _                      _   _          ___         _               _   
    //|_ _|_ _| |_ ___ _ _ ___ ___ __| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    // | || ' \  _/ -_) '_(_-</ -_) _|  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___|_||_\__\___|_| /__/\___\__|\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof TreatJS.Contract.Intersection) {
      const {left, right} = new TreatJS.Callback.Intersection(callback);
      return assert(assert(subject, contract.left, left, path.Step(left)), contract.right, right, path.Split(right));
    }

    else if (contract instanceof TreatJS.Convenience.ImmediateIntersection) {
      const {left, right} = new TreatJS.Callback.Intersection(callback);
      return assert(assert(subject, contract.left, left, path.Step(left)), contract.right, right, path.Split(right));
    }

    else if (contract instanceof TreatJS.Contract.DelayedIntersection) {
      return (subject instanceof Object) ? new Realm.Proxy(subject, new Realm.Proxy({}, {
        get: function (handler, trapname) {
          return function(target, ...trapArgs) {
            const {left, right} = TreatJS.Callback.Intersection(callback);
            const contracted = assert(assert(target, contract.left, left, path.Split(left)), contract.right, right, path.Split(right));
            return Reflect[trapname](contracted, ...trapArgs);
          }
        }
      })) : subject;
    }

    //     _   _                   _         
    // ___| |_| |_  ___ _ ___ __ _(_)___ ___ 
    /// _ \  _| ' \/ -_) '_\ V  V / (_-</ -_)
    //\___/\__|_||_\___|_|  \_/\_/|_/__/\___|

    else throw new TypeError("Invalid contract");

  }, function(subject, contract, callback) {
    TreatJS.Log.log(TreatJS.Log.Keys.ASSERT, "assert", contract);
  }, function(subject, contract, callback) {
    TreatJS.Statistic.increment(TreatJS.Statistic.Keys.ASSERT);
  });

  //                _               _   
  // __ ___ _ _  __| |_ _ _ _  _ __| |_ 
  /// _/ _ \ ' \(_-<  _| '_| || / _|  _|
  //\__\___/_||_/__/\__|_|  \_,_\__|\__|

  let topconstruct = define(function (constructor, argumentsList=[]) {

    if(!(constructor instanceof TreatJS.Prototype.Constructor))
      throw new TypeError("Invalid constructor.");

    return construct(constructor, argumentsList); 

  }, function(constructor, argumentsList) {
    TreatJS.Log.log(TreatJS.Log.Keys.CONSTRUCT, "top construct", constructor);
  }, function(constructor, argumentsList) {
    TreatJS.Statistic.increment(TreatJS.Statistic.Keys.TOPCONSTRUCT);
  });

  let construct = define(function (constructor, constructorArray) {

    //  ___         _               _    ___             _               _           
    // / __|___ _ _| |_ _ _ __ _ __| |_ / __|___ _ _  __| |_ _ _ _  _ __| |_ ___ _ _ 
    //| (__/ _ \ ' \  _| '_/ _` / _|  _| (__/ _ \ ' \(_-<  _| '_| || / _|  _/ _ \ '_|
    // \___\___/_||_\__|_| \__,_\__|\__|\___\___/_||_/__/\__|_|  \_,_\__|\__\___/_|  

    if(constructor instanceof TreatJS.Contract.Constructor) {

      // Push constructor to context stack.
      Contexts.push({
        id:       constructor.toString(),
        contract: constructor
      });

      // Mirrors the constructor arguments.
      for(let key in constructorArray) {
        constructorArray[key] = mirror(constructorArray[key]);
      }

      // Call constructor to create new contract.
      let contract = null;
      try {
        contract = constructor.constructor.apply(undefined, constructorArray);
      } catch (error) {
        if(error instanceof TreatJS.Error.TreatJSError) {
          throw error;
        } else {
          result = null; 
        }
      } finally {
        Contexts.pop(); 
      }

      // Return constructed contract or throw an error.
      if(contract instanceof TreatJS.Prototype.Contract)
        return contract;
      else 
        throw new TypeError("Invalid contract.");
    }

    //     _   _                   _         
    // ___| |_| |_  ___ _ ___ __ _(_)___ ___ 
    /// _ \  _| ' \/ -_) '_\ V  V / (_-</ -_)
    //\___/\__|_||_\___|_|  \_/\_/|_/__/\___|

    else throw new TypeError("Invalid constructor.");

  }, function(constructor, argumentsList) {
    TreatJS.Log.log(TreatJS.Log.Keys.CONSTRUCT, "construct", constructor);
  }, function(constructor, argumentsList) {
    TreatJS.Statistic.increment(TreatJS.Statistic.Keys.CONSTRUCT);
  });

  // _       ___                       
  //| |_ ___|   \ _  _ _ __  _ __ _  _ 
  //|  _/ _ \ |) | || | '  \| '  \ || |
  // \__\___/___/ \_,_|_|_|_|_|_|_\_, |
  //                              |__/ 

  function toFunction (subject) {
    const dummy = (function(){
      throw new TypeError("subject is not a function");
    });
    dummy[Symbol.toPrimitive] = function(hint) {
      return subject;  
    }
    return dummy;
  }

  function toObject (subject) {
    const dummy = {};
    dummy[Symbol.toPrimitive] = function(hint) {
      return subject;  
    }
    return dummy;
  }

  // _____ ___ __  ___ _ _| |_ 
  /// -_) \ / '_ \/ _ \ '_|  _|
  //\___/_\_\ .__/\___/_|  \__|
  //        |_|                

  TreatJS.export({
    assert:     Configuration.assertion ? topassert : noassert,
    construct:  topconstruct
  });

  //         _                 
  // _ _ ___| |_ _  _ _ _ _ _  
  //| '_/ -_)  _| || | '_| ' \ 
  //|_| \___|\__|\_,_|_| |_||_|

  return {
    topassert:    topassert,
    assert:       assert,
    topconstruct: topconstruct,
    construct:    construct
  };

});
