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
load('contracts/aliases.js');

run("test/contract/notcontract.js");
//run("test/blame/negation.js"); // TODO
//run("test/blame/not.js"); // TODO


quit();

// ==================================================

(function() {

function dplus(x, y) {
 return ""+(x+y);
}

var Plus = Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber);

var plusNum = Contract.assert(dplus, Contract.Not(Plus));

plusNum(1, 2);
plusNum("1", "2");

})();


/**
function assert(dplus) {

  var plusNum = Contract.AFunction([typeOfNumber,typeOfNumber], typeOfNumber);
  var plusStr = Contract.AFunction([typeOfString,typeOfString], typeOfString);
  var plusNumStr = Contract.Intersection(plusNum, plusStr);

  eval("dplus = Contract.assert(dplus, plusNumStr)");
}



(function(assert) {

  // damaged plus function that does NOT fulfill the 
  // intersection Num x Num -> Num \cap Str x Str -> Str
  function dplus (x, y) {
    return ""+(x+y);
  }

  //assert(dplus);
  
    var plusNum = Contract.AFunction([typeOfNumber,typeOfNumber], typeOfNumber);
  var plusStr = Contract.AFunction([typeOfString,typeOfString], typeOfString);
  var plusNumStr = Contract.Intersection(plusNum, plusStr);

  eval("dplus = Contract.assert(dplus, plusNumStr)");
 
  
  dplus(1,2);

})(assert);
**/









// ==================================================


(function() {

  // damaged plus function that does NOT fulfill the 
  // intersection Num x Num -> Num \cap Str x Str -> Str
  function dplus (x, y) {
    return ""+(x+y);
  }

  function id (arg) {
    //arg(1,2);
    //return 7;
    //print(arg);
    return arg;
  }

  var plusNum = Contract.AFunction([typeOfNumber,typeOfNumber], typeOfNumber);
  var plusStr = Contract.AFunction([typeOfString,typeOfString], typeOfString);
  var plusNumStr = Contract.Intersection(plusNum, plusStr);


  var idCon = Contract.Forall(Contract.Constructor(function(x) {
          return Contract.AFunction([Contract.In(x)], Contract.Out(x));
  }, "Id/Polymorphism"));
  var idPlus = Contract.AFunction([plusNum], plusNum);

 // var cid = Contract.assert(id, Contract.And(idCon, idPlus)); 
  var cid = Contract.assert(id, Contract.And(idPlus, idCon));
                  //);
 
  //var idNum = idnum(dplus);
 
  var plus = cid(dplus);
  //plus(1,2);
  
});




// =// ==================================================// ===================================================================================================



(function() {

  // damaged plus function that does NOT fulfill the 
  // intersection Num x Num -> Num \cap Str x Str -> Str
  function dplus (x, y) {
    return ""+(x+y);
  }

  function id (arg) {
          //return 7;
          //print(arg);
    return arg;
  }

  var plusNum = Contract.AFunction([typeOfNumber,typeOfNumber], typeOfNumber);
  var plusStr = Contract.AFunction([typeOfString,typeOfString], typeOfString);
  var plusNumStr = Contract.Intersection(plusNum, plusStr);


  var idCon = Contract.Forall(Contract.Constructor(function(x) {
          return Contract.AFunction([Contract.In(x)], Contract.Out(x));
  }, "Id/Polymorphism"));
  var idPlus = Contract.AFunction([plusNum], plusNum);

  var cid = Contract.assert(id, Contract.And(idCon, idPlus)); 
                  //);
 
  //var idNum = idnum(dplus);
 
  var plus = cid(dplus);
  //plus(1,2);
  

});


(function() {

  // damaged plus function that does NOT fulfill the 
  // intersection Num x Num -> Num \cap Str x Str -> Str
  function dplus (x, y) {
    return ""+(x+y);
  }

  function id (arg) {
          //return 7;
          //print(arg);
    return arg;
  }

  var plusNum = Contract.AFunction([typeOfNumber,typeOfNumber], typeOfNumber);
  var plusStr = Contract.AFunction([typeOfString,typeOfString], typeOfString);
  var plusNumStr = Contract.Intersection(plusNum, plusStr);


  var idCon = Contract.Forall(Contract.Constructor(function(x) {
          return Contract.AFunction([Contract.In(x)], Contract.Out(x));
  }, "Id/Polymorphism"));
  var idPlus = Contract.AFunction([plusNumStr], plusNumStr);

  var cid = Contract.assert(id, Contract.And(idCon, idPlus)); 
                  //);
 
  //var idNum = idnum(dplus);
 
  var plus = cid(dplus);
  plus("1","2");
  

});

// ==================================================

// TODO, intersection AND Forall not possible because the
// range contract changes the value.
// tehrefore, the validation hast to compare the raw values

(function() {

  // damaged plus function that does NOT fulfill the 
  // intersection Num x Num -> Num \cap Str x Str -> Str
  function dplus (x, y) {
    return ""+(x+y);
  }

  function id (arg) {
          //return 7;
          //print(arg);
    return arg;
  }

  var plusNum = Contract.AFunction([typeOfNumber,typeOfNumber], typeOfNumber);
  var plusStr = Contract.AFunction([typeOfString,typeOfString], typeOfString);
  var plusNumStr = Contract.Intersection(plusNum, plusStr);


  var idCon = Contract.Forall(Contract.Constructor(function(x) {
          return Contract.AFunction([Contract.In(x)], Contract.Out(x));
  }, "Id/Polymorphism"));
  var idPlus = Contract.AFunction([plusNum], plusNum);

  var cid = Contract.assert(id, Contract.And(idPlus, idCon)); 
                  //);
 
  //var idNum = idnum(dplus);
 
  //var plus = cid(dplus);
  //plus(1,2);
  

});


(function() {

  // damaged plus function that does NOT fulfill the 
  // intersection Num x Num -> Num \cap Str x Str -> Str
  function dplus (x, y) {
    return ""+(x+y);
  }

  function id (arg) {
          //return 7;
          //print(arg);
    return arg;
  }

  var plusNum = Contract.AFunction([typeOfNumber,typeOfNumber], typeOfNumber);
  var plusStr = Contract.AFunction([typeOfString,typeOfString], typeOfString);
  var plusNumStr = Contract.Intersection(plusNum, plusStr);


  var idCon = Contract.Forall(Contract.Constructor(function(x) {
          return Contract.AFunction([Contract.In(x)], Contract.Out(x));
  }, "Id/Polymorphism"));
  var idPlus = Contract.AFunction([plusNumStr], plusNumStr);

  var cid = Contract.assert(id, Contract.And(idPlus, idCon)); 
                  //);
 
  //var idNum = idnum(dplus);
 
  var plus = cid(dplus);
  //plus("1","2");
  

});




// ==================================================

(function() {

  function id(x) {
    return x;
  }

  function f (x, y) {
    return y;
  }

  var NumNum = Contract.AFunction([typeOfNumber], typeOfNumber);

  var False = Contract.Base(function() {return false; }, "False");

  var Negation = Contract.AFunction([NumNum], False);

  var idn = Contract.assert(id, Negation);

  //var g = idn(f); // domain: undefined, range: false

  //g(1,1); 
  //g(1,"1");
  //g("1",1);
  //g("1","1");

})();


(function() {

  function id(x) {
    return x;
  }

  function f (x, y) {
    return y;
  }

  var NumNum = Contract.AFunction([typeOfNumber], typeOfNumber);

  var True = Contract.Base(function() {return true; }, "True");
  var False = Contract.Base(function() {return false; }, "False");

  var Negation = Contract.Intersection(Contract.AFunction([NumNum], False), True);

  //var idn = Contract.assert(id, Negation);

  //var g = idn(f); // domain: undefined, range: false

  //g(1,1); 
  //g(1,"1");
  //g("1",1);
  //g("1","1");

})();


// ==================================================

// subset semantics
// run("test/callback/subset.js");

// ==================================================

(function() {

// f : [[Even]->Even] -> Even \cap [[Pos]->Pos] -> Pos
function f ( g ) {
  // g : [Even]->Even \cup [Pos]->Pos] 
  // x : Even \cap Pos
  g(x); 
}





// plus : [Num,Num] -> Num \cap [Str,Str]-> Str 
function plus (x, y) {
  return (x+y);
}

// tets: [[Num,Num] -> Num] -> Num 
function test (plus) {
  return plus(1,2)
}


// add1 : [([Num,Num] -> Num), Num
function add1(plus, x) {
  return plus(x, 1);
}

// inc : 
function inc (add1) {
  return add1(plus);
}

});

// ==================================================

TreatJS.Statistic.print();

// ==================================================

quit();
