// Test Implementation of Access Permission Contracts
//  

load("lib//lib_stringmap.js");

load("lib/jscontest2/apc.js");
load("lib/jscontest2/contract.js");
load("lib/jscontest2/parser.js");


var AccessContract = Contract.Constructor (function ctor (apcon, APC) {
  var any = Contract.Base(function(property) {
    return true;
  });
  var readable = Contract.Base(function(name) {
    return apcon.isReadable(name);
  });
  var writeable = Contract.Base(function(name) {
    return apcon.isWriteable(name);
  });

  var AccessContract = Contract.Constructor(ctor);
  var Access = AccessContract.ctor

  //var Access = Contract.Constructor(ctor).ctor;

  var membrane = Contract.Constructor(function membrane(target, name, receiver) {
    with(APC.Contract) {
      var apconPrime = apcon.derive(name); 
    }

    return any;
    //var apconPrime = apcon.derive(name);
    //return  Contract.With(APC.Contract, Access(apconPrime, APC));
  });

  var g = {};
//  for(var p in APC.Contract)  {print (p); g[p]=APC.Contract[p]; }
  g["apcon"]=apcon;
  g["Access"]=Access;
  g["APC"]=APC;
  g["Null"]=APC.Contract.Null;


  var get = Contract.Get(Contract.And(Contract.AFunction({1:readable}, any),
        Contract.With(g /*{apcon:apcon,Access:Access,APC:APC,any:any}*/, Contract.Dependent(membrane))));
  //var get = Contract.Get(Contract.AFunction({1:readable}, any));
  var set = Contract.Set(Contract.AFunction({1:writeable}, any));

  return Contract.And(get, set);
});

var Access = AccessContract.ctor;
