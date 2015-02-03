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

  function Handle(caller, callee) {
    if(!(this instanceof Handle)) return new Handle(caller, callee);
    // TODO, needed ?

    if(!(caller instanceof TruthValue)) error("Wrong TruthValue.", (new Error()).fileName, (new Error()).lineNumber);
    if(!(callee instanceof TruthValue)) error("Wrong TruthValue.", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "caller": {value: caller, enumerable: true},
      "callee": {value: callee, enumerable: true}  
    });
  }
  Handle.prototype = {};
  Handle.prototype.toString = function() {
    return "Caller: "+this.caller+", Callee: "+this.callee;
  }

  Handle.fresh = function() {
    return Handle(Unknown, Unknown);
  }

  Handle.merge = function(m, n) {

    // TODO, make type Tests

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
        or(m.caller, n.caller),
        or(m.callee, n.callee)
        );

    //    return Handle(
    //        (m.caller.isFalse) ? n.caller = False : ((m.caller.isTrue) ? n.caller = True : Unknown),
    //        (m.callee.isFalse) ? n.callee = False : ((m.callee.isTrue) ? n.callee = True : Unknown)
    //        );
  }

  // ___          _    ___      _ _ _             _   
  //| _ \___  ___| |_ / __|__ _| | | |__  __ _ __| |__
  //|   / _ \/ _ \  _| (__/ _` | | | '_ \/ _` / _| / /
  //|_|_\___/\___/\__|\___\__,_|_|_|_.__/\__,_\__|_\_\

  function RootCallback(handler) {
    if(!(this instanceof RootCallback)) return new RootCallback(handler);
    else Callback.apply(this, arguments);

    var root = Handle.fresh();

    function update() {
      var caller = root.caller;
      var callee = root.callee;

      // TODO, make update
      /*handler({
        caller:caller,
        callee:callee      
      });*/

      handler(new Handle(caller, callee));
    }

    /*__getter__("caller", function() {
      return root.caller;
      }, this);

      __getter__("callee", function() {
      return root.callee;
      }, this);*/

    /*__define__("rootHandler", (function(handle) {
      root = Handle.merge(root, handle);
      handler(this);
      }).bind(this), this);*/

    Object.defineProperty(this, "rootHandler", {value:function(handle) {
      // merge child 
      root = Handle.merge(root, handle);
      
      handler({
        caller:root.caller,
        callee:root.callee      
      });
    }});
  }
  RootCallback.prototype = Object.create(Callback.prototype);
  RootCallback.prototype.toString = function() {
    return "[[RootCallback]]";
  }

  // TODO, cache handles
  // only update if differnet


  // ___             _   _          ___      _ _ _             _   
  //| __|  _ _ _  __| |_(_)___ _ _ / __|__ _| | | |__  __ _ __| |__
  //| _| || | ' \/ _|  _| / _ \ ' \ (__/ _` | | | '_ \/ _` / _| / /
  //|_| \_,_|_||_\__|\__|_\___/_||_\___\__,_|_|_|_.__/\__,_\__|_\_\

  function FunctionCallback(handler) {
    if(!(this instanceof FunctionCallback)) return new FunctionCallback(handler);
    else Callback.apply(this, arguments);

    var domain =  Handle.fresh();
    var range = Handle.fresh();

    // TODO, new Update Function
    function update() {
      var caller = and(domain.callee, range.caller);
      var callee = and(domain.caller, implies(domain.callee, range.callee));

      // TODO, make update
       /*handler({
        caller:caller,
        callee:callee      
      });*/

      handler(new Handle(caller, callee));

    }

    /*__getter__("caller", function() {
      return and(domain.callee, range.caller);
      }, this);

      __getter__("callee", function() {
      return and(domain.caller, implies(domain.callee, range.callee));
      }, this);*/


    Object.defineProperty(this, "domainHandler", {value:function(handle) {
      domain = Handle.merge(domain, handle);
      update();
      // domain=domain.merge(handler); // TODO
      //handler(this);
    }});

    Object.defineProperty(this, "rangeHandler", {value:function(handle) {
      range = Handle.merge(range, handle);
      //handler(this);
      update();
    }});


    /*    __define__("domainHandler", (function(handle) {
          domain = Handle.merge(domain, handle);
          handler(this);
          }).bind(this), this);

          __define__("rangeHandler", (function(handle) {
          range = Handle.merge(range, handle);
          handler(this);    
          }).bind(this), this);
          */
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

    // TODO, new Update Function
    function update() {
      var caller = (set) ? merge(get.caller, set.callee) : get.caller;
      var callee = (set) ? implies(set.callee, get.callee) : get.callee;

      // TODO, make update
      /*handler({
        caller:caller,
        callee:callee      
      });*/

      handler(new Handle(caller, callee));
    }




    /*__getter__("caller", function() {
      return (set) ? merge(get.caller, set.callee) : get.caller;
      }, this);

      __getter__("callee", function() {
      return (set) ? implies(set.callee, get.callee) : get.callee;
      }, this);*/

    /*__define__("setHandler", (function(handle) {
      set = (set) ? Handle.merge(set, handle) : handle;
      handler(this);    
      }).bind(this), this);

      __define__("getHandler", (function(handle) {
      get = Handle.merge(get, handle);
      handler(this);    
      }).bind(this), this);*/

    Object.defineProperty(this, "setHandler", {value:function(handle) {
      set = (set) ? Handle.merge(set, handle) : handle;
      update();
      // domain=domain.merge(handler); // TODO
      //handler(this);
    }});

    Object.defineProperty(this, "getHandler", {value:function(handle) {
      get = Handle.merge(get, handle);
      //handler(this);
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

    // TODO, new Update Function
    function update() {
      var caller = obj.caller;
      var callee = obj.callee;

      // TODO, make update
       /*handler({
        caller:caller,
        callee:callee      
      });*/

      handler(new Handle(caller, callee));

    }

    /*__getter__("caller", function() {
      return obj.caller;
      }, this);

      __getter__("callee", function() {
      return obj.callee;
      }, this);*/

    /*__define__("objectHandler", (function(handle) {
      obj = Handle.and(obj, handle);
      handler(this);    
      }).bind(this), this);*/

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

    // TODO, new Update Function
    function update() {
      var caller = or(left.caller, right.caller);
      var callee = and(left.callee, right.callee);

      // TODO, make update
       /*handler({
        caller:caller,
        callee:callee      
      });*/

      handler(new Handle(caller, callee));
    }

    /*__getter__("caller", function() {
      return or(left.caller, right.caller);
      }, this);

      __getter__("callee", function() {
      return and(left.callee, right.callee);
      }, this);*/

    /*__define__("leftHandler",  (function(handle) {
      left = Handle.merge(left, handle);
      handler(this);    
      }).bind(this), this);

      __define__("rightHandler", (function(handle) {
      right = Handle.merge(right, handle);
      handler(this);    
      }).bind(this), this); */

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

    // TODO, new Update Function
    function update() {
      var caller = and(left.caller, right.caller);
      var callee = or(left.callee, right.callee);

      // TODO, make update
       /*handler({
        caller:caller,
        callee:callee      
      });*/

      handler(new Handle(caller, callee));
    }

    /*__getter__("caller", function() {
      return and(left.caller, right.caller);
      }, this);

      __getter__("callee", function() {
      return or(left.callee, right.callee);
      }, this);*/

    /*__define__("leftHandler",  (function(handle) {
      left = Handle.merge(left, handle);
      handler(this);    
      }).bind(this), this);

      __define__("rightHandler", (function(handle) {
      right = Handle.merge(right, handle);
      handler(this);    
      }).bind(this), this); */

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

    // TODO, new Update Function
    function update() {
      var caller = sub.caller;
      var callee = implies(sub.caller, not(sub.callee));

      // TODO, make update
      /*handler({
        caller:caller,
        callee:callee      
      });*/

      handler(new Handle(caller, callee));
    }

    /*__getter__("caller", function() {
      return sub.caller;
      }, this);

      __getter__("callee", function() {
    //return not(sub.callee))
    return implies(sub.caller, not(sub.callee));
    }, this);*/

    /*__define__("subHandler", (function(handle) {
      sub = Handle.merge(sub, handle);
      handler(this);    
      }).bind(this), this);*/

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

    // TODO, new Update Function
    function update() {
      var caller = and(left.caller, right.caller);
      var callee = and(implies(left.caller, left.callee), implies(right.caller, right.callee));

      // TODO, make update
       /*handler({
        caller:caller,
        callee:callee      
      });*/

      handler(new Handle(caller, callee));
    }

    /*__getter__("caller", function() {
      return and(left.caller, right.caller);
      }, this);

      __getter__("callee", function() {
      return and(implies(left.caller, left.callee), implies(right.caller, right.callee))
    //return implies(and(left.caller, right.caller), and(left.callee, right.callee));
    //TODO
    //return and(left.callee, right.callee);
    }, this);*/

    /*__define__("leftHandler",  (function(handle) {
      left = Handle.merge(left, handle);
      handler(this);    
      }).bind(this), this);

      __define__("rightHandler", (function(handle) {
      right = Handle.merge(right, handle);
      handler(this);    
      }).bind(this), this); */

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

    // TODO, new Update Function
    function update() {
      var caller = or(left.caller, right.caller);
      var callee = implies(or(left.caller, right.caller), or(and(left.caller, left.callee), and(right.caller, right.callee)));

      // TODO, make update
       /*handler({
        caller:caller,
        callee:callee      
      });*/

      handler(new Handle(caller, callee));
    }


    /*__getter__("caller", function() {
      return or(left.caller, right.caller);
      }, this);

      __getter__("callee", function() {
      return implies(or(left.caller, right.caller), or(and(left.caller, left.callee), and(right.caller, right.callee)));
      }, this);*/

    /*__define__("leftHandler",  (function(handle) {
      left = Handle.merge(left, handle);
      handler(this);    
      }).bind(this), this);

      __define__("rightHandler", (function(handle) {
      right = Handle.merge(right, handle);
      handler(this);    
      }).bind(this), this); */

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

    // TODO, new Update Function
    function update() {
      var caller = True;
      var callee = Tree;

      // TODO, make update
       /*handler({
        caller:caller,
        callee:callee      
      });*/

      handler(new Handle(caller, callee));
    }




    /*__getter__("caller", function() {
      return True; 
      }, this);

      __getter__("callee", function() {
      return True;
    /*print("@@" + sub.caller);
    print("$$" + sub.callee);
    print("%%" + not(sub.callee));
    //return implies(sub.caller, not(sub.callee));
    return or(not(sub.caller), not(sub.callee));
    return not(and(sub.caller, sub.callee));
    }, this);*/

    /* __define__("subHandler", (function(handle) {
       sub = Handle.merge(sub, handle);
       handler(this);    
       }).bind(this), this);*/

    Object.defineProperty(this, "subHandler", {value:function(handle) {
      sub = Handle.merge(sub, handle);
      update();
    }});
  }
  NotCallback.prototype = Object.create(Callback.prototype);
  NotCallback.prototype.toString = function() {
    return "[[NotCallback]]";
  }

  function BaseCallback(handler) {
    if(!(this instanceof BaseCallback)) return new BaseCallback(handler);
    else Callback.apply(this, arguments);

    var predicate = new Handle(Unknown, Unknown, Unknown);

    // TODO, new Update Function
    function update() {
      var caller = predicate.caller;
      var callee = predicate.callee;

      // TODO, make update
       /*handler({
        caller:caller,
        callee:callee      
      });*/

      handler(new Handle(caller, callee));
    }
    /*__getter__("caller", function() {
      return predicate.caller;
      }, this);

      __getter__("callee", function() {
      return predicate.callee;
      }, this);*/

    /*__define__("predicateHandler", (function(handle) {
      predicate = Handle.merge(predicate, handle);
      handler(this);    
      }).bind(this), this);*/

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
