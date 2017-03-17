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

TreatJS.package("TreatJS.Conversion", function (TreatJS, Contract, Configuration, Realm) {

  /**
   * Converts an input value to a contract.
   **/

  function toContract(target) {

    if(target instanceof TreatJS.Prototype.Contract) return target;
    else {

      if(subject instanceof Function) {
        return new Contract.Base(target);
      } else if(subject instanceof Array) {
        return new Contract.Object(target);
      } else if (subject instanceof Object) {
        return new Contract.Object(target);
      } else {
        throw new TypeError("Invalid contract.");
      }
    }
  }


  /**
   * Converts an input value to a constructor.
   **/

  function toConstructor(target) {

    if(subject instanceof TreatJS.Prototype.Constructor) return target;
    else {

      if(subject instanceof Function) {
        return new Contract.Constructor(target);
      } else {
        throw new TypeError("Invalid contract.");
      }
    }
  }

  // _____ ___ __  ___ _ _| |_ 
  /// -_) \ / '_ \/ _ \ '_|  _|
  //\___/_\_\ .__/\___/_|  \__|
  //        |_|                

  TreatJS.export({
    convert: convert
  });

  //         _                 
  // _ _ ___| |_ _  _ _ _ _ _  
  //| '_/ -_)  _| || | '_| ' \ 
  //|_| \___|\__|\_,_|_| |_||_|

  return {
    convert: convert
  };

});
