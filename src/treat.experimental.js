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

TreatJS.package("Experimental", function (TreatJS, Contract, configuration) {

  //   _           _  ___         _               _   
  //  /_\  _ _  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
  // / _ \| ' \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
  ///_/ \_\_||_\__,_|\___\___/_||_\__|_| \__,_\__|\__|

  function AndContract(first, second) {
    if(!(this instanceof AndContract)) return new AndContract(first, second);

    if(!(first instanceof Contract))
      error("Invalid Contract Argument", (new Error()).fileName, (new Error()).lineNumber);
    if(!(second instanceof Contract))
      error("Invalid Contract Argument", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "first": {
        value: first
      },
      "second": {
        value: second
      }
    });
  }
  AndContract.prototype = Object.create(CombinatorContract.prototype);
  AndContract.prototype.toString = function() {
    return "(" + this.first.toString() + "and" + this.second.toString() + ")";
  };

  //  ___       ___         _               _   
  // / _ \ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| (_) | '_| (__/ _ \ ' \  _| '_/ _` / _|  _|
  // \___/|_|  \___\___/_||_\__|_| \__,_\__|\__|

  function OrContract(first, second) { 
    if(!(this instanceof OrContract)) return new OrContract(first, second);

    if(!(first instanceof Contract))
      error("Invalid Contract Argument", (new Error()).fileName, (new Error()).lineNumber);
    if(!(second instanceof Contract))
      error("Invalid Contract Argument", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "first": {
        value: first
      },
      "second": {
        value: second
      }
    });
  }
  OrContract.prototype = Object.create(CombinatorContract.prototype);
  OrContract.prototype.toString = function() {
    return "(" + this.first.toString() + "or" + this.second.toString() + ")";
  };

  // _  _     _    ___         _               _   
  //| \| |___| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| .` / _ \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_|\_\___/\__|\___\___/_||_\__|_| \__,_\__|\__|

  function NotContract(sub) { 
    if(!(this instanceof NotContract)) return new NotContract(sub);

    if(!(sub instanceof Contract))
      error("Invalid Contract Argument", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "sub": {
        value: sub
      }
    });
  }
  NotContract.prototype = Object.create(WrapperContract.prototype);
  NotContract.prototype.toString = function() {
    return "(not" + this.sub.toString() + ")";
  };

  //__      ___ _   _    ___         _               _   
  //\ \    / (_) |_| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
  // \ \/\/ /| |  _| ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  //  \_/\_/ |_|\__|_||_\___\___/_||_\__|_| \__,_\__|\__|                                                   

  function WithContract(binding, sub) {
    if(!(this instanceof WithContract)) return new WithContract(binding, sub);

    if(!(binding instanceof Object)) error("Invalid Contract Argument", (new Error()).fileName, (new Error()).lineNumber);
    if(!(sub instanceof Contract)) error("Invalid Contract Argument", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "binding": {
        value: binding
      },
      "sub": {
        value: sub
      }
    });
  }
  WithContract.prototype = Object.create(WrapperContract.prototype);
  WithContract.prototype.toString = function() {
    var domain = "";
    for(name in this.binding) domain += ((domain===""?"":",")) + name;
    return "(with {" + domain + "}" + this.sub.toString() + ")";
  };


  // _  _               _   _          ___         _               _   
  //| \| |___ __ _ __ _| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| .` / -_) _` / _` |  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_|\_\___\__, \__,_|\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|
  //         |___/                                                     

  function NegationContract(sub) { 
    if(!(this instanceof NegationContract)) return new NegationContract(sub);

    if(!(sub instanceof Contract))
      error("Invalid Contract Argument", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "sub": {
        value: sub
      }
    }); 
  }
  NegationContract.prototype = Object.create(WrapperContract.prototype);
  NegationContract.prototype.toString = function() {
    return "(neg" + this.sub.toString() + ")";
  };


});
