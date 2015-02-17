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

/*

// ==================================================


(function() {

  var obj = {x:function(){return "1";}};
  var objXNum = Contract.AObject({x:typeOfNumber});
  var objXStr = Contract.AObject({x:Contract.AFunction([typeOfNumber], typeOfNumber)});

  var objOrCon = Contract.Or(objXNum, objXStr);

  var contracted = Contract.assert(obj, objOrCon);

  contracted.x();

})();

*/






//TreatJS.Statistic.print();
//print("ENDE ...");
//quit();

// ==================================================

// subset semantics
//run("test/callback/subset.js");

// ==================================================





//Contract.assert(1, TypeOf("number"));

































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
