var f = function (x) {
  //return 0;
  return x;
}

var PosPos = Contract.AFunction([Pos], Pos);
var ZeroZero = Contract.Base(
    function(f) { f(0); return true; }, "[f(0)=0]"
    );




(function () {

  var ff = function (x, y) {
    return y;
  }

  var g = Contract.assert(ff, PosPos);
  //g(1,1);
  //g(1, 0);
  //g(0, 1);

});

(function () {

  var x = Contract.assert(7, typeOfNumber);
  //var x = Contract.assert(7, typeOfString);
  var ff = Contract.assert(function() {return 0;}, ZeroZero);

});

(function () {

  var g = Contract.assert(f, PosPos);
  var h = Contract.assert(g, ZeroZero);
  h(1);



});









/**
 *
 *
 * TEST
 *
 */






(function () {

  var g = Contract.assert(f, PosPos);

  // g(1);
  // ok

  // g(0);
  // blame CONTEXT

  var h = Contract.assert(g, ZeroZero);
  h(1);
  
  // blame SUBJECT of Zero (because of blame/CONFLICT)
  // otherwise blame CONTEXT of PosPos

  // 3-ch solution should not blame the contract PosPos, it should blame the ZeroZero
  // --> no extract, or extract only correspondig to the assertion!

})();



(function () {

  var g = Contract.assert(f, Contract.AFunction([PosPos], ZeroZero));
  var h = g(f); 
  // blame SUBJECT, because .. f does not fulfull ZeroZero

});



(function () {

  var g = Contract.assert(f, Contract.AFunction([PosPos], True));
  var h = g(f); 

  // h(1);
  // all fine

  h(0);
  // blame SUBJECT, because .. Subject is responsible to guarantee that  
  // f ist called only with Pos

});

(function () {

  function f (x) {
    return Contract.assert(x, PosPos);
  }

  var g = Contract.assert(f, Contract.AFunction([PosPos], True));
  var h = g(f); 

  // h(1);
  // all fine

  // h(0);
  // blame CONTEXT, because .. Subject is responsible to guarantee that  
  // f ist called only with Pos

})();











(function () {

  function id (x) {
    //x(2); x(2);
    return x;
  }


  var i = 1;
  function ff (x) {
    return -1;
  }

  var PosPos = Contract.AFunction([Pos], Pos);
  var EvenEven = Contract.AFunction([Even], Even);

  var ZeroZero = Contract.Base(
    function(f) { f(2); return true; }, "ZeroZero?"
    );

  var OneOne = Contract.Base(
    function(f) { f(2); return true}, "?OneOne?"
    );


  var PosPosOneOne = Contract.AFunction([PosPos], OneOne);
  var EvenEvenZeroZero = Contract.AFunction([EvenEven], ZeroZero);

  var g = Contract.assert(id , Contract.Intersection(PosPosOneOne, EvenEvenZeroZero));

  var h = g(ff); 

  // h(1);
  // all fine

  // h(0);
  // blame CONTEXT, because .. Subject is responsible to guarantee that  
  // f ist called only with Pos

});



(function () {

  function id (x) {
    return x;
  }

  function ff (x) {
    return -1; //x;
  }

  var PosPos = Contract.AFunction([Pos], Pos);

  var ZeroZero = Contract.Base(
    function(f) { f(-1); return true; }, "ZeroZero?"
    );

  var g = Contract.assert(id , Contract.Intersection(PosPos, ZeroZero));
  var h = g(ff); 

});

(function () {

  function id (x) {
    return x;
  }

  function ff (x) {
    return x; //-1; //x;
  }

  var PosPos = Contract.AFunction([Pos], Pos);

  var ZeroZero = Contract.Base(
    function(f) { f(0); return true; }, "ZeroZero?"
    );

  //var g = Contract.assert(id , Contract.Union(PosPos, ZeroZero));
  var g = Contract.assert(id , Contract.Union(ZeroZero, PosPos));

  // Correct, order of contratcs depends on the user


});


// INTERSECTION

(function() {

  function id (x, y) {
    return y;
  }

  function f (x, y) {
    return y; 
  }

  var PosPos = Contract.AFunction([Pos], Pos);
  var EvenEven = Contract.AFunction([Even], Even);

  var g = Contract.assert(f, Contract.Intersection(PosPos, EvenEven));

  // Context: Argument: Union aus Pos, Even
  // Subject: Return: Pos Or Union Or Both

  g(1, 1); // ok
  //g(2, 1); // blame subject
  g(1, 2); // ok
  g(0, 0); // ok
  //g(-1, 1) // blame context

});

//quit();

(function() {

  function id (x, y) {
    return y;
  }

  function f (x) {
    return x; 
  }

  var PosPos = Contract.AFunction([Pos], Pos);
  var EvenEven = Contract.AFunction([Even], Even);

  var g = Contract.assert(f, Contract.Intersection(
      Contract.AFunction([PosPos], Any), 
      Contract.AFunction([EvenEven], Any)));

  var h = g(id);
  // Context: Argument: Union aus Pos, Even
  // --> Argument of the Argument:  Intersection aus Pos, Even
  // Subject: Return: Pos Or Union Or Both

  // h(1, 1); // blame subejct
  h(2, 1); // ok
  h(1, 2); // blame subject
  h(0, 2); // ok
  //g(-1, 1) // blame context

});

// UNION

(function() {

  function id (x, y) {
    return y;
  }

  function f (x, y) {
    return y; 
  }

  var PosPos = Contract.AFunction([Pos], Pos);
  var EvenEven = Contract.AFunction([Even], Even);

  var g = Contract.assert(f, Contract.Union(PosPos, EvenEven));

  // Context: Argument: Intersection aus Pos, Even
  // Subject: Return: Pos Or Union

  //g(1, 1); // blmae context
  g(2, 1); // ok
  //g(2, 0); // ok, if not g(2,1)
  //g(0, 2); // blame
  g(-1, 1) // blame context

});

(function() {

  function id (x, y) {
    return y;
  }

  function f (x) {
    return x; 
  }

  var PosPos = Contract.AFunction([Pos], Pos);
  var EvenEven = Contract.AFunction([Even], Even);

  var g = Contract.assert(f, Contract.Union(
      Contract.AFunction([PosPos], Any), 
      Contract.AFunction([EvenEven], Any)));

  var h = g(id);
  // Context: Argument: Intersection aus Pos, Even
  // --> Argument of the Argument:  Union aus Pos, Even
  // Subject: Return: Pos Or Union Or Both

  //h(1, 1); // ok
  h(2, 1); // ok
  //h(1, 2); // blame subject
  //h(0, 2); // ok
  //g(-1, 1) // blame context

});




// TEST 

(function() {

  function id (x, y) {
    return y;
  }

  function f (x) {
    return x; 
  }

  var Left = Contract.Base(function(id) {
    // id(1,1); // blame (!)
    id(2, 1); // ok
    // id(2, 0); // blame if id(2, 1);
    // id(0, 1); // blame
    return true;
  }, "Left");

  var Right = Contract.Base(function(id) {
    //id(2, 0); // blame if id(2, 1);
    return true;
  }, "Right");

  var PosPos = Contract.AFunction([Pos], Pos);
  var EvenEven = Contract.AFunction([Even], Even);
  //var EvenEven = Contract.AFunction([Any], Any);

  var g = Contract.assert(f, Contract.Intersection(
        Contract.AFunction([PosPos], Left), 
        Contract.AFunction([EvenEven], Right)));

  // ID is Union PosPos, EvenEven
  var h = g(id);

});


(function() {

  function id (x, y) {
    return y;
  }

  function f (x) {
    //x(0,0);
    //x(1,1);
    //x(2,2);
    //x(3,3);
    return x; 
  }

  var Left = Contract.Base(function(id) {
    id(0,0); // ok
    id(1,1); // ok // BUG, should be OK, Structure must be renewed
    //or nor BUG ?

    // id(2,1); // blame (!)
    return true;
  }, "Left");

  var Right = Contract.Base(function(id) {
    //id(2, 0); // blame if id(2, 1);
    return true;
  }, "Right");

  var PosPos = Contract.AFunction([Pos], Pos);
  var EvenEven = Contract.AFunction([Even], Even);
  // var EvenEven = Contract.AFunction([Any], Any);

  var g = Contract.assert(f, Contract.Union(
        Contract.AFunction([PosPos], Left), 
        Contract.AFunction([EvenEven], Right)));

  // ID is Intersection PosPos, EvenEven
  var h = g(id);

  //h(0,0);
  //h(1,1);

});
