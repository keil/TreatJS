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

  function Contract() {
    if(!(this instanceof Contract)) return new Contract();
  };

  function Constructor() {
     if(!(this instanceof Constructor)) return new Constructor();
  }
  Constructor.prototype = new Contract();


  
  /**
   * Core Components
   */

  __define("Core", {}, _);

  __define("Contract", Contract, _.Core);
  __define("Constructor", Constructor, _.Core);




  
  /**
   * Evaluation Base
   */

  __define("Base", {}, _);
   // references Function.prototype.toString
  __define("toString", Function.prototype.toString, _.Base);



  // new Base object
//  _.Base = new Object();
  // references Function.prototype.toString
//  _.Base.toString = Function.prototype.toString;

  return _ ;
})(_);
