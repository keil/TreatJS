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

// base source files
load("src/out.js");
load("src/debugger.js");
load("src/treat.js");
load("src/treat.system.js");
load("src/treat.base.js");
load("src/treat.config.js");

// core api
load("src/core/treat.violation.js");
load("src/core/treat.sandbox.js");
load("src/core/treat.logic.js");
load("src/core/treat.callback.js");
load("src/core/treat.map.js");
load("src/core/treat.contract.js");
load("src/core/treat.assert.js");

// convenience api
load("src/treat.convenience.js");

//            _               _      
// __ ___ _ _| |_ _ _ __ _ __| |_ ___
/// _/ _ \ ' \  _| '_/ _` / _|  _(_-<
//\__\___/_||_\__|_| \__,_\__|\__/__/

load("test/contracts.js");

//              __ _                    _   _          
// __ ___ _ _  / _(_)__ _ _  _ _ _ __ _| |_(_)___ _ _  
/// _/ _ \ ' \|  _| / _` | || | '_/ _` |  _| / _ \ ' \ 
//\__\___/_||_|_| |_\__, |\_,_|_| \__,_|\__|_\___/_||_|
//                  |___/                              

// set Contract
var Contract = TreatJS.build();

// set configuration
TreatJS.configure({
   assertion:true,
   membrabe:true,
   decompile:true
   });

// set verbose
TreatJS.verbose({
  assert:false,
  sandbox:false
});

// ==================================================

// TODO, teste mix forms
// also with base contarcts/ flat contracts

// replace base contracts with its immediate result when delayed

(function() {

  function addUnchecked(a, b) {
    if(a==1) return "x";
    if(a==2) return false;
    return (a+b);
  }

  var union1 = _.Union(
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber),
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsString));

  var addChecked = _.assert(addUnchecked, union1);
//  addChecked(1, 1);
  //addChecked5(2, 1);
  //addChecked5(1, "a");
  addChecked(3, 1);

})(); 


/*

(function() {

  function addUnchecked(a, b) {
    if(a==1) return "x";
    if(a==2) return false;
    return (a+b);
  }

  var union1 = _.Union(
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsNumber),
    _.AdvancedFunctionContract([IsNumber, IsNumber], IsString));

  var union2 = _.Union(
    _.AdvancedFunctionContract([IsString, IsString], IsNumber),
    _.AdvancedFunctionContract([IsString, IsString], IsString));


  var addChecked = _.assert(addUnchecked, _.Intersection(union1, union2));
  addChecked(1, 1);
  addChecked(3, 1); // shoud blame callee



  //addChecked5(2, 1);
  //addChecked5(1, "a");
//  addChecked5(3, 1);

})();
*/

// ==================================================

//this["?"]={l:"<3"};

//print(this["?"].l);

//var . = 5;

//TJS.Function


// ==================================================

quit();
