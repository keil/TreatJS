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

  // TreatJS Core Constructor
  //var Constructor = TreatJS.Core.Constructor;

  //  _____                _                   _             
  // / ____|              | |                 | |            
  //| |     ___  _ __  ___| |_ _ __ _   _  ___| |_ ___  _ __ 
  //| |    / _ \| '_ \/ __| __| '__| | | |/ __| __/ _ \| '__|
  //| |___| (_) | | | \__ \ |_| |  | |_| | (__| || (_) | |   
  // \_____\___/|_| |_|___/\__|_|   \__,_|\___|\__\___/|_|   

  //  ___             _               _           
  // / __|___ _ _  __| |_ _ _ _  _ __| |_ ___ _ _ 
  //| (__/ _ \ ' \(_-<  _| '_| || / _|  _/ _ \ '_|
  // \___\___/_||_/__/\__|_|  \_,_\__|\__\___/_|  

  function Constructor(constructor, name, binding) { // TODO, bindings deprecated 
    if(!(this instanceof Constructor)) return new Constructor(constructor, name, binding);
    else TreatJS.Core.Constructor.apply(this);

    if(!(constructor instanceof Function))
      error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "constructor": {
        value: constructor
      },
      "name": {
        value: name
      },
      "binding": {
        value: binding
      }
    });
  }
  Constructor.prototype = Object.create(TreatJS.Core.Constructor.prototype);
  Constructor.prototype.toString = function() {
    return (this.name!=undefined) ? "##"+this.name : "[[TreatJS/Constructor]]";
  };

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Constructor", {});

  TreatJS.define(TreatJS.Constructor, "Constructor", Constructor);

})(TreatJS);
