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


(function(){

  function cmp (x, y) {
    return (x<y);
  }

  var cmpNum = Contract.assert(cmp, Contract.AFunction([typeOfNumber, typeOfNumber], typeOfBoolean));

  // Note: will not work in the current engine (SpiderMonkey BUG)
  //var Pos = Contract.With({cmp:new Proxy(cmpNum)}, Contract.Base(function(arg) {

  // Note: will not work in PICKY mode (SpiderMonkey BUG)
  var Pos = Contract.With({cmp:cmpNum}, Contract.Base(function(arg) {
    return cmp(0, arg);
  }));


  function plus (x, y) {
    return (x+y);
  }

  var plusPos =  Contract.assert(plus, Contract.AFunction([Pos, Pos], Pos));

  plusPos(1,1);
  plus(-1, 1);

})();
