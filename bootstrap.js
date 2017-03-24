/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014-2017, Proglang, University of Freiburg.
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

load("lib/tproxy.js");
load("lib/pure.js");

// ___      _                       
//| _ \__ _| |____ __ _ __ _ ___ ___
//|  _/ _` | / / _/ _` / _` / -_|_-<
//|_| \__,_|_\_\__\__,_\__, \___/__/
//                     |___/        

load("src/treat.js");

load("src/treat.log.js");
load("src/treat.statistic.js");

load("src/treat.print.js");

load("src/treat.prototype.js");
load("src/treat.contract.js");

load("src/treat.convenience.js");
load("src/treat.experimental.js");

load("src/treat.callback.js");
load("src/treat.path.js");

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
  /* TreatJS safety level 
   * (default: TreatJS.PURE)
   */safetylevel: TreatJS.PURE,
  /** Enable contract assertion
   * (default: true)
   */assertion: true,
  /* Verbose mode
   * (default: false)
   */verbose: false,
  /* Statistics
   * (default: false)
   */statistic: false, 
  /* Log output
   * (default: null)
   */print: console.log
});
