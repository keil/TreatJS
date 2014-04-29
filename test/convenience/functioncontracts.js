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

var func = function(x,y,z) {return z;};

//var test = _.assert(
//                func,
//                _.SimpleFunctionContract(true, true));
//test(3,4,5);

(function() {

        var test = _.assert(
                func,
                _.SimpleFunctionContract(IsNumber, true, true));
        test("3",4,5);
        test("3",4,true);

})();
(function() {

        var test = _.assert(
                func,
                _.SimpleFunctionContract(IsNumber, IsBoolean, true, true));
        //test(3,4,5);
        test("3",4,true);
        test("3","",true);
        //test("",4,true);

})();
(function() {


        var test = _.assert(
                func,
                _.SimpleFunctionContract(IsNumber, IsNumber, IsBoolean, true, true));
        //test(3,4,5);
        test("3","4",true);
        test(3,"",true);
        //test("",4,true);

})();
(function() {

        var test = _.assert(
                func,
                _.SimpleFunctionContract(IsNumber, IsNumber, IsBoolean, false, false));
        //test(3,4,5);
        test(3,4,true);
        //test(3,"",true);
        //test("",4,true);

})();



(function() {

        var test = _.assert(
                func,
                _.AdvancedFunctionContract(_.AdvancedObjectContract(), IsBoolean));
        //test(3,4,5);
        test(3,4,true);
        test(3,"",true);
        test("",4,true);

})();


(function() {

        var test = _.assert(
                func,
                _.AdvancedFunctionContract({0:IsNumber, 3:IsString}, IsBoolean));
        //test(3,4,5);
        //test(3,4,true);
        //test(3,"",true);
        //test("",4,true);

})();
(function() {

        var test = _.assert(
                func,
                _.AdvancedFunctionContract([IsNumber, IsNumber], IsBoolean));
        //test(3,4,5);
        test(3,4,true);
        //test(3,"",true);
        //test("",4,true);

})();
