var f = function (x) {
  //return 0;
  return x;
}

var PosPos = Contract.AFunction([Pos], Pos);
var ZeroZero = Contract.Base(
 function(f) { f(0); return true; }, "[f(0)=0]"
);




(function () {

  var ff = function (x, y) {
    return y;
  }

  var g = Contract.assert(ff, PosPos);
  //g(1,1);
  //g(1, 0);
  //g(0, 1);

});

(function () {

  var x = Contract.assert(7, typeOfNumber);
  //var x = Contract.assert(7, typeOfString);
  var ff = Contract.assert(function() {return 0;}, ZeroZero);
 
});

(function () {

  var g = Contract.assert(f, PosPos);
  var h = Contract.assert(g, ZeroZero);




});









/**
 *
 *
 * TEST
 *
 */






(function () {

  var g = Contract.assert(f, PosPos);

  // g(1);
  // ok

  // g(0);
  // blame CONTEXT

  var h = Contract.assert(g, ZeroZero);
  // blame SUBJECT of Zero (because of blame/CONFLICT)
  // otherwise blame CONTEXT of PosPos

  // 3-ch solution should not blame the contract PosPos, it should blame the ZeroZero
  // --> no extract, or extract only correspondig to the assertion!

});



(function () {

  var g = Contract.assert(f, Contract.AFunction([PosPos], ZeroZero));
  var h = g(f); 
  // blame SUBJECT, because .. f does not fulfull ZeroZero

});



(function () {

  var g = Contract.assert(f, Contract.AFunction([PosPos], True));
  var h = g(f); 
  
  // h(1);
  // all fine
  
  h(0);
  // blame SUBJECT, because .. Subject is responsible to guarantee that  
  // f ist called only with Pos

});

(function () {

  function f (x) {
    return Contract.assert(x, PosPos);
  }

  var g = Contract.assert(f, Contract.AFunction([PosPos], True));
  var h = g(f); 
  
  // h(1);
  // all fine
  
  // h(0);
  // blame CONTEXT, because .. Subject is responsible to guarantee that  
  // f ist called only with Pos

});











(function () {

  function id (x) {
    //x(2); x(2);
    return x;
  }


  var i = 1;
  function ff (x) {
    return -1;
  }

  var PosPos = Contract.AFunction([Pos], Pos);
  var EvenEven = Contract.AFunction([Even], Even);

  var ZeroZero = Contract.Base(
   function(f) { f(2); return true; }, "ZeroZero?"
  );

  var OneOne = Contract.Base(
   function(f) { f(2); return true}, "?OneOne?"
  );


  var PosPosOneOne = Contract.AFunction([PosPos], OneOne);
  var EvenEvenZeroZero = Contract.AFunction([EvenEven], ZeroZero);

  var g = Contract.assert(id , Contract.Intersection(PosPosOneOne, EvenEvenZeroZero));

  var h = g(ff); 
  
  // h(1);
  // all fine
  
  // h(0);
  // blame CONTEXT, because .. Subject is responsible to guarantee that  
  // f ist called only with Pos

})();



(function () {

  function id (x) {
    return x;
  }

  function ff (x) {
    return -1; //x;
  }

  var PosPos = Contract.AFunction([Pos], Pos);

  var ZeroZero = Contract.Base(
   function(f) { f(-1); return true; }, "ZeroZero?"
  );

  var g = Contract.assert(id , Contract.Intersection(PosPos, ZeroZero));
  var h = g(ff); 
  
});

(function () {

  function id (x) {
    return x;
  }

  function ff (x) {
    return x; //-1; //x;
  }

  var PosPos = Contract.AFunction([Pos], Pos);

  var ZeroZero = Contract.Base(
   function(f) { f(0); return true; }, "ZeroZero?"
  );

  //var g = Contract.assert(id , Contract.Union(PosPos, ZeroZero));
  var g = Contract.assert(id , Contract.Union(ZeroZero, PosPos));

  // Correct, order of contratcs depends on the user

  
});
