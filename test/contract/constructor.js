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

// Test Use-Case #1
// Compare function input with function output

(function() {
        function eqLength() {
                var length;
                var pre = function (preArg) {
                        length = preArg[0].length;
                        return true;
                };
                var post = function (postArg) {
                        return (length==postArg.length);
                };
                return $.FunctionContract($.BaseContract(pre), $.BaseContract(post));
        } 
        var constructor = $.Constructor(eqLength);
        var contract = $.construct(constructor);

        var f = function(list) {
                return Array(7);
        }
        var ff = $.assert(f, contract);
        ff(Array(7));
})();

(function() {
        function eqLength(length) {
                var pre = function (preArg) {
                        return (length==preArg[0].length)
                };
                var post = function (postArg) {
                        return (length==postArg.length);
                };
                return $.FunctionContract($.BaseContract(pre), $.BaseContract(post));
        } 
        var constructor = $.Constructor(eqLength);
        var contract = $.construct(constructor, 7);

        var f = function(list) {
                return Array(7);
        }
        var ff = $.assert(f, contract);
        ff(Array(7));
})();

// Test Use-Case #2
// check some global state, becore and after the call it should be identical


(function() {
        var globalValue1 = "L";

        function eqGlobalValue(print) {
                var value;
                var pre = function (preArg) {
                        value=preArg[0];
                        return true;
                };
                var post = function (postArg) {
                        return (value==postArg);
                };
                return $.FunctionContract($.BaseContract(pre), $.BaseContract(post));
        } 

        var constructor = $.Constructor(eqGlobalValue);
        var contract = $.construct(constructor, print);

        var g = function() {
                globalValue1 = true ? globalValue1 : "X";
        }

        function gg() {
                g();
                return globalValue1;
        }

        var ggg = $.assert(gg, contract);
        ggg(globalValue1);
})();


// 2nd run

(function() {
        var globalValue1 = {x:"L"};;

        function eqGlobalValue(print) {
                var value;
                var pre = function (preArg) {
                        value=preArg[0];
                        return true;
                };
                var post = function (postArg) {
                        return (value==postArg);
                };
                return $.FunctionContract($.BaseContract(pre), $.BaseContract(post));
        } 

        var constructor = $.Constructor(eqGlobalValue);
        var contract = $.construct(constructor, print);

        var g = function() {
                globalValue1 = true ? globalValue1 : {x:"X"};;
        }

        function gg() {
                g();
                return globalValue1;
        }

        var ggg = $.assert(gg, contract);
        ggg(globalValue1);
})();

// 3d run
// NOTE: dosnt work, because no function return and terefore no value to compare
(function() {
        var globalValue1 = {x:"L"};;

        function eqGlobalValue(preValue) {
                var predicate = function (postArg) {
                        return true; (preValue==postValue);
                };
                return $.BaseContract(predicate); 
        }



        var constructor = $.Constructor(eqGlobalValue);
        var contract = $.construct(constructor, globalValue1);

        var g = function() {
                globalValue1 = false ? globalValue1 : {x:"X"};;
        }

        var gg = $.assert(g, $.FunctionContract(Any, $.With({postValue:globalValue1}, contract)));
        gg();
});
(function() {
        var globalValue1 = {x:"L"};;

        function preCons(preValue) {
                var predicate = function (postArg) {
                        return true; (preValue==postValue);
                };
                return $.BaseContract(predicate); 
        }

        var constructor1 = $.Constructor(preCons);

        function postCons(postValue) {
                return $.construct(constructor, globalValue1);
        }

        var constructor2 = $.Constructor(postCons);




        var constructor = $.Constructor(eqGlobalValue);
        var contract = $.construct(constructor, globalValue1);

        var g = function() {
                globalValue1 = false ? globalValue1 : {x:"X"};;
        }

        var gg = $.assert(g, $.FunctionContract(Any, $.With({postValue:globalValue1}, contract)));
        gg();
});


// Test Use-Case #3
// flip state, a call is allowed only once

(function(){
        function callOnce(preArg) {
                var called = false;

                var predicate = function (postArg) {
                        if(called) {
                                return false;
                        } else {
                                called = true;
                                return true;
                        }
                };

                var Any = function() {
                        return true;
                }

                return $.FunctionContract($.BaseContract(predicate), $.BaseContract(Any));
        } 

        var constructor = $.Constructor(callOnce);
        var contract = $.construct(constructor);

        function h() {
        }

        var hh = $.assert(h, contract);
        hh();
        //hh();
})();

// 2nd run

(function(){
        function callOnce(preArg) {
                var called = false;

                var predicate = function (postArg) {
                        if(called) return called;
                        else {
                                called = true;
                                return false;
                        }
                };

                var Any = function() {
                        return true;
                }

                return $.FunctionContract($.Not($.BaseContract(predicate)), $.BaseContract(Any));
        } 

        var constructor = $.Constructor(callOnce);
        var contract = $.construct(constructor);

        function h() {
        }

        var hh = $.assert(h, contract);
        hh();
        // hh();
})();

// Test With

(function() {
        function ContractConstructor(arg) {
                function predicate(arg) {
                        Array;
                        return true;
                }
                return $.BaseContract(predicate);
        } 
        var constructor = $.Constructor(ContractConstructor);
        var contract = $.construct(constructor, undefined);

        $.assert(4711, $.With({Array:Array}, contract));
        //$.assert(4711, contract);
})();
