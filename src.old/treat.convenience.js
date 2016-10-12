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

  // ___             _ _  ___         _               _   
  //| __|__ _ _ __ _| | |/ __|___ _ _| |_ _ _ __ _ __| |_ 
  //| _/ _ \ '_/ _` | | | (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_|\___/_| \__,_|_|_|\___\___/_||_\__|_| \__,_\__|\__|

  function SimpleForallContract(constructor) {
    if(!(this instanceof SimpleForallContract)) return new SimpleForallContract(constructor);

    ForallContract.call(this, ContractConstructor(constructor, ""));
  }
  SimpleForallContract.prototype = Object.create(ForallContract.prototype);

  // ___                    _          ___         _               _   
  //| _ \___ __ _  _ _ _ __(_)_ _____ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //|   / -_) _| || | '_(_-< \ V / -_) (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_|_\___\__|\_,_|_| /__/_|\_/\___|\___\___/_||_\__|_| \__,_\__|\__|

  function SimpleRecursiveContract(constructor) {
    if(!(this instanceof SimpleRecursiveContract)) return new SimpleRecursiveContract(constructor);

    ForallContract.call(this, ContractConstructor(constructor, ""));
  }
  SimpleRecursiveContract.prototype = Object.create(RecursiveContract.prototype);



})(TreatJS);
