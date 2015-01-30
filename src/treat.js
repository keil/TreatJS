/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014-2015, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */

// _____             _      _ ___ 
//|_   _| _ ___ __ _| |_ _ | / __|
//  | || '_/ -_) _` |  _| || \__ \
//  |_||_| \___\__,_|\__|\__/|___/
//                                
//  ___ _     _          _    ___  _     _        _   
// / __| |___| |__  __ _| |  / _ \| |__ (_)___ __| |_ 
//| (_ | / _ \ '_ \/ _` | | | (_) | '_ \| / -_) _|  _|
// \___|_\___/_.__/\__,_|_|  \___/|_.__// \___\__|\__|
//                                    |__/            
function TreatJS(configuration, verbose, out) {
  if(!(this instanceof TreatJS)) return new TreatJS(configuration, verbose, out);

  var version = "TreatJS 1.2.16 (PoC)";

  Object.defineProperties(this, {
    "version": { value: version }
  });

  Object.defineProperties(this, {
    "configuration": { value: (configuration===undefined) ? {} : configuration }
  });

  Object.defineProperties(this, {
    "verbose": { value: (verbose===undefined) ? {} : verbose }
  });

  Object.defineProperties(this, {
    "out": { value: (out===undefined) ? {} : out }
  });
}
TreatJS.prototype = {};
TreatJS.prototype.toString = (function() { return '[[TreatJS]]'; });

TreatJS.prototype.extend = function(name, value) {
  Object.defineProperty(this, name, {
    value: value, enumerable: true
  });
}
