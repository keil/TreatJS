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

// backup print
var print = _print_;

// load type information
load("benchmark/typedoctane/TYPES_m.js");

// TODO
function _wrapX_ (f) {
  var fid = _file_+_freshID_();
  if(_TYPES_[fid]!==undefined) {
    var contract = _makeContract_(fid);
    print("assert " + contract);
    return (new Proxy(f, {}));
    //return _.assert(f, contract);
  } else {
    return f;
  }

//  return _wrap_(f);
}

function _wrap_ (f) {
  var fid = _file_+_freshID_();
  if(_TYPES_[fid]!==undefined) {
    var contract = _makeContract_(fid);
//    print("assert " + contract);
    return _.assert(f, contract);
  } else {
    return f;
  }
}

load("benchmark/typedoctane/run.js");

function _makeTypeContract_ (t) {
  if(t == "number") return (_IsNumber_);
  else if(t == "string") return (_IsString_);
  else if(t == "boolean") return (_IsBoolean_);
  else if(t == "undefined") return (_IsUndef_);
  else if(t == "object") return (_IsObject_);
  else if(t == "function") return (_IsFunction_);
//  else if(t == "array") return (_IsArray_);
  else return (_Any_);
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
