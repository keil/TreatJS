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


(function() {

  /**
   * Node
   */
  function Node (value, left, right) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
  Node.prototype.toString = function () {
    return (this.left + "," + this.value + "," + this.right);
  }  
  Node.prototype.hightOf = function () {
    return (Math.max(this.left.hightOf(),this.right.hightOf())+1);
  }

  /** 
   * Leaf
   */
  function Leaf(value) {
    this.value = value;
  }
  Leaf.prototype.toString = function () {
    return this.value;
  }
  Leaf.prototype.hightOf = function () {
    return 0;
  }



  let root = new Node(2, new Node(1, new Leaf(0), new Leaf(0)), new Node(1, new Leaf(0), new Leaf(0)));
  print(root, root.hightOf());



  function isBalanced(node) {

    if(node instanceof Node) {
      const lhs = node.left.hight;
      const rhs = node.right.hight;
      return isBalanced(node.left) && isBalanced(node.right) && (Math.abs(lhs - rhs) <= 1);
    } else {
      return true;
    }

  }


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
