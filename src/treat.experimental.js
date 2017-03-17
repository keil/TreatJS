/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014-2016, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */

TreatJS.package("TreatJS.Experimental", function (TreatJS, Contract, Configuration, Realm) {

  //   _           _  ___         _               _   
  //  /_\  _ _  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
  // / _ \| ' \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
  ///_/ \_\_||_\__,_|\___\___/_||_\__|_| \__,_\__|\__|

  function AndContract(left, right) { 
    if(!(this instanceof AndContract)) return new AndContract(left, right);
    else TreatJS.Prototype.Contract.apply(this); 

    if(!(left instanceof TreatJS.Prototype.Contract))
      throw new TypeError("Invalid contract.");
    if(!(right instanceof TreatJS.Prototype.Contract))
      throw new TypeError("Invalid contract.");

    Object.defineProperties(this, {
      "left": {
        value: left
      },
      "right": {
        value: right
      }
    });
  }
  AndContract.prototype = Object.create(TreatJS.Prototype.Contract.prototype);
  AndContract.prototype.constructor = AndContract;
  AndContract.prototype.toString = function() {
    return "(" + this.left.toString() + " & " + this.right.toString() + ")";
  };

  // _____ ___ __  ___ _ _| |_ 
  /// -_) \ / '_ \/ _ \ '_|  _|
  //\___/_\_\ .__/\___/_|  \__|
  //        |_|                

  TreatJS.export({
    And: AndContract
  });

  //         _                 
  // _ _ ___| |_ _  _ _ _ _ _  
  //| '_/ -_)  _| || | '_| ' \ 
  //|_| \___|\__|\_,_|_| |_||_|

  return {
    And: AndContract
  };



  /**
  //  ___       ___         _               _   
  // / _ \ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| (_) | '_| (__/ _ \ ' \  _| '_/ _` / _|  _|
  // \___/|_|  \___\___/_||_\__|_| \__,_\__|\__|

  function OrContract(left, right) { 
  if(!(this instanceof OrContract)) return new OrContract(left, right);
  else TreatJS.Prototype.Contract.apply(this);

  if(!(left instanceof TreatJS.Prototype.Immediate))
  throw new TypeError("Invalid contract.");
  if(!(right instanceof TreatJS.Prototype.Contract))
  throw new TypeError("Invalid contract.");

  Object.defineProperties(this, {
  "left": {
  value: left
  },
  "right": {
  value: right
  }
  });
  }
  OrContract.prototype = Object.create(TreatJS.Prototype.Contract.prototype);
  OrContract.prototype.constructor = OrContract;
  OrContract.prototype.toString = function() {
  return "(" + this.left.toString() + " - " + this.right.toString() + ")";
  };

  //  __               
  // / _|_ _ ___ _ __  
  //|  _| '_/ _ \ '  \ 
  //|_| |_| \___/_|_|_| 

  /*OrContract.from = function(left, right) {

  if(!(left instanceof TreatJS.Prototype.Contract))
  throw new TypeError("Invalid contract.");
  if(!(right instanceof TreatJS.Prototype.Contract))
  throw new TypeError("Invalid contract.");


  // Case: I - C
  if(left instanceof TreatJS.Prototype.Immediate) {
  return new OrContract(left, right);

// Case: Q - C
} else if(left instanceof TreatJS.Prototype.Delayed) {

// Sub-Case: Q - R
if(right instanceof TreatJS.Prototype.Delayed) {
return new DelayedOrContract(left, right);

// Otherwise
} else {
return OrContract.from(right, left);
}

// Case: (C' + D') - C
} else if(left instanceof UnionContract) {

return new Union(
OrContract.from(left.left, right),
OrContract.from(left.right, right));

// Case: (C' - D') - C
} else if(left instanceof OrContract) {

return OrContract.from(
left.left,
OrContract.from(left.right, right));

// Otherwise
} else {
throw new TypeError("Invalid contract.");
}

}*/

/*
//    _     _                  _ 
// __| |___| |__ _ _  _ ___ __| |
/// _` / -_) / _` | || / -_) _` |
//\__,_\___|_\__,_|\_, \___\__,_|
//                 |__/          

function DelayedOrContract(left, right) { 
if(!(this instanceof DelayedOrContract)) return new DelayedOrContract(left, right);
else TreatJS.Prototype.Delayed.apply(this);

if(!(left instanceof TreatJS.Prototype.Delayed))
throw new TypeError("Invalid contract.");
if(!(right instanceof TreatJS.Prototype.Delayed))
throw new TypeError("Invalid contract.");

Object.defineProperties(this, {
"left": {
value: left
},
"right": {
value: right
}
});
}
DelayedOrContract.prototype = Object.create(TreatJS.Prototype.Delayed.prototype);
DelayedOrContract.prototype.constructor = DelayedOrContract;
DelayedOrContract.prototype.toString = OrContract.prototype.toString;
DelayedOrContract.from = OrContract.from;

*/











/*

   function OrContract(first, second) { 
   if(!(this instanceof OrContract)) return new OrContract(first, second);

   if(!(first instanceof Contract))
   error("Invalid Contract Argument", (new Error()).fileName, (new Error()).lineNumber);
   if(!(second instanceof Contract))
   error("Invalid Contract Argument", (new Error()).fileName, (new Error()).lineNumber);

   Object.defineProperties(this, {
   "first": {
   value: first
   },
   "second": {
   value: second
   }
   });
   }
   OrContract.prototype = Object.create(CombinatorContract.prototype);
   OrContract.prototype.toString = function() {
   return "(" + this.first.toString() + "or" + this.second.toString() + ")";
   };
   */

});
