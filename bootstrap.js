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

// ___ ___ _  _ _ _ __ ___ 
//(_-</ _ \ || | '_/ _/ -_)
///__/\___/\_,_|_| \__\___|

// libraries
load("lib/lib_padding.js");

// miscellaneous extenstions
load("src/system.js");

// TreatJS debugger
load("src/debugger.js");

// TreatJS log output
//load("src/out.js"); // TODO

//              __ _                    _   _          
// __ ___ _ _  / _(_)__ _ _  _ _ _ __ _| |_(_)___ _ _  
/// _/ _ \ ' \|  _| / _` | || | '_/ _` |  _| / _ \ ' \ 
//\__\___/_||_|_| |_\__, |\_,_|_| \__,_|\__|_\___/_||_|
//                  |___/                              

load("src/treat.js");

var TreatJS = new TreatJS({
  /** Enable contract asserstion
   * (default: true)
   */assertion: true,
  /** Enable sandbox membrane 
   * (default: true)
   */membrane: true,
  /** Enable function decompilation
   * (default: true)
   */decompile: true,
  /** Enable contract normalization
   * (default: true)
   */canonicalize: true,
  /** Quit execution 
   * (default: true)
   */quitOnError: false
},{
  /** Print contract assertions
   * (default: false)
   */assert: false,
  /** Print sandbox operations
   * (default: false)
   */sandbox: false,
  /** Print statistics
   * (default: false)
   */statistic: true
});

//         _               _             
// _____ _| |_ ___ _ _  __(_)___ _ _  ___
/// -_) \ /  _/ -_) ' \(_-< / _ \ ' \(_-<
//\___/_\_\\__\___|_||_/__/_\___/_||_/__/

load("src/treat.config.js");
load("src/treat.verbose.js");

load("src/treat.statistic.js");

load("src/treat.export.js");
load("src/treat.manual.js");
load("src/treat.print.js");


// core api
load("src/core/treat.base.js");
load("src/core/treat.violation.js"); // TODO, change mode

load("src/core/treat.decompile.js");
load("src/core/treat.sandbox.js");

load("src/core/treat.logic.js");
load("src/core/treat.callback.js");

load("src/core/treat.map.js");
// TODO, experimental code
// not a core API at the moment ?
// polymorphic api 
//load("src/treat.polymorphic.js");

load("src/core/treat.contract.js");
load("src/core/treat.constructor.js");

load("src/core/treat.canonicalize.js");
load("src/core/treat.assert.js"); // TODO, cleanup/ new features

// convenience api
load("src/treat.convenience.js");

// reflection api
load("src/treat.reflect.js");

// polymorphic api
//load("src/treat.polymorphic.js"); // TODO experimental code

//            _               _      
// __ ___ _ _| |_ _ _ __ _ __| |_ ___
/// _/ _ \ ' \  _| '_/ _` / _|  _(_-<
//\__\___/_||_\__|_| \__,_\__|\__/__/

var Contract = TreatJS.build();

load("contracts/contracts.js");
load("contracts/aliases.js");

//TreatJS.Version.print();
//TreatJS.Config.print();
//TreatJS.Statistic.print();
//TreatJS.Build.print();
//TreatJS.Package.print();
//print(TreatJS.Manual.toString());
