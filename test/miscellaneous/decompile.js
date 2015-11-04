/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014, Proglang, University of Freiburg.
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

  var y = 1;

  function add1(x) {
    return (x+y);
  }

  with({y:1000}) {
    print("@@@" + add1(4711));
  }

  var x = 1;
  var y = 2;

  function f () {
    return function () {
      return (x+y);
    }
  }

  var gf = f();
  //print(gf());
  //print(gf());
  x=477979;
  //print(gf());

  var d = TreatJS.decompile(f);
  var df = d();
  //print(df());

  var df1 = d.eval({x:4711, y:4712});
  //print(df1());
  //print(df1());

  var df2 = d.eval({x:-4711, y:-4712});
  //print(df2());
  //print(df2());

  //print(df1());

})();
