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
var _ = (function() {
        // _____             _      _ ___ 
        //|_   _| _ ___ __ _| |_ _ | / __|
        //  | || '_/ -_) _` |  _| || \__ \
        //  |_||_| \___\__,_|\__|\__/|___/
        //                                
        //  ___ _     _          _    ___  _     _        _   
        // / __| |___| |__  __ _| |  / _ \| |__ (_)___ __| |_ 
        //| (_ | / _ \ '_ \/ _` | | | (_) | '_ \| / -_) _|  _|
        // \___|_\___/_.__/\__,_|_|  \___/|_.__// \___\__|\__|
        //                                    |__/            
        var _ = new Object();
        _.toString = (function() { return '[[TreatJS]]'; });

        /* Backup Function.prototype.toString;
         */

        // new Base object
        _.Base = new Object();
        // references Function.prototype.toString
        _.Base.toString = Function.prototype.toString;

        return _ ;
})();
