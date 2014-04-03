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

        var Map = _.Map;
        var StringMap = _.StringMap;

        var Test = new BaseContract(function(){return true;}, "Test");
        
        var Blank = new BaseContract(function(){return true;}, "-");

// TODO. tewt
// 
/*
        var f = new XFunctionContract(Test, Test);
        print("##### " + (f instanceof  Contract));
        print("##### " + (f instanceof  FunctionContract));
        print("##### " + (f instanceof  XFunctionContract));

        print(f.range);
*/

        // ___                ___         _               _   
        //| _ ) __ _ ___ ___ / __|___ _ _| |_ _ _ __ _ __| |_ 
        //| _ \/ _` (_-</ -_) (__/ _ \ ' \  _| '_/ _` / _|  _|
        //|___/\__,_/__/\___|\___\___/_||_\__|_| \__,_\__|\__|

//        function BaseContract(predicate, name) {
//               return _.core.BaseContract(predicate, name);
//        }
    //    BaseContract.prototype = new _.core.BaseContract();

    //    new BaseContract();

        // ___          _   _   _          ___         _               _   
        //| __|  _ _ _ | |_| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
        //| _| || | ' \| / /  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
        //|_| \_,_|_||_|_\_\\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

        function XFunctionContract(domain, range, strict, sign) {
                if(!(this instanceof XFunctionContract)) return new XFunctionContract(domain, range, sign);

                if(!(range instanceof  Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
                if(domain instanceof Contract) {
                        FunctionContract.call(this, domain, range, strict, sign);
                } else if(domain instanceof Array) {
                        FunctionContract.call(XObjectContract(domain), range, strict, sign);
                } else if(domain instanceof Object) {
                        FunctionContract.call(XObjectContract(domain), range, strict, sign);
                } else error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
        }
        XFunctionContract.prototype = new FunctionContract(Blank, Blank);

        function SimpleFunctionContract() {
                if(!(this instanceof SimpleFunctionContract)) return SimpleFunctionContract.apply(Object.create(SimpleFunctionContract.prototype), arguments);
                if(arguments.length < 2) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

                var domain = [];
                for(var i=0; i<arguments.length;i++) domain[i]=arguments[i];

                var sign = domain.pop();
                var strict = domain.pop();
                var range = domain.pop();

                print(XObjectContract(domain) instanceof Contract);


                FunctionContract.call(this, XObjectContract(domain), range, strict, sign);
        }
        SimpleFunctionContract.prototype = new FunctionContract(Blank, Blank);


        //var s = new SimpleFunctionContract(Test, Test, true, true);



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


        function Mapping(regexp, contract) {
                if(!(this instanceof Mapping)) return new Mapping(regexp, contract);

                if(!(regexp instanceof RegExp)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
                if(!(contract instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
                
                 Object.defineProperties(this, {
                        "regexp": {
                                get: function () { return regexp; } },
                        "contract": {
                                get: function () { return contract; } }
                });        
        }

        function RegExpMap(elements) {
                if(!(this instanceof RegExpMap)) return new RegExpMap(elements);
                else Map.call(this);

                var set = this.set;
                this.set = function(key, value) {
                        if(!(key instanceof RegExp)) error("Wrong Type. RegExp required, "+(typeof key)+" found.", (new Error()).fileName, (new Error()).lineNumber);
                        else set(key, value);
                }

                if(elements instanceof Array) {
                        var base = this; 
                        elements.foreach(function(key, mapping) {
                                if(!(mapping instanceof Mapping)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
                                base.set(mapping.regexp, mapping.contract);
                        });
                }
        }
        RegExpMap.prototype = new Map();

        function XObjectContract(map, strict, sign) {
                if(!(this instanceof XObjectContract)) return new XObjectContract(map, strict, sign);

                if(map instanceof Map) {
                        print("CI");
                         ObjectContract.call(this, map, strict, sign); 
                } else if(map instanceof Array) {
                          print("CIII");
                        ObjectContract.call(this, StringMap(map), strict, sign); 
                } else if(map instanceof Object) {
                          print("CIII");
                        ObjectContract.call(this, StringMap(map), strict, sign); 
                }
        }
        XObjectContract.prototype = new ObjectContract(new Map());



        var o = XObjectContract(new Map());
        var o = XObjectContract(new StringMap([Test,Test]));
        var o = XObjectContract(new StringMap({xx:Test,yy:Test}));

        var o = XObjectContract({xx:Test,yy:Test});
        var o = XObjectContract([Test,Test]);


        var m = new RegExpMap();
        m.set(/test/, Test);
        m.set(/test2/, Test);
        var o = XObjectContract(m);

        var o = XObjectContract(RegExpMap([Mapping(/testXXX/, Test), Mapping(/testYYY/, Test)]));

        print(o instanceof Contract);
        print(o instanceof ObjectContract);
        print(o instanceof XObjectContract)

        o.map.foreach(function(key, contract) {
                print(key+":"+contract);
        })



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

