/**
 * Case 1
 */
(function() {

  function sort(array) {
    /* do somethins */
    //sortC();
  }

  /**
   * define WHEN sort can be called
   * 
   * e.g. can only be called after previous 
   * calles are complete
   *
   * can be state in terms of constructors
   */

  var ctor = Contract.Constructor(function() {
    var pending = false;
    var cal = Contract.Base(function(){
      if (pending) return false;
      else return pending=true;
    });
    var ret = Contract.Base(function(){
      pending=false;
      return true;
    });
    return Contract.Function(cal, ret);
  }); 

  var sortC = Contract.assert(sort, ctor.construct());
  sortC();

  // EVENT - CALL, RETUSN, GET, 
  // BEHAVIOR sequence of EVENTS
  // sort @ (CALL . RETURN)*
  // call1: RETURN . (CALL . RETURN)*

})();


/**
 * Case 1
 */
(function() {

  function sort(cmp, array) {
    /* do somethins */
    //sortC();
  }

  /**
   * specify that cmp can only be called until sort retuns
   *
   * can also be specified by a constructor
   *
   */
 
  // EVENT - CALL, RETUSN, GET, 
  // BEHAVIOR sequence of EVENTS
  //
  // sort @ cmp.Call* . Sort.RETURN

})();


function Generator () {

}


function Pos () {

}
Pos.generate = function () {
  var result = [];

}
