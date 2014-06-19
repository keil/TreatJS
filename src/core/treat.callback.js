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
  var implies = _.Logic.implies;
  var merge = _.Logic.merge;

  var Unknown = _.Logic.Unknown;
  var False = _.Logic.False;
  var True = _.Logic.True;
  var Conflict = _.Logic.Conflict;

  var TruthValue = _.Logic.TruthValue;


  //  _____      _ _ _                _        
  // / ____|    | | | |              | |       
  //| |     __ _| | | |__   __ _  ___| | _____ 
  //| |    / _` | | | '_ \ / _` |/ __| |/ / __|
  //| |___| (_| | | | |_) | (_| | (__|   <\__ \
  // \_____\__,_|_|_|_.__/ \__,_|\___|_|\_\___/


  /*

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

  // between
  //

  function XupdateX (m , n) {
    print(m);
    print(n)
      return new Handle(
          merge(m.caller, n.caller),
          merge(m.callee, n.callee),
          merge(m.contract, n.contract)
          );
  }

  */



  // callback - logic between handler and handle
  // handler - function called to update a callback
  // handle - payload, and the callback itself




  // TODO
  // New Implementation

  function Callback(handler) {
    if(!(this instanceof Callback)) return new Callback(handler);
    if(!(handler instanceof Function)) error("Wrong Callback Handler.", (new Error()).fileName, (new Error()).lineNumber);

  }

  // TODO, test  This
  Callback.prototype.toString = function() {
    return "<Callback>";
  }

  Callback.update = function(m, n) {
    return Handle(
        merge(m.caller, n.caller),
        merge(m.callee, n.callee),
        merge(m.contract, n.contract));
  }


  // TODO rename
  function Handle(caller, callee, contract) {
    if(!(this instanceof Handle)) return new Handle(caller, callee, contract);

    if(!(caller instanceof TruthValue)) error("Wrong TruthValue.", (new Error()).fileName, (new Error()).lineNumber);
    if(!(callee instanceof TruthValue)) error("Wrong TruthValue.", (new Error()).fileName, (new Error()).lineNumber);
    if(!(contract instanceof TruthValue)) error("Wrong TruthValue.", (new Error()).fileName, (new Error()).lineNumber);

    __define("caller", caller, this);
    __define("callee", callee, this);
    __define("contract", contract, this);

  }

  Handle.prototype.toString = function() {
    return "Caller: "+this.caller+", Callee: "+this.callee+", Contract: "+this.contract;
  }

  Handle.new = function() {
    return Handle(Unknown, Unknown, Unknown);
  }

  // TODO
  // add msg/contract for claming

  function RootCallback(handler) {
    if(!(this instanceof RootCallback)) return new RootCallback(handler);
    else Callback.apply(this, arguments);

    var root = Handle.new();

    __getter("caller", function() {
      return root.caller;
    }, this);

    __getter("callee", function() {
      return root.callee;
    }, this);

    __getter("contract", function() {
      return root.contract;
    }, this);

    __getter("rootHandler", function() {
      return (function(handle) {
        root = Callback.update(root, handle);
        handler(this);    
      }).bind(this);
    }, this);
  }
  RootCallback.prototype = Callback.prototype;
  RootCallback.prototype.toString = function() {
    return "<RootCallback>";
  }


  /*
  function BaseCallback(handler) {
    if(!(this instanceof BaseCallback)) return new BaseCallback(handler);
    if(!(handler instanceof Function)) error("Wrong Callback", (new Error()).fileName, (new Error()).lineNumber);

    var predicate = new Handle(Unknown, Unknown, Unknown);
    var callback = this;


    __getter("caller", function() {
      return predicate.caller;;
    }, this);

    __getter("callee", function() {
      return predicate.callee;
    }, this);

    __getter("contract", function() {
      return predicate.contract;
    }, this);

    // TODO, make read only
    this.predicateHandler = function(handle) {
      print("*BC: " + handle); // TODO
      predicate = Callback.update(predicate, handle);
      handler(callback);
    }

    // TODO, add contract and msg

    this.toString = function() { return "<BaseCallback>"; }
  }
  */

 // TODO, make Base callbacks tu Undefined, (true|false) .. 

  function ObjectCallback(handler) {
    if(!(this instanceof ObjectCallback)) return new ObjectCallback(handler);
    else Callback.apply(this, arguments);

    var set =  Handle.new();
    var get =  Handle.new();

    __getter("caller", function() {
      //return get.caller;
      return and(get.caller, set.contract)


      //return set.callee;
      //return and(get.caller, set.callee);
    }, this);

    __getter("callee", function() {
      return or(get.callee, not(set.contract));
//        implies(set.contract, get.callee));
      //return get.callee;
      //return and(get.callee, set.callee)

      
      //return and(get.callee, set.caller)
//      return or(get.callee, implies(set.contract, get.callee));
//       return or(get.callee, implies(not(get.callee), not(set.callee)));

//      and(get.callee, set.caller);
      //return and(domain.callee, range.callee);
      //return range.callee;
      // TODO, test this with an function
      //implies(domain.callee, range.contract);
    }, this);

    __getter("contract", function() {
      // TODO, use strict mode flag
      return get.contract;
//      return and(set.contract, get.contract);
    }, this);

    __getter("setHandler", function() {
      return (function(handle) {
        set = Callback.update(set, handle);
        handler(this);    
      }).bind(this);
    }, this);

    __getter("getHandler", function() {
      return (function(handle) {
        print("@@@ " + handle);
        print("@@@ " + get);
        get = Callback.update(get, handle);
        print("@@@ " + get);

        print("@@@ Caller: " + this.caller);
        print("@@@ Callee: " + this.callee);
        print("@@@ Contract: " + this.contract);




        handler(this);    
      }).bind(this);
    }, this);
  }
  ObjectCallback.prototype = Callback.prototype;
  ObjectCallback.prototype.toString = function() {
    return "<ObjectCallback>";
  }







  function FunctionCallback(handler) {
    if(!(this instanceof FunctionCallback)) return new FunctionCallback(handler);
    else Callback.apply(this, arguments);

    var domain =  Handle.new();
    var range = Handle.new();

    __getter("caller", function() {
      return and(domain.callee, range.caller);
    }, this);

    __getter("callee", function() {
      return and(domain.caller, range.callee);
    }, this);

    __getter("contract", function() {
      return and(domain.contract, range.contract);
    }, this);

     __getter("domainHandler", function() {
      return (function(handle) {
        domain = Callback.update(domain, handle);
        handler(this);    
      }).bind(this);
    }, this);

    __getter("rangeHandler", function() {
      return (function(handle) {
        range = Callback.update(range, handle);
        handler(this);    
      }).bind(this);
    }, this);
  }
  FunctionCallback.prototype = Callback.prototype;
  FunctionCallback.prototype.toString = function() {
    return "<FunctionCallback>";
  }









  // TODO
  __define("XCallback", {}, _);

  __define("RootCallback", RootCallback, _.XCallback);
//  __define("BaseCallback", BaseCallback, _.XCallback);
  __define("FunctionCallback", FunctionCallback, _.XCallback);
  __define("ObjectCallback", ObjectCallback, _.XCallback);

  __define("Handle", Handle, _.XCallback);




  /**
   * Callback
   */

  __define("Callback", {}, _);

  __define("Callback", {}, _.Callback);
  __define("AndCallback", {}, _.Callback);
  __define("OrCallback", {}, _.Callback);
  __define("NotCallback", {}, _.Callback);

})(_);
