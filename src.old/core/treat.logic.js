/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014-2015, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */
(function(TreatJS) {

  function Value(t,f) {
    if(!(this instanceof Value)) return new Value(t,f);

    Object.defineProperties(this, {
      "t": {value: t},
      "f": {value: f}
    });
  }
  Value.prototype = {};

  Value.prototype.toString = function() {
    switch((this.t*2)+(this.f)) {
      case 0:
        return '<Unknown>';
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

  Value.prototype.subseteqFalse = function() {
    return (this.t===0);
  }

  Value.prototype.supseteqFalse = function() {
    return (this.f===1);
  }

  Value.prototype.subseteqTrue = function() {
    return (this.f===0);
  }

  Value.prototype.supseteqTrue = function() {
    return (this.t===1);
  }

  Value.prototype.isFalse = function() {
    return (this.t===0) && (this.f===1);
  }

  Value.prototype.isTrue = function() {
    return (this.t===1) && (this.f===o);
  }

  Value.prototype.isUnknown = function() {
    return (this.t===0) && (this.f===0);
  }

  Value.prototype.isConfict = function() {
    return (this.t===1) && (this.f===1);
  }

  // value cache
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

  function neg(v) {
    return make(v.f,v.t);
  }

  function entails(v, vp) {
    return join(convolution(v), vp);
  }

  function subseteq(v, vp) {
    return translate((v.t<=vp.t)&(v.f<=vp.f));
  }

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Logic", {});

  TreatJS.define(TreatJS.Logic, "TruthValue", Value);

  TreatJS.define(TreatJS.Logic, "and", and);
  TreatJS.define(TreatJS.Logic, "or", or);
  TreatJS.define(TreatJS.Logic, "not", not); 
  TreatJS.define(TreatJS.Logic, "implies", implies);

  TreatJS.define(TreatJS.Logic, "lesseq", lesseq);

  TreatJS.define(TreatJS.Logic, "meet", meet);
  TreatJS.define(TreatJS.Logic, "join", join);
  TreatJS.define(TreatJS.Logic, "neg", neg);
  TreatJS.define(TreatJS.Logic, "entails", entails);

  TreatJS.define(TreatJS.Logic, "subseteq", subseteq);

  TreatJS.define(TreatJS.Logic, "convolution", convolution);

  TreatJS.define(TreatJS.Logic, "make", make);
  TreatJS.define(TreatJS.Logic, "translate", translate);

  Object.defineProperties(TreatJS.Logic, {
    "Unknown": {
      value: make(0,0)
    },
    "False": {
      value: make(0,1)
    },
    "True": {
      value: make(1,0)
    },
    "Conflict": {
      value: make(1,1)
    }
  });

})(TreatJS);
