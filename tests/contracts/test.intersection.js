


new Test('Contract/DelayedIntersection/1', function() {

  function plus(x, y) {
    return x+y;
  }

  function faultyPlus(x, y) {
    return ""+x+y;
  }

  const NumNum_Num = Contract.Function(Contract.Object([typeNumber, typeNumber]), typeNumber);
  const StrStr_Str = Contract.Function(Contract.Object([typeString, typeString]), typeString);

  this.expect(function() {
    const plusNumStr = Contract.assert(plus, Contract.DelayedIntersection(NumNum_Num, StrStr_Str));
    plusNumStr(1,1);
  }).noBlame();

  this.expect(function() {
    const plusNumStr = Contract.assert(plus, Contract.DelayedIntersection(NumNum_Num, StrStr_Str));
    plusNumStr("1",1);
  }).contextBlame();

  this.expect(function() {
    const plusNumStr = Contract.assert(plus, Contract.DelayedIntersection(NumNum_Num, StrStr_Str));
    plusNumStr(1,"1");
  }).contextBlame();

  this.expect(function() {
    const plusNumStr = Contract.assert(plus, Contract.DelayedIntersection(NumNum_Num, StrStr_Str));
    plusNumStr(true,true);
  }).contextBlame();

  this.expect(function() {
    const plusNumStr = Contract.assert(faultyPlus, Contract.DelayedIntersection(NumNum_Num, StrStr_Str));
    plusNumStr(1,1);
  }).subjectBlame();

});

// more intersection with non-disjount domains
//

/*

   new Test('Contract/DelayedIntersection/2', function() {

   function plus(x, y) {
   return x+y;
   }

   function faultyPlus(x, y) {
   return ""+x+y;
   }

   const EvenEven_Even = Contract.Function(Contract.Object([Even, Even]), Even);
   const PosPos_Pos = Contract.Function(Contract.Object([Positive, Positive]), Positive);

   this.expect(function() {
   const plusEvenPos = Contract.assert(plus, Contract.DelayedIntersection(EvenEven_Even, EvenEven_Even));
   plusNumStr(1,1);
   }).noBlame();

   this.expect(function() {
   const plusEvenPos = Contract.assert(plus, Contract.DelayedIntersection(EvenEven_Even, EvenEven_Even));
   plusNumStr(1,2);
   }).noBlame();

   this.expect(function() {
   const plusEvenPos = Contract.assert(plus, Contract.DelayedIntersection(EvenEven_Even, EvenEven_Even));
   plusNumStr(2,2);
   }).noBlame();

   });

*/

new Test('Contract/DelayedIntersection/3', function() {

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
    const f = Contract.assert(function(h) {
      h(1); h("1"); return 1;
    }, Contract.DelayedIntersection(Any_Num__Num, Any_Str__Str));
    f(g);
  }).contextBlame();

  this.expect(function() {
    const f = Contract.assert(function(h) {
      h(1); h("1"); return "1";
    }, Contract.DelayedIntersection(Any_Num__Num, Any_Str__Str));
    f(g);
  }).contextBlame();

  this.expect(function() {
    const f = Contract.assert(function(h) {
      h("1"); h(1); return 1;
    }, Contract.DelayedIntersection(Any_Num__Num, Any_Str__Str));
    f(g);
  }).contextBlame();

  this.expect(function() {
    const f = Contract.assert(function(h) {
      h("1"); h(1); return "1";
    }, Contract.DelayedIntersection(Any_Num__Num, Any_Str__Str));
    f(g);
  }).contextBlame();

  this.expect(function() {
    const f = Contract.assert(function(h) {
      h(1); h(1); return 1;
    }, Contract.DelayedIntersection(Any_Num__Num, Any_Str__Str));
    f(g);
  }).noBlame();

  this.expect(function() {
    const f = Contract.assert(function(h) {
      h(1); h(1); return "1";
    }, Contract.DelayedIntersection(Any_Num__Num, Any_Str__Str));
    f(g);
  }).subjectBlame();

  this.expect(function() {
    const f = Contract.assert(function(h) {
      h("1"); h("1"); return "1";
    }, Contract.DelayedIntersection(Any_Num__Num, Any_Str__Str));
    f(g);
  }).noBlame();

  this.expect(function() {
    const f = Contract.assert(function(h) {
      h("1"); h("1"); return 1;
    }, Contract.DelayedIntersection(Any_Num__Num, Any_Str__Str));
    f(g);
  }).subjectBlame();

});





new Test('Contract/DelayedIntersection/4', function() {

  const target = {
    x:1,
    y:"1"
  };

  const NumNumNum = Contract.Object({x:typeNumber, y:typeNumber, z:typeNumber});
  const StrStrStr = Contract.Object({x:typeString, y:typeString, z:typeString});

  this.expect(function() {
    const object = Contract.assert(target, Contract.DelayedIntersection(NumNumNum, StrStrStr));
    object.x;
  }).subjectBlame();

  this.expect(function() {
    const object = Contract.assert(target, Contract.DelayedIntersection(NumNumNum, StrStrStr));
    object.x = 1;
  }).noBlame();

  this.expect(function() {
    const object = Contract.assert(target, Contract.DelayedIntersection(NumNumNum, StrStrStr));
    object.x = "1";
  }).noBlame();

  this.expect(function() {
    const object = Contract.assert(target, Contract.DelayedIntersection(NumNumNum, StrStrStr));
    object.x = true;
  }).contextBlame();

});

