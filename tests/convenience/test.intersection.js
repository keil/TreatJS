new Test('Contract/ImmediateIntersection/1', function() {

  let c = Contract.Intersection(Contract.ImmediateIntersection(Positive, Even), Natural); 

  this.expect(function() {
    const f = Contract.assert(0, c);
  }).subjectBlame();

  this.expect(function() {
    const f = Contract.assert(1, c);
  }).subjectBlame();

  this.expect(function() {
    const f = Contract.assert(2, c);
  }).noBlame();

});
