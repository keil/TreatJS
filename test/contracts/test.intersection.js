


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
//

/*

new Test('Contract/DIntersection/2', function() {

  function plus(x, y) {
    return x+y;
  }

  function faultyPlus(x, y) {
    return ""+x+y;
  }

  const EvenEven_Even = Contract.Function(Contract.Object([Even, Even]), Even);
  const PosPos_Pos = Contract.Function(Contract.Object([Positive, Positive]), Positive);

  this.expect(function() {
    var plusEvenPos = Contract.assert(plus, Contract.DIntersection(EvenEven_Even, EvenEven_Even));
    plusNumStr(1,1);
  }).noBlame();

  this.expect(function() {
    var plusEvenPos = Contract.assert(plus, Contract.DIntersection(EvenEven_Even, EvenEven_Even));
    plusNumStr(1,2);
  }).noBlame();

  this.expect(function() {
    var plusEvenPos = Contract.assert(plus, Contract.DIntersection(EvenEven_Even, EvenEven_Even));
    plusNumStr(2,2);
  }).noBlame();
 
});

*/

new Test('Contract/DIntersection/3', function() {

  function g(x) {
    return x;
  }




  function f(g) {
    //g("1"); g(1);
    //return 1;

    g("1"); g(1);
    return 1;
    // return "1";
  }

  const Any_Num = Contract.Function(Contract.Object([Any]), typeNumber);
  const Any_Num__Num = Contract.Function(Contract.Object([Any_Num]), typeNumber);

  const Any_Str = Contract.Function(Contract.Object([Any]), typeString);
  const Any_Str__Str = Contract.Function(Contract.Object([Any_Str]), typeString);

  this.expect(function() {
    var f = Contract.assert(function(h) {
      h(1); h("1"); return 1;
    }, Contract.DIntersection(Any_Num__Num, Any_Str__Str));
    f(g);
  }).contextBlame();

  this.expect(function() {
    var f = Contract.assert(function(h) {
      h(1); h("1"); return "1";
    }, Contract.DIntersection(Any_Num__Num, Any_Str__Str));
    f(g);
  }).contextBlame();

  this.expect(function() {
    var f = Contract.assert(function(h) {
      h("1"); h(1); return 1;
    }, Contract.DIntersection(Any_Num__Num, Any_Str__Str));
    f(g);
  }).contextBlame();

  this.expect(function() {
    var f = Contract.assert(function(h) {
      h("1"); h(1); return "1";
    }, Contract.DIntersection(Any_Num__Num, Any_Str__Str));
    f(g);
  }).contextBlame();

  this.expect(function() {
    var f = Contract.assert(function(h) {
      h(1); h(1); return 1;
    }, Contract.DIntersection(Any_Num__Num, Any_Str__Str));
    f(g);
  }).noBlame();

  this.expect(function() {
    var f = Contract.assert(function(h) {
      h(1); h(1); return "1";
    }, Contract.DIntersection(Any_Num__Num, Any_Str__Str));
    f(g);
  }).subjectBlame();

  this.expect(function() {
    var f = Contract.assert(function(h) {
      h("1"); h("1"); return "1";
    }, Contract.DIntersection(Any_Num__Num, Any_Str__Str));
    f(g);
  }).noBlame();

  this.expect(function() {
    var f = Contract.assert(function(h) {
      h("1"); h("1"); return 1;
    }, Contract.DIntersection(Any_Num__Num, Any_Str__Str));
    f(g);
  }).subjectBlame();

});

