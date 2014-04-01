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

        // ___               _ _              ___         _               _   
        /// __| __ _ _ _  __| | |__  _____ __/ __|___ _ _| |_ _ _ __ _ __| |_ 
        //\__ \/ _` | ' \/ _` | '_ \/ _ \ \ / (__/ _ \ ' \  _| '_/ _` / _|  _|
        //|___/\__,_|_||_\__,_|_.__/\___/_\_\\___\___/_||_\__|_| \__,_\__|\__|

        function SandboxContract(predicate, global, name) {
                if(!(this instanceof SandboxContract)) return new SandboxContract(predicate, global, name);

                if(!(predicate instanceof Function)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
                if(!(global instanceof Object)) error("Wrong Argument", (new Error()).fileName, (new Error()).lineNumber);

                Object.defineProperties(this, {
                        "predicate": {
                                get: function () { return predicate; } },
                        "global": {
                                get: function () { return global; } },
                        "name": {
                                get: function () { return name; } }
                });

                this.toString = function() { return "[" + ((name!=undefined) ? name : predicate.toString()) + "]"; };
        }
        SandboxContract.prototype = new Contract();

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


                        print("CALLBACKx: " + callback);

                        var handler = new FunctionHandler(contract, global, callback);
                        var proxy = new Proxy(arg, handler);
                        return proxy;
                }

                // __  __     _   _            _  ___         _               _   
                //|  \/  |___| |_| |_  ___  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
                //| |\/| / -_)  _| ' \/ _ \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
                //|_|  |_\___|\__|_||_\___/\__,_|\___\___/_||_\__|_| \__,_\__|\__|

                if(contract instanceof MethodContract) {
                        if(!(arg instanceof Function)) error("Wrong Argument", (new Error()).fileName, (new Error()).lineNumber);

                        var handler = new MethodHandler(contract, global, callback);
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

                        // TODO, callback

                        if(contract.strict) {
                                // TODO test
                                var callback = (contract.sign) ? _.Callback(callback) : _.NotCallback(callback);

                                contract.properties.foreach(function(identifier, contract) {
                                        arg[identifier] = assertWith(arg[identifier], contract, global, callback.subHandler);
                                });                         
                        }

                        var handler = new ObjectHandler(contract, global, callback);
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

                        var handler = new DependentHandler(contract, global, callback);
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

                        try {
                                var result = _.eval(contract.predicate, globalArg, thisArg, argsArray);
                        } catch (e) {
                                var result = false;
                        } finally {
                                if(!result) {
                                        callback(false, contract.toString());
                                } else {
                                        callback(true, contract.toString());
                                }
                                return arg;
                        }
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

                        try {
                                var result = contract.predicate.apply(thisArg, argsArray);
                        } catch (e) {
                                var result = false;
                        } finally {
                                if(!result) {
                                        callback(false, contract.toString());
                                } else {
                                        callback(true, contract.toString());
                                }
                                clear(contract.global);
                                copy(backupGlobal, contract.global);
                                return arg;
                        }
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

        // _    _                 _ _           
        //| |  | |               | | |          
        //| |__| | __ _ _ __   __| | | ___ _ __ 
        //|  __  |/ _` | '_ \ / _` | |/ _ \ '__|
        //| |  | | (_| | | | | (_| | |  __/ |   
        //|_|  |_|\__,_|_| |_|\__,_|_|\___|_|   

        function FunctionHandler(contract, global, callback) {
                if(!(this instanceof FunctionHandler)) return new FunctionHandler(contract, global, callback);

                this.apply = function(target, thisArg, args) {
                        var ncallback = (!contract.sign) ?  _.AndCallback(callback) : _.AndCallback(_.NotCallback(callback).subHandler);

                        //  TODO TEST
                        //   var domain = _.ObjectContract(contract.domain.properties, contract.strict, true);
                        //   var range = contract.range;

                        var args = assertWith(args, contract.domain, global, ncallback.leftHandler);
                        var val = target.apply(thisArg, args);  
                        return assertWith(val, contract.range, global, ncallback.rightHandler);
                };
                this.construct = function(target, args) {
                        var obj = Object.create(target.prototype);
                        this.apply(target, obj, args);
                        return obj;
                };
        }

        function MethodHandler(contract, global, callback) {
                if(!(this instanceof MethodHandler)) return new MethodHandler(contract, global, callback);

                this.apply = function(target, thisArg, args) {
                        // TODO test

                        // TODO test
                        var callback1 = (!contract.sign) ? _.AndCallback(callback) : _.AndCallback(_.NotCallback(callback).subHandler);
                        var callback2 = _.AndCallback(callback1.rightHandler);      

                        /*
                           if(contract.sign) {
                           var callback1 = _.AndCallback(callback);
                           var callback2 = _.AndCallback(callback1.rightHandler());
                           } else if(!contract.sign) {
                           var callback1 = _.AndCallback(_.NotCallback(callback).subHandler());

                           }
                           */                     
                        var args = assertWith(args, contract.domain, global, callback2.leftHandler);
                        var thisArg = assertWith(thisArg, context, global, callback1.leftHandler);
                        var val = target.apply(thisArg, args);  
                        return assertWith(val, range, global, callback2.rightHandler);
                };
                this.construct = function(target, args) {
                        var obj = Object.create(target.prototype);
                        this.apply(target, obj, args);
                        return obj;
                };
        }

        function DependentHandler(contract, global, callback) {
                if(!(this instanceof DependentHandler)) return new DependentHandler(contract, global, callback);

                this.apply = function(target, thisArg, args) { 

                        // TODO test
                        var ncallback = (!contract.sign) ? _.Callback(callback) : _.NotCallback(callback);

                        var range = constructWith(args, contract.constructor, global);
                        var val = target.apply(thisArg, args); 
                        return assertWith(val, range, global, ncallback.subHandler);
                };
                this.construct = function(target, args) {
                        var obj = Object.create(target.prototype);
                        this.apply(target, this, args);
                        return obj;
                };
        }

        function ObjectHandler(contract, global, callback) {
                if(!(this instanceof ObjectHandler)) return new ObjectHandler(contract, global, callback);

                this.get = function(target, name, receiver) {

                        // TODO test
                        var ncallback = (!contract.sign) ? _.Callback(callback) : _.NotCallback(callback);

                        return (contract.hasOwnProperty(name)) ? assertWith(target[name], contract[name], global, ncallback.subHandler) : target[name]; 
                };

                //   this.set = function()
        }



        //                     _                   _   
        //                    | |                 | |  
        //  ___ ___  _ __  ___| |_ _ __ _   _  ___| |_ 
        // / __/ _ \| '_ \/ __| __| '__| | | |/ __| __|
        //| (_| (_) | | | \__ \ |_| |  | |_| | (__| |_ 
        // \___\___/|_| |_|___/\__|_|   \__,_|\___|\__|

        function construct(constructor) {
                if(!(constructor instanceof Constructor)) error("Wrong Constructor", (new Error()).fileName, (new Error()).lineNumber);

                var args = Array.slice(arguments);
                args.shift();
                return constructWith(args, constructor, new Global());
        }

        function constructWith(args, constructor, global) {
                if(!(constructor instanceof Constructor)) error("Wrong Constructor", (new Error()).fileName, (new Error()).lineNumber);

                var globalArg = global.dump(); 
                var thisArg = undefined;
                var argsArray = args;

                var newglobal = {};
                globalArg["$"] = newglobal;

                newglobal.BaseContract = function (predicate, name) {
                        return SandboxContract(predicate, globalArg, name);
                };


                //TODO, bind cintracts

                newglobal.FunctionContract = FunctionContract;
                //newglobal.SFunctionContract = SFunctionContract;
                newglobal.DependentContract = DependentContract;
                newglobal.ObjectContract = ObjectContract;

                newglobal.With = WithContract;

                newglobal.And = AndContract;
                newglobal.Or = OrContract;
                newglobal.Not = NotContract;

                newglobal.Constructor = ContractConstructor;

                newglobal.assert = assert;
                newglobal.construct = construct;

                var contract = (_.eval(constructor.constructor, globalArg, thisArg, argsArray));

                if(!(contract instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
                return contract;
        }

        // TODO

        _.construct = construct;
        _.assert = assert;



})(_);

