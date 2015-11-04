
function plus (x, y) {
  return x+y;
}

var Plus = Contract.assert(plus, Contract.With(this,  
    Contract.Yield(Contract.Constructor(function(plus) {
        return Contract.Where(
          Contract.Name(plus, Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber)),
          Contract.Temporal([plus], function(plus) {
            return Star(Dot(Call(plus), Return(plus)));
          })
        )
      }  
    )
  )
));


Plus(1, 1);
Plus(1, 1);
//Plus.toString(); // blame the context

var obj = {a:1, b:2, c:3};

var Obj = Contract.assert(obj, Contract.With(this,  
    Contract.Yield(Contract.Constructor(function(obj) {
        return Contract.Where(
          Contract.Name(obj, typeOfObject),
          Contract.Temporal([obj], function(obj) {
            return [Star(Get(obj, "a")), Get(obj, "b"), Get(obj, "c")];
          })
        )
      }  
    )
  )
));

Obj.a;
Obj.a;
Obj.a;
Obj.a;
Obj.a;
Obj.b;
Obj.c;
//Obj.a; // blame the context














quit();


var Plus = Contract.assert(plus, Contract.With(this, 
      Contract.Where(
        Contract.Constructor(function(plus) {
          return Contract.Name(plus, Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber));
        }),
        Contract.Temporal(function(plus) {
          return Star(Dot(Call(plus), Return(plus)));
        })
        )  
      )
    );










var Sort = Contract.assert(sort, Contract.With(this, 
      Contract.Yield(Contract.Constructor(function(sort) {
        return Contract.Name(sort,Contract.AFunction([instanceOfFunction,
            Contract.Where(
              Contract.Constructor(function(array) {
                return Name(array, instanceOfArray);
              }),
              Contract.Temporal(function(array) {
                return Dot(Star(Get(array, /\d/)), Return(sort));
              })
            )], instanceOfArray));
        })
      )
    )
  );







var Sort = Contract.assert(sort, Contract.With(this, 
      Contract.Where(
        Contract.Constructor(function(sort, cmp, array) {
          return Contract.Name(sort, Contract.AFunction([Contract.Name(cmp, instanceOfFunction), Contract.Name(array, instanceOfArray)], instanceOfArray))
        }),
        Contract.Temporal(function(sort, cmp, array) {
          return Dot(Star(Get(array, /\d/)), Return(sort));
        })
      )
    )
  );




var Sort = Contract.assert(sort, Contract.With(this, 
      Contract.Yield(
        Contract.Constructor(function(sort, cmp, array) {
          
          return
          Contract.Name(sort, Contract.AFunction([
              Contract.Name(cmp, instanceOfFunction), 
              Contract.Where(
                Contract.Name(array, instanceOfArray), 
                Contract.Temporal(function(sort, array) {
                  return Dot(Star(Get(array, /\d/)), Return(sort));
                })
              )], instanceOfArray))
        })
      )
    )
  );













quit();

/*

function cmp (x, y) {
  // -1 (y < x); 
  //  0 (x = y);
  //  1 (x < y);
  return (x<y) ? 1 : (y<x) ? -1 : (x==y) ? 0 : undefined;
}

function sort (cmp, array) {
  if(array.length===0) return array;
  else if(array.length===1) return array;

  var pivot = array[0];

  var left = [];
  var right = [];
  var current = [];

  for(var i=0; i<array.length; i++) {
    if(cmp(array[i], pivot)==1) left.push(array[i]);
    else if(cmp(array[i], pivot)==0) current.push(array[i]);
    else right.push(array[i]);
  }

  return (sort(cmp, left).concat(current.concat(sort(cmp, right))));
}

var Cmp = Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber);

var Length = Contract.Dependent(Contract.Constructor(function(cmp, array) {
  return Contract.Base(function(arg) {
    return arg.length === array.length;
  });
}, "Length"));

var Sort = Contract.AFunction([Cmp, instanceOfArray], instanceOfArray);




var TSort = Contract.Temporal(function(sortid) {
      return Star(Dot(Call(sortid), Return(sortid)));
});

var TCmp = Contract.Temporal(function(sortid, cmpid) {
      return Dot(Star(Dot(Call(cmpid), Return(cmpid))), Return(sortid));
});

var TArray = Contract.Temporal(function(sortid, arrayid) {
      return Dot(Star(Get(array, /\d/)), Return(sortid));
});

*/
