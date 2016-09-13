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
  }).subjectBlame();

  this.expect(function() {
    var plusNumber = Contract.assert(plus, Contract.Function(Contract.Object([typeNumber, typeNumber]),typeNumber));
    plusNumber("1",1);
  }).contextBlame();

  this.expect(function() {
    var plusNumber = Contract.assert(faultyPlus, Contract.Function(Contract.Object([typeNumber, typeNumber]),typeNumber));
    plusNumber("1",1);
  }).subjectBlame();

});

// addone
//
