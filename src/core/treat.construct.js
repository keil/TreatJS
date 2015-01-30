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

  // TODO, global, assert


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

    if(!(predicate instanceof Function)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
    if(!(global instanceof Object)) error("Wrong Argument", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "predicate": {
        get: function () { return predicate; } },
      "global": {
        get: function () { return global; } },
      "name": {
        get: function () { return name; } }
    });

    this.toString = function() { return "[" + ((name!=undefined) ? name : predicate.toString()) + "]"; };
  }
  SandboxContract.prototype = new ImmediateContract();

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
    return constructWith(constructor, ((args==undefined) ? [] : args), new Global());
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
      var newglobal = (constructor.binding!==undefined) ? global.merge(constructor.binding) : global;   
      var globalArg = newglobal.dump(); 
      var thisArg = undefined;
      var argsArray = args;

      var treatjs = {};
      var contract = {}
      var newBaseContract = function (predicate, name) {
        return SandboxContract(predicate, globalArg, name);
      };

      for(property in _) {
        if(property==="BaseContract") {
          __define(property, newBaseContract, treatjs);
        }
        else __define(property, _[property], treatjs);
      }

      var build = TreatJS.build();

      for(property in build) {
        if(property==="Base") {
          __define(property, newBaseContract, contract);
        }
        else __define(property, build[property], contract);
      }

      globalArg["_"] = treatjs;
      globalArg["Contract"] = contract;
      globalArg["C"] = globalArg["Contract"];

      var contract = (_.eval(constructor.constructor, globalArg, thisArg, argsArray));

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

})(TreatJS);
