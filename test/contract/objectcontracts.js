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

var obj = {
        x:4711,
        y:function(x) {return (x+1);},
        z:"chacha"
};

var contract = new _.ObjectContract(_.StringMap({
        x:IsNumber,
    y:new _.FunctionContract(_.ObjectContract(_.StringMap({0:GreaterThanZero})), IsNumber),
    z:Any
}));

var test = _.assert(obj, contract);

test["x"];
test["x"] = "4712";
//test["x"];

var f = test["y"];
var v = f(4711);

test["y"] = function(x) {return "chacha";};
var g = test["y"];
//var w = g(4711);
