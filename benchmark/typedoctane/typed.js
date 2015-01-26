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
load("benchmark/typedoctane/splay_types.js"); // TODO



function _wrap_(f) {
  var funID = _file_+_freshID_();
  if(_TYPES_[funID].length>0) {
    var contract = _makeContract_(funID);
    _print_("@ASSERT " + contract); 
    return _.assert(f, contract);
  } else {
    return f;
  }
}

// returns a base contract
function _makeBaseContract_(type) {
  if(type == "number") return (typeOfNumber);
  else if(type == "string") return (typeOfString);
  else if(type == "boolean") return (typeOfBoolean);
  else if(type == "undefined") return (typeOfUndefined);
  else if(type == "object") return (typeOfObject);
  else if(type == "function") return (typeOfFunction);
  else throw Error("Undefined Type");
}

// returns a function contract
function _makeFunctionContract_(call) {
  var args = [];
  for(var i in call) {
    if(i!=-1) {
      args[i] = _makeBaseContract_(call[i]);
    }
  }
  var map = _.Map.StringMap(args);
  var domain = _.ObjectContract(map);
  var range = _makeBaseContract_(call[-1]);
  var contract = _.FunctionContract(domain, range);

  return contract;
}

// returns an intersection of function contracts
function _makeIntersectionContract_(calls) {
  if(calls.length===1) {
    var shifted = calls.shift();
    return _makeFunctionContract_(shifted);
  } else if(calls.length>1) {
    var shifted = calls.shift();
    return Contract.Intersection(_makeFunctionContract_(shifted), _makeIntersectionContract_(calls));
  } else {
    return Any;
  }
}

// returns an intersection of function contracts
function _makeContract_ (funID) {
  var calls = _TYPES_[(funID)];
  var contract = _makeIntersectionContract_(calls);
  return contract;
}

load("benchmark/typedoctane/run.js");

quit();
