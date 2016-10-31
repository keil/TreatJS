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

TreatJS.package("TreatJS.Core", function (TreatJS, Contract, configuration) {

  // ___                  
  //| _ \_ _ _____ ___  _ 
  //|  _/ '_/ _ \ \ / || |
  //|_| |_| \___/_\_\\_, |
  //                 |__/ 

  const realm = TransparentProxy.createRealm();

  const Proxy = realm.Proxy;

  const WeakMap = realm.WeakMap;
  const WeakSet = realm.WeakSet;

  const Map = realm.Map;
  const Set = realm.Set;

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

  const Assertions = new WeakMap();

  function wrap(subject, contract, callback, handler) {
    const proxy = new Proxy(subject, handler);

    Assertions.set(proxy, {
      subject:  subject,
      contract: contract, 
      callback: callback
    });

    return proxy;
  }

  function unwrap(proxy) {
    if(Assertions.has(proxy)) {
      return unwrap(Assertions.get(proxy).subject);
    } else {
      return proxy;  
    }
  }

  //       _                 
  // _ __ (_)_ _ _ _ ___ _ _ 
  //| '  \| | '_| '_/ _ \ '_|
  //|_|_|_|_|_| |_| \___/_|  

  function mirrorIndy(proxy) {
    if(Assertions.has(proxy)) {

      const assertion = Assertions.get(proxy);

      const subject = mirrorIndy(assertion.subject);
      const context = Contexts[Contexts.length-1];

      const cbFork = TreatJS.Callback.newFork(function(handle) {
        if(handle.subject==false) {
          throw new TreatJS.Error.PositiveBlame(subject, assertion.contract);
        } else if (handle.context==false) {
          throw new TreatJS.Error.NegativeBlame(context, assertion.contract);
        }
      }, assertion.callback);

      return assert(subject, assertion.contract, cbFork.contract)

    } else {
      return proxy;
    }
  }

  function mirrorLax(proxy) {
    return unwrap(proxy);
  }

  function mirrorPicky(proxy) {
    return proxy;
  }

  let mirror = (function() {
    switch(configuration.semantics) {
      case TreatJS.INDY:
        return mirrorIndy;
        break;

      case TreatJS.LAX:
        return mirrorPacl;
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

    if(configuration.verbose) {
      target = new Proxy(target, {
        apply: function(target, thisArg, argumentsArg) {
          Reflect.apply(log, thisArg, argumentsArg);
          return Reflect.apply(target, thisArg, argumentsArg);
        }
      });
    }

    if(configuration.statistic) {
      target = new Proxy(target, {
        apply: function(target, thisArg, argumentsArg) {
          Reflect.apply(statistic, thisArg, argumentsArg);
          return Reflect.apply(target, thisArg, argumentsArg);
        }
      });
    }

    return target;

  }



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

    const context = Contexts[Contexts.length-1];

    // TODO: use root callback, with check blame state
    return assert(subject, contract, function(handle) {
      if (handle.context==false) {
        throw new TreatJS.Error.NegativeBlame(context, contract);
      } else if(handle.subject==false) {
        throw new TreatJS.Error.PositiveBlame(subject, contract);
      }
    });

  }, function(subject, contract) {
    TreatJS.Log.log(TreatJS.Log.Keys.ASSERT, "top assert", contract);
  }, function(subject, contract) {
    TreatJS.Statistic.increment(TreatJS.Statistic.Keys.TOPASSERT);
  });

  let assert = define(function (subject, contract, callback) {

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
        result = contract.predicate.apply(undefined, [mirror(subject)]); // TODO bottleneck // 
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
      return (subject instanceof Object) ? wrap(subject, contract, callback, {
        get: function (target, name, receiver) {          
          const value = Reflect.get(target, name, receiver);       
          return contract.map.has(name) ? assert(value, contract.map.get(name), callback) : value;
        },
        set: function (target, name, value, receiver) {
          const node = TreatJS.Callback.newAssignment(callback);
          const contracted = contract.map.has(name) ? assert(value, contract.map.get(name), node.properties) : value;
          return Reflect.set(target, name, contracted, receiver);
        }
      }) : subject;
    }

    else if (contract instanceof TreatJS.Contract.StrictObject) {
      return (subject instanceof Object) ? wrap(subject, contract, callback, {
        get: function (target, name, receiver) {
          const value = Reflect.get(target, name, receiver); 
          if(contract.map.has(name)) {                  
            return assert(value, contract.map.get(name), callback);
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
            const node = TreatJS.Callback.newAssignment(callback);
            const contracted = assert(value, contract.map.get(name), node.properties);
            return Reflect.set(target, name, contracted, receiver); 
          } else {
            callback({
              context: false,
              subject: true       
            });
            return Reflect.set(target, name, value, receiver);
          } 
        }
      }) : subject;
    }

    // ___          _   _   _          ___         _               _   
    //| __|  _ _ _ | |_| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| _| || | ' \| / /  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_| \_,_|_||_|_\_\\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

    else if(contract instanceof TreatJS.Contract.Function) {
      return (subject instanceof Function) ? wrap(subject, contract, callback, {
        apply: function (target, thisArg, argumentsArg) {
          const node = TreatJS.Callback.newFunction(callback);
          const contracted = assert(argumentsArg, contract.domain, node.domain);
          const result = Reflect.apply(target, thisArg, contracted);
          return assert(result, contract.range, node.range);    
        }
      }) : subject;
    }

  // __  __     _   _            _  ___         _               _   
  //|  \/  |___| |_| |_  ___  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
  //| |\/| / -_)  _| ' \/ _ \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_|  |_\___|\__|_||_\___/\__,_|\___\___/_||_\__|_| \__,_\__|\__|

    else if(contract instanceof TreatJS.Contract.Method) {
      return (subject instanceof Function) ? wrap(subject, contract, callback, {
        apply: function (target, thisArg, argumentsArg) {
          const node = TreatJS.Callback.newFunction(callback);
          const thisArgContracted = assert(thisArg, contract.target, node.domain);
          const argumentsArgContracted = assert(argumentsArg, contract.domain, node.domain);
          const result = Reflect.apply(target, thisArgContracted, argumentsArgContracted);
          return assert(result, contract.range, node.range);    
        }
      }) : subject;
    }

    // ___                        _         _    ___         _               _   
    //|   \ ___ _ __  ___ _ _  __| |___ _ _| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| |) / -_) '_ \/ -_) ' \/ _` / -_) ' \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___/\___| .__/\___|_||_\__,_\___|_||_\__|\___\___/_||_\__|_| \__,_\__|\__|
    //         |_|                                                               

    else if(contract instanceof TreatJS.Contract.Dependent) {
      return (subject instanceof Function) ? wrap(subject, contract, callback, {
        apply: function (target, thisArg, argumentsArg) {
          const rangeContract = construct(contract.constructor, argumentsArg);
          const result = Reflect.apply(target, thisArg, argumentsArg);
          return assert(result, rangeContract, callback);
        }
      }) : subject;
    }

    // _   _      _          ___         _               _   
    //| | | |_ _ (_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| |_| | ' \| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    // \___/|_||_|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof TreatJS.Contract.Union) {
      const node = TreatJS.Callback.newUnion(callback);
      return assert(assert(subject, contract.left, node.left), contract.right, node.right);
    }

    // ___     _                      _   _          ___         _               _   
    //|_ _|_ _| |_ ___ _ _ ___ ___ __| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    // | || ' \  _/ -_) '_(_-</ -_) _|  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___|_||_\__\___|_| /__/\___\__|\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof TreatJS.Contract.Intersection) {
      const node = new TreatJS.Callback.newIntersection(callback);
      return topassert(topassert(subject, contract.left, node.left), contract.right, node.right);
    }

    else if (contract instanceof TreatJS.Contract.DelayedIntersection) {
      return (subject instanceof Object) ? new Proxy(subject, new Proxy({}, {
        get: function (handler, trapname) {
          return function(target, ...trapArgs) {
            const node = TreatJS.Callback.newIntersection(callback);
            const contracted = assert(assert(target, contract.left, node.left), contract.right, node.right);
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

      // TODO, semantics

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

  // _____ ___ __  ___ _ _| |_ 
  /// -_) \ / '_ \/ _ \ '_|  _|
  //\___/_\_\ .__/\___/_|  \__|
  //        |_|                

  TreatJS.export({
    assert:     configuration.assertion ? topassert : noassert,
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
