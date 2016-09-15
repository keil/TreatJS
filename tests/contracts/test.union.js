new Test('Contract/DIntersection/4', function() {

  const target = {
    x:1,
    y:"1",
    z:true
  };

  const NumNumNum = Contract.Object({x:typeNumber, y:typeNumber, z:typeNumber});
  const StrStrStr = Contract.Object({x:typeString, y:typeString, z:typeString});

  this.expect(function() {
    const object = Contract.assert(target, Contract.Union(NumNumNum, StrStrStr));
    object.x;
  }).noBlame();

  this.expect(function() {
    const object = Contract.assert(target, Contract.Union(NumNumNum, StrStrStr));
    object.y;
  }).noBlame();

  this.expect(function() {
    const object = Contract.assert(target, Contract.Union(NumNumNum, StrStrStr));
    object.x;
    object.y;
  }).subjectBlame();

  this.expect(function() {
    const object = Contract.assert(target, Contract.Union(NumNumNum, StrStrStr));
    object.z;
  }).subjectBlame();

  this.expect(function() {
    const object = Contract.assert(target, Contract.Union(NumNumNum, StrStrStr));
    object.x = 1;
  }).contextBlame();

  this.expect(function() {
    const object = Contract.assert(target, Contract.Union(NumNumNum, StrStrStr));
    object.x = 1;
  }).contextBlame();

  this.expect(function() {
    const object = Contract.assert(target, Contract.Union(NumNumNum, StrStrStr));
    object.x = "1";
  }).contextBlame();
  
  this.expect(function() {
    const object = Contract.assert(target, Contract.Union(NumNumNum, StrStrStr));
    object.y = 1;
  }).contextBlame();

  this.expect(function() {
    const object = Contract.assert(target, Contract.Union(NumNumNum, StrStrStr));
    object.y = "1";
  }).contextBlame();

});
