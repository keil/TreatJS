
var obj = {a:4711, b:"4712", c:"true"}

var test = _.assert(
                obj,
                _.AdvancedObjectContract({a:IsNumber, b:IsString, c:IsBoolean}));

test.a;
test.b;
//test.c;



var p = {a:4711, b:"4712", c:"true"}

function f() {
}
f.prototype = p;

var obj = new f();

var test = _.assert(
                obj,
                _.AdvancedObjectContract({a:IsNumber, b:IsString, c:IsBoolean}, false, false));

test.a;
test.b;
//test.c;

test.c = "4711";

p.a = "543";
//test.a;







