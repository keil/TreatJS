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

  var obj = {x:0, y:1};

  var xCon = Contract.Base(function(x) {return x<obj.y;});
  var yCon = Contract.Base(function(y) {return obj.x<obj.y;});
  var objCon = Contract.AObject({x:xCon, y:yCon});

  var contracted = Contract.assert(obj, Contract.With({obj:obj}, objCon));

  print("@ " + contracted.x);
  print("@ " + contracted.y);

  //contracted.x=2; // blame the context
  //contracted.y=0; // blame the context

})();
