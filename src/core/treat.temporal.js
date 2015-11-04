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

  // out
  var error = TreatJS.error;
  var violation = TreatJS.violation;
  var blame = TreatJS.blame;

  // Symbol
  var Symbol = TreatJS.Symbol.Symbol;

  // TreatJS Output
  var logoutput = TreatJS.output;

  /** log(msg)
   * @param msg String message
   */ 
  function log(msg, target) {
    if(TreatJS.Verbose.internal) {
      logoutput.log(logoutput.INTERNAL, msg, target);
    }
  }

  // ___                        _          
  //| __|_ ___ __ _ _ ___ _____(_)___ _ _  
  //| _|\ \ / '_ \ '_/ -_|_-<_-< / _ \ ' \ 
  //|___/_\_\ .__/_| \___/__/__/_\___/_||_|
  //        |_|                            

  function Expression(target) {
    if(!(this instanceof Expression)) return new Expression();
  }
  Expression.prototype = {};
  Expression.prototype.toString = function() {
    return "[[Expression]]"
  }

  // _    _ _                _ 
  //| |  (_) |_ ___ _ _ __ _| |
  //| |__| |  _/ -_) '_/ _` | |
  //|____|_|\__\___|_| \__,_|_|

  function Literal(target, id) {
    if(!(this instanceof Literal)) return new Literal(target, id);
    else Expression.call(this);

    if(!(target instanceof Object))
      error("Invalid Target Object", (new Error()).fileName, (new Error()).lineNumber);
    if(!(id instanceof Symbol)) 
      error("Invalid Target ID", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "target": {
        value: target
      },
      "id": {
        value: id
      }
    });
  }
  Literal.prototype = Object.create(Expression.prototype);
  Literal.prototype.toString = function() {
    return "[[Literal]]"
  }

  // ___  __  __        _   
  //| __|/ _|/ _|___ __| |_ 
  //| _||  _|  _/ -_) _|  _|
  //|___|_| |_| \___\__|\__|

  function Effect(target, id) {
    if(!(this instanceof Effect)) return new Effect(target, id);
    else Literal.call(this, target, id);
  }
  Effect.prototype = Object.create(Literal.prototype);
  Effect.prototype.toString = function() {
    return "[[Effect]]"
  }

  // _      _ _                 _     
  //| |    (_) |               | |    
  //| |     _| |_ ___ _ __ __ _| |___ 
  //| |    | | __/ _ \ '__/ _` | / __|
  //| |____| | ||  __/ | | (_| | \__ \
  //|______|_|\__\___|_|  \__,_|_|___/

  //  ___     _   
  // / __|___| |_ 
  //| (_ / -_)  _|
  // \___\___|\__|

  function Get(id, property) {
    if(!(this instanceof Get)) return new Get(id, property);
    else Literal.call(this, reveal(id), id);

    if(!((typeof property === 'string') || (property instanceof RegExp)))
      error("Invalid property descriptor", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, { 
      "property": {
        value: property
      }
    });
  }
  Get.prototype = Object.create(Literal.prototype);
  Get.prototype.toString = function() {
    return "Get(" + this.id + ", " + this.property + ")"; 
  }

  // ___      _   
  /// __| ___| |_ 
  //\__ \/ -_)  _|
  //|___/\___|\__|

  function Set(id, property) {
    if(!(this instanceof Set)) return new Set(id, property);
    else Literal.call(this, reveal(id), id);

    if(!((typeof property === 'string') || (property instanceof RegExp)))
      error("Invalid property descriptor", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "property": {
        value: property
      }
    });
  }
  Set.prototype = Object.create(Literal.prototype);
  Set.prototype.toString = function() {
    return "Set(" + this.id + ", " + this.property + ")"; 
  }

  //  ___      _ _ 
  // / __|__ _| | |
  //| (__/ _` | | |
  // \___\__,_|_|_|

  function Call(id) {
    if(!(this instanceof Call)) return new Call(id);
    else Literal.call(this, reveal(id), id);
  }
  Call.prototype = Object.create(Literal.prototype);
  Call.prototype.toString = function() {
    return "Call(" + this.id + ")";
  }

  // ___     _                 
  //| _ \___| |_ _  _ _ _ _ _  
  //|   / -_)  _| || | '_| ' \ 
  //|_|_\___|\__|\_,_|_| |_||_|

  function Return(id) {
    if(!(this instanceof Return)) return new Return(id);
    else Literal.call(this, reveal(id), id);
  }
  Return.prototype = Object.create(Literal.prototype);
  Return.prototype.toString = function() {
    return "Return(" + this.id + ")";
  }

  //  ___             _               _   
  // / __|___ _ _  __| |_ _ _ _  _ __| |_ 
  //| (__/ _ \ ' \(_-<  _| '_| || / _|  _|
  // \___\___/_||_/__/\__|_|  \_,_\__|\__|

  function Construct(id) {
    if(!(this instanceof Construct)) return new Construct(id);
    else Literal.call(this, reveal(id), id);
  }
  Construct.prototype = Object.create(Effect.prototype);
  Construct.prototype.toString = function() {
    return "Construct(" + this.id + ")";
  }
  // ___                 _   _          
  //| __|_ ____ ___ _ __| |_(_)___ _ _  
  //| _|\ \ / _/ -_) '_ \  _| / _ \ ' \ 
  //|___/_\_\__\___| .__/\__|_\___/_||_|
  //               |_|                  

  function Exception(id) {
    if(!(this instanceof Exception)) return new Exception(id);
    else Literal.call(this, reveal(id), id);
  }
  Exception.prototype = Object.create(Effect.prototype);
  Exception.prototype.toString = function() {
    return "Exception(" + this.id + ")";
  }

  //   _            
  //  /_\  _ _ _  _ 
  // / _ \| ' \ || |
  ///_/ \_\_||_\_, |
  //           |__/ 

  function Any(id) {
    if(!(this instanceof Any)) return new Any(id);
    else Literal.call(this, reveal(id), id);
  }
  Any.prototype = Object.create(Literal.prototype);
  Any.prototype.toString = function() {
    return "Any(" + this.id + ")";
  }

  // ______                              _                 
  //|  ____|                            (_)                
  //| |__  __  ___ __  _ __ ___  ___ ___ _  ___  _ __  ___ 
  //|  __| \ \/ / '_ \| '__/ _ \/ __/ __| |/ _ \| '_ \/ __|
  //| |____ >  <| |_) | | |  __/\__ \__ \ | (_) | | | \__ \
  //|______/_/\_\ .__/|_|  \___||___/___/_|\___/|_| |_|___/
  //            | |                                        
  //            |_|                                        

  // _  _      _ _ 
  //| \| |_  _| | |
  //| .` | || | | |
  //|_|\_|\_,_|_|_|

  function Null() {
    if(!(this instanceof Null)) return new Null();
    else Expression.call(this);
  }
  Null.prototype = Object.create(Expression.prototype);
  Null.prototype.toString = function() {
    return "Null";
  }

  // ___            _        
  //| __|_ __  _ __| |_ _  _ 
  //| _|| '  \| '_ \  _| || |
  //|___|_|_|_| .__/\__|\_, |
  //          |_|       |__/ 

  function Empty() {
    if(!(this instanceof Empty)) return new Empty();
    else Expression.call(this);
  }
  Empty.prototype = Object.create(Expression.prototype);
  Empty.prototype.toString = function() {
    return "Empty";
  }

  //  ___            
  // / __|_ __  _ __ 
  //| (__| '  \| '_ \
  // \___|_|_|_| .__/
  //           |_|   

  function Cmp(literal) {
    if(!(this instanceof Cmp)) return new Cmp(literal);
    else Expression.call(this);

    if(!(literal instanceof Literal))
      error("Invalid literal", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "literal": {
        value: literal
      }
    });
  }
  Cmp.prototype = Object.create(Literal.prototype);
  Cmp.prototype.toString = function() {
    return "Cmp(" + this.literal + ")";
  }

  // ___ _            
  /// __| |_ __ _ _ _ 
  //\__ \  _/ _` | '_|
  //|___/\__\__,_|_|  

  function Star(sub) {
    if(!(this instanceof Star)) return new Star(sub);
    else Expression.call(this);

    // convert arrays to sequences 
    sub = (sub instanceof Array) ? Dot.apply(undefined, sub) : sub;

    if(!(sub instanceof Expression))
      error("Invalid expression", (new Error()).fileName, (new Error()).lineNumber);

    //////////////////////////////////////////////////
    // Normalization: Star
    if(sub instanceof Star) return sub;
    // Normalization: Null 
    if(sub instanceof Null) return Empty();
    // Normalization: Empty
    if(sub instanceof Empty) return left;
    //////////////////////////////////////////////////

    Object.defineProperties(this, {
      "sub": {
        value: sub 
      }
    });
  }
  Star.prototype = Object.create(Expression.prototype);
  Star.prototype.toString = function() {
    return "Star(" + this.sub + ")";
  }

  //  ___      
  // / _ \ _ _ 
  //| (_) | '_|
  // \___/|_|  

  function Or(left, right) {

    if(arguments.length>2) {
      var head = arguments[0];
      var tail = Array.prototype.slice.call(arguments, 1);
      return Or(head, Or.apply(undefined, tail));
    }

    if(!(this instanceof Or)) return new Or(left, right);
    else Expression.call(this);

    // convert arrays to sequences
    left = (left instanceof Array) ? Dot.apply(undefined, left) : left;
    right = (right instanceof Array) ? Dot.apply(undefined, right) : right;

    if(!(left instanceof Expression))
      error("Invalid expression", (new Error()).fileName, (new Error()).lineNumber);
    if(!(right instanceof Expression))
      error("Invalid expression", (new Error()).fileName, (new Error()).lineNumber);

    //////////////////////////////////////////////////
    // Normalization: Identical
    if(equals(left, right)) return left;
    // Normalization: Null
    if(left instanceof Null) return right;
    if(right instanceof Null) return left;
    //////////////////////////////////////////////////

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
  Or.prototype.toString = function() {
    return "Or(" + this.left + ", " + this.right + ")";
  }

  //   _           _ 
  //  /_\  _ _  __| |
  // / _ \| ' \/ _` |
  ///_/ \_\_||_\__,_|

  function And(left, right) {

    if(arguments.length>2) {
      var head = arguments[0];
      var tail = Array.prototype.slice.call(arguments, 1);
      return And(head, And.apply(undefined, tail));
    }

    if(!(this instanceof And)) return new And(left, right);
    else Expression.call(this);

    // convert arrays to sequences
    left = (left instanceof Array) ? Dot.apply(undefined, left) : left;
    right = (right instanceof Array) ? Dot.apply(undefined, right) : right;

    if(!(left instanceof Expression))
      error("Invalid expression", (new Error()).fileName, (new Error()).lineNumber);
    if(!(right instanceof Expression))
      error("Invalid expression", (new Error()).fileName, (new Error()).lineNumber);

    //////////////////////////////////////////////////
    // Normalization: Identical
    if(equals(left, right)) return left;
    // Normalization: Null
    if(left instanceof Null) return left;
    if(right instanceof Null) return right;
    //////////////////////////////////////////////////

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
  And.prototype.toString = function() {
    return "And(" + this.left + ", " + this.right + ")";
  }

  // _  _          
  //| \| |___ __ _ 
  //| .` / -_) _` |
  //|_|\_\___\__, |
  //         |___/ 

  function Neg(sub) {
    if(!(this instanceof Neg)) return new Neg(sub);
    else Expression.call(this);

    // convert arrays to sequences
    sub = (sub instanceof Array) ? Dot.apply(undefined, sub) : sub;

    if(!(sub instanceof Expression))
      error("Invalid expression", (new Error()).fileName, (new Error()).lineNumber);

    //////////////////////////////////////////////////
    // Normalization: Neg
    if(sub instanceof Neg) return sub.sub;
    //////////////////////////////////////////////////

    Object.defineProperties(this, {
      "sub": {
        value: sub
      }
    });
  }
  Neg.prototype = Object.create(Expression.prototype);
  Neg.prototype.toString = function() {
    return "Neg(" + this.sub + ")";
  }

  // ___      _   
  //|   \ ___| |_ 
  //| |) / _ \  _|
  //|___/\___/\__|

  function Dot(left, right) {

    if(arguments.length>2) {
      var head = arguments[0];
      var tail = Array.prototype.slice.call(arguments, 1);
      return Dot(head, Dot.apply(undefined, tail));
    }

    if(!(this instanceof Dot)) return new Dot(left, right);
    else Expression.call(this);

    if(!(left instanceof Expression))
      error("Invalid expression", (new Error()).fileName, (new Error()).lineNumber);
    if(!(right instanceof Expression))
      error("Invalid expression", (new Error()).fileName, (new Error()).lineNumber);

    //////////////////////////////////////////////////
    // Normalization: Null
    if(left instanceof Null) return left;
    // Normalization: Empty
    if(left instanceof Empty) return right;
    //////////////////////////////////////////////////

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
  Dot.prototype.toString = function() {
    return "Dot(" + this.left + ", " + this.right + ")";
  }

  //          _ _      _    _     
  // _ _ _  _| | |__ _| |__| |___ 
  //| ' \ || | | / _` | '_ \ / -_)
  //|_||_\_,_|_|_\__,_|_.__/_\___|

  function nullable(exp) {
    log("nullable", exp);

    if(!(exp instanceof Expression))
      error("Invalid expression", (new Error()).fileName, (new Error()).lineNumber);

    // literal
    if(exp instanceof Get) return false;
    else if(exp instanceof Set) return false;
    else if(exp instanceof Call) return false;
    else if(exp instanceof Return) return false;
    else if(exp instanceof Construct) return false;
    else if(exp instanceof Exception) return false;
    else if(exp instanceof Any) return false;

    // expressions
    else if(exp instanceof Empty) return true;
    else if(exp instanceof Null) return false;
    else if(exp instanceof Cmp) return false;
    else if(exp instanceof Star) return true;
    else if(exp instanceof Or) return (nullable(exp.left) || nullable(exp.right));
    else if(exp instanceof And) return (nullable(exp.left) && nullable(exp.right));
    else if(exp instanceof Neg) return !(nullable(exp.sub));
    else if(exp instanceof Dot) return (nullable(exp.left) && nullable(exp.right));

    // otherwise
    else error("Undefined expression", (new Error()).fileName, (new Error()).lineNumber);
  }

  //          _ _    _ 
  //__ ____ _| (_)__| |
  //\ V / _` | | / _` |
  // \_/\__,_|_|_\__,_|


  function valid(exp, eff, env) {
    log("valid", exp + " ? " + eff);

    if(!(exp instanceof Expression))
      error("Invalid expression", (new Error()).fileName, (new Error()).lineNumber);
    if(!(eff instanceof Effect)) 
      error("Invalid effect", (new Error()).fileName, (new Error()).lineNumber);

    // literal
    if(exp instanceof Get) return subseteq(exp, eff);
    else if(exp instanceof Set) return subseteq(exp, eff);
    else if(exp instanceof Call) return subseteq(exp, eff); 
    else if(exp instanceof Return) return subseteq(exp, eff);
    else if(exp instanceof Construct) return subseteq(exp, eff); 
    else if(exp instanceof Exception) return subseteq(exp, eff);
    else if(exp instanceof Any) return true;

    // expressions 
    else if(exp instanceof Empty) return false;
    else if(exp instanceof Null) return false;
    else if(exp instanceof Cmp) return !(valid(exp.sub, eff));
    else if(exp instanceof Star) return valid(exp.sub, eff);
    else if(exp instanceof Or) return (valid(exp.left, eff) || valid(exp.right, eff));
    else if(exp instanceof And) return (valid(exp.left, eff) && valid(exp.right, eff));
    else if(exp instanceof Neg) return true;
    else if(exp instanceof Dot) return nullable(exp.left) ? (valid(exp.left, eff) || valid(exp.right, eff)) : valid(exp.left, eff);

    // otherwise
    else error("Undefined expression", (new Error()).fileName, (new Error()).lineNumber);
  }

  //    _         _         
  // __| |___ _ _(_)_ _____ 
  /// _` / -_) '_| \ V / -_)
  //\__,_\___|_| |_|\_/\___|

  function derive(exp, eff) {
    log("derive", exp + "\\" + eff);

    if(!(exp instanceof Expression))
      error("Invalid expression", (new Error()).fileName, (new Error()).lineNumber);
    if(!(eff instanceof Effect)) 
      error("Invalid effect", (new Error()).fileName, (new Error()).lineNumber);

    // literal
    if(exp instanceof Get) return subseteq(exp, eff) ? Empty() : Null();
    else if(exp instanceof Set) return subseteq(exp, eff) ? Empty() : Null();
    else if(exp instanceof Call) return subseteq(exp, eff) ? Empty() : Null();
    else if(exp instanceof Return) return subseteq(exp, eff) ? Empty() : Null();
    else if(exp instanceof Construct) return subseteq(exp, eff) ? Empty() : Null();
    else if(exp instanceof Exception) return subseteq(exp, eff) ? Empty() : Null();
    else if(exp instanceof Any) return Empty();

    // expressions
    else if(exp instanceof Empty) return Null();
    else if(exp instanceof Null) return Null();  
    else if(exp instanceof Cmp) return !(subseteq(exp, eff)) ? Empty() : Null();
    else if(exp instanceof Star) return Dot(derive(exp.sub, eff), exp);
    else if(exp instanceof Or) return Or(derive(exp.left, eff), derive(exp.right, eff));
    else if(exp instanceof And) return And(derive(exp.left, eff), derive(exp.right, eff));
    else if(exp instanceof Neg) return Neg(derive(exp.sub, eff));
    else if(exp instanceof Dot) return nullable(exp.left)
      ? Or(Dot(derive(exp.left, eff), exp.right), derive(exp.right, eff)) : Dot(derive(exp.left, eff), exp.right);

    // otherwise
    else error("Undefined expression", (new Error()).fileName, (new Error()).lineNumber);
  }

  //                    _    
  // ___ __ _ _  _ __ _| |___
  /// -_) _` | || / _` | (_-<
  //\___\__, |\_,_\__,_|_/__/
  //       |_|               

  function subseteq(literal, effect) {
    log("equals", literal + ">=" + effect);

    if(!(literal instanceof Literal))
      error("Invalid expression", (new Error()).fileName, (new Error()).lineNumber);
    if(!(effect instanceof Effect))
      error("Invalid expression", (new Error()).fileName, (new Error()).lineNumber);

    if((literal instanceof Get) && (effect instanceof TreatJS.Effect.Get)) {
      return (literal.target===effect.target) && test(literal.property, effect.property);
    } else if((literal instanceof Set) && (effect instanceof  TreatJS.Effect.Set)) {
      return (literal.target===effect.target) && test(literal.property, effect.property);
    } else if((literal instanceof Call) && (effect instanceof TreatJS.Effect.Call)) {
      return (literal.target===effect.target);
    } else if((literal instanceof Return) && (effect instanceof TreatJS.Effect.Return)) {
      return (literal.target===effect.target);
    } else if((literal instanceof Construct) && (effect instanceof TreatJS.Effect.Construct)) {
      return (literal.target===effect.target);
    } else if((literal instanceof Exception) && (effect instanceof TreatJS.Effect.Exception)) {
      return (literal.target===effect.target);
    } else return false;
  }

  function test(property, string) {
    log("test", property + ">=" + string);

    if(property instanceof RegExp) {
      return property.test(string);
    } else {
      return property===string;
    }
  }

  function equals(exp1, exp2) {
    log("equals", exp1 + "==" + exp2);

    if(!(exp1 instanceof Expression))
      error("Invalid expression", (new Error()).fileName, (new Error()).lineNumber);
    if(!(exp2 instanceof Expression))
      error("Invalid expression", (new Error()).fileName, (new Error()).lineNumber);

    // literals
    if((exp1 instanceof Get) && (exp2 instanceof Get)) 
      return (exp1.target===exp2.target) && (exp1.property===exp2.property);
    else if((exp1 instanceof Set) && (exp2 instanceof Set)) 
      return (exp1.target===exp2.target) && (exp1.property===exp2.property);
    else if((exp1 instanceof Call) && (exp2 instanceof Call))
      return (exp1.target===exp2.target);
    else if((exp1 instanceof Return) && (exp2 instanceof Return))
      return (exp1.target===exp2.target);
    else if((exp1 instanceof Construct) && (exp2 instanceof Construct))
      return (exp1.target===exp2.target);
    else if((exp1 instanceof Exception) && (exp2 instanceof Exception))
      return (exp1.target===exp2.target);
    else if((exp1 instanceof Any) && (exp2 instanceof Any))
      return (exp1.target===exp2.target);

    // expressions
    else if((exp1 instanceof Empty) && (exp2 instanceof Empty)) 
      return true;
    else if((exp1 instanceof Null) && (exp2 instanceof Null))
      return true;
    else if((exp1 instanceof Cmp) && (exp2 instanceof Cmp))
      return identical(exp1.sub, exp2.sub);
    else if((exp1 instanceof Star) && (exp2 instanceof Star))
      return identical(exp1.sub, exp2.sub);
    else if((exp1 instanceof Or) && (exp2 instanceof Or))
      return(identical(exp1.left, exp2.left) && identical(exp1.right, exp2.right)) 
        || (identical(exp1.left, exp2.right) && identical(exp1.right, exp2.left));
    else if((exp1 instanceof And) && (exp2 instanceof And))
      return (identical(exp1.left, exp2.left) && identical(exp1.right, exp2.right)) 
        || (identical(exp1.left, exp2.right) && identical(exp1.right, exp2.left));
    else if((exp1 instanceof Neg) && (exp2 instanceof Neg))
      return identical(exp1.sub, exp2.sub);
    else if((exp1 instanceof Dot) && (exp2 instanceof Dot))
      identical(exp1.left, exp2.left) && identical(exp1.right, exp2.right);

    // otherwise
    else return false;
  }

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Temporal", {});

  // Constructor
  TreatJS.define(TreatJS.Temporal, "Expression", Expression);
  TreatJS.define(TreatJS.Temporal, "Literal", Literal);
  TreatJS.define(TreatJS.Temporal, "Effect", Effect);

  // Literals
  TreatJS.define(TreatJS.Temporal, "Get", Get);
  TreatJS.define(TreatJS.Temporal, "Set", Set);
  TreatJS.define(TreatJS.Temporal, "Call", Call);
  TreatJS.define(TreatJS.Temporal, "Return", Return);
  TreatJS.define(TreatJS.Temporal, "Construct", Call);
  TreatJS.define(TreatJS.Temporal, "Exception", Return);
  TreatJS.define(TreatJS.Temporal, "Any", Any);

  // Expressons
  TreatJS.define(TreatJS.Temporal, "Null", Null);
  TreatJS.define(TreatJS.Temporal, "Empty", Empty);
  TreatJS.define(TreatJS.Temporal, "Cmp", Cmp);
  TreatJS.define(TreatJS.Temporal, "Star", Star);
  TreatJS.define(TreatJS.Temporal, "Or", Or);
  TreatJS.define(TreatJS.Temporal, "And", And);
  TreatJS.define(TreatJS.Temporal, "Neg", Neg);
  TreatJS.define(TreatJS.Temporal, "Dot", Dot);

  // Functions  
  TreatJS.define(TreatJS.Temporal, "nullable", nullable);
  TreatJS.define(TreatJS.Temporal, "derive", derive);
  TreatJS.define(TreatJS.Temporal, "valid", valid);

  // ___         _                            _   
  //| __|_ ___ _(_)_ _ ___ _ _  _ __  ___ _ _| |_ 
  //| _|| ' \ V / | '_/ _ \ ' \| '  \/ -_) ' \  _|
  //|___|_||_\_/|_|_| \___/_||_|_|_|_\___|_||_\__|

  var env = new WeakMap();

  function link(id, target, proxy, handler) {
    log("link", id);

    env.set(id, {target:target, proxy:proxy, handler:handler});
  }

  function reveal(id) {
    log("reveal", id);

    if(!env.has(id)) error("Misleading Variable", (new Error()).fileName, (new Error()).lineNumber);
    else return env.get(id).target;
  }

  function lookup(id) {
    log("lookup", id);

    if(!env.has(id)) error("Misleading Variable", (new Error()).fileName, (new Error()).lineNumber);
    else return env.get(id);
  }

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.define(TreatJS.Temporal, "link", link);
  TreatJS.define(TreatJS.Temporal, "reveal", reveal);
  TreatJS.define(TreatJS.Temporal, "lookup", lookup);

  // _    _ _                _ _  _              _ _         
  //| |  (_) |_ ___ _ _ __ _| | || |__ _ _ _  __| | |___ _ _ 
  //| |__| |  _/ -_) '_/ _` | | __ / _` | ' \/ _` | / -_) '_|
  //|____|_|\__\___|_| \__,_|_|_||_\__,_|_||_\__,_|_\___|_|   

  function LiteralHandler() {
    if(!(this instanceof LiteralHandler)) return new LiteralHandler();

    this.has = function(target, name) {
      return true;
    };

    this.get = function(target, name, receiver) {
      return new Get(target, name);
    };

    this.set = function(target, name, receiver) {
      return new Set(target, name);
    };

    this.apply = function(target, thisArgs, argumentsArg) {
      return new Dot(new Call(target), new Return(target));
    };

    this.construct = function(target, thisArgs, argumentsArg) {
      return new Dot(new Construct(target), new Call(target), new Return(target));
    };
  }
  LiteralHandler.prototype = {};
  LiteralHandler.prototype.toString = function() {
    return "[[TreatJS/LiteralHandler]]";
  }

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.define(TreatJS.Temporal, "Handler", LiteralHandler);

})(TreatJS);
