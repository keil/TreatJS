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

  var Map = TreatJS.Map.Map;
  var StringMap = TreatJS.Map.StringMap;

  var Contract = TreatJS.Core.Contract;

  //  _____            _                  _       
  // / ____|          | |                | |      
  //| |     ___  _ __ | |_ _ __ __ _  ___| |_ ___ 
  //| |    / _ \| '_ \| __| '__/ _` |/ __| __/ __|
  //| |___| (_) | | | | |_| | | (_| | (__| |_\__ \
  // \_____\___/|_| |_|\__|_|  \__,_|\___|\__|___/

  function DelayedContract() {
    if(!(this instanceof DelayedContract)) return new DelayedContract();
  }
  DelayedContract.prototype = Object.create(Contract.prototype);
  DelayedContract.prototype.toString = (function() { return '[[DelayedContract]]'; });

  function ImmediateContract() {
    if(!(this instanceof ImmediateContract)) return new ImmediateContract();
  }
  ImmediateContract.prototype = Object.create(Contract.prototype);
  ImmediateContract.prototype.toString = (function() { return '[[ImmediateContract]]'; });

  function CombinatorContract() {
    if(!(this instanceof CombinatorContract)) return new CombinatorContract();
  }
  CombinatorContract.prototype = Object.create(Contract.prototype);
  CombinatorContract.prototype.toString = (function() { return '[[CombinatorContract]]'; });

  function WrapperContract() {
    if(!(this instanceof WrapperContract)) return new WrapperContract();
  }
  WrapperContract.prototype = Object.create(Contract.prototype);
  WrapperContract.prototype.toString = (function() { return '[[WrapperContract]]'; });

  // ___                ___         _               _   
  //| _ ) __ _ ___ ___ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| _ \/ _` (_-</ -_) (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___/\__,_/__/\___|\___\___/_||_\__|_| \__,_\__|\__|

  function BaseContract(predicate, name) {
    if(!(this instanceof BaseContract)) return new BaseContract(predicate, name);

    if(!(predicate instanceof Function)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "predicate": {
        value: predicate
      },
      "name": {
        value: name
      }
    });
  }
  BaseContract.prototype = Object.create(ImmediateContract.prototype);
  this.toString = function() { return "[" + ((name!=undefined) ? name : predicate.toString()) + "]"; }; // TODO

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
        value: domain
      },
      "range": {
        value: range
      }
    });
  }
  FunctionContract.prototype = Object.create(DelayedContract.prototype);
  this.toString = function() { return "(" + domain.toString() + "->" + range.toString() + ")"; }; // TODO


  // TODO, should'nt this be a convinience contract ?
  // __  __     _   _            _  ___         _               _   
  //|  \/  |___| |_| |_  ___  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
  //| |\/| / -_)  _| ' \/ _ \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_|  |_\___|\__|_||_\___/\__,_|\___\___/_||_\__|_| \__,_\__|\__|

  /*function MethodContract(domain, range, context) {
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
    MethodContract.prototype = Object.create(DelayedContract.prototype);
    */

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
        value: map.strict
      },
      "map": {
        value: map
      }
    });
  }
  ObjectContract.prototype = Object.create(ImmediateContract.prototype);
  this.toString = function() {
    var lbr = (map.strict) ? "{" : "|";
    var rbr = (map.strict) ? "}" : "|";
    return lbr + map.toString() + rbr;
  }; // TODO



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
        value: constructor
      }
    });
  }
  DependentContract.prototype = Object.create(DelayedContract.prototype);
  this.toString = function() { return "(" + constructor.toString() + "->" + "*" + ")"; }; // TODO


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
        value: first
      },
      "second": {
        value: second
      }
    });
  }
  AndContract.prototype = Object.create(CombinatorContract.prototype);
  this.toString = function() { return "(" + first.toString() + "and" + second.toString() + ")"; }; // TODO


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
        value: first
      },
      "second": {
        value: second
      }
    });
  }
  OrContract.prototype = Object.create(CombinatorContract.prototype);
  this.toString = function() { return "(" + first.toString() + "or" + second.toString() + ")"; }; // TODO

  // _  _     _    ___         _               _   
  //| \| |___| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| .` / _ \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_|\_\___/\__|\___\___/_||_\__|_| \__,_\__|\__|

  function NotContract(sub) { 
    if(!(this instanceof NotContract)) return new NotContract(sub);

    if(!(sub instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "sub": {
        value: sub
      }
    });

    this.sub = sub;
    this.toString = function() { return "(not(" + sub.toString() + "))"; };
  }
  NotContract.prototype = Object.create(WrapperContract.prototype);

  //__      ___ _   _    ___         _               _   
  //\ \    / (_) |_| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
  // \ \/\/ /| |  _| ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  //  \_/\_/ |_|\__|_||_\___\___/_||_\__|_| \__,_\__|\__|                                                   

  function WithContract(binding, sub) {
    if(!(this instanceof WithContract)) return new WithContract(binding, sub);

    if(!(binding instanceof Object)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
    if(!(sub instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    // TODO
    Object.defineProperties(this, {
      "bindings": {
        value: binding
      },
      "sub": {
        value: sub
      }
    });

    this.toString = function() {
      var domain = "";
      for(name in binding) domain += " " + name;
      return "(with {" + domain + "}" + sub.toString() + ")";
    };
  }
  WithContract.prototype = Object.create(WrapperContract.prototype);


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
        value: first
      },
      "second": {
        value: second
      }
    });
  }
  IntersectionContract.prototype = Object.create(CombinatorContract.prototype);
  this.toString = function() { return "(" + first.toString() + "cap" + second.toString() + ")"; }; // TODO

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
        value: first
      },
      "second": {
        value: second
      }
    });
  }
  UnionContract.prototype = Object.create(CombinatorContract.prototype);
  this.toString = function() { return "(" + first.toString() + "cup" + second.toString() + ")"; }; // TODO

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
        value: sub
      }
    });

    this.toString = function() { return "(neg(" + sub.toString() + "))"; };
  }
  NegationContract.prototype = Object.create(WrapperContract.prototype);

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
        value: trap
      },
      "sub": {
        value: sub
      }
    });
  }
  ReflectionContract.prototype = Object.create(ImmediateContract.prototype);
  this.toString = function() { return "" + trap + " @ " + sub.toString(); }; // TODO


  //   _   _       _               _   _          
  //  /_\ | |__ __| |_ _ _ __ _ __| |_(_)___ _ _  
  // / _ \| '_ (_-<  _| '_/ _` / _|  _| / _ \ ' \ 
  ///_/ \_\_.__/__/\__|_| \__,_\__|\__|_\___/_||_|                                            

  function ContractAbstraction(vars, sub) {
    if(!(this instanceof ContractAbstraction)) return new ContractAbstraction(vars, sub);

    if(!(binding instanceof Object)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
    if(!(variable instanceof Variable)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
    if(!(sub instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "variable": {
        value: variable
      },
      "sub": {
        value: sub
      }
    });

  }
  ContractAbstraction.prototype = Object.create(Contract.prototype);
  this.toString = function() {  return "(" + varibale.toString() + "." + sub.toString() + ")"; }; // TODO




  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Contract", {});

  TreatJS.define(TreatJS.Contract, "Map", Map);
  TreatJS.define(TreatJS.Contract, "StringMap", StringMap);
  TreatJS.define(TreatJS.Contract, "Mapping", Mapping);
  TreatJS.define(TreatJS.Contract, "RegExpMap", RegExpMap);



  // old

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
