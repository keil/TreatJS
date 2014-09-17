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

    __define("With", this.With, _);

    __define("Union", this.Union, _);
    __define("Intersection", this.Intersection, _);
    __define("Negation", this.Negation, _);

    __define("And", this.And, _);
    __define("Or", this.Or, _);
    __define("Not", this.Not, _);

    __define("Constructor", this.Constructor, _);

    // convinience
    __define("AObject", this.AdvancedObjectContract, _);

    __define("AFunction", this.AdvancedFunctionContract, _);
    __define("SFunction", this.SimpleFunctionContract, _);

    __define("AMethod", this.AdvancedMethodContract, _);
    __define("SMethod", this.SimpleMethodContract, _);

    __define("SDependent", this.SimpleDependentContract, _);

    // util
    __define("StringMap", this.Map.StringMap, _);
    __define("Mapping", this.Map.Mapping, _);
    __define("RegExpMap", this.MapRegExpMap, _);

    return _;
  }

  this.export = function(target, prefix, suffix) {
    prefix = (prefix===undefined) ? "__" : prefix;
    suffix = (suffix===undefined) ? "__" : suffix;

    // assert
    __define(prefix + "construct" + suffix, this.construct, target);
    __define(prefix + "assert" + suffix, this.assert, target);

    // contract
    __define(prefix + "Base" + suffix, this.BaseContract, target);

    __define(prefix + "Function" + suffix, this.FunctionContract, target);
    __define(prefix + "Method" + suffix, this.MethodContract, target);
    __define(prefix + "Dependent" + suffix, this.DependentContract, target);

    __define(prefix + "Object" + suffix, this.ObjectContract, target);

    __define(prefix + "With" + suffix, this.With, target);

    __define(prefix + "Union" + suffix, this.Union, target);
    __define(prefix + "Intersection" + suffix, this.Intersection, target);
    __define(prefix + "Negation" + suffix, this.Negation, target);

    __define(prefix + "And" + suffix, this.And, target);
    __define(prefix + "Or" + suffix, this.Or, target);
    __define(prefix + "Not" + suffix, this.Not, target);

    __define(prefix + "Constructor" + suffix, this.Constructor, target);

    // convinience
    __define(prefix + "AObject" + suffix, this.AdvancedObjectContract, target);

    __define(prefix + "AFunction" + suffix, this.AdvancedFunctionContract, target);
    __define(prefix + "SFunction" + suffix, this.SimpleFunctionContract, target);

    __define(prefix + "AMethod" + suffix, this.AdvancedMethodContract, target);
    __define(prefix + "SMethod" + suffix, this.SimpleMethodContract, target);

    __define(prefix + "SDependent" + suffix, this.SimpleDependentContract, target);

    // util
    __define(prefix + "StringMap" + suffix, this.Map.StringMap, target);
    __define(prefix + "Mapping" + suffix, this.Map.Mapping, target);
    __define(prefix + "RegExpMap" + suffix, this.MapRegExpMap, target);
  }


  this.printManual = function () {
  }

  this.printContracts = function () {
    
  }




  /*
  this.integrate = function () {

    // TODO
    //var assert = this.assert;

    __define("assert", function(contarct) {
      print("@@@" + this);
      //return assert(this, contract);
    }, Function);
    //__define("assert", this.assert, Object);
  } */

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
