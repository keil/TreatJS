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

        // ___          _   _   _          ___         _               _   
        //| __|  _ _ _ | |_| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
        //| _| || | ' \| / /  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
        //|_| \_,_|_||_|_\_\\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

        function FunctionContract(domain, range, strict, sign) {
                if(!(this instanceof FunctionContract)) return new FunctionContract(domain, range, strict, sign);

// pretty syntax
//                if(!(domain instanceof Contract) && (domain instanceof Object)) return FunctionContract(ObjectContract(domain), range);

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





        function SFunctionContract() {
                var domain = {};
                var range = null;

                // clones the arguments
                var last;
                for(var i in arguments) {
                        last = i;
                        domain[i] = arguments[i];
                }

                // last property is the range portion
                range = domain[last];
                delete domain[last];

                return FunctionContract(domain, range);
        }




        function DependentContract(constructor) {
                if(!(this instanceof DependentContract)) return new DependentContract(constructor);

                if(!(constructor instanceof Constructor)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

                this.constructor = constructor;
                this.toString = function() { return "(" + constructor.toString() + "->" + "*" + ")"; };
        }
        DependentContract.prototype = new Contract();

        function ObjectContract(properties) {
                if(!(this instanceof ObjectContract)) return new ObjectContract(properties);

                if(!(properties instanceof Object)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
                for(property in properties) {
                        if(!(properties[property] instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
                }

                this.properties = properties;
                this.toString = function() { 
                        var domain = "";
                        for(name in properties) domain += " " + name + ":" + properties[name].toString();
                        return "{" + domain + "}";
                };
        }
        ObjectContract.prototype = new Contract();

        function AndContract(first, second) {
                if(!(this instanceof AndContract)) return new AndContract(first, second);

                if(!(first instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
                if(!(second instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

                this.first = first;
                this.second = second;
                this.toString = function() { return "(" + first.toString() + "and" + second.toString() + ")"; };
        }
        AndContract.prototype = new Contract();

        function OrContract(first, second) { 
                if(!(this instanceof OrContract)) return new OrContract(first, second);

                if(!(first instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
                if(!(second instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

                this.first = first;
                this.second = second;
                this.toString = function() { return "(" + first.toString() + "or" + second.toString() + ")"; };
        }
        OrContract.prototype = new Contract();

        function NotContract(sub) { 
                if(!(this instanceof NotContract)) return new NotContract(sub);

                if(!(sub instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

                this.sub = sub;
                this.toString = function() { return "not(" + sub.toString() + ")"; };
                // TEST
                this.h = function() {return sandbox;};
        }
        NotContract.prototype = new Contract();

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

    
   /* 
        _.ContractPrototype = Contract;
        _.ConstructorPrototype = Constructor;

        _.Constructor = ContractConstructor;

        _.BaseContract = BaseContract;

        _.FunctionContract = FunctionContract;
        _.SFunctionContract = SFunctionContract;
        _.DependentContract = DependentContract;
        _.ObjectContract = ObjectContract;

        _.With = WithContract;

        _.And = AndContract;
        _.Or = OrContract;
        _.Not = NotContract;

        */

})(_);

