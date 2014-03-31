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


        // TODO, require contracts for pass troight
 
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

        _.construct = construct;
        _.constructWith = constructWith;

})(_);
