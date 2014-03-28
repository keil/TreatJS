

/*
print(eval);

function g() {
        return 4711;
}

//print(g);
//print(g.toString);

g.toString = function() {return eval.toString();};
g.prototype.toString = function() {return eval.toString();};


print(g);
print(g.toString);

//delete g.toString;
print("@@@ " + $.isNativeFunction(eval));
print("@@@ " + $.isNativeFunction(g));

print(g);
print(g.toString);
*/

/*
print(Function.prototype.toString);

//Function.prototype.toString = function() { return "xxx [native code] xxx"; };

print(Function.prototype.toString);

function g() {
        return 4711;
}
print(g);
print(g.toString);
//delete g.toString;


print("@@@ " + $.isNativeFunction(eval));
print("@@@ " + $.isNativeFunction(g));

//delete Function.prototype.toString;

print("@@@ " + $.isNativeFunction(eval));
print("@@@ " + $.isNativeFunction(g));

g = function() {};


//delete Function.prototype.toString;

//print(Function.prototype.toString);
*/

/**
function Test(arg, arg2) {
        print("@" + arg + arg2);
        this.x=arg;
}

var x = Test("L", "<3");
print(x instanceof Test);

var y = new Test("L", "<3");
print(y instanceof Test);

var fun = (eval("("+Test.toString()+")"));
print(fun);

var x = fun("L", "<3");
print(x instanceof Test);

//var y = new fun.apply({}, new Array());
//

var args = new Array();
args[0] = "L";
args[1] = "<3";






// TODO make sandbox new test

//var y = fun.construct(this, args);
//print(y instanceof fun);

//fun.arguments=args;
var newObj = Object.create(fun.prototype);
var y = fun.apply(newObj, args);

//newObj.prototype = fun.prototype;

print(y instanceof fun);
print(newObj instanceof fun);

var fun = (eval("("+Test.toString()+")"));

print(y instanceof fun);
print(newObj instanceof fun);


function XXX() {
        this.x=4712;
return 5643;// {x:4713};
}
print((new XXX()).x);

/*

//print(y.x);


/*
var y = new fun.apply();
print(y instanceof fun);
print(y.x);
*/

