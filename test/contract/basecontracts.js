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

var x = _.assert(4711, IsNumber);
var x = _.assert("4711", IsString);
var x = _.assert(4711, GreaterThanZero);
var x = _.assert(true, Any);

var obj = {x:4711};

function predicate(arg) {
        return true;
}

var sec = _.assert(obj, _.BaseContract(predicate));
