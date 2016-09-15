new Test('Contract/Object/1', function() {

  const target = {
    x:1,
    y:"1"
  };

  this.expect(function() {
    const object = Contract.assert(target, Contract.Object({x:typeNumber, y:typeNumber}));
    object.x;
  }).noBlame();

  this.expect(function() {
    const object = Contract.assert(target, Contract.Object({x:typeNumber, y:typeNumber}));
    object.y;
  }).subjectBlame();

  this.expect(function() {
    const object = Contract.assert(target, Contract.Object({x:typeNumber, y:typeNumber}));
    object.z;
  }).noBlame();

  this.expect(function() {
    const object = Contract.assert(target, Contract.Object({x:typeNumber, y:typeNumber}));
    object.x = 1;
  }).noBlame();

  this.expect(function() {
    const object = Contract.assert(target, Contract.Object({x:typeNumber, y:typeNumber}));
    object.y = "1";
  }).contextBlame();

  this.expect(function() {
    const object = Contract.assert(target, Contract.Object({x:typeNumber, y:typeNumber}));
    object.z = 1;
  }).noBlame();

});

new Test('Contract/Object/2', function() {

  const target = [1, "1"];

  this.expect(function() {
    const object = Contract.assert(target, Contract.Object([typeNumber, typeNumber]));
    object[0];
  }).noBlame();

  this.expect(function() {
    const object = Contract.assert(target, Contract.Object([typeNumber, typeNumber]));
    object[1];
  }).subjectBlame();

  this.expect(function() {
    const object = Contract.assert(target, Contract.Object([typeNumber, typeNumber]));
    object[2];
  }).noBlame();

  this.expect(function() {
    const object = Contract.assert(target, Contract.Object([typeNumber, typeNumber]));
    object[0] = 1;
  }).noBlame();

  this.expect(function() {
    const object = Contract.assert(target, Contract.Object([typeNumber, typeNumber]));
    object[1] = "1";
  }).contextBlame();

  this.expect(function() {
    const object = Contract.assert(target, Contract.Object([typeNumber, typeNumber]));
    object[2] = 1;
  }).noBlame();

});


// strict
// intersection
// union
// set properties
// function and object properties

