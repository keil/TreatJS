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

// load libraries
load("lib/lib_padding.js");
//load("lib/lib_harmony_weakmap.js");
//load("lib/lib_apache_assert.js");

// load system
load("system.js");

// load JavaScript Contract 
load("src/JSContract/jscontract.base.js");
load("src/JSContract/jscontract.config.js");
load("src/JSContract/jscontract.violation.js");
load("src/JSContract/jscontract.sandbox.js");
load("src/JSContract/jscontract.callback.js");
load("src/JSContract/jscontract.contract.js");



//////////////////////////////////////////////////
// TEST
//////////////////////////////////////////////////

// some predefined contracts
load("test/JSContract/contracts.js");

// contract tests
if(false) {

        load("test/JSContract/basecontracts.js");
        load("test/JSContract/functioncontracts.js");
        load("test/JSContract/objectcontracts.js");

        load("test/JSContract/andcontract.js");
        load("test/JSContract/orcontract.js");
        load("test/JSContract/notcontract.js");

        load("test/JSContract/withcontract.js");
        load("test/JSContract/dependentcontracts.js");
        load("test/JSContract/constructor.js");

        // sandbox tests
        load("test/JSContract/sandbox.js");
        load("test/JSContract/bind.js");
}

//load("test/JSContract/dependentcontracts.js");
//load("test/JSContract/constructor.js");

var a = new Array();
a[0] = undefined;
a[1] = 5;

print(a.length);

print(typeof (new Array(2)));

//print(!(undefined>4));

function fff() {
        //return false;
        return {};
        return null;
}

if(fff()) {
        print ("true");
} else {
        print ("false");
}

print("20" < "4");

x= {};
x[undefined] = 4;
print(x[undefined] );


/*

function BigInteger() {
        this.x=4711;
}

var i = new BigInteger();

function Handler() {
                this.apply = function(target, thisArg, args) {
                        return target.apply(thisArg, args);  
                };
                this.construct = function(target, args) {
                        __sysout("X");
                        var obj = Object.create(target.prototype);
                        //return this.apply(target, thisArg, args);
                         this.apply(target, obj, args);
                         return obj;
                };
        }





var BigIntegerP = new Proxy(BigInteger, new Handler());

var i = new BigIntegerP();
print(i instanceof BigInteger);
print(i instanceof BigIntegerP);

*/

print("\n\n#####\n\n")

function f(x) {
  print("@" + x);
  if(x!=0) f(x-1);
}

f(4);

var x = $.Constructor(f);
print("???" + (x instanceof $.ContractPrototype));


(function() {
        var obj = {next:null, val:4711};
        obj.next = obj;

        print("$" + obj.val);
        print("$" + obj.next.val);

        // Contract C := [next:C,val:IsNumber]

        //var C = $.ObjectContract({next:???,val:IsNumber});

       /* function cons() {
                var IsNumber = $.BaseContract(function(arg) {
                        return ((typeof arg) === "number");
                },"IsNumber");
                //return $.ObjectContract({val:IsNumber,next:$.construct($.Constructor(cons))}); // too much recursion 
                return $.ObjectContract({val:IsNumber,next:$.Constructor(cons)});
        }*/
        var constructor = $.Constructor(function cons() {
                var IsNumber = $.BaseContract(function(arg) {
                        return ((typeof arg) === "number");
                },"IsNumber");
                //return $.ObjectContract({val:IsNumber,next:$.construct($.Constructor(cons))}); // too much recursion 
                return $.ObjectContract({val:IsNumber,next:$.Constructor(cons)});
        }
);
        var contract = $.construct(constructor);

        objP = $.assert(obj, contract);
       
        //print("&" + objP.val);
        print("&" + objP.next.next.next.val);

})();





quit();
