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

  var lesseq = TreatJS.Logic.lesseq;

  var meet = TreatJS.Logic.meet;
  var join = TreatJS.Logic.join;
  var neg = TreatJS.Logic.neg;
  var entails = TreatJS.Logic.entails;

  var subseteq = TreatJS.Logic.subseteq;
  var convolution = TreatJS.Logic.convolution;

  var make = TreatJS.Logic.make;
  var translate = TreatJS.Logic.translate;

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






  function Message (handle, contract) {
    if(!(this instanceof Message)) return new Message();

    this.handle = handle;
    this.contract = contract;
  }
  Message.prototype = {};
  Message.prototype.toString = function () {
    //return "[Message]"
    return this.handle + " # " + this.contract;
  }












  //  _____      _ _ _                _        
  // / ____|    | | | |              | |       
  //| |     __ _| | | |__   __ _  ___| | _____ 
  //| |    / _` | | | '_ \ / _` |/ __| |/ / __|
  //| |___| (_| | | | |_) | (_| | (__|   <\__ \
  // \_____\__,_|_|_|_.__/ \__,_|\___|_|\_\___/

  //            _        
  // __ __ _ __| |_  ___ 
  /// _/ _` / _| ' \/ -_)
  //\__\__,_\__|_||_\___|

  /*
     function Cache () {
     var store = [];

     Object.defineProperties(this, {

     "has": {value: function(handle) {
     return store[handle.hashCode] !== undefined;
     }, enumerable: true},

     "get": {value: function(handle) {
     return store[handle.hashCode];
     }, enumerable: true},

     "cache": {value: function(handle) {
     return handle;
     if(store[handle.hashCode] === undefined) {
     store[handle.hashCode] = handle;
     return handle;
     } else {
     return store[handle.hashCode];
     }
     }, enumerable: true}
     });
     }
     Cache.prototype = {};

     var cache = new Cache();
     */

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

    //Object.defineProperties(this, {
    //  "hashCode": {value: context+"/"+subject, enumerable: false}
    //});
  }
  Handle.prototype = {};

  Handle.prototype.blank = new Handle(Unknown, Unknown);

  Handle.prototype.toString = function() {
    return "Context: "+this.context+", Subject: "+this.subject;
  }

  Handle.fresh = function() {
    return new Handle(Unknown, Unknown);
  }

  //new Handle = function(context, subject, trace, backtrace) {
  //  return cache.cache(new Handle(context, subject));
  //}

  Handle.merge = function(m, n) {

    // TODO, test with predefined merge
    return new Handle(join(m.context, n.context), join(m.subject, n.subject));
  };

  /*    print("!!!" + n.trace);

  // TODO
  return n;
  */
  // TODO
  //if(m != baseline) throw Error("merge required: " + m + "(+) " + n);
  /*if(baseline === m) return n;
    else {
    return cache.cache(new Handle(join(m.context, n.context), join(m.subject, n.subject)));
    }*/
  /*
     Handle.and = function(m, n) {
     throw Error();
  //return cache.cache(new Handle(and(m.context, n.context), and(m.subject, n.subject)));
  }

  Handle.or = function(m, n) {
  throw Error();
  //return cache.cache(new Handle(or(m.context, n.context), or(m.subject, n.subject)));
  } */


  // TODO

  var blank = Handle.fresh();

  //  ___      _ _ _             _   
  // / __|__ _| | | |__  __ _ __| |__
  //| (__/ _` | | | '_ \/ _` / _| / /
  // \___\__,_|_|_|_.__/\__,_\__|_\_\

  function Callback(handler, contract) {
    if(!(this instanceof Callback)) return new Callback(handler, contract);
    if(!(handler instanceof Function)) error("Wrong Callback Handler.", (new Error()).fileName, (new Error()).lineNumber);

    // self
    var self =  Handle.fresh();

    Object.defineProperty(this, "update", {value:function(solve, handler) {
      if(TreatJS.Config.callback) {
        count(TreatJS.Statistic.CALLBACK);

        var handle = solve();
        //var stack = blame();

        if(self !== handle) {
          self = handle;
          handler(handle);
        }
      }
    }});
  }
  Callback.prototype = {};
  Callback.prototype.toString = function() {
    return "[[Callback]]";
  }

  // ___          _    ___      _ _ _             _   
  //| _ \___  ___| |_ / __|__ _| | | |__  __ _ __| |__
  //|   / _ \/ _ \  _| (__/ _` | | | '_ \/ _` / _| / /
  //|_|_\___/\___/\__|\___\__,_|_|_|_.__/\__,_\__|_\_\ 

  function RootCallback(handler, contract) {
    if(!(this instanceof RootCallback)) return new RootCallback(handler, contract);
    else Callback.apply(this, arguments);

    // children
    var root = Handle.fresh();

    // constraint
    function solve() {
      return root;
    }

    Object.defineProperty(this, "rootHandler", {value:function(handle) {
      root = handle;
      //root = Handle.merge(root, handle);
      this.update(solve, handler);
      // TODO
      //root = Handle.merge(root, handle);
      //Note: no merge required because first < false update will 
      //immediately raise a blame error
      //root = handle;
      //update();
    }.bind(this)});
  }
  RootCallback.prototype = Object.create(Callback.prototype);
  RootCallback.prototype.toString = function() {
    return "[[RootCallback]]";
  }

  //  ___         _           _     ___        _ _      _    
  // / __|___ _ _| |_ _____ _| |_  / __|_ __ _(_) |_ __| |_  
  //| (__/ _ \ ' \  _/ -_) \ /  _| \__ \ V  V / |  _/ _| ' \ 
  // \___\___/_||_\__\___/_\_\\__| |___/\_/\_/|_|\__\__|_||_|
  //                                                        
  //  ___      _ _ _             _   
  // / __|__ _| | | |__  __ _ __| |__
  //| (__/ _` | | | '_ \/ _` / _| / /
  // \___\__,_|_|_|_.__/\__,_\__|_\_\

  // TODO
  function SwitchCallback(subjectHandler, contextHandler) {
    if(!(this instanceof SwitchCallback)) return new SwitchCallback(subjectHandler, contextHandler);
    else Callback.apply(this, arguments);

    // children
    var contract = Handle.fresh();

    // constraint for context
    function calculateContext() {
      var context = contract.context;
      var subject = Unknown;
      return new Handle(context, subject);
    }

    // constraint for subject
    function calculateSubject() {
      var context = Unknown;
      var subject = contract.subject;
      return new Handle(context, subject); 
    }

    Object.defineProperty(this, "subHandler", {value:function(handle) {
      //contract = handle; // TODO
      contract = Handle.merge(contract, handle);

      // update context
      this.update(calculateContext, contextHandler);
      // update subejct
      this.update(calculateSubject, subjectHandler);

      // TODO
      //sub = Handle.merge(sub, handle);
      //Note: no merge required because first < false update will 
      //immediately raise a blame error
      //sub = handle;
      //updateContext();
      //updateSubject();
    }.bind(this)});
  }
  SwitchCallback.prototype = Object.create(Callback.prototype);
  SwitchCallback.prototype.toString = function() {
    return "[[SwitchCallback]]";
  }

  // ___             _   _          ___      _ _ _             _   
  //| __|  _ _ _  __| |_(_)___ _ _ / __|__ _| | | |__  __ _ __| |__
  //| _| || | ' \/ _|  _| / _ \ ' \ (__/ _` | | | '_ \/ _` / _| / /
  //|_| \_,_|_||_\__|\__|_\___/_||_\___\__,_|_|_|_.__/\__,_\__|_\_\

  function FunctionCallback(handler, contract, stack) {
    if(!(this instanceof FunctionCallback)) return new FunctionCallback(handler, contract, stack);
    else Callback.apply(this, arguments);

    // children
    var domain = Handle.fresh();
    var range = Handle.fresh();

    // constraint 
    function solve() {
      var context = and(domain.subject, range.context);
      var subject = and(domain.context, implies(domain.subject, range.subject));
      return new Handle(context, subject);
    }


    Object.defineProperty(this, "domainHandler", {value:function(handle, message) {
      //domain = handle;
      //domain = (domain !== handle) ? Handle.merge(domain, handle) : domain;
      domain = Handle.merge(domain, handle);
      this.update(solve, handler);

    }.bind(this)});

    Object.defineProperty(this, "rangeHandler", {value:function(handle, message) {
      //range = handle; // TODO, is merge required?
      //range = (range !== handle) ? Handle.merge(range, handle) : range;
      range = Handle.merge(range, handle);
      this.update(solve, handler);
    }.bind(this)});

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

  function PropertyCallback(handler, contract) {
    if(!(this instanceof PropertyCallback)) return new PropertyCallback(handler, contract);
    else Callback.apply(this, arguments);

    // children
    var set = undefined;
    var get = Handle.fresh();

    // constraint
    function solve() {
      var context = (set) ? join(get.context, set.subject) : get.context;
      var subject = (set) ? implies(set.subject, get.subject) : get.subject;

      return new Handle(context, subject);
    }

    Object.defineProperty(this, "setHandler", {value:function(handle) {
     set = handle;
      //set : (set) ? Handle.merge(set, handle) : handle;
            this.update(solve, handler);

            // TODO, new definition required
            // TODO
            //set = (set) ? Handle.merge(set, handle) : handle;
            //Note: no merge required because first < false update will 
            //immediately raise a blame error
            //set = handle;
            //this.update(solve, handler);

    }.bind(this)});

    Object.defineProperty(this, "getHandler", {value:function(handle) {
      get = handle;
      //get = Handle.merge(get, handle);
      this.update(solve, handler);
      // TODO
      //get = Handle.merge(get, handle);
      //Note: no merge required because first < false update will 
      //immediately raise a blame error
      //get = handle;
      //update();
      }.bind(this)});

  }
  PropertyCallback.prototype = Object.create(Callback.prototype);
  PropertyCallback.prototype.toString = function() {
    return "[[PropertyCallback]]";
  }

  function ObjectCallback(handler, contract) {
    if(!(this instanceof ObjectCallback)) return new ObjectCallback(handler, contract);
    else Callback.apply(this, arguments);

    // children
    var properties = Handle.fresh();

    function solve() {
      /* var context = obj.context;
         var subject = obj.subject;
         return new Handle(context, subject); */

      // TODO
      return properties; 
    }

    Object.defineProperty(this, "objectHandler", {value:function(handle) {
     //proeprties = handle; // TODO
      properties = Handle.merge(properties, handle);
      this.update(solve, handler);

      //obj = Handle.and(obj, handle);
      //Note: no merge required because first < false update will 
      //immediately raise a blame error
      //obj = handle;
      //update();
    }.bind(this)});
  }
  ObjectCallback.prototype = Object.create(Callback.prototype);
  ObjectCallback.prototype.toString = function() {
    return "[[ObjectCallback]]";
  }

  // ___     _                      _   _          ___      _ _ _             _   
  //|_ _|_ _| |_ ___ _ _ ___ ___ __| |_(_)___ _ _ / __|__ _| | | |__  __ _ __| |__
  // | || ' \  _/ -_) '_(_-</ -_) _|  _| / _ \ ' \ (__/ _` | | | '_ \/ _` / _| / /
  //|___|_||_\__\___|_| /__/\___\__|\__|_\___/_||_\___\__,_|_|_|_.__/\__,_\__|_\_\

  function IntersectionCallback(handler, contract) {
    if(!(this instanceof IntersectionCallback)) return new IntersectionCallback(handler, contract);
    else Callback.apply(this, arguments);

    // children
    var left =  Handle.fresh();
    var right = Handle.fresh();

    // constraint
    function solve() {
      var context = or(left.context, right.context);
      var subject = and(left.subject, right.subject);

      return new Handle(context, subject);
    }

    Object.defineProperty(this, "leftHandler", {value:function(handle) {
      left = Handle.merge(left, handle);
      this.update(solve, handler);
    }.bind(this)});

    Object.defineProperty(this, "rightHandler", {value:function(handle) {
      right = Handle.merge(right, handle);
      this.update(solve, handler);
    }.bind(this)});
  }
  IntersectionCallback.prototype = Object.create(Callback.prototype);
  IntersectionCallback.prototype.toString = function() {
    return "[[IntersectionCallback]]";
  }

  // _   _      _          ___      _ _ _             _   
  //| | | |_ _ (_)___ _ _ / __|__ _| | | |__  __ _ __| |__
  //| |_| | ' \| / _ \ ' \ (__/ _` | | | '_ \/ _` / _| / /
  // \___/|_||_|_\___/_||_\___\__,_|_|_|_.__/\__,_\__|_\_\

  function UnionCallback(handler, contract) {
    if(!(this instanceof UnionCallback)) return new UnionCallback(handler, contract);
    else Callback.apply(this, arguments);

    // children
    var left =  Handle.fresh();
    var right = Handle.fresh();

    // constraint
    function solve() {
      var context = and(left.context, right.context);
      var subject = or(left.subject, right.subject);

      return new Handle(context, subject);
    }

    Object.defineProperty(this, "leftHandler", {value:function(handle) {
      left = Handle.merge(left, handle);
      this.update(solve, handler);
    }.bind(this)});

    Object.defineProperty(this, "rightHandler", {value:function(handle) {
      right = Handle.merge(right, handle);
      this.update(solve, handler);
    }.bind(this)});
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

  function NegationCallback(handler, contract) {
    if(!(this instanceof NegationCallback)) return new NegationCallback(handler, contract);
    else Callback.apply(this, arguments);

    // children
    var sub =  Handle.fresh();

    // constraint
    function solve() {
      var context = sub.context;
      var subject = implies(sub.context, not(sub.subject));

      return new Handle(context, subject);
    }

    Object.defineProperty(this, "subHandler", {value:function(handle) {
      sub = Handle.merge(sub, handle); 
      this.update(solve, handler);
      // TODO
      //sub = Handle.merge(sub, handle);
      //Note: no merge required because first < false update will 
      //immediately raise a blame error
      //sub = handle;
      //update();
    }.bind(this)});
  }
  NegationCallback.prototype = Object.create(Callback.prototype);
  NegationCallback.prototype.toString = function() {
    return "[[NegationCallback]]";
  }

  //   _           _  ___      _ _ _             _   
  //  /_\  _ _  __| |/ __|__ _| | | |__  __ _ __| |__
  // / _ \| ' \/ _` | (__/ _` | | | '_ \/ _` / _| / /
  ///_/ \_\_||_\__,_|\___\__,_|_|_|_.__/\__,_\__|_\_\

  function AndCallback(handler, contract) {
    if(!(this instanceof AndCallback)) return new AndCallback(handler, contract);
    else Callback.apply(this, arguments);

    // children
    var left =  Handle.fresh();
    var right = Handle.fresh();

    // constraint
    function solve() {
      var context = and(left.context, right.context);
      var subject = and(implies(left.context, left.subject), implies(right.context, right.subject));

      return new Handle(context, subject);
    }

    Object.defineProperty(this, "leftHandler", {value:function(handle) {
      left = Handle.merge(left, handle);
      this.update(solve, handler);
    }.bind(this)});

    Object.defineProperty(this, "rightHandler", {value:function(handle) {
      right = Handle.merge(right, handle);
      this.update(solve, handler);
    }.bind(this)});
  }
  AndCallback.prototype = Object.create(Callback.prototype);
  AndCallback.prototype.toString = function() {
    return "[[AndCallback]]";
  }

  //  ___       ___      _ _ _             _   
  // / _ \ _ _ / __|__ _| | | |__  __ _ __| |__
  //| (_) | '_| (__/ _` | | | '_ \/ _` / _| / /
  // \___/|_|  \___\__,_|_|_|_.__/\__,_\__|_\_\

  function OrCallback(handler, contract) {
    if(!(this instanceof OrCallback)) return new OrCallback(handler, contract);
    else Callback.apply(this, arguments);

    // children
    var left =  Handle.fresh();
    var right = Handle.fresh();

    // constraint
    function solve() {
      var context = or(left.context, right.context);
      var subject = implies(or(left.context, right.context), or(and(left.context, left.subject), and(right.context, right.subject)));

      return new Handle(context, subject);
    }

    Object.defineProperty(this, "leftHandler", {value:function(handle) {
      left = Handle.merge(left, handle);
      this.update(solve, handler);
    }.bind(this)});

    Object.defineProperty(this, "rightHandler", {value:function(handle) {
      right = Handle.merge(right, handle);
      this.update(solve, handler);
    }.bind(this)});
  }
  OrCallback.prototype = Object.create(Callback.prototype);
  OrCallback.prototype.toString = function() {
    return "[[OrCallback]]";
  }

  // _  _     _    ___      _ _ _             _   
  //| \| |___| |_ / __|__ _| | | |__  __ _ __| |__
  //| .` / _ \  _| (__/ _` | | | '_ \/ _` / _| / /
  //|_|\_\___/\__|\___\__,_|_|_|_.__/\__,_\__|_\_\

  function NotCallback(handler, contract) {
    if(!(this instanceof NotCallback)) return new NotCallback(handler, contract);
    else Callback.apply(this, arguments);

    // children
    var sub =  Handle.fresh();

    // constraint
    function solve() {
      //if(TreatJS.Config.callback) {
      // count(TreatJS.Statistic.CALLBACK);
      // TODO
      //var context = True;
      //var subject = or(not(sub.context), not(sub.subject)); 
      //var subject = implies(sub.subject, not(sub.context));
      var context = True; //not(sub.context);
      //var subject = not(implies(sub.context, sub.subject));
      //var subject = True; //implies(sub.subject, not(sub.context));
      var subject = translate(!subseteq(sub.context, True)||subseteq(sub.subject, True));
      //implies(sub.subject, neg(sub.context));
      return new Handle(context, subject);
      //}
    }

    Object.defineProperty(this, "subHandler", {value:function(handle) {
      sub = Handle.merge(sub, handle); 
      this.update(solve, handler);
      // TODO
      //sub = Handle.merge(sub, handle);
      //Note: no merge required because first < false update will 
      //immediately raise a blame error
      //sub = handle;
      //update();
    }.bind(this)});
  }
  NotCallback.prototype = Object.create(Callback.prototype);
  NotCallback.prototype.toString = function() {
    return "[[NotCallback]]";
  }

  // ___                ___      _ _ _             _   
  //| _ ) __ _ ___ ___ / __|__ _| | | |__  __ _ __| |__
  //| _ \/ _` (_-</ -_) (__/ _` | | | '_ \/ _` / _| / /
  //|___/\__,_/__/\___|\___\__,_|_|_|_.__/\__,_\__|_\_\                                                  

  function BaseCallback(handler, contract, stack) {
    if(!(this instanceof BaseCallback)) return new BaseCallback(handler, contract);
    else Callback.apply(this, arguments);

    // children
    var predicate = blank;

    // constraint
    function solve() {
      return predicate;
    }

    Object.defineProperty(this, "predicateHandler", {value:function(handle) {
      predicate = handle; 
      //predicate = Handle.merge(predicate, handle);

// TODO, mve this to the createn of callbacks

      var message = new Message(predicate, contract);

      
      //stack.push(m);
      
      this.update(solve, handler); 
    }.bind(this)});
  }
  BaseCallback.prototype = Object.create(Callback.prototype);
  BaseCallback.prototype.toString = function() {
    return "[[BaseCallback]]";
  }

  //__      ___                 ___      _ _ _             _   
  //\ \    / / |_  ___ _ _ ___ / __|__ _| | | |__  __ _ __| |__
  // \ \/\/ /| ' \/ -_) '_/ -_) (__/ _` | | | '_ \/ _` / _| / /
  //  \_/\_/ |_||_\___|_| \___|\___\__,_|_|_|_.__/\__,_\__|_\_\
                                                           
  function WhereCallback(handler, contract) {
    if(!(this instanceof WhereCallback)) return new WhereCallback(handler, contract);
    else Callback.apply(this, arguments);

    // children
    var behaviour = Handle.fresh();
    var temporal = Handle.fresh();

    // constraint
    function solve() {
      var context = and(behaviour.context, temporal.context);
      var subject = and(implies(behaviour.context, behaviour.subject), implies(temporal.context, temporal.subject)); 
      // TODO, definition of callback

      return new Handle(context, subject);
    }

    Object.defineProperty(this, "behaviourHandler", {value:function(handle) {
      behaviour = Handle.merge(behaviour, handle);
      this.update(solve, handler);
    }.bind(this)});

    Object.defineProperty(this, "temporalHandler", {value:function(handle) {
      temporal = Handle.merge(temporal, handle);
      this.update(solve, handler);
    }.bind(this)});
  }
  WhereCallback.prototype = Object.create(Callback.prototype);
  WhereCallback.prototype.toString = function() {
    return "[[WhereCallback]]";
  }

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Callback", {});

  TreatJS.define(TreatJS.Callback, "Callback", Callback);
  TreatJS.define(TreatJS.Callback, "Handle", Handle);

  TreatJS.define(TreatJS.Callback, "Root", RootCallback);
  TreatJS.define(TreatJS.Callback, "Switch", SwitchCallback);

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

  TreatJS.define(TreatJS.Callback, "Where", WhereCallback);

})(TreatJS);
