new Test('Contract/Dependent/1', function() {

  function plus (x, y) {
    return (x+y);
  }

  function addOne(z) {
    return plus(z, 1);
  }

  function faultyAddOne(z) {
    return plus(z, "1");
  }

  this.expect(function() {
    const addOneSameType = Contract.assert(addOne, Contract.Dependent(Contract.Constructor(function(z) {
      return Contract.Base(function(value) {
        return (typeof value) === (typeof z);
      },"SameType");
    },"SameType")));
    addOneSameType(1);
  }).noBlame();


  this.expect(function() {
    const addOneSameType = Contract.assert(addOne, Contract.Dependent(Contract.Constructor(function(z) {
      return Contract.Base(function(value) {
        return (typeof value) === (typeof z);
      },"SameType");
    },"SameType")));
    addOneSameType("1");
  }).noBlame();

  this.expect(function() {
    const addOneSameType = Contract.assert(addOne, Contract.Dependent(Contract.Constructor(function(z) {
      return Contract.Base(function(value) {
        return (typeof value) === (typeof z);
      },"SameType");
    },"SameType")));
    addOneSameType(true);
  }).subjectBlame();

  this.expect(function() {
    const addOneSameType = Contract.assert(faultyAddOne, Contract.Dependent(Contract.Constructor(function(z) {
      return Contract.Base(function(value) {
        return (typeof value) === (typeof z);
      },"SameType");
    },"SameType")));
    addOneSameType(1);
  }).subjectBlame();

});
