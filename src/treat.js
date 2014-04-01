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
(function(load, print) {

        if(print) {
                print("");
                print(" * TreatJS: Higher-Order Contracts for JavaScript");
                print(" * http://proglang.informatik.uni-freiburg.de/treatjs/");
                print("");
                print(" * Copyright (c) 2014, Proglang, University of Freiburg.");
                print(" * http://proglang.informatik.uni-freiburg.de/");
                print(" * All rights reserved.");
                print("");
                print(" * Author Matthias Keil");
                print(" * http://www.informatik.uni-freiburg.de/~keilr/");
                print("");
        }

        // libraries
        var lib = ['lib_padding.js'];
        // base source files
        var base = ['treat.system.js','treat.base.js','treat.config.js'];
        // core api
        var core = ['core/treat.violation.js','core/treat.sandbox.js','core/treat.callback.js','core/treat.contract.js','core/treat.assert.js'];
        // convenience api
        var convenience = ['treat.convenience.js'];

        function loadSource(files, base) {
                if(load) for(var i=0; i<files.length; i++) {
                        if(print) print(" * load " + base + files[i]);
                        load(base + files[i]);
                }
        }
 
        loadSource(lib, 'lib/');
        loadSource(base, 'src/');
        loadSource(core, 'src/');
        loadSource(convenience, 'src/');

})(load, print);
