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

//  ___         _               _   
// / __|___ _ _| |_ _ _ __ _ __| |_ 
//| (__/ _ \ ' \  _| '_/ _` / _|  _|
// \___\___/_||_\__|_| \__,_\__|\__|
                                  
var Contract  = TreatJS.build(/* Todo, confoguration */);
