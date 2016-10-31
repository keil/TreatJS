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

TreatJS.package("TreatJS.Conversion", function (TreatJS, Contract, configuration) {


        function convert(subject) {

                if(subject instanceof TreatJS.Prototype.Contract) return subejct;
                else if(subject instanceof TreatJS.Prototype.Constructor) return subejct;
                else {
        

                        if(subject instanceof Function) {
                                return new Contract.Constructor(subject)
                        } else if(subject instanceof Array) {
                                return new Contract.Object(subject);
                        } else if (subject instanceof Object) {
                                return new Contract.Object(subject);
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
