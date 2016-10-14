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

TreatJS.package("Temporal", function (TreatJS, Contract, configuration) {

  // ___         _       _                     
  //| _ \_ _ ___| |_ ___| |_ _  _ _ __  ___ ___
  //|  _/ '_/ _ \  _/ _ \  _| || | '_ \/ -_|_-<
  //|_| |_| \___/\__\___/\__|\_, | .__/\___/__/
  //                         |__/|_|           

  function Expression() {
    if(!(this instanceof Expression)) return new Expression();
  }
  Expression.prototype = {};
  Expression.prototype.constructor = Expression;
  Expression.prototype.toString = function() {
    return '[[TreatJS/Expression]]'; 
  };

  function Literal() {
    if(!(this instanceof Expression)) return new Literal();
  }
  Literal.prototype = Object.create(Expression.prototype);
  Literal.prototype.constructor = Literal;
  Literal.prototype.toString = function() {
    return '[[TreatJS/Literal]]'; 
  };

  function Effect() {
    if(!(this instanceof Effect)) return new Effect();
  }
  Effect.prototype = Object.create(Literal.prototype);
  Effect.prototype.constructor = Effect;
  Effect.prototype.toString = function() {
    return '[[TreatJS/Effect]]'; 
  };

  // ___  __  __        _      
  //| __|/ _|/ _|___ __| |_ ___
  //| _||  _|  _/ -_) _|  _(_-<
  //|___|_| |_| \___\__|\__/__/

  function Get(target, name) {
    if(!(this instanceof Get)) return new Get(target, name);

    if(!(get instanceof Object))
      throw new TypeError("Invalid target object.");

    Object.defineProperties(this, {
      "target": {
        value: target
      },
      "name": {
        value: name
      }
    });
  }
  Get.prototype = Object.create(Effect.prototype);
  Get.prototype.constructor = Get;
  Get.prototype.toString = function() {
    return '[[TreatJS/Effect/Get]]'; 
  };

  function Set(target, name) {
    if(!(this instanceof Get)) return new Set(target, name);

    if(!(target instanceof Object))
      throw new TypeError("Invalid target object.");

    Object.defineProperties(this, {
      "target": {
        value: target
      },
      "name": {
        value: name
      }
    });
  }
  Set.prototype = Object.create(Effect.prototype);
  Set.prototype.constructor = Set;
  Set.prototype.toString = function() {
    return '[[TreatJS/Effect/Set]]'; 
  };

  function Apply(target) {
    if(!(this instanceof Apply)) return new Apply(target);

    if(!(target instanceof Object))
      throw new TypeError("Invalid target object.");

    Object.defineProperties(this, {
      "target": {
        value: target
      }
    });
  }
  Apply.prototype = Object.create(Effect.prototype);
  Apply.prototype.constructor = Apply;
  Apply.prototype.toString = function() {
    return '[[TreatJS/Effect/Apply]]'; 
  };

  function Return(target) {
    if(!(this instanceof Return)) return new Return(target);

    if(!(target instanceof Object))
      throw new TypeError("Invalid target object.");

    Object.defineProperties(this, {
      "target": {
        value: target
      }
    });
  }
  Return.prototype = Object.create(Effect.prototype);
  Return.prototype.constructor = Return;
  Return.prototype.toString = function() {
    return '[[TreatJS/Effect/Return]]'; 
  };

  function Undefined(target) {
    if(!(this instanceof Any)) return new Any(target);

    if(!(target instanceof Object))
      throw new TypeError("Invalid target object.");

    Object.defineProperties(this, {
      "target": {
        value: target
      }
    });
  }
  Any.prototype = Object.create(Effect.prototype);
  Any.prototype.constructor = Any;
  Any.prototype.toString = function() {
    return '[[TreatJS/Effect/Any]]'; 
  };

  // TODO, more effects on a traet


  // _    _ _                _    
  //| |  (_) |_ ___ _ _ __ _| |___
  //| |__| |  _/ -_) '_/ _` | (_-<
  //|____|_|\__\___|_| \__,_|_/__/

  function Cmp(effect) {
    if(!(this instanceof Cmp)) return new Cmp(effect);

    if(!(effect instanceof Effect))
      throw new TypeError("Invalid target object.");

    Object.defineProperties(this, {
      "effect": {
        value: effect
      }
    });
  }
  Cmp.prototype = Object.create(Literal.prototype);
  Cmp.prototype.constructor = Cmp;
  Cmp.prototype.toString = function() {
    return '[[TreatJS/Literal/Cmp]]'; 
  };

  function Any() {
    if(!(this instanceof Any)) return new Any();
  }
  Any.prototype = Object.create(Literal.prototype);
  Any.prototype.constructor = Any;
  Any.prototype.toString = function() {
    return '[[TreatJS/Literal/Any]]'; 
  };

  // ___                        _             
  //| __|_ ___ __ _ _ ___ _____(_)___ _ _  ___
  //| _|\ \ / '_ \ '_/ -_|_-<_-< / _ \ ' \(_-<
  //|___/_\_\ .__/_| \___/__/__/_\___/_||_/__/
  //        |_|                               

  function Star(expression) {
    if(!(this instanceof Star)) return new Star(expression);
    else Expression.apply(this);

    if(!(expression instanceof Expression))
      throw new TypeError("Invalid expression.");
    
    Object.defineProperties(this, {
      "expression": {
        value: expression
      }
    });
  }
  Star.prototype = Object.create(Expression.prototype);
  Star.prototype.constructor = Star;
  Star.prototype.toString = function() {
    return "(" + this.expression.toString() + "*)";
  };

  function Or(left, right) {
    if(!(this instanceof Or)) return new Or(left, right);
    else Expression.apply(this);

    if(!(left instanceof Expression))
      throw new TypeError("Invalid expression.");

    if(!(right instanceof Expression))
      throw new TypeError("Invalid expression.");

    Object.defineProperties(this, {
      "left": {
        value: left
      },
      "right": {
        value: right
      }
    });
  }
  Or.prototype = Object.create(Expression.prototype);
  Or.prototype.constructor = Or;
  Or.prototype.toString = function() {
    return "(" + this.left.toString() + " + " + this.right.toString() + ")";
  };

  function And(left, right) {
    if(!(this instanceof And)) return new And(left, right);
    else Expression.apply(this);

    if(!(left instanceof Expression))
      throw new TypeError("Invalid expression.");

    if(!(right instanceof Expression))
      throw new TypeError("Invalid expression.");

    Object.defineProperties(this, {
      "left": {
        value: left
      },
      "right": {
        value: right
      }
    });
  }
  And.prototype = Object.create(Expression.prototype);
  And.prototype.constructor = And;
  And.prototype.toString = function() {
    return "(" + this.left.toString() + " - " + this.right.toString() + ")";
  };

  function Not(expression) {
    if(!(this instanceof Not)) return new Not(expression);
    else Expression.apply(this);

    if(!(expression instanceof Expression))
      throw new TypeError("Invalid expression.");
    
    Object.defineProperties(this, {
      "expression": {
        value: expression
      }
    });
  }
  Not.prototype = Object.create(Expression.prototype);
  Not.prototype.constructor = Not;
  Not.prototype.toString = function() {
    return "(!" + this.expression.toString() + ")";
  };

  function Dot(left, right) {
    if(!(this instanceof Dot)) return new Dot(left, right);
    else Expression.apply(this);

    if(!(left instanceof Expression))
      throw new TypeError("Invalid expression.");

    if(!(right instanceof Expression))
      throw new TypeError("Invalid expression.");

    Object.defineProperties(this, {
      "left": {
        value: left
      },
      "right": {
        value: right
      }
    });
  }
  Dot.prototype = Object.create(Expression.prototype);
  Dot.prototype.constructor = Dot;
  Dot.prototype.toString = function() {
    return "(" + this.left.toString() + "." + this.right.toString() + ")";
  };








});
