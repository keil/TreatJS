/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014-2017, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */

//  ___         _               _      
// / __|___ _ _| |_ __ _ _ _ __| |_ ___
//| (__/ _ \ ' \  _/ _` | '_/ _|  _(_-<
// \___\___/_||_\__\__,_|_| \__|\__/__/

Contracts.build(this);

// ___     _     _   
//| _ \_ _(_)_ _| |_ 
//|  _/ '_| | ' \  _|
//|_| |_| |_|_||_\__|

TreatJS.Print.printVersion();
TreatJS.Print.printConfiguration();
//TreatJS.Print.printStatistic();
//TreatJS.Print.printPackage();
//TreatJS.Print.printContract();

// ==================================================

(function () {

  let plus = Contract.assert((x,y) => x+y, Contract.Function([typeNumber, typeNumber], typeNumber));
  print(plus(1,2));


})();

TreatJS.Print.printStatistic();

quit();


(function() {

  function Node (value, left, right) {
    this.value = value;
    this.left = left;
    this.right = right;
  }

  Node.prototype = {

    get hight() {
      return (Math.max(this.left.hight,this.right.hight)+1);
    },

    toString() {
      return (this.left + "," + this.value + "," + this.right); 
    }

  }

  function Leaf(value) {
    this.value = value;
  }

  Leaf.prototype = {

    get hight() {
      return 0;
    },

    toString() {
      return this.value;
    }

  }

  let root1 = new Node(2, new Node(1, new Leaf(0), new Leaf(0)), new Node(1, new Leaf(0), new Leaf(0)));
  let root2 = new Node(3, new Node(2, new Node(1, new Leaf(0), new Leaf(0)), new Leaf(0)), new Leaf(0));
 
  let isBalanced = (Contract.Constructor(function(Node, Math) {
    return Contract.Base(function isBalanced(node) {
      if(node instanceof Node) {
        const {value, left, right} = node;
        const lhs = left.hight;
        const rhs = right.hight;
        return isBalanced(left) && isBalanced(right) && (Math.abs(lhs - rhs) <= 1);
      } else {
        return true;
      }
    } ,"isBalanced");
  }, "isBalanced"))(Node, Math);

 let BalancedNode = Contract.Invariant(isBalanced, "BalancedNode");
 let balanced_node = Contract.assert(root1, BalancedNode);

 //balanced_node.left = new Node(3, new Node(2, new Node(1, new Leaf(0), new Leaf(0)), new Leaf(0)), new Leaf(0));
 //let balanced_root2 = Contract.assert(root2, Contract.Intersection(isBalanced, BalancedNode));

 let BalancedTree = (Contract.Constructor(function(BalancedNode, typeNumber) {
   return Contract.Recursive(Contract.Constructor(function(self) {
     return Contract.And(BalancedNode, Contract.Object({
       value: typeNumber,
       left:  self,
       right: self
     }));
   }));
 }, "BalancedTree"))(BalancedNode, typeNumber);

 let balanced_tree = Contract.assert(root1, BalancedTree);
 //balanced_tree.right.left = new Node(3, new Node(2, new Node(1, new Leaf(0), new Leaf(0)), new Leaf(0)), new Leaf(0));


//balanced_tree.left.right = root2;

})();

// ==================================================

TreatJS.Print.printStatistic();

// ==================================================

quit();
