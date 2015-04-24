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

  function get(target, name, receiver) {
    return target[name] ? Contract.Base(function() { return true; }) : Contract.Base(function() { return false; })
  }
  var contract = Contract.Dependent(Contract.Constructor(get));
  var obj = Contract.assert({a:4711}, Contract.Get(contract));
 
  //obj.b;

})();


(function() {

  var PropertyCheck = Contract.Constructor(function() {
    var target = {};
    var getTraget = Contract.Base(function(arg) {
      return target=arg;
    });
    var checkProperty = Contract.Base(function(name) {
      return (name in target);
    });
    var any = Contract.Base(function() {
      return true;
    });
    var get = Contract.AFunction([getTraget, checkProperty], any);
    return Contract.Get(get);
  });
    
  var obj = Contract.assert({a:4711}, PropertyCheck.construct());
 
  obj.b;

})();






quit();

// user code
var sortNumberArray = (function() {

  var cmp = Contract.assert( function(x,y) {
    return (x<y);
  }, Contract.AFunction([typeOfNumber, typeOfNumber], typeOfBoolean));

  var sort = Contract.assert( function(array, cmp) {
    if (array.length===0) return [];
    var left = [], right = [], pivot = array[0];

    for (var i = 1; i < array.length; i++) {
      cmp(array[i], pivot) ? left.push(array[i]) : right.push(array[i]);
    }

    return sort(left, cmp).concat(pivot, sort(right, cmp));
  }, Contract.AFunction([instanceOfArray, Contract.AFunction([typeOfNumber, typeOfNumber], typeOfBoolean)], instanceOfArray));

  return function (array) {
    return sort(array, cmp);
  };

  //TreatJS Statistics ........... .........................................................................................
  //... #ASSERT =  ...............        6 ................................................................................
  //... #ASSERTWITH =  ...........      372 ................................................................................
  //... #BASE =  .................      222 ................................................................................
  //... #MEMBRANE =  .............     1110 ................................................................................
  //... #DECOMPILE =  ............        3 ................................................................................
  //... #CALLBACK =  .............     1299 ................................................................................    

})();

// step 1
var sortNumberArray1 = (function() {

  var cmp = Contract.assert( function(x,y) {
    return (x<y);
  }, Contract.AFunction([typeOfNumber, typeOfNumber], typeOfBoolean));

  var sort = Contract.assert( function(array, cmp) {
    if (array.length===0) return [];
    var left = [], right = [], pivot = array[0];

    for (var i = 1; i < array.length; i++) {
      cmp(array[i], pivot) ? left.push(array[i]) : right.push(array[i]);
    }

    return sort(left, cmp).concat(pivot, sort(right, cmp));
  }, Contract.AFunction([instanceOfArray], instanceOfArray));

  return function (array) {
    return sort(array, cmp);
  };

  //0,1,2,3,4,5,6,7,8,9
  //TreatJS Statistics ........... .........................................................................................
  //... #ASSERT =  ...............        6 ................................................................................
  //... #ASSERTWITH =  ...........      195 ................................................................................
  //... #BASE =  .................      105 ................................................................................
  //... #MEMBRANE =  .............      525 ................................................................................
  //... #DECOMPILE =  ............        3 ................................................................................
  //... #CALLBACK =  .............      441 ................................................................................

})();

// step 2
var sortNumberArray2 = (function() {

  var cmp = function(x,y) {
    return (x<y);
  }

  var sort = Contract.assert( function(array, cmp) {
    if (array.length===0) return [];
    var left = [], right = [], pivot = array[0];

    for (var i = 1; i < array.length; i++) {
      cmp(Contract.assert(array[i],typeOfNumber), Contract.assert(pivot,typeOfNumber)) ? left.push(array[i]) : right.push(array[i]);
    }

    return sort(left, cmp).concat(pivot, sort(right, cmp));
  }, Contract.AFunction([instanceOfArray], instanceOfArray));

  return (function (array) {
    return sort(array, cmp);
  });

  //0,1,2,3,4,5,6,7,8,9
  //TreatJS Statistics ........... .........................................................................................
  //... #ASSERT =  ...............       48 ................................................................................
  //... #ASSERTWITH =  ...........      153 ................................................................................
  //... #BASE =  .................       84 ................................................................................
  //... #MEMBRANE =  .............      420 ................................................................................
  //... #DECOMPILE =  ............        2 ................................................................................
  //... #CALLBACK =  .............      252 ................................................................................

})();

// step 3
var sortNumberArray3 = (function() {

  var cmp = function(x,y) {
    return (x<y);
  }

  var sort = function(array, cmp) {
    if (array.length===0) return [];
    var left = [], right = [], pivot = array[0];

    for (var i = 1; i < array.length; i++) {
      cmp(Contract.assert(array[i],typeOfNumber), Contract.assert(pivot,typeOfNumber)) ? left.push(array[i]) : right.push(array[i]);
    }

    return sort(left, cmp).concat(pivot, sort(right, cmp));
  }

  return Contract.assert(function (array) {
    return sort(array, cmp);
  }, Contract.AFunction([instanceOfArray], instanceOfArray));

  //0,1,2,3,4,5,6,7,8,9
  //TreatJS Statistics ........... .........................................................................................
  //... #ASSERT =  ...............       48 ................................................................................
  //... #ASSERTWITH =  ...........       53 ................................................................................
  //... #BASE =  .................       44 ................................................................................
  //... #MEMBRANE =  .............      220 ................................................................................
  //... #DECOMPILE =  ............        2 ................................................................................
  //... #CALLBACK =  .............       92 ................................................................................   

})();

print(sortNumberArray3([3,2,1,6,0,7,8,5,9,4]));
TreatJS.Statistic.print();






quit();

var plusp = new Proxy(plus, {});
print(plusp(1,1));
print(typeof plusp);
try{
  print(plusp);
}catch(e) {print("L");}



// polymorphism/ forall 
//run("test/contract/polymorphism.js");




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
