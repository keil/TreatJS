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

  function Value(t,f) {
    if(!(this instanceof Value)) return new Value(t,f);

    Object.defineProperties(this, {
      "t": {
        get: function () { 
          return t;
        }},
      "f": {
        get: function () { 
          return f;
        }}});

    this.toString = function() {
      return toString(this);
    }

    this.isFalse = function() {
      return isFalse(this);
    }

    this.isTrue = function() {
      return isTrue(this);
    }

    this.isUnknown = function() {
      return isUnknown(this);
    }

    this.isConfict = function() {
      return isConflict(this);
    }
  }

  var cache = [];

  function make(x,y) {
    var v = new Value(x,y);
    var key = (v.t*2)+(v.f);

    if(cache[key]===undefined) {
      cache[key] = v;
    } else {
      v = cache[key];
    }
    return v;
  }

  function translate(b) {
    return b ? make(1,0) : make(0,1)
  }

  function toString(v) {
    switch((v.t*2)+(v.f)) {
      case 0:
        return '<Unknown>'
          break;
      case 1:
        return '<False>';
        break;
      case 2:
        return '<True>';
        break;
      case 3:
        return '<Conflict>';
        break;
    }
  }

  function isFalse(v) {
    return (v.f===1);
  }

  function isTrue(v) {
    return (v.t===1);
  }

  function isUnknown(v) {
    return (v.t===0) && (v.f===0);
  }

  function isConflict(v) {
    return (v.t===1) && (v.f===1);
  }

  /*
   * Convolution  
   */

  function convolution(v) {
    return make((v.t ? 0 : 1), (v.f ? 0 : 1));
  }

  /*
   * Truth  
   */

  function and(v, vp) {
    return make((v.t&vp.t), (v.f|vp.f));
  }

  function or(v, vp) {
    return make((v.t|vp.t), (v.f&vp.f));
  }

  function not(v) {
    return make(v.f,v.t);
  }

  function implies(v, vp) {
    return or(convolution(v), vp);
  }

  function lesseq(v, vp) {
    return translate((v.t<=vp.t)&(vp.f<=v.f));
  }

  /*
   * Knowledge 
   */ 

  function join(v, vp) {
    return make((v.t|vp.t), (v.f|vp.f));
  }

  function meet(v, vp) {
    return make((v.t&vp.t), (v.f&vp.f));
  }

  function neg(v, vp) {
    return make(v.f,v.t);
  }

  function entails(v, vp) {
    return join(convolution(v), vp);
  }

  function subseteq(v, vp) {
    return translate((v.t<=vp.t)&(v.f<=vp.f));
  }

  /**
   * Map
   */

  __define("Logic", {}, _);

  __define("TruthValue", Value, _.Logic);

  __define("and", and, _.Logic);
  __define("or", or, _.Logic);
  __define("not", not, _.Logic); 
  __define("implies", implies, _.Logic);
  __define("lesseq", lesseq, _.Logic);

  __define("meet", meet, _.Logic);
  __define("join", join, _.Logic);
  __define("neg", neg, _.Logic); 
  __define("entails", entails, _.Logic);
  __define("subseteq", subseteq, _.Logic);

  __define("convolution", convolution, _.Logic);

  // NOTE: deprecated
  __define("merge", join, _.Logic);

  __define("make", make, _.Logic);
  __define("translate", translate, _.Logic);

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

})(TreatJS);
