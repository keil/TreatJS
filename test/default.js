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

// perfect style
/*
var idcon = Contract.Forall(function(x,y) {
  return Contract.AFunction([x,y], x);
});*/


function id(arg1, arg2) {
  var x = arg1 + arg2;
  return (arg1===undefined) ? -1 : 1;
}

var idcon = Contract.Forall(Contract.Constructor(function(x,y) {
  //print(y);
  //print(arguments[0]);
  //arguments[0].d;
  //x.d;
  return Contract.AFunction([Contract.In(x), Contract.In(y)], Contract.Out(x));
}, "Forall", {print:print}));

var cid = Contract.assert(id, idcon);
cid(1,2);


// test code for polymorphic contract
/**
 * OLD STYLE
 
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

**/

/*
  var x = Variable();
  var y = Variable();
  var z = Variable(); 
*/

// TODO, verhindern dass es zu ueberschneidungen kommt.
// 


// delayed store -- for each call of the contract has to create a fresh abstraction
// nested 



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
