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
  BaseContract.prototype.toString = function() {
    return "[" + ((this.name!=undefined) ? this.name : this.predicate.toString()) + "]";
  };

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
  FunctionContract.prototype.toString = function() {
    return "(" + this.domain.toString() + "->" + this.range.toString() + ")";
  }; 

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
        value: domain
      },
      "range": {
        value: range
      },
      "context": {
        value: context
      }
    });
  }
  MethodContract.prototype = Object.create(DelayedContract.prototype);
  MethodContract.prototype.toString = function() {
    return "(" + domain.toString() + "->" + range.toString() + "|" + context.toString() + ")";
  };

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
  ObjectContract.prototype.toString = function() {
    var lbr = (this.map.strict) ? "{" : "|";
    var rbr = (this.map.strict) ? "}" : "|";
    return "(" + lbr + this.map.toString() + rbr + ")";
  };

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
  DependentContract.prototype.toString = function() {
    return "(" + this.constructor.toString() + "->" + "*" + ")";
  };

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
  AndContract.prototype.toString = function() {
    return "(" + this.first.toString() + "and" + this.second.toString() + ")";
  };

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
  OrContract.prototype.toString = function() {
    return "(" + this.first.toString() + "or" + this.second.toString() + ")";
  };

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
  }
  NotContract.prototype = Object.create(WrapperContract.prototype);
  NotContract.prototype.toString = function() {
    return "(not" + this.sub.toString() + ")";
  };

  //__      ___ _   _    ___         _               _   
  //\ \    / (_) |_| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
  // \ \/\/ /| |  _| ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  //  \_/\_/ |_|\__|_||_\___\___/_||_\__|_| \__,_\__|\__|                                                   

  function WithContract(binding, sub) {
    if(!(this instanceof WithContract)) return new WithContract(binding, sub);

    if(!(binding instanceof Object)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
    if(!(sub instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "bindings": {
        value: binding
      },
      "sub": {
        value: sub
      }
    });
  }
  WithContract.prototype = Object.create(WrapperContract.prototype);
  WithContract.prototype.toString = function() {
    var domain = "";
    for(name in this.binding) domain += " " + name;
    return "(with {" + domain + "}" + this.sub.toString() + ")";
  };

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
  IntersectionContract.prototype.toString = function() {
    return "(" + this.first.toString() + "cap" + this.second.toString() + ")";
  };

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
  UnionContract.prototype.toString = function() {
    return "(" + first.toString() + "cup" + second.toString() + ")";
  };

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
  }
  NegationContract.prototype = Object.create(WrapperContract.prototype);
  NegationContract.prototype.toString = function() {
    return "(neg" + sub.toString() + ")";
  };

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
  ReflectionContract.prototype.toString = function() {
    return "(" + trap + " @ " + sub.toString() + ")";
  };

  // TODO, experimental code
  //   _   _       _               _   _          
  //  /_\ | |__ __| |_ _ _ __ _ __| |_(_)___ _ _  
  // / _ \| '_ (_-<  _| '_/ _` / _|  _| / _ \ ' \ 
  ///_/ \_\_.__/__/\__|_| \__,_\__|\__|_\___/_||_|                                            

  /*function ContractAbstraction(vars, sub) {
    if(!(this instanceof ContractAbstraction)) return new ContractAbstraction(vars, sub);

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
    ContractAbstraction.prototype.toString = function() {
    return "(" + varibale.toString() + "." + sub.toString() + ")";
    };*/


  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Contract", {});

  TreatJS.define(TreatJS.Contract, "Delayed", DelayedContract);
  TreatJS.define(TreatJS.Contract, "Immediate", ImmediateContract);
  TreatJS.define(TreatJS.Contract, "Combinator", CombinatorContract);
  TreatJS.define(TreatJS.Contract, "Wrapper", WrapperContract);

  TreatJS.define(TreatJS.Contract, "Base", BaseContract);

  TreatJS.define(TreatJS.Contract, "Function", FunctionContract);
  TreatJS.define(TreatJS.Contract, "Method", MethodContract);
  TreatJS.define(TreatJS.Contract, "Dependent", DependentContract);
  TreatJS.define(TreatJS.Contract, "Object", ObjectContract);

  TreatJS.define(TreatJS.Contract, "With", WithContract);

  TreatJS.define(TreatJS.Contract, "And", AndContract);
  TreatJS.define(TreatJS.Contract, "Or", OrContract);
  TreatJS.define(TreatJS.Contract, "Not", NotContract);

  TreatJS.define(TreatJS.Contract, "Intersection", IntersectionContract);
  TreatJS.define(TreatJS.Contract, "Union", UnionContract);
  TreatJS.define(TreatJS.Contract, "Negation", NegationContract);

  TreatJS.define(TreatJS.Contract, "Reflection", ReflectionContract);

})(TreatJS);
