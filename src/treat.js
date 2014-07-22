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
function TreatJS(configuration) {
  if(!(this instanceof TreatJS)) return new TreatJS(configuration);

  this.toString = (function() { return '[[TreatJS]]'; });

  this.configure = function(configuration) {
    for(setting in configuration) {
      this.Config[setting] = configuration[setting];
    } 
  };

  this.verbose = function(configuration) {
    for(setting in configuration) {
      this.Config.Verbose[setting] = configuration[setting];
    } 
  }

  this.build = function() {
    var _ = {};

    // assert
    __define("construct", this.construct, _);
    __define("assert", this.assert, _);

    // contract
    __define("Base", this.BaseContract, _);

    __define("Function", this.FunctionContract, _);
    __define("Method", this.MethodContract, _);
    __define("Dependent", this.DependentContract, _);

    __define("Object", this.ObjectContract, _);

    __define("With", this.WithContract, _);

    __define("Union", this.UnionContract, _);
    __define("Intersection", this.IntersectionContract, _);
    __define("Negation", this.NegationContract, _);

    __define("And", this.AndContract, _);
    __define("Or", this.OrContract, _);
    __define("Not", this.NotContract, _);

    __define("Constructor", this.ContractConstructor, _);

    // convinience
    __define("AObject", this.AdvancedObjectContract, _);

    __define("AFunction", this.AdvancedFunctionContract, _);
    __define("SFunction", this.SimpleFunctionContract, _);

    __define("AMethod", this.AdvancedMethodContract, _);
    __define("SMethod", this.SimpleMethodContract, _);

    __define("SDependent", this.SimpleDependentContract, _);

    // util
    __define("StringMap", this.Map.StringMap, _);
    __define("Mapping", this.MapMapping, _);
    __define("RegExpMap", this.MapRegExpMap, _);

    return _;
  }

  // Note: Method for print output!
  // Not implemented right now.
  // this.out = function(arg) {
  // }

  // Note: Method for test cases debugging.
  // Not implemented right now.
  //this.debug = function(arg) {
  //  __define("Debugger", arg, this);
  //}
}

// TreatJS
var TreatJS = new TreatJS();
