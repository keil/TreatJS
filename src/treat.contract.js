/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014-2016, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */

TreatJS.package("TreatJS.Contract", function (TreatJS, Contract, configuration) {

  // ___                ___         _               _   
  //| _ ) __ _ ___ ___ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| _ \/ _` (_-</ -_) (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___/\__,_/__/\___|\___\___/_||_\__|_| \__,_\__|\__|

  function BaseContract(predicate, name) {
    if(!(this instanceof BaseContract)) return new BaseContract(predicate, name);
    else TreatJS.Prototype.Immediate.apply(this);

    if(!(predicate instanceof Function))
      throw new TypeError("Invalid predicate.");

    Object.defineProperties(this, {
      "predicate": {
        value: TreatJS.Sandbox.recompilePredicate(predicate)
      },
      "name": {
        value: name
      }
    });
  }
  BaseContract.prototype = Object.create(TreatJS.Prototype.Immediate.prototype);
  BaseContract.prototype.constructor = BaseContract;
  BaseContract.prototype.toString = function() {
    return this.name ? "#"+this.name : "[[TreatJS/Base]]";
  };

  //  ___             _               _            ___         _               _   
  // / __|___ _ _  __| |_ _ _ _  _ __| |_ ___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| (__/ _ \ ' \(_-<  _| '_| || / _|  _/ _ \ '_| (__/ _ \ ' \  _| '_/ _` / _|  _|
  // \___\___/_||_/__/\__|_|  \_,_\__|\__\___/_|  \___\___/_||_\__|_| \__,_\__|\__|

  function ConstructorContract(constructor, name) {
    if(!(this instanceof ConstructorContract)) return new ConstructorContract(constructor, name);
    else TreatJS.Prototype.Constructor.apply(this);

    if(!(constructor instanceof Function))
      throw new TypeError("Invalid constructor.");

    Object.defineProperties(this, {
      "constructor": {
        value: TreatJS.Sandbox.recompileConstructor(constructor)
      },
      "name": {
        value: name
      }
    });
  }
  ConstructorContract.prototype = Object.create(TreatJS.Prototype.Constructor.prototype);
  ConstructorContract.prototype.constructor = ConstructorContract;
  ConstructorContract.prototype.toString = function() {
    return this.name ? "#"+this.name : "[[TreatJS/Constructor]]";
  };

  //  ___  _     _        _    ___         _               _   
  // / _ \| |__ (_)___ __| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| (_) | '_ \| / -_) _|  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
  // \___/|_.__// \___\__|\__|\___\___/_||_\__|_| \__,_\__|\__|
  //          |__/                                             

  function ObjectContract(object) { 
    if(!(this instanceof ObjectContract)) return new ObjectContract(object);
    else TreatJS.Prototype.Delayed.apply(this);

    if(!(object instanceof Object))
      throw new TypeError("Invalid contract mapping.");

    const map = new Map();
    for(let key in object) map.set(key, object[key]);

    Object.defineProperties(this, {
      "map": {
        value: map 
      }
    });
  }
  ObjectContract.prototype = Object.create(TreatJS.Prototype.Delayed.prototype);
  ObjectContract.prototype.constructor = ObjectContract;
  ObjectContract.prototype.toString = function() {
    const size = this.map.size;
    let i = 0;
    let output = "{";
    for(let [key, value] of this.map) {
       output += `${key}:${value}` + ((i<size-1) ? ", " : "");
       i++;
    }
    return output+"}";
  };

  // ___          _   _   _          ___         _               _   
  //| __|  _ _ _ | |_| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| _| || | ' \| / /  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_| \_,_|_||_|_\_\\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

  function FunctionContract(domain, range) {
    if(!(this instanceof FunctionContract)) return new FunctionContract(domain, range);
    else TreatJS.Prototype.Delayed.apply(this);

    // implicit contract conversion 
    if(domain instanceof Array) {
      domain = new ObjectContract(domain);
    }

    if(!(domain instanceof TreatJS.Prototype.Contract))
      throw new TypeError("Invalid contract");
    if(!(range instanceof TreatJS.Prototype.Contract))
      throw new TypeError("Invalid contract");

    Object.defineProperties(this, {
      "domain": {
        value: domain
      },
      "range": {
        value: range
      }
    });
  }
  FunctionContract.prototype = Object.create(TreatJS.Prototype.Delayed.prototype);
  FunctionContract.prototype.constructor = FunctionContract;
  FunctionContract.prototype.toString = function() {
    return "(" + this.domain.toString() + " -> " + this.range.toString() + ")";
  }; 

  // ___                        _         _    ___         _               _   
  //|   \ ___ _ __  ___ _ _  __| |___ _ _| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| |) / -_) '_ \/ -_) ' \/ _` / -_) ' \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___/\___| .__/\___|_||_\__,_\___|_||_\__|\___\___/_||_\__|_| \__,_\__|\__|
  //         |_|                                                               

  function DependentContract(constructor) {
    if(!(this instanceof DependentContract)) return new DependentContract(constructor);
    else TreatJS.Prototype.Delayed.apply(this);

    // implicit contract conversion 
    if(constructor instanceof Function) {
      constructor = new ConstructorContract(constructor);
    }

    if(!(constructor instanceof TreatJS.Prototype.Constructor))
      throw new TypeError("Invalid constructor");

    Object.defineProperties(this, {
      "constructor": {
        value: constructor
      }
    });
  }
  DependentContract.prototype = Object.create(TreatJS.Prototype.Delayed.prototype);
  DependentContract.prototype.constructor = DependentContract;

  DependentContract.prototype.toString = function() {
    return "(" + "*" + " -> " + this.constructor.toString() + ")";
  };

  // ___     _                      _   _          ___         _               _   
  //|_ _|_ _| |_ ___ _ _ ___ ___ __| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  // | || ' \  _/ -_) '_(_-</ -_) _|  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___|_||_\__\___|_| /__/\___\__|\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

  function IIntersectionContract(left, right) { 
    if(!(this instanceof IIntersectionContract)) return new IIntersectionContract(left, right);
    else TreatJS.Prototype.Immediate.apply(this);

    if(!(left instanceof TreatJS.Prototype.Immediate))
      throw new TypeError("Invalid contract");
    if(!(right instanceof TreatJS.Prototype.Contract))
      throw new TypeError("Invalid contract");

    Object.defineProperties(this, {
      "left": {
        value: left
      },
      "right": {
        value: right
      }
    });
  }
  IIntersectionContract.prototype = Object.create(TreatJS.Prototype.Immediate.prototype);
  IIntersectionContract.prototype.constructor = IIntersectionContract;
  IIntersectionContract.prototype.toString = function() {
    return "(" + this.first.toString() + " - " + this.second.toString() + ")";
  };

  function DIntersectionContract(left, right) { 
    if(!(this instanceof DIntersectionContract)) return new DIntersectionContract(left, right);
    else TreatJS.Prototype.Delayed.apply(this);

    if(!(left instanceof TreatJS.Prototype.Delayed))
      throw new TypeError("Invalid contract");
    if(!(right instanceof TreatJS.Prototype.Delayed))
      throw new TypeError("Invalid contract");

    Object.defineProperties(this, {
      "left": {
        value: left
      },
      "right": {
        value: right
      }
    });
  }
  DIntersectionContract.prototype = Object.create(TreatJS.Prototype.Delayed.prototype);
  DIntersectionContract.prototype.constructor = DIntersectionContract;
  DIntersectionContract.prototype.toString = function() {
    return "(" + this.left.toString() + " - " + this.right.toString() + ")";
  };

  // _   _      _          ___         _               _   
  //| | | |_ _ (_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| |_| | ' \| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  // \___/|_||_|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

  function UnionContract(left, right) { 
    if(!(this instanceof UnionContract)) return new UnionContract(left, right);
    else TreatJS.Prototype.Immediate.apply(this); 

    if(!(left instanceof TreatJS.Prototype.Contract))
      throw new TypeError("Invalid contract");
    if(!(right instanceof TreatJS.Prototype.Contract))
      throw new TypeError("Invalid contract");

    Object.defineProperties(this, {
      "left": {
        value: left
      },
      "right": {
        value: right
      }
    });
  }
  UnionContract.prototype = Object.create(TreatJS.Prototype.Immediate.prototype);
  UnionContract.prototype.constructor = UnionContract;
  UnionContract.prototype.toString = function() {
    return "(" + this.left.toString() + " + " + this.right.toString() + ")";
  };

  // _____ ___ __  ___ _ _| |_ 
  /// -_) \ / '_ \/ _ \ '_|  _|
  //\___/_\_\ .__/\___/_|  \__|
  //        |_|                

  TreatJS.export({
    Base:           BaseContract,
    Constructor:    ConstructorContract,
    Object:         ObjectContract,
    Function:       FunctionContract,
    Dependent:      DependentContract,
    IIntersection:  IIntersectionContract,
    DIntersection:  DIntersectionContract,
    Union:          UnionContract
  });

  //         _                 
  // _ _ ___| |_ _  _ _ _ _ _  
  //| '_/ -_)  _| || | '_| ' \ 
  //|_| \___|\__|\_,_|_| |_||_|

  return {
    Base:           BaseContract,
    Constructor:    ConstructorContract,
    Object:         ObjectContract,
    Function:       FunctionContract,
    Dependent:      DependentContract,
    IIntersection:  IIntersectionContract,
    DIntersection:  DIntersectionContract,
    Union:          UnionContract
  };

});
