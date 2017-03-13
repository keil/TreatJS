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
   * Implivite conversions of contract:
   * [], {}   --> Object Contract
   * x => x   --> Constructor
   * 
   **/


  function convert(target) {

    if(subject instanceof TreatJS.Prototype.Contract) return target;
    else if(subject instanceof TreatJS.Prototype.Constructor) return target;
    else {

      if(subject instanceof Function) {
        return new Contract.Constructor(target)
      } else if(subject instanceof Array) {
        return new Contract.Object(target);
      } else if (subject instanceof Object) {
        return new Contract.Object(target);
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
