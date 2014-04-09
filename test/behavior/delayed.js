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
 * _Date: 2014-01-08 15:56:23 +0100 (Wed, 08 Jan 2014) _
 * _Rev: 23677 _
 */


var obj = {a:4711, b:"4712", c:true}

var test = _.assert(
                obj,
                _.AdvancedObjectContract({a:IsNumber, b:IsString, c:IsBoolean}));

test.a;
test.b;
test.c;


var func = function(x,y) {
        return true;
};

var test = _.assert(
                func,
                _.SimpleFunctionContract(IsNumber, IsNumber, IsBoolean, false, false));

test(2,2);
//test("2",2);
//test(2,"2");
