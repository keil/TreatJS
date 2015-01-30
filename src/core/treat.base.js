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

  function Constructor() {
    if(!(this instanceof Constructor)) return new Constructor();
  }
  Constructor.prototype = Object.create(Contract.prototype);

  // define empty build and ctor function
  // TODO, is this step still required ?
  // Constructor.prototype.build = (function () {});
  // Constructor.prototype.ctor = (function () {});

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Core", {});
  TreatJS.define(TreatJS.Core, "Contract", Contract);
  TreatJS.define(TreatJS.Core, "Constructor", Constructor);


})(TreatJS);
