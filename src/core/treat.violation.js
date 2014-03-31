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

})($);
