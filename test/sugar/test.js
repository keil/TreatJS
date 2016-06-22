load("test/sugar/addone.0.js");
load("test/sugar/addone.1.js");
//load("test/sugar/addone.2.js");
//load("test/sugar/addone.3.js");
//load("test/sugar/addone.4.js");



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

  TreatJS.Statistic.reset();
}

// TODO, reset statistic and run in no-ion no-baseline mode


/* ******
 * Test 0 (baseline)
 * ******/
test("Test 0 / Baseline", addOne_0_baseline,   100000);

/* ******
 * Test 1
 * ******/
test("Test 1 / Normal",   addOne_1_normal,   100000);
test("Test 1 / Baseline", addOne_1_baseline, 100000);
test("Test 1 / Subset",   addOne_1_subset,   100000);



/* ******
 * Test 2
 * ******/
//test("Test 2 / Normal",   addOne_1_normal,   100000);
//test("Test 2 / Baseline", addOne_1_baseline, 100000);
//test("Test 2 / Subset",   addOne_1_subset,   100000);

/* ******
 * Test 3
 * ******/
//test("Test 3 / Normal",   addOne_1_normal,   100000);
//test("Test 3 / Baseline", addOne_1_baseline, 100000);
//test("Test 3 / Subset",   addOne_1_subset,   100000);

/* ******
 * Test 4
 * ******/
//test("Test 4 / Normal",   addOne_1_normal,   100000);
//test("Test 4 / Baseline", addOne_1_baseline, 100000);
//test("Test 4 / Subset",   addOne_1_subset,   100000);

