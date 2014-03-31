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

        _.Config = new Object();

        //             _                 
        //__ _____ _ _| |__  ___ ___ ___ 
        //\ V / -_) '_| '_ \/ _ (_-</ -_)
        // \_/\___|_| |_.__/\___/__/\___|

        _.Config.Verbose = new Object();

        // prints sandbox states
        _.Config.Verbose.sandbox = true;










        // ___ _ _ _ _ ___ _ _ 
        /// -_) '_| '_/ _ \ '_|
        //\___|_| |_| \___/_|  

        // print stack trace on error
        _.Config.stack = true;

        //               _    _     
        // ___ _ _  __ _| |__| |___ 
        /// -_) ' \/ _` | '_ \ / -_)
        //\___|_||_\__,_|_.__/_\___|

        // contract assertion
        _.Config.assertion = true;

        // pass-through of native functions
        _.Config.nativePassThrough = true;

        // eval with sandbox membrane
        _.Config.disableMembrane = false;

        //               _     
        // _ __  ___  __| |___ 
        //| '  \/ _ \/ _` / -_)
        //|_|_|_\___/\__,_\___|

        // use newGlobal in sandbox
        _.Config.newGlobal = false;

})(_);
