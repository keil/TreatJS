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

        var Config = new Object();
        Object.defineProperties(_, {
                "Config": {
                        get: function () {
                                return Config;
                        }
                }});

        var Verbose = new Object();
        Object.defineProperties(Config, {
                "Verbose": {
                        get: function () {
                                return Verbose;
                        }
                }});

        //             _                 
        //__ _____ _ _| |__  ___ ___ ___ 
        //\ V / -_) '_| '_ \/ _ (_-</ -_)
        // \_/\___|_| |_.__/\___/__/\___|

        var VerboseSandbox = true;
        var VerboseAssert = true;

        Object.defineProperties(Verbose, {
                "sandbox": {
                        get: function () {
                                return VerboseSandbox;
                        }
                },
                "assert": {
                        get: function () {
                                return VerboseAssert;
                        }
                },
        });

        // ___ _ _ _ _ ___ _ _ 
        /// -_) '_| '_/ _ \ '_|
        //\___|_| |_| \___/_|  

        // print stack trace on error
        var Stack = true;

        Object.defineProperties(Config, {
                "stack": {
                        get: function () {
                                return Stack;
                        }
                }});

        //               _    _     
        // ___ _ _  __ _| |__| |___ 
        /// -_) ' \/ _` | '_ \ / -_)
        //\___|_||_\__,_|_.__/_\___|

        // contract assertion
        var assertion = undefined;
        //  sandbox membrane
        var membrabne = undefined;
        // decompile functions
        var decompile = undefined;

        Object.defineProperties(Config, {
                "assertion": {
                        get: function () {
                                return (assertion===undefined) ? true : assertion;
                        },
                set: function (arg) {
                        assertion = (assertion===undefined) ? arg : assertion;
                        return arg;
                }                        
                },
                "membrabne": {
                        get: function () {
                                return (membrabne===undefined) ? true : membrabne;
                        },
                set: function (arg) {
                        membrabne = (membrabne===undefined) ? arg : membrabne;
                        return arg;
                }                        
                },
                "decompile": {
                        get: function () {
                                return (decompile===undefined) ? true : decompile;
                        },
                        set: function (arg) {
                                decompile = (decompile===undefined) ? arg : decompile;
                                return arg;
                        }                        
                }});

        //               _     
        // _ __  ___  __| |___ 
        //| '  \/ _ \/ _` / -_)
        //|_|_|_\___/\__,_\___|

        // use newGlobal in sandbox
        var newGlobal = false;

        // pass-through of native functions
        var nativePassThrough = true;

        Object.defineProperties(Config, {
                "sandbox": {
                        get: function () {
                                return newGlobal;
                        }
                },
                "assert": {
                        get: function () {
                                return nativePassThrough;
                        }
                },
        });

})(_);
