// e.g.
// - a < b 
// - for i,j in array, with i<j . array[i]<array[j] 

function Node(value, left, right) {
  this.value = value;
  this.left = left;
  this.right = right;
}
Node.prototype = {};
Node.prototype.toString = function() {
  return (this.left ? this.left.toString() + "," : "") + this.value + (this.right ? "," + this.right.toString() : "")
}

function heightOf(node) {
  return node ? Math.max(heightOf(node.left), heightOf(node.right)) +1 : -1;
}

function isBalanced(node) {
  return node ? isBalanced(node.left) && isBalanced(node.right) && Math.abs(heightOf(node.left)-heightOf(node.right))<=1 : true;
}

//////////////////////////////////////////////////

var root = new Node(0, new Node(1, new Node(2), new Node(3)), new Node(4));
//root.right.right = new Node('a', new Node('b', new Node('c'), new Node('d')), new Node('e'));

print('tree', root);
print('heightOf', heightOf(root));
print('isBalanced', isBalanced(root));


var __isBalanced__ = Contract.With({heightOf:heightOf, isBalanced:isBalanced, Math:Math}, Contract.Base(function(node) {
  return isBalanced(node.left) && isBalanced(node.right) && Math.abs(heightOf(node.left)-heightOf(node.right))<=1;
}, "balanced"));

print("__isBalanced__", __isBalanced__);

//////////////////////////////////////////////////

//var Root = Contract.assert(root, __isBalanced__);
//Root.right.right = new Node('a', new Node('b', new Node('c'), new Node('d')), new Node('e'));

// Not recursive
// which contracts shoudl be allowed as an invariant

var Root = Contract.assert(root, Contract.Invariant(__isBalanced__));
//Root.right.right = new Node('a', new Node('b', new Node('c'), new Node('d')), new Node('e'));
//Root.right = Root.right;
//.right = new Node('a', new Node('b', new Node('c'), new Node('d')), new Node('e'));

// XXX, Invariant only effects the object itself, not its properties
// - recursive invariant, that may also effect its properties (membrane)
// - a way to implement a constructor contracts that asserts the invariant to all nodes


// play around with invariants in trestjs

//////////////////////////////////////////////////
// 1 - Wrap the Constructor

/// TODO, who is to blame ?

var __Node__ = Contract.ConstructorX(Contract.Invariant(__isBalanced__));
print("__Node__", __Node__);

var BalancedNode = Contract.assert(Node, __Node__);

var root  = new BalancedNode(0, new BalancedNode(1, new BalancedNode(2), new BalancedNode(3)), new BalancedNode(4));

//var root2 = new BalancedNode(0, new BalancedNode(1, new BalancedNode(2), new BalancedNode(3)), new BalancedNode(4, new BalancedNode('a', new BalancedNode('b', new BalancedNode('c'), new BalancedNode('d')), new BalancedNode('e'))));

var subtree = new BalancedNode('a', new BalancedNode('b', new BalancedNode('c'), new BalancedNode('d')), new BalancedNode('e'));
//root.right.right = subtree;
