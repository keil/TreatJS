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

  var Map = _.Map.Map;
  var StringMap = _.Map.StringMap;

  var Contract = _.Core.Contract;
  var Constructor = _.Core.Constructor;

  //  _____            _                  _       
  // / ____|          | |                | |      
  //| |     ___  _ __ | |_ _ __ __ _  ___| |_ ___ 
  //| |    / _ \| '_ \| __| '__/ _` |/ __| __/ __|
  //| |___| (_) | | | | |_| | | (_| | (__| |_\__ \
  // \_____\___/|_| |_|\__|_|  \__,_|\___|\__|___/

  function DelayedContract() {
    if(!(this instanceof DelayedContract)) return new DelayedContract();
  }
  DelayedContract.prototype = new Contract();

  function ImmediateContract() {
    if(!(this instanceof ImmediateContract)) return new ImmediateContract();
  }
  ImmediateContract.prototype = new Contract();

  function CombinatorContract() {
    if(!(this instanceof CombinatorContract)) return new CombinatorContract();
  }
  CombinatorContract.prototype = new Contract();

  function WrapperContract() {
    if(!(this instanceof WrapperContract)) return new WrapperContract();
  }
  WrapperContract.prototype = new Contract();

  // ___                ___         _               _   
  //| _ ) __ _ ___ ___ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| _ \/ _` (_-</ -_) (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___/\__,_/__/\___|\___\___/_||_\__|_| \__,_\__|\__|

  function BaseContract(predicate, name) {
    if(!(this instanceof BaseContract)) return new BaseContract(predicate, name);

    if(!(predicate instanceof Function)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "predicate": {
        get: function () { return predicate; } },
      "name": {
        get: function () { return name; } }
    });
    this.toString = function() { return "[" + ((name!=undefined) ? name : predicate.toString()) + "]"; };
  }
  BaseContract.prototype = new ImmediateContract();

  // ___          _   _   _          ___         _               _   
  //| __|  _ _ _ | |_| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| _| || | ' \| / /  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_| \_,_|_||_|_\_\\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

  function FunctionContract(domain, range) {
    if(!(this instanceof FunctionContract)) return new FunctionContract(domain, range);

    if(!(domain instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
    if(!(range instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "domain": {
        get: function () { return domain; } },
      "range": {
        get: function () { return range; } }
    });

    this.toString = function() { return "(" + domain.toString() + "->" + range.toString() + ")"; };
  }
  FunctionContract.prototype = new DelayedContract();

  // __  __     _   _            _  ___         _               _   
  //|  \/  |___| |_| |_  ___  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
  //| |\/| / -_)  _| ' \/ _ \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_|  |_\___|\__|_||_\___/\__,_|\___\___/_||_\__|_| \__,_\__|\__|

  function MethodContract(domain, range, context) {
    if(!(this instanceof MethodContract)) return new MethodContract(domain, range, context);

    if(!(domain instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
    if(!(range instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
    if(!(context instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "domain": {
        get: function () { return domain; } },
      "range": {
        get: function () { return range; } },
      "context": {
        get: function () { return context; } }
    });

    this.toString = function() { return "(" + domain.toString() + "->" + range.toString() + "|" + context.toString() + ")"; };
  }
  MethodContract.prototype = new DelayedContract();

  //  ___  _     _        _    ___         _               _   
  // / _ \| |__ (_)___ __| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| (_) | '_ \| / -_) _|  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
  // \___/|_.__// \___\__|\__|\___\___/_||_\__|_| \__,_\__|\__|
  //          |__/                                             

  function ObjectContract(map) {
    if(!(this instanceof ObjectContract)) return new ObjectContract(map);

    if(!(map instanceof Map)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber); 

    Object.defineProperties(this, {
      "strict": {
        get: function () { return map.strict; } },
      "map": {
        get: function () { return map; } }
    });

    this.toString = function() {
      var lbr = (map.strict) ? "{" : "|";
      var rbr = (map.strict) ? "}" : "|";
      return lbr + map.toString() + rbr;
    };
  }
  //  ObjectContract.prototype = new DelayedContract();
  ObjectContract.prototype = new ImmediateContract();

  // ___                        _         _    ___         _               _   
  //|   \ ___ _ __  ___ _ _  __| |___ _ _| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| |) / -_) '_ \/ -_) ' \/ _` / -_) ' \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___/\___| .__/\___|_||_\__,_\___|_||_\__|\___\___/_||_\__|_| \__,_\__|\__|
  //         |_|                                                               

  function DependentContract(constructor) {
    if(!(this instanceof DependentContract)) return new DependentContract(constructor);

    if(!(constructor instanceof Constructor)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "constructor": {
        get: function () { return constructor; } }
    });

    this.toString = function() { return "(" + constructor.toString() + "->" + "*" + ")"; };
  }
  DependentContract.prototype = new DelayedContract();

  //   _           _  ___         _               _   
  //  /_\  _ _  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
  // / _ \| ' \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
  ///_/ \_\_||_\__,_|\___\___/_||_\__|_| \__,_\__|\__|

  function AndContract(first, second) {
    if(!(this instanceof AndContract)) return new AndContract(first, second);

    if(!(first instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
    if(!(second instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "first": {
        get: function () { return first; } },
      "second": {
        get: function () { return second; } }
    });

    this.toString = function() { return "(" + first.toString() + "and" + second.toString() + ")"; };
  }
  AndContract.prototype = new CombinatorContract();

  //  ___       ___         _               _   
  // / _ \ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| (_) | '_| (__/ _ \ ' \  _| '_/ _` / _|  _|
  // \___/|_|  \___\___/_||_\__|_| \__,_\__|\__|

  function OrContract(first, second) { 
    if(!(this instanceof OrContract)) return new OrContract(first, second);

    if(!(first instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
    if(!(second instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "first": {
        get: function () { return first; } },
      "second": {
        get: function () { return second; } }
    });

    this.toString = function() { return "(" + first.toString() + "or" + second.toString() + ")"; };
  }
  OrContract.prototype = new CombinatorContract();

  // _  _     _    ___         _               _   
  //| \| |___| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| .` / _ \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_|\_\___/\__|\___\___/_||_\__|_| \__,_\__|\__|

  function NotContract(sub) { 
    if(!(this instanceof NotContract)) return new NotContract(sub);

    if(!(sub instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "sub": {
        get: function () { return sub; } }
    });

    this.sub = sub;
    this.toString = function() { return "(not(" + sub.toString() + "))"; };
  }
  NotContract.prototype = new WrapperContract();

  //__      ___ _   _    ___         _               _   
  //\ \    / (_) |_| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
  // \ \/\/ /| |  _| ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  //  \_/\_/ |_|\__|_||_\___\___/_||_\__|_| \__,_\__|\__|                                                   

  function WithContract(binding, sub) {
    if(!(this instanceof WithContract)) return new WithContract(binding, sub);

    if(!(binding instanceof Object)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
    if(!(sub instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "binding": {
        get: function () { return binding; } },
      "sub": {
        get: function () { return sub; } }
    });

    this.toString = function() {
      var domain = "";
      for(name in binding) domain += " " + name;
      return "(with {" + domain + "}" + sub.toString() + ")";
    };
  }
  WithContract.prototype = new WrapperContract();


  // ___     _                      _   _          ___         _               _   
  //|_ _|_ _| |_ ___ _ _ ___ ___ __| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  // | || ' \  _/ -_) '_(_-</ -_) _|  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___|_||_\__\___|_| /__/\___\__|\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

  function IntersectionContract(first, second) { 
    if(!(this instanceof IntersectionContract)) return new IntersectionContract(first, second);

    if(!(first instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
    if(!(second instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "first": {
        get: function () { return first; } },
      "second": {
        get: function () { return second; } }
    });

    this.toString = function() { return "(" + first.toString() + "cap" + second.toString() + ")"; };
  }
  IntersectionContract.prototype = new CombinatorContract();

  // _   _      _          ___         _               _   
  //| | | |_ _ (_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| |_| | ' \| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  // \___/|_||_|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

  function UnionContract(first, second) {
    if(!(this instanceof UnionContract)) return new UnionContract(first, second);

    if(!(first instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
    if(!(second instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "first": {
        get: function () { return first; } },
      "second": {
        get: function () { return second; } }
    });

    this.toString = function() { return "(" + first.toString() + "cup" + second.toString() + ")"; };
  }
  UnionContract.prototype = new CombinatorContract();

  // _  _               _   _          ___         _               _   
  //| \| |___ __ _ __ _| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| .` / -_) _` / _` |  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_|\_\___\__, \__,_|\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|
  //         |___/                                                     

  function NegationContract(sub) { 
    if(!(this instanceof NegationContract)) return new NegationContract(sub);

    if(!(sub instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "sub": {
        get: function () { return sub; } }
    });

    this.toString = function() { return "(neg(" + sub.toString() + "))"; };
  }
  NegationContract.prototype = new WrapperContract();

  // ___      __ _        _   _          ___         _               _   
  //| _ \___ / _| |___ __| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //|   / -_)  _| / -_) _|  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_|_\___|_| |_\___\__|\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

  function ReflectionContract(trap, sub) {
    if(!(this instanceof ReflectionContract)) return new ReflectionContract(trap, sub);

    if((typeof trap)!=="string") error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber); 
    if(!(sub instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "trap": {
        get: function () { return trap; } },
      "sub": {
        get: function () { return sub; } }
    });

    this.toString = function() { return "" +  trap + " @ " + sub.toString(); };
  }
  ReflectionContract.prototype = new ImmediateContract();

  //  _____                _                   _             
  // / ____|              | |                 | |            
  //| |     ___  _ __  ___| |_ _ __ _   _  ___| |_ ___  _ __ 
  //| |    / _ \| '_ \/ __| __| '__| | | |/ __| __/ _ \| '__|
  //| |___| (_) | | | \__ \ |_| |  | |_| | (__| || (_) | |   
  // \_____\___/|_| |_|___/\__|_|   \__,_|\___|\__\___/|_|   

  function ContractConstructor(constructor, binding, name) {
    if(!(this instanceof ContractConstructor)) return new ContractConstructor(constructor, binding, name);

    if(!(constructor instanceof Function)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "constructor": {
        get: function () { return constructor; } },
      "name": {
        get: function () { return name; } },
      "binding": {
        get: function () { return binding; } },
      "build": {
        get: function () { return function() {
          return _.construct(this, arguments);
        } } },
      "ctor": {
        get: function () { return this.build.bind(this);
        } }
    });

    this.toString = function() { return "[*" + ((name!=undefined) ? name : constructor.toString()) + "*]"; };
  }
  ContractConstructor.prototype = new Constructor();

  /**
   * Core Contracts
   */

  __define("Contract", Contract, _);

  __define("BaseContract", BaseContract, _);

  __define("FunctionContract", FunctionContract, _);
  __define("MethodContract", MethodContract, _);
  __define("DependentContract", DependentContract, _);
  __define("ObjectContract", ObjectContract, _);

  __define("With", WithContract, _);

  __define("Union", UnionContract, _);
  __define("Intersection", IntersectionContract, _);
  __define("Negation", NegationContract, _);

  __define("And", AndContract, _);
  __define("Or", OrContract, _);
  __define("Not", NotContract, _);

  __define("Reflection", ReflectionContract, _);

  __define("Constructor", ContractConstructor, _);

  __define("Delayed", DelayedContract, _);
  __define("Immediate", ImmediateContract, _);
  __define("Combinator", CombinatorContract, _);
  __define("Wrapper", WrapperContract, _);

})(TreatJS);
