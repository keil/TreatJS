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

  var ctor1 = Contract.Constructor(function(typeOfNumber) {
    Contract.assert(7, typeOfNumber);
    return typeOfNumber;
  }, "Damaged Ctor1/Number");

  Contract.construct(ctor1, typeOfNumber);

  dunit.assertNoBlame(function() {
    Contract.construct(ctor1, typeOfNumber);
  });

  // ----------

  var ctor2 = Contract.Constructor(function(typeOfNumber) {
    Contract.assert("7", typeOfNumber);
    return typeOfNumber;
  }, "Damaged Ctor2/Number");

  //Contract.construct(ctor2, typeOfNumber);

  dunit.assertSubjectBlame(function() {
    Contract.construct(ctor2, typeOfNumber);
  });

  // ----------

  var ctor3 = Contract.Constructor(function(typeOfNumber) {
    var plus = Contract.assert(function(x, y) {
      return ""+(x+y);
    }, Contract.AFunction([typeOfNumber,typeOfNumber],typeOfNumber));
    plus("1", "2");
    return typeOfNumber;
  }, "Damaged Ctor3/Number");

  //Contract.construct(ctor3, typeOfNumber);

  dunit.assertContextBlame(function() {
    Contract.construct(ctor3, typeOfNumber);
  });

  // ----------

  var ctor4 = Contract.Constructor(function(typeOfNumber) {
    var plus = Contract.assert(function(x, y) {
      return ""+(x+y);
    }, Contract.AFunction([typeOfNumber,typeOfNumber],typeOfNumber));
    plus(1, 2);
    return typeOfNumber;
  }, "Damaged Ctor4/Number");

  //Contract.construct(ctor4, typeOfNumber);

  dunit.assertSubjectBlame(function() {
    Contract.construct(ctor4, typeOfNumber);
  });

})();


(function() {

  var base1 = Contract.Base(function(arg) {
    Contract.assert(7, typeOfNumber);
    return true;
  }, "Damaged Base1/Number");

  Contract.assert(1, Contract.With({Contract:Contract, typeOfNumber:typeOfNumber}, base1));

  dunit.assertNoBlame(function() {
    Contract.assert(1, Contract.With({Contract:Contract, typeOfNumber:typeOfNumber}, base1));
  });

  // ----------

  var base2 = Contract.Base(function(arg) {
    Contract.assert("7", typeOfNumber);
    return true;
  }, "Damaged Base2/Number");

  //Contract.assert(1, Contract.With({Contract:Contract, typeOfNumber:typeOfNumber}, base2));

  dunit.assertSubjectBlame(function() {
    Contract.assert(1, Contract.With({Contract:Contract, typeOfNumber:typeOfNumber}, base2));
  });

  // ----------

  var base3 = Contract.Base(function(arg) {
    var plus = Contract.assert(function(x, y) {
      return ""+(x+y);
    }, Contract.AFunction([typeOfNumber,typeOfNumber],typeOfNumber));
    plus("1", "2");
    return true;
  }, "Damaged Base3/Number");

  //Contract.assert(1, Contract.With({Contract:Contract, typeOfNumber:typeOfNumber}, base3));

  dunit.assertContextBlame(function() {
    Contract.assert(1, Contract.With({Contract:Contract, typeOfNumber:typeOfNumber}, base3));
  });

  // ----------

  var base4 = Contract.Base(function(arg) {
    var plus = Contract.assert(function(x, y) {
      return ""+(x+y);
    }, Contract.AFunction([typeOfNumber,typeOfNumber],typeOfNumber));
    plus(1, 2);
    return true;
  }, "Damaged Base4/Number");

  //Contract.assert(1, Contract.With({Contract:Contract, typeOfNumber:typeOfNumber}, base4));

  dunit.assertSubjectBlame(function() {
    Contract.assert(1, Contract.With({Contract:Contract, typeOfNumber:typeOfNumber}, base4));
  });

})();
