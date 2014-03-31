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

        var error = _.error;
        var violation = _.violation;
        var blame = _.blame;

        var Contract = _.ContractPrototype;
        var Constructor = _.ConstructorPrototype;

        var ContractConstructor = _.Constructor;

        var BaseContract = _.BaseContract;

        var FunctionContract = _.FunctionContract;
        var MethodContract = _.MethodContract;
        var DependentContract = _.DependentContract;
        var ObjectContract = _.ObjectContract;

        var WithContract = _.With;

        var AndContract = _.And;
        var OrContract = _.Or;
        var NotContract = _.Not;

        //  ___ _     _          _ 
        // / __| |___| |__  __ _| |
        //| (_ | / _ \ '_ \/ _` | |
        // \___|_\___/_.__/\__,_|_|

        function Global(global) {
                if(!(this instanceof Global)) return new Global(global);

                global = (global==undefined) ? {} : global;

                this.dump = function() {
                        return global; 
                }

                this.clone = function() {
                        var newglobal = {};
                        for(key in global) newglobal[key] = global[key];
                        return new Global(newglobal);
                }

                this.merge = function(binding) {
                        var newglobal = this.clone().dump();
                        for(key in binding) newglobal[key] = binding[key];
                        return new Global(newglobal);
                }
        }

        //                         _   
        //                        | |  
        //  __ _ ___ ___  ___ _ __| |_ 
        // / _` / __/ __|/ _ \ '__| __|
        //| (_| \__ \__ \  __/ |  | |_ 
        // \__,_|___/___/\___|_|   \__|

        function assert(arg, contract) {

                // disbale assertion
                if(!_.Config.assertion) return arg;

                if(!(contract instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

                // callback axiom
                var callback = function(arg, msg) {
                        if(arg==false) 
                                blame(contract, msg, (new Error()).fileName, (new Error()).lineNumber);
                }
                return assertWith(arg, contract, new Global(), callback);
        }

        function assertWith(arg, contract, global, callback) {

                if(!(contract instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

                // ___          _   _   _          ___         _               _   
                //| __|  _ _ _ | |_| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
                //| _| || | ' \| / /  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
                //|_| \_,_|_||_|_\_\\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

                if(contract instanceof FunctionContract) {
                        if(!(arg instanceof Function)) error("Wrong Argument", (new Error()).fileName, (new Error()).lineNumber);

                        var handler = new FunctionHandler(contract.domain, contract.range, global, callback);
                        var proxy = new Proxy(arg, handler);
                        return proxy;
                }

                // __  __     _   _            _  ___         _               _   
                //|  \/  |___| |_| |_  ___  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
                //| |\/| / -_)  _| ' \/ _ \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
                //|_|  |_\___|\__|_||_\___/\__,_|\___\___/_||_\__|_| \__,_\__|\__|

                if(contract instanceof MethodContract) {
                        if(!(arg instanceof Function)) error("Wrong Argument", (new Error()).fileName, (new Error()).lineNumber);

                        var handler = new MethodHandler(contract.domain, contract.range, contract.context, global, callback);
                        var proxy = new Proxy(arg, handler);
                        return proxy;
                }

                //  ___  _     _        _    ___         _               _   
                // / _ \| |__ (_)___ __| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
                //| (_) | '_ \| / -_) _|  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
                // \___/|_.__// \___\__|\__|\___\___/_||_\__|_| \__,_\__|\__|
                //          |__/                                             

                else if (contract instanceof ObjectContract) {
                        if(!(arg instanceof Object)) error("Wrong Argument", (new Error()).fileName, (new Error()).lineNumber);

                        var handler = new ObjectHandler(contract.properties, global, callback);
                        var proxy = new Proxy(arg, handler);
                        return proxy;
                }

                // ___                        _         _    ___         _               _   
                //|   \ ___ _ __  ___ _ _  __| |___ _ _| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
                //| |) / -_) '_ \/ -_) ' \/ _` / -_) ' \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
                //|___/\___| .__/\___|_||_\__,_\___|_||_\__|\___\___/_||_\__|_| \__,_\__|\__|
                //         |_|                                                               

                if(contract instanceof DependentContract) {
                        if(!(arg instanceof Function)) error("Wrong Argument", (new Error()).fileName, (new Error()).lineNumber);

                        var handler = new DependentHandler(contract.constructor, global, callback);
                        var proxy = new Proxy(arg, handler);
                        return proxy;
                }

                //__      ___ _   _    ___         _               _   
                //\ \    / (_) |_| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
                // \ \/\/ /| |  _| ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
                //  \_/\_/ |_|\__|_||_\___\___/_||_\__|_| \__,_\__|\__|                                                   

                else if (contract instanceof WithContract) {
                        var newglobal = global.merge(contract.binding);
                        return assertWith(arg, contract.contract, newglobal, callback);
                }

                //   _           _  ___         _               _   
                //  /_\  _ _  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
                // / _ \| ' \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
                ///_/ \_\_||_\__,_|\___\___/_||_\__|_| \__,_\__|\__|

                else if (contract instanceof AndContract) {
                        var callback = _.AndCallback(callback);
                        var tmp = assertWith(arg, contract.first, global, callback.leftHandler);
                        return assertWith(tmp, contract.second, global,  callback.rightHandler); 
                }

                //  ___       ___         _               _   
                // / _ \ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
                //| (_) | '_| (__/ _ \ ' \  _| '_/ _` / _|  _|
                // \___/|_|  \___\___/_||_\__|_| \__,_\__|\__|

                else if (contract instanceof OrContract) {
                        var callback = _.OrCallback(callback);
                        var tmp = assertWith(arg, contract.first, global, callback.leftHandler);
                        return assertWith(tmp, contract.second, global,  callback.rightHandler); 
                }

                // _  _     _    ___         _               _   
                //| \| |___| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
                //| .` / _ \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
                //|_|\_\___/\__|\___\___/_||_\__|_| \__,_\__|\__|

                else if (contract instanceof NotContract) {
                        var callback = _.NotCallback(callback);
                        return assertWith(arg, contract.sub, global, callback.subHandler);
                }

                // ___                ___         _               _   
                //| _ ) __ _ ___ ___ / __|___ _ _| |_ _ _ __ _ __| |_ 
                //| _ \/ _` (_-</ -_) (__/ _ \ ' \  _| '_/ _` / _|  _|
                //|___/\__,_/__/\___|\___\___/_||_\__|_| \__,_\__|\__|

                else if(contract instanceof BaseContract) {
                        var globalArg = global.dump(); 
                        var thisArg = undefined;
                        var argsArray = new Array();

                        argsArray.push(arg);

                        if(!(_.eval(contract.predicate, globalArg, thisArg, argsArray))) {
                                callback(false, contract.toString());
                        } else {
                                callback(true, contract.toString());
                        }
                        return arg;
                }

                // ___               _ _              ___         _               _   
                /// __| __ _ _ _  __| | |__  _____ __/ __|___ _ _| |_ _ _ __ _ __| |_ 
                //\__ \/ _` | ' \/ _` | '_ \/ _ \ \ / (__/ _ \ ' \  _| '_/ _` / _|  _|
                //|___/\__,_|_||_\__,_|_.__/\___/_\_\\___\___/_||_\__|_| \__,_\__|\__|

                else if(contract instanceof SandboxContract) {
                        var globalArg = global.dump(); 
                        var thisArg = undefined;
                        var argsArray = new Array();

                        argsArray.push(_.wrap(arg));

                        /* Merge global objects
                        */ 

                        // clone object
                        function clone(obj) {
                                var tmp = {};
                                for(var property in obj) tmp[property] = obj[property];
                                return tmp;
                        }
                        // clear object
                        function clear(obj) {
                                for(var property in obj) delete obj[property];
                        }
                        // copy objA[property] => objB[property]
                        function copy(objA, objB) {
                                for(var property in objA) objB[property]=objA[property];
                        }

                        var backupGlobal = clone(contract.global);
                        copy(globalArg, contract.global);

                        if(!(contract.predicate.apply(thisArg, argsArray))) {
                                callback(false, contract.toString());
                        } else {
                                callback(true, contract.toString());
                        }

                        clear(contract.global);
                        copy(backupGlobal, contract.global);

                        return arg;
                }

                //  ___             _               _           
                // / __|___ _ _  __| |_ _ _ _  _ __| |_ ___ _ _ 
                //| (__/ _ \ ' \(_-<  _| '_| || / _|  _/ _ \ '_|
                // \___\___/_||_/__/\__|_|  \_,_\__|\__\___/_|  

                else if(contract instanceof Constructor) {
                        return assertWith(arg, construct(contract), global, callback);
                }

                else error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
        }

        _.assert = assert;
        _.assertWith = assertWith;

})(_);

