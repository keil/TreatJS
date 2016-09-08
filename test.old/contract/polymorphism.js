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

//
// 1
//

(function() {
  //var idContract = Contract.AFunction([Contract.In({}),Contract.In({})], Contract.Out({}));
})();

//
// 2
//

(function() {

  function id(arg1, arg2) {
    return arg1;
  }

  var idcon = Contract.Forall(Contract.Constructor(function(x,y) {
    return Contract.AFunction([Contract.In(x), Contract.In(y)], Contract.Out(x));
  }, "Forall/Polymorphism"));

  var cid = Contract.assert(id, idcon);
  cid(1,2);
  cid(10,20); 

})();

(function() {

  function id(arg1, arg2) {
    return arg2;
  }

  var idcon = Contract.Forall(Contract.Constructor(function(x,y) {
    return Contract.AFunction([Contract.In(x), Contract.In(y)], Contract.Out(x));
  }, "Forall/Polymorphism"));

  var cid = Contract.assert(id, idcon);

  //cid(1,2);
  dunit.assertSubjectBlame(function() {
    cid(1,2);
  });

})();

//
// 3
//

(function() {

  function add1 (x) {
    return (x+1);
  }

  function lift (f) {
    return function(y) {
      return f(y);
    }
  }

  // forall x,y . (x- -> y+)- -> (x+ -> y-)+
  var liftcon = Contract.Forall(Contract.Constructor(function(x,y) {
    return Contract.AFunction([Contract.AFunction([Contract.Out(x)], Contract.In(y))],
      Contract.AFunction([Contract.In(x)], Contract.Out(y)));
  }, "Lift/Polymorphism"));

  var clift = Contract.assert(lift, liftcon);

  var g = clift(add1);

  g(1);
  dunit.assertNoBlame(function() {
    g(1);
  });

})();

(function() {

  function add1 (x) {
    return (x+1);
  }

  function lift (f) {
    return function(y) {
      return f(y+1);
    }
  }

  // forall x,y . (x- -> y+)- -> (x+ -> y-)+
  var liftcon = Contract.Forall(Contract.Constructor(function(x,y) {
    return Contract.AFunction([Contract.AFunction([Contract.Out(x)], Contract.In(y))],
      Contract.AFunction([Contract.In(x)], Contract.Out(y)));
  }, "Lift/Polymorphism"));

  var clift = Contract.assert(lift, liftcon);

  var g = clift(add1);

  //g(1);
  dunit.assertSubjectBlame(function() {
    g(1);
  });

})();

(function() {

  function add1 (x) {
    return (x+1);
  }

  function lift (f) {
    return function(y) {
      return f(y)+1;
    }
  }

  // forall x,y . (x- -> y+)- -> (x+ -> y-)+
  var liftcon = Contract.Forall(Contract.Constructor(function(x,y) {
    return Contract.AFunction([Contract.AFunction([Contract.Out(x)], Contract.In(y))],
      Contract.AFunction([Contract.In(x)], Contract.Out(y)));
  }, "Lift/Polymorphism"));

  var clift = Contract.assert(lift, liftcon);

  var g = clift(add1);

  //g(1);
  dunit.assertSubjectBlame(function() {
    g(1);
  });

})();

//
// 4
//

(function() {

  function add1 (x) {
    return (x+1);
  }

  function lift (f) {
    return function(y) {
      return f(y);
    }
  }

  // forall x,y . (x- -> x+)- -> (x+ -> x-)+
  var liftcon = Contract.Forall(Contract.Constructor(function(x,y) {
    return Contract.AFunction([Contract.AFunction([Contract.Out(x)], Contract.In(x))],
      Contract.AFunction([Contract.In(x)], Contract.Out(x)));
  }, "Lift/Polymorphism"));

  var clift = Contract.assert(lift, liftcon);

  var g = clift(add1);

  g(1);
  dunit.assertNoBlame(function() {
    g(1);
  });

})();

(function() {

  function add1 (x) {
    return (x+1);
  }

  function lift (f) {
    return function(y) {
      return y;
    }
  }

  // forall x,y . (x- -> x+)- -> (x+ -> x-)+
  var liftcon = Contract.Forall(Contract.Constructor(function(x,y) {
    return Contract.AFunction([Contract.AFunction([Contract.Out(x)], Contract.In(x))],
      Contract.AFunction([Contract.In(x)], Contract.Out(x)));
  }, "Lift/Polymorphism"));

  var clift = Contract.assert(lift, liftcon);

  var g = clift(add1);

  g(1);
  dunit.assertNoBlame(function() {
    g(1);
  });

})();

(function() {

  function add1 (x) {
    return (x+1);
  }

  function lift (f) {
    return function(y) {
      return f(1);
    }
  }

  // forall x,y . (x- -> x+)- -> (x+ -> x-)+
  var liftcon = Contract.Forall(Contract.Constructor(function(x,y) {
    return Contract.AFunction([Contract.AFunction([Contract.Out(x)], Contract.In(x))],
      Contract.AFunction([Contract.In(x)], Contract.Out(x)));
  }, "Lift/Polymorphism"));

  var clift = Contract.assert(lift, liftcon);

  var g = clift(add1);

  //g(1);
  dunit.assertSubjectBlame(function() {
    g(1);
  });

})();

(function() {

  function add1 (x) {
    return (x+1);
  }

  function lift (f) {
    return function(y) {
      return 1;
    }
  }

  // forall x,y . (x- -> x+)- -> (x+ -> x-)+
  var liftcon = Contract.Forall(Contract.Constructor(function(x,y) {
    return Contract.AFunction([Contract.AFunction([Contract.Out(x)], Contract.In(x))],
      Contract.AFunction([Contract.In(x)], Contract.Out(x)));
  }, "Lift/Polymorphism"));

  var clift = Contract.assert(lift, liftcon);

  var g = clift(add1);

  //g(1);
  dunit.assertSubjectBlame(function() {
    g(1);
  });

})();

//
// 5
//

(function() {

  function Beh(value) {
    if(this instanceof Beh) this.value = value;
    else return new Beh(value);
  }

  function add1 (x) {
    return (x+1);
  }

  function lift (f) {
    return function(b) {
      return Beh(f(b.value));
    }
  }

  // forall x,y . (x- -> y+)- -> (x+ -> y-)+
  var liftcon = Contract.Forall(Contract.Constructor(function(x,y) {
    return Contract.AFunction([Contract.AFunction([Contract.Out(x)], Contract.In(y))],
      Contract.AFunction([Contract.AObject({value:Contract.In(x)})], Contract.AObject({value:Contract.Out(y)})));
  }, "Lift/Polymorphism"));

  var clift = Contract.assert(lift, liftcon);

  var g = clift(add1);

  g(Beh(1)).value;
  dunit.assertNoBlame(function() {
    g(Beh(1)).value;
  });

})();

(function() {

  function Beh(value) {
    if(this instanceof Beh) this.value = value;
    else return new Beh(value);
  }

  function add1 (x) {
    return (x+1);
  }

  function lift (f) {
    return function(b) {
      Beh(f(b.value));
      return Beh(2);
    }
  }

  // forall x,y . (x- -> y+)- -> (x+ -> y-)+
  var liftcon = Contract.Forall(Contract.Constructor(function(x,y) {
    return Contract.AFunction([Contract.AFunction([Contract.Out(x)], Contract.In(y))],
      Contract.AFunction([Contract.AObject({value:Contract.In(x)})], Contract.AObject({value:Contract.Out(y)})));
  }, "Lift/Polymorphism"));

  var clift = Contract.assert(lift, liftcon);

  var g = clift(add1);

  //g(Beh(1)).value;
  dunit.assertSubjectBlame(function() {
    g(Beh(1)).value;
  });

})();

(function() {

  function Beh(value) {
    if(this instanceof Beh) this.value = value;
    else return new Beh(value);
  }

  function add1 (x) {
    return (x+1);
  }

  function lift (f) {
    return function(b) {
      return b;
    }
  }

  // forall x,y . (x- -> x+)- -> (x+ -> x-)+
  var liftcon = Contract.Forall(Contract.Constructor(function(x,y) {
    return Contract.AFunction([Contract.AFunction([Contract.Out(x)], Contract.In(x))],
      Contract.AFunction([Contract.AObject({value:Contract.In(x)})], Contract.AObject({value:Contract.Out(x)})));
  }, "Lift/Polymorphism"));

  var clift = Contract.assert(lift, liftcon);

  var g = clift(add1);

  g(Beh(1)).value;
  dunit.assertNoBlame(function() {
    g(Beh(1)).value;
  });

})();

//
// 6
//

(function() {

  function Beh(value) {
    if(this instanceof Beh) this.value = value;
    else return new Beh(value);
  }

  function doswitch(beh) {
    return beh.value;
  }

  // forall x . (beh beh x- ->  beh x)
  var switchcon = Contract.Forall(Contract.Constructor(function(x) {
    return Contract.AFunction([
      Contract.AObject({value:Contract.AObject({value:Contract.In(x)})})],
      Contract.AObject({value:Contract.Out(x)}));
  }, "Switch/Polymorphism"));

  var cswitch = Contract.assert(doswitch, switchcon);

  cswitch(Beh(Beh(1))).value;
  dunit.assertNoBlame(function() {
    cswitch(Beh(Beh(1))).value;
  });

})();

(function() {

  function Beh(value) {
    if(this instanceof Beh) this.value = value;
    else return new Beh(value);
  }

  function doswitch(beh) {
    return beh;
  }

  // forall x . (beh beh x- ->  beh x)
  var switchcon = Contract.Forall(Contract.Constructor(function(x) {
    return Contract.AFunction([
      Contract.AObject({value:Contract.AObject({value:Contract.In(x)}, true)}, true)],
      Contract.AObject({value:Contract.Out(x)}, true));
  }, "Switch/Polymorphism"));

  var cswitch = Contract.assert(doswitch, switchcon);

  //cswitch(Beh(Beh(1))).value;
  dunit.assertSubjectBlame(function() {
    cswitch(Beh(Beh(1))).value;
  });

})();

(function() {

  function Beh(value) {
    if(this instanceof Beh) this.value = value;
    else return new Beh(value);
  }

  function doswitch(beh) {
    return Beh(1);
  }

  // forall x . (beh beh x- ->  beh x)
  var switchcon = Contract.Forall(Contract.Constructor(function(x) {
    return Contract.AFunction([
      Contract.AObject({value:Contract.AObject({value:Contract.In(x)}, true)}, true)],
      Contract.AObject({value:Contract.Out(x)}, true));
  }, "Switch/Polymorphism"));

  var cswitch = Contract.assert(doswitch, switchcon);

  //cswitch(Beh(Beh(1))).value;
  dunit.assertSubjectBlame(function() {
    cswitch(Beh(Beh(1))).value;
  });

})();

//
// 6
//

(function() {

  function test (x) {
    return function (y) {
      return x;
    }
  }

  // forall x,y . x -> (y -> x)
  var testcon = Contract.Forall(Contract.Constructor(function(x, y) {
    return Contract.AFunction([Contract.In(x)], Contract.AFunction([Contract.In(y)], Contract.Out(x)));
  }, "DoubleCall/Polymorphism"));

  var ctest = Contract.assert(test, testcon);

  var g = ctest(1);

  var a = g(1);
  var a = g(2);

  var h = ctest("");

  var a = g(1);

})();

//
// 7
//

(function() {

  function add1 (x) {
    return (x);
  }

  function lift (f) {
    return function(y) {
      return f(y);
    }
  }

  var liftcon = Contract.Forall(Contract.Constructor(function(x,y) {
    return Contract.AFunction([Contract.AFunction([Contract.Out(x)], Contract.In(x))],
      Contract.AFunction([Contract.In(x)], Contract.Out(x)));
  }, "Lift/Polymorphism"));

  var add1con = Contract.Forall(Contract.Constructor(function(x) {
    return Contract.AFunction([Contract.In(x)], Contract.Out(x));
  }, "Add1/Polymorphism"));

  var cadd1 = Contract.assert(add1, add1con);
  var clift = Contract.assert(lift, liftcon);

  var g = clift(cadd1);

  g(1);
  dunit.assertNoBlame(function() {
    g(1);
  });

})();

(function() {

  function add1 (x) {
    return (x+1);
  }

  function lift (f) {
    return function(y) {
      return f(y);
    }
  }

  var liftcon = Contract.Forall(Contract.Constructor(function(x,y) {
    return Contract.AFunction([Contract.AFunction([Contract.Out(x)], Contract.In(x))],
      Contract.AFunction([Contract.In(x)], Contract.Out(x)));
  }, "Lift/Polymorphism"));

  var add1con = Contract.Forall(Contract.Constructor(function(x) {
    return Contract.AFunction([Contract.In(x)], Contract.Out(x));
  }, "Add1/Polymorphism"));

  var cadd1 = Contract.assert(add1, add1con);
  var clift = Contract.assert(lift, liftcon);

  var g = clift(cadd1);

  //g(1);
  dunit.assertSubjectBlame(function() {
    g(1);
  });

})();

(function() {

  function add1 (x) {
    return (x);
  }

  function lift (f) {
    return function(y) {
      return f(y+1);
    }
  }

  var liftcon = Contract.Forall(Contract.Constructor(function(x,y) {
    return Contract.AFunction([Contract.AFunction([Contract.Out(x)], Contract.In(x))],
      Contract.AFunction([Contract.In(x)], Contract.Out(x)));
  }, "Lift/Polymorphism"));

  var add1con = Contract.Forall(Contract.Constructor(function(x) {
    return Contract.AFunction([Contract.In(x)], Contract.Out(x));
  }, "Add1/Polymorphism"));

  var cadd1 = Contract.assert(add1, add1con);
  var clift = Contract.assert(lift, liftcon);

  var g = clift(cadd1);

  //g(1);
  dunit.assertSubjectBlame(function() {
    g(1);
  });

})();

(function() {

  function add1 (x) {
    return (x);
  }

  function lift (f) {
    return function(y) {
      return f(y)+1;
    }
  }

  var liftcon = Contract.Forall(Contract.Constructor(function(x,y) {
    return Contract.AFunction([Contract.AFunction([Contract.Out(x)], Contract.In(x))],
      Contract.AFunction([Contract.In(x)], Contract.Out(x)));
  }, "Lift/Polymorphism"));

  var add1con = Contract.Forall(Contract.Constructor(function(x) {
    return Contract.AFunction([Contract.In(x)], Contract.Out(x));
  }, "Add1/Polymorphism"));

  var cadd1 = Contract.assert(add1, add1con);
  var clift = Contract.assert(lift, liftcon);

  var g = clift(cadd1);

  //g(1);
  dunit.assertSubjectBlame(function() {
    g(1);
  });

})();


(function() {

  function id(x) {
    return (x);
  }

  function testid (f) {
    return function(y) {
      return f(y);
    }
  }

  var testcon = Contract.Forall(Contract.Constructor(function(x) {
    var idcon = Contract.Forall(Contract.Constructor(function(x) {
      return Contract.AFunction([Contract.In(x)], Contract.Out(x));
    }, "ID/Polymorphism"));
    return Contract.AFunction([idcon], Contract.AFunction([Contract.In(x)], Contract.Out(x)));
  }, "TestID/Polymorphism"));

  var ctestid = Contract.assert(testid, testcon);
  var g = ctestid(id);

  g(1);
  dunit.assertNoBlame(function() {
    g(1);
  });

})();

(function() {

  function id(x) {
    return (x+1);
  }

  function testid (f) {
    return function(y) {
      return f(y);
    }
  }

  var testcon = Contract.Forall(Contract.Constructor(function(x) {
    var idcon = Contract.Forall(Contract.Constructor(function(x) {
      return Contract.AFunction([Contract.In(x)], Contract.Out(x));
    }, "ID/Polymorphism"));
    return Contract.AFunction([idcon], Contract.AFunction([Contract.In(x)], Contract.Out(x)));
  }, "TestID/Polymorphism"));

  var ctestid = Contract.assert(testid, testcon);
  var g = ctestid(id);

  //g(1);
  dunit.assertContextBlame(function() {
    g(1);
  });

})();

(function() {

  function id(x) {
    return (x);
  }

  function testid (f) {
    return function(y) {
      return f(y+1);
    }
  }

  var testcon = Contract.Forall(Contract.Constructor(function(x) {
    var idcon = Contract.Forall(Contract.Constructor(function(y) {
      return Contract.AFunction([Contract.In(y)], Contract.Out(y));
    }, "ID/Polymorphism"));
    return Contract.AFunction([idcon], Contract.AFunction([Contract.In(x)], Contract.Out(x)));
  }, "TestID/Polymorphism"));

  var ctestid = Contract.assert(testid, testcon);
  var g = ctestid(id);

  //g(1);
  dunit.assertSubjectBlame(function() {
    g(1);
  });

})();

(function() {

  function id(x) {
    return (x);
  }

  function testid (f) {
    return function(y) {
      return f(y)+1;
    }
  }

  var testcon = Contract.Forall(Contract.Constructor(function(x) {
    var idcon = Contract.Forall(Contract.Constructor(function(x) {
      return Contract.AFunction([Contract.In(x)], Contract.Out(x));
    }, "ID/Polymorphism"));
    return Contract.AFunction([idcon], Contract.AFunction([Contract.In(x)], Contract.Out(x)));
  }, "TestID/Polymorphism"));

  var ctestid = Contract.assert(testid, testcon);
  var g = ctestid(id);

  //g(1);
  dunit.assertSubjectBlame(function() {
    g(1);
  });

})();
