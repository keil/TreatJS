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

  var error = _.error;
  var violation = _.violation;
  var blame = _.blame;

  var and = _.Logic.and;
  var or = _.Logic.or;
  var not = _.Logic.not;
  var merge = _.Logic.merge;

  var Unknown = _.Logic.Unknown;
  var False = _.Logic.False;
  var True = _.Logic.True;
  var COnflict = _.Logic.Conflict;

  //  _____      _ _ _                _        
  // / ____|    | | | |              | |       
  //| |     __ _| | | |__   __ _  ___| | _____ 
  //| |    / _` | | | '_ \ / _` |/ __| |/ / __|
  //| |___| (_| | | | |_) | (_| | (__|   <\__ \
  // \_____\__,_|_|_|_.__/ \__,_|\___|_|\_\___/

  function Callback(callback) {
    if(!(this instanceof Callback)) return new Callback(callback);
    if(!(callback instanceof Function)) error("Wrong Callback", (new Error()).fileName, (new Error()).lineNumber);

    var sub = Unknown;
    var subMsg = "";

    function evalCallback() {
      callback(sub, "("+subMsg+")");
    }
    function updateSub(arg, msg) {
      sub = merge(sub, arg);
      subMsg = msg;
    }

    Object.defineProperties(this, {
      "subHandler": {
        get: function () { return function(arg, msg) {
          updateSub(arg, msg);
          evalCallback();
        }}}
    });

    this.toString = function() { return "[Callback]"; }
  }

  function AndCallback(callback) {
    if(!(this instanceof AndCallback)) return new AndCallback(callback);
    if(!(callback instanceof Function)) error("Wrong Callback", (new Error()).fileName, (new Error()).lineNumber);

    var left = Unknown;
    var leftMsg = "";

    var right = Unknown;
    var rightMsg = "";

    function evalCallback() {
      callback(and(left, right), "("+leftMsg+" *AND* "+rightMsg+")");
    }
    function updateLeft(arg, msg) {
      left = merge(left, arg);
      leftMsg = msg;
    }
    function updateRight(arg, msg) {
      right = merge(right, arg);
      rightMsg = msg;
    }

    Object.defineProperties(this, {
      "leftHandler": {
        get: function () {
          return function(arg, msg) {
            updateLeft(arg, msg);
            evalCallback();
          }}},
      "rightHandler": {
        get: function () { return function(arg, msg) {
          updateRight(arg, msg);
          evalCallback();
        }}}
    });

    this.toString = function() { return "[Callback]"; }
  }

  function OrCallback(callback) {
    if(!(this instanceof OrCallback)) return new OrCallback(callback);
    if(!(callback instanceof Function)) error("Wrong Callback", (new Error()).fileName, (new Error()).lineNumber);

    var left = Unknown;
    var leftMsg = "";

    var right = Unknown;
    var rightMsg = "";

    function evalCallback() {
      callback(or(left, right), "("+leftMsg+" *OR* "+rightMsg+")");
    }
    function updateLeft(arg, msg) {
      left = merge(left, arg);
      leftMsg = msg;
    }
    function updateRight(arg, msg) {
      right = merge(right, arg);
      rightMsg = msg;
    }

    Object.defineProperties(this, {
      "leftHandler": {
        get: function () { return function(arg, msg) {
          updateLeft(arg, msg);
          evalCallback();
        }}},
      "rightHandler": {
        get: function () { return function(arg, msg) {
          updateRight(arg, msg);
          evalCallback();
        }}}
    });

    this.toString = function() { return "[Callback]"; }
  }

  function NotCallback(callback) {
    if(!(this instanceof NotCallback)) return new NotCallback(callback);
    if(!(callback instanceof Function)) error("Wrong Callback", (new Error()).fileName, (new Error()).lineNumber);

    var sub = Unknown;
    var subMsg = "";

    function evalCallback() {
      callback(not(sub), "(*NOT* "+subMsg+")");
    }
    function updateSub(arg, msg) {
      sub = merge(sub, arg);
      subMsg = msg;
    }

    Object.defineProperties(this, {
      "subHandler": {
        get: function () { return function(arg, msg) {
          updateSub(arg, msg);
          evalCallback()
        }}}
    });

    this.toString = function() { return "[Callback]"; }
  }

  /*
     _.Callback = Callback;
     _.AndCallback = AndCallback;
     _.OrCallback = OrCallback;
     _.NotCallback = NotCallback;
     */
})(_);
