/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014-2017, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */

TreatJS.package("TreatJS.Contract", function (TreatJS, Contract, Configuration, Realm) {

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

    return Object.defineProperties(Object.setPrototypeOf(ConstructorContract.prototype.construct.bind(this), this), {
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

  ConstructorContract.prototype.construct = function(...argumentsList) {
    return Contract.construct(this, argumentsList);
  }

  //  ___  _     _        _    ___         _               _   
  // / _ \| |__ (_)___ __| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| (_) | '_ \| / -_) _|  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
  // \___/|_.__// \___\__|\__|\___\___/_||_\__|_| \__,_\__|\__|
  //          |__/                                             

  function ObjectContract(object, strict=false) { 
    if(!(this instanceof ObjectContract)) return new ObjectContract(object, strict);
    else TreatJS.Prototype.Delayed.apply(this);

    if(strict) return new StrictObjectContract(object);

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

  //    _       _    _   
  // __| |_ _ _(_)__| |_ 
  //(_-<  _| '_| / _|  _|
  // __/\__|_| |_\__|\__|

  function StrictObjectContract(object) {
    if(!(this instanceof StrictObjectContract)) return new StrictObjectContract(object);
    else ObjectContract.apply(this, [object]);
  }
  ObjectContract.prototype = Object.create(ObjectContract.prototype);
  ObjectContract.prototype.constructor = StrictObjectContract;

  // ___          _   _   _          ___         _               _   
  //| __|  _ _ _ | |_| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| _| || | ' \| / /  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_| \_,_|_||_|_\_\\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

  function FunctionContract(domain, range) {
    if(!(this instanceof FunctionContract)) return new FunctionContract(domain, range);
    else TreatJS.Prototype.Delayed.apply(this);

    if(domain instanceof Array)
      domain = new ObjectContract(domain);

    if(!(domain instanceof TreatJS.Prototype.Contract))
      throw new TypeError("Invalid contract.");
    if(!(range instanceof TreatJS.Prototype.Contract))
      throw new TypeError("Invalid contract.");

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

    if(constructor instanceof Function) {
      constructor = new ConstructorContract(constructor, name);
    }

    if(!(constructor instanceof TreatJS.Prototype.Constructor))
      throw new TypeError("Invalid constructor.");

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

  function IntersectionContract(left, right) { 
    if(!(this instanceof IntersectionContract)) return new IntersectionContract(left, right);
    else TreatJS.Prototype.Contract.apply(this);

    if(!(left instanceof TreatJS.Prototype.Immediate))
      throw new TypeError("Invalid contract.");
    if(!(right instanceof TreatJS.Prototype.Contract))
      throw new TypeError("Invalid contract.");

    Object.defineProperties(this, {
      "left": {
        value: left
      },
      "right": {
        value: right
      }
    });
  }
  IntersectionContract.prototype = Object.create(TreatJS.Prototype.Contract.prototype);
  IntersectionContract.prototype.constructor = IntersectionContract;
  IntersectionContract.prototype.toString = function() {
    return "(" + this.left.toString() + " - " + this.right.toString() + ")";
  };

  //  __               
  // / _|_ _ ___ _ __  
  //|  _| '_/ _ \ '  \ 
  //|_| |_| \___/_|_|_| 

  IntersectionContract.from = function(left, right) {

    if(!(left instanceof TreatJS.Prototype.Contract))
      throw new TypeError("Invalid contract.");
    if(!(right instanceof TreatJS.Prototype.Contract))
      throw new TypeError("Invalid contract.");


    // Case: I - C
    if(left instanceof TreatJS.Prototype.Immediate) {
      return new IntersectionContract(left, right);

      // Case: Q - C
    } else if(left instanceof TreatJS.Prototype.Delayed) {

      // Sub-Case: Q - R
      if(right instanceof TreatJS.Prototype.Delayed) {
        return new DelayedIntersectionContract(left, right);

        // Otherwise
      } else {
        return IntersectionContract.from(right, left);
      }

      // Case: (C' + D') - C
    } else if(left instanceof UnionContract) {

      return new Union(
          IntersectionContract.from(left.left, right),
          IntersectionContract.from(left.right, right));

      // Case: (C' - D') - C
    } else if(left instanceof IntersectionContract) {

      return IntersectionContract.from(
          left.left,
          IntersectionContract.from(left.right, right));

      // Otherwise
    } else {
      throw new TypeError("Invalid contract.");
    }

  }

  //    _     _                  _ 
  // __| |___| |__ _ _  _ ___ __| |
  /// _` / -_) / _` | || / -_) _` |
  //\__,_\___|_\__,_|\_, \___\__,_|
  //                 |__/          

  function DelayedIntersectionContract(left, right) { 
    if(!(this instanceof DelayedIntersectionContract)) return new DelayedIntersectionContract(left, right);
    else TreatJS.Prototype.Delayed.apply(this);

    if(!(left instanceof TreatJS.Prototype.Delayed))
      throw new TypeError("Invalid contract.");
    if(!(right instanceof TreatJS.Prototype.Delayed))
      throw new TypeError("Invalid contract.");

    Object.defineProperties(this, {
      "left": {
        value: left
      },
      "right": {
        value: right
      }
    });
  }
  DelayedIntersectionContract.prototype = Object.create(TreatJS.Prototype.Delayed.prototype);
  DelayedIntersectionContract.prototype.constructor = DelayedIntersectionContract;
  DelayedIntersectionContract.prototype.toString = IntersectionContract.prototype.toString;
  DelayedIntersectionContract.from = IntersectionContract.from;

  // _   _      _          ___         _               _   
  //| | | |_ _ (_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| |_| | ' \| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  // \___/|_||_|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

  function UnionContract(left, right) { 
    if(!(this instanceof UnionContract)) return new UnionContract(left, right);
    else TreatJS.Prototype.Contract.apply(this); 

    if(!(left instanceof TreatJS.Prototype.Contract))
      throw new TypeError("Invalid contract.");
    if(!(right instanceof TreatJS.Prototype.Contract))
      throw new TypeError("Invalid contract.");

    Object.defineProperties(this, {
      "left": {
        value: left
      },
      "right": {
        value: right
      }
    });
  }
  UnionContract.prototype = Object.create(TreatJS.Prototype.Contract.prototype);
  UnionContract.prototype.constructor = UnionContract;
  UnionContract.prototype.toString = function() {
    return "(" + this.left.toString() + " + " + this.right.toString() + ")";
  };




  // ___                  _          _    ___         _               _   
  //|_ _|_ ___ ____ _ _ _(_)__ _ _ _| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
  // | || ' \ V / _` | '_| / _` | ' \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___|_||_\_/\__,_|_| |_\__,_|_||_\__|\___\___/_||_\__|_| \__,_\__|\__|

  function InvariantContract(base) {
    if(!(this instanceof InvariantContract)) return new InvariantContract(base);
    else TreatJS.Prototype.Delayed.apply(this);

    if(!(base instanceof BaseContract))
      throw new TypeError("Invalid contract.");

    Object.defineProperties(this, {
      "base": {
        value: base 
      }
    });
  }
  InvariantContract.prototype = Object.create(TreatJS.Prototype.Delayed.prototype);
  InvariantContract.prototype.constructor = InvariantContract;
  InvariantContract.prototype.toString = function() {
    return "(" + "&" + this.base.toString() + ")";
  };




  // make a context that requests with implicit coversions


  // Why is this not a constructor

  // ___                    _          ___         _               _   
  //| _ \___ __ _  _ _ _ __(_)_ _____ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //|   / -_) _| || | '_(_-< \ V / -_) (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_|_\___\__|\_,_|_| /__/_|\_/\___|\___\___/_||_\__|_| \__,_\__|\__|

  function RecursiveContract(constructor) {
    if(!(this instanceof RecursiveContract)) return new RecursiveContract(constructor);
    else TreatJS.Prototype.Immediate.apply(this);

    if(constructor instanceof Function) {
      constructor = new ConstructorContract(constructor, name);
    }

    if(!(constructor instanceof TreatJS.Prototype.Constructor))
      throw new TypeError("Invalid constructor.");

    Object.defineProperties(this, {
      "constructor": {
        value: constructor
      }
    });
  }
  RecursiveContract.prototype = Object.create(TreatJS.Prototype.Immediate.prototype);
  RecursiveContract.prototype.constructor = RecursiveContract;
  RecursiveContract.prototype.toString = function() {
    return "(" + "*" + "." + this.constructor.toString() + ")";
  };


  // ___             _ _  ___         _               _   
  //| __|__ _ _ __ _| | |/ __|___ _ _| |_ _ _ __ _ __| |_ 
  //| _/ _ \ '_/ _` | | | (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_|\___/_| \__,_|_|_|\___\___/_||_\__|_| \__,_\__|\__|

  /*function ForallContract(constructor, name) {
    if(!(this instanceof ForallContract)) return new ForallContract(constructor);
    else TreatJS.Prototype.Immediate.apply(this);

    if(constructor instanceof Function) {
      constructor = new ConstructorContract(constructor, name);
    }

    if(!(constructor instanceof TreatJS.Prototype.Constructor))
      throw new TypeError("Invalid constructor.");

    Object.defineProperties(this, {
      "constructor": {
        value: constructor
      }
    });
  }
  DependentContract.prototype = Object.create(TreatJS.Prototype.Immediate.prototype);
  DependentContract.prototype.constructor = DependentContract;
  DependentContract.prototype.toString = function() {
    return "(" + "%" + "." + this.constructor.toString() + ")";
  };*/



















  // _____ ___ __  ___ _ _| |_ 
  /// -_) \ / '_ \/ _ \ '_|  _|
  //\___/_\_\ .__/\___/_|  \__|
  //        |_|                

  TreatJS.export({
    Base:                 BaseContract,
    Constructor:          ConstructorContract,
    Object:               ObjectContract,
    StrictObject:         StrictObjectContract,
    Function:             FunctionContract,
    Dependent:            DependentContract,
    Intersection:         IntersectionContract,
    DelayedIntersection:  DelayedIntersectionContract,
    Union:                UnionContract,
    Invariant:            InvariantContract,
    Recursive:            RecursiveContract
  });

  //         _                 
  // _ _ ___| |_ _  _ _ _ _ _  
  //| '_/ -_)  _| || | '_| ' \ 
  //|_| \___|\__|\_,_|_| |_||_|

  return {
    Base:                 BaseContract,
    Constructor:          ConstructorContract,
    Object:               ObjectContract,
    StrictObject:         StrictObjectContract,
    Function:             FunctionContract,
    Dependent:            DependentContract,
    Intersection:         IntersectionContract,
    DelayedIntersection:  DelayedIntersectionContract,
    Union:                UnionContract,
    Invariant:            InvariantContract,
    Recursive:            RecursiveContract
  };

});
