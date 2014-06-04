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
load("src/shell.js");
load("test/contracts.js");

//  makes TreatJS available under $
//  Note: required to run the testcases
var $ = _ ;

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


var _types_ = [];

// 0--(lenhth-1) arguments
// -1 return
function _update_ (fid, i, v) {
  if(_types_[fid][i]===undefined) {
      return (_types_[fid][i]=_typeof_(v));
  } else {
    if(_types_[fid][i]===_typeof_(v)) {
      return true;
    } else {
      return (_types_[fid][i]="any");
    }
  }
}

function _typeof_ (v) {
  if(v instanceof Array) return "array";
  else return (typeof v);
}



function _TypeHandler_(fid) {
  this.apply = function(target, thisValue, args) {
    for(i in args) {
      _update_ (fid, i, args[i]);
    }
//    for(i in args) {
//      print("argument#" + i + "/" + fid + " typeof " + (typeof args[i]));
//    }
    var r = target.apply(thisValue, args);
    _update_ (fid, -1, args[i]);
//    print("return" + " typeof " + (typeof r));
    return r;
  }
}

var _counter_ = 0;
function _freshID_() {
  _counter_ = (_counter_+1);
  return ("@"+_counter_);
}

function _wrap_ (f) { return f; }

function _wrap_X (f) {
  var fid = _freshID_();
  _types_[fid] = [];
  return new Proxy(f, new _TypeHandler_(fid));
}


load("benchmark/typedoctane/run.js")


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

// TODO
var _TYPES_ = _types_;

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

print("--");
for(fid in _types_) {
  for(i in _types_[fid]) {
    print("_TYPES_["+fid+"]["+i+"]="+_types_[fid][i]+";");
  }
  print(_makeContract_(fid));
  print("");
}
print("--");


quit();
