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
(function(TreatJS) {

  // out
  var error = TreatJS.error;
  var violation = TreatJS.violation;
  var blame = TreatJS.blame;

  //__   __        _      _    _     
  //\ \ / /_ _ _ _(_)__ _| |__| |___ 
  // \ V / _` | '_| / _` | '_ \ / -_)
  //  \_/\__,_|_| |_\__,_|_.__/_\___|

  function Variable() {
    if(!(this instanceof Variable)) return new Variable();
  }
  Variable.prototype = {};
  Variable.prototype.toString = function() {
    return "$"+this.id; 
  }

  // generates a fresh id for each variable 
  Object.defineProperty(Variable.prototype, "id", {
    get: (function() {
      var i = 0;

      function makeID() {
        i = i+1;
        return i;
      }

      return function() {
        var id = makeID();
        Object.defineProperty(this, "id", {value: id});
        return id;
      };
    })()
  });



  // TODO

  // forall x. ( forall y . y,x->y -> x 


  // stack - stacks abstration frames
  // frame - contains the set of 


  var frames = new Array();

  function Frame() {

  }
  Frame.prototype = Object.create(Array.prototype);
  Frame.prototype = ;


//  function last()


// once set, no overwrite possible


  function set(variable, proxy, value) {
    var frame = lookup(varibale); 
    if(frame)) {
      frame.set(variable, {proxy:proxy, value:value});
    } else {
      error("Wrong Variable Abstration", (new Error()).fileName, (new Error()).lineNumber);
    }
  }


  function lookup(variable) {
      for(var i = frames.length-1; i>=0, i--) {
        if(frames[i].has(variable)) return frames[i];
      }
      return undefined;
  }


  function push(variables) {
    var frame = new WeakMap();

    for(var i=0; i<variables.length; i++) {
      frame.set(varibales[i], undefined);
    }

    frames.push(frame);
  }


  function pop() {
    frames.pop();
  }








  // 




  function ForallContract(variables, contract) {
    if(!(this instanceof ForallContract)) return new ForallContract(variables, contract);

    if(!(first instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
    if(!(second instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "variables": {
        value: variables
      },
      "contract": {
        value: contract
      }
    });
  }
  ForallContract.prototype = Object.create(WrapperContract.prototype);
  ForallContract.prototype.toString = function() {
    return "(forall " + this.variables + "." + contract + ")";
  }

  // TODO, canonicalize







  
    // id --> proxy
  var proxies = new WeakMap();
  // proxy --> value;
  var values = new WeakMap();

  function wrap(id, value, proxy) { 
    proxies.set(id, proxy);
    values.set(proxy, value);
    return proxy;
  }

  function verify(id, proxy) {
    return (proxy == proxies.get(id));
  }


  function unwrap(proxy) {
    return values.get(proxy);
  }




  
  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Polymorphism", {});

  // has to be reduces to 
  // new frame
  // add/set
  // get


  TreatJS.define(TreatJS.Polymorphism, "wrap", wrap);
  TreatJS.define(TreatJS.Polymorphism, "verify", verify);
  TreatJS.define(TreatJS.Polymorphism, "unwrap", unwrap);
















 //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Variable", {});

  TreatJS.define(TreatJS.Variable, "Variable", Variable);

})(TreatJS);
