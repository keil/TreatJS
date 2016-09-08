new Test('Contract/Base', function() {

  this.expect(function() {
    Contract.assert(1, typeNumber);
  }).noBlame();

  this.expect(function() {
    Contract.assert("1", typeNumber);
  }).subjectBlame();


  this.expect(function() {
    Contract.assert("1", typeNumber);
  }).contextBlame();







  // target values
  var target1 = {};
  var target2 = {};

  // primitives
  var primitive1 = 1;
  var primitive2 = "1";

  this.expect(function() {
    return target1 == target1;
  }).toBe(true);

  this.expect(function() {
    return target1 == target2;
  }).toBe(false);

  this.expect(function() {
    return primitive1 == primitive1;
  }).toBe(true);

  this.expect(function() {
    return primitive1 == primitive2;
  }).toBe(true);

});

