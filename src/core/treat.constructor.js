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

  var error = TreatJS.error;
  var violation = TreatJS.violation;
  var blame = TreatJS.blame;

  var Constructor = TreatJS.Core.Constructor;

  //  _____                _                   _             
  // / ____|              | |                 | |            
  //| |     ___  _ __  ___| |_ _ __ _   _  ___| |_ ___  _ __ 
  //| |    / _ \| '_ \/ __| __| '__| | | |/ __| __/ _ \| '__|
  //| |___| (_) | | | \__ \ |_| |  | |_| | (__| || (_) | |   
  // \_____\___/|_| |_|___/\__|_|   \__,_|\___|\__\___/|_|   

  function ContractConstructor(constructor, /*binding,*/ name) {
    if(!(this instanceof ContractConstructor)) return new ContractConstructor(constructor, /*binding,*/ name);

    if(!(constructor instanceof Function)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "constructor": {
        value: constructor
      },
      "name": {
        value: name
      },
//      "binding": {
//        value: binding
//      },
      "build": {
        value: function() {
          return TreatJS.construct(this, arguments);
        }
      },
      "ctor": {
        value: TreatJS.construct.bind(this)
      }
    });
  }
  ContractConstructor.prototype = Object.create(Constructor.prototype);
  ContractConstructor.prototype.toString = function() {
    return "[*" + ((this.name!=undefined) ? this.name : this.constructor.toString()) + "*]";
  };

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Constructor", {});

  TreatJS.define(TreatJS.Constructor, "Constructor", ContractConstructor);

})(TreatJS);
