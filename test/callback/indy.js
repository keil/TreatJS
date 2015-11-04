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
  //
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
  //id2Plus(f, testPlusNum); 
  //id2Plus(f, testPlusBool);

  dunit.assertNoBlame(function() {
    id2Plus(f, testPlusStr);
  });
  dunit.assertContextBlame(function() {
    id2Plus(f, testPlusNum);
  });
  dunit.assertContextBlame(function() {
    id2Plus(f, testPlusBool);
  });

  /**  TEST 5 **/

  function id3 (arg) {
    return arg;
  }

  var idPlusStr = Contract.assert(id3, Contract.AFunction([plusContract], testPlusStr));
  idPlusStr(f);

  var idPlusNum = Contract.assert(id3, Contract.AFunction([plusContract], testPlusNum));
  //idPlusNum(f);

  var idPlusBool = Contract.assert(id3, Contract.AFunction([plusContract], testPlusBool));
  //idPlusBool(f);

  dunit.assertNoBlame(function() {
    idPlusStr(f);
  });
  dunit.assertContextBlame(function() {
    idPlusNum(f);
  });
  dunit.assertContextBlame(function() {
    idPlusBool(f);
  });

  /**  TEST 6 **/

  function id4 (arg) {
    return arg;
  }

  var idPlusStr = Contract.assert(id4, Contract.AFunction([plusContract], testPlusStr));
  idPlusStr(plus);

  var idPlusNum = Contract.assert(id4, Contract.AFunction([plusContract], testPlusNum));
  //idPlusNum(plus);

  var idPlusBool = Contract.assert(id4, Contract.AFunction([plusContract], testPlusBool));
  //idPlusBool(plus);

  dunit.assertNoBlame(function() {
    idPlusStr(plus);
  });
  dunit.assertSubjectBlame(function() {
    idPlusNum(plus);
  });
  dunit.assertContextBlame(function() {
    idPlusBool(plus);
  });

})();

(function() {

  function f (g) {
    return g (42);
  }

  function g (x) {
    return x;
  }

  var D = Contract.Dependent(Contract.Constructor(function (h) {
    return Contract.Base(function(r) {
      return (h(0)>=0);
    }, "Flat/ Call with 0");
  }), "Ctor/ Call with 0");

  var fD = Contract.assert(f, D);
  print( fD( g ) );

  dunit.assertNoBlame(function() {
    print( fD( g ) );
  });

})();

(function() {

  function f (g) {
    return g (42);
  }

  function g (x) {
    return x;
  }

  var C = Contract.AFunction([Contract.AFunction([Pos], Pos)], Any);

  var D = Contract.Dependent(Contract.Constructor(function (h) {
    return Contract.Base(function(r) {
      return (h(0)>=0);
    }, "Flat/ Call with 0");
  }, {},"Ctor/ Call with 0"));

  // LAX style
  var fCD = Contract.assert(f, Contract.And( C, D ));
  print( fCD( g ) );

  dunit.assertNoBlame(function() {
    print( fCD( g ) );
  });

  // PICKY style
  var fDC = Contract.assert(f, Contract.And( D, C ));
  //print( fDC( g ) );

  dunit.assertContextBlame(function() {
    print( fDC( g ) );
  });

})();

(function() {

  function f (g) {
    return g (42);
  }

  function g (x) {
    return x;
  }

  var C = Contract.AFunction([Contract.AFunction([Pos], Pos)], Any);

  var D = Contract.Dependent(Contract.Constructor(function (h) {
    (h(0)>=0);
    return Contract.Base(function(r) {
      return true;
    }, "Flat/ Call with 0");
  }, {},"Ctor/ Call with 0"));

  // LAX style
  var fCD = Contract.assert(f, Contract.And( C, D ));
  print( fCD( g ) );

  dunit.assertNoBlame(function() {
    print( fCD( g ) );
  });

  // PICKY style BUT LAX blaming semantics (sbx removes contracts)
  var fDC = Contract.assert(f, Contract.And( D, C ));
  //print( fDC( g ) );

  dunit.assertContextBlame(function() {
    print( fDC( g ) );
  });

})();

(function() {

  function f (g) {
    return g (42);
  }

  function g (x) {
    return x;
  }

  var C = Contract.AFunction([Contract.AFunction([Pos], Pos)], Any);

  var D = Contract.Dependent(Contract.Constructor(function (h) {
    (h(0)>=0);
    return Contract.Base(function(r) {
      return true;
    }, "Flat/ Call with 0");
  }, {},"Ctor/ Call with 0"));

  // LAX style
  var fC = Contract.assert(f, C);
  var fCD = Contract.assert(fC, D);
  print( fCD( g ) );

  dunit.assertNoBlame(function() {
    print( fCD( g ) );
  });

  // PICKY style 
  var fD = Contract.assert(f, D);
  var fDC = Contract.assert(fD, C);
  //print( fDC( g ) );

  dunit.assertContextBlame(function() {
    print( fDC( g ) );
  });

})();

(function() {

  var obj = {x:4711, y:4712, z:"4713"};
  var objContract = Contract.AObject({x:typeOfNumber, y:typeOfNumber, z:typeOfNumber});
  var objContracted = Contract.assert(obj, objContract);

  var testXRead = Contract.Base(function(target) {
    target.x;
    return true;
  }, "testX/Read");

  var testYRead = Contract.Base(function(target) {
    target.y;
    return true;
  }, "testY/Read");

  var testZRead = Contract.Base(function(target) {
    target.z;
    return true;
  }, "testZ/Read");

  // Note:
  // Write contracts are not possible because sbx non-interference

  Contract.assert(objContracted, testXRead);
  Contract.assert(objContracted, testYRead);
  //Contract.assert(objContracted, testZRead);

  dunit.assertNoBlame(function() {
    Contract.assert(objContracted, testXRead);
  });
  dunit.assertNoBlame(function() {
    Contract.assert(objContracted, testYRead);
  });
  dunit.assertSubjectBlame(function() {
    Contract.assert(objContracted, testZRead);
  });

})();

(function() {

  var obj = {dplus:function(x,y) { return ""+(x+y); }, x:4712, y:"4713"};
  var objContract = Contract.AObject({
    dplus:Contract.Intersection(
            Contract.AFunction([typeOfNumber,typeOfNumber], typeOfNumber),
            Contract.AFunction([typeOfString,typeOfString], typeOfString))
  });
  var objContracted = Contract.assert(obj, objContract);

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

  /**  TEST 1 **/

  //Contract.assert(objContracted.dplus, testPlusNum);
  Contract.assert(objContracted.dplus, testPlusStr);
  //Contract.assert(objContracted.dplus, testPlusBool);

  dunit.assertSubjectBlame(function() {
    Contract.assert(objContracted.dplus, testPlusNum); 
  });
  dunit.assertNoBlame(function() {
    Contract.assert(objContracted.dplus, testPlusStr);
  });
  dunit.assertContextBlame(function() {
    Contract.assert(objContracted.dplus, testPlusBool);
  });

})();

(function() {

  var obj = {dplus:function() { return (this.x+this.y); }, x:4712, y:"4713"};
  var objContract = Contract.AObject({
    dplus:Contract.Intersection(
            Contract.AFunction([typeOfNumber,typeOfNumber], typeOfNumber),
            Contract.AFunction([typeOfString,typeOfString], typeOfString))
  });
  var objContracted = Contract.assert(obj, objContract);

  var testPlusNum = Contract.Base(function(o) {
    o.dplus(1,2);
    return true;
  }, "testPlus/Num");

  var testPlusStr = Contract.Base(function(o) {
    o.dplus("1","2");
    return true;
  }, "testPlus/Str");

  var testPlusBool = Contract.Base(function(o) {
    o.dplus(true, true);
    return true;
  }, "testPlus/Bool");

  /**  TEST 1 **/

  //Contract.assert(objContracted, testPlusNum);
  Contract.assert(objContracted, testPlusStr);
  //Contract.assert(objContracted, testPlusBool);

  dunit.assertSubjectBlame(function() {
    Contract.assert(objContracted, testPlusNum); 
  });
  dunit.assertNoBlame(function() {
    Contract.assert(objContracted, testPlusStr);
  });
  dunit.assertContextBlame(function() {
    Contract.assert(objContracted, testPlusBool);
  });

})();

(function() {

  var obj = {dplus:function(x,y) { return ""+(x+y); }, x:4712, y:"4713"};
  var objContract = Contract.AObject({
    dplus:Contract.Intersection(
            Contract.AFunction([typeOfNumber,typeOfNumber], typeOfNumber),
            Contract.AFunction([typeOfString,typeOfString], typeOfString))
  });
  var objContracted = Contract.assert(obj, objContract);

  var testPlusNum = Contract.Base(function(obj) {
    obj.dplus(1,2);
    return true;
  }, "testPlus/Num");

  var testPlusStr = Contract.Base(function(obj) {
    obj.dplus("1","2");
    return true;
  }, "testPlus/Str");

  var testPlusBool = Contract.Base(function(obj) {
    obj.dplus(true, true);
    return true;
  }, "testPlus/Bool");

  /**  TEST 1 **/

  //Contract.assert(objContracted, testPlusNum);
  Contract.assert(objContracted, testPlusStr);
  //Contract.assert(objContracted, testPlusBool);

  dunit.assertSubjectBlame(function() {
    Contract.assert(objContracted, testPlusNum); 
  });
  dunit.assertNoBlame(function() {
    Contract.assert(objContracted, testPlusStr);
  });
  dunit.assertContextBlame(function() {
    Contract.assert(objContracted, testPlusBool);
  });

})();
