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

        //  _____                _                   _             
        // / ____|              | |                 | |            
        //| |     ___  _ __  ___| |_ _ __ _   _  ___| |_ ___  _ __ 
        //| |    / _ \| '_ \/ __| __| '__| | | |/ __| __/ _ \| '__|
        //| |___| (_) | | | \__ \ |_| |  | |_| | (__| || (_) | |   
        // \_____\___/|_| |_|___/\__|_|   \__,_|\___|\__\___/|_|   

        function Constructor() {}
        Constructor.prototype = new Contract();

        function ContractConstructor(constructor, name) {
                if(!(this instanceof ContractConstructor)) return new ContractConstructor(constructor, name);

                if(!(constructor instanceof Function)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

                Object.defineProperties(this, {
                        "constructor": {
                                get: function () { return constructor; } },
                        "name": {
                                get: function () { return name; } }
                });

                this.toString = function() { return "[*" + ((name!=undefined) ? name : constructor.toString()) + "*]"; };
        }
        ContractConstructor.prototype = new Constructor();

        _.ConstructorPrototype = Constructor;
        _.Constructor = ContractConstructor;

})(_);
