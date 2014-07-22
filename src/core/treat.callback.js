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

  //  ___      _ _ _             _   
  // / __|__ _| | | |__  __ _ __| |__
  //| (__/ _` | | | '_ \/ _` / _| / /
  // \___\__,_|_|_|_.__/\__,_\__|_\_\

  function Callback(handler, contract) {
    if(!(this instanceof Callback)) return new Callback(handler, contract);
    if(!(handler instanceof Function)) error("Wrong Callback Handler.", (new Error()).fileName, (new Error()).lineNumber);
    if(!(contract instanceof _.Contract)) error("Wrong Contract.", (new Error()).fileName, (new Error()).lineNumber);
  }

  Callback.prototype.toString = function() {
    return "<Callback>";
  }

  // _  _              _ _     
  //| || |__ _ _ _  __| | |___ 
  //| __ / _` | ' \/ _` | / -_)
  //|_||_\__,_|_||_\__,_|_\___|

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

  Handle.update = function(m, n) {
    return Handle(
        merge(m.caller, n.caller),
        merge(m.callee, n.callee),
        merge(m.contract, n.contract));
  }


  // ___          _    ___      _ _ _             _   
  //| _ \___  ___| |_ / __|__ _| | | |__  __ _ __| |__
  //|   / _ \/ _ \  _| (__/ _` | | | '_ \/ _` / _| / /
  //|_|_\___/\___/\__|\___\__,_|_|_|_.__/\__,_\__|_\_\

  function RootCallback(handler, contract) {
    if(!(this instanceof RootCallback)) return new RootCallback(handler, contract);
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

    __define("blame", function() {
      return contract;
    }, this);

    __getter("rootHandler", function() {
      return (function(handle) {
        root = Handle.update(root, handle);
        handler(this);    
      }).bind(this);
    }, this);
  }
  RootCallback.prototype = Callback.prototype;
  RootCallback.prototype.toString = function() {
    return "<RootCallback>";
  }

  // ___             _   _          ___      _ _ _             _   
  //| __|  _ _ _  __| |_(_)___ _ _ / __|__ _| | | |__  __ _ __| |__
  //| _| || | ' \/ _|  _| / _ \ ' \ (__/ _` | | | '_ \/ _` / _| / /
  //|_| \_,_|_||_\__|\__|_\___/_||_\___\__,_|_|_|_.__/\__,_\__|_\_\

  function FunctionCallback(handler, contract) {
    if(!(this instanceof FunctionCallback)) return new FunctionCallback(handler, contract);
    else Callback.apply(this, arguments);

    var domain =  Handle.new();
    var range = Handle.new();

    __getter("caller", function() {
      return and(domain.callee, range.caller);
    }, this);

    __getter("callee", function() {
      return and(domain.caller, implies(domain.callee, range.callee));
    }, this);

    __getter("contract", function() {
      return and(domain.contract, range.contract);
    }, this);

    __define("blame", function() {
      return contract;
    }, this);

    __getter("domainHandler", function() {
      return (function(handle) {
        domain = Handle.update(domain, handle);
        handler(this);    
      }).bind(this);
    }, this);

    __getter("rangeHandler", function() {
      return (function(handle) {
        range = Handle.update(range, handle);
        handler(this);    
      }).bind(this);
    }, this);
  }
  FunctionCallback.prototype = Callback.prototype;
  FunctionCallback.prototype.toString = function() {
    return "<FunctionCallback>";
  }

  //  ___  _     _        _    ___      _ _ _             _   
  // / _ \| |__ (_)___ __| |_ / __|__ _| | | |__  __ _ __| |__
  //| (_) | '_ \| / -_) _|  _| (__/ _` | | | '_ \/ _` / _| / /
  // \___/|_.__// \___\__|\__|\___\__,_|_|_|_.__/\__,_\__|_\_\
  //          |__/                                            

  function ObjectCallback(handler, contract) {
    if(!(this instanceof ObjectCallback)) return new ObjectCallback(handler, contract);
    else Callback.apply(this, arguments);

    var set = undefined;
    var get = Handle.new();

    __getter("caller", function() {
      return (set) ? merge(get.caller, set.callee) : get.caller;
    }, this);

    __getter("callee", function() {
      return (set) ? implies(set.callee, get.callee) : get.callee;
    }, this);

    __getter("contract", function() {
      return (set) ? and(get.contract, set.contract) : get.contract;
    }, this);

    __define("blame", function() {
      return contract;
    }, this);

    __getter("setHandler", function() {
      return (function(handle) {
        set = (set) ? Handle.update(set, handle) : handle;
        handler(this);    
      }).bind(this);
    }, this);

    __getter("getHandler", function() {
      return (function(handle) {
        get = Handle.update(get, handle);
        handler(this);    
      }).bind(this);
    }, this);
  }
  ObjectCallback.prototype = Callback.prototype;
  ObjectCallback.prototype.toString = function() {
    return "<ObjectCallback>";
  }

  // ___     _                      _   _          ___      _ _ _             _   
  //|_ _|_ _| |_ ___ _ _ ___ ___ __| |_(_)___ _ _ / __|__ _| | | |__  __ _ __| |__
  // | || ' \  _/ -_) '_(_-</ -_) _|  _| / _ \ ' \ (__/ _` | | | '_ \/ _` / _| / /
  //|___|_||_\__\___|_| /__/\___\__|\__|_\___/_||_\___\__,_|_|_|_.__/\__,_\__|_\_\

  function IntersectionCallback(handler, contract) {
    if(!(this instanceof IntersectionCallback)) return new IntersectionCallback(handler, contract);
    else Callback.apply(this, arguments);

    var left =  Handle.new();
    var right = Handle.new();

    __getter("caller", function() {
      return or(left.caller, right.caller);
    }, this);

    __getter("callee", function() {
      return and(implies(left.caller, left.callee), implies(right.caller, right.callee));
    }, this);

    __getter("contract", function() {
      return or(
        and(left.contract, implies(right.caller, right.callee)),
        and(right.contract, implies(left.caller, left.callee)));
    }, this);

    __define("blame", function() {
      return contract;
    }, this);

    __getter("leftHandler", function() {
      return (function(handle) {
        left = Handle.update(left, handle);
        handler(this);    
      }).bind(this);
    }, this);

    __getter("rightHandler", function() {
      return (function(handle) {
        right = Handle.update(right, handle);
        handler(this);    
      }).bind(this);
    }, this);
  }
  IntersectionCallback.prototype = Callback.prototype;
  IntersectionCallback.prototype.toString = function() {
    return "<IntersectionCallback>";
  }

  // _   _      _          ___      _ _ _             _   
  //| | | |_ _ (_)___ _ _ / __|__ _| | | |__  __ _ __| |__
  //| |_| | ' \| / _ \ ' \ (__/ _` | | | '_ \/ _` / _| / /
  // \___/|_||_|_\___/_||_\___\__,_|_|_|_.__/\__,_\__|_\_\

  function UnionCallback(handler, contract) {
    if(!(this instanceof UnionCallback)) return new UnionCallback(handler, contract);
    else Callback.apply(this, arguments);

    var left =  Handle.new();
    var right = Handle.new();

    __getter("caller", function() {
      return and(left.caller, right.caller);
    }, this);

    __getter("callee", function() {
      return or(implies(left.caller, left.callee), implies(right.caller, right.callee));
    }, this);

    __getter("contract", function() {
      return or(
        and(and(left.caller, right.caller), left.callee),
        and(and(left.caller, right.caller), right.callee));
    }, this);

    __define("blame", function() {
      return contract;
    }, this);

    __getter("leftHandler", function() {
      return (function(handle) {
        left = Handle.update(left, handle);
        handler(this);    
      }).bind(this);
    }, this);

    __getter("rightHandler", function() {
      return (function(handle) {
        right = Handle.update(right, handle);
        handler(this);    
      }).bind(this);
    }, this);
  }
  UnionCallback.prototype = Callback.prototype;
  UnionCallback.prototype.toString = function() {
    return "<UnionCallback>";
  }

  // _  _               _   _          ___      _ _ _             _   
  //| \| |___ __ _ __ _| |_(_)___ _ _ / __|__ _| | | |__  __ _ __| |__
  //| .` / -_) _` / _` |  _| / _ \ ' \ (__/ _` | | | '_ \/ _` / _| / /
  //|_|\_\___\__, \__,_|\__|_\___/_||_\___\__,_|_|_|_.__/\__,_\__|_\_\
  //         |___/                                                    

  function NegationCallback(handler, contract) {
    if(!(this instanceof NegationCallback)) return new NegationCallback(handler, contract);
    else Callback.apply(this, arguments);

    var sub =  Handle.new();

    __getter("caller", function() {
      return not(sub.caller);
    }, this);

    __getter("callee", function() {
      return not(sub.callee);
      return not(implies(sub.caller, sub.callee));
    }, this);

    __getter("contract", function() {
      return not(sub.contract);
    }, this);

    __define("blame", function() {
      return contract;
    }, this);

    __getter("subHandler", function() {
      return (function(handle) {
        sub = Handle.update(sub, handle);
        handler(this);    
      }).bind(this);
    }, this);
  }
  NegationCallback.prototype = Callback.prototype;
  NegationCallback.prototype.toString = function() {
    return "<NegationCallback>";
  }

  //   _           _  ___      _ _ _             _   
  //  /_\  _ _  __| |/ __|__ _| | | |__  __ _ __| |__
  // / _ \| ' \/ _` | (__/ _` | | | '_ \/ _` / _| / /
  ///_/ \_\_||_\__,_|\___\__,_|_|_|_.__/\__,_\__|_\_\

  function AndCallback(handler, contract) {
    if(!(this instanceof AndCallback)) return new AndCallback(handler, contract);
    else Callback.apply(this, arguments);

    var left =  Handle.new();
    var right = Handle.new();

    __getter("caller", function() {
      return and(left.caller, right.caller);
    }, this);

    __getter("callee", function() {
      return and(implies(left.caller, left.callee), implies(right.caller, right.callee));
    }, this);

    __getter("contract", function() {
      return and(left.contract, right.contract);
    }, this);

    __define("blame", function() {
      return contract;
    }, this);

    __getter("leftHandler", function() {
      return (function(handle) {
        left = Handle.update(left, handle);
        handler(this);    
      }).bind(this);
    }, this);

    __getter("rightHandler", function() {
      return (function(handle) {
        right = Handle.update(right, handle);
        handler(this);    
      }).bind(this);
    }, this);
  }
  AndCallback.prototype = Callback.prototype;
  AndCallback.prototype.toString = function() {
    return "<AndCallback>";
  }


  //  ___       ___      _ _ _             _   
  // / _ \ _ _ / __|__ _| | | |__  __ _ __| |__
  //| (_) | '_| (__/ _` | | | '_ \/ _` / _| / /
  // \___/|_|  \___\__,_|_|_|_.__/\__,_\__|_\_\

  function OrCallback(handler, contract) {
    if(!(this instanceof OrCallback)) return new OrCallback(handler, contract);
    else Callback.apply(this, arguments);

    var left =  Handle.new();
    var right = Handle.new();

    __getter("caller", function() {
      return or(left.caller, right.caller);
    }, this);

    __getter("callee", function() {
      return and(implies(left.caller, left.callee), implies(right.caller, right.callee));
    }, this);

    __getter("contract", function() {
      return or(left.contract, right.contract);
    }, this);

    __define("blame", function() {
      return contract;
    }, this);

    __getter("leftHandler", function() {
      return (function(handle) {
        left = Handle.update(left, handle);
        handler(this);    
      }).bind(this);
    }, this);

    __getter("rightHandler", function() {
      return (function(handle) {
        right = Handle.update(right, handle);
        handler(this);    
      }).bind(this);
    }, this);
  }
  OrCallback.prototype = Callback.prototype;
  OrCallback.prototype.toString = function() {
    return "<OrCallback>";
  }

  // _  _     _    ___      _ _ _             _   
  //| \| |___| |_ / __|__ _| | | |__  __ _ __| |__
  //| .` / _ \  _| (__/ _` | | | '_ \/ _` / _| / /
  //|_|\_\___/\__|\___\__,_|_|_|_.__/\__,_\__|_\_\

  function NotCallback(handler, contract) {
    if(!(this instanceof NotCallback)) return new NotCallback(handler, contract);
    else Callback.apply(this, arguments);

    var sub =  Handle.new();

    __getter("caller", function() {
      return not(sub.caller);
    }, this);

    __getter("callee", function() {
      return not(sub.callee);
    }, this);

    __getter("contract", function() {
      return not(sub.contract);
    }, this);

    __define("blame", function() {
      return contract;
    }, this);

    __getter("subHandler", function() {
      return (function(handle) {
        sub = Handle.update(sub, handle);
        handler(this);    
      }).bind(this);
    }, this);
  }
  NotCallback.prototype = Callback.prototype;
  NotCallback.prototype.toString = function() {
    return "<NotCallback>";
  }

  // TODO
  // BASE Callback

  function BaseCallback(handler, contract) {
    if(!(this instanceof BaseCallback)) return new BaseCallback(handler, contract);
    else Callback.apply(this, arguments);

    var predicate = new Handle(Unknown, Unknown, Unknown);

    __getter("caller", function() {
      return predicate.caller;
    }, this);

    __getter("callee", function() {
      return predicate.callee;
    }, this);

    __getter("contract", function() {
      return predicate.contract;
    }, this);

    __define("blame", function() {
      return contract;
    }, this);

    __getter("predicateHandler", function() {
      return (function(handle) {
        predicate = Handle.update(predicate, handle);
        handler(this);    
      }).bind(this);
    }, this);
  }
  BaseCallback.prototype = Callback.prototype;
  BaseCallback.prototype.toString = function() {
    return "<BaseCallback>";
  }

  /**
   * Callback
   */

  __define("Callback", {}, _);

  __define("Callback", {}, _.Callback);
  __define("Handle", Handle, _.Callback);

  __define("RootCallback", RootCallback, _.Callback);
  __define("BaseCallback", BaseCallback, _.Callback);
  __define("FunctionCallback", FunctionCallback, _.Callback);
  __define("ObjectCallback", ObjectCallback, _.Callback);

  __define("IntersectionCallback", IntersectionCallback, _.Callback);
  __define("UnionCallback", UnionCallback, _.Callback);
  __define("NegationCallback", NegationCallback, _.Callback);

  __define("AndCallback", AndCallback, _.Callback);
  __define("OrCallback", OrCallback, _.Callback);
  __define("NotCallback", NotCallback, _.Callback);

})(TreatJS);
