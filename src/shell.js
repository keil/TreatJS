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
                print("  _____             _      _ ___ ");
                print(" |_   _| _ ___ __ _| |_ _ | / __|");
                print("   | || '_/ -_) _` |  _| || \\__ \\");
                print("   |_||_| \\___\\__,_|\\__|\\__/|___/");
                print("                                 ");

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
        var base = ['treat.js','treat.system.js','treat.base.js','treat.config.js'];
        // core api
        var core = ['core/treat.violation.js','core/treat.sandbox.js','core/treat.callback.js','core/treat.contract.js','treat.convenience.js','core/treat.assert.js'];
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
        //loadSource(convenience, 'src/');

        // set configuration
        _.configure({
                assertion:true,
                membrabe:true,
                decompile:true
        });

        _.verbose({
                assert:true,
                sandbox:true
        });

        _.debug(undefined);

})(load, print);




function TreatJSDebugger() {
        if(!(this instanceof TreatJSDebugger)) return new TreatJSDebugger();

        var stack = new Array();

        this.catch = function(result) {
                stack.push(result);
        }

        this.assertTrue = function() {
                var result = stack.pop();

                if(result!==undefined && result!==true) {
                        print(new Error().stack);
                        quit();
                }

                this.clear();
        }

        this.asserFalse = function() {
                var result = stack.pop();

                if(result!==false) {
                        print(new Error().stack);
                        quit();
                }

                this.clear();
        }

        this.clear = function() {
                while(stack.length > 0) {
                        stack.pop();
                }
        }
}


function TreatJSLogger(sysout) {
        if(!(this instanceof TreatJSLogger)) return new TreatJSLogger(sysout);

        /** log(msg)
         * @param msg String message
         */ 
        this.logAssert = function(msg, target) {
                if(_.Config.Verbose.assert) {
                        __out(padding_right(msg + " ", ".", 30));
                        __blank();
                        __out(((target!=undefined)?" "+target:""));
                        __blank();
                }
        }

        /** log(msg)
         * @param msg String message
         */ 
        this.logSandbox = function(msg, target) {
                if(_.Config.Verbose.sandbox) {
                        __out(padding_right(msg + " ", ".", 30) + ((target!=undefined)?" "+target:""));
                        __blank();
                }
        }
}
