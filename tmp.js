// ==================================================
//load("test/behavior/nesting.js");



function f (i) {
  return (i>0) ? 1 : "error";
}

function g(f , i) {
  return f(i);
}


var h = Contract.assert(g, Contract.AFunction([Contract.AFunction([typeOfNumber], Any)], typeOfNumber));
print(h(f, 1));
print(h(f, -1));

//print(g(f, -1));





quit();

/*print(test(1));
print(test(2));
print(test(0));
print(test(-1));
print(test(-2));*/

//print("a"%2);
//print(Math.abs("a")%2);

print((("-3")%2)!==0);

//rint((Math.abs("a")%2)===1);

quit();

/*
var ctor = Contract.Constructor(function(x) {


  return Contract.Base(function(z) {
    return (z==x);
  });

});

var con = ctor.build(2);
Contract.assert(1, con);
*/

var ctor = Contract.Constructor(function(x) {

  return Contract.Constructor(function(x) {

    return Contract.Base(function(z) {
      return (z==x);
    });

  });

});

var con = ctor.build(1).build(1);

Contract.assert(1, con);


quit();





function x1() {
print("##1");
return true;
}

function x2() {
print("##2");
return true;
}


var c = Contract.Base(function() {return x;});
var w = Contract.With({x:x1()}, c);
var x = Contract.With({x:x2()}, w);


Contract.assert(1, x);



quit();
//load("examples/blame.js");


//print(typeof (true));
print('b'>'a');

quit();

// TODO, decompile is set to false!
//
load("examples/blame.js");


(function() {
  
  function add (x, y) {
    return ""; //(x+y);
  }

  var addC = Contract.assert(add, Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber));

  //addC(1,2);
  //addC(1,"2");
  //addC("1",2);

});


(function() {
  
 function add (x, y) {
    return (x+y);
  }

  var addC = Contract.assert(add, 
    Contract.Intersection(
      Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber),
      Contract.AFunction([typeOfString, typeOfString], typeOfString)
    ));

//    addC(1,2);
//    addC("1",2);
//    addC("1","2");



});



//var x = 7;
//print(x===Object(x));


