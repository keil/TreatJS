


new Test('Contract/DIntersection/1', function() {

  function plus(x, y) {
    return x+y;
  }

  function faultyPlus(x, y) {
    return ""+x+y;
  }

  const NumNum_Num = Contract.Function(Contract.Object([typeNumber, typeNumber]), typeNumber);
  const StrStr_Str = Contract.Function(Contract.Object([typeString, typeString]), typeString);

  this.expect(function() {
    var plusNumStr = Contract.assert(plus, Contract.DIntersection(NumNum_Num, StrStr_Str));
    plusNumStr(1,1);
  }).noBlame();

  this.expect(function() {
    var plusNumStr = Contract.assert(plus, Contract.DIntersection(NumNum_Num, StrStr_Str));
    plusNumStr("1",1);
  }).contextBlame();

  this.expect(function() {
    var plusNumStr = Contract.assert(plus, Contract.DIntersection(NumNum_Num, StrStr_Str));
    plusNumStr(1,"1");
  }).contextBlame();

  this.expect(function() {
    var plusNumStr = Contract.assert(plus, Contract.DIntersection(NumNum_Num, StrStr_Str));
    plusNumStr(true,true);
  }).contextBlame();

  this.expect(function() {
    var plusNumStr = Contract.assert(faultyPlus, Contract.DIntersection(NumNum_Num, StrStr_Str));
    plusNumStr(1,1);
  }).subjectBlame();

});

// more intersection with non-disjount domains
