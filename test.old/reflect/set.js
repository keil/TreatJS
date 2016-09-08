(function() {

  var targetCon = Contract.Base(function(arg) {
    return true;
  });

  var nameCon = Contract.Base(function(arg) {
    return (arg==="b") ? false : true ;
    //return true;
  });

  var valueCon = Contract.Base(function(arg) {
    return (typeof arg === "number") ? true : false;
  });

  var receiverCon = Contract.Base(function(arg) {
    return true;
  });

  var returnCon = Contract.Base(function(arg) {
    return (typeof arg === "number") ? true : false;
  });


  var getCon = Contract.AFunction([targetCon, nameCon, receiverCon], returnCon);
  var setCon = Contract.AFunction([targetCon, nameCon, valueCon, receiverCon], returnCon);

  var obj = {a:4711, b:4712, c:"4713"};
  var con = Contract.Get(getCon);
  var prx = Contract.assert(obj, con);

  print("--- " + prx.a);
  //print("--- " + prx.b);
  //print("--- " + prx.c);

  var con2 = Contract.Set(setCon);
  var prx2 = Contract.assert(prx, con2);

  print("--- " + prx2.a);
  print("--- " + (prx2.a=1));
  print("--- " + prx2.a);

  //print("--- " + (prx2.b=1));
  //print("--- " + (prx2.a="L"));
  print("--- " + (prx2.c=1));
  print("--- " + prx.c);

})();
