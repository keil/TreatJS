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

//  if(_types_[funID][callID][argID]===undefined) {
//    return (_types_[funID][callID][argID]=_typeof_(val));
//  } else {
//    print("Inference Error.");
    //throw Error("Inference Error.");
    //    if(_types_[fid][i]===_typeof_(v)) {
    //      return true;
    //    } else {
    //      return (_types_[fid][i]="any"); 
    //    }
//  }
}

function _contains_ (funID, config) {
  var any = false;
  for(var callID = 0; callID < _types_[funID].length; callID++) {
    var contains = true;
    for(var argID = -1; argID < _types_[funID][callID].length; argID++) {
      // TODO, teste -1
      contains = contains && _types_[funID][callID][argID]===config[argID];
    }
    any = any || contains;
  }
}

/*

function _update_ (funID, callID, argID, val) {
  if(_types_[funID][callID][argID]===undefined) {
    return (_types_[funID][callID][argID]=_typeof_(val));
  } else {
    print("Inference Error.");
    //throw Error("Inference Error.");
    //    if(_types_[fid][i]===_typeof_(v)) {
    //      return true;
    //    } else {
    //      return (_types_[fid][i]="any"); 
    //    }
  }
}
*/

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

  for(var callID = 0; callID < _types_[funID].length; callID++) {
    _print_("_TYPES_['"+funID+"']['"+callID+"']=[];");
    for(var argID = -1; argID < _types_[funID][callID].length; argID++) {
      _print_("_TYPES_['"+fid+"']['"+callID+"']["+argID+"]='"+_types_[funID][argID]+"';");
    }
  }

  //  for(var i in _types_[fid]) {
//  for(var i = 0; i < _types_[fid].length; i++) {
//    _print_("_TYPES_['"+fid+"']["+i+"]='"+_types_[fid][i]+"';");
//  }
  //  print(_makeContract_(fid));
  //  print("");
}

_print_("//-- END: TYPES --");

quit();
