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
   * export Logic
   */

  __define__("Logic", {}, TreatJS);

  __define__("TruthValue", Value, TreatJS.Logic);

  __define__("and", and, TreatJS.Logic);
  __define__("or", or, TreatJS.Logic);
  __define__("not", not, TreatJS.Logic); 
  __define__("implies", implies, TreatJS.Logic);
  __define__("lesseq", lesseq, TreatJS.Logic);

  __define__("meet", meet, TreatJS.Logic);
  __define__("join", join, TreatJS.Logic);
  __define__("neg", neg, TreatJS.Logic); 
  __define__("entails", entails, TreatJS.Logic);
  __define__("subseteq", subseteq, TreatJS.Logic);

  __define__("convolution", convolution, TreatJS.Logic);

  // NOTE: deprecated
  __define__("merge", join, TreatJS.Logic);

  __define__("make", make, TreatJS.Logic);
  __define__("translate", translate, TreatJS.Logic);

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
