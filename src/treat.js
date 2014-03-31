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
(function(load, logger) {

        // base source files
        var base = ['treat.system.js','treat.base.js','treat.config.js'];
        // core api
        var core = ['core/treat.violation.js','core/treat.sandbox.js','core/treat.callback.js','core/treat.constructor.js','core/treat.contract.js'];

        function loadSource(files) {
                if(load) for(var i=0; i<files.length; i++) {
                        logger("@LOAD srv/" + files[i]);
                        load('src/' + files[i]);
                }
        }

       
        loadSource(base);
        loadSource(core);



        


})(load, print);



// TODO:
// debug package, mit prinbt, und log functionen

