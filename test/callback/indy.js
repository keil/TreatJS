(function() {

  // damaged plus function that does NOT fulfill the 
  // intersection Num x Num -> Num \cap Str x Str -> Str
  function f(x, y) {
    return ""+(x+y);
  }

  var plusContract = Contract.Intersection(
    Contract.AFunction([typeOfNumber,typeOfNumber], typeOfNumber),
    Contract.AFunction([typeOfString,typeOfString], typeOfString));

  var testPlusNum = Contract.Base(function(f) {
    f(1,2);
    return true;
  }, "testPlus/Num");

  var testPlusStr = Contract.Base(function(f) {
    f("1","2");
    return true;
  }, "testPlus/Str");

  var testPlusBool = Contract.Base(function(f) {
    f(true, true);
    return true;
  }, "testPlus/Bool");


  var plus = Contract.assert(f, plusContract);  

  /**  TEST 1 **/

  //Contract.assert(plus, testPlusNum);
  Contract.assert(plus, testPlusStr);
  //Contract.assert(plus, testPlusBool);

  dunit.assertSubjectBlame(function() {
    Contract.assert(plus, testPlusNum); 
  });
  dunit.assertNoBlame(function() {
    Contract.assert(plus, testPlusStr);
  });
  dunit.assertContextBlame(function() {
    Contract.assert(plus, testPlusBool);
  });

  /**  TEST 2 **/

  plus("1", "2");
  //plus(1, 2);
  //plus(true, true);

  dunit.assertNoBlame(function() {
    plus("1", "2");
  });
  dunit.assertSubjectBlame(function() {
    plus(1, 2);
  });
  dunit.assertContextBlame(function() {
    plus(true, true);
  });

    /**  TEST 3 **/

  /**  TEST 3 **/

  function id (arg, x, y) {
    arg(x, y);
    return arg;
  }
  var idPlus = Contract.assert(id, Contract.AFunction([plusContract], Any));

  idPlus(f, "1", "2");
  //idPlus(f, 1, 2);
  //idPlus(f, true, true);

  dunit.assertNoBlame(function() {
    idPlus(f, "1", "2");
  });
  dunit.assertContextBlame(function() {
    idPlus(f, 1, 2);
  });
  dunit.assertSubjectBlame(function() {
    idPlus(f, true, true);
  });

  /**  TEST 4 **/

  function id2 (arg, con) {
    Contract.assert(arg, con);
    return arg;
  }
  var id2Plus = Contract.assert(id2, Contract.AFunction([plusContract], Any));

  id2Plus(f, testPlusStr);
  id2Plus(f, testPlusNum); 

  // Note, balme #[testPlus/Num] is wring, because it dies not violate 
  // the context of f
  
  // Note, Root callback gets initialized with the subject and context
  // ging into a base contract, pushs/pops an context, but it 
  // blaming uses the context from the root


  //id2Plus(f, testPlusBool);
  // blaming the subject is wrong, because 
  // its the contract that violates the context
  // however, 

  /*dunit.assertNoBlame(function() {
    id2Plus(f, testPlusStr);
  });
  dunit.assertContextBlame(function() {
    id2Plus(f, testPlusNum);
  });*/
  dunit.assertContextBlame(function() {
    id2Plus(f, testPlusBool);
  });


  /*

     plus(true, true);

     function id (arg) {
//arg(1,2);
//arg(true, true);

//Contract.assert(plus, testPlus);
return Contract.assert(arg, plusContract);
//Contract.assert(arg, testPlus);
return arg;
}*/

//var idPlus = Contract.assert(id, Contract.AFunction([plusContract], testPlus /*Any*/));
//var PLusP = idPlus(f);

})();



/*
   (function() {

   function f (g) {
   return g (42);
   }

   function h (x) {
   return x;
   }

   var F = Contract.AFunction([Pos], Pos);

   var C = Contract.AFunction([Contract.AFunction([Pos], Pos)], Any);

   var D = Contract.Dependent(Contract.Constructor(function (h) {
   return Contract.Base(function() {
   return (h(0)>=0);
   }
   }));

   var B = Contract.Base(function(h) {
   h(1);
   return true;
   }, "CallWith0");

   var E = Contract.AFunction([B], Any);

// this direction will not work because it throwsn en errort
//var fPrime1 = Contract.assert(f, Contract.And(F, B));
var fPrime2 = Contract.assert(h, Contract.And(B, F));

var fPrime3 = Contract.assert(f, Contract.And(C, E));
var fPrime4 = Contract.assert(f, Contract.And(E, C));

// Note, function contract E,C is picky, 
// because (assert E), (assert C) and than 
// after calling domain_C is applyed first

fPrime4(h);

})();
*/
