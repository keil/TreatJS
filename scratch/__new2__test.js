// test *value* contracts

var x = $.assign(4711, IsNumber);
var x = $.assign("4711", IsString);
var x = $.assign(4711, GraterThanZero);
var x = $.assign(true, Any);

// test *functiomn* contracts

var func        = function(x) {return 4711;}
var func2       = function(x) {return "chacha";}
var func3       = function(x, y) { return (x+y);}

var test = $.assign(
                func,
                new $.FunctionContract(Array(IsNumber), IsNumber)
                );

var test2 = $.assign(
                func2,
                new $.FunctionContract(Array(Any), IsString)
                );

var test3 = $.assign(
                func3,
                new $.FunctionContract(Array(IsNumber, IsNumber), IsNumber)
                );

test(4711);
test2("chacha");
test3(4711, 4712);

// test *object* contracts

var obj = {
        x:4711,
        y:function(x) {return (x+1);},
        z:"chacha"
};

var contract = new $.ObjectContract({
        x:IsNumber,
        y:new $.FunctionContract(Array(IsNumber), IsNumber),
        z:Any
});

var test = $.assign(obj, contract);

test["x"];
//test["x"] = 4712;

var f = test["y"];
var v = f(4711);

test["y"] = function(x) {return "chacha";};
var g = test["y"];
//var w = g(4711);




// Contracts nice to have
//
// * x=432 (global check)
// * methos existing (interface)
//
//
//
//


// ich will dem vertrag chacha binden, und zwar das im kontext
var chacha = 4711;
print (chacha);

var h = function() { chacha = 4712; }
var hprime = $.assign(
                h,
                new $.FunctionContract(Array(Any), ChachaIs4711)
                );

//hprime();
print (chacha);
