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

load("lib/padding.js");

// TODO, use TransparentProxy.js library 
var TransparentProxy = TransparentProxy || Proxy;

// _____             _      _ ___   ___      _                       
//|_   _| _ ___ __ _| |_ _ | / __| | _ \__ _| |____ __ _ __ _ ___ ___
//  | || '_/ -_) _` |  _| || \__ \ |  _/ _` | / / _/ _` / _` / -_|_-<
//  |_||_| \___\__,_|\__|\__/|___/ |_| \__,_|_\_\__\__,_\__, \___/__/
//                                                      |___/        

load("src/treat.js");

load("src/treat.log.js");
load("src/treat.statistic.js");

load("src/treat.print.js");

// dump statistic
// print config / statisitc


load("src/treat.prototype.js");
load("src/treat.contract.js");

load("src/treat.callback.js");

load("src/treat.error.js");
load("src/treat.core.js");

load("src/treat.sandbox.js");

//  ___         _               _   
// / __|___ _ _| |_ _ _ __ _ __| |_ 
//| (__/ _ \ ' \  _| '_/ _` / _|  _|
// \___\___/_||_\__|_| \__,_\__|\__|
                                  
var Contract  = TreatJS.initialize({
  /* TreatJS evaluation semantics
   * (default: TreatJS.INDY)
   */semantics: TreatJS.INDY,
  /* TreatJS noninterference mode
   * (default: )
   */ 
  /** Enable contract assertion
   * (default: true)
   */assertion: true,



  /* Verbose mode
   * (default: false)
   */verbose: true,

  /* Statistics
   * (default: false)
   */statistic: true, 



  print: console.log


//  STRICT, NONE, PURE
// membrabne

// nativePassThrought

});


// function for ptiny putpur


//% assertion, instead of calling a predicate, 
//- every predicate is reute



var x = {
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
}
var y = {
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
};

