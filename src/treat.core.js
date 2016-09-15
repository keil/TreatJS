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

  // TODO, use realm-aware weak map
  const Assertions = new WeakMap();
  
  function wrap(subject, contract, callback, handler) {
    const proxy = new Proxy(subject, handler);

    Assertions.set(proxy, {
      subject: subject,
      contract: contract, 
      callback: callback
    });

    return proxy;
  }






  function unwrap(proxy) {
    if(Assertions.has(proxy))
      return unwrap(Assertions.get(proxy).subject);
    else
      return proxy;  
  }



  function mirror(proxy) {
    if(Assertions.has(proxy)) {

      print("mirror subject ... ");
      
      const assertion = Assertions.get(proxy);

      const subject = mirror(assertion.subject);
      const context = Contexts[Contexts.length-1];

      const cbFork = TreatJS.Callback.newFork(function(handle) {
        if(handle.subject==false) {
          throw new TreatJS.Blame.PositiveBlame(subject, assertion.contract);
        } else if (handle.context==false) {
          throw new TreatJS.Blame.NegativeBlame(context, assertion.contract);
        }
      }, assertion.callback);

      return assertWith(subject, assertion.contract, cbFork.contract)
      

    } else {

      print("do not mirror subject ... ");

      return proxy;
      // TODO
      //return proxy;  
    }
  }















  //                     _   
  // __ _ ______ ___ _ _| |_ 
  /// _` (_-<_-</ -_) '_|  _|
  //\__,_/__/__/\___|_|  \__|

  function assert(subject, contract) {

    if(!(contract instanceof TreatJS.Prototype.Contract))
      throw new TypeError("Invalid contract");

    const context = Contexts[Contexts.length-1];


    return assertWith(subject, contract, function(handle) {
      if(handle.subject==false) {
        throw new TreatJS.Blame.PositiveBlame(subject, contract);
      } else if (handle.context==false) {
        throw new TreatJS.Blame.NegativeBlame(context, contract);
        //throw new TreatJS.Blame.NegativeBlame(Contexts[Contexts.length-1], contract);
      }
    });
  }

  function assertWith(subject, contract, callback) {

    // ___                ___         _               _   
    //| _ ) __ _ ___ ___ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| _ \/ _` (_-</ -_) (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___/\__,_/__/\___|\___\___/_||_\__|_| \__,_\__|\__|

    if(contract instanceof TreatJS.Contract.Base) {

      // push new context
      Contexts.push({
        id:       contract.toString(),
        contract: contract
      });

      var result = true;

      try {
        result = contract.predicate.apply(undefined, [mirror(subject)]);
      } catch (error) {
        //print(error); // TODO
        if(error instanceof TreatJS.Blame.Blame) {
          throw error; /// TODO, test
        } else {
           print(error, error.stack);

          result = false; 
        }
      } finally {
print("adfasdfadf", result);
        // pop context
        Contexts.pop(); 

        // update callback graph
        callback({
          context: true,
          subject: result ? true : false       
        });

      }

      return subject;
    }

    //  ___  _     _        _    ___         _               _   
    // / _ \| |__ (_)___ __| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| (_) | '_ \| / -_) _|  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
    // \___/|_.__// \___\__|\__|\___\___/_||_\__|_| \__,_\__|\__|
    //          |__/                                             

    else if (contract instanceof TreatJS.Contract.Object) {
      //return (subject instanceof Object) ? new Proxy(subject, {
      return (subject instanceof Object) ?  wrap(subject, contract, callback, {
        get: function (target, name, receiver) {          
          const value = Reflect.get(target, name, receiver);       
          return contract.map.has(name) ? assertWith(value, contract.map.get(name), callback) : value;
        },
        set: function (target, name, value, receiver) {
          const node = TreatJS.Callback.newAssignment(callback);
          const contracted = contract.map.has(name) ? assertWith(value, contract.map.get(name), node.properties) : value;
          return Reflect.set(target, name, contracted, receiver);
        }
      }) : subject;
    }

    // ___          _   _   _          ___         _               _   
    //| __|  _ _ _ | |_| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| _| || | ' \| / /  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_| \_,_|_||_|_\_\\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

    else if(contract instanceof TreatJS.Contract.Function) {
      //return (subject instanceof Function) ? new Proxy(subject, {
      return (subject instanceof Function) ? wrap(subject, contract, callback, {
        apply: function (target, thisArg, argumentsArg) {
          const node = TreatJS.Callback.newFunction(callback);
          const contracted = assertWith(argumentsArg, contract.domain, node.domain);
          const result = Reflect.apply(target, thisArg, contracted);
          return assertWith(result, contract.range, node.range);    
        }
      }) : subject;
    }

    // ___                        _         _    ___         _               _   
    //|   \ ___ _ __  ___ _ _  __| |___ _ _| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| |) / -_) '_ \/ -_) ' \/ _` / -_) ' \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___/\___| .__/\___|_||_\__,_\___|_||_\__|\___\___/_||_\__|_| \__,_\__|\__|
    //         |_|                                                               

    else if(contract instanceof TreatJS.Contract.Dependent) {
      return (subject instanceof Function) ? new Proxy(subject, {
        apply: function (target, thisArg, argumentsArg) {
          const rangeContract = constructWith(contract.constructor, argumentsArg);
          const result = Reflect.apply(target, thisArg, argumentsArg);
          return assertWith(result, rangeContract, callback);
        }
      }) : subject;
    }

    // _   _      _          ___         _               _   
    //| | | |_ _ (_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| |_| | ' \| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    // \___/|_||_|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof TreatJS.Contract.Union) {
      const node = TreatJS.Callback.newUnion(callback);
      return assertWith(assertWith(subject, contract.left, node.left), contract.right, node.right);
    }

    // ___     _                      _   _          ___         _               _   
    //|_ _|_ _| |_ ___ _ _ ___ ___ __| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    // | || ' \  _/ -_) '_(_-</ -_) _|  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___|_||_\__\___|_| /__/\___\__|\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof TreatJS.Contract.IIntersection) {
      const node = new TreatJS.Callback.newIntersection(callback);
      return assert(assert(subject, contract.left, node.left), contract.right, node.right);
    }

    else if (contract instanceof TreatJS.Contract.DIntersection) {
      return (subject instanceof Object) ? new Proxy(subject, new Proxy({}, {
        get: function (handler, trapname) {
          return function(target, ...trapArgs) {
            const node = TreatJS.Callback.newIntersection(callback);
            const contracted = assertWith(assertWith(target, contract.left, node.left), contract.right, node.right);
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

      // push new context
      // TODO
      //pushContext(constructor);

      try {
        var contract = constructor.constructor.apply(undefined, constructorArray);
      } catch (error) {

        print("adfadf", error);

        var contract = error;
      } finally {
        // pop context // TODO
        //popContext(); 
        return contract;
      }

      if(!(contract instanceof TreatJS.Prototype.Contract))
        throw new TypeError("Invalid Contract.");

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
    assert: assert,
    construct: construct
  });

  //         _                 
  // _ _ ___| |_ _  _ _ _ _ _  
  //| '_/ -_)  _| || | '_| ' \ 
  //|_| \___|\__|\_,_|_| |_||_|

  return {
    assert: assert,
    construct: construct
  };

});
