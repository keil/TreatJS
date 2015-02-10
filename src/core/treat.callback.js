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

  var error = TreatJS.error;
  var violation = TreatJS.violation;
  var blame = TreatJS.blame;

  var and = TreatJS.Logic.and;
  var or = TreatJS.Logic.or;
  var not = TreatJS.Logic.not;
  var implies = TreatJS.Logic.implies;
  var join = TreatJS.Logic.join;

  var Unknown = TreatJS.Logic.Unknown;
  var False = TreatJS.Logic.False;
  var True = TreatJS.Logic.True;
  var Conflict = TreatJS.Logic.Conflict;

  var TruthValue = TreatJS.Logic.TruthValue;

  /** count(msg)
   * @param key String
   */
  function count(key) {
    if(TreatJS.Verbose.statistic) TreatJS.Statistic.inc(key);
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
  }
  Callback.prototype = {};
  Callback.prototype.toString = function() {
    return "[[Callback]]";
  }

  // _  _              _ _     
  //| || |__ _ _ _  __| | |___ 
  //| __ / _` | ' \/ _` | / -_)
  //|_||_\__,_|_||_\__,_|_\___|

  function Handle(context, subject) {
    if(!(this instanceof Handle)) return new Handle(context, subject);

    if(!(context instanceof TruthValue)) error("Wrong TruthValue.", (new Error()).fileName, (new Error()).lineNumber);
    if(!(subject instanceof TruthValue)) error("Wrong TruthValue.", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "context": {value: context, enumerable: true},
      "subject": {value: subject, enumerable: true}  
    });
  }
  Handle.prototype = {};
  Handle.prototype.toString = function() {
    return "Caller: "+this.context+", Callee: "+this.subject;
  }

  Handle.fresh = function() {
    return new Handle(Unknown, Unknown);
  }

  Handle.merge = function(m, n) {
    return new Handle(
        join(m.context, n.context),
        join(m.subject, n.subject)
        );
  }

  Handle.and = function(m, n) {
    return new Handle(
        and(m.context, n.context),
        and(m.subject, n.subject)
        );
  }

  Handle.or = function(m, n) {
    return new Handle(
        or(m.context, n.context),
        or(m.subject, n.subject)
        );
  }

  // ___          _    ___      _ _ _             _   
  //| _ \___  ___| |_ / __|__ _| | | |__  __ _ __| |__
  //|   / _ \/ _ \  _| (__/ _` | | | '_ \/ _` / _| / /
  //|_|_\___/\___/\__|\___\__,_|_|_|_.__/\__,_\__|_\_\

  // TODO
  function RootCallback(handler, contractArg, subjectArg, contextArg) {
    if(!(this instanceof RootCallback)) return new RootCallback(handler, contractArg, subjectArg, contextArg);
    else Callback.apply(this, arguments);

    // TODO
    Object.defineProperties(this, {
      "contract" : { value:contractArg, enumerable:true },
      "subject" : { value:subjectArg, enumerable:true },
      "context" : { value:contextArg, enumerable:true }
    });

    var root = Handle.fresh();

    function update() {
      if(TreatJS.Config.callback) {
        count(TreatJS.Statistic.CALLBACK);
        var context = root.context;
        var subject = root.subject;
        handler(new Handle(context, subject), contractArg, subjectArg, contextArg); // TODO
      }
    }

    Object.defineProperty(this, "rootHandler", {value:function(handle) {
      root = Handle.merge(handle, handle);
      update();
    }});
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

    var domain =  Handle.fresh();
    var range = Handle.fresh();

    function update() {
      if(TreatJS.Config.callback) {
        count(TreatJS.Statistic.CALLBACK);
        var context = and(domain.subject, range.context);
        var subject = and(domain.context, implies(domain.subject, range.subject));
        handler(new Handle(context, subject));
      }
    }

    Object.defineProperty(this, "domainHandler", {value:function(handle) {
      domain = Handle.merge(domain, handle);
      update();
    }});

    Object.defineProperty(this, "rangeHandler", {value:function(handle) {
      range = Handle.merge(range, handle);
      update();
    }});

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
    var get = Handle.fresh();

    function update() {
      if(TreatJS.Config.callback) {
        count(TreatJS.Statistic.CALLBACK);
        var context = (set) ? join(get.context, set.subject) : get.context;
        var subject = (set) ? implies(set.subject, get.subject) : get.subject;
        handler(new Handle(context, subject));
      }
    }

    Object.defineProperty(this, "setHandler", {value:function(handle) {
      set = (set) ? Handle.merge(set, handle) : handle;
      update();
    }});

    Object.defineProperty(this, "getHandler", {value:function(handle) {
      get = Handle.merge(get, handle);
      update();
    }});

  }
  PropertyCallback.prototype = Object.create(Callback.prototype);
  PropertyCallback.prototype.toString = function() {
    return "[[PropertyCallback]]";
  }

  function ObjectCallback(handler) {
    if(!(this instanceof ObjectCallback)) return new ObjectCallback(handler);
    else Callback.apply(this, arguments);

    var obj = Handle(True, True, True);

    function update() {
      if(TreatJS.Config.callback) {
        count(TreatJS.Statistic.CALLBACK);
        var context = obj.context;
        var subject = obj.subject;
        handler(new Handle(context, subject));
      }
    }

    Object.defineProperty(this, "objectHandler", {value:function(handle) {
      obj = Handle.and(obj, handle);
      update();
    }});
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

    var left =  Handle.fresh();
    var right = Handle.fresh();

    function update() {
      if(TreatJS.Config.callback) {
        count(TreatJS.Statistic.CALLBACK);
        var context = or(left.context, right.context);
        var subject = and(left.subject, right.subject);
        handler(new Handle(context, subject));
      }
    }

    Object.defineProperty(this, "leftHandler", {value:function(handle) {
      left = Handle.merge(left, handle);
      update();
    }});

    Object.defineProperty(this, "rightHandler", {value:function(handle) {
      right = Handle.merge(right, handle);
      update();
    }});


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

    var left =  Handle.fresh();
    var right = Handle.fresh();

    function update() {
      if(TreatJS.Config.callback) {
        count(TreatJS.Statistic.CALLBACK);
        var context = and(left.context, right.context);
        var subject = or(left.subject, right.subject);
        handler(new Handle(context, subject));
      }
    }

    Object.defineProperty(this, "leftHandler", {value:function(handle) {
      left = Handle.merge(left, handle);
      update();
    }});

    Object.defineProperty(this, "rightHandler", {value:function(handle) {
      right = Handle.merge(right, handle);
      update();
    }});
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

    var sub =  Handle.fresh();

    function update() {
      if(TreatJS.Config.callback) {
        count(TreatJS.Statistic.CALLBACK);
        var context = sub.context;
        var subject = implies(sub.context, not(sub.subject));
        handler(new Handle(context, subject));
      }
    }

    Object.defineProperty(this, "subHandler", {value:function(handle) {
      sub = Handle.merge(sub, handle);
      update();
    }});
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

    var left =  Handle.fresh();
    var right = Handle.fresh();

    function update() {
      if(TreatJS.Config.callback) {
        count(TreatJS.Statistic.CALLBACK);
        var context = and(left.context, right.context);
        var subject = and(implies(left.context, left.subject), implies(right.context, right.subject));
        handler(new Handle(context, subject));
      }
    }

    Object.defineProperty(this, "leftHandler", {value:function(handle) {
      left = Handle.merge(left, handle);
      update();
    }});

    Object.defineProperty(this, "rightHandler", {value:function(handle) {
      right = Handle.merge(right, handle);
      update();
    }});
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

    var left =  Handle.fresh();
    var right = Handle.fresh();

    function update() {
      if(TreatJS.Config.callback) {
        count(TreatJS.Statistic.CALLBACK);
        var context = or(left.context, right.context);
        var subject = implies(or(left.context, right.context), or(and(left.context, left.subject), and(right.context, right.subject)));
        handler(new Handle(context, subject));
      }
    }

    Object.defineProperty(this, "leftHandler", {value:function(handle) {
      left = Handle.merge(left, handle);
      update();
    }});

    Object.defineProperty(this, "rightHandler", {value:function(handle) {
      right = Handle.merge(right, handle);
      update();
    }});
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

    var sub =  Handle.fresh();

    function update() {
      if(TreatJS.Config.callback) {
        count(TreatJS.Statistic.CALLBACK);
        var context = True;
        var subject = True;
        handler(new Handle(context, subject));
      }
    }

    Object.defineProperty(this, "subHandler", {value:function(handle) {
      sub = Handle.merge(sub, handle);
      update();
    }});
  }
  NotCallback.prototype = Object.create(Callback.prototype);
  NotCallback.prototype.toString = function() {
    return "[[NotCallback]]";
  }

  // ___                ___      _ _ _             _   
  //| _ ) __ _ ___ ___ / __|__ _| | | |__  __ _ __| |__
  //| _ \/ _` (_-</ -_) (__/ _` | | | '_ \/ _` / _| / /
  //|___/\__,_/__/\___|\___\__,_|_|_|_.__/\__,_\__|_\_\                                                  

  function BaseCallback(handler) {
    if(!(this instanceof BaseCallback)) return new BaseCallback(handler);
    else Callback.apply(this, arguments);

    var predicate = new Handle(Unknown, Unknown, Unknown);

    function update() {
      if(TreatJS.Config.callback) {
        count(TreatJS.Statistic.CALLBACK);
        var context = predicate.context;
        var subject = predicate.subject;
        handler(new Handle(context, subject));
      }
    }

    Object.defineProperty(this, "predicateHandler", {value:function(handle) {
      predicate = Handle.merge(predicate, handle);
      update();
    }});
  }
  BaseCallback.prototype = Object.create(Callback.prototype);
  BaseCallback.prototype.toString = function() {
    return "[[BaseCallback]]";
  }

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Callback", {});

  TreatJS.define(TreatJS.Callback, "Callback", Callback);
  TreatJS.define(TreatJS.Callback, "Handle", Handle);

  TreatJS.define(TreatJS.Callback, "Root", RootCallback);
  TreatJS.define(TreatJS.Callback, "Base", BaseCallback);
  TreatJS.define(TreatJS.Callback, "Function", FunctionCallback);
  TreatJS.define(TreatJS.Callback, "Object", ObjectCallback);
  TreatJS.define(TreatJS.Callback, "Property", PropertyCallback);

  TreatJS.define(TreatJS.Callback, "Intersection", IntersectionCallback);
  TreatJS.define(TreatJS.Callback, "Union", UnionCallback);
  TreatJS.define(TreatJS.Callback, "Negation", NegationCallback);

  TreatJS.define(TreatJS.Callback, "And", AndCallback);
  TreatJS.define(TreatJS.Callback, "Or", OrCallback);
  TreatJS.define(TreatJS.Callback, "Not", NotCallback);

})(TreatJS);
