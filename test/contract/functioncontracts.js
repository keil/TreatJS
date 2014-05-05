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

var func        = function(x) {return 4711;}
var func2       = function(x) {return "chacha";}
var func3       = function(x, y) { return (x+y);}

var test = _.assert(
                func,
                _.FunctionContract(_.ObjectContract(_.Map.StringMap({0:IsNumber})), IsNumber)
                );

var test2 = _.assert(
                func2,
                _.FunctionContract(Any, IsString)
                );

var test3 = _.assert(
                func3,
                _.FunctionContract(_.ObjectContract(_.Map.StringMap({0:IsNumber, 1:IsNumber})), IsNumber)
                );

test(4711);
test2("chacha");
test3(4711, 4712);


var f = function (a, b) {
        return (a>b);
}

//g = _.assert(f, _.FunctionContract({0:IsNumber, 1:IsNumber}, IsBoolean));
//g = _.assert(f, _.SFunctionContract(IsNumber, IsNumber, IsBoolean));

//g(1,2);
//g(2,1);
//g("a", 1);
//g(1, "a");
//g(1, true);

