/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT licens
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */

(function() {

  function test(g) {
    g(1,1); // blame subject
    //g(1,"a"); // blame caller
    //g("a", 1); // blame subject
    //g("a","a"); // blame subject

    //return ;
  }

  function f(x, r) {
    return r;
  }

  var bottom = Contract.Base(function(){return true;}, "false");
  var NumNum = Contract.AFunction([typeOfNumber], typeOfNumber);
  var NumNumFalse = Contract.AFunction([NumNum], bottom);
  var g = Contract.assert(test, NumNumFalse)(f);
  //will not work for contracts because function is not tested
  //and thus the return is always false

  //if this contract blames the context, than the subject is false
  
})();



quit();

(function() {

  Contract.assert(1, typeOfNumber);
  //Contract.assert(1, Contract.Negation(typeOfNumber));
  Contract.assert("1", Contract.Negation(typeOfNumber));

})();


/*
(function() {

  function id(x) {
    return x;
  }

  function f(x, r) {
    return r;
  }

  var bottom = Contract.Base(function(){return false;}, "false");
  var NumNum = Contract.AFunction([typeOfNumber], typeOfNumber);
  var NumNumFalse = Contract.AFunction([NumNum], bottom);
  //var g = Contract.assert(id, NumNumFalse)(f);
  //will not work for contracts because function is not tested
  //and thus the return is always false

  //g(1,1); // blame subject
  //g(1,"a"); // blame subject
  //g("a", 1); // blame subject
  //g("a","a"); // blame subject

})();
*/


(function() {

  function f(x, r) {
    return r;
  }

  var NumNum = Contract.AFunction([typeOfNumber], typeOfNumber);
  var g = Contract.assert(f, NumNum);

  //g(1,1); // ok
  //g(1,"a"); // blame subject
  //g("a", 1); // blame context
  //g("a","a"); // blame context

})();

(function() {

  function f(x, r) {
    return r;
  }

  var NegNumNum = Contract.Negation(Contract.AFunction([typeOfNumber], typeOfNumber));
  var g = Contract.assert(f, NegNumNum);

  //g(1,1); // blame subject (NumNum: ok)
  //g(1,"a"); // ok (NumNum:blame subject)
  //g("a", 1); // blame context (NumNum:blame context)
  //g("a","a"); // blame caller (NumNum:blame context)

})();

(function() {

  function f(x, r) {
    return r;
  }

  var NegNegNumNum = Contract.Negation(Contract.Negation(Contract.AFunction([typeOfNumber], typeOfNumber)));
  var g = Contract.assert(f, NegNegNumNum);

  // TODO
  //g(1,1); // blame subject (NumNum: ok)
  //g(1,"a"); // ok (NumNum:blame subject)
  //g("a", 1); // blame context (NumNum:blame context)
  //g("a","a"); // blame context (NumNum:blame context)

})();


(function() {

  function plus(x, y, r) {
    return r;
  }

  var NumNumNum = Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber);
  var StrStrStr = Contract.AFunction([typeOfString, typeOfString], typeOfString);

  var NumNumNumIStrStrStr = Contract.Intersection(NumNumNum, StrStrStr);
  var plusP = Contract.assert(plus, NumNumNumIStrStrStr);

  //plusP(1,1,1); // ok
  //plusP(1,1,"1"); // blame subject
  //plusP("1","1",1); // blame subject
  //plusP("1","1","1"); // ok
  //plusP(1,"1","1"); // blame context
  //plusP(1,"1",1); // blame context

})();


(function() {

  function plus(x, y, r) {
    return r;
  }

  var NumNumNum = Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber);
  var StrStrStr = Contract.AFunction([typeOfString, typeOfString], typeOfString);

  var NegNumNumNumIStrStrStr = Contract.Negation(Contract.Intersection(NumNumNum, StrStrStr));
  var plusP = Contract.assert(plus, NegNumNumNumIStrStrStr);

  //plusP(1,1,1); // blame subject (ok)
  //plusP(1,1,"1"); // ok (blame subject)
  //plusP("1","1",1); // ok (blame subject)
  //plusP("1","1","1"); // blame subject (ok)
  //plusP(1,"1","1"); // blame context (blame context)
  //plusP(1,"1",1); // blame context (blame context)

})();

