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

  //  ___         _           _   
  // / __|___ _ _| |_ _____ _| |_ 
  //| (__/ _ \ ' \  _/ -_) \ /  _|
  // \___\___/_||_\__\___/_\_\\__|

  var Contexts = new Array();

  Contexts.push({
    id: "Global Context",
  });

  //                     _   
  // __ _ ______ ___ _ _| |_ 
  /// _` (_-<_-</ -_) '_|  _|
  //\__,_/__/__/\___|_|  \__|

  function assert(subject, contract) {

    if(!(contract instanceof TreatJS.Prototype.Contract))
      throw new TypeError("Invalid contract");

    return assertWith(subject, contract, function(handle) {
      if(handle.subject==false) {
        throw new TreatJS.Blame.PositiveBlame(subject, contract);
      } else if (handle.context==false) {
        throw new TreatJs.Blame.NegativeBlame(Contexts[Contexts.length-1], contract);
      }
    });
  }

  function assertWith(subject, contract, callback) {

    // Constructor


    // ___                ___         _               _   
    //| _ ) __ _ ___ ___ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| _ \/ _` (_-</ -_) (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___/\__,_/__/\___|\___\___/_||_\__|_| \__,_\__|\__|

    if(contract instanceof TreatJS.Contract.Base) {

      // push new context
      Contexts.push({
        id:       contract.name,
      contract: contract
      })

      try {
        var result = contract.predicate.apply(undefined, [subject]);
      } catch (error) {
       print(error);
        if(error instanceof Blame) {
          throw error; /// TODO, test
        } else {
          var result = false; 
        }
      } finally {

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

    // doing this is required because indy would redirect cntext blames to its
    // wirks for INDY, as iny itself redicrets the context

    else if (contract instanceof TreatJS.Contract.Object) {
      return (subject instanceof Object) ? new Proxy(subject, {
        get: function (target, name, receiver) {
          var value = Reflect.get(target, name, receiver);
          return (name in contract.mapping) ? assertWith(value, contract.mapping[name], callback) : value;
        },
        set: function (target, name, value, receiver) {
          var callback = TreatJS.Callback.createAssignment(callback);
          var contracted = (name in contract.mapping) ? assertWith(value, contract.mapping[name], callback.contract) : value;
          return Reflect.set(target, name, value, receiver);
        }
      }) : subject;
    }

    // ___          _   _   _          ___         _               _   
    //| __|  _ _ _ | |_| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| _| || | ' \| / /  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_| \_,_|_||_|_\_\\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

    else if(contract instanceof TreatJS.Contract.Function) {

      return (subject instanceof Function) ? new Proxy(subject, {
        apply: function (target, thisArg, argumentsArg) {
          //
          var callback = TreatJS.Callback.createFunctionCallback(callback);

          var contracted = assertWith(argumentsArg, contract.domain, callback.domain);
          var result = Reflect.apply(subject, thisArg, contracted);
          return assertWith(result, contract.range, callback.range);    

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

    else if (contract instanceof TreatJS.Contract.IIntersection) {
      var callback = new TreatJS.Callback.Intersection(callback);
      return assert(assert(subject, contract.left, callback.left), contract.right, callback.right);
    }

    // delayed
    else if (contract instanceof TreatJS.Contract.DIntersection) {

      var intersection = new TreatJS.Callback.Intersection(callback);
      return assert(assert(subject, contract.left, union.left), contract.right, union.right);
    }



    // delayed
    else if (contract instanceof TreatJS.Contract.DIntersection) {
      return (subject instanceof Object) ? new Proxy(subject, {

        get: function (target, name, receiver) {
          var callback = TreatJS.Callback.freshIntersecton(callback);
          var contracted =  assertWith(assertWith(target, contract.left, callback.left), contract.right, callback.right);
          return Reflect.get(contractd, name, receiver);
        },

        set: function (target, trap, receiver) {

          return function(target, ...restArgs) {
            var callback = TreatJS.Callback.freshIntersecton(callback);
            var contracted =  assertWith(assertWith(target, contract.left, callback.left), contract.right, callback.right);
            return Reflect[trap](contractd, ...restAgs);
          }

        },

      apply: function (target, thisArg, argumentsArg) {
        var range = construct(contract, argumentsArg);

        var result = Reflect.apply(subject, thisArg, argumentsArg);
        return monitor(result, range, callback);

      }}) : subject;




      var intersection = new TreatJS.Callback.Intersection(callback);
      return assert(assert(subject, contract.left, union.left), contract.right, union.right);
    }







    // ___     _                      _   _          ___         _               _   
    //|_ _|_ _| |_ ___ _ _ ___ ___ __| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    // | || ' \  _/ -_) '_(_-</ -_) _|  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___|_||_\__\___|_| /__/\___\__|\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof TreatJS.Contract.IIntersection) {
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
      throw new TypeError("Invalid constructor.");

    return constructWith(constructor, argsArray);
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
        var contract = constructor.constructor.apply(undefined, argsArray);
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

  // INDY and co
  // verbose
  // unwrap and co


});
