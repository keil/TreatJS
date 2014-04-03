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

var func = function(x,y,z) {return z;};

var test = $.assert(
                func,
                _.SimpleFunctionContract(true, true));
test(3,4,5);

var test = $.assert(
                func,
                _.SimpleFunctionContract(IsNumber, true, true));
test(3,4,5);
test(3,4,true);

var test = $.assert(
                func,
                _.SimpleFunctionContract(IsNumber, IsBool, true, true));
test(3,4,5);
test(3,4,true);
test(3,"",true);
test("",4,true);


var test = $.assert(
                func,
                _.SimpleFunctionContract(IsNumber, IsNumber, IsBool, true, true));
test(3,4,5);
test(3,4,true);
test(3,"",true);
test("",4,true);


var test = $.assert(
                func,
                _.SimpleFunctionContract(IsNumber, IsNumber, IsBool,,));
test(3,4,5);
test(3,4,true);
test(3,"",true);
test("",4,true);

var test = $.assert(
                func,
                _.AdvancedFunctionContract(_.AdvancedObjectContract(), IsBool));
test(3,4,5);
test(3,4,true);
test(3,"",true);
test("",4,true);

var test = $.assert(
                func,
                _.AdvancedFunctionContract({0:IsArray, 2:IsNumber}, IsNumber));
test(3,4,5);
test(3,4,true);
test(3,"",true);
test("",4,true);

var test = $.assert(
                func,
                _.AdvancedFunctionContract([IsNumber, IsNumber], IsBool));
test(3,4,5);
test(3,4,true);
test(3,"",true);
test("",4,true);
