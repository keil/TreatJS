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

  // id --> proxy
  var proxies = new WeakMap();
  // proxy --> value;
  var values = new WeakMap();

  function wrap(value, id, callbackHandler) {
    var proxy = new Proxy({}, new Proxy({}, new _.Handler.PolymorphicHandler(callbackHandler))); 
    proxies.set(id, proxy);
    values.set(proxy, value);
    return proxy;
  }

  function unwrap(proxy) {
    return values.get(proxy);
  }

  // check contract
  // wrap value
  // unwrap value, 
  // id guarantees that the wraped value and the 
  // id value has to be the same


  function assertWith(arg, contract, global, callbackHandler) {

    if (false) {}

    else if(contract instanceof InContract) {
      var val =  wrap(arg, contract.sub, callbackHandler);
      return val;
    }

    else if(contract instanceof OutContract) {
      if(arg !== proxies.get(contract.sub)) callbackHandler(_.Callback.Handle(_.Logic.False, _.Logic.True, _.Logic.False));
      return values.get(arg);
    }
  }































  var Contract = _.Core.Contract;
  var Constructor = _.Core.Constructor;


  // TODO cache 
  function VariableContract(name) {
    if(!(this instanceof VariableContract)) return new VariableContract(name);

    if((typeof name) !== 'string') error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "name": {
        get: function () { return name; }
      }
    });
    this.toString = function() { return "$"+name ; };

  }
  VariableContract.prototype = Object.create(Constructor.prototype);


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
      return values.length;
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

  function VariableList(elements) { 
    if(!(this instanceof VariableList)) return new VariableList(elements);
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
  VariableList.prototype = Object.create(List.prototype);










  // Todo, better to define Vars-Object similar to Map ?

  // is Parametric a delayed Constructor ?

  /*
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
     */

  /*
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
  */




  function InContract(sub) {
    if(!(this instanceof InContract)) return new InContract(sub);

    if(!(sub instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "sub": {
        get: function () { return sub; }
      }
    });

    this.toString = function() {  return "(in(" + sub.toString() + "))"; };
  }
  InContract.prototype = Object.create(Contract.prototype); // TODO, prototype instanceof Constructor

  function OutContract(sub) {
    if(!(this instanceof OutContract)) return new OutContract(sub);

    if(!(sub instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "sub": {
        get: function () { return sub; }
      }
    });

    this.toString = function() {  return "(out(" + sub.toString() + "))"; };
  }
  OutContract.prototype = Object.create(Contract.prototype); // TODO, prototype instanceof Constructor

  /*
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
     */

  //  var x = new Proxy(trget, handler);

  //var reflect = new ReflectionHandler(contract, global, callbackHandler);
  //var noop = new NoOpHandler();
  //var proxy = new Proxy(arg, new Proxy(noop, reflect));




  function ParametricHandler(contract, global, handler) {
    if(!(this instanceof ParametricHandler)) return new ParametricHandler(contract, global, handler);

    this.apply = function(target, thisArg, args) {
      var bindings = {};
      contract.vars.foreach(function(key, value) {
        bindings[value.name] = args[key];
        // TODO, test if instanceof contarct
      }); // TODO, test if proeprties are set
      //var newglobal = global.merge(contract.binding);

      return Contract.With(bindings, contract.sub); // TODO, test
      //assertWith(val, range, global, handler);
    };

  }










  /**
   * Polymorphic Contracts
   */
/*
  __define("Polymorphic", {}, _);

  __define("Variable", VariableContract, _.Polymorphic);
  __define("Variables", VariableList, _.Polymorphic);

  //  __define("Abstraction", ContractAbstraction, _.Polymorphic);



  __define("In", InContract, _.Polymorphic);
  __define("Out", OutContract, _.Polymorphic);

  __define("assert", assertWith, _.Polymorphic);
*/
})(TreatJS);
