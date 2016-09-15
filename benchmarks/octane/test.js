var plus = _wrap_(function (x, y) {
  return (x+y);
});

var addOne = _wrap_(function (z) {
  return plus(z, 1);
});

plus("1","1");
addOne(1);

