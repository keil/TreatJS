
function pred(x, y) {
        return (x+y)===(y+y);
}

var t = new TestCase([[1,1], [2,2], ["1", 1]], pred);

Contract.assert(t);

pred(1,2);
pred.apply(this, [1,2]);
pred.call(this, 1, 2);
pred.bind(this).bind(1).bind(2);


var l = new Lemma([Pos, Neg, typeString], fucntion(x, y) {
        return (x+y)===(y+y);
});

Contract.assert(t);




















/** Lemma-Dummy
 */
function Lemma(predicate) {
  this.predicate = predicate;
}

/**
 * Case 1
 */
(function() {

  var lemma1 = new Lemma(function(x, y, xs) {
    return (!((x<xs) && (y<=x)) || (y<xs));
  });

  print(lemma1.predicate(1,2,3));
  print(lemma1.predicate(2,1,3));

  var lemma2 = new Lemma(function(xs, ys) {
       return xs.concat(ys).length === xs.length + ys.length;
  });
  var alpha = ['a', 'b', 'c'],
      numeric = [1, 2, 3];
  print(lemma2.predicate(alpha, numeric));

  var lemma3 = new Lemma(function(xs, ys) {
      return (xs.concat(ys).reverse()).toString() == (ys.reverse().concat(xs.reverse())).toString();
  });
  var alpha = ['a', 'b', 'c'],
      numeric = [1, 2, 3];
  print(lemma3.predicate(alpha, numeric));

})();

/**
 * Case 2
 */
(function() {

  /**
   * associativity of plus (w.r.t number values)
   */

  var predicate1 = function() {
    var x=1, y=2;
     return (x+y)===(y+x);
  }
  var lemma1 = new Lemma(predicate1);

  /**
   * associativity of plus (w.r.t all values)
   */

  var predicate2 = function() {
    var x="1", y=2;
    return (x+y)===(y+x);
  }
  var lemma2 = new Lemma(predicate2);

})();

/**
 * Case 3
 */
(function() {

  /**
   * a = (pop (push s a))
   */
  var lemma1 = new Lemma(function(stack) {
    var a = {};
    stack.push(a);
    return a === stack.pop();
  
  });
  print(lemma1.predicate([]));

  //lemma1.apply();
  //Contract.use(lemma1);

})();

