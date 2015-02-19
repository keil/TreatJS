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

  // damaged plus function that does NOT fulfill the 
  // intersection Num x Num -> Num \cap Str x Str -> Str
  function dplus(x, y) {
    return ""+(x+y);
  }

  function id(arg) {
    return arg;
  }

  var plusNum = Contract.AFunction([typeOfNumber,typeOfNumber], typeOfNumber);
  var plusStr = Contract.AFunction([typeOfString,typeOfString], typeOfString);
  var plusContract = Contract.Intersection(plusNum, plusStr);

  var id1Num = Contract.assert(id, Contract.AFunction([plusNum], plusNum));
  //id1Num(dplus)("1","2");
  //id1Num(dplus)(1,2);

  dunit.assertContextBlame(function() {
    // context blame because context calls the return of id 
    // with wrong values (strings)
    id1Num(dplus)("1","2"); 
  });
  dunit.assertContextBlame(function() {
    // context clame because context calls id 
    // with a wring argument (dplsu)
    id1Num(dplus)(1,2); 
  });

  var id1Str = Contract.assert(id, Contract.AFunction([plusStr], plusStr));
  id1Str(dplus)("1","2");
  //id1Str(dplus)(1,2);

  dunit.assertNoBlame(function() {
    id1Str(dplus)("1","2"); 
  });
  dunit.assertContextBlame(function() {
    // context clame because context calls id 
    // with a wring argument (dplsu)
    id1Str(dplus)(1,2); 
  });

})();


(function() {

  // damaged plus function that does NOT fulfill the 
  // intersection Num x Num -> Num \cap Str x Str -> Str
  function dplus(x, y) {
    return ""+(x+y);
  }

  function id(arg) {
    return arg;
  }

  var plusNum = Contract.AFunction([typeOfNumber,typeOfNumber], typeOfNumber);
  var plusStr = Contract.AFunction([typeOfString,typeOfString], typeOfString);
  var plusContract = Contract.Intersection(plusNum, plusStr);

  var id1Num = Contract.assert(id, Contract.AFunction([plusNum], Any));
  //id1Num(dplus)("1","2");
  //id1Num(dplus)(1,2);

  dunit.assertSubjectBlame(function() {
    // subject blame because subject (id)  is responsible for the use
    // of its argument. Function id gets an Num,Num->Num but retuns it as Any
    id1Num(dplus)("1","2"); 
  });
  dunit.assertContextBlame(function() {
    // context clame because context calls id 
    // with a wring argument (dplsu)
    id1Num(dplus)(1,2); 
  });

  var id1Str = Contract.assert(id, Contract.AFunction([plusStr], Any));
  id1Str(dplus)("1","2");
  //id1Str(dplus)(1,2);

  dunit.assertNoBlame(function() {
    id1Str(dplus)("1","2"); 
  });
  dunit.assertSubjectBlame(function() {
    // subject blame because subject (id)  is responsible for the use
    // of its argument. Function id gets an Num,Num->Num but retuns it as Any
    id1Str(dplus)(1,2); 
  });

})();

(function() {

  // damaged plus function that does NOT fulfill the 
  // intersection Num x Num -> Num \cap Str x Str -> Str
  function dplus(x, y) {
    return ""+(x+y);
  }

  function id(arg) {
    return arg;
  }

  var plusNum = Contract.AFunction([typeOfNumber,typeOfNumber], typeOfNumber);
  var plusStr = Contract.AFunction([typeOfString,typeOfString], typeOfString);
  var plusContract = Contract.Intersection(plusNum, plusStr);

  //
  // 1
  //

  var id_D_sub_R_Num = Contract.assert(id, Contract.AFunction([plusNum], plusContract));
  //id_D_sub_R_Num(dplus)("1","2");
  //id_D_sub_R_Num(dplus)(1,2);
  //id_D_sub_R_Num(dplus)(true,true);

  dunit.assertSubjectBlame(function() {
    id_D_sub_R_Num(dplus)("1","2");
  });
  dunit.assertContextBlame(function() {
    id_D_sub_R_Num(dplus)(1,2);
  });
  dunit.assertContextBlame(function() {
    id_D_sub_R_Num(dplus)(true,true);
  });

  var id_D_sub_R_Str = Contract.assert(id, Contract.AFunction([plusStr], plusContract));
  id_D_sub_R_Str(dplus)("1","2");
  //id_D_sub_R_Str(dplus)(1,2);
  //id_D_sub_R_Str(dplus)(true,true);

  dunit.assertNoBlame(function() {
    id_D_sub_R_Str(dplus)("1","2");
  });
  dunit.assertSubjectBlame(function() {
    id_D_sub_R_Str(dplus)(1,2);
  });
  dunit.assertContextBlame(function() {
    id_D_sub_R_Str(dplus)(true,true);
  });

  //
  // 2
  //

  var id_D_sup_R_Num = Contract.assert(id, Contract.AFunction([plusContract], plusNum));
  //id_D_sup_R_Num(dplus)("1","2");
  //id_D_sup_R_Num(dplus)(1,2);
  //id_D_sup_R_Num(dplus)(true,true);

  dunit.assertContextBlame(function() {
    id_D_sup_R_Num(dplus)("1","2");
  });
  dunit.assertContextBlame(function() {
    id_D_sup_R_Num(dplus)(1,2);
  });
  dunit.assertContextBlame(function() {
    id_D_sup_R_Num(dplus)(true,true);
  });

  var id_D_sup_R_Str = Contract.assert(id, Contract.AFunction([plusContract], plusStr));
  id_D_sub_R_Str(dplus)("1","2");
  //id_D_sup_R_Str(dplus)(1,2);
  //id_D_sup_R_Str(dplus)(true,true);

  dunit.assertNoBlame(function() {
    id_D_sup_R_Str(dplus)("1","2");
  });
  dunit.assertContextBlame(function() {
    id_D_sup_R_Str(dplus)(1,2);
  });
  dunit.assertContextBlame(function() {
    id_D_sup_R_Str(dplus)(true,true);
  });

})();
