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

// calculate type information
function _typeof_ (val) {
  return (typeof val);
}

function _TypeHandler_(funID) {
  this.apply = function(target, thisValue, args) {

    // current call configuration
    var configuration = new Array();

    // update arguments
    for(var argID = 0; argID < args.length; i++) {
      configuration[argID] = _typeof_(arg[argID]))
      //_update_(funID, callID, i, args[i]);
    }
   
    
    
    var callID = _types_[funID].length;
    print(funID + "/" + callID);
    _types_[funID][callID] = new Array();

    // update arguments
    for(var i = 0; i < args.length; i++) {
      _update_(funID, callID, i, args[i]);
    }

    var r = target.apply(thisValue, args);

    // update return
    _update_ (funID, callID, -1, r);

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

  for(var callID = 0; callID < _types_[funID].length; i++) {
    _print_("_TYPES_['"+funID+"']['"+callID+"']=[];");
    for(var argID = 0; argID < _types_[funID][callID].length; i++) {
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
