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

  // contracts
  var FunctionContract = TreatJS.Contract.Function;
  var MethodContract = TreatJS.Contract.Method;
  var DependentContract = TreatJS.Contract.Dependent;
  var ObjectContract = TreatJS.Contract.Object;

  var WithContract = TreatJS.Contract.With;

  var ForallContract = TreatJS.Contract.Forall;

  // constructors
  var ContractConstructor = TreatJS.Constructor.Constructor;

  // Map
  var Map = TreatJS.Map.Map;
  var StringMap = TreatJS.Map.StringMap;
  var Mapping = TreatJS.Map.Mapping;
  var RegExpMap = TreatJS.Map.RegExpMap;

  //  ___  _     _        _    ___         _               _   
  // / _ \| |__ (_)___ __| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| (_) | '_ \| / -_) _|  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
  // \___/|_.__// \___\__|\__|\___\___/_||_\__|_| \__,_\__|\__|
  //          |__/                                             

  function AdvancedObjectContract(mapping, strict) {
    if(!(this instanceof AdvancedObjectContract)) return new AdvancedObjectContract(mapping, strict);

    if(mapping instanceof Array) {
      ObjectContract.call(this, StringMap(mapping, strict)); 
    } else if(mapping instanceof Object) {
      ObjectContract.call(this, StringMap(mapping, strict)); 
    } else {
      ObjectContract.call(this, StringMap({}, strict));
    }
  }
  AdvancedObjectContract.prototype = Object.create(ObjectContract.prototype);

  // ___          _   _   _          ___         _               _   
  //| __|  _ _ _ | |_| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| _| || | ' \| / /  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_| \_,_|_||_|_\_\\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

  function AdvancedFunctionContract(domain, range, strict) {
    if(!(this instanceof AdvancedFunctionContract)) return new AdvancedFunctionContract(domain, range, strict);

    if(!(range instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    if(domain instanceof Array) {
      FunctionContract.call(this, AdvancedObjectContract(domain, strict), range);
    } else if(domain instanceof Object) {
      FunctionContract.call(this, AdvancedObjectContract(domain, strict), range);
    } else error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
  }
  AdvancedFunctionContract.prototype = Object.create(FunctionContract.prototype);

  function SimpleFunctionContract() {
    if(!(this instanceof SimpleFunctionContract)) {
      var base = Object.create(SimpleFunctionContract.prototype);
      SimpleFunctionContract.apply(base, arguments);
      return base;
    }
    if(arguments.length < 2) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    var domain = [];
    for(var i=0; i<arguments.length;i++) domain[i]=arguments[i];

    var range = domain.pop();

    FunctionContract.call(this, AdvancedObjectContract(domain, false), range);
  }
  SimpleFunctionContract.prototype = Object.create(FunctionContract.prototype);

  // __  __     _   _            _  ___         _               _   
  //|  \/  |___| |_| |_  ___  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
  //| |\/| / -_)  _| ' \/ _ \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_|  |_\___|\__|_||_\___/\__,_|\___\___/_||_\__|_| \__,_\__|\__|

  function AdvancedMethodContract(domain, range, context, strict) {
    if(!(this instanceof AdvancedMethodContract)) return new AdvancedMethodContract(domain, range, context, strict);

    if(!(range instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
    if(!(context instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    if(domain instanceof Array) {
      MethodContract.call(this, AdvancedObjectContract(domain, strict), range, context);
    } else if(domain instanceof Object) {
      MethodContract.call(this, AdvancedObjectContract(domain, strict), range, context);
    } else error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
  }
  AdvancedMethodContract.prototype = Object.create(MethodContract.prototype);

  function SimpleMethodContract() {
    if(!(this instanceof SimpleMethodContract)) {
      var base = Object.create(SimpleMethodContract.prototype);
      SimpleMethodContract.apply(base, arguments);
      return base;
    }
    if(arguments.length < 3) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    var domain = [];
    for(var i=0; i<arguments.length;i++) domain[i]=arguments[i];

    var context = domain.pop();
    var range = domain.pop();

    MethodContract.call(this, AdvancedObjectContract(domain, false), range, context);
  }
  SimpleMethodContract.prototype = Object.create(MethodContract.prototype);

  // ___                        _         _    ___         _               _   
  //|   \ ___ _ __  ___ _ _  __| |___ _ _| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| |) / -_) '_ \/ -_) ' \/ _` / -_) ' \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___/\___| .__/\___|_||_\__,_\___|_||_\__|\___\___/_||_\__|_| \__,_\__|\__|
  //         |_|                                                               

  function SimpleDependentContract(constructor) {
    if(!(this instanceof SimpleDependentContract)) return new SimpleDependentContract(constructor);

    DependentContract.call(this, ContractConstructor(constructor, ""));
  }
  SimpleDependentContract.prototype = Object.create(DependentContract.prototype);

  // ___             _ _  ___         _               _   
  //| __|__ _ _ __ _| | |/ __|___ _ _| |_ _ _ __ _ __| |_ 
  //| _/ _ \ '_/ _` | | | (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_|\___/_| \__,_|_|_|\___\___/_||_\__|_| \__,_\__|\__|

  function SimpleForallContract(constructor) {
    if(!(this instanceof SimpleForallContract)) return new SimpleForallContract(constructor);

    ForallContract.call(this, ContractConstructor(constructor, ""));
  }
  SimpleForallContract.prototype = Object.create(ForallContract.prototype);

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Convenience", {});

  TreatJS.define(TreatJS.Convenience, "AObject", AdvancedObjectContract);

  TreatJS.define(TreatJS.Convenience, "AFunction", AdvancedFunctionContract);
  TreatJS.define(TreatJS.Convenience, "SFunction", SimpleFunctionContract);

  TreatJS.define(TreatJS.Convenience, "AMethod", AdvancedMethodContract);
  TreatJS.define(TreatJS.Convenience, "SMethod", SimpleMethodContract);

  TreatJS.define(TreatJS.Convenience, "SDependent", SimpleDependentContract);

  TreatJS.define(TreatJS.Convenience, "SForall", SimpleForallContract);

})(TreatJS);
