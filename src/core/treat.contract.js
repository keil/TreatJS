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

        //  _____            _                  _       
        // / ____|          | |                | |      
        //| |     ___  _ __ | |_ _ __ __ _  ___| |_ ___ 
        //| |    / _ \| '_ \| __| '__/ _` |/ __| __/ __|
        //| |___| (_) | | | | |_| | | (_| | (__| |_\__ \
        // \_____\___/|_| |_|\__|_|  \__,_|\___|\__|___/

        function Contract() {};

        // ___                ___         _               _   
        //| _ ) __ _ ___ ___ / __|___ _ _| |_ _ _ __ _ __| |_ 
        //| _ \/ _` (_-</ -_) (__/ _ \ ' \  _| '_/ _` / _|  _|
        //|___/\__,_/__/\___|\___\___/_||_\__|_| \__,_\__|\__|

        function BaseContract(predicate, name) {
                if(!(this instanceof BaseContract)) return new BaseContract(predicate, name);

                if(!(predicate instanceof Function)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

                Object.defineProperties(this, {
                        "predicate": {
                                get: function () { return predicate; } },
                        "name": {
                                get: function () { return name; } }
                });

                this.toString = function() { return "[" + ((name!=undefined) ? name : predicate.toString()) + "]"; };
        }
        BaseContract.prototype = new Contract();

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

        // ___          _   _   _          ___         _               _   
        //| __|  _ _ _ | |_| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
        //| _| || | ' \| / /  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
        //|_| \_,_|_||_|_\_\\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

        function FunctionContract(domain, range, strict, sign) {
                if(!(this instanceof FunctionContract)) return new FunctionContract(domain, range, strict, sign);

                if(!(domain instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
                if(!(range instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

                Object.defineProperties(this, {
                        "strict": {
                                get: function () { return ((strict) ? true : false); } },
                        "sign": {
                                get: function () { return ((sign) ? true : false); } },
                        "domain": {
                                get: function () { return domain; } },
                        "range": {
                                get: function () { return range; } }
                });

                this.toString = function() { return "(" + domain.toString() + "->" + range.toString() + ")"; };
        }
        FunctionContract.prototype = new Contract();

        // __  __     _   _            _  ___         _               _   
        //|  \/  |___| |_| |_  ___  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
        //| |\/| / -_)  _| ' \/ _ \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
        //|_|  |_\___|\__|_||_\___/\__,_|\___\___/_||_\__|_| \__,_\__|\__|

        function MethodContract(domain, range, context, strict, sign) {
                if(!(this instanceof FunctionContract)) return new MethodContract(domain, range, strict, sign);

                if(!(domain instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
                if(!(range instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
                if(!(context instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

                Object.defineProperties(this, {
                        "strict": {
                                get: function () { return ((strict) ? true : false); } },
                        "sign": {
                                get: function () { return ((sign) ? true : false); } },
                        "domain": {
                                get: function () { return domain; } },
                        "range": {
                                get: function () { return range; } },
                        "context": {
                                get: function () { return context; } }
                });

                this.toString = function() { return "(" + domain.toString() + "->" + range.toString() + ")"; };
        }
        MethodContract.prototype = new Contract();

        //  ___  _     _        _    ___         _               _   
        // / _ \| |__ (_)___ __| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
        //| (_) | '_ \| / -_) _|  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
        // \___/|_.__// \___\__|\__|\___\___/_||_\__|_| \__,_\__|\__|
        //          |__/                                             

        function ObjectContract(properties, strict, sign) {
                if(!(this instanceof ObjectContract)) return new ObjectContract(properties);

                if(!(properties instanceof Object)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
                for(property in properties) {
                        if(!(properties[property] instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
                }

                Object.defineProperties(this, {
                        "strict": {
                                get: function () { return ((strict) ? true : false); } },
                        "sign": {
                                get: function () { return ((sign) ? true : false); } },
                        "properties": {
                                get: function () { return properties; } }
                });

                this.properties = properties;
                this.toString = function() { 
                        var domain = "";
                        for(name in properties) domain += " " + name + ":" + properties[name].toString();
                        return "{" + domain + "}";
                };
        }
        ObjectContract.prototype = new Contract();

        // ___                        _         _    ___         _               _   
        //|   \ ___ _ __  ___ _ _  __| |___ _ _| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
        //| |) / -_) '_ \/ -_) ' \/ _` / -_) ' \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
        //|___/\___| .__/\___|_||_\__,_\___|_||_\__|\___\___/_||_\__|_| \__,_\__|\__|
        //         |_|                                                               

        function DependentContract(constructor) {
                if(!(this instanceof DependentContract)) return new DependentContract(constructor);

                if(!(constructor instanceof Constructor)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

                this.constructor = constructor;
                this.toString = function() { return "(" + constructor.toString() + "->" + "*" + ")"; };
        }
        DependentContract.prototype = new Contract();

        //   _           _  ___         _               _   
        //  /_\  _ _  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
        // / _ \| ' \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
        ///_/ \_\_||_\__,_|\___\___/_||_\__|_| \__,_\__|\__|

        function AndContract(first, second) {
                if(!(this instanceof AndContract)) return new AndContract(first, second);

                if(!(first instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
                if(!(second instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

                this.first = first;
                this.second = second;
                this.toString = function() { return "(" + first.toString() + "and" + second.toString() + ")"; };
        }
        AndContract.prototype = new Contract();

        //  ___       ___         _               _   
        // / _ \ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
        //| (_) | '_| (__/ _ \ ' \  _| '_/ _` / _|  _|
        // \___/|_|  \___\___/_||_\__|_| \__,_\__|\__|

        function OrContract(first, second) { 
                if(!(this instanceof OrContract)) return new OrContract(first, second);

                if(!(first instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
                if(!(second instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

                this.first = first;
                this.second = second;
                this.toString = function() { return "(" + first.toString() + "or" + second.toString() + ")"; };
        }
        OrContract.prototype = new Contract();

        // _  _     _    ___         _               _   
        //| \| |___| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
        //| .` / _ \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
        //|_|\_\___/\__|\___\___/_||_\__|_| \__,_\__|\__|

        function NotContract(sub) { 
                if(!(this instanceof NotContract)) return new NotContract(sub);

                if(!(sub instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

                this.sub = sub;
                this.toString = function() { return "not(" + sub.toString() + ")"; };
        }
        NotContract.prototype = new Contract();

        //__      ___ _   _    ___         _               _   
        //\ \    / (_) |_| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
        // \ \/\/ /| |  _| ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
        //  \_/\_/ |_|\__|_||_\___\___/_||_\__|_| \__,_\__|\__|                                                   

        function WithContract(binding, contract) {
                if(!(this instanceof WithContract)) return new WithContract(binding, contract);

                if(!(binding instanceof Object)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
                if(!(contract instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

                this.binding = binding;
                this.contract = contract;
                this.toString = function() {
                        var domain = "";
                        for(name in binding) domain += " " + name;
                        return "(with {" + domain + "}" + contract.toString() + ")";
                };
        }
        WithContract.prototype = new Contract();

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

                // TODO

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

        function FunctionHandler(domain, range, global, callback) {
                this.apply = function(target, thisArg, args) {
                        var args = assertWith(args, domain, global, callback);
                        var val = target.apply(thisArg, args);  
                        return assertWith(val, range, global, callback);
                };
                this.construct = function(target, args) {
                        var obj = Object.create(target.prototype);
                        this.apply(target, obj, args);
                        return obj;
                };
        }

        function DependentHandler(constructor, global, callback) {
                this.apply = function(target, thisArg, args) { 

                        var argsArray = new Array();
                        argsArray.push(args);

                        var contract = constructWith(argsArray, constructor, global);
                        var val = target.apply(thisArg, args); 
                        return assertWith(val, contract, global, callback);
                };
                this.construct = function(target, args) {
                        var obj = Object.create(target.prototype);
                        this.apply(target, this, args);
                        return obj;
                };
        }

        function ObjectHandler(contract, global, callback) {
                this.get = function(target, name, receiver) {
                        return (contract.hasOwnProperty(name)) ? assertWith(target[name], contract[name], global, callback) : target[name]; 
                };
        }

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

                this.constructor = constructor;
                this.name = name;
                this.toString = function() { return "[[" + ((name!=undefined) ? name : constructor.toString()) + "]]"; };
        }
        ContractConstructor.prototype = new Constructor();

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

        _.assert = assert;
        _.construct = construct;


        _.ContractPrototype = Contract;
        _.ConstructorPrototype = Constructor;

        _.Constructor = ContractConstructor;

        _.BaseContract = BaseContract;

        _.FunctionContract = FunctionContract;
        // _.SFunctionContract = SFunctionContract;
        _.DependentContract = DependentContract;
        _.ObjectContract = ObjectContract;

        _.With = WithContract;

        _.And = AndContract;
        _.Or = OrContract;
        _.Not = NotContract;

})(_);
