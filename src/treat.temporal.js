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


  function Expression() {
  }
  Expression.prototype = {};





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
  Or.prototype.constructor = And;
  Or.prototype.toString = function() {
    return "(" + this.left.toString() + " &" + this.right.toString() + ")";
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
    return "(" + this.left.toString() + " &" + this.right.toString() + ")";
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
