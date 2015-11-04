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

  var fibonacci = Contract.assert(function (n) {
    if (n===0) return 0;
    else if (n===1) return 1;
    else return (fibonacci(n-1) + fibonacci(n-2));
  }, Contract.AFunction([typeOfNumber], typeOfNumber));

  print(fibonacci(10));

})();



(function() {

  var fibonacci = Contract.assert(function (n) {
    function calculate(n) {
      if (n===0) return 0;
      else if (n===1) return 1;
      else return (calculate(n-1) + calculate(n-2));
    }
    return calculate(n);
  }, Contract.AFunction([typeOfNumber], typeOfNumber));

  print(fibonacci(10));

})();



(function() {

  function factorial ( n ) {
    if (n===0) return 1;
    else return ( n*factorial(n-1) );
  }

  print(factorial(10));

})();



(function() {

  function factorial ( n ) {
    function calculate ( n, product ) {
      if (n===0) return product;
      else return calculate ( n-1, n*product);
    }
    return calculate(n, 1) ;
  }

  print(factorial(10));

})();



(function() {

  var factorial = Contract.assert( function ( n ) {
    if (n===0) return 1;
    else return ( n*factorial(n-1) );
  }, Contract.AFunction([typeOfNumber], typeOfNumber));

  print(factorial(10));

})();



(function() {

  var factorial = Contract.assert( function ( n ) {
    function calculate ( n, product ) {
      if (n===0) return product;
      else return calculate ( n-1, n*product);
    }
    return calculate(n, 1) ;
  }, Contract.AFunction([typeOfNumber], typeOfNumber));

  print(factorial(10));

})();
