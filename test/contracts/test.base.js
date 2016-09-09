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

});
