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

  Contract.assert(plus, testPlusNum);
  Contract.assert(plus, testPlusStr);
  Contract.assert(plus, testPlusBool);

  dunit.assertNoBlame(function() {
    Contract.assert(plus, testPlusNum); 
  });
  dunit.assertNoBlame(function() {
    Contract.assert(plus, testPlusStr);
  });
  dunit.assertNoBlame(function() {
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
  id2Plus(f, testPlusBool);

  dunit.assertNoBlame(function() {
    id2Plus(f, testPlusStr);
  });
  dunit.assertNoBlame(function() {
    id2Plus(f, testPlusNum);
  });
  dunit.assertNoBlame(function() {
    id2Plus(f, testPlusBool);
  });

  /**  TEST 5 **/

  function id3 (arg) {
    return arg;
  }

  var idPlusStr = Contract.assert(id3, Contract.AFunction([plusContract], testPlusStr));
  idPlusStr(f);

  var idPlusNum = Contract.assert(id3, Contract.AFunction([plusContract], testPlusNum));
  idPlusNum(f);

  var idPlusBool = Contract.assert(id3, Contract.AFunction([plusContract], testPlusBool));
  idPlusBool(f);

  dunit.assertNoBlame(function() {
    idPlusStr(f);
  });
  dunit.assertNoBlame(function() {
    idPlusNum(f);
  });
  dunit.assertNoBlame(function() {
    idPlusBool(f);
  });

  /**  TEST 6 **/

  function id4 (arg) {
    return arg;
  }

  var idPlusStr = Contract.assert(id4, Contract.AFunction([plusContract], testPlusStr));
  idPlusStr(plus);

  var idPlusNum = Contract.assert(id4, Contract.AFunction([plusContract], testPlusNum));
  idPlusNum(plus);

  var idPlusBool = Contract.assert(id4, Contract.AFunction([plusContract], testPlusBool));
  idPlusBool(plus);

  dunit.assertNoBlame(function() {
    idPlusStr(plus);
  });
  dunit.assertNoBlame(function() {
    idPlusNum(plus);
  });
  dunit.assertNoBlame(function() {
    idPlusBool(plus);
  });



  // TODO, waht ahppens if is call this wirh plus


//var PLusP = idPlus(f);

  /*

     

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

   var D = Contract.Dependent(Contract.Constructor(function (h) {
   return Contract.Base(function() {
   return (h(0)>=0);
   });
   }));


   var fPrime = Contract.assert(f, D);

   print( fPrime(h) );

   });

   (function() {

   function f (g) {
   return g (42);
   }

   function h (x) {
   return x;
   }

   var C = Contract.AFunction([Contract.AFunction([Pos], Pos)], Any);

   var D = Contract.Dependent(Contract.Constructor(function (h) {
   return Contract.Base(function() {
   return (h(0)>=0);
   });
   }));

   var fPrime = Contract.assert(f, Contract.And( C, D ));

   print( fPrime( h ) );

   });

*/
