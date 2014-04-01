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

// Test Use-Case #1
// Compare function input with function output

function eqLength(preArg) {

        var predicate = function (postArg) {
                return (preArg[0].length==postArg.length);
        };

        return $.BaseContract(predicate);
} 

var contract = $.DependentContract($.Constructor(eqLength));

var f = function(list) {
        return Array(7);
}
var ff = $.assert(f, contract);
ff(Array(7));


// Test Use-Case #2
// check some global state, becore and after the call it should be identical

var globalValue1 = "L";

function eqGlobalValue(preArg) {
        var predicate = function (postArg) {
                return (preArg[0]==postArg);
        };

        return $.BaseContract(predicate);
} 

var contract = $.DependentContract($.Constructor(eqGlobalValue));

var g = function() {
        globalValue1 = true ? globalValue1 : "X";
}

function gg() {
        g();
        return globalValue1;
}

var ggg = $.assert(gg, $.With({print:print},contract));
ggg(globalValue1);

// 2nd run
//
var globalValue1 = {x:"L"};

function eqGlobalValue2(preArg) {
        globalValue1;
        var predicate = function (postArg) {
                return (preArg[0]==postArg);
        };

        return $.BaseContract(predicate);
} 

var contract2 = $.DependentContract($.Constructor(eqGlobalValue2));

var g2 = function() {
        globalValue1 = true ? globalValue1 : {x:"X"};
}

function gg2() {
        g2();
        return globalValue1;
}

var ggg2 = $.assert(gg2, $.With({print:print,globalValue1:globalValue1},contract));
ggg2(globalValue1);

// Test Use-Case #3
// flip state, a call is allowed only once

function callOnce(preArg) {

        var called = false;

        var predicate = function (postArg) {
                print("@@@ " + called);
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
        //return $.BaseContract(predicate);
} 

var contract = $.DependentContract($.Constructor(callOnce));

function h() {
}

function hh() {
        return h;
}

var hhh = $.assert(hh, $.With({print:print},contract));
hhhh = hhh();
hhhh();
//hhhh();

// 2nd run
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
        //return $.BaseContract(predicate);
} 

var contract = $.DependentContract($.Constructor(callOnce));

function h() {
}

function hh() {
        return h;
}

var hhh = $.assert(hh, $.With({print:print},contract));
hhhh = hhh();
hhhh();
//hhhh();
