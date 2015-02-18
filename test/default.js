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

// test code for polymorphic contract

var X = TreatJS.Variable.Variable();
var Y = TreatJS.Variable.Variable();
var Z = TreatJS.Variable.Variable(); 

var idContract = Contract.AFunction([TreatJS.Contract.In(X),TreatJS.Contract.In(Y)], TreatJS.Contract.Out(X));

function id(x,y) {
  //var z = x+y;
  y=x;
  return y;
}

var idContracted = Contract.assert(id, idContract);
idContracted(1,2);

/*
  var x = Variable();
  var y = Variable();
  var z = Variable(); 
*/





// ==================================================

// subset semantics
// run("test/callback/subset.js");

// ==================================================

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
