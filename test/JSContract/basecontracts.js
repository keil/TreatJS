/*
 *  JavaScript Contracts
 *
 * Copyright (c) 2014, Proglang, University of Freiburg.
 *  http://proglang.informatik.uni-freiburg.de/
 * All rights reserved.
 *
 * Author Matthias Keil
 *  http://www.informatik.uni-freiburg.de/~keilr/
 *
 * $Date: 2014-01-08 15:56:23 +0100 (Wed, 08 Jan 2014) $
 * $Rev: 23677 $
 */

var x = $.assert(4711, IsNumber);
var x = $.assert("4711", IsString);
var x = $.assert(4711, GreaterThanZero);
var x = $.assert(true, Any);

var obj = {x:4711};

function predicate(arg) {
        return true;
}

var sec = $.assert(obj, $.BaseContract(predicate));
