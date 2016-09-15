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

  // TODO:  Use TransparentProxy realm or polyfill librarie
  const Proxy = TransparentProxy;

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

  // TODO: Use realm-aware WeakMap.
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

  function mirror(proxy) {
    if(Assertions.has(proxy)) {
      
      const topassertion = Assertions.get(proxy);

      const subject = mirror(topassertion.subject);
      const context = Contexts[Contexts.length-1];

      const cbFork = TreatJS.Callback.newFork(function(handle) {
        if(handle.subject==false) {
          throw new TreatJS.Blame.PositiveBlame(subject, topassertion.contract);
        } else if (handle.context==false) {
          throw new TreatJS.Blame.NegativeBlame(context, topassertion.contract);
        }
      }, topassertion.callback);

      return assert(subject, topassertion.contract, cbFork.contract)

    } else {
      return proxy;
    }
  }






  //                     _   
  // __ _ ______ ___ _ _| |_ 
  /// _` (_-<_-</ -_) '_|  _|
  //\__,_/__/__/\___|_|  \__|

  function topassert(subject, contract) {

    if(!(contract instanceof TreatJS.Prototype.Contract))
      throw new TypeError("Invalid contract");

    const context = Contexts[Contexts.length-1];

    // TODO: use root callback, with check blame state
    return assert(subject, contract, function(handle) {
      if (handle.context==false) {
        throw new TreatJS.Blame.NegativeBlame(context, contract);
      } else if(handle.subject==false) {
        throw new TreatJS.Blame.PositiveBlame(subject, contract);
      }
    });
  }

  function assert(subject, contract, callback) {

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

      // Default result.
      let result = true;

      // Evaluate predicate.
      try {
        result = contract.predicate.apply(undefined, [mirror(subject)]); // TODO
      } catch (error) {
        if(error instanceof TreatJS.Blame.Blame) {
          throw error;
        } else {
          // TODO: If in verbose mode print result. 

          print(error, error.stack);

          result = false; 
        }
      } finally {
        
        // Pop contract from context stack.
        Contexts.pop(); 

        // Update callback graph.
        callback({
          context: true,
          subject: result ? true : false       
        });

      }

      // Return subject.
      return subject;
    }

    //  ___  _     _        _    ___         _               _   
    // / _ \| |__ (_)___ __| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| (_) | '_ \| / -_) _|  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
    // \___/|_.__// \___\__|\__|\___\___/_||_\__|_| \__,_\__|\__|
    //          |__/                                             

    else if (contract instanceof TreatJS.Contract.Object) {
      return (subject instanceof Object) ?  wrap(subject, contract, callback, {
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

    // ___                        _         _    ___         _               _   
    //|   \ ___ _ __  ___ _ _  __| |___ _ _| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| |) / -_) '_ \/ -_) ' \/ _` / -_) ' \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___/\___| .__/\___|_||_\__,_\___|_||_\__|\___\___/_||_\__|_| \__,_\__|\__|
    //         |_|                                                               

    else if(contract instanceof TreatJS.Contract.Dependent) {
      return (subject instanceof Function) ? wrap(subject, contract, callback, {
        apply: function (target, thisArg, argumentsArg) {
          const rangeContract = constructWith(contract.constructor, argumentsArg);
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

    else if (contract instanceof TreatJS.Contract.IIntersection) {
      const node = new TreatJS.Callback.newIntersection(callback);
      return topassert(topassert(subject, contract.left, node.left), contract.right, node.right);
    }

    else if (contract instanceof TreatJS.Contract.DIntersection) {
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
  }

  //                _               _   
  // __ ___ _ _  __| |_ _ _ _  _ __| |_ 
  /// _/ _ \ ' \(_-<  _| '_| || / _|  _|
  //\__\___/_||_/__/\__|_|  \_,_\__|\__|

  function construct(constructor, constructorArray=[]) {

    if(!(constructor instanceof TreatJS.Prototype.Constructor))
      throw new TypeError("Invalid constructor.");

    return constructWith(constructor, constructorArray);
  }

  function constructWith(constructor, constructorArray) {

    //  ___         _               _    ___             _               _           
    // / __|___ _ _| |_ _ _ __ _ __| |_ / __|___ _ _  __| |_ _ _ _  _ __| |_ ___ _ _ 
    //| (__/ _ \ ' \  _| '_/ _` / _|  _| (__/ _ \ ' \(_-<  _| '_| || / _|  _/ _ \ '_|
    // \___\___/_||_\__|_| \__,_\__|\__|\___\___/_||_/__/\__|_|  \_,_\__|\__\___/_|  

    if(constructor instanceof TreatJS.Contract.Constructor) {

      // Push contract to context stack.
      Contexts.push({
        id:       constructor.toString(),
        contract: constructor
      });

      // The new contract.
      let contract = null;

      // Call constructor to create new contract.
      try {
        contract = constructor.constructor.apply(undefined, constructorArray);
      } catch (error) {
        if(error instanceof TreatJS.Blame.Blame) {
          throw error;
        } else {
          contract = false; 
        }
      } finally {
        // Pop contract from context stack.
        Contexts.pop(); 
      }

      // Return contract.
      return contract;
    }

    //     _   _                   _         
    // ___| |_| |_  ___ _ ___ __ _(_)___ ___ 
    /// _ \  _| ' \/ -_) '_\ V  V / (_-</ -_)
    //\___/\__|_||_\___|_|  \_/\_/|_/__/\___|

    else throw new TypeError("Invalid constructor....");
  }

  // _____ ___ __  ___ _ _| |_ 
  /// -_) \ / '_ \/ _ \ '_|  _|
  //\___/_\_\ .__/\___/_|  \__|
  //        |_|                

  TreatJS.export({
    assert:   topassert,
    construct: construct
  });

  //         _                 
  // _ _ ___| |_ _  _ _ _ _ _  
  //| '_/ -_)  _| || | '_| ' \ 
  //|_| \___|\__|\_,_|_| |_||_|

  return {
    topassert: topassert,
    construct: construct
// assert
  };

});
