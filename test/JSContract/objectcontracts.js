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

var obj = {
        x:4711,
        y:function(x) {return (x+1);},
        z:"chacha"
};

var contract = new $.ObjectContract({
        x:IsNumber,
    y:new $.FunctionContract($.ObjectContract({0:GreaterThanZero}), IsNumber),
    z:Any
});

var test = $.assert(obj, contract);

test["x"];
test["x"] = "4712";
//test["x"];

var f = test["y"];
var v = f(4711);

test["y"] = function(x) {return "chacha";};
var g = test["y"];
//var w = g(4711);
