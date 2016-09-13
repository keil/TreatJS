new Test('Contract/Function/1', function() {

  function plus(x, y) {
    return x+y;
  }

  function faultyPlus(x, y) {
    return ""+x+y;
  }

  this.expect(function() {
    var plusNumber = Contract.assert(plus, Contract.Function(Contract.Object([typeNumber, typeNumber]),typeNumber));
    plusNumber(1,1);
  }).noBlame();

  this.expect(function() {
    var plusNumber = Contract.assert(plus, Contract.Function(Contract.Object([typeNumber, typeNumber]),typeNumber));
    plusNumber(1);
  }).noBlame();

  this.expect(function() {
    var plusNumber = Contract.assert(plus, Contract.Function(Contract.Object([typeNumber, typeNumber]),typeNumber));
    plusNumber(1,"1");
  }).contextBlame();

  this.expect(function() {
    var plusNumber = Contract.assert(plus, Contract.Function(Contract.Object([typeNumber, typeNumber]),typeNumber));
    plusNumber("1",1);
  }).contextBlame();

  this.expect(function() {
    var plusNumber = Contract.assert(faultyPlus, Contract.Function(Contract.Object([typeNumber, typeNumber]),typeNumber));
    plusNumber(1,1);
  }).subjectBlame();

});

new Test('Contract/Function/2', function() {

  function plus(x, y) {
    return x+y;
  }

  function faultyPlus(x, y) {
    return ""+x+y;
  }

  function addOne(plus, z) {
    return plus(z, 1);
  }

  function faultyAddOne(plus, z) {
    return plus(z, "1");
  }

  const NumNum_Num = Contract.Function(Contract.Object([typeNumber, typeNumber]),typeNumber);

  this.expect(function() {
    var addOneNumber = Contract.assert(addOne, Contract.Function(Contract.Object([NumNum_Num, typeNumber]),typeNumber));
    addOneNumber(plus, 1);
  }).noBlame();

  this.expect(function() {
    var addOneNumber = Contract.assert(addOne, Contract.Function(Contract.Object([NumNum_Num, typeNumber]),typeNumber));
    addOneNumber(plus, "1");
  }).contextBlame();

  this.expect(function() {
    var addOneNumber = Contract.assert(addOne, Contract.Function(Contract.Object([NumNum_Num, typeNumber]),typeNumber));
    addOneNumber(faultyPlus, 1);
  }).contextBlame();

  this.expect(function() {
    var addOneNumber = Contract.assert(faultyAddOne, Contract.Function(Contract.Object([NumNum_Num, typeNumber]),typeNumber));
    addOneNumber(plus, 1);
  }).subjectBlame();

});
