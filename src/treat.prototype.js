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

TreatJS.package("TreatJS.Prototype", function(TreatJS, Contract, configuration) {

  //  ___         _               _   
  // / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| (__/ _ \ ' \  _| '_/ _` / _|  _|
  // \___\___/_||_\__|_| \__,_\__|\__|

  function Contract() {
    if(!(this instanceof Contract)) return new Contract();
  };
  Contract.prototype = Object.create({});
  Contract.prototype.constructor = Contract;
  Contract.prototype.toString = function() {
    return '[[TreatJS/Contract]]'; 
  };

  // ___      _                  _    ___         _               _   
  //|   \ ___| |__ _ _  _ ___ __| |  / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| |) / -_) / _` | || / -_) _` | | (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___/\___|_\__,_|\_, \___\__,_|  \___\___/_||_\__|_| \__,_\__|\__|
  //                 |__/                                             

  function DelayedContract() {
    if(!(this instanceof DelayedContract)) return new DelayedContract();
  }
  DelayedContract.prototype = Object.create(Contract.prototype);
  DelayedContract.prototype.constructor = DelayedContract;
  DelayedContract.prototype.toString = function() {
    return '[[TreatJS/Delayed]]';
  };

  // ___                    _ _      _          ___         _               _   
  //|_ _|_ __  _ __  ___ __| (_)__ _| |_ ___   / __|___ _ _| |_ _ _ __ _ __| |_ 
  // | || '  \| '  \/ -_) _` | / _` |  _/ -_) | (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___|_|_|_|_|_|_\___\__,_|_\__,_|\__\___|  \___\___/_||_\__|_| \__,_\__|\__|

  function ImmediateContract() {
    if(!(this instanceof ImmediateContract)) return new ImmediateContract();
  }
  ImmediateContract.prototype = Object.create(Contract.prototype);
  ImmediateContract.prototype.constructor = ImmediateContract;
  ImmediateContract.prototype.toString = function() {
    return '[[TreatJS/Immediate]]';
  };

  //  ___             _               _              ___         _               _   
  // / __|___ _ _  __| |_ _ _ _  _ __| |_ ___ _ _   / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| (__/ _ \ ' \(_-<  _| '_| || / _|  _/ _ \ '_| | (__/ _ \ ' \  _| '_/ _` / _|  _|
  // \___\___/_||_/__/\__|_|  \_,_\__|\__\___/_|    \___\___/_||_\__|_| \__,_\__|\__|

  function ConstructorContract() {
    if(!(this instanceof ConstructorContract)) return new ConstructorContract();
  }
  ConstructorContract.prototype = Object.create(Contract.prototype);
  ConstructorContract.prototype.constructor = ConstructorContract;
  ConstructorContract.prototype.toString = function() {
    return '[[TreatJS/Constructor]]';
  };

  //         _                 
  // _ _ ___| |_ _  _ _ _ _ _  
  //| '_/ -_)  _| || | '_| ' \ 
  //|_| \___|\__|\_,_|_| |_||_|

  return {
    Contract:     Contract,
    Immediate:    ImmediateContract,
    Delayed:      DelayedContract,
    Constructor:  ConstructorContract
  };

});
