new Test('Semantics/Lax/1', function() {

  let plus = Contract.assert(function plus(x, y) {
    return x+y;
  }, Contract.Function([typeNumber, typeNumber], typeNumber));

  let plus2 = Contract.assert(function plus(x, y) {
    return ""+x+y;
  }, Contract.Function([typeNumber, typeNumber], typeNumber));

  let test = Contract.Base(function(f) {
    return f("1",2);
  });

  let test2 = Contract.Base(function(f) {
    return f(1,2);
  });

  this.expect(function() {
    Contract.assert(plus, test2);
  }).noBlame();

  this.expect(function() {
    Contract.assert(plus, test);
  }).noBlame();

  this.expect(function() {
    Contract.assert(plus2, test2);
  }).noBlame();

});

new Test('Semantics/Lax/2', function() {

  let id = Contract.assert(function id(x) {
    return x;
  }, Contract.Intersection.from(
    Contract.Function([Contract.Function([Positive], Positive)], Contract.Base(f => f(1))),
    Contract.Function([Contract.Function([Even], Even)], Contract.Base(f => f(-2)))
    )
  );

  this.expect(function() {
    id(x => x)(1)
  }).subjectBlame();

  this.expect(function() {
    id(x => x)(-1)
  }).subjectBlame();

  this.expect(function() {
    id(x => x)(2)
  }).noBlame();

});

new Test('Semantics/Lax/3', function() {

  let id = Contract.assert(function id(x) {
    return x;
  }, Contract.Function([Natural], Positive));

  let idTest = (Contract.Constructor(function test(id) {
    return Contract.Base(function test(subject) {
      return subject == id(subject);
    }, "ID Test");
  }))(id);

  this.expect(function() {
    Contract.assert(1, idTest);
  }).noBlame();

  this.expect(function() {
    Contract.assert("1", idTest);    
  }).subjectBlame();

  this.expect(function() {
    Contract.assert(0, idTest);    
  }).subjectBlame();

});
