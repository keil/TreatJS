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

// load type information
load("benchmark/typedoctane/TYPES.js)

function _wrap_ (f) {
  var fid = _file_+_freshID_();
  var contarct = _makeContract_(fid);
  // TODO
  print("assert " = contract);
  return f;
  // TODO
  //return _.assert(f, contract);
}

load("benchmark/typedoctane/run.js");

var IsNumber = _.BaseContract(function(arg) {
  return ((typeof arg) === "number");
},"IsNumber");

var IsString = _.BaseContract(function(arg) {
  return ((typeof arg) === "string");
},"IsString");

var IsBoolean = _.BaseContract(function(arg) {
  return ((typeof arg) === "boolean");
},"IsBoolean");

var IsUndef = _.BaseContract(function(arg) {
  return (arg === undefined);
},"IsUndef");

var Any = _.BaseContract(function(arg) {
  return true; 
},"Any");

var IsObject =  _.With({Object:Object}, _.BaseContract(function(arg) {
  return (arg instanceof Object); 
},"InstanceOfObject"));

var IsFunction =  _.With({Function:Function}, _.BaseContract(function(arg) {
  return (arg instanceof Function); 
},"InstanceOfFunction"));

var IsArray = _.With({Array:Array}, _.BaseContract(function(arg) {
  return (arg instanceof Array);
},"IsArray"));

function _makeTypeContract_ (t) {
  if(t == "number") return IsNumber;
  else if(t == "string") return IsString;
  else if(t == "boolean") return IsBoolean;
  else if(t == "undefined") return IsUndef;
  else if(t == "object") return IsObject;
  else if(t == "function") return IsFunction;
  else if(t == "array") return IsArray;
  else return Any;
}

function _makeContract_(fid) {
  var types = _TYPES_[fid];

  var args = [];
  for(var i in types) {
    if(i!=-1) {
      args[i] = _makeTypeContract_(_TYPES_[fid][i]);
    }
  }

  var map = _.Map.StringMap(args);
  var domain = _.ObjectContract(map);
  var range = _makeTypeContract_(_TYPES_[fid][-1]);
  var contract = _.FunctionContract(domain, range);
  return contract;
}

quit();
