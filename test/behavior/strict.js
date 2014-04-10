
var obj = {a:4711, b:"4712", c:true}

var test = _.assert(
                obj,
                _.AdvancedObjectContract({a:IsNumber, b:IsString, c:IsBoolean}, true));

test.a;
test.b;
//test.c;



var p = {a:4711, b:"4712", c:true}

function f() {
}
f.prototype = p;

var obj = new f();

var test = _.assert(
                obj,
                _.AdvancedObjectContract({a:IsNumber, b:IsString, c:IsBoolean}, true, false));

test.a;
test.b;
//test.c;

//test.c = "4711";

//p.a = "543";
test.a;

/* #3 */

var func = function(x,y) {
        y;
        return true;
};

var test = _.assert(
                func,
                _.SimpleFunctionContract(IsNumber, IsNumber, IsBoolean, true, false));

//test(2);
test(2,2);
//test(2,"2");
