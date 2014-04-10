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

        function Contract() {
                if(!(this instanceof Contract)) return new Contract();
        };

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

        // ___          _   _   _          ___         _               _   
        //| __|  _ _ _ | |_| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
        //| _| || | ' \| / /  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
        //|_| \_,_|_||_|_\_\\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

        function FunctionContract(domain, range, sign) {
                if(!(this instanceof FunctionContract)) return new FunctionContract(domain, range, sign);

                if(!(domain instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
                if(!(range instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

                Object.defineProperties(this, {
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

        function MethodContract(domain, range, context, sign) {
                if(!(this instanceof FunctionContract)) return new MethodContract(domain, range, sign);

                if(!(domain instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
                if(!(range instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
                if(!(context instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

                Object.defineProperties(this, {
                        "sign": {
                                get: function () { return ((sign) ? true : false); } },
                        "domain": {
                                get: function () { return domain; } },
                        "range": {
                                get: function () { return range; } },
                        "context": {
                                get: function () { return context; } }
                });

                this.toString = function() { return "(" + domain.toString() + "->" + range.toString() + "|" + context.toString() + ")"; };
        }
        MethodContract.prototype = new Contract();

        //  ___  _     _        _    ___         _               _   
        // / _ \| |__ (_)___ __| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
        //| (_) | '_ \| / -_) _|  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
        // \___/|_.__// \___\__|\__|\___\___/_||_\__|_| \__,_\__|\__|
        //          |__/                                             

        function ObjectContract(map, sign) {
                if(!(this instanceof ObjectContract)) return new ObjectContract(map, sign);

                // TODO, 
                // only sting maps can be strict
                // todo, remove strict flag, und use only in advanced constructopr
                if(!(map instanceof Map)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber); 

                Object.defineProperties(this, {
                        "strict": {
                                get: function () { return map.strict; } },
                        "sign": {
                                get: function () { return ((sign) ? true : false); } },
                        "map": {
                                get: function () { return map; } }
                });

                this.toString = function() { 
                        return "{" + map.toString() + "}";
                };
        }
        ObjectContract.prototype = new Contract();

        // ___                        _         _    ___         _               _   
        //|   \ ___ _ __  ___ _ _  __| |___ _ _| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
        //| |) / -_) '_ \/ -_) ' \/ _` / -_) ' \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
        //|___/\___| .__/\___|_||_\__,_\___|_||_\__|\___\___/_||_\__|_| \__,_\__|\__|
        //         |_|                                                               

        function DependentContract(constructor, sign) {
                if(!(this instanceof DependentContract)) return new DependentContract(constructor);

                if(!(constructor instanceof Constructor)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

                Object.defineProperties(this, {
                        "strict": {
                                get: function () { return ((strict) ? true : false); } },
                        "sign": {
                                get: function () { return ((sign) ? true : false); } },
                        "constructor": {
                                get: function () { return constructor; } }
                });

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

                Object.defineProperties(this, {
                        "first": {
                                get: function () { return first; } },
                        "second": {
                                get: function () { return second; } }
                });

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

                Object.defineProperties(this, {
                        "first": {
                                get: function () { return first; } },
                        "second": {
                                get: function () { return second; } }
                });

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

                Object.defineProperties(this, {
                        "sub": {
                                get: function () { return sub; } }
                });

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

                Object.defineProperties(this, {
                        "binding": {
                                get: function () { return binding; } },
                        "contract": {
                                get: function () { return contract; } }
                });

                this.toString = function() {
                        var domain = "";
                        for(name in binding) domain += " " + name;
                        return "(with {" + domain + "}" + contract.toString() + ")";
                };
        }
        WithContract.prototype = new Contract();

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

        // __  __           
        //|  \/  |__ _ _ __ 
        //| |\/| / _` | '_ \
        //|_|  |_\__,_| .__/
        //            |_|   

        function Map() {
                if(!(this instanceof Map)) return new Map();

                var keys = [];
                var values = [];

                this.foreach = function(callback) {
                        keys.foreach(function (index, key) {
                                callback(key, values[index]);     
                        });
                }

                this.set = function(key, value) {
                        if(!(value instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

                        if(keys.indexOf(key)==-1) keys.push(key);
                        var index = keys.indexOf(key);
                        values[index] = value;

                        return keys.length;
                }

                this.get = function(key) {
                        return values[keys.indexOf(key)];
                }

                this.has = function(key) {
                        return (keys.indexOf(key)==-1) ? false : true;
                }

                this.slice = function(key) {
                        return values[keys.indexOf(key)];                
                }

                this.toString = function() { 
                        var mappings = "";
                        this.foreach(function(key, contract) {
                                mappings += " " + key + ":" + contract;
                        });
                        return "[" + mappings + "]";
                };
        }


        function StrictMap(strict) {
                if(!(this instanceof StrictMap)) return new StrictMap();
                else Map.call(this);

                Object.defineProperties(this, {
                        "strict": {
                                get: function () { return (strict) ? true : false; }}
                });
        }
        StrictMap.prototype = new Map();

        function WeakMap() {
                if(!(this instanceof WeakMap)) return new WeakMap();
                else Map.call(this);
                Object.defineProperties(this, {
                        "strict": {
                                get: function () { return false; }}
                });
        }
        WeakMap.prototype = new Map();

        function StringMap(elements, strict) { 
                if(!(this instanceof StringMap)) return new StringMap(elements, strict);
                else if(strict) StrictMap.call(this, true);
                else WeakMap.call(this);

                var set = this.set;
                this.set = function(key, value) {
                        if(!(typeof key === "string")) error("Wrong Type. String required, "+(typeof key)+" found.", (new Error()).fileName, (new Error()).lineNumber);
                        else set(key, value);
                }

                if(elements instanceof Array) {
                        var base = this; 
                        elements.foreach(function(key, value) {
                                base.set(key.toString(), value);
                        });
                } else if(elements instanceof Object) {
                        for(var key in elements) {
                                this.set(key, elements[key]);
                        }
                } else {}
        }
        StringMap.prototype = new StrictMap();



        //  _.core = {}


        // TODO, amke this as getter

        _.Contract = Contract;


        // deprecated
        _.ContractPrototype = Contract;
        _.ConstructorPrototype = Constructor;

        _.BaseContract = BaseContract;

        _.FunctionContract = FunctionContract;
        _.MethodContract = MethodContract;
        _.DependentContract = DependentContract;
        _.ObjectContract = ObjectContract;

        _.With = WithContract;

        _.And = AndContract;
        _.Or = OrContract;
        _.Not = NotContract;

        _.Constructor = ContractConstructor;

        _.Global = Global;

        _.Map = Map;
        _.WeakMap = WeakMap;
        _.StrictMap = StrictMap;

        _.StringMap = StringMap;


})(_);
