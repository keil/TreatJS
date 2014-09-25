var f = function (x) {
  //return 0;
  return x;
}

var PosPos = Contract.AFunction([Pos], Pos);
var ZeroZero = Contract.Base(
 function(f) { return (f(0)=0); }, "[f(0)=0]"
);

(function () {

  var g = Contract.assert(f, PosPos);

  // g(1);
  // ok

  // g(0);
  // blame CONTEXT

  var h = Contract.assert(g, ZeroZero);
  // blame SUBJECT of Zero (because of blame/CONFLICT)
  // otherwise blame CONTEXT of PosPos

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

})();
