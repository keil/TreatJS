// Test Implementation of Access Permission Contracts

var AccessContract = Contract.Constructor (function ctor (apcon) {



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
    var apconPrime = apcon.derive(name);
    return  Contract.With(APC.Contract,Access(apconPrime, APC));
  });

  var get = Contract.Get(Contract.And(Contract.AFunction({1:readable}, any),
        Contract.With({apcon:apcon, Access:Access, APC:APC}, Contract.Dependent(membrane))));
  //var get = Contract.Get(Contract.AFunction({1:readable}, any));
  var set = Contract.Set(Contract.AFunction({1:writeable}, any));

  return Contract.And(get, set);
});

var Access = AccessContract.ctor;
