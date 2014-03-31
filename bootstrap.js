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
load("src/treat.js");
load("test/contracts.js");

var m = new Array();

m["/cha*/"] =  4711;

print(m.length);



/*(


m[0] = 567;

*/

/*

print("#" + m);



print(m[/cha/]);



function Mapping() {

        var keys = new Array();
        var contracts = new Array();


        this.push = function(identifier, contract) {

                // TODO typeof contract
                // typeod regex/ tring / number

                var index = keys.push(identifier);
                contracts[index] = contract;
                return index;

        }

        this.foreach = function (callback) {
        
        
        }

        // foreach
        // return all mathcing

    

}

var m = new Mapping();
m.push("a", 4711);
m.push("aa", 4712);
m.push("b", 4713);


*/


quit();
