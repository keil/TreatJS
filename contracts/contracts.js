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

//  _____            _                  _       
// / ____|          | |                | |      
//| |     ___  _ __ | |_ _ __ __ _  ___| |_ ___ 
//| |    / _ \| '_ \| __| '__/ _` |/ __| __/ __|
//| |___| (_) | | | | |_| | | (_| | (__| |_\__ \
// \_____\___/|_| |_|\__|_|  \__,_|\___|\__|___/

var Contracts = Contracts || (function() {

  /** The Contracts package.
  */
  const Contracts = {};

  // _       ___ _       _           
  //| |_ ___/ __| |_ _ _(_)_ _  __ _ 
  //|  _/ _ \__ \  _| '_| | ' \/ _` |
  // \__\___/___/\__|_| |_|_||_\__, |
  //                           |___/ 

  Object.defineProperty(Contracts, "toString", {
    value: function() {
      return "[[Contracts]]";
    }
  });

  // _         _ _    _ 
  //| |__ _  _(_) |__| |
  //| '_ \ || | | / _` |
  //|_.__/\_,_|_|_\__,_|

  function build() {

    /**
     * Any 
     **/

    this.Any = Contract.Base(function(arg) {
      return true; 
    },"Any");

    /**
     * Type Contract
     **/

    this.typeUndefined = Contract.Base(function(arg) {
      return ((typeof arg) === "undefined");
    },"typeUndefined");

    this.typeObject =  Contract.Base(function(arg) {
      return ((typeof arg) === "object");
    },"typeObject");

    this.typeBoolean = Contract.Base(function(arg) {
      return ((typeof arg) === "boolean");
    },"typeBoolean");

    this.typeNumber = Contract.Base(function(arg) {
      return ((typeof arg) === "number");
    },"typeNumber");

    this.typeString = Contract.Base(function(arg) {
      return ((typeof arg) === "string");
    },"typeString");

    this.typeSymbol = Contract.Base(function(arg) {
      return ((typeof arg) === "symbol");
    },"typeSymbol");

    this.typeFunction = Contract.Base(function(arg) {
      return ((typeof arg) === "function");
    },"typeFunction");

    /**
     * Constructor Contracts
     **/

    this.TypeOf = Contract.Constructor(function(type) {
      return Contract.Base(function(value) {
        return ((typeof value) === type);
      }, `TypeOf ${type}`);
    }, "TypeOf");

    this.InstanceOf = Contract.Constructor(function(constructor) {
      return Contract.Base(function(object) {
        return (object instanceof constructor); 
      }, `InstanceOf ${constructor.name}`);
    }, "InstanceOf");

    this.Is = Contract.Constructor(function(target) {
      return Contract.Base(function(value) {
        return (value === target); 
      }, `Is ${target}`);
    }, "Is");

    this.Between = Contract.Constructor(function(min, max) {
      return Contract.Base(function(value) {
        return (min <= value) && (value <= max); 
      }, `Between ${min} ${max}`);
    }, "Between");

    this.Length = Contract.Constructor(function(length) {
      return Contract.Base(function(object) {
        return (object.length === length); 
      }, `Length ${legth}`)
    }, "Length");

    /**
     * Specoal Contracts
     **/

    this.Even = (Contract.Constructor(function(Math) {
      return Contract.Base(function(value) {
        return (Math.abs(value) % 2 === 0);
      },"Even");
    }, "Even"))(Math);

    this.Odd = (Contract.Constructor(function(Math) {
      return Contract.Base(function(value) {
        return (Math.abs(value) % 2 === 1);
      },"Odd");
    }, "Odd"))(Math);

    this.Positive = TreatJS.Contract.Base(function(value) {
      return (value > 0);
    },"Positive");

    this.Natural = TreatJS.Contract.Base(function(value) {
      return (value >= 0);
    },"Natural");

    this.Negative = TreatJS.Contract.Base(function(value) {
      return (value < 0);
    },"Negative");

    return this;
  }

  Object.defineProperty(Contracts, "build", {
    value: function(target) {
      return build.apply(target);
    }
  });

  //         _                 
  // _ _ ___| |_ _  _ _ _ _ _  
  //| '_/ -_)  _| || | '_| ' \ 
  //|_| \___|\__|\_,_|_| |_||_|

  /** Return the [[Contract]] objects
  */
  return Contracts; 

})();
