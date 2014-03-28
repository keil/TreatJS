


// test *value* contracts

var x = $.assign(
                0,
                new $.BaseContract({Math:Math}, AbsLowerThan100)
                );

//var x = $.assign("4711", IsString);
//var x = $.assign(4711, GraterThanZero);
//var x = $.assign(true, Any);
