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
TreatJS.Print.printContract();

//quit();

// ==================================================

(function() {

  /**
   * Node
   */
  
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

  /** 
   * Leaf
   */

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
  
  print(root1, root1.hight);
  print(root2, root2.hight);


  /** 
   * isBalanced
   */

  function isBalanced(node) {

    if(node instanceof Node) {
      const lhs = node.left.hight;
      const rhs = node.right.hight;
      print(lhs, rhs,  (Math.abs(lhs - rhs) <= 1));
      return isBalanced(node.left) && isBalanced(node.right) && (Math.abs(lhs - rhs) <= 1);
    } else {
      return true;
    }

  }

  print(isBalanced(root1));
  print(isBalanced(root2));



/*  let isBalancedB = (Contract.Constructor(function(Node, Math) {
    return Contract.Base(function isBalanced(node) {
      if(node instanceof Node) {
        const lhs = node.left.hight;
        const rhs = node.right.hight;
        //print(lhs, rhs,  (Math.abs(lhs - rhs) <= 1));
        return isBalanced(node.left) && isBalanced(node.right) && (Math.abs(lhs - rhs) <= 1);
      } else {
        return true;
      }
    } ,"isBalanced");
  }, "IsBalanced"))(Node, Math);
*/
//  let isBalancedC = Contract.Invariant(isBalancedB, "isBalanced");
//  print(isBalancedC);

//  let root1_Inv = Contract.assert(root1, isBalancedC);
  //root1_Inv.right = root2;
  //let root2_Inv = Contract.assert(root2, isBalancedC);



// TODO
// is it possible to have other values 
// nesting of constructores


/*
  let Balanced = (Contract.Constructor(function(Balanced) {

    return Contract.Object({
      left: Balanced,
      right: Balanced

    });

  }, "Balanced"));


  let BalancedR = Contract.Recursive(Balanced);
  print(BalancedR);
  let root1_r = Contract.assert(root1, BalancedR);
  root1_r.left;
  root1_r.right = root2;
*/

//  let root2_r = Contract.assert(root1, BalancedR);
//  root2_r.left;
//  root2_r.right;


  let Balanced = (Contract.Constructor(function(Node, Math) {
    return Contract.Base(function isBalanced(node) {
      if(node instanceof Node) {
        const lhs = node.left.hight;
        const rhs = node.right.hight;
        //return isBalanced(node.left) && isBalanced(node.right) && (Math.abs(lhs - rhs) <= 1);

        return /*isBalanced(node.left) && isBalanced(node.right) &&*/ (Math.abs(lhs - rhs) <= 1);
      } else {
        return true;
      }
    } ,"Balanced");
  }, "Balanced"))(Node, Math);

  let BalancedNode = Contract.Invariant(Balanced, "BalancedNode");

  let BalancedTree = (Contract.Constructor(function(BalancedNode, typeNumber) {
    return Contract.Recursive(Contract.Constructor(function(self) {
      return Contract.Intersection.from(BalancedNode, Contract.Object({
        value: typeNumber,
        left:  self,
        right: self
      }));
    }));
  }, "BalancedTree"))(BalancedNode, typeNumber);


  // Problem, recusiv contract compiles internally to a full constructor, which removes the bindings to the contarcts
  
  print("@@@", BalancedNode, BalancedTree);

  let x = Contract.assert(root1, BalancedTree);

//  x.left = new Node(0, new Leaf(1), new Leaf(1));
//

  print(Contract.subjectOf(x, BalancedTree));




//  let BalancedR = Contract.Recursive(Balanced);
//  print(BalancedR);
//  let root1_r = Contract.assert(root1, BalancedR);
//  root1_r.left;
// root1_r.right = root2;








})()

//The left and right subtrees' heights differ by at most one, AND
//The left subtree is balanced, AND
//The right subtree is balanced


quit();

let id = Contract.assert(function id(x) {
  return x;
}, Contract.Intersection.from(
  Contract.Function([Contract.Function([Positive], Positive)], Contract.Base(f => f(1))),
  Contract.Function([Contract.Function([Even], Even)], Contract.Base(f => f(-2)))
  )
);

print(id(x => x)(2));
//print(id(x => x)(-2));







/*
(function() {
  let t = {x:4711, y:4712, valueOf:()=>4711};
  let p = new Proxy(t, {
    get: (target, name, receiver) => {print("@", name.toString()); return Reflect.get(target, name, receiver)}
  });

  print(p.x, p.y, p.z);
  print("--");
  print(p+1);
  print("--");
  print(typeof p);

  var obj2 = {
    [Symbol.toPrimitive](hint) {
      return 4711;  
    }
  };

  print("#", obj2+1, 1+obj2, typeof obj2);

});
*/








//let XXX = (Contract.Constructor(Math => Contract.Base(subject => (Math.abs(subject) == 1))))(Math);
//print(XXX);
//Contract.assert(2, XXX);





print("************************************");

print("************************************");

// ==================================================

TreatJS.Print.printStatistic();

// ==================================================

quit();
