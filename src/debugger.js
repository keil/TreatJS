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

function TreatJSDebugger() {
        if(!(this instanceof TreatJSDebugger)) return new TreatJSDebugger();

        this.catch = function(result) {
        }
}

function TreatJSDebuggerUnit() {
        if(!(this instanceof TreatJSDebugger)) return new TreatJSDebugger();

        var stack = new Array();

        this.catch = function(result) {
                stack.push(result);
        }

        this.assertTrue = function() {
                var result = stack.pop();

                if(result!==undefined && result!==true) {
                        print(new Error().stack);
                        quit();
                }

                this.clear();
        }

        this.asserFalse = function() {
                var result = stack.pop();

                if(result!==false) {
                        print(new Error().stack);
                        quit();
                }

                this.clear();
        }

        this.clear = function() {
                while(stack.length > 0) {
                        stack.pop();
                }
        }
}
TreatJSDebuggerUnit.prototype = new TreatJSDebugger();
