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

function eqLength(preArg) {

  var predicate = function (postArg) {
    return (preArg.length==postArg.length);
  };

  return Contract.Base(predicate);
} 

var contract = Contract.Dependent(Contract.Constructor(eqLength));

var f = function(list) {
  return Array(7);
}
var ff = Contract.assert(f, contract);
ff(Array(7));
