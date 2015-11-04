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

  //  _____            _                  _       
  // / ____|          | |                | |      
  //| |     ___  _ __ | |_ _ __ __ _  ___| |_ ___ 
  //| |    / _ \| '_ \| __| '__/ _` |/ __| __/ __|
  //| |___| (_) | | | | |_| | | (_| | (__| |_\__ \
  // \_____\___/|_| |_|\__|_|  \__,_|\___|\__|___/

  function Contract() {
    if(!(this instanceof Contract)) return new Contract();
  };
  Contract.prototype = {};
  Contract.prototype.toString = function() {
    return '[[TreatJS/Contract]]'; 
  };
  Contract.prototype.assert = function(value) {
    return TreatJS.assert(value, this);
  };

  function DelayedContract() {
    if(!(this instanceof DelayedContract)) return new DelayedContract();
  }
  DelayedContract.prototype = Object.create(Contract.prototype);
  DelayedContract.prototype.toString = function() {
    return '[[TreatJS/DelayedContract]]';
  };

  function ImmediateContract() {
    if(!(this instanceof ImmediateContract)) return new ImmediateContract();
  }
  ImmediateContract.prototype = Object.create(Contract.prototype);
  ImmediateContract.prototype.toString = function() {
    return '[[TreatJS/ImmediateContract]]';
  };

  function CombinatorContract() {
    if(!(this instanceof CombinatorContract)) return new CombinatorContract();
  }
  CombinatorContract.prototype = Object.create(Contract.prototype);
  CombinatorContract.prototype.toString = function() {
    return '[[TreatJS/CombinatorContract]]';
  };

  function WrapperContract() {
    if(!(this instanceof WrapperContract)) return new WrapperContract();
  }
  WrapperContract.prototype = Object.create(Contract.prototype);
  WrapperContract.prototype.toString = function() {
    return '[[TreatJS/WrapperContract]]';
  };

  function Constructor() {
    if(!(this instanceof Constructor)) return new Constructor();
  }
  Constructor.prototype = Object.create(DelayedContract.prototype); // TODO, why delayed ?
  Constructor.prototype.toString = function() {
    return '[[TreatJS/Constructor]]';
  };
  Constructor.prototype.construct = function() {
    // construct ( constructor[, arg0[, arg1[, ...]]] )
    var args = Array.prototype.slice.call(arguments, 0);
    args.unshift(this);
    return TreatJS.construct.apply(TreatJS, args);
  }

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Core", {});

  TreatJS.define(TreatJS.Core, "Contract", Contract);

  TreatJS.define(TreatJS.Core, "Immediate", ImmediateContract);
  TreatJS.define(TreatJS.Core, "Delayed", DelayedContract);
  TreatJS.define(TreatJS.Core, "Combinator", CombinatorContract);
  TreatJS.define(TreatJS.Core, "Wrapper", WrapperContract);

  TreatJS.define(TreatJS.Core, "Constructor", Constructor);

})(TreatJS);
