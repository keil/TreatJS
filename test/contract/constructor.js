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
                return _.FunctionContract(_.BaseContract(pre), _.BaseContract(post));
        } 
        var constructor = _.Constructor(eqLength);
        var contract = _.construct(constructor);

        var f = function(list) {
                return Array(7);
        }
        var ff = _.assert(f, contract);
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
                return _.FunctionContract(_.BaseContract(pre), _.BaseContract(post));
        } 
        var constructor = _.Constructor(eqLength);
        var contract = _.construct(constructor, 7);

        var f = function(list) {
                return Array(7);
        }
        var ff = _.assert(f, contract);
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
                return _.FunctionContract(_.BaseContract(pre), _.BaseContract(post));
        } 

        var constructor = _.Constructor(eqGlobalValue);
        var contract = _.construct(constructor, print);

        var g = function() {
                globalValue1 = true ? globalValue1 : "X";
        }

        function gg() {
                g();
                return globalValue1;
        }

        var ggg = _.assert(gg, contract);
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
                return _.FunctionContract(_.BaseContract(pre), _.BaseContract(post));
        } 

        var constructor = _.Constructor(eqGlobalValue);
        var contract = _.construct(constructor, print);

        var g = function() {
                globalValue1 = true ? globalValue1 : {x:"X"};;
        }

        function gg() {
                g();
                return globalValue1;
        }

        var ggg = _.assert(gg, contract);
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
                return _.BaseContract(predicate); 
        }



        var constructor = _.Constructor(eqGlobalValue);
        var contract = _.construct(constructor, globalValue1);

        var g = function() {
                globalValue1 = false ? globalValue1 : {x:"X"};;
        }

        var gg = _.assert(g, _.FunctionContract(Any, _.With({postValue:globalValue1}, contract)));
        gg();
});
(function() {
        var globalValue1 = {x:"L"};;

        function preCons(preValue) {
                var predicate = function (postArg) {
                        return true; (preValue==postValue);
                };
                return _.BaseContract(predicate); 
        }

        var constructor1 = _.Constructor(preCons);

        function postCons(postValue) {
                return _.construct(constructor, globalValue1);
        }

        var constructor2 = _.Constructor(postCons);




        var constructor = _.Constructor(eqGlobalValue);
        var contract = _.construct(constructor, globalValue1);

        var g = function() {
                globalValue1 = false ? globalValue1 : {x:"X"};;
        }

        var gg = _.assert(g, _.FunctionContract(Any, _.With({postValue:globalValue1}, contract)));
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

                return _.FunctionContract(_.BaseContract(predicate), _.BaseContract(Any));
        } 

        var constructor = _.Constructor(callOnce);
        var contract = _.construct(constructor);

        function h() {
        }

        var hh = _.assert(h, contract);
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

                return _.FunctionContract(_.Not(_.BaseContract(predicate)), _.BaseContract(Any));
        } 

        var constructor = _.Constructor(callOnce);
        var contract = _.construct(constructor);

        function h() {
        }

        var hh = _.assert(h, contract);
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
                return _.BaseContract(predicate);
        } 
        var constructor = _.Constructor(ContractConstructor);
        var contract = _.construct(constructor, undefined);

        _.assert(4711, _.With({Array:Array}, contract));
        //_.assert(4711, contract);
})();
