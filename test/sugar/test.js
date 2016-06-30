load("test/sugar/addone.0.js");
load("test/sugar/addone.1.js");
load("test/sugar/addone.2.js");
load("test/sugar/addone.3.js");
load("test/sugar/addone.4.js");

load("test/sugar/addone.5.js");
load("test/sugar/addone.6.js");


/*
 * The Test Procedure
 * ========+=========
 */

function test(name, addOne, n) {

  print("\n*** ", name);

  var start = Date.now();

  var i = 0;
  while (i < n) {
    i = addOne(i);
  }

  var end = Date.now();

  print("Time (ms):", (end-start));
  print("Predicates:", TreatJS.Statistic.get(TreatJS.Statistic.BASE));

  TreatJS.Statistic.print();
  TreatJS.Statistic.reset();
}

/* ******
 * Test 0 (baseline)
 * ******/
(function() {
  test("Test 0 / Baseline", addOne_0_baseline,   100000);
})();

/* ******
 * Test 1
 * ******/
(function() {
  test("Test 1 / Normal",   addOne_1_normal,   100000);
  test("Test 1 / Baseline", addOne_1_baseline, 100000);
  test("Test 1 / Subset",   addOne_1_subset,   100000);
})();

/* ******
 * Test 2
 * ******/
(function() {
  test("Test 2 / Normal",   addOne_2_normal,   100000);
  test("Test 2 / Baseline", addOne_2_baseline, 100000);
  test("Test 2 / Subset",   addOne_2_subset,   100000);
})();

/* ******
 * Test 3
 * ******/
(function() {
  test("Test 3 / Normal",   addOne_3_normal,   100000);
  test("Test 3 / Baseline", addOne_3_baseline, 100000);
  test("Test 3 / Subset",   addOne_3_subset,   100000);
})();

/* ******
 * Test 4
 * ******/
(function() {
  test("Test 4 / Normal",   addOne_4_normal,   100000);
  test("Test 4 / Baseline", addOne_4_baseline, 100000);
  test("Test 4 / Subset",   addOne_4_subset,   100000);
})();

/* ******
 * Test 5
 * ******/
(function() {
  test("Test 5 / Normal",   addOne_5_normal,   100000);
  test("Test 5 / Baseline", addOne_5_baseline, 100000);
  test("Test 5 / Subset",   addOne_5_subset,   100000);
})();

/* ******
 * Test 6
 * ******/
(function() {
  test("Test 6 / Normal",   addOne_6_normal,   100000);
  test("Test 6 / Baseline", addOne_6_baseline, 100000);
  test("Test 6 / Subset",   addOne_6_subset,   100000);
})();
