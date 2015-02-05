
//load("test/blame/negation.js");
/*
   var A = Contract.Polymorphic.Variable("A");
   var B = Contract.Polymorphic.Variable("B");
   var C = Contract.Polymorphic.Variable("C");


   var F = Contract.AFunction([Contract.Polymorphic.In(A)], Contract.Polymorphic.Out(A));

   function id(x) {
//var z = x+1;
return x;
}

var f = Contract.assert(id, F);
print(f(1));

*/
/*
   function f (x, y) {
   return ''+x+y;
   }

   var add = Contract.assert(f, Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber));

   add(1, 2);




   TreatJS.Version.print();
   TreatJS.Config.print();
   TreatJS.Statistic.print();

   quit();
   */


// ==================================================
// test polymorphic contracts

//load("contracts/access3.js");
//load("test/access.js");

/*
 * Note: A Parametric Contract can be implemented by using 
 * with (dynamic binding/ value application) or constructores.
 * Difference: they were evaluated right away when asserted. 
 * A Parametric Contract is some kind of delayed constructor,
 * that only accepts contracts as agruments.
 */
/*
   var A = Contract.Polymorphic.Variable("A");
   var B = Contract.Polymorphic.Variable("B");
   var C = Contract.Polymorphic.Variable("C");

   var V = Contract.Polymorphic.Variables([A,B]);

   var F = Contract.AFunction([A,A], A);
//print(F);

var abs = Contract.Abstraction(function (A) {
return Contract.Abstraction(function(B) {
return Contract.AFunction([A,A], B);
});
});

abs(Num)(Bool);
*/


