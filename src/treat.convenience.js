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

        // TODO MERGE THIS
        function FunctionContract(domain, range, strict, sign) {
                if(!(this instanceof FunctionContract)) return new FunctionContract(domain, range, strict, sign);

                if(!(range instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

                if(domain instanceof Contract) {
                        return _.core.FunctionContract(domain, range, strict, sign);
                } else if(domain instanceof Array) {
                        return _.core.FunctionContract(_.core.ObjectContract(domain), range, strict, sign);
                } else if(domain instanceof Object) {
                        return _.core.FunctionContract(_.core.ObjectContract(domain), range, strict, sign);
                } else error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
        }

        function SimpleFunctionContract() {
                if(!(this instanceof SimpleFunctionContract)) return new FunctionContract(domain, range, strict, sign);


                print(arguments.length);
                var sign = arguments.pop();
                var strict = arguments.pop();

                var range = arguments.pop();
                print(arguments.length);
        }
        /*
           function Weak-SimpleFunctionContract() {}
           function Strict-SimpleFunctionContract() {}

           function Positive-SimpleFunctionContract() {}
           function Negative-SimpleFunctionContract() {}

           function Positive-SimpleFunctionContract() {}
           function Negative-SimpleFunctionContract() {}
           */

        /*
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
        */


        //  ___  _     _        _    ___         _               _   
        // / _ \| |__ (_)___ __| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
        //| (_) | '_ \| / -_) _|  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
        // \___/|_.__// \___\__|\__|\___\___/_||_\__|_| \__,_\__|\__|
        //          |__/                                             

        /*
           function Weak_ObjectContract(properties, strict, sign) {
           return  _.ObjectContract(properties, strict, sign);
           }
           */
        function Match(regexp, contract) {
                if(!(this instanceof Match)) return new Match(regexp, contract);

                if(!(regexp instanceof RegEx)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
                if(!(contract instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

                Object.defineProperties(this, {
                        "regexp": {
                                get: function () { return regexp; } },
                        "contract": {
                                get: function () { return contract; } }
                });
        }


        // stict ?
        function MatchingObjectContract(properties, sign) {
                if(!(this instanceof MatchingObjectContract)) return new MatchingObjectContract(properties, sign);

                for(property in properties) {
                        if(!(properties[property] instanceof Match)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
                }

                Object.defineProperties(this, {
                        "properties": {
                                get: function () { return properties; } },
                        "sign": {
                                get: function () { return sign; } }
                });
        }


        // ___                        _         _    ___         _               _   
        //|   \ ___ _ __  ___ _ _  __| |___ _ _| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
        //| |) / -_) '_ \/ -_) ' \/ _` / -_) ' \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
        //|___/\___| .__/\___|_||_\__,_\___|_||_\__|\___\___/_||_\__|_| \__,_\__|\__|
        //         |_|                                                               

        /*        
                  function Positive_DependentContract(constructor) {
                  return _.DependentContract(constructor, false);
                  }

                  function Negative_DependentContract(constructor) {
                  return _.DependentContract(constructor, true);
                  }

*/



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

