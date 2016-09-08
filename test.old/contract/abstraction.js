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

  // old style

  function dplus (x, y) {
    return ""+(x+y);
  }

  var plusContract = Contract.AFunction([typeOfNumber,typeOfNumber], typeOfNumber);
  var plusContracted = Contract.assert(dplus, plusContract);
  //plusContracted(1,2);
  //plusContracted("a","b");

  var PlusCtor = Contract.Constructor(function(typeOfContract){
    return Contract.AFunction([typeOfContract,typeOfContract], typeOfContract);
  });

  var plusContracted2 = Contract.assert(dplus, Contract.construct(PlusCtor, typeOfNumber));
  //plusContracted2(1,2);
  //plusContracted2("a","b");

  //var plusContracted3 = Contract.assert(dplus, PlusCtor.build(typeOfNumber));
  //plusContracted3(1,2);
  //plusContracted3("a","b");

  // TODO
  //var plusCtor = PlusCtor.ctor;
  //var plusContracted4 = Contract.assert(dplus, plusCtor([typeOfNumber]));
  //plusContracted4(1,2);
  //plusContracted3("a","b");

})();



(function() {

  // new style

  function dplus (x, y) {
    return ""+(x+y);
  }

  var Plus = Contract.Constructor(function(typeOfContract){
    return Contract.AFunction([typeOfContract,typeOfContract], typeOfContract);
  });

  var AbsPlus = Contract.assert(dplus, Plus);
  var dplusNum = AbsPlus(typeOfNumber);
  //dplusNum(1,2);
  //dplusNum("1","2");
  //dplusNum(true,true);

  dunit.assertSubjectBlame(function() {
    dplusNum(1,2);
  });
  dunit.assertContextBlame(function() {
    dplusNum("1","2");
  });
  dunit.assertContextBlame(function() {
    dplusNum(true,true);
  });

  var dplusStr = AbsPlus(typeOfString);
  //dplusStr(1,2);
  //dplusStr("1","2");
  //dplusStr(true,true);

  dunit.assertContextBlame(function() {
    dplusStr(1,2);
  });
  dunit.assertNoBlame(function() {
    dplusStr("1","2");
  });
  dunit.assertContextBlame(function() {
    dplusStr(true,true);
  });

  //
  // 2
  //

  var PlusNum = Plus.construct(typeOfNumber);
  var dplusNum2 = Contract.assert(dplus, PlusNum);
  //dplusNum2(1,2);
  //dplusNum2("1","2");
  //dplusNum2(true,true);

  dunit.assertSubjectBlame(function() {
    dplusNum2(1,2);
  });
  dunit.assertContextBlame(function() {
    dplusNum2("1","2");
  });
  dunit.assertContextBlame(function() {
    dplusNum2(true,true);
  });

  var PlusStr = Plus.construct(typeOfString);
  var dplusStr2 = Contract.assert(dplus, PlusStr);
  //dplusStr2(1,2);
  //dplusStr2("1","2");
  //dplusStr2(true,true);

  dunit.assertContextBlame(function() {
    dplusStr2(1,2);
  });
  dunit.assertNoBlame(function() {
    dplusStr2("1","2");
  });
  dunit.assertContextBlame(function() {
    dplusStr2(true,true);
  });

  //
  // 3
  //

  var PlusNum2 = Contract.construct(Plus, typeOfNumber);
  var dplusNum2 = Contract.assert(dplus, PlusNum2);
  //dplusNum2(1,2);
  //dplusNum2("1","2");
  //dplusNum2(true,true);

  dunit.assertSubjectBlame(function() {
    dplusNum2(1,2);
  });
  dunit.assertContextBlame(function() {
    dplusNum2("1","2");
  });
  dunit.assertContextBlame(function() {
    dplusNum2(true,true);
  });

  var PlusStr2 = Contract.construct(Plus, typeOfString);
  var dplusStr2 = Contract.assert(dplus, PlusStr2);
  //dplusStr2(1,2);
  //dplusStr2("1","2");
  //dplusStr2(true,true);

  dunit.assertContextBlame(function() {
    dplusStr2(1,2);
  });
  dunit.assertNoBlame(function() {
    dplusStr2("1","2");
  });
  dunit.assertContextBlame(function() {
    dplusStr2(true,true);
  });

  //
  // 4
  //

  var bindings = {typeOfContract:typeOfNumber};

  var Plus2 = Contract.Constructor(function() {
    return Contract.AFunction([typeOfContract,typeOfContract], typeOfContract);
  }, "Plus2", bindings);

  var PlusNum3 = Contract.construct(Plus2);
  var dplusNum3 = Contract.assert(dplus, PlusNum3);
  //dplusNum2(1,2);
  //dplusNum2("1","2");
  //dplusNum2(true,true);

  dunit.assertSubjectBlame(function() {
    dplusNum3(1,2);
  });
  dunit.assertContextBlame(function() {
    dplusNum3("1","2");
  });
  dunit.assertContextBlame(function() {
    dplusNum3(true,true);
  });

  bindings.typeOfContract = typeOfString;

  var PlusStr3 = Contract.construct(Plus2);
  var dplusStr3 = Contract.assert(dplus, PlusStr3);
  //dplusStr2(1,2);
  //dplusStr2("1","2");
  //dplusStr2(true,true);

  dunit.assertContextBlame(function() {
    dplusStr3(1,2);
  });
  dunit.assertNoBlame(function() {
    dplusStr3("1","2");
  });
  dunit.assertContextBlame(function() {
    dplusStr3(true,true);
  });

})();

(function() {

  // new style

  function dplus (x, y) {
    return ""+(x+y);
  }

  var Plus = Contract.Constructor(function(){
    var typeOfContract = Contract.Base(function(arg) {
      return ((typeof arg) == type);
    }, 'typeOfContract');
    return Contract.AFunction([typeOfContract,typeOfContract], typeOfContract);
  }, 'Plus Contract');

  var AbsPlus = Contract.assert(dplus, Contract.With({type:'number'}, Plus));
  var dplusNum = AbsPlus();
  //dplusNum(1,2);
  //dplusNum("1","2");
  //dplusNum(true,true);

  dunit.assertSubjectBlame(function() {
    dplusNum(1,2);
  });
  dunit.assertContextBlame(function() {
    dplusNum("1","2");
  });
  dunit.assertContextBlame(function() {
    dplusNum(true,true);
  });

})();

(function() {

  // new style

  function dplus (x, y) {
    return ""+(x+y);
  }

  var Plus = Contract.Constructor(function(typeOfContract){
    return Contract.AFunction([typeOfContract,typeOfContract], typeOfContract);
  });

  var AbsPlus = Contract.assert(dplus, Contract.And(Plus, Plus));
  //var dplusNum = AbsPlus(typeOfNumber)(1);
  //dplusNum(1,2);
  //dplusNum("1","2");
  //dplusNum(true,true);

  /*dunit.assertSubjectBlame(function() {
    dplusNum(1,2);
    });
    dunit.assertContextBlame(function() {
    dplusNum("1","2");
    });
    dunit.assertContextBlame(function() {
    dplusNum(true,true);
    });*/

})();
