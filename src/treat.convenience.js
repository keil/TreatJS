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

TreatJS.package("TreatJS.Convenience", function (TreatJS, Contract, configuration) {

  // __  __     _   _            _  ___         _               _   
  //|  \/  |___| |_| |_  ___  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
  //| |\/| / -_)  _| ' \/ _ \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_|  |_\___|\__|_||_\___/\__,_|\___\___/_||_\__|_| \__,_\__|\__|

    function MethodContract(target, domain, range) {
    if(!(this instanceof MethodContract)) return new MethodContract(target, domain, range);
    else TreatJS.Prototype.Delayed.apply(this);

    // TODO
    if(domain instanceof Array)
      domain = new ObjectContract(domain);

    if(!(target instanceof TreatJS.Prototype.Contract))
      throw new TypeError("Invalid contract.");
    if(!(domain instanceof TreatJS.Prototype.Contract))
      throw new TypeError("Invalid contract.");
    if(!(range instanceof TreatJS.Prototype.Contract))
      throw new TypeError("Invalid contract.");

    Object.defineProperties(this, {
      "target": {
        value: target
      },
      "domain": {
        value: domain
      },
      "range": {
        value: range
      }
    });
  }
  MethodContract.prototype = Object.create(TreatJS.Prototype.Delayed.prototype);
  MethodContract.prototype.constructor = FunctionContract;
  MethodContract.prototype.toString = function() {
    return "(" + this.domain.toString() + " -> " + this.range.toString() + "|" | this.target.toString(); + ")";
  }; 



  // ___     _                      _   _          ___         _               _   
  //|_ _|_ _| |_ ___ _ _ ___ ___ __| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  // | || ' \  _/ -_) '_(_-</ -_) _|  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___|_||_\__\___|_| /__/\___\__|\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|
 
  function ImmediateIntersectionContract(left, right) { 
    if(!(this instanceof ImmediateIntersectionContract)) return new ImmediateIntersectionContract(left, right);
    else TreatJS.Prototype.Immediate.apply(this);

    if(!(left instanceof TreatJS.Prototype.Immediate))
      throw new TypeError("Invalid contract.");
    if(!(right instanceof TreatJS.Prototype.Immediate))
      throw new TypeError("Invalid contract.");

    Object.defineProperties(this, {
      "left": {
        value: left
      },
      "right": {
        value: right
      }
    });
  }
  ImmediateIntersectionContract.prototype = Object.create(TreatJS.Prototype.Immediate.prototype);
  ImmediateIntersectionContract.prototype.constructor = ImmediateIntersectionContract;
  ImmediateIntersectionContract.prototype.toString = TreatJS.Contract.Intersection.prototype.toString;
  ImmediateIntersectionContract.from = TreatJS.Contract.Intersection.from;



  
  // Method Contract
  // intersection between function and object
  //
  //

  // All others are only shoutcuts
  // and type confertinv constructores
  //
  








  //                        _         _ _        
  //  __ __ _ _ _  ___ _ _ (_)__ __ _| (_)______ 
  // / _/ _` | ' \/ _ \ ' \| / _/ _` | | |_ / -_)
  // \__\__,_|_||_\___/_||_|_\__\__,_|_|_/__\___|






    // _____ ___ __  ___ _ _| |_ 
    /// -_) \ / '_ \/ _ \ '_|  _|
    //\___/_\_\ .__/\___/_|  \__|
    //        |_|                

    TreatJS.export({
      Method:  MethodContract,
      ImmediateIntersection: ImmediateIntersectionContract
    });

    //         _                 
    // _ _ ___| |_ _  _ _ _ _ _  
    //| '_/ -_)  _| || | '_| ' \ 
    //|_| \___|\__|\_,_|_| |_||_|

    return {
      Method:  MethodContract,
      ImmediateIntersection:  ImmediateIntersectionContract,
    };









  });
