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

// Test Use-Case #1
// Compare function input with function output

(function() {
  function eqLength() {
    var length;
    var pre = function (preArg) {
      length = preArg[0].length;
      return true;
    };
    var post = function (postArg) {
      return (length==postArg.length);
    };
    return Contract.Function(Contract.Base(pre), Contract.Base(post));
  } 
  var constructor = Contract.Constructor(eqLength);
  var contract = Contract.construct(constructor);

  var f = function(list) {
    return Array(7);
  }
  var ff = Contract.assert(f, contract);
  ff(Array(7));
})();

(function() {
  function eqLength(length) {
    var pre = function (preArg) {
      return (length==preArg[0].length)
    };
    var post = function (postArg) {
      return (length==postArg.length);
    };
    return Contract.Function(Contract.Base(pre), Contract.Base(post));
  } 
  var constructor = Contract.Constructor(eqLength);
  var contract = Contract.construct(constructor, 7);

  var f = function(list) {
    return Array(7);
  }
  var ff = Contract.assert(f, contract);
  ff(Array(7));
})();

// Test Use-Case #2
// check some global state, becore and after the call it should be identical


(function() {
  var globalValue1 = "L";

  function eqGlobalValue(print) {
    var value;
    var pre = function (preArg) {
      value=preArg[0];
      return true;
    };
    var post = function (postArg) {
      return (value==postArg);
    };
    return Contract.Function(Contract.Base(pre), Contract.Base(post));
  } 

  var constructor = Contract.Constructor(eqGlobalValue);
  var contract = Contract.construct(constructor, print);

  var g = function() {
    globalValue1 = true ? globalValue1 : "X";
  }

  function gg() {
    g();
    return globalValue1;
  }

  var ggg = Contract.assert(gg, contract);
  ggg(globalValue1);
})();


// 2nd run

(function() {
  var globalValue1 = {x:"L"};;

  function eqGlobalValue(print) {
    var value;
    var pre = function (preArg) {
      value=preArg[0];
      return true;
    };
    var post = function (postArg) {
      return (value==postArg);
    };
    return Contract.Function(Contract.Base(pre), Contract.Base(post));
  } 

  var constructor = Contract.Constructor(eqGlobalValue);
  var contract = Contract.construct(constructor, print);

  var g = function() {
    globalValue1 = true ? globalValue1 : {x:"X"};;
  }

  function gg() {
    g();
    return globalValue1;
  }

  var ggg = Contract.assert(gg, contract);
  ggg(globalValue1);
})();

// 3d run
// NOTE: dosnt work, because no function return and terefore no value to compare
(function() {
  var globalValue1 = {x:"L"};;

  function eqGlobalValue(preValue) {
    var predicate = function (postArg) {
      return true; (preValue==postValue);
    };
    return Contract.Base(predicate); 
  }



  var constructor = Contract.Constructor(eqGlobalValue);
  var contract = Contract.construct(constructor, globalValue1);

  var g = function() {
    globalValue1 = false ? globalValue1 : {x:"X"};;
  }

  var gg = Contract.assert(g, Contract.Function(Any, Contract.With({postValue:globalValue1}, contract)));
  gg();
});
(function() {
  var globalValue1 = {x:"L"};;

  function preCons(preValue) {
    var predicate = function (postArg) {
      return true; (preValue==postValue);
    };
    return Contract.Base(predicate); 
  }

  var constructor1 = Contract.Constructor(preCons);

  function postCons(postValue) {
    return Contract.construct(constructor, globalValue1);
  }

  var constructor2 = Contract.Constructor(postCons);




  var constructor = Contract.Constructor(eqGlobalValue);
  var contract = Contract.construct(constructor, globalValue1);

  var g = function() {
    globalValue1 = false ? globalValue1 : {x:"X"};;
  }

  var gg = Contract.assert(g, Contract.Function(Any, Contract.With({postValue:globalValue1}, contract)));
  gg();
});


// Test Use-Case #3
// flip state, a call is allowed only once

(function(){
  function callOnce(preArg) {
    var called = false;

    var predicate = function (postArg) {
      if(called) {
        return false;
      } else {
        called = true;
        return true;
      }
    };

    var Any = function() {
      return true;
    }

    return Contract.Function(Contract.Base(predicate), Contract.Base(Any));
  } 

  var constructor = Contract.Constructor(callOnce);
  var contract = Contract.construct(constructor);

  function h() {
  }

  var hh = Contract.assert(h, contract);
  hh();
  //hh();
})();

// 2nd run

(function(){
  function callOnce(preArg) {
    var called = false;

    var predicate = function (postArg) {
      if(called) return called;
      else {
        called = true;
        return false;
      }
    };

    var Any = function() {
      return true;
    }

    return Contract.Function(Contract.Not(Contract.Base(predicate)), Contract.Base(Any));
  } 

  var constructor = Contract.Constructor(callOnce);
  var contract = constructor.construct();
  //        var contract = Contract.construct(constructor);

  function h() {
  }

  var hh = Contract.assert(h, contract);
  hh();
  // hh();
})();

// Test With

(function() {
  function ContractConstructor(arg) {
    function predicate(arg) {
      Array;
      return true;
    }
    return Contract.Base(predicate);
  } 
  var constructor = Contract.Constructor(ContractConstructor);
  var contract = Contract.construct(constructor, [undefined]);

  Contract.assert(4711, Contract.With({Array:Array}, contract));
  //Contract.assert(4711, contract);
})();

(function() {

  var TypeOf = Contract.Constructor(function(type) {
    var typeOf = Contract.Base(function(arg) {
      return ((typeof arg)===type);
    }, "typeOf");
    return typeOf;
  }, "TypeOf");

  Contract.assert(1, TypeOf.construct('number'));
  //Contract.assert(true, TypeOf.construct('number'));

  dunit.assertNoBlame(function() {
    Contract.assert(1, TypeOf.construct('number'));
  });
  dunit.assertSubjectBlame(function() {
    Contract.assert(true, TypeOf.construct('number'));
  });

});

(function() {

  var TypeOf = Contract.Constructor(function() {
    var typeOf = Contract.Base(function(arg) {
      return ((typeof arg)===type);
    }, "typeOf");
    return typeOf;
  }, "TypeOf", {type:"number"});

  Contract.assert(1, TypeOf.construct());
  //Contract.assert(1, TypeOf.construct());

  dunit.assertNoBlame(function() {
    Contract.assert(1, TypeOf.construct());
  });
  dunit.assertSubjectBlame(function() {
    Contract.assert(true, TypeOf.construct());
  });

});

(function() {

  var TypeOf = Contract.Constructor(function() {
    var typeOf = Contract.Base(function(arg) {
      return ((typeof arg)===type);
    }, "typeOf");
    return typeOf;
  }, "TypeOf");

  var typeOf = TypeOf.construct();

  Contract.assert(1, Contract.With({type:"number"}, typeOf));
  Contract.assert(1, Contract.With({type:"number"}, typeOf));

  Contract.assert(1, Contract.With({type:"number"}, TypeOf.construct()));
  //Contract.assert(true, Contract.With({type:"number"}, TypeOf.construct()));

  dunit.assertNoBlame(function() {
    Contract.assert(1, Contract.With({type:"number"}, TypeOf.construct()));
  });
  dunit.assertSubjectBlame(function() {
    Contract.assert(true, Contract.With({type:"number"}, TypeOf.construct()));
  });

})();
