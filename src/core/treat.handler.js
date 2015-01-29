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

  function Handler() {
     if(!(this instanceof Handler)) return new Handler();

  }
  Handler.prototype = {};
  Handler.toString = function () { "[Halder]"; };



  // ___     _                         _    _    _  _              _ _         
  //| _ \___| |_  _ _ __  ___ _ _ _ __| |_ (_)__| || |__ _ _ _  __| | |___ _ _ 
  //|  _/ _ \ | || | '  \/ _ \ '_| '_ \ ' \| / _| __ / _` | ' \/ _` | / -_) '_|
  //|_| \___/_|\_, |_|_|_\___/_| | .__/_||_|_\__|_||_\__,_|_||_\__,_|_\___|_|  
  //           |__/              |_|                                           

  function PolymorphicHandler(handler) {
    if(!(this instanceof PolymorphicHandler)) return new PolymorphicHandler(contract, global, handler);
    else Handler.call(this);

    this.get = function(target, name, receiver) {
      handler( _.Callback.Handle(_.Logic.True, _.Logic.False, _.Logic.False));
    };
  }
  PolymorphicHandler.prototype = Object.create(Handler.prototype);

  
  /**
   * export TreatJS Handler
   */

  __define("Handler", {}, _);

  // TODO

  __define("PolymorphicHandler", PolymorphicHandler, _.Handler);

})(TreatJS);
