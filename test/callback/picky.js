(function() {

  function f (g) {
    return g (42);
  }

 function h (x) {
    return x;
  }

 var D = Contract.Dependent(Contract.Constructor(function (h) {
  return Contract.Base(function() {
    return (h(0)>=0);
  });
 }));


 var fPrime = Contract.assert(f, D);

 print( fPrime(h) );

})();


(function() {

  function f (g) {
    return g (42);
  }

 function h (x) {
    return x;
  }

 var C = Contract.AFunction([Contract.AFunction([Pos], Pos)], Any);

 var D = Contract.Dependent(Contract.Constructor(function (h) {
  return Contract.Base(function() {
    return (h(0)>=0);
  });
 }));

 var fPrime = Contract.assert(f, Contract.And(D, C));

 print( fPrime( h ) );

});

