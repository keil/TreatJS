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

// between COntract
var between = Contract.Base(function(arg) {
  return (min < arg) && (arg < max);
},"betwween");

Contract.assert(1, Contract.With({min:0,max:100}, between));

// Between Constructor
var Between = Contract.Constructor( function (min, max) {
  return Contract.Base( function (arg) {
    return (min < arg) && (arg < max);
  }, "Between " + min + "-" + max);
});

var between0_100 = Between.build(0, 100);
Contract.assert(1, between0_100);
