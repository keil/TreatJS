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
    //return target.apply(thisValue, args);
    // TODO test
    //if(_types_[fid]!==undefined) {
    //  return target.apply(thisValue, args);
    //}
    for(var i = 0; i < args.length; i++) {
    //for(var i in args) {
//    print('update ' + i);
      _update_(fid, i, args[i]);
    }
    var r = target.apply(thisValue, args);
    _update_ (fid, -1, r);
    return r;
  }
}

// TODO
function _wrap2_ (f) {
  return f;
}

function _wrap_ (f) {
  var fid = _file_+_freshID_();
  _types_[fid] = [];
  return new Proxy(f, new _TypeHandler_(fid));
}

load("benchmark/typedoctane/run.js");

_print_("//-- BEGIN: TYPES --");

_print_("");
_print_("_TYPES_=[];");
_print_("");

for(var fid in _types_) {
  _print_("_TYPES_['"+fid+"']=[];");
  for(var i in _types_[fid]) {
    _print_("_TYPES_['"+fid+"']["+i+"]='"+_types_[fid][i]+"';");
  }
  //  print(_makeContract_(fid));
  //  print("");
}

_print_("//-- END: TYPES --");

quit();
