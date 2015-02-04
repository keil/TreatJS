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

(function() {
  var obj = {x:true};
  var obj2 = {x:false};

  var Predicate = Contract.Base(function(arg) {
    return true;
  });

  var Predicate2 = Contract.Base(function(arg) {
    Contract.assert(arg, contract);
    return true;
    //  return (contract instanceof Object);
  });


  // Base Contracts

  var x = Contract.assert(4711, Contract.With({Contract:Contract, contract:Predicate}, Predicate2));
})();

(function () {
  function ctor(pre) {

    var predicate = function (post) {
      return true;//(preArg.length==postArg.length);
    };

    //return Contract.Base(predicate);
    return pre;
  } 

  var contract = Contract.Dependent(Contract.Constructor(ctor));

  var f = function() {
    return true;
  }
  var ff = Contract.assert(f, contract);


  var predicate = function (post) {
    return true; // true;//(preArg.length==postArg.length);
  };
  var arg = Contract.Base(predicate);


  ff(arg);
})();

(function() {
  function ctor(pre) {
    //return Contract.Base(predicate);
    return c;
  } 

  var contract = Contract.Dependent(Contract.Constructor(ctor));

  var f = function() {
    return true;
  }

  var predicate = function (post) {
    return true; //false; // true;//(preArg.length==postArg.length);
  };
  var arg = Contract.Base(predicate);


  var ff = Contract.assert(f, Contract.With({c:arg}, contract));
  ff();
})();
