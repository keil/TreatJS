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
(function(_) {

  function Value(x,y) {
    if(!(this instanceof Value)) return new Value(x,y);

    Object.defineProperties(this, {
      "x": {
        get: function () { 
          return x;
        }},
      "y": {
        get: function () { 
          return y;
        }}});

    this.toString = function() {
      return toString(this);
    }
  }

  var cache = [];

  function make(x,y) {
    var v = new Value(x,y);
    var key = (v.x*2)+(v.y);

    if(cache[key]===undefined) {
      cache[key] = v;
    } else {
      v = cache[key];
    }
    return v;
  }

  function toString(v) {
    switch((v.x*2)+(v.y)) {
      case 0:
        return '~Unknown~';
        break;
      case 1:
        return '~False~';
        break;
      case 2:
        return '~True~';
        break;
      case 3:
        return '~Conflict~';
        break;
    }
  }

  function not(v) {
    return make(v.y,v.x);
  }

  function and(v, vp) {
    return make((v.x&vp.x), (v.y|vp.y));
  }

  function or(v, vp) {
    return make((v.x|vp.x), (v.y&vp.y));
  }

  _.Logic={};
  _.Logic.And=and;
  _.Logic.Or=or;
  _.Logic.Not=not;

  Object.defineProperties(_.Logic, {
    "Unknown": {
      get: function () { 
        return make(0,0);
      }},
    "False": {
      get: function () { 
        return make(0,1);
      }},
    "True": {
      get: function () { 
        return make(1,0);
      }},
    "Conflict": {
      get: function () { 
        return make(1,1);
      }}
  });

})(_);
