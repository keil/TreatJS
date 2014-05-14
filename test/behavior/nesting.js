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

(function() {
  var obj = {x:true};
  var obj2 = {x:false};

  Predicate = _.BaseContract(function(arg) {
    return true;
  });

  Predicate2 = _.BaseContract(function(arg) {
    _.assert(arg, contract);
    return true;
    //  return (contract instanceof Object);
  });


  // Base Contracts

  var x = _.assert(4711, _.With({_:_, contract:Predicate}, Predicate2));
})();

(function () {
  function ctor(pre) {

    var predicate = function (post) {
      return true;//(preArg.length==postArg.length);
    };

    //return _.BaseContract(predicate);
    return pre;
  } 

  var contract = _.DependentContract(_.Constructor(ctor));

  var f = function() {
    return true;
  }
  var ff = _.assert(f, contract);


  var predicate = function (post) {
    return true; // true;//(preArg.length==postArg.length);
  };
  var arg = _.BaseContract(predicate);


  ff(arg);
})();

(function() {
  function ctor(pre) {
    //return _.BaseContract(predicate);
    return c;
  } 

  var contract = _.DependentContract(_.Constructor(ctor));

  var f = function() {
    return true;
  }

  var predicate = function (post) {
    return true; //false; // true;//(preArg.length==postArg.length);
  };
  var arg = _.BaseContract(predicate);


  var ff = _.assert(f, _.With({c:arg}, contract));
  ff();
})();
