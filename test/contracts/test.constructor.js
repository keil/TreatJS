new Test('Contract/Constructor/1', function() {

  this.expect(function() {
    var between0_9 = Contract.construct(Between, [0,9]);
    Contract.assert(0, between0_9);
  }).noBlame();

  this.expect(function() {
    var between0_9 = Contract.construct(Between, [0,9]);
    Contract.assert(1, between0_9);
  }).noBlame();

  this.expect(function() {
    var between0_9 = Contract.construct(Between, [0,9]);
    Contract.assert(9, between0_9);
  }).noBlame();

  this.expect(function() {
    Contract.assert("1", typeNumber);
  }).subjectBlame();

  this.expect(function() {
    var between0_9 = Contract.construct(Between, [0,9]);
    Contract.assert(10, between0_9);
  }).subjectBlame();

  this.expect(function() {
    var between0_9 = Contract.construct(Between, [0,9]);
    Contract.assert(-1, between0_9);
  }).subjectBlame();

});

new Test('Contract/Constructor/2', function() {

  this.expect(function() {
    var typeofNumber = Contract.construct(TypeOf, ["number"]);
    Contract.assert(0, typeofNumber);
  }).noBlame();

  this.expect(function() {
    var typeofNumber = Contract.construct(TypeOf, ["number"]);
    Contract.assert(true, typeofNumber);
  }).subjectBlame();

});

new Test('Contract/Constructor/3', function() {

  this.expect(function() {
    var instanceofArray = Contract.construct(InstanceOf, [Array]);
    Contract.assert([], instanceofArray);
  }).noBlame();

  this.expect(function() {
    var instanceofArray = Contract.construct(InstanceOf, [Array]);
    Contract.assert(true, instanceofArray);
  }).subjectBlame();

});

new Test('Contract/Constructor/4', function() {

  this.expect(function() {
    var isNull = Contract.construct(Is, [null]);
    Contract.assert(null, isNull);
  }).noBlame();

  this.expect(function() {
    var isNull = Contract.construct(Is, [null]);
    Contract.assert(undefined, isNull);
  }).subjectBlame();

});
