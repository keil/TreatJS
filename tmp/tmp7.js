
/*
function f() {
        return "L";
}

function g() {
        return "L";
}


function checkThis(arg) {
        print(this);
        return (this==arg);
}



//var f = make();
print(checkThis.call(f, this));
*/


/*
//Function.prototype.sandbox = true;


function SandboxFunction() {}
SandboxFunction.prototype = new Function();
//SandboxFunction.prototype.constructor = Function;
//SandboxFunction.prototype.sandbox = true;


function f() {}

//tmp = Function;
//Function = SandboxFunction;

//Function.prototype.sandbox = true;
var g = $.bind(f);
g.sandbox = true;
//Function.prototype.sandbox = false;

print("@@ " + f.sandbox);
print("@@ " + g.sandbox);

print("@@ " + (g instanceof Function));

*/

