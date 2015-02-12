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

// ==================================================

// subset semantics
//run("test/callback/subset.js");

// ==================================================






//Contract.assert(1, TypeOf("number"));

(function() {

  function dplus (x, y) {
    return ""+(x+y);
  }

  var plusContract = Contract.AFunction([typeOfNumber,typeOfNumber], typeOfNumber);
  var plusContracted = Contract.assert(dplus, plusContract);
  //plusContracted(1,2);
  //plusContracted("a","b");

  var PlusCtor = Contract.Constructor(function(typeOfContarct){
    return Contract.AFunction([typeOfContarct,typeOfContarct], typeOfContarct);
  });

  var plusContracted2 = Contract.assert(dplus, Contract.construct(PlusCtor, [typeOfNumber]));
  //plusContracted2(1,2);
  //plusContracted2("a","b");

  var plusContracted3 = Contract.assert(dplus, PlusCtor.build(typeOfNumber));
  //plusContracted3(1,2);
  //plusContracted3("a","b");

  var plusCtor = PlusCtor.ctor;
  var plusContracted4 = Contract.assert(dplus, plusCtor([typeOfNumber]));
  //plusContracted4(1,2);
  //plusContracted3("a","b");

})();



(function() {

  // new style

  function dplus (x, y) {
    return (x+y);
  }

  var Plus = Contract.Constructor(function(typeOfContarct){
    return Contract.AFunction([typeOfContarct,typeOfContarct], typeOfContarct);
  });

  //var plusNum = Contract.construct(Plus, arg1, arg2, ...);
  //var dplusNum = Contract.assert(dplus, plusNum);

  //var DPlus = Contract.assert(dplus, Plus);
  //var dplusNum2 = DPlus(arg1, arg2, ...);

  // NOTE: abstraction over value
  // contarcts can be values
  //

})();




































(function() {

  function f (x, y) {
    return ""+(x+y);
  }

  var plus = Contract.assert(f,
    Contract.Intersection(
      Contract.AFunction([typeOfNumber,typeOfNumber], typeOfNumber),
      Contract.AFunction([typeOfString,typeOfString], typeOfString)
      )
    );

  plus("1", "2");
  //plus(1, 2);

});


// ==================================================

TreatJS.Statistic.print();

// ==================================================

quit();
