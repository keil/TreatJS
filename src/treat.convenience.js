/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */
(function(_) {

  var error = _.error;
  var violation = _.violation;
  var blame = _.blame;

  var Contract = _.Core.Contract;
  var Constructor = _.Core.Constructor;

  var ContractConstructor = _.Constructor;

  var BaseContract = _.BaseContract;

  var FunctionContract = _.FunctionContract;
  var MethodContract = _.MethodContract;
  var DependentContract = _.DependentContract;
  var ObjectContract = _.ObjectContract;

  var WithContract = _.With;

  var AndContract = _.And;
  var OrContract = _.Or;
  var NotContract = _.Not;

  var Map = _.Map.Map;
  var StringMap = _.Map.StringMap;
  var Mapping = _.Map.Mapping;
  var RegExpMap = _.Map.RegExpMap;

  var Blank = new BaseContract(function(){return true;}, "-");
  var BlankC = new ContractConstructor(function(){return Blank;});

  // TODO:
  // * complete testcases

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
  AdvancedObjectContract.prototype = new ObjectContract(new Map());

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
  AdvancedFunctionContract.prototype = new FunctionContract(Blank, Blank);

  function SimpleFunctionContract() {
    if(!(this instanceof SimpleFunctionContract)) {
      var base = Object.create(SimpleFunctionContract.prototype);
      SimpleFunctionContract.apply(base, arguments);
      return base;
    }
    if(arguments.length < 2) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    var domain = [];
    for(var i=0; i<arguments.length;i++) domain[i]=arguments[i];

    // TODO:
    // a normal function contract is not strict
    // make a seperate *strict* simple function conract
    // var sign = domain.pop();
    // var strict = domain.pop();is not really intended 

    var range = domain.pop();

    FunctionContract.call(this, AdvancedObjectContract(domain, false), range);
  }
  SimpleFunctionContract.prototype = new FunctionContract(Blank, Blank);

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
  AdvancedMethodContract.prototype = new MethodContract(Blank, Blank, Blank);

  function SimpleMethodContract() {
    if(!(this instanceof SimpleMethodContract)) {
      var base = Object.create(SimpleMethodContract.prototype);
      SimpleMethodContract.apply(base, arguments);
      return base;
    }
    if(arguments.length < 3) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    var domain = [];
    for(var i=0; i<arguments.length;i++) domain[i]=arguments[i];

    // TODO:
    // a normal function contract is not strict
    // make a seperate *strict* simple function conract
    // var sign = domain.pop();
    // var strict = domain.pop();is not really intended 
    
    var context = domain.pop();
    var range = domain.pop();

    MethodContract.call(this, AdvancedObjectContract(domain, false), range);
  }
  SimpleMethodContract.prototype = new MethodContract(Blank, Blank, Blank);

  // ___                        _         _    ___         _               _   
  //|   \ ___ _ __  ___ _ _  __| |___ _ _| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| |) / -_) '_ \/ -_) ' \/ _` / -_) ' \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___/\___| .__/\___|_||_\__,_\___|_||_\__|\___\___/_||_\__|_| \__,_\__|\__|
  //         |_|                                                               

    function SimpleDependentContract(name, contract) {
      if(!(this instanceof SimpleDependentContract)) return new SimpleDependentContract(name, contract);

      function domain(domainArgs) {
        var binding = {};
        binding[name]=domainArgs;
        return _.With(binding, contract);
      } 
      DependentContract.call(this, _.Constructor(domain));
  }
  SimpleDependentContract.prototype = new DependentContract(BlankC);

  /**
   * Convenience Contracts
   */

  __define("AdvancedObjectContract", AdvancedObjectContract, _);

  __define("AdvancedFunctionContract", AdvancedFunctionContract, _);
  __define("SimpleFunctionContract", SimpleFunctionContract, _);

  __define("AdvancedMethodContract", AdvancedMethodContract, _);
  __define("SimpleMethodContract", SimpleMethodContract, _);

  __define("SimpleDependentContract", SimpleDependentContract, _);

})(_);
