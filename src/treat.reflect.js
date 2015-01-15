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

  var ReflectionContract = _.Reflection;

  //  ___     _   
  // / __|___| |_ 
  //| (_ / -_)  _|
  // \___\___|\__|

  function GetContract(contract) {
    if(!(this instanceof GetContract)) return new GetContract(contract);
    ReflectionContract.call(this, "get", contract);
  }
  GetContract.prototype = Object.create(ReflectionContract.prototype);

  // ___      _   
  /// __| ___| |_ 
  //\__ \/ -_)  _|
  //|___/\___|\__|

  function SetContract(contract) {
    if(!(this instanceof SetContract)) return new SetContract(contract);
    ReflectionContract.call(this, "set", contract);
  }
  SetContract.prototype = Object.create(ReflectionContract.prototype);

  /**
   * Reflection Contracts
   */

  __define("Reflect", {}, _);

  __define("Get", GetContract, _.Reflect);
  __define("Set", SetContract, _.Reflect);

})(TreatJS);
