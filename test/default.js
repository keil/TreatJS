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

var assert = Contract.assert;
var AFunction = Contract.AFunction;

var minOne = assert(function(x) {
  return x-1;
}, AFunction([typeOfNumber], typeOfNumber));


var [even, odd] = (function() {
  function even (x) {
//    return x==0 ? true : odd(x-1);
    return x==0 ? true : odd(minOne(x));
  }
  function odd (x) {
//    return x==0 ? false : even(x-1);
      return x==0 ? false : even(minOne(x));
  }
  return [
    assert(even, AFunction([typeOfNumber], typeOfBoolean)),
    assert(odd, AFunction([typeOfNumber], typeOfBoolean))
  ];
})();

even(10);






// ==================================================

TreatJS.Statistic.print();

// ==================================================

quit();
quit();


/**
 * get : target, name -> value
 * set : target, name, value -> value
 **/

function get(target, name) {
  return target[name];
}

function set(target, name, value) {
  return target[name] = value;
}

/**
 * Contracts
 **/

var __HasProperty__ = Contract.Constructor(function (name) {
  return Contract.Base(function(target) {
    return (name in target);
  }, "[" + name + " in subject]");
});

var __IsProperty__ = Contract.Constructor(function (name) {
  return Contract.Base(function(target) {
    return (name === target);
  }, "[" + name + "]");
});









// Constructor
function mkProeprtyContract(name, contract) {
  return Contract.AFunction([__HasProperty__.construct(name), __IsProperty__.construct(name)], contract);
}


//
function mkObjectContract(object) {
  var intersection = null
  for(var property of Object.keys(object)) {
    var contract = mkProeprtyContract(property, object[property]);
    intersection = intersection ? Contract.Intersection(intersection, contract) : contract;
  }

  return intersection;
}


/**
 * Test
 **/

var object =  {x:1, y:1};

var specification = {x:typeOfNumber, y:typeOfBoolean, t:typeOfBoolean,};
var get_object = mkObjectContract(specification);

print(get_object);
var getObject = Contract.assert(get, get_object);



print("get x:", getObject(object, "x")); // ok
//print("get y:", getObject(object, "y")); // blame, thron return

print("get t:", getObject(object, "t")); // t is in spec, but not in object, thus sub blame
//print("get s:", getObject(object, "s")); // s is not in spec, thus context blame


//getObject("y");

quit();

// TODO, normal constructor needs to return an abstraction
/*
var Type = Contract.Constructor(function (type) {
 return Contract.Base(function (arg) {
   return (typeof arg) === type;
 });
});
var Number = Type.construct('number');

quit(); */


/*
function test () {
  var args = Array.prototype.slice.call(arguments, 1);
  print(args);
}

test(1,2,3,4);

quit();
*/
/*
var bindings = {x:4711, y:4712};
var contract = Contract.Base(function(arg) {
  return x===4711;
});
var contract2 = Contract.With(bindings, contract);

//print(contract2);

Contract.assert(true, contract2);

bindings.x=4712;
Contract.assert(true, contract2);

quit();
*/

load("examples/objects.js");

quit();
load("examples/invariant.js");
//load("examples/temporal.js");
//load("examples/temporal2.js");
quit();

Contract.assert(1, typeOfNumber);
//Contract.assert("1", typeOfNumber);



quit();


//load("examples/lemma.js");
//load("examples/temporal.js");

function f (x) {
  //return -2;
  //return x+1;
}

var f$even = Contract.AFunction([Even], Even)
var f$pos = Contract.AFunction([Pos], Pos)

var g = Contract.assert(f, Contract.Intersection(f$even, f$pos));
//g(2);



TreatJS.Statistic.print();
quit();
// HARD to see which party to blame

function plus (x, y) {
  return (x + y);
}

function addOne(plus, x) {
  plus(1,1);
  //return plus(x, 1);
  return 1;
}

var plus$number = Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber)
var plus$string = Contract.AFunction([typeOfString, typeOfString], typeOfString)

var addone$number = Contract.AFunction([plus$number, typeOfNumber], typeOfNumber) 
var addone$string = Contract.AFunction([plus$string, typeOfString], typeOfString)

var addone$inter = Contract.Intersection(addone$number, addone$string)

var addOneC = Contract.assert(addOne, addone$inter);

addOneC(plus, 1);




TreatJS.Statistic.print();
quit();




quit();

(function() {

  var plus = function (x, y) {
    return x + y;
  };

  var addTwo = Contract.assert(function (plus, x) {
    return  plus(plus(x, 1), 1);
  }, Contract.AFunction([Contract.Intersection(  
    Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber),
    Contract.AFunction([typeOfString, typeOfString], typeOfString)),typeOfNumber], typeOfNumber));


  print(addTwo(plus, 4711));

})();


TreatJS.Statistic.print();
quit();








var Module = (function() {

  var plus = function (x, y) {
    return x + y;
  }
  
  var addOne = Contract.assert(function (x) {
    return plus (x, 1);
  }, Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber));

  var appenOne = Contract.assert(function (x) {
    return plus (x, "1");
  }, Contract.AFunction([typeOfString, typeOfString], typeOfString));

  return {plus:plus, addOne:addOne, appendOne:appenOne};

})();

Module.addOne(1);

TreatJS.Statistic.print();
quit();




quit();

var Add = (function () {

  // example 1

  var even = Contract.assert(function (x) {
    return x==0 ? true : odd(x-1);
  }, Contract.AFunction([typeOfNumber], typeOfBoolean));

  var odd = Contract.assert( function (x) {
    return x==0 ? false : even(x-1);
    f
  }, Contract.AFunction([typeOfNumber], typeOfBoolean));

  // example 2

  var plus = Contract.assert(function (x, y) {
    return x+y;
  }, Contract.Intersection(
    Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber),
    Contract.AFunction([typeOfString, typeOfString], typeOfString)
    ));

  var addOne = Contract.assert(function (x) {
    return plus(x, 1);
  }, Contract.AFunction([typeOfNumber], typeOfNumber));

  return {
    even: even,
      odd: odd,
      plus: plus,
      addOne: addOne
  }

})();

//TreatJS Statistics ........... .........................................................................................
//... #ASSERT =  ...............        4 ................................................................................
//... #ASSERTWITH =  ...........       60 ................................................................................
//... #BASE =  .................       36 ................................................................................
//... #MEMBRANE =  .............      180 ................................................................................
//... #DECOMPILE =  ............        3 ................................................................................
//... #CALLBACK =  .............      160 ................................................................................

Add.even(10);
Add.addOne(1);
Add.plus(1, 2);



var Add1 = (function () {

  // example 1

  var even = function (x) {
    return x==0 ? true : odd(x-1);
  };

  var odd = function (x) {
    return x==0 ? false : even(x-1);
    f
  };

  // example 2

  var plus = function (x, y) {
    return x+y;
  };

  var addOne = function (x) {
    return plus(x, 1);
  };

  return {
    even: Contract.assert(even, Contract.AFunction([typeOfNumber], typeOfBoolean)),
      odd: Contract.assert(odd, Contract.AFunction([typeOfNumber], typeOfBoolean)),
      plus: Contract.assert(plus, Contract.Intersection(
            Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber),
            Contract.AFunction([typeOfString, typeOfString], typeOfString)
            )),
      addOne: Contract.assert(addOne, Contract.AFunction([typeOfNumber], typeOfNumber))
  }
})();

/*
   var Add2 = (function () {

// example 1

var even = function (x @ typeOfNumber) {
return x==0 ? true : odd(x-1);
};

var odd = function (x @ typeOfNumber) {
return x==0 ? false : even(x-1);
f
};

// example 2

var plus = function (x @ typeOfNumber, y @ typeOfNumber) {
return x+y;
};

var addOne = function (x @ typeOfNumber) {
return plus(x, 1);
} @ [typeOfNumber, typeOfNumber] -> typeOfNumber;

return {
... 
}
});
*/


TreatJS.Statistic.print();
quit();

// ==================================================

TreatJS.Statistic.print();

// ==================================================

quit();
