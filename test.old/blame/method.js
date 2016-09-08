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

  var obj = {p:"#"};

  function addUnchecked(a, b) {
    //return "1";
    return (a+b);
  }

  var context = Contract.Base(function(thisArg) {
    return (thisArg.p === "#");
  }, "#");

  obj.addChecked = Contract.assert(addUnchecked,
    Contract.AMethod([IsNumber, IsNumber], IsNumber, context)
    );

  obj.addChecked(1, 2);
  //obj.addChecked("1", 2);

})();
