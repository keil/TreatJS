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

// typeOf Base Contract
var typeOf = Contract.Base(function (arg) {
  return ((typeof arg) === type);
}, "typeOf");

Contract.assert(1, Contract.With({type:"number"}, typeOf));

// TypeOf Constructor
var TypeOf = Contract.Constructor( function ( type ) {
  return Contract.Base(function (arg) {
    return ((typeof arg) === type);
  }, "typeOf " + type);
});

var typeOfNumber = TypeOf.build("number");

Contract.assert(1, typeOfNumber);
