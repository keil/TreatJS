/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014-2016, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */

// _    _ _                 _        
//| |  (_) |__ _ _ __ _ _ _(_)___ ___
//| |__| | '_ \ '_/ _` | '_| / -_|_-<
//|____|_|_.__/_| \__,_|_| |_\___/__/

// padding library 
load("lib/padding.js");

// _____             _      _ ___   ___      _                       
//|_   _| _ ___ __ _| |_ _ | / __| | _ \__ _| |____ __ _ __ _ ___ ___
//  | || '_/ -_) _` |  _| || \__ \ |  _/ _` | / / _/ _` / _` / -_|_-<
//  |_||_| \___\__,_|\__|\__/|___/ |_| \__,_|_\_\__\__,_\__, \___/__/
//                                                      |___/        

load("src/treat.js");

load("src/treat.prototypes.js");

/*
load("src/core/treat.base.js");
load("src/core/treat.violation.js");
load("src/core/treat.decompile.js");
load("src/core/treat.sandbox.js");
load("src/core/treat.logic.js");
load("src/core/treat.callback.js");
load("src/core/treat.map.js");
load("src/core/treat.symbol.js");
load("src/core/treat.polymorphism.js");
load("src/treat.contract.js");
load("src/treat.constructor.js");
load("src/treat.temporal.js");
load("src/treat.effect.js");
load("src/core/treat.canonicalize.js");
load("src/core/treat.assert.js");
// convenience api
load("src/treat.convenience.js");
// reflection api
load("src/treat.reflect.js");
*/


//  ___         _               _   
// / __|___ _ _| |_ _ _ __ _ __| |_ 
//| (__/ _ \ ' \  _| '_/ _` / _|  _|
// \___\___/_||_\__|_| \__,_\__|\__|
                                  
var Contract  = TreatJS.build({
  /** TreatJS evaluation semantics
   * (default: TreatJS.LAX)
   */semantics: TreatJS.LAX,
  /** Enable contract assertion
   * (default: true)
   */assertion: true,
  /** Enable sandbox membrane 
   * (default: true)
   */membrane: true,
  /** Enable function decompilation
   * (default: true)
   */decompile: true,
  /** Enable callback updates
   * (default: true)
   */callback: true,
  /** Enable predicate evaluation
   * (default: true)
   */predicate: true,
  /** Enable contract normalization
   * (default: true)
   */canonicalize: true,
  /** Quit execution 
   * (default: true)
   */quitOnError: false,
  /** Debug Mode 
   * (default: false)
   */debugmode: false,
},{
  /** Print contract assertions
   * (default: false)
   */assert: false,
  /** Print sandbox operations
   * (default: false)
   */sandbox: false,
  /** Print internal operations
   * (default: false)
   */internal: true,
  /** Print statistics
   * (default: false)
   */statistic: true 
}, out, dunit);

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
load("src/core/treat.violation.js");

load("src/core/treat.decompile.js");
load("src/core/treat.sandbox.js");

load("src/core/treat.logic.js");
load("src/core/treat.callback.js");

load("src/core/treat.map.js");
load("src/core/treat.symbol.js");
load("src/core/treat.polymorphism.js");

load("src/core/treat.contract.js");
load("src/core/treat.constructor.js");
load("src/core/treat.temporal.js");
load("src/core/treat.effect.js");

load("src/core/treat.canonicalize.js");
load("src/core/treat.assert.js");

// convenience api
load("src/treat.convenience.js");

// reflection api
load("src/treat.reflect.js");




// TreatJS log output
//load("src/out.js");






// Load files
// ...


Contract = TreatJS.buid({/* configuration */});

TreatJS.version

..





















// ___ ___ _  _ _ _ __ ___ 
//(_-</ _ \ || | '_/ _/ -_)
///__/\___/\_,_|_| \__\___|


//    _     _                           
// __| |___| |__ _  _ __ _ __ _ ___ _ _ 
/// _` / -_) '_ \ || / _` / _` / -_) '_|
//\__,_\___|_.__/\_,_\__, \__, \___|_|  
//                   |___/|___/         

var dunit = new TreatJSDebugger();

//          _             _   
// ___ _  _| |_ _ __ _  _| |_ 
/// _ \ || |  _| '_ \ || |  _|
//\___/\_,_|\__| .__/\_,_|\__|
//             |_|            

var shellout = new TreatJSShellOut();

//              __ _                    _   _          
// __ ___ _ _  / _(_)__ _ _  _ _ _ __ _| |_(_)___ _ _  
/// _/ _ \ ' \|  _| / _` | || | '_/ _` |  _| / _ \ ' \ 
//\__\___/_||_|_| |_\__, |\_,_|_| \__,_|\__|_\___/_||_|
//                  |___/                              




// _____             _      _ ___ 
//|_   _| _ ___ __ _| |_ _ | / __|
//  | || '_/ -_) _` |  _| || \__ \
//  |_||_| \___\__,_|\__|\__/|___/

load("src/treat.js");


//  ___         _               _   
// / __|___ _ _| |_ _ _ __ _ __| |_ 
//| (__/ _ \ ' \  _| '_/ _` / _|  _|
// \___\___/_||_\__|_| \__,_\__|\__|
                                  
var Contract  = TreatJS.build({
  /** TreatJS evaluation semantics
   * (default: TreatJS.LAX)
   */semantics: TreatJS.LAX,
  /** Enable contract assertion
   * (default: true)
   */assertion: true,
  /** Enable sandbox membrane 
   * (default: true)
   */membrane: true,
  /** Enable function decompilation
   * (default: true)
   */decompile: true,
  /** Enable callback updates
   * (default: true)
   */callback: true,
  /** Enable predicate evaluation
   * (default: true)
   */predicate: true,
  /** Enable contract normalization
   * (default: true)
   */canonicalize: true,
  /** Quit execution 
   * (default: true)
   */quitOnError: false,
  /** Debug Mode 
   * (default: false)
   */debugmode: false,
},{
  /** Print contract assertions
   * (default: false)
   */assert: false,
  /** Print sandbox operations
   * (default: false)
   */sandbox: false,
  /** Print internal operations
   * (default: false)
   */internal: true,
  /** Print statistics
   * (default: false)
   */statistic: true 
}, out, dunit);

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
load("src/core/treat.violation.js");

load("src/core/treat.decompile.js");
load("src/core/treat.sandbox.js");

load("src/core/treat.logic.js");
load("src/core/treat.callback.js");

load("src/core/treat.map.js");
load("src/core/treat.symbol.js");
load("src/core/treat.polymorphism.js");

load("src/core/treat.contract.js");
load("src/core/treat.constructor.js");
load("src/core/treat.temporal.js");
load("src/core/treat.effect.js");

load("src/core/treat.canonicalize.js");
load("src/core/treat.assert.js");

// convenience api
load("src/treat.convenience.js");

// reflection api
load("src/treat.reflect.js");

//            _               _      
// __ ___ _ _| |_ _ _ __ _ __| |_ ___
/// _/ _ \ ' \  _| '_/ _` / _|  _(_-<
//\__\___/_||_\__|_| \__,_\__|\__/__/


// ==================================================

// print outputs
TreatJS.Version.print();
TreatJS.Config.print();

//TreatJS.Statistic.print();
//TreatJS.Build.print();
//TreatJS.Package.print();

var WeakSet = WeakMap;
WeakSet.prototype.add = function(arg) {
  return WeakMap.prototype.set.call(this, arg, arg);
}

//print(TreatJS.Manual.toString());
