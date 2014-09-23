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
load("src/treat.canonicalize.js");

// convenience api
load("src/treat.convenience.js");

//              __ _                    _   _          
// __ ___ _ _  / _(_)__ _ _  _ _ _ __ _| |_(_)___ _ _  
/// _/ _ \ ' \|  _| / _` | || | '_/ _` |  _| / _ \ ' \ 
//\__\___/_||_|_| |_\__, |\_,_|_| \__,_|\__|_\___/_||_|
//                  |___/                              

// set Contract
var Contract = TreatJS.build();
TreatJS.export(this);
//TreatJS.integrate();

// set configuration
TreatJS.configure({
  assertion:true,
  membrabe:true,
  decompile:true,
  canonicalize: true 
});

// set verbose
TreatJS.verbose({
  assert:true,
  sandbox:false
});

//            _               _      
// __ ___ _ _| |_ _ _ __ _ __| |_ ___
/// _/ _ \ ' \  _| '_/ _` / _|  _(_-<
//\__\___/_||_\__|_| \__,_\__|\__/__/

load("contracts/contracts.js");
load("contracts/aliases.js");

// ==================================================

// ...


function Handler (origin) {

  this.has = function(scope, name) {
      return (name in origin);
    };

  this.get = function(target, name, receiver) {
    return origin[name];
  }

  this.set = function(target, name, value, receiver) {
    return origin[name] = value;
  }
  
  Object.defineProperty(this, "target", {
    set: function (target) {
      origin = target;
    },
    enumerable: true
  });
}

var origin = {x:1};
var handler = new Handler(origin);

var target = {x:2};
var proxy = new Proxy(target, handler);

print(proxy.x);
origin.x = 3;
print(proxy.x);

handler.target = {x:4};
print(proxy.x);



//


var x = 1;
var y = 1;

function addXY () {
 return x+y;
}

print(addXY());

function fexible (fun) {
  var scope = {};
  var handler = new Handler(scope);
  var global = new Proxy({}, handler);
  var body = "(function() {'use strict'; return " + ("(" + fun.toString() + ")") + "})();";
  var sbxed = eval("(function() { with(global) { return " + body + " }})();");

  Object.defineProperty(sbxed, "global", {
    set: function (target) {
      handler.target = target;
    },
    enumerable: true
  });

  return sbxed;
}

var addXYf = fexible(addXY);
print(addXYf());
addXYf.global = {x:2, y:2};
print(addXYf());










// ==================================================

quit();
