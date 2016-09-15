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

// list of all type informations
// functionID x callID x argumentID
var _types_ = [];

// argumentID ::=
// arguments = 0 -- (lenhth-1)
// return    = -1
function _update_ (funID, config) {
  if(!_contains_(funID, config)) {
    var callID = _types_[funID].length;
    _types_[funID][callID] = config;
  }
}

var existing = new Array();

function _contains_ (funID, config) {
  var string = funID + "/";

  for(var argID = 0; argID < config.length; argID++) {
    string += config[argID] + "->";
  }
  string += config[-1];

  if(existing[string]) return true;
  else {
    existing[string]=true;
    return false;
  }
}

// calculate type information
function _typeof_ (val) {
  return (typeof val);
}

function _TypeHandler_(funID) {
  this.apply = function(target, thisValue, args) {

    // current call configuration
    var configuration = new Array();

    // set argument types
    for(var argID = 0; argID < args.length; argID++) {
      configuration[argID] = _typeof_(args[argID]);
    }

    var r = target.apply(thisValue, args);

    // set return type
    configuration[-1] = _typeof_(r);

    // update call configuration
    _update_(funID, configuration);

    return r;
  }
}

// noop-wrap 
function _wrapNoOp_ (f) {
  return f;
}

// wrap
function _wrap_ (f) {
  var fid = _file_+_freshID_();
  _types_[fid] = new Array();
  return new Proxy(f, new _TypeHandler_(fid));
}

load("benchmark/typedoctane/run.js");

_print_("//-- BEGIN: TYPES --");

_print_("");
_print_("_TYPES_=[];");
_print_("");

for(var funID in _types_) {

  // function
  _print_("_TYPES_['"+funID+"']=[];");

  if(_types_[funID]!==undefined) for(var callID = 0; callID < _types_[funID].length; callID++) {
    _print_("_TYPES_['"+funID+"']['"+callID+"']=[];");
    if(_types_[funID][callID]!==undefined) for(var argID = -1; argID < _types_[funID][callID].length; argID++) {
      _print_("_TYPES_['"+funID+"']['"+callID+"']["+argID+"]='"+_types_[funID][callID][argID]+"';");
    }
  }
}

_print_("//-- END: TYPES --");

quit();
