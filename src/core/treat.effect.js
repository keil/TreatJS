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

  // TreatJS Output
  var logoutput = TreatJS.output;

  // Temporal Effect
  var Effect = TreatJS.Temporal.Effect;

  /** log(msg)
   * @param msg String message
   */ 
  function log(msg, target) {
    if(TreatJS.Verbose.internal) {
      logoutput.log(logoutput.INTERNAL, msg, target);
    }
  }

  // ______  __  __          _       
  //|  ____|/ _|/ _|        | |      
  //| |__  | |_| |_ ___  ___| |_ ___ 
  //|  __| |  _|  _/ _ \/ __| __/ __|
  //| |____| | | ||  __/ (__| |_\__ \
  //|______|_| |_| \___|\___|\__|___/                               

  //  ___     _   
  // / __|___| |_ 
  //| (_ / -_)  _|
  // \___\___|\__|

  function Get(target, id, property) {
    if(!(this instanceof Get)) return new Get(target, id, property);
    else Effect.call(this, target, id);

    if(!(typeof property === 'string'))
      error("Invalid target object", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, { 
      "property": {
        value: property
      }
    });
  }
  Get.prototype = Object.create(Effect.prototype);
  Get.prototype.toString = function() {
    return "Get(" + this.id + ", " + this.property + ")"; 
  }

  // ___      _   
  /// __| ___| |_ 
  //\__ \/ -_)  _|
  //|___/\___|\__|

  function Set(target, id, property) {
    if(!(this instanceof Set)) return new Set(target, id, property);
    else Effect.call(this, target, id);

    if(!(typeof property === 'string'))
      error("Invalid target object", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "property": {
        value: property
      }
    });
  }
  Set.prototype = Object.create(Effect.prototype);
  Set.prototype.toString = function() {
    return "Set(" + this.id + ", " + this.property + ")"; 
  }

  //  ___      _ _ 
  // / __|__ _| | |
  //| (__/ _` | | |
  // \___\__,_|_|_|

  function Call(target, id) {
    if(!(this instanceof Call)) return new Call(target, id);
    else Effect.call(this, target, id);
  }
  Call.prototype = Object.create(Effect.prototype);
  Call.prototype.toString = function() {
    return "Call(" + this.id + ")";
  }

  // ___     _                 
  //| _ \___| |_ _  _ _ _ _ _  
  //|   / -_)  _| || | '_| ' \ 
  //|_|_\___|\__|\_,_|_| |_||_|

  function Return(target, id) {
    if(!(this instanceof Return)) return new Return(target, id);
    else Effect.call(this, target, id);
  }
  Return.prototype = Object.create(Effect.prototype);
  Return.prototype.toString = function() {
    return "Return(" + this.id + ")";
  }

  //  ___             _               _   
  // / __|___ _ _  __| |_ _ _ _  _ __| |_ 
  //| (__/ _ \ ' \(_-<  _| '_| || / _|  _|
  // \___\___/_||_/__/\__|_|  \_,_\__|\__|

  function Construct(target, id) {
    if(!(this instanceof Construct)) return new Construct(target, id);
    else Effect.call(this, target, id);
  }
  Construct.prototype = Object.create(Effect.prototype);
  Construct.prototype.toString = function() {
    return "Construct(" + this.id + ")";
  }
  // ___                 _   _          
  //| __|_ ____ ___ _ __| |_(_)___ _ _  
  //| _|\ \ / _/ -_) '_ \  _| / _ \ ' \ 
  //|___/_\_\__\___| .__/\__|_\___/_||_|
  //               |_|                  

  function Exception(target, id) {
    if(!(this instanceof Exception)) return new Exception(target, id);
    else Effect.call(this, target, id);
  }
  Exception.prototype = Object.create(Effect.prototype);
  Exception.prototype.toString = function() {
    return "Exception(" + this.id + ")";
  }

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Effect", {});

  // Effects
  TreatJS.define(TreatJS.Effect, "Get", Get);
  TreatJS.define(TreatJS.Effect, "Set", Set);
  TreatJS.define(TreatJS.Effect, "Call", Call);
  TreatJS.define(TreatJS.Effect, "Return", Return);
  TreatJS.define(TreatJS.Effect, "Construct", Construct);
  TreatJS.define(TreatJS.Effect, "Execption", Exception);

})(TreatJS);
