/**
 * function cmp
 */
function cmp (x, y) {
  // -1 (y < x); 
  //  0 (x = y);
  //  1 (x < y);
  return (x<y) ? 1 : (y<x) ? -1 : (x==y) ? 0 : undefined;
}

/**
 * function sort 
 */
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

/**
 *  Behaviour Contract for cmp and sort
 */

var _cmp_ = Contract.AFunction([typeOfNumber, typeOfNumber], typeOfNumber);

var _length_ = Contract.SDependent(function(sort, array) {
  return Contract.Base(function(arg) {
    return arg.length === array.length;
  });
});

var _sort_ = Contract.AFunction([_cmp_, instanceOfArray], instanceOfArray);

//

//var sort2 = Contract.assert(sort, Contract.And(_sort_, _length_));
//var sort2 = Contract.assert(sort, Contract.And(_sort_, _length_));

//print([4,5,6,8,231,4,6,3,2,2,1,2,2,3].length);
//print(sort2(cmp, [4,5,6,8,231,4,6,3,2,2,1,2,2,3]).length);

/**
 *  Temporal Contract for cmp and sort
 */



// cmp has to finish before it can be called again
// => Star( Dot( Call(cmp), Return(Cmp) ))

// array is not allowed to be touched after sort return
// (sort is not allowed to store array somewhere)
// Dot( Star(Any(array)), Return(sort));
//
// read only access on array
// => Get(array, /^\d*$/)


/**
 *  Combination of Contracts
 */
/*
Contract.Temporal(function(sortid, cmpid, arrayid) {

  return Name(sortid, // only for associating sort, wraps sort in an effect proxy 
      Contract.AFunction([
       
        Where( Name(cmpid, _cmp_), Contract.Temporal([cmpid, sortid], function(cmpid, sortid) {
            return Star(Dot(Call(cmpid), Return(cmpid))) 
          }
          


          Where(_cmp_, Contract.Temporal([cmpid, sortid], function(cmpid, sortid) {
            return Star(Dot(Call(cmpid), Return(cmpid))) 
          }))



          
          ), 
        Where( Name(arrayid, instanceOfArray), [Star(Get(array, /^\d*$/)), Return(sort)] )
        ], instanceOfArray));

  Final(cmpid)
});
*/

// wessen effecte bekomm ich alles ab
// TODO, final -- per contract
// Exception
// 

/*
Contract.Name(sortid, Contract.AFunction([
      
      Contract.Where(
        Contract.Name(cmpid, _cmp_), 
        Contract.Temporal(function() {
          return Star(Dot(Call(cmp), Return(Cmp)));
        })
      ),
      
      Contract.Name(arrayid, instanceOfArray)
      
      ], instanceOfArray));
*/

/*
Contract.Where(function(sortid) {

  return Name(sortid, _sort_)

}, Contract.Temporal(function(sortid) {

  return Star(Dot(Call(sortid), Return(sortid)));
  // return Star([Call(sortid), Return(sortid)]);

}));
*/


/*
Contract.Where(function(sort_id) {

  return Contract.Name(sort_id, Contract.AFunction([
      Contract.Where(function(cmp_id) {
        return Contract.Name(cmp_id, _cmp_);
      }), 
      
      
      
      _cmp_, instanceOfArray], instanceOfArray));

}, Contract.Temporal(function(sort_id) {

  return 

}));
*/




/*
Contract.Where(function(sort_id, cmp_id, array_id) {

  return Contract.Name(sort_id, Contract.AFunction([
      Contract.Name(cmp_id, _cmp_)
      Contract.Name(array_id, instanceOfArray)
      ], instanceOfArray));
}
}));
*/







/*
Contract.Forall(function(sortid, cmpid, arrayid) {

  return Name(sortid, // only for associating sort, wraps sort in an effect proxy 
      Contract.AFunction([
       
        Where( Name(cmpid, _cmp_), Contract.Temporal([cmpid, sortid], function(cmpid, sortid) {
            return Star(Dot(Call(cmpid), Return(cmpid))) 
          }
       
        Where(_cmp_, Contract.Temporal([cmpid, sortid], function(cmpid, sortid) {
            return Star(Dot(Call(cmpid), Return(cmpid))) 
          }))

          ), 
        Where( Name(arrayid, instanceOfArray), [Star(Get(array, /^\d*$/)), Return(sort)] )
        ], instanceOfArray));

  Final(cmpid)
});
*/




/*

Contract.With(function(sort_id, cmp_id, array_id) {

  return Name(sortid, Contract.AFunction([
      Contract.Where( Name(cmp_id, _cmp_), Contract.Temporal([cmp_id, sort_id], function(cmp_id, sort_id) {
            return Star(Dot(Call(cmpid), Return(cmpid))); 
          })),
        Contract.Where( Name(arrayid, instanceOfArray), Contract.Temporal([array_id, sort_id], function(cmpid, sortid) {
          return [Star(Get(array, /^\d*$/)), Return(sortid)]
        }))], instanceOfArray));

}, "With/Temporal");



Contract.Where(
    Contract.Constructor(function() {
      return Name(sort, Contract.AFunction([Contract.Where(
              Contract.Constructor(function() {
                retrun Name(cmp)
            
            
            , instanceOfArray], instanceOfArray))
    }),
    Contract.Temporal(function() {
      return Star(Dot(Call(sort), Return(Sort)));
    }));

    */

// TODO, is the system allowed to touch yield's variables ?
// proxies and effect shortcuts in Temporal

var test = Contract.With({sortC:_sort_, print:print}, Contract.Yield(Contract.Constructor(function(sort_id, cmp_id, array_id) {

//var test = Contract.With({sortC:_sort_}, Contract.Yield(function(sort_id, cmp_id, array_id) {

  return Contract.Where(
    Contract.Name(sort_id, sortC),

    Contract.Temporal([sort_id], function(sid) {
      print("%%" + sid);  print(Star.x=1411); print(sid.s=123);

      // sort.x, sort.y .. 

      //return [sort.x, sort.y]
      //return Or(sort.x, sort.y, sort.a);

      return [Get(sid, "x"), Get(sid, "a"), Get(sid, "b"), Set(sid, "x")];
      //return Dot(Get(sort, "x"), Get(sort, "a"), Get(sort, "b"), Set(sort, "x"))

      //return Star(Dot(Call(sort), Return(sort)));
      //return Star(Or(Get(sort, /a|b/), Dot(Call(sort), Return(sort))));
    }));

}, "With/Temporal", {})));

//print("Contract", test);
var Sort = Contract.assert(sort, test);
//print("Subject", Sort);


Sort.x;
Sort.a;
Sort.b;
Sort.x=4711;

//Sort(cmp, [1,2.3]);
//Sort(cmp, [1,2.3]);
//new Sort(cmp, [1,2.3]);




/*
 
var test = Contract.Yield(function(sort_id, cmp_id, array_id) {
  print(sort_id);print(cmp_id);print(array_id)

  return Contract.Where(
    Contract.Name(sort_id, sortC),

    Contract.Temporal([sort_id], function(sort_id) {
      print("%%" + sort_id);  print(sort_id.s=123);

      return Star(Dot(Call(sort_id), Return(sort_id)));
    }));

}, "With/Temporal", {sortC:_sort_,  print:print});

print(test);

var Sort = Contract.assert(sort, test);
//Sort.x;
//Sort.x=4711;
Sort(cmp, [1,2.3]);
new Sort(cmp, [1,2.3]);

*/
