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

// set configuration
_.configure({
   assertion:true,
   membrabe:true,
   decompile:true
   });

// set verbose
_.verbose({
  assert:false,
  sandbox:false
});

// ==================================================

load("test/blame/base.js");
load("test/blame/immediate.js");
load("test/blame/delayed.js");


load("test/blame/function.js");
//load("test/blame/dependent.js");
//load("test/blame/object.js");
//load("test/blame/method.js");

load("test/blame/intersection.js");
load("test/blame/union.js");
load("test/blame/negation.js");

load("test/blame/or.js");
load("test/blame/and.js");
load("test/blame/not.js");


quit();

// TODO
// priority test
// bug in der intersection
// delayed immediate
// code cleanup
//
// replace base contracts with its immediate result when delayed





// ==================================================
quit();



// TODO


// ==================================================

//_.assert(4711", IsNumber);

var objUnchecked = {x:4711, y:"4711", f:function(x) {return 4711;}, g:function() {return "4711";} };
var objChecked = _.assert(objUnchecked, _.AdvancedObjectContract({
  x:IsNumber,
    y:IsNumber,
    f:_.AdvancedFunctionContract([IsNumber], IsNumber),
    g:_.AdvancedFunctionContract([IsNumber], IsNumber),
}));

//objChecked.x;
//objChecked.y;

//objChecked.y = 7;
//objChecked.y = "2";
//objChecked.y;



//objChecked[0];
//
//
//objChecked.g = function(x) {return "4711";};
//objChecked.g(2);




//load("test/miscellaneous//logic.js");








// ==================================================

quit();
