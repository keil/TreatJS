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

  function update (m , n) {
    print(m);
    print(n)
    return new Handle(
        merge(m.caller, n.caller),
        merge(m.callee, n.callee),
        merge(m.contract, n.contract)
        );
  }

  // callback - logic between handler and handle
  // handler - function called to update a callback
  // handle - payload, and the callback itself


  // TODO, new 
  //
  
    function Handle(caller, callee, contract) {
      if(!(this instanceof Handle)) return new Handle(caller, callee, contract);

      if(!(caller instanceof TruthValue)) error("Wrong TruthValue", (new Error()).fileName, (new Error()).lineNumber);
      if(!(callee instanceof TruthValue)) error("Wrong TruthValue", (new Error()).fileName, (new Error()).lineNumber);
      if(!(contract instanceof TruthValue)) error("Wrong TruthValue", (new Error()).fileName, (new Error()).lineNumber);

      __define("caller", caller, this);
      __define("callee", callee, this);
      __define("contract", contract, this);

      __define("toString", function() {
        return ("Caller"+caller+", Callee"+callee+", Contract"+contract);
      }, this);

    }

    function init() {
      return Handle(Unknown, Unknown, Unknown);

    }

    function Handler() {
    }
    Handler.prototype = Function.prototype;

    //print(new Handler() instanceof Function);



    function RootCallback(handler) {
      if(!(this instanceof RootCallback)) return new RootCallback(handler);
      if(!(handler instanceof Function)) error("Wrong Callback", (new Error()).fileName, (new Error()).lineNumber);

      var root = init();
      var callback = this;


      __getter("caller", function() {
        return root.caller;
      }, this);

      __getter("callee", function() {
        return root.callee;
      }, this);

      __getter("contract", function() {
        return root.contract;
      }, this);

      // TODO, make read only
      this.rootHandler = function(handle) {
        print("*RC: " + handle); // TODO
        root = update(root, handle);
        handler(callback);
      }

      // TODO, add contract and msg

      this.toString = function() { return "<RootCallback>"; }
    }

    // TODO
    // set prototype




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
        predicate = update(predicate, handle);
        handler(callback);
      }

      // TODO, add contract and msg

      this.toString = function() { return "<BaseCallback>"; }
    }












    function FunctionCallback(handler) {
    if(!(this instanceof FunctionCallback)) return new FunctionCallback(handler);

    // TODO, has to be of type Handler
    //if(!(handler instanceof Function)) error("Wrong Callback", (new Error()).fileName, (new Error()).lineNumber);

    var domain = new Handle(Unknown, Unknown, Unknown);
    var range = new Handle(Unknown, Unknown, Unknown);

    var callback = this;

    __getter("caller", function() {
      return domain.callee;
    }, this);

    __getter("callee", function() {
      // TODO, definition is wrong
      return implies(domain.callee, range.contract);
    }, this);

     __getter("contract", function() {
      return and(domain.contract, range.contract);
    }, this);


    // TODO, make read only
    this.domainHandler = function(handle) {
      print("*FCd: " + handle); // TODO

      domain = update(domain, handle);

      print( "2452345234523452345" + handler);

      handler(callback);
    }

    this.rangeHandler = function(handle) {
      print("*FCr: " + handle); // TODO
      range = update(range, handle);
      handler(callback);
    }

    // TODO, add contract and msg

    this.toString = function() { return "<FunctionCallback>"; }
  }





    function ObjectCallback(handler) {
    if(!(this instanceof ObjectCallback)) return new ObjectCallback(handler);
    if(!(handler instanceof Function)) error("Wrong Callback", (new Error()).fileName, (new Error()).lineNumber);

    var domain = new Handle(Unknown, Unknown, Unknown);
    var range = new Handle(Unknown, Unknown, Unknown);

    var callback = this;

    __getter("caller", function() {
      return domain.callee;
    }, this);

    __getter("callee", function() {
      // TODO, definition is wrong
      return implies(domain.callee, range.contract);
    }, this);

     __getter("contract", function() {
      return and(domain.contract, range.contract);
    }, this);

     // TODO
     function makeHandle() {
       return new Handle(this.caller, this.callee, this.contract);
     }



    // TODO, make read only
    this.domainHandler = function(handle) {
            print("*OCd: " + handle); // TODO
      domain = update(domain, handle);
       handler(callback);
//      print("@@@@@@@@@@@@@ " + makeHandle.apply(callback));
//      handler(makeHandle.apply(callback));
    }

    this.rangeHandler = function(handle) {
            print("*OCr: " + handle); // TODO
      range = update(range, handle);
       print("@@@@@@@@@@@@@ " + makeHandle.apply(callback));
//
      handler(callback);
//      handler(makeHandle.apply(callback));
    }

    // TODO, add contract and msg

    this.toString = function() { return "<ObjectCallback>"; }
  }

__define("XCallback", {}, _);

__define("RootCallback", RootCallback, _.XCallback);
__define("BaseCallback", BaseCallback, _.XCallback);
__define("FunctionCallback", FunctionCallback, _.XCallback);
__define("ObjectCallback", ObjectCallback, _.XCallback);

__define("Handle", Handle, _.XCallback);




  /**
   * Callback
   */

  __define("Callback", {}, _);

  __define("Callback", Callback, _.Callback);
  __define("AndCallback", AndCallback, _.Callback);
  __define("OrCallback", OrCallback, _.Callback);
  __define("NotCallback", NotCallback, _.Callback);

})(_);
