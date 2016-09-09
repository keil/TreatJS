new Test('Contract/Base/1', function() {

  this.expect(function() {
    Contract.assert(1, typeNumber);
  }).noBlame();

  this.expect(function() {
    Contract.assert("1", typeNumber);
  }).subjectBlame();

});

new Test('Contract/Base/2', function() {

  this.expect(function() {
    Contract.assert("1", typeString);
  }).noBlame();

  this.expect(function() {
    Contract.assert(1, typeString);
  }).subjectBlame();

});
