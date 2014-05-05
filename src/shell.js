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

  // ___ ___ _  _ _ _ __ ___ 
  //(_-</ _ \ || | '_/ _/ -_)
  ///__/\___/\_,_|_| \__\___|

  // libraries
  var lib = ['lib_padding.js'];
  // base source files
  var base = ['out.js','debugger.js','treat.js','treat.system.js','treat.base.js','treat.config.js'];
  // core api
  var core = ['core/treat.violation.js','core/treat.sandbox.js','core/treat.logic.js','core/treat.callback.js','core/treat.map.js','core/treat.contract.js','treat.convenience.js','core/treat.assert.js'];
  // convenience api
  var convenience = ['treat.convenience.js'];

  function loadSource(files, base) {
    if(load) for(var i=0; i<files.length; i++) {
      if(print) print(" * load: " + base + files[i]);
      load(base + files[i]);
    }
  }

  loadSource(lib, 'lib/');
  loadSource(base, 'src/');
  loadSource(core, 'src/');
  //loadSource(convenience, 'src/');

  //              __ _                    _   _          
  // __ ___ _ _  / _(_)__ _ _  _ _ _ __ _| |_(_)___ _ _  
  /// _/ _ \ ' \|  _| / _` | || | '_/ _` |  _| / _ \ ' \ 
  //\__\___/_||_|_| |_\__, |\_,_|_| \__,_|\__|_\___/_||_|
  //                  |___/                              

  // set configuration
  _.configure({
    assertion:true,
    membrabe:true,
    decompile:true
  });

  // set verbose
  _.verbose({
    assert:true,
    sandbox:true
  });

  // TODO
  // var out = new TreatJSShellOut(print);
  // _.out(undefined);

  var unit = new TreatJSDebuggerUnit();
 // _.debug(unit);
//
this.assertError = unit.assertError;
this.assertNoError = unit.assertNoError;

this.assertViolation = unit.assertViolation;
this.assertNoViolation = unit.assertNoViolation;

this.assertBlame = unit.assertBlame;
this.assertNoBlame = unit.assertNoBlame;

})(load, print);
