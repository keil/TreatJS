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

TreatJS.package("TreatJS.Convenience", function (TreatJS, Contract, configuration) {

  // ___          _   _   _          ___         _               _   
  //| __|  _ _ _ | |_| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| _| || | ' \| / /  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_| \_,_|_||_|_\_\\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

  function AFunctionContract(mappings, range) {
      if(!(this instanceof AFunctionContract)) return new AFunctionContract(domain, range, strict);
      else TreatJS.Contract.Function.apply(this, new TreatJS.Contract.Object(mappings), range);  
  }
  AFunctionContract.prototype = Object.create(TreatJS.Contract.Function.prototype);
  AFunctionContract.prototype.constructor = AFunctionContract;

  function SFunctionContract() {
      if(!(this instanceof AFunctionContract)) return new AFunctionContract(domain, range, strict);
      else {
        var parameters = Array.from(arguments);
        var range = parameters.pop();      
        TreatJS.Contract.Function.apply(this, new TreatJS.Contract.Object(parameters), range);  
      }
  }
  SFunctionContract.prototype = Object.create(TreatJS.Contract.Function.prototype);
  SFunctionContract.prototype.constructor = SFunctionContract;




//  AFunctionContract.prototype.toString = function() {
//    return "(" + "*" + "-->" + this.constructor.toString() + ")";
//  };


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


  
  // ___     _                      _   _          ___         _               _   
  //|_ _|_ _| |_ ___ _ _ ___ ___ __| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  // | || ' \  _/ -_) '_(_-</ -_) _|  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___|_||_\__\___|_| /__/\___\__|\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

  function IntersectionContract(left, right) { 
    if(!(this instanceof IntersectionContract)) return new IntersectionContract(...arguments);
    else TreatJS.Prototype.Delayed.apply(this);




    if(!(left instanceof TreatJS.Prototype.Delayed))
      throw new TypeError("Invalid contract");
    if(!(right instanceof TreatJS.Prototype.Delayed))
      throw new TypeError("Invalid contract");

    Object.defineProperties(this, {
      "left": {
        value: left
      },
      "right": {
        value: right
      }
    });
  }
  IntersectionContract.prototype = Object.create(TreatJS.Prototype.Delayed.prototype);
  IntersectionContract.prototype.constructor = IntersectionContract;
  IntersectionContract.prototype.toString = function() {
    return "(" + this.first.toString() + ") - (" + this.second.toString() + ")";
  };











  


  // __  __     _   _            _  ___         _               _   
  //|  \/  |___| |_| |_  ___  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
  //| |\/| / -_)  _| ' \/ _ \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_|  |_\___|\__|_||_\___/\__,_|\___\___/_||_\__|_| \__,_\__|\__|

  function MethodContract(domain, range, context) {
    if(!(this instanceof MethodContract)) return new MethodContract(domain, range, context);

    if(!(domain instanceof Contract))
      error("Invalid Contract Argument", (new Error()).fileName, (new Error()).lineNumber);
    if(!(range instanceof Contract))
      error("Invalid Contract Argument", (new Error()).fileName, (new Error()).lineNumber);
    if(!(context instanceof Contract))
      error("Invalid Contract Argument", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "domain": {
        value: domain
      },
      "range": {
        value: range
      },
      "context": {
        value: context
      }
    });
  }
  MethodContract.prototype = Object.create(DelayedContract.prototype);
  MethodContract.prototype.toString = function() {
    return "(" + this.domain.toString() + "-->" + this.range.toString() + "|" + this.context.toString() + ")";
  };



});
