/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014-2015, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */
(function assert(dplus) {

  function Node(value, next) {
    if(!(this instanceof Node)) return new Node(value, next);

    this.next = next;
    this.value = value;
  }

  var list = Node(1, Node(2, Node(3, Node('4', undefined))));

  var List = Contract.Recursive(Contract.Constructor(function(alpha) {

    var typeOfNumber = Contract.Base(function(arg) {
      return (typeof arg) === 'number';
    }, 'typeOfNumber');

    return Contract.AObject({value:typeOfNumber, next:alpha});
  }, 'List'));

  // in TreatJS 1.3.* this step is not possible, because the contract has to be created before 
  // it asserts, otherwise the constrator woould be an abstraction
  var clist = Contract.assert(list, List);
  //print('§' + clist.value);
  //print('§' + clist.next.value);
  //print('§' + clist.next.next.value);
  //print('§' + clist.next.next.next.value);

  dunit.assertNoBlame(function() {
    clist.value;
  });
  dunit.assertNoBlame(function() {
    clist.next.value;
  });
  dunit.assertNoBlame(function() {
    clist.next.next.value;
  });
  dunit.assertSubjectBlame(function() {
    clist.next.next.next.value;
  });

})();

(function assert(dplus) {

  function Node(value, next) {
    if(!(this instanceof Node)) return new Node(value, next);

    this.next = next;
    this.value = value;
  }

  var list = Node(1, Node(2, Node(3, Node('4', undefined))));

  var List = Contract.Recursive(Contract.Constructor(function(alpha) {

    var typeOfNumber = Contract.Base(function(arg) {
      return (typeof arg) === 'number';
    }, 'typeOfNumber');

    return Contract.AObject({value:typeOfNumber, next:alpha});
  }, 'List'));

  // in TreatJS 1.3.* this step is not possible, because the contract has to be created before 
  // it asserts, otherwise the constrator woould be an abstraction
  var clist = Contract.assert(list, List);
  //print('§' + clist.value);
  //print('§' + clist.next.value);
  //print('§' + clist.next.next.value);
  //print('§' + clist.next.next.next.value);

  dunit.assertContextBlame(function() {
    clist.value = true;
  });
  dunit.assertContextBlame(function() {
    clist.next.value = true;
  });
  dunit.assertContextBlame(function() {
    clist.next.next.value = true;
  });
  dunit.assertContextBlame(function() {
    clist.next.next.next.value = true;
  });

})();
