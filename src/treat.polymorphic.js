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

  var Contract = _.Core.Contract;
  var Constructor = _.Core.Constructor;


  // TODO cache 
  function Variable(name) {
    if(!(this instanceof Variable)) return new Variable(name);

    if((typeof name) !== 'string') error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "name": {
        get: function () { return name; }
      }
    });
    this.toString = function() { return "$"+name ; };

  }
  Variable.prototype = Object.create(Contract.prototype);
  // TODO, prototype is constructor


  function List() {
    if(!(this instanceof List)) return new List();

    var values = [];

    this.foreach = function(callback) {
      values.foreach(function (key, value) {
        callback(key, value);     
      });
    }

    this.set = function(value) {
      var index = values.indexOf(value);
      if(index==-1) values.push(value);
      else values[index] = value;
      return keys.length;
    }

    this.get = function(key) {
      return values[key];
    }

    //this.has = function(key) {
    //  return (keys.indexOf(key)==-1) ? false : true;
    //}

    this.slice = function(key) {
      return values[key];                
    }

    this.toString = function() { 
      var mappings = "";
      this.foreach(function(key, value) {
        mappings += " " + value;
      });
      return "[" + mappings + " ]";
    };
  }
  List.prototype = {};

  function Variables(elements) { 
    if(!(this instanceof Variables)) return new Variables(elements);
    else List.call(this);

    if(elements instanceof Array) {
      var base = this; 
      elements.foreach(function(key, value) {
        base.set(value);
      });
    } else if(elements instanceof Object) {
      for(var key in elements) {
        this.set(elements[key]);
      }
    } else {}
  }
  Variables.prototype = Object.create(List.prototype);














  // Todo, better to define Vars-Object similar to Map ?

  // is Parametric a delayed Constructor ?

  function Parametric(vars, sub) {
    if(!(this instanceof Parametric)) return new Parametric(vars, sub);

    if(!(vars instanceof Variables)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
    if(!(sub instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "vars": {
        get: function () { return vars; }
      },
      "sub": {
        get: function () { return sub; }
      },
    });

    this.toString = function() {  return "(" + vcars.toString() + "." + sub.toString() + ")"; };
  }


  function f(g, x) {
    return g(x);
  }

  function h(x) {
    return x;
  }


  var A = new Variable('A');
  var B = new Variable('B');

  var C = Parametric(
      [A,B],
      Contract.AFunction([ Contract.AFunction([A], B), A], B);
      );

  var e = Contract.assert(f, C);

  e(typeofNumber, typeofNumber)(h, 1);

  //d = e(typeofNumber, typeofNumber);
  //d(h, 1);


  //Contract.Constructor(function())






  function In(sub) {
    if(!(this instanceof In)) return new In(sub);

    if(!(sub instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "sub": {
        get: function () { return sub; }
      }
    });

    this.toString = function() {  return "(in(" + sub.toString() + "))"; };
  }
  In.prototype = Object.create(Contract.prototype); // TODO, prototype instanceof Constructor

  function Out(sub) {
    if(!(this instanceof Out)) return new Out(sub);

    if(!(sub instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "sub": {
        get: function () { return sub; }
      }
    });

    this.toString = function() {  return "(out(" + sub.toString() + "))"; };
  }
  Out.prototype = Object.create(Contract.prototype); // TODO, prototype instanceof Constructor


  function Forall(vars, sub) {
    if(!(this instanceof Forall)) return new Forall(vars, sub);

    if(!(vars instanceof Variables)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
    if(!(sub instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "vars": {
        get: function () { return vars; }
      },
      "sub": {
        get: function () { return sub; }
      },
    });

    this.toString = function() {  return "(forall(" + vcars.toString() + "." + sub.toString() + "))"; };
  }

})(TreatJS);
