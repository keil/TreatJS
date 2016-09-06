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

  //  ___                 
  // | __|_ _ _ _ ___ _ _ 
  // | _|| '_| '_/ _ \ '_|
  // |___|_| |_| \___/_|  

  function ContractError (message) {
    this.name = 'Contract Violation';
    this.message = 'Predicate function cannot cause observable effects or call functions.' + (message? '\n'+message: '');;
    this.stack = (new Error()).stack;
  }
  ContractError.prototype = Object.create(Error.prototype);
  ContractError.prototype.constructor = ContractError;






  //  ___         _           _   
  // / __|___ _ _| |_ _____ _| |_ 
  //| (__/ _ \ ' \  _/ -_) \ /  _|
  // \___\___/_||_\__\___/_\_\\__|

  function Context(name, target) {
    if(!(this instanceof Context)) return new Context(...arguments);

    if((typeof name) != "string") error("Wrong Context", (new Error()).fileName, (new Error()).lineNumber);
    if((typeof target) != "object") error("Wrong Context" + (typeof target), (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "name": {
        value: name
      },
      "target": {
        value: target
      }
    });
  }
  Context.prototype = Object.create(Contract.prototype);
  Context.prototype.constructor = ConstructorContract;

  Context.prototype = Obejct;
  Context.prototype.toString = function() {
    return this.name;
  }

  function GlobalContext() {
  
  }

  function ContextContext() {

  }


  // _    ___ _                ___ _        _       
  //(_)__| _ ) |__ _ _ __  ___/ __| |_ __ _| |_ ___ 
  //| (_-< _ \ / _` | '  \/ -_)__ \  _/ _` |  _/ -_)
  //|_/__/___/_\__,_|_|_|_\___|___/\__\__,_|\__\___|

  function isBlameState(handle) {

    if(handle.context==false || handle.subject==false) {
      throw new ContractError();
    }

  }

  //                     _   
  // __ _ ______ ___ _ _| |_ 
  /// _` (_-<_-</ -_) '_|  _|
  //\__,_/__/__/\___|_|  \__|

  function assert(subject, contract) {



    
    if(!(contract instanceof TreatJS.Prototype.Contract))
      throw new TypeError("Invalid contract");

    // TODO, check if contract is caonical


    return assertWith()
  }





  function assertContract(subject, contract, callback) {

    // ___                ___         _               _   
    //| _ ) __ _ ___ ___ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| _ \/ _` (_-</ -_) (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___/\__,_/__/\___|\___\___/_||_\__|_| \__,_\__|\__|

    else if(contract instanceof TreatJS.Contract.Base) {
      //count(TreatJS.Statistic.BASE);

      //var callback = BaseCallback(callbackHandler, contract);

      // push new context
      //pushContext(contract);

      try {
        var result = contract.predicate.apply(undefined, subject);
      } catch (e) { 
        if(e instanceof TreatJSError) {
          var result = e;
        } else if(TreatJS.Config.exceptionPassThrough) {
          var result = e;
        } else {
          var result = Conflict;
        }
      } finally {
        // pop context
        //popContext(); 

        callback({
          context: true,
          subject: result ? true : false;       
        });


        if(result instanceof Error) {
          throw result;
        } else {
          var handle = new Handle(True, result);
          callback.predicateHandler(handle);
          return arg;
        }
      }
    }









  


    //  ___  _     _        _    ___         _               _   
    // / _ \| |__ (_)___ __| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| (_) | '_ \| / -_) _|  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
    // \___/|_.__// \___\__|\__|\___\___/_||_\__|_| \__,_\__|\__|
    //          |__/                                             

    else if (contract instanceof TreatJS.Contract.Object) {
      if(!(arg instanceof Object)) callbackHandler(Handle(True, False));

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


    // ___          _   _   _          ___         _               _   
    //| __|  _ _ _ | |_| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| _| || | ' \| / /  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_| \_,_|_||_|_\_\\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

    if(contract instanceof TreatJS.Contract.Function) {
      return (subject instanceof Function) ? new Proxy(subject, {
        apply: function (target, thisArg, argumentsArg) {
          var callback = new TreatJS.Callback.Function(callback);
        
          var argumentsArg = monitor(argumentsArg, contract.domain, callback.domain);
          var result = Reflect.apply(subject, thisArg, argumentsArg);
          return monitor(result, contract.range, callback.range);    
        
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
          var range = construct(contract, argumentsArg);

          var result = Reflect.apply(subject, thisArg, argumentsArg);
          return monitor(result, range, callback);

        }}) : subject;
    }
  



    // XXX XXX XXX

    // _   _      _          ___         _               _   
    //| | | |_ _ (_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| |_| | ' \| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    // \___/|_||_|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof TreatJS.Contract.Union) {
      var union = new TreatJS.Callback.Union(callback);
      return assert(assert(subject, contract.left, union.left), contract.right, union.right);
    }
    // ___     _                      _   _          ___         _               _   
    //|_ _|_ _| |_ ___ _ _ ___ ___ __| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    // | || ' \  _/ -_) '_(_-</ -_) _|  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___|_||_\__\___|_| /__/\___\__|\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof TreatJS.Contract.Intersection) {
      var intersection = new TreatJS.Callback.Intersection(callback);
      return assert(assert(subject, contract.left, union.left), contract.right, union.right);
    }

    else if (contract instanceof TreatJS.Contract.Intersection) {
      // delayed
      var intersection = new TreatJS.Callback.Intersection(callback);
      return assert(assert(subject, contract.left, union.left), contract.right, union.right);
    }










    // ___     _                      _   _          ___         _               _   
    //|_ _|_ _| |_ ___ _ _ ___ ___ __| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    // | || ' \  _/ -_) '_(_-</ -_) _|  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___|_||_\__\___|_| /__/\___\__|\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof TreatJS.Contract.Intersection) {

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

  function construct(constructor, argsArray=[]) {

    if(!(constructor instanceof TreatJS.Prototype.Constructor))
      throw new TypeError("Invalid Constructor");

    return assertWith(constructor, argsArray);
  }

  function constructWith(constructor, argsArray) {

    //  ___         _               _    ___             _               _           
    // / __|___ _ _| |_ _ _ __ _ __| |_ / __|___ _ _  __| |_ _ _ _  _ __| |_ ___ _ _ 
    //| (__/ _ \ ' \  _| '_/ _` / _|  _| (__/ _ \ ' \(_-<  _| '_| || / _|  _/ _ \ '_|
    // \___\___/_||_\__|_| \__,_\__|\__|\___\___/_||_/__/\__|_|  \_,_\__|\__\___/_|  

    if(constructor instanceof TreatJS.Contract.Constructor) {

      // push new context
      // TODO
      //pushContext(constructor);

      try {
        var contract = constructor.constructor.apply(undefined, arguments);
      } catch (error) {
        var contract = error;
      } finally {
        // pop context // TODO
        //popContext(); 
        throw contract;
      });


      if(!(contract instanceof TreatJS.Prototype.Contract))
        throw new TypeError("Invalid Contract");

    }

    //     _   _                   _         
    // ___| |_| |_  ___ _ ___ __ _(_)___ ___ 
    /// _ \  _| ' \/ -_) '_\ V  V / (_-</ -_)
    //\___/\__|_||_\___|_|  \_/\_/|_/__/\___|
                                       
    else throw new TypeError("Invalid constructor");
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

  // INDY and co
  // verbose
  // unwrap and co


});
