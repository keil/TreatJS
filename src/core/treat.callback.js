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
(function(TreatJTreatJS) {

  var error = TreatJS.error;
  var violation = TreatJS.violation;
  var blame = TreatJS.blame;

  var and = TreatJS.Logic.and;
  var or = TreatJS.Logic.or;
  var not = TreatJS.Logic.not;
  var implies = TreatJS.Logic.implies;
  var merge = TreatJS.Logic.merge;

  var Unknown = TreatJS.Logic.Unknown;
  var False = TreatJS.Logic.False;
  var True = TreatJS.Logic.True;
  var Conflict = TreatJS.Logic.Conflict;

  var TruthValue = TreatJS.Logic.TruthValue;

  /** count(msg)
   * @param key String
   */
  function count(key) {
    if(TreatJS.Config.Verbose.statistic) TreatJS.Statistic.inc(key);
  }

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

  function Callback(handler) {
    if(!(this instanceof Callback)) return new Callback(handler);

    if(!(handler instanceof Function)) error("Wrong Callback Handler.", (new Error()).fileName, (new Error()).lineNumber);
    //if(!(contract instanceof TreatJS.Contract)) error("Wrong Contract.", (new Error()).fileName, (new Error()).lineNumber);
    //TODO
  }
  Callback.prototype = {};
  Callback.prototype.toString = function() {
    return "[[Callback]]";
  }

  // _  _              _ _     
  //| || |__ _ _ _  __| | |___ 
  //| __ / _` | ' \/ _` | / -_)
  //|_||_\__,_|_||_\__,_|_\___|

  function Handle(caller, callee) {
    if(!(this instanceof Handle)) return new Handle(caller, callee);

    if(!(caller instanceof TruthValue)) error("Wrong TruthValue.", (new Error()).fileName, (new Error()).lineNumber);
    if(!(callee instanceof TruthValue)) error("Wrong TruthValue.", (new Error()).fileName, (new Error()).lineNumber);
    //    if(!(contract instanceof TruthValue)) error("Wrong TruthValue.", (new Error()).fileName, (new Error()).lineNumber);

    __define__("caller", caller, this);
    __define__("callee", callee, this);
  }
  Handle.prototype = {};
  Handle.prototype.toString = function() {
    return "Caller: "+this.caller+", Callee: "+this.callee;
  }

  Handle.new = function() {
    return Handle(Unknown, Unknown);
  }

  Handle.update = function(m, n) {
    count(TreatJS.Statistic.CALLBACK);

    return Handle(
        merge(m.caller, n.caller),
        merge(m.callee, n.callee)
        );
  }

  Handle.and = function(m, n) {
    return Handle(
        and(m.caller, n.caller),
        and(m.callee, n.callee)
        );
  }

  Handle.or = function(m, n) {
    return Handle(
        (m.caller.isFalse) ? n.caller = False :
        ((m.caller.isTrue) ? n.caller = True : Unknown),
        (m.callee.isFalse) ? n.callee = False :
        ((m.callee.isTrue) ? n.callee = True : Unknown)
        );
  }

  // ___          _    ___      _ _ _             _   
  //| _ \___  ___| |_ / __|__ _| | | |__  __ _ __| |__
  //|   / _ \/ _ \  _| (__/ _` | | | '_ \/ _` / _| / /
  //|_|_\___/\___/\__|\___\__,_|_|_|_.__/\__,_\__|_\_\

  function RootCallback(handler) {
    if(!(this instanceof RootCallback)) return new RootCallback(handler);
    else Callback.apply(this, arguments);

    var root = Handle.new();

    __getter__("caller", function() {
      return root.caller;
    }, this);

    __getter__("callee", function() {
      return root.callee;
    }, this);

    __define__("rootHandler", (function(handle) {
      root = Handle.update(root, handle);
      handler(this);
    }).bind(this), this);
  }
  RootCallback.prototype = Object.create(Callback.prototype);
  RootCallback.prototype.toString = function() {
    return "[[RootCallback]]";
  }

  // ___             _   _          ___      _ _ _             _   
  //| __|  _ _ _  __| |_(_)___ _ _ / __|__ _| | | |__  __ _ __| |__
  //| _| || | ' \/ _|  _| / _ \ ' \ (__/ _` | | | '_ \/ _` / _| / /
  //|_| \_,_|_||_\__|\__|_\___/_||_\___\__,_|_|_|_.__/\__,_\__|_\_\

  function FunctionCallback(handler) {
    if(!(this instanceof FunctionCallback)) return new FunctionCallback(handler);
    else Callback.apply(this, arguments);

    var domain =  Handle.new();
    var range = Handle.new();

    __getter__("caller", function() {
      return and(domain.callee, range.caller);
    }, this);

    __getter__("callee", function() {
      return and(domain.caller, implies(domain.callee, range.callee));
    }, this);

    __define__("domainHandler", (function(handle) {
      domain = Handle.update(domain, handle);
      handler(this);
    }).bind(this), this);

    __define__("rangeHandler", (function(handle) {
      range = Handle.update(range, handle);
      handler(this);    
    }).bind(this), this);
  }
  FunctionCallback.prototype = Object.create(Callback.prototype);
  FunctionCallback.prototype.toString = function() {
    return "[[FunctionCallback]]";
  }

  //  ___  _     _        _    ___      _ _ _             _   
  // / _ \| |__ (_)___ __| |_ / __|__ _| | | |__  __ _ __| |__
  //| (_) | '_ \| / -_) _|  _| (__/ _` | | | '_ \/ _` / _| / /
  // \___/|_.__// \___\__|\__|\___\__,_|_|_|_.__/\__,_\__|_\_\
  //          |__/                                            

  function PropertyCallback(handler) {
    if(!(this instanceof PropertyCallback)) return new PropertyCallback(handler);
    else Callback.apply(this, arguments);

    var set = undefined;
    var get = Handle.new();

    __getter__("caller", function() {
      return (set) ? merge(get.caller, set.callee) : get.caller;
    }, this);

    __getter__("callee", function() {
      return (set) ? implies(set.callee, get.callee) : get.callee;
    }, this);

    __define__("setHandler", (function(handle) {
      set = (set) ? Handle.update(set, handle) : handle;
      handler(this);    
    }).bind(this), this);

    __define__("getHandler", (function(handle) {
      get = Handle.update(get, handle);
      handler(this);    
    }).bind(this), this);
  }
  PropertyCallback.prototype = Object.create(Callback.prototype);
  PropertyCallback.prototype.toString = function() {
    return "[[PropertyCallback]]";
  }

  function ObjectCallback(handler) {
    if(!(this instanceof ObjectCallback)) return new ObjectCallback(handler);
    else Callback.apply(this, arguments);

    var obj = Handle(True, True, True);


    __getter__("caller", function() {
      return obj.caller;
    }, this);

    __getter__("callee", function() {
      return obj.callee;
    }, this);

    __define__("objectHandler", (function(handle) {
      obj = Handle.and(obj, handle);
      handler(this);    
    }).bind(this), this);
  }
  ObjectCallback.prototype = Object.create(Callback.prototype);
  ObjectCallback.prototype.toString = function() {
    return "[[ObjectCallback]]";
  }

  // ___     _                      _   _          ___      _ _ _             _   
  //|_ _|_ _| |_ ___ _ _ ___ ___ __| |_(_)___ _ _ / __|__ _| | | |__  __ _ __| |__
  // | || ' \  _/ -_) '_(_-</ -_) _|  _| / _ \ ' \ (__/ _` | | | '_ \/ _` / _| / /
  //|___|_||_\__\___|_| /__/\___\__|\__|_\___/_||_\___\__,_|_|_|_.__/\__,_\__|_\_\

  function IntersectionCallback(handler) {
    if(!(this instanceof IntersectionCallback)) return new IntersectionCallback(handler);
    else Callback.apply(this, arguments);

    var left =  Handle.new();
    var right = Handle.new();

    __getter__("caller", function() {
      return or(left.caller, right.caller);
    }, this);

    __getter__("callee", function() {
      return and(left.callee, right.callee);
    }, this);

    __define__("leftHandler",  (function(handle) {
      left = Handle.update(left, handle);
      handler(this);    
    }).bind(this), this);

    __define__("rightHandler", (function(handle) {
      right = Handle.update(right, handle);
      handler(this);    
    }).bind(this), this); 
  }
  IntersectionCallback.prototype = Object.create(Callback.prototype);
  IntersectionCallback.prototype.toString = function() {
    return "[[IntersectionCallback]]";
  }

  // _   _      _          ___      _ _ _             _   
  //| | | |_ _ (_)___ _ _ / __|__ _| | | |__  __ _ __| |__
  //| |_| | ' \| / _ \ ' \ (__/ _` | | | '_ \/ _` / _| / /
  // \___/|_||_|_\___/_||_\___\__,_|_|_|_.__/\__,_\__|_\_\

  function UnionCallback(handler) {
    if(!(this instanceof UnionCallback)) return new UnionCallback(handler);
    else Callback.apply(this, arguments);

    var left =  Handle.new();
    var right = Handle.new();

    __getter__("caller", function() {
      return and(left.caller, right.caller);
    }, this);

    __getter__("callee", function() {
      return or(left.callee, right.callee);
    }, this);

    __define__("leftHandler",  (function(handle) {
      left = Handle.update(left, handle);
      handler(this);    
    }).bind(this), this);

    __define__("rightHandler", (function(handle) {
      right = Handle.update(right, handle);
      handler(this);    
    }).bind(this), this); 
  }
  UnionCallback.prototype = Object.create(Callback.prototype);
  UnionCallback.prototype.toString = function() {
    return "[[UnionCallback]]";
  }

  // _  _               _   _          ___      _ _ _             _   
  //| \| |___ __ _ __ _| |_(_)___ _ _ / __|__ _| | | |__  __ _ __| |__
  //| .` / -_) _` / _` |  _| / _ \ ' \ (__/ _` | | | '_ \/ _` / _| / /
  //|_|\_\___\__, \__,_|\__|_\___/_||_\___\__,_|_|_|_.__/\__,_\__|_\_\
  //         |___/                                                    

  function NegationCallback(handler) {
    if(!(this instanceof NegationCallback)) return new NegationCallback(handler);
    else Callback.apply(this, arguments);

    var sub =  Handle.new();

    __getter__("caller", function() {
      return sub.caller;
    }, this);

    __getter__("callee", function() {
      //return not(sub.callee))
      return implies(sub.caller, not(sub.callee));
    }, this);

    __define__("subHandler", (function(handle) {
      sub = Handle.update(sub, handle);
      handler(this);    
    }).bind(this), this);
  }
  NegationCallback.prototype = Object.create(Callback.prototype);
  NegationCallback.prototype.toString = function() {
    return "[[NegationCallback]]";
  }

  //   _           _  ___      _ _ _             _   
  //  /_\  _ _  __| |/ __|__ _| | | |__  __ _ __| |__
  // / _ \| ' \/ _` | (__/ _` | | | '_ \/ _` / _| / /
  ///_/ \_\_||_\__,_|\___\__,_|_|_|_.__/\__,_\__|_\_\

  function AndCallback(handler) {
    if(!(this instanceof AndCallback)) return new AndCallback(handler);
    else Callback.apply(this, arguments);

    var left =  Handle.new();
    var right = Handle.new();

    __getter__("caller", function() {
      return and(left.caller, right.caller);
    }, this);

    __getter__("callee", function() {
      return and(implies(left.caller, left.callee), implies(right.caller, right.callee))
      //return implies(and(left.caller, right.caller), and(left.callee, right.callee));
      //TODO
      //return and(left.callee, right.callee);
    }, this);

    __define__("leftHandler",  (function(handle) {
      left = Handle.update(left, handle);
      handler(this);    
    }).bind(this), this);

    __define__("rightHandler", (function(handle) {
      right = Handle.update(right, handle);
      handler(this);    
    }).bind(this), this); 
  }
  AndCallback.prototype = Object.create(Callback.prototype);
  AndCallback.prototype.toString = function() {
    return "[[AndCallback]]";
  }

  //  ___       ___      _ _ _             _   
  // / _ \ _ _ / __|__ _| | | |__  __ _ __| |__
  //| (_) | '_| (__/ _` | | | '_ \/ _` / _| / /
  // \___/|_|  \___\__,_|_|_|_.__/\__,_\__|_\_\

  function OrCallback(handler) {
    if(!(this instanceof OrCallback)) return new OrCallback(handler);
    else Callback.apply(this, arguments);

    var left =  Handle.new();
    var right = Handle.new();

    __getter__("caller", function() {
      return or(left.caller, right.caller);
    }, this);

    __getter__("callee", function() {
      return implies(or(left.caller, right.caller), or(and(left.caller, left.callee), and(right.caller, right.callee)));
    }, this);

    __define__("leftHandler",  (function(handle) {
      left = Handle.update(left, handle);
      handler(this);    
    }).bind(this), this);

    __define__("rightHandler", (function(handle) {
      right = Handle.update(right, handle);
      handler(this);    
    }).bind(this), this); 
  }
  OrCallback.prototype = Object.create(Callback.prototype);
  OrCallback.prototype.toString = function() {
    return "[[OrCallback]]";
  }

  // _  _     _    ___      _ _ _             _   
  //| \| |___| |_ / __|__ _| | | |__  __ _ __| |__
  //| .` / _ \  _| (__/ _` | | | '_ \/ _` / _| / /
  //|_|\_\___/\__|\___\__,_|_|_|_.__/\__,_\__|_\_\

  function NotCallback(handler) {
    if(!(this instanceof NotCallback)) return new NotCallback(handler);
    else Callback.apply(this, arguments);

    var sub =  Handle.new();

    __getter__("caller", function() {
      return True; 
    }, this);

    __getter__("callee", function() {
      return True;
      /*print("@@" + sub.caller);
        print("$$" + sub.callee);
        print("%%" + not(sub.callee));
      //return implies(sub.caller, not(sub.callee));
      return or(not(sub.caller), not(sub.callee));
      return not(and(sub.caller, sub.callee));*/
    }, this);

    __define__("subHandler", (function(handle) {
      sub = Handle.update(sub, handle);
      handler(this);    
    }).bind(this), this);
  }
  NotCallback.prototype = Object.create(Callback.prototype);
  NotCallback.prototype.toString = function() {
    return "<NotCallback>";
  }

  function BaseCallback(handler) {
    if(!(this instanceof BaseCallback)) return new BaseCallback(handler);
    else Callback.apply(this, arguments);

    var predicate = new Handle(Unknown, Unknown, Unknown);

    __getter__("caller", function() {
      return predicate.caller;
    }, this);

    __getter__("callee", function() {
      return predicate.callee;
    }, this);

    __define__("predicateHandler", (function(handle) {
      predicate = Handle.update(predicate, handle);
      handler(this);    
    }).bind(this), this);
  }
  BaseCallback.prototype = Object.create(Callback.prototype);
  BaseCallback.prototype.toString = function() {
    return "[[BaseCallback]]";
  }

  /**
   * export Callback
   */

  __define__("Callback", {}, TreatJS);

  __define__("Callback", Callback, TreatJS.Callback);
  __define__("Handle", Handle, TreatJS.Callback);

  __define__("RootCallback", RootCallback, TreatJS.Callback);
  __define__("BaseCallback", BaseCallback, TreatJS.Callback);
  __define__("FunctionCallback", FunctionCallback, TreatJS.Callback);
  __define__("ObjectCallback", ObjectCallback, TreatJS.Callback);
  __define__("PropertyCallback", PropertyCallback, TreatJS.Callback);

  __define__("IntersectionCallback", IntersectionCallback, TreatJS.Callback);
  __define__("UnionCallback", UnionCallback, TreatJS.Callback);
  __define__("NegationCallback", NegationCallback, TreatJS.Callback);

  __define__("AndCallback", AndCallback, TreatJS.Callback);
  __define__("OrCallback", OrCallback, TreatJS.Callback);
  __define__("NotCallback", NotCallback, TreatJS.Callback);

})(TreatJS);
