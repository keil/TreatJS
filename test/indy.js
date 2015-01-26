(function() {

  function f (g) {
    return g (42);
  }

 function h (x) {
    return x;
  }

 var F = Contract.AFunction([Pos], Pos);

 var C = Contract.AFunction([Contract.AFunction([Pos], Pos)], Any);

 var D = Contract.Dependent(Contract.Constructor(function (h) {
  return Contract.Base(function() {
    return (h(0)>=0);
  }
 }));

 var B = Contract.Base(function(h) {
   h(1);
   return true;
 }, "CallWith0");

 var E = Contract.AFunction([B], Any);

 // this direction will not work because it throwsn en errort
 //var fPrime1 = Contract.assert(f, Contract.And(F, B));
 var fPrime2 = Contract.assert(h, Contract.And(B, F));
 
 var fPrime3 = Contract.assert(f, Contract.And(C, E));
 var fPrime4 = Contract.assert(f, Contract.And(E, C));
 
 // Note, function contract E,C is picky, 
 // because (assert E), (assert C) and than 
 // after calling domain_C is applyed first

 fPrime4(h);

})();
