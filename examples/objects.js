// 1

(function() {

  var object = {x:true, y:true};
  var contract = Contract.AObject({x:typeOfNumber});

  var $object = Contract.assert(object, contract);

  //$object.x; // Contract Violation: Subject (Callee)
  $object.y; // ok

})();

// 2

(function() {

  var object = {x:true, y:true};
  var contract = Contract.AObject({x:typeOfNumber, y:typeOfBoolean});

  var $object = Contract.assert(object, contract);

  //$object.x; // Contract Violation: Subject (Callee)
  $object.y; // ok

  //$object.y = true; // Contract Violation: Context (Global Context)
  $object.x = 4711; // ok

  //$object.y = 4711; // Contract Violation: Context (Global Context)
  $object.y = true; // ok

})();

// 3

(function() {

  var object = {x:true, y:true};
  var contract = Contract.Intersection(
    Contract.AObject({x:typeOfNumber}),
    Contract.AObject({y:typeOfBoolean})
    );

  var $object = Contract.assert(object, contract);

  //$object.x; // Contract Violation: Subject (Callee)
  $object.y; // ok

  $object.x = true; // ok
  $object.x = 4711; // ok

  //$object.y = 4711; // ok
  //XXX the context of the left side is false in this situation
  //XXX Object contracts are not delayed
  //XXX is this correct
  $object.y = true; // ok

})();

// 4

(function() {

  var object = {x:function(x) {return x;}, y:function(x) {return x;}};
  var contract = Contract.AObject({
    x:Contract.AFunction([typeOfNumber], typeOfNumber),
      y:Contract.AFunction([typeOfBoolean], typeOfBoolean)
  });

  var $object = Contract.assert(object, contract);

  // $object.x(true); // Contract Violation: Context (Global Context)
  $object.x(4711); // ok

  //$object.y(4711); // Contract Violation: Context (Global Context)
  $object.y(true); // ok

})();

// 5

(function() {

  var object = {x:function(x) {return x;}, y:function(x) {return x;}};
  var contract = Contract.Intersection(
    Contract.AObject({x:Contract.AFunction([typeOfNumber], typeOfNumber)}),
    Contract.AObject({y:Contract.AFunction([typeOfBoolean], typeOfBoolean)})
    );

  var $object = Contract.assert(object, contract);

  $object.x(true); // Contract Violation: Context (Global Context)
  $object.x(4711); // ok

  //$object.y(4711); // Contract Violation: Context (Global Context)
  $object.y(true); // ok

  // XXX same reason as before

})();




// A

(function() {

  var object = {x:true, y:4711};
  var contract = Contract.Intersection(
    Contract.AObject({x:typeOfNumber}),
    Contract.AObject({y:typeOfBoolean})
    );

  var $object = Contract.assert(object, contract);

  //$object.x; // Contract Violation: Subject (Callee) 
 // $object.y; // Contract Violation: Subject (Callee)

 
})();

// B

(function() {

  var object = {x:true, y:4711};
  var contract = Contract.Intersection(
    Contract.AObject({x:typeOfNumber}),
    Contract.AObject({y:typeOfBoolean})
    );

  var $object = Contract.assert(object, contract);

  $object.x; // Contract Violation: Subject (Callee)
  //$object.y; // ok
 
})();

