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

  // core contracts
  var ImmediateContract = TreatJS.Core.Immediate;
  var DelayedContract = TreatJS.Core.Delayed;
  var CombinatorContract = TreatJS.Core.Combinator;
  var WrapperContract = TreatJS.Core.Wrapper;

  // TODO

  var env = new WeakMap();

  // TODO
  // Note, only set once, else error
  // or ovverride

  function conceal(id, proxy, target) {
    env.set(id, {proxy:proxy, target:target}); 
  }

  function verify(id, proxy) {
    return (env.get(id).proxy===proxy);
  }

  function reveal(id) {
    return env.get(id).target;
  }






  // TODO

  // forall x. ( forall y . y,x->y -> x 


  // stack - stacks abstration frames
  // frame - contains the set of 


  //Frame.prototype = ;


  //  function last()


  // once set, no overwrite possible

  /*
     function set(variable, proxy, value) {
     var frame = lookup(varibale); 
     if(frame) {
     frame.set(variable, {proxy:proxy, value:value});
     } else {
     error("Wrong Variable Abstration", (new Error()).fileName, (new Error()).lineNumber);
     }
     }


     function lookup(variable) {
     for(var i = frames.length-1; i>=0; i--) {
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



*/




  // 


/*

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
  ForallContract.prototype = Object.create(DelayedContract.prototype); // TODO delayed or wrapper ?
  ForallContract.prototype.toString = function() {
    return "(forall " + this.variables + "." + contract + ")";
  }

  */

  // TODO, canonicalize




  /**



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



   **/







  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Polymorphism", {});

  TreatJS.define(TreatJS.Polymorphism, "conceal", conceal);
  TreatJS.define(TreatJS.Polymorphism, "verify", verify);
  TreatJS.define(TreatJS.Polymorphism, "reveal", reveal);

})(TreatJS);
