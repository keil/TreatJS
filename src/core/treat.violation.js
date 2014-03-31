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
(function(_) {

        // ______                     
        //|  ____|                    
        //| |__   _ __ _ __ ___  _ __ 
        //|  __| | '__| '__/ _ \| '__|
        //| |____| |  | | | (_) | |   
        //|______|_|  |_|  \___/|_|   

        function error(msg, file, line) {
                __sysout("Error (" + file + ":" + line + "):\n" + msg);
                if($.Config.stack) __sysout(new Error().stack);
                quit();

        }

        function violation(msg, file, line) {
                __sysout("Violation: (" + file + ":" + line + "):\n" + msg);
                if($.Config.stack) __sysout(new Error().stack);
                quit();
        }

        function blame(contract, msg, file, line) {
                __sysout("Violation: (" + file + ":" + line + "):\n" + msg);
                __sysout("Violated Contract: " + contract.toString());
                if($.Config.stack) __sysout(new Error().stack);
                quit();
        }

        _.error = error;
        _.violation = violation;
        _.blame = blame;

})(_);
