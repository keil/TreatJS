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

function _wrap_(f) {
  var funID = _file_+_freshID_();
  if(_TYPES_[funID]!==undefined && _TYPES_[funID].length>0) {
    var contract = _makeContract_(funID);
    return Contract.assert(f, contract);
  } else {
    return f;
  }
}

// returns a base contract
function _makeBaseContract_(type) {
  if(type == "number") return (typeNumber);
  else if(type == "string") return (typeString);
  else if(type == "boolean") return (typeBoolean);
  else if(type == "undefined") return (typeUndefined);
  else if(type == "object") return (typeObject);
  else if(type == "function") return (typeFunction);
  else return Any;
}

// returns a function contract
function _makeFunctionContract_(call) {
  var args = [];
  for(var i in call) {
    if(i!=-1) {
      args[i] = _makeBaseContract_(call[i]);
    }
  }
  var domain = TreatJS.Contract.Object(args);
  var range = _makeBaseContract_(call[-1]);
  var contract = TreatJS.Contract.Function(domain, range);

  return contract;
}

// returns an intersection/alternation of function contracts
function _makeIntersectionContract_(calls) {
  if(calls.length===1) {
    var shifted = calls.shift();
    return _makeFunctionContract_(shifted);
  } else if(calls.length>1) {
    var shifted = calls.shift();
    return Contract.DIntersection(_makeFunctionContract_(shifted), _makeIntersectionContract_(calls));
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

quit();
